"use client";

import Link from "next/link";
import { Bell, User, Menu, X } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Chatbot", href: "/chatbot" },
  { name: "Learning", href: "/learning" },
  { name: "Community", href: "/community" },
  { name: "Profile", href: "/profile" },
];

export default function NavHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="text-xl font-bold">LangPath</div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-blue-600">
            <Bell className="h-5 w-5" />
          </button>
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-sm hover:text-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow px-6 pb-6">
          <div className="flex flex-col gap-4 mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
