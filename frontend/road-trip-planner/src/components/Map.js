"use client";
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';
import useStyles from './styles';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import axios from "axios";
import StopLocationTable from "./StopLocationTable";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow
} from "@react-google-maps/api";
import { useState, useRef } from "react";

const center = { lat: 37.778828144073486, lng: -122.40001201629639 };

function Map() {
  const classes = useStyles();
  const [map, setMap] = useState(/**@type google.maps.Map*/(null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [stopAfterMinutes, setStopAfterMinutes] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stopLocation, setStopLocation] = useState({ data: [] });
  const [points, setPoints] = useState({});
  const [marker, setMarker] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  // Function to handle selected rows from StopLocationTable
  const handleAddStops = (rows) => {
    // Modify location format for each row
    const modifiedRows = rows.map((row) => {
      const [lat, lng] = row.location;
      return {
        ...row,
        location: { lat, lng },
      };
    });

    console.log(modifiedRows);
    setSelectedRows(modifiedRows);
    console.log(selectedRows);
  };

  const [resultObject, setResultObject] = useState({});
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB7wBnq12Snk9vf_pdNB1EAm10Yls2FoKQ",
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <SkeletonText />;
  }
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
        start: [startLat, startLon],
        dest: [destLat, destLon],
        stopAfter: stopAfterMinutes,
        // },
      };

      console.log("Result Object:", resultObject);
      setResultObject(resultObject);

      return resultObject;
    }

    return null;
  };

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(
      "results-main",
      results.geocoded_waypoints.map((i) => i.place_id)
    );

    const geocoder = new google.maps.Geocoder();
    const placeId = results.geocoded_waypoints.map((i) => i.place_id);
    console.log("PlaceID", placeId[0], placeId[1]);

    let start = [];
    function SgeocodePlaceId() {
      geocoder
        .geocode({ placeId: String(placeId[0]) })
        .then(({ results }) => {
          if (results[0]) {
            const location = results[0].geometry.location;
            console.log("SLatitude: " + location.lat());
            console.log("SLongitude: " + location.lng());
            setStartLocation([location.lat(), location.lng()]);
            console.log(setStartLocation);
            start = [Number(location.lat()), Number(location.lng())];
          } else {
            console.log("No results found");
          }
        })
        .catch((e) => console.log("Geocoder failed due to: " + e));
    }

    let dest = [];
    function DgeocodePlaceId() {
      geocoder
        .geocode({ placeId: String(placeId[1]) })
        .then(({ results }) => {
          if (results[0]) {
            const location = results[0].geometry.location;
            console.log("DLatitude: " + location.lat());
            console.log("DLongitude: " + location.lng());
            setDestination([location.lat(), location.lng()]);
            dest = [Number(location.lat()), Number(location.lng())];
            console.log("dest", dest);
            console.log(setDestination);
            return dest;
          } else {
            console.log("No results found");
          }
        })
        .catch((e) => console.log("Geocoder failed due to: " + e));
    }

    start = SgeocodePlaceId();
    dest = DgeocodePlaceId();

    const dummy = { start, dest };
    console.log("dummy", dummy);

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);

    try {
      const resultObject = await calculateCoordinates();
      if (resultObject) {
        const apiUrl = "/api/set_trip";
        console.log("Posting result object to", apiUrl);
        const resp = await axios.post(apiUrl, resultObject);
        console.log("Result object posted successfully!", resp.data);
        console.log("Getting stops");
        const response = await axios.get("/api/stops");
        setPoints(response.data);
        console.log("Stops received response.data", response.data);
        setStopLocation(response.data);
        setStopsFetched(true);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }

  console.log("points", points);

  const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  };

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      bgColor="blue.200"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        { }
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          {selectedRows.map((stop) => (
            // <Marker
            //   position={stop.location} 
            // />

            <InfoWindow position={stop.location} style={{ width: '10px' }}>
              <div style={{ textAlign: 'center', padding: '5px', color: 'black' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>
                  {stop.Name}
                </h2>
                <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>{stop.address}</p>
                <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>
                  Parking Available
                </h3>
                {stop.parkingNames.map((parkingName, index) => (
                  <p key={index} style={{ fontSize: '0.8rem', marginBottom: '2px' }}>
                    {parkingName}
                  </p>
                ))}
              </div>
            </InfoWindow>


          ))}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white" // Set background color to white
        shadow="base"
        minW="container.md"
        zIndex="11111111111"
        textColor="#867e7c"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        border="2px solid grey"// Set text color to your preferred color
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Origin"
              // value={startLocation}
              // onChange={(e) => setStartLocation(e.target.value)}
              ref={originRef}
              border="1px solid #D94E28" // Add a border to the input field
              borderRadius="md"
              p={2}
            />
          </Autocomplete>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Destination"
              // value={destination}
              // onChange={(e) => setDestination(e.target.value)}
              ref={destinationRef}
              border="1px solid #D94E28" // Add a border to the input field
              borderRadius="md"
              p={2}
            />
          </Autocomplete>
          <Input
            type="number"
            value={stopAfterMinutes}
            placeholder="stop after (mins)"
            onChange={(e) => setStopAfterMinutes(e.target.value)}
            border="1px solid #D94E28" // Add a border to the input field
            borderRadius="md"
            p={2}
          />

          <ButtonGroup>

            <Button
              colorScheme="orange" // Change color scheme to orange
              type="submit"
              onClick={calculateRoute}
              bgColor="#D94E28"
              _hover={{ bgColor: '#867e7c' }} // Change hover color
              color="white" // Set text color to white
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)" // Add a button shadow
              textAlign="center" // Center the text within the button
              padding="8px 16px" // Add padding from the button border
              borderRadius="md" // Add border radius
            >
              {/* <Button colorScheme="orange" type="submit" onClick={calculateRoute} bgColor="#D94E28"> Use #D94E28 for button color */}
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance:{distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
        <StopLocationTable
          stopLocations={stopLocation.data}
          onAddStops={handleAddStops}
          stopAfterMinutes={stopAfterMinutes}
        />

      </Box>
    </Flex >
  );
}

export default Map;
