const VERSION = 0.1;

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

module.exports = function(req, res) {

  // Connection URL
  var mongoUrl = 'mongodb://localhost:27017/myproject';
  
  var requestBody = req.body;
  console.log('Post Song Request');
  // Add song ID with geolocation to database
  // UserID | Lat | Long | SongId | Timestamp
  
  var databaseWriteSucessful = false;

  if (! validRequest(requestBody)) {
    res.status(400).json(errorRequest);    
  }

  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      res.status(500).json(errorWriteResponse);
      console.log(err);
      return;
    }

    console.log('Connected to database successfully.');
    var collection = db.collection('documents');
    console.log('Collection connected successfully');
    var trackDocument = {
      '_id': req.body.userid,
      'latitude': req.body.latitude,
      'longitude': req.body.longitude,
      'timestamp': Date.now(),
      'songid': req.body.songid
    };
    
    collection.insert([trackDocument], function(err, result) {
      if (err) {
        console.log('Err')
        res.status(500).json(errorWriteResponse);
        console.log(err);
      } else {
        console.log('Result N (should be 1): '+ result.result.n);
        console.log('Result Ops Len: ' +  result.ops.length);
        console.log('Sucessfully wrote to database');
        res.status(200).json(sucessResponse);
      }
      return;
    });
  });
}

var validRequest = function validRequest(requestBody) {
  return (typeof requestBody.latitude === 'number' &&
          typeof requestBody.longitude === 'number' &&
          typeof requestBody.songid === 'string' &&
          typeof requestBody.userid === 'string');
}

var insertDocument = function insertDocument(db, callback, songEntry) {
  var collection = db.collection('documents');

  collection.insert([songEntry], callback);
}

var sucessResponse = {
  'status': {
    'code': 200,
    'message': 'Sucessfully added song to database. 😁',
  }
};

var errorWriteResponse = {
  'status': {
    'code': 500,
    'message': 'Failed to write to database 💩',
    'version': VERSION
  }
};

var errorRequest = {
  'status': {
    'code': 400,
    'message': 'Bad request 💩. Request body must contain userid, latitude, longitude, songid 😉'
  }
};
