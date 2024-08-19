import React from "react";
import GridSlider from "./GridSlider";

const GridSliderModal = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{post.time}</p>
        <p className="text-sm mb-4">{post.caption}</p>
        <p className="text-sm text-gray-500 mb-4">{post.location?.place_name}</p>
        {post.files && post.files.length > 0 && (
                        <div className="mt-4">
                          <GridSlider post={post.files.map((url, i) => ({
                            id: `${post.id}-${i}`,
                            downloadURL: url,
                          }))} title={post.title} />
                        </div>
                      )}
      </div>
    </div>
  );
};

export default GridSliderModal;
