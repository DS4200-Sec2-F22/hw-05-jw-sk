const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

const BAR_FRAME = d3.select("#bar-chart")
                  .append("svgBar")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const SCATTER_FRAME = d3.select("#scatter-plot")
                  .append("svgScat")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame")

function build_bar_plot() {

  d3.csv("bar-data/data.csv").then((data) => {

    const MAX_Y = d3.max(data, (d) => { return parseInt(d.Value); });
    
    const X_SCALE = d3.scaleBand() 
                      .domain(data.map(function(d) {return d.Category; })) 
                      .range([0, VIS_WIDTH])
                      .padding(0.2);


    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_Y * 1.2)]) 
                      .range([0, VIS_HEIGHT]); 

    BAR_FRAME.selectAll(".bar")  
        .data(data)
        .enter()       
        .append("rect")  
          .attr("x", (d) => { return (X_SCALE(d.Category) + MARGINS.left);})
          .attr("y", (d) => { return (VIS_HEIGHT - MARGINS.top - Y_SCALE(d.Value));})
          .attr("width", X_SCALE.bandwidth())
          .attr("height", (d) => { return Y_SCALE(d.Value)})
          .attr("class", "bar");

    BAR_FRAME.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(4)) 
            .attr("font-size", '20px'); 


  });
}

function build_scatter_plot() {

  d3.csv("scatter-data/data.csv").then((data) => {

    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
    
    const X_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_X * 1.2)]) 
                      .range([0, VIS_WIDTH])
                      .padding(0.2);


    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_Y * 1.2)]) 
                      .range([VIS_HEIGHT,0]); 

    SCATTER_FRAME.selectAll("dot")  
        .data(data)
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE(d.x));})
          .attr("cy", (d) => { return (Y_SCALE(d.y));})
          .attr("width", X_SCALE.bandwidth())
          .attr("height", (d) => { return Y_SCALE(d.y)})
          .attr("class", "bar");

    SCATTER_FRAME.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(4)) 
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








