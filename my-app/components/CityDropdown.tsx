"use client";

import { useEffect, useRef, useState } from "react";

const cities = [
  "Atlanta, Georgia",
  "Austin, Texas",
  "Boston, Massachusetts",
  "Charleston, South Carolina",
  "Charlotte, North Carolina",
  "Chicago, Illinois",
  "Columbus, Ohio",
  "Dallas, Texas",
  "Denver, Colorado",
  "Detroit, Michigan",
  "Houston, Texas",
  "Los Angeles, California",
  "Miami, Florida",
  "Nashville, Tennessee",
  "New York, New York",
  "Philadelphia, Pennsylvania",
  "Phoenix, Arizona",
  "Portland, Oregon",
  "San Francisco, California",
  "Seattle, Washington",
];

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type CityListProps = {
  selectedCity: string | null;
  onSelect: (city: string) => void;
};

function CityList({ selectedCity, onSelect }: CityListProps) {
  return (
    <ul
      aria-label="Cities"
      className="max-h-60 overflow-y-auto overscroll-contain"
    >
      {cities.map((city) => (
        <li key={city}>
          <button
            type="button"
            onClick={() => onSelect(city)}
            aria-pressed={selectedCity === city}
            className={`flex h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 ${
              selectedCity === city
                ? "bg-gray-100 font-semibold"
                : "font-normal"
            }`}
          >
            <span>{city}</span>
            {selectedCity === city && <span aria-hidden="true">✓</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function CityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        desktopButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 768px)");

    function handleBreakpointChange() {
      setIsOpen(false);
      mobileDialogRef.current?.close();
    }

    breakpoint.addEventListener("change", handleBreakpointChange);

    return () => {
      breakpoint.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  function selectCity(city: string) {
    setSelectedCity(city);

    if (mobileDialogRef.current?.open) {
      mobileDialogRef.current.close();
    } else {
      setIsOpen(false);
      desktopButtonRef.current?.focus();
    }
  }

  const triggerClasses =
    "inline-flex min-h-11 max-w-40 items-center gap-2 rounded-md " +
    "px-2 text-sm font-medium hover:bg-gray-100 md:max-w-64";

  return (
    <>
      {/* Desktop dropdown */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <button
          ref={desktopButtonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="desktop-cities"
          onClick={() => setIsOpen((open) => !open)}
          className={triggerClasses}
        >
          <span className="truncate">{selectedCity ?? "Cities"}</span>
          <ChevronIcon />
        </button>

        <div
          id="desktop-cities"
          hidden={!isOpen}
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg"
        >
          <CityList selectedCity={selectedCity} onSelect={selectCity} />
        </div>
      </div>

      {/* Mobile full-screen trigger */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-controls="mobile-cities"
        onClick={() => mobileDialogRef.current?.showModal()}
        className={`${triggerClasses} md:hidden`}
      >
        <span className="truncate">{selectedCity ?? "Cities"}</span>
        <ChevronIcon />
      </button>

      {/* Mobile full-screen panel */}
      <dialog
        ref={mobileDialogRef}
        id="mobile-cities"
        aria-labelledby="mobile-cities-title"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-white p-6 text-gray-950 backdrop:bg-black/40"
      >
        <button
          type="button"
          autoFocus
          aria-label="Close cities"
          onClick={() => mobileDialogRef.current?.close()}
          className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-6"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="mx-auto max-w-lg pt-20">
          <h2 id="mobile-cities-title" className="mb-4 text-2xl font-semibold">
            Choose a city
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <CityList selectedCity={selectedCity} onSelect={selectCity} />
          </div>
        </div>
      </dialog>
    </>
  );
}
