package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.ShortlistRequest;
import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.JobApplication;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.Shortlist;
import job_portal.demo.entity.User;
import job_portal.demo.repository.ShortlistRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShortlistService {

	private final ShortlistRepository shortlistRepository;
	private final JobApplicationService applicationService; // Dùng lại để tìm đơn và đổi trạng thái

	// @Transactional: hàm này ghi 2 chỗ (lưu Shortlist + đổi trạng thái đơn).
	// Nếu một trong hai lỗi thì cả hai cùng bị hoàn tác, không để dữ liệu nửa vời.
	@Transactional
	public Shortlist create(ShortlistRequest request, User user) {
		if (user.getRole() != Role.RECRUITER) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only recruiters can shortlist applications");
		}

		JobApplication application = applicationService.getById(request.applicationId());

		// Phải là recruiter đăng tin đó
		checkOwner(application, user);

		// Chỉ đơn mới nộp (APPLIED) mới shortlist được. Đơn đã shortlist rồi, bị từ
		// chối,
		// hay đã đi xa hơn trong quy trình thì báo 409.
		if (application.getStatus() != ApplicationStatus.APPLIED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Only applications in APPLIED status can be shortlisted");
		}

		Shortlist shortlist = new Shortlist();
		shortlist.setRecruiter(user);
		shortlist.setJobApplication(application);
		shortlist.setNote(request.note());
		Shortlist saved = shortlistRepository.save(shortlist);

		// Đồng bộ trạng thái đơn
		applicationService.changeStatus(application, ApplicationStatus.SHORTLISTED);
		return saved;
	}

	// Danh sách shortlist: admin thấy hết để giám sát, recruiter chỉ thấy của mình
	public Page<Shortlist> getAll(User user, Pageable pageable) {
		if (user.getRole() == Role.ADMIN) {
			return shortlistRepository.findAll(pageable); // findAll(pageable) có sẵn trong JpaRepository
		}
		return shortlistRepository.findByRecruiterId(user.getId(), pageable);
	}

	// Gỡ khỏi danh sách rút gọn
	@Transactional
	public void delete(Long id, User user) {
		Shortlist shortlist = shortlistRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shortlist not found"));
		JobApplication application = shortlist.getJobApplication();

		checkOwner(application, user);

		// Nếu đơn đã đi xa hơn (ví dụ đã đặt lịch phỏng vấn) thì không gỡ nữa, tránh dữ
		// liệu mâu thuẫn
		if (application.getStatus() != ApplicationStatus.SHORTLISTED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Application has already moved forward, cannot remove");
		}

		shortlistRepository.delete(shortlist);
		applicationService.changeStatus(application, ApplicationStatus.APPLIED); // Trả đơn về trạng thái ban đầu
	}

	// Kiểm tra quyền: chỉ recruiter đăng tin mà đơn này nộp vào (Admin không có quyền thao tác nghiệp vụ này)
	private void checkOwner(JobApplication application, User user) {
		boolean isOwner = user.getRole() == Role.RECRUITER
				&& application.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN,
					"You can only manage applications of your own jobs");
		}
	}
}
