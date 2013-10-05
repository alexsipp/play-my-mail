
var PlayMy = require('../lib/playmy');
var async = require('async');

PlayMy.prototype.generate_ds3_graph_data = function (process_data, callback) {

	console.log("Creating Graph Data"); 

	artist_list= process_data.artist_list
	word_list = process_data.word_list
	word_artist_list = process_data.word_artist_list
	
	var graph ={'nodes':[], 'links':[]}
	var nodes_aux=[]


	//append artists to the node list
	async.series({

		add_artist_nodes: function(callback){

			async.forEach(artist_list, function(artist_item, callback){

				graph.nodes.push( {name: artist_item.name, group: 1})
				nodes_aux.push(artist_item.name)

				callback();
			}, function(err){

				console.log('finished with artist nodes');
				callback()
			});

		},

		add_word_nodes: function(callback){

			async.forEach(word_list, function(word_item, callback){

				graph.nodes.push( {name: word_item.word, group: 2})
				nodes_aux.push(word_item.word)

				callback();

			}, function(err){

				console.log('finished with word nodes');
				callback()
			});


		},

		add_links: function(callback){

			console.log('procesing links');

			async.forEach(word_artist_list, function(item, callback){

				
				var word_pr = item.word
				//console.log('WORD: '+word_pr)
				var word_index = nodes_aux.indexOf(word_pr)
				//console.log('WORD_INDEX: ' + word_index)
				var artists_pr = item.artists

				//now iterate through all artists
				async.forEach(artists_pr, function(item_artist, callback){

					var artist_pr = item_artist.name
					//console.log('ARTIST: '+ artist_pr)
					var track_count = item_artist.track_count
					var mb_id = item_artist.mbid
					var artist_index = nodes_aux.indexOf(artist_pr)
					//console.log('ARTIST_INDEX: '+ artist_index)
					graph.links.push( {'source': word_index, 'target':artist_index,  'track_count': track_count, 'mbid': mb_id })
					//Now I have source: word_index, target: artist_index, track_count:count
					callback()
				}, function(err){
					callback()
				});
					
			}, function(err){
				callback()
			});
		}
	}, function(err){


		//console.log('Got the graph ')
		//console.log(nodes)

		callback(null, graph);


		//all finished
	});


}; 
