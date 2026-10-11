package job_portal.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FeedbackRequest(

		@NotNull(message = "Interview slot is required") Long interviewSlotId, // Đánh giá cho buổi phỏng vấn (khung
																				// giờ) nào

		// MỚI: @Min và @Max giới hạn khoảng giá trị của số.
		// Trường "int" nếu client QUÊN gửi sẽ mặc định bằng 0, nên bị @Min(1) chặn luôn
		// (trả 400).
		@Min(value = 1, message = "Score must be between 1 and 10") @Max(value = 10, message = "Score must be between 1 and 10") int score,

		String comment) { // Không bắt buộc
}
