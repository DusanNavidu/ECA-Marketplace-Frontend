import React from 'react';
import Button from '../ui/Button';

export default function ItemCard({ item, onOrder }) {
  // පින්තූරයක් නැත්නම් පෙන්නන්න Default Image එකක්
  const defaultImage = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image";
  
  // Backend එකෙන් පින්තූර එනවා නම් පළවෙනි එක ගන්නවා
  const imageUrl = item.imageUrls && item.imageUrls.length > 0 
    ? `http://localhost:8080/uploads/catalog-images/${item.imageUrls[0]}` 
    : defaultImage;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group flex flex-col">
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="font-bold text-gray-800">${item.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={item.title}>
          {item.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow" title={item.description}>
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-gray-400">
            Sold by: <span className="font-medium text-gray-600 truncate max-w-25 inline-block align-bottom">{item.sellerEmail}</span>
          </div>
          
          <Button 
            onClick={() => onOrder(item.id)} 
            className="px-4 py-2 text-sm shadow-sm hover:shadow-md"
          >
            Order Now
          </Button>
        </div>
      </div>
      
    </div>
  );
}