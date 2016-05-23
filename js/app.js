

$(document).ready(function(){


});

(function() { 

'use strict'

var FishFinder = { 

	// getImages: function(tag) {
	// 	//flickr images
	// 	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	//   		{
	// 		    tags: tag,
	// 		    tagmode: "any",
	// 		    format: "json"
	//   		},

	// 		function(data) {
	// 			console.log(data);
	//     		$.each(data.items, function(i,item) {
	//     		// console.log(item);

	//      		$('#images').append(FishFinder.generateImageOutput(item));

	//      		if ( i == 4 ) return false; //only return 5 images for now
	//     	});
	// 	});

	// 	$('#resultsHeader').text('Images of ' + tag);
	// },

	// getVideos: function(tag) {
	// 	// youtube videos
	// 	var params = {
	// 		part: 'snippet',
	// 		q: tag,
	// 		r: 'json',
	// 		key: 'AIzaSyBvdTd6SJBWbM9AHytx3HBHfBK5FPXbwaA'
	// 	};

	// 	var endpointURL = 'https://www.googleapis.com/youtube/v3/search';

	// 	$.getJSON(endpointURL, params, function(data) {
	// 		//var data = data.items[0].snippet.title;
	// 		console.log(data.items);
	// 		FishFinder.generateVideoOutput(data.items);	
	// 	});
	// },

	// getWiki: function(tag) {
	// 	// wikipedia
	// 	var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + tag + "&callback=?";

	// 	$.getJSON(url, function(data) {
	// 		FishFinder.generateInfo(data);
	// 	});
	// },

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
			// debugging to make sure the AJAX calls are functioning
			// console.log(imageData);
			// console.log(videoData);
			// console.log(wikiData);

			FishFinder.generateWiki(wikiData,tag);
			FishFinder.generateMasonryOutput(imageData,videoData);
	    	
		});

	},

	generateMasonryOutput: function(imageData,videoData) {
		// the APIs that populate imageData and videoData return vastly different JSON payloads
		// so define a class to store the relevant info from either to make it consistent
		function Gallery (source,thumbnail_url,fullsize_url,title) {
			this.source = source;
			this.thumbnail_url = thumbnail_url;
			this.fullsize_url = fullsize_url;
			this.title = title;
		};

		// array to store each Gallery object
		var collection = [];

		$.each(imageData.items, function(i,item) {		
			// read through each imageData item and extract the needed data
			// store in new instance of the Gallery object
			// API specific URL crafting is here 
			var objGallery = new Gallery();
		
			objGallery.source = 'flickr';
			objGallery.thumbnail_url = item.media.m;
			objGallery.fullsize_url = item.link;
			objGallery.title = item.title;

			collection.push(objGallery);	//store each object in collection array

			if ( i == 9 ) return false; //only return 10 images for now
		});


		$.each(videoData.items, function(i,item) {
			// read through each videoData item and extract the needed data
			// store in new instance of the Gallery object
			// API specific URL crafting is here 
			var objGallery = new Gallery();

			objGallery.source = 'youtube';
			objGallery.thumbnail_url = item.snippet.thumbnails.medium.url;
			objGallery.fullsize_url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
			objGallery.title = item.snippet.title;

			collection.push(objGallery);	//store each object in collection array
		});


		// create html
		for (var i = 0; i < collection.length; i++) {
			var html = '';
			html += '<div class="grid-item">';
			
			//html += '<a href="' + collection[i].fullsize_url + '" target="blank" class="image-big" >';
			html += '<img src="' + collection[i].thumbnail_url + '" class="gallery-image" alt="' + collection[i].title + '"></a>';

			html += '</div>';
			$('#gallery').append(html);
		};

		// activate Masonry
		// need to make sure this doesn't happen till after the images load in the DIV
		var elem = document.querySelector('.grid');
		var msnry = new Masonry( elem, {
  			// options
 			itemSelector: '.grid-item',
  			columnWidth: 240
		});

		// event handlers for the elements created after the AJAX calls
		$('.gallery-image').on('click', function() {
			// handler to activate modal overlay 

			// $('image-big').append('<img src="' + collection[i].fullsize_url + '" class="gallery-image" alt="' + collection[i].title + '">)';
			$('.gallery-modal').append($('.image-big'));

			$('.gallery-modal').css('display', 'block');
		});

		$('.close').on('click',function() {
			$('.gallery-modal').css('display', 'none');
		})

	},

	generateWiki: function(data,tag) {

		$('#resultsHeader').text(tag);
												// the wikipedia JSON isn't very...structured
		var wikiMarkup = data.parse.text["*"];	// so shove the returned Wikipedia HTML into a variable for processing
  
  		var wrapped = $('<div></div>').html(wikiMarkup);	// wrap the whole wiki markup in a div so we can use jQuery against it
       	wrapped.find('a').each(function() {			// rip out the links as they are dead ends
       		$(this).replaceWith($(this).html()); 
       	});
        $('#wiki').html($(wrapped).find('p'));	// the p tags hold the main article, find them, and put them in the DOM
	}









	// generateImageOutput: function(item) {
	// 	// images
		

	// 	// var imageContainer = $('.hidden .grid-item').clone();
	// 	// $(imageContainer).removeClass('.hidden');
		
	// 	var imageContainer = $("<img />").attr("src", item.media.m);

		
	// 	return(imageContainer);


	// 	// $('#images').append(imageContainer);
	// 	// $(imageContainer.)
	// },

	// generateVideoOutput: function(results) {
	// 	// videos
	// 	var html = '';

	// 	$.each(results,function(index,value) {
	// 		console.log(value.snippet.title);
	// 		html += '<div>';
	// 		html += '<p>' + value.snippet.title + '</p>';
	// 		html += '<a href=https://www.youtube.com/watch?v=' + value.id.videoId + ' target="blank">';
	// 		html += '<img src=' + value.snippet.thumbnail_urls.medium.url + '></a>';
	// 		html += '</div>';
	// 	});

	// 	$('#videos').html(html);
	// },






}; // end of object





$('#btnSearch').click(function() {
	$('#images').empty();
	var tag = $('#inputFinder').val();

	//debugging dummy value
	tag = 'moorish idol';

	FishFinder.getEverything(tag);

	$('#inputFinder').val('');
});


})();