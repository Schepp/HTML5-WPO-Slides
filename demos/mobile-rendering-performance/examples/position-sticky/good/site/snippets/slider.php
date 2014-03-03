<div class="slideshow-viewport">
    <div class="slideshow" style="background-image: url(<?php echo $slider->children()->first()->images()->first()->url(); ?>);">
        <ul class="slides">
            <?php
            foreach($slider->children() as $child){
                echo '<li><img src="'.$child->images()->first()->url().'">'.($child->text() != '' ? '<div><strong>'.html($child->title()).'</strong>'.markdown($child->text()).'</div>' : '').'</li>';
            }
            ?>
        </ul>
    </div>
</div>