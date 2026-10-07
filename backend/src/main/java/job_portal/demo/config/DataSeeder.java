package job_portal.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import job_portal.demo.entity.Role;
import job_portal.demo.entity.User;
import job_portal.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component // Báo Spring: tự tạo object của class này
@RequiredArgsConstructor
// CommandLineRunner: Spring tự gọi hàm run() MỘT LẦN ngay sau khi app khởi động xong
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {
		// Chỉ tạo khi chưa có admin nào, để chạy app nhiều lần không bị tạo trùng
		if (!userRepository.existsByEmail("admin@jobportal.com")) {
			User admin = new User();
			admin.setEmail("admin@jobportal.com");
			admin.setPassword(passwordEncoder.encode("Admin@123")); // vẫn phải băm mật khẩu
			admin.setFullName("System Admin");
			admin.setRole(Role.ADMIN);
			userRepository.save(admin);
		}
	}
}
