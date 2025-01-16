import { BiEdit } from "react-icons/bi";
import { BiSort } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Posts = () => {
    const navigate = useNavigate();

    return (
        <section className="col-span-3">
            <div className="flex items-center justify-between">
                <BiEdit className="text-2xl text-white cursor-pointer" onClick={() => navigate("/add-post")} />
                <BiSort className="text-2xl text-white" />
            </div>
            <hr />
        </section>
    );
};

export default Posts;