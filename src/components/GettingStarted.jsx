import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md mt-12 p-8 md:p-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
        🚀 Getting Started with ChatterPoint
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
        Share your ideas, showcase your work, or start a conversation. Your
        journey begins with your very first post.
      </p>
      <Link
        to="/dashboard/add-post"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all"
      >
        Post Your Ideas <FaArrowRight />
      </Link>
    </section>
  );
};

export default GettingStarted;
