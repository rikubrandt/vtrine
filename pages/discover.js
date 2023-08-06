import React from "react";
import AuthCheck from "../components/AuthCheck";
import { UserContext } from "../lib/context";
import { useContext } from "react";

function Discover() {
  const { username } = useContext(UserContext);

  return (
    <main>
      <AuthCheck>
        <h1>Is authenticated! {username}</h1>
      </AuthCheck>
    </main>
  );
}

export default Discover;
