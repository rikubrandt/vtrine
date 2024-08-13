import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import Loader from "./Loader";
import { auth, storage } from "../lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import dynamic from 'next/dynamic';

const AddressAutofill = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.AddressAutofill), { ssr: false });

const SortableItem = SortableElement(({ file, onDelete }) => (
  <div className="relative inline-block mx-2">
    <div
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-10"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(file.id);
      }}
    >
      X
    </div>
    <div className="cursor-pointer">
      {file.url ? (
        file.type.startsWith("image/") ? (
          <img src={file.url} alt="Preview" className="w-32 h-32 object-cover" />
        ) : (
          <video src={file.url} controls className="w-32 h-32 object-cover" />
        )
      ) : null}
    </div>
  </div>
));

const SortableList = SortableContainer(({ items, onDelete }) => {
  return (
    <div className="flex overflow-x-auto">
      {items.map((file, index) => (
        <SortableItem key={`item-${file.id}`} index={index} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
});

function Upload() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState({ place_name: "", lat: null, lng: null });
  const [date, setDate] = useState("");
  const [hidden, setHidden] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    setUploading(true);
    try {
      const uploadPromises = newFiles.map(async (file) => {
        const fileId = uuidv4();
        const fileRef = storage.ref().child(`uploads/${user.uid}/${fileId}`);
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        return {
          id: fileId,
          file,
          url,
          type: file.type,
          ref: fileRef
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Error uploading files");
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const fileToDelete = files.find(file => file.id === id);
    if (fileToDelete) {
      await fileToDelete.ref.delete();
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFiles(arrayMove(files, oldIndex, newIndex));
  };

  const fetchCoordinates = async (placeName) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        placeName
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_APIKEY}`
    );
    const data = await response.json();
    const [lng, lat] = data.features[0]?.center || [null, null];
    return { lat, lng };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (files.length === 0 || uploading) {
      setError("Please select files.");
      return;
    }

    setUploading(true);

    try {
      const { lat, lng } = await fetchCoordinates(location.place_name);

      const token = await auth.currentUser.getIdToken(true);
      const downloadURLs = files.map(file => file.url);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metadata: {
            title,
            caption,
            location: {
              place_name: location.place_name,
              lat,
              lng,
            },
            date,
            hidden,
            downloadURLs,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUploading(false);
        router.push("/profile");
      } else {
        setError(result.error);
        setUploading(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <div className="pl-10">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="py-12">
          <h2 className="text-2xl font-bold">Create vitrine</h2>
          <div className="mt-8 max-w-md">
            <div className="grid grid-cols-1 gap-6">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload files
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                Upload images or videos.
              </p>
              <Loader show={uploading} />
            </div>
            {files.length > 0 && (
              <>
                <SortableList items={files} onDelete={handleDelete} onSortEnd={onSortEnd} axis="x" pressDelay={200} />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  Hold and drag to rearrange.
                </p>
              </>
            )}
            <label className="block mt-6">
              <span className="text-gray-700">Title</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </label>
            <label className="block mt-6">
              <span className="text-gray-700">Location</span>
              <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_APIKEY}>
                <input
                  type="text"
                  name="location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Hacker Way 1"
                  onChange={(e) => setLocation({ place_name: e.target.value })}
                />
              </AddressAutofill>
            </label>
            <label className="block mt-6">
              <span className="text-gray-700">Date</span>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="block mt-6">
              <span className="text-gray-700">Caption</span>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </label>
            <div className="block mt-6">
              <div className="mt-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                      onChange={(e) => setHidden(e.target.checked)}
                    />
                    <span className="ml-2">Hidden</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="block mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                type="submit"
                disabled={uploading}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Upload;
