import React, { useState } from "react";
import { resolveAsset, handleImageFallback } from "../utils/assets";

// The 5 core vehicle models in MyChoize fleet
const baseModels = [
  {
    originalIndex: 0,
    id: "mahindra-tuv-300",
    brand: "Mahindra",
    model: "TUV 300",
    alt: "TUV 300 Car Rental",
    localImg: "/images/fleets/Mahindra_XUV_300.jpg",
    remoteImg: "https://www.mychoize.com/mychoize-live/current/files/fleets/Mahindra_XUV_300.jpg",
    link: "https://www.mychoize.com/fleets/mahindra-tuv-300",
  },
  {
    originalIndex: 1,
    id: "hyundai-creta",
    brand: "Hyundai",
    model: "Creta",
    alt: "Creta Car Rental",
    localImg: "/images/fleets/Hyundai_Creta.jpg",
    remoteImg: "https://www.mychoize.com/mychoize-live/current/files/fleets/Hyundai_Creta.jpg",
    link: "https://www.mychoize.com/fleets/hyundai-creta",
  },
  {
    originalIndex: 2,
    id: "toyota-innova-crysta",
    brand: "Toyota",
    model: "Innova Crysta",
    alt: "Innova Crysta Car Rental",
    localImg: "/images/fleets/Toyota_Innova_Crysta.jpg",
    remoteImg:
      "https://www.mychoize.com/mychoize-live/current/files/fleets/Toyota_Innova_Crysta.jpg",
    link: "https://www.mychoize.com/fleets/toyota-innova-crysta",
  },
  {
    originalIndex: 3,
    id: "maruti-ciaz",
    brand: "Maruti",
    model: "Ciaz",
    alt: "Ciaz Car Rental",
    localImg: "/images/fleets/Maruti_Ciaz.jpg",
    remoteImg: "https://www.mychoize.com/mychoize-live/current/files/fleets/Maruti_Ciaz.jpg",
    link: "https://www.mychoize.com/fleets/maruti-ciaz",
  },
  {
    originalIndex: 4,
    id: "mahindra-scorpio",
    brand: "Mahindra",
    model: "Scorpio",
    alt: "Scorpio Car Rental",
    localImg: "/images/fleets/Mahindra_Scorpio.jpg",
    remoteImg: "https://www.mychoize.com/mychoize-live/current/files/fleets/Mahindra_Scorpio.jpg",
    link: "https://www.mychoize.com/fleets/mahindra-scorpio",
  },
];

// All 14 slides in the infinite Slick track (4 cloned prepended, 5 real, 5 cloned appended)
const allSlides = [
  // Cloned slides: data-index -4 to -1
  { dataIndex: -4, isCloned: true, ...baseModels[1] }, // Hyundai Creta
  { dataIndex: -3, isCloned: true, ...baseModels[2] }, // Toyota Innova Crysta
  { dataIndex: -2, isCloned: true, ...baseModels[3] }, // Maruti Ciaz
  { dataIndex: -1, isCloned: true, ...baseModels[4] }, // Mahindra Scorpio

  // Real slides: data-index 0 to 4
  { dataIndex: 0, isCloned: false, ...baseModels[0] }, // Mahindra TUV 300
  { dataIndex: 1, isCloned: false, ...baseModels[1] }, // Hyundai Creta
  { dataIndex: 2, isCloned: false, ...baseModels[2] }, // Toyota Innova Crysta
  { dataIndex: 3, isCloned: false, ...baseModels[3] }, // Maruti Ciaz
  { dataIndex: 4, isCloned: false, ...baseModels[4] }, // Mahindra Scorpio

  // Cloned slides: data-index 5 to 9
  { dataIndex: 5, isCloned: true, ...baseModels[0] }, // Mahindra TUV 300
  { dataIndex: 6, isCloned: true, ...baseModels[1] }, // Hyundai Creta
  { dataIndex: 7, isCloned: true, ...baseModels[2] }, // Toyota Innova Crysta
  { dataIndex: 8, isCloned: true, ...baseModels[3] }, // Maruti Ciaz
  { dataIndex: 9, isCloned: true, ...baseModels[4] }, // Mahindra Scorpio
];

export default function BestSellingModels() {
  // Captured snapshot: Active index is 2 (Toyota Innova Crysta, dot 3 active),
  // offset is -1944px: (4 prepended slides + 2 real slides) * 324px = 6 * 324px = 1944px
  const [activeIndex, setActiveIndex] = useState(2);

  const slideWidth = 324;
  const currentTranslateX = -((4 + activeIndex) * slideWidth);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + 5) % 5);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % 5);
  };

  return (
    <section className="best-selling-section py-10 bg-white overflow-hidden">
      <style>{`
        /* Best Selling Models Carousel - Jodhpur Specification (1320px x 414.02px) */
        .jodhpur-carousel.container {
          display: block;
          width: 100%;
          max-width: 1320px;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 24px;
          color: var(--bs-dark, #212529);
          padding: 0px 12px 0px 12px;
          margin: 0px auto;
          cursor: crosshair;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .jodhpur-carousel .heading {
          text-align: center;
          margin-bottom: 24px;
        }

        .jodhpur-carousel .heading_title h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--bs-dark, #212529);
          margin: 0;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .jodhpur-carousel .heading_title h2 {
            font-size: 30px;
          }
        }

        .jodhpur-carousel .models_typ.owl-carousel {
          position: relative;
          width: 100%;
        }

        .jodhpur-carousel .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          touch-action: pan-y;
        }

        .jodhpur-carousel .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 8px 0;
        }

        .jodhpur-carousel .slick-track {
          display: flex;
          transition: transform 500ms cubic-bezier(0.25, 1, 0.5, 1);
          box-sizing: border-box;
          will-change: transform;
        }

        .jodhpur-carousel .slick-slide {
          box-sizing: border-box;
          flex-shrink: 0;
          width: 324px;
        }

        .jodhpur-carousel .item {
          width: 100%;
          display: inline-block;
          box-sizing: border-box;
        }

        /* Card element: .typ_crd */
        .jodhpur-carousel .typ_crd {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 24px;
          color: var(--bs-dark, #212529);
          background-color: #ffffff;
          border: 1.5px solid #edf0f4;
          border-radius: 20px;
          margin: 10px;
          cursor: crosshair;
          transition: 0.8s ease-out;
          box-sizing: border-box;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }

        .jodhpur-carousel .typ_crd:hover {
          max-height: 450px;
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(45, 40, 102, 0.09);
          border-color: #cbd5e1;
        }

        .jodhpur-carousel .top_sec {
          position: relative;
          background: #ffffff;
          padding: 14px 16px 4px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 190px;
          overflow: hidden;
          width: 100%;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 24px;
          color: var(--bs-dark, #212529);
          cursor: crosshair;
          transition: all;
        }

        .jodhpur-carousel .top_sec img {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          max-height: 175px;
          object-fit: contain;
          object-position: center;
          mix-blend-mode: multiply;
          transition: transform 0.35s ease;
          display: block;
          margin: 0 auto;
        }

        .jodhpur-carousel .typ_crd:hover .top_sec img {
          transform: scale(1.05);
        }

        .jodhpur-carousel .btm_sec {
          padding: 12px 18px 4px 18px;
        }

        .jodhpur-carousel .d-flex {
          display: flex;
        }

        .jodhpur-carousel .align-items-center {
          align-items: center;
        }

        .jodhpur-carousel .justify-content-between {
          justify-content: space-between;
        }

        .jodhpur-carousel .font_size_13_mobile {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #5A6B82;
          margin: 0 0 0 7px;
          line-height: 1;
        }

        .jodhpur-carousel .brand_nm.font_size_20_mobile {
          font-family: 'Poppins', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1E293B;
          margin-top: 5px;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .jodhpur-carousel .mdl_sec {
          padding: 4px 18px 18px 18px;
        }

        .jodhpur-carousel .star.text-start {
          min-width: 10px;
          margin: 0;
        }

        .jodhpur-carousel .view_details {
          font-family: 'Poppins', sans-serif;
          color: #2D2866;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s ease, gap 0.2s ease;
        }

        .jodhpur-carousel .view_details:hover {
          color: #1F1B4D;
          gap: 9px;
        }

        .jodhpur-carousel .arrow_img {
          width: 15px;
          height: 15px;
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .jodhpur-carousel .view_details:hover .arrow_img {
          transform: translateX(3px);
        }

        /* Arrows */
        .jodhpur-carousel .slick-arrow {
          position: absolute;
          top: calc(50% - 15px);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          font-size: 0;
          color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          outline: none;
        }

        .jodhpur-carousel .slick-arrow:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(45, 40, 102, 0.14);
          transform: scale(1.05);
        }

        .jodhpur-carousel .slick-prev {
          left: -18px;
        }

        .jodhpur-carousel .slick-prev::before {
          content: "";
          display: inline-block;
          width: 9px;
          height: 9px;
          border-top: 2px solid #2D2866;
          border-left: 2px solid #2D2866;
          transform: rotate(-45deg);
          margin-left: 2px;
        }

        .jodhpur-carousel .slick-next {
          right: -18px;
        }

        .jodhpur-carousel .slick-next::before {
          content: "";
          display: inline-block;
          width: 9px;
          height: 9px;
          border-top: 2px solid #2D2866;
          border-right: 2px solid #2D2866;
          transform: rotate(45deg);
          margin-right: 2px;
        }

        /* Dots */
        .jodhpur-carousel .slick-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin: 24px 0 0 0;
          padding: 0;
          list-style: none;
        }

        .jodhpur-carousel .slick-dots li {
          margin: 0;
          padding: 0;
          display: inline-block;
        }

        .jodhpur-carousel .slick-dots li button {
          border: none;
          background: #cbd5e1;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          font-size: 0;
          color: transparent;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
          display: block;
        }

        .jodhpur-carousel .slick-dots li button:hover {
          background: #94a3b8;
        }

        .jodhpur-carousel .slick-dots li.slick-active button {
          background: #2D2866;
          width: 24px;
          border-radius: 9999px;
        }
      `}</style>

      <div className="container jodhpur-carousel block w-full max-w-[1320px] px-3 mx-auto font-sans text-base leading-normal text-[#212529] cursor-crosshair">
        <div className="heading">
          <div className="heading_title">
            <h2>Best Selling Models for Car Rental</h2>
          </div>
        </div>

        <div className="models_typ owl-carousel">
          <div className="slick-slider slick-initialized" dir="ltr">
            {/* Previous Arrow */}
            <button
              type="button"
              data-role="none"
              className="slick-arrow slick-prev"
              style={{ display: "block" }}
              onClick={handlePrev}
              aria-label="Previous"
            >
              Previous
            </button>

            {/* Slick List & Track */}
            <div className="slick-list">
              <div
                className="slick-track"
                style={{
                  width: "4536px",
                  opacity: 1,
                  transform: `translate3d(${currentTranslateX}px, 0px, 0px)`,
                }}
              >
                {allSlides.map((item, trackIdx) => {
                  // Determine whether this slide is currently active in the 4-card viewport
                  // Viewport starts at (4 + activeIndex) and spans 4 cards
                  const startIndex = 4 + activeIndex;
                  const isActive = trackIdx >= startIndex && trackIdx < startIndex + 4;
                  const isCurrent = trackIdx === startIndex;

                  let slideClass = "slick-slide";
                  if (item.isCloned) slideClass += " slick-cloned";
                  if (isActive) slideClass += " slick-active";
                  if (isCurrent) slideClass += " slick-current";

                  return (
                    <div
                      key={`track-slide-${item.dataIndex}-${trackIdx}`}
                      data-index={item.dataIndex}
                      tabIndex={isActive ? 0 : -1}
                      className={slideClass}
                      aria-hidden={!isActive}
                      style={{ outline: "none", width: "324px" }}
                    >
                      <div>
                        <div
                          className="item"
                          tabIndex={-1}
                          style={{ width: "100%", display: "inline-block" }}
                        >
                          <div className="typ_crd">
                            <div className="top_sec">
                              <img
                                src={resolveAsset(item.localImg)}
                                alt={item.alt}
                                onError={(e) => {
                                  handleImageFallback(e, item.remoteImg);
                                }}
                              />
                            </div>
                            <div className="btm_sec pt-3 pb-2">
                              <div className="d-flex align-items-center">
                                <img
                                  src={resolveAsset("/images/icons/mini_car.svg")}
                                  alt=""
                                  onError={(e) => {
                                    handleImageFallback(e);
                                  }}
                                />
                                <p className="font_size_13_mobile">{item.brand}</p>
                              </div>
                              <div className="brand_nm font_size_20_mobile">{item.model}</div>
                            </div>
                            <div className="mdl_sec pt-0 pb-3">
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="star text-start"></p>
                                <a
                                  className="view_details"
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View Details
                                  <img
                                    src={resolveAsset("/images/icons/arrow_right.svg")}
                                    className="arrow_img"
                                    alt=""
                                    onError={(e) => {
                                      handleImageFallback(e);
                                    }}
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              data-role="none"
              className="slick-arrow slick-next"
              style={{ display: "block" }}
              onClick={handleNext}
              aria-label="Next"
            >
              Next
            </button>

            {/* Pagination Dots (5 dots) */}
            <ul className="slick-dots" style={{ display: "block" }}>
              {[0, 1, 2, 3, 4].map((dotIndex) => (
                <li
                  key={`dot-${dotIndex}`}
                  className={activeIndex === dotIndex ? "slick-active" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(dotIndex)}
                    aria-label={`Page ${dotIndex + 1}`}
                  >
                    {dotIndex + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
