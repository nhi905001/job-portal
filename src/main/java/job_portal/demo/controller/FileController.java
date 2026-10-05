package job_portal.demo.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import job_portal.demo.service.FileStorageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

	private final FileStorageService storageService;

	// POST /api/files : gửi file dạng multipart/form-data (kiểu form có ô chọn
	// file)
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> upload(@RequestParam("file") MultipartFile file) { // Lấy phần có tên "file" trong form
		// Map.of("url", ...) tạo JSON {"url": "/files/abc123.pdf"}
		return Map.of("url", storageService.store(file));
	}
}
