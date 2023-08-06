import React from "react";
import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 150,
        border: "1px solid",
        margin: 20,
        borderColor: isOver ? "#4c9ffe" : "#EEE",
      }}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}
export default Droppable;
