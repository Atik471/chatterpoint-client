import axios from "axios";
import { createContext, useContext, useState } from "react";
import { LocationContext } from "./LocationProvider";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

export const TagContext = createContext();

const TagsProvider = ({ children }) => {
  // const [tags, setTags] = useState([]);
  const API = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTags = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${API}/tags`);
    setIsLoading(false);
    return data;
  };

  const { data, isError, refetch } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="absolute inset-0 flex items-center justify-center text-primary font-semibold text-xl">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  if (isError) return <div>Error loading posts.</div>;

  const tags = data?.map((doc) => doc.tag);

  const value = {
    tags,
    refetch
  }
  // console.log(tags);

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};

TagsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default TagsProvider;
