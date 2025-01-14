import { NavLink, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center py-4">
      <h1 onClick={() => navigate("/home")} className="cursor-pointer">ChatterPoint</h1>

      <ul>
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/membership"}>Membership</NavLink>
      </ul>

      <div>
        <FaBell />
        <button onClick={() => navigate("/login")} >Join Us</button>
        
      </div>
    </nav>
  );
};

export default Navbar;
