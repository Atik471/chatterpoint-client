import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const tags = [
  "General Discussion",
  "Programming",
  "Questions",
  "Tutorials",
  "Education",
  "Bug Reports",
  "Projects",
  "Off-Topic",
  "News",
  "Tips & Tricks",
  "Technology Trends",
  "Community",
  "Events",
  "Education",
  "Showcase",
];


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
      <h1 className="text-xl font-bold text-tertiary my-4 text-center">
        Add a post
      </h1>
      <div>
        <img
          src={user?.photoURL}
          alt={user?.displayName}
          className="w-10 h-10 rounded-full"
        />
        <p className="text-tertiary text-center">{user?.displayName}</p>
        <p>{user?.email}</p>
      </div>
      <form onSubmit={handleSubmit(handleAddPost)}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="bg-primary"
        />
        {errors.title && <p>{errors.title.message}</p>}

        <select
          name="tags"
          placeholder="Tags"
          {...register("tags", { required: "Tag is required" })}
          className="bg-primary"
          defaultValue={"Select a topic"}
        >
          <option disabled selected value="Select a topic">
            Select a topic
          </option>
          {tags.map((tag, index) => (
            <>
              <option key={index}>{tag}</option>
            </>
          ))}
        </select>
        {errors.tags && <p>{errors.tags.message}</p>}
        <textarea
          placeholder="Description"
          style={{ resize: "none" }}
          className="bg-primary"
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && <p>{errors.description.message}</p>}
        <input type="submit" value="Post" />
      </form>
    </div>
  );
};

export default AddPost;
