package job_portal.demo.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record InterviewSlotRequest(

		@NotNull(message = "Job listing is required") Long jobListingId,

		@NotNull(message = "Start time is required") @Future(message = "Start time must be in the future") // MỚI: phải
																											// ở tương
																											// lai
																											// (không
																											// tạo lịch
																											// trong quá
																											// khứ)
		LocalDateTime startTime, // Client gửi dạng "2026-10-20T09:00:00"

		@NotNull(message = "End time is required") LocalDateTime endTime,

		String meetingLink) {
}
