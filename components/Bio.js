import React, { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";

function Bio({ user }) {
    const router = useRouter();
    const { user: currentUser } = useContext(UserContext);

    const goToSettings = () => {
        router.push("/settings");
    };

    return (
        <div className="relative flex flex-col items-center rounded-xl bg-white text-gray-700 shadow-md max-w-2xl mx-auto w-full overflow-hidden px-4 sm:px-0">
            <div className="relative mt-4 w-32 h-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img
                    className="object-cover w-full h-full"
                    src={user.image ? user.image : "/placeholder.jpg"}
                    alt="profile picture"
                />
                {currentUser && currentUser.uid === user.uid && (
                    <button
                        className="absolute top-0 right-0 mt-2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded-full text-sm"
                        onClick={goToSettings}
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="p-1 text-center">
                <h4 className="text-2xl font-semibold text-gun-metal">{user.name}</h4>
                <p className="text-atomic-tangerine font-bold">@{user.username}</p>
            </div>

            <div className="px-6 mb-2 text-center">
                <blockquote className=" rounded-lg">
                    <p className="text-lg">{user.bio}</p>
                </blockquote>
            </div>
        </div>
    );
}

export default Bio;
