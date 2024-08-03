import { admin, firestore } from "../../lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { file, metadata } = req.body;

  if (!file || !metadata) {
    return res.status(400).json({ error: "File and metadata are required" });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const buffer = Buffer.from(file, "base64");
    const fileName = `${uid}/${metadata.fileName}`;
    const bucket = admin.storage().bucket();
    const fileRef = bucket.file(`uploads/${fileName}`);

    await fileRef.save(buffer, {
      metadata: { contentType: metadata.contentType },
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const postRef = firestore.collection(`users/${uid}/posts`).doc();
    await postRef.set({
      id: postRef.id,
      title: metadata.title,
      caption: metadata.caption,
      location: metadata.location,
      heartCount: metadata.heartCount || 0,
      downloadURL,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, downloadURL });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
}
