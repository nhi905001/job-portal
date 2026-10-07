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
import job_portal.demo.dto.CompanyLocationRequest;
import job_portal.demo.entity.CompanyLocation;
import job_portal.demo.service.CompanyLocationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class CompanyLocationController {

	private final CompanyLocationService locationService;

	// GET
	// /api/locations?companyId=1&keyword=ha&page=0&size=10&sortBy=city&sortDir=asc
	@GetMapping
	public Page<CompanyLocation> list(
			// MỚI: required = false nghĩa là client có thể không gửi companyId (khi đó nó
			// là null → không lọc)
			@RequestParam(required = false) Long companyId, @RequestParam(defaultValue = "") String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return locationService.search(companyId, keyword, PageRequest.of(page, size, sort));
	}

	@GetMapping("/{id}")
	public CompanyLocation get(@PathVariable Long id) {
		return locationService.getById(id);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public CompanyLocation create(@Valid @RequestBody CompanyLocationRequest request) {
		return locationService.create(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CompanyLocation update(@PathVariable Long id, @Valid @RequestBody CompanyLocationRequest request) {
		return locationService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		locationService.delete(id);
	}
}
