import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserPosts = async ({ email }) => {
    const token = sessionStorage.getItem("authToken");
    const response = await axios
      .get(`${API}/my-posts/${email}?limit=${5}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        console.error("Axios Error:", err.status);
        if (err.status === 401) navigate("/login");
        throw err;
      });
    setLoading(false);
    return response.data;
  };

  const email = user.email;
  const { data, refetch } = useQuery({
    queryKey: ["userPosts", email, 5],
    queryFn: () => fetchUserPosts({ email }),
    enabled: !!email,
  });

  useEffect(() => {
    refetch();
  }, [user, refetch, page]);

  const handlePageChange = async (newPage) => {
    setLoading(true);
    if (newPage < 1 || newPage > data.totalPages) return;
    setPage(newPage);
    await refetch();
    setLoading(false);
  };

  const posts = data?.posts;

  if (loading) {
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

  return (
    <div className="pt-16">
      <Helmet>
        <title>ChatterPoint | My Posts</title>
      </Helmet>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-800 text-left">
          <thead>
            <tr className="bg-tertiary text-white">
              <th className="px-4 py-2 border border-gray-800">Title</th>
              <th className="px-4 py-2 border border-gray-800">Votes</th>
              <th className="px-4 py-2 border border-gray-800">Comments</th>
              <th className="px-4 py-2 border border-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post, index) => (
              <tr key={index} className="odd:bg-primary even:bg-secondary">
                <td className="px-4 py-2 border border-gray-800">
                  {post.title}
                </td>
                <td className="px-4 py-2 border border-gray-800">
                  {post.upvote - post.downvote}
                </td>
                <td className="px-4 py-2 border border-gray-800">
                  <button
                    className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary text-sm sm:text-base"
                    onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                  >
                    View Comments
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-800">
                  <button className="py-1 px-3 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary text-sm sm:text-base">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination flex flex-wrap items-center justify-center gap-4 mt-6">
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
    </div>
  );
};

export default MyPosts;
