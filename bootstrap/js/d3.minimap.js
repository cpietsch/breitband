function d3_minimap(){
	var selection,
		geo_data,
		speed_data,
		districts,
		speed = 50,
		width=300,
		height=300,
		projection = d3.geo.mercator()
			.scale(20000)
			.precision(.1)
			.center([13.403528,52.540212])
			.translate([width / 2, height / 2]),
		path = d3.geo.path()
    		.projection(projection),
    	color_scale = d3.scale.linear()
    		.domain([100, 95, 75, 50, 10, 0])
    		.range([{r:189,g:0,b:38,a:0.8},{r:240,g:59,b:32,a:0.8},{r:253,g:141,b:60,a:0.8},{r:254,g:204,b:92,a:0.8},{r:255,g:255,b:178,a:0.8},{r:0,g:0,b:0,a:0.8}]);

	function minimap(sel){
		selection = sel;
		d3.csv('data/all.csv', function(err, data){

			speed_data = data;

			districts = {};
			data.forEach(function(d, i, a){
				if(!districts[d.bezirk]){
					districts[d.bezirk] = {
						2011:{leitung16:0, leitung50:0, count:0},
						2012:{leitung16:0, leitung50:0, count:0},
						2013:{leitung16:0, leitung50:0, count:0},
						2015:{leitung16:0, leitung50:0, count:0}
					};
				}

				districts[d.bezirk][d.jahr].count++;
				districts[d.bezirk][d.jahr].leitung16+=parseFloat(d.leitung16);
				districts[d.bezirk][d.jahr].leitung50+=parseFloat(d.leitung50);
			});

			d3.json('data/berlin_bezirke.topojson', function(err, data){
				geo_data = data;
				minimap.init();
			});
		});
	}

	minimap.init = function(){
		selection.each(function(d, i) {
			var sel = d3.select(this);

			//Delete everything that exists (for resize, as not everything is data driven)
			sel.selectAll('*').remove();

			var svg = sel.append('svg')
				.attr('viewBox', '0 0 '+width+' '+height)
				.attr('preserveAspectRatio', 'xMidYMid meet');

			var year = sel.attr('data-year');

			svg.selectAll('path').data(topojson.feature(geo_data, geo_data.objects.berlin_bezirke).features).enter().append("path")
				.attr("d", path)
				.attr('data-year', year)
				.on('mouseover', function(){ 
					var o = d3.select(this);
					var d = o.data()[0];
					tooltip.content("<strong>"+d.properties.name+"</strong><br />Netz mit einer Geschwindigkeit von<br /> bis zu "+speed+" Mbit/s ist zu "+(districts[d.properties.name][year]["leitung"+speed]/districts[d.properties.name][year].count).toFixed(2)+"% verfügbar.");
					tooltip.position([d3.event.pageX, d3.event.pageY]);
					tooltip.show(); 
				})
				.on('mousemove', function(){ tooltip.position([d3.event.pageX, d3.event.pageY]); })
				.on('mouseout', tooltip.hide());

			svg.append('text').text(year).attr('x',width/2).attr('y',height/2+130).attr('text-anchor', 'middle');
		});

		d3.selectAll('.switchrow .col').on('click',function(){
			var btn = d3.select(this);
			d3.selectAll('.switchrow .col .triangle').style('display', 'none');
			btn.select('.triangle').style('display', 'block');
			d3.selectAll('.mapswitch').attr('class', 'mapswitch blue');
			btn.select('.mapswitch').attr('class', 'mapswitch red');
			minimap.switchSpeed(btn.attr('data-speed'));
		});

		minimap.updateColor();
	};

	minimap.updateColor = function(){
		selection.each(function(d, i) {
			var sel = d3.select(this);

			var year = sel.attr('data-year');

			sel.selectAll('path').data(topojson.feature(geo_data, geo_data.objects.berlin_bezirke).features)
				.style("fill", function(d, i){
					var color = color_scale((districts[d.properties.name][year]["leitung"+speed]/districts[d.properties.name][year].count));
					return 'rgba('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+','+Math.round(color.a)+')';
				});
		});
	};

	minimap.switchSpeed = function(s){
		speed = s;
		minimap.updateColor();
	}

	return minimap;
}