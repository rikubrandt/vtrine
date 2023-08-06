import React, { useEffect } from "react";
import { firebase, firestore } from "../lib/firebase";
import Router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";

function RegisterPage() {
  const { register, handleSubmit, watch, errors } = useForm();
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, redirect to the dashboard page
        router.push("/profile");
      }
    });
  }, []);

  const handleRegister = async (data) => {
    const { email, username, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
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

        console.log(user.uid);
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
        console.error(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register for an account
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleRegister)}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                {...register("username", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                {...register("password", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                {...register("confirmPassword", { required: true })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
