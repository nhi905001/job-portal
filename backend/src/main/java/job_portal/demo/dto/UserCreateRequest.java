package job_portal.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import job_portal.demo.entity.Role;

// Khác RegisterRequest ở 2 chỗ: có role (admin được chọn) và có companyId (dành cho recruiter)
public record UserCreateRequest(

		@NotBlank(message = "Email is required") @Email(message = "Email is invalid") String email,

		@NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password,

		@NotBlank(message = "Full name is required") String fullName,

		@NotNull(message = "Role is required") Role role,

		Long companyId) {
}
