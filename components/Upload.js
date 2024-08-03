import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import Loader from "./Loader";
import { auth } from "../lib/firebase";

function Upload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    // Generate a preview URL for the file
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setFile(null);
    setFilePreview(null);
    setDownloadURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file || uploading) {
      setError("Please upload a file.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1];
      const metadata = {
        userId: user.uid,
        fileName: file.name,
        contentType: file.type,
        title,
        caption,
        location,
        date,
        visible,
      };

      try {
        const token = await auth.currentUser.getIdToken(true);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ file: base64File, metadata }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Unknown error");
        }

        const result = await response.json();

        if (result.success) {
          setDownloadURL(result.downloadURL);
          setUploading(false);
          router.push("/profile");
        } else {
          setError(result.error);
          setUploading(false);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setError(error.message);
        setUploading(false);
      }
    };
  };

  return (
    <div className="pl-10">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="py-12">
          <h2 className="text-2xl font-bold">Upload</h2>
          <div className="mt-8 max-w-md">
            {!file && (
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
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  Upload images or videos (max size 100MB).
                </p>
                <Loader show={uploading} />
              </div>
            )}
            {file && (
              <div className="relative grid grid-cols-1 gap-6">
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={handleDelete}
                >
                  X
                </button>
                {filePreview && file.type.startsWith("image/") && (
                  <img src={filePreview} alt="File Preview" className="w-full h-auto" />
                )}
                {filePreview && file.type.startsWith("video/") && (
                  <video src={filePreview} controls className="w-full h-auto" />
                )}
                <label className="block">
                  <span className="text-gray-700">Title</span>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Location</span>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Hacker Way 1"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Date</span>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Caption</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={(e) => setVisible(e.target.checked)}
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
