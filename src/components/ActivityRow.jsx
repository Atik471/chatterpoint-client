import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { refetchReports } from "./Activities";

const ActivityRow = ({ report }) => {
  const [openReport, setOpenReport] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [loading, setLoading] = useState(false);

  const API = useContext(LocationContext);

  const handleReportOpen = () => {
    setOpenReport(true);
  };

  const handleReportClose = () => {
    setOpenReport(false);
  };

  const handleCommentOpen = () => {
    setOpenComment(true);
  };

  const handleCommentClose = () => {
    setOpenComment(false);
  };

  const onDeleteComment = () => {
    setLoading(true);

    axios
      .delete(`${API}/report`, {
        data: {
          reportId: report._id,
          commentId: report.commentId,
          action: "comment",
        },
      })
      .then(() => {
        toast.success("Successfully deleted!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Failed to deleted! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
        refetchReports();
      });
  };

  const onDeleteReport = () => {
    setLoading(true);

    axios
      .delete(`${API}/report`, {
        data: {
          reportId: report._id,
          commentId: report.commentId,
          action: "report",
        },
      })
      .then(() => {
        toast.success("Successfully deleted!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Failed to deleted! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
        refetchReports();
      });
  };

  return (
    <tr className="odd:bg-primary even:bg-secondary">
      <td className="px-4 py-2 border border-gray-800">{report.reportedBy}</td>
      <td className="px-4 py-2 border border-gray-800">{report?.comment}</td>
      <td className="px-4 py-2 border border-gray-800">{report.feedback}</td>
      <td className="px-4 py-2 border border-gray-800">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={handleReportOpen}
            className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary cursor-pointer"
            disabled={loading}
          >
            Remove Report
          </button>
          <button
            onClick={handleCommentOpen}
            className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary cursor-pointer"
            disabled={loading}
          >
            Delete Comment
          </button>
        </div>
      </td>

      <Dialog open={openReport} onClose={handleReportClose}>
        <DialogTitle>Remove report?</DialogTitle>
        <DialogActions>
          <Button onClick={handleReportClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              onDeleteReport();
              handleReportClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openComment} onClose={handleReportClose}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCommentClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              onDeleteComment();
              handleCommentClose();
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

ActivityRow.propTypes = {
  report: PropTypes.object.isRequired,
};

export default ActivityRow;
