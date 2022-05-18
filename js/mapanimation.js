// Add your own access token
mapboxgl.accessToken =
  'pk.eyJ1IjoiY2xhdWRpYS1wYW9sYSIsImEiOiJjbDMyZTdvODQwM3AxM2lzOG02MHlvZnhhIn0.pFjq0r23WnlpQXMspTXCZA';

// Create the map object using mapboxgl.map() function
var cordinates = [];
var remove = false;
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [2.3327100842398067,48.86455614176651],  
  zoom: 13.3,
});

// Add the Turistic Places with personalize markers
geojson.features.forEach(function(marker){
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = `${marker.properties.width}`;
  el.style.height = `${marker.properties.height}`;
  el.style.backgroundImage = `url(${marker.properties.image})`;  
  cordinates.push(marker.geometry.coordinates);
  new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
});



// Add and Customize thd draw tool
var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true
  },

  styles: [
    // ACTIVE (being drawn)
    // line stroke
    {
      "id": "gl-draw-line",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#FF3333",
        "line-dasharray": [0.2, 2],
        "line-width": 8,
        "line-opacity": 0.7
      }
    },
    // vertex point halos
    {
      "id": "gl-draw-polygon-and-line-vertex-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 10,
        "circle-color": "#FFF"
      }
    },
    // vertex points
    {
      "id": "gl-draw-polygon-and-line-vertex-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 6,
        "circle-color": "#3b9ddd",
      }
    },
  ]
});
// add the draw tool to the map
map.addControl(draw);

// use the coordinates you just drew to make your directions request
function updateRoute() {
  removeRoute(); // overwrite any existing layers
  var data = draw.getAll();  
  //console.log(data);
  var lastFeature = data.features.length - 1;
  var coords = data.features[lastFeature].geometry.coordinates;
  console.log(coords);
  var newCoords = coords.join(';')

  console.log(newCoords);

  getMatch(newCoords);
}
function recomendedRoute(){
  let route = document.getElementById("route");
  
  if (remove === false){
    route.innerHTML = "Remove Recommended Turistic Route";
    remove = true;
  }else {    
    route.innerHTML = "Recommended Turistic Route";
    remove = false;
  }
  console.log(cordinates.join(';'));
  getMatch(cordinates.join(';'));
}

// make a directions request
function getMatch(e) {
  // https://www.mapbox.com/api-documentation/#directions
  var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload  = function() {
    var jsonResponse = req.response;
    //console.log(jsonResponse);
    var distance = jsonResponse.routes[0].distance*0.001; // convert to km
    var duration = jsonResponse.routes[0].duration/60; // convert to minutes
    // add results to info box
    document.getElementById('calculated-line').innerHTML = '<strong>Distance:</strong> ' + distance.toFixed(2) + ' km<br> <strong>Duration:</strong> ' + duration.toFixed(2) + ' minutes';
    var coords = jsonResponse.routes[0].geometry;
    // add the route to the map
    addRoute(coords);
  };
  req.send();
}

// adds the route as a layer on the map
function addRoute (coords) {
  // check if the route is already loaded
  if (map.getSource('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  } else{
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": coords
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#850707",
        "line-width": 8,
        "line-opacity": 0.8
      }
    });
  };
}

// remove the layer if it exists
function removeRoute () {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
    document.getElementById('calculated-line').innerHTML = '';
  } else  {
    return;
  }
}

// add create, update, or delete actions
map.on('draw.create', updateRoute);
map.on('draw.update', updateRoute);
map.on('draw.delete', removeRoute);