/**
 * Asset resolution helper to guarantee images load across:
 * - Root domain deployments (e.g. https://domain.com/)
 * - Hostinger subfolder deployments (e.g. https://domain.com/dist/ or https://domain.com/subfolder/)
 * - Preview URLs and local dev
 */
export function resolveAsset(path) {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter(Boolean);

    // If website is opened in a subfolder such as /dist/ or /my-project/ (not an SPA route like fleet)
    if (segments.length > 0 && segments[0] !== "fleet") {
      const prefix = segments[0];
      return `/${prefix}/${cleanPath}`;
    }
  }

  return `/${cleanPath}`;
}

/**
 * Image error handler that attempts relative path fallback if absolute path 404s
 */
export function handleImageFallback(e, fallbackUrl) {
  const target = e.currentTarget;
  if (!target || target.getAttribute("data-fallback-attempted") === "true") {
    if (fallbackUrl && target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
    return;
  }

  target.setAttribute("data-fallback-attempted", "true");

  if (fallbackUrl) {
    target.src = fallbackUrl;
    return;
  }

  // If URL contains /images/, try relative ./images/
  const original = target.src || "";
  if (original.includes("/images/")) {
    const relative = "./images/" + original.split("/images/")[1];
    target.src = relative;
  }
}
