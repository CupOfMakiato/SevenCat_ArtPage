import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      name: "FaceBook",
      url: "https://facebook.com",
      icon: <FaFacebookSquare />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: <BsTwitterX />,
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-row justify-between space-y-8">
          {/* Copyright and Credits */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Developed by{" "}
              <a
                href="https://github.com/CupOfMakiato"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors duration-300 font-medium"
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
                className="text-4xl text-gray-600 hover:text-gray-900 transition-colors duration-300"
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
