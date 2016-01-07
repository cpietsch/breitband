function d3_technologie(){
	var selection;

	function technologie(sel){
		selection = sel;
		technologie.init();
	}

	technologie.resize = function(){
		technologie.init();
	};

	technologie.init = function(){
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

			//Create SVG
			var svg = sel.append('svg')
						.attr('width', fullwidth)
						.attr('height', fullheight)
						.append('g')
							.attr('transform', 'translate(30 0)');

			var labels = [1,2,6,16,30,50],
				blueCount = 0,
				greenCount = 0,
				scaleDomain = [0,25,50,70,85,95,100],
				scaleStep = height/scaleDomain.length,
				scaleRange = [scaleStep*6, scaleStep*5, scaleStep*4, scaleStep*3, scaleStep*2, scaleStep, 0],
				x = d3.scale.linear().domain([0,5]).range([0,width]),
				x_alt = d3.scale.ordinal().domain(["1","2","3","4","5","6"]).rangePoints([0,width]),
				x_mobile = d3.scale.linear().domain([0,2]).range([0,width]),
				x_alt_mobile = d3.scale.ordinal().domain(["1","2","3"]).rangePoints([0,width/2]),
				y = d3.scale.linear().domain(scaleDomain).range(scaleRange),
				line = d3.svg.line()
					.x(function(d, i) { return x(i); })
					.y(function(d) { return y(d); })
				y_axis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.tickFormat(function(d, i){ var r = d; if(d==100){ r+="%"; } return r; })
					.tickValues([0,25,50,70,85,95,100]),
				y_axis_mobile = d3.svg.axis()
					.scale(y)
					.orient("right")
					.tickFormat(function(d, i){ var r = d; if(d==100){ r+="%"; } return r; })
					.tickValues([0,25,50,70,85,95,100]),
				x_axis = d3.svg.axis()
					.scale(x_alt)
					.orient("bottom")
					.tickFormat(function(d, i){ var r = "≥"+labels[parseInt(d)-1]; if(d==1){ r += " Mbit/s";} return r;}),
				x_axis_mobile = d3.svg.axis()
					.scale(x_alt_mobile)
					.orient("bottom")
					.tickFormat(function(d, i){ var r = "≥"+labels[parseInt(d)-1]; if(d==3){ r += " Mbit/s";} return r;});

			var cabel_svg = svg.append('g').attr('transform', 'translate(50, 50)');
				cabel_svg.append("text").attr("class", "headline").text("Leitungsgebunden").attr("transform", "translate(-5, -25)");
			var mobile_svg = svg.append('g').attr('transform', 'translate('+(50+width+50)+', 50)');
				mobile_svg.append("text").attr("class", "headline").text("Drahtlos").attr("transform", "translate(-5, -25)");
			var label_layer = svg.append("g");

			[0,25,50,70,85,95,100].forEach(function(d, index, array){
				cabel_svg.append('line')
					.attr('class', 'bg')
					.attr('x1', -10)
					.attr('x2', width*1.5+10+50)
					.attr('y1', y(d))
					.attr('y2', y(d));
			});

			var data = [{
				short:"DSL",
				long:"Digital Subscriber Line",
				description:"",
				type:"cabel",
				speeds:[99.7, 99.86, 99.37, 95.66, 81.43, 37.54]
			},
			{
				short:"CATV",
				long:"Kabelnetz",
				description:"",
				type:"cabel",
				speeds:[88.92, 88.92, 88.92, 88.92, 88.92, 88.92]
			},
			{
				short:"FFTX",
				long:"Faseroptische Technologie",
				description:"",
				type:"cabel",
				speeds:[0.35, 0.35, 0.35, 0.35, 0.35, 0.35]
			},
			{
				short:"LTE",
				long:"Long Term Evolution",
				description:"",
				type:"mobile",
				speeds:[100.0, 100.0, 95.07]
			},
			{
				short:"HSDPA",
				long:"Breitband-UMTS",
				description:"",
				type:"mobile",
				speeds:[99.94, 43.47]
			}];

			var label_positions = [
				'translate('+(x(0)+50)+' '+(y(data[0].speeds[0])+50+20)+')',
				'translate('+(x(0)+50)+' '+(y(data[1].speeds[0])+50+20)+')',
				'translate('+(x(0)+50)+' '+(y(data[2].speeds[0])+50-10)+')',
				'translate('+(x((data[3].speeds.length-1))+width+100+5)+' '+(y(data[3].speeds[(data[3].speeds.length-1)])+50+4)+')', 
				'translate('+(x((data[4].speeds.length-1))+width+100+5)+' '+(y(data[4].speeds[(data[4].speeds.length-1)])+50+4)+')' 
			];

			cabel_svg.append('defs').append('pattern')
				.attr('id', 'missing_pattern')
				.attr('width', 44)
				.attr('height', 44)
				.attr('patternUnits', 'userSpaceOnUse')
					.append('image')
						.attr('width', 44)
						.attr('height', 44)
						.attr('x', 0)
						.attr('y', 0)
						.attr('xlink:href', 'images/pattern.png');

			cabel_svg.append('path')
				.attr('class', 'missing')
				.attr("d", line(data[0].speeds)+"L"+x(data[0].speeds.length-1)+",0Z");

			mobile_svg.append('path')
				.attr('class', 'missing')
				.attr("d", line(data[3].speeds)+"L"+(x(data[3].speeds.length-1))+",0Z");

			data.forEach(function(d, index, array){
				if(d.type=="mobile"){
					var color = 'rgba('+colorPalletes.green[greenCount][0]+','+colorPalletes.green[greenCount][1]+','+colorPalletes.green[greenCount][2]+',1)'
					greenCount++;
				}else{
					var color = 'rgba('+colorPalletes.blue[blueCount][0]+','+colorPalletes.blue[blueCount][1]+','+colorPalletes.blue[blueCount][2]+',1)'
					blueCount++;
				}

				var t_svg = cabel_svg;
				if(d.type=="mobile"){
					t_svg = mobile_svg;
				}

				label_layer.append('text')
					.text(d.short)
					.attr('class', 'speed-label')
					.style('fill', color)
					.attr('transform', label_positions[index]);

				var layer = t_svg.append("g");

				layer.append("path")
					.style('stroke', color)
					.datum(d.speeds)
					.attr("d", line);

				layer.selectAll("circle")
					.data(d.speeds).enter().append("circle")
						.on('mouseover', function(){ 
							var o = d3.select(this); 
							tooltip.content("<strong>"+o.attr("data-short")+"</strong><br />mit einer Geschwindigkeit von<br /> bis zu "+labels[(parseInt(o.attr("data-speed")))]+" Mbit/s ist in "+o.attr("data-d")+"%<br /> von Berlin verfügbar.");
							tooltip.position([d3.event.pageX, d3.event.pageY]);
							tooltip.show(); 
						})
						.on('mouseout', tooltip.hide())
						.attr("r", 3)
						.attr("data-type", d.type)
						.attr("data-short", d.short)
						.attr("data-long", d.long)
						.attr("data-d", function(d){ return d; })
						.attr("data-i", function(d){ return i; })
						.attr("data-speed", function(d,i){ return i; })
						.attr("data-description", d.description)
						.style('fill', color)
						.attr("cx", function(d,i){ return x(i); })
						.attr("cy", function(d,i){ return y(d); });
			});

			cabel_svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (height-scaleStep+10) + ")")
				.call(x_axis);

			cabel_svg.append("g")
				.attr("transform", "translate(-10, 0)")
				.attr("class", "y axis")
				.call(y_axis);

			mobile_svg.append("g")
				.attr("transform", "translate("+(width/2+10)+", 0)")
				.attr("class", "y axis")
				.call(y_axis_mobile);

			mobile_svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (height-scaleStep+10) + ")")
				.call(x_axis_mobile);

		});
	};

	return technologie;
}