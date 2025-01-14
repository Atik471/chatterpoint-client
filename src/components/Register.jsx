import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";
import { LocationContext } from "../contexts/LocationProvider";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const serverDomain = useContext(LocationContext);
  const { setUser, createWithGoogle, createWithEmail } =
    useContext(AuthContext);
  const {
    register,
    handleSubmit,
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

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleRegisterWithGoogle = () => {
    setLoading(true);
    createWithGoogle()
      .then((userCredential) => {
        setUser(userCredential.user);
        /*axios.post( `${serverDomain}/jwt`, userCredential.user.displayName, {withCredentials: true})
        .then(cookie => console.log(cookie))*/
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(data.password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }

    setLoading(true);
    try {
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
        {/* <CircularProgress size={60} /> */} Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 py-4 md:px-24 px-6">
      <Helmet>
        <title>ServiceTrek | Register</title>
      </Helmet>
      <div className="w-full md:w-1/2 bg-white shadow-lg p-6">
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
          />
          {errors.name && <p>{errors.name.message}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
            {errors.email && <p>{errors.email.message}</p>}
          <input type="password" name="password" placeholder="Password" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <button type="submit">Register</button>

          {/* 

          <TextField
            label="Photo URL"
            type="url"
            variant="outlined"
            fullWidth
            {...register("photoURL")}
          />
          <div className="relative">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={handleTogglePassword}
            >
              {showPassword ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
            </button>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style = {{backgroundColor: "#03853e", fontWeight: 600, paddingTop: "12px", paddingBottom: "12px"}}
          >
            Register
          </Button> */}
        </form>
        <div className="flex items-center justify-center mt-4">
          {/* <Button
            variant="outlined"
            color="secondary"
            onClick={handleRegisterWithGoogle}
            fullWidth
            style = {{backgroundColor: "black", color:"white", fontWeight: 600, paddingTop: "12px", paddingBottom: "12px"}}
          >
            Register with Google
          </Button> */}
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
