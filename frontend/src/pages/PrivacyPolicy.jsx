import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Database,
  Info,
  MapPin,
  Camera,
  Share2,
  Lock,
  UserCheck,
  Mail,
  Phone,
  ArrowLeft,
  FileText,
  Car,
  Trash2,
} from "lucide-react";

/* =========================================================
   PRIVACY POLICY
========================================================= */

function PrivacyPolicy() {
  const navigate =
    useNavigate();

  const lastUpdated =
    "March 2026";

  /* =======================================================
     PRIVACY BLOCKS
  ======================================================= */

  const privacyBlocks = [
    {
      id: 1,

      title:
        "What We Collect",

      icon:
        Database,

      description:
        "ASAN collects only the information required to manage your Driver account, verify your identity and operate school transportation safely.",

      tags: [
        "Profile",
        "Vehicle",
        "Documents",
      ],
    },

    {
      id: 2,

      title:
        "How We Use It",

      icon:
        Info,

      description:
        "Your information is used for trip management, Driver verification, safety monitoring, notifications and platform operations.",

      tags: [
        "Trips",
        "Verification",
        "Safety",
      ],
    },

    {
      id: 3,

      title:
        "Location & Camera",

      icon:
        MapPin,

      description:
        "Live location may be used during active duties. Camera access may be used only for approved trip or verification workflows.",

      tags: [
        "Live GPS",
        "Trip Tracking",
        "Verification",
      ],
    },

    {
      id: 4,

      title:
        "Data Sharing",

      icon:
        Share2,

      description:
        "Driver information is shared only with authorized users and service providers required to operate ASAN. We do not sell personal data.",

      tags: [
        "Authorized Users",
        "Service Providers",
        "No Data Sale",
      ],
    },

    {
      id: 5,

      title:
        "Security & Retention",

      icon:
        Lock,

      description:
        "ASAN uses protected accounts, controlled access and secure infrastructure. Information is retained only as long as required for operations and safety.",

      tags: [
        "Protected Access",
        "Secure Storage",
        "Retention",
      ],
    },

    {
      id: 6,

      title:
        "Your Privacy Rights",

      icon:
        UserCheck,

      description:
        "You may request access, correction or deletion of eligible personal information associated with your Driver account.",

      tags: [
        "Access",
        "Correction",
        "Deletion",
      ],
    },
  ];

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

        <div className="pointer-events-none absolute -left-[190px] top-[520px] h-[280px] w-[280px] rounded-full bg-[#FFF2D1]/45" />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="relative z-10 px-5 pt-5">

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

          <div className="-mt-7">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={13}
                className="text-[#B87700]"
              />

              <p className="text-[8px] font-black tracking-[0.16em] text-[#B87700]">
                DRIVER PRIVACY
              </p>
            </div>

            <h1 className="mt-2 text-[24px] font-black text-black">
              Privacy Policy
            </h1>

            <p className="mt-1.5 max-w-[320px] text-[9px] leading-[1.6] text-[#8C8276]">
              A simple overview of how ASAN handles your Driver information.
            </p>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative z-10 mt-5 px-4 pb-8">

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="rounded-[18px] border border-[#EEE3D1] bg-white p-4">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0 flex-1">

                <p className="text-[8px] font-black tracking-[0.14em] text-[#A0968A]">
                  PRIVACY SUMMARY
                </p>

                <h2 className="mt-1 text-[13px] font-black text-black">
                  Your data stays purpose-driven
                </h2>

                <p className="mt-1 text-[8px] leading-[1.6] text-[#81776D]">
                  ASAN uses Driver information only for transportation, verification, safety and platform operations.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF0C5]">
                <ShieldCheck
                  size={18}
                  className="text-[#A97000]"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#F0E8DA] pt-3">

              <span className="text-[7px] font-bold text-[#9A9085]">
                LAST UPDATED
              </span>

              <span className="rounded-full bg-[#FFF0C5] px-2.5 py-1 text-[7px] font-black text-[#936200]">
                {lastUpdated}
              </span>
            </div>
          </section>

          {/* =================================================
              PRIVACY BLOCKS
          ================================================= */}

          <div className="mt-5 grid grid-cols-2 gap-2.5">

            {privacyBlocks.map(
              (
                block
              ) => {
                const Icon =
                  block.icon;

                return (
                  <section
                    key={
                      block.id
                    }
                    className="rounded-[17px] border border-[#EEE3D1] bg-white p-3.5"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FFF0C5]">
                        <Icon
                          size={15}
                          className="text-[#A97000]"
                        />
                      </div>

                      <span className="text-[7px] font-black text-[#B8AFA4]">
                        0{block.id}
                      </span>
                    </div>

                    <h3 className="mt-3 text-[10px] font-black leading-4 text-black">
                      {
                        block.title
                      }
                    </h3>

                    <p className="mt-1.5 text-[7.5px] leading-[1.55] text-[#786F65]">
                      {
                        block.description
                      }
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">

                      {block.tags.map(
                        (
                          tag
                        ) => (
                          <span
                            key={
                              tag
                            }
                            className="rounded-full bg-[#FFF9EE] px-2 py-1 text-[6px] font-bold text-[#8A7F74]"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                );
              }
            )}
          </div>

          {/* =================================================
              DATA REQUEST
          ================================================= */}

          <section className="mt-4 rounded-[18px] border border-[#EEE3D1] bg-white p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF0C5]">
                <Trash2
                  size={16}
                  className="text-[#A97000]"
                />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[8px] font-black tracking-[0.13em] text-[#B87700]">
                  ACCOUNT & DATA
                </p>

                <h3 className="mt-1 text-[12px] font-black text-black">
                  Want to update or delete your data?
                </h3>

                <p className="mt-1 text-[8px] leading-[1.6] text-[#81776D]">
                  Contact ASAN support to request access, corrections or eligible data deletion.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              SUPPORT
          ================================================= */}

          <section className="mt-3 rounded-[18px] border border-[#EEE3D1] bg-white p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#F5F1EA]">
                <Mail
                  size={16}
                  className="text-[#776E64]"
                />
              </div>

              <div>

                <p className="text-[8px] font-black text-black">
                  Privacy Support
                </p>

                <p className="mt-0.5 text-[7px] text-[#8C8276]">
                  Reach us for privacy-related requests.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">

              <a
                href="mailto:asan122014@gmail.com?subject=ASAN Privacy Request"
                className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-[#FFF9EE] text-[7px] font-black text-[#655D55]"
              >
                <Mail
                  size={12}
                  className="text-[#A97000]"
                />

                EMAIL
              </a>

              <a
                href="tel:+918309649713"
                className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-[#FFF9EE] text-[7px] font-black text-[#655D55]"
              >
                <Phone
                  size={12}
                  className="text-[#A97000]"
                />

                CALL
              </a>
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-4 flex items-start justify-center gap-1.5 px-5">

            <Lock
              size={9}
              className="mt-0.5 shrink-0 text-[#AAA095]"
            />

            <p className="text-center text-[6.5px] leading-[1.5] text-[#AAA095]">
              By using ASAN Driver, you acknowledge the privacy practices described above.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PrivacyPolicy;