import React from "react";
import Layout from "./Layout";
import Bio from "./Bio";
import ProfileComponentBuilder from "./ProfileComponentBuilder";

function Profile({ user, posts }) {
  return (
    <Layout>
      <Bio user={user} posts={posts} />
      <div className="my-7 border rounded-sm">
        <ProfileComponentBuilder userId={user.uid} />
      </div>
    </Layout>
  );
}

export default Profile;
