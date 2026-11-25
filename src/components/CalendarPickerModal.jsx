import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react";

// Helper to pad 2 digits
function pad(n) {
  return String(n).padStart(2, "0");
}

// Convert Date object to "YYYY-MM-DDTHH:mm" format
export function toIsoDateTime(d) {
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Format Date object to "25-Nov-2026 09:30 AM"
export function formatDisplay(d) {
  if (!d || isNaN(d.getTime())) return "";
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
  const day = pad(d.getDate());
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? pad(hours) : "12";
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

// Check if two dates represent the exact same calendar day
function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CalendarPickerModal({
  isOpen,
  initialTab = "return", // "pickup" or "return"
  pickupDate,
  returnDate,
  onConfirm,
  onClose,
}) {
  // Current active mode: "pickup" or "return"
  const [activeMode, setActiveMode] = useState(initialTab);

  // Working Date objects
  const [pickDate, setPickDate] = useState(() => {
    const parsed = pickupDate ? new Date(pickupDate) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });

  const [dropDate, setDropDate] = useState(() => {
    const parsed = returnDate ? new Date(returnDate) : null;
    if (parsed && !isNaN(parsed.getTime())) return parsed;
    const next = new Date(pickDate);
    next.setDate(next.getDate() + 2);
    next.setHours(18, 30, 0, 0);
    return next;
  });

  // Calendar month being viewed: month index 0-11 and year
  const [viewYear, setViewYear] = useState(() => {
    const target = initialTab === "return" ? dropDate || pickDate : pickDate;
    return target.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const target = initialTab === "return" ? dropDate || pickDate : pickDate;
    return target.getMonth();
  });

  // Month selector dropdown open state
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  // Sync when initialTab or dates change
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialTab);
      const p = pickupDate ? new Date(pickupDate) : new Date();
      const validP = isNaN(p.getTime()) ? new Date() : p;
      setPickDate(validP);

      const r = returnDate ? new Date(returnDate) : null;
      if (r && !isNaN(r.getTime())) {
        setDropDate(r);
      } else {
        const next = new Date(validP);
        next.setDate(next.getDate() + 2);
        next.setHours(18, 30, 0, 0);
        setDropDate(next);
      }

      const focusTarget = initialTab === "return" && r ? r : validP;
      setViewYear(focusTarget.getFullYear());
      setViewMonth(focusTarget.getMonth());
    }
  }, [isOpen, initialTab, pickupDate, returnDate]);

  // Today at midnight
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isPrevDisabled = useMemo(() => {
    return (
      viewYear < today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth <= today.getMonth())
    );
  }, [viewYear, viewMonth, today]);

  // Generate calendar days
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sun
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ isBlank: true, key: `blank-${i}` });
    }
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(viewYear, viewMonth, day);
      const isPast = cellDate < today;
      const isToday = isSameDay(cellDate, today);
      const isPick = isSameDay(cellDate, pickDate);
      const isDrop = isSameDay(cellDate, dropDate);
      const isInRange = cellDate > pickDate && cellDate < dropDate && !isPick && !isDrop;

      cells.push({
        isBlank: false,
        key: `day-${day}`,
        dayNumber: day,
        date: cellDate,
        isPast,
        isToday,
        isPick,
        isDrop,
        isInRange,
      });
    }
    return cells;
  }, [viewYear, viewMonth, today, pickDate, dropDate]);

  // Handle clicking a calendar day
  const handleSelectDay = (cellDate) => {
    if (cellDate < today) return;

    if (activeMode === "pickup") {
      const newPick = new Date(cellDate);
      newPick.setHours(pickDate.getHours(), pickDate.getMinutes(), 0, 0);
      setPickDate(newPick);

      // If dropoff is before or same day, push dropoff forward by 1 day
      if (dropDate <= newPick) {
        const newDrop = new Date(newPick);
        newDrop.setDate(newDrop.getDate() + 1);
        newDrop.setHours(dropDate.getHours(), dropDate.getMinutes(), 0, 0);
        setDropDate(newDrop);
      }
      setActiveMode("return");
    } else {
      // In return mode
      if (cellDate < pickDate) {
        // If clicked day is before pickup, adjust pickup instead
        const newPick = new Date(cellDate);
        newPick.setHours(pickDate.getHours(), pickDate.getMinutes(), 0, 0);
        setPickDate(newPick);
      } else {
        const newDrop = new Date(cellDate);
        newDrop.setHours(dropDate.getHours(), dropDate.getMinutes(), 0, 0);
        setDropDate(newDrop);
      }
    }
  };

  // Stepper Time Controls for active date
  const activeDate = activeMode === "pickup" ? pickDate : dropDate;
  const rawHours = activeDate.getHours();
  const rawMinutes = activeDate.getMinutes();

  const displayHours = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const ampm = rawHours >= 12 ? "PM" : "AM";

  const updateActiveTime = (newHours24, newMinutes) => {
    if (activeMode === "pickup") {
      const updated = new Date(pickDate);
      updated.setHours(newHours24, newMinutes, 0, 0);
      setPickDate(updated);
      if (dropDate <= updated) {
        const newDrop = new Date(updated);
        newDrop.setHours(newDrop.getHours() + 4);
        setDropDate(newDrop);
      }
    } else {
      const updated = new Date(dropDate);
      updated.setHours(newHours24, newMinutes, 0, 0);
      setDropDate(updated);
    }
  };

  // Hour stepper
  const stepHour = (delta) => {
    let h12 = displayHours + delta;
    if (h12 > 12) h12 = 1;
    if (h12 < 1) h12 = 12;

    let h24 = h12;
    if (ampm === "PM" && h12 < 12) h24 += 12;
    if (ampm === "AM" && h12 === 12) h24 = 0;

    updateActiveTime(h24, rawMinutes);
  };

  // Minute stepper (steps in 15-minute increments: 00 -> 15 -> 30 -> 45)
  const stepMinute = (delta) => {
    let m = rawMinutes + delta * 15;
    if (m >= 60) m = 0;
    if (m < 0) m = 45;
    updateActiveTime(rawHours, m);
  };

  // AM/PM stepper
  const toggleAmPm = () => {
    let h24 = rawHours;
    if (ampm === "AM") {
      h24 = (rawHours + 12) % 24;
    } else {
      h24 = (rawHours - 12 + 24) % 24;
    }
    updateActiveTime(h24, rawMinutes);
  };

  const handleSave = () => {
    if (onConfirm) {
      onConfirm({
        pickup: toIsoDateTime(pickDate),
        dropoff: toIsoDateTime(dropDate),
      });
    }
    if (onClose) onClose();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative w-full max-w-[700px] overflow-hidden rounded-[24px] border border-[#DDD9EE] bg-[#EEEDF8] p-6 sm:p-7 shadow-[0_16px_50px_rgba(45,40,102,0.16)] text-[#2D2866]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-slate-500 hover:bg-white hover:text-[#2D2866] transition-colors shadow-xs"
      >
        <X size={15} />
      </button>

      {/* Mode Switcher Tabs (Pick-up / Return) */}
      <div className="mb-4 flex items-center gap-2 border-b border-[#E2E0EE]/70 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveMode("pickup");
            setViewYear(pickDate.getFullYear());
            setViewMonth(pickDate.getMonth());
          }}
          className={`text-sm font-bold tracking-tight px-3 py-1.5 rounded-full transition-all ${
            activeMode === "pickup"
              ? "bg-[#2D2866] text-white shadow-xs"
              : "text-[#706C8F] hover:text-[#2D2866] hover:bg-white/60"
          }`}
        >
          Pick-up date & time
        </button>
        <span className="text-slate-300">•</span>
        <button
          type="button"
          onClick={() => {
            setActiveMode("return");
            setViewYear(dropDate.getFullYear());
            setViewMonth(dropDate.getMonth());
          }}
          className={`text-sm font-bold tracking-tight px-3 py-1.5 rounded-full transition-all ${
            activeMode === "return"
              ? "bg-[#2D2866] text-white shadow-xs"
              : "text-[#706C8F] hover:text-[#2D2866] hover:bg-white/60"
          }`}
        >
          Return date & time
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.1fr] items-start gap-y-6 sm:gap-y-0">
        {/* LEFT COLUMN: Date Calendar */}
        <div className="pr-0 sm:pr-6">
          {/* Column Header: "Return date" or "Pick-up date" */}
          <h3 className="text-lg font-bold text-[#2D2866] tracking-tight">
            {activeMode === "pickup" ? "Pick-up date" : "Return date"}
          </h3>

          {/* Month & Year Navigator */}
          <div className="relative mt-3 mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className="flex items-center gap-1.5 font-bold text-sm text-[#2D2866] hover:text-[#1F1B4D] transition-colors"
            >
              <span>
                {monthNames[viewMonth]} {viewYear}
              </span>
              <ChevronDown size={14} className="text-[#2D2866]" />
            </button>

            {/* Month Dropdown Menu */}
            {monthDropdownOpen && (
              <div className="absolute top-7 left-0 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                {monthNames.map((name, idx) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setViewMonth(idx);
                      setMonthDropdownOpen(false);
                    }}
                    className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold ${
                      idx === viewMonth
                        ? "bg-[#2D2866] text-white"
                        : "text-slate-700 hover:bg-[#F5F4FA]"
                    }`}
                  >
                    {name} {viewYear}
                  </button>
                ))}
              </div>
            )}

            {/* Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={isPrevDisabled}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  isPrevDisabled
                    ? "opacity-25 cursor-not-allowed text-slate-400"
                    : "text-[#706C8F] hover:bg-white/80 hover:text-[#2D2866]"
                }`}
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#706C8F] hover:bg-white/80 hover:text-[#2D2866] transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Row (Single Letter: S M T W T F S) */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#8E8AAB] py-1 mb-1">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm font-medium">
            {calendarCells.map((cell) => {
              if (cell.isBlank) {
                return <div key={cell.key} className="h-8 w-8" />;
              }

              let btnStyle = "text-[#4A4568] hover:bg-white/80 transition-colors";
              if (cell.isPast) {
                btnStyle = "text-[#C4C2D6] cursor-not-allowed";
              } else if (cell.isDrop) {
                // Return date: Solid dark indigo circle (#2B2468)
                btnStyle = "bg-[#2B2468] text-white font-extrabold shadow-sm scale-105 z-10";
              } else if (cell.isPick) {
                // Pick-up date: Solid medium indigo/purple circle (#6E629D)
                btnStyle = "bg-[#6E629D] text-white font-extrabold shadow-sm scale-105 z-10";
              } else if (cell.isInRange) {
                btnStyle = "text-[#2D2866] font-bold";
              }

              return (
                <div key={cell.key} className="flex items-center justify-center p-0.5">
                  <button
                    type="button"
                    disabled={cell.isPast}
                    onClick={() => handleSelectDay(cell.date)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${btnStyle}`}
                  >
                    <span>{cell.dayNumber}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden sm:block w-[1px] h-full bg-[#E2E0EE]" />

        {/* RIGHT COLUMN: Time Stepper */}
        <div className="pl-0 sm:pl-6 flex flex-col justify-between h-full pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E2E0EE]">
          {/* Column Header: "Return time" or "Pick-up time" */}
          <h3 className="text-lg font-bold text-[#2D2866] tracking-tight">
            {activeMode === "pickup" ? "Pick-up time" : "Return time"}
          </h3>

          {/* Stepper Row matching screenshot exactly */}
          <div className="my-auto py-8 sm:py-10 flex items-center justify-center">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 select-none">
              {/* Left horizontal line */}
              <span className="w-5 sm:w-6 h-[2px] bg-[#3B336A] rounded-full shrink-0" />

              {/* Hour column */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Hour Up"
                  onClick={() => stepHour(1)}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronUp size={22} strokeWidth={2.6} />
                </button>
                <span className="text-[28px] sm:text-[32px] font-extrabold text-[#3B336A] tracking-tight leading-none my-2.5 w-10 text-center font-sans">
                  {pad(displayHours)}
                </span>
                <button
                  type="button"
                  aria-label="Hour Down"
                  onClick={() => stepHour(-1)}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronDown size={22} strokeWidth={2.6} />
                </button>
              </div>

              {/* Colon */}
              <div className="flex flex-col items-center justify-center px-0.5">
                <span className="invisible p-1" aria-hidden="true">
                  <ChevronUp size={22} />
                </span>
                <span className="text-[26px] sm:text-[30px] font-extrabold text-[#3B336A] leading-none my-2.5">
                  :
                </span>
                <span className="invisible p-1" aria-hidden="true">
                  <ChevronDown size={22} />
                </span>
              </div>

              {/* Minute column */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Minute Up"
                  onClick={() => stepMinute(1)}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronUp size={22} strokeWidth={2.6} />
                </button>
                <span className="text-[28px] sm:text-[32px] font-extrabold text-[#3B336A] tracking-tight leading-none my-2.5 w-10 text-center font-sans">
                  {pad(rawMinutes)}
                </span>
                <button
                  type="button"
                  aria-label="Minute Down"
                  onClick={() => stepMinute(-1)}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronDown size={22} strokeWidth={2.6} />
                </button>
              </div>

              {/* AM/PM column */}
              <div className="flex flex-col items-center ml-0.5 sm:ml-1">
                <button
                  type="button"
                  aria-label="Toggle AM/PM"
                  onClick={toggleAmPm}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronUp size={22} strokeWidth={2.6} />
                </button>
                <span className="text-[22px] sm:text-[26px] font-extrabold text-[#3B336A] tracking-tight leading-none my-2.5 w-11 text-center font-sans">
                  {ampm}
                </span>
                <button
                  type="button"
                  aria-label="Toggle AM/PM"
                  onClick={toggleAmPm}
                  className="text-[#3B336A] hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <ChevronDown size={22} strokeWidth={2.6} />
                </button>
              </div>

              {/* Right horizontal line */}
              <span className="w-5 sm:w-6 h-[2px] bg-[#3B336A] rounded-full shrink-0" />

              {/* Save Button */}
              <div className="flex flex-col items-center justify-center ml-2 sm:ml-3">
                <span className="invisible p-1" aria-hidden="true">
                  <ChevronUp size={22} />
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="my-2.5 rounded-full bg-[#2B2360] hover:bg-[#1E174D] px-5 sm:px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Save
                </button>
                <span className="invisible p-1" aria-hidden="true">
                  <ChevronDown size={22} />
                </span>
              </div>
            </div>
          </div>

          {/* Quick confirmation hint */}
          <div className="text-right text-[11px] font-semibold text-[#8E8AAB] mt-auto">
            {formatDisplay(activeDate)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
