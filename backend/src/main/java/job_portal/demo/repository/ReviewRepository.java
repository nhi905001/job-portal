package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	// Các review của một công ty, có phân trang
	Page<Review> findByCompanyId(Long companyId, Pageable pageable);

	// Người này đã review công ty này chưa? (hai điều kiện nối bằng "And")
	boolean existsByCompanyIdAndUserId(Long companyId, Long userId);
}
