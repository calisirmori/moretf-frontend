import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import LogPageWrapper from "../pages/LogPageWrapper"
import Profile from "../pages/Profile"

export default function AppRouter() {
  return (
    <div className="font-ttnorms">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log/:logId" element={<LogPageWrapper />} />
          <Route path="/profile/:playerId" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}
