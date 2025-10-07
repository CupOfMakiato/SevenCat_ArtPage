import React, { useState } from "react";
import { HiMenu } from 'react-icons/hi';
import { BiSolidDownArrow } from 'react-icons/bi';
import { LuCat } from 'react-icons/lu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 py-4">
        <a
          href="/"
          className="flex text-4xl font-bold tracking-wide text-window-500 hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
        >
          <LuCat className="text-5xl text-window-500 hover:text-[#FE5359] hover:scale-110 transition-all duration-300"/>
           {/* 7Catto */}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-window-500 font-medium text-2xlsm">
          <a
            href="/"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Home
          </a>
          <a
            href="/gallery"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Gallery
          </a>
          <a
            href="/about"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            About
          </a>
          <a
            href="/commission"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Commission
          </a>
          <a
            href="/contact"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Contact
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-window-500 hover:text-[#FE5359] focus:outline-none transition-all duration-300 hover:scale-110"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <BiSolidDownArrow className="w-8 h-8" />
          ) : (
            <HiMenu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-6 text-window-500 font-medium text-lg">
          <a
            href="/"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Home
          </a>
          <a
            href="/gallery"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Gallery
          </a>
          <a
            href="/about"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            About
          </a>
          <a
            href="/commission"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Commission
          </a>
          <a
            href="/contact"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
