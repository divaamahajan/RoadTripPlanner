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
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}
        >
          Start Location:
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "300px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}
        >
          Destination:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "300px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}
        >
          Stop After Minutes:
          <input
            type="number"
            value={stopAfterMinutes}
            onChange={(e) => setStopAfterMinutes(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "300px",
            }}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "15px 30px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default LocationForm;
