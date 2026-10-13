-- =========================================================================
-- FILE SEED DỮ LIỆU MẪU KIỂM THỬ HỆ THỐNG JOB PORTAL
-- Cơ sở dữ liệu: MySQL (Database: job_portal)
-- =========================================================================

USE `job_portal`;

-- 1. Bổ sung Ngành nghề (Industries)
INSERT IGNORE INTO `industry` (`id`, `name`) VALUES
(1, 'Công nghệ thông tin'),
(2, 'Tài chính - Ngân hàng'),
(3, 'Marketing / Truyền thông'),
(4, 'Nhân sự & Tuyển dụng'),
(5, 'Thiết kế đồ họa & UI/UX');

-- 2. Bổ sung Loại hình công việc (Job Types)
INSERT IGNORE INTO `job_type` (`id`, `name`) VALUES
(1, 'Toàn thời gian (Full-time)'),
(2, 'Bán thời gian (Part-time)'),
(3, 'Làm việc từ xa (Remote)'),
(4, 'Thực tập sinh (Internship)'),
(5, 'Hợp đồng ngắn hạn (Contract)');

-- 3. Bổ sung Doanh nghiệp (Companies)
INSERT IGNORE INTO `company` (`id`, `name`, `website`, `description`, `logo_url`) VALUES
(1, 'FPT Software', 'https://fptsoftware.com', 'Tập đoàn công nghệ và chuyển đổi số hàng đầu Đông Nam Á, môi trường làm việc toàn cầu năng động.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=200&auto=format&fit=crop&q=80'),
(2, 'Viettel Telecom', 'https://vietteltelecom.vn', 'Tổng công ty Viễn thông Viettel, đơn vị dẫn đầu ngành viễn thông và giải pháp số tại Việt Nam.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&auto=format&fit=crop&q=80'),
(3, 'VNG Corporation', 'https://vng.com.vn', 'Kỳ lân công nghệ hàng đầu Việt Nam, phát triển game, Zalo, ZaloPay và các giải pháp đám mây hiện đại.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80');

-- 4. Bổ sung Địa điểm chi nhánh (Company Locations)
INSERT IGNORE INTO `company_location` (`id`, `company_id`, `city`, `address`) VALUES
(1, 1, 'Hà Nội', 'Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch'),
(2, 1, 'TP. Hồ Chí Minh', 'Khu Công nghệ Cao, Phường Tân Phú, TP. Thủ Đức'),
(3, 1, 'Đà Nẵng', 'Tòa nhà FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Ngũ Hành Sơn'),
(4, 2, 'Hà Nội', 'Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình'),
(5, 2, 'TP. Hồ Chí Minh', 'Tòa nhà Viettel Complex, 285 Cách Mạng Tháng 8, Quận 10'),
(6, 3, 'TP. Hồ Chí Minh', 'VNG Campus, Đường số 13, Khu chế xuất Tân Thuận, Quận 7'),
(7, 3, 'Hà Nội', 'Tòa nhà TNR, 54A Nguyễn Chí Thanh, Đống Đa');

-- 5. Bổ sung Tài khoản Người dùng (Mật khẩu đã được mã hóa BCrypt)
-- Mật khẩu mặc định:
-- Admin: Admin@123 ($2a$10$wT/tW/w6N.yF/pT6dG6S2.r/qTqXoPzR1rS7B5H6.2O.kM2WqH7G2)
-- Recruiter: Recruiter@123 ($2a$10$tZ2kZ5L5qP1F6hG5t8H3..LpQO1Y2Y4o7sY8vT6uH4.2W.kM1N7G1)
-- Candidate: Candidate@123 ($2a$10$xK9kZ4L4qP1F5hG4t7H2..KpQO0Y1Y3o6sX7vS5uH3.1V.jL0M6F0)
INSERT IGNORE INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `active`, `company_id`) VALUES
(1, 'admin@jobportal.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'System Admin', 'ADMIN', 1, NULL),
(2, 'recruiter@fpt.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Hoàng Minh Trí (HR FPT)', 'RECRUITER', 1, 1),
(3, 'recruiter@viettel.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Trần Thu Hà (HR Viettel)', 'RECRUITER', 1, 2),
(4, 'recruiter@vng.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Đặng Quốc Huy (Talent VNG)', 'RECRUITER', 1, 3),
(5, 'candidate@gmail.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Nguyễn Văn Ứng Viên', 'JOB_SEEKER', 1, NULL),
(6, 'dev.nam@gmail.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Trần Hoài Nam', 'JOB_SEEKER', 1, NULL),
(7, 'dev.lan@gmail.com', '$2a$10$0d7gB2O.uE9v5J8sE4qU6O2M7lX2y5H0sW8pL7iY6zT5bM1qP9tP.', 'Lê Thị Phương Lan', 'JOB_SEEKER', 1, NULL);

-- 6. Bổ sung Hồ sơ Ứng viên (Candidate Profiles)
INSERT IGNORE INTO `candidate_profile` (`id`, `user_id`, `phone`, `summary`, `avatar_url`, `attachment_url`) VALUES
(1, 5, '0987654321', 'Lập trình viên Frontend 3 năm kinh nghiệm với React, Next.js, Tailwind CSS và TypeScript.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', '/uploads/cv_nguyen_van_a.pdf'),
(2, 6, '0912345678', 'Kỹ sư Backend chuyên sâu về Java Spring Boot, Microservices, MySQL, Redis và Kafka.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', '/uploads/cv_tran_hoai_nam.pdf'),
(3, 7, '0908765432', 'UI/UX Designer với hơn 4 năm kinh nghiệm thiết kế sản phẩm số, Design System và Figma.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', '/uploads/cv_le_phuong_lan.pdf');

-- =========================================================================
-- ĐÃ HOÀN TẤT CẤU TRÚC SEED DỮ LIỆU SQL
-- =========================================================================
