var PlayMy 	= require('./playmy'), 
    _       = require('underscore'),
    async	= require('async');


PlayMy.prototype.get_spotify_ids = function (tracks, artists, callback) {
	var data = [];
    var search_tracks = [];

    var top_artists = _.sortBy(artists, function (item) {
        return -item.count;
    })

    async.forEachSeries(top_artists, function (artist, callback) {

        var tracks_temp = _.where(tracks, {artist: artist.name });
        var count = 1;
        if (search_tracks.length < 10) {
            tracks_temp.forEach(function (item, index) {
                if (count < 3) {
                    search_tracks.push(item);    
                }
                count++;
            })  
        }
        
        callback();

    }, function (err) {

        async.forEach(search_tracks, function (track, callback) {
            app.get('playmy').get_api_data('http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(track.track_name).replace(/\(/g, "").replace(/\)/g, "") + ' ' + encodeURIComponent(track.artist), {}, function (err, res) {
                if (err) console.log(err);
                if (res.tracks[0]) {
                    console.log(res.tracks[0].href);
                    data.push(res.tracks[0].href);    
                }
                callback();
            })

        }, function (err) {
            var list = 'spotify:trackset:test:';
            var num = data.length;
            var count = 0
            data.forEach(function (item, index) {
                
                list = list + item.replace("spotify:track:","");
                if (count < num) {
                    list = list + ',';
                }  
                
                count++;
                
            })
            callback(null, list);
        })

    })

    
};