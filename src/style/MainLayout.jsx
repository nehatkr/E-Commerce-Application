import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />

      {/* Page Content */}
      <main
        className={` min-h-screen transition-all duration-300 ${
          !isHome ? "ml-72" : "ml-0"
        }`}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
