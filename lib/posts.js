export const getPostById = (posts, id) => {
  return posts.find((post) => post.id === id);
};
