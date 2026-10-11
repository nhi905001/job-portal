package job_portal.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OfferRequest(

		@NotNull(message = "Application is required") Long applicationId, // Gửi offer cho đơn ứng tuyển nào

		@NotNull(message = "Salary is required") @Positive(message = "Salary must be positive") // MỚI: số dương (lớn
																								// hơn 0). Khác
																								// @PositiveOrZero là
																								// cho phép bằng 0
		BigDecimal salary,

		@NotNull(message = "Start date is required") @Future(message = "Start date must be in the future") // Ngày đi
																											// làm phải
																											// ở tương
																											// lai
		LocalDate startDate) { // Client gửi "2026-11-15"
}
