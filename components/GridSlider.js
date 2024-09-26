import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { getStorage, ref, getMetadata } from "firebase/storage";

const GridSlider = ({ post }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fileTypes, setFileTypes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const sliderRef = useRef(null);
  const totalSlides = post.length;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [allProcessed, setAllProcessed] = useState(false);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        currentSlide * 100
      }%)`;
    }
    setIsPlaying(false);
  }, [currentSlide]);

  const determineFileType = async (fileUrl) => {
    const storage = getStorage();
    const fileRef = ref(storage, fileUrl);
    try {
      const metadata = await getMetadata(fileRef);
      const contentType = metadata.contentType;
      if (
        metadata.customMetadata &&
        metadata.customMetadata.processed !== "true"
      ) {
        return "processing";
      }
      if (contentType.startsWith("image/")) {
        return "image";
      } else if (contentType.startsWith("video/")) {
        return "video";
      } else {
        return "unknown";
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return "unknown";
    }
  };

  // Fetch the file types (image/video) for all files
  useEffect(() => {
    const fetchFileTypes = async () => {
      const types = await Promise.all(
        post.map(async (file) => {
          const fileType = await determineFileType(file.downloadURL);
          return fileType;
        })
      );
      setFileTypes(types);
      // Check if all files are processed
      const allProcessed = types.every((type) => type !== "processing");
      setAllProcessed(allProcessed);
    };

    fetchFileTypes();
  }, [post]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? prev : prev + 1));
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

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

  if (!allProcessed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Processing media, please wait...</p>
      </div>
    );
  }

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
            className="carousel-item w-full h-full flex-shrink-0 relative flex items-center justify-center"
          >
            {fileTypes[index] === "video" ? (
              <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={handlePlayPause}
              >
                <ReactPlayer
                  url={file.downloadURL}
                  playing={isPlaying && currentSlide === index}
                  muted={isMuted}
                  playsinline={true}
                  loop={true}
                  className="w-full h-full object-contain"
                  controls={false}
                  width="100%"
                  height="100%"
                />
                {/* Play Button (only when video is paused) */}
                {!isPlaying && currentSlide === index && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Play Icon */}
                    <PlayIcon className="w-12 h-12 text-white" />
                  </div>
                )}
                {/* Mute/Unmute Button */}
                {currentSlide === index && (
                  <div className="absolute bottom-9 right-4">
                    <button
                      className="text-white bg-black bg-opacity-50 p-2 rounded-full"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? (
                        /* Mute Icon */
                        <SpeakerXMarkIcon className="w-6 h-6 text-white" />
                      ) : (
                        <SpeakerWaveIcon className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : fileTypes[index] === "image" ? (
              <img
                src={file.downloadURL}
                className="w-full h-full object-contain"
                alt={`Slide ${index}`}
                draggable={false}
              />
            ) : (
              <div>Unknown file type</div>
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
              onClick={() => {
                setCurrentSlide(index);
                setIsPlaying(false);
              }}
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
                  strokeWidth={2}
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
                  strokeWidth={2}
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
