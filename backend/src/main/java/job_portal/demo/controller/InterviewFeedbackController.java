package job_portal.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.FeedbackRequest;
import job_portal.demo.entity.InterviewFeedback;
import job_portal.demo.entity.User;
import job_portal.demo.service.InterviewFeedbackService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interview-feedbacks")
@RequiredArgsConstructor
public class InterviewFeedbackController {

	private final InterviewFeedbackService feedbackService;

	// POST /api/interview-feedbacks body
	// {"interviewSlotId":1,"score":8,"comment":"Nam vung Java"}
	// Chỉ RECRUITER phỏng vấn mới có quyền ghi đánh giá. Admin không có quyền đánh giá.
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('RECRUITER')")
	public InterviewFeedback create(@Valid @RequestBody FeedbackRequest request, @AuthenticationPrincipal User user) {
		return feedbackService.create(request, user);
	}

	// GET /api/interview-feedbacks/slot/1 : xem feedback của khung giờ số 1 (Recruiter sở hữu tin hoặc Admin kiểm tra)
	@GetMapping("/slot/{slotId}")
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public InterviewFeedback getBySlot(@PathVariable Long slotId, @AuthenticationPrincipal User user) {
		return feedbackService.getBySlot(slotId, user);
	}
}