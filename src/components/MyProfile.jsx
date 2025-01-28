import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import { SlBadge } from "react-icons/sl";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AddTags from "./AddTags";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const navigate = useNavigate();

  const fetchUserPosts = async ({ email }) => {
    const response = await axios.get(`${API}/my-posts/${email}?limit=${3}`, {
      withCredentials: true,
    }).catch((err) => {
      console.error("Axios Error:", err.status);
      if(err.status === 401) handleUnauthorized();
      throw err;
    });

    return response.data;
  };

  const fetchStats = async () => {
    const response = await axios.get(`${API}/stats`, {
      withCredentials: true,
    }).catch((err) => {
      console.error("Axios Error:", err.status);
      if(err.status === 401) handleUnauthorized();
      throw err;
    });

    return response.data;
  };

  const email = user.email;

  const { data, refetch } = useQuery({
    queryKey: ["userPosts", email, 3],
    queryFn: () => fetchUserPosts({ email }),
    enabled: !!email,
  });

  const handleUnauthorized = () => {
    navigate('/login');
  }

  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchStats(),
  });

  

  useEffect(() => {
    refetch();
  }, [user, refetch]);

  const posts = data?.posts;
  const chartData = [
    { name: "Users", stats: statsData?.userCount },
    { name: "Posts", stats: statsData?.postCount },
    { name: "Comments", stats: statsData?.commentCount },
  ];

  return (
    <div className="md:w-[90%] mx-auto mt-12 flex flex-col items-center gap-4">
      <img
        src={user?.photoURL || "/assets/pfp.png"}
        alt={user?.displayName}
        className="w-28 h-28 rounded-full border-4 border-tertiary transition-all duration-300"
      />
      <h1 className="text-lg font-bold">{user?.displayName}</h1>
      <p className="-mt-4 text-sm text-tertiary">{user?.email}</p>
      <div className="flex gap-3">
        {user && (
          <SlBadge
            className="text-xl fill-[#A97142] cursor-pointer"
            data-tooltip-id="badge"
            data-tooltip-content="Registered User"
          />
        )}
        {user?.badges?.[1] == "gold" && (
          <SlBadge
            className="text-xl fill-[#EFBF04] cursor-pointer"
            data-tooltip-id="badge"
            data-tooltip-content="Registered Member"
          />
        )}
        <ReactTooltip place="bottom" type="dark" effect="float" id="badge" />
      </div>

        {
          user.role === "admin" && (
            <div className="my-4 flex gap-6">
              <div>
                <p className="text-tertiary font-bold">Users: <span className="text-white">{statsData?.userCount}</span></p>
              </div>
              <div>
                <p className="text-tertiary font-bold">Posts: <span className="text-white">{statsData?.postCount}</span></p>
              </div>
              <div>
                <p className="text-tertiary font-bold">Comments: <span className="text-white">{statsData?.commentCount}</span></p>
              </div>
            </div>
          )
        }
      {user.role === "admin" && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, bottom: 20, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stats" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {
        user.role === 'admin' && (
          <AddTags/>
        )
      }

      <h1 className="my-2 text-tertiary font-bold text-2xl text-left w-full">
        My Recent Posts
      </h1>
      <div className="w-full">
        {posts?.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
