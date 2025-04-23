import { useAuth0 } from "@auth0/auth0-react";
import Routes from "./Routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEnsureUserCreated } from "./hooks/useEnsureUserCreated";

function App() {
  const { isLoading } = useAuth0();
  
  // This will ensure the user is created when they log in
  useEnsureUserCreated();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes />
      </main>
      <Footer />
    </div>
  );
}

export default App; 