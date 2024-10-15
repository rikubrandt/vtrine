import React from "react";
import Layout from "./Layout";
import Bio from "./Bio";
import ProfileTab from "./ProfileTab";

function Profile({ user, posts }) {
    return (
        <Layout>
            <Bio user={user} />
            <div className="my-7 border rounded-sm">
                <ProfileTab userId={user.uid} posts={posts} />
            </div>
        </Layout>
    );
}

export default Profile;
