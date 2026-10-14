import {
  useEffect,
  useRef,
  useState,
  Children,
  cloneElement,
  isValidElement,
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
import { registrationErrors as getRegistrationErrors, uploadError, validOtp, normalizeCredential } from "../utils/driverRegistrationValidation";

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

  const [reviewAccess, setReviewAccess] = useState(false);

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

  const [attemptedStep, setAttemptedStep] = useState(0);
  const [registrationServerError, setRegistrationServerError] = useState("");
  const registrationErrors = getRegistrationErrors({ name, phone, email, licenseNumber, vehicleNumber, vehicleType, vehicleModel });
  const isValidName = () => !registrationErrors.name;
  const isValidPhone = () => !registrationErrors.phone;
  const isValidOtp = validOtp;
  const isValidLicenseNumber = () => !registrationErrors.licenseNumber;
  const isValidVehicleNumber = () => !registrationErrors.vehicleNumber;
  const isValidVehicleType = () => !registrationErrors.vehicleType && !registrationErrors.vehicleModel;
  const uploadLabels = {"licenseFront": "License front", "licenseBack": "License back", "rcFront": "RC front", "rcBack": "RC back", "insurance": "Insurance certificate", "idFront": "Identity document front", "idBack": "Identity document back"};
  const requiredUploads = { licenseFront, licenseBack, rcFront, rcBack, insurance: insuranceFile, idFront, idBack, profilePhoto };
  const stepErrors = {
    1: [registrationErrors.name, registrationErrors.phone, registrationErrors.email],
    2: [!address.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude) ? "Select your home location on the map." : ""],
    3: [registrationErrors.licenseNumber, registrationErrors.vehicleNumber, registrationErrors.vehicleType, registrationErrors.vehicleModel, ...["licenseFront", "licenseBack", "rcFront", "rcBack", "insurance"].map((key) => uploadError(requiredUploads[key]) ? `${uploadLabels[key]}: ${uploadError(requiredUploads[key])}` : "")],
    4: [!selectedId ? "Select your identity document type." : "", ...["idFront", "idBack"].map((key) => uploadError(requiredUploads[key]) ? `${uploadLabels[key]}: ${uploadError(requiredUploads[key])}` : "")],
    6: [uploadError(profilePhoto)],
    7: [!validOtp(registerOtp) ? "Enter the 6-digit verification code using numbers only." : ""],
  };
  const continueSignup = (step) => {
    setAttemptedStep(step);
    setRegistrationServerError("");
    if (!(stepErrors[step] || []).some(Boolean)) setSignupStep(step + 1);
  };

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

        setReviewAccess(res.data?.reviewAccess === true);
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
          res.data?.message || "OTP sent to your email"
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
      setAttemptedStep(6);
      setRegistrationServerError("");
      if ((stepErrors[6] || []).some(Boolean)) return;

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
        setRegistrationServerError(error?.response?.data?.message || "Unable to submit. Please try again.");
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
      setAttemptedStep(7);
      setRegistrationServerError("");
      if ((stepErrors[7] || []).some(Boolean)) return;

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
        setRegistrationServerError(error?.response?.data?.message || "Unable to submit. Please try again.");
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
    "mt-2 h-[54px] w-full rounded-[15px] border border-[#E8DED0] bg-white px-4 text-base font-semibold text-black outline-none transition placeholder:text-[#B3AAA0] focus:border-[#D9A534]";

  const otpInputClass =
    "mt-3 h-[62px] w-full rounded-[16px] border border-[#E8DED0] bg-white px-4 text-center text-[25px] font-black tracking-[0.18em] text-black outline-none transition placeholder:text-[#D0C8BE] focus:border-[#D9A534]";

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

          <header className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xl font-black tracking-[-0.025em] text-black">
                ASAN Captain
              </p>

              <p className="mt-0.5 text-xs font-bold tracking-[0.15em] text-[#B87700]">
                DRIVER EXPERIENCE
              </p>
            </div>

            <div className="rounded-full border border-[#EED69B] bg-[#FFF6DB] px-3 py-1.5">
              <p className="text-xs font-black tracking-[0.13em] text-[#956400]">
                SECURE ACCESS
              </p>
            </div>
          </header>

          {/* =================================================
              HERO
          ================================================= */}

          <section className="px-1 pb-5 pt-9">
            <p className="text-xs font-black tracking-[0.18em] text-[#B87700]">
              YOUR DRIVER WORKSPACE
            </p>

            <h1 className="mt-3 max-w-[350px] text-[clamp(1.75rem,7vw,2.25rem)] font-black leading-[1.15] tracking-[-0.045em] text-black">
              Everything you need,
              <span className="text-[#B87700]"> before the first pickup.</span>
            </h1>

            <p className="mt-3 max-w-[360px] text-sm leading-[1.75] text-[#8C8276]">
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
                  className="rounded-full border border-[#EEE1CB] bg-[#FFFDF8] px-3 py-1.5 text-xs font-bold text-[#8C8276]"
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
                  className={`h-[43px] rounded-[13px] text-sm font-black transition ${
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
                  className={`h-[43px] rounded-[13px] text-sm font-black transition ${
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
                          <p className="text-xs font-black tracking-[0.15em] text-[#B87700]">
                            WELCOME BACK
                          </p>

                          <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-black">
                            Sign in to your duty.
                          </h2>

                          <p className="mt-2 max-w-[315px] text-sm leading-[1.7] text-[#8C8276]">
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
                        <label className="text-xs font-black tracking-[0.11em] text-[#8F8579]">
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

                        <p className="mt-2 text-xs leading-[1.5] text-[#756B60]">
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
                        className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[15px] bg-[#FFB000] text-sm font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#756B60]"
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

                        <p className="text-xs leading-[1.55] text-[#8C8276]">
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
                        className="flex items-center gap-1.5 text-xs font-black text-[#8C8276]"
                      >
                        <ArrowLeft
                          size={13}
                        />
                        CHANGE EMAIL
                      </button>

                      <div className="mt-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black tracking-[0.15em] text-[#B87700]">
                            VERIFY ACCESS
                          </p>

                          <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-black">
                            {reviewAccess ? "Enter your review code." : "Check your inbox."}
                          </h2>

                          <p className="mt-2 text-sm leading-[1.7] text-[#8C8276]">
                            {reviewAccess ? "Use the reusable 6-digit code provided in Play Console for" : "Enter the 6-digit OTP sent to"}
                          </p>

                          <p className="mt-1 max-w-[270px] break-all text-sm font-black text-black">
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
                        <label className="text-xs font-black tracking-[0.11em] text-[#8F8579]">
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
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-sm font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#756B60]"
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
                        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-black text-[#B87700] disabled:text-[#756B60]"
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
                        <p className="text-xs font-black tracking-[0.15em] text-[#B87700]">
                          CAPTAIN ONBOARDING
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#8C8276]">
                          Step {signupStep} of 7
                        </p>
                      </div>

                      <p className="text-xs font-black text-[#B87700]">
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

                  {registrationServerError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{registrationServerError}</p>}
                  {attemptedStep === signupStep && (stepErrors[signupStep] || []).some(Boolean) && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"><p className="font-bold">Please correct these details:</p><ul className="mt-1 list-disc pl-5">{(stepErrors[signupStep] || []).filter(Boolean).map((message) => <li key={message}>{message}</li>)}</ul></div>}
                  {/* STEP 1 */}

                  {signupStep === 1 && (
                    <StepFrame
                      eyebrow="PERSONAL DETAILS"
                      title="Start with the basics."
                      description="Tell us who you are. Your email becomes your secure OTP login identity."
                    >
                      <FieldLabel label="FULL NAME" error={registrationErrors.name} showError={attemptedStep === 1}>
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

                      <FieldLabel label="PHONE NUMBER" error={registrationErrors.phone} showError={attemptedStep === 1}>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </FieldLabel>

                      <FieldLabel label="EMAIL ADDRESS" error={registrationErrors.email} showError={attemptedStep === 1}>
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

                        <p className="mt-2 text-xs text-[#756B60]">
                          This email will be used for future OTP sign-ins.
                        </p>
                      </FieldLabel>

                      <ContinueButton disabled={loading} onClick={() => continueSignup(1)}
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
                          <p className="text-xs font-black tracking-[0.1em] text-[#4E854A]">
                            SELECTED LOCATION
                          </p>

                          <p className="mt-2 text-sm leading-[1.6] text-[#6F7E6D]">
                            {address}
                          </p>
                        </div>
                      )}

                      <ContinueButton disabled={loading} onClick={() => continueSignup(2)}
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
                        <UploadField showMissing={attemptedStep === signupStep}
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

                        <UploadField showMissing={attemptedStep === signupStep}
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

                      <FieldLabel label="LICENSE NUMBER" error={registrationErrors.licenseNumber} showError={attemptedStep === 3}>
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
                        <UploadField showMissing={attemptedStep === signupStep}
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

                        <UploadField showMissing={attemptedStep === signupStep}
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

                      <FieldLabel label="VEHICLE NUMBER" error={registrationErrors.vehicleNumber} showError={attemptedStep === 3}>
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

                      <FieldLabel label="VEHICLE TYPE" error={registrationErrors.vehicleType} showError={attemptedStep === 3}>
                        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={inputClass}>
                          <option value="">Select vehicle type</option><option value="Auto">Auto</option><option value="Van">Van</option>
                        </select>
                      </FieldLabel>

                      <FieldLabel label="VEHICLE MODEL" error={registrationErrors.vehicleModel} showError={attemptedStep === 3}>
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
                        <UploadField showMissing={attemptedStep === signupStep}
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

                      <ContinueButton disabled={loading} onClick={() => continueSignup(3)}
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
                      <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2">
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
                            className={`min-h-[46px] rounded-[14px] border px-2 text-sm font-black transition ${
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
                        <UploadField showMissing={attemptedStep === signupStep}
                          title="ID Front"
                          file={idFront}
                          inputRef={
                            idFrontRef
                          }
                          setFile={
                            setIdFront
                          }
                        />

                        <UploadField showMissing={attemptedStep === signupStep}
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

                      <ContinueButton disabled={loading} onClick={() => continueSignup(4)}
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
                      <UploadField showMissing={attemptedStep === signupStep}
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
                          loading
                        }
                        onClick={
                          handleSendRegisterOtp
                        }
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-sm font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#756B60]"
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
                        <p className="text-xs font-black tracking-[0.1em] text-[#A0968A]">
                          OTP SENT TO
                        </p>

                        <p className="mt-1 break-all text-sm font-black text-black">
                          {email}
                        </p>
                      </div>

                      <FieldLabel label="6-DIGIT OTP" error={!validOtp(registerOtp) ? "Enter the 6-digit verification code using numbers only." : ""} showError={attemptedStep === 7}>

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
                      </FieldLabel>

                      <button
                        type="button"
                        disabled={
                          loading
                        }
                        onClick={
                          handleCompleteRegistration
                        }
                        className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-sm font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#756B60]"
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
                        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-black text-[#B87700] disabled:text-[#756B60]"
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

                        <p className="text-xs leading-[1.6] text-[#5D755A]">
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
            <p className="text-xs leading-[1.6] text-[#756B60]">
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
          className="mb-5 flex items-center gap-1.5 text-xs font-black text-[#8C8276]"
        >
          <ArrowLeft
            size={13}
          />
          BACK
        </button>
      )}

      <div className="mb-6">
        <p className="text-xs font-black tracking-[0.15em] text-[#B87700]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-black">
          {title}
        </h2>

        <p className="mt-2 max-w-[330px] text-sm leading-[1.7] text-[#8C8276]">
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

function FieldLabel({ label, children, error, showError = false }) {
  const [touched, setTouched] = useState(false);
  const visibleError = (touched || showError) && error;
  const id = `signup-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return <div className="mb-4" onBlur={() => setTouched(true)}>
    <label htmlFor={id} className="text-xs font-black tracking-[0.11em] text-[#8F8579]">{label}</label>
    {Children.map(children, (child) => isValidElement(child) && ["input", "select"].includes(child.type) ? cloneElement(child, { id, "aria-invalid": Boolean(visibleError), "aria-describedby": visibleError ? `${id}-error` : undefined, className: `${child.props.className || ""} ${visibleError ? "!border-red-500" : ""}` }) : child)}
    {visibleError && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
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
      className="mt-5 h-[52px] w-full rounded-[15px] bg-[#FFB000] text-sm font-black text-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E7E1D7] disabled:text-[#756B60]"
    >
      CONTINUE
    </button>
  );
}

/* =========================================================
   UPLOAD FIELD
========================================================= */

function UploadField({
  showMissing = false,
  title,
  file,
  inputRef,
  setFile,
  circular = false,
  wide = false,
}) {
  const [fileError, setFileError] = useState("");
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
        accept="image/jpeg,image/png,image/webp"
        ref={inputRef}
        onChange={(e) => {
          const next = e.target.files?.[0]; if (!next) return;
          const error = uploadError(next); setFileError(error);
          if (!error) setFile(next);
          e.target.value = "";
        }}
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

            <p className="mt-2 max-w-full break-all text-xs font-black text-[#4E854A]">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-[#756B60]">
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

            <p className="mt-2 text-xs font-black text-black">
              {title}
            </p>

            <p className="mt-1 text-xs text-[#756B60]">
              Tap to upload
            </p>
          </>
        )}
      </button>
      {(fileError || (showMissing && uploadError(file))) && <p role="alert" className="mt-2 text-sm text-red-700">{fileError || uploadError(file)}</p>}
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
      <p className="text-xs font-black tracking-[0.1em] text-[#A0968A]">
        {label.toUpperCase()}
      </p>

      <p className="mt-1 break-words text-sm font-black leading-[1.5] text-black">
        {value || "—"}
      </p>
    </div>
  );
}

export default DriverLogin;
