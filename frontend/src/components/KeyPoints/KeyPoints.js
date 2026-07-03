import React from "react";

const KeyPoints = ({ keyPoints, loading }) => {
  if (loading) return <p>Generating...</p>;

  return (
    <div>
      <h2>Generated Key Points</h2>
      <ul>
        {keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default KeyPoints;
