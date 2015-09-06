var yelp = require("yelp").createClient({
	  consumer_key: "fTrwpD5n7tQ0GnNdWzTdpg", 
	  consumer_secret: "G8vwNM3oLgzzVu0vUxBc5MrS5cY",
	  token: "HkFVR9my4vJXV6hOptlKC4iFvFy0biBo",
	  token_secret: "38HaEmolkwWRtAypcJxrmpQ8Uoo"
});
var https = require('https');
var exports = module.exports = {};
var async = require('async');
/*
@param radius: radius in meters
*/


function getPlaces(lat, lng, radius, placesCallback) {
	yelp.search({category_filter: 'landmarks,parks,gardens,lakes', radius_filter: radius, ll: lat + ',' + lng}, function(error, data) {
	 	if(error) console.error('Error getting places: ' + error);
	  var places = data.businesses;
    console.log(places.length);
	  var i =0
	  async.eachSeries(places, function iterator(place, callback){
	  	https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
  		place.location.display_address + '&bounds=40,-75.0|39.8,-75.5&key=AIzaSyD5wgNjyAarvIDk3WF-ISlYIRiCBKc4kEc', function(response) {
	      var body = '';
	      response.on('data', function(d) {
	          body += d;
	      });
	      response.on('end', function() {
	        var parsed = JSON.parse(body);
					places[i].location.lat = parsed.results[0].geometry.location.lat;
					places[i].location.lng = parsed.results[0].geometry.location.lng;
					i++;
					callback();
			  });
		  });
	  }, function done() {
  			var sectoredPlaces = {
  				eastPlaces: [],
  				northPlaces: [],
  				southPlaces: [],
  				westPlaces: [],
  			};
  			for(var j = 0; j < places.length; j++) {
          var p = places[j];
          console.log(p);
  				if (-75.5  < p.location.lng && p.location.lng < -75.0 && 39.8 < p.location.lat && p.location.lat < 40) {
  					if (p.location.lat > lat) {sectoredPlaces.eastPlaces.push(p);}
  					if (p.location.lng > lng) {sectoredPlaces.northPlaces.push(p);}
  					if (p.location.lat < lat) {sectoredPlaces.westPlaces.push(p);}
  					if (p.location.lng < lng) {sectoredPlaces.southPlaces.push(p);}			  					  					
  				}
  			}
        placesCallback(sectoredPlaces);
			});
	});
}
exports.getPlaces = getPlaces;
