import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import debounce from "lodash/debounce";

const SubscriptionPackages = () => {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];
        const response = await axios.get("/api/subscription-package/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(response.data.packages);
      } catch (error) {
        setMessage(error.response.data.message.msgBody);
      }
    };
    fetchPackages();
  }, []);

  const debouncedHandlePurchase = useCallback(
    debounce(async (packageId) => {
      setIsLoading(true);
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        // Gọi API để mua gói
        const purchaseResponse = await axios.post(
          `/api/purchased-subscription/purchase/${packageId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const subscriptionId = purchaseResponse.data.purchased._id;

        // Gọi API để tạo link thanh toán
        const paymentResponse = await axios.post(
          "/api/payment/create-payment-link",
          { subscriptionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Chuyển hướng đến cổng thanh toán PayOS
        window.location.href = paymentResponse.data.checkoutUrl;
      } catch (error) {
        setMessage(error.response.data.message.msgBody);
      } finally {
        setIsLoading(false);
      }
    }, 2000),
    []
  );

  const handlePurchase = (packageId) => {
    if (window.confirm("Bạn có chắc chắn muốn mua gói này?")) {
      debouncedHandlePurchase(packageId);
    }
  };

  return (
    <>
      <Helmet>
        <title>Xem Gói Đăng Ký</title>
      </Helmet>
      <section className="page-section my-3" style={{ minHeight: "450px" }}>
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Xem Gói Đăng Ký
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          {message && (
            <p
              className="text-center"
              style={{
                color: message.includes("thành công") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
          <div className="row">
            {packages.length === 0 ? (
              <div className="col-12 text-center">
                <p>Chưa có gói đăng ký nào.</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div className="col-md-6 col-lg-4 mb-5" key={pkg._id}>
                  <div
                    className="card card-MN w-100 h-100"
                    style={{ width: "18rem" }}
                  >
                    <div
                      className="p-2 img"
                      style={{ height: "150px", background: "#f8f9fa" }}
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-customer-service-illustration-concept-png-image_4860384.jpg"
                        alt="Package"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body mt-2">
                      <h5 className="card-title cvMN-item-sumary">
                        <span className="text-primary">{pkg.name}</span>
                      </h5>
                      <p className="card-text cvMN-salary">
                        <span>
                          <i className="fas fa-money-bill-wave px-1"></i>
                          {parseInt(pkg.price).toLocaleString("vi-VN")} VNĐ
                        </span>
                        <br />
                        <span>
                          <i className="fas fa-clock px-1"></i>
                          {pkg.duration} ngày
                        </span>
                        <br />
                        <span>
                          <i className="fas fa-list px-1"></i>
                          {pkg.postLimit} bài đăng
                        </span>
                      </p>
                      <p className="card-text">{pkg.description}</p>
                      <button
                        onClick={() => handlePurchase(pkg._id)}
                        className="btn btn-success btn-block"
                        style={{ borderRadius: "0" }}
                        disabled={isLoading}
                      >
                        {isLoading ? "Đang Xử Lý..." : "Mua Gói"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SubscriptionPackages;
