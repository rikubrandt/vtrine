import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  Droppable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { CSS } from "@dnd-kit/utilities";

function PhotoGrid({ initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [orderedPhotos, setOrderedPhotos] = useState([photos]);
  const [selectedPhotos, setSelectedPhotos] = useState([]); // State for the photos in the droppable grid area
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (event) => {
    //console.log("Drag started", event);
    setDraggedItem(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedItem(null);
    console.log(active, over);
    if (!over || active.id === over.id) return;

    // Extract the dragged photo from the photos array
    const draggedPhoto = photos.find(
      (photo) => photo.id.toString() === active.id
    );

    // If there's no dragged photo or if it's dropped outside any container, exit
    if (!draggedPhoto) return;

    if (over.id === "target") {
      // Remove photo from the initial photos list
      setPhotos((prev) => prev.filter((photo) => photo.id !== draggedPhoto.id));

      // Add photo to the target photos list
      setSelectedPhotos((prev) => [...prev, draggedPhoto]);
    }
    // Optional: If you want to drag back from target to initial
    else if (over.id === "initial") {
      // Remove photo from the target photos Dow Jones
      setSelectedPhotos((prev) =>
        prev.filter((photo) => photo.id !== draggedPhoto.id)
      );

      // Add photo back to the initial photos list
      setPhotos((prev) => [...prev, draggedPhoto]);
    }
  };
  return (
    <div className="pl-10">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DroppableContainer id={"initial"} photos={photos} />

        <Grid id={"target"} photos={selectedPhotos} />

        <DragOverlay>
          {draggedItem ? (
            <img
              src={
                photos.find((photo) => photo.id.toString() === draggedItem)
                  ?.downloadURL
              }
              alt="Dragged item"
              className="w-48 h-48"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default PhotoGrid;

const DroppableContainer = ({ id, photos = [] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      id={id}
      ref={setNodeRef}
      className="container bg-red-100 w-full p-1 mb-4"
    >
      <SortableContext
        strategy={rectSortingStrategy}
        items={photos.map((photo) => photo.id.toString())}
      >
        <div className="h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {photos.length ? (
            photos.map((photo) => (
              <DraggablePhoto id={photo.id} key={photo.id} photo={photo} />
            ))
          ) : (
            <span className="col-span-full flex justify-center items-center">
              Drag photos here
            </span>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const Grid = ({ id, photos = [] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Grid item (photo slot) dimensions
  const gridItemWidth = "full"; // example size
  const gridItemHeight = "1000px"; // example size

  return (
    <div
      id={id}
      ref={setNodeRef}
      className="container bg-gray-100 w-full p-1 mb-4"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, ${gridItemWidth})`,
        gap: "16px",
        justifyContent: "center",
      }}
    >
      <SortableContext
        strategy={rectSortingStrategy}
        items={photos.map((photo) => photo.id.toString())}
      >
        {Array(photos.length || 1)
          .fill(0)
          .map((_, index) => (
            <div
              className="border flex justify-center items-center"
              style={{
                width: gridItemWidth,
                height: gridItemHeight,
                position: "relative",
              }}
              key={index}
            >
              {photos[index] ? (
                <DraggablePhoto id={photos[index].id} photo={photos[index]} />
              ) : (
                <span className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                  Drag photos here
                </span>
              )}
            </div>
          ))}
      </SortableContext>
    </div>
  );
};

const DraggablePhoto = ({ photo }) => {
  const { setNodeRef, listeners, transform, isDragging } = useSortable({
    id: photo.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      role="button"
      ref={setNodeRef}
      {...listeners}
      style={style}
      className="border rounded cursor-pointer"
    >
      <img
        src={photo.downloadURL}
        alt={photo.title}
        className={`w-full object-cover h-48 rounded ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      />
    </div>
  );
};
