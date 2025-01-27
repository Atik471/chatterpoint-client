import PropTypes from "prop-types";

const Announcement = ({ announcement }) => {
  return (
    <div>
      <div className="cursor-pointer border-b-2 border-gray-800 py-5 px-1">
        <div className="flex items-start gap-4">
          <img
            src={announcement?.photoURL || "/assets/pfp.png"}
            alt={announcement?.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h1 className="font-bold text-sm">{announcement?.name}</h1>
            <div>
              <p className="text-sm text-gray-400">{announcement?.date}</p>
            </div>
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-lg font-semibold my-2">{announcement?.title}</h3>
        </div>

        <p>{announcement?.description}</p>
      </div>
    </div>
  );
};

Announcement.propTypes = {
  announcement: PropTypes.object,
};

export default Announcement;
