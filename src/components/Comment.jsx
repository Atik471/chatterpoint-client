import PropTypes from "prop-types";

const Comment = ({ comment }) => {

  return (
    <div className="w-full pb-8">
      <div className="flex items-start gap-4">
        <img
          src={comment?.photoURL || "/assets/pfp.png"}
          alt={comment?.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col ">
            <h1 className="font-bold">{comment?.name}</h1>
            <p className="text-gray-400 text-sm">{comment.date}</p>
        </div>
      </div>
      <p className="ml-14 mt-2">{comment.comment}</p>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;
