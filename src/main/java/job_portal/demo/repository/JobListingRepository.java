package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.JobListing;
import job_portal.demo.entity.JobStatus;

public interface JobListingRepository extends JpaRepository<JobListing, Long> {

	// Cùng mẫu với tìm Location, nhưng nhiều bộ lọc hơn.
	// Tham số nào là null thì điều kiện đó luôn đúng, tức là BỎ QUA không lọc.
	@Query("""
			SELECT j FROM JobListing j
			WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
			AND (:companyId IS NULL OR j.company.id = :companyId)
			AND (:jobTypeId IS NULL OR j.jobType.id = :jobTypeId)
			AND (:industryId IS NULL OR j.industry.id = :industryId)
			AND (:recruiterId IS NULL OR j.recruiter.id = :recruiterId)
			AND (:status IS NULL OR j.status = :status)
			""")
	Page<JobListing> search(@Param("keyword") String keyword, // tìm theo tiêu đề
			@Param("companyId") Long companyId, // lọc theo công ty
			@Param("jobTypeId") Long jobTypeId, // lọc theo loại việc
			@Param("industryId") Long industryId, // lọc theo ngành
			@Param("recruiterId") Long recruiterId, // lọc theo người đăng (recruiter xem tin của mình)
			@Param("status") JobStatus status, // lọc theo trạng thái
			Pageable pageable);
}
