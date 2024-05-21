import React from "react";
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

const GridSlider = ({ posts, title }) => {
  const [sliderRef] = useKeenSlider(
    {
      loop: false,
      initial: 0,
      slides: {
        perView: 3,
        spacing: 5,
      },
    },
    [MutationPlugin]
  );

  return (
    <div>
      <p className="text-xl font-mono">{title}</p>
      <div ref={sliderRef} className="keen-slider">
        {posts.map((post, index) => (
          <div key={post.id} className="keen-slider__slide">
            <img
              src={post.downloadURL}
              alt={`Post ${index + 1}`}
              className="w-full h-48 sm:h-64 md:h-64 lg:h-64 xl:h-64 object-cover" /* Responsive heights */
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridSlider;
