import React, { useState, useEffect } from "react";
import { firebase } from "../lib/firebase";
import Upload from "../components/Upload";
import Layout from "../components/Layout";
import AuthCheck from "../components/AuthCheck";

function Add() {
    return (
        <AuthCheck>
            <Layout>
                <div className="bg-white my-7 border rounded-sm">
                    <Upload />
                </div>
            </Layout>
        </AuthCheck>
    );
}

export default Add;
