// LocationForm.js
import React from "react";

const LocationForm = ({
  startLocation,
  setStartLocation,
  destination,
  setDestination,
  stopAfterMinutes,
  setStopAfterMinutes,
  handleSubmit,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Start Location:
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Destination:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Stop After Minutes:
          <input
            type="number"
            value={stopAfterMinutes}
            onChange={(e) => setStopAfterMinutes(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default LocationForm;
