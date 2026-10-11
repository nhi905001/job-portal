package job_portal.demo.dto;

import java.time.LocalDateTime;

//Chỉ chứa những gì được phép công khai. Cố ý KHÔNG có email, role hay id của người viết.
public record ReviewResponse(Long id, Long companyId, String reviewerName, // Chỉ tên hiển thị
		int rating, String comment, LocalDateTime createdAt) {
}
