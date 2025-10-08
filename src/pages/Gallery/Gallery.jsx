import React, { useState, useEffect } from "react";
import {
  viewAllListsByBoardId,
  viewAllCardsByListId,
  viewCardAttachments,
} from "../../api/trello-api";
import MainLayout from "../../layouts/MainLayout";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

const Gallery = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);

        const lists = await viewAllListsByBoardId();

        const galleryList = lists.find((list) =>
          list.name.toLowerCase().includes("gallery")
        );

        if (!galleryList) {
          throw new Error("Gallery list not found");
        }

        const cards = await viewAllCardsByListId(galleryList.id);

        const portfolioData = await Promise.all(
          cards.map(async (card) => {
            try {
              const attachments = await viewCardAttachments(card.id);
              const images = attachments.filter(
                (att) => att.mimeType && att.mimeType.startsWith("image/")
              );

              return {
                id: card.id,
                title: card.name,
                description: card.desc,
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

        const flattenedItems = portfolioData
          .filter((item) => item && item.images.length > 0)
          .flatMap((item) =>
            item.images.map((image) => ({
              cardId: item.id,
              cardTitle: item.title,
              cardDescription: item.description,
              ...image,
            }))
          );

        setPortfolioItems(flattenedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError(`Failed to load gallery: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPortfolioData();

    // Disable right-click on entire page
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable specific keyboard shortcuts
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

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        <LoadingOverlay show={loading} />
        {/* Page Header */}
        <div className="text-center mb-10 mt-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-600">
            Some featured arts!
          </p>
        </div>

        {/* Portfolio Grid */}
        <main className="container mx-auto px-6 py-12">
          {portfolioItems.length === 0 && !loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Gallery is empty</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid cursor-zoom-in group mb-6"
                  onClick={() => openLightbox(item)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="relative bg-gray-100 overflow-hidden rounded-lg transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-auto object-contain pointer-events-none"
                      loading="lazy"
                      draggable="false"
                      onDragStart={handleDragStart}
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
                    {/* Transparent overlay */}
                    <div
                      className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={closeLightbox}
            onContextMenu={(e) => e.preventDefault()}
          >
            <button
              className="absolute top-6 right-6 rounded-lg border border-transparent px-5 py-2.5 text-base font-medium font-inherit bg-[#141414] cursor-pointer transition-colors duration-[250ms]"
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
              <div
                className="absolute inset-0 pointer-events-none cursor-zoom-out"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="text-white text-center mt-6">
                <h3 className="text-2xl font-light mb-2">
                  {selectedImage.name}
                </h3>
                {selectedImage.cardDescription && (
                  <p className="text-gray-300">
                    {selectedImage.cardDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </div>
  );
};

export default Gallery;
