package job_portal.demo.dto;

import job_portal.demo.entity.User;

public record AuthResponse(String token, User user) {
}