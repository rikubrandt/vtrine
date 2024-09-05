import React, { useState } from "react";
import GridSliderModal from "./GridSliderModal";

const AllComponent = ({ displays }) => {
  const [selectedPost, setSelectedPost] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <div className="all-component grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {displays.map((post) =>
        post.files.map((file, index) => (
          <div
            key={`${post.id}-${index}`}
            className="relative cursor-pointer"
            onClick={() => handleOpenModal(post)} 
          >
            {file.endsWith(".mp4") ? (
              <video
                src={file}
                className="w-full h-40 object-cover"
                controls={false}
                muted
              />
            ) : (
              <img
                src={file}
                alt="post"
                className="w-full h-40 object-cover"
              />
            )}
          </div>
        ))
      )}

      {isModalOpen && selectedPost && (
        <GridSliderModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AllComponent;
