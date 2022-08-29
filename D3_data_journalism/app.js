// @TODO: YOUR CODE HERE!

var svgWidth = 900;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 50,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group to hold chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data
d3.csv("data.csv").then((incomingData) => {

    // parse data as numbers
    incomingData.forEach((data) => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var data = incomingData;
    console.log(data);

    // create scale
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty) + 2])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(data, d => d.healthcare) + 3])
        .range([height, 0]);

    // create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle");

    // create circle labels
    var circleLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => { return xLinearScale(d.poverty) })
        .attr("y", d => { return yLinearScale(d.healthcare) })
        .text(function (d) { return d.abbr })
        .attr("font-size", "9px")
        .attr("class", "stateText");

    // create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width - 420}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    // create title
    chartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", -6)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Lacks Healthcare % vs In Poverty % by State");

    // create tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });
    chartGroup.call(toolTip);

    // create event listeners for tooltip
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
});