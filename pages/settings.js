import React, { useState } from "react";
import { firebase, firestore, storage, getUserByUID } from "../lib/firebase";
import Settings from "../components/Settings";
import Layout from "../components/Layout";

function SettingsPage() {
  return (
    <Layout>
      <div className="bg-white my-7 border rounded-sm">
        <Settings />
      </div>
    </Layout>
  );
}

export default SettingsPage;
