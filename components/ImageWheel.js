import React, { useState } from "react";

const ImageWheel = ({ images }) => {
  const [wheelTheta, setWheelTheta] = useState(0);
  const wheelRadius = 200; // Radius of the wheel

  const handleWheel = (event) => {
    const scrollSpeed = (event.deltaY / 360) * 20;
    setWheelTheta((prev) => prev + scrollSpeed);
  };

  return (
    <div
      onWheel={handleWheel}
      className="flex justify-center items-center h-screen"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div
        className="relative"
        style={{
          width: `${wheelRadius * 2}px`,
          height: `${wheelRadius * 2}px`,
        }}
      >
        {images.map((src, index) => {
          const angle = (360 / images.length) * index - wheelTheta;
          return (
            <div
              key={index}
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${angle}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              <img
                src={src.downloadURL}
                alt={`Slice ${index}`}
                className="w-full h-full object-cover absolute"
                style={{
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", // Simplistic slice shape
                  transformOrigin: "center bottom",
                }}
              />
              {/* Simulating a slice separation */}
              <div
                className="absolute w-full h-full"
                style={{
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                  backgroundColor: "rgba(0,0,0,0.2)", // Visual trick for separation, adjust as needed
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageWheel;
