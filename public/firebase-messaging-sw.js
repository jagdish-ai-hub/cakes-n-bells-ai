importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDJ8FKA_PTLtlqdMPw7J88wt_js9diBzMs",
  authDomain: "cakesnbells.firebaseapp.com",
  projectId: "cakesnbells",
  storageBucket: "cakesnbells.firebasestorage.app",
  messagingSenderId: "683519090253",
  appId: "1:683519090253:web:d394d289ac9c4c71b74604"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/pwa-icon.jpg',
    badge: '/pwa-icon.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
