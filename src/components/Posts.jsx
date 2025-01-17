import { BiEdit } from "react-icons/bi";
import { BiSort } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import PropTypes from "prop-types";
import Post from "./Post";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Posts = ({ selectedTag }) => {
  const navigate = useNavigate();
  const API = useContext(LocationContext);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `${API}/posts?page=${page}&limit=${limit}${
        selectedTag === "All" ? "" : `&tag=${selectedTag}`
      }`
    );
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [page, refetch, selectedTag]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  const handlePageChange = async (newPage) => {
    setIsLoading(true);
    if (newPage < 1 || newPage > data.totalPages) return;
    setPage(newPage);
    await refetch();
    setIsLoading(false);
  };

  return (
    <section className="col-span-4 border-l-2 border-gray-800 min-h-[75vh] px-8">
      <div className="flex items-center justify-between pb-5 border-b-2 border-gray-800">
        <div
          className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary flex gap-1 text-sm cursor-pointer"
          data-tooltip-id="post"
          data-tooltip-content="Create a post"
        >
          <BiEdit
            className="text-xl cursor-pointer -ml-1"
            onClick={() => navigate("/add-post")}
          />
          <span>Post</span>
        </div>
        <ReactTooltip
          place="bottom"
          type="dark"
          effect="float"
          delayShow={500}
          id="post"
        />

        <div
          className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary flex gap-1 text-sm cursor-pointer"
          data-tooltip-id="sort"
          data-tooltip-content="Sort by popularity"
        >
          <BiSort
            className="text-xl cursor-pointer -ml-1"
            // onClick={() => navigate("/add-post")}
          />
          <span>Popular</span>
        </div>
        <ReactTooltip
          place="bottom"
          type="dark"
          effect="float"
          delayShow={500}
          id="sort"
        />
      </div>

      <div className="pt-5">
        {data?.posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>

      <div className="pagination flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-lg font-semibold text-gray-800 bg-gray-200 rounded-md shadow-sm">
          {page}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </section>
  );
};

Posts.propTypes = {
  selectedTag: PropTypes.string,
};

export default Posts;
