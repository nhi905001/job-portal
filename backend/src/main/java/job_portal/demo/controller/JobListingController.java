package job_portal.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.JobListingDetail;
import job_portal.demo.dto.JobListingRequest;
import job_portal.demo.entity.JobListing;
import job_portal.demo.entity.JobStatus;
import job_portal.demo.entity.User;
import job_portal.demo.service.JobListingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/job-listings")
@RequiredArgsConstructor
public class JobListingController {

	private final JobListingService jobListingService;

	// GET
	// /api/job-listings?keyword=java&companyId=1&jobTypeId=2&industryId=1&status=OPEN&page=0&size=10&sortBy=createdAt&sortDir=desc
	// Công khai (SecurityConfig đã cho GET qua). Mọi tham số lọc đều tùy chọn.
	@GetMapping
	public Page<JobListing> list(@RequestParam(defaultValue = "") String keyword,
			@RequestParam(required = false) Long companyId, @RequestParam(required = false) Long jobTypeId,
			@RequestParam(required = false) Long industryId, @RequestParam(required = false) Long recruiterId,
			@RequestParam(required = false) JobStatus status, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) { // Tin mới nhất lên đầu

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return jobListingService.search(keyword, companyId, jobTypeId, industryId, recruiterId, status,
				PageRequest.of(page, size, sort));
	}

	// GET /api/job-listings/5 : chi tiết một tin kèm mô tả công việc
	@GetMapping("/{id}")
	public JobListingDetail get(@PathVariable Long id) {
		return jobListingService.getDetail(id);
	}

	// POST: recruiter hoặc admin. @AuthenticationPrincipal lấy người đang đăng nhập
	// → thành người đăng tin.
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')") // MỚI: hasAnyRole = một trong các role đều được
	public JobListingDetail create(@Valid @RequestBody JobListingRequest request, @AuthenticationPrincipal User user) {
		return jobListingService.create(request, user);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public JobListingDetail update(@PathVariable Long id, @Valid @RequestBody JobListingRequest request,
			@AuthenticationPrincipal User user) {
		return jobListingService.update(id, request, user);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
		jobListingService.delete(id, user);
	}
}
