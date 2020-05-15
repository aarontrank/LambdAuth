console.log('Loading function');

// dependencies
var AWS = require('aws-sdk');
var crypto = require('crypto');
var config = require('./config.json');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();
var cognitoidentity = new AWS.CognitoIdentity();

function getDialASermon(email, fn) {
	dynamodb.getItem({
		TableName: config.SERMON_TABLE,
		Key: {
			email: {
				S: email
			}
		}
	}, function(err, data) {
		if (err) return fn(err);
		else {
			if ('Item' in data) {
				var number = data.Item.number.S;
				var intro = (data.Item.intro) ? data.Item.intro.S : '';
				var message = (data.Item.message) ? data.Item.message.S : '';
				fn(null, number, intro, message);
			} else {
				fn(null); // User not found
			}
		}
	});
}



exports.handler = function(event, context) {
	var email = event.email;

	getDialASermon(email, function(err, number, intro, message) {
		if (err) {
			context.fail('Error in getUser: ' + err);
		} else {
			context.succeed({
				number, 
				intro, 
				message
			});
		}
	});
}
