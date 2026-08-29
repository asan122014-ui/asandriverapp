import {
  Car,
  Mail,
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Home,
  Users,
  User,
  Clock,
  Pencil,
  Phone,
  IdCard,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Navigation,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

import axios from "../utils/axiosInstance";

/* =========================================================
   GOOGLE MAP
========================================================= */

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

/* =========================================================
   EMPTY OTP
========================================================= */

const createEmptyOtp = () => [
  "",
  "",
  "",
  "",
  "",
  "",
];

/* =========================================================
   PROFILE
========================================================= */

function Profile() {
  const navigate = useNavigate();

  /* =======================================================
     PROFILE STATE
  ======================================================= */

  const [profile, setProfile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      latitude: null,
      longitude: null,
      driverId: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [editMode, setEditMode] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    showLogoutConfirm,
    setShowLogoutConfirm,
  ] = useState(false);

  /* =======================================================
     EMAIL OTP STATE
  ======================================================= */

  const [
    showEmailOtp,
    setShowEmailOtp,
  ] = useState(false);

  const [
    pendingEmail,
    setPendingEmail,
  ] = useState("");

  const [otp, setOtp] =
    useState(createEmptyOtp());

  const [
    sendingOtp,
    setSendingOtp,
  ] = useState(false);

  const [
    verifyingOtp,
    setVerifyingOtp,
  ] = useState(false);

  const [
    otpError,
    setOtpError,
  ] = useState("");

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(0);

  const otpRefs = useRef([]);

  /* =======================================================
     MAP STATE
  ======================================================= */

  const [
    showMapPicker,
    setShowMapPicker,
  ] = useState(false);

  const [
    mapLocation,
    setMapLocation,
  ] = useState(null);

  const [
    mapAddress,
    setMapAddress,
  ] = useState("");

  const [
    locating,
    setLocating,
  ] = useState(false);

  const [
    geocoding,
    setGeocoding,
  ] = useState(false);

  const [
    mapError,
    setMapError,
  ] = useState("");

  const mapRef = useRef(null);

  /* =======================================================
     LOCAL DRIVER
  ======================================================= */

  const getLocalDriver = () => {
    try {
      const stored =
        localStorage.getItem(
          "driver"
        );

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error(
        "Invalid local Driver data:",
        error
      );

      return null;
    }
  };

  /* =======================================================
     SYNC FORM
  ======================================================= */

  const syncForm = (data) => {
    if (!data) {
      return;
    }

    const latitude =
      data.latitude !== undefined &&
      data.latitude !== null &&
      data.latitude !== ""
        ? Number(data.latitude)
        : null;

    const longitude =
      data.longitude !== undefined &&
      data.longitude !== null &&
      data.longitude !== ""
        ? Number(data.longitude)
        : null;

    setFormData({
      name:
        data.name || "",

      email:
        data.email || "",

      phone:
        data.phone ||
        data.phoneNumber ||
        "",

      address:
        data.address || "",

      latitude:
        Number.isFinite(latitude)
          ? latitude
          : null,

      longitude:
        Number.isFinite(longitude)
          ? longitude
          : null,

      driverId:
        data.driverId || "",
    });

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      setMapLocation({
        lat: latitude,
        lng: longitude,
      });
    } else {
      setMapLocation(null);
    }

    setMapAddress(
      data.address || ""
    );
  };

  /* =======================================================
     FETCH PROFILE
  ======================================================= */

  const fetchProfile =
    async (
      showLoader = true
    ) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const driver =
          getLocalDriver();

        if (
          !driver?.driverId
        ) {
          setError(
            "Driver session expired."
          );

          return null;
        }

        const response =
          await axios.get(
            `/driver/profile/${driver.driverId}`
          );

        const data =
          response?.data?.data;

        if (!data) {
          setError(
            "Driver profile not found."
          );

          return null;
        }

        setProfile(data);
        syncForm(data);

        return data;
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );

        setError(
          error?.response?.data
            ?.message ||
            "Unable to load profile."
        );

        return null;
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =======================================================
     INITIALS
  ======================================================= */

  const getInitials = () => {
    if (!profile?.name) {
      return "DR";
    }

    return profile.name
      .split(" ")
      .filter(Boolean)
      .map(
        (item) =>
          item.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

      setError("");
      setSuccess("");
    };

  /* =======================================================
     OPEN EDIT MODE
  ======================================================= */

  const openEditMode = () => {
    if (!profile) {
      return;
    }

    syncForm(profile);

    setError("");
    setSuccess("");

    setEditMode(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CLOSE EDIT MODE

     IMPORTANT:
     No window.history.back()
     No pushState()
     No history refs.

     This directly switches React back
     to the normal Profile screen.
  ======================================================= */

  const closeEditMode = () => {
    console.log(
      "Personal Information back clicked"
    );

    /*
      Close any popup first.
    */

    setShowMapPicker(false);
    setShowEmailOtp(false);

    /*
      Reset OTP.
    */

    setPendingEmail("");
    setOtp(createEmptyOtp());
    setOtpError("");
    setResendSeconds(0);

    /*
      Reset map temporary state.
    */

    setMapError("");
    setLocating(false);
    setGeocoding(false);

    mapRef.current = null;

    /*
      Restore the values currently
      stored in MongoDB/profile.
    */

    if (profile) {
      syncForm(profile);
    }

    setError("");
    setSuccess("");

    /*
      THIS IS THE ACTUAL BACK ACTION.
    */

    setEditMode(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     GMAIL VALIDATION
  ======================================================= */

  const isValidGmail =
    (email) => {
      const normalized =
        String(
          email || ""
        )
          .trim()
          .toLowerCase();

      return /^[a-z0-9._%+-]+@gmail\.com$/i.test(
        normalized
      );
    };

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {
    if (
      !formData.name.trim()
    ) {
      return "Full name is required.";
    }

    if (
      !formData.email.trim()
    ) {
      return "Email address is required.";
    }

    if (
      !isValidGmail(
        formData.email
      )
    ) {
      return "Only Gmail addresses ending with @gmail.com are allowed.";
    }

    if (
      !formData.address.trim()
    ) {
      return "Home address is required.";
    }

    /*
      Important:
      Number(null) becomes 0.

      So check null first.
    */

    if (
      formData.latitude ===
        null ||
      formData.latitude ===
        undefined ||
      formData.longitude ===
        null ||
      formData.longitude ===
        undefined
    ) {
      return "Please select your home location from the map.";
    }

    const latitude =
      Number(
        formData.latitude
      );

    const longitude =
      Number(
        formData.longitude
      );

    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      )
    ) {
      return "Please select a valid home location.";
    }

    if (
      latitude < -90 ||
      latitude > 90
    ) {
      return "Invalid latitude.";
    }

    if (
      longitude < -180 ||
      longitude > 180
    ) {
      return "Invalid longitude.";
    }

    return "";
  };

  /* =======================================================
     UPDATE LOCAL STORAGE
  ======================================================= */

  const syncLocalDriver =
    (updatedProfile) => {
      if (
        !updatedProfile
      ) {
        return;
      }

      const localDriver =
        getLocalDriver();

      if (!localDriver) {
        return;
      }

      localStorage.setItem(
        "driver",
        JSON.stringify({
          ...localDriver,
          ...updatedProfile,
        })
      );
    };

  /* =======================================================
     UPDATE NORMAL FIELDS

     Sends:
     name
     address
     latitude
     longitude

     Backend persists these in MongoDB.
  ======================================================= */

  const updateNormalFields =
    async () => {
      const driver =
        getLocalDriver();

      if (
        !driver?.driverId
      ) {
        throw new Error(
          "Driver session expired."
        );
      }

      if (
        formData.latitude ===
          null ||
        formData.latitude ===
          undefined ||
        formData.longitude ===
          null ||
        formData.longitude ===
          undefined
      ) {
        throw new Error(
          "Please select your home location."
        );
      }

      const latitude =
        Number(
          formData.latitude
        );

      const longitude =
        Number(
          formData.longitude
        );

      if (
        !Number.isFinite(
          latitude
        ) ||
        !Number.isFinite(
          longitude
        )
      ) {
        throw new Error(
          "Please select a valid home location."
        );
      }

      await axios.put(
        "/driver/update",
        {
          driverId:
            driver.driverId,

          name:
            formData.name.trim(),

          address:
            formData.address.trim(),

          latitude,

          longitude,
        }
      );

      return await fetchProfile(
        false
      );
    };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleUpdate =
    async () => {
      try {
        const validationError =
          validateForm();

        if (
          validationError
        ) {
          setError(
            validationError
          );

          return;
        }

        const newEmail =
          formData.email
            .trim()
            .toLowerCase();

        const currentEmail =
          String(
            profile?.email ||
              ""
          )
            .trim()
            .toLowerCase();

        /*
          EMAIL CHANGED

          Don't update it normally.

          First send OTP.
        */

        if (
          newEmail !==
          currentEmail
        ) {
          await sendEmailOtp(
            newEmail
          );

          return;
        }

        /*
          Email unchanged.

          Save normal profile data.
        */

        setSaving(true);

        setError("");
        setSuccess("");

        const updatedProfile =
          await updateNormalFields();

        syncLocalDriver(
          updatedProfile
        );

        if (
          updatedProfile
        ) {
          setProfile(
            updatedProfile
          );

          syncForm(
            updatedProfile
          );
        }

        setSuccess(
          "Profile updated successfully."
        );

        window.setTimeout(
          () => {
            setSuccess("");

            /*
              Directly return to Profile.
            */

            setEditMode(false);

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          },
          700
        );
      } catch (error) {
        console.error(
          "Profile update failed:",
          error?.response?.data ||
            error
        );

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     SEND EMAIL OTP
  ======================================================= */

  const sendEmailOtp =
    async (email) => {
      try {
        const normalized =
          String(
            email || ""
          )
            .trim()
            .toLowerCase();

        if (
          !isValidGmail(
            normalized
          )
        ) {
          setError(
            "Only Gmail addresses ending with @gmail.com are allowed."
          );

          return;
        }

        setSendingOtp(true);

        setOtpError("");
        setError("");

        await axios.post(
          "/driver/email/send-otp",
          {
            email:
              normalized,
          }
        );

        setPendingEmail(
          normalized
        );

        setOtp(
          createEmptyOtp()
        );

        setResendSeconds(
          60
        );

        setShowEmailOtp(
          true
        );

        window.setTimeout(
          () => {
            otpRefs
              .current?.[0]
              ?.focus();
          },
          150
        );
      } catch (error) {
        console.error(
          "Send Driver email OTP error:",
          error?.response?.data ||
            error
        );

        setError(
          error?.response?.data
            ?.message ||
            "Unable to send verification OTP."
        );
      } finally {
        setSendingOtp(false);
      }
    };

  /* =======================================================
     OTP RESEND TIMER
  ======================================================= */

  useEffect(() => {
    if (
      resendSeconds <= 0
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(
        () => {
          setResendSeconds(
            (previous) =>
              Math.max(
                0,
                previous - 1
              )
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [resendSeconds]);

  /* =======================================================
     OTP CHANGE
  ======================================================= */

  const handleOtpChange =
    (
      index,
      value
    ) => {
      const digit =
        String(
          value || ""
        )
          .replace(
            /\D/g,
            ""
          )
          .slice(-1);

      const updated = [
        ...otp,
      ];

      updated[index] =
        digit;

      setOtp(updated);

      setOtpError("");

      if (
        digit &&
        index < 5
      ) {
        otpRefs.current?.[
          index + 1
        ]?.focus();
      }
    };

  /* =======================================================
     OTP KEYBOARD
  ======================================================= */

  const handleOtpKeyDown =
    (
      index,
      event
    ) => {
      if (
        event.key ===
          "Backspace" &&
        !otp[index] &&
        index > 0
      ) {
        otpRefs.current?.[
          index - 1
        ]?.focus();
      }

      if (
        event.key ===
          "ArrowLeft" &&
        index > 0
      ) {
        otpRefs.current?.[
          index - 1
        ]?.focus();
      }

      if (
        event.key ===
          "ArrowRight" &&
        index < 5
      ) {
        otpRefs.current?.[
          index + 1
        ]?.focus();
      }
    };

  /* =======================================================
     OTP PASTE
  ======================================================= */

  const handleOtpPaste =
    (event) => {
      event.preventDefault();

      const pasted =
        event.clipboardData
          .getData("text")
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            6
          );

      if (!pasted) {
        return;
      }

      const updated =
        createEmptyOtp();

      pasted
        .split("")
        .forEach(
          (
            digit,
            index
          ) => {
            updated[index] =
              digit;
          }
        );

      setOtp(updated);

      setOtpError("");

      const focusIndex =
        Math.min(
          pasted.length,
          5
        );

      otpRefs.current?.[
        focusIndex
      ]?.focus();
    };

  /* =======================================================
     VERIFY EMAIL OTP
  ======================================================= */

  const verifyEmailOtp =
    async () => {
      try {
        const otpValue =
          otp.join("");

        if (
          !/^\d{6}$/.test(
            otpValue
          )
        ) {
          setOtpError(
            "Enter the complete 6-digit OTP."
          );

          return;
        }

        if (
          !pendingEmail
        ) {
          setOtpError(
            "Email verification session expired. Please request another OTP."
          );

          return;
        }

        setVerifyingOtp(true);

        setOtpError("");

        /*
          Backend must:

          1. Verify OTP
          2. Update Driver.email
          3. Store new email in MongoDB
          4. Delete/expire OTP
        */

        await axios.post(
          "/driver/email/verify-otp",
          {
            email:
              pendingEmail,

            otp:
              otpValue,
          }
        );

        /*
          Now save the other fields.
        */

        await updateNormalFields();

        const updatedProfile =
          await fetchProfile(
            false
          );

        syncLocalDriver(
          updatedProfile
        );

        if (
          updatedProfile
        ) {
          setProfile(
            updatedProfile
          );

          syncForm(
            updatedProfile
          );
        }

        setShowEmailOtp(
          false
        );

        setPendingEmail("");

        setOtp(
          createEmptyOtp()
        );

        setOtpError("");

        setResendSeconds(
          0
        );

        setSuccess(
          "Email verified and profile updated successfully."
        );

        window.setTimeout(
          () => {
            setSuccess("");

            /*
              Direct return.
            */

            setEditMode(false);

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          },
          700
        );
      } catch (error) {
        console.error(
          "Email OTP verification error:",
          error?.response?.data ||
            error
        );

        setOtpError(
          error?.response?.data
            ?.message ||
            "Invalid or expired OTP."
        );
      } finally {
        setVerifyingOtp(false);
      }
    };

  /* =======================================================
     RESEND EMAIL OTP
  ======================================================= */

  const resendEmailOtp =
    async () => {
      if (
        resendSeconds > 0 ||
        sendingOtp ||
        verifyingOtp
      ) {
        return;
      }

      if (
        !pendingEmail
      ) {
        setOtpError(
          "Email verification session expired."
        );

        return;
      }

      try {
        setSendingOtp(true);

        setOtpError("");

        await axios.post(
          "/driver/email/send-otp",
          {
            email:
              pendingEmail,
          }
        );

        setOtp(
          createEmptyOtp()
        );

        setResendSeconds(
          60
        );

        window.setTimeout(
          () => {
            otpRefs.current?.[0]
              ?.focus();
          },
          100
        );
      } catch (error) {
        console.error(
          "Resend OTP error:",
          error?.response?.data ||
            error
        );

        setOtpError(
          error?.response?.data
            ?.message ||
            "Unable to resend OTP."
        );
      } finally {
        setSendingOtp(false);
      }
    };

  /* =======================================================
     CLOSE EMAIL OTP
  ======================================================= */

  const closeEmailOtp = () => {
    if (
      verifyingOtp
    ) {
      return;
    }

    /*
      Restore current MongoDB email.
    */

    setFormData(
      (previous) => ({
        ...previous,

        email:
          profile?.email ||
          "",
      })
    );

    setShowEmailOtp(false);

    setPendingEmail("");

    setOtp(
      createEmptyOtp()
    );

    setOtpError("");

    setResendSeconds(
      0
    );
  };

  /* =======================================================
     REVERSE GEOCODING

     Uses Google Maps JavaScript Geocoder.

     No REST URL.
     No markdown corruption.
  ======================================================= */

  const reverseGeocode =
    async (
      lat,
      lng
    ) => {
      try {
        if (
          !window.google?.maps
            ?.Geocoder
        ) {
          console.error(
            "Google Maps Geocoder is not available."
          );

          return "";
        }

        setGeocoding(true);

        const geocoder =
          new window.google.maps.Geocoder();

        const result =
          await new Promise(
            (
              resolve,
              reject
            ) => {
              geocoder.geocode(
                {
                  location: {
                    lat:
                      Number(lat),

                    lng:
                      Number(lng),
                  },
                },
                (
                  results,
                  status
                ) => {
                  if (
                    status ===
                      "OK" &&
                    results?.length
                  ) {
                    resolve(
                      results[0]
                        .formatted_address
                    );

                    return;
                  }

                  if (
                    status ===
                    "ZERO_RESULTS"
                  ) {
                    resolve("");

                    return;
                  }

                  reject(
                    new Error(
                      `Geocoder failed: ${status}`
                    )
                  );
                }
              );
            }
          );

        return result || "";
      } catch (error) {
        console.error(
          "Reverse geocoding error:",
          error
        );

        return "";
      } finally {
        setGeocoding(false);
      }
    };

  /* =======================================================
     BROWSER CURRENT LOCATION
  ======================================================= */

  const getBrowserLocation =
    () =>
      new Promise(
        (
          resolve,
          reject
        ) => {
          if (
            !navigator
              .geolocation
          ) {
            reject(
              new Error(
                "Geolocation is not supported on this device."
              )
            );

            return;
          }

          navigator.geolocation
            .getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy:
                  true,

                timeout:
                  20000,

                maximumAge:
                  0,
              }
            );
        }
      );

  /* =======================================================
     APPLY CURRENT LOCATION
  ======================================================= */

  const applyCurrentPosition =
    async (position) => {
      const lat =
        Number(
          position.coords
            .latitude
        );

      const lng =
        Number(
          position.coords
            .longitude
        );

      if (
        !Number.isFinite(
          lat
        ) ||
        !Number.isFinite(
          lng
        )
      ) {
        throw new Error(
          "Invalid GPS coordinates."
        );
      }

      const location = {
        lat,
        lng,
      };

      setMapLocation(
        location
      );

      setMapError("");

      if (
        mapRef.current
      ) {
        mapRef.current
          .setCenter(
            location
          );

        mapRef.current
          .panTo(
            location
          );

        mapRef.current
          .setZoom(
            17
          );
      }

      const address =
        await reverseGeocode(
          lat,
          lng
        );

      if (address) {
        setMapAddress(
          address
        );
      } else {
        setMapAddress(
          `${lat.toFixed(
            6
          )}, ${lng.toFixed(
            6
          )}`
        );
      }

      return location;
    };

  /* =======================================================
     OPEN MAP

     Current GPS is fetched FIRST.
     Map does not use a random default.
  ======================================================= */

  const openMapPicker =
    async () => {
      setShowMapPicker(
        true
      );

      setLocating(true);

      setMapError("");

      setMapAddress("");

      /*
        Critical:

        Prevent old/random location
        appearing while GPS loads.
      */

      setMapLocation(null);

      mapRef.current =
        null;

      try {
        const position =
          await getBrowserLocation();

        await applyCurrentPosition(
          position
        );
      } catch (locationError) {
        console.error(
          "Current location error:",
          locationError
        );

        /*
          GPS failed.

          Only then use the MongoDB
          saved home coordinates.
        */

        const hasSavedLat =
          formData.latitude !==
            null &&
          formData.latitude !==
            undefined;

        const hasSavedLng =
          formData.longitude !==
            null &&
          formData.longitude !==
            undefined;

        const savedLat =
          hasSavedLat
            ? Number(
                formData.latitude
              )
            : NaN;

        const savedLng =
          hasSavedLng
            ? Number(
                formData.longitude
              )
            : NaN;

        if (
          Number.isFinite(
            savedLat
          ) &&
          Number.isFinite(
            savedLng
          )
        ) {
          setMapLocation({
            lat: savedLat,
            lng: savedLng,
          });

          setMapAddress(
            formData.address ||
              ""
          );

          setMapError(
            "Current GPS location could not be accessed. Showing your previously saved home location."
          );
        } else {
          setMapLocation(
            null
          );

          setMapError(
            "Unable to get your current location. Enable GPS and location permission, then try again."
          );
        }
      } finally {
        setLocating(false);
      }
    };

  /* =======================================================
     CURRENT LOCATION BUTTON
  ======================================================= */

  const useCurrentLocation =
    async () => {
      if (locating) {
        return;
      }

      try {
        setLocating(true);

        setMapError("");

        const position =
          await getBrowserLocation();

        await applyCurrentPosition(
          position
        );
      } catch (error) {
        console.error(
          "Current location error:",
          error
        );

        setMapError(
          "Unable to access your current location. Please enable GPS and location permission."
        );
      } finally {
        setLocating(false);
      }
    };

  /* =======================================================
     MAP CLICK
  ======================================================= */

  const handleMapClick =
    async (event) => {
      if (!event?.latLng) {
        return;
      }

      const lat =
        Number(
          event.latLng.lat()
        );

      const lng =
        Number(
          event.latLng.lng()
        );

      if (
        !Number.isFinite(
          lat
        ) ||
        !Number.isFinite(
          lng
        )
      ) {
        return;
      }

      const location = {
        lat,
        lng,
      };

      setMapLocation(
        location
      );

      setMapError("");

      mapRef.current?.panTo(
        location
      );

      const address =
        await reverseGeocode(
          lat,
          lng
        );

      setMapAddress(
        address ||
          `${lat.toFixed(
            6
          )}, ${lng.toFixed(
            6
          )}`
      );
    };

  /* =======================================================
     MARKER DRAG
  ======================================================= */

  const handleMarkerDragEnd =
    async (event) => {
      if (!event?.latLng) {
        return;
      }

      const lat =
        Number(
          event.latLng.lat()
        );

      const lng =
        Number(
          event.latLng.lng()
        );

      if (
        !Number.isFinite(
          lat
        ) ||
        !Number.isFinite(
          lng
        )
      ) {
        return;
      }

      const location = {
        lat,
        lng,
      };

      setMapLocation(
        location
      );

      setMapError("");

      mapRef.current?.panTo(
        location
      );

      const address =
        await reverseGeocode(
          lat,
          lng
        );

      setMapAddress(
        address ||
          `${lat.toFixed(
            6
          )}, ${lng.toFixed(
            6
          )}`
      );
    };

  /* =======================================================
     MAP LOAD
  ======================================================= */

  const handleMapLoad =
    (map) => {
      mapRef.current =
        map;

      if (
        !mapLocation
      ) {
        return;
      }

      const location = {
        lat:
          Number(
            mapLocation.lat
          ),

        lng:
          Number(
            mapLocation.lng
          ),
      };

      window.setTimeout(
        () => {
          if (
            !mapRef.current
          ) {
            return;
          }

          if (
            window.google?.maps
          ) {
            window.google.maps
              .event.trigger(
                mapRef.current,
                "resize"
              );
          }

          mapRef.current
            .setCenter(
              location
            );

          mapRef.current
            .setZoom(
              17
            );
        },
        100
      );
    };

  /* =======================================================
     USE SELECTED LOCATION
  ======================================================= */

  const confirmMapLocation =
    () => {
      if (!mapLocation) {
        setMapError(
          "Please select a valid location."
        );

        return;
      }

      const lat =
        Number(
          mapLocation.lat
        );

      const lng =
        Number(
          mapLocation.lng
        );

      if (
        !Number.isFinite(
          lat
        ) ||
        !Number.isFinite(
          lng
        )
      ) {
        setMapError(
          "Please select a valid location."
        );

        return;
      }

      if (
        !mapAddress.trim()
      ) {
        setMapError(
          "Please wait while the address is being detected."
        );

        return;
      }

      /*
        Save selection into form.

        MongoDB update occurs when
        Save Changes is pressed.
      */

      setFormData(
        (previous) => ({
          ...previous,

          address:
            mapAddress.trim(),

          latitude:
            lat,

          longitude:
            lng,
        })
      );

      setMapError("");

      setShowMapPicker(
        false
      );

      mapRef.current =
        null;

      setError("");
    };

  /* =======================================================
     CLOSE MAP
  ======================================================= */

  const closeMapPicker = () => {
    setShowMapPicker(
      false
    );

    setLocating(false);

    setGeocoding(false);

    setMapError("");

    mapRef.current =
      null;

    /*
      Restore temporary map selection
      to current form values.
    */

    if (
      formData.latitude !==
        null &&
      formData.longitude !==
        null
    ) {
      const lat =
        Number(
          formData.latitude
        );

      const lng =
        Number(
          formData.longitude
        );

      if (
        Number.isFinite(
          lat
        ) &&
        Number.isFinite(
          lng
        )
      ) {
        setMapLocation({
          lat,
          lng,
        });
      }
    }

    setMapAddress(
      formData.address ||
        ""
    );
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        if (token) {
          await axios.post(
            "/driver-auth/logout"
          );
        }
      } catch (error) {
        console.error(
          "Driver logout error:",
          error?.response?.data ||
            error
        );
      } finally {
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "driver"
        );

        navigate(
          "/DriverLogin",
          {
            replace: true,
          }
        );
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 rounded-full border-[3px] border-[#FFB000] border-t-transparent animate-spin" />

          <p className="mt-4 text-[9px] font-semibold text-[#8C8276]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PROFILE NOT FOUND
  ======================================================= */

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center px-5">
        <div className="w-full max-w-[420px] rounded-[20px] border border-[#EEE3D1] bg-white p-5 text-center">
          <AlertCircle
            size={24}
            className="mx-auto text-[#C85E55]"
          />

          <h2 className="mt-3 text-[13px] font-black text-black">
            Profile unavailable
          </h2>

          <p className="mt-1 text-[8px] text-[#8C8276]">
            {error ||
              "Unable to load Driver profile."}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchProfile()
            }
            className="mt-4 rounded-[12px] bg-[#FFB000] px-5 py-3 text-[8px] font-black text-black"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     EDIT PROFILE VIEW
  ======================================================= */

  if (editMode) {
    return (
      <>
        <div className="min-h-screen bg-[#FFFDF9] flex justify-center">
          <div className="relative min-h-screen w-full max-w-[475px] bg-[#FFFDF9]">

            {/* ===============================================
                HEADER
            =============================================== */}

            <header className="relative overflow-hidden border-b border-[#EEE1CB] bg-[#FFF5D6] px-5 pb-6 pt-5">

              <div className="pointer-events-none absolute -right-[55px] -top-[75px] h-[150px] w-[150px] rounded-full bg-[#FFE6A1]" />

              {/* BACK BUTTON */}

              <div className="relative z-[50] flex justify-end">

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    closeEditMode();
                  }}
                  className="relative z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-[15px] border border-[#E7DCC8] bg-white shadow-sm transition active:scale-95"
                  aria-label="Back to profile"
                >
                  <ArrowLeft
                    size={20}
                    className="pointer-events-none text-black"
                  />
                </button>

              </div>

              <div className="relative z-10 -mt-7">

                <p className="text-[8px] font-black tracking-[0.18em] text-[#B87700]">
                  ACCOUNT DETAILS
                </p>

                <h1 className="mt-2 text-[22px] font-black leading-tight text-black">
                  Personal Information
                </h1>

                <p className="mt-2 text-[8.5px] text-[#877C70]">
                  Update your editable profile information.
                </p>

              </div>

            </header>

            {/* ===============================================
                FORM
            =============================================== */}

            <main className="px-5 pb-7 pt-6">

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-[13px] border border-[#F0D1CC] bg-[#FFF8F6] p-3">

                  <AlertCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-[#C85E55]"
                  />

                  <p className="text-[8px] leading-[1.5] text-[#A64D45]">
                    {error}
                  </p>

                </div>
              )}

              {success && (
                <div className="mb-4 flex items-start gap-2 rounded-[13px] border border-[#DCEAD8] bg-[#F5FBF3] p-3">

                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-[#4E854A]"
                  />

                  <p className="text-[8px] font-bold text-[#4E854A]">
                    {success}
                  </p>

                </div>
              )}

              <ProfileInput
                icon={User}
                label="Full Name"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter full name"
              />

              {/* EMAIL */}

              <ProfileInput
                icon={Mail}
                label="Email Address"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="example@gmail.com"
              />

              <p className="-mt-3 mb-5 text-[6.5px] leading-[1.5] text-[#BAAFA4]">
                Only Gmail addresses ending with @gmail.com are accepted. Changing your email requires OTP verification.
              </p>

              {/* PHONE */}

              <div className="mb-5">

                <label className="mb-2 block text-[8px] font-black text-black">
                  Phone Number
                </label>

                <div className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-[#E8DED0] bg-[#F7F3EC] px-4">

                  <Phone
                    size={17}
                    className="shrink-0 text-[#8C8276]"
                  />

                  <p className="min-w-0 flex-1 truncate text-left text-[9px] font-black text-[#70675E]">
                    {formData.phone ||
                      "Not available"}
                  </p>

                </div>

                <p className="mt-2 text-[6.5px] text-[#BAAFA4]">
                  Phone number cannot currently be changed from the Driver profile.
                </p>

              </div>

              {/* ADDRESS */}

              <div className="mb-5">

                <label className="mb-2 block text-[8px] font-black text-black">
                  Home Address
                </label>

                <button
                  type="button"
                  onClick={
                    openMapPicker
                  }
                  className="flex min-h-[58px] w-full items-center gap-3 rounded-[14px] border border-[#E8DED0] bg-[#FFFDF9] px-4 text-left transition hover:border-[#FFB000]"
                >

                  <MapPin
                    size={17}
                    className="shrink-0 text-black"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="text-[6.5px] font-bold text-[#B87700]">
                      SELECTED LOCATION
                    </p>

                    <p className="mt-1 line-clamp-2 text-[8.5px] font-black leading-[1.5] text-black">
                      {formData.address ||
                        "Tap to select your home address"}
                    </p>

                  </div>

                  <Navigation
                    size={16}
                    className="shrink-0 text-[#A97000]"
                  />

                </button>

                <p className="mt-2 text-[6.5px] text-[#BAAFA4]">
                  Your current GPS position opens first. You can move the marker to select the exact home location.
                </p>

              </div>

              {/* DRIVER ID */}

              <div className="mb-2">

                <label className="mb-2 block text-[8px] font-black text-black">
                  Driver ID
                </label>

                <div className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-[#E8DED0] bg-[#FFFDF9] px-4">

                  <IdCard
                    size={17}
                    className="shrink-0 text-black"
                  />

                  <p className="text-[9px] font-black text-black">
                    {formData.driverId}
                  </p>

                </div>

                <p className="mt-2 text-[6.5px] text-[#BAAFA4]">
                  Driver ID cannot be changed from profile.
                </p>

              </div>

              {/* SAVE */}

              <button
                type="button"
                disabled={
                  saving ||
                  sendingOtp ||
                  verifyingOtp
                }
                onClick={
                  handleUpdate
                }
                className="mt-5 flex h-[53px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#FFB000] text-[10px] font-black text-black shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ||
                sendingOtp ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    {sendingOtp
                      ? "SENDING OTP..."
                      : "SAVING CHANGES..."}
                  </>
                ) : (
                  <>
                    <Save
                      size={17}
                    />

                    Save Changes
                  </>
                )}

              </button>

            </main>

          </div>
        </div>

        {/* ===============================================
            MAP PICKER
        =============================================== */}

        {showMapPicker && (
          <div className="fixed inset-0 z-[300] bg-[#FFFDF9]">

            <div className="mx-auto flex h-[100dvh] w-full max-w-[475px] flex-col bg-[#FFFDF9]">

              <header className="flex shrink-0 items-center justify-between border-b border-[#EEE1CB] bg-[#FFF5D6] px-5 py-5">

                <div>

                  <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
                    HOME LOCATION
                  </p>

                  <h2 className="mt-1 text-[19px] font-black text-black">
                    Select Address
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    closeMapPicker
                  }
                  className="relative z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[13px] border border-[#E7DCC8] bg-white"
                  aria-label="Close map"
                >
                  <X
                    size={18}
                    className="pointer-events-none"
                  />
                </button>

              </header>

              {/* MAP */}

              <div className="relative min-h-0 flex-1 bg-[#EEE8DD]">

                {mapLocation ? (
                  <GoogleMap
                    mapContainerStyle={
                      mapContainerStyle
                    }
                    center={
                      mapLocation
                    }
                    zoom={17}
                    onLoad={
                      handleMapLoad
                    }
                    onUnmount={() => {
                      mapRef.current =
                        null;
                    }}
                    onClick={
                      handleMapClick
                    }
                    options={{
                      mapTypeId:
                        "roadmap",

                      disableDefaultUI:
                        true,

                      streetViewControl:
                        false,

                      mapTypeControl:
                        false,

                      fullscreenControl:
                        false,

                      zoomControl:
                        false,

                      clickableIcons:
                        false,

                      gestureHandling:
                        "greedy",

                      backgroundColor:
                        "#EEE8DD",
                    }}
                  >

                    <Marker
                      position={
                        mapLocation
                      }
                      draggable
                      onDragEnd={
                        handleMarkerDragEnd
                      }
                    />

                  </GoogleMap>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FFF9EE] px-6">

                    <div className="text-center">

                      {locating ? (
                        <>
                          <Loader2
                            size={30}
                            className="mx-auto animate-spin text-[#A97000]"
                          />

                          <p className="mt-4 text-[10px] font-black text-black">
                            Finding your current location...
                          </p>

                          <p className="mx-auto mt-2 max-w-[250px] text-[7px] leading-[1.6] text-[#8C8276]">
                            Please allow location access when your device asks for permission.
                          </p>
                        </>
                      ) : (
                        <>
                          <MapPin
                            size={28}
                            className="mx-auto text-[#A97000]"
                          />

                          <p className="mt-4 text-[10px] font-black text-black">
                            Location unavailable
                          </p>

                          <p className="mx-auto mt-2 max-w-[260px] text-[7px] leading-[1.6] text-[#8C8276]">
                            Enable GPS and location permission, then try again.
                          </p>

                          <button
                            type="button"
                            onClick={
                              useCurrentLocation
                            }
                            className="mt-4 inline-flex h-11 items-center gap-2 rounded-[13px] bg-[#FFB000] px-5 text-[8px] font-black text-black"
                          >
                            <Navigation
                              size={14}
                            />

                            TRY CURRENT LOCATION
                          </button>
                        </>
                      )}

                    </div>

                  </div>
                )}

                {mapLocation && (
                  <button
                    type="button"
                    disabled={
                      locating
                    }
                    onClick={
                      useCurrentLocation
                    }
                    className="absolute right-4 top-4 z-10 flex h-11 items-center gap-2 rounded-[13px] border border-[#E8DED0] bg-white px-4 text-[7px] font-black text-black shadow-lg disabled:opacity-60"
                  >

                    {locating ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Navigation
                        size={15}
                        className="text-[#A97000]"
                      />
                    )}

                    CURRENT LOCATION

                  </button>
                )}

              </div>

              {/* ADDRESS PANEL */}

              <div className="shrink-0 border-t border-[#EEE1CB] bg-white p-4">

                {mapError && (
                  <div className="mb-3 flex items-start gap-2 rounded-[12px] border border-[#F0D1CC] bg-[#FFF8F6] p-3">

                    <AlertCircle
                      size={13}
                      className="mt-0.5 shrink-0 text-[#C85E55]"
                    />

                    <p className="text-[7px] leading-[1.5] text-[#A64D45]">
                      {mapError}
                    </p>

                  </div>
                )}

                <div className="rounded-[14px] border border-[#EEE3D1] bg-[#FFF9EE] p-4">

                  <div className="flex items-start gap-3">

                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#A97000]"
                    />

                    <div className="min-w-0">

                      <p className="text-[6.5px] font-black text-[#B87700]">
                        SELECTED ADDRESS
                      </p>

                      <p className="mt-1 text-[8.5px] font-bold leading-[1.55] text-black">
                        {geocoding
                          ? "Detecting address..."
                          : mapAddress ||
                            (locating
                              ? "Finding your current address..."
                              : "Select a location on the map.")}
                      </p>

                      {mapLocation && (
                        <p className="mt-2 text-[6px] font-medium text-[#91877C]">
                          {Number(
                            mapLocation.lat
                          ).toFixed(
                            6
                          )}
                          ,{" "}
                          {Number(
                            mapLocation.lng
                          ).toFixed(
                            6
                          )}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  disabled={
                    !mapLocation ||
                    geocoding ||
                    locating
                  }
                  onClick={
                    confirmMapLocation
                  }
                  className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#FFB000] text-[9px] font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {geocoding ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={16}
                    />
                  )}

                  USE THIS LOCATION

                </button>

              </div>

            </div>

          </div>
        )}

        {/* ===============================================
            EMAIL OTP MODAL
        =============================================== */}

        {showEmailOtp && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/40 px-5 backdrop-blur-[3px]">

            <div className="w-full max-w-[370px] overflow-hidden rounded-[24px] border border-[#E8D9B1] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">

              <div className="relative bg-[#FFF5D6] px-5 pb-5 pt-6">

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FFE5A0]" />

                <button
                  type="button"
                  disabled={
                    verifyingOtp
                  }
                  onClick={
                    closeEmailOtp
                  }
                  className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#E8DED0] bg-white disabled:opacity-50"
                  aria-label="Close OTP"
                >
                  <X
                    size={16}
                  />
                </button>

                <div className="relative z-10">

                  <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFB000]">

                    <KeyRound
                      size={20}
                    />

                  </div>

                  <p className="mt-4 text-[7px] font-black tracking-[0.15em] text-[#B87700]">
                    EMAIL VERIFICATION
                  </p>

                  <h2 className="mt-1 text-[18px] font-black text-black">
                    Verify New Email
                  </h2>

                  <p className="mt-2 text-[8px] leading-[1.6] text-[#877C70]">
                    Enter the 6-digit verification code sent to:
                  </p>

                  <p className="mt-1 break-all text-[9px] font-black text-[#A97000]">
                    {pendingEmail}
                  </p>

                </div>

              </div>

              <div className="p-5">

                <div className="grid grid-cols-6 gap-2">

                  {otp.map(
                    (
                      digit,
                      index
                    ) => (
                      <input
                        key={
                          index
                        }
                        ref={(
                          element
                        ) => {
                          otpRefs.current[
                            index
                          ] =
                            element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={1}
                        value={
                          digit
                        }
                        disabled={
                          verifyingOtp
                        }
                        onChange={(
                          event
                        ) =>
                          handleOtpChange(
                            index,
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) =>
                          handleOtpKeyDown(
                            index,
                            event
                          )
                        }
                        onPaste={
                          handleOtpPaste
                        }
                        className="h-[50px] min-w-0 rounded-[13px] border border-[#E8D9B1] bg-[#FFFDF9] text-center text-[17px] font-black text-black outline-none transition focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10 disabled:opacity-50"
                      />
                    )
                  )}

                </div>

                {otpError && (
                  <div className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#F0D1CC] bg-[#FFF8F6] p-3">

                    <AlertCircle
                      size={13}
                      className="mt-0.5 shrink-0 text-[#C85E55]"
                    />

                    <p className="text-[7.5px] leading-[1.5] text-[#A64D45]">
                      {otpError}
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    verifyingOtp ||
                    otp.join("")
                      .length !==
                      6
                  }
                  onClick={
                    verifyEmailOtp
                  }
                  className="mt-5 flex h-[51px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#FFB000] text-[9px] font-black text-black disabled:opacity-50"
                >

                  {verifyingOtp ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={16}
                    />
                  )}

                  {verifyingOtp
                    ? "VERIFYING..."
                    : "VERIFY & SAVE EMAIL"}

                </button>

                <button
                  type="button"
                  disabled={
                    sendingOtp ||
                    verifyingOtp ||
                    resendSeconds >
                      0
                  }
                  onClick={
                    resendEmailOtp
                  }
                  className="mt-3 flex h-[43px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#FFF0C5] text-[7.5px] font-black text-[#936200] disabled:opacity-50"
                >

                  {sendingOtp ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <RefreshCw
                      size={14}
                    />
                  )}

                  {resendSeconds >
                  0
                    ? `RESEND IN ${resendSeconds}s`
                    : "RESEND OTP"}

                </button>

              </div>

            </div>

          </div>
        )}

      </>
    );
  }

  /* =======================================================
     PROFILE DATA
  ======================================================= */

  const personalFields = [
    {
      label:
        "Full Name",

      value:
        profile.name,

      icon:
        User,
    },

    {
      label:
        "Phone Number",

      value:
        profile.phone ||
        profile.phoneNumber,

      icon:
        Phone,
    },

    {
      label:
        "Email",

      value:
        profile.email,

      icon:
        Mail,
    },

    {
      label:
        "Address",

      value:
        profile.address,

      icon:
        MapPin,
    },
  ];

  const driverFields = [
    {
      label:
        "Vehicle Type",

      value:
        profile.vehicleType,

      icon:
        Car,
    },

    {
      label:
        "Registration",

      value:
        profile.vehicleNumber,

      icon:
        Car,
    },

    {
      label:
        "License Number",

      value:
        profile.licenseNumber,

      icon:
        Shield,
    },

    {
      label:
        "Driver ID",

      value:
        profile.driverId,

      icon:
        IdCard,
    },
  ];

  const settings = [
    {
      icon:
        Bell,

      label:
        "Notifications",

      description:
        "Duty and trip alerts",

      path:
        "/notifications",
    },

    {
      icon:
        Shield,

      label:
        "Privacy",

      description:
        "Data & privacy",

      path:
        "/privacy-policy",
    },

    {
      icon:
        HelpCircle,

      label:
        "Support",

      description:
        "Get help",

      path:
        "/help-support",
    },
  ];

  /* =======================================================
     NORMAL PROFILE VIEW
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">

      <div className="relative min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE] pb-24">

        {/* BACKGROUND */}

        <div className="pointer-events-none absolute -right-[135px] -top-[155px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/75" />

        <div className="pointer-events-none absolute -left-[190px] top-[520px] h-[280px] w-[280px] rounded-full bg-[#FFF2D1]/45" />

        {/* HEADER */}

        <header className="relative z-10 px-5 pt-5">

          <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
            DRIVER ACCOUNT
          </p>

          <h1 className="mt-1.5 text-[24px] font-black text-black">
            Profile
          </h1>

        </header>

        {/* CONTENT */}

        <main className="relative z-10 mt-5 px-4">

          {/* PROFILE CARD */}

          <section className="rounded-[22px] border border-[#EEE3D1] bg-white p-4">

            <div className="flex items-center gap-4">

              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-black">

                {profile.profilePhoto ? (
                  <img
                    src={
                      profile.profilePhoto
                    }
                    alt="Driver"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[20px] font-black text-[#FFB000]">
                    {getInitials()}
                  </span>
                )}

              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-2">

                  <div className="min-w-0">

                    <p className="truncate text-[15px] font-black text-black">
                      {profile.name ||
                        "Driver"}
                    </p>

                    <p className="mt-1 text-[8px] font-bold text-[#B87700]">
                      {profile.driverId}
                    </p>

                  </div>

                  <span className="rounded-full bg-[#EDF6EB] px-2 py-1 text-[6px] font-black text-[#4E854A]">
                    ACTIVE
                  </span>

                </div>

                <p className="mt-2 text-[8px] text-[#8C8276]">
                  {profile.vehicleType ||
                    "Driver"}

                  {" • "}

                  {profile.vehicleNumber ||
                    "Vehicle not added"}
                </p>

                <button
                  type="button"
                  onClick={
                    openEditMode
                  }
                  className="mt-3 flex h-9 items-center gap-1.5 rounded-[11px] bg-[#FFF0C5] px-3 text-[7px] font-black text-[#936200]"
                >

                  <Pencil
                    size={11}
                  />

                  EDIT PROFILE

                </button>

              </div>

            </div>

            {/* STATS */}

            <div className="mt-4 grid grid-cols-2 gap-2">

              <div className="rounded-[14px] bg-[#FFF9EE] px-3 py-3">

                <div className="flex items-center gap-2">

                  <Car
                    size={13}
                    className="text-[#A97000]"
                  />

                  <p className="text-[7px] font-bold text-[#91877C]">
                    TRIPS
                  </p>

                </div>

                <p className="mt-1.5 text-[18px] font-black text-black">
                  {profile.todayTrips ??
                    0}
                </p>

                <p className="text-[6.5px] text-[#91877C]">
                  Total Trips
                </p>

              </div>

              <div className="rounded-[14px] bg-[#FFF9EE] px-3 py-3">

                <div className="flex items-center gap-2">

                  <Clock
                    size={13}
                    className="text-[#A97000]"
                  />

                  <p className="text-[7px] font-bold text-[#91877C]">
                    MEMBER SINCE
                  </p>

                </div>

                <p className="mt-1.5 text-[12px] font-black text-black">

                  {profile.createdAt
                    ? new Date(
                        profile.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          month:
                            "short",

                          year:
                            "numeric",
                        }
                      )
                    : "-"}

                </p>

                <p className="mt-1 text-[6.5px] text-[#91877C]">
                  ASAN Driver
                </p>

              </div>

            </div>

          </section>

          {/* PERSONAL INFO */}

          <SectionTitle
            eyebrow="PERSONAL INFO"
            title="Contact Details"
          />

          <InfoGrid
            fields={
              personalFields
            }
          />

          {/* DRIVER DETAILS */}

          <SectionTitle
            eyebrow="DRIVER DETAILS"
            title="Vehicle & License"
          />

          <InfoGrid
            fields={
              driverFields
            }
          />

          {/* SETTINGS */}

          <div className="mt-5">

            <div className="px-1">

              <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
                SETTINGS
              </p>

              <h2 className="mt-1 text-[16px] font-black text-black">
                Account & Support
              </h2>

            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {settings.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <button
                      key={
                        item.label
                      }
                      type="button"
                      onClick={() =>
                        navigate(
                          item.path
                        )
                      }
                      className="rounded-[16px] border border-[#EEE3D1] bg-white p-3 text-left"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#FFF0C5]">

                        <Icon
                          size={15}
                          className="text-[#A97000]"
                        />

                      </div>

                      <p className="mt-2 text-[8px] font-black text-black">
                        {item.label}
                      </p>

                      <p className="mt-1 text-[6.5px] leading-[1.4] text-[#91877C]">
                        {
                          item.description
                        }
                      </p>

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={() =>
              setShowLogoutConfirm(
                true
              )
            }
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-black text-[8px] font-black text-white"
          >

            <LogOut
              size={15}
            />

            LOGOUT

          </button>

        </main>

        {/* LOGOUT MODAL */}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-[2px]">

            <div className="w-full max-w-[350px] rounded-[22px] border border-[#EEE3D1] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFF0C5]">

                <LogOut
                  size={20}
                  className="text-[#A97000]"
                />

              </div>

              <h2 className="mt-4 text-center text-[15px] font-black text-black">
                Are you sure you want to logout?
              </h2>

              <p className="mx-auto mt-2 max-w-[260px] text-center text-[8px] leading-[1.6] text-[#8C8276]">
                You'll need to sign in again to access your Driver account and assigned trips.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5">

                <button
                  type="button"
                  onClick={() =>
                    setShowLogoutConfirm(
                      false
                    )
                  }
                  className="h-11 rounded-[13px] border border-[#EEE3D1] bg-[#FFF9EE] text-[8px] font-black text-[#6E655C]"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex h-11 items-center justify-center gap-1.5 rounded-[13px] bg-black text-[8px] font-black text-white"
                >

                  <LogOut
                    size={13}
                  />

                  LOGOUT

                </button>

              </div>

            </div>

          </div>
        )}

        {/* BOTTOM NAV */}

        <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-[451px] -translate-x-1/2">

          <nav className="grid grid-cols-4 rounded-[20px] border border-[#E9DDC9] bg-white/95 px-2 py-2 shadow-[0_12px_35px_rgba(60,45,20,0.12)] backdrop-blur-md">

            {[
              {
                icon:
                  Home,

                label:
                  "Home",

                path:
                  "/dashboard",
              },

              {
                icon:
                  Users,

                label:
                  "Students",

                path:
                  "/students",
              },

              {
                icon:
                  Clock,

                label:
                  "Trips",

                path:
                  "/trips",
              },

              {
                icon:
                  User,

                label:
                  "Profile",

                path:
                  "/profile",
              },
            ].map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  item.label ===
                  "Profile";

                return (
                  <button
                    key={
                      item.label
                    }
                    type="button"
                    onClick={() =>
                      navigate(
                        item.path
                      )
                    }
                    className={`flex flex-col items-center justify-center rounded-[14px] py-1.5 ${
                      active
                        ? "bg-[#FFF0C5]"
                        : ""
                    }`}
                  >

                    <Icon
                      size={17}
                      className={
                        active
                          ? "text-[#A97000]"
                          : "text-[#8A8177]"
                      }
                    />

                    <span
                      className={`mt-1 text-[6.5px] font-black ${
                        active
                          ? "text-[#A97000]"
                          : "text-[#8A8177]"
                      }`}
                    >
                      {item.label}
                    </span>

                  </button>
                );
              }
            )}

          </nav>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
}) {
  return (
    <div className="mt-5 px-1">

      <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-[16px] font-black text-black">
        {title}
      </h2>

    </div>
  );
}

/* =========================================================
   INFO GRID
========================================================= */

function InfoGrid({
  fields,
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5">

      {fields.map(
        (field) => {
          const Icon =
            field.icon;

          return (
            <div
              key={
                field.label
              }
              className="min-w-0 rounded-[16px] border border-[#EEE3D1] bg-white p-3"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFF0C5]">

                <Icon
                  size={14}
                  className="text-[#A97000]"
                />

              </div>

              <p className="mt-2 text-[7px] font-bold text-[#91877C]">
                {field.label}
              </p>

              <p className="mt-1 break-words text-[8.5px] font-black leading-[1.45] text-black">
                {field.value ||
                  "Not Provided"}
              </p>

            </div>
          );
        }
      )}

    </div>
  );
}

/* =========================================================
   PROFILE INPUT
========================================================= */

function ProfileInput({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="mb-5">

      <label className="mb-2 block text-[8px] font-black text-black">
        {label}
      </label>

      <div className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-[#E8DED0] bg-[#FFFDF9] px-4">

        <Icon
          size={17}
          className="shrink-0 text-black"
        />

        <input
          type={type}
          name={name}
          value={
            value || ""
          }
          onChange={
            onChange
          }
          placeholder={
            placeholder
          }
          autoComplete={
            type === "email"
              ? "email"
              : "off"
          }
          className="h-[50px] min-w-0 flex-1 bg-transparent text-[9px] font-black text-black outline-none placeholder:font-medium placeholder:text-[#B2A89D]"
        />

      </div>

    </div>
  );
}

export default Profile;