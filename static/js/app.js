function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var meta_url = `/metadata/${sample}`;
    d3.json(meta_url).then(function(sample) {
      var sample_metadata = d3.select("#sample-metadata");
      console.log(sample_metadata);

    // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(([key, value]) => {
        console.log(`key: ${key} value: ${value}`);
        var row = sample_metadata.append("p");
        row.text(`${key}, ${value}`);
      });
    });
}
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sample_url = `/samples/${sample}`;
    d3.json(sample_url).then(function(data) {


    // @TODO: Build a Bubble Chart using the sample data
    // * Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.
    //   * Use `otu_ids` for the x values.
    //   * Use `sample_values` for the y values.
    //   * Use `sample_values` for the marker size.
    //   * Use `otu_ids` for the marker colors.
    //   * Use `otu_labels` for the text values.
    //https://plot.ly/javascript/bubble-charts/

    //initialize values for bubble chart
      var x = data.otu_ids;
      var y = data.sample_values;
      var text = data.out_labels;
      var color = data.out_ids;
      var size = data.sample_values;
    //initialize values for pie charts
      var values = data.sample_values;
      var labels = data.otu_ids;
      var hovertext = data.otu_labels;

      var traceBubble ={
        x : x,
        y : y,
        text: text,
        mode: 'markers',
        marker: {
          color: color,
          size: size
        }
      };

      var data = [traceBubble];

      var layout = {
        title: 'Bubble Chart',
        xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // * Create a PIE chart that uses data from your samples route (`/samples/<sample>`) to display the top 10 samples.
    //   * Use `sample_values` as the values for the PIE chart.
    //   * Use `otu_ids` as the labels for the pie chart.
    //   * Use `otu_labels` as the hovertext for the chart.
    //https://plot.ly/javascript/pie-charts/

      var pieData = [{
        values: values.slice(0,10),
        labels: labels.slice(0,10),
        type: "pie".slice(0,10),
        hovertext: hovertext
      }];

      Plotly.newPlot("pie", pieData);
    });
}

function init(){
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

// Initialize the dashboard
init();
