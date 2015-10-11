var util = require('util');

var DELTA = 5;
var MongoClient = require('mongodb').MongoClient;

module.exports = function(req, res) {
  console.log('In GET request');
  var requestBody = req.body;
  // Read all items in Databse that:
  // Are within X distance form Lat and Lon
  // Are not with the request userID
  
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
    
    console.log('Got a valid connection');

    var cursor = collection.find();
    //cursor.forEach(function(doc) { console.log('Userid: ' + doc.userid)});
    console.log('-----------------------');
    //console.log(JSON.stringify(util.inspect(allData)));
    // console.log('All Length: ' + Object.keys(allData).length);
    var withinLatitude = collection.find({ latitude: { $gt: req.body.latitude - 5,
                                                       $lt: req.body.latitude + 5 }});

    
    withinLatitude.forEach(function(doc) { console.log('Userid: ' + doc.userid)});
    console.log('Length: ' + Object.keys(withinLatitude).length)
    collection.remove({});
    //console.log(JSON.stringify(util.inspect(withinLatitude), null, 2));
    // console.log('Found by latitude successfully');
    // var withinArea = withinLatitude.filter(function(o) {
    //   return (o.longitude > req.body.longitude - 5) &&
    //          (o.longitude < req.body.longitude + 5);
    // });
    //     console.log('Length: ' + Object.keys(withinArea).length)

    // console.log('Filtered by area successfully');

    // var notThisId = withinArea.filter(function(o) { return o._id !== req.body.userid; });

    // console.log('Filtered by area');
    // // Are the objects in notThisId with keys? What is the song representation?

    
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