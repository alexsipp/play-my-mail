var PlayMy = require('../lib/playmy'),
	async = require('async'),
	fs = require('fs');

// Default Route
app.get('/', function (req, res) {
  	res.redirect('/home');
});

// Home Page
app.get('/home', function (req, res) {

	res.render('home', {
	    title: 'Home',
	    page_nav: 'home'
	});    
	
});

app.post('/process', function (req, res) {
	var email = req.body.email || null;
	var password = req.body.password || null;
	var data = {};
	var output = {};
	var tracks = [];

	if (email && password) {

		async.series({

			run_jobs: function (callback) {

				console.log('Running jobs');
				app.get('playmy').run_jobs(email, password, function (err, results) {
					data = results;
					callback();
				});
			},
			load_file: function (callback) {
				
				console.log('Load words');
				fs.readFile(__dirname + '/freq_file.txt', 'utf8', function (err, results) {
				if (err) console.log(err);
				 	data.input_data = results;
				 	callback(); 
				 });
				
			},
			transform_text: function (callback) {

				app.get('playmy').transform_text(data.input_data, 1, function (err, results) {
					if (err) console.log(err);
					data.words_list = results;
					callback();
				})
			},
			get_artists: function (callback) {

				app.get('playmy').get_artists(data.words_list, function (err, results) {
					if (err) console.log(err);
					output = results;
					tracks = output.tracks;
					callback();
				})
			},
			generate_graph: function (callback) {
				app.get('playmy').generate_ds3_graph_data(output, function (err, results) {
					if (err) console.log(err);
					console.log(results);
					output = results;
					callback();
				})
			},

			get_spotify_ids: function (callback) {
				app.get('playmy').get_spotify_ids(tracks, function (err, results) {
					output.spotify_ids = results; 
					callback();
				})
			}

		}, function (err) {
			console.log(data);
			res.render('word', {
			    title: 'Home',
			    page_nav: 'home',
			    words: data.words_list,
			    playlist: output.spotify_ids,
			    graph_nodes: output.nodes,
			    graph_links: output.links
			});    
		})
		
	}
	else {
		res.redirect('/home');
	}
	

})