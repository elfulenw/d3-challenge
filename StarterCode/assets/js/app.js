var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right + 20;
var height = svgHeight - margin.top - margin.bottom - 20;

//Create SVG wrapper and append SVG group to hold the chart
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style('border','2px solid black')

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// Update the x-scale and y-scale upon click
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2])
            .range([0, width]);
    return xLinearScale;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
            .range([height, 0]);
    return yLinearScale;
}

// Update the x and y axis labels upon click
function renderXAxis(xScaleClick, xAxis) {
    var bottomAxis = d3.axisBottom(xScaleClick);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

function renderYAxis(yScaleClick, yAxis) {
    var leftAxis = d3.axisLeft(yScaleClick);
    yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
}

// Update circles group with the new x and y axes upon click
function renderCircles(circlesGroup, xScaleClick, chosenXAxis, yScaleClick, chosenYAxis) {
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", data => xScaleClick(data[chosenXAxis]))
    .attr("cy", data => yScaleClick(data[chosenYAxis]));
    return circlesGroup;
}

// Update circle labels with correct state abbreviations upon click
function renderText(textGroup, xScaleClick, chosenXAxis, yScaleClick, chosenYAxis) {
    textGroup.transition()
    .duration(1000)
    .attr("x", data => xScaleClick(data[chosenXAxis]))
    .attr("y", data => yScaleClick(data[chosenYAxis]));
    return textGroup;
}

// Update circles group with new tooltip
function updateTooltip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel;
    var ylabel;
    var xUnit;
    var yUnit = "%";

    if  (chosenXAxis === "poverty") {
        xlabel = "In Poverty";
        xUnit = "%";
    }
    else if (chosenXAxis === "age") {
        xlabel = "Age (Median)";
        xUnit = "years";
    }
    else {
        xlabel = "Household Income (Median)";
        xUnit = "USD";
    }

    if  (chosenYAxis === "obesity") {
        ylabel = "Obese";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes";
    }
    else {
        ylabel = "Lacks Healthcare";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([40, 60])
        .html(function(d) {
            return (`${data.state}<br>${xLabel} ${data[chosenXAxis]}<br>${yLabel} ${data[chosenYAxis]}%`);
        });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });
        return circlesGroup;
}
