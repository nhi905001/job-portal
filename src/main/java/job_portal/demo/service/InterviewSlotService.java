package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.BookSlotRequest;
import job_portal.demo.dto.InterviewSlotRequest;
import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.InterviewSlot;
import job_portal.demo.entity.JobApplication;
import job_portal.demo.entity.JobListing;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.InterviewSlotRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InterviewSlotService {

	private final InterviewSlotRepository slotRepository;
	private final JobListingService jobListingService;
	private final JobApplicationService applicationService;
	private final NotificationService notificationService;

	public InterviewSlot getById(Long id) {
		return slotRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview slot not found"));
	}

	// Danh sách khung giờ. Có 2 quy tắc BẢO MẬT, vì khung giờ đã đặt chứa thông tin
	// đơn của ứng viên:
	public Page<InterviewSlot> search(Long jobListingId, boolean onlyFree, User user, Pageable pageable) {
		// 1) Ứng viên chỉ được thấy khung giờ CÒN TRỐNG (không thấy đơn của ứng viên
		// khác)
		boolean free = onlyFree || user.getRole() == Role.JOB_SEEKER;
		// 2) Recruiter chỉ thấy khung giờ của tin do MÌNH đăng. Admin: null = thấy tất
		// cả.
		Long recruiterId = user.getRole() == Role.RECRUITER ? user.getId() : null;
		return slotRepository.search(jobListingId, recruiterId, free, pageable);
	}

	// Recruiter tạo khung giờ cho tin của mình
	public InterviewSlot create(InterviewSlotRequest request, User user) {
		JobListing listing = jobListingService.getById(request.jobListingId());

		// Phải là recruiter đăng tin đó (hoặc admin)
		boolean isAdmin = user.getRole() == Role.ADMIN;
		boolean isOwner = listing.getRecruiter().getId().equals(user.getId());
		if (!isAdmin && !isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only create slots for your own jobs");
		}

		// Giờ kết thúc phải sau giờ bắt đầu. isAfter(...) trả true nếu "nằm sau".
		if (!request.endTime().isAfter(request.startTime())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
		}

		InterviewSlot slot = new InterviewSlot();
		slot.setJobListing(listing);
		slot.setStartTime(request.startTime());
		slot.setEndTime(request.endTime());
		slot.setMeetingLink(request.meetingLink());
		return slotRepository.save(slot); // jobApplication còn null = khung giờ trống
	}

	// Ứng viên đặt một khung giờ. Ghi 2 chỗ (slot + trạng thái đơn) nên cần
	// @Transactional.
	@Transactional
	public InterviewSlot book(Long slotId, BookSlotRequest request, User candidate) {
		InterviewSlot slot = getById(slotId);

		// Quy tắc 1: khung giờ phải còn trống
		if (slot.getJobApplication() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot is already booked");
		}

		JobApplication application = applicationService.getById(request.applicationId());

		// Quy tắc 2: đơn phải là của chính ứng viên đang đăng nhập (không đặt hộ người
		// khác)
		if (!application.getCandidate().getId().equals(candidate.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
		}

		// Quy tắc 3: đơn và khung giờ phải cùng một tin tuyển dụng
		if (!application.getJobListing().getId().equals(slot.getJobListing().getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application and slot belong to different jobs");
		}

		// Quy tắc 4: chỉ ứng viên ĐÃ ĐƯỢC SHORTLIST mới được đặt lịch.
		// Sau khi đặt, đơn thành INTERVIEWING nên cũng không đặt thêm khung giờ thứ hai
		// được.
		if (application.getStatus() != ApplicationStatus.SHORTLISTED) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Only shortlisted applications can book an interview");
		}

		slot.setJobApplication(application); // Đánh dấu đã có người đặt
		InterviewSlot saved = slotRepository.save(slot);
		applicationService.changeStatus(application, ApplicationStatus.INTERVIEWING); // Đồng bộ trạng thái đơn
		// Báo cho recruiter biết ứng viên đã chọn giờ
		notificationService.notify(slot.getJobListing().getRecruiter(),
				candidate.getFullName() + " booked an interview slot for \"" + slot.getJobListing().getTitle() + "\"");
		return saved;
	}

	// Recruiter xóa khung giờ chưa ai đặt
	public void delete(Long id, User user) {
		InterviewSlot slot = getById(id);

		boolean isAdmin = user.getRole() == Role.ADMIN;
		boolean isOwner = slot.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isAdmin && !isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete slots of your own jobs");
		}
		// Đã có người đặt thì không xóa (xóa sẽ làm mất lịch của ứng viên)
		if (slot.getJobApplication() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a slot that is already booked");
		}
		slotRepository.delete(slot);
	}
}
