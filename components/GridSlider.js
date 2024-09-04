import React, { useState, useEffect, useRef } from "react";

const GridSlider = ({ post }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const totalSlides = post.length;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? prev : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));
  };

  // Touch Handlers for Swipe Gesture
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 15;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel wrapper */}
      <div
        className="carousel-wrapper flex transition-transform duration-500 ease-in-out h-full"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {post.map((file, index) => (
          <div
            key={file.id}
            className="carousel-item w-full h-full flex-shrink-0"
          >
            {file.downloadURL.endsWith(".mp4") || file.downloadURL.endsWith(".webm") ? (
              <video
                className="block w-full h-full object-contain"
                controls
                src={file.downloadURL}
                alt={`Video ${index}`}
              />
            ) : (
              <img
                src={file.downloadURL}
                className="block w-full h-full object-contain"
                alt={`Slide ${index}`}
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex space-x-2 transform -translate-x-1/2">
          {post.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-gray-800" : "bg-gray-400"
              }`}
              aria-current={currentSlide === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      )}

      {/* Slider controls */}
      {totalSlides > 1 && (
        <>
          {currentSlide > 0 && (
            <button
              type="button"
              className="absolute top-1/2 left-4 z-30 flex items-center justify-center h-8 w-8 bg-gray-800/50 hover:bg-gray-800/70 rounded-full transition-colors duration-300"
              onClick={prevSlide}
              style={{ transform: "translateY(-50%)" }}
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
          )}

          {currentSlide < totalSlides - 1 && (
            <button
              type="button"
              className="absolute top-1/2 right-4 z-30 flex items-center justify-center h-8 w-8 bg-gray-800/50 hover:bg-gray-800/70 rounded-full transition-colors duration-300"
              onClick={nextSlide}
              style={{ transform: "translateY(-50%)" }}
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 9l4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default GridSlider;
