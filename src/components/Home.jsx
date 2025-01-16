import Banner from "./Banner"
import Tags from "./Tags"
import Posts from "./Posts"

const Home = () => {
    return (
        <section className="min-h-screen md:px-[5%] px-4 md:py-10 py-5">
            <Banner />
            <div className="grid grid-cols-4 gap-4">
                <Tags />
                <Posts />
                {/* <Announcements /> */}
            </div>
        </section>
    );
};

export default Home;