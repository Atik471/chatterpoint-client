import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const [reload, setReaload] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if(reload < 100) setReaload(reload+1);
  }, [reload])

  const handleLogout = async () => {
    await logout()
      .then(() => {
        setUser(null);
        toast.success("Logout Successful!", {
          position: "top-left",
          autoClose: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        toast.error(`Login Failed! ${err.message}`, {
          position: "top-left",
          autoClose: 2000,
        });
      });
  };
  return (
    <div className="relative min-h-screen bg-primary text-white md:grid grid-cols-6">
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-5 left-4 text-white text-2xl z-50"
      >
        <FaBars />
      </button>

      <aside
        className={`border-r-2 border-secondary  ${
          isSidebarOpen ? 'left-0' : '-left-full'
        } fixed top-0 bottom-0 w-64 pl-4  bg-primary text-white md:left-0 transition-all duration-300 md:cols-span-1 flex flex-col dashnav md:pl-4 pt-12 md:pt-4 md:fixed z-40`}
      >
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer text-xl font-bold text-tertiary pb-5 pt-2"
        >
          Chatter<span className="text-white">Point</span>
        </h1>

        <NavLink
          to={"/dashboard/my-profile"}
          className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
        >
          {user?.role === 'admin' ? "Admin Profile" : "My Profile"}
        </NavLink>

        <NavLink
          to={"/dashboard/add-post"}
          className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
        >
          Add Post
        </NavLink>

        <NavLink
          to={"/dashboard/my-posts"}
          className={`bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white ${
            location.pathname === "/dashboard/my-posts" || location.pathname.startsWith("/dashboard/comments/")
              ? "active"
              : ""
          }`}
        >
          My Posts
        </NavLink>

        {user?.role === 'admin' && (
          <>
            <NavLink
              to={"/dashboard/users"}
              className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
            >
              Manage Users
            </NavLink>
            <NavLink
              to={"/dashboard/activities"}
              className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
            >
              Activities
            </NavLink>
            <NavLink
              to={"/dashboard/make-announcement"}
              className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
            >
              Make Announcements
            </NavLink>
          </>
        )}

        <hr className="border-gray-800 mr-5 my-4" />

        <NavLink
          to={"/"}
          className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
        >
          Home
        </NavLink>
        <button
          onClick={handleLogout}
          className="bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white text-left"
        >
          Logout
        </button>
      </aside>

      <div className="md:col-span-6 col-span-12 md:ml-[28%] lg:ml-[17%]  ">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
