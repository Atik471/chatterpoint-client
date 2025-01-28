import { BiError } from "react-icons/bi";



const ErrorPage = () => {
    return (
        <div className="min-h-[100vh] w-full flex flex-col gap-6 justify-center items-center text-center bg-primary ">
            <BiError className="text-[4rem] text-red-500 font-bold" />
            <h1 className="text-4xl text-red-500 font-bold">404 Error</h1>
        </div>
    );
};

export default ErrorPage;