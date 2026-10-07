# Job Portal - Hệ Thống Tuyển Dụng & Ứng Tuyển Việc Làm

Dự án Monorepo bao gồm toàn bộ mã nguồn **Backend** (Spring Boot) và **Frontend** (React + Vite + Tailwind CSS).

---

## 📁 Cấu trúc thư mục

```
job-portal/
├── backend/                  # Mã nguồn Backend (Spring Boot 3, Java 21, MySQL, JWT)
│   ├── src/
│   ├── pom.xml
│   ├── docker-compose.yml
│   └── README.md             # Tài liệu chi tiết toàn bộ REST APIs & quy ước
│
├── frontend/                 # Mã nguồn Frontend (React 19, Vite, Tailwind CSS, React Router v7)
│   ├── src/
│   │   ├── api/              # Cấu hình Axios Client & Interceptors (Bearer token, error handling)
│   │   ├── context/          # AuthContext quản lý trạng thái đăng nhập & role
│   │   ├── layouts/          # PublicLayout & AdminLayout
│   │   ├── pages/            # Các trang Public, Admin & Auth
│   │   ├── routes/           # ProtectedRoute & PublicOnlyRoute
│   │   └── services/         # API Service calls
│   ├── package.json
│   └── vite.config.js
│
└── README.md                 # Tài liệu hướng dẫn cài đặt & khởi chạy dự án
```

---

## 🚀 Hướng dẫn khởi chạy

### 1. Khởi chạy Backend (Spring Boot)

#### Yêu cầu:
- Java JDK 21+
- MySQL 8.0+ (hoặc dùng Docker Compose có sẵn trong thư mục `backend`)

#### Các bước:
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. (Tùy chọn) Chạy MySQL bằng Docker:
   ```bash
   docker compose up -d
   ```
3. Chạy ứng dụng Spring Boot:
   - Sử dụng Maven Wrapper:
     ```bash
     ./mvnw spring-boot:run
     ```
   - Hoặc mở thư mục `backend` bằng IntelliJ IDEA / Eclipse / VS Code và chạy file `DemoApplication.java`.
4. Backend sẽ chạy tại: `http://localhost:8081`
   - Tài khoản Admin mặc định: `admin@jobportal.com` / `Admin@123`

---

### 2. Khởi chạy Frontend (React + Vite)

#### Yêu cầu:
- Node.js 18+ & npm

#### Các bước:
1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env` nếu cần (đã có cấu hình mặc định kết nối API `http://localhost:8081`):
   ```env
   VITE_API_BASE_URL=http://localhost:8081
   ```
4. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
5. Ứng dụng Frontend chạy tại: `http://localhost:5173` (hoặc cổng do Vite hiển thị).
