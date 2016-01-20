function d3_pulse(){function t(a){r=a,t.init()}var r,a=-1,e;return t.init=function(){r.each(function(a,n){var i=d3.select(this);i.selectAll("*").remove();var c=3,s=2,l=56,o=235,u=1,d=147,p=200,f=10,x=o-l,g=d-u,y=x*c,h=g*c,m=200,v=r.append("svg").attr("id","timemap").attr("viewBox","0 0 "+y+" "+h).attr("preserveAspectRatio","xMidYMid meet"),b=d3.select("#d3_circular").append("svg").attr("id","timeline").attr("viewBox","0 0 "+m+" "+p).attr("preserveAspectRatio","xMidYMid meet").append("g"),w=0,M=24,A=20,k=m/2-f-5,_=5,I=60,P=30,q=5,R=15,j=function(t,r,a){var e=2*Math.PI/24,n=A+a(r)*(k-A);return[n*Math.cos(t*e-Math.PI/2),n*Math.sin(t*e-Math.PI/2)]},B=function(t,r,a){var e=2*Math.PI/24,n=q+a(r)*(R-q);return[n*Math.cos(t*e-Math.PI/2),n*Math.sin(t*e-Math.PI/2)]},E=b.append("g").attr("class","grid").attr("transform","translate("+m/2+","+p/2+")"),H=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];E.selectAll("line").data(H).enter().append("line").attr("x1",function(t){var r=j(t,1,function(t){return t});return r[0]}).attr("x2",function(t){var r=j(t,0,function(t){return t});return r[0]}).attr("y1",function(t){var r=j(t,1,function(t){return t});return r[1]}).attr("y2",function(t){var r=j(t,0,function(t){return t});return r[1]}).style("stroke",function(t,r){return"rgba(0,0,0,"+(.3/24*r+.1)+")"});var Y=d3.svg.arc().innerRadius(A).outerRadius(k).startAngle(function(t){return Math.PI/12*t}).endAngle(function(t){return Math.PI/12*(t+1)});for(E.selectAll("path.bg-pattern").data(H).enter().append("path").attr("class",function(t,r){var a="bg-"+r+" bg-pattern";return a+=r%2===!0?" odd":" even"}).attr("d",Y),n=0;_>n;n++)E.append("circle").attr("cx",0).attr("cy",0).attr("r",(k-A)/_*n+A);var Z=b.append("defs"),F=Z.append("mask").attr("id","hole");F.append("rect").attr("x",-m/2).attr("y",-p/2).attr("width",m).attr("height",p).style("fill","white"),F.append("circle").attr("cx",0).attr("cy",0).attr("r",A),E.append("text").attr("class","timetext").attr("x",0).attr("y",7).attr("text-anchor","middle").text(24),E.append("text").attr("class","octext").attr("x",0).attr("y",-(k+5)).attr("text-anchor","middle").text("00:00"),E.append("text").attr("class","octext").attr("x",0).attr("y",k+13).attr("text-anchor","middle").text("12:00"),E.append("text").attr("class","octext").attr("x",k+5).attr("y",3).attr("text-anchor","start").text("06:00"),E.append("text").attr("class","octext").attr("x",-(k+5)).attr("y",3).attr("text-anchor","end").text("18:00");var L={},N={},U={},V={cix:null,instagram:null,twitter:null},X={cix:[],instagram:[],twitter:[]},z={cix:"rgba(230,0,50,1)",instagram:"rgba(30,55,145,1)",twitter:"rgba(0,115,125,1)"},C={cix:"rgba(230,0,50,0.2)",instagram:"rgba(30,55,145,0.2)",twitter:"rgba(0,115,125,0.2)"};for(var D in X){for(n=0;24>n;n++)X[D].push(0);L[D]=b.append("g").attr("transform","translate("+m/2+","+p/2+")"),N[D]=b.append("g").attr("transform","translate("+m/2+","+p/2+")"),U[D]=d3.scale.linear().range([0,1]),V[D]=d3.select("#legend_"+D+" div").append("svg").attr("height",P),"cix"!==D?V[D].attr("width",I):V[D].attr("width",I/2)}d3.json("http://tsb.sebastianmeier.eu/static/info.json",function(r,a){if(r)return console.error(r);for(var e in X){var n=-Number.MAX_VALUE;switch(e){case"cix":for(var i=[66,48,40,32,29,27,23,19,17,16,14,14,14,15,18,20,23,28,32,37,40,45,46,49,53,54,57,60,65,69,67,71,76,74,71,77,75,78,88,74,78,84,83,87,81,74,74,72,66],c=[],s=0;s<i.length;s++)c.push({x:s/2,y:i[s]});break;case"instagram":var c=t.reorder("instagram",a);break;case"twitter":var c=t.reorder("twitter",a)}for(X[e]=c,s=0;s<c.length;s++)c[s].y>n&&(n=c[s].y);U[e].domain([0,n]),L[e].selectAll("circle").data(X[e]).enter().append("circle").attr("cx",function(t,r){var a=j(t.x,t.y,U[e]);return a[0]}).attr("cy",function(t,r){var a=j(t.x,t.y,U[e]);return a[1]}).style("fill",z[e]).attr("r",1);var l=d3.svg.line().x(function(t,r){var a=j(t.x,t.y,U[e]);return a[0]}).y(function(t,r){var a=j(t.x,t.y,U[e]);return a[1]}),o=d3.svg.line().x(function(t,r){var a=B(t.x,t.y,U[e]);return a[0]}).y(function(t,r){var a=B(t.x,t.y,U[e]);return a[1]});if(N[e].append("path").attr("d",function(){return l(X[e])+" Z"}).style("stroke",z[e]).style("fill",C[e]).attr("mask","url(#hole)").attr("class",e),V[e].append("path").attr("d",function(){return o(X[e])+" Z"}).style("stroke",z[e]).style("fill",C[e]).attr("transform","translate("+P/2+" "+P/2+")"),V[e].append("circle").attr("cx",0).attr("cy",0).attr("r",q-2).style("stroke",z[e]).style("fill","#fff").attr("transform","translate("+P/2+" "+P/2+")"),"cix"!==e)for(V[e].append("line").attr("x1",I/2).attr("x2",I/2).attr("y1",0).attr("y2",P).attr("stroke","rgba(0,0,0,0.2)"),s=0;6>s;s++)V[e].append("circle").attr("cx",I-P+10+Math.random()*(I-P-12)).attr("cy",Math.random()*(P-4)+2).attr("r",2).style("fill",z[e]).style("stroke","none")}});var G,J,K,O,Q,S,T,W={twitter:null,instagram:null},tt=["rgba(0,0,0,0.1)","rgba(255,255,178,0.3)","rgba(254,204,92,0.3)","rgba(253,141,60,0.3)","rgba(240,59,32,0.3)","rgba(189,0,38,0.3)"];v.append("image").attr("xlink:href","images/pulse_background_lg.png").attr("x",0).attr("y",0).attr("width",542).attr("height",441),d3.csv("http://tsb.sebastianmeier.eu/static/data.csv",function(r,a){G=a,e={instagram:[],twitter:[]},J=[];for(var n=0;24>n;n++)for(var i in e)e[i].push([]);a.forEach(function(t,r,a){J[t.x]||(J[t.x]=[]),J[t.x][t.y]=1,e.twitter[t.hour][t.x]||(e.twitter[t.hour][t.x]=[]),e.instagram[t.hour][t.x]||(e.instagram[t.hour][t.x]=[]),e.twitter[t.hour][t.x][t.y]=t.twitter,e.instagram[t.hour][t.x][t.y]=t.instagram}),K=[];for(var o in J)for(var d in J[o])K.push({x:o,y:d});v.selectAll("circle.instagram").data(K).enter().append("circle").attr("cx",function(t){return(t.x-l)*c-1}).attr("cy",function(t){return(t.y-u)*c-1}).attr("r",s).attr("o",0).attr("dx",function(t){return t.x}).attr("dy",function(t){return t.y}).attr("type","instagram").attr("class",function(t){return"cell instagram instagram_cell_"+t.x+"_"+t.y}).style("fill",function(t){return"rgba(30,55,145,1)"}),v.selectAll("circle.twitter").data(K).enter().append("circle").attr("cx",function(t){return(t.x-l)*c+1}).attr("cy",function(t){return(t.y-u)*c+1}).attr("dx",function(t){return t.x}).attr("dy",function(t){return t.y}).attr("r",s).attr("type","twitter").attr("o",0).attr("class",function(t){return"cell twitter twitter_cell_"+t.x+"_"+t.y}).style("fill",function(t){return"rgba(0,115,125,1)"}),S=d3.max(a,function(t){return Math.sqrt(t.twitter)}),T=d3.min(a,function(t){return Math.sqrt(t.twitter)}),O=d3.max(a,function(t){return Math.sqrt(t.instagram)}),Q=d3.min(a,function(t){return Math.sqrt(t.instagram)}),W.twitter=d3.scale.linear().domain([0,S]).range([0,1]),W.instagram=d3.scale.linear().domain([0,O]).range([0,1]),t.iterate()})})},t.colorHour=function(r,a){requestAnimationFrame(t.iterate)},t.iterate=function(){a++,a>23&&(a=0),d3.selectAll("path.bg-pattern.odd").style("opacity",.01),d3.selectAll("path.bg-pattern.even").style("opacity",.03);var r=a-2;0>r&&(r+=24);var e=a-3;0>e&&(e+=24);var n=a-4;0>n&&(n+=24),d3.select("path.bg-"+r).style("opacity",.2),d3.select("path.bg-"+e).style("opacity",.1),d3.select("path.bg-"+n).style("opacity",.05),d3.select("path.bg-"+(a-1)).style("opacity",.3),d3.select(".timetext").text(a),t.colorHour(a,"instagram")},t.reorder=function(t,r){var a=[];for(var e in r.histogram[t])a.push({x:e,y:parseInt(r.histogram[t][e])});return a},t}