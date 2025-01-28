import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const MakeAnnouncement = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddPost = (data) => {
    setLoading(true);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const currDate = `${day} ${month} ${year}`;

    axios
      .post(
        `${API}/announcements`,
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          title: data.title,
          description: data.description,
          date: currDate,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        toast.success("Successfully posted announcement!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Failed to post announcement! ${err}`, {
          position: "top-left",
          autoClose: 2000,
        });
        console.error("Axios Error:", err.status);
        if (err.status === 401) navigate("/login");
        throw err;
      })
      .finally(() => {
        setLoading(false);
        reset();
      });
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
      <Helmet>
        <title>ChatterPoint | Announcements</title>
      </Helmet>
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

            <input
              type="submit"
              value="Post"
              className="py-2 px-6 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary self-end cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
