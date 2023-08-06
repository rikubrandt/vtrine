import { auth, firestore } from "../lib/firebase";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        if (doc.exists) {
          setUsername(doc.data()?.username);
          setImage(doc.data()?.image);
          setName(doc.data()?.name);
        } else {
          setUsername(null);
          setImage(null);
          setName(null);
        }
      });
    } else {
      setUsername(null);
      setImage(null);
      setName(null);
    }
    return unsubscribe;
  }, [user]);

  return { user, username, image, name };
}
