var request = require('request');

module.exports = function(songs) {
  console.log('Songs requested: ' + songs);
  request.get(
    {url: 'https://api.spotify.com/v1/tracks/' + makeUrlAttachment(songs)},
    function(err, result, body) {
      console.log('Url requested: '+  'https://api.spotify.com/v1/tracks/' + makeUrlAttachment(songs));
      if (err) {
        console.log('Error when requesting from Spotify');
        return;
      }

      var allTracks = body.tracks;
      var result = [];
      if (!allTracks) { return result; }
      for(var i = 0, j = allTracks.length; i < j; i++) {
        var currentTrack = allTracks[i];
        var songInfo = {
          'id': currentTrack.id,
          'title': currentTrack.name,
          'artist': currentTrack.artists[0].name,
          'album': currentTrack.album.name,
          'artwork': currentTrack.album.images
        };
        result.push(songInfo);
      }

      return result;
    }
  )
};

var makeUrlAttachment = function makeUrlAttachment(songs) {
  var result = '';
  for (var i = 0, j = songs.length; i < j; i++) {
    result += (songs[i] + ',');
  }
  return result;
}