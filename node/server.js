var http = require('http');
var url = require('url');
var fs = require('fs');
var Firebase = require('../node_modules/firebase');
var dotenv = require('../node_modules/dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('../node_modules/ssl.env');
dotenv._setEnvs();
dotenv.load();

// ssl certs, don't modify these
var KEY_LOCATION = process.env.KEY_LOCATION;
var CERT_LOCATION = process.env.CERT_LOCATION; 
var options = {
    key: fs.readFileSync(KEY_LOCATION),
    cert: fs.readFileSync(CERT_LOCATION)
};

// spotify credentials
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI = process.env.REDIRECT_URI; // this has to match URI specified on spotify

// firebase
var firebaseRef = new Firebase("https://calhacksmusicradar.firebaseio.com/");

/**
 *  Add songs to the master list of songs.
 *  @param lat {Number} latitude of device location in decimal degrees
 *  @param lon {Number} longitude of device location in decimal degrees
 *  @param spotifyID {String} spotify id of a track
 */
function addSong(lat,lon,spotifyId) {
  'use strict';
  console.log('addSong', lat, lon, spotifyId);
  var d = new Date();
  var dateNow = d.getDate();
  var firebaseRef = ref.child("songs");
  firebaseRef.set({
      song: {
        spotifyID: spotifyId,
        lat: lat,
        lon: lon,
        date: dateNow
      },
  });
  var result;
 
  return result;
}

/**
 *  Get a list of songs that have been played within radius of lat,lon 
 *  @param lat {Number} latitude of device location in decimal degrees
 *  @param lon {Number} longitude of device location in decimal degrees
 *  @param radius {Number} radius in miles of songs to return
 *  @returns songList {Array} unordered list of tagged songs
 */
function getMusic(lat,lon,radius) {
  'use strict';
  console.log('getMusic', lat, lon, radius);
  // TODO calculate coords for circle of radius (radius)
  // TODO select for records that are within radius of us and return them
  
  var result;

  
  return result;
}

/**
 *  HTTP server
 *  example URLs
 *  add a song:    https://dusty.airmanopus.net:8080/?action=addSong&lat=37.8706&lon=-122.251
 *  get song list: https://dusty.airmanopus.net:8080/?action=getMusic&lat=37.8706&lon=-122.251&radius=5.5
 */ 
var server = http.createServer(options,function(req, httpResponse) {
  'use strict';
  // send the header so the requestor knows we're alive 
  httpResponse.writeHead(200, {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Request-Method': '*',
    'Cache-control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  var serverResponse = ''; 
  var urlParts = url.parse(req.url, true, true);
  // TODO just pass in the right things for now, kthx
  try {
    var queryStr = urlParts.query;
    var action = urlParts.action;
    var lat = urlParts.lat;
    var lon = urlParts.lon;
  }
  catch (err) {
    console.log('Error occurred: ' + err);
  }

  switch (action) {
    case 'addSong': 
      // add the song to the master song list with its location
      serverResponse = addSong(lat,lon,song);
      break;
    case 'getMusic': 
      // get a list of all songs recently played within radius miles of location
      serverResponse = getMusic(lat,lon,radius);
    default: 
      // error
      serverResponse = {
        'result' : 'error'
      };
      break;
  }

  if (serverResponse !== '') {
    var serverResponseJSON = JSON.stringify(serverResponse);
  } else {
      serverResponse = {
        'result' : 'error parsing server response'
      };
  }
  //
  httpResponse.write(serverResponseJSON + '\n');
  httpResponse.end(); 
});
server.listen(8080,'paula.airmanopus.net');


