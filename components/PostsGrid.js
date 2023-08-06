import React, { useState } from "react";
import Modal from "./Modal";

function PostsGrid({ posts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <div
          key={index}
          className="border rounded cursor-pointer"
          onClick={() => setSelectedPost(post)}
        >
          <img
            src={post.downloadURL}
            alt={`Post ${index + 1}`}
            className="w-full object-cover h-48 rounded"
          />
        </div>
      ))}
      {selectedPost && (
        <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

export default PostsGrid;
