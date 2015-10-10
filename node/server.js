
// web server settings
var HOSTNAME = dusty.airmanopus.net;
var PORT = 8080;
var Firebase = require("firebase");
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
var myFirebaseRef = new Firebase("https://calhacksmusicradar.firebaseio.com/");

/**
 *  HTTP server
 *  example URLs
 *  add a song:    https://dusty.airmanopus.net:8080/?action=addSong&lat=37.8706&lon=-122.251
 *  get song list: https://dusty.airmanopus.net:8080/?action=getMusic&lat=37.8706&lon=-122.251
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
    console.log('Error occurred: ' + err)'
  }

  switch (action) {
    case 'addSong': {
      // add the song to the master song list with its location
      serverResponse = addSong(lat,lon,song);
    }
    break;
    case 'getMusic': {
      // get a list of all songs recently played within radius miles of location
      serverResponse = getMusic(lat,lon,radius);
    }
    default: {
      // error
      serverResponse = {
        'result' : 'error'
      };
    }
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
}
server.listen(POST, HOSTNAME);
console.log('Server is listening on ' + HOSTNAME + ":" + PORT);

/**
 *  Add songs to the master list of songs; we can't tell what songs a user is playing
 *  but we can tell what they have on their playlists, so we'll use that
 *  @param lat {Number} latitude of device location in decimal degrees
 *  @param lon {Number} longitude of device location in decimal degrees
 *  @param spotifyID {String} spotify id of a track
 */
function addSong(lat,lon,spotifyId) {
  'use strict';
  console.log('addSong', lat, lon, spotifyId);
  // TODO get a list of the current user's playlists
  // TODO for each playlist, get a list of that playlist's tracks
  // TODO for each track, save the track's information to the db plus the location
  var d = new Date();
  var dateNow = d.getDate();
  var usersRef = ref.child("songs");
  usersRef.set({
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
 */
function getMusic(lat,lon,radius) {
  'use strict';
  console.log('getMusic', lat, lon, radius);
  // TODO select for records that are within radius of us
  // TODO get those tracks see https://developer.spotify.com/web-api/get-several-tracks/ note: we can get up to 50 tracks per request
  // TODO sort the list of tracks by ?
  var result;

  
  return result;
}
