
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
      // .y(function(d) { return y(d.value); })
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

    
    console.log("yearMean", yearMean);

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
          .selectAll(".ortsteil")
          .style("stroke-width", 1.5)
          .style("opacity", 1)
          // .attr("stroke", function(d){ return color(d.key); })
          .attr("stroke", "#E60032")
          .selectAll(".ortsteil")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return line(d.values); })

        // return false;
      })
    
    var entry = menu.selectAll("div")
      .data(bezirke)
      .enter()
      .append("div")
      .classed("entry", true)
      // .style('color', function(d){ return color(d.key); })
      .on("click", function(d1){
        activeMenu = d1.highlight = !d1.highlight;

        menu.selectAll(".entry")
          .classed("active", function(d2){ return (d1.key == d2.key) & d1.highlight; });

        
        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key != d2.key;
          })
          // .style("opacity", 0.2)
          .selectAll(".ortsteil")
          .style("stroke-width", 1.5)
          .attr("stroke", "#eee")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return line(d.values); })
          .each(function(d){ d.highlight = false; })


        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key == d2.key;
          })
          .moveToFront()
          // .attr("stroke", function(d){ return color(d.key); })
          .selectAll(".ortsteil")
          .attr("stroke", function(d){ return "#E60032" })
          .style("stroke-width", 2.5)
          .style("opacity", 1)
          .style("display", "block")
          .transition()
          .duration(1000)
          .attr("d", function(d){ return activeMenu ? lineAll(d.values): line(d.values); })
          .each("end", function(d,i){
            // console.log(i)
            if(i != 0 && !activeMenu) d3.select(this).style("display", "none");
          })
          .each(function(d){ d.highlight = true; })
      })
      .on("mouseenter", function(d1){
        // console.log("enter", d1)

        if(activeMenu) return;

        linechartSvg
          .selectAll(".bezirke")
          .filter(function(d2){
            return d1.key != d2.key;
          })
          .selectAll(".ortsteil")
          // .style("opacity", 0.2)
          .style("stroke-width", 1.5)
          .attr("stroke", "#eee")
          .each(function(d){ d.highlight = false; })

          linechartSvg
            .selectAll(".bezirke")
            .filter(function(d2){
              // console.log(d2)
              return d1.key == d2.key;
            })
            .moveToFront()
            // .attr("stroke", function(d){ return color(d.key); })
            .selectAll(".ortsteil")
            .attr("stroke", "#E60032")
            .style("stroke-width", 2.5)
            .style("opacity", 1)
            .each(function(d){ d.highlight = true; })
            // .selectAll(".line")
            // .transition()
            // .duration(1000)
            // .attr("d", function(d){ return lineAll(d.values); })
          return false;
      })

      
    // entry.append("div")
    //   .style("background", function(d){ return color(d.key); })
    //   .classed("color", true)

    entry.append("div")
      // .style("background", function(d){ return color(d.key); })
      .text("×")
      .classed("close", true)

    entry.append("div")
      // .style("background", function(d){ return color(d.key); })
      // .text(function(d){ return d.mean+"%"; })
      .text(function(d){ return d.mean+"%"; })
      .classed("labell", true)

    entry.append("div")
      .classed("labell", true)
      .text(function(d,i){ return d.key; })

    // el.append("span")
    //   .text(function(d){ return parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }))+"%"; })
    

    var linechart = linechartSvg
      .selectAll("g")
      .data(nest)
      .enter()
      .append("g")
      .attr("transform", function(d,i){  return "translate(" + (i*width + i*(margin.left*2)) + ",0)"})
      .call(makeAxis)
      .append("g")
      //.classed("viz", true)

    linechart.append("text")
      .text(function(d){ return title[d.key]; })
      .attr("y", -10)

    
    var activeLine = false;

    var bezirkeG = linechart
      .selectAll(".bezirke")
      .data(function(d){ return d.values; })
      .enter()
      .append("g")
      .classed("bezirke", true)
      // .attr("stroke", function(d){ return color(d.key); })
      .attr("stroke", function(d){ return "#E60032" })
      .on("click", function(d){

      })
      .style("stroke-width", 1.5)

    
    function mouseenter(d, el){
      // console.log("enter", linechart.selectAll(".ortsteil"))
      linechart.selectAll(".ortsteil")
        // .classed("active", function(d2){ return d2.active; })
        .style("stroke-width", function(d2){
          return d2.active ? 2.5 : 1.5;
        })
        .attr("stroke", function(d2){ 
          // console.log(d2)
          // return d2.active ? color(d2.key) : "#EEE";
          return d2.active ? "#E60032" : "#EEE";
        })
        // .style("opacity", function(d2){
        //   return d2.active ? 1 : 0.5;
        // })

      d3.select(el).moveToFront();
      
      var r = d3.select(el).node().getBoundingClientRect();
      // console.log(d)
      var text = !activeMenu ? d.values[0].bezirk : d.key;

      // tooltip.content("<strong>"+text+"</strong>");
      // // tooltip.position([r.right + window.scrollX, r.top + window.scrollY]);
      // tooltip.position([d3.event.pageX, d3.event.pageY]);
      // tooltip.show();
    }

    function mouseleave(d, el){
      linechart.selectAll(".ortsteil")
       // .classed("active", function(d2){ return d2.active; })
       .style("stroke-width", function(d2){
         return d2.active ? 2.5 : 1.5;
       })
       // .attr("stroke", function(d2){ return color(d2.key);  })
       .attr("stroke", "#E60032")
        .style("opacity", 1)

       tooltip.hide(); 
    }

    // bezirkeG
    //   .append("path")
    //   .classed("ortsteil", true)
    //   .datum(function(d){
    //     // d.vals = 
    //     console.log(d); return d;
    //   })
    //   .attr("d", function(d){ return line(d.values); })
    //   .attr("class", "line")

    bezirkeG.selectAll(".ortsteil")
      .data(function(d){ return d.values; })
      .enter()
      .append("path")
      .classed("ortsteil", true)
      // .datum(function(d){console.log(d); return d.values; })
      .attr("d", function(d){ return line(d.values); })
      // .attr("class", "line")
      .style("display", function(d,i){
        return i==0 ? "inherit" : "none";
      })  
      .on("mouseenter", function(d){
        if(!activeLine && activeMenu && !d.highlight) return;
        // if(activeLine) return;
        activeLine = d.active = true;
        console.log(d);

        mouseenter(d, this);
      })
      .on("mouseleave", function(d){
        if(!d.highlight) return;

        console.log(d);
        activeLine = d.active = false;

        mouseleave(d);
      })
 

    };

    


    function makeAxis(selection){
      var svgAxis = selection.append("g");

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
    }


  return chart;
}

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
}
