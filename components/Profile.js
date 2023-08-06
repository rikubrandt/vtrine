import React, { useState } from "react";
import Layout from "./Layout";
import PostsGrid from "./PostsGrid";
import PostsCluster from "./PostsCluster";
import Bio from "./Bio";
import GridSlider from "./GridSlider";

function Profile({ user, posts }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Layout>
      <Bio user={user} posts={posts} />
      <div className="my-7 border rounded-sm">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            role="tablist"
          >
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "profile"
                    ? "border-gray-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "profile"
                    ? "border-gray-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("cluster")}
              >
                Cluster
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "profile"
                    ? "border-gray-300"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("slider")}
              >
                Slider
              </button>
            </li>
            {/* Repeat the li for each tab... */}
          </ul>
        </div>
        <div>
          {activeTab === "profile" && <PostsGrid posts={posts} />}
          {activeTab === "cluster" && <PostsCluster posts={posts} />}
          {activeTab === "slider" && <GridSlider posts={posts} />}

          {/* Conditionally render other components for other tabs... */}
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
