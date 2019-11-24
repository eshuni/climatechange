// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
      .text("Percipitation per Region")
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
        break;
      
      case "Southeast":
        return "green";
        break;

      case "West":
        return "blue";
        break;
      
      default:
        return "yellow";
    }
  }


  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white");

  // // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Region: " + d.Region)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  };
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  };
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  };


  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }

  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Region })
      .attr("cx", function (d) { return x(d.TAVG); } )
      .attr("cx", d => x(d.TAVG))
      .attr("cy", d => y(d.PCP))
      .attr("r", d => z(d.PDSI_POS))
      .style("fill", d => myColor2(d.Region))
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

  

    // Add legend: circles
    var valuesToShow = [5, 20, 50]
    var xCircle = 390
    var xLabel = 440

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

    // // Add legend: segments
    // svg
    //   .selectAll("legend")
    //   .data(valuesToShow)
    //   .enter()
    //   .append("line")
    //     .attr('x1', function(d){ return xCircle + z(d) } )
    //     .attr('x2', xLabel)
    //     .attr('y1', function(d){ return height - 1 - z(d) } )
    //     .attr('y2', function(d){ return height - 1 - z(d) } )
    //     .attr('stroke', 'black')
    //     .style('stroke-dasharray', ('2,2'))

    // // Add legend: labels
    // svg
    //   .selectAll("legend")
    //   .data(valuesToShow)
    //   .enter()
    //   .append("text")
    //     .attr('x', xLabel)
    //     .attr('y', function(d){ return height - 1 - z(d) } )
    //     .text( function(d){ return d/1 } )
    //     .style("font-size", 0.5)
    //     .attr('alignment-baseline', 'right')

    // // Legend title
    svg.append("text")
      .attr('x', xCircle)
      .attr("y", height - 100 +30)
      .text("Palmer Drought Severity Index (PDSI)")
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
        .style("fill", function(d){ return myColor2(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", 390 + size*.8)
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) 
        .style("fill", function(d){ return myColor2(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "left")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    var label = svg.append("text")
      .attr("class", "year label")
      .attr("text-anchor", "end")
      .attr("y", height - 25)
      .attr("x", width)
      .text(2014);

    // // Add an overlay for the year label.
    // var box = label.node().getBBox();

    // var overlay = svg.append("rect")
    //     .attr("class", "overlay")
    //     .attr("x", box.x)
    //     .attr("y", box.y)
    //     .attr("width", box.width)
    //     .attr("height", box.height)
    //     .on("mouseover", enableInteraction);

    //   // Start a transition that interpolates the data based on year.
    //   svg.transition()
    //       .duration(300000)
    //       .ease("linear")
    //       .tween("year", tweenYear)
    //       .each("end", enableInteraction);
    // // After the transition finishes, you can mouseover to change the year.
    // function enableInteraction() {
    //   var yearScale = d3.scale.linear()
    //       .domain([2014, 2018])
    //       .range([box.x + 10, box.x + box.width - 10])
    //       .clamp(true);

    //   // Cancel the current transition, if any.
    //   svg.transition().duration(0);

    //   overlay
    //       .on("mouseover", mouseover)
    //       .on("mouseout", mouseout)
    //       .on("mousemove", mousemove)
    //       .on("touchmove", mousemove);

    //   function mouseover() {
    //     label.classed("active", true);
    //   }

    //   function mouseout() {
    //     label.classed("active", false);
    //   }

    //   function mousemove() {
    //     displayYear(yearScale.invert(d3.mouse(this)[0]));
    //   }
    // }

    // // Tweens the entire chart by first tweening the year, and then the data.
    // // For the interpolated data, the dots and label are redrawn.
    // function tweenYear() {
    //   var year = d3.interpolateNumber(2014, 2018);
    //   return function(t) { displayYear(year(t)); };
    // }
  })

