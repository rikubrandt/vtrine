const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");
const path = require("path");
const fs = require("fs");

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.processMedia = functions
    .runWith({
        memory: "1GB", // Increase memory to 1GB
        timeoutSeconds: 300,
    })
    .storage.object()
    .onFinalize(async (object) => {
        const filePath = object.name;

        // Retrieve file metadata from Storage
        const file = bucket.file(filePath);
        const [metadata] = await file.getMetadata();

        // If the file has already been processed, skip it
        if (metadata.metadata && metadata.metadata.processed === "true") {
            console.log(`File already processed: ${filePath}`);
            return null;
        }

        const fileBucket = object.bucket;
        const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

        // Parse crop data from custom metadata
        const customMetadata = metadata.metadata;
        if (!customMetadata || !customMetadata.cropData) {
            console.error(`No crop data found for file: ${filePath}`);
            return null;
        }

        const cropData = JSON.parse(customMetadata.cropData);
        const isVideo = customMetadata.isVideo === "true";

        // Download the file locally
        await file.download({ destination: tempFilePath });

        const outputExtension = isVideo ? ".mp4" : ".jpg";
        const outputFilePath = path.join(
            os.tmpdir(),
            `cropped-${path.basename(filePath, path.extname(filePath))}${outputExtension}`,
        );
        console.log("Crop data received:", cropData);

        try {
            if (isVideo) {
                // Get the video duration
                const videoInfo = await getVideoInfo(tempFilePath);
                const videoDurationSeconds = videoInfo.duration;

                // Skip processing videos longer than 30 seconds
                if (videoDurationSeconds > 30) {
                    console.log(
                        `Skipping video as it exceeds 30 seconds: ${videoDurationSeconds} seconds`,
                    );
                    return null;
                }

                await cropVideo(tempFilePath, cropData, outputFilePath);
            } else {
                await cropImage(tempFilePath, cropData, outputFilePath);
            }

            // Overwrite the original file
            await bucket.upload(outputFilePath, {
                destination: filePath, // Overwrite the original file path
                metadata: {
                    contentType: object.contentType,
                    metadata: {
                        processed: "true", // Add custom metadata to indicate file has been processed
                    },
                },
            });

            // Clean up temporary files
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(outputFilePath);

            console.log(`Successfully processed and overwritten original file: ${filePath}`);
        } catch (error) {
            console.error("Error processing file:", error);
            return null;
        }
    });

async function cropImage(filePath, cropData, outputFilePath) {
    console.log("Original Crop Data:", cropData);

    const { x, y, width, height } = cropData.croppedAreaPixels;

    const left = Math.round(x);
    const top = Math.round(y);
    const cropWidth = Math.round(width);
    const cropHeight = Math.round(height);

    const metadata = await sharp(filePath).metadata();
    let { width: imageWidth, height: imageHeight, orientation } = metadata;

    if (orientation >= 5 && orientation <= 8) {
        [imageWidth, imageHeight] = [imageHeight, imageWidth];
    }

    console.log(
        `Image dimensions after orientation adjustment: width=${imageWidth}, height=${imageHeight}`,
    );
    console.log(
        `Rounded Crop Data: left=${left}, top=${top}, width=${cropWidth}, height=${cropHeight}`,
    );

    if (
        left < 0 ||
        top < 0 ||
        cropWidth <= 0 ||
        cropHeight <= 0 ||
        left + cropWidth > imageWidth ||
        top + cropHeight > imageHeight
    ) {
        console.error(
            `Invalid crop dimensions: left=${left}, top=${top}, width=${cropWidth}, height=${cropHeight}`,
        );
        throw new Error("Invalid crop dimensions. Crop region exceeds image boundaries.");
    }

    return sharp(filePath)
        .rotate()
        .extract({ left: left, top: top, width: cropWidth, height: cropHeight })
        .rotate(cropData.rotation)
        .toFile(outputFilePath);
}

async function cropVideo(filePath, cropData, outputFilePath) {
    const { croppedAreaPixels } = cropData;
    const { x, y, width, height } = croppedAreaPixels;

    let videoInfo = await getVideoInfo(filePath);
    if (x + width > videoInfo.width || y + height > videoInfo.height) {
        throw new Error("Crop dimensions exceed video boundaries.");
    }

    console.log(`Cropping video with width: ${width}, height: ${height}, x: ${x}, y: ${y}`);

    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .videoFilters([
                {
                    filter: "crop",
                    options: `${width}:${height}:${x}:${y}`,
                },
            ])
            .on("end", () => resolve(outputFilePath))
            .on("error", (error) => {
                console.error("Error during video processing with ffmpeg:", error);
                reject(error);
            })
            .save(outputFilePath);
    });
}

function getVideoInfo(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            resolve({
                width: metadata.streams[0].width,
                height: metadata.streams[0].height,
                duration: metadata.format.duration, // Extract video duration in seconds
            });
        });
    });
}
