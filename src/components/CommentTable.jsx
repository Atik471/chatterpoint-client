import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import CommentRow from "./CommentRow";
import { IoChevronBackSharp } from "react-icons/io5";

// export let refetchComments;

const CommentTable = () => {
  const { postId } = useParams();
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(5);
  const navigate = useNavigate();

  const fetchComment = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/comments/${postId}?page=${page}&limit=${limit}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["comments", page],
    queryFn: fetchComment,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  const comments = data?.comments;

  const handleGoBack = () => {
    navigate(-1);
  }

  const handlePageChange = async (newPage) => {
    setIsLoading(true);
    if (newPage < 1 || newPage > data.totalPages) return;
    setPage(newPage);
    await refetch();
    setIsLoading(false);
  };

  return (
    <div className="my-5">
      <button className="bg-tertiary hover:bg-white duration-200 transition-all p-1 rounded-full mb-5 ml-3" onClick={handleGoBack}>
      <IoChevronBackSharp className="text-white hover:text-black duration-200 transition-all text-xl" />
      </button>
      <table className=" min-w-full border-collapse border border-gray-800 text-left">
        <thead>
          <tr className="bg-tertiary text-white">
            <th className="px-4 py-2 border border-gray-800">Author Email</th>
            <th className="px-4 py-2 border border-gray-800">Comment</th>
            <th className="px-4 py-2 border border-gray-800">Action</th>
          </tr>
        </thead>
        <tbody>
          {comments?.map((comment, index) => (
            <CommentRow key={index} comment={comment} />
          ))}
        </tbody>
      </table>

      <div className="pagination flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
          Prev
        </button>

        {Array.from(
          { length: data?.totalPages || 1 },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-1 text-lg font-semibold rounded-md shadow-sm ${
              pageNumber === page
                ? "bg-tertiary text-white transition-all duration-300"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentTable;
