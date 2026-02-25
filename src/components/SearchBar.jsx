import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineArticle, MdPersonOutline, MdLabelOutline } from "react-icons/md";

const SearchBar = () => {
  const API = useContext(LocationContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search request
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API}/search?q=${encodeURIComponent(query.trim())}`
        );
        setResults(data);
        setOpen(true);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query, API]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const hasResults =
    results &&
    (results.posts?.length || results.users?.length || results.tags?.length);

  return (
    <div className="relative w-full max-w-xs hidden md:block" ref={containerRef}>
      <form onSubmit={goToSearch} className="flex items-center gap-2 bg-primary rounded-full px-3 py-1.5 border border-white/10 focus-within:border-tertiary transition">
        <IoSearchOutline className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          placeholder="Search posts, users, tags…"
          className="bg-transparent text-sm w-full outline-none placeholder-gray-500"
        />
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse shrink-0">…</span>
        )}
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[340px] bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          {!hasResults ? (
            <p className="text-sm text-gray-400 px-4 py-3">No results found.</p>
          ) : (
            <>
              {/* Posts */}
              {results.posts?.length > 0 && (
                <section>
                  <p className="text-xs font-bold text-gray-500 px-4 pt-3 pb-1 uppercase tracking-widest flex items-center gap-1">
                    <MdOutlineArticle /> Posts
                  </p>
                  {results.posts.map((post) => (
                    <button
                      key={post._id}
                      onMouseDown={() => {
                        setOpen(false);
                        setQuery("");
                        navigate(`/post/${post._id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition flex items-center gap-3"
                    >
                      <img
                        src={post.photoURL || "/assets/pfp.png"}
                        className="w-7 h-7 rounded-full shrink-0 object-cover"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        <p className="text-xs text-tertiary truncate">{post.tags}</p>
                      </div>
                    </button>
                  ))}
                </section>
              )}

              {/* Users */}
              {results.users?.length > 0 && (
                <section className="border-t border-white/5">
                  <p className="text-xs font-bold text-gray-500 px-4 pt-3 pb-1 uppercase tracking-widest flex items-center gap-1">
                    <MdPersonOutline /> People
                  </p>
                  {results.users.map((u) => (
                    <button
                      key={u._id}
                      onMouseDown={() => {
                        setOpen(false);
                        setQuery("");
                        navigate(`/profile/${encodeURIComponent(u.email)}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition flex items-center gap-3"
                    >
                      <img
                        src={u.photoURL || "/assets/pfp.png"}
                        className="w-7 h-7 rounded-full shrink-0 object-cover"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </section>
              )}

              {/* Tags */}
              {results.tags?.length > 0 && (
                <section className="border-t border-white/5">
                  <p className="text-xs font-bold text-gray-500 px-4 pt-3 pb-1 uppercase tracking-widest flex items-center gap-1">
                    <MdLabelOutline /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2 px-4 pb-3 pt-1">
                    {results.tags.map((tag, i) => (
                      <button
                        key={i}
                        onMouseDown={() => {
                          setOpen(false);
                          setQuery("");
                          navigate(`/search?q=${encodeURIComponent(tag.name || tag.tag || tag)}`);
                        }}
                        className="text-xs bg-tertiary/10 text-tertiary border border-tertiary/30 rounded-full px-3 py-1 hover:bg-tertiary/20 transition"
                      >
                        {tag.name || tag.tag || tag}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* See all */}
              <button
                onMouseDown={goToSearch}
                className="w-full text-center text-xs text-tertiary py-2.5 border-t border-white/5 hover:bg-white/5 transition font-semibold"
              >
                See all results for &ldquo;{query}&rdquo; →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
