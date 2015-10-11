var DELTA = 5;
var MongoClient = require('mongodb').MongoClient;
var spotifyData = require('../getSpotifySong.js');

module.exports = function(req, res, db) {
  console.log('In GET request');
  var requestBody = req.body;
  var collection = db.collection('documents');
  var cursor = collection.find(
    {
      $and: [
        {
          'userid': {$ne: requestBody.userid}
        },
        {
          'longitude': {$gt: requestBody.longitude - DELTA,
                        $lt: requestBody.longitude + DELTA}
        },
        {
          'latitude': {$gt: requestBody.latitude - DELTA,
                       $lt: requestBody.latitude + DELTA}
        },
      ]
    });

  var printDoc = function printDoc(doc) {
    console.log('UserID: ' + doc.userid);
    console.log('Latitude: ' + doc.longitude);
    console.log('Longitude: ' + doc.latitude);
    console.log('SongID: ' + doc.songid);
  }

  var resultsongids = [];
  cursor.forEach(function(doc) {
    printDoc(doc);
    resultsongids.push(doc.songid);
  });

  spotifyData(res, resultsongids);
  return;
};

var errorReadingResponse = {
  'status': {
    'code': 500,
    'message': 'Failed to read from database 💩',
  }
};

var errorBadRequestResponse = {
  'status':{
    'code':400,
    'message':'Bad request 💩. The request should contain the userid string, a latitude and longitude'
  }
};