
import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  wishlistCount: number;
  canInstall: boolean;
  onInstall: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wishlistCount, canInstall, onInstall }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 cake-pink rounded-full flex items-center justify-center text-white text-xl">
            <i className="fas fa-birthday-cake"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800 font-serif">Cakes N Bells</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Install Button - Appears only when installable on Android/Chrome */}
          {canInstall && (
            <button 
              onClick={onInstall}
              className="flex flex-col items-center text-pink-500 hover:text-pink-600 transition-all active:scale-90 px-1"
              title="Install Web App"
            >
              <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center mb-0.5">
                <i className="fas fa-download text-lg animate-bounce-slow"></i>
              </div>
              <span className="text-[8px] font-black uppercase tracking-tighter">Install</span>
            </button>
          )}

          <Link to="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-pink-500 transition-colors">
            <div className="relative">
              <i className="far fa-heart text-2xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Wishlist</span>
          </Link>
          
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-pink-500 transition-colors">
            <i className="fas fa-home text-2xl"></i>
            <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Home</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
