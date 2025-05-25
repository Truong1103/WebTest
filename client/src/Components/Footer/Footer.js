import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer text-center">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">Đại Học FPT Đà Nẵng</h4>
              <p className="lead mb-0">
                Campus Đại học FPT Đà Nẵng tọa lạc tại Khu Đô Thị FPT,
                <br />
                P. Hòa Hải, Q. Ngũ Hành Sơn, TP Đà Nẵng
              </p>
            </div>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">Liên quan</h4>
              <a
                className="btn btn-outline-light btn-social mx-1"
                href="https://www.facebook.com/vinh.nguyenquang.98871174"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f" />
              </a>

              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="far fa-chart-bar"></i>
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-internet-explorer" />
              </a>
            </div>
            <div className="col-lg-4">
              <h4 className="text-uppercase mb-4">Dự án khởi nghiệp</h4>
              <p className="lead mb-0">
                Giảng viên hướng dẫn: Nguyễn Văn Khuy
                <br />
                Nhóm thực hiện: Nhóm 9999
              </p>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright py-4 text-center text-white">
        <div className="container">
          <small>9999</small>
        </div>
      </div>
    </>
  );
}

export default Footer;
