// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [41.25, -95.93],
    zoom: 4
});
  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// L.geoJSON(statesFeatures).addTo(myMap);

var statesData = "states.json";
var climateData = "climate.json";


westArray = ["California", "Nevada"];
southEastArray = ["Virginia", "North Carolina", "South Carolina", "Georgia", "Alabama", "Florida"];
northEastArray = ["Connecticut", "Delaware", "Maine", "Massachusetts", "Maryland", "New Hampshire", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont"];


// load in state data:
d3.json(statesData, function(stateResponse) {

    // load in climate data
    d3.json(climateData, function(climateResponse) {

        // for each state:
        for(var i = 0; i < stateResponse.length; i++){
            var state = stateResponse[i].properties.name;

            // test whether it is in the Western US
            if(westArray.includes(state)){
                stateResponse[i].properties.temperature = climateResponse[0]["TAVG"];
                console.log(stateResponse[i]);
            }
            if(southEastArray.includes(state)){
                stateResponse[i].properties.temperature = climateResponse[0]["TAVG"];
                console.log(stateResponse[i]);
                
            }
            else if(northEastArray.includes(state)){
                stateResponse[i].properties.temperature = climateResponse[0]["TAVG"];
                console.log(stateResponse[i]);

            }
            

        }
        L.geoJson(stateResponse).addTo(myMap);
    })
});