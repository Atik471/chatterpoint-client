import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PostDetails = () => {
//   const navigate = useNavigate();
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/post/${id}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError,  } = useQuery({ //refetch
    queryKey: ["posts"],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;
  return (
    <div>
      {/* <div>
        <img
          src={data?.photoURL || "/public/assets/pfp.png"}
          alt={data?.displayName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p>{data?.displayName}</p>
          <p>{data?.createdAt}</p>
        </div>
      </div> */}
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
    </div>
  );
};

export default PostDetails;
