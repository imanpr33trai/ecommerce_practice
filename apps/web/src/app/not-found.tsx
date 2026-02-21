import Link from "next/link";
import type React from "react";

import BentoCard from "../components/BentoCard";
import Button from "../components/Button";

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nest-bg p-4">
      <BentoCard className="max-w-lg bg-white p-12 text-center">
        <h1 className="mb-4 font-bold text-9xl text-gray-100">404</h1>
        <h2 className="mb-2 font-bold text-2xl">Page Not Found</h2>
        <p className="mb-8 text-gray-500">
          The page you are looking for has been moved or deleted.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </BentoCard>
    </div>
  );
};

export default NotFound;
