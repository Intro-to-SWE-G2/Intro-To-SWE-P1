import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemPage from "./pages/Item";
import NewListing from "./pages/NewListing";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/item" element={<ItemPage />} />
        <Route path="/new" element={<NewListing />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
