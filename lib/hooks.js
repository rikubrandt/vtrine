import { auth, firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useUserData() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            setUserLoading(true);

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
                setUserLoading(false);
            });
        } else {
            setUsername(null);
            setImage(null);
            setName(null);
            setUserLoading(false);
        }

        return () => unsubscribe && unsubscribe();
    }, [user]);

    return { user, username, image, name, loading: loading || userLoading };
}
