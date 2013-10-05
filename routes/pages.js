var PlayMy = require('../lib/playmy');

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

app.post('/login', function (req, res) {
	var email = req.body.username;
	var password = req.body.password;

	if (username || password) {
		app.get('playmy').delete_previous_files(function(err){
			app.get('playmy').get_email_subjects(email, password, "INBOX", 1000, function(error, titles){

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
	}
	else {
		res.redirect('/home');
	}
	

})