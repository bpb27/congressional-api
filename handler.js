'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/*
    Route:    /zips/:zipcode
    Example:  /zips/91011
*/

function getZip (event, context, callback) {
  const params = {
    TableName: process.env.TABLE_ZIPS,
    Key: {
      zipcode: parseInt(event.pathParameters.zipcode)
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error)
      return _errorHandler(event.pathParameters.zipcode, params.TableName, callback);
    else
      return _successHandler(result.Item, callback, _zipcodeToString);
  });
}

/*
    Route:    /reps/:id
    Example:  /reps/CA-27
*/

function getRepById (event, context, callback) {
  const params = {
    TableName: process.env.TABLE_REPS,
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error)
      return _errorHandler(event.pathParameters.id, params.TableName, callback);
    else
      return _successHandler(result.Item, callback);
  });
}
/*
    Route:    /sens/:id
    Example:  /sens/CA-1
*/

function getSenById (event, context, callback) {
  const params = {
    TableName: process.env.TABLE_SENS,
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error)
      return _errorHandler(event.pathParameters.id, params.TableName, callback);
    else
      return _successHandler(result.Item, callback);
  });
}


// private functions

function _errorHandler (param, table, callback) {
  let message = 'Failed to fetch item "' + param + '" from ' + table;
  callback(new Error(message));
}

function _successHandler (item, callback, jsonModifier) {
  let data = jsonModifier ? jsonModifier(item) : item;
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // CORS
      "Access-Control-Allow-Credentials" : true // Cookies and authorization headers with HTTPS
    },
    body: JSON.stringify(data)
  };
  callback(null, response);
}

function _zipcodeToString(item) {
  item.zipcode = item.zipcode.toString();
  if (item.zipcode.length == 4) {
    item.zipcode = '0' + item.zipcode;
  }
  return item;
}

module.exports.getZip = getZip
module.exports.getRepById = getRepById
module.exports.getSenById = getSenById
