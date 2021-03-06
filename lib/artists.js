var PlayMy 	= require('./playmy'), 
	_       = require('underscore'), 
	async   = require('async');

PlayMy.prototype.get_artists = function (words, mailoption, callback) {

    var data = {};
    var output = {};
    var tracks_mbid = [];
    var mail_opt = mailoption || '';
    
    async.series({
        get_tracks: function (callback) {

            data.words = [];
            async.forEach(words, function (word, callback) {
                app.get('playmy').get_tracks_from_word(word.word, mail_opt, function (err, results) {
                    if (results)
                    data.words.push({word: word.word, frequency: word.frequency, artists: results});
                    callback();
                })
            }, function (err) {
                callback();
            })
            
        },
        get_artists: function (callback) {
            data.artist_list = [];
            var names = [];
            var counts = [];
            var mbids = [];
            
            async.forEach(data.words, function (word, callback) {

                async.forEach(word.artists, function (artist, callback) {
                    tracks_mbid.push({artist: artist.artist, track_name: artist.track_name, track_mbid: artist.track_mbid});
                    //var index = names.indexOf(artist.artist);
                    var index = _.indexOf(names, artist.artist)
                    if (index < 0) {
                        names.push(artist.artist);
                        counts.push(1);
                        mbids.push(artist.mbid);
                    }
                    else {
                        counts[index] = counts[index] + 1;
                    }
                    callback();                    

                }, function (err) {
                    callback();
                });

            }, function (err) {
                var index_2=0
                async.forEachSeries(names, function(item, callback){

                    data.artist_list.push({name: item, count: counts[index_2], mbid: mbids[index_2]});
                    index_2 = index_2 +1

                    callback()
        
                }, function (err){
                    callback()
                })
            })
        },
        combine_results: function (callback) {

            data.word_artist_list = [];

            async.forEach(data.words, function (word, callback) {
                
                var artists = [];
                var names = [];
                var counts = [];
                var mbids = [];
                if (word.artists.length > 0) {
                    async.forEach(word.artists, function (artist, callback) {
                    
                        var index = names.indexOf(artist.artist);
                        if (index < 0) {
                            names.push(artist.artist);
                            counts.push(1);
                            mbids.push(artist.mbid);
                        }
                        else {
                            counts[index] = counts[index] + 1;
                        }
                        callback();   

                    }, function (err) {

                        var index_2=0
                        async.forEachSeries(names, function(item, callback){

                            artists.push({name: item, track_count: counts[index_2], mbid: mbids[index_2]});
                            index_2 += 1
                            callback()

                        },function(err){
                            data.word_artist_list.push({word: word.word, artists: artists});
                            callback()
                        })
                    })    
                }
                else {
                    callback();
                }
                

            }, function (err) {
                callback();
            });

        },
        reduce_words: function (callback) {
            data.word_list = [];
            async.forEach(data.words, function (word, callback) {
                data.word_list.push({word: word.word, frequency: word.frequency});
                callback();
            }, function (err) {
                callback();
            })
        }

    }, function (err) {
        output.artist_list = data.artist_list;
        output.word_list = data.word_list
        output.word_artist_list = data.word_artist_list;
        output.tracks = tracks_mbid;
        callback(null, output);
    })
}
    