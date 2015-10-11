var DELTA = 5;
var MongoClient = require('mongodb').MongoClient;
var spotifyData = require('../getSpotifySong.js');

module.exports = function(req, res) {
  console.log('In GET request');
  var requestBody = req.body;
  // Read all items in Databse that:
  // Are within X distance form Lat and Lon
  // Are not with the request userID
  // Add timestamp filtering too
  
  var mongoUrl = 'mongodb://localhost:27017/myproject';

  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      console.log('Coulnd\'t connect to the database.');
      console.log(err);
      res.status(500).json(errorReadingResponse);
      return;
    }

    console.log('Connected to database successfully');

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

    var resultWithSpotifyData = spotifyData(resultsongids);
    res.status(200).json(successResponse(resultWithSpotifyData));
  });
}

var successResponse = function successResponse(songs) {
  return {
    'status':{
        'code': 200,
        'message':'Query successful.'
    },
    'songs': songs
  };
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