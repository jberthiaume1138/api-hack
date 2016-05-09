

$(document).ready(function(){

});

(function() { 

'use strict'

var FishFinder = { 

	getPictures: function(tag) {
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	  		{
			    tags: tag,
			    tagmode: "any",
			    format: "json"
	  		},

			function(data) {
	    		$.each(data.items, function(i,item) {
	    		console.log(item);

	     		FishFinder.generateOutput(item);


	     		if ( i == 4 ) return false;
	    	});
		});

		$('#resultsHeader').text('Images of ' + tag);
	},

	getVideos: function(tag) {
		var params = {
			part: 'snippet',
			q: tag,
			r: 'json',
			key: 'AIzaSyBvdTd6SJBWbM9AHytx3HBHfBK5FPXbwaA'
		};

		var endpointURL = 'https://www.googleapis.com/youtube/v3/search';

		$.getJSON(endpointURL, params, function(data) {
			//var data = data.items[0].snippet.title;
			console.log(data.items);
			//showResults(data.items);
		});
	},

	getInfo: function(tag) {
		var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + tag + "&callback=?";
		$.ajax({
	        type: "GET",
	        url: url,
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	            console.log(data);
	        },
	        error: function (errorMessage) {
	        }
   		 });
	},

	generateOutput: function(item) {
		$("<img />").attr("src", item.media.m).appendTo("#images");
	}


}; // end of object

$('#btnSearch').click(function() {
	$('#images').empty();
	var tag = $('#inputFinder').val();
	FishFinder.getPictures(tag);
	FishFinder.getVideos(tag);
	FishFinder.getInfo(tag);
	$('#inputFinder').val('');
});

})();