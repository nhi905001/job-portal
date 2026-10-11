package job_portal.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobTypeRequest(

		@NotBlank(message = "Name is required") // 400
		@Size(max = 100, message = "Name must be at most 100 characters") String name) { // 409
}
