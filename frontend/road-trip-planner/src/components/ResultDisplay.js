// ResultDisplay.js
import React from "react";

const ResultDisplay = ({ resultObject }) => {
  return (
    <div>
      <h2>Result</h2>
      <pre>{JSON.stringify(resultObject, null, 2)}</pre>
    </div>
  );
};

export default ResultDisplay;
