import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { withAuthenticationRequired } from "@auth0/auth0-react"
import ItemPage from "./pages/Item"
import NewListing from "./pages/NewListing"
import HomePage from "./pages/HomePage"
import BrowsePage from "./pages/BrowsePage"
import MyAccount from "./pages/MyAccount"

const ProtectedNewListing = withAuthenticationRequired(NewListing, {
  onRedirecting: () => <div>Loading...</div>,
})

const ProtectedMyAccount = withAuthenticationRequired(MyAccount, {
  onRedirecting: () => <div>Loading...</div>,
})

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/new" element={<ProtectedNewListing />} />
        <Route path="/account" element={<ProtectedMyAccount />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
