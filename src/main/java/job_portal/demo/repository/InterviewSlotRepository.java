package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.InterviewSlot;

public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {

	// Lọc theo tin, theo người đăng tin, và (tùy chọn) chỉ lấy khung giờ còn trống.
	// "s.jobApplication IS NULL" = chưa ai đặt.
	// :onlyFree = false thì điều kiện (:onlyFree = false OR ...) luôn đúng, tức là
	// lấy tất cả.
	@Query("""
			SELECT s FROM InterviewSlot s
			WHERE (:jobListingId IS NULL OR s.jobListing.id = :jobListingId)
			AND (:recruiterId IS NULL OR s.jobListing.recruiter.id = :recruiterId)
			AND (:onlyFree = false OR s.jobApplication IS NULL)
			""")
	Page<InterviewSlot> search(@Param("jobListingId") Long jobListingId, @Param("recruiterId") Long recruiterId,
			@Param("onlyFree") boolean onlyFree, Pageable pageable);
}
