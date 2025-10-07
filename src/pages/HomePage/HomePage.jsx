import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import {
  viewAllListsByBoardId,
  viewAllCardsByListId,
  viewCardAttachments,
  viewCardById,
} from "../../api/trello-api";

const HomePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        setLoading(true);

        const lists = await viewAllListsByBoardId();

        const profileList = lists.find((list) =>
          list.name.toLowerCase().includes("homepage")
        );

        if (!profileList) {
          throw new Error("Profile list not found");
        }

        const cards = await viewAllCardsByListId(profileList.id);

        if (!cards || cards.length === 0) {
          throw new Error("No cards found in Profile list");
        }

        const profileCard = cards[0]; //first card
        const profileCardDesc = cards[1];

        // Check if cards exist before accessing their properties
        if (!profileCard) {
          throw new Error("Profile card (index 0) not found");
        }

        const attachments = await viewCardAttachments(profileCard.id);

        // Only fetch name and description if cards exist
        let cardName = null;
        let cardDesc = null;

        if (profileCardDesc) {
          cardDesc = await viewCardById(profileCardDesc.id);
        }

        const profileImage = attachments.find(
          (att) => att.mimeType && att.mimeType.startsWith("image/")
        );

        setProfileData({
          name: cardName?.desc || "N/A name",
          description: cardDesc?.desc || "N/A desc",
          imageUrl: profileImage ? profileImage.url : null,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading about data:", err);
        setError(`Failed to load profile information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <LoadingOverlay show={loading} />
      </MainLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <MainLayout>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block"></div>

              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
                Hi, I'm{" "}
                <span className="text-[#FE5359] relative inline-block">
                  7Catto!
                </span>
              </h1>

              <div className="text-xl text-gray-600 leading-relaxed">
                {profileData?.description ? (
                  profileData.description
                    .split("\n")
                    .map(
                      (line, index) => line.trim() && <p key={index}>{line}</p>
                    )
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <Link
                  to="/gallery"
                  className="px-8 py-4 bg-window-500 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-bold hover:bg-[#FE5359]"
                >
                  View Gallery
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white text-gray-800 rounded-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 border-2 border-gray-200 font-bold"
                >
                  About Me
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Artwork Preview */}
            <div className="relative group">
              <div className="relative bg-gradient-to-brp-8 transform rounded-2xl">
                <div className="bg-white rounded-2xl p-6 min-h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    {profileData?.imageUrl ? (
                      <img
                        src={profileData.imageUrl}
                        alt={profileData.name}
                        className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 ease-in-out group-hover:scale-105"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                          WebkitTouchCallout: "none",
                          WebkitUserDrag: "none",
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    </div>
  );
};

export default HomePage;
