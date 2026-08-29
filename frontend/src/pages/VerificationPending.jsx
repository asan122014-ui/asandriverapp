import { useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  FileCheck2,
  Clock3,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API =
  "https://asan-driverapp.onrender.com";

/* =========================================================
   VERIFICATION PENDING
========================================================= */

function VerificationPending() {
  const navigate =
    useNavigate();

  /* =======================================================
     CHECK VERIFICATION STATUS
  ======================================================= */

  useEffect(() => {
    let interval;

    const checkStatus =
      async () => {
        try {
          const driverDataLocal =
            localStorage.getItem(
              "driver"
            );

          const driverLocal =
            driverDataLocal
              ? JSON.parse(
                  driverDataLocal
                )
              : null;

          /* =================================================
             NO DRIVER SESSION
          ================================================= */

          if (
            !driverLocal?.driverId
          ) {
            navigate(
              "/DriverLogin",
              {
                replace: true,
              }
            );

            return;
          }

          /* =================================================
             FETCH LATEST DRIVER STATUS
          ================================================= */

          const response =
            await axios.get(
              `${API}/api/driver/profile/${driverLocal.driverId}`
            );

          const driver =
            response?.data?.data;

          if (!driver) {
            return;
          }

          /* =================================================
             UPDATE LOCAL STORAGE
          ================================================= */

          localStorage.setItem(
            "driver",
            JSON.stringify(
              driver
            )
          );

          /* =================================================
             APPROVED
          ================================================= */

          if (
            driver?.status
              ?.toLowerCase() ===
            "approved"
          ) {
            clearInterval(
              interval
            );

            navigate(
              "/dashboard",
              {
                replace: true,
              }
            );
          }
        } catch (error) {
          console.error(
            "Verification check failed:",
            error
          );
        }
      };

    /* =====================================================
       CHECK IMMEDIATELY
    ===================================================== */

    checkStatus();

    /* =====================================================
       CHECK EVERY 3 SECONDS
    ===================================================== */

    interval =
      setInterval(
        checkStatus,
        3000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [navigate]);

  /* =======================================================
     UI
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

              {/* SMALL LOADING INDICATOR */}

              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#FFB000]">

                <div className="h-3 w-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
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
                No action is required right now.
                This page checks your approval status automatically.
              </p>
            </div>

            {/* =================================================
                VERIFICATION STEPS
            ================================================= */}

            <div className="mt-5 text-left">

              <p className="text-[7px] font-black tracking-[0.14em] text-[#A0968A]">
                VERIFICATION STATUS
              </p>

              <div className="mt-3 space-y-2">

                {/* ACCOUNT CREATED */}

                <StatusStep
                  icon={
                    CheckCircle2
                  }
                  title="Driver account created"
                  description="Your account information has been received."
                  completed
                />

                {/* DOCUMENTS */}

                <StatusStep
                  icon={
                    FileCheck2
                  }
                  title="Documents submitted"
                  description="Your verification documents are available for review."
                  completed
                />

                {/* REVIEW */}

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

                <p className="text-[8px] font-black text-[#936200]">
                  Automatic approval check
                </p>

                <p className="mt-0.5 text-[7px] leading-[1.5] text-[#9C772D]">
                  Once your account is approved, you'll be taken directly to the Driver dashboard.
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

export default VerificationPending;