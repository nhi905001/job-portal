package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

	// Tin này đã có đơn nào chưa? (dùng khi xóa tin)
	boolean existsByJobListingId(Long jobListingId);

	// Ứng viên này đã nộp vào tin này chưa? (chặn nộp 2 lần). Tên hàm có "And" để
	// ghép 2 điều kiện.
	boolean existsByJobListingIdAndCandidateId(Long jobListingId, Long candidateId);

	// Các đơn của một ứng viên, có phân trang
	Page<JobApplication> findByCandidateId(Long candidateId, Pageable pageable);

	// Dành cho recruiter/admin: lọc theo tin, theo trạng thái, và theo người đăng
	// tin.
	// recruiterId = null (admin) thì thấy tất cả đơn. Đi qua 2 tầng quan hệ: đơn →
	// tin → recruiter → id.
	@Query("""
			SELECT a FROM JobApplication a
			WHERE (:jobListingId IS NULL OR a.jobListing.id = :jobListingId)
			AND (:status IS NULL OR a.status = :status)
			AND (:recruiterId IS NULL OR a.jobListing.recruiter.id = :recruiterId)
			""")
	Page<JobApplication> search(@Param("jobListingId") Long jobListingId, @Param("status") ApplicationStatus status,
			@Param("recruiterId") Long recruiterId, Pageable pageable);
}
