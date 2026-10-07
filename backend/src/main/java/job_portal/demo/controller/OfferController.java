package job_portal.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.OfferRequest;
import job_portal.demo.entity.Offer;
import job_portal.demo.entity.User;
import job_portal.demo.service.OfferService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

	private final OfferService offerService;

	// POST /api/offers : recruiter gửi offer
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public Offer create(@Valid @RequestBody OfferRequest request, @AuthenticationPrincipal User user) {
		return offerService.create(request, user);
	}

	// GET /api/offers : recruiter/admin xem các offer đã gửi
	@GetMapping
	@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
	public Page<Offer> list(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return offerService.getAll(user, PageRequest.of(page, size, sort));
	}

	// GET /api/offers/my : ứng viên xem offer mình nhận được
	@GetMapping("/my")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public Page<Offer> mine(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return offerService.getMine(user.getId(), PageRequest.of(page, size, sort));
	}

	// PATCH /api/offers/3/respond?accept=true : ứng viên chấp nhận (false = từ
	// chối)
	@PatchMapping("/{id}/respond")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public Offer respond(@PathVariable Long id, @RequestParam boolean accept, @AuthenticationPrincipal User user) {
		return offerService.respond(id, accept, user);
	}
}
