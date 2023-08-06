import React from "react";

function PostsCluster({ posts }) {
  return (
    <div className="p-1 grid grid-cols-4 gap-4">
      {posts.map((post, index) => (
        <div
          key={index}
          className={`border rounded overflow-hidden ${
            index === 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          <img
            src={post.downloadURL}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default PostsCluster;
