import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID,
};

/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app =
  initializeApp(
    firebaseConfig
  );

/* =========================================================
   FIREBASE MESSAGING
========================================================= */

let messaging =
  null;

try {
  const supported =
    await isSupported();

  if (
    supported
  ) {
    messaging =
      getMessaging(
        app
      );
  }
} catch (
  error
) {
  console.warn(
    "Firebase Messaging is not supported:",
    error
  );
}

export {
  app,
  messaging,
};