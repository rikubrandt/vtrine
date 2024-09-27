import React, { useEffect, useRef } from "react";
import GridSlider from "./GridSlider";
import { MapPinIcon } from "@heroicons/react/24/solid";

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
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Modal content wrapper */}
      <div
        ref={modalRef}
        className="bg-white w-full h-svh max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-4 md:mx-6 rounded-lg overflow-hidden"
      >
        {/* Modal content */}
        <div className="flex flex-col md:flex-row">
          {/* Media Section */}
          <div className="w-full md:w-2/3 max-h-[70vh] md:max-h-none overflow-hidden flex items-center justify-center">
            {post.files && post.files.length > 0 && (
              <div className="w-full h-full">
                <GridSlider
                  post={post.files.map((url, i) => ({
                    id: `${post.id}-${i}`,
                    downloadURL: url,
                  }))}
                />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/3 p-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <p className="text-xl font-bold text-gray-800">{post.title}</p>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 flex-grow overflow-y-auto">
              {post.location?.place_name && (
                <div className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {post.location.place_name}
                </div>
              )}
              <p className="text-sm font-medium text-purple-600 mb-2">
                {post.date}
              </p>
              <p className="text-sm mb-4">{post.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridSliderModal;
