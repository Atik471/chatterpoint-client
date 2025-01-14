import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <Banner />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;