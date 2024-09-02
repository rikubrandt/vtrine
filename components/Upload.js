import React, { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import Loader from "./Loader";
import { auth, storage } from "../lib/firebase";
import getCroppedImg from '../lib/cropImage';
import { v4 as uuidv4 } from 'uuid';
import Cropper from 'react-easy-crop';
import dynamic from 'next/dynamic';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { CropperModal } from "./CropperModal";
import Pica from 'pica';

const AddressAutofill = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.AddressAutofill), { ssr: false });

const SortableItem = SortableElement(({ file, onDelete, onImageClick }) => (
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
      <div className="cursor-pointer" onClick={() => onImageClick(file)}>
        <img src={file.preview || file.url} alt="Preview" className="w-32 h-32 object-cover" />
      </div>
    </div>
  ));
  

const SortableList = SortableContainer(({ items, onDelete, onImageClick }) => {
  return (
    <div className="flex overflow-x-auto">
      {items.map((file, index) => (
        <SortableItem
          key={`item-${file.id}`}
          index={index}
          file={file}
          onDelete={onDelete}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
});

function Upload() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [cropping, setCropping] = useState(null); // For the currently cropping image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(4 / 5); // Default aspect ratio
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentFile, setCurrentFile] = useState(null); // For handling the re-cropping in the modal
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState({ place_name: "", lat: null, lng: null });
  const [date, setDate] = useState("");
  const [hidden, setHidden] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // We only allow one file at a time now
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCropping({ file, src: reader.result });
      };
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAddCroppedImage = async () => {
    if (!croppedAreaPixels) {
      console.error("Cropped area not set correctly");
      return;
    }
  
    const croppedPreview = await getCroppedImg(cropping.src, croppedAreaPixels, rotation);
  
    setFiles((prevFiles) => [
      ...prevFiles,
      {
        id: uuidv4(),
        file: cropping.file,
        src: cropping.src,
        cropData: { crop, zoom, croppedAreaPixels, rotation },
        url: cropping.src, // Full image
        preview: croppedPreview, // Cropped preview
        type: cropping.file.type,
      },
    ]);
    setCropping(null);
  };
  

  

  const handleDelete = async (id) => {
    const fileToDelete = files.find((file) => file.id === id);
    if (fileToDelete) {
      await fileToDelete.ref?.delete();
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFiles(arrayMove(files, oldIndex, newIndex));
  };

  const handleImageClick = (file) => {
    setCurrentFile(file); // Set the current file for re-cropping
    setShowModal(true); 
  };

  const handleSaveCroppedImage = async (updatedFile, croppedImageBlob) => {
    // Generate a cropped preview image to display in the SortableItem
    const croppedPreview = await getCroppedImg(updatedFile.src, updatedFile.cropData.croppedAreaPixels, updatedFile.cropData.rotation);
  
    // Update the specific file in the files array with the new crop data and image blob
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === updatedFile.id
          ? { ...updatedFile, url: croppedImageBlob, cropData: updatedFile.cropData, preview: croppedPreview }
          : file
      )
    );
    setShowModal(false);
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
  
      // Process each file independently
      const croppedImages = await Promise.all(
        files.map(async (file) => {
          const { cropData } = file;
  
          if (!cropData || !cropData.croppedAreaPixels) {
            console.error("Missing or incomplete crop data for file:", file);
            throw new Error("Missing or incomplete crop data for one or more images.");
          }
  
          const { croppedAreaPixels } = cropData;
  
          // Create a new canvas for each image to avoid conflicts
          const croppedImageCanvas = document.createElement('canvas');
          const croppedContext = croppedImageCanvas.getContext('2d');
  
          if (!croppedAreaPixels.width || !croppedAreaPixels.height) {
            console.error("Invalid croppedAreaPixels data:", croppedAreaPixels);
            throw new Error("Invalid crop data.");
          }
  
          croppedImageCanvas.width = croppedAreaPixels.width;
          croppedImageCanvas.height = croppedAreaPixels.height;
  
          const image = new Image();
          image.src = file.src;
          await new Promise((resolve) => (image.onload = resolve));
  
          croppedContext.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
  
          const pica = Pica();
          const blob = await pica.toBlob(croppedImageCanvas, 'image/jpeg', 0.9);
  
          // Upload each cropped image separately
          const fileId = uuidv4();
          const fileRef = storage.ref().child(`uploads/${user.uid}/${fileId}`);
          await fileRef.put(blob, { contentType: 'image/jpeg' });
          const url = await fileRef.getDownloadURL();
          return url; // Return the download URL of the uploaded image
        })
      );
  
      // Create the post with all the cropped image URLs
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
            downloadURLs: croppedImages, // Array of image URLs
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
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="py-12">
            <h2 className="text-2xl font-bold">Upload and Edit Files</h2>
            <div className="mt-8 max-w-md">
              {cropping ? (
                <div>
                  <div className="relative w-full h-64 md:h-96">
                    <Cropper
                      image={cropping.src}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspectRatio}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-700 rounded"
                      onClick={() => setCropping(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                      onClick={handleAddCroppedImage}
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              ) : (
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
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    Upload images one by one.
                  </p>
                  <Loader show={uploading} />
                </div>
              )}
              {files.length > 0 && (
                <>
                  <SortableList
                    items={files}
                    onDelete={handleDelete}
                    onSortEnd={onSortEnd}
                    onImageClick={handleImageClick}
                    axis="x"
                    pressDelay={200}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    Hold and drag to rearrange.
                  </p>
                </>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  onClick={() => setStep(2)}
                  disabled={files.length === 0 || uploading}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-12">
            <h2 className="text-2xl font-bold">Enter Details</h2>
            <div className="mt-8 max-w-md">
              <label className="block mt-6">
                <span className="text-gray-700">Title</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
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
                    required
                  />
                </AddressAutofill>
              </label>
              <label className="block mt-6">
                <span className="text-gray-700">Date</span>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
              <label className="block mt-6">
                <span className="text-gray-700">Caption</span>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="3"
                  onChange={(e) => setCaption(e.target.value)}
                  required
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
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-700 rounded mr-4"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
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
        )}
      </form>

      {/* CropperModal for re-cropping existing images */}
      {showModal && currentFile && (
        <CropperModal
          showModal={showModal}
          setShowModal={setShowModal}
          currentFile={currentFile}
          onSave={handleSaveCroppedImage}
        />
      )}
      <div id="modal"></div>
    </div>
  );
}

export default Upload;
