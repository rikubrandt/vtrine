import React, { useEffect, useRef } from "react";

const Modal = ({ post, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white rounded-lg p-4 max-w-lg mx-auto">
        <button className="mb-4" onClick={onClose}>
          Close
        </button>
        <img
          src={post.downloadURL}
          alt="Post"
          className="w-full object-cover h-48 rounded"
        />
        <h2 className="mt-4 text-lg font-semibold">{post.title}</h2>
        <p>{post.location}</p>
        <p>{post.caption}</p>
      </div>
    </div>
  );
};

export default Modal;
