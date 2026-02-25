import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

/**
 * Reusable follow/unfollow button.
 * Props:
 *   targetEmail  — email of the user to follow/unfollow
 *   initialState — boolean: is the viewer already following this user?
 *   onToggle     — optional callback(isNowFollowing)
 */
const FollowButton = ({ targetEmail, initialState = false, onToggle }) => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const navigate = useNavigate();
  const [following, setFollowing] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const token = sessionStorage.getItem("authToken");

    try {
      if (following) {
        await axios.delete(`${API}/follow/${targetEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(false);
        onToggle?.(false);
      } else {
        await axios.post(
          `${API}/follow/${targetEmail}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing(true);
        onToggle?.(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.", {
        position: "top-left",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show the button on your own profile
  if (user?.email === targetEmail) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`py-1.5 px-5 rounded-full text-sm font-bold border-2 transition-all duration-300 disabled:opacity-50 ${
        following
          ? "border-tertiary text-tertiary hover:bg-red-600/20 hover:border-red-400 hover:text-red-400"
          : "border-tertiary bg-tertiary text-primary hover:bg-transparent hover:text-tertiary"
      }`}
    >
      {loading ? "…" : following ? "Following" : "Follow"}
    </button>
  );
};

FollowButton.propTypes = {
  targetEmail: PropTypes.string.isRequired,
  initialState: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default FollowButton;
