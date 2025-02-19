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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


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
  const [showPassword, setShowPassword] = useState(false);

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
          .then(res => sessionStorage.setItem('authToken', res.data?.token));
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
          }).then(res => sessionStorage.setItem('authToken', res.data?.token))
          
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
    return (
      <div className="flex justify-center items-center h-[95vh]">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-tertiary border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="absolute inset-0 flex items-center justify-center text-tertiary font-semibold text-xl">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 items-center min-h-screen bg-secondary px-3">
      <Helmet>
        <title>ChatterPoint | Login</title>
      </Helmet>
      <div className="w-full md:w-3/4 lg:w-2/3 mx-auto p-8 bg-primary text-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">JOIN US</h1>

        <form
          onSubmit={handleSubmit(handleLoginWithEmail)}
          className="space-y-6"
        >
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <input
            type="submit"
            value="Login"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-300"
          />

          <p className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-bold"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>

        <button
          onClick={handleLoginWithGoogle}
          className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 flex items-center justify-center"
        >
          Login with Google
        </button>
      </div>

      {animationData && (
        <div className="hidden md:block md:w-[80%]">
          <Lottie animationData={animationData} height={400} width={400} />
        </div>
      )}
    </div>
  );
};

export default Login;
