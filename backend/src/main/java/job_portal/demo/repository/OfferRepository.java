package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {

	// Đơn này đã có offer chưa?
	boolean existsByJobApplicationId(Long jobApplicationId);

	// Kiểm tra xem đơn ứng tuyển đã có Offer đang hiệu lực (PENDING hoặc ACCEPTED) hay chưa
	@Query("SELECT COUNT(o) > 0 FROM Offer o WHERE o.jobApplication.id = :appId AND o.status IN (job_portal.demo.entity.OfferStatus.PENDING, job_portal.demo.entity.OfferStatus.ACCEPTED)")
	boolean hasActiveOffer(@Param("appId") Long appId);

	// Các offer của một ứng viên. Spring đọc tên hàm và ĐI QUA CÁC QUAN HỆ liên
	// tiếp:
	// Offer → jobApplication → candidate → id
	Page<Offer> findByJobApplicationCandidateId(Long candidateId, Pageable pageable);

	// Các offer thuộc tin do một recruiter đăng, đi qua 3 tầng:
	// Offer → jobApplication → jobListing → recruiter → id
	Page<Offer> findByJobApplicationJobListingRecruiterId(Long recruiterId, Pageable pageable);
}
