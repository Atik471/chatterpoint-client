import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import { SlBadge } from "react-icons/sl";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaGithub, FaLinkedin, FaGlobe, FaPen } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import AddTags from "./AddTags";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import EditProfileModal from "./EditProfileModal";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [profileOverride, setProfileOverride] = useState(null);

  const token = () => sessionStorage.getItem("authToken");
  const email = user.email;

  // Fetch full DB user (bio, skills, links, followers, etc.)
  const { data: dbUser, refetch: refetchDbUser } = useQuery({
    queryKey: ["dbUser", email],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/user/${email}`);
      return data;
    },
    enabled: !!email,
  });

  const profile = profileOverride ? { ...dbUser, ...profileOverride } : dbUser;

  const fetchUserPosts = async () => {
    const response = await axios.get(`${API}/my-posts/${email}?limit=3`, {
      headers: { Authorization: `Bearer ${token()}` },
    }).catch((err) => {
      if (err.status === 401) navigate("/login");
      throw err;
    });
    return response.data;
  };

  const fetchStats = async () => {
    const response = await axios.get(`${API}/stats`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
  };

  const { data: postsData, refetch: refetchPosts } = useQuery({
    queryKey: ["userPosts", email, 3],
    queryFn: fetchUserPosts,
    enabled: !!email,
  });

  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  useEffect(() => { refetchPosts(); }, [user, refetchPosts]);

  const posts = postsData?.posts;
  const chartData = [
    { name: "Users", stats: statsData?.userCount },
    { name: "Posts", stats: statsData?.postCount },
    { name: "Comments", stats: statsData?.commentCount },
  ];

  const handleSaved = (updated) => {
    setProfileOverride(updated);
    refetchDbUser();
  };

  return (
    <div className="md:w-[90%] mx-auto pt-12 pb-12 flex flex-col items-center gap-6">
      <Helmet>
        <title>ChatterPoint | My Profile</title>
      </Helmet>

      {editOpen && dbUser && (
        <EditProfileModal
          dbUser={{ ...dbUser, ...profileOverride }}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Profile card */}
      <div className="bg-secondary rounded-2xl w-full p-6 flex flex-col items-center gap-3 relative">
        <button
          onClick={() => setEditOpen(true)}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-tertiary transition border border-white/10 rounded-full px-3 py-1.5"
        >
          <FaPen className="text-xs" /> Edit Profile
        </button>

        <img
          src={user?.photoURL || "/assets/pfp.png"}
          alt={user?.displayName}
          className="w-28 h-28 rounded-full border-4 border-tertiary object-cover"
        />
        <h1 className="text-xl font-bold">{user?.displayName}</h1>
        <p className="-mt-2 text-sm text-tertiary">{user?.email}</p>

        {/* Badges */}
        <div className="flex gap-3 items-center">
          <SlBadge className="text-2xl fill-[#A97142] cursor-pointer" data-tooltip-id="my-badge" data-tooltip-content="Registered User" />
          {user?.badges?.[1] === "gold" && (
            <SlBadge className="text-2xl fill-[#EFBF04] cursor-pointer" data-tooltip-id="my-badge" data-tooltip-content="Gold Member" />
          )}
          {user?.role === "admin" && (
            <span className="text-xs font-bold bg-tertiary text-primary px-2 py-0.5 rounded-full">Admin</span>
          )}
          <ReactTooltip id="my-badge" place="bottom" />
        </div>

        {/* Social stats */}
        <div className="flex gap-8 text-sm mt-1">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{(dbUser?.followers || []).length}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{(dbUser?.following || []).length}</span>
            <span className="text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{postsData?.totalPosts ?? "…"}</span>
            <span className="text-gray-400">Posts</span>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-sm text-gray-300 text-center max-w-md mt-1">{profile.bio}</p>
        )}

        {/* Skills */}
        {profile?.skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {profile.skills.map((s, i) => (
              <span key={i} className="text-xs bg-tertiary/10 text-tertiary border border-tertiary/30 rounded-full px-3 py-0.5 font-medium">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(profile?.githubUrl || profile?.linkedinUrl || profile?.websiteUrl) && (
          <div className="flex gap-5 mt-2 text-xl">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaGithub /></a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:opacity-80 transition"><FaLinkedin /></a>
            )}
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaGlobe /></a>
            )}
          </div>
        )}

        {!profile?.bio && !profile?.skills?.length && (
          <p className="text-sm text-gray-500 mt-1">
            Add a bio and skills to stand out.{" "}
            <button onClick={() => setEditOpen(true)} className="text-tertiary underline">Edit profile →</button>
          </p>
        )}
      </div>

      {/* Admin stats */}
      {user.role === "admin" && (
        <>
          <div className="w-full">
            <h2 className="text-center font-bold text-tertiary text-2xl mb-4">ChatterPoint Stats</h2>
            <div className="flex gap-6 justify-center mb-4">
              {[
                { label: "Users", val: statsData?.userCount },
                { label: "Posts", val: statsData?.postCount },
                { label: "Comments", val: statsData?.commentCount },
              ].map(({ label, val }) => (
                <div key={label} className="bg-secondary rounded-xl px-6 py-4 text-center">
                  <p className="text-2xl font-bold text-tertiary">{val ?? "…"}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="90%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, bottom: 10, left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stats" fill="#08BAFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <AddTags />
        </>
      )}

      {/* Recent posts */}
      <div className="w-full">
        <h2 className="text-tertiary font-bold text-2xl mb-4">My Recent Posts</h2>
        {posts?.length === 0 && <p className="text-gray-400 text-sm">No posts yet.</p>}
        {posts?.map((post, i) => <Post key={i} post={post} />)}
      </div>
    </div>
  );
};

export default MyProfile;
