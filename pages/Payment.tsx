
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerDetails, OrderItem, Product, PaymentTier } from '../types';
import { WHATSAPP_NUMBER, TIER_UPI_IDS } from '../constants';
import { useProducts } from '../context/ProductContext';

interface PaymentProps {
  lastOrder?: {
    item: OrderItem;
    customer: CustomerDetails;
  };
}

const Payment: React.FC<PaymentProps> = ({ lastOrder }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [productDetails, setProductDetails] = useState<Product | undefined>(undefined);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('9322820147');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (!lastOrder) {
      navigate('/');
    } else {
      const p = products.find(prod => prod.id === lastOrder.item.productId);
      setProductDetails(p);
    }
  }, [lastOrder, navigate, products]);

  if (!lastOrder) return null;

  const { item, customer } = lastOrder;
  
  // Logic for Dynamic QR Generation
  const currentTier: PaymentTier = productDetails?.paymentTier || 'standard';
  // Get the base UPI ID associated with this product's category/tier
  const upiId = TIER_UPI_IDS[currentTier];
  // Get the exact price calculated in the previous step (e.g., 380, 700, 760)
  const amountToPay = item.totalPrice;

  // Construct the UPI link with the exact amount param (&am=)
  // Used the specific merchant name 'cakes n bells' as requested
  const upiLink = `upi://pay?pa=${upiId}&pn=cakes n bells&cu=INR&am=${amountToPay}`;
  
  // Generate the QR code image using the dynamic UPI link
  // Updated color parameter to 'da82b8'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}&color=da82b8`;

  const handleWhatsAppRedirect = () => {
    const isUPI = customer.paymentMethod === 'UPI';
    
    // Formatting the prefilled message
    const statusLine = isUPI ? "*UPI PAYMENT DONE. SCREENSHOT ATTACHED.*" : "*COD DELIVERY*";
    const closingText = isUPI ? "UPI payment done. Screenshot attached." : "Cash on Delivery order";
    
    const message = `${statusLine}

*Customer Details:*
Name: ${customer.fullName}
Mobile: ${customer.mobile}
Address: ${customer.address}
Pincode: ${customer.pincode}

*Order Summary:*
Product: ${item.name}
Spec: ${item.weight}
Quantity: ${item.quantity}
Total Amount: ₹${item.totalPrice}
Tier: ${currentTier.toUpperCase()}

${closingText}`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, ''); 
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.location.assign(url);
  };

  return (
    <div className="p-4 max-w-lg mx-auto animate-in zoom-in-95 duration-500 min-h-screen flex flex-col justify-center">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-pink-50 overflow-hidden">
        {customer.paymentMethod === 'UPI' ? (
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-2 font-serif tracking-tight">Final Step!</h2>
            <p className="text-gray-500 mb-6 font-medium">Scan QR with any upi app such as phonepe,Gpay to pay  <span className="text-gray-900 font-bold">₹{amountToPay}</span></p>
            
            {/* Dynamic QR Code Section */}
            <div className="relative w-72 h-72 mx-auto mb-4 bg-white rounded-3xl shadow-inner border-8 border-cream flex items-center justify-center p-2 overflow-hidden">
              <img 
                src={qrCodeUrl} 
                alt={`QR Code for ₹${amountToPay}`} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Amount Badge */}
            <div className="mb-8">
              <span className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                currentTier === 'luxury' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                currentTier === 'premium' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                QR for payment of ₹{amountToPay}
              </span>
            </div>

            <div className="bg-pink-50/80 backdrop-blur py-4 px-8 rounded-2xl inline-flex flex-col items-center mb-6 border border-pink-100">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Pay to this mobile number:</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-gray-900 tracking-wider font-mono">9322820147</span>
                <button 
                  onClick={handleCopyNumber}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-pink-200 text-pink-500 hover:bg-pink-50 transition-all active:scale-90"
                  title="Copy to clipboard"
                >
                  <i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                </button>
              </div>
              {isCopied && <span className="text-[10px] text-green-600 font-bold mt-1 animate-pulse">Copied!</span>}
            </div>

            <div className="mb-10 p-4 border border-blue-200 bg-blue-50/50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-wide leading-relaxed">
                Please share the payment screenshot with Cakes N Bells to confirm your order
            </div>

            <div className="border-t border-gray-50 pt-8 space-y-4 mb-10">
              <div className="flex justify-between items-center text-sm px-4">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                <span className="text-2xl font-black text-pink-600">₹{item.totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppRedirect}
              className="w-full bg-[#25D366] text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-[0.97] transition-all"
            >
              <i className="fab fa-whatsapp text-2xl flex-shrink-0"></i>
              <span className="text-lg leading-tight text-center">Click to Confirm Order on WhatsApp</span>
            </button>
            <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
              Screenshot must be attached manually in WhatsApp
            </p>
          </div>
        ) : (
          <div className="p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <i className="fas fa-check text-5xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 font-serif tracking-tight">Order Logged!</h2>
            <p className="text-gray-500 mb-10 font-medium">Click below to finalize your COD order</p>
            
            <div className="bg-cream/50 p-8 rounded-3xl mb-10 text-left border border-pink-50">
              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest border-b border-pink-100 pb-4 mb-6">Order Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Item</span>
                  <span className="font-black text-gray-900">{item.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-sm">Customer</span>
                  <span className="font-bold text-gray-900 text-right truncate max-w-[140px]">{customer.fullName}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-pink-100">
                  <span className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-black text-pink-600">₹{item.totalPrice}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppRedirect}
              className="w-full bg-[#25D366] text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-[0.97] transition-all"
            >
              <i className="fab fa-whatsapp text-2xl flex-shrink-0"></i>
              <span className="text-lg leading-tight text-center">Click to Confirm Order on WhatsApp</span>
            </button>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="mt-10 py-3 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-pink-500 transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Return to Home
      </button>
    </div>
  );
};

export default Payment;
