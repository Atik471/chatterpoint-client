import PropTypes from "prop-types";
import { TagContext } from "../contexts/TagsProvider";
import { useContext } from "react";

const Tags = ({ selectedTag, setSelectedTag }) => {
  const {tags} = useContext(TagContext);
  return (
    <section className="col-span-1">
  <h1 className="font-bold text-lg text-left my-3">Tags</h1>

  <div className="flex flex-wrap gap-2">
    <div
      className={`${
        selectedTag == "All"
          ? "bg-tertiary border-white"
          : "border-tertiary"
      } px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-base border-2 rounded-lg font-bold text-center hover:bg-tertiary cursor-pointer transition-all duration-300`}
      onClick={() => setSelectedTag("All")}
    >
      <p>All</p>
    </div>

    {tags?.map((tag, index) => (
      <div
        key={index}
        className={`${
          selectedTag == `${tag}` ? "bg-tertiary border-white" : "border-tertiary"
        } px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-base border-2 rounded-lg font-bold text-center hover:bg-tertiary cursor-pointer transition-all duration-300`}
        onClick={() => setSelectedTag(tag)}
      >
        <p>{tag}</p>
      </div>
    ))}
  </div>
</section>

  );
};

Tags.propTypes = {
  setSelectedTag: PropTypes.func.isRequired,
  selectedTag: PropTypes.string,
};

export default Tags;
