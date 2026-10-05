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
import job_portal.demo.dto.CompanyRequest;
import job_portal.demo.entity.Company;
import job_portal.demo.service.CompanyService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

	private final CompanyService companyService;

	// GET /api/companies?keyword=fpt&page=0&size=10&sortBy=name&sortDir=asc
	@GetMapping
	public Page<Company> list(@RequestParam(defaultValue = "") String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return companyService.search(keyword, PageRequest.of(page, size, sort));
	}

	// GET /api/companies/5
	@GetMapping("/{id}")
	public Company get(@PathVariable Long id) {
		return companyService.getById(id);
	}

	// POST /api/companies
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public Company create(@Valid @RequestBody CompanyRequest request) {
		return companyService.create(request);
	}

	// PUT /api/companies/5
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public Company update(@PathVariable Long id, @Valid @RequestBody CompanyRequest request) {
		return companyService.update(id, request);
	}

	// DELETE /api/companies/5
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		companyService.delete(id);
	}
}
