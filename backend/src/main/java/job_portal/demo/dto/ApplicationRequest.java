package job_portal.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(

		@NotNull(message = "Job listing is required") Long jobListingId, // Nộp vào tin nào

		@NotBlank(message = "Resume is required") // Bắt buộc có CV (đề bài: "with resume upload")
		String resumeUrl,

		String coverLetter) { // Không bắt buộc
}
