# Job Portal — Tài liệu API cho Frontend

Backend Spring Boot + MySQL · cập nhật 11/10/2026 · Base URL: `http://localhost:8081`

## 1. Tổng quan

Job Portal kết nối người tìm việc và nhà tuyển dụng. Backend là REST API trả JSON, xác thực bằng JWT, có 3 role.

| Role | Là ai | Làm được gì |
|---|---|---|
| `JOB_SEEKER` | Người tìm việc (tự đăng ký) | Xem việc, nộp đơn kèm CV, quản lý hồ sơ, đặt lịch phỏng vấn, trả lời offer, viết review |
| `RECRUITER` | Nhà tuyển dụng (do ADMIN tạo, gắn với 1 công ty) | Đăng tin, xử lý đơn, shortlist, tạo lịch phỏng vấn, chấm điểm, gửi offer |
| `ADMIN` | Quản trị | Quản lý user, công ty, địa điểm, ngành, loại việc; xóa review; làm được mọi việc của recruiter |
| Khách | Chưa đăng nhập | Chỉ được GET: việc làm, công ty, địa điểm, ngành, loại việc, review, file đã upload |

**Chạy backend local** (đề yêu cầu FE dùng bản API chạy local): mở project backend, cấu hình MySQL trong `application.properties` (database `job_portal`), chạy `DemoApplication` (hoặc `mvnw spring-boot:run`). API chạy ở cổng 8081. Lần đầu chỉ có sẵn tài khoản admin: `admin@jobportal.com` / `Admin@123`. Backend bật CORS cho `http://localhost:*`.

## 2. Quy ước chung

- Header: `Content-Type: application/json`. API cần đăng nhập thêm `Authorization: Bearer <token>`.
- Ngày: `2026-12-31`. Ngày giờ: `2026-10-20T09:00:00` (không múi giờ). Tiền: số (VND), ví dụ `15000000`.
- Enum luôn là chuỗi IN HOA (mục 4).
- Gửi lên dùng id phẳng (ví dụ `companyId`). Nhận về là object lồng nhau (ví dụ `company: { id, name, ... }`).
- Password không bao giờ được trả về.

**Phân trang** (mọi API danh sách): query `page` (bắt đầu từ 0), `size` (mặc định 10), `sortBy` (tên field, mặc định `id`), `sortDir` (`asc` hoặc `desc`), và `keyword` nếu có. Response dạng `{ content: [...], totalElements, totalPages, number, size, first, last, empty }`. FE chỉ cần `content`, `totalElements`, `totalPages`, `number`.

**Lỗi**

| Mã | Ý nghĩa | FE xử lý |
|---|---|---|
| 400 | Dữ liệu sai | Validation: `{ message, errors: { tenField: lyDo } }`, hiện lỗi dưới từng ô. Lỗi nghiệp vụ: `{ status, error, message, path }`, hiện `message` |
| 401 | Chưa đăng nhập, token sai hoặc hết hạn, sai mật khẩu | Xóa token, chuyển về trang đăng nhập |
| 403 | Đã đăng nhập nhưng không đủ quyền, hoặc tài khoản bị khóa | Báo không có quyền |
| 404 | Không tìm thấy | Báo không tìm thấy |
| 409 | Trùng hoặc vi phạm quy tắc (nộp đơn 2 lần, slot đã đặt, xóa bản ghi đang được dùng...) | Hiện `message` |

## 3. Xác thực

- `POST /api/auth/register` body `{ email, password, fullName }` → 201 User. Luôn tạo `JOB_SEEKER`. Email trùng → 409.
- `POST /api/auth/login` body `{ email, password }` → `{ token, user }`. Sai thông tin → 401. Tài khoản bị khóa → 403.
- FE lưu `token` và `user` sau khi đăng nhập. Dùng `user.role` để ẩn/hiện menu và chặn route. Token sống 24 giờ, hết hạn thì API trả 401. Không có refresh token và không có API `/me`.
- Recruiter và Admin không tự đăng ký. Admin tạo qua `POST /api/users`.

## 4. Enum

| Tên | Giá trị |
|---|---|
| `Role` | `ADMIN`, `RECRUITER`, `JOB_SEEKER` |
| `JobStatus` | `OPEN` (đang tuyển), `CLOSED` (đã đóng), `DRAFT` (nháp) |
| `ApplicationStatus` | `APPLIED`, `SHORTLISTED`, `INTERVIEWING`, `OFFERED`, `REJECTED` |
| `OfferStatus` | `PENDING`, `ACCEPTED`, `REJECTED` |

## 5. Danh sách API

### 5.1 Danh mục, công ty, địa điểm

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `GET /api/industries`, `/api/job-types`, `/api/companies` | Công khai | keyword, page, size, sortBy, sortDir | Page |
| `GET /api/locations` | Công khai | như trên, thêm `companyId` để lọc | Page |
| `GET <danh-mục>/{id}` | Công khai | | 1 object |
| `POST <danh-mục>` | ADMIN | industries và job-types: `{ name }`. companies: `{ name, description, website, logoUrl }`. locations: `{ companyId, address, city }` | 201 |
| `PUT <danh-mục>/{id}` | ADMIN | như POST | 200 |
| `DELETE <danh-mục>/{id}` | ADMIN | | 204. Đang được dùng → lỗi (409 hoặc 500) |

### 5.2 Người dùng (chỉ ADMIN)

| API | Tham số / body | Trả về |
|---|---|---|
| `GET /api/users` | `role`, `keyword`, page, size, sortBy, sortDir | Page User |
| `GET /api/users/{id}` | | User |
| `POST /api/users` | `{ email, password, fullName, role, companyId }`. `companyId` bắt buộc nếu role là `RECRUITER` | 201 User |
| `PATCH /api/users/{id}/active?value=false` | `value` true để mở khóa, false để khóa. Không tự khóa mình được (400) | User |

### 5.3 Tin tuyển dụng

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `GET /api/job-listings` | Công khai | `keyword` (tìm theo tiêu đề), `companyId`, `jobTypeId`, `industryId`, `recruiterId`, `status`, page, size, sortBy, sortDir (mặc định `desc`) | Page JobListing |
| `GET /api/job-listings/{id}` | Công khai | | `{ jobListing, description }` |
| `POST /api/job-listings` | RECRUITER, ADMIN | body bên dưới | 201 `{ jobListing, description }` |
| `PUT /api/job-listings/{id}` | Chủ tin hoặc ADMIN | như POST | 200 |
| `DELETE /api/job-listings/{id}` | Chủ tin hoặc ADMIN | | 204. Tin đã có đơn → 409 (hãy đổi `status` sang `CLOSED`) |

Body tạo hoặc sửa tin: `title`, `companyId` (RECRUITER bỏ trống vì tự lấy công ty của mình, ADMIN bắt buộc), `jobTypeId`, `industryId`, `locationId` (phải thuộc đúng công ty đó), `salaryMin`, `salaryMax`, `deadline`, `status` (bỏ trống là `OPEN`), `responsibilities`, `requirements`, `benefits`.

Recruiter muốn xem tin của mình: gọi `GET /api/job-listings?recruiterId=<user.id>` (có thể lọc thêm `status`).

### 5.4 Hồ sơ ứng viên và upload file

| API | Quyền | Body | Trả về |
|---|---|---|---|
| `GET /api/profiles/me` | `JOB_SEEKER` | | CandidateProfile (lần đầu tự tạo hồ sơ trống) |
| `PUT /api/profiles/me` | `JOB_SEEKER` | `{ phone, summary, avatarUrl, attachmentUrl }` | CandidateProfile |
| `GET /api/profiles/user/{userId}` | RECRUITER, ADMIN | | CandidateProfile hoặc 404 |
| `POST /api/files` | Đã đăng nhập | multipart/form-data, field `file` | `{ url }`, ví dụ `/files/3f2b....pdf` |
| `GET /files/{ten-file}` | Công khai | | Nội dung file |

**Luồng upload:** (1) gửi file lên `POST /api/files` bằng `FormData` (để trình duyệt tự đặt Content-Type), nhận `url`. (2) gửi chuỗi `url` đó vào `resumeUrl` (đơn ứng tuyển), `avatarUrl` hoặc `attachmentUrl` (hồ sơ), `logoUrl` (công ty). (3) Hiển thị file bằng `http://localhost:8081` + `url`. Cho phép: pdf, doc, docx, png, jpg, jpeg, gif, webp, tối đa 10MB. File sai loại → 400.

### 5.5 Đơn ứng tuyển

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `POST /api/applications` | `JOB_SEEKER` | `{ jobListingId, resumeUrl, coverLetter }` | 201 JobApplication. Tin không OPEN hoặc quá hạn → 400. Đã nộp rồi → 409 |
| `GET /api/applications/my` | `JOB_SEEKER` | page, size, sortBy, sortDir (mặc định `desc`) | Page đơn của tôi |
| `DELETE /api/applications/{id}` | `JOB_SEEKER` (chủ đơn) | | 204. Chỉ rút được khi đơn đang `APPLIED`, ngược lại 409 |
| `GET /api/applications` | RECRUITER, ADMIN | `jobListingId`, `status`, page, size, sortBy, sortDir | Page. Recruiter chỉ thấy đơn của tin do mình đăng |
| `PATCH /api/applications/{id}/status?value=REJECTED` | RECRUITER (chủ tin) | | JobApplication |

### 5.6 Shortlist

Chỉ RECRUITER (chủ tin) có quyền thêm hoặc xóa. ADMIN chỉ xem danh sách. Ứng viên không gọi được.

| API | Body / tham số | Trả về |
|---|---|---|
| `POST /api/shortlists` | `{ applicationId, note }`. Đơn phải đang `APPLIED`, nếu không → 409. Đơn tự chuyển thành `SHORTLISTED` (Chỉ RECRUITER) | 201 Shortlist |
| `GET /api/shortlists` | page, size, sortBy, sortDir | Page. Recruiter chỉ thấy của mình, Admin thấy tất cả |
| `DELETE /api/shortlists/{id}` | | 204, đơn quay về `APPLIED`. Nếu đơn đã đi xa hơn → 409 (Chỉ RECRUITER) |

### 5.7 Phỏng vấn

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `GET /api/interview-slots` | Đã đăng nhập | `jobListingId`, `onlyFree`, page, size, sortBy (mặc định `startTime`), sortDir | Page InterviewSlot. `JOB_SEEKER` luôn chỉ thấy slot còn trống. RECRUITER chỉ thấy slot của tin mình |
| `POST /api/interview-slots` | RECRUITER (chủ tin) | `{ jobListingId, startTime, endTime, meetingLink }`. `startTime` phải ở tương lai, `endTime` sau `startTime` | 201 |
| `POST /api/interview-slots/{id}/book` | `JOB_SEEKER` | `{ applicationId }`. Đơn phải của mình, cùng tin với slot và đang `SHORTLISTED`. Slot đã đặt → 409. Đơn tự chuyển thành `INTERVIEWING` | 200 InterviewSlot |
| `DELETE /api/interview-slots/{id}` | RECRUITER (chủ tin) | | 204. Slot đã có người đặt → 409 |
| `POST /api/interview-feedbacks` | RECRUITER (chủ tin) | `{ interviewSlotId, score, comment }`. Slot phải đã có người đặt. Mỗi slot một feedback (trùng → 409). Admin không đánh giá | 201 |
| `GET /api/interview-feedbacks/slot/{slotId}` | RECRUITER (chủ tin), ADMIN | | InterviewFeedback hoặc 404 |

### 5.8 Offer

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `POST /api/offers` | RECRUITER (chủ tin) | `{ applicationId, salary, startDate }`. Đơn phải đang `SHORTLISTED` hoặc `INTERVIEWING` (nếu không → 409). Đơn tự chuyển thành `OFFERED`. Admin không gửi offer | 201 Offer (`PENDING`) |
| `GET /api/offers` | RECRUITER, ADMIN | page, size, sortBy, sortDir | Page. Recruiter chỉ thấy của mình |
| `GET /api/offers/my` | `JOB_SEEKER` | như trên | Page offer tôi nhận |
| `PATCH /api/offers/{id}/respond?accept=true` | `JOB_SEEKER` (chủ offer) | `accept` true là chấp nhận, false là từ chối. Chỉ trả lời được 1 lần (409) | Offer |
| `PATCH /api/offers/{id}/cancel` | RECRUITER (chủ tin) | Hủy offer đang `PENDING`. Đơn quay về trạng thái trước (`INTERVIEWING` hoặc `SHORTLISTED`) | Offer (`CANCELLED`) |
| `DELETE /api/offers/{id}` | RECRUITER (chủ tin) | Xóa offer | 204 |

### 5.9 Thông báo và review

| API | Quyền | Tham số / body | Trả về |
|---|---|---|---|
| `GET /api/notifications` | Đã đăng nhập | page, size, sortBy, sortDir | Page thông báo của tôi (mới nhất trước) |
| `GET /api/notifications/unread-count` | Đã đăng nhập | | `{ count }` (số trên biểu tượng chuông) |
| `PATCH /api/notifications/{id}/read` | Chủ thông báo | | Notification (`seen: true`) |
| `GET /api/reviews` | Công khai | `companyId`, page, size, sortBy (ví dụ `rating`), sortDir | Page ReviewResponse |
| `POST /api/reviews` | `JOB_SEEKER` | `{ companyId, rating, comment }`. Mỗi người review 1 công ty 1 lần (409) | 201 ReviewResponse |
| `DELETE /api/reviews/{id}` | ADMIN | | 204 |

Thông báo do hệ thống tự tạo khi: có người nộp đơn (gửi cho recruiter), đơn đổi trạng thái (gửi cho ứng viên), ứng viên đặt lịch hoặc trả lời offer (gửi cho recruiter). FE nên gọi `unread-count` định kỳ hoặc khi chuyển trang.

## 6. Hình dạng dữ liệu trả về

Các object liên quan được lồng nguyên vẹn, không chỉ có id.

| Object | Các field |
|---|---|
| User | id, email, fullName, role, active, company (object hoặc null) |
| Company | id, name, description, website, logoUrl |
| CompanyLocation | id, company, address, city |
| JobListing | id, title, company, recruiter (User), jobType, industry, location, salaryMin, salaryMax, deadline, status, createdAt |
| JobDescription | id, jobListing, responsibilities, requirements, benefits |
| CandidateProfile | id, user, phone, summary, avatarUrl, attachmentUrl |
| JobApplication | id, jobListing, candidate (User), resumeUrl, coverLetter, status, appliedAt |
| Shortlist | id, recruiter, jobApplication, note, createdAt |
| InterviewSlot | id, jobListing, startTime, endTime, meetingLink, jobApplication (null nghĩa là slot còn trống) |
| InterviewFeedback | id, interviewSlot, score, comment, createdAt |
| Offer | id, jobApplication, salary, startDate, status, createdAt |
| Notification | id, user, message, seen, createdAt |
| ReviewResponse | id, companyId, reviewerName, rating, comment, createdAt |

## 7. Luồng nghiệp vụ

Vòng đời một đơn ứng tuyển:

`APPLIED` → (recruiter shortlist) → `SHORTLISTED` → (ứng viên đặt lịch) → `INTERVIEWING` → (recruiter gửi offer) → `OFFERED`

- Recruiter có thể chuyển đơn sang `REJECTED` bất kỳ lúc nào bằng `PATCH .../status`.
- Ứng viên chỉ rút đơn (xóa) khi đơn còn `APPLIED`.
- Sau phỏng vấn, recruiter chấm điểm bằng interview feedback (không đổi trạng thái đơn).
- Offer bắt đầu `PENDING`, ứng viên chấp nhận hoặc từ chối đúng một lần.
- Nộp đơn chỉ được khi tin `OPEN` và `deadline` chưa qua. Mỗi ứng viên một đơn cho một tin.

FE nên dùng `status` của đơn để quyết định hiện nút nào: đơn `APPLIED` hiện "Shortlist" và "Từ chối" cho recruiter, "Rút đơn" cho ứng viên. Đơn `SHORTLISTED` hiện "Chọn giờ phỏng vấn" cho ứng viên. Đơn `INTERVIEWING` hiện "Chấm điểm" và "Gửi offer" cho recruiter.

## 8. Quy tắc validate (dùng cho Zod, validate khi blur)

| Form | Quy tắc |
|---|---|
| Đăng ký | email đúng định dạng; password tối thiểu 6 ký tự; fullName bắt buộc |
| Đăng nhập | email và password bắt buộc |
| Ngành, loại việc | name bắt buộc, tối đa 100 ký tự |
| Công ty | name bắt buộc, tối đa 150 ký tự |
| Địa điểm | companyId, address, city bắt buộc |
| Tạo user (admin) | email, password (từ 6 ký tự), fullName, role bắt buộc; companyId bắt buộc khi role là RECRUITER |
| Tin tuyển dụng | title bắt buộc (tối đa 255); jobTypeId, industryId, locationId, deadline bắt buộc; salaryMin và salaryMax từ 0 trở lên và salaryMin không lớn hơn salaryMax; responsibilities và requirements bắt buộc; benefits tùy chọn; companyId bắt buộc nếu là ADMIN |
| Nộp đơn | jobListingId và resumeUrl bắt buộc (phải upload CV trước) |
| Hồ sơ | không trường nào bắt buộc |
| Khung giờ phỏng vấn | jobListingId bắt buộc; startTime ở tương lai; endTime sau startTime |
| Feedback | interviewSlotId bắt buộc; score là số nguyên từ 1 đến 10 |
| Offer | applicationId bắt buộc; salary lớn hơn 0; startDate ở tương lai |
| Review | companyId bắt buộc; rating là số nguyên từ 1 đến 5 |

Backend vẫn kiểm tra lại tất cả, nên lỗi 400 phải được hiển thị đúng ô mà server báo.

## 9. Gợi ý tổ chức FE

Đề yêu cầu tách theo router thay vì tách ứng dụng: `/public` và `/admin`.

- **`/public`** (khách và `JOB_SEEKER`): trang chủ danh sách việc làm có tìm kiếm, lọc theo công ty, loại việc, ngành, phân trang; chi tiết việc kèm review công ty; đăng ký và đăng nhập; hồ sơ cá nhân (upload ảnh và file); form ứng tuyển kèm upload CV; đơn của tôi (có nút rút đơn); chọn giờ phỏng vấn; offer của tôi (chấp nhận hoặc từ chối); chuông thông báo; viết review.
- **`/admin`** (RECRUITER và ADMIN): Recruiter: tin của tôi (CRUD), đơn ứng tuyển theo tin và trạng thái, shortlist, khung giờ phỏng vấn, chấm điểm, offer, thông báo. Admin: quản lý user (tạo recruiter, khóa tài khoản), công ty, địa điểm, ngành, loại việc, kiểm duyệt review.

Chặn route theo `user.role`, nhưng API vẫn tự trả 403 nếu sai quyền. Thao tác nguy hiểm (xóa, khóa tài khoản, từ chối đơn, rút đơn) phải dùng hộp thoại xác nhận của Material UI, không dùng `window.confirm`.

Nên tạo một axios instance chung: `baseURL` lấy từ biến môi trường, interceptor request tự gắn `Authorization: Bearer`, interceptor response gặp 401 thì xóa token và về trang đăng nhập. Nên bọc mỗi API thành một hàm trong một lớp riêng để dễ đổi giữa mock và API thật.

## 10. Mock data khi API chưa sẵn sàng

Theo đề, nếu API chưa xong thì FE tự tạo mock data. Dùng đúng hình dạng ở mục 6 và đúng khuôn phân trang ở mục 2 để khi chuyển sang API thật không phải sửa component. Có thể dùng MSW hoặc file mock, bật tắt bằng một biến môi trường.

## 11. Thứ tự tạo dữ liệu mẫu để test

1. Đăng nhập admin, tạo ngành và loại việc (`POST /api/industries`, `/api/job-types`).
2. Tạo công ty (`POST /api/companies`), rồi địa điểm của công ty đó (`POST /api/locations`).
3. Tạo recruiter gắn với công ty (`POST /api/users`, role `RECRUITER`, có `companyId`).
4. Đăng nhập recruiter, đăng tin (`POST /api/job-listings`).
5. Đăng ký một job seeker, đăng nhập, upload CV (`POST /api/files`), nộp đơn (`POST /api/applications`).
6. Recruiter shortlist, tạo khung giờ; job seeker đặt giờ; recruiter chấm điểm và gửi offer; job seeker trả lời offer.

## 12. Giới hạn đã biết

- Danh sách việc làm công khai trả cả object `recruiter` (có email) và các object lồng khác. FE không nên hiển thị email recruiter.
- Không có refresh token, không có đổi hoặc quên mật khẩu, không có API `/me`.
- Hai ứng viên bấm đặt cùng một khung giờ đúng cùng lúc có thể cùng thành công.
- Xóa danh mục hoặc công ty đang được dùng sẽ bị từ chối ở tầng database, thông báo lỗi có thể chưa thân thiện.
