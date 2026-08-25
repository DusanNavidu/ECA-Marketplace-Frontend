import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAlert } from '../../context/AlertContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
import api from '../../api/axios';
import { getUserFromToken } from '../../utils/auth';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, totalPrice, clearCart } = useCart();
  const { showAlert } = useAlert();
  const user = getUserFromToken();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    phone: '',
    city: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        customerEmail: user?.email,
        customerName: shippingDetails.fullName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        phone: shippingDetails.phone,
        totalAmount: totalPrice,
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        orderDate: new Date().toISOString()
      };
      const response = await api.post('/delivery/place', orderPayload)

      showAlert('Order Placed! 🎉', 'Your order has been successfully placed and sent for delivery.');
      clearCart();
      onClose();
    } catch (error) {
      console.error("Checkout failed", error);
      showAlert('Error 🛑', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">Checkout & Delivery 🚚</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-red-500 flex items-center justify-center shadow-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              type="text" 
              placeholder="Dusan Navidu" 
              required
              value={shippingDetails.fullName}
              onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="address">Delivery Address</Label>
            <Input 
              id="address" 
              type="text" 
              placeholder="No. 123, Main Street, Matara" 
              required
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                type="text" 
                placeholder="Matara" 
                required
                value={shippingDetails.city}
                onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+94 71 234 5678" 
                required
                value={shippingDetails.phone}
                onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Total Amount to Pay:</span>
            <span className="text-xl font-black text-red-600">$ {totalPrice.toLocaleString()}</span>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-4 text-lg font-bold shadow-lg"
              disabled={loading}
            >
              {loading ? 'Processing Order...' : 'Confirm & Place Order 🚀'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}