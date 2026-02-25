import { useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { LocationContext } from "../contexts/LocationProvider";
import { MdOutlineArticle, MdPersonOutline, MdLabelOutline } from "react-icons/md";
import Post from "./Post";

const SearchResults = () => {
  const API = useContext(LocationContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/search?q=${encodeURIComponent(q)}`);
      return data;
    },
    enabled: !!q,
    keepPreviousData: true,
  });

  const hasAny =
    data && (data.posts?.length || data.users?.length || data.tags?.length);

  return (
    <div className="min-h-screen md:w-[70%] w-[92%] mx-auto pt-24 pb-16">
      <Helmet>
        <title>ChatterPoint | Search: {q}</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-1">
        Search results for{" "}
        <span className="text-tertiary">&ldquo;{q}&rdquo;</span>
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Showing posts, people, and tags matching your query.
      </p>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-14 h-14 border-4 border-tertiary rounded-full animate-spin border-t-transparent" />
        </div>
      )}

      {isError && (
        <p className="text-red-400">Something went wrong. Please try again.</p>
      )}

      {!isLoading && !isError && !q && (
        <p className="text-gray-400">Enter a search term to get started.</p>
      )}

      {!isLoading && !isError && q && !hasAny && (
        <div className="flex flex-col items-center gap-3 mt-16 text-gray-400">
          <p className="text-lg">No results found.</p>
          <button
            onClick={() => navigate("/")}
            className="py-2 px-6 bg-tertiary text-primary font-bold rounded-lg hover:bg-white transition"
          >
            Back to Feed
          </button>
        </div>
      )}

      {!isLoading && !isError && hasAny && (
        <div className="flex flex-col gap-12">

          {/* Posts */}
          {data.posts?.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-tertiary mb-4">
                <MdOutlineArticle className="text-xl" /> Posts
              </h2>
              {data.posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </section>
          )}

          {/* People */}
          {data.users?.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-tertiary mb-4">
                <MdPersonOutline className="text-xl" /> People
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.users.map((u) => (
                  <Link
                    to={`/profile/${encodeURIComponent(u.email)}`}
                    key={u._id}
                    className="flex items-center gap-4 bg-secondary rounded-xl p-4 hover:border-tertiary border-2 border-transparent transition"
                  >
                    <img
                      src={u.photoURL || "/assets/pfp.png"}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="font-bold truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {data.tags?.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-tertiary mb-4">
                <MdLabelOutline className="text-xl" /> Tags
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/search?q=${encodeURIComponent(tag.name || tag.tag || tag)}`}
                    className="text-sm bg-tertiary/10 text-tertiary border border-tertiary/30 rounded-full px-4 py-1.5 hover:bg-tertiary/20 transition font-medium"
                  >
                    {tag.name || tag.tag || tag}
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
};

export default SearchResults;
