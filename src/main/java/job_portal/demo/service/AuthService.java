package job_portal.demo.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.AuthResponse;
import job_portal.demo.dto.LoginRequest;
import job_portal.demo.dto.RegisterRequest;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.UserRepository;
import job_portal.demo.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public User register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
		}
		User user = new User();
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setFullName(request.fullName());
		user.setRole(Role.JOB_SEEKER);
		return userRepository.save(user);
	}

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(request.email())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
		}

		if (!user.isActive()) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is deactivated");
		}

		return new AuthResponse(jwtService.generateToken(user), user);
	}
}