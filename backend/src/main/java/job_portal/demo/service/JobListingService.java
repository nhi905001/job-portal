package job_portal.demo.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.JobListingDetail;
import job_portal.demo.dto.JobListingRequest;
import job_portal.demo.entity.Company;
import job_portal.demo.entity.CompanyLocation;
import job_portal.demo.entity.JobDescription;
import job_portal.demo.entity.JobListing;
import job_portal.demo.entity.JobStatus;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.JobApplicationRepository;
import job_portal.demo.repository.JobDescriptionRepository;
import job_portal.demo.repository.JobListingRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobListingService {

	private final JobListingRepository jobListingRepository;
	private final JobDescriptionRepository jobDescriptionRepository;
	private final JobApplicationRepository jobApplicationRepository;
	// Dùng lại các service đã viết để đổi id thành object (giống
	// CompanyLocationService)
	private final CompanyService companyService;
	private final CompanyLocationService locationService;
	private final IndustryService industryService;
	private final JobTypeService jobTypeService;

	public Page<JobListing> search(String keyword, Long companyId, Long jobTypeId, Long industryId, Long recruiterId,
			JobStatus status, Pageable pageable) {
		return jobListingRepository.search(keyword, companyId, jobTypeId, industryId, recruiterId, status, pageable);
	}

	public JobListing getById(Long id) {
		return jobListingRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job listing not found"));
	}

	// Xem chi tiết: lấy tin + mô tả rồi gói lại. orElse(null): chưa có mô tả thì để
	// null.
	public JobListingDetail getDetail(Long id) {
		JobListing listing = getById(id);
		JobDescription description = jobDescriptionRepository.findByJobListingId(id).orElse(null);
		return new JobListingDetail(listing, description);
	}

	// MỚI: @Transactional = "tất cả hoặc không gì cả". Hàm này lưu 2 bảng
	// (job_listing và job_description).
	// Nếu lưu bảng thứ nhất xong mà bảng thứ hai lỗi, Spring HOÀN TÁC luôn bảng thứ
	// nhất,
	// không để lại tin tuyển dụng thiếu mô tả.
	@Transactional
	public JobListingDetail create(JobListingRequest request, User user) {
		JobListing listing = new JobListing();
		listing.setRecruiter(user); // Người đăng tin = người đang đăng nhập
		listing.setCreatedAt(LocalDateTime.now());
		return saveBoth(listing, new JobDescription(), request, user);
	}

	@Transactional
	public JobListingDetail update(Long id, JobListingRequest request, User user) {
		JobListing listing = getById(id);
		checkOwner(listing, user); // Kiểm tra quyền sở hữu trước khi sửa
		// Lấy mô tả cũ để sửa; nếu chưa có thì tạo mô tả mới
		JobDescription description = jobDescriptionRepository.findByJobListingId(id).orElseGet(JobDescription::new);
		return saveBoth(listing, description, request, user);
	}

	@Transactional
	public void delete(Long id, User user) {
		JobListing listing = getById(id);
		checkOwner(listing, user);
		// Tin đã có người nộp đơn thì không cho xóa (xóa sẽ làm mất đơn của ứng viên)
		if (jobApplicationRepository.existsByJobListingId(id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"This job already has applications. Close it instead of deleting.");
		}
		// Phải xóa mô tả trước vì nó đang trỏ tới tin (khóa ngoại), rồi mới xóa tin
		jobDescriptionRepository.findByJobListingId(id).ifPresent(jobDescriptionRepository::delete);
		jobListingRepository.delete(listing);
	}

	// MỚI: kiểm tra quyền sở hữu. ADMIN làm được mọi thứ; RECRUITER chỉ sửa/xóa tin
	// do CHÍNH MÌNH đăng.
	// Nếu thiếu bước này, recruiter của công ty A sửa được tin của công ty B.
	private void checkOwner(JobListing listing, User user) {
		boolean isAdmin = user.getRole() == Role.ADMIN;
		boolean isOwner = listing.getRecruiter().getId().equals(user.getId());
		if (!isAdmin && !isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only modify your own job listings");
		}
	}

	// Dùng chung cho create và update (cùng lý do với fillFrom lúc nãy)
	private JobListingDetail saveBoth(JobListing listing, JobDescription description, JobListingRequest r, User user) {

		// Kiểm tra logic mà annotation không làm được: lương tối thiểu không được lớn
		// hơn tối đa
		if (r.salaryMin() != null && r.salaryMax() != null && r.salaryMin().compareTo(r.salaryMax()) > 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Salary min must not be greater than salary max");
		}

		// Xác định công ty: RECRUITER tự lấy công ty của mình; ADMIN phải gửi companyId
		Company company = user.getRole() == Role.RECRUITER ? user.getCompany()
				: (r.companyId() == null ? null : companyService.getById(r.companyId()));
		if (company == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company is required");
		}

		// Địa điểm phải thuộc ĐÚNG công ty đó (không cho chọn địa điểm của công ty
		// khác)
		CompanyLocation location = locationService.getById(r.locationId());
		if (!location.getCompany().getId().equals(company.getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location does not belong to the company");
		}

		// Đổ dữ liệu vào tin tuyển dụng, đổi từng id thành object
		listing.setTitle(r.title());
		listing.setCompany(company);
		listing.setJobType(jobTypeService.getById(r.jobTypeId()));
		listing.setIndustry(industryService.getById(r.industryId()));
		listing.setLocation(location);
		listing.setSalaryMin(r.salaryMin());
		listing.setSalaryMax(r.salaryMax());
		listing.setDeadline(r.deadline());
		if (r.status() != null) { // Có gửi status thì dùng, không thì giữ mặc định OPEN
			listing.setStatus(r.status());
		}
		JobListing savedListing = jobListingRepository.save(listing); // Lưu bảng 1 (để có id)

		// Đổ dữ liệu vào mô tả, gắn với tin vừa lưu, rồi lưu bảng 2
		description.setJobListing(savedListing);
		description.setResponsibilities(r.responsibilities());
		description.setRequirements(r.requirements());
		description.setBenefits(r.benefits());
		JobDescription savedDescription = jobDescriptionRepository.save(description);

		return new JobListingDetail(savedListing, savedDescription);
	}
}
