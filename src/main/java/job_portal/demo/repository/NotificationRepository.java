package job_portal.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	// Thông báo của một người dùng, có phân trang
	Page<Notification> findByUserId(Long userId, Pageable pageable);

	// MỚI: "count" = đếm, "SeenFalse" = điều kiện seen = false.
	// Kết quả là số thông báo CHƯA ĐỌC của người dùng (hiện thành con số đỏ trên
	// biểu tượng chuông).
	long countByUserIdAndSeenFalse(Long userId);
}
