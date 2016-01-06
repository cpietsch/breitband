function d3_pulse(){
	var selection, hour = -1, odata;

	function pulse(sel){
		selection = sel;
		pulse.init();
	}

	pulse.init = function(){
		selection.each(function(d, i) {
			var sel = d3.select(this);
			//Delete everything that exists (for resize, as not everything is data driven)
			sel.selectAll('*').remove();

			//Get current Size
			var bb = sel.node().getBoundingClientRect();
			var fullwidth = bb.width;
			var fullheight = bb.height;
			var width = (fullwidth-200)/1.5;
			var height = fullheight-50;

			var size = 3,
				oversize = 2,
				gx_min = 56,
				gx_max = 235,
				gy_min = 1,
				gy_max = 147,
				line_height = 200,
				line_pad = 10,
				cols = gx_max-gx_min,
				rows = gy_max-gy_min,
				width = cols*size,
				height = rows*size,
				line_width = 200;

			var svg = selection.append('svg')
				.attr('id', 'timemap')
				.attr('viewBox', '0 0 '+width+' '+height)
				.attr('preserveAspectRatio', 'xMidYMid meet');

			var line_svg = d3.select('#d3_circular').append('svg')
				.attr('id', 'timeline')
				.attr('viewBox', '0 0 '+line_width+' '+line_height)
				.attr('preserveAspectRatio', 'xMidYMid meet')
				.append('g');

			/*var line_x = d3.scale.linear()
				.domain([0,24])
				.range([0, line_width-2*line_pad]);

			var cix = [66,48,40,32,29,27,23,19,17,16,14,14,14,15,18,20,23,28,32,37,40,45,46,49,53,54,57,60,65,69,67,71,76,74,71,77,75,78,88,74,78,84,83,87,81,74,74,72,66];
			var cix_max = d3.max(cix);
			var line_y_cix = d3.scale.linear()
				.domain([0, cix_max])
				.range([line_height-2*line_pad, 0]);

			//Draw Background Time Pattern 
			for(var i = 0; i<24; i++){
				line_svg.append('rect')
					.attr('class', function(d){ var r = 'bg-'+i+' bg-pattern'; if(i % 2 == true){ r += ' odd'; }else{ r += ' even'; } return r; })
					.attr('x', line_x(i))
					.attr('y', 0)
					.attr('width', line_x(1))
					.attr('height', line_y_cix(0));
			}

			line_svg.append('line')
				.attr('class', 'bottomline')
				.attr('x1', line_x(0))
				.attr('x2', line_x(24))
				.attr('y1', line_y_cix(0))
				.attr('y2', line_y_cix(0));

			var area_cix = d3.svg.area().x(function(d,i){return line_x(i/2.0);}).y0(function(d){return line_y_cix(d);}).y1(function(d){return line_y_cix(0);}).interpolate('basis');
			var line_cix = d3.svg.line().x(function(d,i){return line_x(i/2.0);}).y(function(d){return line_y_cix(d);}).interpolate('basis');
			line_svg.append('path').datum(cix).attr('class', 'trendline cix').attr('d', line_cix);
			line_svg.append('path').datum(cix).attr('class', 'trendarea cix').attr('d', area_cix);

			d3.json('http://tsb.sebastianmeier.eu/static/info.json', function(err, info_data){
				var twitter_max = 0,
					instagram_max = 0,
					twitter = [],
					instagram = [];

				var first = false;

				for(var i in info_data.histogram.twitter){
					if(!first){first = info_data.histogram.twitter[i];}
					if(info_data.histogram.twitter[i]>twitter_max){twitter_max = info_data.histogram.twitter[i];}
					twitter.push(info_data.histogram.twitter[i]);
				}
				twitter.push(first);

				first = false;

				for(var i in info_data.histogram.instagram){
					if(!first){first = info_data.histogram.instagram[i];}
					if(info_data.histogram.instagram[i]>instagram_max){instagram_max = info_data.histogram.instagram[i];}
					instagram.push(info_data.histogram.instagram[i]);
				}
				instagram.push(first);

				var line_y_twitter = d3.scale.linear().range([line_height-2*line_pad, 0]).domain([0, twitter_max]);
				var line_y_instagram = d3.scale.linear().range([line_height-2*line_pad, 0]).domain([0, instagram_max]);

				var area_twitter = d3.svg.area().x(function(d,i){return line_x(i);}).y0(function(d){return line_y_twitter(d);}).y1(function(d){return line_y_twitter(0);}).interpolate('basis');
				var line_twitter = d3.svg.line().x(function(d,i){return line_x(i);}).y(function(d){return line_y_twitter(d);}).interpolate('basis');
				line_svg.append('path').datum(twitter).attr('class', 'trendline twitter').attr('d', line_twitter);
				//line_svg.append('path').datum(twitter).attr('class', 'trendarea twitter').attr('d', area_twitter);

				var area_instagram = d3.svg.area().x(function(d,i){return line_x(i);}).y0(function(d){return line_y_instagram(d);}).y1(function(d){return line_y_instagram(0);}).interpolate('basis');
				var line_instagram = d3.svg.line().x(function(d,i){return line_x(i);}).y(function(d){return line_y_instagram(d);}).interpolate('basis');
				line_svg.append('path').datum(instagram).attr('class', 'trendline instagram').attr('d', line_instagram);
				//line_svg.append('path').datum(instagram).attr('class', 'trendarea instagram').attr('d', area_instagram);

			});*/

			var start = 0;
			var end = 24;

			var min_r = 20;
			var max_r = line_width/2-line_pad-5;
			var steps_r = 5;

			var xy = function(h, r, v){
				var theta = 2 * Math.PI / 24;
				var tr = min_r + v(r)*(max_r - min_r);
				return [
					(tr * Math.cos(h * theta - Math.PI/2.0)),
					(tr * Math.sin(h * theta - Math.PI/2.0))
				];
			};

			//Background Grid
			var grid = line_svg.append('g').attr('class', 'grid').attr('transform', 'translate('+(line_width/2)+','+(line_height/2)+')');
			var hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
			grid.selectAll('line').data(hours).enter().append('line')
				.attr('x1', function(d){ var l_xy = xy(d, 1, function(d){return d;}); return l_xy[0]; })
				.attr('x2', function(d){ var l_xy = xy(d, 0, function(d){return d;}); return l_xy[0]; })
				.attr('y1', function(d){ var l_xy = xy(d, 1, function(d){return d;}); return l_xy[1]; })
				.attr('y2', function(d){ var l_xy = xy(d, 0, function(d){return d;}); return l_xy[1]; })
				.style('stroke', function(d, i){ return 'rgba(0,0,0,'+(0.3/24*i+0.1)+')' });

			for(var i = 0; i<steps_r; i++){
				grid.append('circle')
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('r', (((max_r-min_r)/steps_r)*i+min_r));
			}

			//svg group for background patterns
			var defs = line_svg.append('defs');

			//Mask for inner hole
			var mask = defs.append('mask').attr('id', 'hole');
			mask.append('rect')
				.attr('x', -line_width/2)
				.attr('y', -line_height/2)
				.attr('width', line_width)
				.attr('height', line_height)
				.style('fill', 'white');

			mask.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', min_r);

			grid.append('text')
				.attr('class', 'timetext')
				.attr('x', 0)
				.attr('y', 7)
				.attr('text-anchor', 'middle')
				.text(24);

			grid.append('text')
				.attr('class', 'octext')
				.attr('x', 0)
				.attr('y', -(max_r+5))
				.attr('text-anchor', 'middle')
				.text('00:00');

			grid.append('text')
				.attr('class', 'octext')
				.attr('x', 0)
				.attr('y', (max_r+13))
				.attr('text-anchor', 'middle')
				.text('12:00');

			grid.append('text')
				.attr('class', 'octext')
				.attr('x', (max_r+5))
				.attr('y', 3)
				.attr('text-anchor', 'start')
				.text('06:00');

			grid.append('text')
				.attr('class', 'octext')
				.attr('x', -(max_r+5))
				.attr('y', 3)
				.attr('text-anchor', 'end')
				.text('18:00');

			//svg groups for circles
			var species_g = {};
			//svg groups for paths
			var species_p = {};
			//d3 scales
			var species_s = {};

			var species = {
				cix:[],
				instagram:[],
				twitter:[]
			};

			var line_colors = {
				cix:'rgba(230,0,50,1)',
				instagram:'rgba(30,55,145,1)',
				twitter:'rgba(0,115,125,1)'
			};

			var line_fill_colors = {
				cix:'rgba(230,0,50,0.2)',
				instagram:'rgba(30,55,145,0.2)',
				twitter:'rgba(0,115,125,0.2)'
			};

			//fill species with empty data
			for(var s in species){
				for(var i = 0; i<24; i++){
					species[s].push(0);
				}

				species_g[s] = line_svg.append('g').attr('transform', 'translate('+(line_width/2)+','+(line_height/2)+')');
				species_p[s] = line_svg.append('g').attr('transform', 'translate('+(line_width/2)+','+(line_height/2)+')');
				species_s[s] = d3.scale.linear().range([0,1]);
			}

			d3.json('http://tsb.sebastianmeier.eu/static/info.json', function(err, info_data){
				if (err) return console.error(err);

				for(var s in species){
					var max = -Number.MAX_VALUE;

					switch(s){
						case 'cix':
							var tdata = [66,48,40,32,29,27,23,19,17,16,14,14,14,15,18,20,23,28,32,37,40,45,46,49,53,54,57,60,65,69,67,71,76,74,71,77,75,78,88,74,78,84,83,87,81,74,74,72,66]
							var data = [];
							for(var i = 0; i<tdata.length; i++){
								data.push({x:i/2, y:tdata[i]});
							}
						break;
						case 'instagram':
							var data = pulse.reorder('instagram', info_data);
						break;
						case 'twitter':
							var data = pulse.reorder('twitter', info_data);
						break;
					}

					species[s] = data;
					
					for(var i = 0; i<data.length; i++){
						if(data[i].y > max){ max = data[i].y; }
					}

					species_s[s].domain([0, max]);

					species_g[s].selectAll('circle').data(species[s]).enter().append('circle')
						.attr('cx', function(d, i){ var c_xy = xy(d.x, d.y, species_s[s]); return c_xy[0]; })
						.attr('cy', function(d, i){ var c_xy = xy(d.x, d.y, species_s[s]); return c_xy[1]; })
						.style('fill', line_colors[s])
						.attr('r', 1);

					var line = d3.svg.line()
						.x(function(d, i){ var c_xy = xy(d.x, d.y, species_s[s]); return c_xy[0]; })
						.y(function(d, i){ var c_xy = xy(d.x, d.y, species_s[s]); return c_xy[1]; });

					species_p[s].append('path')
						.attr('d', function(){ return line(species[s])+' Z'; })
						.style('stroke', line_colors[s])
						.style('fill', line_fill_colors[s])
						.attr('mask', 'url(#hole)')
						.attr('class', s);
				}

			});


			/*------ DRAW THE MAP -------*/


			var data, 
				hdata,
				hdata_objects,
				max_instagram, 
				min_instagram,
				max_twitter, 
				min_twitter,
				o = {
					twitter : null,
					instagram : null
				};

			var colors = [
				'rgba(0,0,0,0.1)',
				'rgba(255,255,178,0.3)',
				'rgba(254,204,92,0.3)',
				'rgba(253,141,60,0.3)',
				'rgba(240,59,32,0.3)',
				'rgba(189,0,38,0.3)'
			];

			d3.csv('data/geo.csv', function(err, geo_data){
				svg.selectAll('rect').data(geo_data).enter().append('rect')
					.attr('x', function(d){ return (d.x - gx_min)*size; })
					.attr('y', function(d){ return (d.y - gy_min)*size; })
					.attr('width', size)
					.attr('height', size)
					.style('fill', function(d){
						return colors[d.p];
					});

				d3.csv('http://tsb.sebastianmeier.eu/static/data.csv', function(err, time_data){
					data = time_data;

					odata = {
						instagram:[],
						twitter:[]
					};

					hdata = [];

					for(var i = 0; i<24; i++){
						for(var j in odata){
							odata[j].push([]);
						}
					}

					time_data.forEach(function(d, index, array){
						if(!hdata[d.x]){hdata[d.x]=[];}
						hdata[d.x][d.y] = 1;

						if(!odata['twitter'][d.hour][d.x]){odata['twitter'][d.hour][d.x] = [];}
						if(!odata['instagram'][d.hour][d.x]){odata['instagram'][d.hour][d.x] = [];}
						odata['twitter'][d.hour][d.x][d.y] = d.twitter;
						odata['instagram'][d.hour][d.x][d.y] = d.instagram;
					});

					hdata_objects = [];
					for(var x in hdata){
						for(var y in hdata[x]){
							hdata_objects.push({
								x:x,
								y:y
							});
						}
					}

					svg.selectAll('circle.instagram').data(hdata_objects).enter().append('circle')
						.attr('cx', function(d){ return (d.x - gx_min)*size-1; })
						.attr('cy', function(d){ return (d.y - gy_min)*size-1; })
						.attr('r', oversize)
						.attr('o', 0)
						.attr('dx', function(d){return d.x})
						.attr('dy', function(d){return d.y})
						.attr('type', 'instagram')
						.attr('class', function(d){ return 'cell instagram instagram_cell_'+d.x+"_"+d.y; })
						.style('fill', function(d){
							//return 'rgba(255,0,0,'+ (0.1*d.p) +')';
							return 'rgba(30,55,145,1)';
						});

					svg.selectAll('circle.twitter').data(hdata_objects).enter().append('circle')
						.attr('cx', function(d){ return (d.x - gx_min)*size+1; })
						.attr('cy', function(d){ return (d.y - gy_min)*size+1; })
						.attr('dx', function(d){return d.x})
						.attr('dy', function(d){return d.y})
						.attr('r', oversize)
						.attr('type', 'twitter')
						.attr('o', 0)
						.attr('class', function(d){ return 'cell twitter twitter_cell_'+d.x+"_"+d.y; })
						.style('fill', function(d){
							return 'rgba(0,115,125,1)';
						});

					max_twitter = d3.max(time_data, function(d){ return Math.sqrt(d.twitter); });
					min_twitter = d3.min(time_data, function(d){ return Math.sqrt(d.twitter); });
					max_instagram = d3.max(time_data, function(d){ return Math.sqrt(d.instagram); });
					min_instagram = d3.min(time_data, function(d){ return Math.sqrt(d.instagram); });

					o.twitter = d3.scale.linear()
						.domain([0, max_twitter])
						.range([0,1]);

					o.instagram = d3.scale.linear()
						.domain([0, max_instagram])
						.range([0,1]);

					pulse.iterate();
				});

			});

		});
	};

	pulse.colorHour = function(h, type){
		d3.selectAll('circle.cell').style('opacity', function(d){ 
			var item = d3.select(this);
			var t = parseFloat(item.attr('o'));
			var dx = parseInt(item.attr('dx'));
			var dy = parseInt(item.attr('dy'));
			var type = item.attr('type');
			
			if(odata[type][h][dx] && odata[type][h][dx][dy] && odata[type][h][dx][dy]>0){
				t = 1;
			}else{
				if(t>0){ t -= 0.1; }
				if(t<0){ t =  0; }	
			}

			item.attr('o', t);

			return t;
		});

		setTimeout(pulse.iterate, 50);
	};

	pulse.iterate = function(){
		hour++;
		if(hour>23){
			hour = 0;
		}

		/*d3.selectAll('rect.bg-pattern.odd').style('opacity',0.01);
		d3.selectAll('rect.bg-pattern.even').style('opacity',0.03);

		var mh1 = hour-2; if(mh1<0){mh1 += 24;}
		var mh2 = hour-3; if(mh2<0){mh2 += 24;}
		var mh3 = hour-4; if(mh3<0){mh3 += 24;}

		d3.select('rect.bg-'+(mh1)).style('opacity', 0.2);
		d3.select('rect.bg-'+(mh2)).style('opacity', 0.1);
		d3.select('rect.bg-'+(mh3)).style('opacity', 0.05);
		d3.select('rect.bg-'+(hour-1)).style('opacity', 0.3);*/

		d3.select('.timetext').text(hour);
		
		pulse.colorHour(hour, 'instagram');
	};

	pulse.reorder = function(key, array){
		var data = [];
		for(var i in array.histogram[key]){
			data.push({x:i, y:parseInt(array.histogram[key][i])});
		}
		return data;
	};

	return pulse;
}