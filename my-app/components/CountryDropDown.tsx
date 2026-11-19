"use client";

import { useEffect, useId, useRef, useState } from "react";
//import languageData from "@/data/languages.json";
//import languageData from "../app/data/languages.json";
import languageData from "@/app/data/languages.json";

type CountryOption = (typeof languageData.options)[number];

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

type CountryListProps = {
  selectedLocale: string;
  onSelect: (country: CountryOption) => void;
};

function CountryList({ selectedLocale, onSelect }: CountryListProps) {
  return (
    <ul
      aria-label="Countries and languages"
      className="max-h-60 overflow-y-auto overscroll-contain"
    >
      {languageData.options.map((country) => (
        <li key={country.locale}>
          <button
            type="button"
            aria-pressed={selectedLocale === country.locale}
            onClick={() => onSelect(country)}
            className={`flex h-12 w-full items-center gap-3 px-4 text-left text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 ${
              selectedLocale === country.locale
                ? "bg-gray-100 font-semibold"
                : "font-normal"
            }`}
          >
            <span aria-hidden="true" className="shrink-0 text-xl">
              {country.flag}
            </span>

            <span className="min-w-0 flex-1 truncate">
              {country.languageName}{" "}
              <bdi
                lang={country.locale}
                dir={country.direction === "rtl" ? "rtl" : "ltr"}
              >
                ({country.nativeName})
              </bdi>
            </span>

            {selectedLocale === country.locale && (
              <span aria-hidden="true" className="shrink-0">
                ✓
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function CountryDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(
    languageData.defaultLocale,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDialogElement>(null);

  const id = useId();
  const desktopPanelId = `${id}-desktop`;
  const mobilePanelId = `${id}-mobile`;
  const mobileTitleId = `${id}-title`;

  const selectedCountry =
    languageData.options.find((country) => country.locale === selectedLocale) ??
    languageData.options[0];

  // Close the desktop dropdown on outside clicks or Escape.
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

  // Close panels when switching between desktop and mobile.
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

  function selectCountry(country: CountryOption) {
    setSelectedLocale(country.locale);

    if (mobileDialogRef.current?.open) {
      mobileDialogRef.current.close();
    } else {
      setIsOpen(false);
      desktopButtonRef.current?.focus();
    }
  }

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
          aria-controls={desktopPanelId}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex min-h-11 max-w-80 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-gray-100"
        >
          <span aria-hidden="true" className="shrink-0 text-xl">
            {selectedCountry.flag}
          </span>

          <span className="truncate">
            {selectedCountry.languageName}{" "}
            <bdi
              lang={selectedCountry.locale}
              dir={selectedCountry.direction === "rtl" ? "rtl" : "ltr"}
            >
              ({selectedCountry.nativeName})
            </bdi>
          </span>

          <ChevronIcon />
        </button>

        <div
          id={desktopPanelId}
          hidden={!isOpen}
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg"
        >
          <CountryList
            selectedLocale={selectedLocale}
            onSelect={selectCountry}
          />
        </div>
      </div>

      {/* Mobile trigger: flag + country code */}
      <button
        type="button"
        aria-label={`Choose language. Current selection: ${selectedCountry.countryName}, ${selectedCountry.languageName}`}
        aria-haspopup="dialog"
        aria-controls={mobilePanelId}
        onClick={() => mobileDialogRef.current?.showModal()}
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-gray-100 md:hidden"
      >
        <span aria-hidden="true" className="text-xl">
          {selectedCountry.flag}
        </span>

        <span>{selectedCountry.countryCode}</span>

        <ChevronIcon />
      </button>

      {/* Mobile full-screen panel */}
      <dialog
        ref={mobileDialogRef}
        id={mobilePanelId}
        aria-labelledby={mobileTitleId}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-white p-4 text-gray-950 backdrop:bg-black/40 sm:p-6"
      >
        <button
          type="button"
          autoFocus
          aria-label="Close language selection"
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
          <h2 id={mobileTitleId} className="mb-4 text-2xl font-semibold">
            Choose your language
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <CountryList
              selectedLocale={selectedLocale}
              onSelect={selectCountry}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
