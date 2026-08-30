import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "../utils/axiosInstance";

import {
  useNavigate,
} from "react-router-dom";

import {
  ShieldCheck,
  FileCheck2,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogIn,
  Loader2,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API =
  "https://asan-driverapp.onrender.com";

/* =========================================================
   POLLING INTERVAL
========================================================= */

const STATUS_CHECK_INTERVAL =
  3000;

/* =========================================================
   VERIFICATION PENDING
========================================================= */

function VerificationPending() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    rejection,
    setRejection,
  ] =
    useState(
      null
    );

  const [
    checking,
    setChecking,
  ] =
    useState(
      true
    );

  const [
    acknowledgeLoading,
    setAcknowledgeLoading,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  /* =======================================================
     REFS
  ======================================================= */

  const intervalRef =
    useRef(
      null
    );

  const requestInProgressRef =
    useRef(
      false
    );

  const mountedRef =
    useRef(
      true
    );

  /* =======================================================
     GET ACCESS TOKEN
  ======================================================= */

  const getAccessToken =
    useCallback(
      () => {
        return String(
          localStorage.getItem(
            "accessToken"
          ) ||
            ""
        ).trim();
      },
      []
    );

  /* =======================================================
     CLEAR POLLING
  ======================================================= */

  const stopPolling =
    useCallback(
      () => {
        if (
          intervalRef.current
        ) {
          clearInterval(
            intervalRef.current
          );

          intervalRef.current =
            null;
        }
      },
      []
    );

  /* =======================================================
     CLEAR DRIVER SESSION
  ======================================================= */

  const clearDriverSession =
    useCallback(
      () => {
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "driver"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "rejection"
        );

        localStorage.removeItem(
          "rejectionData"
        );

        sessionStorage.removeItem(
          "accessToken"
        );

        sessionStorage.removeItem(
          "driver"
        );
      },
      []
    );

  /* =======================================================
     UPDATE LOCAL DRIVER STATUS
  ======================================================= */

  const updateStoredDriverStatus =
    useCallback(
      (
        status
      ) => {
        try {
          const stored =
            localStorage.getItem(
              "driver"
            );

          if (
            !stored
          ) {
            return;
          }

          const driver =
            JSON.parse(
              stored
            );

          localStorage.setItem(
            "driver",

            JSON.stringify({
              ...driver,

              status,
            })
          );
        } catch (
          storageError
        ) {
          console.warn(
            "Unable to update stored Driver status:",
            storageError
          );
        }
      },
      []
    );

  /* =======================================================
     CHECK APPLICATION STATUS
  ======================================================= */

  const checkStatus =
    useCallback(
      async () => {
        if (
          requestInProgressRef.current
        ) {
          return;
        }

        const token =
          getAccessToken();

        /* =================================================
           NO AUTHENTICATED SESSION
        ================================================= */

        if (
          !token
        ) {
          stopPolling();

          navigate(
            "/DriverLogin",
            {
              replace:
                true,
            }
          );

          return;
        }

        requestInProgressRef.current =
          true;

        try {
          const response =
            await axios.get(
              `${API}/api/driver-auth/rejection-status`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (
            !mountedRef.current
          ) {
            return;
          }

          const result =
            response?.data;

          const status =
            String(
              result?.status ||
                ""
            )
              .trim()
              .toLowerCase();

          const code =
            String(
              result?.code ||
                ""
            )
              .trim()
              .toUpperCase();

          /* =================================================
             REJECTED
          ================================================= */

          if (
            result?.rejected ===
              true ||
            status ===
              "rejected" ||
            code ===
              "DRIVER_REJECTED"
          ) {
            stopPolling();

            const rejectionData = {
              rejectionReason:
                result
                  ?.rejectionReason ||
                result
                  ?.data
                  ?.rejectionReason ||
                "Your Driver application was not approved.",

              rejectedAt:
                result
                  ?.rejectedAt ||
                result
                  ?.data
                  ?.rejectedAt ||
                null,

              name:
                result
                  ?.data
                  ?.name ||
                "",

              email:
                result
                  ?.data
                  ?.email ||
                "",

              rejectionId:
                result
                  ?.data
                  ?.rejectionId ||
                null,
            };

            setRejection(
              rejectionData
            );

            setError(
              ""
            );

            localStorage.setItem(
              "rejectionData",
              JSON.stringify(
                rejectionData
              )
            );

            updateStoredDriverStatus(
              "rejected"
            );

            return;
          }

          /* =================================================
             APPROVED
          ================================================= */

          if (
            status ===
              "approved" ||
            code ===
              "DRIVER_APPROVED"
          ) {
            stopPolling();

            updateStoredDriverStatus(
              "approved"
            );

            navigate(
              "/dashboard",
              {
                replace:
                  true,
              }
            );

            return;
          }

          /* =================================================
             PENDING
          ================================================= */

          if (
            status ===
              "pending" ||
            code ===
              "DRIVER_PENDING"
          ) {
            updateStoredDriverStatus(
              "pending"
            );

            setError(
              ""
            );
          }
        } catch (
          requestError
        ) {
          if (
            !mountedRef.current
          ) {
            return;
          }

          const statusCode =
            requestError
              ?.response
              ?.status;

          const responseCode =
            requestError
              ?.response
              ?.data
              ?.code;

          const responseStatus =
            requestError
              ?.response
              ?.data
              ?.status;

          /* =================================================
             REJECTION RETURNED AS ERROR RESPONSE
          ================================================= */

          if (
            responseCode ===
              "DRIVER_REJECTED" ||
            responseStatus ===
              "rejected"
          ) {
            stopPolling();

            const rejectionData = {
              rejectionReason:
                requestError
                  ?.response
                  ?.data
                  ?.rejectionReason ||
                requestError
                  ?.response
                  ?.data
                  ?.data
                  ?.rejectionReason ||
                "Your Driver application was not approved.",

              rejectedAt:
                requestError
                  ?.response
                  ?.data
                  ?.rejectedAt ||
                requestError
                  ?.response
                  ?.data
                  ?.data
                  ?.rejectedAt ||
                null,

              name:
                requestError
                  ?.response
                  ?.data
                  ?.data
                  ?.name ||
                "",

              email:
                requestError
                  ?.response
                  ?.data
                  ?.data
                  ?.email ||
                "",

              rejectionId:
                requestError
                  ?.response
                  ?.data
                  ?.data
                  ?.rejectionId ||
                null,
            };

            setRejection(
              rejectionData
            );

            setError(
              ""
            );

            localStorage.setItem(
              "rejectionData",
              JSON.stringify(
                rejectionData
              )
            );

            updateStoredDriverStatus(
              "rejected"
            );

            return;
          }

          /* =================================================
             INVALID / EXPIRED TOKEN
          ================================================= */

          if (
            statusCode ===
              401
          ) {
            stopPolling();

            clearDriverSession();

            navigate(
              "/DriverLogin",
              {
                replace:
                  true,
              }
            );

            return;
          }

          /*
            A temporary network/server failure should not log
            the Driver out. The next polling attempt can retry.
          */

          console.error(
            "Verification status check failed:",
            requestError
          );

          setError(
            "Unable to refresh your verification status. We'll try again automatically."
          );
        } finally {
          requestInProgressRef.current =
            false;

          if (
            mountedRef.current
          ) {
            setChecking(
              false
            );
          }
        }
      },
      [
        clearDriverSession,
        getAccessToken,
        navigate,
        stopPolling,
        updateStoredDriverStatus,
      ]
    );

  /* =======================================================
     LOAD SAVED REJECTION IF PRESENT
  ======================================================= */

  useEffect(
    () => {
      try {
        const savedRejection =
          localStorage.getItem(
            "rejectionData"
          );

        if (
          savedRejection
        ) {
          const parsed =
            JSON.parse(
              savedRejection
            );

          if (
            parsed
              ?.rejectionReason
          ) {
            setRejection(
              parsed
            );
          }
        }
      } catch (
        storageError
      ) {
        console.warn(
          "Unable to restore rejection state:",
          storageError
        );
      }
    },
    []
  );

  /* =======================================================
     CHECK VERIFICATION STATUS
  ======================================================= */

  useEffect(
    () => {
      mountedRef.current =
        true;

      checkStatus();

      intervalRef.current =
        setInterval(
          () => {
            checkStatus();
          },
          STATUS_CHECK_INTERVAL
        );

      return () => {
        mountedRef.current =
          false;

        stopPolling();
      };
    },
    [
      checkStatus,
      stopPolling,
    ]
  );

  /* =======================================================
     ACKNOWLEDGE REJECTION
  ======================================================= */

  const handleAcknowledgeRejection =
    async () => {
      if (
        acknowledgeLoading
      ) {
        return;
      }

      const token =
        getAccessToken();

      if (
        !token
      ) {
        clearDriverSession();

        navigate(
          "/DriverLogin",
          {
            replace:
              true,
          }
        );

        return;
      }

      try {
        setAcknowledgeLoading(
          true
        );

        setError(
          ""
        );

        await axios.post(
          `${API}/api/driver-auth/acknowledge-rejection`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        /* =================================================
           ACKNOWLEDGED SUCCESSFULLY
        ================================================= */

        clearDriverSession();

        navigate(
          "/DriverLogin",
          {
            replace:
              true,
          }
        );
      } catch (
        acknowledgeError
      ) {
        console.error(
          "Acknowledge rejection failed:",
          acknowledgeError
        );

        const statusCode =
          acknowledgeError
            ?.response
            ?.status;

        /*
          If the rejection was already acknowledged, or the
          rejection token can no longer be used, clean the old
          local session and return to Sign In.
        */

        if (
          statusCode ===
            404 ||
          statusCode ===
            401
        ) {
          clearDriverSession();

          navigate(
            "/DriverLogin",
            {
              replace:
                true,
            }
          );

          return;
        }

        setError(
          acknowledgeError
            ?.response
            ?.data
            ?.message ||
            "Unable to continue to Sign In. Please try again."
        );
      } finally {
        setAcknowledgeLoading(
          false
        );
      }
    };

  /* =======================================================
     REJECTION SCREEN
  ======================================================= */

  if (
    rejection
  ) {
    return (
      <RejectedApplication
        rejection={
          rejection
        }
        loading={
          acknowledgeLoading
        }
        error={
          error
        }
        onContinue={
          handleAcknowledgeRejection
        }
      />
    );
  }

  /* =======================================================
     PENDING UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[475px] items-center justify-center overflow-hidden bg-[#FFF9EE] px-5">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[130px] -top-[145px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/80" />

        <div className="pointer-events-none absolute -left-[170px] bottom-[20px] h-[280px] w-[280px] rounded-full bg-[#FFF2D1]/55" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 w-full">

          {/* =================================================
              STATUS LABEL
          ================================================= */}

          <div className="mb-3 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0C5] px-3 py-1.5">
              <Clock3
                size={11}
                className="text-[#A97000]"
              />

              <span className="text-[7px] font-black tracking-[0.14em] text-[#936200]">
                VERIFICATION IN PROGRESS
              </span>
            </div>
          </div>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <section className="rounded-[26px] border border-[#EEE3D1] bg-white px-5 py-6 text-center">

            {/* =================================================
                ICON
            ================================================= */}

            <div className="relative mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-[24px] bg-[#FFF0C5]">
              <ShieldCheck
                size={38}
                className="text-[#A97000]"
              />

              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#FFB000]">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
              </div>
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h1 className="mt-5 text-[23px] font-black leading-tight text-black">
              Verification Pending
            </h1>

            <p className="mx-auto mt-2 max-w-[300px] text-[9px] leading-[1.7] text-[#83796E]">
              Your Driver profile and submitted documents are currently being reviewed by the ASAN team.
            </p>

            {/* =================================================
                AUTO CHECK INFO
            ================================================= */}

            <div className="mt-5 rounded-[15px] border border-[#EEE3D1] bg-[#FFF9EE] px-4 py-3">
              <p className="text-[7.5px] font-semibold leading-[1.6] text-[#81776D]">
                No action is required right now. This page checks your application status automatically.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-[13px] border border-[#F6D5CF] bg-[#FFF4F2] px-3 py-2.5 text-left">
                <AlertTriangle
                  size={13}
                  className="mt-0.5 shrink-0 text-[#B54532]"
                />

                <p className="text-[7px] font-semibold leading-[1.5] text-[#9A3D2D]">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                VERIFICATION STEPS
            ================================================= */}

            <div className="mt-5 text-left">
              <p className="text-[7px] font-black tracking-[0.14em] text-[#A0968A]">
                VERIFICATION STATUS
              </p>

              <div className="mt-3 space-y-2">

                <StatusStep
                  icon={
                    CheckCircle2
                  }
                  title="Driver account created"
                  description="Your account information has been received."
                  completed
                />

                <StatusStep
                  icon={
                    FileCheck2
                  }
                  title="Documents submitted"
                  description="Your verification documents are available for review."
                  completed
                />

                <StatusStep
                  icon={
                    ShieldCheck
                  }
                  title="Admin verification"
                  description="Your Driver profile is currently under review."
                  active
                />

              </div>
            </div>

            {/* =================================================
                AUTO REDIRECT MESSAGE
            ================================================= */}

            <div className="mt-5 flex items-start gap-2 rounded-[14px] bg-[#FFF0C5] px-3.5 py-3 text-left">
              <Clock3
                size={14}
                className="mt-0.5 shrink-0 text-[#A97000]"
              />

              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[8px] font-black text-[#936200]">
                    Automatic status check
                  </p>

                  {checking && (
                    <Loader2
                      size={9}
                      className="animate-spin text-[#936200]"
                    />
                  )}
                </div>

                <p className="mt-0.5 text-[7px] leading-[1.5] text-[#9C772D]">
                  Once approved, you'll be taken directly to the Driver dashboard.
                </p>
              </div>
            </div>

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck
              size={9}
              className="text-[#AAA095]"
            />

            <p className="text-[6.5px] text-[#AAA095]">
              ASAN Driver verification
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REJECTED APPLICATION SCREEN
========================================================= */

function RejectedApplication({
  rejection,
  loading,
  error,
  onContinue,
}) {
  const rejectedDate =
    rejection?.rejectedAt
      ? formatDate(
          rejection.rejectedAt
        )
      : null;

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[475px] items-center justify-center overflow-hidden bg-[#FFF9EE] px-5 py-8">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[130px] -top-[145px] h-[330px] w-[330px] rounded-full bg-[#FFE6DE]/70" />

        <div className="pointer-events-none absolute -left-[170px] bottom-[20px] h-[280px] w-[280px] rounded-full bg-[#FFF2D1]/55" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 w-full">

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="mb-3 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FDEAE6] px-3 py-1.5">
              <XCircle
                size={11}
                className="text-[#B5412E]"
              />

              <span className="text-[7px] font-black tracking-[0.14em] text-[#A03827]">
                APPLICATION REVIEWED
              </span>
            </div>
          </div>

          {/* =================================================
              CARD
          ================================================= */}

          <section className="rounded-[26px] border border-[#EEE3D1] bg-white px-5 py-6 text-center">

            {/* =================================================
                ICON
            ================================================= */}

            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-[24px] bg-[#FDEAE6]">
              <XCircle
                size={40}
                strokeWidth={2}
                className="text-[#B5412E]"
              />
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h1 className="mt-5 text-[23px] font-black leading-tight text-black">
              Application Rejected
            </h1>

            <p className="mx-auto mt-2 max-w-[310px] text-[9px] leading-[1.7] text-[#83796E]">
              Your Driver application was reviewed by the ASAN verification team and could not be approved at this time.
            </p>

            {/* =================================================
                REJECTION REASON
            ================================================= */}

            <div className="mt-5 rounded-[17px] border border-[#F3D5CF] bg-[#FFF5F3] p-4 text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={14}
                  className="shrink-0 text-[#B5412E]"
                />

                <p className="text-[7px] font-black tracking-[0.12em] text-[#A03827]">
                  REJECTION REASON
                </p>
              </div>

              <p className="mt-3 break-words text-[9px] font-semibold leading-[1.7] text-[#66342B]">
                {rejection?.rejectionReason ||
                  "Your Driver application did not meet the current verification requirements."}
              </p>
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            {rejectedDate && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Clock3
                  size={10}
                  className="text-[#9A9187]"
                />

                <p className="text-[6.5px] font-semibold text-[#9A9187]">
                  Reviewed on {rejectedDate}
                </p>
              </div>
            )}

            {/* =================================================
                WHAT NEXT
            ================================================= */}

            <div className="mt-5 rounded-[15px] border border-[#EEE3D1] bg-[#FFF9EE] px-4 py-3.5 text-left">
              <p className="text-[7px] font-black tracking-[0.12em] text-[#8F8376]">
                WHAT YOU CAN DO
              </p>

              <p className="mt-2 text-[7.5px] font-semibold leading-[1.65] text-[#81776D]">
                Review the reason above and correct the issue before submitting a new Driver registration.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-[13px] border border-[#F3D5CF] bg-[#FFF4F2] px-3 py-2.5 text-left">
                <AlertTriangle
                  size={13}
                  className="mt-0.5 shrink-0 text-[#B54532]"
                />

                <p className="text-[7px] font-semibold leading-[1.5] text-[#9A3D2D]">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                CONTINUE BUTTON
            ================================================= */}

            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                onContinue
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[15px] bg-black px-4 py-3.5 text-[9px] font-black text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  Returning to Sign In...
                </>
              ) : (
                <>
                  <LogIn
                    size={14}
                  />

                  Back to Sign In
                </>
              )}
            </button>

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck
              size={9}
              className="text-[#AAA095]"
            />

            <p className="text-[6.5px] text-[#AAA095]">
              ASAN Driver verification
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS STEP
========================================================= */

function StatusStep({
  icon: Icon,
  title,
  description,
  completed = false,
  active = false,
}) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] bg-[#FFF9EE] px-3 py-3">

      {/* ICON */}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${
          completed
            ? "bg-[#EDF6EB]"
            : active
              ? "bg-[#FFF0C5]"
              : "bg-[#F2EEE7]"
        }`}
      >
        <Icon
          size={14}
          className={
            completed
              ? "text-[#4E854A]"
              : active
                ? "text-[#A97000]"
                : "text-[#8A8177]"
          }
        />
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[8.5px] font-black text-black">
            {title}
          </p>

          {completed && (
            <span className="rounded-full bg-[#EDF6EB] px-2 py-1 text-[5.5px] font-black text-[#4E854A]">
              DONE
            </span>
          )}

          {active && (
            <span className="rounded-full bg-[#FFF0C5] px-2 py-1 text-[5.5px] font-black text-[#936200]">
              REVIEWING
            </span>
          )}
        </div>

        <p className="mt-1 text-[6.5px] leading-[1.5] text-[#91877C]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value
) {
  try {
    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    );
  } catch {
    return "";
  }
}

/* =========================================================
   EXPORT
========================================================= */

export default VerificationPending;