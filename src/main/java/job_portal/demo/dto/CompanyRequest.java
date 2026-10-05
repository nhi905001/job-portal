package job_portal.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyRequest(

		@NotBlank(message = "Name is required") @Size(max = 150, message = "Name must be at most 150 characters") String name,

		String description, String website, String logoUrl) {
}
