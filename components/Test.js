import { firebase } from "../firebase";
import React, { useEffect } from "react";

function AuthCheck() {
  useEffect(() => {
    // Check if a user is currently authenticated
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is authenticated:", user);
      } else {
        console.log("No user is authenticated.");
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  return <div>Check the console for authentication status.</div>;
}

function Test() {
  return (
    <div>
      <h1>My Page</h1>
      <AuthCheck />
    </div>
  );
}

export default Test;
