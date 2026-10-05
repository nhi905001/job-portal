package job_portal.demo.config;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer { // Implement interface này để tùy chỉnh Spring MVC

	@Value("${app.upload-dir:uploads}")
	private String uploadDir;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		Path dir = Path.of(uploadDir).toAbsolutePath().normalize();
		try {
			Files.createDirectories(dir);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
		String location = dir.toUri().toString(); // Dạng file:///C:/.../uploads
		if (!location.endsWith("/")) { // Đường dẫn thư mục phải kết thúc bằng "/"
			location += "/";
		}
		// Request vào /files/xxx sẽ được trả bằng file xxx trong thư mục uploads
		registry.addResourceHandler("/files/**").addResourceLocations(location);
	}
}
