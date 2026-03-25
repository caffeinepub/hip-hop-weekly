import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Beats from "./pages/Beats";
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import Submit from "./pages/Submit";
import Subscribe from "./pages/Subscribe";
import Trending from "./pages/Trending";
import Underground from "./pages/Underground";
import WatchList from "./pages/WatchList";
import AdminBeats from "./pages/admin/AdminBeats";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminRundown from "./pages/admin/AdminRundown";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminTips from "./pages/admin/AdminTips";
import AdminUnderground from "./pages/admin/AdminUnderground";
import AdminWatchList from "./pages/admin/AdminWatchList";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/underground" element={<Underground />} />
          <Route path="/beats" element={<Beats />} />
          <Route path="/watch-list" element={<WatchList />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="rundown" element={<AdminRundown />} />
            <Route path="watchlist" element={<AdminWatchList />} />
            <Route path="underground" element={<AdminUnderground />} />
            <Route path="beats" element={<AdminBeats />} />
            <Route path="tips" element={<AdminTips />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
