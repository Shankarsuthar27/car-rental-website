import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import { navigate } from "../utils/navigation";
import logoImg from "../assets/logo";

// Steering wheel icon accent SVG
function SteeringWheelIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6" />
      <path d="M12 15v6" />
      <path d="M4.5 7.5l5.5 3" />
      <path d="M19.5 7.5l-5.5 3" />
    </svg>
  );
}

const PHONE = "+919660675406";
const WHATSAPP = "919660675406";

export default function Navbar({ onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rentalDropdown, setRentalDropdown] = useState(false);
  const [subscriptionDropdown, setSubscriptionDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    } else if (href.startsWith("#")) {
      if (
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/fleet") || window.location.pathname.startsWith("/faqs"))
      ) {
        e.preventDefault();
        navigate("/" + href);
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  const rentalOptions = [
    { title: "Hourly Rental", desc: "Short errands & city runs", href: "/fleet" },
    { title: "Daily Rental", desc: "Full 24-hour flexibility (300 km)", href: "/fleet" },
    { title: "Outstation Trips", desc: "Jodhpur, Udaipur, Mount Abu", href: "/fleet" },
  ];

  const subscriptionOptions = [
    { title: "1-Month Flexi", desc: "Zero long-term commitment", href: "#offers" },
    { title: "3-Month Saver", desc: "Best rate for extended stays", href: "#offers" },
    { title: "Annual Corporate", desc: "Dedicated fleet for businesses", href: "#offers" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "border-slate-200/80 bg-white/98 shadow-[0_10px_35px_rgba(45,40,102,0.08)]"
            : "border-slate-100 bg-white/95 shadow-[0_4px_25px_rgba(45,40,102,0.04)]"
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-100 shadow-md shadow-[#2D2866]/15 transition-transform group-hover:scale-105">
            <img src={logoImg} alt="Jalore Self Drive" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-base text-[#2D2866] sm:text-lg">
              <span>Jalore Self Drive</span>
              <SteeringWheelIcon className="h-4 w-4 text-[#2D2866] transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <p className="text-[9.5px] font-bold tracking-[0.22em] text-[#64748B] uppercase">
              • SELF DRIVE CARS •
            </p>
          </div>
        </a>

        {/* Center: Nav Links */}
        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="#offers"
            onClick={(e) => handleNavClick(e, "#offers")}
            className="relative py-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#2D2866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Deals
          </a>
          <a
            href="/fleet"
            onClick={(e) => handleNavClick(e, "/fleet")}
            className="relative py-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#2D2866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Fleets
          </a>
          <a
            href="#how"
            onClick={(e) => handleNavClick(e, "#how")}
            className="relative py-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#2D2866] after:transition-all after:duration-300 hover:after:w-full"
          >
            About Us
          </a>
          <a
            href="#footer"
            onClick={(e) => handleNavClick(e, "#footer")}
            className="relative py-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#2D2866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact Us
          </a>
          <a
            href="/faqs"
            onClick={(e) => handleNavClick(e, "/faqs")}
            className="relative py-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#2D2866] after:transition-all after:duration-300 hover:after:w-full"
          >
            FAQs
          </a>

          {/* Car Rental Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setRentalDropdown(true)}
            onMouseLeave={() => setRentalDropdown(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors hover:text-[#2D2866]"
            >
              Car Rental
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${rentalDropdown ? "rotate-180 text-[#2D2866]" : ""}`}
              />
            </button>
            <AnimatePresence>
              {rentalDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_16px_40px_rgba(45,40,102,0.12)]"
                >
                  {rentalOptions.map((opt) => (
                    <a
                      key={opt.title}
                      href={opt.href}
                      onClick={(e) => {
                        setRentalDropdown(false);
                        handleNavClick(e, opt.href);
                      }}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F8F7FC]"
                    >
                      <p className="text-sm font-bold text-[#2D2866]">{opt.title}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Car Subscription Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSubscriptionDropdown(true)}
            onMouseLeave={() => setSubscriptionDropdown(false)}
          >
            
            <AnimatePresence>
              {subscriptionDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_16px_40px_rgba(45,40,102,0.12)]"
                >
                  {subscriptionOptions.map((opt) => (
                    <a
                      key={opt.title}
                      href={opt.href}
                      onClick={(e) => {
                        setSubscriptionDropdown(false);
                        handleNavClick(e, opt.href);
                      }}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F8F7FC]"
                    >
                      <p className="text-sm font-bold text-[#2D2866]">{opt.title}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-5 md:flex"></div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden hover:bg-slate-50"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      </header>

      {/* Mobile Right-Slide Drawer (rendered outside <header> so backdrop-blur-md doesn't trap fixed positioning) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90] bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-in drawer panel from the right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[100] flex h-[100dvh] w-[86vw] max-w-sm flex-col justify-between bg-white p-5 sm:p-6 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div>
                {/* Header with Logo + Close Button */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                      <img
                        src={logoImg}
                        alt="Jalore Self Drive"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-base text-[#2D2866]">
                        <span>Jalore Self Drive</span>
                        <SteeringWheelIcon className="h-4 w-4 text-[#2D2866]" />
                      </div>
                      <p className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase">
                        • SELF DRIVE CARS •
                      </p>
                    </div>
                  </a>

                  {/* Close button matching screenshot */}
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="py-4 space-y-1">
                  {[
                    { label: "Deals", href: "#offers" },
                    { label: "Fleets", href: "/fleet" },
                    { label: "About Us", href: "#how" },
                    { label: "Contact Us", href: "#footer" },
                    { label: "FAQs", href: "/faqs" },
                  ].map((link, idx) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.045, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(e) => {
                        setMobileOpen(false);
                        handleNavClick(e, link.href);
                      }}
                      className="block rounded-xl px-2 py-2.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-[#2D2866]"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* CAR RENTAL & SUBSCRIPTION Section */}
                <div className="pt-2">
                  <p className="mb-2.5 text-xs font-bold tracking-wider text-[#8A99AD] uppercase">
                    Car Rental & Subscription
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="/fleet"
                      onClick={(e) => {
                        setMobileOpen(false);
                        handleNavClick(e, "/fleet");
                      }}
                      className="rounded-xl bg-[#F4F4F8] py-3 px-4 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-[#EBEBF2] hover:text-[#2D2866]"
                    >
                      Daily & Hourly
                    </a>
                    <a
                      href="#offers"
                      onClick={(e) => {
                        setMobileOpen(false);
                        handleNavClick(e, "#offers");
                      }}
                      className="rounded-xl bg-[#F4F4F8] py-3 px-4 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-[#EBEBF2] hover:text-[#2D2866]"
                    >
                      Monthly Plan
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href={`tel:${PHONE}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 px-4 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <Phone size={15} className="text-slate-700" />
                  <span>Call Support</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
