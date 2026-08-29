import {
  useEffect,
  useMemo,
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import {
  getToken,
} from "firebase/messaging";

import {
  useJsApiLoader,
} from "@react-google-maps/api";

import {
  Capacitor,
} from "@capacitor/core";

import {
  PushNotifications,
} from "@capacitor/push-notifications";

import {
  messaging,
} from "./firebase";

import axios from "./utils/axiosInstance";

/* =========================================================
   PAGES
========================================================= */

import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
import ActiveTripScreen from "./pages/ActiveTripScreen";
import TripSuccess from "./pages/TripSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpSupport from "./pages/HelpSupport";
import Notifications from "./pages/Notifications";
import VerificationPending from "./pages/VerificationPending";

/* =========================================================
   COMPONENTS
========================================================= */

import ProtectedRoute from "./components/ProtectedRoute";

/* =========================================================
   GOOGLE MAP LIBRARIES
========================================================= */

const LIBRARIES = [
  "marker",
  "places",
];

/* =========================================================
   APP
========================================================= */

function App() {
  const location =
    useLocation();

  /* =======================================================
     SCROLL TO TOP ON EVERY PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    /*
      Every route should behave like a fresh screen.

      Example:

      /profile
          ↓
      /help-support

      Even if Profile was scrolled down,
      Help & Support will start from the top.
    */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    /*
      Extra fallback for Android WebView /
      Capacitor / some mobile browsers.
    */

    document.documentElement.scrollTop =
      0;

    document.body.scrollTop =
      0;
  }, [
    location.pathname,
  ]);

  /* =======================================================
     CURRENT DRIVER SESSION
  ======================================================= */

  /*
    Re-read localStorage whenever the route changes.

    This is important because DriverLogin stores:

    accessToken
    driver

    immediately before navigating.

    Without this, App.jsx could continue using stale
    authentication information until a full refresh.
  */

  const {
    driver,
    accessToken,
  } =
    useMemo(() => {
      const token =
        localStorage.getItem(
          "accessToken"
        );

      const storedDriver =
        localStorage.getItem(
          "driver"
        );

      if (
        !storedDriver
      ) {
        return {
          driver:
            null,

          accessToken:
            token,
        };
      }

      try {
        return {
          driver:
            JSON.parse(
              storedDriver
            ),

          accessToken:
            token,
        };
      } catch (
        error
      ) {
        console.error(
          "Invalid stored Driver data:",
          error
        );

        localStorage.removeItem(
          "driver"
        );

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        return {
          driver:
            null,

          accessToken:
            null,
        };
      }
    }, [
      location.pathname,
    ]);

  /* =======================================================
     DEFAULT AUTH ROUTE
  ======================================================= */

  const defaultRoute =
    useMemo(() => {
      if (
        !accessToken ||
        !driver
      ) {
        return "/DriverLogin";
      }

      if (
        driver.status ===
        "approved"
      ) {
        return "/dashboard";
      }

      /*
        Pending and rejected Drivers currently use
        VerificationPending.

        If a separate rejection screen is created later,
        route rejected Drivers there instead.
      */

      return "/verification-pending";
    }, [
      accessToken,
      driver,
    ]);

  /* =======================================================
     GOOGLE MAPS
  ======================================================= */

  const {
    isLoaded,
  } =
    useJsApiLoader({
      googleMapsApiKey:
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY,

      libraries:
        LIBRARIES,
    });

  /* =======================================================
     FCM / PUSH NOTIFICATIONS
  ======================================================= */

  useEffect(() => {
    /*
      An authenticated Driver may register an FCM token.

      Pending Drivers are also allowed because they may need
      to receive approval/rejection notifications.

      Backend:

      POST /api/driver/save-token

      Authorization:
      Bearer <Driver JWT>
    */

    if (
      !driver?._id ||
      !accessToken
    ) {
      return;
    }

    let cancelled =
      false;

    let registrationListener =
      null;

    let registrationErrorListener =
      null;

    /* =====================================================
       SAVE FCM TOKEN
    ===================================================== */

    const saveDriverToken =
      async (
        fcmToken
      ) => {
        try {
          const normalizedToken =
            String(
              fcmToken ||
                ""
            ).trim();

          if (
            !normalizedToken
          ) {
            console.warn(
              "Empty FCM token received"
            );

            return;
          }

          /*
            axiosInstance automatically attaches:

            Authorization:
            Bearer <accessToken>
          */

          const response =
            await axios.post(
              "/driver/save-token",
              {
                token:
                  normalizedToken,
              }
            );

          if (
            cancelled
          ) {
            return;
          }

          console.log(
            "FCM token saved:",
            response.data
              ?.message ||
              "Token saved successfully"
          );
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            "FCM token save failed:",
            error?.response
              ?.data ||
              error
          );
        }
      };

    /* =====================================================
       ANDROID / CAPACITOR PUSH
    ===================================================== */

    const setupNativeNotifications =
      async () => {
        try {
          const permissionResult =
            await PushNotifications.requestPermissions();

          if (
            permissionResult.receive !==
            "granted"
          ) {
            console.log(
              "Push notification permission denied"
            );

            return;
          }

          registrationListener =
            await PushNotifications.addListener(
              "registration",

              async (
                token
              ) => {
                if (
                  cancelled
                ) {
                  return;
                }

                console.log(
                  "Android push token received"
                );

                await saveDriverToken(
                  token.value
                );
              }
            );

          registrationErrorListener =
            await PushNotifications.addListener(
              "registrationError",

              (
                error
              ) => {
                if (
                  cancelled
                ) {
                  return;
                }

                console.error(
                  "Push registration failed:",
                  error
                );
              }
            );

          await PushNotifications.register();
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            "Native push notification setup failed:",
            error
          );
        }
      };

    /* =====================================================
       WEB FCM
    ===================================================== */

    const setupWebNotifications =
      async () => {
        try {
          if (
            !messaging
          ) {
            console.log(
              "Firebase Messaging unavailable"
            );

            return;
          }

          if (
            !(
              "Notification" in
              window
            )
          ) {
            console.log(
              "Browser notifications are not supported"
            );

            return;
          }

          let permission =
            Notification.permission;

          if (
            permission ===
            "default"
          ) {
            permission =
              await Notification.requestPermission();
          }

          if (
            permission !==
            "granted"
          ) {
            console.log(
              "Notification permission denied"
            );

            return;
          }

          /* =================================================
             WEB PUSH VAPID KEY
          ================================================= */

          const vapidKey =
            import.meta.env
              .VITE_FIREBASE_VAPID_KEY;

          if (
            !vapidKey
          ) {
            console.error(
              "VITE_FIREBASE_VAPID_KEY is missing"
            );

            return;
          }

          const fcmToken =
            await getToken(
              messaging,
              {
                vapidKey,
              }
            );

          if (
            !fcmToken
          ) {
            console.log(
              "No FCM token received"
            );

            return;
          }

          if (
            cancelled
          ) {
            return;
          }

          console.log(
            "Web FCM token received"
          );

          await saveDriverToken(
            fcmToken
          );
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            "Web FCM setup failed:",
            error
          );
        }
      };

    /* =====================================================
       START PUSH SETUP
    ===================================================== */

    if (
      Capacitor.isNativePlatform()
    ) {
      setupNativeNotifications();
    } else {
      setupWebNotifications();
    }

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      cancelled =
        true;

      if (
        registrationListener
      ) {
        registrationListener.remove();
      }

      if (
        registrationErrorListener
      ) {
        registrationErrorListener.remove();
      }
    };
  }, [
    driver?._id,
    accessToken,
  ]);

  /* =======================================================
     MAP LOADING
  ======================================================= */

  if (
    !isLoaded
  ) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
        "
      >
        <div className="text-center">
          <div
            className="
              w-10
              h-10
              border-4
              border-yellow-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              text-gray-500
              text-sm
              mt-4
            "
          >
            Loading ASAN Captain...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ROUTES
  ======================================================= */

  return (
    <>
      <Toaster
        position="top-center"
      />

      <Routes>
        {/* =================================================
            ROOT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                defaultRoute
              }
              replace
            />
          }
        />

        {/* =================================================
            DRIVER AUTH
        ================================================= */}

        <Route
          path="/DriverLogin"
          element={
            <DriverLogin />
          }
        />

        {/* =================================================
            VERIFICATION STATUS
        ================================================= */}

        <Route
          path="/verification-pending"
          element={
            <VerificationPending />
          }
        />

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            STUDENTS
        ================================================= */}

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            TRIPS
        ================================================= */}

        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            TRIP DETAILS
        ================================================= */}

        <Route
          path="/trip-details"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ACTIVE TRIP
        ================================================= */}

        <Route
          path="/activetrip"
          element={
            <ProtectedRoute>
              <ActiveTripScreen />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            TRIP SUCCESS
        ================================================= */}

        <Route
          path="/trip-success"
          element={
            <ProtectedRoute>
              <TripSuccess />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PRIVACY POLICY
        ================================================= */}

        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicy />
          }
        />

        {/* =================================================
            HELP & SUPPORT
        ================================================= */}

        <Route
          path="/help-support"
          element={
            <HelpSupport />
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                defaultRoute
              }
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;