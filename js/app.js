'use strict'

$(document).ready(function(){

});

var getDate = function () {

};

$('#btnSearch').click(function(){
	getBookInfo();
});

// ------------------------------------------------
// object myCollection contains an array of objects
// each object is data about a single book series
// ------------------------------------------------
var myCollection = 
{ "collection":
	[{	"seriesID":"123456",
		"title":"Invincible Ironman" },

	{	"seriesID":"987654",
		"title":"Star Wars"}
	]
};


var getBookInfo = function() {
	var parameters = {
	 	apikey:'0f54467a743e447ef10bbe24dff98d44d6d0e178',
	 	json_callback: "jsonp"
	};

	var	url = 'http://www.comicvine.com/api?api_key=' + parameters.apikey + 'filter=limit:50&format=jsonp&json_callback=handleCallback';

	http://www.comicvine.com/api/search?api_key=[MY API KEY]&limit=1&format=jsonp&json_callback=handleCallback


	console.log(url);
	$.getJSON(url, parameters, function(data) {
		console.log(data);

	});


	// + '&format=json'
};