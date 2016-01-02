function Single(key){
  var chart = {};

  var margin = {top: 30, right:30, bottom: 30, left: 30},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([2011,2012,2013,2015])
      .tickFormat(d3.format(""))

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width)

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.jahr); })
      .y(function(d) { return y(d.value); });
      
  var svg = d3.select("#charts").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  var axisSvg = svg.append("g")
  var linechartSvg = svg.append("g")

  var timeLine = svg.append("line")
     .classed("timeline", true)
     .attr("y2", height)
     .attr("x1", 0)


  var hover = svg.append("g")
 

  chart.load = function(data){

  data = data.map(function(d){
    return {
      jahr: d.jahr,
      value: d[key],
      ortsteil: d.ortsteil,
      bezirk: d.bezirk
    };
  })

    // console.log(data[0], data.length);

  x.domain(d3.extent(data, function(d){ return d.jahr; }));
  y.domain(d3.extent(data, function(c) { return c.value; }));

  var nest = d3.nest()
    .key(function(d) { return d.ortsteil; })
    .entries(data);

  
  console.log(nest);

  axisSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

  var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

  gy.selectAll("text")
      .attr("x", -6)
      // .attr("dy", -4);

  gy.selectAll("g").filter(function(d) { return d; })
      .classed("minor", true);

  
  var linechart = linechartSvg
  .selectAll(".linechart")
  .data(nest)
  .enter()
  .append("path")
  .datum(function(d){ return d.values; })
  .attr("d", line)
  .attr("class", "line")
  .attr("stroke", function(d){ return color(d[0].bezirk); })
  
  // var linechart = linechartSvg.selectAll(".linechart")
  //       .data(data)
  //     .enter().append("g")
  //       .attr("class", "linechart");

  //   linechart.append("path")
  //       .attr("class", "line")
  //       .attr("d", function(d){
  //         console.log(d)
  //         return line(d);
  //       })
        //.style("stroke", function(d) { return color(d.name); });

  };



  return chart;
}



function Compare(){
  var chart = {};

  var margin = {top: 30, right:30, bottom: 30, left: 30},
      width = 400 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


  var x = d3.scale.linear()
      .range([0, width])
      .domain([2011,2015])

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0,100])

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([2011,2012,2013,2015])
      .tickFormat(d3.format(""))

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width)

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.jahr); })
      .y(function(d) { return y(d.value); });

  var menu = d3.select("#charts").append("div").classed("menu", true);
  
  var svg = d3.select("#charts").append("svg")
      .attr("width", (width + margin.left + margin.right)*2)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  var axisSvg = svg.append("g")
  var linechartSvg = svg.append("g")

  var timeLine = svg.append("line")
     .classed("timeline", true)
     .attr("y2", height)
     .attr("x1", 0)

 


  var hover = svg.append("g")
 

  chart.load = function(data){


  var data2 = ["leitung16", "leitung50"].map(function(type){
    return data.map(function(d){
      return {
        type: type,
        value: d[type],
        ortsteil: d.ortsteil,
        bezirk: d.bezirk,
        jahr: d.jahr,
        data: d
      }
    })
  }).reduce(function(d1,d2){ return d1.concat(d2) },[]);;
  
  console.log(data2);

  var nest = d3.nest()
    .key(function(d) { return d.type; })
    .key(function(d) { return d.ortsteil; })
    .entries(data2);

  
  console.log(nest);

  var bezirke = d3.nest()
    .key(function(d) { return d.bezirk; })
    //.key(function(d) { return d.ortsteil; })
    .entries(data2)

  bezirke
    .forEach(function(d){
      d.mean = parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }));
    })

  bezirke
    .sort(function(a,b){ return b.mean - a.mean; })


  var el = menu.selectAll("div")
    .data(bezirke)
    .enter()
    .append("div")
    .on("mouseenter", function(d1){
      linechart
        .selectAll("path")
        .filter(function(d2){
          console.log(d2)
          return d1.key != d2.values[0].bezirk;
        })
        .style("stroke", "#000")
        .style("opacity", 0.05)
        .style("stroke-width", 1)

        linechart
          .selectAll("path")
          .filter(function(d2){
            console.log(d2)
            return d1.key == d2.values[0].bezirk;
          })
          .style("stroke", function(d){ return color(d.values[0].bezirk); })
          .style("stroke-width", 2)
          .style("opacity", 1)
    })
    .on("mouseout", function(d1){
      linechart
        .selectAll("path")
        .style("stroke", function(d){ return color(d.values[0].bezirk); })
        .style("stroke-width", 1)
        .style("opacity", 1)
    })

  el.append("span")
    .style("background", function(d){ return color(d.key); })
    .text(function(d){ return d.mean+"%"; })
    .classed("color", true)

  el.append("span")
    .text(function(d){ return d.key; })

  // el.append("span")
  //   .text(function(d){ return parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }))+"%"; })
  
  var linechart = linechartSvg
    .selectAll("g")
    .data(nest)
    .enter()
    .append("g")
    .attr("transform", function(d,i){  return "translate(" + (i*width + i*margin.left) + ",0)"})
  
  var title = { leitung16: "> 16Mbit", leitung50: "> 50Mbit"}
  linechart.append("text")
    .text(function(d){ return title[d.key]; })
    .attr("y", -10)

  var svgAxis = linechart.append("g")

  svgAxis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var gy = svgAxis.append("g")
      .attr("class", "y axis")
      .call(yAxis)
        
  gy.selectAll("text")
      .attr("x", -6)
      // .attr("dy", -4);

  gy.selectAll("g").filter(function(d) { return d; })
      .classed("minor", true);
  

  linechart.selectAll("path")
    .data(function(d){ return d.values; })
    .enter()
    .append("path")
    // .datum(function(d){console.log(d); return d.values; })
    .attr("d", function(d){ return line(d.values); })
    .attr("class", "line")
    .attr("stroke", function(d){ return color(d.values[0].bezirk); })
  
  // var linechart = linechartSvg.selectAll(".linechart")
  //       .data(data)
  //     .enter().append("g")
  //       .attr("class", "linechart");

  //   linechart.append("path")
  //       .attr("class", "line")
  //       .attr("d", function(d){
  //         console.log(d)
  //         return line(d);
  //       })
        //.style("stroke", function(d) { return color(d.name); });

  };



  return chart;
}



function Multiple(){
  var chart = {};

  var width = 300;
  var height = 300;
  
  var projection = d3.geo.mercator()
    .scale(20000)
    .precision(.1)
    .center([13.403528,52.540212])
    .translate([width / 2, height / 2])

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#charts").append("svg")
    .attr("width", width)
    .attr("height", height);

  // var graticule = d3.geo.graticule();
  // svg.append("path")
  //   .datum(graticule)
  //   .attr("class", "graticule")
  //   .attr("d", path);


  var color = d3.scale.category20();

  var color_scale = d3.scale.linear().domain([0, 100]).range(['red', 'yellow'])

  chart.load = function(geo,data){

    console.log(geo)

    svg.selectAll("path")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("d", function(d){ console.log(d); return path(d); })
      .attr("fill", function(d){ return color(d.properties.name); })

    var bezirkeGeo = geo.features.map(function(d){
      return {
        key: d.properties.name,
        feature: d
      };
    })

    var nest = d3.nest()
    .key(function(d) { return d.jahr; })
    .key(function(d) { return d.bezirk; })
    .entries(data);

    console.log(nest)

    var small = d3.select(".multiple").selectAll(".small")
      .data(nest)
      .enter()
      .append("svg")
      .classed(".small", true)
      .attr("width", width)
      .attr("height", height)

    small.append("text")
      .text(function(d){ return d.key + " 16Mbit"; })
      .attr("x", 40)
      .attr("y", 40)
    
    small.selectAll("path")
      .data(function(d){ return d.values; })
      .enter()
      .append("path")
      .attr("d", function(d){
        return path(geo.features.filter(function(d2){ return d2.properties.name == d.key; })[0]);
      })
      .attr("fill", function(d){
        var m = d3.mean(d.values, function(d){ return d.leitung16; });
        console.log(d,m);
        return color_scale(m);
      })

      var small2 = d3.select(".multiple").selectAll(".small2")
      .data(nest)
      .enter()
      .append("svg")
      .classed(".small2", true)
      .attr("width", width)
      .attr("height", height)

    small2.append("text")
      .text(function(d){ return d.key + " 50Mbit"; })
      .attr("x", 40)
      .attr("y", 40)
    
    small2.selectAll("path")
      .data(function(d){ return d.values; })
      .enter()
      .append("path")
      .attr("d", function(d){
        return path(geo.features.filter(function(d2){ return d2.properties.name == d.key; })[0]);
      })
      .attr("fill", function(d){
        var m = d3.mean(d.values, function(d){ return d.leitung50; });
        console.log(d,m);
        return color_scale(m);
      })


  }

  return chart;
}