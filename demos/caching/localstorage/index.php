<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>localStorage</title>
    <?php
    $styles = array('style.css');

    foreach($styles as $style) {
        $md5name = md5($style);
        if(!isset($_COOKIE[$md5name]) || $_COOKIE[$md5name] != filemtime($style)) {
            echo '<style
            data-id="'.$md5name.'"
            data-modified="'.filemtime($style).'">
            '.file_get_contents($style).'
            </style>';
        }
        else {
            echo '<script>
            (function() {
                var stylesheet = document.createElement("style");
                stylesheet.textContent = localStorage.getItem("'.$md5name.'");
                document.getElementsByTagName("head")[0].appendChild(stylesheet);
                console.log("Retrieved '.$md5name.' from localStorage");
            }());
            </script>';
        }
    }
    ?>
</head>
<body>
    <h1>localStorage Demo</h1>
    <p>Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.</p>
    <p>Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb.</p>
    <p>You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.</p>

    <?php
    $scripts = array('script.js');

    foreach($scripts as $script) {
        $md5name = md5($script);
        if(!isset($_COOKIE[$md5name]) || $_COOKIE[$md5name] != filemtime($script)) {
            echo '<script
            data-id="'.$md5name.'"
            data-modified="'.filemtime($script).'">
            '.file_get_contents($script).'
            </script>';
        }
        else {
            echo '<script>
            (function() {
                var script = document.createElement("script");
                script.textContent = localStorage.getItem("'.$md5name.'");
                document.body.appendChild(script);
                console.log("Retrieved '.$md5name.' from localStorage");
            }());
            </script>';
        }
    }
    ?>
</body>
</html>