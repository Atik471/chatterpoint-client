import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-5">
            <aside className="col-span-1 border-2 border-secondary">
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