package job_portal.demo.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.FeedbackRequest;
import job_portal.demo.entity.InterviewFeedback;
import job_portal.demo.entity.InterviewSlot;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.InterviewFeedbackRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InterviewFeedbackService {

	private final InterviewFeedbackRepository feedbackRepository;
	private final InterviewSlotService slotService; // Dùng lại để tìm khung giờ (không có thì tự 404)

	public InterviewFeedback create(FeedbackRequest request, User user) {
		if (user.getRole() != Role.RECRUITER) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN,
					"Only recruiters can record interview evaluations");
		}

		InterviewSlot slot = slotService.getById(request.interviewSlotId());

		// Phải là recruiter đăng tin của khung giờ này (Admin không có quyền đánh giá)
		boolean isOwner = slot.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN,
					"You can only record feedback for your own jobs");
		}

		// Khung giờ chưa có ứng viên đặt thì không có ai để đánh giá
		if (slot.getJobApplication() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This slot has no candidate yet");
		}

		// Mỗi buổi phỏng vấn chỉ có một feedback
		if (feedbackRepository.existsByInterviewSlotId(slot.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Feedback for this interview already exists");
		}

		InterviewFeedback feedback = new InterviewFeedback();
		feedback.setInterviewSlot(slot);
		feedback.setScore(request.score());
		feedback.setComment(request.comment());
		return feedbackRepository.save(feedback);
	}

	// Xem feedback của một khung giờ. Chủ tin hoặc Admin (để giám sát) mới được xem.
	public InterviewFeedback getBySlot(Long slotId, User user) {
		InterviewSlot slot = slotService.getById(slotId);
		checkCanView(slot, user);
		return feedbackRepository.findByInterviewSlotId(slotId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found"));
	}

	// Admin hoặc recruiter đăng tin của khung giờ này có thể xem
	private void checkCanView(InterviewSlot slot, User user) {
		boolean isAdmin = user.getRole() == Role.ADMIN;
		boolean isOwner = slot.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isAdmin && !isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view feedback of your own jobs");
		}
	}
}
