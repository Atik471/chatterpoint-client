import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const navigate = useNavigate();
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/post/${id}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  return (
    <div>
      <img
        src={data?.photoURL}
        alt={data?.displayName}
        className="w-10 h-10 rounded-full"
      />
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
      
    </div>
  );
};

export default Post;
