import React from "react";

const ProgressBar = ({ current, total }) => {
  const percentage = Math.round(((current - 1) / total) * 100);

  return (
    <div className="progress-container">
      <span>
        {current - 1} / {total}
      </span>
      <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;
