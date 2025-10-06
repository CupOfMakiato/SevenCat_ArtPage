import React, { useState, useEffect } from 'react';
// import { viewAllCardsByBoardId, viewCardAttachments } from '../../api/trello-api';
import MainLayout from '../../layouts/MainLayout';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        {/* <LoadingOverlay show={loading} /> */}
        <p className="text-black flex justify-center content-center mt-auto">HomePage</p>
      </MainLayout>
    </div>
  );
};

export default HomePage;
