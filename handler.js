'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableZips = process.env.TABLE_ZIPS;
const tableReps = process.env.TABLE_REPS;
const tableSens = process.env.TABLE_SENS;


// ROUTE: /zips/:zipcode, EXAMPLE: /zips/91011
function get_district_by_zip (event, context, callback) {
  const params = {
    TableName: tableZips,
    Key: {
      zipcode: parseInt(event.pathParameters.zipcode)
    }
  };

  dynamo.get(params, (error, result) => {
    if (error)
      return standard_error_handler(error, event, params, callback);
    return standard_success_handler(result.Item, callback, zipcode_to_string);
  });
}

// ROUTE: /reps/zip/:zipcode, EXAMPLE: /reps/zip/91011
function get_rep_by_zip (event, context, callback) {
  const zipParams = {
    TableName: tableZips,
    Key: {
      zipcode: parseInt(event.pathParameters.zipcode)
    }
  };

  dynamo.get(zipParams, (zipError, zipResult) => {
    if (zipError)
      return standard_error_handler(error, event, zipParams, callback);

    const districts = zipResult.Item.districts.map((num) => zipResult.Item.state + '-' + num);
    const repParams = {
      RequestItems: {
        [tableReps]: {
          Keys: districts.map((district) => ({ id: district }))
        }
      }
    };

    dynamo.batchGet(repParams, (repError, repResult) => {
      if (repError)
        return standard_error_handler(repError, event, repParams, callback);
      return standard_success_handler(repResult.Responses.reps, callback);
    });

  });
}

// ROUTE: /reps/district/:district, EXAMPLE: /reps/CA-27
function get_rep_by_district (event, context, callback) {
  const params = {
    TableName: tableReps,
    Key: {
      id: event.pathParameters.district
    }
  };

  dynamo.get(params, (error, result) => {
    if (error)
      return standard_error_handler(error, event, params, callback);
    return standard_success_handler(result.Item, callback);
  });
}

// ROUTE: /sens/state/:state, EXAMPLE: /sens/state/CA
function get_sen_by_state (event, context, callback) {
  const params = {
    RequestItems: {
      [tableSens]: {
        Keys: [
          { id: event.pathParameters.state + '-1' },
          { id: event.pathParameters.state + '-2' }
        ]
      }
    }
  };

  dynamo.batchGet(params, (error, result) => {
    if (error)
      return standard_error_handler(error, event, params, callback);
    return standard_success_handler(result.Responses.sens, callback);
  });
}


// private functions

function standard_error_handler (error, event, params, callback) {
  console.log('Run with: ', event.pathParameters, params);
  console.log('Error reading from DB: ', error);
  return callback(new Error('failed to locate item'));
}

function standard_success_handler (item, callback, json_modifier) {
  let data = json_modifier ? json_modifier(item) : item;
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

function zipcode_to_string (item) {
  item.zipcode = item.zipcode.toString();
  if (item.zipcode.length == 3) {
    item.zipcode = '00' + item.zipcode;
  }
  if (item.zipcode.length == 4) {
    item.zipcode = '0' + item.zipcode;
  }
  return item;
}

module.exports.get_district_by_zip = get_district_by_zip;
module.exports.get_rep_by_zip = get_rep_by_zip;
module.exports.get_rep_by_district = get_rep_by_district;
module.exports.get_sen_by_state = get_sen_by_state;
