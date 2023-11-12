// StopLocationTable.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faCoffee, faGlassCheers, faHamburger, faPizzaSlice, faDumbbell, faGasPump } from "@fortawesome/free-solid-svg-icons";

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
  return (
    <div>
      <h2>Stop Locations</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Address</th>
            <th>Parking Spot count</th>
            <th>Added Time (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {stopLocations.map((location) => (
            <tr key={location.id}>
              <td>
                {getIcon(location.type) && (
                  <FontAwesomeIcon icon={getIcon(location.type)} style={{ marginRight: "5px" }} />
                )}
                {/* {location.type} */}
              </td>
              <td>{location.name}</td>
              <td>{location.address}</td>
              <td>{location.parkCount} slots</td>
              <td>{location.addedTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StopLocationTable;
