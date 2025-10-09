import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";

const ContactPage = () => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/7Cattoo",
      icon: <FaFacebookSquare />,
    },
    {
      name: "Twitter",
      url: "https://x.com/SevenCat13",
      icon: <BsTwitterX />,
    },
    // {
    //   name: "Telegram",
    //   url: "https://web.telegram.org/",
    //   icon: <FaTelegram />,
    // },
    {
      name: "Bluesky",
      url: "https://bsky.app/profile/7catto.bsky.social",
      icon: <SiBluesky />,
    },
    {
      name: "Discord",
      url: "https://discord.com/users/541445864158134272",
      icon: <FaDiscord />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-6">
          <div className="max-w-4xl w-full">
            {/* Browser Window Card */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-300">
              {/* Browser Window Header */}
              <div className="bg-window-500 px-4 sm:px-6 py-4 sm:py-6 flex items-center gap-2 border-b border-gray-300 justify-between">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">Contact</p>
                <button className="rounded-lg border border-transparent px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base font-medium font-inherit cursor-pointer transition-colors duration-[250ms]">
                  X
                </button>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                {/* Intro Section - Centered and Styled */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                  <p className="text-base sm:text-lg text-window-500 leading-relaxed max-w-2xl mx-auto mb-2">
                    All of my social links where you can find me!
                  </p>
                  <p className="text-base sm:text-lg text-window-500 leading-relaxed max-w-2xl mx-auto">
                    Click any icon below will open the link in a new tab.
                  </p>
                </div>

                {/* Social Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 hover:border-[#FE5359] bg-white group-hover:scale-110 transition-all duration-300 group"
                    >
                      <div className="text-4xl sm:text-5xl md:text-6xl text-window-500 group-hover:text-[#FE5359] group-hover:scale-110 transition-all duration-300 mb-3 sm:mb-4">
                        {social.icon}
                      </div>
                      <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700 group-hover:text-[#FE5359] group-hover:scale-110 transition-all duration-300">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default ContactPage;
