package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Industry;

public interface IndustryRepository extends JpaRepository<Industry, Long> {
	Page<Industry> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

	boolean existsByNameIgnoreCase(String name);
}
