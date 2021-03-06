var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var accountSid = 'ACf2f8b667dca1c7385d13be6d77f87afa';
var authToken = 'e27d26eba13984b9c56b95b36840b0ac';
var yelpScript = require('./js/yelpScript');

app.set('port', process.env.PORT || 3000);

// serve static pages
var path = require('path')
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
	// render index.html
	res.render('index');
});


app.get('/twilio', function (req, res) {
	console.log(req.query['maplink']);	
	//require the Twilio module and create a REST client
	var client = require('twilio')(accountSid, authToken);
	// declare an array of strings
	// put phone numbers in array
	var numbers = req.query['maplink'];
	for (i=0; i < numbers.length; i++) {
		// client.makeCall({
		// 	to:numbers[i], // frank
		// 	from: "+16504223049", // ruthie's twilio
		// 	url: 'https://raw.githubusercontent.com/kfrankc/FRMDB/gh-pages/recording.xml'
		// }, function(err, responseData) {

		// 	// executed when call has been initiated
		// 	console.log(responseData.from);

		// });

		client.messages.create({ 
			to: numbers, 
			from: "+16504223049", // ruthie's twilio
			body: "Thanks for using ScenicJogging! Here is your Route: North: http://bit.ly/1LRGLQt East: http://bit.ly/1Fr5kPs South:  http://bit.ly/1NVXPbc West: ", 
		}, function(err, message) { 
			console.log(message.sid); 
		});
	}	
});

app.get('/yelpScript', function (req, res) {
	var lat = req.query.lat;
	var long = req.query.long;
	var radius = req.query.radius;
	//var sectoredPlaces = yelpScript.getPlaces(lat, long, radius);
	//console.log(sectoredPlaces);
	yelpScript.getPlaces(lat, long, radius, function(sectoredPlaces) {
		res.send(sectoredPlaces);
	});
})

var server = app.listen(app.get('port'), function() {
  console.log('Our app is running on port %d', server.address().port);
});


