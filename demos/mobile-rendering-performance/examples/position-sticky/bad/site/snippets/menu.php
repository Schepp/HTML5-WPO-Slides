<ul class="menu">
    <?php
    foreach($pages->findByUID('home')->children() as $child){
        echo '<li class="menu-item"><a href="#'.$child->uid().'">'.html($child->title()).'</a></li>'."\r\n";
    }
    ?>
    <li class="menu-item"><a href="#anfahrt">Anfahrt</a></li>
</ul>