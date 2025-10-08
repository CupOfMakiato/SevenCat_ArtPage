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
    {
      name: "Telegram",
      url: "https://web.telegram.org/",
      icon: <FaTelegram />,
    },
    {
      name: "Bluesky",
      url: "https://bsky.app/profile/7catto.bsky.social",
      icon: <SiBluesky />,
    },
    {
      name: "Discord (Maintainence)",
      url: "https://discordapp.com/users/7catto",
      icon: <FaDiscord />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        <div className="h-screen bg-white flex items-center justify-center py-20 px-6">
          <div className="max-w-4xl w-full">
            {/* Browser Window Card */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-300">
              {/* Browser Window  */}
              <div className="bg-window-500 px-4 py-6 flex items-center gap-2 border-b border-gray-300 justify-between">
                <p className="text-3xl md:text-1xl font-bold">Contact</p>
                <button className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium font-inherit cursor-pointer transition-colors duration-[250ms]">
                  X
                </button>
              </div>

              <div className="p-12">
                {/* Intro Section - Centered and Styled */}
                <div className="text-center mb-12">
                  <p className="text-lg text-window-500 leading-relaxed max-w-2xl mx-auto">
                    All of my social links where you can find me!{" "}
                  </p>
                  <p className="text-lg text-window-500 leading-relaxed max-w-2xl mx-auto">
                    Click any icon below will open the link in a new tab.
                  </p>
                </div>
                {/* Social Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-6 hover:border-[#FE5359] bg-white group-hover:scale-110 transition-all duration-300 group"
                    >
                      <div className="text-6xl text-window-500 group-hover:text-[#FE5359] group-hover:scale-110 transition-all duration-300 mb-4">
                        {social.icon}
                      </div>
                      <span className="text-lg font-medium text-gray-700 group-hover:text-[#FE5359] group-hover:scale-110 transition-all duration-300">
                        {social.name}
                      </span>
                    </a>
                  ))}
                  <div></div>
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
