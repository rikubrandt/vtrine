import React, { useState, useEffect } from "react";
import { firebase, getUserWithUsername, postToJSON } from "../lib/firebase";
import GridSlider from "../components/GridSlider";
import Layout from "../components/Layout";
import AuthCheck from "../components/AuthCheck";

export async function getServerSideProps() {
  const username = "riku";

  let user;
  let posts;
  const userDoc = await getUserWithUsername(username);

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .orderBy("createdAt", "desc");
    posts = (await postsQuery.get()).docs.map(postToJSON);
  } else {
    return {
      notFound: true,
    };
  }
  return {
    props: { user, posts },
  };
}

function Test({ user, posts }) {
  return <GridSlider user={user} posts={posts} />;
}

export default Test;
