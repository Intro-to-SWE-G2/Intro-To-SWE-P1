import { Routes as ReactRoutes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import MyAccount from "./pages/MyAccount";
import ItemDetailPage from "./pages/ItemDetailPage";
import SellItemPage from "./pages/SellItemPage";
import MessagesPage from "./pages/MessagesPage";
import ConversationPage from "./pages/ConversationPage";
import SellerProfilePage from "./pages/SellerProfilePage";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/item/:id" element={<ItemDetailPage />} />
      <Route path="/sell" element={<SellItemPage />} />
      <Route path="/account" element={<MyAccount />} />
      <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/messages/:conversationId" element={<ConversationPage />} />
    </ReactRoutes>
  );
};

export default Routes;
