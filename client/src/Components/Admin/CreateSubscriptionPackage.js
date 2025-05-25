import React, { useState } from "react";
import axios from "axios";

const CreateSubscriptionPackage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    postLimit: "",
    duration: "",
    price: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      // Định dạng tiền tệ VNĐ với dấu "," thay "."
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Loại bỏ dấu "," trước khi gửi API
    const cleanedData = {
      ...formData,
      price: formData.price.replace(/,/g, ""),
    };
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
      const response = await axios.post(
        "/api/subscription-package/create",
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message.msgBody);
      setFormData({
        name: "",
        description: "",
        postLimit: "",
        duration: "",
        price: "",
      });
    } catch (error) {
      setMessage(error.response.data.message.msgBody);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center text-uppercase text-secondary mb-4">
        Tạo Gói Đăng Ký
      </h2>
      <div className="card p-4 shadow-sm">
        {message && (
          <p
            className="text-center"
            style={{ color: message.includes("thành công") ? "green" : "red" }}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên gói</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            />
          </div>
          <div className="form-group">
            <label>Số bài đăng tối đa</label>
            <input
              type="number"
              name="postLimit"
              value={formData.postLimit}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Thời gian hiệu lực (ngày)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Giá (VNĐ)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập giá (VD: 1,000,000)"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ borderRadius: "0" }}
          >
            Tạo Gói
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionPackage;
