// Creating map object
var myMap = L.map("map", {
    center: [41.25, -95.93],
    zoom: 4
  });
  // Create backgrounds of map
// grayscale background
var grayScale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic2lnZGVseXIiLCJhIjoiY2sycnE4eWxxMGhsazNobzhiamJ6MWlvdiJ9.AsezQd9QitthJ-65UGvhkw");

// satellite background
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic2lnZGVseXIiLCJhIjoiY2sycnE4eWxxMGhsazNobzhiamJ6MWlvdiJ9.AsezQd9QitthJ-65UGvhkw");

// outdoors background.
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic2lnZGVseXIiLCJhIjoiY2sycnE4eWxxMGhsazNobzhiamJ6MWlvdiJ9.AsezQd9QitthJ-65UGvhkw");

// adding the layer on greymap
satellite.addTo(myMap);

// base layers
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayScale,
  Outdoors: outdoors
};
// control which layers are visible
L.control
.layers(baseMaps)
.addTo(myMap);
// grabbing data 
var statesData = "../static/data/states.json";
var climateData = "../static/data/climate.json";

westArray = ["California", "Nevada"];
southEastArray = ["Virginia", "North Carolina", "South Carolina", "Georgia", "Alabama", "Florida"];
northEastArray = ["Connecticut", "Delaware", "Maine", "Massachusetts", "Maryland", "New Hampshire", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont"];

// load in state data:
d3.json(statesData, function(stateResponse) {
    // let stateFeatures = stateResponse.features;

// load in climate data
    d3.json(climateData, function(climateResponse) {
        // for each state:
        for(var i = 0; i < stateResponse.features.length; i++){
            var state = stateResponse.features[i].properties.name;

            // test whether it is in the Western US
            if(westArray.includes(state)){
                stateResponse.features[i].properties.temperature = climateResponse[59]["TAVG"];
                stateResponse.features[i].properties.date = climateResponse[59]["Date"];
            }
            if(southEastArray.includes(state)){
                stateResponse.features[i].properties.temperature = climateResponse[179]["TAVG"];
                stateResponse.features[i].properties.date = climateResponse[179]["Date"];
            }
            else if(northEastArray.includes(state)){
                stateResponse.features[i].properties.temperature = climateResponse[119]["TAVG"];
                stateResponse.features[i].properties.date = climateResponse[119]["Date"];

            }
        }  
        //Add GeoJSON
        L.geoJson(stateResponse, {
            // Define what  property in the features to use
            valueProperty: "temperature",
            // Set color scale
            scale: ["#ffffb2", "#b10026"],
            // Number of breaks in step range
            steps: 10,

            // q for quartile, e for equidistant, k for k-means
            mode: "q",

            style: function (feature) {
                console.log(feature)
                return {
                    fillColor: getColor(feature.properties.name),
                    color: "#fff",
                    weight: 1.0,
                    fillOpacity: 0.8
                };
            },

            // style: { 
            //     // style
            //     // fillColor: function () { 
            //     //     console.log(arguments);
            //     //     debugger;
            //     //     return getColor(feature.properties.name); 
            //     // },
            //     // Border color
            //     color: "#fff",
            //     weight: 1,
            //     fillOpacity: 0.8
            // },

            onEachFeature: function(feature, layer) {
                layer.bindPopup("State: " + feature.properties.name + 
                "<br>Temperature:<br>" + feature.properties.temperature + "<br>Date:<br>" + feature.properties.date);
            }

        }).addTo(myMap); 

        console.log(stateResponse);

        // Binding a pop-up to each layer
        function getColor(d) {
            return westArray.includes(d) ? '#800026' :
                   northEastArray.includes(d) ? '#BD0026' :
                   southEastArray.includes(d) ?'#E31A1C':
                   '#FFEDA0'; 
        }
    
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.name),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        // L.choropleth(stateResponse, {style: style}).addTo(myMap);
    });

});
