import { useEffect, useState } from "react";
import Link from "next/link";
import { firestore } from "../lib/firebase";

async function getRandomUsers(limit = 5) {
    const usersRef = firestore.collection("users");
    const usersSnapshot = await usersRef.get();
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // Random subset of users
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    return shuffledUsers.slice(0, limit);
}

function Suggestions() {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        async function fetchSuggestions() {
            const suggestions = await getRandomUsers();
            setSuggestions(suggestions);
        }
        fetchSuggestions();
    }, []);

    return (
        <div className="mt-4 ml-10">
            <div className="flex justify-between text-sm mb-5">
                <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
                <button className="text-gray-600 font-semibold">See All</button>
            </div>

            {suggestions.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between mt-3">
                    <img
                        className="w-10 h-10 rounded-full border p-[2px]"
                        src={profile.photoURL || "/placeholder.jpg"}
                        alt={profile.username}
                    />
                    <div className="flex-1 ml-4">
                        <Link href={`/${profile.username}`} passHref>
                            <h2 className="font-semibold text-sm cursor-pointer">{profile.name}</h2>
                        </Link>
                        <h3 className="text-xs text-gray-400">{profile.username}</h3>
                    </div>
                    <button className="text-blue-400 text-xs font-bold">Follow</button>
                </div>
            ))}
        </div>
    );
}

export default Suggestions;
