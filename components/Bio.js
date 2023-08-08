function Bio({ user, posts }) {
  return (
    <div className="p-2">
      <figure className="flex flex-wrap bg-white rounded-xl p-8 md:p-0 items-start">
        <img
          className="w-24 h-24 md:w-48 md:h-auto rounded-full mb-4 md:mb-0"
          src={user.image ? user.image : "/placeholder.jpg"}
          alt="profile picture"
        />
        <div className="flex flex-col justify-between ml-4">
          <figcaption className="font-medium">
            <div className="text-black font-bold">{user.name}</div>
            <div className="text-slate-700">{user.username}</div>
          </figcaption>
          <blockquote className="mt-4">
            <p className="text-lg font-normal">{user.bio}</p>
          </blockquote>
        </div>
      </figure>
    </div>
  );
}

export default Bio;
