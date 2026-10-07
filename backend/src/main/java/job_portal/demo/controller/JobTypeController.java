package job_portal.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
import job_portal.demo.dto.JobTypeRequest;
import job_portal.demo.entity.JobType;
import job_portal.demo.service.JobTypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/job-types")
@RequiredArgsConstructor
public class JobTypeController {
	private final JobTypeService jobTypeService;

	// GET /api/job-types?keyword=full&page=0&size=10&sortBy=name&sortDir=asc
	@GetMapping
	public Page<JobType> list(@RequestParam(defaultValue = "") String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		// Gói page + size + sort thành Pageable, nhờ service tìm
		return jobTypeService.search(keyword, PageRequest.of(page, size, sort));
	}

	// GET /api/job-types/5
	@GetMapping("/{id}")
	public JobType get(@PathVariable Long id) {
		return jobTypeService.getById(id);
	}

	// POST /api/job-types
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public JobType create(@Valid @RequestBody JobTypeRequest request) {
		return jobTypeService.create(request);
	}

	// PUT /api/job-types/5
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public JobType update(@PathVariable Long id, @Valid @RequestBody JobTypeRequest request) {
		return jobTypeService.update(id, request);
	}

	// DELETE /api/job-types/5
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		jobTypeService.delete(id);
	}
}
