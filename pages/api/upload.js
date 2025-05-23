import { admin, firestore } from "../../lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { metadata } = req.body;

    if (!metadata) {
        return res.status(400).json({ error: "Metadata is required" });
    }

    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const postRef = firestore.collection(`users/${uid}/posts`).doc();
        await postRef.set({
            id: postRef.id,
            title: metadata.title,
            caption: metadata.caption,
            location: {
                place_name: metadata.location.place_name,
                lng: metadata.location.lng,
                lat: metadata.location.lat,
            },
            date: metadata.date,
            hidden: metadata.hidden,
            heartCount: metadata.heartCount || 0,
            files: metadata.downloadURLs,
            cropData: metadata.cropData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            aspectRatio: metadata.aspectRatio,
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Error creating post" });
    }
}
