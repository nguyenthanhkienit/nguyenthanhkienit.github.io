/*------------------------------------------------------------------
[Master Scripts]

Project:    CropIt template
Version:    2.1

[Components]
	- Preloader
	- Fix header menu
	- Fix centered container
	- Full screen section
	- Info section
	- Header search
	- Fixed header
	- Mobile menu
	- Wrap
	- Tabs
	- Icon box auto height
	- Team grig
	- Open side panel
	- Close side panel
	- Content filter
	- Height icon box 2
	- Pricing height 
	- Animation
	- Banner Animation
	- Comments reply
	- Quantity
	- Popup image
	
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[ Preloader ]
*/
jQuery(window).on('load', function () {
    var $preloader = jQuery('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(350).fadeOut('slow');
});

jQuery(document).ready(function(jQuery) {
	"use strict";

	/*------------------------------------------------------------------
	[ Fix header menu ]
	*/

	if(jQuery('.navigation > ul > li').length > 6) {
		jQuery('.navigation').addClass('min');
	}

	function equalHeight(group) {
        if(jQuery(window).width() > '768') {
			var tallest = 0;
	       	jQuery(group).each(function() {
	            var thisHeight = jQuery(this).css('height', "").height();
	            if(thisHeight > tallest) {
	                tallest = thisHeight;
	            }
	        });
	        jQuery(group).height(tallest);
	    } else {
	    	jQuery(group).height('auto');
	    }
    }

    /*------------------------------------------------------------------
	[ Fix centered container ]
	*/
	jQuery(window).on("load resize", function(){
		jQuery('.centered-container').each(function() {
			jQuery(this).css('width', '');
			jQuery(this).css('height', '');
			var width = parseInt(Math.round(jQuery(this).width()).toFixed(0)),
				height = parseInt(Math.round(jQuery(this).height()).toFixed(0));

			if ( width & 1 ) {jQuery(this).css('width', (width+1)+'px');}

			if ( height & 1 ) {jQuery(this).css('height', (height+1)+'px');}
		});
	});

	/*------------------------------------------------------------------
	[ Full screen section ]
	*/

	jQuery(window).on("load resize", function(){
		jQuery('.full-screen:not(.fixed-height)').css('height', jQuery(window).outerHeight());
	});

	/*------------------------------------------------------------------
	[ Info section ]
	*/
	
	jQuery(window).on("load resize", function(){
	    equalHeight('.fw-row .is-col');
    });

    /*------------------------------------------------------------------
	[ Header search ]
	*/
	
    jQuery('.st-button').on("click", function(){
    	var wrap = jQuery(this).parents('.search-top');
    	var input = wrap.find('.input');
		if (wrap.hasClass('open') && input.val() == "") {
			input.fadeOut('500');
			if(jQuery(window).width() > '450') {
				wrap.removeClass('open').parent().find('.navigation').delay('500').fadeIn('500');
			} else {
				wrap.removeClass('open').parents().find('.logo-area').delay('500').fadeIn('500');
			}
			return false;
		} if(input.val() != "") {
			return true;
		} else {
			if(jQuery(window).width() > '450') {
				wrap.addClass('open').parent().find('.navigation').fadeOut('500');
			} else {
				wrap.addClass('open').parents().find('.logo-area').fadeOut('500');
			}
			input.delay('500').fadeIn('500');
			return false;
		};
	});

	/*------------------------------------------------------------------
	[ Fixed header ]
	*/
	
	if(jQuery('.header').hasClass('dark-bg')){
		var h_class = 'dark';
	}
	jQuery(window).on("load resize scroll", function(){
		if(jQuery(window).width() > '990') {
			if ( jQuery(document).scrollTop() > 0 ) {
				jQuery('.header').addClass('fixed').removeClass('dark-bg');
			} else {
				jQuery('.header').removeClass('fixed');
				if (h_class == 'dark') {
					jQuery('.header').addClass('dark-bg');
				}
			}
		} else {
			jQuery('.header').removeClass('fixed');
			if (h_class == 'dark') {
				jQuery('.header').addClass('dark-bg');
			}
		}
	});


	/*------------------------------------------------------------------
	[ Mobile menu ]
	*/
	
	jQuery(window).on("load resize", function(){
		if(jQuery(window).width() <= '990') {
			jQuery('.navigation .menu-item-has-children > a').on("click", function(){
				if(!jQuery(this).hasClass('active')) {
					jQuery(this).addClass('active').parent().children('.sub-menu').slideDown().siblings().children('.sub-menu').slideUp();
					return false;
				} else if(jQuery(this).hasClass('active') && jQuery(this).attr('href') == "#") {
					jQuery(this).removeClass('active').parent().children('.sub-menu').slideUp();
					return false;
				}
			});
		}
	});

	jQuery('.fullscreen-btn:not(.side)').on("click", function(){
		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery('.full-screen-nav').fadeOut();
		} else {
			jQuery(this).addClass('active');
			jQuery('.full-screen-nav').fadeIn();
			jQuery('.fsn-container .cell').css('height', jQuery('.fsn-container').height());
		};
	});

	jQuery('.fullscreen-btn.side').on("click", function(){
		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery('.side-nav').removeClass('active');
		} else {
			jQuery(this).addClass('active');
			jQuery('.side-nav').addClass('active');
		};
	});

	jQuery('.full-screen-nav .close').on("click", function(){
		jQuery('.fullscreen-btn').removeClass('active');
		jQuery('.full-screen-nav, .side-nav').fadeOut();
	});

	jQuery('.side-nav .close').on("click", function(){
		jQuery('.fullscreen-btn').removeClass('active');
		jQuery('.side-nav').removeClass('active');
	});

	jQuery(window).on("load resize scroll", function(){
		jQuery('.fsn-container .cell').css('height', jQuery('.fsn-container').height());
	});

	jQuery(window).on("load resize", function(){
		jQuery('.full-screen-nav .menu-item-has-children > a, .side-nav .menu-item-has-children > a').on("click", function(){
			if(!jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').parent().children('.sub-menu').slideDown().parent().siblings().children('a').removeClass('active').next('.sub-menu').slideUp();
				return false;
			}
		});
	})

	/*------------------------------------------------------------------
	[ Wrap ]
	*/
	
	jQuery(window).on("load resize", function(){
		jQuery('#content').css('min-height', jQuery(window).height()-jQuery('.footer').outerHeight()-jQuery('.header-space').height()-jQuery('#wpadminbar').height());

	    jQuery('.flow-gallery img').css('height', jQuery(window).height()-jQuery('#wpadminbar').height()-jQuery('.header-space').height()-jQuery('.footer').outerHeight()-50);

	    jQuery('.portfolio-slider.no-cropped').css('height', jQuery(window).height()-jQuery('#wpadminbar').height()-jQuery('.header-space').height());

	    jQuery('.portfolio-slider.no-cropped .cell').each(function() {
	    	jQuery(this).css('height', jQuery(this).parents('.portfolio-slider').height());
	    });

	});

	/*------------------------------------------------------------------
	[ Tabs ]
	*/
	
	jQuery('.tabs-head').on('click', 'li:not(.current)', function() {  
		jQuery(this).addClass('active-tab').siblings().removeClass('active-tab')  
		.parents('.tabs-area').find('.tab-content').eq(jQuery(this).index()).fadeIn(150).siblings('.tab-content').hide();  
		if(jQuery(window).width() > '768') {
			var tallest = 0;
	       	jQuery('.info-section .is-col').each(function() {
	            var thisHeight = jQuery(this).css('height', "").height();
	            if(thisHeight > tallest) {
	                tallest = thisHeight;
	            }
	        });
	        jQuery('.info-section .is-col').height(tallest);
	    } else {
	    	jQuery('.info-section .is-col').height('auto');
	    }
	});

	/*------------------------------------------------------------------
	[ Icon box auto height ]
	*/
	
	jQuery(window).on("load resize", function(){
	    equalHeight('.icon-box-area .icon-box-col');
    });

    /*------------------------------------------------------------------
	[ Team grig ]
	*/
    
    jQuery('.team-grid-item').on("click", function(){
    	if(jQuery(window).width() <= '990') {
    		if (jQuery(this).hasClass('hover')) {
				jQuery(this).removeClass('hover');
			} else {
				jQuery(this).addClass('hover');
			}
		}
	});

	/*------------------------------------------------------------------
	[ Open side panel ]
	*/
    
    jQuery('.side-area-btn').on("click", function(){
    	if(jQuery(window).width() > '990') {
			jQuery('.side-panel').addClass('open');
		} else {
    		if (jQuery('.navigation').hasClass('m-open')) {
    			jQuery(this).removeClass('active');
				jQuery('.navigation').removeClass('m-open');
			} else {
				jQuery('.navigation').addClass('m-open');
				jQuery(this).addClass('active');
			}
		}
		return false;
	});

    /*------------------------------------------------------------------
	[ Close side panel ]
	*/
	jQuery('.side-panel .close').on("click", function(){
		jQuery('.side-panel').removeClass('open');
		return false;
	});

	/*------------------------------------------------------------------
	[ Content filter ]
	*/
	
	if(jQuery('.cf-items:not(.horisontal)').length > 0){
		jQuery(window).on("load", function(){
			if (jQuery('.cf-items').hasClass('masonry')) {
				var mode = 'masonry';
			} else {
				var mode = 'fitRows';
			}
			var $grid = jQuery('.cf-items').isotope({
				layoutMode: mode
			});
			jQuery('.filter-button-group').on( 'click', 'button', function() {
				jQuery(this).addClass('active-tab').siblings().removeClass('active-tab');
				var filterValue = jQuery(this).attr('data-filter');
				$grid.isotope({ filter: filterValue });
			});
		});
	}

	/*------------------------------------------------------------------
	[ Height icon box 2 ]
	*/

    jQuery(window).on("load resize", function(){
	    equalHeight('.icon-box2');
    });

    /*------------------------------------------------------------------
	[ Pricing height  ]
	*/

    jQuery(window).on("load resize", function(){
	    equalHeight('.pricing-item .pi-value');
    });

	/*------------------------------------------------------------------
	[ Animation ]
	*/
	
	jQuery(window).on("load scroll", function(){
		jQuery('.animateNumber').each(function(){
			var num = jQuery(this).attr('data-num');
			
			var top = jQuery(document).scrollTop()+(jQuery(window).height());
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top && !jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').animateNumber({ number: num },2000);
			}
		});
		jQuery('.animateProcent').each(function(){
			var num = jQuery(this).attr('data-num');
			var percent_number_step = jQuery.animateNumber.numberStepFactories.append('%');
			var top = jQuery(document).scrollTop()+(jQuery(window).height());
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top && !jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').animateNumber({ number: num, numberStep: percent_number_step },2000);
				jQuery(this).css('width', num+'%');
			}
		});
	});

	/*------------------------------------------------------------------
	[ Banner Animation ]
	*/

	function animations() {
		jQuery('.banner-block.animated').each(function(){
			var top = jQuery(document).scrollTop()+jQuery(window).height();
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top) {
				jQuery(this).addClass('active');
			}
		});
	}

	jQuery(window).on("load scroll", function(){
		animations();
	});

	/*------------------------------------------------------------------
	[ Comments reply ]
	*/

	jQuery('.replytocom').on('click', function(){
		var id_parent = jQuery(this).attr('data-id');
		jQuery('#comment_parent').val(id_parent);
		jQuery('#commentform-area').appendTo(jQuery(this).parents('.comment-item'));
		return false;
	});

	/*------------------------------------------------------------------
	[ Quantity ]
	*/

	jQuery('.quantity .quantity-minus').on("click", function(){
		var val = jQuery(this).parent().parent().find('.input-text').val();
		if(val > 1) {
			val = parseInt(val) - 1;
			jQuery(this).parent().parent().find('.input-text').val(val);
			jQuery('.update_cart').removeAttr('disabled')
		}
		return false;
	});

	jQuery('.quantity .quantity-plus').on("click", function(){
		var val = jQuery(this).parent().parent().find('.input-text').val();
		val = parseInt(val) + 1;
		jQuery(this).parent().parent().find('.input-text').val(val);
		jQuery('.update_cart').removeAttr('disabled')
		return false;
	});

	/*------------------------------------------------------------------
	[ Popup image ]
	*/
	
	if(jQuery('.popup-link').length > 0) {
		jQuery('.popup-link').magnificPopup({
			type: 'image',
			mainClass: 'mfp-fade'
		});
	}
	
	if(jQuery('.popup-gallery').length > 0) {
		jQuery('.popup-gallery').magnificPopup({
			type: 'image',
			delegate: 'a',
			mainClass: 'mfp-fade',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			},
		});
	}
});


/*------------------------------------------------------------------
[ Popup gallery ]
*/
var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.getElementsByTagName("a")[0]; // <a> element
            
            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return ((el.tagName && el.tagName.toUpperCase() === 'ARTICLE') || (el.tagName && el.tagName.toUpperCase() === 'LI') || (el.tagName && el.tagName.toUpperCase() === 'DIV'));
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
/*
            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
*/
        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

if(jQuery('.my-gallery').length > 0) {
	jQuery('body').append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div><div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div></div></div></div></div>')
	initPhotoSwipeFromDOM('.my-gallery');
}