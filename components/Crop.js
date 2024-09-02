import React from "react";
import Cropper from "react-easy-crop";
import { useGlobalContext } from "../lib/globalContext";

export default function Crop() {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    croppedAreaPixels,
    setCroppedAreaPixels,
    imageSrc,
  } = useGlobalContext();

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Cropper
      image={imageSrc}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      aspect={4 / 5} 
      onCropChange={setCrop}
      onRotationChange={setRotation}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    />
  );
}
