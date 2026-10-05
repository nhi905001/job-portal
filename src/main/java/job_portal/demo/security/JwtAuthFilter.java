package job_portal.demo.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import job_portal.demo.entity.User;
import job_portal.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

// OncePerRequestFilter: đảm bảo bộ lọc này chạy đúng 1 lần cho mỗi request
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UserRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// Client gửi token trong header: Authorization: Bearer eyJhbGci...
		String header = request.getHeader("Authorization");

		// Có header và đúng dạng "Bearer ..." thì mới xử lý
		if (header != null && header.startsWith("Bearer ")) {
			try {
				// Bỏ 7 ký tự đầu "Bearer " để lấy riêng token, rồi đọc email trong đó
				String email = jwtService.extractEmail(header.substring(7));

				// Tìm user trong DB; chỉ chấp nhận nếu tài khoản còn hoạt động (active)
				userRepository.findByEmail(email).filter(User::isActive).ifPresent(user -> {

					// Tạo "thẻ đã đăng nhập": gồm user, (không cần mật khẩu nên để null), và danh
					// sách quyền.
					// Spring Security quy ước quyền theo role phải có tiền tố "ROLE_".
					var auth = new UsernamePasswordAuthenticationToken(user, null,
							List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

					// Cất thẻ vào "ngăn chứa" của request hiện tại. Từ đây các chỗ khác biết ai
					// đang gọi.
					SecurityContextHolder.getContext().setAuthentication(auth);
				});
			} catch (JwtException | IllegalArgumentException e) {
				// Token sai hoặc hết hạn: bỏ qua, coi như người chưa đăng nhập
			}
		}

		// Cho request đi tiếp tới bước kế tiếp (rồi tới controller)
		chain.doFilter(request, response);
	}
}
