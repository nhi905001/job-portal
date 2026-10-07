package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Shortlist;

public interface ShortlistRepository extends JpaRepository<Shortlist, Long> {

	// Các shortlist của một recruiter, có phân trang.
	// Đi qua quan hệ: Shortlist → recruiter → id
	Page<Shortlist> findByRecruiterId(Long recruiterId, Pageable pageable);
}
