import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CheckCircle2,
  Home,
  Clock3,
  ShieldCheck,
  Users,
} from "lucide-react";

import confetti from "canvas-confetti";

import {
  useEffect,
  useState,
} from "react";

/* =========================================================
   TRIP SUCCESS
========================================================= */

function TripSuccess() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const trip =
    location.state;

  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(5);

  /* =======================================================
     CONFETTI + AUTO REDIRECT
  ======================================================= */

  useEffect(() => {
    if (!trip) {
      return;
    }

    confetti({
      particleCount:
        90,

      spread:
        75,

      origin: {
        y: 0.62,
      },
    });

    const redirectTimer =
      setTimeout(
        () => {
          navigate(
            "/dashboard"
          );
        },
        5000
      );

    const interval =
      setInterval(
        () => {
          setSecondsLeft(
            (
              previous
            ) =>
              previous > 1
                ? previous - 1
                : 1
          );
        },
        1000
      );

    return () => {
      clearTimeout(
        redirectTimer
      );

      clearInterval(
        interval
      );
    };
  }, [
    trip,
    navigate,
  ]);

  /* =======================================================
     FALLBACK
  ======================================================= */

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center px-5">

        <div className="w-full max-w-[420px] rounded-[22px] border border-[#EEE3D1] bg-white p-6 text-center">

          <ShieldCheck
            size={24}
            className="mx-auto text-[#A97000]"
          />

          <h2 className="mt-3 text-[15px] font-black text-black">
            Trip data unavailable
          </h2>

          <p className="mt-1 text-[8px] leading-[1.6] text-[#8C8276]">
            We couldn't find the completed trip information.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#FFB000] text-[8px] font-black text-black"
          >
            <Home
              size={14}
            />

            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">

      <div className="relative flex min-h-screen w-full max-w-[475px] items-center justify-center overflow-hidden bg-[#FFF9EE] px-5">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[140px] -top-[150px] h-[340px] w-[340px] rounded-full bg-[#FFEDB9]/80" />

        <div className="pointer-events-none absolute -left-[180px] bottom-[40px] h-[280px] w-[280px] rounded-full bg-[#FFF2D1]/55" />

        {/* =================================================
            SUCCESS CARD
        ================================================= */}

        <div className="relative z-10 w-full">

          <section className="rounded-[26px] border border-[#EEE3D1] bg-white px-5 py-6 text-center">

            {/* =================================================
                STATUS LABEL
            ================================================= */}

            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#EDF6EB] px-3 py-1.5">

              <ShieldCheck
                size={12}
                className="text-[#4E854A]"
              />

              <span className="text-[7px] font-black tracking-[0.12em] text-[#4E854A]">
                TRIP COMPLETED
              </span>
            </div>

            {/* =================================================
                ICON
            ================================================= */}

            <div className="mx-auto mt-5 flex h-[82px] w-[82px] items-center justify-center rounded-[24px] bg-[#FFF0C5]">

              <CheckCircle2
                size={42}
                strokeWidth={2.2}
                className="text-[#A97000]"
              />
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h1 className="mt-5 text-[24px] font-black leading-tight text-black">
              Duty completed successfully
            </h1>

            <p className="mx-auto mt-2 max-w-[290px] text-[9px] leading-[1.7] text-[#83796E]">
              The trip has been completed and all assigned students have safely reached their destination.
            </p>

            {/* =================================================
                TRIP SUMMARY
            ================================================= */}

            <div className="mt-5 grid grid-cols-2 gap-2.5">

              <div className="rounded-[15px] bg-[#FFF9EE] px-3 py-3 text-left">

                <div className="flex items-center gap-2">

                  <Users
                    size={13}
                    className="text-[#A97000]"
                  />

                  <span className="text-[7px] font-black text-[#91877C]">
                    STUDENTS
                  </span>
                </div>

                <p className="mt-2 text-[14px] font-black text-black">
                  {trip?.studentsCount ??
                    trip?.studentCount ??
                    trip?.students?.length ??
                    "-"}
                </p>

                <p className="mt-0.5 text-[6.5px] text-[#948A7E]">
                  Completed safely
                </p>
              </div>

              <div className="rounded-[15px] bg-[#FFF9EE] px-3 py-3 text-left">

                <div className="flex items-center gap-2">

                  <Clock3
                    size={13}
                    className="text-[#A97000]"
                  />

                  <span className="text-[7px] font-black text-[#91877C]">
                    STATUS
                  </span>
                </div>

                <p className="mt-2 text-[12px] font-black text-black">
                  Completed
                </p>

                <p className="mt-0.5 text-[6.5px] text-[#948A7E]">
                  Trip closed
                </p>
              </div>
            </div>

            {/* =================================================
                AUTO REDIRECT
            ================================================= */}

            <div className="mt-5 rounded-[14px] border border-[#EEE3D1] bg-[#FFFDF9] px-3 py-3">

              <p className="text-[7.5px] font-semibold text-[#8A8177]">
                Returning to Dashboard in
              </p>

              <p className="mt-1 text-[18px] font-black text-[#B87700]">
                {secondsLeft}s
              </p>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-5 space-y-2.5">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-[#FFB000] text-[8px] font-black text-black"
              >
                <Home
                  size={15}
                />

                BACK TO HOME
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/trips"
                  )
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#EEE3D1] bg-white text-[8px] font-black text-[#665E56]"
              >
                <Clock3
                  size={14}
                />

                VIEW TRIP HISTORY
              </button>
            </div>
          </section>

          {/* =================================================
              FOOTER MESSAGE
          ================================================= */}

          <div className="mt-4 flex items-center justify-center gap-1.5">

            <ShieldCheck
              size={10}
              className="text-[#AAA095]"
            />

            <p className="text-[7px] text-[#AAA095]">
              Trip completion has been recorded successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripSuccess;