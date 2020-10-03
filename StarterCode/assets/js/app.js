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
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
var chosenXAxis = "smokes";
var chosenYAxis = "age";

//Function to update circles with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel;
    var ylabel;

    if (chosenXAxis==="smokes"){
        xlabel = "Smokers:"
    }
    else if (chosenXAxis==="healthcare"){
        xlabel = "No Healthcare:"
    }
    else{
        xlabel = "Obese:";
    }
}