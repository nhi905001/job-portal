package job_portal.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IndustryRequest(

		@NotBlank(message = "Name is required") @Size(max = 100, message = "Name must be at most 100 characters") String name) {
}
