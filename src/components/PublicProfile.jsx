import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { SlBadge } from "react-icons/sl";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LocationContext } from "../contexts/LocationProvider";
import { AuthContext } from "../contexts/AuthProvider";
import FollowButton from "./FollowButton";
import Post from "./Post";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const PublicProfile = () => {
  const { email } = useParams();
  const API = useContext(LocationContext);
  const { user: viewer } = useContext(AuthContext);
  const navigate = useNavigate();
  const [followerCount, setFollowerCount] = useState(null);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["publicProfile", email],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/profile/${encodeURIComponent(email)}`);
      setFollowerCount(data.followerCount);
      return data;
    },
    enabled: !!email,
  });

  const isAlreadyFollowing =
    viewer && (profile?.followers || []).includes(viewer.email);

  const handleFollowToggle = (isNowFollowing) => {
    setFollowerCount((prev) => (isNowFollowing ? prev + 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-tertiary border-solid rounded-full animate-spin border-t-transparent" />
          <p className="absolute inset-0 flex items-center justify-center text-tertiary font-semibold">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh] gap-4">
        <p className="text-xl font-semibold">User not found.</p>
        <button
          onClick={() => navigate("/")}
          className="py-2 px-6 bg-tertiary rounded-lg font-bold hover:bg-white hover:text-primary transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  const displayFollowerCount = followerCount ?? profile.followerCount;

  return (
    <div className="min-h-screen md:w-[55%] w-[92%] mx-auto pt-20 pb-12">
      <Helmet>
        <title>ChatterPoint | {profile.name || profile.email}</title>
      </Helmet>

      {/* Header card */}
      <div className="bg-secondary rounded-2xl p-8 flex flex-col items-center gap-3 mb-8 shadow-lg">
        <img
          src={profile.photoURL || "/assets/pfp.png"}
          alt={profile.name}
          className="w-28 h-28 rounded-full border-4 border-tertiary object-cover"
        />
        <h1 className="text-2xl font-bold">{profile.name || "Anonymous"}</h1>
        <p className="text-sm text-tertiary -mt-2">{profile.email}</p>

        {/* Badges */}
        <div className="flex gap-3 items-center">
          <SlBadge
            className="text-2xl fill-[#A97142] cursor-pointer"
            data-tooltip-id="pub-badge"
            data-tooltip-content="Registered User"
          />
          {profile.badges?.includes("gold") && (
            <SlBadge
              className="text-2xl fill-[#EFBF04] cursor-pointer"
              data-tooltip-id="pub-badge"
              data-tooltip-content="Gold Member"
            />
          )}
          {profile.role === "admin" && (
            <span className="text-xs font-bold bg-tertiary text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
          <ReactTooltip id="pub-badge" place="bottom" />
        </div>

        {/* Follow stats */}
        <div className="flex gap-8 mt-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{displayFollowerCount}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{profile.followingCount}</span>
            <span className="text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{profile.recentPosts?.length ?? 0}+</span>
            <span className="text-gray-400">Posts</span>
          </div>
        </div>

        {/* Follow button */}
        <FollowButton
          targetEmail={profile.email}
          initialState={isAlreadyFollowing}
          onToggle={handleFollowToggle}
        />

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

        {/* Social links */}
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
      </div>

      {/* Recent posts */}
      <h2 className="text-xl font-bold text-tertiary mb-4">Recent Posts</h2>
      {profile.recentPosts?.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        profile.recentPosts?.map((post) => <Post key={post._id} post={post} />)
      )}
    </div>
  );
};

export default PublicProfile;
