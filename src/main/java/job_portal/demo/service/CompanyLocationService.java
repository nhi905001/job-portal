package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.CompanyLocationRequest;
import job_portal.demo.entity.CompanyLocation;
import job_portal.demo.repository.CompanyLocationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyLocationService {

	private final CompanyLocationRepository locationRepository;
	private final CompanyService companyService;

	public Page<CompanyLocation> search(Long companyId, String keyword, Pageable pageable) {
		return locationRepository.search(companyId, keyword, pageable);
	}

	public CompanyLocation getById(Long id) {
		return locationRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
	}

	public CompanyLocation create(CompanyLocationRequest request) {
		return locationRepository.save(fillFrom(new CompanyLocation(), request));
	}

	public CompanyLocation update(Long id, CompanyLocationRequest request) {
		return locationRepository.save(fillFrom(getById(id), request));
	}

	public void delete(Long id) {
		locationRepository.delete(getById(id));
	}

	private CompanyLocation fillFrom(CompanyLocation location, CompanyLocationRequest request) {
		location.setCompany(companyService.getById(request.companyId()));
		location.setAddress(request.address());
		location.setCity(request.city());
		return location;
	}
}
