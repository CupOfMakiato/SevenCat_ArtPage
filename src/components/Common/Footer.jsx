import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      name: "FaceBook",
      url: "https://www.facebook.com/7Cattoo",
      icon: <FaFacebookSquare />,
    },
    {
      name: "Twitter",
      url: "https://x.com/SevenCat13",
      icon: <BsTwitterX />,
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-row justify-between items-center">
          {/* Copyright and Credits */}
          <div className="flex text-center">
            <p className="text-window-500 text-2xlsm">
              © {new Date().getFullYear()} Developed by{" "}
              <a
                href="https://github.com/CupOfMakiato"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FE5359] text-2xlsm hover:scale-110 transition-all duration-300 font-medium"
              >
                {" "}
                Makiato
              </a>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-5xl text-window-500 hover:text-[#FE5359] hover:scale-110 transition-all duration-300"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
