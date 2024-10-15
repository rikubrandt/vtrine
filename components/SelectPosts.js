function SelectPosts({ selectedPosts, posts, onSelectedPostsChange }) {
    const handlePostSelect = (postId) => {
        // If the post is already selected, deselect it
        const postIndexInSelectedPosts = selectedPosts.findIndex((post) => post.id === postId);
        if (postIndexInSelectedPosts !== -1) {
            const newSelectedPosts = [...selectedPosts];
            newSelectedPosts.splice(postIndexInSelectedPosts, 1);
            onSelectedPostsChange(
                newSelectedPosts.map((post, index) => ({ ...post, order: index + 1 })),
            );
        }
        // Otherwise, select the post and assign it the next order number
        else {
            const post = posts.find((post) => post.id === postId);
            onSelectedPostsChange([...selectedPosts, { ...post, order: selectedPosts.length + 1 }]);
        }
    };

    return (
        <>
            <h2>Select images</h2>
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={`image-select-item ${
                            selectedPosts.some((selectedPost) => selectedPost.id === post.id)
                                ? "active"
                                : ""
                        }`}
                        onClick={() => handlePostSelect(post.id)}
                    >
                        <img
                            src={post.downloadURL}
                            className="object-cover block"
                            draggable={false}
                        />
                        <span className="checkbox">
                            {
                                // If the post is selected, display its order number
                                selectedPosts.find((selectedPost) => selectedPost.id === post.id)
                                    ?.order
                            }
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SelectPosts;
