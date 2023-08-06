const PostItem = ({ post, index }) => {
  return (
    <div class="box-border">
      <img
        src={post.downloadURL}
        alt={`Post ${index + 1}`}
        className="slider-image"
        draggable={true}
      />
    </div>
  );
};

export default PostItem;
