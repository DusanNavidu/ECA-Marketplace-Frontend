import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function SellerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/seller/dashboard', label: 'My Products', icon: '📦' },
    { path: '/seller/add-product', label: 'Add New Product', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/">
            <div className="shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white font-black text-xl tracking-tighter">ECA</span>
              </div>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-linear-to-r from-gray-800 to-gray-600">
                Seller Hub
              </span>
            </div>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-red-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-blue-50 text-primary shadow-sm border border-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <span className="text-xl">{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <Button variant="outline" className="w-full shadow-sm bg-white" onClick={handleLogout}>Log Out</Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <header className="h-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          <button className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-primary rounded-full flex items-center justify-center text-white font-bold shadow-md">
              S
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto pb-20 md:pb-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}