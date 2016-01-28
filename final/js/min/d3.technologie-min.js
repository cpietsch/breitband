function d3_technologie(){function t(a){e=a,t.init(),t.updateFocus(),$("#techCarousel").on("slide.bs.carousel",function(e){setTimeout(function(){t.updateFocus()},10)})}var e;return t.updateFocus=function(){var t=$("#techCarousel .carousel-indicators .active").data("speed");$(".outline-circle").css("display","none"),$(".outline-circle-"+t).css("display","block")},t.resize=function(){t.init()},t.init=function(){e.each(function(t,e){var a=d3.select(this);a.selectAll("*").remove();var r=a.node().getBoundingClientRect(),n=r.width,s=r.height,i=(n-200)/1.5,o=s-50,l=a.append("svg").attr("width",n).attr("height",s).append("g").attr("transform","translate(30 0)"),d=[1,2,6,16,30,50],c=0,p=0,g=[0,25,50,70,85,95,100],u=o/g.length,h=[6*u,5*u,4*u,3*u,2*u,u,0],f=d3.scale.linear().domain([0,5]).range([0,i]),m=d3.scale.ordinal().domain(["1","2","3","4","5","6"]).rangePoints([0,i]),b=d3.scale.linear().domain([0,2]).range([0,i]),v=d3.scale.ordinal().domain(["1","2","3"]).rangePoints([0,i/2]),x=d3.scale.linear().domain(g).range(h),y=d3.svg.line().x(function(t,e){return f(e)}).y(function(t){return x(t)}),k=d3.svg.axis().scale(x).orient("left").tickFormat(function(t,e){var a=t;return 100===t&&(a+="%"),a}).tickValues([0,25,50,70,85,95,100]),w=d3.svg.axis().scale(x).orient("right").tickFormat(function(t,e){var a=t;return 100===t&&(a+="%"),a}).tickValues([0,25,50,70,85,95,100]),F=d3.svg.axis().scale(m).orient("bottom").tickFormat(function(t,e){var a="≥"+d[parseInt(t)-1];return 1===t&&(a+=" Mbit/s"),a}),P=d3.svg.axis().scale(v).orient("bottom").tickFormat(function(t,e){var a="≥"+d[parseInt(t)-1];return 3===t&&(a+=" Mbit/s"),a}),T=l.append("g").attr("transform","translate(50, 50)");T.append("text").attr("class","headline").text("Leitungsgebunden").attr("transform","translate(-5, -25)");var L=l.append("g").attr("transform","translate("+(50+i+50)+", 50)");L.append("text").attr("class","headline").text("Drahtlos").attr("transform","translate(-5, -25)");var A=l.append("g");L.append("image").attr("class","technology").attr("xlink:href","images/wireless@2x.png").attr("width",50).attr("height",30).attr("x",-50).attr("y",-50),T.append("image").attr("class","technology").attr("xlink:href","images/cable@2x.png").attr("width",40).attr("height",27.5).attr("x",-50).attr("y",-50),[0,25,50,70,85,95,100].forEach(function(t,e,a){T.append("line").attr("class","bg").attr("x1",-10).attr("x2",1.5*i+10+50).attr("y1",x(t)).attr("y2",x(t))});var M=[{"short":"DSL","long":"Digital Subscriber Line",description:"",type:"cabel",speeds:[99.7,99.86,99.37,95.66,81.43,37.54]},{"short":"CATV","long":"Kabelnetz",description:"",type:"cabel",speeds:[88.92,88.92,88.92,88.92,88.92,88.92]},{"short":"FTTX","long":"Faseroptische Technologie",description:"",type:"cabel",speeds:[.35,.35,.35,.35,.35,.35]},{"short":"LTE","long":"Long Term Evolution",description:"",type:"mobile",speeds:[100,100,95.07]},{"short":"HSDPA","long":"Breitband-UMTS",description:"",type:"mobile",speeds:[99.94,43.47]}],S=["translate("+(f(0)+50)+" "+(x(M[0].speeds[0])+50+20)+")","translate("+(f(0)+50)+" "+(x(M[1].speeds[0])+50+20)+")","translate("+(f(0)+50)+" "+(x(M[2].speeds[0])+50-10)+")","translate("+(f(M[3].speeds.length-1)+i+100+5)+" "+(x(M[3].speeds[M[3].speeds.length-1])+50+6)+")","translate("+(f(M[4].speeds.length-1)+i+100+5)+" "+(x(M[4].speeds[M[4].speeds.length-1])+50+6)+")"];T.append("defs").append("pattern").attr("id","missing_pattern").attr("width",44).attr("height",44).attr("patternUnits","userSpaceOnUse").append("image").attr("width",44).attr("height",44).attr("x",0).attr("y",0).attr("xlink:href","images/pattern.png"),T.append("path").attr("class","missing").attr("d",y(M[0].speeds)+"L"+f(M[0].speeds.length-1)+",0Z"),L.append("path").attr("class","missing").attr("d",y(M[3].speeds)+"L"+f(M[3].speeds.length-1)+",0Z"),M.forEach(function(t,a,r){var n;"mobile"===t.type?(n="rgba("+colorPalletes.green[p][0]+","+colorPalletes.green[p][1]+","+colorPalletes.green[p][2]+",1)",p++):(n="rgba("+colorPalletes.blue[c][0]+","+colorPalletes.blue[c][1]+","+colorPalletes.blue[c][2]+",1)",c++);var s=T;"mobile"===t.type&&(s=L),A.append("text").text(t["short"]).attr("class","speed-label").style("fill",n).attr("transform",S[a]);var i=s.append("g");i.append("path").style("stroke",n).datum(t.speeds).attr("d",y),i.selectAll("circle.fill-cirlce").data(t.speeds).enter().append("circle").on("mouseover",function(){var t=d3.select(this);tooltip.content("<strong>"+t.attr("data-short")+"</strong><br />mit einer Geschwindigkeit von<br /> bis zu "+d[parseInt(t.attr("data-speed"))]+" Mbit/s ist in "+t.attr("data-d")+"%<br /> von Berlin verfügbar."),tooltip.position([d3.event.pageX,d3.event.pageY]),tooltip.show()}).on("mouseout",tooltip.hide()).attr("r",3).attr("data-type",t.type).attr("data-short",t["short"]).attr("data-long",t["long"]).attr("data-d",function(t){return t}).attr("data-i",function(t){return e}).attr("data-speed",function(t,e){return e}).attr("data-description",t.description).attr("class","fill-circle").style("fill",n).attr("cx",function(t,e){return f(e)}).attr("cy",function(t,e){return x(t)}),i.selectAll("circle.outline-cirlce").data(t.speeds).enter().append("circle").attr("r",5).on("mouseover",function(){var t=d3.select(this);tooltip.content("<strong>"+t.attr("data-short")+"</strong><br />mit einer Geschwindigkeit von<br /> bis zu "+d[parseInt(t.attr("data-speed"))]+" Mbit/s ist in "+t.attr("data-d")+"%<br /> von Berlin verfügbar."),tooltip.position([d3.event.pageX,d3.event.pageY]),tooltip.show()}).attr("data-type",t.type).attr("data-short",t["short"]).attr("data-long",t["long"]).attr("data-d",function(t){return t}).attr("data-i",function(t){return e}).attr("data-speed",function(t,e){return e}).attr("data-description",t.description).on("mouseout",tooltip.hide()).style("fill",n).attr("class","outline-circle outline-circle-"+t["short"]).attr("cx",function(t,e){return f(e)}).attr("cy",function(t,e){return x(t)})}),T.append("g").attr("class","x axis").attr("transform","translate(0,"+(o-u+10)+")").call(F),T.append("g").attr("transform","translate(-10, 0)").attr("class","y axis").call(k),L.append("g").attr("transform","translate("+(i/2+10)+", 0)").attr("class","y axis").call(w),L.append("g").attr("class","x axis").attr("transform","translate(0,"+(o-u+10)+")").call(P)})},t}