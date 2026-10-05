package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.CompanyLocation;

public interface CompanyLocationRepository extends JpaRepository<CompanyLocation, Long> {

	// @Query để tự viết câu truy vấn. Ngôn ngữ này là JPQL, giống SQL nhưng
	// dùng TÊN CLASS và TÊN FIELD trong Java (CompanyLocation, city), không dùng
	// tên bảng/cột trong DB.
	// Dấu """ cho phép viết chuỗi nhiều dòng.
	@Query("""
			SELECT l FROM CompanyLocation l
			WHERE (:companyId IS NULL OR l.company.id = :companyId)
			AND (LOWER(l.city) LIKE LOWER(CONCAT('%', :keyword, '%'))
			  OR LOWER(l.address) LIKE LOWER(CONCAT('%', :keyword, '%')))
			""")
	Page<CompanyLocation> search(@Param("companyId") Long companyId, @Param("keyword") String keyword,
			Pageable pageable);
}
