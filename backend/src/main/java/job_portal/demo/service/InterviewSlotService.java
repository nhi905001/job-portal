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

		// Phải là recruiter đăng tin đó (Admin không có quyền tạo khung giờ phỏng vấn)
		boolean isOwner = user.getRole() == Role.RECRUITER && listing.getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
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

		// Quy tắc 1: khung giờ phải còn trống (Ngoại lệ: Slot đã có người đặt: 409)
		if (slot.getJobApplication() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Khung giờ này đã có người đặt");
		}

		// Không cho phép đặt khung giờ đã trôi qua trong quá khứ
		if (slot.getStartTime().isBefore(java.time.LocalDateTime.now())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khung giờ này đã trôi qua, vui lòng chọn khung giờ khác");
		}

		JobApplication application = applicationService.getById(request.applicationId());

		// Quy tắc 2: đơn phải là của chính ứng viên đang đăng nhập (không đặt hộ người
		// khác)
		if (!application.getCandidate().getId().equals(candidate.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
		}

		// Quy tắc 3: đơn và khung giờ phải cùng một tin tuyển dụng (Ngoại lệ: Slot không thuộc tin của đơn -> 400)
		if (!application.getJobListing().getId().equals(slot.getJobListing().getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application and slot belong to different jobs");
		}

		// Quy tắc 4: chỉ ứng viên ĐÃ ĐƯỢC SHORTLIST mới được đặt lịch (Ngoại lệ: Đơn chưa shortlist -> 400)
		if (application.getStatus() != ApplicationStatus.SHORTLISTED) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Only shortlisted applications can book an interview");
		}

		// Kiểm tra đơn đã từng đặt lịch phỏng vấn trước đó hay chưa
		if (slotRepository.existsByJobApplicationId(application.getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn ứng tuyển này đã được đặt lịch phỏng vấn");
		}

		slot.setJobApplication(application); // Đánh dấu đã có người đặt
		InterviewSlot saved = slotRepository.save(slot);
		applicationService.changeStatus(application, ApplicationStatus.INTERVIEWING); // Đồng bộ trạng thái đơn
		// Báo cho recruiter biết ứng viên đã chọn giờ
		notificationService.notify(slot.getJobListing().getRecruiter(),
				candidate.getFullName() + " đã chọn lịch phỏng vấn cho tin \"" + slot.getJobListing().getTitle() + "\"");
		return saved;
	}

	// Lấy khung giờ phỏng vấn của một đơn ứng tuyển
	public InterviewSlot getByApplicationId(Long applicationId, User user) {
		InterviewSlot slot = slotRepository.findByJobApplicationId(applicationId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có lịch phỏng vấn cho đơn này"));

		boolean isCandidate = slot.getJobApplication().getCandidate().getId().equals(user.getId());
		boolean isRecruiter = user.getRole() == Role.RECRUITER
				&& slot.getJobListing().getRecruiter().getId().equals(user.getId());
		boolean isAdmin = user.getRole() == Role.ADMIN;

		if (!isCandidate && !isRecruiter && !isAdmin) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem thông tin này");
		}
		return slot;
	}

	// Recruiter xóa khung giờ chưa ai đặt
	public void delete(Long id, User user) {
		InterviewSlot slot = getById(id);

		// Phải là recruiter đăng tin đó (Admin không có quyền xóa khung giờ phỏng vấn)
		boolean isOwner = user.getRole() == Role.RECRUITER && slot.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete slots of your own jobs");
		}
		// Đã có người đặt thì không xóa (xóa sẽ làm mất lịch của ứng viên)
		if (slot.getJobApplication() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a slot that is already booked");
		}
		slotRepository.delete(slot);
	}
}
