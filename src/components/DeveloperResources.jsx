const DeveloperResources = () => {
  return (
    <section className="bg-white dark:bg-gray-900 mt-12 py-10 px-6 md:px-16 rounded-2xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          🧰 Developer Resources
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto">
          Curated tools, platforms, and documentation every developer should know. Boost your productivity and stay
          up-to-date.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">📘 MDN Web Docs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive documentation for HTML, CSS, and JavaScript.
            </p>
            <a
              href="https://developer.mozilla.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Visit MDN →
            </a>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">📦 NPM Trends</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Compare download trends of popular NPM packages.
            </p>
            <a
              href="https://www.npmtrends.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Explore Trends →
            </a>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">📚 FreeCodeCamp</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Learn to code for free with interactive lessons and projects.
            </p>
            <a
              href="https://www.freecodecamp.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Start Learning →
            </a>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">🧠 DevDocs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Fast, offline access to API documentation for over 100+ tools.
            </p>
            <a
              href="https://devdocs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Browse Docs →
            </a>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">🧪 CodeSandbox</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              A powerful online code editor for rapid prototyping.
            </p>
            <a
              href="https://codesandbox.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Try It Out →
            </a>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">🛠 GitHub CLI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Work with GitHub from the command line. Supercharge your dev flow.
            </p>
            <a
              href="https://cli.github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block"
            >
              Install CLI →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperResources;
