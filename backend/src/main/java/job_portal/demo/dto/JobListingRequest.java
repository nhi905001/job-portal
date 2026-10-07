package job_portal.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import job_portal.demo.entity.JobStatus;

// Một request chứa CẢ thông tin tin tuyển dụng LẪN mô tả công việc.
// Client gửi một lần, server lưu vào 2 bảng.
public record JobListingRequest(

		@NotBlank(message = "Title is required") @Size(max = 255, message = "Title must be at most 255 characters") String title,

		Long companyId, // Recruiter bỏ trống (tự lấy công ty của mình); ADMIN phải điền

		@NotNull(message = "Job type is required") Long jobTypeId,

		@NotNull(message = "Industry is required") Long industryId,

		@NotNull(message = "Location is required") Long locationId,

		@PositiveOrZero(message = "Salary min must be >= 0") // số không âm. Không có @NotNull nên được để trống
		BigDecimal salaryMin,

		@PositiveOrZero(message = "Salary max must be >= 0") BigDecimal salaryMax,

		@NotNull(message = "Deadline is required") LocalDate deadline, // client gửi "2026-12-31"

		JobStatus status, // Bỏ trống = OPEN. Muốn lưu nháp thì gửi "DRAFT"

		// ----- Phần mô tả công việc (lưu sang bảng job_description) -----
		@NotBlank(message = "Responsibilities is required") String responsibilities,

		@NotBlank(message = "Requirements is required") String requirements,

		String benefits) {
}
