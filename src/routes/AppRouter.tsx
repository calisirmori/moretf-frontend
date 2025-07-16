import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import LogPageWrapper from "../pages/LogPageWrapper"
import MatchSchedule from "../pages/MatchSchedule"
import MatchTicker from "../components/common/MatchTicker"
import Profile from "../pages/Profile";
import MatchesTab from "../components/profilePage/tabs/MatchesTab";

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
        <Route path="/profile/:playerId/*" element={<Profile />} />
        <Route path="/test" element={<MatchesTab />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <div className="font-ttnorms">
      <BrowserRouter>
        <AppWithLayout />
      </BrowserRouter>
    </div>
  );
}