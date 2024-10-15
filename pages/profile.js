import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { firestore } from "../lib/firebase";
import Layout from "../components/Layout";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";

function Profile() {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const redirectToProfile = async () => {
            if (user) {
                const userDoc = await firestore.collection("users").doc(user.uid).get();
                const userData = userDoc.data();
                if (userData && userData.username) {
                    router.push(`/${userData.username}`);
                } else {
                    console.error("Username not found for the current user.");
                    setLoading(false);
                }
            } else {
                console.error("User not authenticated.");
                router.push("/");
            }
        };

        if (user !== undefined) {
            redirectToProfile();
        }
    }, [user, router]);

    if (loading || user === undefined) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <h1>Profile</h1>
                Welcome
            </div>
        </Layout>
    );
}

export default Profile;
