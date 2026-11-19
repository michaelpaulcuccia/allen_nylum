"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CountryDropDown from "./CountryDropDown";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 768px)");

    function handleBreakpointChange() {
      menuRef.current?.close();
    }

    breakpoint.addEventListener("change", handleBreakpointChange);

    return () => {
      breakpoint.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white text-gray-950">
        <nav
          aria-label="Main navigation"
          className="mx-auto grid min-h-20 max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,185px)_minmax(0,1fr)] items-center gap-2 px-4 py-3 sm:px-6 md:flex md:justify-between md:gap-6 lg:px-8"
        >
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            onClick={() => menuRef.current?.showModal()}
            className="inline-flex size-11 items-center justify-center justify-self-start rounded-md hover:bg-gray-100 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-6"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Responsive brand logo */}
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex min-h-11 w-full min-w-0 max-w-[185px] items-center justify-center justify-self-center rounded-md md:shrink"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={185}
              height={52}
              className="block h-auto max-h-[52px] w-full max-w-[185px] object-contain"
              loading="eager"
            />
          </Link>

          {/* Desktop links and country selector */}
          <div className="flex min-w-0 items-center justify-end justify-self-end gap-4 md:shrink-0 lg:gap-8">
            <div className="hidden items-center gap-4 md:flex lg:gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap text-sm font-medium hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <CountryDropDown />
          </div>
        </nav>
      </header>

      {/* Mobile full-screen navigation */}
      <dialog
        ref={menuRef}
        id="mobile-menu"
        aria-label="Navigation menu"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-white p-6 text-gray-950 backdrop:bg-black/40"
      >
        <button
          type="button"
          autoFocus
          aria-label="Close navigation menu"
          onClick={() => menuRef.current?.close()}
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

        <nav
          aria-label="Mobile navigation"
          className="flex flex-col items-start gap-6 pt-20"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => menuRef.current?.close()}
              className="text-2xl font-medium hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
