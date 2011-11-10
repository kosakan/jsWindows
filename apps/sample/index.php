<?php define('APP_ID', $_GET['containerID']); ?>

<appcode id="<?= APP_ID ?>">

    <init>
        this.$('p').css('background','#ccc');
     //   alert('Geladen: '+this.id);
        <?= APP_ID ?>.startTime = Date.now();
        showTime('<?= APP_ID ?>');
    </init>
    
    <destruct>
    //	alert(this.id+': Chiao!');
        return confirm('Schlie&szlig;en?');
    </destruct>
    
    <headertext>
    	SAMPLE APPlication <?= APP_ID ?>
    </headertext>
    
</appcode>


<center>
<p>Hello Wo-orld!!!</p>
<a href="javascript:;" onclick="miau(<?= APP_ID ?>)">Sag miau!</a>

<div id="__<?= APP_ID ?>"></div>

<div><a href="javascript:;" onclick="<?= APP_ID ?>.$('p').css('background','#0f0')">Gr&uuml;n</a>&nbsp;|&nbsp;<a href="javascript:;" onclick="<?= APP_ID ?>.$('p').css('background','#f00')">Rot</a></div>


</center>