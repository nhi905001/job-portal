"""
Script khởi tạo dữ liệu mẫu (Seed Data) hoàn chỉnh cho Job Portal.
Chạy qua REST API đang hoạt động tại http://localhost:8081
Bao gồm:
- Người dùng: Admin, 3 Nhà tuyển dụng (FPT, Viettel, VNG), 3 Ứng viên (Candidate, Nam, Lan)
- Ngành nghề & Loại hình công việc
- 3 Doanh nghiệp lớn & Địa điểm chi nhánh tại Hà Nội, TP.HCM, Đà Nẵng
- 6 Tin tuyển dụng đa dạng mức lương, ngành nghề
- Hồ sơ ứng viên (Profiles)
- Đơn ứng tuyển (Applications) với nhiều trạng thái: APPLIED, SHORTLISTED, INTERVIEWING, OFFERED
- Danh sách Shortlist
- Khung giờ phỏng vấn (Interview Slots: Đã đặt kèm Feedback, và Còn trống)
- Thư mời nhận việc (Offers)
- Đánh giá công ty (Reviews)
"""

import urllib.request
import urllib.error
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8081"

def api_call(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_msg)
            return {"_error": e.code, "_message": err_json.get("message", err_msg)}
        except Exception:
            return {"_error": e.code, "_message": err_msg}
    except Exception as e:
        return {"_error": 500, "_message": str(e)}

def login(email, password):
    res = api_call("/api/auth/login", method="POST", data={"email": email, "password": password})
    if "_error" in res:
        print(f"[-] Đăng nhập thất bại ({email}): {res['_message']}")
        return None, None
    return res.get("token"), res.get("user")

def main():
    print("=" * 60)
    print(" BẮT ĐẦU KHỞI TẠO DỮ LIỆU MẪU JOB PORTAL")
    print("=" * 60)

    # 1. Đăng nhập Admin
    print("\n[1] Đăng nhập Admin...")
    admin_token, admin_user = login("admin@jobportal.com", "Admin@123")
    if not admin_token:
        print(" Không thể đăng nhập bằng tài khoản Admin mặc định!")
        sys.exit(1)
    print(f"   ✓ Admin đăng nhập thành công: {admin_user.get('fullName')} (#{admin_user.get('id')})")

    # 2. Khởi tạo Danh mục Ngành nghề (Industries)
    print("\n[2] Kiểm tra & Khởi tạo Ngành nghề (Industries)...")
    ind_res = api_call("/api/industries?size=100")
    existing_industries = {item["name"]: item["id"] for item in ind_res.get("content", [])}
    
    industries_to_seed = [
        "Công nghệ thông tin",
        "Tài chính - Ngân hàng",
        "Marketing / Truyền thông",
        "Nhân sự & Tuyển dụng",
        "Thiết kế đồ họa & UI/UX"
    ]
    industry_ids = {}
    for ind_name in industries_to_seed:
        if ind_name in existing_industries:
            industry_ids[ind_name] = existing_industries[ind_name]
            print(f"   - Đã tồn tại ngành: {ind_name} (#{industry_ids[ind_name]})")
        else:
            created = api_call("/api/industries", method="POST", data={"name": ind_name}, token=admin_token)
            if "_error" not in created:
                industry_ids[ind_name] = created.get("id")
                print(f"   ✓ Tạo mới ngành: {ind_name} (#{industry_ids[ind_name]})")
            else:
                print(f"   [-] Lỗi tạo ngành {ind_name}: {created['_message']}")

    # 3. Khởi tạo Loại hình công việc (Job Types)
    print("\n[3] Kiểm tra & Khởi tạo Loại hình công việc (Job Types)...")
    jt_res = api_call("/api/job-types?size=100")
    existing_job_types = {item["name"]: item["id"] for item in jt_res.get("content", [])}
    
    job_types_to_seed = [
        "Toàn thời gian (Full-time)",
        "Bán thời gian (Part-time)",
        "Làm việc từ xa (Remote)",
        "Thực tập sinh (Internship)",
        "Hợp đồng ngắn hạn (Contract)"
    ]
    job_type_ids = {}
    for jt_name in job_types_to_seed:
        if jt_name in existing_job_types:
            job_type_ids[jt_name] = existing_job_types[jt_name]
            print(f"   - Đã tồn tại loại: {jt_name} (#{job_type_ids[jt_name]})")
        else:
            created = api_call("/api/job-types", method="POST", data={"name": jt_name}, token=admin_token)
            if "_error" not in created:
                job_type_ids[jt_name] = created.get("id")
                print(f"   ✓ Tạo mới loại: {jt_name} (#{job_type_ids[jt_name]})")
            else:
                print(f"   [-] Lỗi tạo loại {jt_name}: {created['_message']}")

    # 4. Khởi tạo Doanh nghiệp (Companies)
    print("\n[4] Kiểm tra & Khởi tạo Doanh nghiệp (Companies)...")
    comp_res = api_call("/api/companies?size=100")
    existing_companies = {item["name"]: item["id"] for item in comp_res.get("content", [])}

    companies_data = [
        {
            "name": "FPT Software",
            "website": "https://fptsoftware.com",
            "description": "Tập đoàn công nghệ và chuyển đổi số hàng đầu Đông Nam Á, môi trường làm việc toàn cầu năng động.",
            "logoUrl": "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=200&auto=format&fit=crop&q=80"
        },
        {
            "name": "Viettel Telecom",
            "website": "https://vietteltelecom.vn",
            "description": "Tổng công ty Viễn thông Viettel, đơn vị dẫn đầu ngành viễn thông và giải pháp số tại Việt Nam.",
            "logoUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&auto=format&fit=crop&q=80"
        },
        {
            "name": "VNG Corporation",
            "website": "https://vng.com.vn",
            "description": "Kỳ lân công nghệ hàng đầu Việt Nam, phát triển game, Zalo, ZaloPay và các giải pháp đám mây hiện đại.",
            "logoUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80"
        }
    ]
    company_ids = {}
    for comp in companies_data:
        cname = comp["name"]
        if cname in existing_companies:
            company_ids[cname] = existing_companies[cname]
            print(f"   - Đã tồn tại công ty: {cname} (#{company_ids[cname]})")
        else:
            created = api_call("/api/companies", method="POST", data=comp, token=admin_token)
            if "_error" not in created:
                company_ids[cname] = created.get("id")
                print(f"   ✓ Tạo mới công ty: {cname} (#{company_ids[cname]})")
            else:
                print(f"   [-] Lỗi tạo công ty {cname}: {created['_message']}")

    # 5. Khởi tạo Địa điểm chi nhánh (Company Locations)
    print("\n[5] Kiểm tra & Khởi tạo Địa điểm chi nhánh (Locations)...")
    loc_res = api_call("/api/locations?size=100")
    existing_locations = {f"{item['city']}_{item['address']}": item["id"] for item in loc_res.get("content", [])}

    locations_data = [
        # FPT Software
        {"companyName": "FPT Software", "city": "Hà Nội", "address": "Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch"},
        {"companyName": "FPT Software", "city": "TP. Hồ Chí Minh", "address": "Khu Công nghệ Cao, Phường Tân Phú, TP. Thủ Đức"},
        {"companyName": "FPT Software", "city": "Đà Nẵng", "address": "Tòa nhà FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Ngũ Hành Sơn"},
        # Viettel Telecom
        {"companyName": "Viettel Telecom", "city": "Hà Nội", "address": "Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình"},
        {"companyName": "Viettel Telecom", "city": "TP. Hồ Chí Minh", "address": "Tòa nhà Viettel Complex, 285 Cách Mạng Tháng 8, Quận 10"},
        # VNG Corporation
        {"companyName": "VNG Corporation", "city": "TP. Hồ Chí Minh", "address": "VNG Campus, Đường số 13, Khu chế xuất Tân Thuận, Quận 7"},
        {"companyName": "VNG Corporation", "city": "Hà Nội", "address": "Tòa nhà TNR, 54A Nguyễn Chí Thanh, Đống Đa"}
    ]
    location_ids = {}
    for loc in locations_data:
        cname = loc["companyName"]
        cid = company_ids.get(cname)
        if not cid:
            continue
        key = f"{loc['city']}_{loc['address']}"
        if key in existing_locations:
            location_ids[key] = existing_locations[key]
            print(f"   - Đã tồn tại địa điểm: {loc['city']} - {cname} (#{location_ids[key]})")
        else:
            payload = {"companyId": cid, "city": loc["city"], "address": loc["address"]}
            created = api_call("/api/locations", method="POST", data=payload, token=admin_token)
            if "_error" not in created:
                location_ids[key] = created.get("id")
                print(f"   ✓ Tạo mới địa điểm: {loc['city']} - {cname} (#{location_ids[key]})")
            else:
                print(f"   [-] Lỗi tạo địa điểm: {created['_message']}")

    # 6. Khởi tạo Người dùng (Users: Recruiters & Job Seekers)
    print("\n[6] Kiểm tra & Khởi tạo Tài khoản Người dùng (Users)...")
    users_to_seed = [
        # Recruiters
        {"email": "recruiter@fpt.com", "password": "Recruiter@123", "fullName": "Hoàng Minh Trí (HR FPT)", "role": "RECRUITER", "companyName": "FPT Software"},
        {"email": "recruiter@viettel.com", "password": "Recruiter@123", "fullName": "Trần Thu Hà (HR Viettel)", "role": "RECRUITER", "companyName": "Viettel Telecom"},
        {"email": "recruiter@vng.com", "password": "Recruiter@123", "fullName": "Đặng Quốc Huy (Talent VNG)", "role": "RECRUITER", "companyName": "VNG Corporation"},
        # Job Seekers
        {"email": "candidate@gmail.com", "password": "Candidate@123", "fullName": "Nguyễn Văn Ứng Viên", "role": "JOB_SEEKER", "companyName": None},
        {"email": "dev.nam@gmail.com", "password": "Candidate@123", "fullName": "Trần Hoài Nam", "role": "JOB_SEEKER", "companyName": None},
        {"email": "dev.lan@gmail.com", "password": "Candidate@123", "fullName": "Lê Thị Phương Lan", "role": "JOB_SEEKER", "companyName": None}
    ]
    user_tokens = {}
    user_ids = {}

    for u in users_to_seed:
        cid = company_ids.get(u["companyName"]) if u["companyName"] else None
        created = api_call("/api/users", method="POST", data={
            "email": u["email"],
            "password": u["password"],
            "fullName": u["fullName"],
            "role": u["role"],
            "companyId": cid
        }, token=admin_token)

        tok, u_obj = login(u["email"], u["password"])
        if tok and u_obj:
            user_tokens[u["email"]] = tok
            user_ids[u["email"]] = u_obj.get("id")
            print(f"   ✓ Người dùng: {u['email']} | {u['role']} (#{u_obj.get('id')})")
        else:
            print(f"   [-] Không thể đăng nhập {u['email']}")

    # 7. Cập nhật Hồ sơ Ứng viên (Profiles)
    print("\n[7] Khởi tạo Hồ sơ cá nhân (Candidate Profiles)...")
    profiles_data = {
        "candidate@gmail.com": {
            "phone": "0987654321",
            "summary": "Lập trình viên Frontend 3 năm kinh nghiệm với React, Next.js, Tailwind CSS và TypeScript. Đam mê tối ưu UX và hiệu năng web.",
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            "attachmentUrl": "/uploads/cv_nguyen_van_a.pdf"
        },
        "dev.nam@gmail.com": {
            "phone": "0912345678",
            "summary": "Kỹ sư Backend chuyên sâu về Java Spring Boot, Microservices, MySQL, Redis và Kafka. 4 năm kinh nghiệm phát triển hệ thống tài chính.",
            "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
            "attachmentUrl": "/uploads/cv_tran_hoai_nam.pdf"
        },
        "dev.lan@gmail.com": {
            "phone": "0908765432",
            "summary": "UI/UX Designer với hơn 4 năm kinh nghiệm thiết kế sản phẩm số, Design System, Figma và tương tác vi mô (micro-interactions).",
            "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
            "attachmentUrl": "/uploads/cv_le_phuong_lan.pdf"
        }
    }
    for c_email, p_data in profiles_data.items():
        c_tok = user_tokens.get(c_email)
        if c_tok:
            api_call("/api/profiles/me", method="PUT", data=p_data, token=c_tok)
            print(f"   ✓ Cập nhật hồ sơ: {c_email}")

    # 8. Đăng Tin tuyển dụng (Job Listings & Job Descriptions)
    print("\n[8] Khởi tạo Tin tuyển dụng (Job Listings)...")
    jobs_data = [
        {
            "recruiter": "recruiter@fpt.com",
            "title": "Senior React Frontend Engineer",
            "jobType": "Làm việc từ xa (Remote)",
            "industry": "Công nghệ thông tin",
            "locationKey": "Hà Nội_Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch",
            "salaryMin": 35000000,
            "salaryMax": 55000000,
            "deadline": "2026-11-30",
            "status": "OPEN",
            "responsibilities": "- Xây dựng và duy trì các ứng dụng Single Page Application (SPA) với React 18 và Next.js.\n- Tối ưu hóa hiệu năng render, bundle size và Core Web Vitals.\n- Phối hợp chặt chẽ với đội ngũ UI/UX Designer và Backend Engineers.",
            "requirements": "- Tối thiểu 3 năm kinh nghiệm lập trình React.js và TypeScript.\n- Thành thạo Tailwind CSS, Redux Toolkit hoặc Zustand.\n- Hiểu biết sâu về RESTful API, WebSocket và Web Security.",
            "benefits": "- Mức lương hấp dẫn từ 35 - 55 triệu VND/tháng.\n- Thưởng hiệu quả kinh doanh, gói bảo hiểm FPT Care cao cấp cho bản thân và gia đình.\n- Chế độ làm việc linh hoạt Remote / Hybrid."
        },
        {
            "recruiter": "recruiter@fpt.com",
            "title": "Java Spring Boot Backend Lead",
            "jobType": "Toàn thời gian (Full-time)",
            "industry": "Công nghệ thông tin",
            "locationKey": "Hà Nội_Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch",
            "salaryMin": 40000000,
            "salaryMax": 65000000,
            "deadline": "2026-11-25",
            "status": "OPEN",
            "responsibilities": "- Thiết kế kiến trúc Microservices chịu tải cao cho hệ thống ngân hàng số.\n- Lãnh đạo kỹ thuật và định hướng cho team 8 Backend Developers.\n- Đảm bảo tính toàn vẹn dữ liệu, hiệu năng database và bảo mật giao dịch.",
            "requirements": "- 4+ năm kinh nghiệm Java, Spring Boot, Spring Security, Hibernate.\n- Nắm vững MySQL, PostgreSQL, tối ưu Indexing và Partitioning.\n- Có kinh nghiệm với Docker, Kubernetes, Kafka hoặc RabbitMQ.",
            "benefits": "- Thu nhập 40 - 65 triệu VND/tháng kèm thưởng dự án.\n- Cơ hội onsite ngắn hạn và dài hạn tại Nhật Bản, Singapore, Châu Âu.\n- Tài trợ 100% kinh phí thi các chứng chỉ quốc tế AWS, GCP, CKA."
        },
        {
            "recruiter": "recruiter@viettel.com",
            "title": "DevOps & Cloud Engineer (AWS/K8s)",
            "jobType": "Toàn thời gian (Full-time)",
            "industry": "Công nghệ thông tin",
            "locationKey": "Hà Nội_Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình",
            "salaryMin": 30000000,
            "salaryMax": 50000000,
            "deadline": "2026-12-15",
            "status": "OPEN",
            "responsibilities": "- Xây dựng hạ tầng Cloud trên AWS và vận hành cụm Kubernetes production.\n- Thiết lập và duy trì các đường ống tự động CI/CD (GitLab CI, Jenkins, ArgoCD).\n- Giám sát hệ thống với Prometheus, Grafana, ELK Stack.",
            "requirements": "- 3 năm kinh nghiệm vận hành Linux và hạ tầng đám mây.\n- Thành thạo Docker, Kubernetes, Terraform, Ansible.\n- Khả năng xử lý sự cố nhanh và tư duy tự động hóa.",
            "benefits": "- Môi trường làm việc viễn thông quy mô quốc gia dẫn đầu.\n- Thu nhập 15 - 18 tháng lương/năm, thưởng thành tích vượt trội.\n- Khám sức khỏe định kỳ tiêu chuẩn quốc tế."
        },
        {
            "recruiter": "recruiter@vng.com",
            "title": "Product Designer (UI/UX Specialist)",
            "jobType": "Toàn thời gian (Full-time)",
            "industry": "Thiết kế đồ họa & UI/UX",
            "locationKey": "TP. Hồ Chí Minh_VNG Campus, Đường số 13, Khu chế xuất Tân Thuận, Quận 7",
            "salaryMin": 25000000,
            "salaryMax": 40000000,
            "deadline": "2026-12-20",
            "status": "OPEN",
            "responsibilities": "- Nghiên cứu hành vi người dùng, xây dựng User Flow và Wireframe.\n- Thiết kế giao diện chi tiết, xây dựng Design System và Micro-interactions.\n- Phối hợp với Product Manager và Dev team để hiện thực hóa trải nghiệm.",
            "requirements": "- 3+ năm kinh nghiệm UI/UX cho ứng dụng Web và Mobile.\n- Sử dụng điêu luyện Figma, FigJam, Protopie.\n- Có portfolio thể hiện tư duy thiết kế lấy người dùng làm trung tâm.",
            "benefits": "- Thu nhập 25 - 40 triệu VND/tháng, đánh giá tăng lương 2 lần/năm.\n- Làm việc tại VNG Campus chuẩn Silicon Valley (khu phức hợp thể thao, hồ bơi, canteen).\n- Ăn trưa miễn phí mỗi ngày tại công ty."
        },
        {
            "recruiter": "recruiter@fpt.com",
            "title": "Thực tập sinh Lập trình Web (Internship)",
            "jobType": "Thực tập sinh (Internship)",
            "industry": "Công nghệ thông tin",
            "locationKey": "Đà Nẵng_Tòa nhà FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Ngũ Hành Sơn",
            "salaryMin": 5000000,
            "salaryMax": 8000000,
            "deadline": "2026-11-10",
            "status": "OPEN",
            "responsibilities": "- Tham gia vào dự án thực tế dưới sự hướng dẫn của Senior Mentor.\n- Thực hành viết mã nguồn sạch, test và fix bug.\n- Học hỏi quy trình phát triển phần mềm Agile/Scrum.",
            "requirements": "- Sinh viên năm 3, năm 4 chuyên ngành Công nghệ thông tin.\n- Nắm vững kiến thức nền tảng HTML, CSS, JavaScript, Java hoặc C#.\n- Ham học hỏi, có tinh thần trách nhiệm và gắn bó.",
            "benefits": "- Trợ cấp thực tập hàng tháng từ 5 - 8 triệu VND.\n- Ký hợp đồng lao động chính thức sau 3 tháng thực tập nếu đạt yêu cầu.\n- Môi trường xanh tại FPT Complex Đà Nẵng."
        },
        {
            "recruiter": "recruiter@fpt.com",
            "title": "Chuyên viên Tuyển dụng IT (Technical Recruiter)",
            "jobType": "Toàn thời gian (Full-time)",
            "industry": "Nhân sự & Tuyển dụng",
            "locationKey": "Hà Nội_Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch",
            "salaryMin": 15000000,
            "salaryMax": 25000000,
            "deadline": "2026-10-10",
            "status": "CLOSED",
            "responsibilities": "- Lập kế hoạch tuyển dụng nhân sự IT cho các dự án nước ngoài.\n- Tìm kiếm và sàng lọc ứng viên, tổ chức phỏng vấn và gửi offer.\n- Duy trì quan hệ tốt với ứng viên và các trường đại học.",
            "requirements": "- 1 - 2 năm kinh nghiệm tuyển dụng IT/Tech Recruiter.\n- Kỹ năng giao tiếp xuất sắc, tiếng Anh giao tiếp tốt.",
            "benefits": "- Lương cứng 15 - 25 triệu + thưởng hoa hồng hấp dẫn theo kết quả tuyển dụng."
        }
    ]

    job_ids = {}
    for j in jobs_data:
        r_tok = user_tokens.get(j["recruiter"])
        if not r_tok:
            continue
        
        jtype_id = job_type_ids.get(j["jobType"])
        ind_id = industry_ids.get(j["industry"])
        loc_id = location_ids.get(j["locationKey"])

        if not (jtype_id and ind_id and loc_id):
            print(f"   [-] Thiếu danh mục cho tin: {j['title']}")
            continue

        payload = {
            "title": j["title"],
            "jobTypeId": jtype_id,
            "industryId": ind_id,
            "locationId": loc_id,
            "salaryMin": j["salaryMin"],
            "salaryMax": j["salaryMax"],
            "deadline": j["deadline"],
            "status": j["status"],
            "responsibilities": j["responsibilities"],
            "requirements": j["requirements"],
            "benefits": j["benefits"]
        }

        jl_res = api_call("/api/job-listings?size=100")
        existing_jobs = {item["title"]: item["id"] for item in jl_res.get("content", [])}
        if j["title"] in existing_jobs:
            job_ids[j["title"]] = existing_jobs[j["title"]]
            print(f"   - Đã tồn tại tin: {j['title']} (#{job_ids[j['title']]})")
        else:
            created = api_call("/api/job-listings", method="POST", data=payload, token=r_tok)
            if "_error" not in created:
                job_id = created.get("jobListing", {}).get("id") or created.get("id")
                job_ids[j["title"]] = job_id
                print(f"   ✓ Đăng tin: {j['title']} (#{job_id})")
            else:
                print(f"   [-] Lỗi đăng tin {j['title']}: {created['_message']}")

    # Đảm bảo lấy đầy đủ job_ids từ server
    jl_res = api_call("/api/job-listings?size=100")
    for item in jl_res.get("content", []):
        job_ids[item["title"]] = item["id"]

    # 9. Nộp đơn ứng tuyển (Job Applications)
    print("\n[9] Khởi tạo Đơn ứng tuyển (Job Applications)...")
    app_ids = {}
    applications_data = [
        {
            "candidate": "candidate@gmail.com",
            "jobTitle": "Senior React Frontend Engineer",
            "resumeUrl": "/uploads/cv_nguyen_van_a.pdf",
            "coverLetter": "Kính gửi quý công ty, tôi có 3 năm kinh nghiệm phát triển React và rất hứng thú với các dự án chuyển đổi số quy mô lớn của FPT Software. Hy vọng có cơ hội trao đổi thêm.",
            "targetStatus": "SHORTLISTED",
            "recruiter": "recruiter@fpt.com"
        },
        {
            "candidate": "dev.nam@gmail.com",
            "jobTitle": "Java Spring Boot Backend Lead",
            "resumeUrl": "/uploads/cv_tran_hoai_nam.pdf",
            "coverLetter": "Chào anh/chị, tôi có thế mạnh về kiến trúc Microservices và xử lý dữ liệu lớn. Tôi tin mình phù hợp với vai trò Backend Lead tại FPT.",
            "targetStatus": "INTERVIEWING",
            "recruiter": "recruiter@fpt.com"
        },
        {
            "candidate": "dev.lan@gmail.com",
            "jobTitle": "Product Designer (UI/UX Specialist)",
            "resumeUrl": "/uploads/cv_le_phuong_lan.pdf",
            "coverLetter": "Chào VNG Team, tôi rất yêu thích các sản phẩm số của VNG và mong muốn đóng góp kỹ năng thiết kế trải nghiệm người dùng vào các dự án tiếp theo.",
            "targetStatus": "INTERVIEWING", # Để tạo Offer
            "recruiter": "recruiter@vng.com"
        },
        {
            "candidate": "candidate@gmail.com",
            "jobTitle": "Thực tập sinh Lập trình Web (Internship)",
            "resumeUrl": "/uploads/cv_nguyen_van_a.pdf",
            "coverLetter": "Em muốn thử sức thêm ở chi nhánh Đà Nẵng nếu có cơ hội làm việc tại FPT Complex.",
            "targetStatus": "APPLIED",
            "recruiter": "recruiter@fpt.com"
        }
    ]

    for app in applications_data:
        c_tok = user_tokens.get(app["candidate"])
        jid = job_ids.get(app["jobTitle"])
        if not (c_tok and jid):
            continue

        created = api_call("/api/applications", method="POST", data={
            "jobListingId": jid,
            "resumeUrl": app["resumeUrl"],
            "coverLetter": app["coverLetter"]
        }, token=c_tok)

        if "_error" not in created:
            aid = created.get("id")
            app_ids[f"{app['candidate']}_{app['jobTitle']}"] = aid
            print(f"   ✓ Nộp đơn: {app['candidate']} -> {app['jobTitle']} (#{aid})")

            # Cập nhật status nếu cần
            if app["targetStatus"] != "APPLIED":
                r_tok = user_tokens.get(app["recruiter"])
                if r_tok:
                    api_call(f"/api/applications/{aid}/status?value={app['targetStatus']}", method="PATCH", token=r_tok)
                    print(f"     └ Đổi trạng thái sang: {app['targetStatus']}")
        else:
            print(f"   [-] Lỗi nộp đơn: {created['_message']}")

    # 10. Đưa vào Shortlist (Task 3.3 / U015)
    print("\n[10] Đưa ứng viên vào Shortlist...")
    shortlist_app_id = app_ids.get("candidate@gmail.com_Senior React Frontend Engineer")
    fpt_tok = user_tokens.get("recruiter@fpt.com")
    if shortlist_app_id and fpt_tok:
        s_res = api_call("/api/shortlists", method="POST", data={
            "applicationId": shortlist_app_id,
            "note": "Ứng viên có kỹ năng React và Tailwind CSS rất tốt, phù hợp dự án FinTech."
        }, token=fpt_tok)
        if "_error" not in s_res:
            print(f"   ✓ Thêm vào Shortlist thành công (#{s_res.get('id')})")
        else:
            print(f"   [-] Shortlist: {s_res['_message']}")

    # 11. Tạo Khung giờ phỏng vấn & Đặt lịch & Chấm Feedback (Task 3.4 / U017, U019)
    print("\n[11] Tạo Khung giờ phỏng vấn & Đánh giá (Interviews)...")
    react_job_id = job_ids.get("Senior React Frontend Engineer")
    java_job_id = job_ids.get("Java Spring Boot Backend Lead")

    # Slot 1: Booked bởi dev.nam kèm Feedback
    nam_app_id = app_ids.get("dev.nam@gmail.com_Java Spring Boot Backend Lead")
    if java_job_id and fpt_tok:
        slot1 = api_call("/api/interview-slots", method="POST", data={
            "jobListingId": java_job_id,
            "startTime": "2026-10-15T10:00:00",
            "endTime": "2026-10-15T11:00:00",
            "meetingLink": "https://meet.google.com/job-portal-demo"
        }, token=fpt_tok)

        if "_error" not in slot1 and nam_app_id:
            s1_id = slot1.get("id")
            nam_tok = user_tokens.get("dev.nam@gmail.com")
            # Ứng viên book slot
            api_call(f"/api/interview-slots/{s1_id}/book", method="POST", data={"applicationId": nam_app_id}, token=nam_tok)
            print(f"   ✓ Tạo & Đặt Slot 1: Java Lead (#{s1_id}) -> dev.nam@gmail.com")

            # Recruiter chấm Feedback
            api_call("/api/interview-feedbacks", method="POST", data={
                "interviewSlotId": s1_id,
                "score": 9,
                "comment": "Ứng viên nắm rất chắc kiến thức Spring Boot và Transaction Management, tư duy thuật toán tốt, văn hóa hòa đồng."
            }, token=fpt_tok)
            print(f"   ✓ Chấm Feedback Slot 1: 9/10 sao")

    # Slot 2 & Slot 3: Còn trống (Free) cho vị trí Senior React để ứng viên vào test book lịch
    if react_job_id and fpt_tok:
        slot2 = api_call("/api/interview-slots", method="POST", data={
            "jobListingId": react_job_id,
            "startTime": "2026-10-16T14:00:00",
            "endTime": "2026-10-16T15:00:00",
            "meetingLink": "https://meet.google.com/fpt-react-interview-1"
        }, token=fpt_tok)
        print(f"   ✓ Tạo Slot 2 (Trống): Senior React (#{slot2.get('id')})")

        slot3 = api_call("/api/interview-slots", method="POST", data={
            "jobListingId": react_job_id,
            "startTime": "2026-10-17T09:30:00",
            "endTime": "2026-10-17T10:30:00",
            "meetingLink": "https://meet.google.com/fpt-react-interview-2"
        }, token=fpt_tok)
        print(f"   ✓ Tạo Slot 3 (Trống): Senior React (#{slot3.get('id')})")

    # 12. Gửi Thư mời nhận việc (Offer) (Task 3.5 / U020)
    print("\n[12] Gửi Thư mời nhận việc (Offers)...")
    lan_app_id = app_ids.get("dev.lan@gmail.com_Product Designer (UI/UX Specialist)")
    vng_tok = user_tokens.get("recruiter@vng.com")
    if lan_app_id and vng_tok:
        offer_res = api_call("/api/offers", method="POST", data={
            "applicationId": lan_app_id,
            "salary": 32000000,
            "startDate": "2026-12-01"
        }, token=vng_tok)
        if "_error" not in offer_res:
            print(f"   ✓ Gửi Offer thành công cho dev.lan@gmail.com (#{offer_res.get('id')}) - Lương 32.000.000 VND")
        else:
            print(f"   [-] Lỗi tạo Offer: {offer_res['_message']}")

    # 13. Đánh giá Doanh nghiệp (Reviews) (Task 2.8, Task 4.4 / U023, U024)
    print("\n[13] Viết Đánh giá Doanh nghiệp (Reviews)...")
    fpt_id = company_ids.get("FPT Software")
    viettel_id = company_ids.get("Viettel Telecom")
    vng_id = company_ids.get("VNG Corporation")

    reviews_to_seed = [
        {"candidate": "candidate@gmail.com", "cid": fpt_id, "rating": 5, "comment": "Môi trường làm việc năng động, quy trình phỏng vấn chuyên nghiệp, văn phòng hiện đại."},
        {"candidate": "dev.nam@gmail.com", "cid": viettel_id, "rating": 4, "comment": "Doanh nghiệp lớn, chế độ phúc lợi rất tốt, phù hợp phát triển sự nghiệp lâu dài."},
        {"candidate": "dev.lan@gmail.com", "cid": vng_id, "rating": 5, "comment": "VNG Campus cực kỳ đẹp và sáng tạo, văn hóa cởi mở, trang thiết bị làm việc hiện đại."}
    ]

    for r in reviews_to_seed:
        c_tok = user_tokens.get(r["candidate"])
        if c_tok and r["cid"]:
            rev_res = api_call("/api/reviews", method="POST", data={
                "companyId": r["cid"],
                "rating": r["rating"],
                "comment": r["comment"]
            }, token=c_tok)
            if "_error" not in rev_res:
                print(f"   ✓ Đánh giá: {r['candidate']} -> {r['rating']}★ (#{rev_res.get('id')})")
            else:
                print(f"   - Review: {rev_res['_message']}")

    print("\n" + "=" * 60)
    print(" HOÀN TẤT KHỞI TẠO DỮ LIỆU TEST TOÀN BỘ HỆ THỐNG!")
    print("=" * 60)
    print("\nDanh sách tài khoản kiểm thử:")
    print("1. ADMIN:      admin@jobportal.com       / Admin@123")
    print("2. RECRUITER:  recruiter@fpt.com         / Recruiter@123 (FPT Software)")
    print("3. RECRUITER:  recruiter@viettel.com     / Recruiter@123 (Viettel Telecom)")
    print("4. RECRUITER:  recruiter@vng.com         / Recruiter@123 (VNG Corporation)")
    print("5. JOB SEEKER: candidate@gmail.com       / Candidate@123 (Đã có đơn Shortlist)")
    print("6. JOB SEEKER: dev.nam@gmail.com         / Candidate@123 (Đang phỏng vấn)")
    print("7. JOB SEEKER: dev.lan@gmail.com         / Candidate@123 (Đã có Offer 32M)")
    print("=" * 60)

if __name__ == "__main__":
    main()
