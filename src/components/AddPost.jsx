import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TagContext } from "../contexts/TagsProvider";

const AddPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {tags} = useContext(TagContext);
  const fetchPostCount = async () => {
    //setIsLoading(true);
    const { data } = await axios.get(`${API}/post-count/${user.email}`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["postCount"],
    queryFn: fetchPostCount,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [data, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  let postCount = data?.postCount;

  const handleAddPost = (data) => {
    setLoading(true);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const currDate = `${day} ${month} ${year}`;

    axios
      .post(`${API}/posts`, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        title: data.title,
        tags: data.tags,
        description: data.description,
        date: currDate,
        upvote: 0,
        downvote: 0,
        comments: 0,
      })
      .then(() => {
        //console.log(res.data);
        navigate("/");
        toast.success("Successfully submitted your post!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        //console.log(err);
        toast.error(`Failed to submit your post! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen md:mx-[20%] mx-4 my-4">
      {/* <h1 className="text-xl font-bold text-tertiary my-4 text-left">
        Add a post
      </h1> */}
      <div className="bg-secondary p-4 rounded-lg mt-16">
        <form onSubmit={handleSubmit(handleAddPost)}>
          <div className="flex items-start gap-4 mb-4">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">{user?.displayName}</p>
              <div>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <select
                  name="tags"
                  placeholder="Tags"
                  {...register("tags", { required: "Tag is required" })}
                  className="bg-secondary w-full pb-1 rounded-xl my-2 border-2 text-sm"
                  defaultValue={"Select a topic"}
                >
                  <option disabled selected value="Select a tag">
                    Select a tag
                  </option>
                  {tags.map((tag, index) => (
                    <>
                      <option key={index}>{tag}</option>
                    </>
                  ))}
                </select>
                {errors.tags && <p>{errors.tags.message}</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              placeholder="Write a title"
              {...register("title", { required: "Title is required" })}
              className="bg-secondary text-xl font-semibold px-1 py-2 border-b-2 border-white/30 appearance-none w-full focus:outline-none"
            />
            {errors.title && <p>{errors.title.message}</p>}

            <textarea
              placeholder="Write your post"
              style={{ resize: "none" }}
              rows="10"
              className="bg-secondary px-1 py-2 rounded-lg appearance-none w-full focus:outline-none focus:border-transparent "
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && <p>{errors.description.message}</p>}

            <hr className="border-white/10" />

            {postCount >= 5 && user?.badges?.[1] !== "gold" ? (
              <div className="text-center">
                <p className="my-1 mb-3">You have reached post limit. Please become a member to keep
                posting</p>
                <button className="py-2 px-6 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary" onClick={() => navigate('/membership')}>
                  Become a member
                </button>
              </div>
            ) : (
              <input
                type="submit"
                value="Post"
                className="py-2 px-6 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary self-end"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
