import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";
import { LocationContext } from "../contexts/LocationProvider";
import axios from "axios";

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
          .then((cookie) => console.log(cookie));
        axios
          .post(`${API}/users/register`, {
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
            role: "user",
            badges: ["bronze"],
          })
          .then((res) => {console.log(res.data)})
          .catch((err) =>
            toast.error(`Registration Failed! ${err}`, {
              position: "top-left",
              autoClose: 2000,
            })
          );

        navigate("/");
        toast.success("Registration Successful!", {
          position: "top-left",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(`Registration Failed! ${errorMessage}`, {
          position: "top-left",
          autoClose: 2000,
        });
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
        .then((res) => {console.log(res.data)
          axios
          .post(`${API}/jwt`, data.email, {
            withCredentials: true,
          })
          .then((cookie) => console.log(cookie));
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
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-primary text-white py-4 md:px-24 px-6">
      <Helmet>
        <title>ServiceTrek | Register</title>
      </Helmet>
      <div className="w-full md:w-1/2 p-6">
        <h1>Register</h1>
        <form
          onSubmit={handleSubmit(handleRegisterWithEmail)}
          className="space-y-4"
        >
          <input
            type="text"
            name="Username"
            placeholder="Username"
            {...register("name", { required: "Name is required" })}
            className="bg-primary"
          />
          {errors.name && <p>{errors.name.message}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="bg-primary"
          />
          {errors.email && <p>{errors.email.message}</p>}

          <input
            type="text"
            name="photoURL"
            placeholder="Photo URL"
            {...register("photoURL")}
            className="bg-primary"
          />

          <input
            type="password"
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
            className="bg-primary"
          />
          {errors.password && <p>{errors.password.message}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="bg-primary"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          <button type="submit">Register</button>
        </form>
        <div className="flex items-center justify-center mt-4">
          <button onClick={handleRegisterWithGoogle}>
            Register with Google
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
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
