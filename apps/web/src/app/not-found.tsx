import React from 'react';
import Link  from 'next/link';
import BentoCard from '../components/ui/BentoCard';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nest-bg p-4">
      <BentoCard className="text-center p-12 bg-white max-w-lg">
        <h1 className="text-9xl font-bold text-gray-100 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for has been moved or deleted.</p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </BentoCard>
    </div>
  );
};

export default NotFound;