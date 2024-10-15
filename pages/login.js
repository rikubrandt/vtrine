import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { firebase } from "../lib/firebase";
import { useRouter } from "next/router";

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [loginError, setLoginError] = useState("");

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

    const onSubmit = async ({ email, password }) => {
        setLoginError(""); // Reset error state
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            router.push("/profile");
        } catch (error) {
            console.error("Login error", error);
            setLoginError("Failed to login. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="p-12 bg-white rounded shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6">Login Page</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <button
                        className="w-full py-2 px-3 text-white bg-indigo-500 rounded mt-4 hover:bg-indigo-600"
                        type="submit"
                    >
                        Login
                    </button>
                    {loginError && <p className="text-red-600 text-xs pt-2">{loginError}</p>}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
