// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const firestore = firebase.firestore();
const auth = firebase.auth();
const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

async function getUserByUID(uid) {
  try {
    const userDoc = await firestore.collection("users").doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
}

async function getUserAndPostsByUID() {
  try {
    const user = await getCurrentUser();
    const userDoc = await firestore.collection("users").doc(user.uid).get();
    const postsCollection = await firestore
      .collection("users")
      .doc(user.uid)
      .collection("posts")
      .get();

    if (userDoc.exists) {
      let userData = userDoc.data();
      let postsData = [];
      postsCollection.docs.forEach((postDoc) => {
        postsData.push(postDoc.data());
      });

      return { user: userData, posts: postsData };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error retrieving user and posts:", error);
    throw error;
  }
}

function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
  };
}

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

const signOutUser = () => {
  auth.signOut().then(() => {
    window.location.reload();
  });
};

export {
  firebase,
  firestore,
  auth,
  storage,
  getUserWithUsername,
  postToJSON,
  getUserByUID,
  getUserAndPostsByUID,
  getCurrentUser,
  signOutUser,
  STATE_CHANGED,
};
