<?php snippet('header'); ?>

<?php
foreach($page->children() as $child){
    snippet('section', array(
            'section' => $child)
    );
}
?>

<div id="location">
    <?php echo utf8_encode(thumb($page->images()->first(), array(
        'width'   => 470,
        'height'  => 339,
        'quality' => 80,
        'upscale' => true,
        'crop'    => true,
    ))); ?>
</div>
<div id="anfahrt" class="menu-section">
    <h1>Anfahrt</h1>
    <div class="map"><iframe width='100%' height='500px' frameBorder='0' src='http://a.tiles.mapbox.com/v3/schepp.h3a84ggn/mm/zoompan.html#16/51.24133278644249/6.830298900604248'></iframe><img src="<?php echo url('assets/images/arabesq.jpg'); ?>" width="250" height="250"></div>
    <div class="infos">
        <p><strong>Unsere Adresse:</strong><br>
            Ludenberger Straße 1<br>
            40629 Düsseldorf (Grafenberg)</p>

        <!--
        <p>Unweit des Rochus Clubs, der Galopprennbahn und der Golfanlage Düsseldorf-Grafenberg finden Sie das ArabesQ am Ende der Grafenberger Allee, jeweils ca. 10 Minuten entfernt von Altstadt, Flughafen, Messegelände und Hauptbahnhof.</p>
         -->

        <p class="blink">Ausreichend kostenfreie Parkplätze finden Sie auf dem gegenüberliegenden Staufenplatz. Von dort aus sind es nur wenige Schritte zu uns!</p>
    </div>
</div>
<?php snippet('footer') ?>