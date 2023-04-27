import PropTypes from "prop-types";

const Error = ({ error, message }) => {
  if (!error) {
    return null;
  }
  return (
    <div className="text-rose-900 font-bold text-center mt-8 text-lg">
      {message}
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
};

export default Error;
