import React from "react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <Link href="/">Go back to the homepage</Link>
    </div>
  );
}

export default NotFoundPage;
