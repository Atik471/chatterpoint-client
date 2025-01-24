import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

const CommentRow = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const selectedValue = watch("feedback");
  const API = useContext(LocationContext);
  const { user } = useContext(AuthContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    setLoading(true);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const currDate = `${day} ${month} ${year}`;

    axios
    .post(`${API}/report`, {
      reportedBy: user.email,
      feedback: data.feedback,
      date: currDate,
      commentId: comment._id,
      comment: comment.comment,
    })
    .then(() => {

      toast.success("Successfully submitted report!", {
        position: "top-left",
        autoClose: 2000,
      });
    })
    .catch((err) => {
      toast.error(`Failed to submit report! ${err}`, {
        position: "top-left",
        autoClose: 2000,
      });
    })
    .finally(() => {
      setLoading(false); 
      reset();
    });
  };

  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return (
        <>
          {text.substring(0, limit)}
          <span className="text-tertiary cursor-pointer" onClick={handleClickOpen}>... Read more</span>
        </>
      );
    }
    return text;
  };


  return (
    <tr className="odd:bg-primary even:bg-secondary">
      <td className="px-4 py-2 border border-gray-800">{comment.email}</td>
      <td className="px-4 py-2 border border-gray-800">
        {truncateText(comment.comment, 20)}
      </td>
      <td className="px-4 py-2 border border-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <select
            {...register("feedback", { required: true })}
            className="my-2 py-2 pl-1 rounded-lg bg-tertiary text-white font-semibold transition-all duration-300 hover:bg-white hover:text-primary"
            defaultValue=""
          >
            <option disabled value="">
              Choose Feedback
            </option>
            <option value="Hate Speech">Hate Speech</option>
            <option value="Irrelevant">Irrelevant</option>
            <option value="Harassment">Harassment</option>
          </select>
          <input
            type="submit"
            value="Report"
            className={`my-2 py-2 px-6 rounded-lg font-bold transition-all duration-300 ${
              selectedValue
                ? "bg-tertiary text-white hover:bg-white hover:text-primary cursor-pointer"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!selectedValue && loading}
          />
        </form>
      </td>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Full Comment</DialogTitle>
        <DialogContent  className="md:max-w-[20rem]">
          <p>{comment.comment}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

CommentRow.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentRow;
