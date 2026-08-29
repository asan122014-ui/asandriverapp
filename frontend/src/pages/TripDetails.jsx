import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Sun,
  Cloud,
  Users,
  Calendar,
  BadgeCheck,
  CircleX,
  ShieldCheck,
  Clock3,
  MapPin,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "../utils/axiosInstance";

/* =========================================================
   API
========================================================= */

const API =
  "https://asan-driverapp.onrender.com";

/* =========================================================
   TRIP DETAILS
========================================================= */

function TripDetails() {
  const {
    state,
  } =
    useLocation();

  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    students,
    setStudents,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     FETCH TRIP DETAILS
  ======================================================= */

  useEffect(() => {
    const fetchTripDetails =
      async () => {
        try {
          setLoading(true);
          setError("");

          if (
            !state?.tripDate ||
            !state?.driverId ||
            !state?.tripType
          ) {
            setError(
              "Trip information is incomplete."
            );

            return;
          }

          const tripDate =
            new Date(
              state.tripDate
            )
              .toISOString()
              .split("T")[0];

          const response =
            await axios.get(
              `${API}/api/trip/details/${state.driverId}/${state.tripType.toLowerCase()}/${tripDate}`
            );

          console.log(
            "📡 Trip Details:",
            response.data
          );

          const trips =
            Array.isArray(
              response.data?.data
                ?.trips
            )
              ? response.data.data
                  .trips
              : [];

          setStudents(
            trips
          );
        } catch (error) {
          console.error(
            "Trip Details Error:",
            error
          );

          setStudents(
            []
          );

          setError(
            error?.response?.data
              ?.message ||
              "Unable to load trip details."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchTripDetails();
  }, [
    state,
  ]);

  /* =======================================================
     SAFETY ARRAY
  ======================================================= */

  const safeStudents =
    Array.isArray(
      students
    )
      ? students
      : [];

  const totalStudents =
    safeStudents.length;

  /* =======================================================
     PICKUP STATUS
  ======================================================= */

  const isPickedUp =
    (
      student
    ) => {
      if (
        student?.pickupTime
      ) {
        return true;
      }

      if (
        student?.status ===
        "picked_up"
      ) {
        return true;
      }

      if (
        student?.status ===
        "dropped"
      ) {
        return true;
      }

      return false;
    };

  /* =======================================================
     DROP STATUS
  ======================================================= */

  const isDropped =
    (
      student
    ) => {
      if (
        student?.dropTime
      ) {
        return true;
      }

      if (
        student?.status ===
        "dropped"
      ) {
        return true;
      }

      return false;
    };

  /* =======================================================
     STUDENT NAME
  ======================================================= */

  const getStudentName =
    (
      student
    ) => {
      return (
        student?.child
          ?.name ||
        student?.childName ||
        student?.name ||
        "Student"
      );
    };

  /* =======================================================
     SCHOOL NAME
  ======================================================= */

  const getSchoolName =
    (
      student
    ) => {
      return (
        student?.child
          ?.schoolName ||
        student?.school ||
        "School not available"
      );
    };

  /* =======================================================
     DATE
  ======================================================= */

  const formattedDate =
    state?.tripDate
      ? new Date(
          state.tripDate
        ).toLocaleDateString(
          "en-IN",
          {
            day:
              "numeric",

            month:
              "long",

            year:
              "numeric",
          }
        )
      : "-";

  /* =======================================================
     TRIP TYPE
  ======================================================= */

  const tripType =
    state?.tripType ||
    "Trip";

  const isMorning =
    tripType
      .toLowerCase() ===
    "morning";

  /* =======================================================
     NO TRIP DATA
  ======================================================= */

  if (!state) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center px-5">

        <div className="w-full max-w-[420px] rounded-[22px] border border-[#EEE3D1] bg-white p-6 text-center">

          <ShieldCheck
            size={25}
            className="mx-auto text-[#A97000]"
          />

          <h2 className="mt-3 text-[14px] font-black text-black">
            Trip information unavailable
          </h2>

          <p className="mt-1.5 text-[8px] leading-[1.6] text-[#8C8276]">
            We couldn't find the selected trip information.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/trips"
              )
            }
            className="mt-5 h-11 w-full rounded-[14px] bg-[#FFB000] text-[8px] font-black text-black"
          >
            BACK TO TRIPS
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

      <div className="relative min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE]">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[135px] -top-[155px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/75" />

        <div className="pointer-events-none absolute -left-[190px] top-[520px] h-[290px] w-[290px] rounded-full bg-[#FFF2D1]/45" />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="relative z-10 px-5 pt-5">

          {/* BACK BUTTON */}

          <div className="flex justify-end">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#EEE1CB] bg-[#FFFDF8]"
            >
              <ArrowLeft
                size={18}
                className="text-black"
              />
            </button>
          </div>

          {/* TITLE */}

          <div className="-mt-7">

            <div className="flex items-center gap-2">

              <Clock3
                size={13}
                className="text-[#B87700]"
              />

              <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
                TRIP HISTORY
              </p>
            </div>

            <h1 className="mt-2 text-[24px] font-black text-black">
              Trip Details
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[9px] leading-[1.6] text-[#8C8276]">
              Review the completed trip and student pickup and drop status.
            </p>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-5 px-4 pb-8">

          {/* =================================================
              TRIP SUMMARY
          ================================================= */}

          <section className="rounded-[22px] border border-[#EEE3D1] bg-white p-4">

            <div className="flex items-start gap-3">

              {/* TRIP ICON */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0C5]">

                {isMorning ? (
                  <Cloud
                    size={20}
                    className="text-[#A97000]"
                  />
                ) : (
                  <Sun
                    size={20}
                    className="text-[#A97000]"
                  />
                )}
              </div>

              {/* TRIP INFO */}

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-2">

                  <div>

                    <p className="text-[7px] font-black tracking-[0.13em] text-[#A0968A]">
                      COMPLETED TRIP
                    </p>

                    <h2 className="mt-1 text-[14px] font-black capitalize text-black">
                      {tripType} Trip
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#EDF6EB] px-2.5 py-1 text-[6px] font-black text-[#4E854A]">
                    COMPLETED
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5">

                  <Calendar
                    size={12}
                    className="text-[#A97000]"
                  />

                  <span className="text-[8px] font-semibold text-[#81776D]">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                SUMMARY STATS
            ================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-2">

              {/* STUDENTS */}

              <div className="rounded-[14px] bg-[#FFF9EE] px-3 py-3">

                <div className="flex items-center gap-2">

                  <Users
                    size={13}
                    className="text-[#A97000]"
                  />

                  <p className="text-[7px] font-black text-[#91877C]">
                    STUDENTS
                  </p>
                </div>

                <p className="mt-1.5 text-[18px] font-black text-black">
                  {totalStudents}
                </p>

                <p className="text-[6.5px] text-[#91877C]">
                  Assigned to trip
                </p>
              </div>

              {/* STATUS */}

              <div className="rounded-[14px] bg-[#FFF9EE] px-3 py-3">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={13}
                    className="text-[#4E854A]"
                  />

                  <p className="text-[7px] font-black text-[#91877C]">
                    TRIP STATUS
                  </p>
                </div>

                <p className="mt-1.5 text-[11px] font-black text-black">
                  Completed
                </p>

                <p className="mt-1 text-[6.5px] text-[#91877C]">
                  Trip closed successfully
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              STUDENT SECTION TITLE
          ================================================= */}

          <div className="mb-3 mt-6 px-1">

            <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
              STUDENT STATUS
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-[18px] font-black text-black">
                Students
              </h2>

              <span className="text-[7px] font-bold text-[#91877C]">
                {totalStudents} TOTAL
              </span>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="rounded-[20px] border border-[#EEE3D1] bg-white py-12 text-center">

              <div className="mx-auto h-8 w-8 rounded-full border-[3px] border-[#FFB000] border-t-transparent animate-spin" />

              <p className="mt-3 text-[8px] font-semibold text-[#8C8276]">
                Loading students...
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading &&
            error && (
              <div className="rounded-[18px] border border-[#F0D1CC] bg-white p-5 text-center">

                <CircleX
                  size={21}
                  className="mx-auto text-[#C85E55]"
                />

                <p className="mt-3 text-[10px] font-black text-[#A64D45]">
                  Unable to load trip details
                </p>

                <p className="mt-1 text-[7.5px] leading-4 text-[#9A756F]">
                  {error}
                </p>
              </div>
            )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            safeStudents.length ===
              0 && (
              <div className="rounded-[20px] border border-[#EEE3D1] bg-white px-5 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFF0C5]">

                  <Users
                    size={20}
                    className="text-[#A97000]"
                  />
                </div>

                <h3 className="mt-3 text-[12px] font-black text-black">
                  No students found
                </h3>

                <p className="mt-1 text-[7.5px] text-[#91877C]">
                  No student records are available for this trip.
                </p>
              </div>
            )}

          {/* =================================================
              STUDENT LIST
          ================================================= */}

          {!loading &&
            !error &&
            safeStudents.length >
              0 && (
              <div className="space-y-2.5">

                {safeStudents.map(
                  (
                    student,
                    index
                  ) => {
                    const pickedUp =
                      isPickedUp(
                        student
                      );

                    const dropped =
                      isDropped(
                        student
                      );

                    const completed =
                      pickedUp &&
                      dropped;

                    return (
                      <section
                        key={
                          student._id ||
                          student.id ||
                          `${getStudentName(
                            student
                          )}-${index}`
                        }
                        className="rounded-[18px] border border-[#EEE3D1] bg-white p-4"
                      >

                        {/* =================================================
                            STUDENT HEADER
                        ================================================= */}

                        <div className="flex items-start gap-3">

                          {/* AVATAR */}

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF0C5]">

                            <UserIcon
                              name={
                                getStudentName(
                                  student
                                )
                              }
                            />
                          </div>

                          {/* STUDENT INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <div className="min-w-0">

                                <h3 className="truncate text-[11px] font-black text-black">
                                  {getStudentName(
                                    student
                                  )}
                                </h3>

                                <div className="mt-1 flex items-center gap-1">

                                  <MapPin
                                    size={10}
                                    className="shrink-0 text-[#A97000]"
                                  />

                                  <p className="truncate text-[7px] text-[#91877C]">
                                    {getSchoolName(
                                      student
                                    )}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[6px] font-black ${
                                  completed
                                    ? "bg-[#EDF6EB] text-[#4E854A]"
                                    : "bg-[#FFF0C5] text-[#936200]"
                                }`}
                              >
                                {completed
                                  ? "COMPLETED"
                                  : "PARTIAL"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* =================================================
                            PICKUP / DROP
                        ================================================= */}

                        <div className="mt-4 grid grid-cols-2 gap-2">

                          {/* PICKUP */}

                          <StatusBlock
                            title="Pickup"
                            completed={
                              pickedUp
                            }
                          />

                          {/* DROP */}

                          <StatusBlock
                            title="Drop"
                            completed={
                              dropped
                            }
                          />
                        </div>
                      </section>
                    );
                  }
                )}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT INITIAL ICON
========================================================= */

function UserIcon({
  name,
}) {
  const initials =
    String(
      name || "S"
    )
      .split(" ")
      .filter(Boolean)
      .map(
        (
          item
        ) =>
          item[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <span className="text-[10px] font-black text-[#A97000]">
      {initials}
    </span>
  );
}

/* =========================================================
   STATUS BLOCK
========================================================= */

function StatusBlock({
  title,
  completed,
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#FFF9EE] px-3 py-2.5">

      <div>

        <p className="text-[7px] font-bold text-[#91877C]">
          {title.toUpperCase()}
        </p>

        <p className="mt-0.5 text-[8px] font-black text-black">
          {completed
            ? "Completed"
            : "Not recorded"}
        </p>
      </div>

      {completed ? (
        <BadgeCheck
          size={16}
          className="text-[#4E854A]"
        />
      ) : (
        <CircleX
          size={16}
          className="text-[#C85E55]"
        />
      )}
    </div>
  );
}

export default TripDetails;