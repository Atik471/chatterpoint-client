import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AnnouncementContext } from "../contexts/AnnouncementProvider";
import { useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const { announcementnum } = useContext(AnnouncementContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navDropdown, setNavDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setNavDropdown(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout()
      .then(() => {
        setUser(null);
        sessionStorage.removeItem("authToken");
        toast.success("Logout Successful!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Login Failed! ${err.message}`, {
          position: "top-left",
          autoClose: 2000,
        });
      });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setNavDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center py-3 bg-secondary text-white md:px-[5%] px-4 fixed top-0 w-full z-10">
      <h1
        onClick={() => navigate("/")}
        className="cursor-pointer text-xl font-bold text-tertiary"
      >
        Chatter<span className="text-white">Point</span>
      </h1>

      <div className="md:hidden flex items-center order-1">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl"
        >
          {mobileMenuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      <ul
        className={`md:flex gap-3 font-semibold items-center transition-all duration-300 ${
          mobileMenuOpen
            ? "flex flex-col absolute top-[60px] left-0 w-full bg-secondary text-center p-4"
            : "hidden md:flex"
        }`}
      >
        <NavLink
          to={"/home"}
          className={({ isActive }) =>
            `border-b-2 border-transparent pb-1 px-1 transition-all duration-300 ${
              isActive || location.pathname === "/"
                ? "active"
                : "hover:border-b-white"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to={"/membership"}
          className={({ isActive }) =>
            `border-b-2 border-transparent pb-1 px-1 transition-all duration-300 ${
              isActive ? "active" : "hover:border-b-white"
            }`
          }
        >
          Membership
        </NavLink>
        <NavLink
          to={"/dashboard/"}
          className={({ isActive }) =>
            `border-b-2 border-transparent pb-1 px-1 transition-all duration-300 ${
              isActive ? "active" : "hover:border-b-white"
            }`
          }
        >
          Dashboard
        </NavLink>
        {user && (
          <>
            <NavLink
              to={"/dashboard/add-post"}
              className={({ isActive }) =>
                `border-b-2 border-transparent pb-1 px-1 transition-all duration-300 ${
                  isActive ? "active" : "hover:border-b-white"
                }`
              }
            >
              Add Post
            </NavLink>
            <NavLink
              to={"/dashboard/my-posts"}
              className={({ isActive }) =>
                `border-b-2 border-transparent pb-1 px-1 transition-all duration-300 ${
                  isActive ? "active" : "hover:border-b-white"
                }`
              }
            >
              My Posts
            </NavLink>
          </>
        )}
      </ul>

      <div className="flex items-center space-x-8">
        <div
          className="relative"
          data-tooltip-id="announcement"
          data-tooltip-content={`${announcementnum} Announcements`}
          onClick={() => {
            const element = document.getElementById("announcements-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <FaBell className="text-xl cursor-pointer hover:text-tertiary transition-all duration-300" />
          <span className="text-xs text-red-500 font-extrabold absolute transition-all duration-300 -top-1 -right-2">
            {announcementnum}
          </span>
          <ReactTooltip
            place="top"
            type="dark"
            effect="float"
            id="announcement"
          />
        </div>

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary"
          >
            Join Us
          </button>
        ) : (
          <>
            <div className="relative" ref={dropdownRef}>
              <img
                src={user?.photoURL || "/assets/pfp.png"}
                alt={user?.displayName}
                data-tooltip-id="nav-pfp"
                data-tooltip-content={user?.displayName}
                className="w-10 h-10 rounded-full border-4 border-transparent hover:border-primary/70 transition-all duration-300 cursor-pointer"
                onClick={() => setNavDropdown(!navDropdown)}
              />
              <ReactTooltip
                place="top"
                type="dark"
                effect="float"
                id="nav-pfp"
              />

              {navDropdown && (
                <div className="absolute top-[100%] right-0 p-3 rounded-lg border-2 border-secondary bg-primary text-center">
                  <h1 className="py-2 px-6 font-bold text-sm border-b-2 border-gray-800">
                    {user?.displayName}
                  </h1>
                  <div className="mb-2 mt-4 py-1 px-3 rounded-lg bg-white text-primary font-bold transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer">
                    <Link to={"/dashboard/my-profile"}>Dashboard</Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="py-1 px-3 rounded-lg w-full bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
