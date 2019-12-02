// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 40},
    width = 900 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../static/data/final.csv").then(function(data) {
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
      .attr("text-anchor", "middle")
      .attr("x", width)
      .attr("y", height+50 )
      .text("Average Temperature per Region");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", -20 )
      .text("Percipitation Index per Region")
      .attr("text-anchor", "start");

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 75]);

  // Add a scale for bubble color
  var myColor2 = function(region) {
    switch (region) {
      case "Northeast":
        return "red";
      
      case "Southeast":
        return "green";

      case "West":
        return "blue";
      
      default:
        return "yellow";
    }
  }

  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
  // svg.append('g')
  //   .selectAll("dot")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //     .attr("class", function(d) { return "bubbles " + d.Region })
  //     .attr("cx", function (d) { return x(d.TAVG); } )
  //     .attr("cx", d => x(d.TAVG))
  //     .attr("cy", d => y(d.PCP))
  //     .attr("r", d => z(d.PDSI_POS))
  //     .style("fill", d => myColor2(d.Region));


    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

  

    // Add legend: circles
  var valuesToShow = [5, 20, 50]
  var xCircle = 380

  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return height - 1 - z(d) } )
      .attr("r", function(d){ return z(d) })
      .style("fill", "none")
      .attr("stroke", "black")
      
  // // Legend title
  svg.append("text")
    .attr('x', xCircle)
    .attr("y", height - 100 +30)
    .text("PDSI")
    .attr("text-anchor", "middle")

  // // Add one dot in the legend for each name.
  var size = 20
  var allgroups = ["Northeast", "Southeast", "West"]
  svg.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
      .attr("cx", 390)
      .attr("cy", function(d,i){ return 1 + i*(size+5)}) 
      .attr("r", 7)
      .style("fill", function(d){ return myColor2(d)});

  // Add labels beside legend dots
  var dot = svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
      .attr("x", 390 + size*.8)
      .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) 
      .style("fill", function(d){ return myColor2(d)})
      .text(function(d){ return d});

  var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 25)
    .attr("x", width)
    .text(2014);


// Load the data.
drawMotionChart(data);

function drawMotionChart() {

  // Add a dot per nation. Initialize the data at 1990, and set the colors.
  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  tooltip.text("my tooltip text");

  // Add an overlay for the year label.
  var box = label.node().getBBox();

  var overlay = svg.append("rect")
    .attr("class", "overlay")
    .attr("x", box.x)
    .attr("y", box.y)
    .attr("width", box.width)
    .attr("height", box.height)
    .on("mouseover", enableInteraction);

  // Start a transition that interpolates the data based on year.
  svg.transition()
    .duration(5000)
    // .ease("linear")
    .tween("year", tweenYear)
    .each("end", enableInteraction);

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
      .domain([2014, 2018])
      .range([box.x + 10, box.x + box.width - 10])
      .clamp(true);

    overlay.on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousemove", mousemove)
      .on("touchmove", mousemove);

    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  function tweenYear() {
    var year = d3.interpolateNumber(2014, 2018);
    return function(t) {
      displayYear(year(t));
    };
  }

  // For the interpolated data, the dots and label are redrawn.
  // Updates the display to show the specified year.
  function displayYear(year) {

    let filteredDat = interpolateValues(year);
    console.log(filteredDat);

    // Add dots
    dot = svg.append('g')
    .selectAll("dot")
    .data(interpolateValues(year))
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Region })
      .attr("cx", function (d) { return x(d.TAVG); } )
      .attr("cx", d => x(d.TAVG))
      .attr("cy", d => y(d.PCP))
      .attr("r", d => z(d.PDSI_POS))
      .style("fill", d => myColor2(d.Region))
      .on("mouseover", function(d) {
        tooltip.html("<strong>TAVG:</strong> " + d.TAVG + "<br><strong>Precipitation Index:</strong>"+ d.PCP);
        tooltip.attr('class', 'd3-tip');
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d) {
        tooltip.html("<strong>TAVG:</strong> " + d.TAVG + "<br><strong>Precipitation Index:</strong>"+ d.PCP);
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function(d) {
        return tooltip.style("visibility", "hidden");
      });

    // Add a title.
    dot.append("text")
      .text(function(d) {
        return d.name;
      });

    console.log(dot);
    label.text(Math.round(year));
  }

  // Interpolates the dataset for the given (fractional) year.
  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(year) {
    year = parseInt(year);
    console.log(year);
    let filteredData = data.filter(function(row) {return row.Date == year; });
    console.log(filteredData);
    return filteredData;
  }
}
});