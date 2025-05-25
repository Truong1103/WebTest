import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

const PaymentSuccess = () => {
  const history = useHistory();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderCode = urlParams.get("orderCode");
        const status = urlParams.get("status");

        if (orderCode && status === "PAID") {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];
          await axios.post(
            "/api/payment/update-payment-status",
            { orderCode, status: "completed" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    updatePaymentStatus();

    const timer = setTimeout(() => {
      history.push("/my-subscriptions");
    }, 3000);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <>
      <Helmet>
        <title>Thanh Toán Thành Công</title>
      </Helmet>
      <section className="page-section my-3" style={{ minHeight: "450px" }}>
        <div className="container text-center">
          <h2 className="page-section-heading text-uppercase text-success mb-0">
            Thanh Toán Thành Công
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-check-circle" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <p className="lead">
            Cảm ơn bạn đã thanh toán! Gói đăng ký của bạn đã được kích hoạt.
          </p>
          <p>Đang chuyển hướng về trang danh sách gói đã mua...</p>
        </div>
      </section>
    </>
  );
};

export default PaymentSuccess;
