import Link from "next/link";
import { useState, useEffect } from "react";
import { firebase } from "../lib/firebase";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Feed from "../components/Feed";
export default function Home() {
  return (
    <Layout>
      <Feed />
    </Layout>
  );
}
