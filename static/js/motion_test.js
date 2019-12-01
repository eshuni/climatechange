// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 30},
    width = 900 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../../Input/final.csv").then(function(data) {
    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//
  
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 100])
      .range([ 0, width ]);
  
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10));
  
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+50 )
        .text("Temperature per Region");
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 10])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20 )
        .text("Percipitation per Region")
        .attr("text-anchor", "start");

     data.forEach(function(d) {
         console.log(d);
     });

    // Add dots
  svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", d => +x(d.TAVG))
    .attr("cy", d => +y(d.PCP))
    .attr("r", "15")
    .style("fill", function (d) { return myColor(d.Region); } );
})