import React from "react";

export function GalleryGrid({ children, columns }) {
  return (
    <div
      className=""
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: 10,
        padding: 10,
      }}
    >
      {children}
    </div>
  );
}
