import React from "react";

function MyTableCV({ cv, index, page }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Đảm bảo page là số nguyên hợp lệ
  const safePage = parseInt(page) || 1;
  const startIndex = (safePage - 1) * 2; // Giả định 2 CV mỗi trang
  const stt = startIndex + index + 1;

  console.log("CV data:", cv, "Page:", page, "STT:", stt); // Debug để kiểm tra

  return (
    <tbody>
      <tr className="no-select text-center">
        <th scope="row">{stt}</th>
        <td>{cv.recruitment?.title || "Chưa có tiêu đề"}</td>
        <td>{formatDate(cv.createdAt)}</td>
        <td>{cv.status ? "Đã chấp nhận" : "Chưa chấp nhận"}</td>
      </tr>
    </tbody>
  );
}

export default MyTableCV;
