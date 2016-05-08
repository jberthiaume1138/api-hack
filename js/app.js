'use strict'

$(document).ready(function(){

});

var getDate = function () {

};

$('#btnSearch').click(function() {
	getPictures();
});

var getPictures = function() {
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
  		{
		    tags: "clownfish",
		    tagmode: "any",
		    format: "json"
  		},

 		function(data) {
    		$.each(data.items, function(i,item){
    		console.log(item);
     		$("<img />").attr("src", item.media.m).appendTo("#images");
     		if ( i == 3 ) return false;
    	});
  });


















	// var parameters = {
	//  	apikey:'0f54467a743e447ef10bbe24dff98d44d6d0e178',
	//  	dataType: "jsonp"
	// };

	// var	url = 'http://www.comicvine.com/api?api_key=' + parameters.apikey + 'filter=limit:50&format=jsonp';

	// // http://www.comicvine.com/api/search?api_key=[MY API KEY]&limit=1&format=jsonp&json_callback=handleCallback


	// console.log(url);
	// $.getJSON(url, parameters, function(data) {
	// 	console.log(data);

	// });






	// var request = { 
	// 	// tagged: tags,
	// 	// site: 'stackoverflow',
	// 	order: 'desc',
	// 	sort: 'creation'
	// };
	
	// $.ajax({
	// 	url: "http://api.stackexchange.com/2.2/questions/unanswered",
	// 	data: request,
	// 	dataType: "jsonp",//use jsonp to avoid cross origin issues
	// 	type: "GET"
	// })
	// .done(function(result){ //this waits for the ajax to return with a succesful promise object
	// 	var searchResults = showSearchResults(request.tagged, result.items.length);

	// 	$('.search-results').html(searchResults);
	// 	//$.each is a higher order function. It takes an array and a function as an argument.
	// 	//The function is executed once for each item in the array.
	// 	$.each(result.items, function(i, item) {
	// 		var question = showQuestion(item);
	// 		$('.results').append(question);
	// 	});
	// })
	// .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
	// 	var errorElem = showError(error);
	// 	$('.search-results').append(errorElem);


	// + '&format=json'
};