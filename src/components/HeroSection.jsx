import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  
} from "lucide-react";
import { navigate } from "../utils/navigation";
import CalendarPickerModal, { toIsoDateTime } from "./CalendarPickerModal";

const locations = ["Jalore"];

const slides = [
  {
    title: "Brand New Fleets",
    subtitle: "Drive our latest car models. Average age of our fleet is 20 months.",
  },
  {
    title: "300 km/24h Flexible Plans",
    subtitle: "Drive further with generous daily kilometer packages and zero hidden fees.",
  },
  {
    title: "Doorstep Delivery in Jalore",
    subtitle: "Get your sanitized car handed over at your doorstep or railway station.",
  },
];

// Format ISO date-time string into clean "23-Nov-2026 09:30 AM" display
function formatDisplayDateTime(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12";
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  } catch {
    return isoString;
  }
}

// Compute human duration difference between pickup and return
function calculateDuration(startStr, endStr) {
  if (!startStr || !endStr) return "Select valid dates";
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) {
    return "Minimum 1 hour rental";
  }
  const diffMs = end - start;
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  if (days === 0) {
    return `${remainingHours} ${remainingHours === 1 ? "Hour" : "Hours"}`;
  }
  if (remainingHours === 0) {
    return `${days} ${days === 1 ? "Day" : "Days"}`;
  }
  return `${days} ${days === 1 ? "Day" : "Days"} and ${remainingHours} ${remainingHours === 1 ? "hour" : "hours"}`;
}

// Modern flat vector illustration of travelers & white SUV with JSD license plate
function HeroTravelerCarIllustration() {
  return (
    <div className="relative w-full max-w-[560px] select-none">
      <svg
        viewBox="0 0 640 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_20px_35px_rgba(45,40,102,0.10)]"
      >
        <defs>
          <linearGradient id="carBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F4F5F9" />
            <stop offset="100%" stopColor="#E2E4EC" />
          </linearGradient>
          <linearGradient id="windshieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2D2866" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#1B1744" stopOpacity="0.96" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F3F9" />
            <stop offset="100%" stopColor="#CBD2E1" />
          </linearGradient>
          <linearGradient id="hillGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E5EBFB" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D9E2F8" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="hillGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FDECEF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FBE5E8" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="sunGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4E6" />
            <stop offset="100%" stopColor="#FDECEF" />
          </linearGradient>
        </defs>

        {/* Ambient background hills / road arc */}
        <ellipse
          cx="360"
          cy="430"
          rx="270"
          ry="24"
          fill="#2D2866"
          fillOpacity="0.08"
          filter="blur(6px)"
        />
        <path d="M80 410 Q 260 380 440 405 T 640 395 L 640 460 L 80 460 Z" fill="url(#hillGrad1)" />
        <path
          d="M140 425 Q 310 395 490 415 T 640 410 L 640 460 L 140 460 Z"
          fill="url(#hillGrad2)"
        />

        {/* Floating clouds / pastel sun motif */}
        <circle cx="510" cy="110" r="44" fill="url(#sunGlow)" />
        <path
          d="M470 120 C 470 105, 485 92, 502 94 C 509 82, 526 80, 536 90 C 546 88, 556 96, 555 106 C 564 108, 570 116, 568 124 C 568 132, 560 138, 550 138 L 480 138 C 472 138, 470 130, 470 120 Z"
          fill="#FFFFFF"
          fillOpacity="0.85"
        />

        {/* WHITE SUV / HATCHBACK CAR */}
        <g id="car-group">
          {/* Shadow under car */}
          <ellipse cx="430" cy="415" rx="175" ry="18" fill="#1F1B4D" fillOpacity="0.14" />

          {/* Rear body & roof line */}
          <path
            d="M300 230 Q 380 170 480 170 Q 560 170 595 245 L 610 300 Q 615 360 600 375 L 290 375 L 300 230 Z"
            fill="url(#carBodyGrad)"
            stroke="#CBD2E1"
            strokeWidth="2.5"
          />

          {/* Roof rails */}
          <path d="M370 166 L 540 166" stroke="#2D2866" strokeWidth="6" strokeLinecap="round" />
          <path d="M385 166 L 385 174 M 525 166 L 525 174" stroke="#2D2866" strokeWidth="4" />

          {/* Panoramic Windshield & side glass */}
          <path d="M360 238 L 400 180 L 510 180 L 545 238 Z" fill="url(#windshieldGrad)" />
          {/* Windshield glare reflection */}
          <path d="M420 186 L 390 232 L 408 232 L 434 186 Z" fill="#FFFFFF" fillOpacity="0.28" />

          {/* Hood and front fascia */}
          <path
            d="M305 245 L 360 240 L 545 240 L 600 245 L 615 305 Q 610 365 590 375 L 315 375 Q 295 365 290 305 Z"
            fill="url(#carBodyGrad)"
            stroke="#CBD2E1"
            strokeWidth="2"
          />

          {/* Front Grille in Deep Indigo */}
          <rect x="375" y="278" width="160" height="42" rx="10" fill="#2D2866" />
          <path
            d="M390 288 L 520 288 M 390 298 L 520 298 M 390 308 L 520 308"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeOpacity="0.3"
            strokeDasharray="6 4"
          />
          <circle cx="455" cy="299" r="9" fill="#FFFFFF" fillOpacity="0.9" />
          <text x="455" y="302" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#2D2866">
            JSD
          </text>

          {/* Modern LED Headlights */}
          <polygon
            points="318,272 370,278 365,302 312,290"
            fill="#FFFFFF"
            stroke="#2D2866"
            strokeWidth="3"
          />
          <path d="M325 280 L 362 285" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <polygon
            points="592,272 540,278 545,302 598,290"
            fill="#FFFFFF"
            stroke="#2D2866"
            strokeWidth="3"
          />
          <path d="M585 280 L 548 285" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

          {/* Front Bumper & Air Dam */}
          <rect x="360" y="328" width="190" height="36" rx="8" fill="#1F1B4D" />
          <rect x="395" y="336" width="120" height="18" rx="5" fill="#100D2D" />

          {/* Custom JSD License Plate */}
          <rect
            x="410"
            y="340"
            width="90"
            height="22"
            rx="4"
            fill="#FFFFFF"
            stroke="#2D2866"
            strokeWidth="1.5"
          />
          <rect x="412" y="342" width="10" height="18" rx="2" fill="#2563EB" />
          <text x="417" y="354" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FFFFFF">
            IND
          </text>
          <text
            x="460"
            y="355"
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#2D2866"
            letterSpacing="0.8"
          >
            RJ 16 JSD 01
          </text>

          {/* Left Wheel */}
          <circle cx="335" cy="385" r="38" fill="#1E293B" />
          <circle
            cx="335"
            cy="385"
            r="25"
            fill="url(#rimGrad)"
            stroke="#64748B"
            strokeWidth="2.5"
          />
          <circle cx="335" cy="385" r="9" fill="#2D2866" />

          {/* Right Wheel */}
          <circle cx="575" cy="385" r="38" fill="#1E293B" />
          <circle
            cx="575"
            cy="385"
            r="25"
            fill="url(#rimGrad)"
            stroke="#64748B"
            strokeWidth="2.5"
          />
          <circle cx="575" cy="385" r="9" fill="#2D2866" />
        </g>

        {/* TRAVELER COUPLE CELEBRATING VACATION */}
        {/* Man standing with thumbs-up and sunglasses */}
        <g id="traveler-man">
          {/* Legs & trousers in deep indigo */}
          <path
            d="M225 310 L 220 410 L 236 410 L 242 335 L 248 410 L 264 410 L 258 310 Z"
            fill="#2D2866"
          />
          {/* Shoes */}
          <rect x="214" y="408" width="24" height="10" rx="4" fill="#1E293B" />
          <rect x="248" y="408" width="24" height="10" rx="4" fill="#1E293B" />
          {/* Torso / Mustard casual shirt */}
          <path
            d="M220 220 L 262 220 L 260 312 L 222 312 Z"
            fill="#E8E7F2"
            stroke="#2D2866"
            strokeWidth="2"
          />
          <path d="M241 220 L 241 312" stroke="#2D2866" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Left Arm raised waving / thumbs up */}
          <path
            d="M220 230 L 195 210 L 188 190"
            stroke="#F6C3A6"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="187" cy="186" r="7" fill="#F6C3A6" />
          {/* Right Arm resting on car */}
          <path
            d="M260 232 L 285 248 L 305 250"
            stroke="#F6C3A6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Neck & Head */}
          <rect x="235" y="205" width="12" height="16" fill="#F6C3A6" />
          <circle cx="241" cy="182" r="19" fill="#F6C3A6" />
          {/* Hair in deep indigo */}
          <path
            d="M224 182 C 224 165, 238 160, 252 163 C 259 164, 262 173, 260 182 C 255 174, 240 172, 234 175 Z"
            fill="#2D2866"
          />
          {/* Sunglasses */}
          <rect x="230" y="179" width="10" height="7" rx="2" fill="#2D2866" />
          <rect x="243" y="179" width="10" height="7" rx="2" fill="#2D2866" />
          <line x1="239" y1="182" x2="244" y2="182" stroke="#2D2866" strokeWidth="2" />
          {/* Smile */}
          <path
            d="M236 193 Q 241 197 246 193"
            stroke="#92400E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* Woman taking vacation photo with camera */}
        <g id="traveler-woman">
          {/* Legs & skirt / stylish pink pants */}
          <path
            d="M152 315 L 148 410 L 162 410 L 168 340 L 174 410 L 188 410 L 184 315 Z"
            fill="#F472B6"
          />
          {/* White sneakers */}
          <rect
            x="142"
            y="408"
            width="22"
            height="9"
            rx="3"
            fill="#FFFFFF"
            stroke="#CBD2E1"
            strokeWidth="1.5"
          />
          <rect
            x="174"
            y="408"
            width="22"
            height="9"
            rx="3"
            fill="#FFFFFF"
            stroke="#CBD2E1"
            strokeWidth="1.5"
          />
          {/* Top in Deep Indigo */}
          <path d="M148 230 L 188 230 L 184 315 L 152 315 Z" fill="#2D2866" />
          {/* White scarf / collar accent */}
          <path d="M162 230 L 168 250 L 174 230 Z" fill="#FFFFFF" />
          {/* Arms holding camera */}
          <path
            d="M150 240 L 138 220 L 150 195"
            stroke="#FCD3B8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M185 240 L 175 220 L 162 195"
            stroke="#FCD3B8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Vintage Camera */}
          <rect
            x="142"
            y="186"
            width="28"
            height="18"
            rx="4"
            fill="#334155"
            stroke="#F8FAFC"
            strokeWidth="1.5"
          />
          <circle cx="156" cy="195" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="146" y="183" width="7" height="3" rx="1" fill="#E2E8F0" />
          {/* Camera flash burst */}
          <path
            d="M156 172 L 158 178 L 164 180 L 158 182 L 156 188 L 154 182 L 148 180 L 154 178 Z"
            fill="#FACC15"
          />

          {/* Neck and Head */}
          <rect x="162" y="210" width="10" height="15" fill="#FCD3B8" />
          <circle cx="167" cy="186" r="17" fill="#FCD3B8" />
          {/* Long flowing brown/dark hair */}
          <path
            d="M150 186 C 150 162, 185 162, 185 186 C 185 204, 180 234, 178 245 C 172 230, 160 220, 150 186 Z"
            fill="#3E2723"
          />
          {/* Hair ribbon/band in lavender */}
          <path
            d="M155 174 Q 167 170 178 174"
            stroke="#E8E7F2"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="163" cy="188" r="2.2" fill="#2D2866" />
          <path
            d="M165 197 Q 170 200 174 197"
            stroke="#92400E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* Vintage Luggage Bag next to travelers */}
        <g id="traveler-luggage">
          <rect
            x="100"
            y="340"
            width="45"
            height="65"
            rx="7"
            fill="#2D2866"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <rect x="105" y="355" width="35" height="4" fill="#E8E7F2" />
          <rect x="105" y="380" width="35" height="4" fill="#E8E7F2" />
          <path
            d="M116 340 L 116 324 L 129 324 L 129 340"
            stroke="#64748B"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="106" cy="406" r="4" fill="#0F172A" />
          <circle cx="139" cy="406" r="4" fill="#0F172A" />
        </g>
      </svg>
    </div>
  );
}

export default function HeroSection({ onSearchSubmit }) {
  const [location, setLocation] = useState("Jalore");

  const [pickupDate, setPickupDate] = useState(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 30);
    return toIsoDateTime(tomorrow);
  });

  const [returnDate, setReturnDate] = useState(() => {
    const now = new Date();
    const dropoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 18, 30);
    return toIsoDateTime(dropoff);
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarTab, setCalendarTab] = useState("pickup");

  // Auto-rotating editorial slider (cycles every 5.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Calculate live dynamic duration text
  const durationText = useMemo(() => {
    return `Duration: ${calculateDuration(pickupDate, returnDate)}`;
  }, [pickupDate, returnDate]);

  const handleSearch = () => {
    const detail = {
      tab: "Daily Rentals",
      location,
      pickupDate,
      returnDate,
      duration: durationText,
    };
    if (onSearchSubmit) {
      onSearchSubmit(detail);
    }
    window.dispatchEvent(new CustomEvent("jsd:search", { detail }));
    navigate("/fleet");
  };

  return (
    <section id="home" className="relative w-full overflow-hidden bg-white pt-6 pb-16 lg:pb-24">
      {/* Top subtle background grid & ambient tint */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#E8E7F2_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Layered pastel lavender & blush wave SVG shapes across the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 overflow-hidden">
        <svg
          viewBox="0 0 1440 280"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 160 C 320 80, 680 240, 1040 140 C 1220 90, 1360 110, 1440 130 L 1440 280 L 0 280 Z"
            fill="#E8E7F2"
            fillOpacity="0.55"
          />
          <path
            d="M0 200 C 360 140, 720 260, 1080 180 C 1260 140, 1380 160, 1440 170 L 1440 280 L 0 280 Z"
            fill="#FDECEF"
            fillOpacity="0.6"
          />
          <path
            d="M0 230 C 420 180, 840 270, 1200 220 L 1440 235 L 1440 280 L 0 280 Z"
            fill="#F8F7FC"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* UPPER HERO: Folder Tabs + 4-Column Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Daily Rentals Tab flush with search box */}
          <div className="flex items-end">
            <div className="rounded-t-xl bg-[#2D2866] px-6 py-2.5 text-sm font-bold text-white shadow-sm z-10 select-none">
              Daily Rentals
            </div>
          </div>

          {/* Main Floating Search Card (2x2 on Mobile, 4-Col on Desktop) */}
          <div className="relative rounded-b-2xl rounded-tr-2xl sm:rounded-tr-2xl border border-slate-100 bg-white p-5 shadow-[0_16px_45px_rgba(45,40,102,0.08)] sm:p-6">
            <div className="grid grid-cols-2 items-center gap-x-4 gap-y-6 md:grid-cols-4 md:gap-6">
              {/* 1. Location */}
              <div className="relative group cursor-pointer rounded-xl p-2 -m-2 transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#2D2866]">
                  <span>Location</span>
                  <ChevronDown size={16} strokeWidth={2.5} className="text-[#2D2866]" />
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 truncate">
                  {location}
                </p>
                <select
                  id="hero-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
                  aria-label="Location"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Pick-Up Date */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCalendarTab("pickup");
                  setCalendarOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCalendarTab("pickup");
                    setCalendarOpen(true);
                  }
                }}
                className="relative group cursor-pointer rounded-xl p-2 -m-2 transition-colors hover:bg-slate-50 select-none"
                aria-label="Pick-Up Date"
              >
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#2D2866]">
                  <span>Pick-Up Date</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className="text-[#2D2866] transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                  {formatDisplayDateTime(pickupDate)}
                </p>
              </div>

              {/* 3. Return Date */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCalendarTab("return");
                  setCalendarOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCalendarTab("return");
                    setCalendarOpen(true);
                  }
                }}
                className="relative group cursor-pointer rounded-xl p-2 -m-2 transition-colors hover:bg-slate-50 select-none"
                aria-label="Return Date"
              >
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#2D2866]">
                  <span>Return Date</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className="text-[#2D2866] transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                  {formatDisplayDateTime(returnDate)}
                </p>
              </div>

              {/* 4. Search CTA */}
              <div className="flex items-center justify-center md:justify-end">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSearch}
                  className="flex h-11 w-full max-w-[160px] items-center justify-center rounded-full bg-[#2D2866] hover:bg-[#1F1B4D] px-6 text-sm font-bold text-white shadow-md shadow-[#2D2866]/20 transition-all cursor-pointer"
                >
                  <span>Search</span>
                </motion.button>
              </div>
            </div>

            {/* Floating Popover Calendar directly below the inputs */}
            <AnimatePresence>
              {calendarOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCalendarOpen(false)} />
                  <div className="absolute left-0 right-0 sm:left-2 md:left-[110px] lg:left-[170px] top-[calc(100%+8px)] z-50 w-full sm:w-[680px] max-w-[calc(100vw-32px)]">
                    <CalendarPickerModal
                      isOpen={calendarOpen}
                      initialTab={calendarTab}
                      pickupDate={pickupDate}
                      returnDate={returnDate}
                      onConfirm={({ pickup, dropoff }) => {
                        setPickupDate(pickup);
                        setReturnDate(dropoff);
                        setCalendarOpen(false);
                      }}
                      onClose={() => setCalendarOpen(false)}
                    />
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Live Duration Readout directly below the left edge */}
          <div className="mt-3 px-1">
            <p className="text-xs sm:text-sm font-bold text-[#2D2866]">{durationText}</p>
          </div>
        </motion.div>

        {/* LOWER HERO: Editorial Slider (Left) & Right-Side Traveler Car Visual */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6 lg:mt-16">
          {/* Lower-Left Content: Editorial Slider */}
          <div className="lg:col-span-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2D2866]">
               
                <span>Jalore Self Drive Advantage</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#2D2866] sm:text-4xl lg:text-[42px] leading-tight">
                Self Drive Car Rent in Jalore – <span className="text-[#3E3889]">Drive on Your Terms</span>
              </h1>
            </div>

            <div className="mt-4 min-h-[90px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                >
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-[#2D2866]/5 px-3 py-1 text-xs font-bold text-[#2D2866]">
                    
                    {slides[activeSlide].title}
                  </p>
                  <p className="mt-2.5 max-w-lg text-sm md:text-base leading-relaxed text-slate-600">
                    {slides[activeSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots (Bottom-Left) */}
            <div className="mt-6 flex items-center gap-2">
              {slides.map((_, index) => {
                const isActive = activeSlide === index;
                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-1.5 transition-all duration-300 ${
                      isActive
                        ? "w-6 rounded-full bg-[#2D2866]"
                        : "w-1.5 rounded-full bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                );
              })}
            </div>

            {/* Micro badges below slider */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 rounded-full bg-[#F8F7FC] px-3.5 py-1.5 border border-slate-200/60">
                <Compass size={14} className="text-[#2D2866]" /> Unlimited Freedom
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#F8F7FC] px-3.5 py-1.5 border border-slate-200/60">
                <ShieldCheck size={14} className="text-emerald-600" /> 100% Sanitized Handover
              </span>
            </div>
          </div>

          {/* Right-Side Visual: Modern Flat Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:col-span-6 lg:justify-end"
          >
            <HeroTravelerCarIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
