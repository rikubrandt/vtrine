import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

async function fetchUsers() {
  const usersRef = firestore.collection("users");
  const usersSnapshot = await usersRef.get();
  const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return users;
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const allUsers = await fetchUsers();
      setUsers(allUsers);
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = users.filter((user) => {
        const username = user.username ? user.username.toLowerCase() : "";
        const name = user.Name ? user.Name.toLowerCase() : "";
        return username.includes(searchQuery.toLowerCase()) || name.includes(searchQuery.toLowerCase());
      });
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const handleLinkClick = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative max-w-xs">
      <div className="relative mt-1 p-3 rounded-md">
        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="bg-gray-200 block w-full pl-10 sm:text-sm rounded-md border-gray-300 focus:ring-black focus:border-black"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredUsers.length > 0 && (
        <div className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <Link key={user.id} href={`/${user.username}`} passHref>
              <div className="block p-2 hover:bg-gray-100 cursor-pointer" onClick={handleLinkClick}>
                <div className="flex items-center">
                  <img
                    className="w-8 h-8 rounded-full mr-3"
                    src={user.photoURL || "/placeholder.jpg"}
                    alt={user.username}
                  />
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.Name}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
