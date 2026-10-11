package job_portal.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import job_portal.demo.repository.UserRepository;
import job_portal.demo.security.JwtAuthFilter;
import job_portal.demo.security.JwtService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity // Bật @PreAuthorize để gắn quyền lên từng hàm controller
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
		http
				// MỚI (CORS): bật CORS, dùng cấu hình ở bean corsConfigurationSource() bên dưới
				.cors(Customizer.withDefaults())

				.csrf(csrf -> csrf.disable())

				// STATELESS = server không nhớ phiên đăng nhập, mỗi request tự mang token theo
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// Chưa đăng nhập mà gọi API cần đăng nhập thì trả 401
				.exceptionHandling(e -> e.authenticationEntryPoint(
						(req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")))

				.authorizeHttpRequests(auth -> auth
						// MỚI (CORS): request OPTIONS là trình duyệt "hỏi trước" xem có được gọi API
						// không,
						// request này không mang token nên phải cho qua
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						// Trang lỗi nội bộ của Spring: phải cho qua, nếu không lỗi 404/400 bị đổi thành
						// 401
						.requestMatchers("/error").permitAll()
						// Đăng ký, đăng nhập và xem file thì ai cũng gọi được
						.requestMatchers("/api/auth/register", "/api/auth/login", "/files/**").permitAll()
						// Khách chưa đăng nhập được XEM (chỉ GET) các danh sách này
						.requestMatchers(HttpMethod.GET, "/api/companies/**", "/api/industries/**", "/api/job-types/**",
								"/api/locations/**", "/api/job-listings/**", "/api/reviews/**")
						.permitAll()
						// Mọi request còn lại bắt buộc phải đăng nhập
						.anyRequest().authenticated())

				// Đặt bộ lọc JWT của mình chạy trước bộ lọc đăng nhập mặc định
				.addFilterBefore(new JwtAuthFilter(jwtService, userRepository),
						UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// MỚI (CORS): quy định những trang web nào được phép gọi API này
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		// Cho phép mọi trang chạy ở localhost (React Vite cổng 5173, CRA cổng 3000...)
		config.setAllowedOriginPatterns(List.of("http://localhost:*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*")); // Cho phép gửi header Authorization

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config); // Áp dụng cho mọi URL
		return source;
	}
}