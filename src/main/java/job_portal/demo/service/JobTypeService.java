package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.JobTypeRequest;
import job_portal.demo.entity.JobType;
import job_portal.demo.repository.JobTypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobTypeService {

	private final JobTypeRepository jobTypeRepository;

	public Page<JobType> search(String keyword, Pageable pageable) {
		return jobTypeRepository.findByNameContainingIgnoreCase(keyword, pageable);
	}

	// Lấy một loại việc theo id
	public JobType getById(Long id) {
		return jobTypeRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job type not found"));
	}

	// Tạo mới
	public JobType create(JobTypeRequest request) {
		if (jobTypeRepository.existsByNameIgnoreCase(request.name())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Job type already exists");
		}
		return jobTypeRepository.save(new JobType(request.name()));
	}

	// Cập nhật
	public JobType update(Long id, JobTypeRequest request) {
		JobType jobType = getById(id);// Không có thì tự ném 404
		jobType.setName(request.name());
		return jobTypeRepository.save(jobType);
	}

	// Xóa
	public void delete(Long id) {
		jobTypeRepository.delete(getById(id));
	}
}
