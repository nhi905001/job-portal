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
import job_portal.demo.dto.ShortlistRequest;
import job_portal.demo.entity.Shortlist;
import job_portal.demo.entity.User;
import job_portal.demo.service.ShortlistService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shortlists")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')") // Cả controller: chỉ recruiter và admin (đặt ở mức class như
													// UserController)
public class ShortlistController {

	private final ShortlistService shortlistService;

	// POST /api/shortlists body {"applicationId":1,"note":"Kinh nghiem tot"}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Shortlist create(@Valid @RequestBody ShortlistRequest request, @AuthenticationPrincipal User user) {
		return shortlistService.create(request, user);
	}

	// GET /api/shortlists?page=0&size=10
	@GetMapping
	public Page<Shortlist> list(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return shortlistService.getAll(user, PageRequest.of(page, size, sort));
	}

	// DELETE /api/shortlists/3
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
		shortlistService.delete(id, user);
	}
}
