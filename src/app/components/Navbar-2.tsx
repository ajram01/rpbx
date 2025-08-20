"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "./Button";
import { createPortal } from "react-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);

  useEffect(() => {
    setMounted(true);

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Business Listings", href: "/business-listing" },
    { name: "Browse Investors", href: "/investor-listing" },
  ];

  const mobileMenu = (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <button
          aria-label="Close Mobile Menu Overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out will-change-transform
          lg:hidden z-50
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link href="/dashboard" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/images/logos/Rio-Plex-Logo-Main-Mint-&-Charcoal.png"
              width={120}
              height={160}
              alt="RioPlex logo"
              className="h-auto w-[120px]"
            />
          </Link>
          <button
            onClick={toggleMobileMenu}
            aria-label="Close Mobile Menu"
            className="text-slate-600 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg text-slate-600 hover:text-red-500"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <Button onClick={() => setIsMobileMenuOpen(false)}>Login</Button>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <nav className="sticky top-0 z-[9999] w-full py-10 backdrop-saturate-150 px-5 lg:px-0 ">
      <div className="mx-auto w-full lg:w-[1140px] lg:px-10 px-7 py-2 bg-white rounded-full shadow-md">
        <div className="flex flex-wrap items-center justify-between text-slate-800">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/logos/RPBX-logo.png"
              width={150}
              height={200}
              alt="RioPlex logo"
              className="h-auto w-[80px]"
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
              className="relative ml-auto h-10 w-10 rounded-md text-inherit transition-all hover:bg-gray-100 focus:outline-none flex items-center justify-center -mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[18px] font-medium hover:text-[var(--color-button)]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>|</li>
              <li>
                <a href="/dashboard" className="green-nav">Dashboard</a>
              </li>
              <li>
                <a href="#" className="green-nav">Listings</a>
              </li>
              <li>

                <Button href="/">Log Out</Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Portal for mobile overlay and drawer */}
      {mounted && createPortal(mobileMenu, document.body)}
    </nav>
  );
}
