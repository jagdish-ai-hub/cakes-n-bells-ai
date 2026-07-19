import React, { useState, useEffect } from 'react';
import { db, requestForToken } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and if permission hasn't been granted/denied yet
    const dismissed = localStorage.getItem('push_notification_dismissed');
    if ('Notification' in window && !dismissed) {
      if (Notification.permission === 'default') {
        setShowBanner(true);
      }
    }
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await requestForToken();
        if (token) {
          // Save the token to customer_tokens
          await setDoc(doc(db, 'customer_tokens', token), {
            token,
            createdAt: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
          setShowBanner(false);
          // Optional: Add a small toast or just close silently
        } else {
          console.error("No token received");
        }
      } else {
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_notification_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-pink-100 p-4 z-50 animate-pop-in">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-pink-100 text-pink-500 flex items-center justify-center rounded-full mr-3 shrink-0">
          <i className="fas fa-bell"></i>
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-gray-800 text-sm">Enable Notifications?</h4>
          <p className="text-xs text-gray-500 mt-1">Get alerts for new cakes, special sales, and exclusive discounts!</p>
          <div className="mt-3 flex space-x-2">
            <button 
              onClick={handleEnable}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
            >
              Enable
            </button>
            <button 
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 rounded-lg transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
