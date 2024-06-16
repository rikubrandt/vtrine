import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import "swiper/css/effect-coverflow"; // Coverflow Effect styles
import { EffectCoverflow, Pagination } from "swiper/modules";

// Configure Swiper to use modules
SwiperCore.use([Navigation, EffectCoverflow, Autoplay, Pagination]);

const CoverFlowSlider = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState("");

  const handleSlideClick = (imageUrl) => {
    setActiveImageUrl(imageUrl);
    setShowModal(true);
  };

  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleSlideClick(image.downloadURL)}
          >
            <img src={image.downloadURL} alt={`Slide ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      {showModal && (
        <Modal
          activeImageUrl={activeImageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const Modal = ({ activeImageUrl, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "auto",
        padding: "20px",
        backgroundColor: "#fff",
        zIndex: "1000",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
      }}
      onClick={onClose}
    >
      <img
        src={activeImageUrl}
        alt="Active Slide"
        style={{ width: "100%", height: "auto" }}
      />
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Close
      </button>
    </div>
  );
};

export default CoverFlowSlider;
