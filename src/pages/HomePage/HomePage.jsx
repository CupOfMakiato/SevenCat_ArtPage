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
import TrelloMarkdownRenderer from "../../utils/TrelloMarkdownRenderer";

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

        const profileCard = cards[0];
        const profileCardDesc = cards[1];
        const profileCardBio = cards[2];

        if (!profileCard) {
          throw new Error("Profile card (index 0) not found");
        }

        const attachments = await viewCardAttachments(profileCard.id);

        let cardName = null;
        let cardDesc = null;
        let cardBio = null;

        if (profileCardDesc) {
          cardDesc = await viewCardById(profileCardDesc.id);
        }

        if (profileCardBio) {
          cardBio = await viewCardById(profileCardBio.id);
        }

        const profileImage = attachments.find(
          (att) => att.mimeType && att.mimeType.startsWith("image/")
        );

        setProfileData({
          name: cardName?.desc || "N/A name",
          description: cardDesc?.desc || "N/A desc",
          bio: cardBio?.desc || "N/A bio",
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
        <section className="relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-[calc(100vh-4rem)] md:min-h-screen">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1">
              <div className="inline-block"></div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Hi, I'm{" "}
                <span className="text-[#FE5359] relative inline-block">
                  7Catto!
                </span>
              </h1>
              
              <div className="text-base sm:text-lg md:text-xl leading-relaxed space-y-4 text-[#6f6f6f] mb-4">
                <TrelloMarkdownRenderer content={profileData?.bio || "N/A"} />
              </div>

              <div className="text-base sm:text-lg md:text-xl text-window-500 leading-relaxed">
                <TrelloMarkdownRenderer
                  content={profileData?.description || "N/A"}
                />
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-end pt-4">
                {/* 
                <Link
                  to="/gallery"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-window-500 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-bold hover:bg-[#FE5359]"
                >
                  View Gallery
                </Link>
                <Link
                  to="/about"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white text-gray-800 rounded-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 border-2 border-gray-200 font-bold"
                >
                  About Me
                </Link>
                */}
              </div>
            </div>

            {/* Right Content - Featured Artwork Preview */}
            <div className="relative group order-1 md:order-2">
              <div className="relative bg-gradient-to-br p-4 sm:p-6 md:p-8 transform rounded-2xl">
                <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center">
                  <div className="w-full max-w-md aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 border-2 sm:border-4 border-gray-200">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
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
