var _ 		= require('underscore'), 
	PlayMy 	= require('../lib/playmy');


app.all('*', function (req, res, next) {
	res.locals.site_title 	= 'PlayMyMail';
  	next();
});

require('./pages');
