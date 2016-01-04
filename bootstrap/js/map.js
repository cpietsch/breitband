mapboxgl.accessToken = 'pk.eyJ1IjoianVsaTg0IiwiYSI6Ik1Lc3pjRlUifQ.qIV8aKI8gqySeJOV0GwYiw';
var map = new mapboxgl.Map({
	container: 'map',
	center: [13.4244, 52.5047],
	zoom: 7,
	maxZoom:17,
	maxBounds:[[13.0883536782043,52.3382388102358],[13.761131111581,52.6755085785852]],
	style: 'js/map_config.json'
});

//Add Geocoder Search Box
map.addControl(new mapboxgl.Geocoder({keepOpen: true, label:'Suche'}));
//Change the placeholder to german
d3.select('.mapboxgl-ctrl-geocoder input').attr('placeholder', 'Suche');