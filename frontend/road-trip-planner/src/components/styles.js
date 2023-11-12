import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
	paper: {
		padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px', zIndex: '11111111', height: '100%'
	},
	mapContainer: {
		height: '90%', width: '200%',
	},
	markerContainer: {
		position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
	},
	pointer: {
		cursor: 'pointer',
	},
}));