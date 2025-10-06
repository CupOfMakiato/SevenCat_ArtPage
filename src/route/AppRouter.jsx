import React, { useEffect } from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import AboutPage from "../pages/AboutPage/AboutPage";
import Gallery from "../pages/Gallery/Gallery";

const AppRouter = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
};

export default AppRouter;
