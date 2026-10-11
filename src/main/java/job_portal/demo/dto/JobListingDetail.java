package job_portal.demo.dto;

import job_portal.demo.entity.JobDescription;
import job_portal.demo.entity.JobListing;

// Dữ liệu TRẢ VỀ khi xem chi tiết: gói tin tuyển dụng và mô tả vào một JSON:
// {"jobListing": {...}, "description": {...}}
public record JobListingDetail(JobListing jobListing, JobDescription description) {
}
