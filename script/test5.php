<?php
    $season = $_GET['season'];
    $files = glob("../videos/$season" . '/*.mp4');
    $file = array_rand($files);
    echo substr($files[$file],3); # quitar ../ de ruta devuelta
    #echo "<br><br>season = ".$season; 
?>