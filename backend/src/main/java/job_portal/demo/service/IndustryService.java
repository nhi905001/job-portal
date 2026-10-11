package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.IndustryRequest;
import job_portal.demo.entity.Industry;
import job_portal.demo.repository.IndustryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IndustryService {
	private final IndustryRepository industryRepository;

	public Page<Industry> search(String keyword, Pageable pageable) {
		return industryRepository.findByNameContainingIgnoreCase(keyword, pageable);
	}

	public Industry getById(Long id) {
		return industryRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Industry not found"));
	}

	// tạo mới
	public Industry create(IndustryRequest request) {
		if (industryRepository.existsByNameIgnoreCase(request.name())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Industry already exists");
		}
		return industryRepository.save(new Industry(request.name()));
	}

	// cập nhật
	public Industry update(Long id, IndustryRequest request) {
		Industry industry = getById(id);
		industry.setName(request.name());
		return industryRepository.save(industry);
	}

	// xóa
	public void delete(Long id) {
		industryRepository.delete(getById(id));
	}
}
