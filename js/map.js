
// Inital location for map
var position = [39.929692, -75.216831];

function showGoogleMaps() {

    var latLng = new google.maps.LatLng(position[0], position[1]);

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

    map = new google.maps.Map(document.getElementById('googlemaps'),
        mapOptions);

    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         map.setCenter(initialLocation);
     });
 }
}
google.maps.event.addDomListener(window, 'load', showGoogleMaps);
