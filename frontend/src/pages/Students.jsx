import {
  useState,
  useEffect,
} from "react";

import {
  Search,
  Users,
  Home,
  Clock,
  User,
  MapPin,
  School,
  Navigation,
  CheckCircle2,
  CircleDot,
  UserCheck,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "../utils/axiosInstance";

/* =========================================================
   API
========================================================= */

const API =
  "https://asan-driverapp.onrender.com";

/* =========================================================
   STUDENTS
========================================================= */

function Students() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    studentsData,
    setStudentsData,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     GET DRIVER
  ======================================================= */

  const getDriver =
    () => {
      try {
        const stored =
          localStorage.getItem(
            "driver"
          );

        return stored
          ? JSON.parse(stored)
          : null;
      } catch (error) {
        console.error(
          "Invalid Driver data:",
          error
        );

        return null;
      }
    };

  /* =======================================================
     FETCH STUDENTS
  ======================================================= */

  const fetchStudents =
    async () => {
      try {
        setLoading(true);
        setError("");

        const driver =
          getDriver();

        if (
          !driver?.driverId
        ) {
          navigate("/");
          return;
        }

        const response =
          await axios.get(
            `${API}/api/children/driver/${driver.driverId}`
          );

        const students =
          Array.isArray(
            response.data?.data
          )
            ? response.data.data
            : [];

        const normalizedStudents =
          students.map(
            (
              student
            ) => ({
              ...student,

              status:
                student.status ||
                "waiting",
            })
          );

        setStudentsData(
          normalizedStudents
        );
      } catch (error) {
        console.error(
          "Students fetch error:",
          error
        );

        setStudentsData([]);

        setError(
          error?.response?.data
            ?.message ||
            "Unable to load assigned students."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    fetchStudents();
  }, []);

  /* =======================================================
     NORMALIZE STATUS
  ======================================================= */

  const normalizeStatus =
    (
      status
    ) => {
      return String(
        status || "waiting"
      )
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");
    };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredStudents =
    studentsData.filter(
      (
        student
      ) => {
        const name =
          String(
            student?.name ||
              ""
          ).toLowerCase();

        const school =
          String(
            student?.school ||
              student?.schoolName ||
              ""
          ).toLowerCase();

        const term =
          search
            .trim()
            .toLowerCase();

        return (
          name.includes(
            term
          ) ||
          school.includes(
            term
          )
        );
      }
    );

  /* =======================================================
     SUMMARY
  ======================================================= */

  const waiting =
    studentsData.filter(
      (
        student
      ) =>
        normalizeStatus(
          student.status
        ) === "waiting"
    ).length;

  const onboard =
    studentsData.filter(
      (
        student
      ) =>
        normalizeStatus(
          student.status
        ) === "onboard" ||
        normalizeStatus(
          student.status
        ) === "on board"
    ).length;

  const dropped =
    studentsData.filter(
      (
        student
      ) =>
        normalizeStatus(
          student.status
        ) === "dropped" ||
        normalizeStatus(
          student.status
        ) === "completed"
    ).length;

  /* =======================================================
     NEXT STUDENT
  ======================================================= */

  const nextStudent =
    studentsData.find(
      (
        student
      ) =>
        normalizeStatus(
          student.status
        ) === "waiting"
    );

  /* =======================================================
     STUDENT INITIALS
  ======================================================= */

  const getInitials =
    (
      name
    ) => {
      if (!name) {
        return "ST";
      }

      return String(name)
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
    };

  /* =======================================================
     STATUS STYLE
  ======================================================= */

  const getStatusStyle =
    (
      status
    ) => {
      const normalized =
        normalizeStatus(
          status
        );

      if (
        normalized ===
        "waiting"
      ) {
        return {
          label:
            "WAITING",

          className:
            "bg-[#FFF0C5] text-[#936200]",

          icon:
            CircleDot,
        };
      }

      if (
        normalized ===
          "onboard" ||
        normalized ===
          "on board"
      ) {
        return {
          label:
            "ON BOARD",

          className:
            "bg-[#EDF6EB] text-[#4E854A]",

          icon:
            UserCheck,
        };
      }

      if (
        normalized ===
          "dropped" ||
        normalized ===
          "completed"
      ) {
        return {
          label:
            "DROPPED",

          className:
            "bg-[#EEEAFB] text-[#7564A8]",

          icon:
            CheckCircle2,
        };
      }

      return {
        label:
          String(
            status ||
              "Waiting"
          ).toUpperCase(),

        className:
          "bg-[#F2EEE7] text-[#756D64]",

        icon:
          CircleDot,
      };
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
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">

      <div className="relative min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE] pb-24">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[135px] -top-[155px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/75" />

        <div className="pointer-events-none absolute -left-[190px] top-[560px] h-[300px] w-[300px] rounded-full bg-[#FFF2D1]/45" />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="relative z-10 px-5 pt-5">

          <div className="flex items-center gap-2">

            <Users
              size={13}
              className="text-[#B87700]"
            />

            <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
              ASSIGNED STUDENTS
            </p>
          </div>

          <h1 className="mt-2 text-[24px] font-black text-black">
            My Students
          </h1>

          <p className="mt-1.5 text-[9px] leading-[1.6] text-[#8C8276]">
            {studentsData.length} students currently assigned to you.
          </p>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-5 px-4">

          {/* =================================================
              STATUS SUMMARY
          ================================================= */}

          <section className="rounded-[20px] border border-[#EEE3D1] bg-white p-3.5">

            <p className="px-1 text-[8px] font-black tracking-[0.14em] text-[#A0968A]">
              TRIP STATUS
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {/* WAITING */}

              <StatusBox
                icon={
                  CircleDot
                }
                label="Waiting"
                value={
                  waiting
                }
                type="waiting"
              />

              {/* ONBOARD */}

              <StatusBox
                icon={
                  UserCheck
                }
                label="On Board"
                value={
                  onboard
                }
                type="onboard"
              />

              {/* DROPPED */}

              <StatusBox
                icon={
                  CheckCircle2
                }
                label="Dropped"
                value={
                  dropped
                }
                type="dropped"
              />
            </div>
          </section>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mt-4">

            <div className="flex h-11 items-center gap-2.5 rounded-[14px] border border-[#EEE3D1] bg-white px-3.5">

              <Search
                size={15}
                className="shrink-0 text-[#A97000]"
              />

              <input
                type="text"
                placeholder="Search student or school..."
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                className="min-w-0 flex-1 bg-transparent text-[8.5px] font-semibold text-black outline-none placeholder:text-[#AAA095]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-[7px] font-black text-[#A97000]"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="mb-3 mt-5 px-1">

            <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
              STUDENT LIST
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-[18px] font-black text-black">
                Assigned Students
              </h2>

              <p className="text-[7px] font-bold text-[#91877C]">
                {filteredStudents.length} SHOWN
              </p>
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-3 rounded-[17px] border border-[#F0D1CC] bg-white p-4 text-center">

              <p className="text-[9px] font-black text-[#A64D45]">
                Unable to load students
              </p>

              <p className="mt-1 text-[7px] leading-4 text-[#9A756F]">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchStudents
                }
                className="mt-3 rounded-[11px] bg-[#FFB000] px-4 py-2.5 text-[7px] font-black text-black"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!error &&
            filteredStudents.length ===
              0 && (
              <div className="rounded-[20px] border border-[#EEE3D1] bg-white py-12 text-center">

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
                  Try another name or school.
                </p>
              </div>
            )}

          {/* =================================================
              STUDENT LIST
          ================================================= */}

          {!error &&
            filteredStudents.length >
              0 && (
              <div className="space-y-2.5">

                {filteredStudents.map(
                  (
                    student
                  ) => {
                    const status =
                      getStatusStyle(
                        student.status
                      );

                    const StatusIcon =
                      status.icon;

                    const isNext =
                      nextStudent?._id ===
                      student._id;

                    return (
                      <section
                        key={
                          student._id
                        }
                        className="rounded-[18px] border border-[#EEE3D1] bg-white p-4"
                      >

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="flex items-start gap-3">

                          {/* AVATAR */}

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0C5]">

                            <span className="text-[10px] font-black text-[#A97000]">
                              {getInitials(
                                student.name
                              )}
                            </span>
                          </div>

                          {/* INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <div className="min-w-0">

                                <h3 className="truncate text-[11px] font-black text-black">
                                  {student.name ||
                                    "Student"}
                                </h3>

                                <div className="mt-1 flex items-center gap-1">

                                  <School
                                    size={10}
                                    className="shrink-0 text-[#A97000]"
                                  />

                                  <p className="truncate text-[7px] text-[#91877C]">
                                    {student.grade ||
                                      "-"}
                                    {" • "}
                                    {student.school ||
                                      student.schoolName ||
                                      "School not available"}
                                  </p>
                                </div>
                              </div>

                              {/* STATUS */}

                              <span
                                className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[6px] font-black ${status.className}`}
                              >
                                <StatusIcon
                                  size={9}
                                />

                                {
                                  status.label
                                }
                              </span>
                            </div>

                            {/* NEXT PICKUP */}

                            {isNext && (
                              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#FFF0C5] px-2 py-1">

                                <Navigation
                                  size={8}
                                  className="text-[#A97000]"
                                />

                                <span className="text-[6px] font-black text-[#936200]">
                                  NEXT PICKUP
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* =================================================
                            LOCATIONS
                        ================================================= */}

                        <div className="mt-3 grid grid-cols-2 gap-2">

                          {/* PICKUP */}

                          <LocationBlock
                            label="Pickup"
                            time={
                              student.pickupTime ||
                              "--"
                            }
                            location={
                              student.pickupLocation ||
                              "--"
                            }
                          />

                          {/* DROP */}

                          <LocationBlock
                            label="Drop"
                            time={
                              student.eveningPickup ||
                              student.dropTime ||
                              "--"
                            }
                            location={
                              student.dropoffLocation ||
                              student.dropLocation ||
                              "--"
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

        {/* =================================================
            BOTTOM NAV
        ================================================= */}

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
              (
                item
              ) => {
                const Icon =
                  item.icon;

                const active =
                  item.label ===
                  "Students";

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
                      {
                        item.label
                      }
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
   STATUS BOX
========================================================= */

function StatusBox({
  icon: Icon,
  label,
  value,
  type,
}) {
  const styles = {
    waiting: {
      bg:
        "bg-[#FFF0C5]",

      text:
        "text-[#936200]",
    },

    onboard: {
      bg:
        "bg-[#EDF6EB]",

      text:
        "text-[#4E854A]",
    },

    dropped: {
      bg:
        "bg-[#EEEAFB]",

      text:
        "text-[#7564A8]",
    },
  };

  const style =
    styles[type] ||
    styles.waiting;

  return (
    <div className="rounded-[14px] bg-[#FFF9EE] px-2.5 py-3">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${style.bg}`}
      >
        <Icon
          size={13}
          className={
            style.text
          }
        />
      </div>

      <p className="mt-2 text-[17px] font-black text-black">
        {value}
      </p>

      <p className="text-[6.5px] font-bold uppercase text-[#91877C]">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   LOCATION BLOCK
========================================================= */

function LocationBlock({
  label,
  time,
  location,
}) {
  return (
    <div className="min-w-0 rounded-[12px] bg-[#FFF9EE] px-3 py-2.5">

      <div className="flex items-center gap-1.5">

        <MapPin
          size={10}
          className="shrink-0 text-[#A97000]"
        />

        <p className="text-[6px] font-black uppercase text-[#91877C]">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-[8px] font-black text-black">
        {time}
      </p>

      <p className="mt-0.5 line-clamp-2 text-[6.5px] leading-[1.4] text-[#8A8177]">
        {location}
      </p>
    </div>
  );
}

export default Students;