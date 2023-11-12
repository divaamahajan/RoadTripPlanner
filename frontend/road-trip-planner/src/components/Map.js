"use client";
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
} from "@react-google-maps/api";
import { useState, useRef } from "react";

const center = { lat: 37.6192, lng: -122.3816 };

function Map() {
  const [map, setMap] = useState(/**@type google.maps.Map*/ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [stopAfterMinutes, setStopAfterMinutes] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stopLocation, setStopLocation] = useState({ data: [] });

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
        start: [parseFloat(startLat), parseFloat(startLon)],
        dest: [parseFloat(destLat), parseFloat(destLon)],
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
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);

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
  }

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
        {}
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
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="black"
        shadow="base"
        minW="container.md"
        zIndex="11111111111"
        textColor="red"
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Origin"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              ref={originRef}
            />
          </Autocomplete>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              ref={destinationRef}
            />
          </Autocomplete>
          <Input
            type="number"
            value={stopAfterMinutes}
            placeholder="stop after (mins)"
            onChange={(e) => setStopAfterMinutes(e.target.value)}
          />

          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
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
        {/* <StopLocationTable stopLocations={stopLocation.data} /> */}
      </Box>
    </Flex>
  );
}

export default Map;
