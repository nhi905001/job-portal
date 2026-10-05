package job_portal.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import job_portal.demo.dto.AuthResponse;
import job_portal.demo.dto.LoginRequest;
import job_portal.demo.dto.RegisterRequest;
import job_portal.demo.entity.User;
import job_portal.demo.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	// POST /api/auth/register
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public User register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

	// POST /api/auth/login
	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}
}