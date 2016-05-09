

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

	     		$("<img />").attr("src", item.media.m).appendTo("#images");


	     		if ( i == 4 ) return false;
	    	});
		});

		$('#resultsHeader').text('Images of ' + tag);
	},

	getVideos: function(tag) {

	}



}; // end of object

$('#btnSearch').click(function() {
	$('#images').empty();
	FishFinder.getPictures($('#inputFinder').val());
	$('#inputFinder').val('');
});

})();