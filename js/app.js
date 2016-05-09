

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
	FishFinder.getInfo(tag);
	$('#inputFinder').val('');
});

})();