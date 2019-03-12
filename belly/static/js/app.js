function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var defaultURL = `/metadata/${sample}`;
  d3.json(defaultURL).then((data) => {
    console.log(data);
    
    var selector = d3.select("#sample-metadata");
    // console.log(selector);

// Use `.html("") to clear any existing metadata
    selector.html("");


  // for each key add table data
  Object.entries(data).forEach(([key, value]) => {
    selector.append("p")
    .text(`${key}:${value}`);
  });
});
}


// Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
  d3.json(defaultURL).then((data) =>{

    var labels=data.otu_labels;
    var code=data.otu_ids;
    var count =data.sample_values;
    
    // @TODO: Build a Bubble Chart using the sample data

    var bubblelayout = {
    title: "Belly Button Bubble",
    margin: {t:0},
    hovermode:"closest",
    xaxis: {title:"OTU ID"},

  };
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var bubbledata=[{
      x:code,
      //code.slice(0,10)
      y:count,
      text: labels,
      mode: "markers",
      marker: {
      size:count,
      color:code,
      colorscale: "Earth",
      }

    }];

//       var layout = {
//           title: "Belly Button"}
//       Plotly.plot("pie", info, layout);
//     });

// };

Plotly.newPlot("bubble",bubbledata,bubblelayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

//Initialize the dashboard
init();
