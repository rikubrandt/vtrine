import React, { useCallback, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../lib/cropImage";

export const CropperModal = ({ showModal, setShowModal, onSave, currentFile, aspectRatio }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        if (currentFile) {
            setImageSrc(currentFile.src);
            if (currentFile.cropData) {
                setCrop(currentFile.cropData.crop);
                setZoom(currentFile.cropData.zoom);
                setCroppedAreaPixels(currentFile.cropData.croppedAreaPixels);
                setRotation(currentFile.cropData.rotation || 0);
            }
        }
    }, [currentFile]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            if (currentFile.type === "image") {
                const croppedImageBlobUrl = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels,
                    rotation,
                );
                onSave(
                    {
                        ...currentFile,
                        cropData: { crop, zoom, croppedAreaPixels, rotation },
                    },
                    croppedImageBlobUrl,
                );
            } else if (currentFile.type === "video") {
                onSave(
                    {
                        ...currentFile,
                        cropData: { crop, zoom, croppedAreaPixels, rotation },
                    },
                    null,
                );
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error cropping media:", error);
        }
    };

    if (!showModal) return null;

    const modalRoot = document.getElementById("modal");

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Crop Your Image</h2>
                    <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => setShowModal(false)}
                    >
                        &#10005;
                    </button>
                </div>
                <div className="relative p-4">
                    <div className="relative w-full h-64 md:h-96">
                        <Cropper
                            image={currentFile.type === "image" ? imageSrc : undefined}
                            video={currentFile.type === "video" ? imageSrc : undefined}
                            crop={crop}
                            zoom={zoom}
                            rotation={0}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            //onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t">
                    <button
                        className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>,
        modalRoot,
    );
};
