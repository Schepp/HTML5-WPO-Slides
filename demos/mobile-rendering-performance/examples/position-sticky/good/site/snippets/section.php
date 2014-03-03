<div id="<?php echo $section->uid() ?>" class="menu-section">
<?php
    /*
     if($section->hasChildren()){
        foreach($section->children() as $child){
            switch($child->uid()){
                default:
                    break;

                case 'slider':
                    snippet('slider', array(
                        'slider' => $child
                    ));
                    break;
            }
        }
    }
    */
    ?>

    <h1><?php echo html($section->headline()); ?></h1>

    <div class="section
        <?php echo $section->hasImages() ? ' background" style="background-image: url('.$section->images()->first()->url().');"' : '"'; ?>
        >
        <?php
        if($section->hasChildren()){
            foreach($section->children() as $child){
                if($child->hasImages()){
                    echo '<div class="slide" style="background-image: url('.$child->images()->first()->url().');"></div>';
                }
            }
        }

        snippet('section-content', array(
            'section' => $section
        ));
        ?>
    </div>

    <div class="infos"><?php echo markdown($section->infos()); ?></div>

    <span class="separator"></span>
</div>