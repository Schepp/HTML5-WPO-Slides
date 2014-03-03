jQuery(
function($) {
    var contentButton = [];
    var contentTop = [];
    var content = [];
    var lastScrollTop = 0;
    var scrollDir = '';
    var itemClass = '';
    var itemHover = '';
    var menuSize = null;
    var stickyHeight = 0;
    var stickyMarginB = 0;
    var currentMarginT = 0;
    var topMargin = 0;

    var featureTest = function( property, value, noPrefixes ) {
        // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
        var prop = property + ':',
            el = document.createElement( 'test' ),
            mStyle = el.style;

        if( !noPrefixes ) {
            mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
        } else {
            mStyle.cssText = prop + value;
        }
        return mStyle[ property ].indexOf( value ) !== -1;
    }

    var tests = {
        sticky: featureTest( 'position', 'sticky' ),
        fixed: featureTest( 'position', 'fixed', true )
    }
    var windowScrolled = false;
    var documentScrolled = false;
    var varscroll = 0;
    var vartop = 0;

    var processScrolls = function(){
        var st = $(window).scrollTop();
        if (st > lastScrollTop){
            scrollDir = 'down';
        } else {
            scrollDir = 'up';
        }
        lastScrollTop = st;
        windowScrolled = false;

        varscroll = Math.max(parseInt($(document).scrollTop()),parseInt($(window).scrollTop()));
        if(menuSize != null){
            for(var i=0;i < menuSize;i++)
            {
                contentTop[i] = $('#'+content[i]+'').offset().top;
                function bottomView(i) {
                    var contentView = $('#'+content[i]+'').height()*.4;
                    var testView = contentTop[i] - contentView;
                    //console.log(varscroll);
                    if(varscroll > testView){
                        $('.'+itemClass).removeClass(itemHover);
                        $('.'+itemClass+':eq('+i+')').addClass(itemHover);
                    } else if(varscroll < 50){
                        $('.'+itemClass).removeClass(itemHover);
                        $('.'+itemClass+':eq(0)').addClass(itemHover);
                    }
                }
                if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {
                    $('.'+itemClass).removeClass(itemHover);
                    $('.'+itemClass+':eq('+i+')').addClass(itemHover);
                }
                if(scrollDir == 'up') {
                    bottomView(i);
                }
            }
        }

        if(!tests.sticky){
            if(vartop < varscroll + topMargin){
                $('.stuckMenu').addClass('isStuck');
                $('.stuckMenu').next().closest('div').css({
                    'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
                }, 10);
                $('.stuckMenu').css({
                    position: tests.sticky ? "sticky" : "fixed",
                    top: '0'
                });
                $('.isStuck').css({
                    top: '0'
                }, 10, function(){

                });
            }

            if(varscroll + topMargin < vartop){
                $('.stuckMenu').removeClass('isStuck');
                $('.stuckMenu').next().closest('div').css({
                    'margin-top': currentMarginT + 'px'
                }, 10);
                $('.stuckMenu').css({
                    position: tests.sticky ? "sticky" : "relative",
                    top: '0'
                });
            }
        }

        documentScrolled = false;
    }

	$(document).ready(function(){
        $.fn.stickUp = function( options ) {
            if(tests.sticky) {
                $('html').addClass('sticky');
            } else {
                // adding a class to users div
                $(this).addClass('stuckMenu');
                //getting options
                var objn = 0;
                if(options != null) {
                    for(var o in options.parts) {
                        if (options.parts.hasOwnProperty(o)){
                            content[objn] = options.parts[objn];
                            objn++;
                        }
                    }
                    if(objn == 0) {
                        if(window.console) console.log('error:needs arguments');
                    }

                    itemClass = options.itemClass;
                    itemHover = options.itemHover;
                    if(options.topMargin != null) {
                        if(options.topMargin == 'auto') {
                            topMargin = parseInt($('.stuckMenu').css('margin-top'));
                        } else {
                            if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){
                                topMargin = parseInt(options.topMargin.replace("px",""));
                            } else if(!isNaN(parseInt(options.topMargin))) {
                                topMargin = parseInt(options.topMargin);
                            } else {
                                if(window.console) console.log("incorrect argument, ignored.");
                                topMargin = 0;
                            }
                        }
                    } else {
                        topMargin = 0;
                    }
                    menuSize = $('.'+itemClass).size();
                }
                stickyHeight = parseInt($(this).height());
                stickyMarginB = parseInt($(this).css('margin-bottom'));
                currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
                vartop = parseInt($(this).offset().top);
                //$(this).find('*').removeClass(itemHover);
            }
		}

        $(window).scroll(function(){
            documentScrolled = true;
        });

        $(document).scroll(function() {
            documentScrolled = true;
        });

        $('body').scroll(function() {
            documentScrolled = true;
        });

        (function animloop(){
            window.requestAnimationFrame(animloop);
            processScrolls();
        })();
    });

});
