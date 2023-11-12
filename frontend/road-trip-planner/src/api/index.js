import axios from 'axios';

export const getPlacesData = async (type, sw, ne) => {
	try {
		const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary`, {
			params: {
				bl_latitude: sw.lat,
				bl_longitude: sw.lng,
				tr_longitude: ne.lng,
				tr_latitude: ne.lat,
			},
			headers: {
				'X-RapidAPI-Key': 'c54d633b11msh48f2dd5d257b911p12f331jsn8aae1285376c',
				'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
			}
		});
		// console.log(bounds)
		return data;
	} catch (error) {
		console.log(error)
	}
}