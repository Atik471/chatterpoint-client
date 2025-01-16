import { NavLink, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);

  const handLogout = async () => {
    await logout()
      .then(() => {
        setUser(null);
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

  return (
    <nav className="flex justify-between items-center py-3 bg-secondary text-white md:px-[5%] px-4">
      <h1
        onClick={() => navigate("/")}
        className="cursor-pointer text-xl font-bold text-tertiary"
      >
        Chatter<span className="text-white">Point</span>
      </h1>

      <ul className="flex gap-4 font-semibold">
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
            `border-b-2 border-transparent pb-1 px-1 ${
              isActive ? "active" : "hover:border-b-white"
            }`
          }
        >
          Membership
        </NavLink>
      </ul>

      <div className="flex items-center space-x-8">
        <FaBell className="text-xl cursor-pointer hover:text-tertiary transition-all duration-300" />
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary"
          >
            Join Us
          </button>
        ) : (
          <>
            <button onClick={handLogout}
            className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary">Logout</button>
            <div>
              <img
                src={user?.photoURL}
                alt={user?.displayName}
                className="w-10 h-10 rounded-full"
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
