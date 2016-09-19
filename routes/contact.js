var express = require('express');
var router = express.Router();
var GoogleMapsAPI = require('googlemaps');
var https = require('https');
var tooSoonMessage = false;
var tooSoonCall = false;

var googleMapsConfig = {
	key: 'AIzaSyC-betFNmrdFDconv34hLHo_cfVqFoEZ8Y',
	stagger_time: 1000,
	encode_polylines: false,
	secure: true
}
var gmAPI = new GoogleMapsAPI(googleMapsConfig);


function createData(to, from, text) {
	return JSON.stringify({
		api_key: '4c5cc473',
 		api_secret: '701785bd2c966392',
 		to: to,
 		from: from,
 		text: text
	});
}

function createOptions(path, host, data) {
	return {
		host: host,
		path: path,
		port: 443,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(data)
		}
	}
}

/*
* Messaging
*/
router.get('/message', function(req, res, next) {
	if (tooSoonMessage) {return res.send('Messages have already been sent. Try again later');}

	tooSoonMessage = true
	setTimeout(function() {
		tooSoonMessage = false;
	}, 60*1000);

	convertToAddress(req.query.lat, req.query.long)
	.then(sendMessage.bind(this, req, res, '/sms/json', 'rest.nexmo.com'))
	.catch(function(err) {
		res.send(err);
	});
});

/*
* Calling
*/
router.get('/call', function(req, res, next) {
	if (tooSoonCall) {return res.send('Call has already been sent. Try again later');}

	tooSoonCall = true
	setTimeout(function() {
		tooSoonCall = false;
	}, 60*1000);

	convertToAddress(req.query.lat, req.query.long)
	.then(sendMessage.bind(this, req, res, '/tts/json', 'api.nexmo.com'))
	.catch(function(err) {
		res.send(err);
	});
});

function sendMessage(req, res, path, host, address) {
	var data = createData('15613793611', '12404287093', 'This is an emergency! I am currently suffering from a cardiac arrest and am in need of immediate assistance. My current location is ' + address);
	var options = createOptions(path, host, data);

	var nexmoReq = https.request(options);
	nexmoReq.write(data);
	nexmoReq.end();

	var responseData = '';
	nexmoReq.on('response', function(nexmoRes) {
		nexmoRes.on('data', function(chunk) {
			responseData += chunk;
		});

		nexmoRes.on('end', function() {
			var decodedResponse = JSON.parse(responseData);
			var responseStr = '';
			if (decodedResponse['messages']) {
				decodedResponse['messages'].forEach(function(message) {
		    		if (message['status'] === "0") {
		    			responseStr += 'Success ' + message['message-id'] + '\n';
		    		}
		    		else {
		    			responseStr += 'Error ' + message['status']  + ' ' +  message['error-text'] + '\n';
		    		}
				});

				res.send(responseStr);
			} else {
				if (decodedResponse['error_text'] === 'Success') {
					res.send('Successfully sent call');
				}
				else {
					res.send('Error sending call');
				}
			}
		});
	});
}

/*
* Location
*/

var convertToAddress = function(lat, long) {
	var geocodeParams = {
		"latlng": lat + ", " + long,
	  	"result_type": "street_address",
	  	"language": "en"
	};
	return new Promise(function(resolve, reject) {
		gmAPI.reverseGeocode(geocodeParams, function(err, result) {
			if (result.results[0] && result.results[0].formatted_address) {
				resolve(result.results[0].formatted_address);
			}
			else {
				resolve('Location Unknown');
			}
		});
	});
}

module.exports = router;
