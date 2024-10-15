import { firestore } from "../lib/firebase"; // adjust path accordingly
import { collection, getDocs } from "firebase/firestore";

const fetchDisplays = async (userId) => {
    const querySnapshot = await getDocs(collection(firestore, `users/${userId}/posts`));
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
};

export default fetchDisplays;
