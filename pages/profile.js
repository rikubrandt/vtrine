import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase, getCurrentUser } from "../lib/firebase";
import Layout from "../components/Layout";
function Profile() {
  return (
    <Layout>
      <div>
        <h1>Profile</h1>
        welcome
      </div>
    </Layout>
  );
}

export default Profile;
