package job_portal.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

	// Danh sách đuôi file được phép. Set.of(...) = tập hợp cố định các giá trị.
	// Chỉ cho phép tài liệu và ảnh, chặn file lạ (ví dụ .exe, .jsp) mà kẻ xấu có
	// thể tải lên.
	private static final Set<String> ALLOWED = Set.of(".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".gif",
			".webp");

	private final Path root; // Đường dẫn tới thư mục chứa file

	// Constructor tự viết (không dùng Lombok) vì cần chuẩn bị thư mục.
	// @Value đọc app.upload-dir từ application.properties; ":uploads" = giá trị mặc
	// định nếu không khai báo.
	public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) throws IOException {
		// toAbsolutePath: đổi thành đường dẫn đầy đủ; normalize: dọn các đoạn thừa như
		// "./" hoặc ".."
		this.root = Path.of(uploadDir).toAbsolutePath().normalize();
		Files.createDirectories(root); // Chưa có thư mục thì tạo
	}

	// Lưu file và trả về đường dẫn để client dùng
	public String store(MultipartFile file) { // MultipartFile = file client gửi lên

		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
		}

		// Lấy đuôi file từ tên gốc: "cv-cua-nhi.PDF" → ".pdf"
		String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
		int dot = original.lastIndexOf('.'); // Vị trí dấu chấm cuối cùng
		String ext = dot >= 0 ? original.substring(dot).toLowerCase() : "";

		if (!ALLOWED.contains(ext)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File type not allowed. Allowed: " + ALLOWED);
		}

		// ĐỔI TÊN thành chuỗi ngẫu nhiên + đuôi file. Có 2 lý do:
		// 1) Hai người cùng upload "cv.pdf" không đè lên nhau.
		// 2) Không dùng tên do client gửi nên không ai nhét được "../../" để ghi file
		// ra ngoài thư mục.
		String name = UUID.randomUUID() + ext;

		// try (...) tự đóng luồng đọc file sau khi dùng xong
		try (InputStream in = file.getInputStream()) {
			Files.copy(in, root.resolve(name), StandardCopyOption.REPLACE_EXISTING); // Ghi vào uploads/<tên>
		} catch (IOException e) {
			throw new UncheckedIOException(e); // Lỗi ghi file: đổi thành lỗi không bắt buộc xử lý (trả 500)
		}

		return "/files/" + name; // Đường dẫn trả cho client
	}
}
