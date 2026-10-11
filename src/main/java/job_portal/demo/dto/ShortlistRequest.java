package job_portal.demo.dto;

import jakarta.validation.constraints.NotNull;

public record ShortlistRequest(

		@NotNull(message = "Application is required") Long applicationId, // Shortlist đơn nào

		String note) { // Không bắt buộc
}
