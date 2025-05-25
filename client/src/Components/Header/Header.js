import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";

function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgrounds = [
    "https://www.simplilearn.com/ice9/free_resources_article_thumb/Css_Background_Image.jpg",
    "https://img.freepik.com/foto-gratuito/programmazione-collage-di-sfondo_23-2149901789.jpg",
  ];

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1000,
    });

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <>
      <header
        className="masthead bg-gradient text-white text-center no-select header-page"
        style={{ backgroundImage: `url(${backgrounds[currentSlide]})` }}
      >
        <div className="overlay"></div>
        <div className="container d-flex align-items-center flex-column">
          <img
            className="masthead-avatar mb-5"
            src="assets/img/team.svg"
            alt="Team Icon"
          />
          <h1 className="masthead-heading text-uppercase mb-0">
            Tìm Kiếm Việc Làm Hiệu Quả
          </h1>
          <div className="divider-custom divider-light">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <p className="masthead-subheading font-weight-light mb-0 hover-text">
            Không Có Gì Quan Trọng Hơn Là Tuyển Dụng Và Phát Triển Các Tài Năng.
          </p>
        </div>
      </header>
    </>
  );
}

export default Header;
