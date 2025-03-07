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
  const [sort, setSort] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `${API}/posts?page=${page}&limit=${limit}&sort=${sort}${
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
  }, [page, refetch, selectedTag, sort]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[40vh] md:col-span-4 col-span-1">
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

  const handlePageChange = async (newPage) => {
    setIsLoading(true);
    if (newPage < 1 || newPage > data.totalPages) return;
    setPage(newPage);
    await refetch();
    setIsLoading(false);
  };

  return (
    <section className="md:col-span-4 col-span-1 min-h-[75vh] md:px-4 sm:px-8">
      <div className="flex items-center justify-between px-1 pb-4 ">
        <div
          className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary flex gap-1 text-xs sm:text-sm cursor-pointer"
          data-tooltip-id="post"
          data-tooltip-content="Create a post"
          onClick={() => navigate("/dashboard/add-post")}
        >
          <BiEdit className="text-xl cursor-pointer -ml-1" />
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
          className={`py-2 px-4 rounded-lg ${
            sort ? "bg-tertiary text-white" : "bg-white text-black"
          } font-bold transition-all duration-300 flex gap-1 text-xs sm:text-sm cursor-pointer`}
          data-tooltip-id="sort"
          data-tooltip-content="Sort by popularity"
          onClick={() => {
            setSort(!sort);
            // refetch();
          }}
        >
          <BiSort className="text-xl cursor-pointer -ml-1" />
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

      <div className="border-gray-800 md:border-x-2 md:border-y-2 px-3 pt-3">
        {data?.posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>

      <div className="pagination flex items-center justify-center gap-4 mt-6 px-4 flex-wrap">
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
    </section>
  );
};

Posts.propTypes = {
  selectedTag: PropTypes.string,
};

export default Posts;
