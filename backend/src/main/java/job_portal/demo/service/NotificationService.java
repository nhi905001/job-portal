package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.entity.Notification;
import job_portal.demo.entity.User;
import job_portal.demo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;

	// Hàm NỘI BỘ: các service khác gọi để gửi thông báo cho một người.
	// Không có API nào gọi hàm này, nên client không tự tạo thông báo giả được.
	public void notify(User user, String message) {
		Notification notification = new Notification();
		notification.setUser(user);
		notification.setMessage(message);
		notificationRepository.save(notification);
	}

	// Thông báo của chính người đang đăng nhập
	public Page<Notification> getMine(Long userId, Pageable pageable) {
		return notificationRepository.findByUserId(userId, pageable);
	}

	public long countUnread(Long userId) {
		return notificationRepository.countByUserIdAndSeenFalse(userId);
	}

	// Đánh dấu đã đọc. Chỉ chủ thông báo mới được bấm.
	public Notification markRead(Long id, User user) {
		Notification notification = notificationRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

		if (!notification.getUser().getId().equals(user.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
		}

		notification.setSeen(true);
		return notificationRepository.save(notification);
	}
}
