import React, { useState, useEffect } from "react";
import {
  viewAllListsByBoardId,
  viewAllCardsByListId,
  viewCardAttachments,
  viewCardById,
} from "../../api/trello-api";
import MainLayout from "../../layouts/MainLayout";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import TrelloMarkdownRenderer from "../../utils/TrelloMarkdownRenderer";

const Commission = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

        // Filter out cards with no images
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

    // Disable right-click and keyboard shortcuts
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
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openLightbox = (image, commission) => {
    setSelectedImage({
      ...image,
      commissionName: commission.name,
      commissionDescription: commission.description,
    });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Parse pricing from description
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
              You can scroll for the example commission arts here!
            </p>
          </div>

          {/* Commission Sections */}
          {commissionData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Commission is empty</p>
            </div>
          ) : (
            <div className="space-y-20">
              {commissionData.map((commission) => {
                const pricing = parsePricing(commission.description);

                return (
                  <div key={commission.id}>
                    {/* Commission Header */}
                    <div className="mb-8">
                      <h2 className="text-4xl font-bold text-window-500 mb-4">
                        {commission.name}
                      </h2>

                      {/* Pricing Display */}
                      {pricing && (
                        <div className="inline-flex items-center gap-6 bg-gradient-to-r px-6 py-4 rounded-xl border-2 border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                              VND
                            </p>
                            <p className="text-2xl font-bold text-window-500">
                              {pricing.vnd}
                            </p>
                          </div>
                          <div className="h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                              USD
                            </p>
                            <p className="text-2xl font-bold text-window-500">
                              {pricing.usd}
                            </p>
                          </div>
                        </div>
                      )}
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
                          <div className="absolute inset-0   bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
            onClick={closeLightbox}
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
