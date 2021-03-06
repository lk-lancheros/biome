//==========================================
// function pulls the information 
// about the sample person for display in the html panel

function buildMetadata(sample) {
 
  // fetch the metadata for the sample person
  var defaultURL = `/metadata/${sample}`; 
  d3.json(defaultURL).then((data) => {
  console.log(data);
    
  var selector = d3.select("#sample-metadata");
    
  // clear any existing metadata
  selector.html("");

  // append each metadata key and values 
  Object.entries(data).forEach(([key, value]) => {
  selector.append("p")
  .text(`${key}: ${value}`);

  }); // closes the function for appending each key and value
}); // closes the function for the metadata fetch
} // closes the function buildMetadata(sample)

//==========================================
// function pulls the information 
// about biome contained in the sample 
// for display in the bubble and pie chart

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
  d3.json(defaultURL).then((data) =>{

    var otu_labels=data.otu_labels;
    var code=data.otu_ids;
    var count =data.sample_values;
    var array = []
    for (var d = 0; d < code.length; d++) {
    array.push({'count': count[d], 
    'code': code[d], 'otu_labels': otu_labels[d]}
    )};
    
    var s_array=array.sort(function(a, b) {
      return (b.count) - (a.count);
      
    });
    console.log(s_array);
    s_array=s_array.slice(0,10);
  
    //================================
    // bubble chart: create the layout
    var bubblelayout = {
    title: "Microbes Compared: (Displays All)",
    margin: {r:0},
    hovermode:"closest",
    xaxis: {title:"OTU ID (Microbe identification number)"},
    yaxis: {title:"Counts of microbe"},
    }; // closes funciton: bubblelayout
    
    // bubble chart: organize the data
    var bubbledata=[{
      x:code,
      y:count,
      text: otu_labels,
      mode: "markers",
      marker: {
      size:count,
      color:code,
      colorscale: "Earth",
      } // closes funciton: marker

    }];// closes funciton: bubbledata

    //================================
    // pie chart: create the layout
      var pielayout = {
      title: "Microbe counts vary? (Displays up to 10)",
      indexLabelPlacement: "outside",
      // "layout": "auto"
    }

      //HELP: Want the description words and code number to display on hover but not pie
      var piedata = [{
        "labels": s_array.map(row => row.code),
        "values": s_array.map(row => row.count),
        "text": s_array.map(row => row.otu_labels),
        "textinfo": "percent",
        "hoverinfo":("text"+"labels"+"values"+"percent"),
        "type": "pie",
        }];// closes funciton: piedata"
    // Print the plots to the screen      
    Plotly.newPlot("bubble",bubbledata,bubblelayout);
    Plotly.newPlot("pie",piedata,pielayout);
  });// closes funciton: fetch
} // closes function: buildCharts

//==========================================
// function displays the sample IDs and  
// enables the user to select another sample ID
// which triggers the dynamic update of
// the metadata panel, the bubble chart and pie chart

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
    buildMetadata(firstSample); //comment this out when just working on buildMetadata
  }); //Close 
} // Close funtctin init

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample); //comment this out when just working on buildMetadata
  buildMetadata(newSample);
} // Close optionChanged funtion

//Initialize the dashboard
init();
