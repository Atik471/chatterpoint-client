import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import { SlBadge } from "react-icons/sl";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);

  const fetchUserPosts = async ({ email }) => {
    const response = await axios.get(
      `${API}/my-posts/${email}?limit=${3}`
    );
    return response.data;
  };

  const email = user.email;
  const { data, isError, refetch } = useQuery({
    queryKey: ["userPosts", email, 3],
    queryFn: () => fetchUserPosts({ email }),
    enabled: !!email,
  });

  useEffect(() => {
    refetch();
  }, [user, refetch]);

  const posts = data?.posts;

  return (
    <div className="md:w-[90%] mx-auto mt-12 flex flex-col items-center gap-4">
      <img
        src={user?.photoURL || "/assets/pfp.png"}
        alt={user?.displayName}
        className="w-28 h-28 rounded-full border-4 border-tertiary transition-all duration-300 cursor-pointer"
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

      <h1 className="my-2 text-tertiary font-bold text-2xl text-left w-full">My Recent Posts</h1>
      <div className="w-full">
        {posts?.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
