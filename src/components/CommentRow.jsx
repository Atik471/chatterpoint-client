import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const CommentRow = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const selectedValue = watch("feedback");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    console.log("Selected Value:", data.feedback);
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
      <td>
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
            value="Submit"
            className={`my-2 py-2 px-6 rounded-lg font-bold transition-all duration-300 ${
              selectedValue
                ? "bg-tertiary text-white hover:bg-white hover:text-primary cursor-pointer"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!selectedValue}
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
