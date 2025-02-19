import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Lottie from "lottie-react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API = useContext(LocationContext);
  const { setUser, createWithGoogle, createWithEmail } =
    useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [animationData, setAnimationData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleRegisterWithGoogle = () => {
    setLoading(true);
    createWithGoogle()
      .then((userCredential) => {
        setUser(userCredential.user);
        axios
          .post(`${API}/jwt`, userCredential.user.email, {
            withCredentials: true,
          })
          .then((res) => sessionStorage.setItem("authToken", res.data?.token));
        axios
          .post(`${API}/users/register`, {
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
            role: "user",
            badges: ["bronze"],
          })
          .then(() => {
            toast.success("Registration Successful!", {
              position: "top-left",
              autoClose: 2000,
            });
          })
          .catch((err) => {
            if (err.status === 400) {
              toast.error(`Email already registered`, {
                position: "top-left",
                autoClose: 2000,
              });
            } else {
              toast.error(`Registration Failed! ${err}`, {
                position: "top-left",
                autoClose: 2000,
              });
            }
          });

        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (error.status === 400) {
          toast.error(`Email already registered`, {
            position: "top-left",
            autoClose: 2000,
          });
        } else {
          toast.error(`Registration Failed! ${errorMessage}`, {
            position: "top-left",
            autoClose: 2000,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegisterWithEmail = async (data) => {
    setLoading(true);
    try {
      await axios
        .post(`${API}/users/register`, {
          name: data.name,
          email: data.email,
          photoURL: data?.photoURL,
          role: "user",
          badges: ["bronze"],
        })
        .then((res) => {
          console.log(res.data);
          axios
            .post(`${API}/jwt`, data.email, {
              withCredentials: true,
            })
            .then((res) =>
              sessionStorage.setItem("authToken", res.data?.token)
            );
        })
        .catch((err) =>
          toast.error(`Registration Failed! ${err}`, {
            position: "top-left",
            autoClose: 2000,
          })
        );

      const userCredential = await createWithEmail(
        data.email,
        data.password,
        data.name,
        data.photoURL
      );

      setUser(userCredential.user);
      /*axios.post( `${serverDomain}/jwt`, userCredential.user.displayName, {withCredentials: true})
        .then(cookie => console.log(cookie))*/
      toast.success("Registration Successful!", {
        position: "top-left",
        autoClose: 2000,
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err.message || "An unknown error occurred.";
      toast.error(`Registration Failed! ${errorMessage}`, {
        position: "top-left",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
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
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-secondary text-white py-4 md:px-24 px-3">
      <Helmet>
        <title>ChatterPoint | Register</title>
      </Helmet>

      <div className="w-full md:w-1/2 p-6 bg-primary rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Register</h1>

        <form
          onSubmit={handleSubmit(handleRegisterWithEmail)}
          className="space-y-6"
        >
          {/* Username Input */}
          <div>
            <input
              type="text"
              name="Username"
              placeholder="Username"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Photo URL Input */}
          <div>
            <input
              type="text"
              name="photoURL"
              placeholder="Photo URL"
              {...register("photoURL")}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                  message:
                    "Password must be at least 6 characters long and include at least one uppercase and one lowercase letter",
                },
              })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-300"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleRegisterWithGoogle}
            className="py-3 px-6  w-full bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Register with Google
          </button>
        </div>
      </div>

      <div className="hidden md:block w-1/2 p-8">
        {animationData && (
          <Lottie animationData={animationData} height={400} width={400} />
        )}
      </div>
    </div>
  );
};

export default Register;
