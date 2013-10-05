
var PlayMy = require('../lib/playmy');

PlayMy.prototype.generate_ds3_graph_data = function (artist_list, word_list, word_artist_list, callback) {

	console.log("Creating Graph Data"); 

	var graph ={'nodes':[], 'links':[]}
	var nodes_aux=[]

	//append artists to the node list
	for (var i=0; i< artist_list.length; i++)
	{
		graph.nodes.push( {name: artist_list[i].name, group: 1})
		nodes_aux.push(artist_list[i].name)
	}

	//append words to the node list
	for (i=0; i< word_list.length; i++)
	{
		graph.nodes.push( {name: word_list[i].word, group: 2})
		nodes_aux.push(word_list[i].word)
	}

	//console.log(nodes.nodes)

	//generate links

	for (i=0; i<word_artist_list.length; i++)
	{
		var word_pr = word_artist_list[i].word
		//console.log('WORD: '+word_pr)
		var word_index = nodes_aux.indexOf(word_pr)
		//console.log('WORD_INDEX: ' + word_index)

		var artists_pr = word_artist_list[i].artists

		//now process each artist
		for (var j=0 ; j< artists_pr.length; j++)
		{

			var artist_pr = artists_pr[j].artist
			//console.log('ARTIST: '+ artist_pr)
			var track_count = artists_pr[j].track_count
			var artist_index = nodes_aux.indexOf(artist_pr)
			//console.log('ARTIST_INDEX: '+ artist_index)
			graph.links.push( {'source': word_index, 'target':artist_index,  'track_count': track_count})
			//Now I have source: word_index, target: artist_index, track_count:count
		}
	}
	//console.log('Got the list of nodes')
	//console.log(nodes)
	callback(graph);
}; 