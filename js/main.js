
// constants for page set up 
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

// setting the frame for the bar chart
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

// function to build bar plot 
function build_bar_plot() {
  // reading in data 
  d3.csv("data/bar-data.csv").then((data) => {

    const MAX_Y = d3.max(data, (d) => { return parseInt(d.amount); });

    // X scale 
    const X_SCALE = d3.scaleBand() 
    .range([0, VIS_WIDTH])
    .domain(data.map(function(d) {return d.category; })) 
    .padding(0.2);

    // Y scale 
    const Y_SCALE = d3.scaleLinear() 
    .domain([0, (MAX_Y * 1.2)]) 
    .range([VIS_HEIGHT, 0]); 

    // add bars
    BAR_FRAME.selectAll(".bar")  
    .data(data)
    .enter()       
    .append("rect")  
    .attr("x", (d) => { return (X_SCALE(d.category) + MARGINS.left); })
    .attr("y", (d) => { return (MARGINS.top + Y_SCALE(d.amount)); })
    .attr("width", X_SCALE.bandwidth())
    .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
    .attr("class", "bar")
    .on("mouseenter", bar_hover_over)
    .on("mousemove", bar_move)
    .on("mouseleave", bar_hover_out);

    // add X axis 
    BAR_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE).ticks(7)) 
    .attr("font-size", '20px'); 

    // add Y axis 
    BAR_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (MARGINS.top) + ")") 
    .call(d3.axisLeft(Y_SCALE).ticks(10)) 
    .attr("font-size", '20px');

    // create a tooltip
    let tooltip = d3.select("#bar-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "100px")
    .style("height", "75px")
    .style("text-align", "center");


    function bar_hover_over(event, d) {
      // add 'hover' functionality
      // on mouseover, change to green  
      d3.select(event.currentTarget)
      .style("fill", "green");

      tooltip.style("opacity", 1);
    }

    function bar_move(event, d) {
      // add 'hover' tooltop movement functionality and text to the tooltip
      tooltip.html("<p>Category: " + d.category + "</p><p>Value: " + d.amount + "</p>");
      
      // moves the tooltip with the mouse
      tooltip.style("transform", "translate(" + d3.pointer(event)[0] + "px," + (-620 + d3.pointer(event)[1]) + "px)");
    }

    function bar_hover_out(event, d) {
      // on mouseleave, change back to the original color 
      d3.select(event.currentTarget)
      .style("fill", "blueviolet");

      // hides the tooltip
      tooltip.style("opacity", 0);
    }

  });
}

function build_scatter_plot() {
  // reading in data 
  d3.csv("data/scatter-data.csv").then((data) => {

    // find max values 
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
    
    // define scale functions that maps our data values to pixel values (range) 
    const X_SCALE = d3.scaleLinear() 
    .domain([0, 10]) 
    .range([0, VIS_WIDTH]);

    const Y_SCALE = d3.scaleLinear() 
    .domain([0, 10]) 
    .range([VIS_HEIGHT,0]); 

    // use the X_SCALE and Y_SCALE to plot the points 
    SCATTER_FRAME.selectAll("dot")  
    .data(data)
    .enter()       
    .append("circle")  
    .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
    .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); })
    .attr("xchord", (d) => { return d.x; })
    .attr("ychord", (d) => { return d.y; })
    .attr("r", 10)
    .attr("class", "point");

    // adding X axis to the visualization 
    SCATTER_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE).ticks(11)) 
    .attr("font-size", '20px'); 

    // adding Y axis to the visualization 
    SCATTER_FRAME.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
      "," + (MARGINS.top) + ")") 
    .call(d3.axisLeft(Y_SCALE).ticks(11)) 
    .attr("font-size", '20px'); 


    function addPoint() {
      // constants for user selected values
      const new_x = document.getElementById("xSelect");
      const xChord = new_x.options[new_x.selectedIndex].text;

      const new_y = document.getElementById("ySelect");
      const yChord = new_y.options[new_y.selectedIndex].text;

      // push the data to the current data set 
      data.push({'x':xChord, 'y':yChord});

      // removing old points
      SCATTER_FRAME.selectAll('.point')
      .remove();

      // plot with the new updated data set 
      SCATTER_FRAME.selectAll('dot')
      .data(data).enter()
      .append("circle")
      .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
      .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) 
      .attr("xchord", (d) => { return d.x; })
      .attr("ychord", (d) => { return d.y; })
      .attr("r", 10)
      .attr('class', 'point');

      // adding event listeners for all functionality 
      SCATTER_FRAME.selectAll(".point")
      .on("mouseover", hover_over)
      .on("mouseleave", hover_out)
      .on("click", point_clicked);
    }

    function hover_over(event, d) {
      // add 'hover' functionality
      // on mouseover, change to green  
      d3.select(event.currentTarget)
      .style("fill", "green");
    }

    function hover_out(event, d) {
      // on mouseleave, change back to the original color 
      d3.select(event.currentTarget)
      .style("fill", "blueviolet");

    }

    function point_clicked(event, d) {
      // css toggle; when point is clicked, 'yes_border' is activated
      d3.select(this).classed("yes_border", d3.select(this).classed("yes_border") ? false : true);

      // getting coordinates of the current element 
      const xChord = d3.select(this).attr('xchord');
      const yChord = d3.select(this).attr('ychord');

      // updating the display test based on the most recent point clicked
      let display_text = document.getElementById('display_text');
      const objID = "(" + xChord + "," + yChord + ")";
      display_text.innerHTML = "Last point clicked: " + objID;
    }

    // event listener to add point when button is clicked 
    d3.select("#button1").on("click", addPoint);

    // adding event listeners for all functionality 
    SCATTER_FRAME.selectAll(".point")
    .on("mouseover", hover_over)
    .on("mouseleave", hover_out)
    .on("click", point_clicked);

  });

};


build_bar_plot();
build_scatter_plot();






