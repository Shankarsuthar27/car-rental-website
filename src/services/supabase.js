import {
  hyundaiCreta,
  mahindraScorpio,
  mahindraXuv300,
  marutiCiaz,
  toyotaInnovaCrysta,
  jsdHeroSuv,
} from "../assets/images";

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_SUPABASE_URL)) ||
  (typeof process !== "undefined" &&
    (process.env?.VITE_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL)) ||
  "";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
  (typeof process !== "undefined" &&
    (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
  "";

// Color tones for vehicle cards
const cardTones = [
  "from-amber-100 to-stone-100",
  "from-red-100 to-stone-100",
  "from-sky-100 to-slate-100",
  "from-cyan-100 to-slate-100",
  "from-rose-100 to-stone-100",
  "from-indigo-100 to-slate-100",
  "from-zinc-200 to-stone-100",
  "from-emerald-100 to-stone-100",
  "from-orange-100 to-stone-100",
  "from-blue-100 to-slate-100",
  "from-slate-200 to-stone-100",
];

// Helper to choose the best embedded car photo
function mapVehicleImage(brand = "", model = "", variant = "") {
  const text = `${brand} ${model} ${variant}`.toLowerCase();
  if (text.includes("scorpio") || text.includes("thar")) return mahindraScorpio;
  if (text.includes("creta") || text.includes("i20") || text.includes("i 20")) return hyundaiCreta;
  if (text.includes("xuv") || text.includes("sonet") || text.includes("fronx")) return mahindraXuv300;
  if (text.includes("swift") || text.includes("baleno") || text.includes("ciaz")) return marutiCiaz;
  if (text.includes("innova") || text.includes("crysta")) return toyotaInnovaCrysta;
  return jsdHeroSuv;
}

// Clean formatting for car names
function formatVehicleName(brand = "", model = "", variant = "") {
  const b = brand.trim();
  const m = model.trim();
  const v = variant ? variant.trim() : "";
  let full = `${b} ${m} ${v}`.trim().replace(/\s+/g, " ");
  // Capitalize properly if all uppercase
  if (full === full.toUpperCase()) {
    full = full
      .split(" ")
      .map((w) => (w.length > 3 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(" ");
  }
  return full;
}

// Map segment correctly
function mapSegment(vehicleType = "", model = "") {
  const type = (vehicleType || "").trim().toLowerCase();
  const m = (model || "").toLowerCase();
  if (type === "hatchback") return "Hatchback";
  if (type === "sedan") return m.includes("swift") ? "Hatchback" : "Sedan";
  if (type === "mpv" || type === "muv") return "MPV";
  if (type === "suv") {
    if (
      m.includes("sonet") ||
      m.includes("fronx") ||
      m.includes("xuv 300") ||
      m.includes("xuv300") ||
      m.includes("nexon") ||
      m.includes("brezza") ||
      m.includes("venue")
    ) {
      return "Compact SUV";
    }
    return "SUV";
  }
  if (type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  return "SUV";
}

export function isCarOnTrip(status = "available") {
  const s = String(status || "available").trim().toLowerCase();
  if (!s || s === "available" || s === "maintenance") return false;
  return true;
}

// Format raw Supabase vehicle into our clean UI model
export function transformVehicle(v, index = 0) {
  const rawFuel = (v.fuel_type || "petrol").toLowerCase();
  const fuel =
    rawFuel === "cng" ? "CNG" : rawFuel.charAt(0).toUpperCase() + rawFuel.slice(1);
  const rawTrans = (v.transmission || "manual").toLowerCase();
  const transmission = rawTrans.charAt(0).toUpperCase() + rawTrans.slice(1);

  // Extract image directly from Supabase vehicle_images relation or direct column
  let supabaseImage = null;
  if (Array.isArray(v.vehicle_images) && v.vehicle_images.length > 0) {
    const primary = v.vehicle_images.find((img) => img.is_primary) || v.vehicle_images[0];
    supabaseImage = primary?.url || primary?.image_url || primary?.thumbnail_url || null;
  }
  if (!supabaseImage) {
    supabaseImage = v.image_url || v.image || v.thumbnail_url || null;
  }

  const fallbackImage = mapVehicleImage(v.brand, v.model, v.variant);
  const image = supabaseImage || fallbackImage;

  return {
    id: v.id || index + 1,
    name: formatVehicleName(v.brand || "", v.model || "", v.variant || ""),
    brand: v.brand || "",
    model: v.model || "",
    variant: v.variant || "",
    year: v.year || new Date().getFullYear(),
    segment: mapSegment(v.vehicle_type, v.model),
    seats: v.seating_capacity || 5,
    transmission,
    fuel,
    dailyRate: Number(v.daily_rate) || 2500,
    hourlyRate: Number(v.hourly_rate) || 200,
    limit: v.included_km_per_day ? `${v.included_km_per_day} km/24h` : "300 km/24h",
    branch: "Jalore Main Branch",
    tone: cardTones[index % cardTones.length],
    image,
    supabaseImage,
    fallbackImage,
    status: v.status || "available",
    isOnTrip: isCarOnTrip(v.status),
    isActive: v.is_active !== false,
    registrationNumber: v.registration_number,
    features: Array.isArray(v.features) ? v.features : [],
    securityDeposit: v.security_deposit || 5000,
    extraKmCharge: v.extra_km_charge || 15,
  };
}

/**
 * Fetch all active vehicles along with their images from Supabase.
 * Uses no-store caching so newly added cars appear immediately.
 */
export async function getVehiclesFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/vehicles?select=*,vehicle_images(*)&or=(is_active.eq.true,is_active.is.null)&order=daily_rate.asc`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No vehicles returned from Supabase");
    }

    return data.map((v, i) => transformVehicle(v, i));
  } catch (error) {
    console.warn("Could not fetch vehicles from Supabase, using fallback fleet:", error);
    return null;
  }
}

// Shared live store so all components stay in sync when cars are added/updated in Supabase
let liveState = {
  fleet: null,
  isLiveFromDb: false,
};
const listeners = new Set();
let pollTimer = null;
let fetchInFlight = null;

async function syncVehiclesNow() {
  if (fetchInFlight) return fetchInFlight;
  fetchInFlight = getVehiclesFromSupabase()
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        liveState = { fleet: data, isLiveFromDb: true };
        listeners.forEach((fn) => fn(liveState));
      }
      return data;
    })
    .finally(() => {
      fetchInFlight = null;
    });
  return fetchInFlight;
}

function handleVisibilityOrFocus() {
  if (typeof document !== "undefined" && document.visibilityState === "visible") {
    syncVehiclesNow();
  }
}

export function subscribeToVehicles(fallbackFleet, listener) {
  listeners.add(listener);

  // Immediately deliver cached live fleet or fallback
  listener({
    fleet: liveState.fleet || fallbackFleet,
    isLiveFromDb: liveState.isLiveFromDb,
  });

  // Start background sync on first subscriber
  if (listeners.size === 1) {
    syncVehiclesNow();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", syncVehiclesNow);
      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
      pollTimer = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          syncVehiclesNow();
        }
      }, 15000);
    }
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("focus", syncVehiclesNow);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      if (pollTimer) {
        window.clearInterval(pollTimer);
        pollTimer = null;
      }
    }
  };
}

export function refreshVehicles() {
  return syncVehiclesNow();
}
