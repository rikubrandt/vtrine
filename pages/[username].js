import React, { useEffect, useState } from "react";
import Image from "next/image";
import Posts from "../components/Posts";
import {
  firebase,
  firestore,
  getUserWithUsername,
  postToJSON,
} from "../lib/firebase";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Profile from "../components/Profile";

export async function getServerSideProps({ params }) {
  const { username } = params;

  let user;
  let posts;
  const userDoc = await getUserWithUsername(username);

  if (userDoc) {
    user = userDoc.data();
    user.uid = userDoc.id; // Here you are adding the UID to the user object

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

function ProfilePage({ user, posts }) {
  return <Profile user={user} posts={posts} />;
}

export default ProfilePage;
