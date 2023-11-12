// UserLocation.js
"use client";

import React, { useState } from "react";
import axios from "axios";
import LocationForm from "./LocationForm";
import ResultDisplay from "./ResultDisplay";
import StopLocationTable from "./StopLocationTable";
import { stopLocation } from "./stopLocation";

const UserLocation = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [stopAfterMinutes, setStopAfterMinutes] = useState("");
  const [resultObject, setResultObject] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async () => {
    let startLat, startLon, destLat, destLon; // Declare variables here

    try {
      // Geocode start location
      const startResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          startLocation
        )}&format=json`
      );

      if (startResponse.data && startResponse.data.length > 0) {
        // Assign values to variables
        ({ lat: startLat, lon: startLon } = startResponse.data[0]);
        console.log("Start Location Coordinates:", [startLat, startLon]);
      }

      // Geocode destination
      const destinationResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          destination
        )}&format=json`
      );

      if (destinationResponse.data && destinationResponse.data.length > 0) {
        // Assign values to variables
        ({ lat: destLat, lon: destLon } = destinationResponse.data[0]);
        console.log("Destination Coordinates:", [destLat, destLon]);

        // Set the object with the data structure
        const resultObject = {
          data: {
            start: [parseFloat(startLat), parseFloat(startLon)],
            dest: [parseFloat(destLat), parseFloat(destLon)],
            stopAfter: stopAfterMinutes,
          },
        };

        console.log("Result Object:", resultObject);
        setFormSubmitted(true);

        // Post the result object to the specified URL
        const apiUrl = "http://54.237.215.115:5000/input";
        console.log("hello");
        await axios.post(apiUrl, resultObject);
        console.log("Result object posted successfully!");
        // Update result object state
        setResultObject(resultObject);
      }

      // Additional logic for calculating coordinates based on user inputs
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error (network, timeout, etc.)
        console.error("Axios Error:", error.message);
      } else {
        // Other types of errors
        console.error("Error geocoding:", error);
      }
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}>
        Choose User Locations
      </h1>
      <LocationForm
        startLocation={startLocation}
        setStartLocation={setStartLocation}
        destination={destination}
        setDestination={setDestination}
        stopAfterMinutes={stopAfterMinutes}
        setStopAfterMinutes={setStopAfterMinutes}
        handleSubmit={handleSubmit}
      />
      {/* <ResultDisplay resultObject={resultObject} /> */}
      {formSubmitted && <StopLocationTable stopLocations={stopLocation.data} />}
    </div>
  );
};

export default UserLocation;
