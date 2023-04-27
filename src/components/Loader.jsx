import { useState, useEffect } from "react";
import { Puff } from "react-loader-spinner";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    showLoader && (
      <div className="flex justify-center mt-8">
        <Puff size={60} color="#36d7b7" />
      </div>
    )
  );
};

export default Loader;
