var PlayMy 	= require('./playmy'), 
    _       = require('underscore'),
    async	= require('async'),
    fs 		= require('fs');

/**
 * or random tracks
 * @param {string} word
 * @param {string} type ('pop'|'rand')
 * @param {function} callback
 */
PlayMy.prototype.run_jobs = function (email, password, callback) {

	var data = {};
	
	async.series({

		delete_previous_files: function (callback) {

			app.get('playmy').delete_previous_files(function (err){
				if (err) console.log(err);
				callback();
			});

		},
		get_email_subjects: function (callback) {

			app.get('playmy').get_email_subjects(email, password, 'INBOX', 400, function (err, titles){
				if (err) console.log(err);
				data.titles = titles;
				callback();
			});

		},
		write_file: function (callback) {

			app.get('playmy').write_file('input_file.txt', data.titles, function (err) {
				if (err) console.log(err);
				callback();
			});

		},
		calculate_word_freq: function (callback) {

			app.get('playmy').calculate_word_freq('freq_file.txt', function (err) {
				if (err) console.log(err);
				callback();
			});

		}

	}, function (err) {
		callback(null, data);
	})

};