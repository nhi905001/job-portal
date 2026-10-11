package job_portal.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import job_portal.demo.repository.UserRepository;
import job_portal.demo.security.JwtAuthFilter;
import job_portal.demo.security.JwtService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity // MỚI: bật @PreAuthorize để gắn quyền lên từng hàm controller
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtService jwtService;
	private final UserRepository userRepository;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())

				// MỚI: STATELESS = server không nhớ phiên đăng nhập, mỗi request tự mang token
				// theo
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// MỚI: chưa đăng nhập mà gọi API cần đăng nhập thì trả 401
				.exceptionHandling(e -> e.authenticationEntryPoint(
						(req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")))

				.authorizeHttpRequests(auth -> auth
						// Trang lỗi nội bộ của Spring: phải cho qua, nếu không lỗi 404/400 bị đổi thành
						// 401
						.requestMatchers("/error").permitAll()
						// Đăng ký và đăng nhập thì ai cũng gọi được
						.requestMatchers("/api/auth/register", "/api/auth/login", "/files/**").permitAll()
						// Khách chưa đăng nhập được XEM (chỉ GET) các danh sách này
						.requestMatchers(HttpMethod.GET, "/api/companies/**", "/api/industries/**", "/api/job-types/**",
								"/api/locations/**", "/api/job-listings/**", "/api/reviews/**")
						.permitAll()
						// Mọi request còn lại bắt buộc phải đăng nhập
						.anyRequest().authenticated())

				// MỚI: đặt bộ lọc JWT của mình chạy trước bộ lọc đăng nhập mặc định
				.addFilterBefore(new JwtAuthFilter(jwtService, userRepository),
						UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
