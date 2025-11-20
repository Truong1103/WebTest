<table>
  <tr>
    <th>F01</th>
    <th>F02</th>
    <th>F03</th>
    <th>F04</th>
    <th>F05</th>
    <th>F06</th>
    <th>F07</th>
    <th>F08</th>
    <th>F09</th>
    <th>F10</th>
    <th>F11</th>
    <th>F12</th>
    <th>F13</th>
    <th>F14</th>
    <th>F15</th>
    <th>F16</th>
    <th>F17</th>
  </tr>
  <tr>
    <th>F02</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F03</th>
    <td>X</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td>
  </tr>
  <tr>
    <th>F04</th>
    <td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F05</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F06</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F07</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F08</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td>
  </tr>
  <tr>
    <th>F09</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F10</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F11</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F12</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F13</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F14</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F15</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
  <tr>
    <th>F16</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td></td>
  </tr>
  <tr>
    <th>F17</th>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
</table>


### Giải thích

- **Mục đích**: ma trận giúp theo dõi quan hệ phụ thuộc giữa các yêu cầu F01–F17 (trích từ bảng Functional Requirements). Ô có dấu “X” nghĩa là hàng (req nguồn) cần hoặc thỏa mãn yêu cầu ở cột (req đích).  
- **Ví dụ**:  
  - `F02` (Điều hướng theo vai trò) phụ thuộc `F01` (Chọn vai trò) nên hàng F02 – cột F01 đánh dấu X.  
  - `F06` (Form đăng ký KTX) dựa trên `F04` (hiển thị thời gian) và `F05` (khóa form khi quá hạn).  
  - `F09` (Xác nhận đăng ký thành công) chỉ xảy ra khi `F06` đã submit hợp lệ và đã kiểm tra MSSV/Email (`F07`) cũng như upload giấy tờ (`F08`).  
  - `F10` (Màn hình trạng thái đơn) tiêu thụ dữ liệu từ `F09`, trong khi các yêu cầu con `F11–F14` mở rộng khả năng hiển thị trạng thái, lý do và CTA xác nhận giữ chỗ.  
  - Chuỗi `F14 → F15 → F16 → F17` thể hiện luồng xác nhận giữ chỗ, chọn phương thức thanh toán, nhập OTP và thông báo kết quả.

- **Lợi ích**: nhờ RTM, nhóm dễ phát hiện yêu cầu nào chưa được liên kết (hàng/cột trống), đảm bảo mỗi chức năng đều được hỗ trợ bởi các thành phần cần thiết và là cơ sở để xây dựng test case hoặc truy vết khi thay đổi yêu cầu sau này.

