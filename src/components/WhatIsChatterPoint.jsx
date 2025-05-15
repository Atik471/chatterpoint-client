const WhatIsChatterPoint = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12 px-6 md:px-16 rounded-2xl shadow-sm mt-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          What is ChatterPoint?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          <span className="font-semibold text-blue-600">ChatterPoint</span> is a developer-centric social platform
          built to foster collaboration, sharing, and growth. Whether you are looking to showcase a project, ask for
          help, find collaborators, or just share ideas, ChatterPoint is your digital hub.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">💬 Developer Feeds</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Post updates, questions, code snippets, or opinions. Engage in discussions that matter to devs.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">🚀 Project Showcases</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Highlight your side projects or open source tools. Get feedback and contributors.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">📚 Knowledge Sharing</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Write about your learnings, discoveries, or challenges. Help the community grow.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsChatterPoint;
