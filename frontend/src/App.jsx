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
     SCROLL TO TOP ON PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    const scrollToTop =
      () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        if (
          document.documentElement
        ) {
          document.documentElement.scrollTop =
            0;

          document.documentElement.scrollLeft =
            0;
        }

        if (
          document.body
        ) {
          document.body.scrollTop =
            0;

          document.body.scrollLeft =
            0;
        }
      };

    scrollToTop();

    const frame =
      requestAnimationFrame(
        scrollToTop
      );

    const timeout =
      window.setTimeout(
        scrollToTop,
        50
      );

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.clearTimeout(
        timeout
      );
    };
  }, [
    location.pathname,
  ]);

  /* =======================================================
     CURRENT DRIVER SESSION
  ======================================================= */

  const {
    driver,
    accessToken,
    rejectionData,
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

      const storedRejection =
        localStorage.getItem(
          "rejectionData"
        );

      let parsedDriver =
        null;

      let parsedRejection =
        null;

      /* =====================================================
         DRIVER
      ===================================================== */

      if (
        storedDriver
      ) {
        try {
          parsedDriver =
            JSON.parse(
              storedDriver
            );
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
        }
      }

      /* =====================================================
         REJECTION
      ===================================================== */

      if (
        storedRejection
      ) {
        try {
          parsedRejection =
            JSON.parse(
              storedRejection
            );
        } catch (
          error
        ) {
          console.error(
            "Invalid stored Driver rejection data:",
            error
          );

          localStorage.removeItem(
            "rejectionData"
          );
        }
      }

      return {
        driver:
          parsedDriver,

        accessToken:
          token,

        rejectionData:
          parsedRejection,
      };
    }, [
      location.pathname,
    ]);

  /* =======================================================
     DRIVER STATUS
  ======================================================= */

  const driverStatus =
    String(
      driver?.status ||
        ""
    )
      .trim()
      .toLowerCase();

  const hasRejectedState =
    driverStatus ===
      "rejected" ||
    Boolean(
      rejectionData
        ?.rejectionReason
    );

  /* =======================================================
     DEFAULT AUTH ROUTE
  ======================================================= */

  const defaultRoute =
    useMemo(() => {
      /* =====================================================
         NO TOKEN
      ===================================================== */

      if (
        !accessToken
      ) {
        return "/DriverLogin";
      }

      /* =====================================================
         REJECTION STATE

         The Driver document may already be deleted from
         MongoDB, but the old JWT still exists locally.

         VerificationPending will call:

         GET /api/driver-auth/rejection-status

         and display the rejection reason.
      ===================================================== */

      if (
        hasRejectedState
      ) {
        return "/verification-pending";
      }

      /* =====================================================
         TOKEN EXISTS BUT DRIVER LOCAL DATA IS MISSING

         Do not immediately throw the Driver to Sign In.

         VerificationPending can check the backend using the
         existing Driver JWT and determine whether the account
         was rejected.
      ===================================================== */

      if (
        !driver
      ) {
        return "/verification-pending";
      }

      /* =====================================================
         APPROVED
      ===================================================== */

      if (
        driverStatus ===
        "approved"
      ) {
        return "/dashboard";
      }

      /* =====================================================
         PENDING / LEGACY REJECTED / UNKNOWN
      ===================================================== */

      return "/verification-pending";
    }, [
      accessToken,
      driver,
      driverStatus,
      hasRejectedState,
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
      FCM registration is useful while:

      - Driver is pending
      - Driver is approved

      Once the application is rejected, the original Driver
      record is removed. Do not try to save new FCM tokens to
      a deleted Driver account.
    */

    if (
      !driver?._id ||
      !accessToken ||
      driverStatus ===
        "rejected"
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

          /*
            If the Driver has just been rejected while this
            request is in flight, the backend may correctly
            report that the Driver no longer exists.
          */

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
    driverStatus,
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
            VERIFICATION / REJECTION STATUS

            Keep this route outside ProtectedRoute.

            A rejected Driver's original Driver MongoDB
            document no longer exists, so ProtectedRoute must
            not prevent this page from loading.
        ================================================= */}

        <Route
          path="/verification-pending"
          element={
            accessToken ? (
              <VerificationPending />
            ) : (
              <Navigate
                to="/DriverLogin"
                replace
              />
            )
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