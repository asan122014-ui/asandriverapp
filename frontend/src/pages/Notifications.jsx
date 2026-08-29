import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "../utils/axiosInstance";

import { io } from "socket.io-client";

import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

/* =========================================================
   SOCKET SERVER
========================================================= */

const SOCKET_URL =
  "https://asan-driverapp.onrender.com";

/* =========================================================
   NOTIFICATION SOUND
========================================================= */

const NOTIFICATION_SOUND =
  "/notification.mp3";

/* =========================================================
   NOTIFICATIONS
========================================================= */

function Notifications() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    notifications,
    setNotifications,
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
     REFS
  ======================================================= */

  const socketRef =
    useRef(null);

  const audioRef =
    useRef(null);

  const isFirstLoad =
    useRef(true);

  const markingAllReadRef =
    useRef(false);

  /* =======================================================
     DRIVER
  ======================================================= */

  const getDriver =
    useCallback(() => {
      try {
        const data =
          localStorage.getItem(
            "driver"
          );

        return data
          ? JSON.parse(data)
          : null;
      } catch (error) {
        console.error(
          "Invalid Driver data:",
          error
        );

        localStorage.removeItem(
          "driver"
        );

        return null;
      }
    }, []);

  /* =======================================================
     INITIALIZE AUDIO

     Important:
     We only create the Audio object here.

     We DO NOT:
     - autoplay it
     - mute/play/pause it
     - preload it manually

     This avoids the localhost cache/media issue.
  ======================================================= */

  useEffect(() => {
    try {
      const audio =
        new Audio(
          NOTIFICATION_SOUND
        );

      audio.preload =
        "none";

      audio.volume =
        1;

      audioRef.current =
        audio;
    } catch (error) {
      console.warn(
        "Notification audio initialization failed:",
        error
      );

      audioRef.current =
        null;
    }

    return () => {
      if (
        audioRef.current
      ) {
        try {
          audioRef.current.pause();

          audioRef.current.currentTime =
            0;
        } catch {
          // Ignore cleanup errors.
        }

        audioRef.current =
          null;
      }
    };
  }, []);

  /* =======================================================
     PLAY NOTIFICATION SOUND
  ======================================================= */

  const playSound =
    useCallback(() => {
      try {
        let audio =
          audioRef.current;

        /*
          If audio object was unavailable,
          create a fresh one.
        */

        if (!audio) {
          audio =
            new Audio(
              NOTIFICATION_SOUND
            );

          audio.preload =
            "none";

          audioRef.current =
            audio;
        }

        /*
          Reset before playing.
        */

        audio.currentTime =
          0;

        const playPromise =
          audio.play();

        if (
          playPromise &&
          typeof playPromise.catch ===
            "function"
        ) {
          playPromise.catch(
            (
              error
            ) => {
              /*
                NotAllowedError simply means
                the browser blocked audio because
                the user has not interacted yet.

                This should not break notifications.
              */

              if (
                error?.name ===
                "NotAllowedError"
              ) {
                console.log(
                  "Notification sound blocked until user interaction."
                );

                return;
              }

              console.warn(
                "Notification sound failed:",
                error?.message ||
                  error
              );
            }
          );
        }
      } catch (error) {
        console.warn(
          "Notification sound error:",
          error?.message ||
            error
        );
      }
    }, []);

  /* =======================================================
     MARK ALL AS READ
  ======================================================= */

  const markAllAsRead =
    useCallback(
      async (
        driverId,
        items
      ) => {
        if (
          !driverId ||
          !Array.isArray(
            items
          )
        ) {
          return;
        }

        const hasUnread =
          items.some(
            (
              notification
            ) =>
              !notification.read
          );

        if (
          !hasUnread
        ) {
          return;
        }

        if (
          markingAllReadRef.current
        ) {
          return;
        }

        markingAllReadRef.current =
          true;

        /*
          Immediately mark them as read
          in frontend state.

          Nothing is removed from the page.
        */

        setNotifications(
          (
            previous
          ) =>
            previous.map(
              (
                notification
              ) => ({
                ...notification,

                read:
                  true,
              })
            )
        );

        try {
          /*
            One request marks all Driver
            notifications as read.

            Backend keeps them stored.

            MongoDB removes them only after
            the configured 4-day TTL.
          */

          await axios.put(
            `/notifications/read-all?driverId=${encodeURIComponent(
              driverId
            )}`
          );

          console.log(
            "✅ Driver notifications marked as read"
          );
        } catch (error) {
          console.error(
            "❌ Mark all notifications read failed:",
            error?.response?.data ||
              error
          );
        } finally {
          markingAllReadRef.current =
            false;
        }
      },
      []
    );

  /* =======================================================
     MARK SINGLE NOTIFICATION AS READ

     Used only when a NEW notification arrives
     while this page is already open.
  ======================================================= */

  const markSingleAsRead =
    useCallback(
      async (
        id
      ) => {
        if (!id) {
          return;
        }

        try {
          await axios.put(
            `/notifications/${id}/read`
          );
        } catch (error) {
          console.error(
            "❌ Mark notification read failed:",
            error?.response?.data ||
              error
          );
        }
      },
      []
    );

  /* =======================================================
     FETCH DRIVER NOTIFICATIONS
  ======================================================= */

  const fetchNotifications =
    useCallback(
      async () => {
        try {
          const driver =
            getDriver();

          const accessToken =
            localStorage.getItem(
              "accessToken"
            );

          if (
            !driver?.driverId ||
            !accessToken
          ) {
            setError(
              "Driver session expired. Please login again."
            );

            return;
          }

          /*
            Backend returns BOTH:
            - read notifications
            - unread notifications

            Therefore read notifications remain
            visible on this page.
          */

          const response =
            await axios.get(
              "/notifications"
            );

          const data =
            Array.isArray(
              response?.data?.data
            )
              ? response.data.data
              : [];

          setNotifications(
            data
          );

          setError("");

          /*
            Opening Notifications means all
            currently available notifications
            are considered viewed.
          */

          await markAllAsRead(
            driver.driverId,
            data
          );
        } catch (error) {
          console.error(
            "❌ Notification fetch error:",
            error?.response?.data ||
              error
          );

          setError(
            error?.response?.data
              ?.message ||
              "Failed to load notifications"
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        getDriver,
        markAllAsRead,
      ]
    );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    let timer;

    const load =
      async () => {
        await fetchNotifications();

        /*
          Prevent existing notifications from
          playing sound when the page initially loads.
        */

        timer =
          setTimeout(
            () => {
              isFirstLoad.current =
                false;
            },
            500
          );
      };

    load();

    return () => {
      if (timer) {
        clearTimeout(
          timer
        );
      }
    };
  }, [
    fetchNotifications,
  ]);

  /* =======================================================
     SOCKET.IO
  ======================================================= */

  useEffect(() => {
    const driver =
      getDriver();

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (
      !driver?.driverId ||
      !token
    ) {
      return;
    }

    const socket =
      io(
        SOCKET_URL,
        {
          auth: {
            token,
          },

          transports: [
            "polling",
            "websocket",
          ],

          upgrade:
            true,

          rememberUpgrade:
            true,

          reconnection:
            true,

          reconnectionAttempts:
            Infinity,

          reconnectionDelay:
            1000,

          reconnectionDelayMax:
            5000,

          timeout:
            20000,
        }
      );

    socketRef.current =
      socket;

    /* =====================================================
       CONNECT
    ===================================================== */

    socket.on(
      "connect",
      () => {
        console.log(
          "✅ Notification socket connected:",
          socket.id
        );

        console.log(
          "📡 Notification transport:",
          socket.io.engine
            .transport.name
        );

        socket.emit(
          "join_driver_room",
          {
            driverId:
              driver.driverId,
          }
        );
      }
    );

    /* =====================================================
       UPGRADE
    ===================================================== */

    socket.io.engine.on(
      "upgrade",
      (
        transport
      ) => {
        console.log(
          "⬆️ Notification socket upgraded to:",
          transport.name
        );
      }
    );

    /* =====================================================
       CONNECTION ERROR
    ===================================================== */

    socket.on(
      "connect_error",
      (
        socketError
      ) => {
        console.error(
          "❌ Notification socket error:",
          socketError.message
        );
      }
    );

    /* =====================================================
       NEW NOTIFICATION
    ===================================================== */

    const handleNotification =
      async (
        data
      ) => {
        if (
          !data?._id
        ) {
          return;
        }

        console.log(
          "🔔 New notification:",
          data
        );

        let added =
          false;

        /*
          Driver is already looking at
          Notifications.

          So the notification becomes
          read immediately.

          But it stays visible.
        */

        setNotifications(
          (
            previous
          ) => {
            const exists =
              previous.some(
                (
                  notification
                ) =>
                  notification._id ===
                  data._id
              );

            if (exists) {
              return previous;
            }

            added =
              true;

            return [
              {
                ...data,

                read:
                  true,

                createdAt:
                  data.createdAt ||
                  new Date().toISOString(),
              },

              ...previous,
            ];
          }
        );

        /*
          Persist read:true in MongoDB.
        */

        await markSingleAsRead(
          data._id
        );

        /*
          Play sound only for a genuinely
          new realtime notification.

          Existing notifications never play
          sound when the page loads.
        */

        if (
          added &&
          !isFirstLoad.current
        ) {
          playSound();
        }
      };

    socket.on(
      "new_notification",
      handleNotification
    );

    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on(
      "disconnect",
      (
        reason
      ) => {
        console.log(
          "🔌 Notification socket disconnected:",
          reason
        );
      }
    );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      socket.off(
        "new_notification",
        handleNotification
      );

      socket.removeAllListeners();

      socket.io.removeAllListeners();

      socket.disconnect();

      socketRef.current =
        null;
    };
  }, [
    getDriver,
    markSingleAsRead,
    playSound,
  ]);

  /* =======================================================
     TIME FORMAT
  ======================================================= */

  const formatTime =
    (
      date
    ) => {
      if (!date) {
        return "";
      }

      const created =
        new Date(date);

      if (
        Number.isNaN(
          created.getTime()
        )
      ) {
        return "";
      }

      const now =
        new Date();

      const difference =
        Math.floor(
          (
            now.getTime() -
            created.getTime()
          ) /
            60000
        );

      if (
        difference <
        1
      ) {
        return "Just now";
      }

      if (
        difference <
        60
      ) {
        return `${difference} min ago`;
      }

      if (
        difference <
        1440
      ) {
        return `${Math.floor(
          difference /
            60
        )} hr ago`;
      }

      return created.toLocaleDateString(
        "en-IN",
        {
          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric",
        }
      );
    };

  /* =======================================================
     PRIORITY STYLE

     ALL NOTIFICATION CARDS ARE WHITE.
  ======================================================= */

  const getPriorityStyle =
    (
      priority
    ) => {
      switch (
        priority
      ) {
        case "high":
          return {
            iconBg:
              "bg-[#FBE7E4]",

            iconColor:
              "text-[#C85E55]",

            label:
              "URGENT",

            labelStyle:
              "bg-[#FBE7E4] text-[#B85149]",

            Icon:
              AlertTriangle,
          };

        case "medium":
          return {
            iconBg:
              "bg-[#FFF0C5]",

            iconColor:
              "text-[#A97000]",

            label:
              "UPDATE",

            labelStyle:
              "bg-[#FFF0C5] text-[#936200]",

            Icon:
              Bell,
          };

        default:
          return {
            iconBg:
              "bg-[#F2EEE7]",

            iconColor:
              "text-[#7E756B]",

            label:
              "INFO",

            labelStyle:
              "bg-[#F1EEE8] text-[#827A71]",

            Icon:
              Info,
          };
      }
    };

  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry =
    async () => {
      setLoading(
        true
      );

      setError("");

      await fetchNotifications();
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">
      <div className="relative min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE]">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[130px] -top-[150px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/75" />

        <div className="pointer-events-none absolute -left-[190px] top-[430px] h-[300px] w-[300px] rounded-full bg-[#FFF2D1]/45" />

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

          {/* HEADER TEXT */}

          <div className="-mt-7">
            <div className="flex items-center gap-2">
              <Bell
                size={13}
                className="text-[#B87700]"
              />

              <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
                DRIVER ALERTS
              </p>
            </div>

            <h1 className="mt-2 text-[24px] leading-tight font-black text-black">
              Notifications
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[9px] leading-[1.6] text-[#8C8276]">
              Stay updated with duty alerts, trip changes and important driver information.
            </p>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-6 px-4 pb-8">

          {/* =================================================
              STATUS
          ================================================= */}

          {!loading &&
            !error && (
              <section className="flex items-center justify-between rounded-[18px] border border-[#EEE3D1] bg-white px-4 py-3.5">
                <div>
                  <p className="text-[8px] font-black tracking-[0.13em] text-[#A0968A]">
                    NOTIFICATION STATUS
                  </p>

                  <p className="mt-1 text-[12px] font-black text-black">
                    You're all caught up
                  </p>

                  <p className="mt-0.5 text-[7px] text-[#948A7E]">
                    All notifications have been viewed
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#EDF6EB]">
                  <CheckCircle2
                    size={17}
                    className="text-[#4E854A]"
                  />
                </div>
              </section>
            )}

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <div className="mb-3 mt-6 px-1">
            <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
              RECENT ACTIVITY
            </p>

            <h2 className="mt-1.5 text-[18px] font-black text-black">
              Your Alerts
            </h2>

            {!loading &&
              !error &&
              notifications.length >
                0 && (
                <p className="mt-1 text-[8px] text-[#948A7E]">
                  Alerts remain visible for up to 4 days.
                </p>
              )}
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-9 w-9 rounded-full border-[3px] border-[#FFB000] border-t-transparent animate-spin" />

              <p className="mt-4 text-[9px] font-medium text-[#8C8276]">
                Loading alerts...
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading &&
            error && (
              <div className="rounded-[18px] border border-[#F0D1CC] bg-white p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FBE7E4]">
                  <AlertTriangle
                    size={20}
                    className="text-[#C85E55]"
                  />
                </div>

                <p className="mt-3 text-[11px] font-black text-[#A64D45]">
                  Unable to load notifications
                </p>

                <p className="mt-1 text-[8px] leading-4 text-[#9A756F]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    handleRetry
                  }
                  className="mt-4 h-10 rounded-[13px] bg-[#FFB000] px-5 text-[8px] font-black text-black"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            notifications.length ===
              0 && (
              <div className="rounded-[22px] border border-[#EEE3D1] bg-white px-5 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#FFF0C5]">
                  <Bell
                    size={23}
                    className="text-[#A97000]"
                  />
                </div>

                <h2 className="mt-4 text-[15px] font-black text-black">
                  No Notifications
                </h2>

                <p className="mx-auto mt-2 max-w-[250px] text-[8px] leading-[1.7] text-[#94897C]">
                  New trip assignments, safety alerts and driver updates will appear here.
                </p>
              </div>
            )}

          {/* =================================================
              NOTIFICATION LIST
          ================================================= */}

          {!loading &&
            !error &&
            notifications.length >
              0 && (
              <div className="space-y-2.5">
                {notifications.map(
                  (
                    notification
                  ) => {
                    const priority =
                      getPriorityStyle(
                        notification.priority
                      );

                    const Icon =
                      priority.Icon;

                    return (
                      <div
                        key={
                          notification._id
                        }
                        className="w-full rounded-[18px] border border-[#EEE3D1] bg-white p-4"
                      >
                        <div className="flex items-start gap-3">

                          {/* ICON */}

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${priority.iconBg}`}
                          >
                            <Icon
                              size={17}
                              className={
                                priority.iconColor
                              }
                            />
                          </div>

                          {/* CONTENT */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">

                                {/* PRIORITY */}

                                <span
                                  className={`inline-flex rounded-full px-2 py-0.5 text-[6px] font-black ${priority.labelStyle}`}
                                >
                                  {
                                    priority.label
                                  }
                                </span>

                                {/* TITLE */}

                                <h3 className="mt-2 text-[11px] font-black leading-4 text-black">
                                  {notification.title ||
                                    "Driver Notification"}
                                </h3>
                              </div>

                              {/* TIME */}

                              <span className="shrink-0 text-[7px] font-medium text-[#A59A8D]">
                                {formatTime(
                                  notification.createdAt
                                )}
                              </span>
                            </div>

                            {/* MESSAGE */}

                            <p className="mt-2 text-[9px] leading-[1.65] text-[#776E64]">
                              {
                                notification.message
                              }
                            </p>
                          </div>
                        </div>
                      </div>
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

export default Notifications;