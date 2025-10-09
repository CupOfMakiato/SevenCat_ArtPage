import React, { useState, useEffect } from "react";
import {
  viewAllListsByBoardId,
  viewAllCardsByListId,
  viewCardById,
} from "../../api/trello-api";
import MainLayout from "../../layouts/MainLayout";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import TrelloMarkdownRenderer from "../../utils/TrelloMarkdownRenderer";

const TermOfService = () => {
  const [termOfServiceData, setTermOfServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTermOfServiceData = async () => {
      try {
        setLoading(true);

        const lists = await viewAllListsByBoardId();
        const termOfServiceList = lists.find((list) =>
          list.name.toLowerCase().includes("termofservice")
        );

        if (!termOfServiceList) {
          throw new Error("Term of Service list not found");
        }

        const cards = await viewAllCardsByListId(termOfServiceList.id);

        if (!cards || cards.length === 0) {
          throw new Error("No cards found in Term of Service list");
        }

        // Fetch details for all cards
        const cardsWithDetails = await Promise.all(
          cards.map(async (card) => {
            try {
              const cardDetails = await viewCardById(card.id);
              return {
                id: cardDetails.id,
                name: cardDetails.name,
                description: cardDetails.desc || "N/A",
              };
            } catch (err) {
              console.error(`Error fetching card ${card.id}:`, err);
              return null;
            }
          })
        );

        // Filter out any null values from failed fetches
        const validCards = cardsWithDetails.filter((card) => card !== null);
        setTermOfServiceData(validCards);

        setLoading(false);
      } catch (err) {
        console.error("Error loading term of service data:", err);
        setError(`Failed to load term of service information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTermOfServiceData();
  }, []);

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
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl text-center font-bold mb-6 text-[#FE5359]">
            Term of Services
          </h1>

          <div className="space-y-8">
            {termOfServiceData.map((card) => (
              <div
                key={card.id}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <h2 className="text-2xl font-bold mb-4 text-window-900">
                  {card.name}
                </h2>
                <div className="prose prose-lg max-w-none text-window-500">
                  <TrelloMarkdownRenderer
                    content={card.description}
                    className="text-window-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default TermOfService;
