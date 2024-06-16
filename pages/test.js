import React, { useState, useEffect } from "react";
import { firebase, getUserWithUsername, postToJSON } from "../lib/firebase";
import GridSlider from "../components/GridSlider";
import AuthCheck from "../components/AuthCheck";
import Test from "../components/Test";
import Layout from "../components/Layout";
import GalleryDesign from "../components/Gallery/GalleryDesign";
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

function Tester({ user, posts }) {
  console.log(posts);
  return <Test images={posts} />;
}

export default Tester;
