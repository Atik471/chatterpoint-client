import PropTypes from "prop-types";
import { tags } from "./AddPost";

const Tags = ({ setSelectedTag }) => {
  return (
    <section className="col-span-1 border-r-2 border-gray-500 min-h-[75vh]">
      <h1 className="font-bold text-lg text-left my-3">Tags</h1>

      <div className="flex flex-wrap gap-2">
        <div className="tag px-2 py-1 border-2 border-tertiary rounded-lg font-bold text-center hover:bg-tertiary cursor-pointer transition-all duration-300" onClick={() => setSelectedTag("All")}>
          <p>All</p>
        </div>
        {tags.map((tag, index) => (
          <div key={index} className="tag px-2 py-1 border-2 border-tertiary rounded-lg font-bold text-center hover:bg-tertiary cursor-pointer transition-all duration-300" onClick={() => setSelectedTag(tag)}>
            <p>{tag}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

Tags.propTypes = {
  setSelectedTag: PropTypes.func.isRequired,
};

export default Tags;
