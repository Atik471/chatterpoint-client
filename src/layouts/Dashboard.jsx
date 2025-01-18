import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser, logout } = useContext(AuthContext);

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
    <div className="grid grid-cols-6 bg-primary text-white min-h-screen px-5 py-8">
      <aside className="col-span-1 flex flex-col dashnav">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer text-xl font-bold text-tertiary pb-5 pt-2"
        >
          Chatter<span className="text-white">Point</span>
        </h1>
        <NavLink
          to={"/dashboard/my-profile"}
          className={
            "bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
          }
        >
          My Profile
        </NavLink>
        <NavLink
          to={"/dashboard/add-post"}
          className={
            "bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
          }
        >
          Add Post
        </NavLink>
        <NavLink
          to={"/dashboard/my-posts"}
          className={
            "bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
          }
        >
          My Posts
        </NavLink>
        <hr className="border-gray-800 mr-5 my-4" />
        <NavLink
          to={"/"}
          className={
            "bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"
          }
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
      <div className="col-span-5 border-l-2 border-secondary">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
