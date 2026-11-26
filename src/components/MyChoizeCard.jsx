import React from "react";
import {
  hyundaiCreta,
  mahindraScorpio,
  toyotaInnovaCrysta,
  arrowRightSvg,
} from "../assets/images";

/**
 * Rebuilt UI Component: `div.top_sec`
 * Source: Self-Drive Car Rental | Rent a Car @ 25% off | MyChoize (https://www.mychoize.com/)
 * Rendered at: 300.8px × 220.23px
 */
export function TopSec({
  image = "https://www.mychoize.com/mychoize-live/current/files/fleets/Mahindra_Scorpio.jpg",
  localImage = mahindraScorpio,
  alt = "Scorpio Car Rental",
}) {
  return (
    <div
      className="top_sec block relative font-sans text-base leading-normal text-[#212529] cursor-crosshair bg-white"
      style={{
        position: "relative",
        fontFamily: "Poppins, sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        color: "var(--bs-dark, #212529)",
        cursor: "crosshair",
        transition: "all",
        width: "100%",
        height: "190px",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 16px 4px 16px",
      }}
    >
      <img
        src={localImage}
        alt={alt}
        onError={(e) => {
          if (image && e.currentTarget.src !== image) {
            e.currentTarget.src = image;
          }
        }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          maxHeight: "175px",
          objectFit: "contain",
          objectPosition: "center",
          mixBlendMode: "multiply",
          display: "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

/**
 * Rebuilt UI Component: `.typ_crd`
 * Source: Car Rental in Jodhpur - Hire Self Drive Cars | MyChoize (https://www.mychoize.com/self-drive-car-rentals-jodhpur)
 * Rendered at: 304px × 312.43px
 */
export default function MyChoizeCard({
  image = "https://www.mychoize.com/mychoize-live/current/files/fleets/Hyundai_Creta.jpg",
  localImage = hyundaiCreta,
  alt = "Creta Car Rental",
  brand = "Hyundai",
  model = "Creta",
  link = "https://www.mychoize.com/fleets/hyundai-creta",
}) {
  return (
    <div
      className="typ_crd block max-h-[450px] m-2.5 font-sans text-base leading-normal text-[#212529] border-[1.5px] border-[#edf0f4] rounded-[20px] bg-white cursor-crosshair transition-all duration-[800ms] ease-out hover:max-h-[450px]"
      style={{
        fontFamily: "Poppins, sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        color: "var(--bs-dark, #212529)",
        backgroundColor: "#ffffff",
        border: "1.5px solid #edf0f4",
        borderRadius: "20px",
        margin: "10px",
        cursor: "crosshair",
        transition: "0.8s ease-out",
        width: "100%",
        maxWidth: "304px",
        boxSizing: "border-box",
      }}
      aria-label={`${brand}${model}View Details`}
    >
      <TopSec image={image} localImage={localImage} alt={alt} />
      <div className="btm_sec pt-3 pb-2" style={{ padding: "14px 16px 8px 16px" }}>
        <p
          className="font_size_13_mobile"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            margin: "0",
            color: "#6c757d",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {brand}
        </p>
        <div
          className="brand_nm font_size_20_mobile"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--bs-dark, #212529)",
            marginTop: "6px",
            lineHeight: 1.25,
          }}
        >
          {model}
        </div>
      </div>
      <div className="mdl_sec pt-0 pb-3" style={{ padding: "4px 16px 14px 16px" }}>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p className="star text-start" style={{ margin: 0, minWidth: "10px" }}></p>
          <a
            className="view_details"
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C295F",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            View Details
            <img
              src={arrowRightSvg}
              className="arrow_img"
              alt=""
              style={{ width: "14px", height: "14px", display: "inline-block" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Jodhpur Fleet Showcase using the exact 304px .typ_crd specification
 */
export function JodhpurFleetGrid() {
  const jodhpurFleets = [
    {
      id: "scorpio",
      brand: "Mahindra",
      model: "Scorpio",
      alt: "Scorpio Car Rental",
      localImage: mahindraScorpio,
      image: "https://www.mychoize.com/mychoize-live/current/files/fleets/Mahindra_Scorpio.jpg",
      link: "https://www.mychoize.com/fleets/mahindra-scorpio",
    },
    {
      id: "creta",
      brand: "Hyundai",
      model: "Creta",
      alt: "Creta Car Rental",
      localImage: hyundaiCreta,
      image: "https://www.mychoize.com/mychoize-live/current/files/fleets/Hyundai_Creta.jpg",
      link: "https://www.mychoize.com/fleets/hyundai-creta",
    },
    {
      id: "innova-crysta",
      brand: "Toyota",
      model: "Innova Crysta",
      alt: "Innova Crysta Car Rental",
      localImage: toyotaInnovaCrysta,
      image: "https://www.mychoize.com/mychoize-live/current/files/fleets/Toyota_Innova_Crysta.jpg",
      link: "https://www.mychoize.com/fleets/toyota-innova-crysta",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {jodhpurFleets.map((car) => (
        <MyChoizeCard key={car.id} {...car} />
      ))}
    </div>
  );
}
