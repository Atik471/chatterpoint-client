import Banner from "./Banner";
import Tags from "./Tags";
import Posts from "./Posts";
import { useState } from "react";
import Announcements from "./Announcements";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState("All");

  return (
    <section className="min-h-screen md:px-[5%] px-4 md:py-10 py-5">
      <Helmet>
        <title>ChatterPoint | Home</title>
      </Helmet>
      <Banner setSelectedTag={setSelectedTag} />
      <div className="grid md:grid-cols-6 grid-cols-1 gap-4">
        <Tags setSelectedTag={setSelectedTag} selectedTag={selectedTag} />
        <Posts selectedTag={selectedTag} />
        <Announcements />
      </div>
    </section>
  );
};

export default Home;
