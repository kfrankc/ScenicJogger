var express = require('express');
var app = express();
var accountSid = 'ACf2f8b667dca1c7385d13be6d77f87afa';
var authToken = 'e27d26eba13984b9c56b95b36840b0ac';

app.get('/', function (req, res) {
	console.log(req.query['maplink']);	
	//require the Twilio module and create a REST client
	var client = require('twilio')(accountSid, authToken);
	// declare an array of strings
	// put phone numbers in array
	var numbers = ['+15105658237','+18189331617', '+17148555951'];
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
			to: numbers[i], 
			from: "+16504223049", // ruthie's twilio
			body: "Thanks for using ScenicJogging! Here is your Route: " + req.query['maplink'], 
		}, function(err, message) { 
			console.log(message.sid); 
		});
	}	
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


