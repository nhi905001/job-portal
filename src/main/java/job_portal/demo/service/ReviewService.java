package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.ReviewRequest;
import job_portal.demo.dto.ReviewResponse;
import job_portal.demo.entity.Review;
import job_portal.demo.entity.User;
import job_portal.demo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final CompanyService companyService; // Dùng lại để đổi companyId thành object (404 nếu không có)

	// companyId = null thì lấy review của tất cả công ty
	public Page<ReviewResponse> search(Long companyId, Pageable pageable) {
		Page<Review> page = companyId == null ? reviewRepository.findAll(pageable)
				: reviewRepository.findByCompanyId(companyId, pageable);

		// MỚI: page.map(...) đổi TỪNG phần tử của trang từ Review sang ReviewResponse,
		// nhưng vẫn giữ nguyên thông tin phân trang (tổng số trang, tổng số dòng...).
		// this::toResponse là cách viết tắt của r -> toResponse(r)
		return page.map(this::toResponse);
	}

	public ReviewResponse create(ReviewRequest request, User user) {
		// Mỗi người chỉ review một công ty một lần (chống spam)
		if (reviewRepository.existsByCompanyIdAndUserId(request.companyId(), user.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this company");
		}

		Review review = new Review();
		review.setCompany(companyService.getById(request.companyId()));
		review.setUser(user); // Người viết = người đang đăng nhập (lấy từ token)
		review.setRating(request.rating());
		review.setComment(request.comment());
		return toResponse(reviewRepository.save(review));
	}

	// Admin kiểm duyệt: xóa review không phù hợp
	public void delete(Long id) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
		reviewRepository.delete(review);
	}

	// Đổi entity thành dữ liệu an toàn để trả ra ngoài
	private ReviewResponse toResponse(Review review) {
		return new ReviewResponse(review.getId(), review.getCompany().getId(), review.getUser().getFullName(), // Chỉ
																												// lấy
																												// tên,
																												// không
																												// lấy
																												// email
				review.getRating(), review.getComment(), review.getCreatedAt());
	}
}
