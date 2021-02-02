$(document).ready(function() {
	// $("#bell-notify").click(function(){
	//     $(".dj-notification-box").toggle(1000);
	//   });
	// $("#playlist-song-btn").click(function(){
	//     $(".dj-playlist-box").toggle(1000);
	//   });
	$(".dj-playlist-cross-btn").click(function(){
	    $(".dj-playlist-box").hide(1000);
	  });
	
	// owl carsel

	$('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
            nav: true
          },
          600: {
            items: 2,
            nav: true
          },
          1000: {
            items: 5,
            nav: true,
            loop: true,
            margin: 20
          }
        }
  	});
	// following page tabs
  	$(function() {
		var $tabButtonItem = $('#tab-button li'),
		      $tabSelect = $('#tab-select'),
		      $tabContents = $('.tab-contents'),
		      activeClass = 'is-active';

		  $tabButtonItem.first().addClass(activeClass);
		  $tabContents.not(':first').hide();

		  $tabButtonItem.find('a').on('click', function(e) {
		    var target = $(this).attr('href');

		    $tabButtonItem.removeClass(activeClass);
		    $(this).parent().addClass(activeClass);
		    $tabSelect.val(target);
		    $tabContents.hide();
		    $(target).show();
		    e.preventDefault();
		  });

		  $tabSelect.on('change', function() {
		    var target = $(this).val(),
		        targetSelectNum = $(this).prop('selectedIndex');

		    $tabButtonItem.removeClass(activeClass);
		    $tabButtonItem.eq(targetSelectNum).addClass(activeClass);
		    $tabContents.hide();
		    $(target).show();
		});
	});
});

$(document).ready(function () {
    var itemsMainDiv = ('.MultiCarousel');
    var itemsDiv = ('.MultiCarousel-inner');
    var itemWidth = "";

    $('.leftLst, .rightLst').click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition)
            click(0, this);
        else
            click(1, this)
    });

    ResCarouselSize();




    $(window).resize(function () {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() {
        var incno = 0;
        var dataItems = ("data-items");
        var itemClass = ('.item');
        var id = 0;
        var btnParentSb = '';
        var itemsSplit = '';
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $('body').width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "MultiCarousel" + id);


            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () {
                $(this).outerWidth(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");

        });
    }


    //this function used to move the items
    function ResCarousel(e, el, s) {
        var leftBtn = ('.leftLst');
        var rightBtn = ('.rightLst');
        var translateXval = '';
        var divStyle = $(el + ' ' + itemsDiv).css('transform');
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
    }

    //It is used to get some elements from btn
    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

});