import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100vh] w-full flex flex-col gap-6 justify-center items-center text-center bg-primary ">
            <BiError className="text-[4rem] text-red-500 font-bold" />
            <h1 className="text-4xl text-red-500 font-bold">Page Not Found!</h1>
            <button
            onClick={() => navigate("/")}
            className="py-2 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary"
          >
            Go to Home
          </button>
        </div>
    );
};

export default ErrorPage;