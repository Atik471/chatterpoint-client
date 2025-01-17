import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-6 bg-primary text-white min-h-screen px-5 py-8">
            <aside className="col-span-1 flex flex-col dashnav">
                <NavLink to={"/dashboard/my-profile"} className={"bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"}>My Profile</NavLink>
                <NavLink to={"/add-post"} className={"bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"}>Add Post</NavLink>
                <NavLink to={"/dashboard/my-posts"} className={"bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"}>My Posts</NavLink>
                <hr className="border-gray-800 mr-5 my-4" />
                <NavLink to={"/"} className={"bg-secondary max-w-[14rem] px-3 py-1 my-2 rounded-lg font-bold hover:text-black transition-all duration-300 hover:bg-white"}>Home</NavLink>
            </aside>
            <div className="col-span-5 border-l-2 border-secondary">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;