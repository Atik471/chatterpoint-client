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

  if (isLoading) return <div>Loading...</div>;
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
