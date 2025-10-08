import React, { useState, useEffect, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { BiSolidDownArrow } from "react-icons/bi";
import HeaderLogo from "../../assets/cat-svgrepo-com.svg?react";
import catSound from "../../assets/noisecreations_SFX-NCFREE02_MoaningCat.mp3";
import meowSound from "../../assets/omori-meow.mp3";
import clickSound from "../../assets/Mouse Click Sound Effect (128kbit_AAC).mp3"
import { Howl } from "howler";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const soundRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    const unlockAudio = () => {
      if (!soundRef.current && !audioUnlocked) {
        soundRef.current = new Howl({
          src: [meowSound],
          volume: 1,
          html5: true,
          preload: true,
          onload: () => {
            console.log("Sound loaded successfully!");
            setAudioUnlocked(true);
          },
          onloaderror: (id, error) => {
            console.error("Error loading sound:", error);
          },
          onplayerror: (id, error) => {
            console.error("Error playing sound:", error);
            soundRef.current.once("unlock", () => {
              soundRef.current.play();
            });
          },
        });
      }
    };

    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio);
      });
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [audioUnlocked]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const playHoverSound = () => {
    if (soundRef.current && audioUnlocked) {
      try {
        soundRef.current.play();
        console.log("Playing sound...");
      } catch (error) {
        console.error("Error playing:", error);
      }
    } else {
      console.log("Audio not yet unlocked or sound not loaded");
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 py-4">
        <a
          href="/"
          onMouseEnter={playHoverSound}
          className="group flex items-center text-4xl font-bold tracking-wide text-window-500 hover:text-[#FE5359] transition-all duration-300"
        >
          <HeaderLogo className="w-16 h-16 fill-window-500 group-hover:fill-[#FE5359] transition-all duration-300" />
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
            href="/tos"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Term Of Services
          </a>
          <a
            href="/contact"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
            Contact
          </a>
          <a
            href="/fun"
            className="hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
          >
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
            href="/tos"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Term Of Services
          </a>
          <a
            href="/contact"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Contact
          </a>
          <a
            href="/fun"
            onClick={toggleMenu}
            className="inline-block hover:text-[#FE5359] hover:scale-101 transition-all duration-300"
          >
            Fun Stuff
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
