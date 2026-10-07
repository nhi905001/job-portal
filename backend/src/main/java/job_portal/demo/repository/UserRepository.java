package job_portal.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	// Tìm user: lọc theo role (tùy chọn) và từ khóa trong email hoặc tên
	// Role null thì bỏ qua điều kiện lọc role
	@Query("""
			SELECT u FROM User u
			WHERE (:role IS NULL OR u.role = :role)
			AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
			  OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
			""")
	Page<User> search(@Param("role") Role role, @Param("keyword") String keyword, Pageable pageable);
}