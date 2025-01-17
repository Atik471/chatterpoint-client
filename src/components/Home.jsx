import Banner from "./Banner"
import Tags from "./Tags"
import Posts from "./Posts"
import { useState } from "react";

const Home = () => {
    const [selectedTag, setSelectedTag] = useState("All");

    return (
        <section className="min-h-screen md:px-[5%] px-4 md:py-10 py-5">
            <Banner />
            <div className="grid grid-cols-5 gap-4">
                <Tags setSelectedTag={setSelectedTag} />
                <Posts selectedTag={selectedTag} />
                {/* <Announcements /> */}
            </div>
        </section>
    );
};

export default Home;