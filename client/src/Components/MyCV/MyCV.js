import React, { useState, useEffect, useContext } from "react";
import Helmet from "react-helmet";
import "./MyCV.css";
import CVService from "../../Services/CVService";
import MyTableCV from "./MyTableCV";
import { AuthContext } from "../../Context/AuthContext";

function MyCV(props) {
  const [myCVs, setMyCVs] = useState([]);
  const defaultPage = parseInt(props.match.params.page) || 1; // Đảm bảo parse page
  const [page, setPage] = useState(defaultPage);
  const [pageNumber, setPageNumber] = useState("");
  const [totalMyCVs, setTotalMyCVs] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    CVService.getMyCV(page).then((data) => {
      console.log("Data from API:", data); // Debug dữ liệu
      if (data.success) {
        setMyCVs(data.result);
        setTotalMyCVs(data.total || data.result.length);
      }
    });
  }, [page]);

  const newMyCVs = [...myCVs];

  const renderMyCVs = newMyCVs.map((cv, index) => (
    <MyTableCV
      cv={cv}
      index={index}
      key={index}
      page={page} // Truyền page để tính STT
    />
  ));

  const totalPage = Math.ceil(totalMyCVs / 2);

  const btnPreviousPage = (e) => {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
      props.history.push(`/myCV/${user._id}-page=${page - 1}`);
    }
  };

  const btnNextPage = (e) => {
    e.preventDefault();
    if (page < totalPage) {
      setPage(page + 1);
      props.history.push(`/myCV/${user._id}-page=${page + 1}`);
    }
  };

  const handlePage = (e) => {
    e.preventDefault();
    setPageNumber(e.target.value);
  };

  const onGoPage = (e) => {
    e.preventDefault();
    if (pageNumber && pageNumber > 0 && pageNumber <= totalPage) {
      const page = parseInt(pageNumber);
      setPage(page);
      props.history.push(`/myCV/${user._id}-page=${page}`);
      setPageNumber("");
    } else {
      alert("Không Có Trang Này");
    }
  };

  return (
    <>
      <Helmet>
        <title>Hồ Sơ Đã Nộp</title>
      </Helmet>
      <section
        className="page-section my-3 search"
        style={{ minHeight: "450px" }}
      >
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Hồ Sơ Đã Nộp
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row">
            <div className="col">
              <form className="form-inline" onSubmit={onGoPage}>
                <div className="input-group">
                  <input
                    name="page"
                    value={pageNumber}
                    onChange={handlePage}
                    onKeyPress={(event) => {
                      return /\d/.test(
                        String.fromCharCode(event.keyCode || event.which)
                      );
                    }}
                    className="form-control mr-sm-2 no-select"
                    type="number"
                    placeholder="Nhập Số Trang"
                    style={{ borderRadius: "0" }}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-success my-2 my-sm-0"
                      style={{ borderRadius: "0" }}
                      type="submit"
                    >
                      Đi Đến
                    </button>
                  </div>
                </div>
              </form>
              <div className="col d-flex justify-content-end mx-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "0" }}
                  disabled
                >
                  Trang: {totalMyCVs === 0 ? `0/0` : `${page}/${totalPage}`}
                </button>
              </div>
              <table className="table table-striped table-dark">
                <thead>
                  <tr className="no-select text-center">
                    <th scope="col">STT</th>
                    <th scope="col">Tin Tuyển Dụng</th>
                    <th scope="col">Ngày Gửi</th>
                    <th scope="col">Trạng Thái</th>
                  </tr>
                </thead>
                {myCVs.length >= 1 ? null : (
                  <thead>
                    <tr className="no-select text-center">
                      <th scope="col" colSpan="4">
                        <img
                          style={{ maxHeight: "145px" }}
                          alt="empty"
                          src={"assets/img/inbox.svg"}
                        />
                        <h6>
                          <i>(Không có hồ sơ nào)</i>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                )}
                {renderMyCVs}
              </table>
            </div>
          </div>
          <div className="row no-select">
            <div className="col d-flex justify-content-end">
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnPreviousPage}
                disabled={page <= 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnNextPage}
                disabled={page >= totalPage}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyCV;
