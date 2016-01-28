function resizeMap(){window.innerHeight<600?$("#map_container").css("height",window.innerHeight-100+"px"):$("#map_container").css("height","600px")}var map=new L.Map("map",{center:new L.LatLng(52.5047,13.4244),zoom:11,attributionControl:!1,maxZoom:18,minZoom:11,maxBounds:L.latLngBounds(L.latLng(52.3642,13.0928),L.latLng(52.6605,13.7565))}).on("click",function(){map.scrollWheelZoom.enable()}),speedmap=new L.TileLayer("http://tiles.sebastianmeier.eu/v2/tiles/fullimage/{z}/{x}/{y}.png").addTo(map),styles=[{featureType:"all",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"transit.line",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit.station",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#111111"}]}],streets=new L.Google("ROADMAP",{mapOptions:{styles:styles}});map.addLayer(streets);var satellite=new L.Google("SATELLITE",{});map.addLayer(satellite);var brainLayer=L.layerGroup(),brainToggle=!0,brainControl=L.Control.extend({options:{position:"topright"},onAdd:function(e){var t=L.DomUtil.create("div","leaflet-brain-btn leaflet-bar leaflet-control leaflet-control-custom");return t.style.backgroundColor="white",t.style.width="30px",t.style.height="30px",t.onclick=function(){brainToggle?e.addLayer(brainLayer):e.removeLayer(brainLayer),brainToggle=!brainToggle},t}});map.addControl(new brainControl);var brainConnections=[[1,37,44],[1,44,27],[1,27,62],[1,62,50],[1,62,47],[1,47,60],[1,47,33],[1,60,33],[1,50,45],[1,50,35],[1,35,51],[1,51,24],[1,35,52],[1,52,53],[1,24,58],[1,58,57],[1,58,60],[1,57,38],[1,48,60],[1,48,49],[1,57,61],[1,49,41],[1,41,59],[1,59,21],[1,21,63],[1,21,63],[1,61,63],[1,56,63],[1,56,55],[1,55,54],[1,55,54],[1,54,58],[1,52,64],[1,64,24]];d3.csv("data/brain.csv",function(e,t){brainConnections.forEach(function(e,o){brainLayer.addLayer(L.polyline([new L.LatLng(t[e[1]-1].latitude,t[e[1]-1].longitude),new L.LatLng(t[e[2]-1].latitude,t[e[2]-1].longitude)],{color:"#ffffff",weight:3}))}),t.forEach(function(e,t){brainLayer.addLayer(L.circleMarker(new L.LatLng(e.latitude,e.longitude),{radius:3*e.type,color:"#000000",fillColor:"#ffffff",weight:1,fillOpacity:1,opacity:1,title:e.name}).on("mouseover",function(e){tooltip.content(this.options.title);var t=$(this._container).offset();tooltip.position([t.left+this.options.radius,t.top+this.options.radius]),tooltip.show()}).on("mouseout",function(e){tooltip.hide()}))})});