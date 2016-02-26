
/* JavaScript content from js/custom.js in folder common */

/* Custom JS */

// Vertical Center
applyVerticalCentering = function() {
    $(this).on('pagebeforeshow',function(e,data){
        $('[data-vertical-centred]').hide();
    });
    
    $(this).on('pageshow resize',function(e,data){    
        $('[data-vertical-centred]').each(function(index){
            var _this = $(this);
            _this.css('margin-top',
                      ($(window).height() -
                       $('header:visible').height() -
                       $('footer:visible').height() -
                       _this.outerHeight()-78)/2);
            _this.show();
        });
    });
}();
applyVerticalCentering = function() {
    $(this).on('pagebeforeshow',function(e,data){
        $('[data-vertical]').hide();
    });
    
    $(this).on('pageshow resize',function(e,data){    
        $('[data-vertical]').each(function(index){
            var _this = $(this);
            _this.css('height',
                      ($(window).height() -
                       $('header:visible').height() -
                       $('footer:visible').height()-58) /2);
            _this.show();
        });
    });
}();
