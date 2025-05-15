import { FaCrown } from "react-icons/fa6";
import { Link } from "react-router-dom";

const BuyMembership = () => {
  return (
    <div>
      <section className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-xl my-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4 text-yellow-800">
          <FaCrown className="text-3xl" />
          <div>
            <h2 className="text-xl font-bold">Want to Post More?</h2>
            <p className="text-sm">
              Free users can post up to 5 times. Unlock unlimited posts and more
              by becoming a premium member!
            </p>
          </div>
        </div>
        <Link
          to="/membership"
          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
        >
          Buy Membership
          <FaCrown className="text-lg" />
        </Link>
      </section>
    </div>
  );
};

export default BuyMembership;
