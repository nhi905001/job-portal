package job_portal.demo.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import job_portal.demo.entity.User;

@Service
public class JwtService {

	private final SecretKey key; // Khóa dùng để ký token
	private final long expirationMs; // Token sống bao lâu

	// Constructor này tự viết (không dùng Lombok) vì cần xử lý chuỗi secret trước
	// khi lưu.
	public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
		// Đổi chuỗi chữ thành khóa mã hóa HMAC
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationMs = expirationMs;
	}

	// Tạo token cho một user
	public String generateToken(User user) {
		Date now = new Date();
		return Jwts.builder().subject(user.getEmail()) // "Token này của ai": lấy email
				.claim("role", user.getRole().name()) // Thêm thông tin phụ: role (ADMIN/RECRUITER/JOB_SEEKER)
				.issuedAt(now) // Cấp lúc nào
				.expiration(new Date(now.getTime() + expirationMs)) // Hết hạn lúc nào = bây giờ + 24h
				.signWith(key) // KÝ bằng khóa bí mật
				.compact(); // Gom thành chuỗi xxxxx.yyyyy.zzzzz
	}

	// Đọc token và trả về email bên trong. Token sai chữ ký hoặc hết hạn thì ném
	// JwtException.
	public String extractEmail(String token) {
		return Jwts.parser().verifyWith(key) // Kiểm tra chữ ký bằng đúng khóa bí mật
				.build().parseSignedClaims(token) // Giải mã token (đồng thời kiểm tra hết hạn)
				.getPayload() // Lấy phần payload (nội dung)
				.getSubject(); // Lấy "subject" = email lúc mình đã nhét vào
	}
}
