import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Error500() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-[20%] w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      
      <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-white relative z-10 text-center">
        {/* Server Alert Icon */}
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-200">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-2">500</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Internal Server Error
        </h2>
        <p className="text-gray-500 mb-8">
          Something went terribly wrong on our end. Our engineers have been notified and are working on it.
        </p>
        
        <Link to="/" className="inline-block">
          <Button variant="outline" className="px-8 py-3 text-lg border-gray-400 text-gray-600 hover:bg-gray-100">
            Try Again Later
          </Button>
        </Link>
      </div>
    </div>
  );
}