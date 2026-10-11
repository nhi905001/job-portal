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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.ReviewRequest;
import job_portal.demo.dto.ReviewResponse;
import job_portal.demo.entity.User;
import job_portal.demo.service.ReviewService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;

	// GET /api/reviews?companyId=1&page=0&size=10&sortBy=rating&sortDir=desc (công
	// khai)
	@GetMapping
	public Page<ReviewResponse> list(@RequestParam(required = false) Long companyId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return reviewService.search(companyId, PageRequest.of(page, size, sort));
	}

	// POST /api/reviews : ứng viên viết review
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public ReviewResponse create(@Valid @RequestBody ReviewRequest request, @AuthenticationPrincipal User user) {
		return reviewService.create(request, user);
	}

	// DELETE /api/reviews/3 : admin kiểm duyệt
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void delete(@PathVariable Long id) {
		reviewService.delete(id);
	}
}
