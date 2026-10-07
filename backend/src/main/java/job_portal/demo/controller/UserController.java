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
import job_portal.demo.dto.UserCreateRequest;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

	private final UserService userService;

	// GET
	// /api/users?role=RECRUITER&keyword=nam&page=0&size=10&sortBy=email&sortDir=asc
	@GetMapping
	public Page<User> list(@RequestParam(required = false) Role role, @RequestParam(defaultValue = "") String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		return userService.search(role, keyword, PageRequest.of(page, size, sort));
	}

	@GetMapping("/{id}")
	public User get(@PathVariable Long id) {
		return userService.getById(id);
	}

	// POST /api/users : admin tạo tài khoản
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public User create(@Valid @RequestBody UserCreateRequest request) {
		return userService.create(request);
	}

	// PATCH /api/users/5/active?value=false : khóa tài khoản số 5
	@PatchMapping("/{id}/active")
	public User setActive(@PathVariable Long id, @RequestParam("value") boolean value,
			// MỚI: @AuthenticationPrincipal lấy ra đúng user đang gọi API,
			// chính là object User mà JwtAuthFilter đã cất vào request.
			@AuthenticationPrincipal User actor) {
		return userService.setActive(id, value, actor);
	}
}
