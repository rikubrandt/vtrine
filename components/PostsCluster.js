import React, { useState } from "react";

const Modal = ({ content, onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="modal-content bg-white p-4">
        {content.type === "image" ? (
          <img
            src={content.src}
            alt="Modal Content"
            className="modal-img w-full h-auto"
          />
        ) : (
          <video className="model-vid w-full h-auto" controls>
            <source src={content.src} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

function isVideo(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function PostsCluster({ posts }) {
  const [modalContent, setModalContent] = useState(null);

  const handleContentClick = (src, postIsVideo) => {
    setModalContent({ type: postIsVideo ? "video" : "image", src });
  };

  const closeModal = () => {
    setModalContent(null);
  };
  return (
    <>
      <div className="text-left pl-10">
        <h1 className="font-bold font-mono text-3xl dark:text-white">
          Image Gallery With Grid
        </h1>
        <p className="text-lg mt-2 font-serif text-gray-500 dark:text-gray-400">
          Your Location Here
        </p>
      </div>
      <div className="px-2 lg:px-8 py-8 mx-auto items-center">
        <div
          style={{
            columnCount: 3,
            columnGap: "0.1rem",
          }}
          className="md:column-count-3 lg:column-count-4" // Ensure there are 2 to 4 columns
        >
          {posts.map((post, index) => {
            const postIsVideo = isVideo(post.downloadURL);
            return (
              <div key={index} className="break-inside-avoid mb-0.5">
                {postIsVideo ? (
                  <video
                    className="w-full h-auto cursor-pointer"
                    onClick={() => handleContentClick(post.downloadURL, true)}
                    controls
                  >
                    <source src={post.downloadURL} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={post.downloadURL}
                    alt={`Post ${index + 1}`}
                    className="w-full h-auto cursor-pointer"
                    onClick={() => handleContentClick(post.downloadURL, false)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {modalContent && <Modal content={modalContent} onClose={closeModal} />}
    </>
  );
}

export default PostsCluster;
