
function Timeline(){
  var chart = {};

  var margin = {top: 30, right:30, bottom: 30, left: 30},
      width = 400 - (margin.left*2) - margin.right,
      height = 550 - margin.top - margin.bottom;


  var x = d3.scale.linear()
      .range([0, width])
      .domain([2011,2015])

  var scaleDomain = [0,25,50,70,85,95,100],
      scaleStep = height/(scaleDomain.length-1),
      scaleRange = [scaleStep*6, scaleStep*5, scaleStep*4, scaleStep*3, scaleStep*2, scaleStep, 0];
        
  var y = d3.scale.linear()
      .range(scaleRange)
      .domain(scaleDomain)

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
      // .x(function(d) { console.log(d); return x(d.key); })
      // .y(function(d) { return y(d3.mean(d.values, function(d){ return d.value; })); });
      .y(function(d) { return y(d.value); })
      .y(function(d) { return y(d.mean); })

  var lineAll = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.jahr); })
      .y(function(d) { return y(d.value); })
  

  var menu = d3.select("#compare-legend").append("div").classed("menu", true);
  
  var svg = d3.select("#compare-container").append("svg")
      .attr("shape-rendering", "optimizeSpeed")
      .attr("width", (width + margin.left + margin.right)*2)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  var axisSvg = svg.append("g")
  var linechartSvg = svg.append("g")

  // var timeLine = svg.append("line")
  //    .classed("timeline", true)
  //    .attr("y2", height)
  //    .attr("x1", 0)


  var hover = svg.append("g")
 

  chart.load = function(data){

    var columns = ["leitung16", "leitung50"];
    var title = { leitung16: "> 16Mbit", leitung50: "> 50Mbit"}

    var data2 = columns.map(function(type){
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

    var yearMean = d3.nest()
      .key(function(d) { return d.type; })
      .key(function(d) { return d.bezirk; })
      .key(function(d) { return d.jahr; })
      .rollup(function(leaves) {
        // console.log(leaves);
        var mean = d3.mean(leaves, function(d){ return d.value; });
        leaves.forEach(function(d){
          d.mean = mean;
        })
        return mean;
      })
      .entries(data2);

    var nest = d3.nest()
      .key(function(d) { return d.type; })
      .key(function(d) { return d.bezirk; })
      .key(function(d) { return d.ortsteil; })
      .entries(data2);

    var nest2 = d3.nest()
      .key(function(d) { return d.type; })
      .key(function(d) { return d.bezirk; })
      .entries(data2);

    
    console.log(yearMean);

    var bezirke = d3.nest()
      .key(function(d) { return d.bezirk; })
      .entries(data2)

    bezirke
      .forEach(function(d){
        d.mean = parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }));
      })

    bezirke
      .sort(function(a,b){ return b.mean - a.mean; })


    var activeMenu = false;

    menu.on("mouseout", function(d1){
      // console.log("out", d1)
      if(activeMenu) return;

        linechartSvg
          .selectAll(".bezirke")
          .style("stroke-width", 1.5)
          .style("opacity", 1)
          .attr("stroke", function(d){ return color(d.key); })
          .selectAll(".line")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return line(d.values); })

        // return false;
      })
    
    var el = menu.selectAll("div")
      .data(bezirke)
      .enter()
      .append("div")
      .classed("entry", true)
      .style('color', function(d){ return color(d.key); })
      .on("click", function(d1){
        activeMenu = d1.active = !d1.active;

        menu.selectAll(".entry")
          .classed("active", function(d2){ return (d1.key == d2.key) & d1.active; });

        // menu.select(".active")
        //   .style('background', function(d){ return color(d.key); })
        //   .style('color', "#fff")


        
        menu.selectAll(".close")
          .style("opacity", function(d2){
            d2.active = (d1.key == d2.key) & d1.active;
            return d2.active ? 1 : 0;
          })
        
        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key != d2.key;
          })
          .style("opacity", 0.2)
          .style("stroke-width", 1.5)
          .attr("stroke", "#999")
          .selectAll(".line")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return line(d.values); })

        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key == d2.key;
          })
          .moveToFront()
          .attr("stroke", function(d){ return color(d.key); })
          .style("stroke-width", 2.5)
          .style("opacity", 1)
          .selectAll(".line")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return activeMenu ? lineAll(d.values): line(d.values); })
      })
      .on("mouseenter", function(d1){
        // console.log("enter", d1)

        if(activeMenu) return;

        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key != d2.key;
          })
          .style("opacity", 0.2)
          .style("stroke-width", 1.5)
          .attr("stroke", "#999")
          

          linechartSvg
            .selectAll(".bezirke")
            .filter(function(d2){
              // console.log(d2)
              return d1.key == d2.key;
            })
            .moveToFront()
            .attr("stroke", function(d){ return color(d.key); })
            .style("stroke-width", 2.5)
            .style("opacity", 1)
            // .selectAll(".line")
            // .transition()
            // .duration(1000)
            // .attr("d", function(d){ return lineAll(d.values); })
          return false;
      })
      
    // el.append("div")
    //   .style("background", function(d){ return color(d.key); })
    //   .classed("color", true)

    el.append("div")
      // .style("background", function(d){ return color(d.key); })
      .text("×")
      .classed("close", true)

    el.append("div")
      .style("background", function(d){ return color(d.key); })
      // .text(function(d){ return d.mean+"%"; })
      .classed("color", true)

    el.append("div")
      .classed("labell", true)
      .text(function(d){ return d.key; })

    // el.append("span")
    //   .text(function(d){ return parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }))+"%"; })
    
    var linechart = linechartSvg
      .selectAll("g")
      .data(nest2)
      .enter()
      .append("g")
      .attr("transform", function(d,i){  return "translate(" + (i*width + i*(margin.left*2)) + ",0)"})

    
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
    

    var bezirkeG = linechart
      .select1
      .enter()
      .append("g")
      .classed("bezirke", true)
      .attr("stroke", function(d){ return color(d.key); })
    
    // bezirkeG
    //   .append("path")
    //   .classed("ortsteil", true)
    //   // .datum(function(d){console.log(d); return d.values; })
    //   .attr("d", function(d){ return line(d.values); })
    //   .attr("class", "line")

    bezirkeG.selectAll(".ortsteil")
      .data(function(d){ return d.values; })
      .enter()
      .append("path")
      .classed("ortsteil", true)
      // .datum(function(d){console.log(d); return d.values; })
      .attr("d", function(d){ return line(d.values); })
      .attr("class", "line")
      .on("mouseenter", function(d){
        var o = d3.select(this);
        var mouse = d3.mouse(this);

        console.log(d, mouse)

        tooltip.content("<strong>"+d.key+"</strong>");
        tooltip.position([d3.event.pageX, d3.event.pageY]);
        tooltip.show(); 
      })
      
    
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

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
}
