import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
// Trong MySubscriptions.js
const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [message, setMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];
        const response = await axios.get(
          "/api/purchased-subscription/my-subscriptions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubscriptions(response.data.subscriptions);
      } catch (error) {
        setMessage(error.response.data.message.msgBody);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleCancel = async (subscriptionId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy gói này?")) {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];
        await axios.delete(
          `/api/purchased-subscription/cancel/${subscriptionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubscriptions(
          subscriptions.filter((sub) => sub._id !== subscriptionId)
        );
        setMessage("Hủy gói thành công!");
      } catch (error) {
        setMessage(error.response.data.message.msgBody);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Gói Đã Mua</title>
      </Helmet>
      <section
        className="page-section my-3 search"
        style={{ minHeight: "450px" }}
      >
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Gói Đã Mua
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          {message && <p className="text-center text-danger">{message}</p>}
          <div className="row">
            <div className="col">
              <table className="table table-striped table-dark">
                <thead>
                  <tr className="no-select text-center">
                    <th scope="col">STT</th>
                    <th scope="col">Tên Gói</th>
                    <th scope="col">Ngày Mua</th>
                    <th scope="col">Ngày Hết Hạn</th>
                    <th scope="col">Số Bài Đã Dùng</th>
                    <th scope="col">Tổng Tiền</th>
                    <th scope="col">Trạng Thái</th>
                    <th scope="col">Hành Động</th>
                  </tr>
                </thead>
                {subscriptions.length === 0 ? (
                  <thead>
                    <tr className="no-select text-center">
                      <th scope="col" colSpan="8">
                        <img
                          style={{ maxHeight: "145px" }}
                          alt="empty"
                          src={"assets/img/inbox.svg"}
                        />
                        <h6>
                          <i>(Chưa mua gói nào)</i>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                ) : (
                  subscriptions.map((sub, index) => (
                    <tr key={sub._id} className="text-center">
                      <td>{index + 1}</td>
                      <td>{sub.package.name}</td>
                      <td>{new Date(sub.purchaseDate).toLocaleDateString()}</td>
                      <td>{new Date(sub.expiryDate).toLocaleDateString()}</td>
                      <td>
                        {sub.postsUsed}/{sub.package.postLimit}
                      </td>
                      <td>
                        {parseInt(sub.totalAmount).toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td>
                        {sub.paymentStatus === "pending" ? (
                          <span className="text-warning">Chưa Thanh Toán</span>
                        ) : (
                          sub.paymentStatus
                        )}
                      </td>
                      <td>
                        {sub.paymentStatus === "pending" && (
                          <button
                            onClick={() => handleCancel(sub._id)}
                            className="btn btn-danger btn-sm"
                            style={{ borderRadius: "0" }}
                          >
                            Hủy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MySubscriptions;
