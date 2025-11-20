|     | F01 | F02 | F03 | F04 | F05 | F06 | F07 | F08 | F09 | F10 | F11 | F12 | F13 | F14 | F15 | F16 | F17 |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **F02** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F03** | X |  |  |  |  |  |  |  |  |  |  |  |  |  |  | X |  |
| **F04** |  |  |  |  | X |  |  |  |  |  |  |  |  |  |  |  |  |
| **F05** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F06** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F07** |  |  |  |  |  |  |  |  |  | X |  |  |  |  |  |  |  |
| **F08** |  |  |  |  |  |  |  |  |  |  |  |  |  | X |  |  |  |
| **F09** |  |  |  |  |  |  |  | X |  |  |  |  |  |  |  |  |  |
| **F10** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F11** |  |  |  |  |  |  |  |  |  |  |  |  | X |  |  |  |  |
| **F12** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F13** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **F14** |  |  |  |  |  |  |  |  |  |  | X |  |  |  |  |  |  |
| **F15** |  |  |  |  |  |  | X |  |  |  |  |  |  |  |  |  |  |
| **F16** |  |  |  |  |  |  |  |  |  |  |  |  |  |  | X |  |  |
| **F17** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Giải thích

- **Mục đích**: ma trận giúp theo dõi quan hệ phụ thuộc giữa các yêu cầu F01–F17 (trích từ bảng Functional Requirements). Ô có dấu “X” nghĩa là hàng (req nguồn) cần hoặc thỏa mãn yêu cầu ở cột (req đích).  
- **Ví dụ**:  
  - `F02` (Điều hướng theo vai trò) phụ thuộc `F01` (Chọn vai trò) nên hàng F02 – cột F01 đánh dấu X.  
  - `F06` (Form đăng ký KTX) dựa trên `F04` (hiển thị thời gian) và `F05` (khóa form khi quá hạn).  
  - `F09` (Xác nhận đăng ký thành công) chỉ xảy ra khi `F06` đã submit hợp lệ và đã kiểm tra MSSV/Email (`F07`) cũng như upload giấy tờ (`F08`).  
  - `F10` (Màn hình trạng thái đơn) tiêu thụ dữ liệu từ `F09`, trong khi các yêu cầu con `F11–F14` mở rộng khả năng hiển thị trạng thái, lý do và CTA xác nhận giữ chỗ.  
  - Chuỗi `F14 → F15 → F16 → F17` thể hiện luồng xác nhận giữ chỗ, chọn phương thức thanh toán, nhập OTP và thông báo kết quả.

- **Lợi ích**: nhờ RTM, nhóm dễ phát hiện yêu cầu nào chưa được liên kết (hàng/cột trống), đảm bảo mỗi chức năng đều được hỗ trợ bởi các thành phần cần thiết và là cơ sở để xây dựng test case hoặc truy vết khi thay đổi yêu cầu sau này.

