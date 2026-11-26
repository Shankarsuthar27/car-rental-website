import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car,
  ChevronDown,
  CircleCheck,
  Clock3,
  Camera,
  Fuel,
  Gauge,
  Headphones,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { fleetData, getVehiclesFromSupabase } from "./data/fleetData";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BestSellingModels from "./components/BestSellingModels";
import { navigate } from "./utils/navigation";
import {
  jsdHeroSuv,
  step1Img,
  step2Img,
  step3Img,
  logoImg,
} from "./assets/images";

const PHONE = "+919783555555";
const WHATSAPP = "919783555555";
const money = (value) => new Intl.NumberFormat("en-IN").format(value);
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55 },
};

function SectionTitle({ eyebrow, title, copy, light = false }) {
  return (
    <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
      <span
        className={`inline-block mb-3 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
          light ? "bg-white/10 text-[#E8E7F2]" : "bg-[#E8E7F2] text-[#2D2866]"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-[#2D2866]"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 leading-7 ${light ? "text-slate-300" : "text-slate-600"}`}>{copy}</p>
      )}
    </motion.div>
  );
}

const featureItems = [
  [
    Zap,
    "Drive on Your Terms",
    "No driver, no fixed schedule. Take the scenic route, stop whenever you like, and travel at your own pace.",
  ],
  [
    Sparkles,
    "Clean & Road-Ready",
    "Every car is thoroughly sanitized and safety-checked before we hand you the keys.",
  ],
  [
    Clock3,
    "Hourly or Daily Plans",
    "Quick city errand or a multi-day road trip? Pick a rental plan that fits your trip and budget.",
  ],
  [
    BadgeCheck,
    "Zero Hidden Charges",
    "Clear, upfront pricing from the start. What you see is exactly what you pay.",
  ],
];

function WhySection() {
  return (
    <section id="why" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Made for local journeys"
          title="Why Jalore drives with JSD"
          copy="Reliable cars, straightforward pricing, and friendly local support—from first message to final drop-off."
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featureItems.map(([Icon, title, copy]) => (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              key={title}
              className="group rounded-2xl border border-slate-100 bg-[#F8F7FC] p-6 transition-all hover:-translate-y-1 hover:border-[#2D2866]/30 hover:shadow-xl hover:shadow-[#2D2866]/05"
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#E8E7F2] text-[#2D2866] transition-all group-hover:bg-[#2D2866] group-hover:text-white group-hover:scale-105">
                <Icon size={22} />
              </span>
              <h3 className="font-extrabold text-[#2D2866] text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          {...reveal}
          className="mt-14 overflow-hidden rounded-[28px] bg-[#2D2866] px-6 py-10 text-white shadow-xl shadow-[#2D2866]/15 sm:px-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8E7F2]">
                Every trip, sorted
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-white">
                Everything you need for a smooth rental.
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                "FASTag enabled",
                "Verified documents",
                "Quick deposit refund",
                "24/7 local assistance",
              ].map((x) => (
                <p key={x} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <CircleCheck size={17} className="shrink-0 text-emerald-400" />
                  {x}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Filters({ filters, setFilters, clear }) {
  const toggle = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-extrabold text-[#2D2866]">
          <SlidersHorizontal size={18} /> Filters
        </h3>
        <button onClick={clear} className="text-xs font-bold text-[#2D2866] hover:underline">
          Clear all
        </button>
      </div>
      <label className="field-label">Search a car</label>
      <div className="field-wrap mb-6 bg-white">
        <Search size={17} className="text-slate-400" />
        <input
          placeholder="Scorpio, Swift..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
      </div>
      {[
        ["Segment", "segment", ["SUV", "Compact SUV", "Hatchback"]],
        ["Fuel type", "fuel", ["Petrol", "Diesel", "CNG"]],
        ["Transmission", "transmission", ["Manual"]],
      ].map(([title, key, options]) => (
        <div className="mb-6" key={key}>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                type="button"
                onClick={() => toggle(key, option)}
                key={option}
                className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                  filters[key] === option
                    ? "border-[#2D2866] bg-[#2D2866] text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#2D2866]/40"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <label className="field-label">Sort by</label>
      <div className="field-wrap bg-white">
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="text-slate-700 font-semibold"
        >
          <option value="low">Price: Low to high</option>
          <option value="high">Price: High to low</option>
          <option value="newest">Model year: Newest</option>
        </select>
      </div>
    </div>
  );
}

function VehicleCard({ car, onBook }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(45,40,102,0.06)] transition-all hover:shadow-[0_16px_40px_rgba(45,40,102,0.12)]"
    >
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${car.tone}`}>
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-black tracking-wider text-white shadow-sm uppercase ${
            car.status === "available" ? "bg-emerald-600" : "bg-amber-600"
          }`}
        >
          {car.status || "AVAILABLE"}
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#2D2866] shadow-sm backdrop-blur">
          {car.year} MODEL
        </span>
        <img
          src={car.image || jsdHeroSuv}
          alt={`${car.name} rental car`}
          className="h-full w-full scale-105 object-contain p-2 mix-blend-multiply transition duration-500 hover:scale-115"
          onError={(e) => {
            const fallback = car.fallbackImage || jsdHeroSuv;
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
        />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D2866]">
          {car.segment}
        </p>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#2D2866]">{car.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} className="text-[#2D2866]" /> {car.branch}
        </p>
        <div className="my-5 grid grid-cols-2 gap-y-3 rounded-xl bg-[#F8F7FC] p-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-[#2D2866]" /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1.5">
            <Car size={15} className="text-[#2D2866]" /> {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Fuel size={15} className="text-[#2D2866]" /> {car.fuel}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge size={15} className="text-[#2D2866]" /> {car.limit}
          </span>
        </div>
        <div className="flex items-end justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">Daily from</p>
            <p className="text-2xl font-black text-[#2D2866]">
              ₹{money(car.dailyRate)}
              <span className="text-xs font-semibold text-slate-500">/day</span>
            </p>
          </div>
          <p className="text-sm font-bold text-slate-600">
            ₹{money(car.hourlyRate)}
            <span className="text-xs text-slate-400">/hr</span>
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onBook(car)}
            className="flex-1 rounded-full bg-[#2D2866] py-3 text-sm font-bold text-white shadow-md shadow-[#2D2866]/20 transition-all hover:bg-[#1F1B4D] flex items-center justify-center gap-1.5"
          >
            <span>Book now</span>
            <ArrowRight size={15} />
          </motion.button>
          <a
            aria-label={`WhatsApp about ${car.name}`}
            target="_blank"
            rel="noreferrer"
            href={waLink(
              `Hi JSD, I want to book the ${car.name} at ₹${money(car.dailyRate)}/day. Please share availability.`,
            )}
            className="grid h-11 w-11 place-items-center rounded-full bg-emerald-500 text-white transition-all hover:bg-emerald-600 hover:scale-105 shadow-md shadow-emerald-500/20"
          >
            <MessageCircle size={19} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function FleetSection({ onBook }) {
  const initial = { search: "", segment: "", fuel: "", transmission: "", sort: "low" };
  const [filters, setFilters] = useState(initial);
  const [drawer, setDrawer] = useState(false);
  const [fleet, setFleet] = useState(fleetData);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getVehiclesFromSupabase().then((data) => {
      if (isMounted && data && data.length > 0) {
        setFleet(data);
        setIsLiveFromDb(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleHeroSearch = ({ detail }) => {
      setFilters((current) => ({
        ...current,
        segment: detail.tab === "Monthly Subscription" ? "SUV" : "",
      }));
    };
    window.addEventListener("jsd:search", handleHeroSearch);
    return () => window.removeEventListener("jsd:search", handleHeroSearch);
  }, []);

  const cars = useMemo(() => {
    const result = fleet.filter(
      (car) =>
        (!filters.search || car.name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (!filters.segment || car.segment === filters.segment) &&
        (!filters.fuel || car.fuel === filters.fuel) &&
        (!filters.transmission || car.transmission === filters.transmission),
    );
    return result.sort((a, b) =>
      filters.sort === "high"
        ? b.dailyRate - a.dailyRate
        : filters.sort === "newest"
          ? b.year - a.year
          : a.dailyRate - b.dailyRate,
    );
  }, [filters, fleet]);

  return (
    <section id="fleet" className="section-pad bg-[#F8F7FC]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Choose your drive"
          title="A car for every Rajasthan road"
          copy="From agile hatchbacks for city runs to commanding SUVs for long highway journeys."
        />
        <button
          onClick={() => setDrawer(true)}
          className="btn-secondary mb-5 w-full justify-center lg:hidden"
        >
          <SlidersHorizontal size={17} /> Filter & sort cars
        </button>
        <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="sticky top-24 hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:block">
            <Filters filters={filters} setFilters={setFilters} clear={() => setFilters(initial)} />
          </aside>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                <b className="text-[#2D2866]">{cars.length}</b> cars available
              </p>
              <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isLiveFromDb ? "Live Supabase Database" : "Live availability"}</span>
              </span>
            </div>
            <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {cars.map((car) => (
                  <VehicleCard key={car.id} car={car} onBook={onBook} />
                ))}
              </AnimatePresence>
            </motion.div>
            {!cars.length && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <Car className="mx-auto text-slate-300" size={38} />
                <h3 className="mt-4 font-bold text-[#2D2866]">No matching cars</h3>
                <button
                  className="mt-2 text-sm font-bold text-[#2D2866] hover:underline"
                  onClick={() => setFilters(initial)}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-[70] bg-slate-950/50 p-4 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white p-6"
            >
              <button onClick={() => setDrawer(false)} className="absolute right-5 top-5">
                <X />
              </button>
              <Filters
                filters={filters}
                setFilters={setFilters}
                clear={() => setFilters(initial)}
              />
              <button
                onClick={() => setDrawer(false)}
                className="btn-primary mt-5 w-full justify-center"
              >
                Show {cars.length} cars
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Choose your car",
      copy: "Browse our 11-car fleet and pick an hourly or daily plan that fits.",
      image: step1Img,
      tag: "11-Car Fleet",
    },
    {
      step: "02",
      icon: ShieldCheck,
      title: "Quick KYC & confirm",
      copy: "Share your driving licence and Aadhaar securely on WhatsApp.",
      image: step2Img,
      tag: "Fast WhatsApp Verification",
    },
    {
      step: "03",
      icon: KeyRound,
      title: "Pick up & drive",
      copy: "Collect at Jalore Main Branch or request doorstep delivery.",
      image: step3Img,
      tag: "Doorstep Delivery",
    },
  ];
  return (
    <section id="how" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Easy from search to street"
          title="Your keys in three simple steps"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                {...reveal}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                key={item.title}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(45,40,102,0.06)] transition-all hover:border-slate-200 hover:shadow-[0_20px_45px_rgba(45,40,102,0.12)]"
              >
                {/* Visual Image Banner with Badges */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Step pill badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#2D2866]/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                    <span>Step {item.step}</span>
                  </div>
                  {/* Floating Action Icon */}
                  <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-[#2D2866] shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-3 pt-5">
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      {item.tag}
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#2D2866]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.copy}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OffersReviews() {
  const offers = [
    ["Weekend escape", "Save 10%", "Book Friday–Sunday and make more room for the road."],
    ["Weekly rental", "7 days, less", "Ask for our value-packed long rental rates."],
    ["First JSD ride", "Welcome offer", "A special deal for first-time JSD explorers."],
  ];
  const reviews = [
    [
      "Himmat Singh",
      "Jalore",
      "Clean Scorpio and a very easy handover. The pricing was exactly as discussed.",
    ],
    [
      "Priya Rathore",
      "Bhinmal",
      "Booked on WhatsApp for a family trip. Quick response and a smooth car.",
    ],
    ["Karan Mehta", "Sanchore", "The Swift was perfect for our Jodhpur trip. Great local support."],
    [
      "Nisha Joshi",
      "Ahore",
      "Flexible timing and no confusing paperwork. Would happily book again.",
    ],
  ];
  return (
    <>
      <section id="offers" className="section-pad overflow-hidden bg-[#1F1B4D]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="Limited-time value"
            title="Trending offers for your next drive"
            light
          />
          <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-4">
            {offers.map(([title, deal, copy], i) => (
              <motion.div
                {...reveal}
                key={title}
                className="min-w-[290px] flex-1 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-7 text-white sm:min-w-[350px] hover:border-[#E8E7F2]/40 transition-colors"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="rounded-full bg-[#E8E7F2] px-3.5 py-1 text-xs font-bold text-[#2D2866]">
                    OFFER 0{i + 1}
                  </span>
                  <Sparkles className="text-amber-300" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                <p className="mt-1 text-3xl font-black text-[#E8E7F2]">{deal}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">{copy}</p>
                <a
                  href={waLink(`Hi JSD, tell me more about the ${title} offer.`)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#E8E7F2] transition-colors"
                >
                  Claim on WhatsApp <ArrowRight size={15} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Real local journeys" title="Loved by drivers across Jalore" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map(([name, place, review]) => (
              <motion.article
                {...reveal}
                key={name}
                className="rounded-2xl border border-slate-100 bg-[#F8F7FC] p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-600">“{review}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2D2866] text-xs font-bold text-white shadow-sm">
                    {name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <p className="text-sm">
                    <b className="block text-[#2D2866]">{name}</b>
                    <span className="text-xs text-slate-400">{place}, Rajasthan</span>
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FAQs() {
  const [open, setOpen] = useState(0);
  const items = [
    [
      "Is there a security deposit?",
      "A refundable security deposit may apply based on the car and trip duration. Our team confirms the exact amount before booking, with no hidden surprises.",
    ],
    [
      "What does the 300 km/24h limit mean?",
      "Each 24-hour daily booking includes up to 300 kilometres of driving. Multi-day bookings include 300 km for each booked day.",
    ],
    [
      "What are the extra kilometre charges?",
      "Extra-kilometre charges vary by vehicle. Ask our booking team for the exact rate for your selected car before confirming.",
    ],
    [
      "Which documents do I need?",
      "You need a valid driving licence and Aadhaar card. Additional verification may be requested during quick KYC.",
    ],
    [
      "Can you deliver the car to my doorstep?",
      "Yes, doorstep delivery is available in and around Jalore depending on distance, timing, and vehicle availability.",
    ],
  ];
  return (
    <section id="faqs" className="section-pad bg-[#F8F7FC]">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle eyebrow="Need to know" title="Frequently asked questions" />
        <div className="space-y-3">
          {items.map(([question, answer], i) => (
            <div
              key={question}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-[#2D2866]"
              >
                <span>{question}</span>
                <ChevronDown
                  className={`shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180 text-[#2D2866]" : "text-slate-400"
                  }`}
                  size={20}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ isFleetPage = false }) {
  const areas = [
    "Jalore",
    "Ahore",
    "Bhinmal",
    "Sanchore",
    "Raniwara",
    "Falna",
    "Sumerpur",
    "Jodhpur & Udaipur trips",
  ];
  return (
    <footer id="footer" className="bg-[#1F1B4D] pb-20 text-white md:pb-0">
      <div className="border-b border-white/10 bg-[#2D2866]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#E8E7F2]">
            Pickup, drop & trips across
          </p>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-200"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-700/40 shadow-md">
              <img
                src={logoImg}
                alt="Jalore Self Drive Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <b className="block text-white">Jalore Self Drive</b>
              <small className="text-slate-400">• SELF DRIVE CARS •</small>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            Reliable self-drive cars from Jalore for city errands, family journeys, and open-road
            Rajasthan escapes.
          </p>
          <div className="mt-5 flex gap-2">
            <a className="social" href="#" aria-label="Photo gallery">
              <Camera size={18} />
            </a>
            <a className="social" href="#" aria-label="Share JSD">
              <Share2 size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Quick links</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            {[
              ["Our Fleet", "/fleet"],
              ["How It Works", "#how"],
              ["Offers", "#offers"],
              ["FAQs", "#faqs"],
            ].map(([a, b]) => (
              <a
                className="block transition hover:text-white cursor-pointer"
                href={b}
                key={a}
                onClick={(e) => {
                  if (b.startsWith("/")) {
                    e.preventDefault();
                    navigate(b);
                  } else if (isFleetPage && b.startsWith("#")) {
                    e.preventDefault();
                    navigate("/" + b);
                    setTimeout(() => {
                      document.querySelector(b)?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
              >
                {a}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Jalore Main Branch</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p className="flex gap-2">
              <MapPin size={17} className="shrink-0 text-[#E8E7F2]" /> Jalore, Rajasthan 343001
            </p>
            <a href={`tel:${PHONE}`} className="flex gap-2 transition hover:text-white">
              <Phone size={17} className="text-[#E8E7F2]" /> +91 97835 55555
            </a>
            <p className="flex gap-2">
              <Headphones size={17} className="text-[#E8E7F2]" /> 24/7 booking support
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © 2026 Jalore Self Drive. All rights reserved.
      </div>
    </footer>
  );
}

function BookingModal({ car, onClose }) {
  const [date, setDate] = useState("");
  const [plan, setPlan] = useState("Daily");
  if (!car) return null;
  const message = `Hi JSD, I want to book the ${car.name} on ${
    date || "my selected date"
  } at ₹${money(plan === "Daily" ? car.dailyRate : car.hourlyRate)}/${
    plan === "Daily" ? "day" : "hr"
  }. Please confirm availability.`;
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <X size={18} />
        </button>
        <span className="inline-block rounded-full bg-[#E8E7F2] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2D2866]">
          Quick Booking
        </span>
        <h2 className="mt-2 text-2xl font-black text-[#2D2866]">{car.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{car.branch}</p>
        <div className="my-5 rounded-2xl bg-[#F8F7FC] p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Starting at</p>
          <p className="text-2xl font-black text-[#2D2866]">
            ₹{money(plan === "Daily" ? car.dailyRate : car.hourlyRate)}
            <span className="text-xs text-slate-500">/{plan === "Daily" ? "day" : "hr"}</span>
          </p>
        </div>
        <label className="field-label">Select plan</label>
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {["Daily", "Hourly"].map((x) => (
            <button
              type="button"
              onClick={() => setPlan(x)}
              key={x}
              className={`rounded-lg py-2.5 text-sm font-bold transition-all ${
                plan === x
                  ? "bg-[#2D2866] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {x}
            </button>
          ))}
        </div>
        <label className="field-label">Pickup date</label>
        <div className="field-wrap">
          <CalendarDays size={17} className="text-[#2D2866]" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href={waLink(message)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 font-bold text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
        >
          <MessageCircle size={18} /> Confirm on WhatsApp
        </a>
        <p className="mt-3 text-center text-xs text-slate-400">
          No payment required to check availability.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Clean Login / Signup modal in Indigo & White
function AuthModal({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-md shadow-[#2D2866]/10">
            <img
              src={logoImg}
              alt="Jalore Self Drive Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#2D2866]">Login or Signup</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your bookings, invoices & exclusive JSD member rates.
            </p>
          </div>
        </div>

        {!submitted ? (
          <div>
            <label className="field-label">Mobile Number</label>
            <div className="field-wrap mb-4">
              <span className="font-bold text-slate-600">+91</span>
              <input
                type="tel"
                maxLength="10"
                placeholder="Enter 10-digit mobile"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="text-base font-bold text-[#1E293B]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (phoneNumber.length >= 10) setSubmitted(true);
              }}
              disabled={phoneNumber.length < 10}
              className={`w-full rounded-full py-3.5 text-sm font-bold text-white shadow-md transition-all ${
                phoneNumber.length >= 10
                  ? "bg-[#2D2866] hover:bg-[#1F1B4D] shadow-[#2D2866]/20"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Get OTP
            </motion.button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
                OR QUICK LOGIN
              </span>
            </div>

            <a
              target="_blank"
              rel="noreferrer"
              href={waLink("Hi JSD, I want to login to my JSD booking account.")}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-[#F8F7FC] hover:border-[#2D2866]/40"
            >
              <MessageCircle size={18} className="text-emerald-500" />
              <span>Login via WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CircleCheck size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#2D2866]">OTP Sent Successfully!</h3>
            <p className="mt-1 text-sm text-slate-500">
              We sent a 4-digit code to +91 {phoneNumber}
            </p>
            <div className="my-5 flex justify-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <input
                  key={i}
                  maxLength="1"
                  className="h-12 w-12 rounded-xl border border-slate-200 text-center text-lg font-black text-[#2D2866] focus:border-[#2D2866] focus:ring-2 focus:ring-[#2D2866]/10"
                />
              ))}
            </div>
            <button type="button" onClick={onClose} className="btn-primary w-full justify-center">
              Verify & Proceed
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isFleetPage = pathname === "/fleet" || pathname.startsWith("/fleet");

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main>
        {isFleetPage ? (
          <>
            {/* Dedicated Fleet Page Header / Breadcrumb */}
            <div className="border-b border-slate-100 bg-[#2D2866] py-10 px-6 text-white shadow-inner">
              <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Home
                    </button>
                    <span>/</span>
                    <span className="text-[#E8E7F2] font-bold">Our Fleet</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                    Self-Drive Car Fleet in Jalore
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    Browse our full range of 11 sanitized, road-ready hatchbacks and SUVs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="self-start rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 hover:scale-105 cursor-pointer shadow-sm"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
            <FleetSection onBook={setSelectedCar} />
          </>
        ) : (
          <>
            <HeroSection />
            <BestSellingModels />
            <WhySection />
            <HowItWorks />
            <OffersReviews />
            <FAQs />
          </>
        )}
      </main>
      <Footer isFleetPage={isFleetPage} />

      {/* Floating WhatsApp Action (desktop) */}
      <a
        href={waLink("Hi JSD, I want to book a self-drive car.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-[#2D2866] hover:bg-[#1F1B4D] px-6 font-bold text-white shadow-xl shadow-[#2D2866]/25 transition hover:-translate-y-1 md:flex"
      >
        <MessageCircle size={20} className="text-emerald-400" />
        <span>Book on WhatsApp</span>
      </a>

      {/* Sticky Bottom Actions on Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-100 bg-white p-2 shadow-2xl md:hidden">
        <a
          href={`tel:${PHONE}`}
          className="flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold text-slate-700"
        >
          <Phone size={15} className="text-[#2D2866]" /> Call now
        </a>
        <a
          href={waLink("Hi JSD, I want to book a car.")}
          className="flex items-center justify-center gap-2 rounded-full bg-[#2D2866] py-3 text-xs font-bold text-white shadow-md shadow-[#2D2866]/20"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
