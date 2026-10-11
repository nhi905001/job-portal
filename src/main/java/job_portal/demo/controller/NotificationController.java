package job_portal.demo.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import job_portal.demo.entity.Notification;
import job_portal.demo.entity.User;
import job_portal.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
// Không có @PreAuthorize: role nào đã đăng nhập cũng có thông báo của riêng mình
public class NotificationController {

	private final NotificationService notificationService;

	// GET /api/notifications?page=0&size=10 : thông báo của tôi, mới nhất lên đầu
	@GetMapping
	public Page<Notification> mine(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return notificationService.getMine(user.getId(), PageRequest.of(page, size, sort));
	}

	// GET /api/notifications/unread-count → {"count": 3}
	@GetMapping("/unread-count")
	public Map<String, Long> unreadCount(@AuthenticationPrincipal User user) {
		return Map.of("count", notificationService.countUnread(user.getId()));
	}

	// PATCH /api/notifications/5/read : đánh dấu đã đọc
	@PatchMapping("/{id}/read")
	public Notification markRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
		return notificationService.markRead(id, user);
	}
}
