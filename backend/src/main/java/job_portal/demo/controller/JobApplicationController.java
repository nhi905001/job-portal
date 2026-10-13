package job_portal.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.ApplicationRequest;
import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.JobApplication;
import job_portal.demo.entity.User;
import job_portal.demo.service.JobApplicationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

	private final JobApplicationService applicationService;

	// POST /api/applications : ứng viên nộp đơn
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public JobApplication apply(@Valid @RequestBody ApplicationRequest request, @AuthenticationPrincipal User user) {
		return applicationService.apply(request, user);
	}

	// GET /api/applications/my : ứng viên xem các đơn của mình
	// Đặt đường dẫn "/my" riêng để không lẫn với "/{id}" hay danh sách của
	// recruiter
	@GetMapping("/my")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public Page<JobApplication> mine(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return applicationService.getMine(user.getId(), PageRequest.of(page, size, sort));
	}

	// GET /api/applications?jobListingId=1&status=APPLIED : recruiter/admin xem đơn
	@GetMapping
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public Page<JobApplication> list(@RequestParam(required = false) Long jobListingId,
			@RequestParam(required = false) ApplicationStatus status, @AuthenticationPrincipal User user,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return applicationService.search(jobListingId, status, user, PageRequest.of(page, size, sort));
	}

	// PATCH /api/applications/5/status?value=REJECTED : recruiter đổi trạng thái
	// đơn (từ chối đơn). Admin không có quyền thực hiện nghiệp vụ này.
	@PatchMapping("/{id}/status")
	@PreAuthorize("hasRole('RECRUITER')")
	public JobApplication updateStatus(@PathVariable Long id, @RequestParam("value") ApplicationStatus value,
			@AuthenticationPrincipal User user) {
		return applicationService.updateStatus(id, value, user);
	}

	// DELETE /api/applications/5 : ứng viên rút đơn
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public void withdraw(@PathVariable Long id, @AuthenticationPrincipal User user) {
		applicationService.withdraw(id, user);
	}
}
