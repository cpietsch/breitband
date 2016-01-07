function d3_compare(){
	var selection, data, timeline = Timeline();

	function compare(sel){
		selection = sel;
		d3.csv("data/all.csv").get(function(error, csv) {
			csv.forEach(function(d){
				d.jahr *= 1;
				d.leitung50 *= 1;
				d.leitung16 *= 1;
			});

			data = csv;
			
			compare.init();
		});
	}

	compare.init = function(){
		timeline.load(data);
	};

	return compare;
}