'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hello = function(event, context, callback) {

  const response = {
    statusCode: 200,
    body: JSON.stringify({ "message": "Hello World!" })
  };

  callback(null, response);

};

module.exports.getZip = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      zipcode: parseInt(event.pathParameters.zipcode)
    }
  };

  dynamoDb.get(params, (error, result) => {

    if (error) {
      let message = 'Failed to fetch item "' + event.pathParameters.zipcode + '" from ' + params.TableName;
      callback(new Error(message));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // CORS
        "Access-Control-Allow-Credentials" : true // Cookies and authorization headers with HTTPS
      },
      body: JSON.stringify(zipcodeToString(result.Item))
    };

    callback(null, response);
  });
}

function zipcodeToString(item) {
  item.zipcode = item.zipcode.toString();
  if (item.zipcode.length == 4) {
    item.zipcode = '0' + item.zipcode;
  }
  return item;
}
