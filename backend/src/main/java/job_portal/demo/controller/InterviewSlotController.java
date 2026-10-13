package job_portal.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.BookSlotRequest;
import job_portal.demo.dto.InterviewSlotRequest;
import job_portal.demo.entity.InterviewSlot;
import job_portal.demo.entity.User;
import job_portal.demo.service.InterviewSlotService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interview-slots")
@RequiredArgsConstructor
public class InterviewSlotController {

	private final InterviewSlotService slotService;

	// GET /api/interview-slots?jobListingId=1&onlyFree=true
	// Ai đã đăng nhập cũng gọi được, nhưng Service sẽ tự giới hạn dữ liệu theo role
	@GetMapping
	public Page<InterviewSlot> list(@RequestParam(required = false) Long jobListingId,
			@RequestParam(defaultValue = "false") boolean onlyFree, @AuthenticationPrincipal User user,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "startTime") String sortBy, // Mặc định xếp theo giờ bắt đầu
			@RequestParam(defaultValue = "asc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return slotService.search(jobListingId, onlyFree, user, PageRequest.of(page, size, sort));
	}

	// POST /api/interview-slots : recruiter tạo khung giờ. Admin không có quyền tạo khung giờ.
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('RECRUITER')")
	public InterviewSlot create(@Valid @RequestBody InterviewSlotRequest request, @AuthenticationPrincipal User user) {
		return slotService.create(request, user);
	}

	// POST /api/interview-slots/3/book body {"applicationId":1} : ứng viên đặt
	// khung giờ số 3
	@PostMapping("/{id}/book")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public InterviewSlot book(@PathVariable Long id, @Valid @RequestBody BookSlotRequest request,
			@AuthenticationPrincipal User user) {
		return slotService.book(id, request, user);
	}

	// GET /api/interview-slots/application/1 : xem lịch phỏng vấn của đơn ứng tuyển
	@GetMapping("/application/{applicationId}")
	public InterviewSlot getByApplication(@PathVariable Long applicationId, @AuthenticationPrincipal User user) {
		return slotService.getByApplicationId(applicationId, user);
	}

	// DELETE /api/interview-slots/3
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('RECRUITER')")
	public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
		slotService.delete(id, user);
	}
}
