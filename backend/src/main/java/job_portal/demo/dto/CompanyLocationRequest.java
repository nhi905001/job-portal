package job_portal.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CompanyLocationRequest(

		@NotNull(message = "Company is required") Long companyId,

		@NotBlank(message = "Address is required") String address,

		@NotBlank(message = "City is required") String city) {
}
