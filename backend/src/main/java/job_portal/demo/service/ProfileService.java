package job_portal.demo.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.ProfileUpdateRequest;
import job_portal.demo.entity.CandidateProfile;
import job_portal.demo.entity.User;
import job_portal.demo.repository.CandidateProfileRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final CandidateProfileRepository profileRepository;

	public CandidateProfile getOrCreate(User user) {
		return profileRepository.findByUser(user).orElseGet(() -> {
			CandidateProfile profile = new CandidateProfile();
			profile.setUser(user);
			return profileRepository.save(profile);
		});
	}

	public CandidateProfile update(User user, ProfileUpdateRequest request) {
		CandidateProfile profile = getOrCreate(user);
		if (request.phone() != null) {
			profile.setPhone(request.phone());
		}
		if (request.summary() != null) {
			profile.setSummary(request.summary());
		}
		if (request.avatarUrl() != null) {
			profile.setAvatarUrl(request.avatarUrl());
		}
		if (request.attachmentUrl() != null) {
			profile.setAttachmentUrl(request.attachmentUrl());
		}
		return profileRepository.save(profile);
	}

	public CandidateProfile getByUserId(Long userId) {
		return profileRepository.findByUserId(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
	}
}
