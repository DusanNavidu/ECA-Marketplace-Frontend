import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1.5 text-sm sm:text-base">Welcome back, Admin! Here is what's happening today.</p>
      </div>

      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm sm:text-base">Pending Sellers</h3>
            <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xl">⏳</span>
          </div>
          <p className="text-4xl sm:text-5xl font-black text-gray-800">
            5
            <span className="text-sm font-normal text-gray-400 ml-2">waiting</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm sm:text-base">Total Active Buyers</h3>
            <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary text-xl">🛒</span>
          </div>
          <p className="text-4xl sm:text-5xl font-black text-gray-800">
            124
            <span className="text-sm font-normal text-green-500 ml-2">↑ 12%</span>
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm sm:text-base">Catalog Items</h3>
            <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl">📦</span>
          </div>
          <p className="text-4xl sm:text-5xl font-black text-gray-800">
            89
            <span className="text-sm font-normal text-gray-400 ml-2">live</span>
          </p>
        </div>
        
      </div>
    </AdminLayout>
  );
}