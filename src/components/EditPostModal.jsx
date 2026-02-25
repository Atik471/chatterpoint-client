import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";
import { TagContext } from "../contexts/TagsProvider";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

const EditPostModal = ({ post, onClose, onSaved }) => {
  const API = useContext(LocationContext);
  const { tags } = useContext(TagContext);
  const [mdContent, setMdContent] = useState(post.description || "");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { title: post.title, tags: post.tags },
  });

  const handleSave = async (formData) => {
    if (!mdContent.trim()) {
      toast.error("Post body cannot be empty.", { position: "top-left", autoClose: 2000 });
      return;
    }
    setSaving(true);
    const token = sessionStorage.getItem("authToken");
    try {
      await axios.put(
        `${API}/post/${post._id}`,
        { title: formData.title, tags: formData.tags, description: mdContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post updated!", { position: "top-left", autoClose: 2000 });
      onSaved();
      onClose();
    } catch (err) {
      toast.error(`Failed to update post: ${err.response?.data?.message || err.message}`, {
        position: "top-left",
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-secondary rounded-xl w-full max-w-3xl mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <MdClose className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
              className="bg-primary text-xl font-semibold px-3 py-2 border-b-2 border-white/30 w-full focus:outline-none"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <select
              {...register("tags", { required: "Tag is required" })}
              className="bg-primary w-full px-3 py-2 rounded-lg border-2 border-white/20 text-sm"
            >
              <option disabled value="Select a tag">Select a tag</option>
              {tags?.map((tag, i) => (
                <option key={i}>{tag}</option>
              ))}
            </select>
            {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>}
          </div>

          <div data-color-mode="dark">
            <MDEditor
              value={mdContent}
              onChange={(val) => setMdContent(val || "")}
              height={300}
              preview="edit"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-5 rounded-lg border border-white/20 hover:bg-primary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-2 px-6 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
