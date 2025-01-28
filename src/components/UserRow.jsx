import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import { refetchUsers } from "./Users";
import { useNavigate } from "react-router-dom";

const UserRow = ({ user }) => {
  const [open, setOpen] = useState(false);
  const API = useContext(LocationContext);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const token = sessionStorage.getItem("authToken");
    axios
      .put(
        `${API}/user/update-role/${user._id}`,
        user.role === "user" ? { role: "admin" } : { role: "user" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => refetchUsers())
      .catch((err) => {
        toast.error(`Action Failed! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
        console.error("Axios Error:", err.status);
        if (err.status === 401) navigate("/login");
        throw err;
      });
  };

  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return (
        <>
          {text.substring(0, limit)}
          <span
            className="text-tertiary cursor-pointer"
            onClick={handleClickOpen}
          >
            ... Read more
          </span>
        </>
      );
    }
    return text;
  };
  return (
    <tr className="odd:bg-primary even:bg-secondary">
      <td className="px-4 py-2 border border-gray-800">
        {truncateText(user.name, 20)}
      </td>
      <td className="px-4 py-2 border border-gray-800">
        {truncateText(user.email, 30)}
      </td>
      <td className="px-4 py-2 border border-gray-800">
        <div className="flex flex-wrap justify-center gap-2">
          {user.role === "user" ? (
            <button
              className="py-1 px-3 rounded-lg bg-white font-bold text-primary transition-all duration-300 hover:bg-tertiary hover:text-white cursor-pointer"
              onClick={handleClickOpen}
            >
              Make Admin
            </button>
          ) : (
            <button
              className="py-1 px-3 rounded-lg bg-white font-bold text-primary transition-all duration-300 hover:bg-tertiary hover:text-white cursor-pointer"
              onClick={handleClickOpen}
            >
              Remove From Admin
            </button>
          )}
        </div>
      </td>
      <td className="px-4 py-2 border border-gray-800">
        {user.badges?.[1] ? "Premium Member" : "Regular Member"}
      </td>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {user.role === "user" ? "Make the user admin?" : "Remove from admin?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserRow;
