package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> { // Company + khóa chính kiểu Long
	Page<Company> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}