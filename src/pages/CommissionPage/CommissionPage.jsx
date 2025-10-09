import React, { useState, useEffect, useRef } from "react";
import {
  viewAllListsByBoardId,
  viewAllCardsByListId,
  viewCardAttachments,
  viewCardById,
} from "../../api/trello-api";
import MainLayout from "../../layouts/MainLayout";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import closeSound from "../../assets/click_close.mp3";
import clickSound from "../../assets/collapsible_open.mp3";
import clickGeneralSound from "../../assets/click_general.mp3";
import { Howl } from "howler";

const Commission = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showExamples, setShowExamples] = useState({});
  const clickSoundRef = useRef(null);
  const closeSoundRef = useRef(null);
  const clickGeneralSoundRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  clickSoundRef.current = new Howl({
    src: [clickSound],
    volume: 0.4,
    html5: true,
    preload: true,
  });

  closeSoundRef.current = new Howl({
    src: [closeSound],
    volume: 0.4,
    html5: true,
    preload: true,
  });
  
  clickGeneralSoundRef.current = new Howl({
    src: [clickGeneralSound],
    volume: 0.4,
    html5: true,
    preload: true,
  });

  const markAudioReady = () => {
    setAudioReady(true);
  };

  const events = ["click", "touchstart", "keydown"];
  events.forEach((event) => {
    document.addEventListener(event, markAudioReady, { once: true });
  });

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        setLoading(true);

        const lists = await viewAllListsByBoardId();
        const commissionList = lists.find((list) =>
          list.name.toLowerCase().includes("commission")
        );

        if (!commissionList) {
          throw new Error("Commission list not found");
        }

        const cards = await viewAllCardsByListId(commissionList.id);

        const commissionData = await Promise.all(
          cards.map(async (card) => {
            try {
              const cardDetails = await viewCardById(card.id);
              const attachments = await viewCardAttachments(card.id);

              const images = attachments.filter(
                (att) => att.mimeType && att.mimeType.startsWith("image/")
              );

              return {
                id: card.id,
                name: card.name,
                description: cardDetails.desc || "",
                images: images.map((img) => ({
                  id: img.id,
                  url: img.url,
                  name: img.name,
                  fileName: img.fileName,
                  previews: img.previews || [],
                })),
              };
            } catch (err) {
              console.error(
                `Error fetching attachments for card ${card.id}:`,
                err
              );
              return null;
            }
          })
        );

        const validCommissions = commissionData.filter(
          (item) => item && item.images.length > 0
        );

        setCommissionData(validCommissions);
        setLoading(false);
      } catch (err) {
        console.error("Error loading commission data:", err);
        setError(`Failed to load commission information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchCommissionData();

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, markAudioReady);
      });
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      if (clickSoundRef.current) clickSoundRef.current.unload();
      if (closeSoundRef.current) closeSoundRef.current.unload();
      if (clickGeneralSoundRef.current) clickGeneralSoundRef.current.unload();
    };
  }, []);

  const playClickGeneralSound = () => {
    if (clickGeneralSoundRef.current && audioReady) {
      clickGeneralSoundRef.current.play();
    }
  };

  const toggleExamples = (commissionId) => {
    playClickGeneralSound();
    setShowExamples((prev) => ({
      ...prev,
      [commissionId]: !prev[commissionId],
    }));
  };

  const playClickSound = () => {
    if (clickSoundRef.current && audioReady) {
      clickSoundRef.current.play();
    }
  };

  const playCloseSound = () => {
    if (closeSoundRef.current && audioReady) {
      closeSoundRef.current.play();
    }
  };

  const openLightbox = (image, commission) => {
    playClickSound();
    setSelectedImage({
      ...image,
      commissionName: commission.name,
      commissionDescription: commission.description,
    });
  };

  const closeLightbox = () => {
    playCloseSound();
    setSelectedImage(null);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  const parsePricing = (description) => {
    const parts = description.split(";").map((part) => part.trim());
    if (parts.length >= 3) {
      return {
        type: parts[0],
        vnd: parts[1],
        usd: parts[2],
      };
    }
    return null;
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingOverlay show={loading} />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Commission <span className="text-[#FE5359]">Information</span>
            </h1>
            <p className="text-xl text-gray-600">
              View pricing and examples of commissioned artwork
            </p>
          </div>

          {/* Commission Pricing Table */}
          {commissionData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Commission is empty</p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
              <table className="w-full bg-white">
                <thead className="bg-window-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-bold text-lg">
                      Commission Type
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold text-lg">
                      Price (VND)
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold text-lg">
                      Price (USD)
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold text-lg">
                      Examples
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commissionData.map((commission, index) => {
                    const pricing = parsePricing(commission.description);
                    return (
                      <React.Fragment key={commission.id}>
                        {/* Main Row */}
                        <tr
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition-colors duration-200`}
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {commission.name}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 font-medium">
                            {pricing ? pricing.vnd : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 font-medium">
                            {pricing ? pricing.usd : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => toggleExamples(commission.id)}
                              className="bg-window-500 hover:bg-[#FE5359] text-white font-medium px-7 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                            >
                              {showExamples[commission.id]
                                ? "Hide Examples"
                                : "See Examples"}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Row with Image Grid */}
                        {showExamples[commission.id] && (
                          <tr className="animate-fadeIn">
                            <td colSpan="4" className="px-6 py-8 bg-gray-50">
                              <div className="mb-4">
                                <h3 className="text-2xl font-bold text-window-500">
                                  {commission.name}
                                </h3>
                              </div>
                              
                              {/* Masonry Grid */}
                              <div
                                className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
                                style={{ columnFill: "balance" }}
                              >
                                {commission.images.map((image) => (
                                  <div
                                    key={image.id}
                                    onClick={() => openLightbox(image, commission)}
                                    onDragStart={handleDragStart}
                                    className="group relative mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300"
                                  >
                                    <img
                                      src={image.url}
                                      alt={image.name}
                                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
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
                                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={closeLightbox}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            className="absolute top-6 right-6 rounded-lg border border-transparent px-5 py-2.5 font-medium font-inherit bg-[#141414] cursor-pointer transition-colors duration-[250ms] text-white text-2xl"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="max-w-6xl max-h-full relative cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-[80vh] cursor-zoom-out object-contain mx-auto select-none"
              draggable="false"
              onDragStart={handleDragStart}
              onClick={closeLightbox}
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
            <div className="text-white text-center mt-6">
              <h3 className="text-2xl font-bold mb-2">
                {selectedImage.commissionName}
              </h3>
              <p className="text-lg text-gray-300">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Commission;
