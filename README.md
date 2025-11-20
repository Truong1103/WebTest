| # | YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENT) | ID | PRIORITY |
|---|----------------------------------------------------|----|----------|
| **Hiệu năng hoạt động (Performance)** ||||
| 1 | Hệ thống phải phản hồi yêu cầu đăng nhập/đổi vai trò trong **≤ 2 giây** khi tải bình thường. | NFR-PERF-01 | Cao |
| 2 | Thời gian tải dashboard (Student/Admin/Finance/Room) **≤ 3 giây** với dữ liệu mặc định. | NFR-PERF-02 | Cao |
| 3 | Kết quả tìm kiếm đơn đăng ký/hóa đơn phải trả về **≤ 5 giây** ngay cả khi có 10.000 bản ghi. | NFR-PERF-03 | Cao |
| 4 | API thanh toán/OTP phải xác nhận thành công/thất bại trong **≤ 4 giây** để tránh timeout. | NFR-PERF-04 | Cao |
| **Yêu cầu tài nguyên & sử dụng** ||||
| 5 | Ứng dụng web phải hoạt động ổn định trên môi trường tối thiểu: 2 CPU, 4GB RAM, băng thông 10Mbps. | NFR-RES-01 | Trung bình |
| 6 | Bộ nhớ trình duyệt cho mỗi tab không vượt quá 200MB nhằm hỗ trợ thiết bị cấu hình trung bình. | NFR-RES-02 | Trung bình |
| **Công suất tối đa** ||||
| 7 | Hệ thống phải hỗ trợ **1.000 người dùng đồng thời** (sinh viên + nhân sự nội bộ) mà không sập. | NFR-CAPA-01 | Cao |
| 8 | 90% giao dịch thanh toán/đăng ký phải hoàn thành trong **≤ 5 giây**, tỷ lệ lỗi < 1%. | NFR-CAPA-02 | Cao |
| 9 | Hệ thống phải xử lý tối thiểu **50 giao dịch/phút** (nộp đơn, xác nhận, thanh toán) trong giờ cao điểm. | NFR-CAPA-03 | Cao |
| **Tính khả dụng (Usability)** ||||
| 10 | Giao diện phải hỗ trợ song ngữ **Tiếng Việt & Tiếng Anh**; có thể chuyển đổi trong phần header. | NFR-USA-01 | Trung bình |
| 11 | Các nút hành động chính (Đăng ký, Thanh toán, Duyệt, Gửi nhắc nhở…) phải luôn hiển thị rõ ràng với icon và tooltip. | NFR-USA-02 | Trung bình |
| 12 | Hệ thống phải cung cấp hướng dẫn/tooltip cho các trường quan trọng (MSSV, OTP, mã hẹn) để giảm lỗi nhập liệu. | NFR-USA-03 | Trung bình |
| 13 | Giao diện phải tuân theo các tiêu chuẩn truy cập cơ bản (WCAG 2.1 AA: độ tương phản ≥ 4.5:1). | NFR-USA-04 | Thấp |
| **Tương thích (Integration)** ||||
| 14 | Hệ thống phải tích hợp với các cổng thanh toán phổ biến (VNPay, MoMo) thông qua API HTTPS chuẩn REST. | NFR-INT-01 | Cao |
| 15 | Phải hỗ trợ xuất dữ liệu ra **Excel/PDF** để chia sẻ với các hệ thống kế toán nội bộ. | NFR-INT-02 | Trung bình |
| 16 | Cho phép cấu hình webhook/SMTP để gửi email thông báo tự động (duyệt đơn, nhắc nợ). | NFR-INT-03 | Trung bình |
| **Độ tin cậy (Reliability)** ||||
| 17 | Thời gian sẵn sàng hệ thống (uptime) mục tiêu **≥ 99,5%/năm**. | NFR-REL-01 | Cao |
| 18 | Có cơ chế retry tự động tối thiểu 3 lần cho các yêu cầu tới dịch vụ thanh toán nếu gặp lỗi mạng tạm thời. | NFR-REL-02 | Trung bình |
| 19 | Có quy trình sao lưu dữ liệu (database + file đính kèm) tối thiểu **1 lần/ngày**, lưu giữ 30 ngày. | NFR-REL-03 | Cao |
| 20 | Trong trường hợp sự cố nghiêm trọng, hệ thống phải khôi phục trong **≤ 4 giờ** (RTO) và mất dữ liệu tối đa 1 giờ (RPO). | NFR-REL-04 | Cao |
| **An toàn thông tin (Security)** ||||
| 21 | Mọi kết nối giữa client và server phải sử dụng **HTTPS/TLS 1.2+**; chặn truy cập HTTP thường. | NFR-SEC-01 | Cao |
| 22 | Áp dụng cơ chế **JWT/OAuth2** cho API; phiên đăng nhập timeout sau 30 phút không hoạt động. | NFR-SEC-02 | Cao |
| 23 | Mật khẩu người dùng phải được băm bằng **bcrypt/scrypt** với SALT; tối thiểu 8 ký tự bao gồm chữ hoa, chữ thường, số. | NFR-SEC-03 | Cao |
| 24 | Ghi nhật ký truy cập quan trọng (đăng nhập, duyệt đơn, thay đổi cấu hình phòng, phát hành hóa đơn) để audit. | NFR-SEC-04 | Trung bình |
| 25 | Hệ thống phải bảo vệ chống tấn công XSS/CSRF/SQL Injection bằng validation server-side & CSP. | NFR-SEC-05 | Cao |
| **Khả năng mở rộng & bảo trì** ||||
| 26 | Kết cấu micro-service (hoặc module tách biệt) cho từng domain: Student, Admin, Finance, Room để dễ deploy độc lập. | NFR-MAINT-01 | Trung bình |
| 27 | Tất cả dịch vụ phải kèm theo tài liệu API (OpenAPI/Swagger) để đội khác dễ tích hợp. | NFR-MAINT-02 | Trung bình |
| 28 | Codebase phải có tối thiểu **70% unit test coverage** cho các module tính phí, xác thực OTP, duyệt đơn. | NFR-MAINT-03 | Trung bình |
| 29 | Phải hỗ trợ logging tập trung (ELK/CloudWatch) để theo dõi lỗi và hiệu năng theo thời gian thực. | NFR-MAINT-04 | Trung bình |
| **Truy cập đa nền tảng & hỗ trợ** ||||
| 30 | Ứng dụng phải hiển thị tốt trên trình duyệt phổ biến: Chrome/Edge/Firefox/Safari (phiên bản 2 năm gần nhất). | NFR-COMP-01 | Trung bình |
| 31 | Giao diện responsive, hỗ trợ độ phân giải từ 1280px (desktop) tới 768px (tablet); di động chỉ cần hỗ trợ các module sinh viên. | NFR-COMP-02 | Trung bình |
| 32 | Cung cấp cơ chế trợ giúp tại chỗ (FAQ, contact info) để người dùng liên hệ khi có sự cố. | NFR-COMP-03 | Thấp |


