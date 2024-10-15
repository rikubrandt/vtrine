import React, { useEffect, useRef } from "react";

const Modal = ({ post, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div ref={modalRef} className="bg-white rounded-lg p-8 max-w-4xl w-full mx-auto">
                <button
                    className="mb-4 text-right text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    Close
                </button>
                <img
                    src={post.downloadURL}
                    alt="Post"
                    className="w-full object-cover h-96 rounded"
                />
                <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
                <p className="text-lg">{post.location}</p>
                <p className="mt-2 text-gray-700">{post.caption}</p>
            </div>
        </div>
    );
};

export default Modal;
