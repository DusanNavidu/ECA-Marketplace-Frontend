import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Error403() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

      <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-white relative z-10 text-center">
        {/* Lock Icon */}
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-100">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-2">403</h1>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-500 to-orange-500 mb-4">
          Access Denied!
        </h2>
        <p className="text-gray-500 mb-8">
          Oops! You don't have permission to access this page. It seems like you've stumbled into a restricted area.
        </p>
        
        <Link to="/dashboard" className="inline-block">
          <Button className="px-8 py-3 text-lg shadow-md shadow-red-200 bg-red-500 hover:bg-red-600">
            Go Back to Safety
          </Button>
        </Link>
      </div>
    </div>
  );
}