import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DropAnimation,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";

import { GalleryGrid } from "./GalleryGrid";
import { SortableGalleryPhoto } from "./SortableGalleryPhoto";
import { GalleryPhoto } from "./GalleryPhoto";

const GalleryDesign = ({ photos }) => {
  const [items, setItems] = useState(photos);
  const [selected, setSelected] = useState(generatePlaceholders(10));
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const activeItem = items.find((item) => item.id === activeId);

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          id="init"
          items={items}
          strategy={rectSwappingStrategy}
        >
          <GalleryGrid columns={4}>
            {items.map((item, index) => (
              <SortableGalleryPhoto
                key={item.id}
                url={item.downloadURL}
                index={index}
                id={item.id}
              />
            ))}
          </GalleryGrid>
        </SortableContext>

        <SortableContext
          id="selected"
          items={selected}
          strategy={rectSwappingStrategy}
        >
          <GalleryGrid columns={4}>
            {selected.map((item, index) => {
              return (
                <SortableGalleryPhoto
                  key={index}
                  url={item?.downloadURL || "placeholder.png"} // Fallback to placeholder image if there's no downloadURL
                  index={index}
                  id={item.id}
                />
              );
            })}
          </GalleryGrid>
        </SortableContext>

        <DragOverlay adjustScale={true} dropAnimation={dropAnimation}>
          {activeItem ? (
            <GalleryPhoto
              url={activeItem.downloadURL}
              index={items.indexOf(activeId)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );

  function handleDragStart(event) {
    console.log("START");
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active, over);
    // If there's no drop target, do nothing.
    if (!over) {
      setActiveId(null);
      return;
    }

    // Determine the source and target contexts.
    const sourceIsItems = items.some((item) => item.id === active.id);
    const targetIsItems = items.some((item) => item.id === over.id);
    const targetIsPlaceholder = over.id.startsWith("placeholder-");

    // Dragging from `items` to replace `placeholder` in `selected`
    if (sourceIsItems && targetIsPlaceholder) {
      setSelected((prev) => {
        const selectedIndex = prev.findIndex((item) => item.id === over.id);
        const updatedSelection = [...prev];
        updatedSelection[selectedIndex] = activeItem; // Replace the placeholder with the actual image
        return updatedSelection;
      });

      // Remove the dragged item from the items list
      setItems((prev) => prev.filter((item) => item.id !== active.id));
    }
    // Reorder within the items context
    else if (sourceIsItems && targetIsItems) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
    // Reorder within the selected context
    else if (!sourceIsItems && !targetIsItems && !targetIsPlaceholder) {
      setSelected((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }
};

export default GalleryDesign;

const generatePlaceholders = (count) => {
  return Array.from({ length: count }).map(() => ({
    downloadURL: "imageplaceholder.png",
    id: `placeholder-${Date.now()}-${Math.random()}`,
  }));
};
