import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Membership from "../components/Membership";
import ErrorPage from "../components/ErrorPage";
import AddPost from "../components/AddPost";
import Dashboard from "../layouts/Dashboard";
import MyProfile from "../components/MyProfile";
import MyPosts from "../components/MyPosts";
import PostDetails from "../components/PostDetails";
import CommentTable from "../components/CommentTable";
import Users from "../components/Users";
import Activities from "../components/Activities";
import MakeAnnouncement from "../components/MakeAnnouncement";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "membership",
        element: (
          <PrivateRoute>
            <Membership />
          </PrivateRoute>
        ),
      },
      {
        path: "post/:id",
        element: <PostDetails />,
      },
    ],
  },
  {
    path: "/dashboard/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "",
        element: <MyProfile />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "my-posts",
        element: <MyPosts />,
      },
      {
        path: "add-post",
        element: <AddPost />,
      },
      {
        path: "comments/:postId",
        element: <CommentTable />,
      },
      {
        path: "users",
        element: <AdminRoute> <Users /> </AdminRoute>,
      },
      {
        path: "activities",
        element: <AdminRoute><Activities /></AdminRoute>,
      },
      {
        path: "make-announcement",
        element: <AdminRoute> <MakeAnnouncement /> </AdminRoute>,
      },
    ],
  },
]);

export default router;
