import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { getUserFromToken } from '../../utils/auth';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUserFromToken();

  useEffect(() => {
    if (!user || user.role !== 'BUYER') {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const response = await api.get(`/delivery/my-orders/${user.email}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch my orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Header */}
      <header className="h-20 bg-white/90 backdrop-blur-md shadow-xs border-b border-gray-100 flex items-center justify-between px-6 sm:px-12 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl tracking-tighter">ECA</span>
          </div>
          <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-700">
            Marketplace
          </span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">My Orders & Tracking 📦</h1>

        {loading ? (
          <div className="py-24 text-center text-gray-400 font-medium">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-5xl mb-3 block">📦</span>
            <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
            <p className="text-gray-400 text-sm mt-1">You haven't placed any orders yet.</p>
            <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md">
              Start Shopping 🚀
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col gap-4">
                
                {/* Order Header (Tracking & Status) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tracking Number</span>
                    <div className="text-lg font-black text-primary">{order.trackingNumber}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border border-green-200' :
                      'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Delivery & Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="text-gray-400 block text-xs">Delivery Address:</span>
                    <span className="font-medium text-gray-800">{order.address}, {order.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Phone Number:</span>
                    <span className="font-medium text-gray-800">{order.phone}</span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-white border border-gray-100 p-3 rounded-lg">
                        <div>
                          <span className="font-semibold text-gray-800">{item.title}</span>
                          <span className="text-xs text-gray-400 block">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-black text-red-600">$ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-gray-700 text-sm">Total Amount Paid:</span>
                  <span className="text-xl font-black text-red-600">$ {order.totalAmount.toLocaleString()}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>&copy; 2026 ECA Marketplace. Built with Spring Boot Microservices & React.</p>
      </footer>
      
    </div>
  );
}