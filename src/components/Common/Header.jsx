import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo / Site Name */}
        <a
          href="/"
          className="text-4xl font-semibold tracking-wide text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          7Catto
        </a>

        {/* Navigation */}
        <nav className="flex space-x-6 text-gray-700 font-medium">
          <a
            href="/"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="/gallery"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            Gallery
          </a>
          <a
            href="/about"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            About
          </a>
          <a
            href="/commission"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            Commission
          </a>
          <a
            href="/contact"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};  

export default Header;
