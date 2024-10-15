import Post from "./Post";

const posts = [
    {
        id: "123",
        username: "riku",
        userImg: "/fuckReact.jpg",
        img: "/fuckReact.jpg",
        caption: "This is nice.",
    },
    {
        id: "321",
        username: "gege",
        userImg: "/fuckReact.jpg",
        img: "/fuckReact.jpg",
        caption: "This is awesome.",
    },
    {
        id: "431",
        username: "gugugaga",
        userImg: "/fuckReact.jpg",
        img: "/fuckReact.jpg",
        caption: "This is fun.",
    },
];

function Posts() {
    return (
        <div>
            {posts.map((post) => (
                <Post
                    key={post.id}
                    id={post.id}
                    username={post.username}
                    userImg={post.userImg}
                    img={post.img}
                    caption={post.caption}
                />
            ))}
        </div>
    );
}

export default Posts;
