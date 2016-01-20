/*global tooltip:false,L:false,d3:false,console:false */
/*jshint unused:false*/

var map = new L.Map('map', {
	center: new L.LatLng(52.5047, 13.4244), 
	zoom: 11,
	maxZoom:18,
	minZoom:11,
	maxBounds:L.latLngBounds(
		L.latLng(52.3642, 13.0928),
		L.latLng(52.6605, 13.7565)
	)
}).on('click', function() { 
	map.scrollWheelZoom.enable();
});

var speedmap = new L.TileLayer('http://tiles.sebastianmeier.eu/v2/tiles/fullimage/{z}/{x}/{y}.png').addTo(map);

var styles = [
  {
  	featureType:"all",
    elementType: "geometry",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "transit.line",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "transit.station",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },{
  	featureType:"all",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#ffffff" }
    ]
  },{
  	featureType:"all",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#111111" }
    ]
  }
];

var streets = new L.Google('ROADMAP', {
	mapOptions: {
		styles: styles
	}
});

map.addLayer(streets);

var satellite = new L.Google('SATELLITE', {});
map.addLayer(satellite);

var brainLayer = L.layerGroup().addTo(map);
var brainToggle = false;

var brainControl = L.Control.extend({
	options: {
		position: 'topright' 
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-brain-btn leaflet-bar leaflet-control leaflet-control-custom');

		container.style.backgroundColor = 'white';
		container.style.width = '30px';
		container.style.height = '30px';

		container.onclick = function(){
			if(!brainToggle) {
				map.removeLayer(brainLayer);
			} else {
				map.addLayer(brainLayer);
			}
			brainToggle = !brainToggle;
		};

		return container;
	}
});

map.addControl(new brainControl());

var brainConnections = [
	[1,37,44],
	[1,44,27],
	[1,27,62],
	[1,62,50],
	[1,62,47],
	[1,47,60],
	[1,47,33],
	[1,60,33],
	[1,50,45],
	[1,50,35],
	[1,35,51],
	[1,51,24],
	[1,35,52],
	[1,52,53],
	[1,24,58],
	[1,58,57],
	[1,58,60],
	[1,57,38],
	[1,48,60],
	[1,48,49],
	[1,57,61],
	[1,49,41],
	[1,41,59],
	[1,59,21],
	[1,21,63],
	[1,21,63],
	[1,61,63],
	[1,56,63],
	[1,56,55],
	[1,55,54],
	[1,55,54],
	[1,54,58],
	[1,52,64],
	[1,64,24]
];

d3.csv('data/brain.csv', function(err, data){
	brainConnections.forEach(function(d,i){
		brainLayer.addLayer(
			L.polyline(
				[
					new L.LatLng(data[(d[1]-1)].latitude, data[(d[1]-1)].longitude),
					new L.LatLng(data[(d[2]-1)].latitude, data[(d[2]-1)].longitude)
				],
				{
					color: '#ffffff',
					weight:3
				}
			)
		);
	});

	data.forEach(function(d,i){
		brainLayer.addLayer(
			L.circleMarker(
				new L.LatLng(d.latitude, d.longitude),
				{
					radius:d.type*3,
					color:'#ffffff',
    				fillColor:'#ffffff',
    				weight:1,
    				fillOpacity:1,
    				opacity:0,
    				title:d.name
				}
			).on('mouseover', function (e) {
				tooltip.content(this.options.title);
				var p = $(this._container).offset();
				tooltip.position([(p.left+(this.options.radius)), (p.top+(this.options.radius))]);
				tooltip.show();
        	}).on('mouseout', function (e) {
            	tooltip.hide();
        	})
		);
	});
});

$('.leaflet-google-layer').css('z-index', '2 !important');
$('.leaflet-google-layer').first().css('z-index', '0 !important');
