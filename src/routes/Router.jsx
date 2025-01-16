import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Membership from "../components/Membership";
import ErrorPage from "../components/ErrorPage";
import AddPost from "../components/AddPost";
import Post from "../components/Post";
import Dashboard from "../layouts/Dashboard";
import MyProfile from "../components/MyProfile"
import MyPosts from "../components/MyPosts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "membership",
                element: <Membership />
            },
            {
                path: "add-post",
                element: <AddPost />
            },
            {
                path: "post/:id",
                element: <Post />
            }
        ],
    },
    {
        path: "/dashboard/",
        element: <Dashboard />,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "",
                element: <MyProfile />
            },
            {
                path: "my-profile",
                element: <MyProfile />
            },
            {
                path: "my-posts",
                element: <MyPosts />
            }
        ]
    }
]);

export default router;