package job_portal.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import job_portal.demo.entity.CandidateProfile;
import job_portal.demo.entity.User;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

	Optional<CandidateProfile> findByUser(User user);

	Optional<CandidateProfile> findByUserId(Long userId);
}
