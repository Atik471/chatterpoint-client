import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import { AuthContext } from "../contexts/AuthProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const API = useContext(LocationContext);
  const [vote, setVote] = useState(0);

  useEffect(() => {
    setVote(post.upvote - post.downvote);
  }, [setVote, post])

  const handleUpVote = () => {
    setLoading(true);
    axios
      .post(`${API}/post/${post._id}/vote`, {
        vote: 1
      })
      .then((response) => {
        console.log(response.data);
        setVote(vote+1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };
  const handleDownVote = () => {
    setLoading(true);
    axios
      .post(`${API}/post/${post._id}/vote`, {
        vote: -1
      })
      .then((response) => {
        console.log(response.data);
        setVote(vote-1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      key={post?._id}
      className="py-5 rounded-lg border-2 border-gray-800 mb-5 hover:border-tertiary/80 transition-all duration-300"
    >
      <div
        className="cursor-pointer border-b-2 border-gray-800 pb-5 px-5"
        onClick={() => navigate(`/post/${post._id}`)}
      >
        <div className="flex items-start gap-4">
          <img
            src={post?.photoURL || "/assets/pfp.png"}
            alt={post?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className=" font-bold">{post?.name}</h1>
            <div>
              <p className="text-sm text-gray-400">{post?.date}</p>
            </div>
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-2xl font-semibold my-2">{post?.title}</h3>
          <span className="bg-tertiary text-xs text-white px-2 py-[3px] rounded-xl font-semibold">
            {post?.tags}
          </span>
        </div>

        <p>{post?.description}</p>
      </div>
      <div className="pt-5 px-5 flex items-center justify-start gap-4">
        <div className="border-2 border-secondary rounded-lg flex items-center justify-center gap-4 py-2 px-1">
          <button disabled={!user && true} onClick={handleUpVote}>
            <BiUpvote className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
          </button>
          <span>{vote}</span>
          <button disabled={!user && true} onClick={handleDownVote}>
            <BiDownvote className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
          </button>
        </div>
        <button disabled={!user && true}>
          <MdOutlineInsertComment className="h-5 w-5 hover:text-tertiary transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;
