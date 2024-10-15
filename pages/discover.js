import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { firestore } from "../lib/firebase";

async function getAllUsers() {
    const usersRef = firestore.collection("users");
    const usersSnapshot = await usersRef.get();
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return users;
}

export async function getServerSideProps() {
    const users = await getAllUsers();
    return {
        props: { users },
    };
}

function Discover({ users }) {
    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <Link
                            key={user.id}
                            href={`/${user.username}`}
                            className="block p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-white"
                        >
                            <img
                                src={user.image || "/placeholder.jpg"}
                                alt={user.username}
                                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                            />
                            <h3 className="text-xl font-semibold text-center">{user.username}</h3>
                            <p className="text-gray-500 text-center">{user.Name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Discover;
