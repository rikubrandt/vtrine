import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

function GridSlider({ posts }) {
  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free",
    slides: {
      perView: 3,
      spacing: 15,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {posts.map((post, index) => (
        <div className="keen-slider__slide">
          <img
            src={post.downloadURL}
            alt={`Post ${index + 1}`}
            className="slider-image"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export default GridSlider;
