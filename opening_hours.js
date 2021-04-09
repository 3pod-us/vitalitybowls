var reviewsElement = document.querySelector(".google-business-reviews-rating");
try{
	reviewsElement.style.display = "none";
}catch(e){
	console.error(e);
}
var GoogleReviewsInfo = {
	reviewsElement: reviewsElement,
	results: {},
	renderReviews: function(r){
		var app = this;
		var reviews = r.result.reviews,
		vicinity = r.result.vicinity,
		businessName = r.result.name,
		ratingNumber = r.result.rating,
		ratingNumberInt = Number.parseInt(ratingNumber),
		maxRatingNumber = 5,
		leftRating = maxRatingNumber - ratingNumberInt,
		place_id = r.result.place_id||"";

		var ul = app.reviewsElement.querySelector("ul.listing");
		var nodesList = [...ul.querySelectorAll("li")];
		var headingElement = app.reviewsElement.querySelector(".heading");
		var icon = app.reviewsElement.querySelector(".heading .icon");
		var vicinityElement = app.reviewsElement.querySelector(".vicinity");
		var ratingNumberElement = app.reviewsElement.querySelector(".rating .number");
		var ratingUrlElement = app.reviewsElement.querySelector(".rating .count");
		var allStarsAnimated = app.reviewsElement.querySelector(".all-stars.animate");

		var iconHTML = icon.outerHTML;
		headingElementText = headingElement.innerText;
		headingElement.innerHTML = iconHTML+`<span class='google-reviews-title'>${businessName}</span>`; 

		var iconImg =  app.reviewsElement.querySelector(".heading .icon img");
		iconImg.classList.remove("lazy-hidden");
		headingElement = app.reviewsElement.querySelector(".google-reviews-title");

		headingElement.innerText = businessName;
		vicinityElement.innerText = vicinity;
		ratingNumberElement.innerText = ratingNumber;
		ratingUrlElement.href = place_id;

		var stars = "";
		for (var i = ratingNumberInt - 1; i >= 0; i--) {
			stars += "<span style='color:#e7711b;'>\u2605</span>"
		}
		for (var i = leftRating - 1; i >= 0; i--) {
			stars += "<span>\u2605</span>"
		}
		allStarsAnimated.innerHTML = stars;

		// reviews rendering
		nodesList.map(function( node, key ){
			var review = reviews[key],
			photo = review.profile_photo_url,
			rating = review.rating,
			maxRating = 5,
			leftRating = maxRating - rating,
			time = review.relative_time_description,
			text = review.text,
			reviewSnippet = review.text.substr(0, 148),
			reviewFull = review.text.substr(149),
			author_name = review.author_name,
			author_url = review.author_url;

			// rendering "stars"
			var stars = "";
			for (var i = rating - 1; i >= 0; i--) {
				stars += "\u2605"
			}
			for (var i = leftRating - 1; i >= 0; i--) {
				stars += "<span class='not'>\u2606</span>"
			}

			// selectors.
			var photoElement = node.querySelector(".author-avatar a img"),
			author_url_els = [...node.querySelectorAll(".author-avatar a, author-name a")],
			authorElement = node.querySelector(".author-name a"),
			ratingElement = node.querySelector(".rating"),
			timeElement = node.querySelector(".relative-time-description"),
			reviewSnippetElement = node.querySelector(".review-snippet");
			reviewFullElement = node.querySelector(".review-snippet");

			// replacing content
			photoElement.src = photo;
			author_url_els.map(function(urlEl){
				urlEl.href = author_url
			});
			authorElement.innerText = author_name;
			ratingElement.innerHTML = stars;
			timeElement.innerHTML = time;
			if(reviewSnippetElement === null){
				node.querySelector(".text").innerText = text;
			}else{
				reviewSnippetElement.innerText = reviewSnippet;
				reviewFullElement.innerText = reviewFull;
			}
						
		})
		reviewsElement.style.display = "block";
	},
	renderPhone: function(r){
		var formatted_phone_number = r.result.formatted_phone_number;
		var elements = [...document.querySelectorAll(".formatted_phone_number")];
		elements.map(function( node ){
			if(node.tagName === "a"||node.tagName === "A"){
				node.href = "tel:"+formatted_phone_number;
			}
	    	node.innerHTML = formatted_phone_number;
	    });
	},
	renderAddresses: function(r){
		var formatted_address = r.result.formatted_address;
		var elements = [...document.querySelectorAll(".formatted_address")];
		elements.map(function( node ){
	    	node.innerHTML = formatted_address;
	    });
	},
	openNow: function(r){
		var periods = r.result.opening_hours.periods;
		var is_open_now = r.result.opening_hours.open_now;
		var today = periods[new Date().getDay()];
		if(is_open_now === true){
			is_open_now = "OPEN NOW"
		}else{
			is_open_now = "CLOSE NOW"
		}

		today.close.hour = today.close.time.substr(0, 2)+":"+today.close.time.substr(2, 4);
		today.open.hour = today.open.time.substr(0, 2)+":"+today.open.time.substr(2, 4);
		var titles = document.querySelectorAll(".open_now, h3.open_now");

		[...titles].map(function( node ){

			if(node.tagName === "h3" || node.tagName === "H3"){
				//
			}else{
				node = node.parentNode;
			}
			
			node.innerHTML = `${is_open_now} | <span style="color:#F5822A;" class="close_time">${today.close.hour}</span>`;
		})
	},
	renderHours: function(r){
		var opening_hours = r.result.opening_hours;
		var elements = [...document.querySelectorAll(".opening_hours")];
		elements.map(function( node ){
	    	var html = "";
	    	opening_hours.weekday_text.map(function( hour ){
	    		html += `${hour}<br>`
	    	})
	    	node.innerHTML = html;
	    });
	},
	init: function(){
		var Loc = window.location.href.split("locations/")[1].split("/")[0];
		var app = this;
		try{
			fetch("https://vitalitybowls.com/GoogleViews/get.php?location="+Loc).then(function(r){
			    return r.json();
			}).then(function(r){
				app.results = r;
				console.log(r);
				app.renderHours(r);
				app.renderPhone(r);
				app.renderAddresses(r);
				try{
					app.openNow(r);
				}catch(e){ console.error(e) }
				try{
					app.renderReviews(r);
				}catch(e){
					console.error(e);
				}
			})
		}catch(e){
			console.error(e);
			reviewsElement.style.display = "block";
		}
	}
}

// launch.
GoogleReviewsInfo.init();
