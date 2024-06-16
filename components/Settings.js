import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  firebase,
  storage,
  firestore,
  getUserByUID,
  auth,
  STATE_CHANGED,
} from "../lib/firebase";
import { UserContext } from "../lib/context";
import Loader from "./Loader";

function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [storageRef, setStorageRef] = useState(null);
  const [image, setImage] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const doc = await getUserByUID(user.uid);
        console.log(doc);
        if (doc) {
          setName(doc.name);
          setUsername(doc.username);
          setBio(doc.bio);
          setImage(doc.image);
          setEmail(doc.email);
        }
      }
    };
    fetchUser();
  }, [user]);

  const handleFileChange = (e) => {
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    const ref = storage.ref(
      `uploads/${user.uid}/profile/${file.name}.${extension}`
    );
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
          // Set the download URL state
          setImage(url);

          // Update the user's photoURL in Firebase Authentication
          auth.currentUser
            .updateProfile({
              photoURL: url,
            })
            .then(() => {
              console.log("PhotoURL updated");
            })
            .catch((error) => {
              console.error("Error updating photoURL: ", error);
            });

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
      setStorageRef(null);
      setProgress(0);
      setStorageRef(null);
      auth.currentUser.updateProfile({ photoURL: null });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Create a new post in Firestore
    const userDoc = firestore.doc(`users/${user.uid}`);
    await userDoc.update({
      email: email,
      bio: bio,
      age: age,
      image: image,
      name: name,
      username: username,
    });

    // Redirect to the user's profile page
    router.push("/profile");
  };

  return (
    <div className="pl-10 ">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="py-12">
          <h2 className="text-2xl font-bold">Profile</h2>
          <div className="mt-8 max-w-md">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <img
                  className="w-21 h-21 rounded-full border p-[2px]"
                  src={image ? image : "./placeholder.jpg"}
                  alt="Uploaded Pic"
                  width={500}
                  height={700}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  Upload profile picture
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
                {storageRef && (
                  <div className="p-2 w-full text-sm text-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                    <button
                      onClick={handleDelete}
                      className="hover:bg-gray-100 bg-red-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    >
                      Delete profile picture
                    </button>
                  </div>
                )}

                <Loader show={uploading} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Username</span>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Name</span>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Age</span>
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
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Bio</span>
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
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
