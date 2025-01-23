import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import { refetchUsers } from "./Users";

const UserRow = ({ user }) => {
  const [open, setOpen] = useState(false);
  const API = useContext(LocationContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    axios
      .put(`${API}/user/update-role/${user._id}`, user.role === 'user' ? {role: 'admin'} : {role: 'user'})
      .then(() => refetchUsers())
      .catch((err) =>
        toast.error(`Action Failed! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        })
      );
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
        {user.role === "user" ? (
          <button
            className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary cursor-pointer"
            onClick={handleClickOpen}
          >
            Make Admin
          </button>
        ) : (
          <button
            className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary cursor-pointer"
            onClick={handleClickOpen}
          >
            Remove From Admin
          </button>
        )}
      </td>
      <td className="px-4 py-2 border border-gray-800">
        {user.badges?.[1] ? "Premium Member" : "Regular Member"}
      </td>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Make the user admin?</DialogTitle>
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
