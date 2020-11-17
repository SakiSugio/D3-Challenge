var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// var svg = d3.select("#scatter")
//     .append("div")
//     .classed("chart", true)
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("data.csv").then(function (healthData) {
    
    // Parse Data/Cast as numbers
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    //console.log(healthData)
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([3, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create circles
    var circleGroup = chartGroup.selectAll("stateCircle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15");

    // Create text in circles
    var textGroup = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", "5")
    .text(function(d){return d.abbr});

    //initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display ad hide anf tooltip
    circleGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40 )
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText" , true)
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .classed("aText" , true)
        .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);
    });
 