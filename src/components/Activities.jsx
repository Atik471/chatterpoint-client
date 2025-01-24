import { useContext, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ActivityRow from "../components/ActivityRow"

export let refetchReports;

const Activities = () => {
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/report`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["report"],
    queryFn: fetchReports,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  refetchReports = refetch;

  return (
    <div>
      <table className="my-12 min-w-full border-collapse border border-gray-800 text-left">
        <thead>
          <tr className="bg-tertiary text-white">
          <th className="px-4 py-2 border border-gray-800">Reported by</th>
            <th className="px-4 py-2 border border-gray-800">Comment</th>
            <th className="px-4 py-2 border border-gray-800">Feedback</th>
            <th className="px-4 py-2 border border-gray-800">Action</th>
            <th className="px-4 py-2 border border-gray-800">
              Membership Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((report, index) => (
            <ActivityRow key={index} report={report} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
