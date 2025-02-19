import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";

export let refetchComments;

const Comments = ({ postId }) => {
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[95vh]">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-tertiary border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="absolute inset-0 flex items-center justify-center text-tertiary font-semibold text-xl">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  if (isError) return <div>Error loading posts.</div>;

  const comments = data?.comments;
  
  refetchComments = refetch;
  return (
    <div className="mt-6">
        {
            comments?.map((comment, index) => (
                <Comment key={index} comment={comment} />
            ))
        }
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string,
};

export default Comments;
