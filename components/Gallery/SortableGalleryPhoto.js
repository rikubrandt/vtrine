import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GalleryPhoto } from "./GalleryPhoto";

export const SortableGalleryPhoto = ({ url, id, index }) => {
  const sortable = useSortable({ id: id });
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <GalleryPhoto
      ref={setNodeRef}
      style={style}
      url={url || "imageplaceholder.png"}
      index={index}
      {...attributes}
      {...listeners}
    />
  );
};
