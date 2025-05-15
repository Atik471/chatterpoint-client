import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dark:bg-gray-800 text-white py-6 mt-10 px-[5%]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 text-center md:text-left px-4">
          
          <div>
            <h2 className="text-2xl font-bold">ChatterPoint</h2>
            <p className="mt-2 text-gray-400">Connect, Share, and Engage with the world.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link to="/membership" className="hover:text-gray-300">Membership</Link></li>
              <li><Link to="/dashboard/my-profile" className="hover:text-gray-300">My Profile</Link></li>
              <li><Link to="/dashboard/add-post" className="hover:text-gray-300">Create Post</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-6 border-t border-gray-700 pt-4 text-gray-400 text-sm">
          © {new Date().getFullYear()} ChatterPoint. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
