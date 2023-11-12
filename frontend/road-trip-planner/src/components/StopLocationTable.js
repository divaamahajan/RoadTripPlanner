// StopLocationTable.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCoffee,
  faGlassCheers,
  faHamburger,
  faPizzaSlice,
  faDumbbell,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";

const getIcon = (type) => {
  switch (type) {
    case "restro":
      return faUtensils;
    case "cafe":
      return faCoffee;
    case "bar":
      return faGlassCheers;
    case "fast food":
      return faHamburger;
    case "pizza":
      return faPizzaSlice;
    case "diner":
      return faDumbbell;
    case "gas station":
      return faGasPump;
    default:
      return null;
  }
};
const StopLocationTable = ({ stopLocations }) => {
  const [selectedRestro, setSelectedRestro] = useState(null);
  return (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <h2>Stop Locations</h2>
      {stopLocations.map((stop) => (
        <div key={stop.stop_id}>
          <h3>Stop ID: {stop.stop_id}</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Address</th>
              </tr>
            </thead>
            <tbody>
              {/* Display parking information */}
              {/* {stop.parking.map((park) => (
                <tr key={park.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    <FontAwesomeIcon
                      icon={faGasPump} // Assuming gas pump icon for parking, change as needed
                      style={{ marginRight: "5px" }}
                    />
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {park.name}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {park.location.join(', ')}
                  </td>
                </tr>
              ))} */}
              {/* Display restaurant information with radio buttons */}
              {stop.restro.map((restro) => (
                <tr key={restro.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {getIcon("restro") && (
                      <FontAwesomeIcon
                        icon={getIcon("restro")}
                        style={{ marginRight: "5px" }}
                      />
                    )}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {restro.Name}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {restro.address}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {/* Radio button for selecting the restaurant */}
                    <input
                      type="radio"
                      name={`restro_${stop.stop_id}`}
                      value={restro.id}
                      onChange={() => setSelectedRestro(restro.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default StopLocationTable;