import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserRow from "./UserRow";

export let refetchUsers;

const Users = () => {
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/users`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  refetchUsers = refetch;

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
          {data?.map((user, index) => (
            <UserRow key={index} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
