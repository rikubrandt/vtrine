import { getUserAndPostsByUID } from "./firebase";
import { getPostsByStatus } from "./posts";

export const initializeBoard = (posts) => {
  let boardSections = {
    photos: [],
    slider: [],
  };

  if (posts.length > 0) {
    boardSections = {
      photos: posts.slice(0, posts.length - 1),
      slider: [posts[posts.length - 1]],
    };
  }

  return boardSections;
};

export const findBoardSectionContainer = (boardSections, id) => {
  if (id in boardSections) {
    return id;
  }

  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((post) => post.id === id)
  );
  return container;
};
