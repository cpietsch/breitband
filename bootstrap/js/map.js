mapboxgl.accessToken = 'pk.eyJ1IjoianVsaTg0IiwiYSI6Ik1Lc3pjRlUifQ.qIV8aKI8gqySeJOV0GwYiw';
var map = new mapboxgl.Map({
	container: 'map',
	center: [13.4244, 52.5047],
	zoom: 10,
	maxZoom:16,
	minZoom:10,
	style: 'js/map_config_mapbox_only_full.json'
}).on('click', 
	function(e){
		mapEnable();
	}
);

function mapDisable(){
	//map.scrollWheelZoom.disable();
	mapStatus = true;
}

mapDisable();

function mapEnable(){
	if(!mapStatus){
		//map.scrollWheelZoom.enable();
	}
}

var mapStatus = false;

//Add Geocoder Search Box
//map.addControl(new mapboxgl.Geocoder({keepOpen: true, label:'Suche'}));
//Change the placeholder to german
//d3.select('.mapboxgl-ctrl-geocoder input').attr('placeholder', 'Suche');