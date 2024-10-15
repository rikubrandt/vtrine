import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";

function NotFoundPage() {
    return (
        <div className="flex  justify-center  ">
            <div className="p-12 bg-white rounded shadow-xl w-96 text-center border">
                <h1 className="text-3xl font-bold mb-6">404 - Page Not Found</h1>
                <p className="my-6">The page you're looking for does not exist.</p>
                <Link
                    href="/"
                    className="inline-block py-2 px-4 text-white bg-indigo-500 rounded hover:bg-indigo-600"
                >
                    Go back to the homepage
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
