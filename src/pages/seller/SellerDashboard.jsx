import React, { useState, useEffect } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import ProductCard from '../../components/common/ProductCard';
import api from '../../api/axios';
import { jwtDecode } from 'jwt-decode'; // 👈 මේක අනිවාර්යයි

export default function SellerDashboard() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token); // Token එකෙන් Email එක ගන්නවා
          
          console.log("Logged in user email from token:", decoded.sub);

          const response = await api.get(`/catalog/seller/${decoded.sub}`, {
             headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Fetched products for seller:", response.data);
          
          setMyProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to load your products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  return (
    <SellerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store and listed products.</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Listed Products ({myProducts.length})</h2>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">Loading your products...</div>
      ) : myProducts.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100">
           <span className="text-5xl mb-4">🛍️</span>
           <h3 className="text-lg font-bold text-gray-700">No products yet!</h3>
           <p className="text-gray-500 mb-4">Start selling by adding your first product to the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </SellerLayout>
  );
}