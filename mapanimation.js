// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
  [2.2958480933682495,48.87305727011196],
  [2.296341807809881,48.87238551903741],
  [2.297108239194415,48.871440691883805],
  [2.2980560727687305,48.870045804891475],
  [2.2988850154548004,48.86860783107147],
  [2.2995119315283716,48.86667326483362],
  [2.2998592401827977,48.86507498444831],
  [2.301309044340286,48.86454215967541],
  [2.3016231702733876,48.86249310156737],
  [2.296992554306712,48.86150722262619],
  [2.294059395030132,48.85949736216395],
  [2.294495487888611,48.85821241904537],
];

// TODO: add your own access token
mapboxgl.accessToken =
  '';

// TODO: create the map object using mapboxgl.map() function
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [2.2951363254344415,48.87357082378131],
  
  zoom: 13,
});

let marker = new mapboxgl.Marker().setLngLat([2.2951363254344415,48.87357082378131]).addTo(map);

// counter here represents the index of the current bus stop
let counter = 0;
function move() {
  // move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
  // Use counter to access bus stops in the array busStops
  setTimeout(() => {
    if (counter >= busStops.length) return;
    marker.setLngLat(busStops[counter]);
    counter++;
    move();
  }, 1000);
}