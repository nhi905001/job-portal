package job_portal.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import job_portal.demo.dto.ProfileUpdateRequest;
import job_portal.demo.entity.CandidateProfile;
import job_portal.demo.entity.User;
import job_portal.demo.service.ProfileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

	private final ProfileService profileService;

	// GET /api/profiles/me : lấy hồ sơ của ứng viên hiện tại
	@GetMapping("/me")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public CandidateProfile getMyProfile(@AuthenticationPrincipal User user) {
		return profileService.getOrCreate(user);
	}

	// PUT /api/profiles/me : cập nhật hồ sơ của ứng viên hiện tại
	@PutMapping("/me")
	@PreAuthorize("hasRole('JOB_SEEKER')")
	public CandidateProfile updateMyProfile(@AuthenticationPrincipal User user,
			@RequestBody ProfileUpdateRequest request) {
		return profileService.update(user, request);
	}

	// GET /api/profiles/user/{userId} : recruiter hoặc admin xem hồ sơ ứng viên
	@GetMapping("/user/{userId}")
	@PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
	public CandidateProfile getByUserId(@PathVariable Long userId) {
		return profileService.getByUserId(userId);
	}
}
