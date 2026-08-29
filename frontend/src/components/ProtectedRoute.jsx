import {
  Navigate,
  useLocation,
} from "react-router-dom";

function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

  const token =
    localStorage.getItem(
      "accessToken"
    );

  const driverData =
    localStorage.getItem(
      "driver"
    );

  /* =========================================================
     AUTH REQUIRED
  ========================================================= */

  if (
    !token ||
    !driverData
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

  /* =========================================================
     PARSE DRIVER
  ========================================================= */

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

    localStorage.removeItem(
      "driver"
    );

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    return (
      <Navigate
        to="/DriverLogin"
        replace
      />
    );
  }

  /* =========================================================
     DRIVER DATA REQUIRED
  ========================================================= */

  if (
    !driver?._id
  ) {
    localStorage.removeItem(
      "driver"
    );

    localStorage.removeItem(
      "accessToken"
    );

    return (
      <Navigate
        to="/DriverLogin"
        replace
      />
    );
  }

  /* =========================================================
     APPROVAL REQUIRED
  ========================================================= */

  /*
    Driver authentication and Driver approval are separate.

    pending:
      authenticated
      but cannot access operational pages

    rejected:
      authenticated
      but cannot access operational pages

    approved:
      allowed into dashboard and protected Driver pages
  */

  if (
    driver.status !==
    "approved"
  ) {
    return (
      <Navigate
        to="/verification-pending"
        replace
      />
    );
  }

  /* =========================================================
     APPROVED DRIVER
  ========================================================= */

  return children;
}

export default ProtectedRoute;