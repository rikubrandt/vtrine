import React, { useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import PostItem from "./PostItem";
import SortablePostItem from "./SortablePostItem";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const MutationPlugin = (slider) => {
  const observer = new MutationObserver(function () {
    slider.update();
  });
  const config = { childList: true };

  slider.on("created", () => {
    observer.observe(slider.container, config);
  });
  slider.on("destroyed", () => {
    observer.disconnect();
  });
};

const BoardSection = ({ id, title, posts, selectedPosts }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const [sliderRef] = useKeenSlider({
    loop: false,
    slides: {
      perView: 3,
      spacing: 15,
    },
    plugins: [MutationPlugin],
  });

  return (
    <div
      ref={sliderRef}
      className="keen-slider container mx-auto"
      style={{
        width: "100%",
      }}
    >
      <SortableContext
        id={id}
        items={posts || []}
        strategy={horizontalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex border border-l-rose-400">
          {posts ? (
            posts.map((post, index) => (
              <div
                className="keen-slider__slide"
                key={post.id}
                style={{ height: 200 }}
              >
                <SortablePostItem id={post.id}>
                  <PostItem post={post} index={index} />
                </SortablePostItem>
              </div>
            ))
          ) : (
            <div>No posts </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default BoardSection;
