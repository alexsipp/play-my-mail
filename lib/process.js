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
				console.log('Deleted previous files');
				callback();
			});

		},
		get_email_subjects: function (callback) {

			app.get('playmy').get_email_subjects(email, password, 'INBOX', 1000, function (err, titles){
				if (err) console.log(err);
				console.log('Have got list of subjects');
				data.titles = titles;
				callback();
			});

		},
		write_file: function (callback) {

			app.get('playmy').write_file('input_file.txt', data.titles, function (err) {
				if (err) console.log(err);
				console.log('Saved titles to file');
				callback();
			});

		},
		calculate_word_freq: function (callback) {

			app.get('playmy').calculate_word_freq('freq_file.txt', function (err) {
				if (err) console.log(err);
				console.log('Processed word frequency');
				callback();
			});

		},
		load_file: function (callback) {
			
			fs.readFile('/Users/blakeyc/dev/play-my-mail/freq_file.txt', function (err, results) {
				if (err) console.log(err);
				data.input_data = results;
				console.log(results);
				callback(); 
			});

		},
		transform_text: function (callback) {

			app.get('playmy').transform_text(data.input_data, 2, function (err, results) {
				if (err) console.log(err);
				data.words = results;
				callback();
			})
		}

	}, function (err) {
		console.log(data);
		callback(null, data);
	})

};