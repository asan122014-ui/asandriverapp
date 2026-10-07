import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BusFront,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";
import routeMap from "../assets/driver-onboarding/route-map.png";
import liveJourneyMap from "../assets/driver-onboarding/live-journey-map.png";

const slides = [
  {
    id: "verified",
    eyebrow: "YOUR DRIVER PROFILE",
    title: "Start with a profile families can trust.",
    description:
      "Complete your driver, vehicle and document details. Once the institute verifies your profile, your ASAN Driver workspace is ready.",
    value: "A verified start",
    valueDescription: "Your profile and vehicle details stay together.",
  },
  {
    id: "duty",
    eyebrow: "YOUR DAILY DUTY",
    title: "Know your route before the first stop.",
    description:
      "Check your morning or afternoon duty, assigned route and student list, then start the trip when you are ready.",
    value: "One clear duty plan",
    valueDescription: "Your route and students are ready in one place.",
  },
  {
    id: "trip",
    eyebrow: "LIVE TRIP TOOLS",
    title: "Follow the journey, one stop at a time.",
    description:
      "Use the live map and navigation pointer, follow the next stop, and update each student as they are picked up or dropped off.",
    value: "Every stop accounted for",
    valueDescription: "Trip progress updates as you record each student’s status.",
  },
  {
    id: "requests",
    eyebrow: "RIDE REQUESTS",
    title: "Review a request before you decide.",
    description:
      "Open Ride requests to review the route, schedule and distance-based driver amount, then accept or reject the request.",
    value: "Clear details up front",
    valueDescription: "Accepted requests continue into your driver workflow.",
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFB400] text-black shadow-[0_7px_18px_rgba(222,157,0,0.2)]">
        <BusFront size={21} strokeWidth={2.3} />
      </span>
      <span>
        <span className="block text-[17px] font-black tracking-[-0.04em] text-black">
          ASAN <span className="text-[#B87700]">Captain</span>
        </span>
        <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.17em] text-[#9B8262]">
          Driver workspace
        </span>
      </span>
    </div>
  );
}

function VerifiedVisual() {
  return (
    <div className="rounded-[25px] border border-[#F1DDA8] bg-white p-5 shadow-[0_16px_35px_rgba(75,57,20,0.07)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#A57916]">Driver profile</p>
          <p className="mt-1.5 text-[19px] font-black text-[#171717]">Ready for review</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2C8] text-[#B77D00]">
          <ShieldCheck size={23} />
        </span>
      </div>
      <div className="mt-5 space-y-2.5">
        {[
          [<CheckCircle2 size={17} />, "Driver details", "Profile information"],
          [<BusFront size={17} />, "Vehicle", "Registration and capacity"],
          [<ShieldCheck size={17} />, "Documents", "Institute verification"],
        ].map(([icon, title, detail]) => (
          <div key={title} className="flex items-center gap-3 rounded-[17px] border border-[#F0E8D8] bg-[#FFFCF6] px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0B8] text-[#B77D00]">{icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-extrabold text-[#171717]">{title}</span>
              <span className="mt-0.5 block text-[10px] text-[#8E8173]">{detail}</span>
            </span>
            <Check size={16} className="text-[#22A56A]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DutyVisual() {
  return (
    <div className="relative overflow-hidden rounded-[25px] border border-[#F1DDA8] bg-white p-3 shadow-[0_16px_35px_rgba(75,57,20,0.07)]">
      <div className="relative h-[210px] overflow-hidden rounded-[19px] bg-[#FFF6E3]">
        <img src={routeMap} alt="Illustrated school route map" className="h-full w-full object-cover" loading="lazy" draggable={false} />
        <div className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#9B6700] shadow-sm">
          Route preview
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-[17px] border border-white/80 bg-white/95 p-3 shadow-md backdrop-blur">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFB400] text-black">
            <Navigation size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-[#A57916]">Afternoon duty</span>
            <span className="mt-1 block truncate text-[13px] font-black text-[#171717]">School <span className="text-[#C88A00]">→</span> Home</span>
          </span>
          <span className="rounded-full bg-[#EAF7EF] px-2.5 py-1 text-[8px] font-extrabold text-[#247B4E]">Ready</span>
        </div>
      </div>
    </div>
  );
}

function TripVisual() {
  return (
    <div className="overflow-hidden rounded-[25px] border border-[#F1DDA8] bg-white p-3 shadow-[0_16px_35px_rgba(75,57,20,0.07)]">
      <div className="relative h-[188px] overflow-hidden rounded-[19px] bg-[#FFF6E3]">
        <img src={liveJourneyMap} alt="Illustrated live route map" className="h-full w-full object-cover" loading="lazy" draggable={false} />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#20B877] shadow-[0_0_0_4px_rgba(32,184,119,0.12)]" />
          <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#247B4E]">Live trip</span>
        </div>
        <span className="absolute right-[27%] top-[33%] flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#FFB400] text-black shadow-lg">
          <Navigation size={18} fill="currentColor" />
        </span>
        <div className="absolute bottom-3 left-3 right-3 rounded-[17px] border border-white/80 bg-white/95 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#A57916]">Next stop</span>
            <span className="rounded-full bg-[#FFF0B8] px-2.5 py-1 text-[8px] font-extrabold text-[#9B6700]">Stop 2</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4].map((stop, index) => (
              <span key={stop} className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-black ${index < 2 ? "bg-[#FFB400] text-black" : "border border-[#E8DDC9] bg-[#FFFCF6] text-[#9B907F]"}`}>{stop}</span>
            ))}
            <span className="ml-auto flex items-center gap-1 text-[8px] font-bold text-[#7C7367]"><MapPin size={12} /> Ordered stops</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x divide-[#EFE5D5] rounded-[16px] border border-[#F0E8D8] bg-[#FFFCF6] py-2.5 text-center">
        <span className="text-[9px] font-bold text-[#6F6254]">Navigate</span>
        <span className="text-[9px] font-bold text-[#6F6254]">Pick up</span>
        <span className="text-[9px] font-bold text-[#6F6254]">Drop off</span>
      </div>
    </div>
  );
}

function RequestVisual() {
  return (
    <div className="relative overflow-hidden rounded-[25px] border border-[#F1DDA8] bg-white p-5 shadow-[0_16px_35px_rgba(75,57,20,0.07)]">
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#FFF1C3]" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#A57916]">Ride request</p>
          <p className="mt-1.5 text-[19px] font-black text-[#171717]">Review the details</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0B8] text-[#9B6700]"><Bell size={21} /></span>
      </div>
      <div className="relative mt-4 rounded-[18px] border border-[#F0E8D8] bg-[#FFFCF6] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#C88A00]"><MapPin size={18} /></span>
          <span><span className="block text-[11px] font-extrabold text-[#171717]">Pickup and destination</span><span className="mt-0.5 block text-[9px] text-[#8E8173]">Route and schedule details</span></span>
        </div>
        <div className="my-3 border-t border-[#EFE5D5]" />
        <div className="flex items-center justify-between gap-3">
          <span><span className="block text-[9px] text-[#8E8173]">Driver amount</span><span className="mt-1 block text-[12px] font-black text-[#171717]">Distance charges</span></span>
          <span className="rounded-full bg-[#FFF0B8] px-3 py-1.5 text-[8px] font-extrabold text-[#9B6700]">Shown upfront</span>
        </div>
      </div>
      <div className="relative mt-3 grid grid-cols-2 gap-2.5">
        <span className="flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#FFB400] text-[10px] font-black text-black"><CheckCircle2 size={15} /> Accept</span>
        <span className="flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#E8DDC9] bg-white text-[10px] font-black text-[#51483D]">Review later</span>
      </div>
    </div>
  );
}

function Visual({ id }) {
  if (id === "verified") return <VerifiedVisual />;
  if (id === "duty") return <DutyVisual />;
  if (id === "trip") return <TripVisual />;
  return <RequestVisual />;
}

export default function DriverOnboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setCurrentSlide((current) => current + 1);
  };

  const back = () => {
    if (!isFirst) setCurrentSlide((current) => current - 1);
  };

  return (
    <div className="fixed inset-0 z-[99990] overflow-y-auto bg-[#FFF9EF] text-black">
      <div className="pointer-events-none absolute -right-24 -top-28 h-[300px] w-[300px] rounded-full bg-[#FFF0BD]" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-[260px] w-[260px] rounded-full bg-[#FFF2D1]" />

      <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-6 pt-5">
        <header className="flex items-center justify-between">
          <Brand />
          <button type="button" onClick={onComplete} className="rounded-2xl border border-[#E9DFC9] bg-white px-4 py-2.5 text-[11px] font-black text-[#403A32] shadow-sm transition active:scale-95">Skip</button>
        </header>

        <section key={slide.id} className="mt-7 animate-scaleIn">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#B87700]">{slide.eyebrow}</p>
          <h1 className="mt-2 max-w-[350px] text-[29px] font-black leading-[1.04] tracking-[-0.04em]">{slide.title}</h1>
          <p className="mt-3 max-w-[360px] text-[12px] font-medium leading-[1.7] text-[#817668]">{slide.description}</p>
        </section>

        <section key={`${slide.id}-visual`} className="mt-5 animate-scaleIn" aria-label={`${slide.eyebrow} illustration`}>
          <Visual id={slide.id} />
        </section>

        <section className="mt-5">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B87700]">Made for your school run</p>
          <div className="mt-2.5 flex items-center gap-3 rounded-[19px] border border-[#F0DFC0] bg-white px-3.5 py-3.5 shadow-[0_8px_22px_rgba(66,48,19,0.05)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0B8] text-[#B77D00]">
              {slide.id === "verified" && <ShieldCheck size={19} />}
              {slide.id === "duty" && <Clock3 size={19} />}
              {slide.id === "trip" && <Users size={19} />}
              {slide.id === "requests" && <Bell size={19} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-black text-[#171717]">{slide.value}</span>
              <span className="mt-0.5 block text-[9px] leading-4 text-[#8E8173]">{slide.valueDescription}</span>
            </span>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-center gap-2" aria-label={`Page ${currentSlide + 1} of ${slides.length}`}>
          {slides.map((item, index) => (
            <span key={item.id} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-7 bg-[#FFB400]" : "w-2 bg-[#E8DECB]"}`} />
          ))}
        </div>

        <nav className="mt-5 flex items-center gap-3" aria-label="Introduction navigation">
          <button type="button" onClick={back} disabled={isFirst} aria-label="Previous page" className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] border transition ${isFirst ? "pointer-events-none border-transparent bg-transparent opacity-0" : "border-[#E6D7BC] bg-white text-black shadow-sm active:scale-95"}`}>
            <ArrowLeft size={20} />
          </button>
          <button type="button" onClick={next} className={`flex h-[54px] flex-1 items-center rounded-[20px] border border-[#F3C04E] bg-[#FFF0BF] px-4 text-[12px] font-black text-black shadow-[0_8px_20px_rgba(201,142,19,0.1)] transition active:scale-[0.99] ${isLast ? "justify-between" : "justify-center gap-3"}`}>
            {isLast ? (
              <>
                <span className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB400]"><Play size={16} fill="currentColor" /></span>Get Started</span>
                <ArrowRight size={19} />
              </>
            ) : (
              <>Continue <ArrowRight size={18} /></>
            )}
          </button>
        </nav>
      </main>
    </div>
  );
}
