import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

const PaymentCancel = () => {
  const history = useHistory();

  useEffect(() => {
    // Chuyển hướng về trang danh sách gói đã mua sau 3 giây
    const timer = setTimeout(() => {
      history.push("/my-subscriptions");
    }, 3000);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <>
      <Helmet>
        <title>Thanh Toán Bị Hủy</title>
      </Helmet>
      <section className="page-section my-3" style={{ minHeight: "450px" }}>
        <div className="container text-center">
          <h2 className="page-section-heading text-uppercase text-danger mb-0">
            Thanh Toán Bị Hủy
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-times-circle" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <p className="lead">
            Thanh toán của bạn đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>
          <p>Đang chuyển hướng về trang danh sách gói đã mua...</p>
        </div>
      </section>
    </>
  );
};

export default PaymentCancel;
