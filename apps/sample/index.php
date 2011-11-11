<!-- APP SOURCE FILE -->
<?php 
	// PHP Code - define constante with a APP ID from GET
	define('APP_ID', $_GET['containerID']);
?>

<!-- 
	HTML / JavaScript Code
	
    Structure:
    ----------
    
    <appcode id="<?= APP_ID ?>">		required, utility code for APP
    
    	<init>		not required
         	...
   			JavaScript for APP initialization, called by app.load
         	...
        <init>

        
        <destruct>		not required
          	...
   			JavaScript for APP, called by app.close
          	...
        </desctruct>

    
        <headertext>		not required
           	Header text for APP Window
        </headertext>
        
    </appcode>
    
    
 -->
<appcode id="<?= APP_ID ?>">

    <init>
        this.$('p').css('background','#ccc'); 	<!-- Set background color for <p> in self context -->
        <?= APP_ID ?>.startTime = Date.now();	<!-- Start own timer (see js/script.js) -->
        showTime('<?= APP_ID ?>');				<!-- Show own timer (see js/script.js) -->
    </init>
    
    <destruct>
        return confirm(this.id+':Schlie&szlig;en?'); <!-- Close confirmation -->
    </destruct>
    
    <headertext>
    	SAMPLE APPlication <?= APP_ID ?>
    </headertext>
    
</appcode>


<center>
<p>Hello Wo-orld!!!</p>
<a href="javascript:;" onclick="miau(<?= APP_ID ?>)">Sag miau!</a> <!-- Transfer an APP ID into a JavaScript function -->

<div id="__<?= APP_ID ?>"></div>

<div>
	<!-- jQuery function can use in self context (with a <?= APP_ID ?>.$() call),
    	 can also in global context (with a jQuery.() call) (the last one example) -->
	<a href="javascript:;" onclick="<?= APP_ID ?>.$('p').css('background','#0f0')">Gr&uuml;n</a>&nbsp;|&nbsp;
    <a href="javascript:;" onclick="<?= APP_ID ?>.$('p').css('background','#f00')">Rot</a>&nbsp;|&nbsp;
    <a href="javascript:;" onclick="jQuery('p').css('background','#f00')">Alles ROT!</a></div>
</center>