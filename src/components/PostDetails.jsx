import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import Comments from "./Comments";
import { refetchComments } from "./Comments";

const PostDetails = () => {
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/post/${id}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    //refetch
    queryKey: ["posts"],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [data])

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const currDate = `${day} ${month} ${year}`;

    const comment = e.target.comment.value;

    axios
      .post(`${API}/comment`, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        comment: comment,
        date: currDate,
        post: data._id
      })
      .then( async () => {
        toast.success("Successfully submitted your comment!", {
          position: "top-left",
          autoClose: 2000,
        });
        await refetchComments();
      })
      .catch((err) => {
        toast.error(`Failed to submit your comment! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => {
        e.target.comment.value = "";
        setLoading(true);
      });
  }

  return (
    <div className="md:w-[60%]  min-h-screen mx-auto">
      <div className="flex gap-4 items-start mt-12">
        <img
          src={data?.photoURL || "/assets/pfp.png"}
          alt={data?.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-bold">{data?.name}</h2>
          <p className="text-sm text-tertiary">{data?.email}</p>
        </div>
      </div>
      <div className="my-4 ml-16">
        <p className="bg-tertiary rounded-xl text-xs font-semibold text-white inline-block px-2">
          {data?.tags}
        </p>
        <h1 className="mb-3 text-2xl font-bold">{data?.title}</h1>
        <p>{data?.description}</p>
      </div>
      <div className="pt-5 px-5 ml-10 flex items-center justify-start gap-4">
        <BiUpvote className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
        <BiDownvote className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
        <MdOutlineInsertComment className="h-5 w-5 hover:text-tertiary transition-all duration-300 ml-4" />
      </div>
      <hr className="my-8 ml-14 border-white/20" />
        <form onSubmit={handleSubmit} >
          <textarea
            name="comment"
            id="comment"
            rows={3}
            placeholder="Write your comment"
            style={{ resize: "none" }}
            className="border-2 border-secondary rounded-xl p-4 ml-14 bg-primary w-[94%]"
            onChange={(e) => e.target.value === "" ? setLoading(true) : setLoading(false)}
          ></textarea>
          {user ? <input
            type="submit"
            value="Submit"
            disabled={loading}
            className={`py-2 px-6 ml-14 my-4 rounded-lg font-bold transition-all duration-300  self-end ${loading ? "bg-gray-400" : "bg-tertiary hover:bg-white hover:text-primary"}`}
          /> : <button className={`py-2 px-6 ml-14 my-4 rounded-lg font-bold transition-all duration-300  self-end bg-tertiary hover:bg-white hover:text-primary`} onClick={() => navigate('/login')}>Login to submit</button>}
        </form>
        {
          !isLoading && <Comments postId={data?._id} />
        }
    </div>
  );
};

export default PostDetails;
