import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="bg-primary text-white">
            <Navbar />
            
            <div className="mt-12">
            <Outlet />
            <Footer />
            </div>
        </div>
    );
};

export default MainLayout;