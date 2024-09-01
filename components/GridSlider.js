import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const GridSlider = ({ post, title }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 1 },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className="navigation-wrapper">
      <p className="text-xl font-mono mb-4">{title}</p>
      <div ref={sliderRef} className="keen-slider w-full h-full overflow-hidden">
        {post.map((image, index) => (
          <div key={image.id} className="keen-slider__slide w-full">
            <div className="w-full h-64 md:h-96 lg:h-[30rem] xl:h-[36rem] bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={image.downloadURL}
                alt={`Post ${index + 1}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <>
          <Arrow
            left
            onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
            disabled={currentSlide === 0}
          />

          <Arrow
            onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - 1
            }
          />

          <div className="dots">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={"dot" + (currentSlide === idx ? " active" : "")}
                ></button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

function Arrow(props) {
  const disabled = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}

export default GridSlider;
