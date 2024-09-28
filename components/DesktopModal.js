import React, { useEffect, useRef } from "react";
import GridSlider from "./GridSlider";
import { MapPinIcon } from "@heroicons/react/24/solid";

const DesktopModal = ({ post, onClose }) => {
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
      className="fixed inset-0 z-50 bg-black bg-opacity-50  flex items-center justify-center"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        ref={modalRef}
        className="bg-white max-w-7xl mx-2 md:mx-6 rounded-lg overflow-hidden flex  flex-col md:flex-row"
      >
        <div className="w-full md:w-2/3 h-full flex items-center justify-center bg-black">
          {post.files && post.files.length > 0 && (
            <div className="relative w-full h-full max-h-full">
              <GridSlider
                post={post.files.map((url, i) => ({
                  id: `${post.id}-${i}`,
                  downloadURL: url,
                }))}
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 h-full p-4 flex flex-col bg-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <p className="text-xl font-bold text-gray-800">{post.title}</p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
            >
              X
            </button>
          </div>

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
  );
};

export default DesktopModal;
