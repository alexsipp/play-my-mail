var PlayMy = require('../lib/playmy');

// Default Route
app.get('/', function (req, res) {
  	res.redirect('/home');
});

// Home Page
app.get('/home', function (req, res) {

	app.get('playmy').delete_previous_files(function(err){
		app.get('playmy').get_email_subjects(, , "INBOX", 1000, function(error, titles){

			console.log('GOT TITLES');
			
			console.log('creating_file');
			app.get('playmy').write_file("input_file.txt",titles,function(err){
				console.log('DONE WITH FILE');

				app.get('playmy').calculate_word_freq('freq_file.txt', function(err){
					console.log('processed word frequency');
				});
			});
		});
	});

	res.render('home', {
	    title: 'Home',
	    page_nav: 'home'
	});    
	
});
