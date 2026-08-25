import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { getUserFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';

export default function CartDrawer({ isOpen, onClose, onProceedToCheckout }) {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  if (!isOpen) return null;

  const handleProceedClick = () => {
    const user = getUserFromToken();

    if (!user) {
      showAlert('Login Required 🛑', 'Please log in to proceed to checkout.');
      onClose();
      navigate('/login');
      return;
    }

    if (user.role !== 'BUYER') {
      showAlert('Access Denied 🛑', 'Only buyers can place orders.');
      return;
    }

    onClose();
    if (onProceedToCheckout) onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-200 overflow-hidden animate-in fade-in duration-200">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems} items
              </span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center shadow-xs transition-colors font-bold"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <span className="text-6xl mb-3">🛍️</span>
                <p className="text-gray-500 font-medium">Your cart is empty!</p>
                <p className="text-gray-400 text-sm mt-1">Add some amazing deals to get started.</p>
              </div>
            ) : (
              cart.map(item => {
                

                const images = item.imageUrls && item.imageUrls.length > 0
                  ? item.imageUrls 
                  : ['https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'];

                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-xs items-center">
                    <img 
                      src={images[0]} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-red-600 font-black text-sm mt-1">
                        $ {item.price ? item.price.toLocaleString() : '0.00'}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        Quantity: <span className="font-bold text-gray-700">{item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer (Total & Checkout) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="text-2xl font-black text-gray-900">
                  $ {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                Shipping and taxes calculated at checkout.
              </p>
              <Button 
                onClick={handleProceedClick}
                className="w-full py-4 text-lg font-bold shadow-lg"
              >
                Proceed to Checkout 💳
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}