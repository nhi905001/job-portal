package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {

	// Đơn này đã có offer chưa?
	boolean existsByJobApplicationId(Long jobApplicationId);

	// Các offer của một ứng viên. Spring đọc tên hàm và ĐI QUA CÁC QUAN HỆ liên
	// tiếp:
	// Offer → jobApplication → candidate → id
	Page<Offer> findByJobApplicationCandidateId(Long candidateId, Pageable pageable);

	// Các offer thuộc tin do một recruiter đăng, đi qua 3 tầng:
	// Offer → jobApplication → jobListing → recruiter → id
	Page<Offer> findByJobApplicationJobListingRecruiterId(Long recruiterId, Pageable pageable);
}
