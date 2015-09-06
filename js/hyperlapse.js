
function hyperlapse(start_lat, start_long, end_lat, end_long) {
    //-- Route
    var directionsService = new google.maps.DirectionsService();
    var directionsRoute = directionsService.route({
        destination: new google.maps.LatLng(end_lat, end_long),
        origin: new google.maps.LatLng(start_lat, start_long),
        travelMode: google.maps.TravelMode.WALKING
    }, function (DirectionsResult, DirectionsStatus) {
            var routeSequence = StreetviewSequence('#route', {
                route: DirectionsResult,
                duration: 20000,
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
        });
};

hyperlapse(39.952766, -75.200822, 39.901980, -75.172890);