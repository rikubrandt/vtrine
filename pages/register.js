import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { firebase, firestore } from "../lib/firebase";
import { useRouter } from "next/router";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is authenticated, redirect to the dashboard page
                router.push("/profile");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    const handleRegister = async (data) => {
        const { email, username, password, confirmPassword } = data;

        if (username.includes(" ")) {
            setError("username", {
                type: "manual",
                message: "Username cannot contain spaces",
            });
            return;
        }
        if (password !== confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                // Handle successful registration
                const user = userCredential.user;
                console.log("User registered:", user.uid);

                const userDoc = firestore.doc(`users/${user.uid}`);
                const usernameDoc = firestore.doc(`usernames/${username}`);
                const batch = firestore.batch();

                batch.set(usernameDoc, { uid: user.uid });
                batch.set(userDoc, {
                    email: email,
                    username: username,
                    name: username,
                    bio: "",
                    image: null,
                });

                await batch.commit();

                await firebase.auth().signInWithEmailAndPassword(email, password);

                router.push("/profile");
            })
            .catch((error) => {
                // Handle registration error
                if (error.code === "auth/email-already-in-use") {
                    setError("email", {
                        type: "manual",
                        message: "Email is already in use",
                    });
                } else if (error.code === "auth/weak-password") {
                    setError("password", {
                        type: "manual",
                        message: "Password should be at least 6 characters",
                    });
                } else if (error.code === "auth/invalid-email") {
                    setError("email", {
                        type: "manual",
                        message: "The email address is badly formatted",
                    });
                } else {
                    console.error(error.message);
                }
            });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="p-12 bg-white rounded shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6">Register for an account</h1>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="mb-5">
                        <label className="block text-xs mb-2">Email</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-xs pt-2">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs mb-2">Username</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="text"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && (
                            <p className="text-red-600 text-xs pt-2">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs mb-2">Password</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-xs pt-2">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs mb-2">Confirm Password</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-600 text-xs pt-2">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <button
                        className="w-full py-2 px-3 text-white bg-indigo-500 rounded mt-4 hover:bg-indigo-600"
                        type="submit"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
