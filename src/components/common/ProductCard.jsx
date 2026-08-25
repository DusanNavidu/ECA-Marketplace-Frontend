import React, { useState } from 'react';
import Badge from './Badge';
import Button from '../ui/Button';
import { getUserFromToken } from '../../utils/auth';
import { useCart } from '../../context/CartContext';
import { useAlert } from '../../context/AlertContext';

export default function ProductCard({ product, onOrder }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const user = getUserFromToken();
    const isSeller = user?.role === 'SELLER';

    const { addToCart } = useCart();
    const { showAlert } = useAlert();

const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls 
    : ['https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'];

    const mainImage = images[currentImgIndex];

    const closeModal = (e) => {
        e.stopPropagation();
        setIsModalOpen(false);
        setCurrentImgIndex(0);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        showAlert('Success!', 'Product added to your cart! 🛒');
        closeModal(e);
    };

    return (
        <>
            {/* ===================== PRODUCT CARD (Temu / AliExpress Style) ===================== */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-white rounded-xl overflow-hidden hover:shadow-2xl border border-gray-100 hover:border-primary/50 transition-all duration-300 cursor-pointer group flex flex-col relative"
            >
                {/* Image Container - Aspect Square for E-commerce Look */}
                <div className="relative w-full pt-[100%] bg-gray-50 overflow-hidden">
                    <img
                        src={images[0]}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=Image+Error'; }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                        {product.status === 'AVAILABLE'
                            ? <span className="bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">In Stock</span>
                            : <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">Sold Out</span>}
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-4 flex flex-col grow">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors" title={product.title}>
                        {product.title}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs sm:text-sm font-bold text-red-600">$</span>
                            <span className="text-lg sm:text-xl font-black text-red-600 tracking-tight">
                                {product.price ? product.price.toLocaleString() : '0.00'}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {product.sellerEmail ? product.sellerEmail.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <span className="text-xs text-gray-500 truncate max-w-20" title={product.sellerEmail}>
                                    {product.sellerEmail ? product.sellerEmail.split('@')[0] : 'Store'}
                                </span>
                            </div>
                            <span className="text-[10px] font-semibold text-primary bg-blue-50 px-1.5 py-0.5 rounded">Top Rated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== PRODUCT DETAILS MODAL ===================== */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-gray-900/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-md text-gray-800 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                        >
                            ✕
                        </button>

                        {/* Left Side: Images Gallery */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-4 sm:p-6 border-r border-gray-100">
                            <div className="relative w-full pt-[100%] rounded-xl overflow-hidden shadow-inner bg-white mb-4">
                                <img
                                    src={mainImage}
                                    alt="Product Main"
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                            </div>

                            {/* Image Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentImgIndex(idx)}
                                            className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentImgIndex === idx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Product Details */}
                        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
                            <div className="mb-2">
                                {product.status === 'AVAILABLE' ? <Badge type="success">In Stock</Badge> : <Badge type="danger">Out of Stock</Badge>}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                                {product.title}
                            </h2>

                            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-3xl sm:text-4xl font-black text-red-600">
                                    $ {product.price ? product.price.toLocaleString() : '0.00'}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    $ {product.price ? (product.price * 1.2).toLocaleString() : '0.00'}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-2">Item Description</h4>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Seller Information</h4>
                                <div className="font-medium text-gray-800">{product.sellerEmail}</div>
                                <div className="text-xs text-gray-500 mt-1">ECA Verified Store ✓</div>
                            </div>

                            {/* Action Buttons */}
                            {!isSeller && (
                                <div className="mt-auto pt-4 flex gap-3">
                                    <Button
                                        onClick={handleAddToCart} // 👈 මෙතැනට අලුත් Function එක දෙනවා
                                        className="flex-1 py-4 text-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all"
                                        disabled={product.status !== 'AVAILABLE'}
                                    >
                                        {product.status === 'AVAILABLE' ? 'Add to Cart 🛒' : 'Out of Stock'}
                                    </Button>

                                    <Button variant="outline" className="px-4 border-gray-300 hover:bg-gray-50">
                                        ❤️
                                    </Button>
                                </div>
                            )}

                            {isSeller && (
                                <div className="mt-auto pt-4 text-center text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    ℹ️ You are viewing this product in store manager mode.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}