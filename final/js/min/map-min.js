function stateMap(){function e(){}var t=!1,n;return e.resize=function(){t&&(t.remove(),$("#map *").remove()),window.innerHeight/2<600?$("#map_container").css("height",window.innerHeight/2+"px"):$("#map_container").css("height","600px"),e.build()},e.init=function(){e.resize()},e.build=function(){t=new L.Map("map",{center:new L.LatLng(52.5047,13.4244),zoom:11,attributionControl:!1,maxZoom:18,minZoom:11,maxBounds:L.latLngBounds(L.latLng(52.3642,13.0928),L.latLng(52.6605,13.7565))}).on("click",function(){t.scrollWheelZoom.enable()});var e=new L.TileLayer("http://tiles.sebastianmeier.eu/v2/tiles/fullimage/{z}/{x}/{y}.png").addTo(t),o=[{featureType:"all",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"transit.line",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit.station",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#111111"}]}],i=new L.Google("ROADMAP",{mapOptions:{styles:o}});t.addLayer(i);var l=new L.Google("SATELLITE",{});t.addLayer(l);var a=L.layerGroup(),r=!0,s=L.Control.extend({options:{position:"topright"},onAdd:function(e){var t=L.DomUtil.create("div","leaflet-brain-btn leaflet-bar leaflet-control leaflet-control-custom");return t.onclick=function(){e.removeControl(n),r?e.addLayer(a):e.removeLayer(a),r=!r},t}});t.addControl(new s);var f=L.Control.extend({options:{position:"bottomright"},onAdd:function(e){var t=L.DomUtil.create("div","leaflet-info-btn leaflet-bar leaflet-control leaflet-control-custom");return t.innerHTML='<div id="map_info" class="red company-help"><strong>Berlin im Detail</strong><p><span class="image image-interactive"></span>Erkunden Sie die Berliner Breitbandlandschaft oder nutzen Sie den Button oben rechts um sich das BRAIN-Netz anzeigen zu lassen.</p></div>',t.onclick=function(){e.removeControl(n)},t}});n=new f,t.addControl(n);var c=[[1,37,44],[1,44,27],[1,27,62],[1,62,50],[1,62,47],[1,47,60],[1,47,33],[1,60,33],[1,50,45],[1,50,35],[1,35,51],[1,51,24],[1,35,52],[1,52,53],[1,24,58],[1,58,57],[1,58,60],[1,57,38],[1,48,60],[1,48,49],[1,57,61],[1,49,41],[1,41,59],[1,59,21],[1,21,63],[1,21,63],[1,61,63],[1,56,63],[1,56,55],[1,55,54],[1,55,54],[1,54,58],[1,52,64],[1,64,24],[2,55,6],[2,55,16],[2,55,28],[2,51,15],[2,52,7],[2,27,5],[2,27,2],[2,27,19],[2,40,62],[2,62,26],[2,23,47],[2,22,37],[2,3,37],[2,8,57],[2,38,39],[2,50,14],[2,1,24],[2,63,25],[2,42,33],[2,24,20],[2,50,36],[2,24,10]];d3.csv("data/brain.csv",function(e,t){c.forEach(function(e,n){a.addLayer(L.polyline([new L.LatLng(t[e[1]-1].latitude,t[e[1]-1].longitude),new L.LatLng(t[e[2]-1].latitude,t[e[2]-1].longitude)],{color:"#ffffff",weight:5/e[0]}))}),t.forEach(function(e,t){a.addLayer(L.circleMarker(new L.LatLng(e.latitude,e.longitude),{radius:3*e.type,color:"#000000",fillColor:"#ffffff",weight:1,fillOpacity:1,opacity:1,title:e.name}).on("mouseover",function(e){tooltip.content('<strong class="center">'+this.options.title+"</strong>");var t=$(this._container).offset();tooltip.position([t.left+this.options.radius,t.top+this.options.radius]),tooltip.show()}).on("mouseout",function(e){tooltip.hide()}))})})},e}