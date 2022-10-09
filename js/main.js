const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

const BAR_FRAME = d3.select("#bar-chart")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame"); 

const SCATTER_FRAME = d3.select("#scatter-plot")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame")

function build_bar_plot() {

  d3.csv("data/bar-data.csv").then((data) => {

    const MAX_Y = d3.max(data, (d) => { return parseInt(d.amount); });
    
    const X_SCALE = d3.scaleBand() 
    .range([0, VIS_WIDTH])
    .domain(data.map(function(d) {return d.category;})) 
    .padding(0.2);


    const Y_SCALE = d3.scaleLinear() 
    .domain([0, (MAX_Y * 1.2)]) 
    .range([VIS_HEIGHT, 0]); 

    BAR_FRAME.selectAll(".bar")  
    .data(data)
    .enter()       
    .append("rect")  
    .attr("x", (d) => { return (X_SCALE(d.category) + MARGINS.left);})
    .attr("y", (d) => { return (MARGINS.top + Y_SCALE(d.amount));})
    .attr("width", X_SCALE.bandwidth())
    .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount)})
    .attr("class", "bar");

    BAR_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE).ticks(7)) 
    .attr("font-size", '20px'); 

    BAR_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (MARGINS.top) + ")") 
    .call(d3.axisLeft(Y_SCALE).ticks(10)) 
    .attr("font-size", '20px'); 
  });
}

function build_scatter_plot() {

  d3.csv("data/scatter-data.csv").then((data) => {

    const MAX_X = d3.max(data, (d) => { return parseInt(d.x);});
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y);});
    
    const X_SCALE = d3.scaleLinear() 
    .domain([0, 10]) 
    .range([0, VIS_WIDTH])

    const Y_SCALE = d3.scaleLinear() 
    .domain([0, 10]) 
    .range([VIS_HEIGHT,0]); 

    SCATTER_FRAME.selectAll("dot")  
    .data(data)
    .enter()       
    .append("circle")  
    .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left);})
    .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top);})
    .attr("r", 5)
    .attr("class", "point");

    SCATTER_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE).ticks(11)) 
    .attr("font-size", '20px'); 

    SCATTER_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (MARGINS.top) + ")") 
    .call(d3.axisLeft(Y_SCALE).ticks(11)) 
    .attr("font-size", '20px'); 
  });
}

function addPoint() {
  let objX = document.getElementById("xSelect");
  let xChord = objX.options[objX.selectedIndex].text;

  let objY = document.getElementById("ySelect");
  let yChord = objY.options[objY.selectedIndex].text;  
}

let button = document.getElementById("button1")
button.addEventListener('click', addPoint);

build_bar_plot();
build_scatter_plot();








