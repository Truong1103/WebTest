# CHƯƠNG 4. CÀI ĐẶT VÀ TRIỂN KHAI

Chương này trình bày quy trình cài đặt môi trường, cấu hình các thành phần hệ thống và hướng triển khai ứng dụng web **CoffeeGo** (frontend React/Vite, backend Node.js/Express, cơ sở dữ liệu MongoDB, tích hợp dịch vụ bên thứ ba). Nội dung được sắp xếp theo trình tự thực tế từ máy phát triển đến môi trường vận hành, phù hợp với cấu trúc mã nguồn hiện có trong kho dự án.

---

## 4.1. Tổng quan kiến trúc triển khai

Hệ thống được tổ chức theo mô hình **client–server**:

- **Tầng giao diện (Presentation)**: ứng dụng **React** được đóng gói bằng **Vite**, giao tiếp với backend qua **HTTP/HTTPS** (REST API) và **Socket.IO** (realtime cho khu vực quản trị).
- **Tầng xử lý nghiệp vụ (Application)**: **Express** trên nền **Node.js**, tổ chức theo router/controller, xác thực JWT, tích hợp thanh toán VNPay, email (Nodemailer), AI (Google Generative AI / Gemini) và upload ảnh (Cloudinary theo thư viện đi kèm dự án).
- **Tầng dữ liệu (Data)**: **MongoDB** truy cập qua **Mongoose**.

Sơ đồ triển khai logic: trình duyệt người dùng ↔ máy chủ frontend (tĩnh sau build hoặc dev server) ↔ **API** (`/api/*`) ↔ MongoDB; admin realtime: trình duyệt **Socket.IO client** ↔ cùng origin backend (cổng HTTP/HTTPS của server Node).

---

## 4.2. Yêu cầu môi trường và công cụ

### 4.2.1. Phần cứng và hệ điều hành

- Máy tính đủ cấu hình chạy Node.js (khuyến nghị RAM **≥ 8 GB** khi chạy đồng thời MongoDB cục bộ và hai tiến trình dev).
- Hệ điều hành: **Windows 10/11**, **macOS**, hoặc **Linux**.

### 4.2.2. Phần mềm bắt buộc

| Thành phần | Phiên bản (tham chiếu dự án) | Ghi chú |
|------------|------------------------------|--------|
| Node.js | Khuyến nghị **LTS** (ví dụ 20.x hoặc 22.x) | Chạy backend và frontend |
| npm hoặc yarn / pnpm | Đi kèm Node | Quản lý dependency (`package.json`) |
| MongoDB | Tương thích Mongoose 6.x | Cục bộ hoặc **MongoDB Atlas** (cloud) |
| Git | Bất kỳ bản ổn định | Sao chép mã nguồn |

### 4.2.3. Tài khoản và dịch vụ ngoài (tùy chức năng)

- **SMTP** (Gmail, Outlook, hoặc nhà cung cấp khác): phục vụ gửi email xác thực đăng ký và quên mật khẩu (`Nodemailer`, biến `EMAIL_USER`, `EMAIL_PASS` trong backend).
- **Google AI (Gemini)**: API key (`GEMINI_API_KEY`) cho chatbot tư vấn.
- **VNPay (sandbox / production)**: cấu hình mã website, secret key và URL host theo tài liệu VNPay; **nên** đưa toàn bộ tham số nhạy cảm vào biến môi trường khi triển khai thật (**không** lưu trực tiếp trong mã nguồn).
- **Cloudinary** (nếu sử dụng upload ảnh): có thể cấu hình qua biến `CLOUDINARY_URL` hoặc tương đương theo tài liệu thư viện.

---

## 4.3. Chuẩn bị mã nguồn và cấu trúc thư mục

Sau khi clone hoặc giải nén dự án, cấu trúc chính gồm:

- `backend/`: máy chủ **Express** (`server.js`), cấu hình DB (`config/db.js`), router, controller, model.
- `frontend/`: ứng dụng **React + Vite**, mã nguồn trong `frontend/src`, client API trong `frontend/src/api` (dùng **axios**).

Toàn bộ dependency backend được khai báo trong `backend/package.json` (ví dụ: `express`, `mongoose`, `socket.io`, `jsonwebtoken`, `dotenv`, `vnpay`, `@google/generative-ai`, …). Frontend khai báo trong `frontend/package.json` (ví dụ: `react`, `vite`, `axios`, `socket.io-client`, `zustand`, `react-router-dom`, …).

---

## 4.4. Cài đặt môi trường phát triển

### 4.4.1. Cài đặt Node.js

Tải bản **LTS** từ trang chủ Node.js và xác nhận:

```text
node -v
npm -v
```

### 4.4.2. Cơ sở dữ liệu MongoDB

**Cách 1 – MongoDB cục bộ:** cài đặt MongoDB Community Edition, khởi động dịch vụ `mongod`, tạo database (ví dụ tên `coffee-go`) và chuỗi kết nối dạng:

```text
mongodb://127.0.0.1:27017/ten-database
```

**Cách 2 – MongoDB Atlas:** tạo cluster miễn phí, thêm người dùng cơ sở dữ liệu, mở IP truy cập (hoặc `0.0.0.0/0` cho môi trường thử – chỉ nên dùng khi demo), copy **connection string** có kèm user/password.

Mã nguồn backend kết nối qua `mongoose.connect(process.env.MONGO_URI)` trong `config/db.js`; do đó **bắt buộc** cung cấp `MONGO_URI` trước khi chạy server.

### 4.4.3. Cài đặt dependency

**Backend** (trong thư mục `backend`):

```text
cd backend
npm install
```

**Frontend** (trong thư mục `frontend`):

```text
cd frontend
npm install
```

---

## 4.5. Cấu hình biến môi trường backend

Backend sử dụng thư viện **dotenv**; tạo file **`.env`** trong thư mục `backend` (không commit file này lên kho công khai). Các biến **cần thiết** theo mã nguồn thực tế gồm:

| Biến | Vai trò |
|------|--------|
| `MONGO_URI` | Chuỗi kết nối MongoDB |
| `JWT_SECRET` | Khóa ký và xác thực JWT (đăng nhập, token xác thực email, reset mật khẩu) |
| `EMAIL_USER`, `EMAIL_PASS` | Tài khoản SMTP gửi mail (đăng ký, quên mật khẩu) |
| `GEMINI_API_KEY` | Gọi API Gemini cho module AI chat |

Biến **`PORT`**: nếu không đặt, server lắng nghe cổng **5000** mặc định (`server.js`: `process.env.PORT || 5000`).

Thanh toán **VNPay** và một số tham số khác nên được chuyển hẳn sang biến môi trường trong phiên bản sản phẩm để đáp ứng yêu cầu bảo mật và kiểm toán cấu hình.

Ví dụ khung file `.env` (giá trị minh họa):

```env
MONGO_URI=mongodb://127.0.0.1:27017/coffee-go
JWT_SECRET=chuoi-bi-mat-du-dai-va-ngau-nhien
EMAIL_USER=email@example.com
EMAIL_PASS=mat-khau-ung-dung
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

---

## 4.6. Cấu hình frontend và địa chỉ API

Client HTTP tập trung tại `frontend/src/api/axiosClient.js`, thiết lập `baseURL` trỏ tới API backend (ví dụ `https://<ten-mien>/api` khi đã triển khai, hoặc `http://localhost:5000/api` khi dev local).

**Lưu ý triển khai thực tế:** mã nguồn hiện có thể trỏ tới một host cụ thể (ví dụ dịch vụ cloud). Khi chạy local, cần đổi `baseURL` cho khớp địa chỉ và cổng backend đang chạy, tránh lỗi CORS hoặc gọi nhầm môi trường.

Trình duyệt admin có kết nối **Socket.IO** tới cùng host/cổng backend (trong mã gọi `io("http://localhost:5000")` khi phát triển); khi lên production cần thống nhất **HTTPS/WSS** và URL chính xác.

---

## 4.7. Khởi chạy ứng dụng ở chế độ phát triển

### 4.7.1. Khởi động backend

Từ thư mục `backend`, sau khi đã có `.env` và MongoDB sẵn sàng:

```text
node server.js
```

Hoặc dùng **nodemon** (nếu đã cài devDependency và cấu hình script) để tự khởi động lại khi sửa mã.

Khi thành công, console hiển thị thông báo kết nối MongoDB (theo `connectDB`). API REST được gắn tiền tố **`/api`** (ví dụ `/api/auth`, `/api/products`, …). Socket.IO dùng chung máy chủ HTTP.

### 4.7.2. Khởi động frontend

Từ thư mục `frontend`:

```text
npm run dev
```

Vite mặc định phục vụ giao diện trên cổng **5173** (hoặc cổng khác nếu được hiển thị trong terminal). Trình duyệt truy cập URL do Vite in ra để kiểm tra luồng người dùng.

### 4.7.3. Kiểm tra nhanh sau khi khởi chạy

- Đăng ký/đăng nhập, xem sản phẩm, giỏ hàng (nếu test thanh toán online cần cấu hình VNPay sandbox và callback URL đúng).
- Mở trang quản trị, xác nhận **Socket.IO** cập nhật danh sách khi có thay đổi đơn/đặt bàn (nếu watcher MongoDB hoạt động).

---

## 4.8. Build sản phẩm và preview frontend

Để tạo bản **production build** của SPA:

```text
cd frontend
npm run build
```

Kết quả nằm trong thư mục **`frontend/dist`**. Có thể kiểm tra local:

```text
npm run preview
```

Trên môi trường thật, thư mục `dist` thường được phục vụ bởi **Nginx**, **Apache**, hoặc tích hợp với **CDN**/static hosting; tất cả request `/api/*` được **reverse proxy** sang Node.js.

---

## 4.9. Triển khai môi trường vận hành (gợi ý)

Dự án có thể triển khai theo một trong các hướng sau (tùy nguồn lực nhà trường / doanh nghiệp):

1. **Nền tảng PaaS** (Render, Railway, Heroku, …): đẩy backend (Node), gán biến môi trường trên dashboard; frontend build tĩnh host riêng hoặc cùng dịch vụ static.
2. **Máy chủ VPS** (Ubuntu): cài Node, PM2 hoặc systemd giữ tiến trình `node server.js`; Nginx SSL (Let’s Encrypt), proxy `/api` và WebSocket.
3. **Docker** (tùy chọn): đóng gói image backend + image nginx phục vụ `dist`; mạng nội bộ kết nối MongoDB (container hoặc Atlas).

Trong mọi trường hợp cần: **HTTPS**, biến môi trường bảo mật trên server, backup định kỳ MongoDB, và giới hạn CORS phù hợp (hiện mã có thể dùng `cors` mở rộng – nên thu hẹp domain khi lên production).

---

## 4.10. Kiểm thử và nghiệm thu sau triển khai

- **Kiểm thử chức năng**: lần lượt các luồng đăng ký, đặt hàng, thanh toán (sandbox), đơn offline, đặt bàn, liên hệ, dashboard admin.
- **Kiểm thử phi chức năng**: thời gian phản hồi API, tải đồng thời nhẹ, kiểm tra log lỗi server.
- **Bảo mật**: không lộ `JWT_SECRET`, khóa VNPay, mật khẩu email trong tài liệu công khai; xoay khóa định kỳ khi nghi ngờ lộ.

---

## 4.11. Kết luận chương

Chương 4 đã trình bày trình tự cài đặt **Node.js**, **MongoDB**, dependency hai phần **backend** và **frontend**, cấu hình biến môi trường cho kết nối cơ sở dữ liệu, xác thực, email và AI, cùng các bước chạy phát triển, build và định hướng triển khai vận hành. Việc tuân thủ nguyên tắc tách cấu hình nhạy cảm khỏi mã nguồn và sử dụng HTTPS trong môi trường thật là yêu cầu cơ bản để hệ thống **CoffeeGo** đạt mức an toàn và ổn định cho đồ án tốt nghiệp và triển khai thực tế.

---

*Tài liệu phục vụ báo cáo đồ án; có thể bổ sung hình ảnh màn hình (cài Node, chạy server, giao diện Vite, dashboard Atlas) vào phiên bản in nếu giảng viên yêu cầu minh chứng.*
