import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import ItemPage from "./pages/Item";
import NewListing from "./pages/NewListing";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";

const ProtectedNewListing = withAuthenticationRequired(NewListing, {
  onRedirecting: () => <div>Loading...</div>,
});

//Added a wrapper for new listing so that only authenticated users could create it.

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/item" element={<ItemPage />} />
        <Route path="/new" element={<ProtectedNewListing />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
