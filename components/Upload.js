import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  firebase,
  storage,
  firestore,
  auth,
  getUserWithUsername,
  STATE_CHANGED,
} from "../lib/firebase";
import { UserContext } from "../lib/context";
import Loader from "./Loader";

function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  const [heartCount, setHeartCount] = useState(0);
  const [error, setError] = useState(null);
  const [storageRef, setStorageRef] = useState(null);
  const router = useRouter();
  const { user, username } = useContext(UserContext);

  const handleFileChange = (e) => {
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    const ref = storage.ref(`uploads/${user.uid}/${file.name}.${extension}`);
    setUploading(true);
    const task = ref.put(file);

    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);

      setProgress(+pct);
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
          setStorageRef(ref);
        });
    });
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!storageRef) {
      console.log("No file to delete.");
      return;
    }
    storageRef.delete().then(() => {
      setDownloadURL(null);
      setProgress(0);
      setStorageRef(null);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (downloadURL == null || uploading) {
      setError("Please upload picture/video.");
      return;
    }
    // Create a new post in Firestore
    const postRef = firestore.collection(`users/${user.uid}/posts`).doc();
    await postRef.set({
      id: postRef.id,
      title,
      caption,
      location,
      heartCount,
      downloadURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Redirect to the user's profile page
    router.push("/profile");
  };

  return (
    <div className="pl-10 ">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="py-12">
          <h2 className="text-2xl font-bold">Upload</h2>
          <div className="mt-8 max-w-md">
            {!downloadURL && (
              <div className="grid grid-cols-1 gap-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  Upload file
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  SVG, PNG, JPG or GIF (MAX. 800x400px) NOT REALLY.
                </p>
                <Loader show={uploading} />
              </div>
            )}
            {downloadURL && (
              <div className="grid grid-cols-1 gap-6 border border-gray-300">
                <div className="relative">
                  <img
                    src={downloadURL}
                    alt="Uploaded Pic"
                    width={500}
                    height={700}
                  />
                  <div
                    className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-black
              rounded-full flex z-50 items-center justify-center text-white"
                  >
                    <button onClick={handleDelete}>X</button>
                  </div>{" "}
                </div>
              </div>
            )}

            {downloadURL && (
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-gray-700">Title</span>
                  <input
                    type="text"
                    className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Location</span>
                  <input
                    type="text"
                    className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
                    placeholder="Hacker Way 1"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Date</span>
                  <input
                    type="date"
                    className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Caption</span>
                  <textarea
                    className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
                    rows="3"
                    onChange={(e) => setCaption(e.target.value)}
                  ></textarea>
                </label>
                <div className="block">
                  <div className="mt-2">
                    <div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="
                          rounded
                          border-gray-300
                          text-indigo-600
                          shadow-sm
                          focus:border-indigo-300
                          focus:ring
                          focus:ring-offset-0
                          focus:ring-indigo-200
                          focus:ring-opacity-50
                        "
                          onChange={(e) => setVisible(e.target.value)}
                        />
                        <span className="ml-2">Public</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="block">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    type="submit"
                    disabled={uploading}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Upload;
