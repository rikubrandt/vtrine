import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
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

  useEffect(() => {
    sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, [currentSlide]);

  // Function to determine if the file is an image or video using Firebase metadata
  const determineFileType = async (fileUrl) => {
    const storage = getStorage();
    const fileRef = ref(storage, fileUrl);
    try {
      const metadata = await getMetadata(fileRef);
      const contentType = metadata.contentType;

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

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev); 
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    handlePlayPause()
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
            className="carousel-item w-full h-full flex-shrink-0 relative"
          >
            {fileTypes[index] === "video" ? (
              <div className="relative w-full h-full">
                <ReactPlayer
                  url={file.downloadURL}
                  playing={isPlaying && currentSlide === index} 
                  muted={isMuted} 
                  playsinline={true}
                  className="block w-full h-full object-contain"
                  controls={false} 
                  width="100%"
                  height="100%"
                />
                {/* Custom Play/Pause Button */}
                {!isPlaying && currentSlide === index && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={handlePlayPause} // Play video on click
                  >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                </svg>

                  </div>
                )}

                {/* Mute/Unmute Button */}
                <div className="absolute bottom-9 right-4">
                  <button
                    className="text-white bg-black bg-opacity-50 p-2 rounded-full"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                      </svg>
                      
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>

                    )}
                  </button>
                </div>
              </div>
            ) : fileTypes[index] === "image" ? (
              <img
                src={file.downloadURL}
                className="block w-full h-full object-contain"
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
