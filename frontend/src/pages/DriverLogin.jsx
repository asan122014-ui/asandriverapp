import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import autoIcon from "../assets/auto.jpg";
import axios from "../utils/axiosInstance";
import MapPicker from "../components/MapPicker";

/* =========================================================
   DRIVER LOGIN / SIGNUP
========================================================= */

function DriverLogin() {
  const navigate =
    useNavigate();

  /* =======================================================
     COMMON
  ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    activeTab,
    setActiveTab,
  ] =
    useState("login");

  /* =======================================================
     LOGIN
  ======================================================= */

  const [
    loginEmail,
    setLoginEmail,
  ] =
    useState("");

  const [
    loginOtp,
    setLoginOtp,
  ] =
    useState("");

  const [
    loginOtpSent,
    setLoginOtpSent,
  ] =
    useState(false);

  const [
    loginResendTimer,
    setLoginResendTimer,
  ] =
    useState(0);

  /* =======================================================
     SIGNUP
  ======================================================= */

  const [
    signupStep,
    setSignupStep,
  ] =
    useState(1);

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    address,
    setAddress,
  ] =
    useState("");

  const [
    latitude,
    setLatitude,
  ] =
    useState(null);

  const [
    longitude,
    setLongitude,
  ] =
    useState(null);

  /* =======================================================
     VEHICLE
  ======================================================= */

  const [
    vehicleNumber,
    setVehicleNumber,
  ] =
    useState("");

  const [
    vehicleType,
    setVehicleType,
  ] =
    useState("");

  const [
    vehicleModel,
    setVehicleModel,
  ] =
    useState("");

  const [
    licenseNumber,
    setLicenseNumber,
  ] =
    useState("");

  /* =======================================================
     IDENTITY
  ======================================================= */

  const [
    selectedId,
    setSelectedId,
  ] =
    useState("");

  /* =======================================================
     FILES
  ======================================================= */

  const [
    licenseFront,
    setLicenseFront,
  ] =
    useState(null);

  const [
    licenseBack,
    setLicenseBack,
  ] =
    useState(null);

  const [
    rcFront,
    setRcFront,
  ] =
    useState(null);

  const [
    rcBack,
    setRcBack,
  ] =
    useState(null);

  const [
    insuranceFile,
    setInsuranceFile,
  ] =
    useState(null);

  const [
    idFront,
    setIdFront,
  ] =
    useState(null);

  const [
    idBack,
    setIdBack,
  ] =
    useState(null);

  const [
    profilePhoto,
    setProfilePhoto,
  ] =
    useState(null);

  /* =======================================================
     REGISTRATION OTP
  ======================================================= */

  const [
    registerOtp,
    setRegisterOtp,
  ] =
    useState("");

  const [
    registerResendTimer,
    setRegisterResendTimer,
  ] =
    useState(0);

  /* =======================================================
     FILE REFS
  ======================================================= */

  const licenseFrontRef =
    useRef(null);

  const licenseBackRef =
    useRef(null);

  const rcFrontRef =
    useRef(null);

  const rcBackRef =
    useRef(null);

  const insuranceRef =
    useRef(null);

  const idFrontRef =
    useRef(null);

  const idBackRef =
    useRef(null);

  const profilePhotoRef =
    useRef(null);

  /* =======================================================
     VALIDATION
  ======================================================= */

  const isValidEmail = (
    value
  ) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(
        value || ""
      )
        .trim()
        .toLowerCase()
    );

  const isValidName = (
    value
  ) =>
    /^[a-zA-Z\s]+$/.test(
      String(
        value || ""
      ).trim()
    ) &&
    String(
      value || ""
    ).trim().length >=
      2;

  const isValidPhone = (
    value
  ) =>
    /^[6-9]\d{9}$/.test(
      String(
        value || ""
      )
    );

  const isValidOtp = (
    value
  ) =>
    /^\d{6}$/.test(
      String(
        value || ""
      )
    );

  const isValidLicenseNumber = (
    value
  ) =>
    /^[A-Z0-9]{8,20}$/.test(
      String(
        value || ""
      )
        .trim()
        .toUpperCase()
    );

  const isValidVehicleNumber = (
    value
  ) => {
    const normalized =
      String(
        value || ""
      )
        .replace(
          /\s+/g,
          ""
        )
        .replace(
          /-/g,
          ""
        )
        .toUpperCase();

    return /^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$/.test(
      normalized
    );
  };

  const isValidVehicleType = (
    value
  ) =>
    String(
      value || ""
    ).trim().length >=
    2;

  /* =======================================================
     STEP VALIDATION
  ======================================================= */

  const isStep1Valid =
    isValidName(
      name
    ) &&
    isValidPhone(
      phone
    ) &&
    isValidEmail(
      email
    );

  const isStep2Valid =
    typeof latitude ===
      "number" &&
    typeof longitude ===
      "number" &&
    address.trim() !==
      "";

  const isStep3Valid =
    Boolean(
      licenseFront
    ) &&
    Boolean(
      licenseBack
    ) &&
    Boolean(
      rcFront
    ) &&
    Boolean(
      rcBack
    ) &&
    Boolean(
      insuranceFile
    ) &&
    isValidVehicleNumber(
      vehicleNumber
    ) &&
    isValidVehicleType(
      vehicleType
    ) &&
    isValidLicenseNumber(
      licenseNumber
    );

  const isStep4Valid =
    Boolean(
      selectedId
    ) &&
    Boolean(
      idFront
    ) &&
    Boolean(
      idBack
    );

  /* =======================================================
     OTP TIMERS
  ======================================================= */

  useEffect(() => {
    if (
      loginResendTimer <=
      0
    ) {
      return;
    }

    const interval =
      setInterval(
        () => {
          setLoginResendTimer(
            (
              previous
            ) =>
              Math.max(
                previous -
                  1,
                0
              )
          );
        },
        1000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    loginResendTimer,
  ]);

  useEffect(() => {
    if (
      registerResendTimer <=
      0
    ) {
      return;
    }

    const interval =
      setInterval(
        () => {
          setRegisterResendTimer(
            (
              previous
            ) =>
              Math.max(
                previous -
                  1,
                0
              )
          );
        },
        1000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    registerResendTimer,
  ]);

  /* =======================================================
     SAVE SESSION
  ======================================================= */

  const saveDriverSession = (
    token,
    driver
  ) => {
    localStorage.setItem(
      "accessToken",
      token
    );

    localStorage.setItem(
      "driver",
      JSON.stringify(
        driver
      )
    );

    localStorage.removeItem(
      "refreshToken"
    );
  };

  /* =======================================================
     ROUTE DRIVER
  ======================================================= */

  const routeDriver = (
    driver
  ) => {
    const status =
      driver?.status;

    if (
      status ===
      "approved"
    ) {
      navigate(
        "/dashboard",
        {
          replace:
            true,
        }
      );

      return;
    }

    navigate(
      "/verification-pending",
      {
        replace:
          true,
      }
    );
  };

  /* =======================================================
     LOGIN - SEND OTP
  ======================================================= */

  const handleSendLoginOtp =
    async () => {
      const normalizedEmail =
        loginEmail
          .trim()
          .toLowerCase();

      if (
        !isValidEmail(
          normalizedEmail
        )
      ) {
        toast.error(
          "Enter a valid email address"
        );

        return;
      }

      try {
        setLoading(
          true
        );

        const res =
          await axios.post(
            "/driver-auth/send-login-otp",
            {
              email:
                normalizedEmail,
            }
          );

        if (
          !res.data
            ?.success
        ) {
          toast.error(
            res.data
              ?.message ||
              "Unable to send OTP"
          );

          return;
        }

        setLoginOtpSent(
          true
        );

        setLoginOtp(
          ""
        );

        setLoginResendTimer(
          60
        );

        toast.success(
          "OTP sent to your email"
        );
      } catch (
        error
      ) {
        console.error(
          "SEND LOGIN OTP ERROR:",
          error?.response
            ?.data ||
            error
        );

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "Failed to send OTP"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     LOGIN - VERIFY OTP
  ======================================================= */

  const handleVerifyLoginOtp =
    async () => {
      if (
        !isValidOtp(
          loginOtp
        )
      ) {
        toast.error(
          "Enter a valid 6-digit OTP"
        );

        return;
      }

      try {
        setLoading(
          true
        );

        const res =
          await axios.post(
            "/driver-auth/verify-login-otp",
            {
              email:
                loginEmail
                  .trim()
                  .toLowerCase(),

              otp:
                loginOtp,
            }
          );

        const token =
          res.data
            ?.token;

        const driver =
          res.data
            ?.data;

        if (
          !res.data
            ?.success ||
          !token ||
          !driver
        ) {
          toast.error(
            res.data
              ?.message ||
              "Login failed"
          );

          return;
        }

        saveDriverSession(
          token,
          driver
        );

        toast.success(
          "Login successful"
        );

        routeDriver(
          driver
        );
      } catch (
        error
      ) {
        console.error(
          "VERIFY LOGIN OTP ERROR:",
          error?.response
            ?.data ||
            error
        );

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "OTP verification failed"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     SIGNUP - SEND OTP
  ======================================================= */

  const handleSendRegisterOtp =
    async () => {
      if (
        !profilePhoto
      ) {
        toast.error(
          "Upload your profile photo"
        );

        return;
      }

      try {
        setLoading(
          true
        );

        const res =
          await axios.post(
            "/driver-auth/send-register-otp",
            {
              email:
                email
                  .trim()
                  .toLowerCase(),
            }
          );

        if (
          !res.data
            ?.success
        ) {
          toast.error(
            res.data
              ?.message ||
              "Unable to send OTP"
          );

          return;
        }

        setRegisterOtp(
          ""
        );

        setRegisterResendTimer(
          60
        );

        setSignupStep(
          7
        );

        toast.success(
          "OTP sent to your email"
        );
      } catch (
        error
      ) {
        console.error(
          "SEND REGISTER OTP ERROR:",
          error?.response
            ?.data ||
            error
        );

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "Failed to send registration OTP"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     SIGNUP - VERIFY OTP + CREATE DRIVER
  ======================================================= */

  const handleCompleteRegistration =
    async () => {
      if (
        !isValidOtp(
          registerOtp
        )
      ) {
        toast.error(
          "Enter a valid 6-digit OTP"
        );

        return;
      }

      if (
        !isStep1Valid ||
        !isStep2Valid ||
        !isStep3Valid ||
        !isStep4Valid
      ) {
        toast.error(
          "Registration information is incomplete"
        );

        return;
      }

      try {
        setLoading(
          true
        );

        const formData =
          new FormData();

        formData.append(
          "otp",
          registerOtp
        );

        formData.append(
          "name",
          name.trim()
        );

        formData.append(
          "phone",
          phone
        );

        formData.append(
          "email",
          email
            .trim()
            .toLowerCase()
        );

        formData.append(
          "address",
          address.trim()
        );

        formData.append(
          "latitude",
          String(
            latitude
          )
        );

        formData.append(
          "longitude",
          String(
            longitude
          )
        );

        formData.append(
          "vehicleNumber",
          vehicleNumber
            .trim()
            .toUpperCase()
        );

        formData.append(
          "vehicleType",
          vehicleType.trim()
        );

        formData.append(
          "vehicleModel",
          vehicleModel.trim()
        );

        formData.append(
          "licenseNumber",
          licenseNumber
            .trim()
            .toUpperCase()
        );

        formData.append(
          "licenseFront",
          licenseFront
        );

        formData.append(
          "licenseBack",
          licenseBack
        );

        formData.append(
          "rcFront",
          rcFront
        );

        formData.append(
          "rcBack",
          rcBack
        );

        formData.append(
          "insurance",
          insuranceFile
        );

        formData.append(
          "idFront",
          idFront
        );

        formData.append(
          "idBack",
          idBack
        );

        if (
          profilePhoto
        ) {
          formData.append(
            "profilePhoto",
            profilePhoto
          );
        }

        const res =
          await axios.post(
            "/driver-auth/verify-register-otp",
            formData
          );

        const token =
          res.data
            ?.token;

        const driver =
          res.data
            ?.data;

        if (
          !res.data
            ?.success ||
          !token ||
          !driver
        ) {
          toast.error(
            res.data
              ?.message ||
              "Registration failed"
          );

          return;
        }

        saveDriverSession(
          token,
          driver
        );

        toast.success(
          "Registration completed successfully"
        );

        routeDriver(
          driver
        );
      } catch (
        error
      ) {
        console.error(
          "REGISTER DRIVER ERROR:",
          error?.response
            ?.data ||
            error
        );

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     EXISTING SESSION
  ======================================================= */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (
      !token
    ) {
      return;
    }

    const restoreSession =
      async () => {
        try {
          const res =
            await axios.get(
              "/driver-auth/me"
            );

          const driver =
            res.data
              ?.data;

          if (
            !driver
          ) {
            return;
          }

          localStorage.setItem(
            "driver",
            JSON.stringify(
              driver
            )
          );

          routeDriver(
            driver
          );
        } catch (
          error
        ) {
          console.error(
            "SESSION RESTORE ERROR:",
            error
          );
        }
      };

    restoreSession();
  }, []);

  /* =======================================================
     UI
  ======================================================= */

  const inputClass =
    "mt-2 h-[54px] w-full rounded-[15px] border border-[#E8DED0] bg-white px-4 text-[10px] font-semibold text-black outline-none transition placeholder:text-[#B3AAA0] focus:border-[#D9A534]";

  const otpInputClass =
    "mt-3 h-[62px] w-full rounded-[16px] border border-[#E8DED0] bg-white px-4 text-center text-[25px] font-black tracking-[0.34em] text-black outline-none transition placeholder:text-[#D0C8BE] focus:border-[#D9A534]";

  return (
    <div className="min-h-screen bg-[#FFF9EE]">
      <div className="relative mx-auto min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE]">

        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-[125px] -top-[145px] h-[320px] w-[320px] rounded-full bg-[#FFEDB9]/70" />
        <div className="pointer-events-none absolute -left-[175px] top-[430px] h-[300px] w-[300px] rounded-full bg-[#FFF2D1]/55" />

        <div className="relative z-10 px-4 pb-10 pt-5">

          {/* =================================================
              BRAND BAR
          ================================================= */}

          <header className="flex items-center justify-between px-1">
            <div>
              <p className="text-[17px] font-black tracking-[-0.025em] text-black">
                ASAN Captain
              </p>

              <p className="mt-0.5 text-[6.5px] font-bold tracking-[0.15em] text-[#B87700]">
                DRIVER EXPERIENCE
              </p>
            </div>

            <div className="rounded-full border border-[#EED69B] bg-[#FFF6DB] px-3 py-1.5">
              <p className="text-[6px] font-black tracking-[0.13em] text-[#956400]">
                SECURE ACCESS
              </p>
            </div>
          </header>

          {/* =================================================
              HERO
          ================================================= */}

          <section className="px-1 pb-5 pt-9">
            <p className="text-[7px] font-black tracking-[0.18em] text-[#B87700]">
              YOUR DRIVER WORKSPACE
            </p>

            <h1 className="mt-3 max-w-[350px] text-[30px] font-black leading-[1.06] tracking-[-0.045em] text-black">
              Everything you need,
              <span className="text-[#B87700]"> before the first pickup.</span>
            </h1>

            <p className="mt-3 max-w-[360px] text-[9px] leading-[1.75] text-[#8C8276]">
              Sign in with your registered email or create your Captain account.
              OTP verification keeps access simple and secure.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Passwordless login",
                "Verified driver access",
                "Secure OTP",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#EEE1CB] bg-[#FFFDF8] px-3 py-1.5 text-[6.5px] font-bold text-[#8C8276]"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* =================================================
              AUTH SHELL
          ================================================= */}

          <section className="overflow-hidden rounded-[24px] border border-[#EED69B] bg-[#FFFDF8] shadow-[0_12px_35px_rgba(115,77,10,0.07)]">
            <div className="h-[5px] bg-[#FFB000]" />

            <div className="p-4 sm:p-5">

              {/* TABS */}

              <div className="grid grid-cols-2 gap-1 rounded-[16px] bg-[#F5EFE4] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setSignupStep(1);
                  }}
                  className={`h-[43px] rounded-[13px] text-[8px] font-black transition ${
                    activeTab === "login"
                      ? "bg-white text-black shadow-sm"
                      : "text-[#968C80]"
                  }`}
                >
                  SIGN IN
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("signup")
                  }
                  className={`h-[43px] rounded-[13px] text-[8px] font-black transition ${
                    activeTab === "signup"
                      ? "bg-white text-black shadow-sm"
                      : "text-[#968C80]"
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* =================================================
                  LOGIN
              ================================================= */}

              {activeTab === "login" && (
                <div className="pt-6">
                  {!loginOtpSent ? (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[7px] font-black tracking-[0.15em] text-[#B87700]">
                            WELCOME BACK
                          </p>

                          <h2 className="mt-2 text-[22px] font-black tracking-[-0.025em] text-black">
                            Sign in to your duty.
                          </h2>

                          <p className="mt-2 max-w-[315px] text-[8.5px] leading-[1.7] text-[#8C8276]">
                            Enter the email linked to your Driver account. We&apos;ll send a 6-digit OTP.
                          </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0C5]">
                          <Mail
                            size={18}
                            className="text-[#A97000]"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="text-[7px] font-black tracking-[0.11em] text-[#8F8579]">
                          REGISTERED EMAIL
                        </label>

                        <input
                          type="email"
                          placeholder="captain@example.com"
                          value={loginEmail}
                          onChange={(e) =>
                            setLoginEmail(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />

                        <p className="mt-2 text-[6.5px] leading-[1.5] text-[#A39A90]">
                          Use the same email you registered with ASAN Captain.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          !isValidEmail(
                            loginEmail
                          )
                        }
                        onClick={
                          handleSendLoginOtp
                        }
                        className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#AAA095]"
                      >
                        {loading
                          ? "SENDING OTP..."
                          : "CONTINUE WITH OTP"}
                      </button>

                      <div className="mt-4 flex items-start gap-2 rounded-[14px] bg-[#FFF9EE] px-3.5 py-3">
                        <ShieldCheck
                          size={14}
                          className="mt-0.5 shrink-0 text-[#B87700]"
                        />

                        <p className="text-[7px] leading-[1.55] text-[#8C8276]">
                          Your password is never required. Access is verified through your registered email.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginOtpSent(
                            false
                          );

                          setLoginOtp(
                            ""
                          );
                        }}
                        className="flex items-center gap-1.5 text-[7px] font-black text-[#8C8276]"
                      >
                        <ArrowLeft
                          size={13}
                        />
                        CHANGE EMAIL
                      </button>

                      <div className="mt-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[7px] font-black tracking-[0.15em] text-[#B87700]">
                            VERIFY ACCESS
                          </p>

                          <h2 className="mt-2 text-[22px] font-black tracking-[-0.025em] text-black">
                            Check your inbox.
                          </h2>

                          <p className="mt-2 text-[8.5px] leading-[1.7] text-[#8C8276]">
                            Enter the 6-digit OTP sent to
                          </p>

                          <p className="mt-1 max-w-[270px] break-all text-[9px] font-black text-black">
                            {loginEmail}
                          </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EEF7EC]">
                          <ShieldCheck
                            size={18}
                            className="text-[#4E854A]"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="text-[7px] font-black tracking-[0.11em] text-[#8F8579]">
                          6-DIGIT OTP
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={loginOtp}
                          onChange={(e) =>
                            setLoginOtp(
                              e.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  6
                                )
                            )
                          }
                          placeholder="000000"
                          className={otpInputClass}
                        />
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          !isValidOtp(
                            loginOtp
                          )
                        }
                        onClick={
                          handleVerifyLoginOtp
                        }
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#AAA095]"
                      >
                        {loading
                          ? "VERIFYING..."
                          : "VERIFY & SIGN IN"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          loginResendTimer > 0
                        }
                        onClick={
                          handleSendLoginOtp
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 text-[7.5px] font-black text-[#B87700] disabled:text-[#AAA095]"
                      >
                        <RefreshCw
                          size={13}
                        />

                        {loginResendTimer > 0
                          ? `RESEND IN ${loginResendTimer}s`
                          : "RESEND OTP"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* =================================================
                  SIGNUP
              ================================================= */}

              {activeTab === "signup" && (
                <div className="pt-6">

                  {/* STEP META */}

                  <div className="mb-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[7px] font-black tracking-[0.15em] text-[#B87700]">
                          CAPTAIN ONBOARDING
                        </p>

                        <p className="mt-1 text-[8px] font-bold text-[#8C8276]">
                          Step {signupStep} of 7
                        </p>
                      </div>

                      <p className="text-[7px] font-black text-[#B87700]">
                        {Math.round(
                          (signupStep / 7) *
                            100
                        )}
                        %
                      </p>
                    </div>

                    <div className="mt-3 flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7].map(
                        (step) => (
                          <div
                            key={step}
                            className={`h-[4px] flex-1 rounded-full ${
                              signupStep >=
                              step
                                ? "bg-[#FFB000]"
                                : "bg-[#E9E1D5]"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* STEP 1 */}

                  {signupStep === 1 && (
                    <StepFrame
                      eyebrow="PERSONAL DETAILS"
                      title="Start with the basics."
                      description="Tell us who you are. Your email becomes your secure OTP login identity."
                    >
                      <FieldLabel label="FULL NAME">
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) =>
                            setName(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <FieldLabel label="PHONE NUMBER">
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  10
                                )
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <FieldLabel label="EMAIL ADDRESS">
                        <input
                          type="email"
                          placeholder="captain@example.com"
                          value={email}
                          onChange={(e) =>
                            setEmail(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />

                        <p className="mt-2 text-[6.5px] text-[#A39A90]">
                          This email will be used for future OTP sign-ins.
                        </p>
                      </FieldLabel>

                      <ContinueButton
                        disabled={
                          !isStep1Valid
                        }
                        onClick={() =>
                          setSignupStep(2)
                        }
                      />
                    </StepFrame>
                  )}

                  {/* STEP 2 */}

                  {signupStep === 2 && (
                    <StepFrame
                      eyebrow="HOME BASE"
                      title="Set your pickup base."
                      description="Choose your home location so ASAN can map your assigned duty area accurately."
                      back={() =>
                        setSignupStep(1)
                      }
                    >
                      <div className="overflow-hidden rounded-[17px] border border-[#E8DED0] bg-white p-2">
                        <MapPicker
                          onChange={(
                            location
                          ) => {
                            setAddress(
                              location
                                ?.address ||
                                ""
                            );

                            setLatitude(
                              location
                                ?.latitude ??
                                null
                            );

                            setLongitude(
                              location
                                ?.longitude ??
                                null
                            );
                          }}
                        />
                      </div>

                      {address && (
                        <div className="mt-4 rounded-[15px] border border-[#DCEAD8] bg-[#F5FBF3] p-4">
                          <p className="text-[7px] font-black tracking-[0.1em] text-[#4E854A]">
                            SELECTED LOCATION
                          </p>

                          <p className="mt-2 text-[8px] leading-[1.6] text-[#6F7E6D]">
                            {address}
                          </p>
                        </div>
                      )}

                      <ContinueButton
                        disabled={
                          !isStep2Valid
                        }
                        onClick={() =>
                          setSignupStep(3)
                        }
                      />
                    </StepFrame>
                  )}

                  {/* STEP 3 */}

                  {signupStep === 3 && (
                    <StepFrame
                      eyebrow="VEHICLE & LICENSE"
                      title="Add your vehicle credentials."
                      description="Upload the required Driver and vehicle documents for verification."
                      back={() =>
                        setSignupStep(2)
                      }
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <UploadField
                          title="License Front"
                          file={
                            licenseFront
                          }
                          inputRef={
                            licenseFrontRef
                          }
                          setFile={
                            setLicenseFront
                          }
                        />

                        <UploadField
                          title="License Back"
                          file={
                            licenseBack
                          }
                          inputRef={
                            licenseBackRef
                          }
                          setFile={
                            setLicenseBack
                          }
                        />
                      </div>

                      <FieldLabel label="LICENSE NUMBER">
                        <input
                          type="text"
                          placeholder="License number"
                          value={licenseNumber}
                          onChange={(e) =>
                            setLicenseNumber(
                              e.target.value.toUpperCase()
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <UploadField
                          title="RC Front"
                          file={
                            rcFront
                          }
                          inputRef={
                            rcFrontRef
                          }
                          setFile={
                            setRcFront
                          }
                        />

                        <UploadField
                          title="RC Back"
                          file={
                            rcBack
                          }
                          inputRef={
                            rcBackRef
                          }
                          setFile={
                            setRcBack
                          }
                        />
                      </div>

                      <FieldLabel label="VEHICLE NUMBER">
                        <input
                          type="text"
                          placeholder="TS09AB1234"
                          value={vehicleNumber}
                          onChange={(e) =>
                            setVehicleNumber(
                              e.target.value.toUpperCase()
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <FieldLabel label="VEHICLE TYPE">
                        <input
                          type="text"
                          placeholder="Auto / Van / Car"
                          value={vehicleType}
                          onChange={(e) =>
                            setVehicleType(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <FieldLabel label="VEHICLE MODEL">
                        <input
                          type="text"
                          placeholder="Optional"
                          value={vehicleModel}
                          onChange={(e) =>
                            setVehicleModel(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <div className="mt-4">
                        <UploadField
                          title="Insurance Certificate"
                          file={
                            insuranceFile
                          }
                          inputRef={
                            insuranceRef
                          }
                          setFile={
                            setInsuranceFile
                          }
                          wide
                        />
                      </div>

                      <ContinueButton
                        disabled={
                          !isStep3Valid
                        }
                        onClick={() =>
                          setSignupStep(4)
                        }
                      />
                    </StepFrame>
                  )}

                  {/* STEP 4 */}

                  {signupStep === 4 && (
                    <StepFrame
                      eyebrow="IDENTITY"
                      title="Confirm your identity."
                      description="Choose the identity document you are submitting and upload both sides."
                      back={() =>
                        setSignupStep(3)
                      }
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "Aadhaar",
                          "Voter",
                          "Passport",
                        ].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setSelectedId(
                                type
                              )
                            }
                            className={`min-h-[46px] rounded-[14px] border px-2 text-[7.5px] font-black transition ${
                              selectedId === type
                                ? "border-[#E8B949] bg-[#FFF3D3] text-black"
                                : "border-[#EEE4D5] bg-white text-[#8C8276]"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <UploadField
                          title="ID Front"
                          file={idFront}
                          inputRef={
                            idFrontRef
                          }
                          setFile={
                            setIdFront
                          }
                        />

                        <UploadField
                          title="ID Back"
                          file={idBack}
                          inputRef={
                            idBackRef
                          }
                          setFile={
                            setIdBack
                          }
                        />
                      </div>

                      <ContinueButton
                        disabled={
                          !isStep4Valid
                        }
                        onClick={() =>
                          setSignupStep(5)
                        }
                      />
                    </StepFrame>
                  )}

                  {/* STEP 5 */}

                  {signupStep === 5 && (
                    <StepFrame
                      eyebrow="REVIEW"
                      title="One final check."
                      description="Review your details before moving to email verification."
                      back={() =>
                        setSignupStep(4)
                      }
                    >
                      <div className="space-y-2">
                        <ReviewItem
                          label="Name"
                          value={name}
                        />

                        <ReviewItem
                          label="Phone"
                          value={phone}
                        />

                        <ReviewItem
                          label="Email"
                          value={email}
                        />

                        <ReviewItem
                          label="Address"
                          value={address}
                        />

                        <ReviewItem
                          label="Vehicle"
                          value={vehicleNumber}
                        />

                        <ReviewItem
                          label="Vehicle Type"
                          value={vehicleType}
                        />

                        <ReviewItem
                          label="License"
                          value={licenseNumber}
                        />
                      </div>

                      <ContinueButton
                        onClick={() =>
                          setSignupStep(6)
                        }
                      />
                    </StepFrame>
                  )}

                  {/* STEP 6 */}

                  {signupStep === 6 && (
                    <StepFrame
                      eyebrow="PROFILE PHOTO"
                      title="Put a face to your Captain profile."
                      description="Upload a clear recent photo before we verify your email."
                      back={() =>
                        setSignupStep(5)
                      }
                    >
                      <UploadField
                        title="Profile Photo"
                        file={
                          profilePhoto
                        }
                        inputRef={
                          profilePhotoRef
                        }
                        setFile={
                          setProfilePhoto
                        }
                        circular
                        wide
                      />

                      <button
                        type="button"
                        disabled={
                          !profilePhoto ||
                          loading
                        }
                        onClick={
                          handleSendRegisterOtp
                        }
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#AAA095]"
                      >
                        {loading
                          ? "SENDING OTP..."
                          : "VERIFY EMAIL & CONTINUE"}
                      </button>
                    </StepFrame>
                  )}

                  {/* STEP 7 */}

                  {signupStep === 7 && (
                    <StepFrame
                      eyebrow="EMAIL VERIFICATION"
                      title="Finish your Captain account."
                      description="Enter the OTP we sent to your registered email."
                      back={() =>
                        setSignupStep(6)
                      }
                    >
                      <div className="rounded-[15px] bg-[#FFF9EE] px-4 py-3">
                        <p className="text-[6.5px] font-black tracking-[0.1em] text-[#A0968A]">
                          OTP SENT TO
                        </p>

                        <p className="mt-1 break-all text-[8.5px] font-black text-black">
                          {email}
                        </p>
                      </div>

                      <div className="mt-4">
                        <label className="text-[7px] font-black tracking-[0.11em] text-[#8F8579]">
                          6-DIGIT OTP
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={registerOtp}
                          onChange={(e) =>
                            setRegisterOtp(
                              e.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  6
                                )
                            )
                          }
                          placeholder="000000"
                          className={otpInputClass}
                        />
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          !isValidOtp(
                            registerOtp
                          )
                        }
                        onClick={
                          handleCompleteRegistration
                        }
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#AAA095]"
                      >
                        {loading
                          ? "CREATING ACCOUNT..."
                          : "VERIFY & CREATE ACCOUNT"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          registerResendTimer >
                            0
                        }
                        onClick={
                          handleSendRegisterOtp
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 text-[7.5px] font-black text-[#B87700] disabled:text-[#AAA095]"
                      >
                        <RefreshCw
                          size={13}
                        />

                        {registerResendTimer > 0
                          ? `RESEND IN ${registerResendTimer}s`
                          : "RESEND OTP"}
                      </button>

                      <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-[#DCEAD8] bg-[#F5FBF3] p-3">
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-[#4E854A]"
                        />

                        <p className="text-[7px] leading-[1.6] text-[#5D755A]">
                          Your Driver account is created only after successful OTP verification.
                        </p>
                      </div>
                    </StepFrame>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="px-2 pt-5 text-center">
            <p className="text-[6.5px] leading-[1.6] text-[#AAA095]">
              ASAN Captain • Secure Driver Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP FRAME
========================================================= */

function StepFrame({
  eyebrow,
  title,
  description,
  back,
  children,
}) {
  return (
    <div>
      {back && (
        <button
          type="button"
          onClick={back}
          className="mb-5 flex items-center gap-1.5 text-[7px] font-black text-[#8C8276]"
        >
          <ArrowLeft
            size={13}
          />
          BACK
        </button>
      )}

      <div className="mb-6">
        <p className="text-[7px] font-black tracking-[0.15em] text-[#B87700]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-[21px] font-black tracking-[-0.025em] text-black">
          {title}
        </h2>

        <p className="mt-2 max-w-[330px] text-[8.5px] leading-[1.7] text-[#8C8276]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   FIELD LABEL
========================================================= */

function FieldLabel({
  label,
  children,
}) {
  return (
    <div className="mb-4">
      <label className="text-[7px] font-black tracking-[0.11em] text-[#8F8579]">
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   CONTINUE BUTTON
========================================================= */

function ContinueButton({
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#AAA095]"
    >
      CONTINUE
    </button>
  );
}

/* =========================================================
   UPLOAD FIELD
========================================================= */

function UploadField({
  title,
  file,
  inputRef,
  setFile,
  circular = false,
  wide = false,
}) {
  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(
        url
      );
    };
  }, [file]);

  return (
    <div
      className={
        wide
          ? "w-full"
          : ""
      }
    >
      <input
        type="file"
        hidden
        accept="image/*"
        ref={inputRef}
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ||
              null
          )
        }
      />

      <button
        type="button"
        onClick={() =>
          inputRef.current?.click()
        }
        className="flex min-h-[118px] w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-[#DFB955] bg-[#FFF9EE] px-3 py-4 text-center transition active:scale-[0.99]"
      >
        {file ? (
          <>
            {previewUrl && (
              <img
                src={previewUrl}
                alt={title}
                className={
                  circular
                    ? "h-20 w-20 rounded-full object-cover"
                    : "h-16 w-16 rounded-[12px] object-cover"
                }
              />
            )}

            <p className="mt-2 max-w-full break-all text-[6.5px] font-black text-[#4E854A]">
              {file.name}
            </p>

            <p className="mt-1 text-[6px] text-[#A39A90]">
              Tap to replace
            </p>
          </>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FFF0C5]">
              <CheckCircle2
                size={14}
                className="text-[#A97000]"
              />
            </div>

            <p className="mt-2 text-[7px] font-black text-black">
              {title}
            </p>

            <p className="mt-1 text-[6px] text-[#A39A90]">
              Tap to upload
            </p>
          </>
        )}
      </button>
    </div>
  );
}

/* =========================================================
   REVIEW ITEM
========================================================= */

function ReviewItem({
  label,
  value,
}) {
  return (
    <div className="rounded-[14px] border border-[#EEE4D5] bg-[#FFF9EE] px-3.5 py-3">
      <p className="text-[6px] font-black tracking-[0.1em] text-[#A0968A]">
        {label.toUpperCase()}
      </p>

      <p className="mt-1 break-words text-[8px] font-black leading-[1.5] text-black">
        {value || "—"}
      </p>
    </div>
  );
}

export default DriverLogin;
