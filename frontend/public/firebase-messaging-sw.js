importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBV3e5DWkyh0occjmbGeB1sQrTJZpBJQBo",
  authDomain: "asan-app-4b7ea.firebaseapp.com",
  projectId: "asan-app-4b7ea",
  messagingSenderId: "802587778210",
  appId: "1:802587778210:android:463fe27d7b5d4a3d708bfb",
});

const messaging = firebase.messaging();