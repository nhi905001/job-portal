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
import job_portal.demo.dto.IndustryRequest;
import job_portal.demo.entity.Industry;
import job_portal.demo.service.IndustryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/industries")
@RequiredArgsConstructor
public class IndustryController {
	private final IndustryService industryService;

	// GET /api/industries?keyword=it&page=0&size=10&sortBy=name&sortDir=asc
	@GetMapping
	public Page<Industry> list(@RequestParam(defaultValue = "") String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		return industryService.search(keyword, PageRequest.of(page, size, sort));
	}

	// GET /api/industries/5
	@GetMapping("/{id}")
	public Industry get(@PathVariable Long id) {
		return industryService.getById(id);
	}

	// POST /api/industries với body JSON {"name":"IT"}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public Industry create(@Valid @RequestBody // Lấy JSON từ body của request, đổi thành object IndustryRequest
	IndustryRequest request) {
		return industryService.create(request);
	}

	// PUT /api/industries/5 với body JSON
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public Industry update(@PathVariable Long id, @Valid @RequestBody IndustryRequest request) {
		return industryService.update(id, request);
	}

	// DELETE /api/industries/5
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		industryService.delete(id);
	}
}
