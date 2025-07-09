import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import LogPageWrapper from "../pages/LogPageWrapper"

export default function AppRouter() {
  return (
    <div className="font-ttnorms">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log/:logId" element={<LogPageWrapper />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}
