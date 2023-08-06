import React, { useState, useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const MutationPlugin = (slider) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      slider.update();
    });
  });
  const config = { childList: true };

  slider.on("created", () => {
    observer.observe(slider.container, config);
  });
  slider.on("destroyed", () => {
    observer.disconnect();
  });
};

const GridSlider = ({ posts }) => {
  const [sliderRef] = useKeenSlider(
    {
      loop: false,
      initial: 0,
      slides: {
        perView: 3,
        spacing: 15,
      },
    },
    [MutationPlugin]
  );

  return (
    <div ref={sliderRef} className="keen-slider">
      {posts.map((post, index) => (
        <div key={post.id} className="keen-slider__slide">
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
};

export default GridSlider;
