// 2015 Christopher Pietsch
// chrispie.com


var compare = Compare();
var multiple = Multiple();


// var single16 = Single("leitung16");
// var single50 = Single("leitung50");


d3.csv("data/breitband1-refined.csv")
  .get(function(error, data) {

    data.forEach(function(d){
      d.jahr *= 1;
      d.leitung50 *= 1;
      d.leitung16 *= 1;
    });

    console.log(data[0], data[data.length-1], data.length);

    

    d3.json("data/berlin_bezirke.geojson")
      .get(function(error, geo) {
        multiple.load(geo,data);
      })


    compare.load(data);

    // single16.load(data);
    // single50.load(data);

    

  });

