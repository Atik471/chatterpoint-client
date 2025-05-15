import { Link } from "react-router-dom";

const FAQ = () => {
    return (
        <div>
            <section className="my-12 px-4 md:px-12 max-w-5xl mx-auto">
  <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

  <div className="space-y-6">
    <div className="dark:bg-gray-900 border-l-4 border-blue-600 shadow p-5 rounded-md">
      <h3 className="font-semibold text-lg text-blue-700 mb-2">What is ChatterPoint?</h3>
      <p className="text-gray-300">
        ChatterPoint is a social media platform tailored for developers to share thoughts, resources, projects, and connect with like-minded tech enthusiasts.
      </p>
    </div>

    <div className="dark:bg-gray-900 border-l-4 border-blue-600 shadow p-5 rounded-md">
      <h3 className="font-semibold text-lg text-blue-700 mb-2">Is ChatterPoint free to use?</h3>
      <p className="text-gray-300">
        Yes, ChatterPoint is free for all users. However, there is a limit of 5 posts for free members. Premium members can unlock unlimited posting and more!
      </p>
    </div>

    <div className="dark:bg-gray-900 border-l-4 border-blue-600 shadow p-5 rounded-md">
      <h3 className="font-semibold text-lg text-blue-700 mb-2">How do I add my first post?</h3>
      <p className="text-gray-300">
        Simply go to the dashboard and click “Add Post”, or use the{" "}
        <Link to="/dashboard/add-post" className="text-blue-600 underline font-medium">
          Add Post
        </Link>{" "}
        page directly.
      </p>
    </div>

    <div className="dark:bg-gray-900 border-l-4 border-blue-600 shadow p-5 rounded-md">
      <h3 className="font-semibold text-lg text-blue-700 mb-2">Can I share code snippets or links?</h3>
      <p className="text-gray-300">
        Absolutely! ChatterPoint is built for developers — feel free to share GitHub repos, code snippets, dev blogs, tutorials, and more.
      </p>
    </div>

    <div className="dark:bg-gray-900 border-l-4 border-blue-600 shadow p-5 rounded-md">
      <h3 className="font-semibold text-lg text-blue-700 mb-2">Where can I upgrade to premium?</h3>
      <p className="text-gray-300">
        Visit the{" "}
        <Link to="/membership" className="text-blue-600 underline font-medium">
          Membership
        </Link>{" "}
        page to explore our plans and benefits.
      </p>
    </div>
  </div>
</section>

        </div>
    );
};

export default FAQ;