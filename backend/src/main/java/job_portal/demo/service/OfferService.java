package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.OfferRequest;
import job_portal.demo.entity.ApplicationStatus;
import job_portal.demo.entity.JobApplication;
import job_portal.demo.entity.Offer;
import job_portal.demo.entity.OfferStatus;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.InterviewSlotRepository;
import job_portal.demo.repository.OfferRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfferService {

	private final OfferRepository offerRepository;
	private final JobApplicationService applicationService;
	private final NotificationService notificationService;
	private final InterviewSlotRepository slotRepository;

	// Recruiter gửi offer. Ghi 2 chỗ (lưu Offer + đổi trạng thái đơn) nên cần
	// @Transactional.
	@Transactional
	public Offer create(OfferRequest request, User user) {
		if (user.getRole() != Role.RECRUITER) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only recruiters can send offers");
		}

		JobApplication application = applicationService.getById(request.applicationId());

		// Phải là recruiter đăng tin đó (Admin không có quyền gửi offer)
		boolean isOwner = application.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only send offers for your own jobs");
		}

		// Cho phép gửi offer cho ứng viên đã SHORTLISTED hoặc đang INTERVIEWING
		if (application.getStatus() != ApplicationStatus.INTERVIEWING
				&& application.getStatus() != ApplicationStatus.SHORTLISTED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Offers can only be sent to applications in SHORTLISTED or INTERVIEWING status");
		}

		// Mỗi đơn chỉ có một offer đang hiệu lực
		if (offerRepository.hasActiveOffer(application.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "An active offer already exists for this application");
		}

		Offer offer = new Offer();
		offer.setJobApplication(application);
		offer.setSalary(request.salary());
		offer.setStartDate(request.startDate());
		Offer saved = offerRepository.save(offer); // status mặc định PENDING

		applicationService.changeStatus(application, ApplicationStatus.OFFERED);
		return saved;
	}

	// Recruiter hủy offer (chuyển trạng thái sang CANCELLED, hoàn trả trạng thái đơn)
	@Transactional
	public Offer cancel(Long id, User user) {
		Offer offer = offerRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

		// Phải là recruiter đăng tin đó (Admin không có quyền hủy offer)
		boolean isOwner = user.getRole() == Role.RECRUITER
				&& offer.getJobApplication().getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel offers of your own jobs");
		}

		// Chỉ hủy được khi offer còn PENDING
		if (offer.getStatus() != OfferStatus.PENDING) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Only pending offers can be cancelled");
		}

		offer.setStatus(OfferStatus.CANCELLED);
		Offer saved = offerRepository.save(offer);

		// Trả đơn ứng tuyển về trạng thái trước đó
		JobApplication application = offer.getJobApplication();
		boolean hasInterview = slotRepository.existsByJobApplicationId(application.getId());
		ApplicationStatus prevStatus = hasInterview ? ApplicationStatus.INTERVIEWING : ApplicationStatus.SHORTLISTED;
		applicationService.changeStatus(application, prevStatus);

		// Thông báo cho ứng viên
		notificationService.notify(application.getCandidate(),
				"The offer for \"" + application.getJobListing().getTitle() + "\" has been cancelled by the recruiter");

		return saved;
	}

	// Recruiter xóa hoàn toàn offer khỏi hệ thống
	@Transactional
	public void delete(Long id, User user) {
		Offer offer = offerRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

		boolean isOwner = user.getRole() == Role.RECRUITER
				&& offer.getJobApplication().getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete offers of your own jobs");
		}

		if (offer.getStatus() != OfferStatus.PENDING && offer.getStatus() != OfferStatus.CANCELLED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Cannot delete an offer that has already been accepted or rejected");
		}

		JobApplication application = offer.getJobApplication();
		offerRepository.delete(offer);

		if (application.getStatus() == ApplicationStatus.OFFERED) {
			boolean hasInterview = slotRepository.existsByJobApplicationId(application.getId());
			ApplicationStatus prevStatus = hasInterview ? ApplicationStatus.INTERVIEWING : ApplicationStatus.SHORTLISTED;
			applicationService.changeStatus(application, prevStatus);
		}
	}

	// Ứng viên xem các offer mình nhận được
	public Page<Offer> getMine(Long candidateId, Pageable pageable) {
		return offerRepository.findByJobApplicationCandidateId(candidateId, pageable);
	}

	// Recruiter xem offer của các tin mình đăng; admin xem tất cả
	public Page<Offer> getAll(User user, Pageable pageable) {
		if (user.getRole() == Role.ADMIN) {
			return offerRepository.findAll(pageable);
		}
		return offerRepository.findByJobApplicationJobListingRecruiterId(user.getId(), pageable);
	}

	// Ứng viên trả lời offer: accept = true là chấp nhận, false là từ chối
	public Offer respond(Long id, boolean accept, User candidate) {
		Offer offer = offerRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

		// Chỉ chính ứng viên nhận offer mới được trả lời
		if (!offer.getJobApplication().getCandidate().getId().equals(candidate.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your offer");
		}

		// Chỉ trả lời được khi offer còn PENDING (đã trả lời rồi thì không đổi ý được)
		if (offer.getStatus() != OfferStatus.PENDING) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This offer has already been answered");
		}

		// Toán tử ba ngôi: điều kiện ? giá trị nếu đúng : giá trị nếu sai
		offer.setStatus(accept ? OfferStatus.ACCEPTED : OfferStatus.REJECTED);

		Offer saved = offerRepository.save(offer);

		// Báo cho recruiter biết ứng viên đã chấp nhận hay từ chối
		notificationService.notify(offer.getJobApplication().getJobListing().getRecruiter(),
				candidate.getFullName() + (accept ? " accepted" : " rejected") + " the offer for \""
						+ offer.getJobApplication().getJobListing().getTitle() + "\"");

		return saved;
	}
}
