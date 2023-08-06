import React, { useState } from "react";
import {
  firebase,
  firestore,
  storage,
  getUserByUID,
  getCurrentUser,
} from "../lib/firebase";
import Design from "../components/Design";
import Layout from "../components/Layout";
import DnDLayout from "../components/BoardSectionList";

function DesignPage() {
  return (
    <Layout>
      <div className="bg-white my-7 border rounded-sm">
        <Design />
      </div>
    </Layout>
  );
}

export default DesignPage;
