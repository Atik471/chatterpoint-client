import { useContext, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdClose, MdAddCircleOutline } from "react-icons/md";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { LocationContext } from "../contexts/LocationProvider";
import PropTypes from "prop-types";

/**
 * EditProfileModal
 * Props:
 *   dbUser    — the full user object fetched from MongoDB
 *   onClose   — close handler
 *   onSaved   — callback after successful save, receives updated fields
 */
const EditProfileModal = ({ dbUser, onClose, onSaved }) => {
  const API = useContext(LocationContext);

  const [bio, setBio] = useState(dbUser?.bio || "");
  const [skills, setSkills] = useState(dbUser?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(dbUser?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(dbUser?.linkedinUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(dbUser?.websiteUrl || "");
  const [saving, setSaving] = useState(false);
  const skillRef = useRef(null);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 15) return;
    setSkills([...skills, trimmed]);
    setSkillInput("");
    skillRef.current?.focus();
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills(skills.slice(0, -1));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = sessionStorage.getItem("authToken");
    try {
      await axios.put(
        `${API}/user/profile/${dbUser.email}`,
        { bio, skills, githubUrl, linkedinUrl, websiteUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated!", { position: "top-left", autoClose: 2000 });
      onSaved({ bio, skills, githubUrl, linkedinUrl, websiteUrl });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile.", {
        position: "top-left",
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-secondary rounded-2xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <MdClose className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-5">Edit Profile</h2>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Bio <span className="text-gray-500 font-normal">({bio.length}/300)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            rows={3}
            placeholder="Tell the community about yourself…"
            style={{ resize: "none" }}
            className="w-full bg-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary border border-white/10"
          />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Skills <span className="text-gray-500 font-normal">(max 15, Enter or comma to add)</span>
          </label>
          <div className="flex flex-wrap gap-2 bg-primary border border-white/10 rounded-lg px-3 py-2 min-h-[44px]">
            {skills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 bg-tertiary/20 text-tertiary border border-tertiary/30 rounded-full px-3 py-0.5 text-xs font-medium"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="ml-0.5 hover:text-red-400 transition"
                >
                  <MdClose className="w-3 h-3" />
                </button>
              </span>
            ))}
            {skills.length < 15 && (
              <input
                ref={skillRef}
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder={skills.length === 0 ? "React, TypeScript, Node.js…" : ""}
                className="bg-transparent text-sm outline-none flex-1 min-w-[120px] placeholder-gray-600"
              />
            )}
          </div>
          {skillInput.trim() && (
            <button
              type="button"
              onClick={addSkill}
              className="mt-1 text-xs text-tertiary flex items-center gap-1 hover:underline"
            >
              <MdAddCircleOutline /> Add &ldquo;{skillInput.trim()}&rdquo;
            </button>
          )}
        </div>

        {/* Social links */}
        <div className="mb-4 flex flex-col gap-3">
          <label className="block text-sm font-semibold text-gray-300">Links</label>

          <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-lg px-3 py-2">
            <FaGithub className="text-gray-400 shrink-0" />
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="bg-transparent text-sm flex-1 outline-none placeholder-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-lg px-3 py-2">
            <FaLinkedin className="text-[#0A66C2] shrink-0" />
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="bg-transparent text-sm flex-1 outline-none placeholder-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-lg px-3 py-2">
            <FaGlobe className="text-gray-400 shrink-0" />
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="bg-transparent text-sm flex-1 outline-none placeholder-gray-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-lg border border-white/20 hover:bg-primary transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-2 px-6 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary disabled:opacity-50 text-sm"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

EditProfileModal.propTypes = {
  dbUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

export default EditProfileModal;
