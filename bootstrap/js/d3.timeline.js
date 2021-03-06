
function Timeline(){
  var chart = {};

  var margin = {top: 50, right:15, bottom: 50, left: 30},
      width = 390 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

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
      .y(function(d) { return y(d.mean); })

  var lineAll = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.jahr); })
      .y(function(d) { return y(d.value); })
  

  var menu = d3.select("#compare-legend").append("div").classed("menu", true);
  
  // var svg = d3.select("#compare").append("svg")
  //     .attr("width", (width + margin.left + margin.right)*2)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  // var axisSvg = svg.append("g")
  var linechartSvg = d3.select("#compare .chart");

  var state = { activeMenu: false, item: null };
  var title = { leitung16: "> 16Mbit", leitung50: "> 50Mbit"}

  chart.load = function(data2){
    
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

    var bezirke = d3.nest()
      .key(function(d) { return d.bezirk; })
      .entries(data2)

    bezirke
      .forEach(function(d){
        d.mean = parseInt(d3.mean(d.values.filter(function(d) { return d.jahr == "2015"}), function(d){ return d.value; }));
      })

    bezirke
      .sort(function(a,b){ return b.mean - a.mean; })

    menu.on("mouseout", function(d1){
        if(state.activeMenu) return;
        linechartSvg
          .classed("active", false)
          .selectAll(".bezirke")
          .classed("active", false)
      })

    var entry = menu
      .selectAll("div")
      .data(bezirke)
      .enter()
      .append("div")
      .classed("entry", true)
      .on("click", function(d1){

        menu
          .selectAll(".entry")
          .classed("hover", false)

        if(state.item == d1.key && state.activeMenu){

          state.activeMenu = false;
          linechartSvg
            
            .selectAll(".bezirke")
            .selectAll(".ortsteil")
            .transition()
            .attr("d", function(d){ return line(d.values); })
            .each("end", function(d,i){
              if(i==0) linechartSvg.classed("expand", false).classed("active", false)
            })
        } else {
          state.activeMenu = true;
          linechartSvg.classed("expand", true).classed("active", true)

          linechartSvg 
            .selectAll(".bezirke")
            .selectAll(".ortsteil")
            .transition()
            .attr("d", function(d){ return line(d.values); })


          linechartSvg
            .selectAll(".bezirke")
            .classed("active", function(d2){ return d1.key == d2.key; })
            .filter(".active")
            .moveToFront()
            .selectAll(".ortsteil")
            .transition()
            .attr("d", function(d){ return lineAll(d.values); })
            
        }

        state.item = d1.key;

        menu.selectAll(".entry")
          .classed("active", function(d2){ return (d1.key == d2.key) & state.activeMenu; });

        tooltip.hide()
      
      })
      .on("mouseenter", function(d1){
        if(state.activeMenu) return;

        menu
          .selectAll(".entry")
          .classed("hover", function(d2){ return d2.key == d1.key; })

        linechartSvg
          .classed("active", true)
          .selectAll(".bezirke")
          .classed("active", function(d2){ return d1.key == d2.key; })
          .filter(".active")
            .moveToFront();

      })

    entry.append("div")
      .text("×")
      .classed("close", true)

    entry.append("div")
      .text(function(d){ return d.mean+"%"; })
      .classed("labell", true)

    entry.append("div")
      .classed("labell", true)
      .text(function(d,i){ return d.key; })


    var linechart = linechartSvg
      .selectAll("div")
      .data(nest)
      .enter()
      .append("div")
      .each(function(d){
        return d;
      })
      .attr("class", "col col-xs-12 col-sm-4 col-lg-4")
     // .call(makeAxis)
      .append("svg")
      .attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
      // .attr('preserveAspectRatio', 'xMidYMid meet')
      // .attr("width", (width + margin.left + margin.right))
      // .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(makeAxis)
      .append("g")

    linechart.append("text")
      .text(function(d){ return title[d.key]; })
      .attr("y", -10)

    
    var bezirkeG = linechart
      .selectAll(".bezirke")
      .data(function(d){ return d.values; })
      .enter()
      .append("g")
      .classed("bezirke", true)


    bezirkeG.selectAll(".ortsteil")
      .data(function(d){ return d.values; })
      .enter()
      .append("path")
      .classed("ortsteil", true)
      .attr("d", function(d){ return line(d.values); }) 
      .on("mouseenter", function(d1){
        var parent = d3.select(this.parentNode).datum();

        menu
          .selectAll(".entry")
          .classed("hover", function(d2){ return d2.key == parent.key && !state.activeMenu; })

        linechartSvg
          .classed("hover", true)
          .selectAll(".bezirke")
          .classed("active", function(d2){ return parent.key == d2.key; })
          .filter(".active")
          .moveToFront()
          
          linechartSvg
            .selectAll(".bezirke")
            .selectAll(".ortsteil")
            .classed("hover", function(d2){ return d1.key == d2.key; })
            .filter(".hover")
            .moveToFront()

        var text = state.activeMenu ? d1.key : parent.key;
        tooltip.content("<strong>"+text+"</strong>");
        tooltip.position([d3.event.pageX, d3.event.pageY]);
        tooltip.show(); 

      })
      .on("mouseleave", function(d1){

        menu
          .selectAll(".entry")
          .classed("hover", false)

        linechartSvg
          .classed("hover", false)
          .selectAll(".bezirke")
          .classed("hover", false)
          .selectAll(".ortsteil")
          .classed("hover", false)

        tooltip.hide(); 
      })
      .on("click", function(d1){
        var parent = d3.select(this.parentNode).datum();
        var m = menu
          .selectAll(".entry")
          .filter(function(d2){
            return parent.key == d2.key;
          })
          .node()
          .click();
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
