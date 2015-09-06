console.log('got to map.js');
// Inital location for map
var position = [39.929692, -75.216831];
var directionsDisplayNorth;
var directionsDisplayEast;
var directionsDisplaySouth;
var directionsDisplayWest;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
  var latLng = new google.maps.LatLng(position[0], position[1]);
  directionsDisplayNorth = new google.maps.DirectionsRenderer();
  directionsDisplayEast = new google.maps.DirectionsRenderer();
  directionsDisplaySouth = new google.maps.DirectionsRenderer();
  directionsDisplayWest = new google.maps.DirectionsRenderer();

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
  directionsDisplayNorth.setMap(map);
  directionsDisplayEast.setMap(map);
  directionsDisplaySouth.setMap(map);
  directionsDisplayWest.setMap(map);

  var input = document.getElementById('searchBox');
  console.log(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);

    console.log(place.geometry.location);
    var startingLat = place.geometry.location.G;
    var startingLong = place.geometry.location.K;
    console.log(startingLat);
    console.log(startingLong);
    var radius = 3000;
    // set radius to be a constant 3,000 meters for now.
    addYelpWaypoints(startingLat, startingLong, radius, 'North');
    addYelpWaypoints(startingLat, startingLong, radius, 'East');
    addYelpWaypoints(startingLat, startingLong, radius, 'South');
    addYelpWaypoints(startingLat, startingLong, radius, 'West');
  });
}

function addYelpWaypoints(startingLat, startingLong, radius, direction) { // direction is a string
  var waypoints = [];
  $.ajax({
    url: '/yelpScript?lat=' + startingLat + '&long=' + startingLong + '&radius=' + radius
  }).done(function(data) {
    console.log(data);
    var directionalPlaces;
    if (direction === 'North') {directionalPlaces = data.northPlaces;}
    if (direction === 'South') {directionalPlaces = data.southPlaces;}
    if (direction === 'East') {directionalPlaces = data.eastPlaces;}
    if (direction === 'West') {directionalPlaces = data.westPlaces;}
    for (var i = 0; i < directionalPlaces.length; i++) {
      var directionalPlace = directionalPlaces[i];
      var lat = directionalPlace.location.coordinate.latitude;
      var long = directionalPlace.location.coordinate.longitude;
      console.log('lat: ' + lat);
      console.log('long: ' + long);
      var googleLatLng = new google.maps.LatLng(lat, long);
      waypoints.push({
        location: googleLatLng,
        stopover: false
      });
    }
    console.log(waypoints);
    if (direction === 'North') {
      getOptimizedRouteLength(waypoints, startingLat, startingLong, 'North');
    }
    if (direction === 'East') {
      getOptimizedRouteLength(waypoints, startingLat, startingLong, 'East');
    }
    if (direction === 'South') {
      getOptimizedRouteLength(waypoints, startingLat, startingLong, 'South');
    }
    if (direction === 'West') {
      getOptimizedRouteLength(waypoints, startingLat, startingLong, 'West');
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);


function getClosestWaypoint(ogLocation, waypoints) {
  var ogLat = ogLocation.latitude;
  var ogLong = ogLocation.longitude;
  var minDistance;
  var nearestWaypoint;
  for (var i = 0; i < waypoints.length; i++) {
    var waypoint = waypoints[i];
    var waypointLat = waypoint.latitude;
    var waypointLong = waypoint.longitude;
    var distance = Math.pow(ogLat - waypointLat, 2) + Math.pow(ogLong - waypointLong, 2);
    if (distance < minDistance) {
      minDistance = distance;
      nearestWaypoint = waypoint;
    }
    // we're given the single waypoint's longitude and latitude.
    // Want to calculate the Euclidian distance between location and the waypoint.
  }
  return nearestWaypoint;
}

function getOptimizedRoute(maxLength, startLocation, waypoints) { 
  // maxLength is the longest distance user wants to travel
  // Get closest waypoint to startLocation.
  var firstWaypoint = getClosestWaypoint(startLocation, waypoints);
  var routeLength = getOptimizedRouteLength(firstWaypoint);

  var previousWaypoint = firstWaypoint;
  /*while (routeLength < maxLength) {
    var nextWaypoint = getClosestWaypoint(previousWaypoint);
    routeLength = getOptimizedRouteLength()
  }*/
}



// We can generate 3 random routes, by selecting a random subset of the set of waypoints
// which fall within the boundary radius and the direction.

function getOptimizedRouteLength(waypoints, startingLat, startingLong, direction) { // waypoints is an array
  console.log('number of waypoints: ' + waypoints.length);
  var start = new google.maps.LatLng(startingLat, startingLong);
  console.log(startingLat);
  console.log(startingLong);
  var request = {
    origin: start,
    destination: start, // want to end where we started
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.WALKING
  };
  console.log('got here');
  directionsService.route(request, function(response, status) {
    console.log(response);
    //playHyperlapse(response);
    if (status == google.maps.DirectionsStatus.OK) {
      if (direction === 'North') {
        directionsDisplayNorth.setDirections(response);
      }
      if (direction === 'East') {
        directionsDisplayEast.setDirections(response);
      }
      if (direction === 'South') {
        directionsDisplaySouth.setDirections(response);
      }
      if (direction === 'West') {
        directionsDisplayWest.setDirections(response);
      }
      var route = response.routes[0];
      //var summaryPanel = document.getElementById('directions_panel');
      //summaryPanel.innerHTML = '';
      // For each route, display summary information.
      var routeLength = 0.0;
      var routeSegmentLength;
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        /*summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';*/
        routeSegmentLength = parseFloat(route.legs[i].distance.text);
        routeLength += routeSegmentLength;
      }
      if (direction === 'North') {
        $('#north-route-distance').text(routeLength + ' mi');
      }
      if (direction === 'East') {
        $('#east-route-distance').text(routeLength + ' mi');
      }
      if (direction === 'South') {
        $('#south-route-distance').text(routeLength + ' mi');
      }
      if (direction === 'West') {
        $('#west-route-distance').text(routeLength + ' mi');
      }
      console.log('Route Length: ' + routeLength);
    } else {
      window.alert('Directions request failed to ' + status);
    }
    return routeLength;
  });
}

function playHyperlapse(hyperlapseResponse) {
  var routeSequence = StreetviewSequence('#hyperlapse', {
    route: hyperlapseResponse,
    duration: 10000,
    key: 'AIzaSyD51Ia5v17tRyd5SCem4RQ1QveLR6Y83Fk',
    loop: true,
    width: 585,
    height: 585
  });
  var $routeProgressContainer = $("#route-progress-container");
  var $routeProgressBar = $routeProgressContainer.find('.progress-bar');
  routeSequence.progress(function (p) {
      $routeProgressBar.css({width: (p * 100) + '%'});
  });
  routeSequence.done(function(player) {
      $routeProgressContainer.hide();
      player.play();
  });
}

//var optimizeUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=Adelaide,SA&destination=Adelaide,SA&waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA&key=API_KEY';
