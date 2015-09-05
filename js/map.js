console.log('got to map.js');
// Inital location for map
var position = [39.929692, -75.216831];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
  var latLng = new google.maps.LatLng(position[0], position[1]);
  directionsDisplay = new google.maps.DirectionsRenderer();

  var mapOptions = {
    zoom: 16, // initialize zoom level - the max value is 21
    streetViewControl: false, // hide the yellow Street View pegman
    scaleControl: true, // allow users to zoom the Google Map
    panControl: false,
    navigationControl: false,
    mapTypeControl: false,
    scrollwheel: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latLng,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
  };

  map = new google.maps.Map(document.getElementById('googlemaps'), mapOptions);
  directionsDisplay.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }

  var waypoints = ['Comcast Center'];
  calcRoute(waypoints);
}

google.maps.event.addDomListener(window, 'load', initialize);

function calcRoute(waypoints) { // waypoints is an array
  var start = 'Rodin College House, Philadelphia, PA';
  console.log(start);
  var end = 'Wells Fargo Center, Philadelphia, PA';
  var request = {
    origin: start,
    destination: end,
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      var route = response.routes[0];
      var summaryPanel = document.getElementById('directions_panel');
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      }
    } else {
      window.alert('Directions request failed to ' + status);
    }
  });
}

//var optimizeUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=Adelaide,SA&destination=Adelaide,SA&waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA&key=API_KEY';
