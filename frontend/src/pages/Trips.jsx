import {
  useState,
  useEffect,
} from "react";

import {
  Sun,
  Cloud,
  Users,
  Clock,
  Home,
  User,
  Receipt,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CalendarDays,
  Route,
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
   TRIPS
========================================================= */

function Trips() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "All"
  );

  const [
    tripsData,
    setTripsData,
  ] = useState(
    []
  );

  const [
    invoices,
    setInvoices,
  ] = useState(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    error,
    setError,
  ] = useState(
    ""
  );

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
          ? JSON.parse(
              stored
            )
          : null;
      } catch (
        error
      ) {
        console.error(
          "Invalid Driver data:",
          error
        );

        return null;
      }
    };

  /* =======================================================
     FETCH TRIPS
  ======================================================= */

  const fetchTrips =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const driver =
          getDriver();

        if (
          !driver?.driverId
        ) {
          navigate(
            "/"
          );

          return;
        }

        /* =================================================
           TRIP HISTORY
        ================================================= */

        const tripResponse =
          await axios.get(
            `${API}/api/trip/history/${driver.driverId}`
          );

        const tripData =
          Array.isArray(
            tripResponse.data
              ?.data
          )
            ? tripResponse
                .data.data
            : [];

        setTripsData(
          tripData
        );

        /* =================================================
           INVOICES
        ================================================= */

        try {
          const invoiceResponse =
            await axios.get(
              `${API}/api/invoices/driver/${driver.driverId}`
            );

          const invoiceData =
            Array.isArray(
              invoiceResponse
                .data?.data
            )
              ? invoiceResponse
                  .data.data
              : [];

          setInvoices(
            invoiceData
          );
        } catch (
          invoiceError
        ) {
          console.log(
            "Invoice API not ready:",
            invoiceError
          );

          setInvoices(
            []
          );
        }
      } catch (
        error
      ) {
        console.error(
          "Trips fetch error:",
          error
        );

        setError(
          error?.response
            ?.data
            ?.message ||
            "Unable to load trip history."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    fetchTrips();
  }, []);

  /* =======================================================
     TOTAL TRIPS
  ======================================================= */

  const totalTrips =
    Object.keys(
      tripsData.reduce(
        (
          accumulator,
          trip
        ) => {
          const key =
            `${
              trip.tripType
            }-${
              new Date(
                trip.createdAt
              ).toDateString()
            }`;

          accumulator[
            key
          ] =
            true;

          return accumulator;
        },
        {}
      )
    ).length;

  /* =======================================================
     INVOICE SUMMARY
  ======================================================= */

  const totalInvoices =
    invoices.length;

  const pendingInvoices =
    invoices.filter(
      (
        invoice
      ) =>
        String(
          invoice.status ||
            ""
        ).toLowerCase() ===
        "pending"
    ).length;

  /* =======================================================
     FILTER TRIPS
  ======================================================= */

  const filteredTrips =
    activeTab ===
    "All"
      ? tripsData
      : activeTab ===
          "Invoices"
      ? []
      : tripsData.filter(
          (
            trip
          ) =>
            trip?.tripType
              ?.toLowerCase() ===
            activeTab.toLowerCase()
        );

  /* =======================================================
     GROUP TRIPS

     Groups multiple student trip records
     into one trip card per trip type/date.
  ======================================================= */

  const groupedTrips =
    Object.values(
      filteredTrips.reduce(
        (
          accumulator,
          trip
        ) => {
          const key =
            `${
              trip.tripType
            }-${
              new Date(
                trip.createdAt
              ).toDateString()
            }`;

          if (
            !accumulator[
              key
            ]
          ) {
            accumulator[
              key
            ] = {
              ...trip,

              totalStudents:
                0,
            };
          }

          accumulator[
            key
          ].totalStudents +=
            1;

          return accumulator;
        },
        {}
      )
    );

  /* =======================================================
     TRIP STATUS
  ======================================================= */

  const getTripStatus =
    (
      status = ""
    ) => {
      const normalized =
        String(
          status
        )
          .trim()
          .toLowerCase();

      switch (
        normalized
      ) {
        case "completed":
          return {
            label:
              "COMPLETED",

            className:
              "bg-[#EDF6EB] text-[#4E854A]",
          };

        case "in progress":
        case "in_progress":
        case "in-progress":
          return {
            label:
              "IN PROGRESS",

            className:
              "bg-[#EAF2FF] text-[#5577A8]",
          };

        case "delayed":
          return {
            label:
              "DELAYED",

            className:
              "bg-[#FFF0C5] text-[#936200]",
          };

        case "cancelled":
          return {
            label:
              "CANCELLED",

            className:
              "bg-[#FBE7E4] text-[#B85149]",
          };

        default:
          return {
            label:
              status ||
              "NOT STARTED",

            className:
              "bg-[#F2EEE7] text-[#756D64]",
          };
      }
    };

  /* =======================================================
     INVOICE STATUS
  ======================================================= */

  const getInvoiceStatus =
    (
      status = ""
    ) => {
      const normalized =
        String(
          status
        )
          .trim()
          .toLowerCase();

      switch (
        normalized
      ) {
        case "paid":
          return {
            label:
              "PAID",

            className:
              "bg-[#EDF6EB] text-[#4E854A]",
          };

        case "overdue":
          return {
            label:
              "OVERDUE",

            className:
              "bg-[#FBE7E4] text-[#B85149]",
          };

        default:
          return {
            label:
              "PENDING",

            className:
              "bg-[#FFF0C5] text-[#936200]",
          };
      }
    };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate =
    (
      date
    ) => {
      if (!date) {
        return "-";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day:
            "numeric",

          month:
            "short",

          year:
            "numeric",
        }
      );
    };

  /* =======================================================
     FORMAT MONTH
  ======================================================= */

  const formatMonth =
    (
      month
    ) => {
      if (!month) {
        return "-";
      }

      try {
        return new Date(
          `${month}-01`
        ).toLocaleString(
          "en-IN",
          {
            month:
              "long",

            year:
              "numeric",
          }
        );
      } catch {
        return month;
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
            Loading trip history...
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

            <Route
              size={13}
              className="text-[#B87700]"
            />

            <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
              DRIVER HISTORY
            </p>
          </div>

          <h1 className="mt-2 text-[24px] font-black text-black">
            My Trips
          </h1>

          <p className="mt-1.5 max-w-[310px] text-[9px] leading-[1.6] text-[#8C8276]">
            Review your completed duties, student trips and payment records.
          </p>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-5 px-4">

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="rounded-[20px] border border-[#EEE3D1] bg-white p-3.5">

            <p className="px-1 text-[8px] font-black tracking-[0.14em] text-[#A0968A]">
              OVERVIEW
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {/* TRIPS */}

              <div className="rounded-[14px] bg-[#FFF9EE] px-2.5 py-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFF0C5]">

                  <Route
                    size={14}
                    className="text-[#A97000]"
                  />
                </div>

                <p className="mt-2 text-[18px] font-black text-black">
                  {totalTrips}
                </p>

                <p className="text-[6.5px] font-bold text-[#91877C]">
                  TRIPS
                </p>
              </div>

              {/* INVOICES */}

              <div className="rounded-[14px] bg-[#FFF9EE] px-2.5 py-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF6EB]">

                  <Receipt
                    size={14}
                    className="text-[#4E854A]"
                  />
                </div>

                <p className="mt-2 text-[18px] font-black text-black">
                  {totalInvoices}
                </p>

                <p className="text-[6.5px] font-bold text-[#91877C]">
                  INVOICES
                </p>
              </div>

              {/* PENDING */}

              <div className="rounded-[14px] bg-[#FFF9EE] px-2.5 py-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FBE7E4]">

                  <AlertCircle
                    size={14}
                    className="text-[#C85E55]"
                  />
                </div>

                <p className="mt-2 text-[18px] font-black text-black">
                  {pendingInvoices}
                </p>

                <p className="text-[6.5px] font-bold text-[#91877C]">
                  PENDING
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="mt-4 flex rounded-[15px] border border-[#EEE3D1] bg-white p-1">

            {[
              "All",
              "Morning",
              "Afternoon",
              "Invoices",
            ].map(
              (
                tab
              ) => (
                <button
                  key={
                    tab
                  }
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab
                    )
                  }
                  className={`flex-1 rounded-[11px] py-2.5 text-[7px] font-black transition ${
                    activeTab ===
                    tab
                      ? "bg-[#FFF0C5] text-[#936200]"
                      : "text-[#8F857A]"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* =================================================
              SECTION TITLE
          ================================================= */}

          <div className="mb-3 mt-5 px-1">

            <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
              {activeTab ===
              "Invoices"
                ? "PAYMENT RECORDS"
                : "TRIP HISTORY"}
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-[18px] font-black text-black">

                {activeTab ===
                "Invoices"
                  ? "Your Invoices"
                  : activeTab ===
                      "All"
                  ? "Recent Trips"
                  : `${activeTab} Trips`}
              </h2>

              <span className="text-[7px] font-bold text-[#91877C]">

                {activeTab ===
                "Invoices"
                  ? `${invoices.length} TOTAL`
                  : `${groupedTrips.length} TOTAL`}
              </span>
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-3 rounded-[17px] border border-[#F0D1CC] bg-white p-4 text-center">

              <AlertCircle
                size={20}
                className="mx-auto text-[#C85E55]"
              />

              <p className="mt-2 text-[9px] font-black text-[#A64D45]">
                Unable to load trips
              </p>

              <p className="mt-1 text-[7px] leading-4 text-[#9A756F]">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchTrips
                }
                className="mt-3 rounded-[11px] bg-[#FFB000] px-4 py-2.5 text-[7px] font-black text-black"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* =================================================
              TRIPS
          ================================================= */}

          {activeTab !==
          "Invoices" ? (
            <>

              {/* EMPTY */}

              {!error &&
                groupedTrips.length ===
                  0 && (
                  <div className="rounded-[20px] border border-[#EEE3D1] bg-white py-12 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFF0C5]">

                      <Route
                        size={20}
                        className="text-[#A97000]"
                      />
                    </div>

                    <h3 className="mt-3 text-[12px] font-black text-black">
                      No trips found
                    </h3>

                    <p className="mt-1 text-[7.5px] text-[#91877C]">
                      Your completed trips will appear here.
                    </p>
                  </div>
                )}

              {/* TRIP LIST */}

              {!error &&
                groupedTrips.length >
                  0 && (
                  <div className="space-y-2.5">

                    {groupedTrips.map(
                      (
                        trip
                      ) => {
                        const status =
                          getTripStatus(
                            trip.status
                          );

                        const isMorning =
                          String(
                            trip.tripType ||
                              ""
                          ).toLowerCase() ===
                          "morning";

                        const driver =
                          getDriver();

                        return (
                          <button
                            key={`${trip.tripType}-${new Date(
                              trip.createdAt
                            ).toDateString()}`}
                            type="button"
                            onClick={() =>
                              navigate(
                                "/trip-details",
                                {
                                  state: {
                                    driverId:
                                      driver?.driverId,

                                    tripType:
                                      trip.tripType,

                                    tripDate:
                                      trip.createdAt,
                                  },
                                }
                              )
                            }
                            className="w-full rounded-[18px] border border-[#EEE3D1] bg-white p-4 text-left"
                          >

                            {/* HEADER */}

                            <div className="flex items-start gap-3">

                              {/* ICON */}

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0C5]">

                                {isMorning ? (
                                  <Cloud
                                    size={18}
                                    className="text-[#A97000]"
                                  />
                                ) : (
                                  <Sun
                                    size={18}
                                    className="text-[#A97000]"
                                  />
                                )}
                              </div>

                              {/* DETAILS */}

                              <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-2">

                                  <div>

                                    <p className="text-[7px] font-black tracking-[0.12em] text-[#A0968A]">
                                      DUTY HISTORY
                                    </p>

                                    <h3 className="mt-1 text-[12px] font-black capitalize text-black">
                                      {trip.tripType} Trip
                                    </h3>
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-[6px] font-black ${status.className}`}
                                  >
                                    {
                                      status.label
                                    }
                                  </span>
                                </div>

                                <div className="mt-1.5 flex items-center gap-1.5">

                                  <CalendarDays
                                    size={10}
                                    className="text-[#A97000]"
                                  />

                                  <span className="text-[7px] font-semibold text-[#8A8177]">
                                    {formatDate(
                                      trip.createdAt
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* STATS */}

                            <div className="mt-3 grid grid-cols-2 gap-2">

                              <div className="flex items-center gap-2 rounded-[11px] bg-[#FFF9EE] px-3 py-2.5">

                                <Users
                                  size={13}
                                  className="text-[#A97000]"
                                />

                                <div>

                                  <p className="text-[8px] font-black text-black">
                                    {
                                      trip.totalStudents
                                    }
                                  </p>

                                  <p className="text-[6px] text-[#92887D]">
                                    Students
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 rounded-[11px] bg-[#FFF9EE] px-3 py-2.5">

                                <Clock
                                  size={13}
                                  className="text-[#A97000]"
                                />

                                <div>

                                  <p className="text-[8px] font-black text-black">
                                    {trip.duration ||
                                      "N/A"}
                                  </p>

                                  <p className="text-[6px] text-[#92887D]">
                                    Minutes
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* FOOTER */}

                            <div className="mt-3 flex items-center justify-between border-t border-[#F1E9DC] pt-3">

                              <p className="text-[7px] font-semibold text-[#8A8177]">
                                View student trip details
                              </p>

                              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFF0C5]">

                                <ChevronRight
                                  size={14}
                                  className="text-[#A97000]"
                                />
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
            </>
          ) : (
            /* =================================================
               INVOICES
            ================================================= */

            <>
              {/* EMPTY */}

              {invoices.length ===
                0 && (
                <div className="rounded-[20px] border border-[#EEE3D1] bg-white py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFF0C5]">

                    <Receipt
                      size={20}
                      className="text-[#A97000]"
                    />
                  </div>

                  <h3 className="mt-3 text-[12px] font-black text-black">
                    No invoices available
                  </h3>

                  <p className="mt-1 text-[7.5px] text-[#91877C]">
                    Driver payment records will appear here.
                  </p>
                </div>
              )}

              {/* INVOICE LIST */}

              {invoices.length >
                0 && (
                <div className="space-y-2.5">

                  {invoices.map(
                    (
                      invoice
                    ) => {
                      const status =
                        getInvoiceStatus(
                          invoice.status
                        );

                      return (
                        <section
                          key={
                            invoice._id
                          }
                          className="rounded-[18px] border border-[#EEE3D1] bg-white p-4"
                        >

                          {/* HEADER */}

                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF0C5]">

                              <Receipt
                                size={16}
                                className="text-[#A97000]"
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <div>

                                  <p className="text-[7px] font-black tracking-[0.12em] text-[#A0968A]">
                                    INVOICE
                                  </p>

                                  <h3 className="mt-1 text-[11px] font-black text-black">
                                    {invoice.invoiceNumber ||
                                      "Invoice"}
                                  </h3>
                                </div>

                                <span
                                  className={`rounded-full px-2 py-1 text-[6px] font-black ${status.className}`}
                                >
                                  {
                                    status.label
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* DETAILS */}

                          <div className="mt-3 grid grid-cols-2 gap-2">

                            {/* STUDENT */}

                            <InvoiceItem
                              label="Student"
                              value={
                                invoice.childId
                                  ?.name ||
                                "Not Available"
                              }
                            />

                            {/* MONTH */}

                            <InvoiceItem
                              label="Month"
                              value={
                                formatMonth(
                                  invoice.month
                                )
                              }
                            />

                            {/* AMOUNT */}

                            <div className="rounded-[12px] bg-[#FFF9EE] px-3 py-2.5">

                              <div className="flex items-center gap-1">

                                <IndianRupee
                                  size={10}
                                  className="text-[#A97000]"
                                />

                                <p className="text-[6px] font-bold text-[#91877C]">
                                  AMOUNT
                                </p>
                              </div>

                              <p className="mt-1 text-[10px] font-black text-black">
                                ₹
                                {invoice.totalAmount ??
                                  0}
                              </p>
                            </div>

                            {/* DUE DATE */}

                            <InvoiceItem
                              label="Due Date"
                              value={
                                formatDate(
                                  invoice.dueDate
                                )
                              }
                            />
                          </div>

                          {/* PAID DATE */}

                          {String(
                            invoice.status ||
                              ""
                          ).toLowerCase() ===
                            "paid" &&
                            invoice.paidAt && (
                              <div className="mt-2 flex items-center gap-2 rounded-[11px] bg-[#EDF6EB] px-3 py-2">

                                <CheckCircle2
                                  size={12}
                                  className="text-[#4E854A]"
                                />

                                <p className="text-[7px] font-bold text-[#4E854A]">
                                  Paid on{" "}
                                  {formatDate(
                                    invoice.paidAt
                                  )}
                                </p>
                              </div>
                            )}
                        </section>
                      );
                    }
                  )}
                </div>
              )}
            </>
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
                  "Trips";

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
   INVOICE ITEM
========================================================= */

function InvoiceItem({
  label,
  value,
}) {
  return (
    <div className="rounded-[12px] bg-[#FFF9EE] px-3 py-2.5">

      <p className="text-[6px] font-bold uppercase text-[#91877C]">
        {label}
      </p>

      <p className="mt-1 break-words text-[8px] font-black leading-[1.4] text-black">
        {value ||
          "Not Available"}
      </p>
    </div>
  );
}

export default Trips;