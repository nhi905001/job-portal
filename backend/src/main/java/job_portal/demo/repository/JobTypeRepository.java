package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.JobType;

public interface JobTypeRepository extends JpaRepository<JobType, Long> {
	Page<JobType> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

	// existsBy... = hỏi "có tồn tại không?" → trả về true hoặc false
	boolean existsByNameIgnoreCase(String name);
}
