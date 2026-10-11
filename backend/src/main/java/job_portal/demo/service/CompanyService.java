package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.CompanyRequest;
import job_portal.demo.entity.Company;
import job_portal.demo.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyService {
	private final CompanyRepository companyRepository;

	public Page<Company> search(String keyword, Pageable pageable) {
		return companyRepository.findByNameContainingIgnoreCase(keyword, pageable);
	}

	public Company getById(Long id) {
		return companyRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
	}

	public Company create(CompanyRequest request) {
		return companyRepository.save(fillFrom(new Company(), request));
	}

	public Company update(Long id, CompanyRequest request) {
		return companyRepository.save(fillFrom(getById(id), request));
	}

	public void delete(Long id) {
		companyRepository.delete(getById(id));
	}

	private Company fillFrom(Company company, CompanyRequest request) {
		company.setName(request.name());
		company.setDescription(request.description());
		company.setWebsite(request.website());
		company.setLogoUrl(request.logoUrl());
		return company;
	}
}