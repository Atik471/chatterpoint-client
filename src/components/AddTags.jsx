import { useContext, useState } from "react";
import { TagContext } from "../contexts/TagsProvider";
import { BiPlus } from "react-icons/bi";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { LocationContext } from "../contexts/LocationProvider";
import { useNavigate } from "react-router-dom";

const AddTags = () => {
  const { tags, refetch } = useContext(TagContext);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const API = useContext(LocationContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const token = sessionStorage.getItem("authToken");
    axios
      .post(
        `${API}/tags`,
        {
          tag: data.tagname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Successfully added tag!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Failed to add your tag! ${err}`, {
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
        refetch();
      });
  };

  return (
    <div className="p-4 border-2 border-tertiary bg-secondary rounded-xl ml-2 mr-3">
      <h1 className="text-tertiary font-bold text-2xl pb-3 border-b-2 border-white">
        Tags
      </h1>
      <div className="flex flex-wrap gap-2 my-3">
        {tags?.map((tag, index) => (
          <div
            key={index}
            className="px-2 py-1 border-2 rounded-lg font-bold text-center hover:bg-tertiary cursor-pointer transition-all duration-300"
          >
            {tag}
          </div>
        ))}
        <div>
          {!openForm && (
            <button
              className="px-2 py-1 border-2 rounded-lg font-bold text-center bg-white hover:bg-tertiary hover:text-white text-black cursor-pointer transition-all duration-300 flex gap-1 items-center"
              onClick={() => setOpenForm(!openForm)}
            >
              <span>Add Tag</span> <BiPlus className="font-bold text-xl" />{" "}
            </button>
          )}
        </div>
        {openForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap gap-2 mt-3"
          >
            <input
              type="text"
              id="tagname"
              {...register("tagname", {
                required: "This field is required",
              })}
              className="p-1 pl-3 border border-gray-300 rounded text-primary w-full sm:w-auto"
              placeholder="tagname"
            />
            {errors.tagname && (
              <p className="text-red-500 text-sm">{errors.tagname.message}</p>
            )}

            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                type="submit"
                className="px-2 bg-tertiary hover:bg-white transition-all duration-300 hover:text-black font-bold text-white rounded"
                disabled={loading}
              >
                Submit
              </button>
              <button
                onClick={() => setOpenForm(!openForm)}
                className="px-2 bg-white hover:bg-tertiary transition-all duration-300 hover:text-white font-bold text-black rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTags;
