import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAlert } from '../../context/AlertContext';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchAllOrders = async () => {
    try {
      const response = await api.get('/delivery/all');
      const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Failed to fetch all orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (trackingNumber, newStatus) => {
    try {
      await api.put(`/delivery/update/${trackingNumber}?status=${newStatus}`);
      showAlert('Status Updated! ✅', `Order ${trackingNumber} is now ${newStatus}.`);
      fetchAllOrders();
    } catch (error) {
      console.error("Failed to update status", error);
      showAlert('Error 🛑', 'Failed to update order status.');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Orders...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-800">Manage Customer Orders 📦</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Tracking No</th>
              <th className="p-4 font-bold">Customer Info</th>
              <th className="p-4 font-bold">Amount</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">No orders placed yet.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="p-4 font-bold text-primary">{order.trackingNumber}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.address}, {order.city}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="p-4 font-black text-red-600">$ {order.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-primary focus:border-primary block w-full p-2 font-bold cursor-pointer shadow-xs"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.trackingNumber, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED 🚚</option>
                      <option value="DELIVERED">DELIVERED ✅</option>
                      <option value="CANCELED">CANCELED ❌</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}