
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

interface WishlistPageProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, onToggleWishlist }) => {
  const { products } = useProducts();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <header className="mb-8 mt-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">My Wishlist</h1>
          <p className="text-gray-500 mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
        <Link to="/" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
          <i className="fas fa-plus"></i>
        </Link>
      </header>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-pink-200">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-300">
            <i className="far fa-heart text-4xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-serif">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't saved any treats yet. Start exploring our delicious cakes!</p>
          <Link to="/" className="cake-pink text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-100 active:scale-95 transition-all">
            Browse Cakes
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
