import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-5 bg-primary text-white">
            <aside className="col-span-1 border-r-2 border-secondary flex flex-col">
                <NavLink to={"/dashboard/my-profile"}>My Profile</NavLink>
                <NavLink to={"/add-post"}>Add Post</NavLink>
                <NavLink to={"/dashboard/my-posts"}>My Posts</NavLink>
            </aside>
            <div className="col-span-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;