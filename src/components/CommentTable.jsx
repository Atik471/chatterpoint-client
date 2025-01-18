import { useParams } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import CommentRow from "./CommentRow";

// export let refetchComments;

const CommentTable = () => {
  const { postId } = useParams();
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [select, setSelect] = useState("");


  const fetchComment = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/comments/${postId}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComment,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  const comments = data?.comments;

  // refetchComments = refetch;

  // email of the commenter, the comment text, feedback, and a Report button.
  return (
    <div>
      <table className="my-12 min-w-full border-collapse border border-gray-800 text-left">
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
    </div>
  );
};

export default CommentTable;
