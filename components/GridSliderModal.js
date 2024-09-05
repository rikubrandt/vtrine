import React, { useEffect, useRef } from "react";
import GridSlider from "./GridSlider";

const GridSliderModal = ({ post, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-10 pb-10 bg-black bg-opacity-50">
      {/* Modal content wrapper with max width and height */}
      <div
        ref={modalRef}
        className="bg-white w-full mx-4 pt-5 rounded-xl max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
      >
        {/* Media Section with responsive padding */}
        <div className="w-full md:w-2/3 flex-shrink-0 flex flex-col justify-center items-center">
          {post.files && post.files.length > 0 && (
            <div className="mt-4 md:mt-0 w-full h-full max-h-[80vh] py-10 md:p-4 lg:p-6 box-border flex items-center justify-center">
              <GridSlider
                post={post.files.map((url, i) => ({
                  id: `${post.id}-${i}`,
                  downloadURL: url,
                }))}
                className="w-full h-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/3 p-4 flex flex-col justify-between">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div className="flex items-center">
              <p className="text-xl font-bold text-gray-800">📍{post.location?.place_name}</p>
              
            </div>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-500 text-gray-500 hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="my-4 flex-grow overflow-y-auto">
            <p className="text-sm font-medium text-purple-600 mb-2">{post.date}</p>
            <p className="text-sm mb-4">{post.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridSliderModal;
