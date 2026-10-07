package job_portal.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.JobDescription;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {

	// Đi qua quan hệ: JobDescription → jobListing → id. Tên hàm đọc là "tìm theo
	// jobListing.id"
	Optional<JobDescription> findByJobListingId(Long jobListingId);
}
