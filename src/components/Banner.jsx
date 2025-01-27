import PropTypes from "prop-types";
import { useContext } from "react";
import { TagContext } from "../contexts/TagsProvider";

const Banner = ({ setSelectedTag }) => {
  const {tags} = useContext(TagContext);

	  const handleTagChange = (e) => {
		setSelectedTag(e.target.value);
	  }

  return (
    <div>
      <div className="bg-[url('/assets/banner.jpg')] bg-cover bg-center h-52 mt-5 mb-12 rounded-2xl shadow-xl w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
		  className="flex justify-center items-center h-full w-[60%] mx-auto"
        >
          <select
            name="tags"
            placeholder="Tags"
            className="text-gray-500 bg-white py-4 px-6 w-full appearance-none text-lg rounded-lg shadow-lg"
            defaultValue={"Select a topic"}
			onChange={handleTagChange}
          >
            <option disabled selected value="Seearch by tag">
              Select a topic
            </option>
			<option>
              All
            </option>
            {tags.map((tag, index) => (
              <>
                <option key={index}>{tag}</option>
              </>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
};

Banner.propTypes = {
  setSelectedTag: PropTypes.func.isRequired,
};

export default Banner;
