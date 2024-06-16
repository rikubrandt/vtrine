import React, { useEffect, useState } from "react";
import { getUserAndPostsByUID, firestore } from "../lib/firebase";
import BoardSectionList from "./BoardSectionList";
import SelectPosts from "./SelectPosts";
import GridSlider from "./GridSlider";
import { GalleryDesign } from "./Gallery/GalleryDesign";
function Design() {
  const [userData, setUserData] = useState({
    user: null,
    posts: [],
    uid: null,
  });
  const [designType, setDesignType] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [postsSelected, setPostSelected] = useState(false);
  const handleSelectedPosts = (newPosts) => {
    console.log(newPosts);
    setSelectedPosts(newPosts);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserAndPostsByUID();
      setUserData(data);
    };
    fetchData();
  }, []);

  // ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData.user);
    if (!userData.user) {
      console.error("User is not signed in.");
      return;
    }

    // Create a new document reference
    const displayRef = firestore
      .collection(`users/${userData.uid}/displays`)
      .doc();
    await displayRef.set({ designType, title, selectedPosts });

    console.log("Vitrine created with ID: ", displayRef.id);
  };

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
          <div className="mb-4">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}

        {designType == "slider" && (
          <>
            {selectedPosts.length === 0 ? (
              <div className="lg:h-[280px] h-[110px] w-full flex items-center justify-center bg-gray-200 text-2xl font-semibold text-gray-700">
                Select posts
              </div>
            ) : (
              designType === "slider" && <GridSlider posts={selectedPosts} />
            )}
            {!postsSelected && designType && (
              <SelectPosts
                posts={userData.posts}
                selectedPosts={selectedPosts}
                onSelectedPostsChange={handleSelectedPosts}
              />
            )}

            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white"
              onClick={handleSubmit}
            >
              Create vitrine
            </button>
          </>
        )}
        {designType == "cluster" && (
          <div>
            <GalleryDesign
              photos={userData.posts}
              selectedPhotos={selectedPosts}
              onSelectedPostsChange={handleSelectedPosts}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Design;
