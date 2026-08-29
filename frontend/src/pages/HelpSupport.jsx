import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ChevronDown,
  MessageCircle,
  ArrowLeft,
  Headphones,
  FileText,
  CheckCircle2,
  X,
  Route,
  Users,
  MapPin,
  Camera,
  Bell,
  User,
  Car,
  WalletCards,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   HELP & SUPPORT
========================================================= */

function HelpSupport() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATES
  ======================================================= */

  const [
    openFAQ,
    setOpenFAQ,
  ] = useState(null);

  const [
    showChat,
    setShowChat,
  ] = useState(false);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] = useState(null);

  const [
    subject,
    setSubject,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    ticketSubmitted,
    setTicketSubmitted,
  ] = useState(false);

  /* =======================================================
     FAQS
  ======================================================= */

  const faqs = [
    {
      question:
        "How do I start a trip?",

      answer:
        "Open the Dashboard, select the Morning or Afternoon duty, then slide the Start Trip control. GPS tracking and camera access will start automatically.",
    },

    {
      question:
        "How do I complete a trip?",

      answer:
        "After completing all assigned student drop-offs, open the Active Trip screen and use the End Trip option to finish your duty.",
    },

    {
      question:
        "What should I do if a student is absent?",

      answer:
        "Open the Students section and update the student's trip status before leaving the pickup location.",
    },

    {
      question:
        "Why is my location not updating?",

      answer:
        "Make sure GPS is enabled and Location permission is granted to the ASAN Driver app. Live location sharing works while a trip is active.",
    },

    {
      question:
        "How can I report a technical issue?",

      answer:
        "Use Guided Support to find your issue first. If the suggested solution does not fix it, choose Still Need Help and submit a support request.",
    },
  ];

  /* =======================================================
     GUIDED SUPPORT
  ======================================================= */

  const supportCategories = [
    {
      id:
        "trip",

      title:
        "Trip Issues",

      description:
        "Start, end or manage duty",

      icon:
        Route,

      questions: [
        {
          id:
            "start-trip",

          question:
            "How do I start a trip?",

          answer:
            "Open the Dashboard, select the Morning or Afternoon duty, then slide the Start Trip control. GPS tracking and camera access will start automatically.",
        },

        {
          id:
            "end-trip",

          question:
            "How do I complete a trip?",

          answer:
            "After completing all assigned student drop-offs, open the Active Trip screen and use the End Trip option to complete the duty.",
        },

        {
          id:
            "trip-not-starting",

          question:
            "My trip is not starting",

          answer:
            "Make sure you selected the correct duty for the current time. Morning duty is available before 12 PM and Afternoon duty becomes available after 12 PM. Also verify that your internet connection is active.",
        },

        {
          id:
            "wrong-duty",

          question:
            "I selected the wrong duty",

          answer:
            "Before starting the trip, select the correct Morning or Afternoon duty from the Dashboard. Once a trip is active, do not start another duty until the current trip has been completed.",
        },
      ],
    },

    {
      id:
        "student",

      title:
        "Student Issues",

      description:
        "Assigned students and attendance",

      icon:
        Users,

      questions: [
        {
          id:
            "student-absent",

          question:
            "A student is absent",

          answer:
            "Open the Students section and update the student's trip status before leaving the pickup location. This keeps the trip record accurate.",
        },

        {
          id:
            "student-missing",

          question:
            "A student is not showing",

          answer:
            "Refresh the Students screen first. If the student still does not appear, the assignment may not be linked to your Driver account. Contact the administrator through a support request.",
        },

        {
          id:
            "wrong-student",

          question:
            "Wrong student is assigned to me",

          answer:
            "Do not modify the assignment yourself. Submit a support request so the administrator can verify and correct the Driver–Student assignment.",
        },
      ],
    },

    {
      id:
        "gps",

      title:
        "GPS & Tracking",

      description:
        "Location and live tracking",

      icon:
        MapPin,

      questions: [
        {
          id:
            "location-not-updating",

          question:
            "My location is not updating",

          answer:
            "Make sure GPS is enabled and Location permission is granted to ASAN Driver. Live location sharing begins automatically while a trip is active.",
        },

        {
          id:
            "parent-location",

          question:
            "Parent cannot see my location",

          answer:
            "Confirm that your trip is active, GPS is enabled, and the app has Location permission. ASAN shares Driver location only during an active trip.",
        },

        {
          id:
            "gps-permission",

          question:
            "Location permission is denied",

          answer:
            "Open your phone Settings, go to Apps → ASAN Driver → Permissions → Location, then allow location access. Return to the app and start the trip again.",
        },

        {
          id:
            "location-stopped",

          question:
            "Location stopped during the trip",

          answer:
            "Check that GPS and internet connectivity are still active. Keep the ASAN Driver app running during the trip. If required, reopen the active trip screen after restoring connectivity.",
        },
      ],
    },

    {
      id:
        "camera",

      title:
        "Camera",

      description:
        "Video and camera access",

      icon:
        Camera,

      questions: [
        {
          id:
            "camera-not-working",

          question:
            "Camera is not working",

          answer:
            "Make sure Camera permission is enabled for ASAN Driver. If permission was recently enabled, reopen the trip screen and try again.",
        },

        {
          id:
            "parent-video",

          question:
            "Parent cannot see camera video",

          answer:
            "Make sure the trip is active, the Driver camera started successfully, and your internet connection is stable. Keep the app running while the trip is active.",
        },

        {
          id:
            "change-camera",

          question:
            "How do I change the camera?",

          answer:
            "When multiple cameras are available, ASAN shows a camera selection screen while starting the trip. Choose the camera you want to use.",
        },
      ],
    },

    {
      id:
        "notifications",

      title:
        "Notifications",

      description:
        "Alerts and updates",

      icon:
        Bell,

      questions: [
        {
          id:
            "notifications-not-coming",

          question:
            "I am not receiving notifications",

          answer:
            "Make sure notification permission is enabled for ASAN Driver and that the device has an active internet connection.",
        },

        {
          id:
            "view-notifications",

          question:
            "Where can I see notifications?",

          answer:
            "Tap the Bell icon on the Driver Dashboard to open your notification history and view recent alerts.",
        },
      ],
    },

    {
      id:
        "account",

      title:
        "Account & Login",

      description:
        "Login and profile access",

      icon:
        User,

      questions: [
        {
          id:
            "login-problem",

          question:
            "I cannot login",

          answer:
            "Enter your registered Driver email and verify the 6-digit OTP sent to your email. If your account is still pending or has been rejected, Dashboard access will remain unavailable until the required verification is completed.",
        },

        {
          id:
            "pending",

          question:
            "My account is pending",

          answer:
            "New Driver accounts require administrator approval. You will be able to access the Dashboard after your Driver account is approved.",
        },

        {
          id:
            "profile",

          question:
            "How do I update my profile?",

          answer:
            "Open Profile from the bottom navigation. Update the available Driver information and save your changes.",
        },
      ],
    },

    {
      id:
        "vehicle",

      title:
        "Vehicle",

      description:
        "Vehicle information",

      icon:
        Car,

      questions: [
        {
          id:
            "wrong-vehicle",

          question:
            "My vehicle details are incorrect",

          answer:
            "Open your Profile and verify the vehicle details. If the assigned vehicle itself is incorrect, submit a support request so the administrator can review it.",
        },

        {
          id:
            "vehicle-not-showing",

          question:
            "My vehicle is not showing",

          answer:
            "Refresh your Driver Profile and Dashboard. If no assigned vehicle appears, contact the administrator through a support request.",
        },
      ],
    },

    {
      id:
        "payment",

      title:
        "Payments",

      description:
        "Payment-related assistance",

      icon:
        WalletCards,

      questions: [
        {
          id:
            "payment-status",

          question:
            "I have a payment issue",

          answer:
            "Driver payment information is handled by the administrator. Choose Still Need Help and submit a support request with your payment issue.",
        },

        {
          id:
            "payment-info",

          question:
            "Where can I check payment information?",

          answer:
            "Payment-related information is managed through the administrator. If payment information is unavailable or incorrect, submit a support request.",
        },
      ],
    },
  ];

  /* =======================================================
     RESET SUPPORT
  ======================================================= */

  const resetSupportChat =
    () => {
      setSelectedCategory(
        null
      );

      setSelectedQuestion(
        null
      );
    };

  /* =======================================================
     OPEN SUPPORT
  ======================================================= */

  const openSupportChat =
    () => {
      resetSupportChat();

      setShowChat(
        true
      );
    };

  /* =======================================================
     CLOSE SUPPORT
  ======================================================= */

  const closeSupportChat =
    () => {
      setShowChat(
        false
      );

      setTimeout(
        () => {
          resetSupportChat();
        },
        250
      );
    };

  /* =======================================================
     STILL NEED HELP
  ======================================================= */

  const handleStillNeedHelp =
    () => {
      if (
        selectedQuestion
          ?.question
      ) {
        setSubject(
          selectedQuestion
            .question
        );
      }

      closeSupportChat();

      setTimeout(
        () => {
          document
            .getElementById(
              "support-request"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start",
            });
        },
        350
      );
    };

  /* =======================================================
     SUBMIT TICKET
  ======================================================= */

  const submitTicket =
    () => {
      if (
        !subject.trim() ||
        !description.trim()
      ) {
        alert(
          "Please enter the subject and describe your issue."
        );

        return;
      }

      setTicketSubmitted(
        true
      );

      setSubject("");

      setDescription("");

      setTimeout(
        () => {
          setTicketSubmitted(
            false
          );
        },
        3500
      );
    };

  /* =======================================================
     LOCK BACKGROUND SCROLL
  ======================================================= */

  useEffect(() => {
    if (!showChat) {
      return;
    }

    const original =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        original;
    };
  }, [showChat]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex justify-center">
      <div className="relative min-h-screen w-full max-w-[475px] overflow-hidden bg-[#FFF9EE] pb-8">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute -right-[130px] -top-[150px] h-[330px] w-[330px] rounded-full bg-[#FFEDB9]/75" />

        <div className="pointer-events-none absolute -left-[190px] top-[430px] h-[300px] w-[300px] rounded-full bg-[#FFF2D1]/50" />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="relative z-10 px-5 pt-5">

          {/* BACK BUTTON RIGHT */}

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

          {/* TEXT MOVED UP + LEFT */}

          <div className="-mt-7">
            <div className="flex items-center gap-2">
              <Headphones
                size={13}
                className="text-[#B87700]"
              />

              <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
                DRIVER SUPPORT
              </p>
            </div>

            <h1 className="mt-2 text-[24px] leading-tight font-black text-black">
              Help & Support
            </h1>

            <p className="mt-1.5 max-w-[320px] text-[9px] leading-[1.6] text-[#8C8276]">
              Find quick solutions for trips, students, GPS,
              camera access, notifications and account issues.
            </p>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-5 space-y-5 px-4">

          {/* =================================================
              GUIDED SUPPORT ACTION
          ================================================= */}

          <section className="rounded-[20px] border border-[#EEE3D1] bg-[#FFFDF8] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0C5]">
                  <MessageCircle
                    size={17}
                    className="text-[#A97000]"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black text-black">
                    Guided Support
                  </p>

                  <p className="mt-0.5 text-[8px] leading-4 text-[#91877B]">
                    Select your issue and get the exact solution.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  openSupportChat
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFB000] text-black"
              >
                <ChevronRight
                  size={15}
                />
              </button>
            </div>
          </section>

          {/* =================================================
              FAQ
          ================================================= */}

          <section>
            <div className="mb-3 px-1">
              <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
                QUICK ANSWERS
              </p>

              <h2 className="mt-1.5 text-[18px] font-black text-black">
                Common Questions
              </h2>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[#EEE3D1] bg-[#FFFDF8]">
              {faqs.map(
                (
                  faq,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className={
                      index !==
                      faqs.length -
                        1
                        ? "border-b border-[#F0E7D9]"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFAQ(
                          openFAQ ===
                            index
                            ? null
                            : index
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                    >
                      <span className="text-[10px] font-bold leading-5 text-black">
                        {
                          faq.question
                        }
                      </span>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-[#FFF3D3]">
                        <ChevronDown
                          size={15}
                          className={`text-[#A97000] transition-transform duration-200 ${
                            openFAQ ===
                            index
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence
                      initial={
                        false
                      }
                    >
                      {openFAQ ===
                        index && (
                        <motion.div
                          initial={{
                            height:
                              0,

                            opacity:
                              0,
                          }}
                          animate={{
                            height:
                              "auto",

                            opacity:
                              1,
                          }}
                          exit={{
                            height:
                              0,

                            opacity:
                              0,
                          }}
                          transition={{
                            duration:
                              0.2,
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 pr-14 text-[9px] leading-[1.7] text-[#8C8276]">
                            {
                              faq.answer
                            }
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =================================================
              SUPPORT REQUEST
          ================================================= */}

          <section
            id="support-request"
            className="scroll-mt-5"
          >
            <div className="mb-3 px-1">
              <div className="flex items-center gap-2">
                <FileText
                  size={13}
                  className="text-[#B87700]"
                />

                <p className="text-[8px] font-black tracking-[0.15em] text-[#B87700]">
                  SUPPORT REQUEST
                </p>
              </div>

              <h2 className="mt-1.5 text-[18px] font-black text-black">
                Report an Issue
              </h2>

              <p className="mt-1 text-[9px] text-[#8C8276]">
                Use this only if Guided Support did not solve your issue.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#EEE3D1] bg-[#FFFDF8] p-4">

              {/* SUCCESS */}

              <AnimatePresence>
                {ticketSubmitted && (
                  <motion.div
                    initial={{
                      opacity:
                        0,

                      y:
                        -5,
                    }}
                    animate={{
                      opacity:
                        1,

                      y:
                        0,
                    }}
                    exit={{
                      opacity:
                        0,
                    }}
                    className="mb-4 flex items-center gap-3 rounded-[15px] border border-[#D7E8D3] bg-[#EFF8ED] px-3 py-3"
                  >
                    <CheckCircle2
                      size={17}
                      className="text-[#4F854A]"
                    />

                    <div>
                      <p className="text-[9px] font-black text-[#4F754B]">
                        Request submitted
                      </p>

                      <p className="mt-0.5 text-[7px] text-[#71826F]">
                        Support will review your issue.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="text-[8px] font-black tracking-[0.1em] text-[#8F8579]">
                SUBJECT
              </label>

              <input
                type="text"
                value={
                  subject
                }
                onChange={(
                  event
                ) =>
                  setSubject(
                    event.target
                      .value
                  )
                }
                placeholder="Example: GPS not updating"
                className="mt-2 h-[48px] w-full rounded-[14px] border border-[#E9DFD0] bg-white px-4 text-[10px] text-black outline-none transition focus:border-[#D9A534]"
              />

              <label className="mt-4 block text-[8px] font-black tracking-[0.1em] text-[#8F8579]">
                DESCRIBE THE ISSUE
              </label>

              <textarea
                rows="5"
                value={
                  description
                }
                onChange={(
                  event
                ) =>
                  setDescription(
                    event.target
                      .value
                  )
                }
                placeholder="Explain what happened and what you were trying to do..."
                className="mt-2 w-full resize-none rounded-[14px] border border-[#E9DFD0] bg-white px-4 py-3 text-[10px] leading-[1.6] text-black outline-none transition focus:border-[#D9A534]"
              />

              <button
                type="button"
                onClick={
                  submitTicket
                }
                className="mt-4 h-[49px] w-full rounded-[15px] bg-[#FFB000] text-[10px] font-black text-black transition active:scale-[0.99]"
              >
                SUBMIT REQUEST
              </button>
            </div>
          </section>
        </main>

        {/* =================================================
            GUIDED SUPPORT SHEET
        ================================================= */}

        <AnimatePresence>
          {showChat && (
            <>
              <motion.div
                initial={{
                  opacity:
                    0,
                }}
                animate={{
                  opacity:
                    1,
                }}
                exit={{
                  opacity:
                    0,
                }}
                onClick={
                  closeSupportChat
                }
                className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[1px]"
              />

              <motion.div
                initial={{
                  y:
                    "100%",
                }}
                animate={{
                  y:
                    0,
                }}
                exit={{
                  y:
                    "100%",
                }}
                transition={{
                  type:
                    "spring",

                  damping:
                    28,

                  stiffness:
                    260,
                }}
                className="fixed bottom-0 left-0 right-0 z-[80] mx-auto flex h-[76vh] w-full max-w-[475px] flex-col overflow-hidden rounded-t-[30px] border border-b-0 border-[#EEE1CC] bg-[#FFFDF8] shadow-[0_-12px_35px_rgba(0,0,0,0.12)]"
              >
                {/* HANDLE */}

                <div className="shrink-0 pt-3">
                  <div className="mx-auto h-1 w-10 rounded-full bg-[#D8D1C6]" />
                </div>

                {/* SHEET HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-[#EEE5D8] px-5 pb-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFF0C5]">
                      <Headphones
                        size={18}
                        className="text-[#A97000]"
                      />
                    </div>

                    <div>
                      <h3 className="text-[13px] font-black text-black">
                        ASAN Support
                      </h3>

                      <p className="mt-0.5 text-[7px] font-semibold text-[#92887C]">
                        Guided Driver Assistance
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeSupportChat
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#F3EFE8]"
                  >
                    <X
                      size={16}
                      className="text-[#6F6962]"
                    />
                  </button>
                </div>

                {/* CONTENT */}

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">

                  {/* CATEGORY */}

                  {!selectedCategory && (
                    <>
                      <p className="text-[8px] font-black tracking-[0.14em] text-[#B87700]">
                        GUIDED SUPPORT
                      </p>

                      <h3 className="mt-2 text-[17px] font-black text-black">
                        What do you need help with?
                      </h3>

                      <p className="mt-1 text-[8px] leading-4 text-[#92887C]">
                        Select the category closest to your issue.
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2.5">
                        {supportCategories.map(
                          (
                            category
                          ) => {
                            const Icon =
                              category.icon;

                            return (
                              <button
                                type="button"
                                key={
                                  category.id
                                }
                                onClick={() => {
                                  setSelectedCategory(
                                    category
                                  );

                                  setSelectedQuestion(
                                    null
                                  );
                                }}
                                className="rounded-[17px] border border-[#EEE3D1] bg-white p-3.5 text-left transition active:scale-[0.98]"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FFF3D3]">
                                  <Icon
                                    size={16}
                                    className="text-[#A97000]"
                                  />
                                </div>

                                <p className="mt-3 text-[10px] font-black text-black">
                                  {
                                    category.title
                                  }
                                </p>

                                <p className="mt-1 text-[7px] leading-3 text-[#9A9187]">
                                  {
                                    category.description
                                  }
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-[7px] font-bold text-[#A79D91]">
                                    {
                                      category
                                        .questions
                                        .length
                                    }{" "}
                                    options
                                  </span>

                                  <ChevronRight
                                    size={13}
                                    className="text-[#B87700]"
                                  />
                                </div>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}

                  {/* QUESTION */}

                  {selectedCategory &&
                    !selectedQuestion && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCategory(
                              null
                            )
                          }
                          className="flex items-center gap-1 text-[8px] font-black text-[#B87700]"
                        >
                          <ArrowLeft
                            size={13}
                          />

                          Categories
                        </button>

                        <div className="mt-4">
                          <p className="text-[8px] font-black tracking-[0.14em] text-[#B87700]">
                            {
                              selectedCategory.title
                            }
                          </p>

                          <h3 className="mt-2 text-[17px] font-black text-black">
                            Select your issue
                          </h3>

                          <p className="mt-1 text-[8px] text-[#92887C]">
                            Choose the option that best matches what is happening.
                          </p>
                        </div>

                        <div className="mt-5 space-y-2">
                          {selectedCategory.questions.map(
                            (
                              item
                            ) => (
                              <button
                                type="button"
                                key={
                                  item.id
                                }
                                onClick={() =>
                                  setSelectedQuestion(
                                    item
                                  )
                                }
                                className="flex w-full items-center justify-between gap-3 rounded-[15px] border border-[#EEE3D1] bg-white px-4 py-4 text-left transition active:scale-[0.99]"
                              >
                                <p className="text-[10px] font-bold leading-4 text-black">
                                  {
                                    item.question
                                  }
                                </p>

                                <ChevronRight
                                  size={15}
                                  className="shrink-0 text-[#B87700]"
                                />
                              </button>
                            )
                          )}
                        </div>
                      </>
                    )}

                  {/* ANSWER */}

                  {selectedQuestion && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedQuestion(
                            null
                          )
                        }
                        className="flex items-center gap-1 text-[8px] font-black text-[#B87700]"
                      >
                        <ArrowLeft
                          size={13}
                        />

                        Back
                      </button>

                      <div className="mt-4 rounded-[17px] border border-[#EEE3D1] bg-white p-4">
                        <p className="text-[7px] font-black tracking-[0.13em] text-[#9A9187]">
                          YOUR ISSUE
                        </p>

                        <h3 className="mt-2 text-[12px] font-black leading-5 text-black">
                          {
                            selectedQuestion.question
                          }
                        </h3>
                      </div>

                      <div className="mt-3 rounded-[18px] border border-[#EED69B] bg-[#FFF3D3] p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#FFB000]">
                            <Headphones
                              size={14}
                              className="text-black"
                            />
                          </div>

                          <div>
                            <p className="text-[9px] font-black text-[#805700]">
                              ASAN Support
                            </p>

                            <p className="text-[7px] text-[#A77F35]">
                              Recommended solution
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-[9px] leading-[1.75] text-[#5E5548]">
                          {
                            selectedQuestion.answer
                          }
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            resetSupportChat();

                            closeSupportChat();
                          }}
                          className="flex h-[46px] items-center justify-center gap-1.5 rounded-[14px] border border-[#CFE5CC] bg-[#EEF7EC] text-[8px] font-black text-[#4E854A]"
                        >
                          <CheckCircle2
                            size={14}
                          />

                          Problem Solved
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleStillNeedHelp
                          }
                          className="h-[46px] rounded-[14px] bg-[#FFB000] text-[8px] font-black text-black"
                        >
                          Still Need Help
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={
                          resetSupportChat
                        }
                        className="mt-3 h-[44px] w-full rounded-[14px] border border-[#EEE3D1] bg-white text-[8px] font-bold text-[#756D64]"
                      >
                        Choose Another Issue
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HelpSupport;