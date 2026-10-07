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
@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')") // Cả controller: ứng viên không vào được
public class InterviewFeedbackController {

	private final InterviewFeedbackService feedbackService;

	// POST /api/interview-feedbacks body
	// {"interviewSlotId":1,"score":8,"comment":"Nam vung Java"}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public InterviewFeedback create(@Valid @RequestBody FeedbackRequest request, @AuthenticationPrincipal User user) {
		return feedbackService.create(request, user);
	}

	// GET /api/interview-feedbacks/slot/1 : xem feedback của khung giờ số 1
	@GetMapping("/slot/{slotId}")
	public InterviewFeedback getBySlot(@PathVariable Long slotId, @AuthenticationPrincipal User user) {
		return feedbackService.getBySlot(slotId, user);
	}
}