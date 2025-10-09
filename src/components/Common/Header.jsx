import React, { useState, useEffect, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { BiSolidDownArrow } from "react-icons/bi";
import HeaderLogo from "../../assets/cat-svgrepo-com.svg?react";
import meowSound from "../../assets/omori-meow.mp3";
import { Howl } from "howler";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const soundRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    // Set current path
    setCurrentPath(window.location.pathname);
    
    // Initialize Howl immediately on mount
    soundRef.current = new Howl({
      src: [meowSound],
      volume: 1,
      html5: true,
      preload: true,
      onload: () => {
        console.log("Sound loaded successfully!");
      },
      onloaderror: (id, error) => {
        console.error("Error loading sound:", error);
      },
      onplayerror: (id, error) => {
        console.error("Error playing sound:", error);
        soundRef.current.once("unlock", () => {
          console.log("Audio unlocked!");
        });
      },
    });

    const markAudioReady = () => {
      setAudioReady(true);
      console.log("User interacted - audio ready");
    };

    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, markAudioReady, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, markAudioReady);
      });
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const playHoverSound = () => {
    if (soundRef.current && audioReady) {
      try {
        soundRef.current.play();
        console.log("Playing sound...");
      } catch (error) {
        console.error("Error playing:", error);
      }
    }
  };

  // Helper function to check if link is active
  const isActive = (path) => {
    return currentPath === path;
  };

  // Get active link classes
  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile
      ? "inline-block transition-all duration-300"
      : "transition-all duration-300";
    
    const activeClasses = isActive(path)
      ? "text-white font-bold bg-window-500 px-4 py-0.5 rounded-5xl"
      : "text-window-500 hover:text-[#FE5359]";
    
    const scaleClasses = isMobile ? "hover:scale-101" : "hover:scale-110";
    
    return `${baseClasses} ${activeClasses} ${scaleClasses}`;
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 py-4 roun">
        <a
          href="/"
          onMouseEnter={playHoverSound}
          className="group flex items-center text-4xl font-bold tracking-wide text-window-500 hover:text-[#FE5359] transition-all duration-300"
        >
          <HeaderLogo className="w-16 h-16 fill-window-500 group-hover:fill-[#FE5359] hover:scale-110 transition-all duration-300" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium text-2xlsm">
          <a href="/" className={getLinkClasses("/")}>
            Home
          </a>
          <a href="/gallery" className={getLinkClasses("/gallery")}>
            Gallery
          </a>
          <a href="/about" className={getLinkClasses("/about")}>
            About
          </a>
          <a href="/commission" className={getLinkClasses("/commission")}>
            Commission
          </a>
          <a href="/tos" className={getLinkClasses("/tos")}>
            Term Of Services
          </a>
          <a href="/contact" className={getLinkClasses("/contact")}>
            Contact
          </a>
          <a href="/fun" className={getLinkClasses("/fun")}>
            Fun Stuff
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
        <div className="flex flex-col space-y-4 px-4 py-6 font-medium text-lg">
          <a href="/" onClick={toggleMenu} className={getLinkClasses("/", true)}>
            Home
          </a>
          <a
            href="/gallery"
            onClick={toggleMenu}
            className={getLinkClasses("/gallery", true)}
          >
            Gallery
          </a>
          <a
            href="/about"
            onClick={toggleMenu}
            className={getLinkClasses("/about", true)}
          >
            About
          </a>
          <a
            href="/commission"
            onClick={toggleMenu}
            className={getLinkClasses("/commission", true)}
          >
            Commission
          </a>
          <a
            href="/tos"
            onClick={toggleMenu}
            className={getLinkClasses("/tos", true)}
          >
            Term Of Services
          </a>
          <a
            href="/contact"
            onClick={toggleMenu}
            className={getLinkClasses("/contact", true)}
          >
            Contact
          </a>
          <a
            href="/fun"
            onClick={toggleMenu}
            className={getLinkClasses("/fun", true)}
          >
            Fun Stuff
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
