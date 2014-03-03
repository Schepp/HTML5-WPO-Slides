<?php
switch($_SERVER['SERVER_PORT']) {
    default:
        c::set('url', 'http://localhost/HTML5-WPO-Slides/demos/mobile-rendering-performance/examples/position-sticky/bad/');
        c::set('subfolder', 'HTML5-WPO-Slides/demos/mobile-rendering-performance/examples/position-sticky/bad/');
        c::set('environment', 'development');
        break;

    case 8080:
    case '8080':
        c::set('url', 'http://localhost/demos/mobile-rendering-performance/examples/position-sticky/bad/');
        c::set('subfolder', 'demos/mobile-rendering-performance/examples/position-sticky/bad/');
        c::set('environment', 'development');
        break;
}
?>
