package job_portal.demo.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import job_portal.demo.dto.ApplicationRequest;
import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.JobApplication;
import job_portal.demo.entity.JobListing;
import job_portal.demo.entity.JobStatus;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

	private final JobApplicationRepository applicationRepository;
	private final JobListingService jobListingService; // Dùng lại để tìm tin theo id (404 nếu không có)
	private final NotificationService notificationService;

	public JobApplication getById(Long id) {
		return applicationRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
	}

	// Ứng viên nộp đơn. "candidate" là người đang đăng nhập, lấy từ token.
	@Transactional
	public JobApplication apply(ApplicationRequest request, User candidate) {
		JobListing listing = jobListingService.getById(request.jobListingId());

		// Tin đã hết hạn chưa? deadline null thì coi như không giới hạn. isBefore: "nằm
		// trước hôm nay"
		boolean expired = listing.getDeadline() != null && listing.getDeadline().isBefore(LocalDate.now());

		// Chỉ cho nộp khi tin đang OPEN và chưa hết hạn
		if (listing.getStatus() != JobStatus.OPEN || expired) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This job is not open for applications");
		}

		// Đã nộp rồi thì báo 409 (xung đột), không cho nộp lần 2
		if (applicationRepository.existsByJobListingIdAndCandidateId(listing.getId(), candidate.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this job");
		}

		JobApplication application = new JobApplication();
		application.setJobListing(listing);
		application.setCandidate(candidate);
		application.setResumeUrl(request.resumeUrl());
		application.setCoverLetter(request.coverLetter());

		// SỬA: lưu vào biến "saved" thay vì return ngay
		JobApplication saved = applicationRepository.save(application); // status và appliedAt đã có giá trị mặc định

		// MỚI: báo cho recruiter đăng tin biết có người nộp đơn
		notificationService.notify(listing.getRecruiter(),
				candidate.getFullName() + " applied for \"" + listing.getTitle() + "\"");

		return saved;
	}

	// Các đơn của chính ứng viên
	public Page<JobApplication> getMine(Long candidateId, Pageable pageable) {
		return applicationRepository.findByCandidateId(candidateId, pageable);
	}

	// Recruiter: chỉ thấy đơn của tin do mình đăng. Admin: thấy tất cả (truyền null
	// để không lọc).
	public Page<JobApplication> search(Long jobListingId, ApplicationStatus status, User user, Pageable pageable) {
		Long recruiterId = user.getRole() == Role.ADMIN ? null : user.getId();
		return applicationRepository.search(jobListingId, status, recruiterId, pageable);
	}

	// Recruiter đổi trạng thái đơn (ví dụ từ chối đơn). Admin không có quyền thực hiện.
	public JobApplication updateStatus(Long id, ApplicationStatus status, User user) {
		JobApplication application = getById(id);

		boolean isOwner = user.getRole() == Role.RECRUITER
				&& application.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN,
					"You can only manage applications of your own jobs");
		}
		return changeStatus(application, status);
	}

	// MỚI: chỉ làm đúng một việc là đổi trạng thái và lưu. KHÔNG kiểm tra quyền,
	// vì nơi gọi nó (ví dụ ShortlistService) đã kiểm tra rồi.
	// Tách ra như vậy để nhiều service dùng chung, không phải lặp lại 2 dòng này.
	public JobApplication changeStatus(JobApplication application, ApplicationStatus status) {
		application.setStatus(status);
		JobApplication saved = applicationRepository.save(application);

		// Báo cho ứng viên mỗi khi đơn của họ đổi trạng thái
		notificationService.notify(application.getCandidate(),
				"Your application for \"" + application.getJobListing().getTitle() + "\" is now " + status);

		return saved;
	}

	// Ứng viên rút đơn: chỉ đơn của chính mình, và chỉ khi còn ở trạng thái APPLIED
	public void withdraw(Long id, User candidate) {
		JobApplication application = getById(id);

		if (!application.getCandidate().getId().equals(candidate.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
		}
		if (application.getStatus() != ApplicationStatus.APPLIED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Only applications in APPLIED status can be withdrawn");
		}
		applicationRepository.delete(application);
	}
}