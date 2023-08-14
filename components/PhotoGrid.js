import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function PhotoGrid({ initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [orderedPhotos, setOrderedPhotos] = useState(photos);
  const [draggedItem, setDraggedItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    console.log("Drag started", event);
    setDraggedItem(event.active.id);
  };

  const handleDragEnd = (event) => {
    setDraggedItem(null);
    const { active, over } = event;
    console.log("Active:", active);
    console.log("Over:", over);
    if (active.id !== over.id) {
      console.log("DRAG END IF");
      const oldIndex = orderedPhotos.findIndex(
        (photo) => photo.id.toString() === active.id
      );
      const newIndex = orderedPhotos.findIndex(
        (photo) => photo.id.toString() === over.id
      );

      console.log(oldIndex, newIndex);
      setOrderedPhotos(arrayMove(orderedPhotos, oldIndex, newIndex));
    }
  };

  return (
    photos && (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext
          strategy={rectSortingStrategy}
          items={orderedPhotos.map((photo) => photo.id.toString())}
        >
          <div className="grid grid-cols-3 gap-4">
            {orderedPhotos.map((photo) => (
              <DraggablePhoto id={photo.id} key={photo.id} photo={photo} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {draggedItem ? (
            <img
              src={
                orderedPhotos.find(
                  (photo) => photo.id.toString() === draggedItem
                ).downloadURL
              }
              alt="Dragged item"
              className="w-full h-auto"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    )
  );
}

export default PhotoGrid;

const DraggablePhoto = ({ photo }) => {
  const { setNodeRef, listeners, transform, isDragging } = useSortable({
    id: photo.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div role="button" ref={setNodeRef} {...listeners} style={style}>
      <img
        src={photo.downloadURL}
        alt={photo.title}
        className={`w-full h-auto ${isDragging ? "opacity-50" : "opacity-100"}`}
      />
    </div>
  );
};
