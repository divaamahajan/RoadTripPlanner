// UserLocation.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationForm from "./LocationForm";
import StopLocationTable from "./StopLocationTable";

const UserLocation = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [stopAfterMinutes, setStopAfterMinutes] = useState("");
  const [resultObject, setResultObject] = useState({});
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stopLocation, setStopLocation] = useState({ data: [] });

  const geocodeLocation = async (location) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
      )}&format=json`
    );

    return response.data && response.data.length > 0 ? response.data[0] : null;
  };

  const calculateCoordinates = async () => {
    let startLat, startLon, destLat, destLon;

    const startResponse = await geocodeLocation(startLocation);
    const destResponse = await geocodeLocation(destination);

    if (startResponse) {
      ({ lat: startLat, lon: startLon } = startResponse);
      console.log("Start Location Coordinates:", [startLat, startLon]);
    }

    if (destResponse) {
      ({ lat: destLat, lon: destLon } = destResponse);
      console.log("Destination Coordinates:", [destLat, destLon]);

      const resultObject = {
        // data: {
          // start: [startLat, startLon],
          // dest: [destLat, destLon],
          start: [parseFloat(startLat), parseFloat(startLon)],
          dest: [parseFloat(destLat), parseFloat(destLon)],
          stopAfter: stopAfterMinutes
        // },
      };

      console.log("Result Object:", resultObject);
      setResultObject(resultObject);

      return resultObject;
    }

    return null;
  };

  const handleSubmit = async () => {
    try {
      const resultObject = await calculateCoordinates();
      console.log("resultObject", resultObject);

      if (resultObject) {
        const apiUrl = "/api/set_trip";
        console.log("Posting result object to", apiUrl);
        await axios.post(apiUrl, resultObject);
        console.log("Result object posted successfully!");

        console.log("Getting stops");
        const response = await axios.get("/api/stops");
        console.log("Stops received response.data", response.data);
        setStopLocation(response.data);
        setStopsFetched(true);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          maxWidth: "400px",
          margin: "20px auto",
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
      </div>
      {stopsFetched && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            maxWidth: "800px",
            margin: "20px auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <StopLocationTable stopLocations={stopLocation.data} />
        </div>
      )}
    </div>
  );
};

export default UserLocation;
