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

app.post('/process', function (req, res) {
	var email = req.body.email || null;
	var password = req.body.password || null;

	if (email && password) {

		app.get('playmy').run_jobs(email, password, function (err, results) {



		});
	}
	else {
		res.redirect('/home');
	}
	

})