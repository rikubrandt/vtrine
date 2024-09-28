import React, { useEffect, useRef, useState } from "react";
import GridSlider from "./GridSlider";
import { MapPinIcon } from "@heroicons/react/24/solid";

const MobileModal = ({ post, onClose }) => {
  const modalRef = useRef();
  const textRef = useRef(null); // Ref for the text content
  const [isExpanded, setIsExpanded] = useState(false); // State to track expanded/collapsed state
  const [isOverflowing, setIsOverflowing] = useState(false); // Track if the text is overflowing

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !modalRef.current.contains(event.relatedTarget)
      ) {
        onClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (textRef.current) {
      const textHeight = textRef.current.scrollHeight;
      const containerHeight = 32; // Height for roughly 2 lines

      if (textHeight > containerHeight) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
  }, [post.caption, isExpanded]); 

  const toggleExpand = () => setIsExpanded(!isExpanded); 

  // Function to replace \n with <br /> to respect new lines
  const formatBioText = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handleClickOnModal = (event) => {
    const modalRect = modalRef.current.getBoundingClientRect();
    const clickY = event.clientY;
    const clickX = event.clientX;

    const modalTopHalf = modalRect.top + modalRect.height / 2;
    const modalBottom30 = modalRect.bottom - modalRect.height * 0.3;
    const modalLeftSide = modalRect.left + modalRect.width / 2;

    const clickedElement = event.target;


    if (clickY <= modalTopHalf && isExpanded) {
      setIsExpanded(false);
    }

    if (clickY >= modalBottom30 && clickX <= modalLeftSide && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onClick={handleClickOnModal} 
    >
      <div
        ref={modalRef}
        className="relative bg-white w-full min-height-40 max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-2 md:mx-6 mt-4 md:mt-10 rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black rounded-full bg-opacity-60 hover:bg-opacity-80 border border-white border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out w-10 h-10 flex items-center justify-center z-50"
          aria-label="Close modal"
        >
          x
        </button>

        <div className="relative w-full md:h-80 lg:h-96">
          {post.files && post.files.length > 0 && (
            <GridSlider
              post={post.files.map((url, i) => ({
                id: `${post.id}-${i}`,
                downloadURL: url,
              }))}
            />
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-transparent to-transparent transition-all duration-300 ${
              isExpanded ? "h-full bg-black bg-opacity-70" : "max-h-[40%]"
            }`}
          >
            <div className="mb-2">
              <p id="modal-title" className="text-xl font-bold text-white">
                {post.title}
              </p>
            </div>

            <div className="text-white">
              {post.location?.place_name && (
                <div className="text-sm font-medium mb-2 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {post.location.place_name}
                </div>
              )}
              <p className="text-sm font-medium text-purple-300 mb-2">
                {post.date}
              </p>

              <div className="flex items-start">
                <div
                  ref={textRef}
                  className={`text-sm overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-none" : "max-h-[3rem]" 
                  }`}
                >
                  {formatBioText(post.caption)}
                </div>


                {isOverflowing && !isExpanded && (
                  <button
                    className="text-sm ml-2 mb-2 underline text-purple-300 focus:outline-none"
                    onClick={toggleExpand}
                  >
                    Read More
                  </button>
                )}
              </div>

              {isExpanded && (
                <button
                  className="text-sm  underline text-purple-300 focus:outline-none"
                  onClick={toggleExpand}
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileModal;
