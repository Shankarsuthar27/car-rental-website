import React, { useState, useEffect, useMemo, useRef } from "react";
import { arrowRightSvg, jsdHeroSuv } from "../assets/images";
import { useLiveFleet } from "../data/fleetData";
import { navigate } from "../utils/navigation";

function formatTitleCase(str = "") {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\bVxi\b/gi, "VXi")
    .replace(/\bLxi\b/gi, "LXi")
    .replace(/\bI 20\b/gi, "i20")
    .replace(/\bI20\b/gi, "i20")
    .replace(/\bSuv\b/gi, "SUV");
}

export default function BestSellingModels() {
  const { fleet: vehicles } = useLiveFleet();
  const [activeIndex, setActiveIndex] = useState(0);

  // Clamp activeIndex if vehicles count changes dynamically
  useEffect(() => {
    if (vehicles.length > 0 && activeIndex >= vehicles.length) {
      setActiveIndex(0);
    }
  }, [vehicles.length, activeIndex]);

  // Responsive slide width: adapts dynamically between mobile and desktop
  const [slideWidth, setSlideWidth] = useState(324);

  // Hand sliding states (supports both mouse drag on desktop & touch swipe on mobile)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragCurrentX, setDragCurrentX] = useState(null);
  const [hasDragged, setHasDragged] = useState(false);

  const sliderRef = useRef(null);

  // Measure and update responsive slideWidth
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          // On mobile screens, fit nicely with peek of next card
          setSlideWidth(Math.min(300, window.innerWidth - 32));
        } else if (window.innerWidth < 768) {
          setSlideWidth(310);
        } else {
          setSlideWidth(324);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cloneCount = useMemo(() => {
    return Math.min(4, vehicles.length);
  }, [vehicles.length]);

  // Dynamically build infinite carousel slides
  const allSlides = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    const n = vehicles.length;
    const count = Math.min(4, n);
    const prepended = vehicles.slice(-count).map((v, i) => ({
      ...v,
      dataIndex: -count + i,
      isCloned: true,
    }));
    const real = vehicles.map((v, i) => ({
      ...v,
      dataIndex: i,
      isCloned: false,
    }));
    const appended = vehicles.slice(0, count).map((v, i) => ({
      ...v,
      dataIndex: n + i,
      isCloned: true,
    }));
    return [...prepended, ...real, ...appended];
  }, [vehicles]);

  const handlePrev = () => {
    if (vehicles.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);
  };

  const handleNext = () => {
    if (vehicles.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % vehicles.length);
  };

  // Mouse drag handlers on Desktop
  const handleMouseDown = (e) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    setHasDragged(false);
  };

  // Global window listeners for desktop mouse drag
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e) => {
      setDragCurrentX(e.clientX);
      if (dragStartX !== null && Math.abs(e.clientX - dragStartX) > 6) {
        setHasDragged(true);
      }
    };

    const handleWindowMouseUp = (e) => {
      if (dragStartX !== null) {
        const diff = e.clientX - dragStartX;
        if (diff < -45) {
          handleNext();
        } else if (diff > 45) {
          handlePrev();
        }
      }
      setIsDragging(false);
      setDragStartX(null);
      setDragCurrentX(null);
      setTimeout(() => setHasDragged(false), 80);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, dragStartX, vehicles.length]);

  // Touch handlers for Mobile Hand Sliding
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setDragCurrentX(e.touches[0].clientX);
      setHasDragged(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || dragStartX === null) return;
    if (e.touches && e.touches.length > 0) {
      const currentX = e.touches[0].clientX;
      setDragCurrentX(currentX);
      if (Math.abs(currentX - dragStartX) > 6) {
        setHasDragged(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && dragStartX !== null && dragCurrentX !== null) {
      const diff = dragCurrentX - dragStartX;
      if (diff < -45) {
        handleNext();
      } else if (diff > 45) {
        handlePrev();
      }
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragCurrentX(null);
    setTimeout(() => setHasDragged(false), 80);
  };

  // Safe navigation handler that ignores drag gestures
  const handleNavClick = (e, path = "/fleet") => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    navigate(path);
  };

  const dragOffset =
    isDragging && dragStartX !== null && dragCurrentX !== null
      ? dragCurrentX - dragStartX
      : 0;

  const currentTranslateX = -((cloneCount + activeIndex) * slideWidth) + dragOffset;

  return (
    <section className="best-selling-section py-10 bg-white overflow-hidden select-none">
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
          box-sizing: border-box;
        }

        .jodhpur-carousel .heading {
          text-align: center;
          margin-bottom: 20px;
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

        /* Hand Sliding Cursors for Desktop & Mobile */
        .jodhpur-carousel .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          -webkit-user-select: none;
          touch-action: pan-y;
          cursor: grab;
        }

        .jodhpur-carousel .slick-slider.is-dragging,
        .jodhpur-carousel .slick-slider:active {
          cursor: grabbing;
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
          box-sizing: border-box;
          will-change: transform;
        }

        .jodhpur-carousel .slick-slide {
          box-sizing: border-box;
          flex-shrink: 0;
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
          margin: 8px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          cursor: grab;
        }

        .jodhpur-carousel .typ_crd:hover {
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
        }

        .jodhpur-carousel .top_sec img {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          max-height: 175px;
          object-fit: contain;
          object-position: center;
          transition: transform 0.35s ease;
          display: block;
          margin: 0 auto;
          pointer-events: none;
          -webkit-user-drag: none;
          user-select: none;
        }

        .jodhpur-carousel .typ_crd:hover .top_sec img {
          transform: scale(1.05);
        }

        .jodhpur-carousel .btm_sec {
          padding: 12px 18px 4px 18px;
        }

        .jodhpur-carousel .font_size_13_mobile {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #5A6B82;
          margin: 0;
          line-height: 1;
        }

        .jodhpur-carousel .brand_nm.font_size_20_mobile {
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #1E293B;
          margin-top: 5px;
          line-height: 1.25;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .jodhpur-carousel .mdl_sec {
          padding: 4px 18px 18px 18px;
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

        /* Carousel Navigation Arrows */
        .jodhpur-carousel .slick-arrow {
          position: absolute;
          top: calc(50% - 20px);
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

        @media (max-width: 640px) {
          .jodhpur-carousel .slick-prev {
            left: -4px;
            width: 34px;
            height: 34px;
          }
          .jodhpur-carousel .slick-next {
            right: -4px;
            width: 34px;
            height: 34px;
          }
        }

        /* Dots */
        .jodhpur-carousel .slick-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin: 20px 0 0 0;
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
          width: 8px;
          height: 8px;
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
          width: 22px;
          border-radius: 9999px;
        }
      `}</style>

      <div className="container jodhpur-carousel block w-full max-w-[1320px] px-3 mx-auto font-sans text-base leading-normal text-[#212529]">
        <div className="heading">
          <div className="heading_title">
            <h2>Best Selling Models for Car Rental in Jalore</h2>
          </div>
          {/* Hand sliding hint badge for users on both mobile & desktop */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs font-medium text-slate-500">
            <span className="inline-block text-sm">👆</span>
            <span>Drag or swipe with hand to slide cars</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">{vehicles.length} cars available</span>
          </div>
        </div>

        <div className="models_typ owl-carousel">
          <div
            ref={sliderRef}
            className={`slick-slider slick-initialized ${isDragging ? "is-dragging" : ""}`}
            dir="ltr"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous Arrow */}
            <button
              type="button"
              data-role="none"
              className="slick-arrow slick-prev"
              style={{ display: "flex" }}
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
                  width: `${allSlides.length * slideWidth}px`,
                  opacity: 1,
                  transform: `translate3d(${currentTranslateX}px, 0px, 0px)`,
                  transition: isDragging
                    ? "none"
                    : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {allSlides.map((item, trackIdx) => {
                  const startIndex = cloneCount + activeIndex;
                  const isActive = trackIdx >= startIndex && trackIdx < startIndex + 4;
                  const isCurrent = trackIdx === startIndex;

                  let slideClass = "slick-slide";
                  if (item.isCloned) slideClass += " slick-cloned";
                  if (isActive) slideClass += " slick-active";
                  if (isCurrent) slideClass += " slick-current";

                  const displayBrand = formatTitleCase(item.brand || "Self Drive");
                  const modelPart = item.model
                    ? item.variant
                      ? `${item.model} ${item.variant}`
                      : item.model
                    : item.name;
                  const displayModel = formatTitleCase(modelPart);
                  const displayImage = item.image || item.fallbackImage || jsdHeroSuv;

                  return (
                    <div
                      key={`track-slide-${item.dataIndex}-${trackIdx}`}
                      data-index={item.dataIndex}
                      tabIndex={isActive ? 0 : -1}
                      className={slideClass}
                      aria-hidden={!isActive}
                      style={{ outline: "none", width: `${slideWidth}px` }}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <div className="w-full">
                        <div
                          className="item"
                          tabIndex={-1}
                          style={{ width: "100%", display: "inline-block" }}
                        >
                          <div className="typ_crd">
                            <div
                              className="top_sec cursor-pointer"
                              onClick={(e) => handleNavClick(e, "/fleet")}
                            >
                              <img
                                src={displayImage}
                                alt={`${displayBrand} ${displayModel} car rental in Jalore`}
                                draggable={false}
                                onError={(e) => {
                                  if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                                    e.currentTarget.src = item.fallbackImage;
                                  } else if (jsdHeroSuv && e.currentTarget.src !== jsdHeroSuv) {
                                    e.currentTarget.src = jsdHeroSuv;
                                  }
                                }}
                              />
                            </div>
                            <div className="btm_sec pt-3 pb-2">
                              <p className="font_size_13_mobile">{displayBrand}</p>
                              <div className="brand_nm font_size_20_mobile" title={displayModel}>
                                {displayModel}
                              </div>
                            </div>
                            <div className="mdl_sec pt-0 pb-3">
                              <div className="flex items-center justify-between">
                                <p className="star text-start text-xs font-semibold text-slate-500 m-0">
                                  {item.dailyRate ? `₹${item.dailyRate}/day` : ""}
                                </p>
                                <a
                                  className="view_details"
                                  href="/fleet"
                                  onClick={(e) => handleNavClick(e, "/fleet")}
                                >
                                  View Details
                                  <img
                                    src={arrowRightSvg}
                                    className="arrow_img"
                                    alt=""
                                    draggable={false}
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      maxWidth: "15px",
                                      maxHeight: "15px",
                                      display: "inline-block",
                                      flexShrink: 0,
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
              style={{ display: "flex" }}
              onClick={handleNext}
              aria-label="Next"
            >
              Next
            </button>

            {/* Pagination Dots */}
            {vehicles.length > 0 && (
              <ul className="slick-dots" style={{ display: "flex" }}>
                {vehicles.map((_, dotIndex) => (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
