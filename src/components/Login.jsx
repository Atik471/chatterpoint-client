import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
// import { LocationContext } from "../contexts/LocationProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [animationData, setAnimationData] = useState(null);
  const navigate = useNavigate();
  const { setUser, createWithGoogle, signInWithEmail } =
    useContext(AuthContext);
  //   const API = useContext(LocationContext);
  const [loading, setLoading] = useState(false);
  const API = useContext(LocationContext);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch("/animation/login-animation.json");
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error fetching animation JSON:", error);
      }
    };

    fetchAnimation();
  }, []);

  const handleLoginWithGoogle = () => {
    setLoading(true);
    createWithGoogle()
      .then((userCredential) => {
        setUser(userCredential.user);
        axios
          .post(`${API}/jwt`, userCredential.user.email, {
            withCredentials: true,
          })
          .then((cookie) => console.log(cookie));
        navigate("/");
        toast.success(`Login Successful`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error(`Login Failed! ${error.message}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleLoginWithEmail = (data) => {
    setLoading(true);
    signInWithEmail(data.email, data.password)
      .then((userCredential) => {
        setUser(userCredential.user);
        axios
          .post(`${API}/jwt`, userCredential.user.email, {
            withCredentials: true,
          })
          .then((cookie) => console.log(cookie));
        toast.success("Login Successful!", {
          position: "top-left",
          autoClose: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        toast.error(`Login Failed! ${err.message}`, {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    // console.log(user);
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <CircularProgress size={60} /> */}
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2">
      <Helmet>
        <title>ChatterPoint | Login</title>
      </Helmet>
      <div className="w-full md:w-1/2 p-8 bg-primary text-white">
        <h1>JOIN US</h1>

        <form
          onSubmit={handleSubmit(handleLoginWithEmail)}
          className="space-y-4 text-white"
        >
          <input
            type="text"
            name="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="bg-secondary"
          />
          {errors.email && <p>{errors.email.message}</p>}
          <input
            type="password"
            name="password"
            placeholder="password"
            {...register("password", { required: "Password is required" })}
            className="bg-secondary"
          />
          {errors.password && <p>{errors.password.message}</p> }
          <input type="submit" value="Login" />

          <p className="mt-4 text-center">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
        <button onClick={handleLoginWithGoogle}>Login with Google</button>
      </div>

      {animationData && (
        <Lottie animationData={animationData} height={400} width={400} />
      )}
    </div>
  );
};

export default Login;
