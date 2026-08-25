import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Error404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

      <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-white relative z-10 text-center">
        {/* Search/Ghost Icon */}
        <div className="mx-auto w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-purple-100">
          <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you've wandered off the map. The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="inline-block">
          <Button className="px-8 py-3 text-lg shadow-md shadow-purple-200 bg-purple-500 hover:bg-purple-600 border-none">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}