"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Button from "./Button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Business", href: "/business" },
    { name: "Investor", href: "/investor" },
  ];

  return (
    <nav className="top-0 z-[9999] w-[1140px] mx-auto py-4 backdrop-saturate-150">
        <div className="container mx-auto flex flex-wrap items-center justify-between text-slate-800">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/Rio-Plex-Logo-Main-Mint-&-Charcoal.png"
            width={150}
            height={200}
            alt="RioPlex logo"
          />
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            type="button"
            aria-label="Toggle Mobile Menu"
            className="relative ml-auto h-10 w-10 text-inherit transition-all hover:bg-gray-100 focus:outline-none "
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

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed top-0 left-0 min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden z-50`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logos/Rio-Plex-Logo-Mint-&-Charcoal.png"
                width={120}
                height={160}
                alt="RioPlex logo"
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
              <Button>Login</Button>
            </li>
          </ul>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-lg text-slate-600 hover:text-[var(--color-button)]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="text-slate-500">| </li>
            <li className="text-lg text-slate-600 hover:text-[var(--color-button)] cursor-pointer">Join Now</li>
            <li>
              <Button>Sign In</Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
