import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaBell } from "react-icons/fa6";
import { MdOutlineArticle, MdPersonOutline, MdNotificationsNone } from "react-icons/md";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";

const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = () => sessionStorage.getItem("authToken");

  const { data } = useQuery({
    queryKey: ["notifications", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/notifications/${user.email}`,
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,  // poll every 30 seconds
    refetchIntervalInBackground: false,
  });

  const unreadCount = data?.unreadCount ?? 0;
  const notifications = data?.notifications ?? [];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    // Mark all as read when opening
    if (next && unreadCount > 0) {
      try {
        await axios.patch(
          `${API}/notifications/read/${user.email}`,
          {},
          { headers: { Authorization: `Bearer ${token()}` } }
        );
        queryClient.setQueryData(["notifications", user.email], (old) =>
          old
            ? {
                ...old,
                unreadCount: 0,
                notifications: old.notifications.map((n) => ({ ...n, read: true })),
              }
            : old
        );
      } catch {
        // silent
      }
    }
  };

  const handleNotifClick = (notif) => {
    setOpen(false);
    if (notif.type === "comment" && notif.payload?.postId) {
      navigate(`/post/${notif.payload.postId}`);
    } else if (notif.type === "follow" && notif.payload?.actorEmail) {
      navigate(`/profile/${encodeURIComponent(notif.payload.actorEmail)}`);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative text-xl hover:text-tertiary transition-all duration-300"
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-2 text-[10px] font-extrabold text-white bg-red-500 rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-80 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="font-bold text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">{notifications.length} total</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
              <MdNotificationsNone className="text-4xl" />
              <p className="text-sm">No notifications yet.</p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-white/5">
              {notifications.map((notif) => (
                <li key={notif._id}>
                  <button
                    onClick={() => handleNotifClick(notif)}
                    className={`w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-start gap-3 ${
                      !notif.read ? "bg-tertiary/5" : ""
                    }`}
                  >
                    {/* Actor avatar */}
                    <img
                      src={notif.payload?.actorPhoto || "/assets/pfp.png"}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      {/* Message */}
                      {notif.type === "comment" && (
                        <p className="text-sm leading-snug">
                          <span className="font-semibold">{notif.payload?.actorName}</span>{" "}
                          commented on{" "}
                          <span className="text-tertiary font-medium truncate inline-block max-w-[140px] align-bottom">
                            {notif.payload?.postTitle}
                          </span>
                        </p>
                      )}
                      {notif.type === "follow" && (
                        <p className="text-sm leading-snug flex items-center gap-1">
                          <MdPersonOutline className="shrink-0 text-tertiary" />
                          <span className="font-semibold">{notif.payload?.actorName}</span>{" "}
                          started following you
                        </p>
                      )}
                      {notif.type === "upvote" && (
                        <p className="text-sm leading-snug flex items-center gap-1">
                          <MdOutlineArticle className="shrink-0 text-tertiary" />
                          <span className="font-semibold">{notif.payload?.actorName}</span>{" "}
                          upvoted{" "}
                          <span className="text-tertiary font-medium truncate inline-block max-w-[120px] align-bottom">
                            {notif.payload?.postTitle}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">{timeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-tertiary shrink-0 mt-1.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
