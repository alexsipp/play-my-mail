var PlayMy 	= require('./playmy'), 
    _       = require('underscore');

/**
 * Get list of tracks which contain the word in lyrics
 * track type can be passd through to get either popular 
 * or random tracks
 * @param {string} word
 * @param {string} type ('pop'|'rand')
 * @param {function} callback
 */
PlayMy.prototype.get_tracks_from_word = function (word, type, callback) {
	
    var track_type = (type == 'pop') ? '&s_track_rating=DESC' : '';

    app.get('playmy').get_api_data(this.api_host + 'track.search?apikey=' + this.api_key + '&q_lyrics=' + word + '&f_has_lyrics=1' + track_type, {}, function (err, results) {
        if (err) callback(err);
        var track_list = results.message.body.track_list;
        callback(null, track_list);
    });

};