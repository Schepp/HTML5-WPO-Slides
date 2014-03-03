jQuery(function($) {
    $(document).ready( function() {
        var sectionMap = {};
        $('.menu-section').each(function(index){
            sectionMap[index] = this.id;
        });
        if(window.console) console.log(sectionMap);

        //enabling stickUp on the '.menu' class
        $('.menu').stickUp({
            parts: sectionMap,
            itemClass: 'menu-item',
            itemHover: 'active'
        });
    });
});