const express = require('express');
const session = require('express-session');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var handlePostSong = require('./handlers/handlePostSong.js');
var handleGetSongs = require('./handlers/handleGetSongs.js');

const _keys = require('./secrets.json');
const CLIENT_ID = _keys.CLIENT_ID;
const CLIENT_SECRET = _keys.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';

var stateKey = 'spotify_auth_state';



var app = express();
app.use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(express.static(__dirname + '/public'))
   .use(cookieParser())
   .use(session({
      userName: "User's Name",
      access_token: "access token",
      refresh_token: "refresh token",
      secret: 'secreeet',
}));
/**
 * Generate alphanumeric random string id 
 * @param  {number} len Desired length of the string.
 * @return {string} A random string.
 */
var randomString = function(len) {
  var newString = '';
  var validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < len; i++) {
    newString += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return newString;
};

app.get('/login', function(req, res) {
  console.log(JSON.stringify(req.query, null, 2));
  console.log('Login: ' + JSON.stringify(req.body, null, 2));

  var state = randomString(16);
  res.cookie(stateKey, state);

  // Application requresting the authorization.
  var scope = 'user-read-private user-read-email streaming';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback', function(req, res) {
  console.log('Callback' + JSON.stringify(req.query, null, 2));

  // application requests refresh and access tokens after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          req.session = req.session || {};
          req.session.userName =  body.display_name;
          req.session.access_token = access_token;
          req.session.refresh_token = refresh_token;
          //console.log(JSON.stringify())
          res.redirect('/home');
          console.log('Request.get from Spotify' + JSON.stringify(body, null, 2));
          // Maybe we should take it out of the session, and put it in the query ?

          // res.json({user_name: body.display_name})
          //    .redirect('/#' +
          //     querystring.stringify({
          //       access_token: access_token,
          //       refresh_token: refresh_token
          //     }));
        });

        // we can also pass the token to the browser to make requests from there
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
})

app.get('/home', function(req, res) {
  if (req.session.userName){
    // console.log('Req body user:' + JSON.stringify(req.session, null, 2));
    res.write('<h1>Welcome to Music Radar, ' + req.session.userName + '!</h1>');
  }
  else {
    res.write('<h1>Welcome to Music Radar!</h1>');
  }
  //res.status(200).sendFile(__dirname+'/public/index.html');
});

app.get('/refresh_token', function(req, res) {
  console.log(req.query.refresh_token);

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
})

app.post('/song', handlePostSong);

app.get('/songs', handleGetSongs);

console.log('Listening on 8888');
app.listen(8888);