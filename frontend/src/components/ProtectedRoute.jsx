import {
  Navigate,
  useLocation,
} from "react-router-dom";

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

  /* =======================================================
     STORED SESSION
  ======================================================= */

  const token =
    localStorage.getItem(
      "accessToken"
    );

  const driverData =
    localStorage.getItem(
      "driver"
    );

  const rejectionData =
    localStorage.getItem(
      "rejectionData"
    );

  /* =======================================================
     TOKEN REQUIRED
  ======================================================= */

  /*
    Important:

    A rejected Driver may still have a valid Driver JWT even
    after the original Driver MongoDB document has been deleted.

    Therefore:

    token missing
        → Sign In

    token exists but Driver data missing
        → VerificationPending

    VerificationPending will check the backend using:

    GET /api/driver-auth/rejection-status
  */

  if (
    !token
  ) {
    return (
      <Navigate
        to="/DriverLogin"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     PARSE REJECTION DATA
  ======================================================= */

  let rejection =
    null;

  if (
    rejectionData
  ) {
    try {
      rejection =
        JSON.parse(
          rejectionData
        );
    } catch (
      error
    ) {
      console.warn(
        "Invalid stored Driver rejection data:",
        error
      );

      localStorage.removeItem(
        "rejectionData"
      );
    }
  }

  /* =======================================================
     KNOWN REJECTION
  ======================================================= */

  if (
    rejection
      ?.rejectionReason
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     DRIVER DATA MISSING
  ======================================================= */

  /*
    DO NOT clear accessToken here.

    The Driver record may have just been deleted because the
    Admin rejected the application.

    The existing JWT is exactly what VerificationPending needs
    to retrieve the rejection reason.
  */

  if (
    !driverData
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     PARSE DRIVER
  ======================================================= */

  let driver =
    null;

  try {
    driver =
      JSON.parse(
        driverData
      );
  } catch (
    error
  ) {
    console.error(
      "Invalid stored Driver data:",
      error
    );

    /*
      Remove only the corrupted Driver object.

      Keep accessToken because it may still be valid and can
      be used by VerificationPending to determine whether the
      Driver was rejected.
    */

    localStorage.removeItem(
      "driver"
    );

    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     DRIVER OBJECT INVALID
  ======================================================= */

  if (
    !driver ||
    typeof driver !==
      "object"
  ) {
    localStorage.removeItem(
      "driver"
    );

    return (
      <Navigate
        to="/verification-pending"
        replace
      />
    );
  }

  /* =======================================================
     DRIVER STATUS
  ======================================================= */

  const status =
    String(
      driver.status ||
        ""
    )
      .trim()
      .toLowerCase();

  /* =======================================================
     REJECTED DRIVER
  ======================================================= */

  if (
    status ===
    "rejected"
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     PENDING DRIVER
  ======================================================= */

  if (
    status ===
    "pending"
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     APPROVAL REQUIRED
  ======================================================= */

  /*
    Only explicitly approved Drivers are allowed into:

    /dashboard
    /profile
    /students
    /trips
    /trip-details
    /activetrip
    /trip-success
    /notifications
  */

  if (
    status !==
    "approved"
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     APPROVED DRIVER DATA REQUIRED
  ======================================================= */

  if (
    !driver?._id
  ) {
    /*
      An approved Driver should always have a MongoDB _id.

      Do not grant access when the locally stored Driver object
      is incomplete.
    */

    localStorage.removeItem(
      "driver"
    );

    return (
      <Navigate
        to="/verification-pending"
        replace
      />
    );
  }

  /* =======================================================
     APPROVED DRIVER
  ======================================================= */

  return children;
}

/* =========================================================
   EXPORT
========================================================= */

export default ProtectedRoute;