import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import Comments from "./Comments";
import { refetchComments } from "./Comments";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import { Helmet } from "react-helmet-async";

const PostDetails = () => {
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [vote, setVote] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const url = `https://chatterpoint.web.app${location.pathname}`;

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
  }, [data, refetch]);

  useEffect(() => {
    setVote(data.upvote - data.downvote);
    setCommentCount(data.comments);
  }, [setVote, data]);

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
        post: data._id,
      })
      .then(async () => {
        toast.success("Successfully submitted your comment!", {
          position: "top-left",
          autoClose: 2000,
        });
        setCommentCount(commentCount + 1);
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
  };

  const handleUpVote = () => {
    setLoading(true);
    axios
      .post(`${API}/post/${data._id}/vote`, {
        vote: 1,
      })
      .then((response) => {
        console.log(response.data);
        setVote(vote + 1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };
  const handleDownVote = () => {
    setLoading(true);
    axios
      .post(`${API}/post/${data._id}/vote`, {
        vote: -1,
      })
      .then((response) => {
        console.log(response.data);
        setVote(vote - 1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  if (isLoading) return <div className="pt-6">Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  return (
    <div className="md:w-[60%]  min-h-screen pt-6 md:mx-auto mx-4">
      <Helmet>
        <title>ChatterPoint | Post</title>
      </Helmet>
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
      <div className="my-4 ">
        <p className="bg-tertiary rounded-xl text-xs font-semibold text-white inline-block px-2">
          {data?.tags}
        </p>
        <h1 className="mb-3 text-2xl font-bold">{data?.title}</h1>
        <p>{data?.description}</p>
      </div>
      <div className="pt-5 md:px-5 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="border-2 border-secondary rounded-lg flex items-center justify-center gap-4  px-1 py-2">
            <button disabled={!user && true}>
              <BiUpvote
                className="h-5 w-5 hover:text-tertiary transition-all duration-300"
                onClick={handleUpVote}
              />
            </button>
            <span>{vote}</span>
            <button disabled={!user && true}>
              <BiDownvote
                className="h-5 w-5 hover:text-tertiary transition-all duration-300"
                onClick={handleDownVote}
              />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button disabled={!user && true}>
              <MdOutlineInsertComment className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
            </button>
            <span>{commentCount}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <FacebookShareButton url={url} quote={data?.title} disabled={!user}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={data?.title} disabled={!user}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={url} title={data?.title} disabled={!user}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={url} title={data?.title} disabled={!user}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>

      <hr className="my-8  border-white/20" />
      <form onSubmit={handleSubmit}>
        <textarea
          name="comment"
          id="comment"
          rows={3}
          placeholder="Write your comment"
          style={{ resize: "none" }}
          className="border-2 border-secondary rounded-xl p-4 bg-primary w-[94%]"
          onChange={(e) =>
            e.target.value === "" ? setLoading(true) : setLoading(false)
          }
        ></textarea>
        {user ? (
          <input
            type="submit"
            value="Submit"
            disabled={loading}
            className={`py-2 px-6 my-4 rounded-lg font-bold transition-all duration-300  self-end ${
              loading
                ? "bg-gray-400"
                : "bg-tertiary hover:bg-white hover:text-primary"
            }`}
          />
        ) : (
          <button
            className={`py-2 px-6 my-4 rounded-lg font-bold transition-all duration-300  self-end bg-tertiary hover:bg-white hover:text-primary`}
            onClick={() => navigate("/login")}
          >
            Login to submit
          </button>
        )}
      </form>
      {!isLoading && <Comments postId={data?._id} />}
    </div>
  );
};

export default PostDetails;
