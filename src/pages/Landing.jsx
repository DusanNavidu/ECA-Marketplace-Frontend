import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/common/CartDrawer';
import CheckoutModal from '../components/common/CheckoutModal';
import { getUserFromToken } from '../utils/auth';

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const user = getUserFromToken();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await api.get('/catalog/all');
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch public catalog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* ================= HEADER ================= */}
      <header className="h-20 bg-white/90 backdrop-blur-md shadow-xs border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 md:px-12 sticky top-0 z-50">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-lg sm:text-xl tracking-tighter">ECA</span>
          </div>
          <span className="font-extrabold text-xl sm:text-2xl bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-700 hidden sm:block">
            Marketplace
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
          <input 
            type="text" 
            placeholder="Search for anything (e.g. Laptops, Gadgets)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-2.5 bg-gray-100 rounded-full border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
          />
        </div>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 text-gray-600 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 rounded-full"
            title="Shopping Cart"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Controls (Logged In vs Guest) */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              
              {user.role === 'BUYER' && (
                <Link to="/my-orders" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                  📦 My Orders
                </Link>
              )}

              {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                <Link 
                  to="/dashboard" 
                  className="hidden sm:block bg-blue-50 text-primary px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                  Dashboard ⚙️
                </Link>
              )}

              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs shadow-inner" title={user.sub}>
                  {user.sub ? user.sub.charAt(0).toUpperCase() : 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Guest View
            <div className="flex items-center gap-2 sm:gap-4 ml-2">
              <Link to="/login" className="font-bold text-gray-600 hover:text-primary transition-colors px-2 py-1.5 text-xs sm:text-sm">Log In</Link>
              <Link to="/register" className="bg-primary hover:bg-blue-600 text-white font-bold py-1.5 px-4 sm:py-2 sm:px-5 rounded-full shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm whitespace-nowrap">Sign Up</Link>
            </div>
          )}
        </div>
      </header>
      {/* ================= END HEADER ================= */}

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Mobile Search Bar */}
        <div className="md:hidden p-4 bg-white border-b border-gray-100 sticky top-20 z-40">
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none text-sm"
          />
        </div>

        {/* Hero Banner */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 sm:py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Super Deals & Local Treasures 🔥
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg">
              Explore thousands of products directly from verified local sellers at unbeatable prices.
            </p>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Trending Products ⚡
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
              {filteredProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center text-gray-400 font-medium">Loading amazing products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-5xl mb-3 block">🔍</span>
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-gray-400 text-sm mt-1">Try searching with a different keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      /> 

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs sm:text-sm text-gray-400">
        <p>&copy; 2026 ECA Marketplace. Built with Spring Boot Microservices & React.</p>
      </footer>
      
    </div>
  );
}