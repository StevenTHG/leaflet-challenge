// Build query URL
queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Initialize variable to hold earthquake markers
var eqMarkers = [];

// Use D3 to retrieve the geoJSON data
d3.json(queryUrl).then(function (data) {
    earthquakes = data.features;
    for (i = 0; i < earthquakes.length; i++) {
        // Conditionals for color based on depth of earthquake
        var color = "";
        if (earthquakes[i].geometry.coordinates[2] < 10) {
          color = "green";
        }
        else if (earthquakes[i].geometry.coordinates[2] < 30) {
          color = "limegreen";
        }
        else if (earthquakes[i].geometry.coordinates[2] < 50) {
          color = "greenyellow";
        }
        else if (earthquakes[i].geometry.coordinates[2] < 70) {
            color = "yellow";
        }
        else if (earthquakes[i].geometry.coordinates[2] < 90) {
        color = "orange";
        }
        else {
          color = "red";
        }

        eqMarkers.push(
            L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
                fillOpacity: 0.75,
                color: "grey",
                fillColor: color,
                // Adjust the radius based on magnitude
                radius: (earthquakes[i].properties.mag + 1) * 2000
              }).bindPopup(`<h3>Location: ${earthquakes[i].properties.place}</h3><hr><p>Time: ${new Date(earthquakes[i].properties.time)}</p><p>Magnitude: ${earthquakes[i].properties.mag}</p><p>Depth: ${earthquakes[i].geometry.coordinates[2]}</p>`)
        )
            
        L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "grey",
            fillColor: color,
            // Adjust the radius based on magnitude
            radius: (earthquakes[i].properties.mag + 1) * 2000
          }).bindPopup(`<h3>Location: ${earthquakes[i].properties.place}</h3><hr><p>Time: ${new Date(earthquakes[i].properties.time)}</p><p>Magnitude: ${earthquakes[i].properties.mag}</p><p>Depth: ${earthquakes[i].geometry.coordinates[2]}</p>`).addTo(myMap)
    };
});

// Define variables for our tile layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create earthquake layer group
var eqLayer = L.layerGroup(eqMarkers);

// Only one base layer can be shown at a time.
var baseMaps = {
  'Street': street,
  'Topography': topo
};

// Create and overlap object
var overLayMaps = {
    "Earthquakes": eqLayer
};

// Create a map object, and set the default layers.
var myMap = L.map("map", {
  center: [39.00, -110.00],
  zoom: 5,
  layers: [street,eqLayer]
});

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps,overLayMaps, {
    collapsed: false
}).addTo(myMap);