function handleOrientationChange() {
    $('#viewport').attr('content','width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no');
    $('body').addClass('orientationchange');
    window.setTimeout(function(){
        $('#viewport').attr('content','width=device-width, user-scalable=no');
        $('body').removeClass('orientationchange');
    },1000);
}

if(window.matchMedia){
    this.orientationMql = window.matchMedia('(orientation: portrait)');
    this.orientationMql.addListener(function(){
        handleOrientationChange();
    });
}