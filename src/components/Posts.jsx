import { BiEdit } from "react-icons/bi";
import { BiSort } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import PropTypes from "prop-types";

const Posts = ({ selectedTag }) => {
  const navigate = useNavigate();
  const API = useContext(LocationContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `${API}/posts?page=${page}&limit=${limit}${selectedTag === "All" ? "" : `&tag=${selectedTag}`}` 
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
    <section className="col-span-4">
      <div className="flex items-center justify-between">
        <BiEdit
          className="text-2xl text-white cursor-pointer"
          onClick={() => navigate("/add-post")}
        />
        <BiSort className="text-2xl text-white" />
      </div>
      <hr />
      <div>
        {data?.posts?.map((post) => (
          <div key={post?._id} className="post-card">
            <h3
              className="cursor-pointer"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              {post?.title}
            </h3>
            <p>{post?.description}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>{page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

Posts.propTypes = {
  selectedTag: PropTypes.array,
};

export default Posts;
