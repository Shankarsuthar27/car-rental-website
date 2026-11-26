import logoImg, { LOGO_DATA_URI } from "./logo";
import {
  STEP1_IMAGE,
  STEP2_IMAGE,
  STEP3_IMAGE,
  SCORPIO_IMAGE,
  CRETA_IMAGE,
  XUV300_IMAGE,
  CIAZ_IMAGE,
  CRYSTA_IMAGE,
  HERO_SUV_IMAGE,
} from "./embeddedAssets";

export const step1Img = STEP1_IMAGE;
export const step2Img = STEP2_IMAGE;
export const step3Img = STEP3_IMAGE;

export const mahindraScorpio = SCORPIO_IMAGE;
export const hyundaiCreta = CRETA_IMAGE;
export const mahindraXuv300 = XUV300_IMAGE;
export const marutiCiaz = CIAZ_IMAGE;
export const toyotaInnovaCrysta = CRYSTA_IMAGE;
export const jsdHeroSuv = HERO_SUV_IMAGE;

// Embedded inline SVG icons to eliminate network requests
export const miniCarSvg =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232D2866"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';

export const arrowRightSvg =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%232C295F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

export { logoImg, LOGO_DATA_URI };
