'use client'
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
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useRef } from 'react'



const center = { lat: 48.8584, lng: 2.294 }



function Map() {
	const [map, setMap] = useState(/**@type google.maps.Map*/(null));
	const [directionsResponse, setDirectionsResponse] = useState(null);
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef()
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destinationRef = useRef()

	const { isLoaded } = useJsApiLoader({

		libraries: ['places'],
	})
	if (!isLoaded) {
		return <SkeletonText />
	}

	async function calculateRoute() {
		if (originRef.current.value === '' || destinationRef.current.value === '') {
			return
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()
		const results = await directionsService.route({
			origin: originRef.current.value,
			destination: destinationRef.current.value,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)
	}

	function clearRoute() {
		setDirectionsResponse(null)
		setDistance('')
		setDuration('')
		originRef.current.value = ''
		destinationRef.current.value = ''
	}

	return (
		<Flex
			position='relative'
			flexDirection='column'
			alignItems='center'
			bgColor='blue.200'
			h='100vh'
			w='100vw'
		>
			<Box position='absolute' left={0} top={0} h='100%' w='100%'>
				{ }
				<GoogleMap
					center={center}
					zoom={10}
					mapContainerStyle={{ width: '100%', height: '100%' }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false
					}}
					onLoad={(map) => setMap(map)}
				>
					<Marker position={center} />
					{directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
				</GoogleMap>
			</Box>

			<Box
				p={4}
				borderRadius='lg'
				mt={4}
				bgColor='black'
				shadow='base'
				minW='container.md'
				zIndex='11111111111'
				textColor='red'
			>
				<HStack spacing={4} >
					<Autocomplete>
						<Input type='text' placeholder='Origin' ref={originRef} />
					</Autocomplete>
					<Autocomplete>
						<Input type='text' placeholder='Destination' ref={destinationRef} />
					</Autocomplete>


					<ButtonGroup>
						<Button colorScheme='pink' type='submit' onClick={calculateRoute}>
							Calculate Route
						</Button>
						<IconButton
							aria-label='center back'
							icon={<FaTimes />}
							onClick={clearRoute}
						/>
					</ButtonGroup>
				</HStack>
				<HStack spacing={4} mt={4} justifyContent='space-between'>
					<Text>Distance:{distance} </Text>
					<Text>Duration: {duration} </Text>
					<IconButton
						aria-label='center back'
						icon={<FaLocationArrow />}
						isRound
						onClick={() => map.panTo(center)}
					/>
				</HStack>
			</Box>
		</Flex>
	)
}

export default Map
