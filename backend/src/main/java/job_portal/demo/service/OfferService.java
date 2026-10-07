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
import job_portal.demo.repository.OfferRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfferService {

	private final OfferRepository offerRepository;
	private final JobApplicationService applicationService;
	private final NotificationService notificationService;

	// Recruiter gửi offer. Ghi 2 chỗ (lưu Offer + đổi trạng thái đơn) nên cần
	// @Transactional.
	@Transactional
	public Offer create(OfferRequest request, User user) {
		JobApplication application = applicationService.getById(request.applicationId());

		// Phải là recruiter đăng tin đó (hoặc admin)
		boolean isAdmin = user.getRole() == Role.ADMIN;
		boolean isOwner = application.getJobListing().getRecruiter().getId().equals(user.getId());
		if (!isAdmin && !isOwner) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only send offers for your own jobs");
		}

		// Chỉ gửi offer cho ứng viên ĐÃ ĐẶT LỊCH PHỎNG VẤN (đơn đang INTERVIEWING)
		if (application.getStatus() != ApplicationStatus.INTERVIEWING) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Offers can only be sent to applications in INTERVIEWING status");
		}

		// Mỗi đơn chỉ có một offer
		if (offerRepository.existsByJobApplicationId(application.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "An offer already exists for this application");
		}

		Offer offer = new Offer();
		offer.setJobApplication(application);
		offer.setSalary(request.salary());
		offer.setStartDate(request.startDate());
		Offer saved = offerRepository.save(offer); // status mặc định PENDING

		applicationService.changeStatus(application, ApplicationStatus.OFFERED);
		return saved;
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
