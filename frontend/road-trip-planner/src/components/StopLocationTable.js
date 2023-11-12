// StopLocationTable.js
import React from "react";
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
    case "restaurant":
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
  // Sort the stopLocations by added time
  const sortedStopLocations = stopLocations.sort(
    (a, b) => a.addedTime - b.addedTime
  );

  return (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <h2>Stop Locations</h2>
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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Address
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Parking Spot count
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Added Time (minutes)
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStopLocations.map((location) => (
            <tr key={location.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                {getIcon(location.type) && (
                  <FontAwesomeIcon
                    icon={getIcon(location.type)}
                    style={{ marginRight: "5px" }}
                  />
                )}
              </td>
              <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                {location.name}
              </td>
              <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                {location.address}
              </td>
              <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                {location.parkCount} slots
              </td>
              <td style={{ padding: "8px" }}>{location.addedTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StopLocationTable;
