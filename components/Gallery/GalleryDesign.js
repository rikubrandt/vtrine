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

export const GalleryDesign = ({ photos, selectedPhotos, onUpdateSelected }) => {
  const [items, setItems] = useState(photos);
  const [selected, setSelected] = useState(generatePlaceholders(13));
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const activeItem = items.find((item) => item.id === activeId);

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <div className="grid grid-cols-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="lg:h-[450px] h-80 overflow-y-auto">
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
                  id={item.id}
                />
              ))}
            </GalleryGrid>
          </SortableContext>
        </div>

        <div>
          <SortableContext
            id="selected"
            items={selected}
            strategy={rectSwappingStrategy}
          >
            <GalleryGrid columns={4}>
              {selected.map((item, index) => {
                return (
                  <SortableGalleryPhoto
                    key={item.id}
                    url={item?.downloadURL || "placeholder.png"} // Fallback to placeholder image if there's no downloadURL
                    index={index}
                    id={item.id}
                  />
                );
              })}
            </GalleryGrid>
          </SortableContext>
        </div>
        <DragOverlay adjustScale={true} dropAnimation={dropAnimation}>
          {activeItem ? (
            <GalleryPhoto url={activeItem.downloadURL} id={activeItem.id} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragStart(event) {
    console.log("START");
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    // If there's no drop target, do nothing.
    if (!over) {
      setActiveId(null);
      return;
    }

    const sourceIsItems = items.some((item) => item.id === active.id);
    const targetIsPlaceholder = over.id.startsWith("placeholder-");
    const overItemInSelected = selected.some((item) => item.id === over.id);

    // Get the entire activeItem from the items array
    const activeItem = items.find((item) => item.id === active.id);

    // Dragging from `items` to replace `placeholder` in `selected`
    if (sourceIsItems && targetIsPlaceholder) {
      setSelected((prev) => {
        const selectedIndex = prev.findIndex((item) => item.id === over.id);
        const updatedSelection = [...prev];
        updatedSelection[selectedIndex] = {
          ...activeItem,
        };
        return updatedSelection;
      });

      // Remove the dragged item from the items list
      setItems((prev) => prev.filter((item) => item.id !== active.id));
    }
    // Swap within the `selected` context
    else if (!sourceIsItems && overItemInSelected) {
      setSelected((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        const updatedSelection = [...prev];

        const temporaryItem = updatedSelection[oldIndex];
        updatedSelection[oldIndex] = updatedSelection[newIndex];
        updatedSelection[newIndex] = temporaryItem;

        return updatedSelection;
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }
};

const generatePlaceholders = (count) => {
  return Array.from({ length: count }).map(() => ({
    downloadURL: "imageplaceholder.png",
    id: `placeholder-${Date.now()}-${Math.random()}`,
  }));
};
