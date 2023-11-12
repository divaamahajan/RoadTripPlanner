import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faGasPump } from "@fortawesome/free-solid-svg-icons";

const getIcon = (type) => {
  switch (type) {
    case "restro":
      return faUtensils;
    case "parking":
      return faGasPump;
    default:
      return null;
  }
};

const StopLocationTable = ({ stopLocations, onAddStops, stopAfterMinutes }) => {
  const [selectedRestros, setSelectedRestros] = useState({});
  const stopAfterMinutesInt = parseInt(stopAfterMinutes, 10);

  const handleRestroSelection = (stopId, restroId) => {
    let parkingNames = [];
    // Find the stop in stopLocations based on stopId
    const selectedStop = stopLocations.find((stop) => stop.stop_id === stopId);
    console.log("trial", selectedStop);
    if (selectedStop) {
      // Extract parking names from the selected stop
      parkingNames = selectedStop.parking.map((park) => park.name);
    }
    console.log("parkingNames", parkingNames);
    // Update selectedRestros with the parking names
    setSelectedRestros((prevSelectedRestros) => ({
      ...prevSelectedRestros,
      [stopId]: {
        restroId,
        parkingNames,
      },
    }));
  };

  const selectedRows = [];

  const handleAddStops = () => {
    // Send the list of selected rows back to the parent component
    onAddStops(selectedRows);
    console.log("insidetable", selectedRows);
  };

  return (
    <div>
      {/* Add Stops button */}
      <button onClick={handleAddStops}>Add Stops</button>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {stopLocations.map((stop, index) => (
          <div key={stop.stop_id}>
            <h3>
              Stop {index + 1}: after{" "}
              <strong>{(index + 1) * stopAfterMinutesInt}</strong> minutes
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Type
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Display restaurant information with radio buttons */}
                {stop.restro.map((restro) => {
                  const isSelected =
                    selectedRestros[stop.stop_id]?.restroId === restro.id;

                  if (isSelected) {
                    selectedRows.push({
                      ...restro,
                      type: "restro",
                      parkingNames: selectedRestros[stop.stop_id].parkingNames,
                    });
                  }
                  return (
                    <tr
                      key={restro.id}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td
                        style={{
                          borderRight: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        <input
                          type="radio"
                          name={`restro_${stop.stop_id}`}
                          value={restro.id}
                          checked={isSelected}
                          onChange={() =>
                            handleRestroSelection(stop.stop_id, restro.id)
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={getIcon("restro")}
                          style={{ marginRight: "5px" }}
                        />
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {restro.Name}
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {restro.address}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        {/* Display the selected rows
      <div>
        <h3>Selected Rows:</h3>
        <ul>
          {selectedRows.map((row, index) => (
            <li key={index}>{JSON.stringify(row)}</li>
          ))}
        </ul>
      </div> */}
      </div>
    </div>
  );
};

export default StopLocationTable;
