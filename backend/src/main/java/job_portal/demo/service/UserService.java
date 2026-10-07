package job_portal.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import job_portal.demo.dto.UserCreateRequest;
import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final CompanyService companyService; // để đổi companyId thành object Company (như CompanyLocationService)
	private final PasswordEncoder passwordEncoder;

	public Page<User> search(Role role, String keyword, Pageable pageable) {
		return userRepository.search(role, keyword, pageable);
	}

	public User getById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	// Admin tạo tài khoản. Recruiter bắt buộc phải thuộc một công ty.
	public User create(UserCreateRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
		}

		User user = new User();
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password())); // vẫn phải băm mật khẩu
		user.setFullName(request.fullName());
		user.setRole(request.role());

		// Chỉ recruiter mới gắn công ty. Thiếu companyId thì báo lỗi 400 (dữ liệu
		// client gửi lên sai).
		if (request.role() == Role.RECRUITER) {
			if (request.companyId() == null) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recruiter must belong to a company");
			}
			user.setCompany(companyService.getById(request.companyId())); // không có công ty đó thì tự 404
		}

		return userRepository.save(user);
	}

	// Khóa hoặc mở khóa tài khoản. "actor" = người đang thực hiện (chính là admin
	// đang đăng nhập).
	public User setActive(Long id, boolean active, User actor) {
		User user = getById(id);
		// Chặn admin tự khóa chính mình (khóa xong là không ai đăng nhập quản trị được
		// nữa)
		if (user.getId().equals(actor.getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot change your own status");
		}
		user.setActive(active);
		return userRepository.save(user);
	}
}
