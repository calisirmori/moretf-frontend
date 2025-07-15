import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import LogPageWrapper from "../pages/LogPageWrapper"
import MatchSchedule from "../pages/MatchSchedule"
import MatchTicker from "../components/common/MatchTicker"

function AppWithLayout() {
  const { pathname } = useLocation();

  const shouldShowTicker = pathname !== "/matches";

  return (
    <>
      <Navbar />
      {shouldShowTicker && <MatchTicker />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log/:logId" element={<LogPageWrapper />} />
        <Route path="/matches" element={<MatchSchedule />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <div className="font-ttnorms">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log/:logId" element={<LogPageWrapper />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}