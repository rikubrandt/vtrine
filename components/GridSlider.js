import React, { useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Modal from "./Modal";

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
      initial: 1,
      slides: {
        origin: "center",
        perView: 2,
        spacing: 5,
      },
    },
    [MutationPlugin]
  );

  const [selectedPost, setSelectedPost] = useState(null);

  const handleImageClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <p className="text-xl font-mono">{title}</p>
      <div ref={sliderRef} className="keen-slider">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="keen-slider__slide cursor-pointer"
            onClick={() => handleImageClick(post)}
          >
            <img
              src={post.downloadURL}
              alt={`Post ${index + 1}`}
              className="w-full h-48 sm:h-64 md:h-64 lg:h-64 xl:h-64 object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {selectedPost && (
        <Modal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default GridSlider;
