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

			data = ["leitung16", "leitung50"].map(function(type){
			  return csv.map(function(d){
			    return {
			      type: type,
			      value: d[type],
			      ortsteil: d.ortsteil,
			      bezirk: d.bezirk,
			      jahr: d.jahr,
			      data: d
			    }
			  })
			}).reduce(function(d1,d2){ return d1.concat(d2) },[]);
			
			compare.init();
		});
	}

	compare.init = function(){
		timeline.load(data);
	};

	return compare;
}