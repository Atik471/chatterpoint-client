import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserRow from "./UserRow";

export let refetchUsers;

const Users = () => {
  const API = useContext(LocationContext);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/users?page=${page}&limit=${limit}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["users", page],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  refetchUsers = refetch;

  const handlePageChange = async (newPage) => {
    setIsLoading(true);
    if (newPage < 1 || newPage > data.totalPages) return;
    setPage(newPage);
    await refetch();
    setIsLoading(false);
  };

  const users = data?.users;

  return (
    <div>
      <table className="my-12 min-w-full border-collapse border border-gray-800 text-left">
        <thead>
          <tr className="bg-tertiary text-white">
            <th className="px-4 py-2 border border-gray-800">Username</th>
            <th className="px-4 py-2 border border-gray-800">Email</th>
            <th className="px-4 py-2 border border-gray-800">Action</th>
            <th className="px-4 py-2 border border-gray-800">
              Membership Status
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <UserRow key={index} user={user} />
          ))}
        </tbody>
      </table>

      <div className="pagination flex items-center justify-center gap-4 mt-6">
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

export default Users;
