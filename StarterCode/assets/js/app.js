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
    .style('border', '2px solid black')

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";


//update toolTip function 
// var circlesGroup = updateTooltip(chosenXAxis, chosenYAxis, circlesGroup);

// Update the x-scale and y-scale upon click
function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);
    return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2])
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

    if (chosenXAxis === "poverty") {
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

    if (chosenYAxis === "obesity") {
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
        .html(function (d) {
            return (`${data.state}<br>${xLabel} ${data[chosenXAxis]}<br>${yLabel} ${data[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(censusData => {

    // CSV data to integers
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // Initial axis functions 
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Initial circles
    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var textCircles = chartGroup.append("g")
        .selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr('class','stateText')
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+2.5)
        .attr("font-size", "10px")
        .style("fill", "white")
        .attr("font-weight", "bold");

    // x axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty(%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age(Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income(Median)");

    // y axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity(%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokers(%)");

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare(%)");

    // event listener for xaxis
    xLabelsGroup.selectAll("text")
        .on("click", function () {
            var xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis) {
                chosenXAxis = xValue;

                xLinearScale = xScale(censusData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);

                // update circlesGroup and text
                circlesGroup = renderXcircles(circlesGroup, xLinearScale, chosenXAxis);
                textCircles = renderXcircles(textCircles, xLinearScale, chosenXAxis);

                circlesGroup = updateTooltip(chosenXAxis, chosenYAxis, circlesGroup);

                // change axis labels to bold
                if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "poverty") {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    // event listener for yaxis
    yLabelsGroup.selectAll("text")
        .on("click", function () {
            var yValue = d3.select(this).attr("value");
            if (yValue !== chosenYAxis) {
                chosenYAxis = yValue;

                yLinearScale = yScale(censusData, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);

                // update circlesGroup and text
                circlesGroup = renderYcircles(circlesGroup, yLinearScale, chosenYAxis);
                textCircles = renderYcircles(textCircles, yLinearScale, chosenYAxis);

                circlesGroup = updateTooltip(chosenXAxis, chosenYAxis, circlesGroup);

                // change axis labels to bold
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "healthcare") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });

});
