package job_portal.demo.dto;

import jakarta.validation.constraints.NotNull;

public record BookSlotRequest(

		@NotNull(message = "Application is required") Long applicationId) {
}
