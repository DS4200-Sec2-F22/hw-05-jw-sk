const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

const FRAME = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

function build_interactive_plot() {

  d3.csv("data/data.csv").then((data) => {

    const MAX_Y = d3.max(data, (d) => { return parseInt(d.Value); });
    
    const X_SCALE = d3.scaleBand() 
                      .domain(data.map(function(d) {return d.Category; })) 
                      .range([0, VIS_WIDTH])
                      .padding(0.2);


    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_Y * 1.2)]) 
                      .range([0, VIS_HEIGHT]); 

    FRAME.selectAll(".bar")  
        .data(data)
        .enter()       
        .append("rect")  
          .attr("x", (d) => { return (X_SCALE(d.Category) + MARGINS.left);})
          .attr("y", (d) => { return (VIS_HEIGHT - MARGINS.top - Y_SCALE(d.Value));})
          .attr("width", X_SCALE.bandwidth())
          .attr("height", (d) => { return Y_SCALE(d.Value)})
          .attr("class", "bar");

    FRAME.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(4)) 
            .attr("font-size", '20px'); 


  });
}

build_interactive_plot();








