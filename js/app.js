

$(document).ready(function(){
});

(function() { 

'use strict'

var FishFinder = { 

	getImages: function(tag) {
		//flickr images
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	  		{
			    tags: tag,
			    tagmode: "any",
			    format: "json"
	  		},

			function(data) {
				console.log(data);
	    		$.each(data.items, function(i,item) {
	    		// console.log(item);

	     		$('#images').append(FishFinder.generateImageOutput(item));

	     		if ( i == 4 ) return false; //only return 5 images for now
	    	});
		});

		$('#resultsHeader').text('Images of ' + tag);
	},

	getVideos: function(tag) {
		// youtube videos
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
			FishFinder.generateVideoOutput(data.items);	
		});
	},

	getWiki: function(tag) {
		// wikipedia
		var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + tag + "&callback=?";

		$.getJSON(url, function(data) {
			FishFinder.generateInfo(data);
		});
	},

	getEverything: function(tag) {

		var promiseImages = $.Deferred();

		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	                {
	                  tags: tag,
	                  tagmode: "any",
	                  format: "json"
	                })
	                .done(function(data) {
	                	promiseImages.resolve(data);
	                })
	                .fail(function(){
	                 	promiseImages.reject();
	                });


		var promiseVideos = $.Deferred();

		$.getJSON('https://www.googleapis.com/youtube/v3/search', 
					{
						part: 'snippet',
						q: tag,
						r: 'json',
						key: 'AIzaSyBvdTd6SJBWbM9AHytx3HBHfBK5FPXbwaA'
					})		
					.done(function(data) {
						promiseVideos.resolve(data);
					});


		var promiseWiki = $.Deferred();

		$.getJSON("http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + tag + "&callback=?")
					.done(function(data) {
						promiseWiki.resolve(data);
					});

		
		$.when(promiseImages,promiseVideos,promiseWiki).done(function(imageData,videoData,wikiData) {	
			// console.log(imageData);
			// console.log(videoData);
			// console.log(wikiData);

			FishFinder.generateMasonryOutput(imageData,videoData);

			// $.each(imageData.items, function(i,item) {

			// 	$('#images').append('<div class="grid-item">' + FishFinder.generateImageOutput(item) + '</div>');
			// 	if ( i == 4 ) return false; //only return 5 images for now
	  //   	});

	  //   	FishFinder.generateVideoOutput(videoData.items);
	    	FishFinder.generateInfo(wikiData);
		});

	},

	generateMasonryOutput: function(imageData,videoData) {

		var arrayItems = [];

		$.each(imageData.items, function(i,item) {
			arrayItems.push(item);
		});

		$.each(videoData.items, function(i,item) {
			arrayItems.push(item);
		});

		for (var i = 0; i < arrayItems.length; i++) {
			console.log(arrayItems[i]);
		};

	},

	generateImageOutput: function(item) {
		// images
		

		// var imageContainer = $('.hidden .grid-item').clone();
		// $(imageContainer).removeClass('.hidden');
		
		var imageContainer = $("<img />").attr("src", item.media.m);

		
		return(imageContainer);


		// $('#images').append(imageContainer);
		// $(imageContainer.)
	},

	generateVideoOutput: function(results) {
		// videos
		var html = '';

		$.each(results,function(index,value) {
			console.log(value.snippet.title);
			html += '<div>';
			html += '<p>' + value.snippet.title + '</p>';
			html += '<a href=https://www.youtube.com/watch?v=' + value.id.videoId + ' target="blank">';
			html += '<img src=' + value.snippet.thumbnails.medium.url + '></a>';
			html += '</div>';
		});

		$('#videos').html(html);
	},

	generateInfo: function(data) {
		console.log(data);
												// the wikipedia JSON isn't very...structured
		var wikiMarkup = data.parse.text["*"];	// so shove the returned Wikipedia HTML into a variable for processing
  
  		var wrapped = $('<div></div>').html(wikiMarkup);	// wrap the whole wiki markup in a div so we can use jQuery against it
       	wrapped.find('a').each(function() {			// rip out the links as they are dead ends
       		$(this).replaceWith($(this).html()); 
       	});
        $('#wiki').html($(wrapped).find('p'));	// the p tags hold the main article, find them, and put them in the DOM
	}




	// activateMasonry: function() {
	// 	// TODO
	// 	$('.grid').masonry({
		
	// 		// options
	// 		itemSelector: '.grid-item',
	// 		columnWidth: 200
	// 	});
	// }
}; // end of object


$('#btnSearch').click(function() {
	$('#images').empty();
	var tag = $('#inputFinder').val();

	//debugging dummy value
	tag = 'moorish idol';

	FishFinder.getEverything(tag);

	// FishFinder.getImages(tag);
	// FishFinder.getVideos(tag);
	// FishFinder.getWiki(tag);
	
	$('#inputFinder').val('');
});

})();