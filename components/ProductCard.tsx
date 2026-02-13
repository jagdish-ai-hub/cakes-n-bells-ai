
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted, onToggleWishlist }) => {
  // Get the base price (usually 0.5kg or piece)
  const basePrice = product.prices['0.5kg'] || product.prices['piece'] || 0;
  const unit = product.prices['piece'] ? '/ piece' : '/ 0.5kg';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-pink-50">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to a clean placeholder instead of broken image
              e.currentTarget.src = 'https://placehold.co/600x600/fce7f3/db2777?text=No+Image';
            }}
          />
        </Link>
        <button 
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-gray-400 active:scale-90 transition-all"
        >
          <i className={`${isWishlisted ? 'fas fa-heart text-pink-500' : 'far fa-heart'} text-lg`}></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-xs text-pink-500 font-semibold mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1 font-serif text-lg">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="text-pink-600 font-bold">₹{basePrice}<span className="text-xs text-gray-400 font-normal ml-1">{unit}</span></span>
          <Link 
            to={`/product/${product.id}`}
            className="w-8 h-8 rounded-full cake-pink text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
          >
            <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
