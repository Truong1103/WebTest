import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import RecruimentService from "../../Services/RecruimentService";
import CVMoiNhatItem from "./CVMoiNhatItem";

function CVMoiNhat(props) {
  const [recruitments, setRecruitments] = useState([]);
  const { user } = useContext(AuthContext);
  const [skip, setSkip] = useState(0);
  const [totalRcm, setTotalRcm] = useState(0);
  const [animationLoadMore, setAnimationLoadMore] = useState(0);
  const [dem, setdem] = useState(1);

  // Tách hàm getRecruitment ra ngoài để có thể dùng nhiều lần
  const getRecruitment = (skipValue) => {
    RecruimentService.loadRecruitment({ skip: skipValue }).then((data) => {
      setRecruitments((prev) => [...prev, data.rcm]);
      setTotalRcm(data.total);
    });
  };

  // useEffect chỉ chạy 1 lần khi component mount
  useEffect(() => {
    getRecruitment(0);
  }, []);

  const loadMore = () => {
    const newSkip = skip + 3;
    const newDem = dem + 1;
    const newTop = animationLoadMore + 2345;

    window.scrollTo({ top: newTop, behavior: "smooth" });

    getRecruitment(newSkip);
    setSkip(newSkip);
    setdem(newDem);
    setAnimationLoadMore(newTop);
  };

  const renderListCV = recruitments.map((recruitment, index) => (
    <CVMoiNhatItem
      user={user}
      recruitment={recruitment}
      key={index}
      index={index}
    />
  ));

  const totalLoadmore = Math.ceil(totalRcm / 3);

  return (
    <section className="page-section portfolio text-white bg-primary">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-white mb-0 no-select">
          công việc mới nhất
        </h2>
        <div className="divider-custom divider-light">
          <div className="divider-custom-line"></div>
          <div className="divider-custom-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="divider-custom-line"></div>
        </div>

        {totalRcm === 0 ? (
          <>
            <div className="d-flex justify-content-center">
              <img
                style={{ maxHeight: "200px" }}
                alt="empty"
                src={"assets/img/broke.svg"}
              />
            </div>
            <div className="d-flex justify-content-center mt-2">
              <span
                role="img"
                aria-label="emoji"
                className="text-light text-uppercase display-4 font-weight-bold"
              ></span>
            </div>
          </>
        ) : null}

        <div className="row">{renderListCV}</div>

        {totalRcm <= 3 || dem === totalLoadmore ? null : (
          <div className="row">
            <div className="col mx-auto d-flex justify-content-center">
              <i
                className="icon fas fa-chevron-down loadMore"
                onClick={loadMore}
              ></i>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CVMoiNhat;
