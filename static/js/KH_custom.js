
(function($){
	"use strict";
	var NAY = {};
	var plugin_track = 'static/plugin/';
	$.fn.exists = function () {
        return this.length > 0;
    };

	/* ---------------------------------------------- /*
	 * Pre load
	/* ---------------------------------------------- */
	NAY.PreLoad = function() {
		document.getElementById("KH_loading").style.display = "none"; 
	}
     /*--------------------
    * Masonry
    ----------------------*/
    NAY.masonry = function () {
    	var portfolioWork = $('.portfolio-content');
    	if ($(".portfolio-content").exists()){
    		loadScript(plugin_track + 'isotope/isotope.pkgd.min.js', function() {
    			if ($(".portfolio-content").exists()){
					    $(portfolioWork).isotope({
					      resizable: false,
					      itemSelector: '.grid-item',
					      layoutMode: 'masonry',
					      filter: '*'
					    });
					    //Filtering items on portfolio.html
					    var portfolioFilter = $('.filter li');
					    // filter items on button click
					    $(portfolioFilter).on( 'click', function() {
					      var filterValue = $(this).attr('data-filter');
					      portfolioWork.isotope({ filter: filterValue });
					    });
					    //Add/remove class on filter list
					    $(portfolioFilter).on( 'click', function() {
					      $(this).addClass('active').siblings().removeClass('active');
					    });
    			}
    		});
    	}
	}
	// Window on Load
	$(window).on("load", function(){
		NAY.masonry(),
		NAY.PreLoad();
	});
	// Document on Ready
})(jQuery);