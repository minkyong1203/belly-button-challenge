// Fetch json data and console log it
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    // console.log(data);
    
    //TODO: Add options (names from the dataset) to the Dropdown
    var selectElement = d3.select('#selDataset')
    // use for loop to loop through data["names"] and add an option for each name.
    data["names"].forEach(name => {
        selectElement.append("option").attr("value",name).text(name)
    });


    // Call all functions for the visualizations when change is made to DOM
    d3.selectAll("#selDataset").on("change", function display () {
        metadata();
        updatePlotly();
        bubblePlot();
    });

    // Function to update the metadata when dropdown is selected
    function metadata () {
        // Select the dropdown menu
        let dropdown = d3.select('#selDataset');
        
        // Assign value of dropdown menu to variable
        let selected = dropdown.property("value");

        for (i=0; i<data["metadata"].length; i++) {
            if (data["metadata"][i]["id"] == selected) {
                var demographics = document.getElementById("sample-metadata");
                demographics.innerHTML = 
                    `id: ${String(data["metadata"][i]["id"])} <br>
                    ethnicity: ${String(data["metadata"][i]["ethnicity"])} <br>
                    gender: ${String(data["metadata"][i]["gender"])} <br>
                    age: ${String(data["metadata"][i]["age"])} <br>
                    location: ${String(data["metadata"][i]["location"])} <br>
                    bbtype: ${String(data["metadata"][i]["bbtype"])} <br>
                    wfreq: ${String(data["metadata"][i]["wfreq"])} <br>`;
            }
        }
    }

    // Function to update bar plot when dropdown menu is selected
    function updatePlotly(){

        // Select the dropdown menu
        let dropdown = d3.select('#selDataset');
        
        // Assign value of dropdown menu to variable
        let selected = dropdown.property("value");

        // Find x, y values for the corresponding name (selected) from the dataset.
        for (i=0; i<data["samples"].length; i++) {
            if (data["samples"][i]["id"] == selected) {
                let y_val = data["samples"][i]["otu_ids"].slice(0, 10).map(String);
                let x_val = data["samples"][i]["sample_values"].slice(0, 10);
                y_val = y_val.map(x => 'OTU ' + x);

                let reversedY = y_val.reverse();
                let reversedX = x_val.reverse();

                // Set up trace for bar plot
                let trace = {
                    x: x_val,
                    y: y_val,
                    text: data["samples"][i]["otu_labels"].slice(0, 10),
                    type: "bar",
                    orientation: "h"
                };

                var layout = {
                    yaxis: {
                        type: 'category',
                    },
                    title: 'Top 10 OTU'
                };

                // Plot the bar graph
                Plotly.newPlot("bar", [trace], layout);
            }
        }
    }

    function bubblePlot (){
         // Select the dropdown menu
         let dropdown = d3.select('#selDataset');
        
         // Assign value of dropdown menu to variable
         let selected = dropdown.property("value");

         for (i=0; i<data["samples"].length; i++) {
            if (data["samples"][i]["id"] == selected) {
                let x_val = data["samples"][i]["otu_ids"];
                let y_val = data["samples"][i]["sample_values"];

                let trace = {
                    x: x_val,
                    y: y_val,
                    mode: 'markers',
                    marker: {
                        size: y_val,
                        color: x_val
                    },
                    text: data["samples"][i]["otu_labels"]
                };

                let layout = {
                    xaxis: {
                        title: {
                            text: 'OTU ID'
                        }
                    }
                };

                Plotly.newPlot("bubble", [trace], layout)
            }
         }

    }

});





