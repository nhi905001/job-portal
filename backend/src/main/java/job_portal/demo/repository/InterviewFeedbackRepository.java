package job_portal.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.InterviewFeedback;

public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, Long> {

	// Khung giờ này đã có feedback chưa? (chặn chấm điểm 2 lần)
	boolean existsByInterviewSlotId(Long interviewSlotId);

	// Lấy feedback của một khung giờ
	Optional<InterviewFeedback> findByInterviewSlotId(Long interviewSlotId);
}
