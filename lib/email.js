var PlayMy 	= require('./playmy');
var inbox = require('inbox');
var async = require('async');
var file = require("fs");
var sys = require('sys');
var exec = require('child_process').exec;



/**
 * Get list of tracks which contain the word in lyrics
 * get email subjects from mail_folder
 * or random tracks
 * @param {string} user_name
 * @param {string} user_pass 
 * @param {string} mail_folder
 * @param {int} mail_max_num
 * @param {function} callback
 */
PlayMy.prototype.get_email_subjects = function (user_name, user_pass, mail_folder, mail_max_num, callback) {
	
    var client = inbox.createConnection( false, 
                                         "imap.gmail.com", 
                                         {
                                            secureConnection: true,
                                            auth:{
                                                  user: user_name,
                                                  pass: user_pass
                                                }

                                          }
                                      );

    console.log('ready to connect')
    client.connect();


    client.on("connect", function(){
    	client.openMailbox(mail_folder, {readOnly: true}, function(error, info){
    		if (error) throw error;
    		
    		var titles = ''

    		console.log('Connected to folder '+ mail_folder+' total number of mails are: '+ info.count);
    		var limit = -1 * mail_max_num
    		console.log('Ready to get messages')
    		client.listMessages(limit, function(err, messages){
    			async.forEach(messages, function(message, callback){
    				titles = titles +' '+ message.title
	              	callback();

    			}, function(err){

    				console.log("done with emails.");
    				callback(null, titles)

    			});
    		});

    	});

    });};

PlayMy.prototype.write_file = function (filename, text_data, callback) {

	console.log("Creating File..."); 

    var contents = file.writeFile("./"+filename, text_data, function (error){
    	console.log("written file: "+filename);
		callback();
	});
}; 

PlayMy.prototype.calculate_word_freq = function (filename, callback) {

	console.log("Creating File With Word Frequency"); 

	function puts(error, stdout, stderr) { sys.puts(stdout) }

	exec("tr 'A-Z' 'a-z' < input_file.txt | tr -sc 'A-Za-z' '\n' | sort | uniq -c | sort -n -r > routes/"+filename, puts);
	callback();
}; 


PlayMy.prototype.delete_previous_files = function (callback) {

	console.log("Deleting previous files created"); 

	function puts(error, stdout, stderr) { sys.puts(stdout) }

	exec("rm  input_file.txt ", puts);

	//exec("rm  routes/freq_file.txt ", puts);
	callback();
}; 

