import React, { forwardRef } from "react";

export const GalleryPhoto = forwardRef(
  ({ url, index, faded, style, ...props }, ref) => {
    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: index === 5 ? 410 : 200,
      gridRowStart: index === 5 ? "span 2" : null,
      gridColumnStart: index === 5 ? "span 2" : null,
      backgroundImage: `url("${url}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "grey",
      margin: "0px",
      ...style,
    };

    return <div ref={ref} style={inlineStyles} {...props} />;
  }
);
