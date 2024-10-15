import React, { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import Loader from "./Loader";
import { auth, storage } from "../lib/firebase";
import getCroppedImg from "../lib/cropImage";
import { v4 as uuidv4 } from "uuid";
import Cropper from "react-easy-crop";
import dynamic from "next/dynamic";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CropperModal } from "./CropperModal";
import { withAuth } from "./withAuth";
import fileTypeChecker from "file-type-checker";
import { PhotoIcon } from "@heroicons/react/24/solid";

const AddressAutofill = dynamic(
    () => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill),
    { ssr: false },
);

function Upload() {
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState([]);
    const [cropping, setCropping] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(null); // Aspect ratio will be determined dynamically
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
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
        const file = e.target.files[0];
        const imageTypes = ["jpeg", "png", "webp", "bmp"];
        const videoTypes = ["mp4", "mov", "avi", "mkv"];

        if (file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = async () => {
                const arrayBuffer = reader.result;
                const isImage = fileTypeChecker.validateFileType(arrayBuffer, imageTypes);
                const isVideo = fileTypeChecker.validateFileType(arrayBuffer, videoTypes);

                if (isImage) {
                    const imageReader = new FileReader();
                    imageReader.readAsDataURL(file);
                    imageReader.onloadend = async () => {
                        if (!aspectRatio) {
                            const newAspectRatio = await determineAspectRatio(file);
                            setAspectRatio(newAspectRatio);
                        }
                        setCropping({ file, src: imageReader.result, type: "image" });
                    };
                } else if (isVideo) {
                    const videoReader = new FileReader();
                    videoReader.readAsDataURL(file); // Convert video to base64
                    videoReader.onloadend = async () => {
                        if (!aspectRatio) {
                            const newAspectRatio = await determineAspectRatio(file);
                            setAspectRatio(newAspectRatio);
                        }
                        setCropping({
                            file,
                            src: videoReader.result,
                            isVideo: true,
                            type: "video",
                        });
                    };
                } else {
                    setError("Only images or videos are allowed.");
                }
            };
        }
    };

    const determineAspectRatio = (file) => {
        return new Promise((resolve) => {
            const fileUrl = URL.createObjectURL(file);
            if (file.type.startsWith("image/")) {
                const image = new Image();
                image.onload = () => {
                    const aspect = image.width > image.height ? 1 / 1 : 9 / 16;
                    resolve(aspect);
                };
                image.src = fileUrl;
            } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video");
                video.onloadedmetadata = () => {
                    const aspect = video.videoWidth > video.videoHeight ? 1 / 1 : 9 / 16;
                    resolve(aspect);
                };
                video.src = fileUrl;
            }
        });
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleAddCroppedImage = async () => {
        if (!croppedAreaPixels) {
            console.error("Cropped area not set correctly");
            return;
        }

        if (cropping.isVideo) {
            setFiles((prevFiles) => [
                ...prevFiles,
                {
                    id: uuidv4(),
                    file: cropping.file,
                    src: cropping.src,
                    cropData: { crop, zoom, croppedAreaPixels, rotation },
                    preview: cropping.src, // Preview for the video
                    type: "video",
                },
            ]);
        } else {
            try {
                const croppedPreview = await getCroppedImg(
                    cropping.src,
                    croppedAreaPixels,
                    rotation,
                    { horizontal: false, vertical: false },
                );

                setFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        id: uuidv4(),
                        file: cropping.file,
                        src: cropping.src,
                        cropData: { crop, zoom, croppedAreaPixels, rotation },
                        preview: croppedPreview,
                        type: "image",
                    },
                ]);
            } catch (error) {
                console.error("Error cropping image:", error);
            }
        }

        setCropping(null);
    };

    const handleDelete = async (id) => {
        const fileToDelete = files.find((file) => file.id === id);
        if (fileToDelete) {
            await fileToDelete.ref?.delete();
            setFiles((prevFiles) => {
                const updatedFiles = prevFiles.filter((file) => file.id !== id);
                if (updatedFiles.length === 0) {
                    setAspectRatio(null);
                }
                return updatedFiles;
            });
        }
    };

    const handleImageClick = (file) => {
        setCurrentFile(file);
        setShowModal(true);
    };

    const handleSaveCroppedImage = async (updatedFile, croppedImageBlob) => {
        if (updatedFile.type === "image") {
            // For images, generate a new cropped preview
            const croppedPreview = await getCroppedImg(
                updatedFile.src,
                updatedFile.cropData.croppedAreaPixels,
                updatedFile.cropData.rotation,
            );

            setFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.id === updatedFile.id
                        ? {
                              ...updatedFile,
                              url: croppedImageBlob,
                              cropData: updatedFile.cropData,
                              preview: croppedPreview,
                          }
                        : file,
                ),
            );
        } else if (updatedFile.type === "video") {
            setFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.id === updatedFile.id
                        ? {
                              ...updatedFile,
                              cropData: updatedFile.cropData,
                          }
                        : file,
                ),
            );
        }
        setShowModal(false);
    };

    const fetchCoordinates = async (placeName) => {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                placeName,
            )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_APIKEY}`,
        );
        const data = await response.json();
        const [lng, lat] = data.features[0]?.center || [null, null];
        return { lat, lng };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Prevent form submission if already uploading
        if (uploading) {
            return;
        }

        if (files.length === 0 || uploading) {
            setError("Please select files.");
            return;
        }

        setUploading(true); // Disable the button by setting uploading to true

        try {
            const { lat, lng } = await fetchCoordinates(location.place_name);
            const token = await auth.currentUser.getIdToken(true);

            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const fileId = uuidv4();
                    const fileRef = storage.ref().child(`uploads/${user.uid}/${fileId}`);

                    // Custom metadata for cropping
                    const customMetadata = {
                        contentType: file.file.type,
                        customMetadata: {
                            cropData: JSON.stringify({
                                crop: file.cropData.crop,
                                zoom: file.cropData.zoom,
                                croppedAreaPixels: file.cropData.croppedAreaPixels,
                                rotation: file.cropData.rotation,
                            }),
                            isVideo: file.type === "video" ? "true" : "false",
                        },
                    };

                    await fileRef.put(file.file, customMetadata);

                    const downloadURL = await fileRef.getDownloadURL();
                    return downloadURL;
                }),
            );

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
                        downloadURLs: uploadedFiles,
                        aspectRatio: aspectRatio,
                        cropData: files.map((file) => ({
                            id: file.id,
                            type: file.type,
                            crop: file.cropData.crop,
                            zoom: file.cropData.zoom,
                            croppedAreaPixels: file.cropData.croppedAreaPixels,
                            rotation: file.cropData.rotation,
                        })),
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

    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        const newFiles = Array.from(files);
        const [moved] = newFiles.splice(source.index, 1);
        newFiles.splice(destination.index, 0, moved);

        setFiles(newFiles);
    };

    return (
        <div className="pl-10">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="py-12">
                        <h2 className="text-2xl font-bold">Create new post</h2>
                        <div className="mt-8 max-w-md">
                            {cropping ? (
                                <div>
                                    <div className="relative w-full h-64 md:h-96">
                                        <Cropper
                                            image={
                                                cropping.type === "image" ? cropping.src : undefined
                                            }
                                            video={
                                                cropping.type === "video" ? cropping.src : undefined
                                            }
                                            crop={crop}
                                            zoom={zoom}
                                            rotation={0}
                                            aspect={aspectRatio}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            // onRotationChange={setRotation}
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
                                            Add Image/Video
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
                                    <div className="relative w-full h-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:border-indigo-500 focus-within:border-indigo-500 transition-colors duration-200 ease-in-out">
                                        <input
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id="file_input"
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                        />
                                        <div className="text-center">
                                            <PhotoIcon className="ml-20 h-10 w-10" />
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                                                Click to upload{" "}
                                                <span className="font-medium">
                                                    images or videos
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Supported formats: JPG, PNG, MP4
                                            </p>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                        id="file_input_help"
                                    >
                                        Upload images or videos one by one.
                                    </p>
                                    <Loader show={uploading} />
                                </div>
                            )}
                            {files.length > 0 && (
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="files" direction="horizontal">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex overflow-x-auto"
                                            >
                                                {files.map((file, index) => (
                                                    <Draggable
                                                        key={file.id}
                                                        draggableId={file.id}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="relative inline-block mx-2"
                                                            >
                                                                <div
                                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-10"
                                                                    onClick={() =>
                                                                        handleDelete(file.id)
                                                                    }
                                                                >
                                                                    X
                                                                </div>
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        handleImageClick(file)
                                                                    }
                                                                >
                                                                    {file.type === "image" ? (
                                                                        <img
                                                                            src={
                                                                                file.preview ||
                                                                                file.url
                                                                            }
                                                                            alt="Preview"
                                                                            draggable={false}
                                                                            className="w-32 h-32 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-32 h-32 overflow-hidden relative">
                                                                            <video
                                                                                src={file.src}
                                                                                className="absolute inset-0 w-full h-full object-cover"
                                                                                controls={false}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
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
                                <AddressAutofill
                                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_APIKEY}
                                >
                                    <input
                                        type="text"
                                        name="location"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        onChange={(e) =>
                                            setLocation({ place_name: e.target.value })
                                        }
                                        required
                                    />
                                </AddressAutofill>
                            </label>
                            <label className="block mt-6">
                                <span className="text-gray-700 text-lg font-medium">Date</span>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="mt-2 block w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 hover:border-indigo-400 transition ease-in-out duration-200"
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                    <div className="absolute left-2 top-3 text-gray-400 pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
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
                                        <label className="flex items-center cursor-pointer mt-4">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    onChange={(e) => setHidden(!e.target.checked)}
                                                />
                                                <div
                                                    className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                                                        hidden ? "bg-red-200" : "bg-green-200"
                                                    }`}
                                                ></div>
                                                <div
                                                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                                                        hidden ? "" : "translate-x-6"
                                                    }`}
                                                ></div>
                                            </div>
                                            <span className="ml-3 text-lg font-medium text-gray-700">
                                                Public
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="block mt-6">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-700 rounded mr-4"
                                    onClick={() => setStep(1)}
                                    disabled={uploading}
                                >
                                    Back
                                </button>
                                <button
                                    className={`bg-blue-500 text-white font-bold py-2 px-4 border border-blue-700 rounded ${
                                        uploading
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:bg-blue-700"
                                    }`}
                                    type="submit"
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {showModal && currentFile && (
                <CropperModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    currentFile={currentFile}
                    aspectRatio={aspectRatio}
                    onSave={handleSaveCroppedImage}
                />
            )}
            <div id="modal"></div>
        </div>
    );
}

export default withAuth(Upload);
