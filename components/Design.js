import React, { useEffect, useState } from "react";
import { getUserAndPostsByUID } from "../lib/firebase";
import BoardSectionList from "./BoardSectionList";

function Design() {
  const [userData, setUserData] = useState({ user: null, posts: [] });
  const [designType, setDesignType] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserAndPostsByUID();
      setUserData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="pl-10 ">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="design"
          >
            What do you want to design?
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="design"
            value={designType}
            onChange={(e) => setDesignType(e.target.value)}
          >
            <option value="">--Select a design--</option>
            <option value="slider">Slider</option>
            <option value="cluster">Cluster</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        {designType && (
          <>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Enter a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="">
              <BoardSectionList data={userData} selectedPosts={selectedPosts} />
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Design;
