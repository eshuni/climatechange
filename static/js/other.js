function x(d) {
  return d.years;
}

function y(d) {
  return d.claims;
}

function radius(d) {
  return d.premium;
}

function color(d) {
  return d.sector;
}

function key(d) {
  return d.name;
}

var currentRegion = "";

// Chart dimensions.
var margin = {
    top: 19.5,
    right: 19.5,
    bottom: 19.5,
    left: 39.5
  },
  width = 960 - margin.right,
  height = 500 - margin.top - margin.bottom,
  yearMargin = 10;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scaleLinear().domain([2013, 2019]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]),
    radiusScale = d3.scaleLinear().domain([10000, 100000]).range([0, 50]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// The x & y axes.
formatter = d3.format(".0%");
var xAxis = d3.axisBottom(xScale),
  yAxis = d3.axisLeft(yScale);

// Create the SVG container and set the origin.
var svg = d3.select("#my_dataviz").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

// Add the y-axis.
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

// Add an x-axis label.
svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("Year");

// Add a y-axis label.
svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Temperature");

// Add the year label; the value is set on transition.
var label = svg.append("text")
  .attr("class", "year label")
  .attr("text-anchor", "end")
  .attr("y", height - 24)
  .attr("x", width)
  .text(2014);

var region = svg.append("text")
  .attr("class", "country")
  .attr("y", height - margin.bottom)
  .attr("x", margin.left)
  .text("");

// Load the data.
d3.csv("../final.csv").then (function(data){

  // A bisector since many nation's data is sparsely-defined.
  var bisect = d3.bisector(function(d) {
    return d[0];
  });

  // Add a dot per nation. Initialize the data at 1990, and set the colors.
  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  tooltip.text("my tooltip text");

  var dots = svg.append("g")
    .attr("class", "dots");

  var dot = dots.selectAll(".dot")
    .data(interpolateData(2016))
    .enter().append("circle")
    .attr("class", "dot")
    .style("fill", function(d) {
      return colorScale(color(d));
    })
    .on("mouseover", function(d) {
      tooltip.html("<strong>Product:</strong> " + d.TAVG + "<br><strong>Premium(INR):</strong>"+ d.Region);
      tooltip.attr('class', 'd3-tip');
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(d) {
      tooltip.html("<strong>Product:</strong> " + d.TAVG + "<br><strong>Premium(INR):</strong>"+ d.Region);
      return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function(d) {
      return tooltip.style("visibility", "hidden");
    })
    .call(position)
    .sort(order);

  // Add a title.
  dot.append("text")
    .text(function(d) {
      return d.TAVG;
    });

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
    .duration(30000)
    .ease("linear")
    .tween("year", tweenYear)
    .each("end", enableInteraction);

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) {
        return xScale(x(d));
      })
      .attr("cy", function(d) {
        return yScale(y(d));
      })
      .attr("r", function(d) {
        return radiusScale(radius(d));
      });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
      .domain([2014, 2019])
      .range([box.x + 10, box.x + box.width - 10])
      .clamp(true);

    // Cancel the current transition, if any.
    svg.transition().duration(0);

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

  // Tweens the entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenYear() {
    var year = d3.interpolateNumber(2014, 2019);
    return function(t) {
      displayYear(year(t));
    };
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    dot.data(interpolateData(year), key).call(position).sort(order);
    label.text(Math.round(year));
  }

  // Interpolates the dataset for the given (fractional) year.
  function interpolateData(year) {
    return data.map(function(d) {
      return {
        name: d.Region,
        sector: d.Abbrev,
        years: interpolateValues(d.Date, year),
        premium: interpolateValues(d.PCP, year),
        claims: interpolateValues(d.TAVG, year)
      };
    });
  }

  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1),
      a = values[i];
    if (i > 0) {
      var b = values[i - 1],
        t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
})