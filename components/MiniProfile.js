import { signOutUser } from "../lib/firebase";

function MiniProfile({ username, name, image }) {
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        src={image ? image : "./placeholder.jpg"}
        className="w-16 h-16 rounded-full border p-[2px]"
      />

      <div className="flex-1 mx-4">
        <h2 className="font-bold">{username}</h2>
        <h3 className="text-sm text-gray-400">{name}</h3>
      </div>
      <button
        onClick={signOutUser}
        className="text-blue-400 text-sm font-semibold"
      >
        Sign out
      </button>
    </div>
  );
}

export default MiniProfile;
