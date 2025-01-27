import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Announcement from "./Announcement";

export let announcementNum = 0;

const Announcements = () => {
    const API = useContext(LocationContext);
    const [isLoading, setIsLoading] = useState(false);
    const fetchAnnouncements = async () => {
        setIsLoading(true);
        const { data } = await axios.get(
          `${API}/announcements`
        );
        setIsLoading(false);
        return data;
      };

      const { data, isError, refetch } = useQuery({
        queryKey: ["announcements"],
        queryFn: fetchAnnouncements,
        keepPreviousData: true,
      });

      
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  announcementNum = data.length;

    return (
        <div className="mt-4">
            <h1 className="text-xl text-white font-bold">Announcements</h1>
            <div className="pt-2">
        {data?.map((announcement) => (
          <Announcement key={announcement._id} announcement={announcement} />
        ))}
      </div>
        </div>
    );
};

export default Announcements;
