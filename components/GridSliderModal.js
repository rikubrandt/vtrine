import React from "react";
import GridSlider from "./GridSlider";

const GridSliderModal = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-100 w-full mx-4 p-4 rounded-xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl flex flex-col md:flex-row">
        {/* Media Section */}
        <div className="w-full md:w-2/3 flex-shrink-0">
          {post.files && post.files.length > 0 && (
            <div className="mt-4 md:mt-0">
              <GridSlider
                post={post.files.map((url, i) => ({
                  id: `${post.id}-${i}`,
                  downloadURL: url,
                }))}
                title={post.title}
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 p-4 flex flex-col justify-between">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div className="flex items-center">
              <p className="text-xl font-bold text-gray-800">{post.location?.place_name}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-500 text-gray-500 hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="my-4 flex-grow">
            <p className="text-sm text-gray-500 mb-2">{post.time}</p>
            <p className="text-sm mb-4">{post.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridSliderModal;
