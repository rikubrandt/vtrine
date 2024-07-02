import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Profile from "../components/Profile";
import { getUserWithUsername, postToJSON } from "../lib/firebase";

export async function getServerSideProps({ params }) {
  const { username } = params;

  let user = null;
  let posts = [];
  const userDoc = await getUserWithUsername(username);

  if (userDoc) {
    user = userDoc.data();
    user.uid = userDoc.id;

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
  // Hydration state to manage client-side rendering
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
      <Profile user={user} posts={posts} />
  );
}

export default ProfilePage;
