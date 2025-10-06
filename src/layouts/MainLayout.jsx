import React from 'react';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
