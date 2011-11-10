<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type="text/javascript" src="jquery-1.6.4.min.js"></script>
<script type="text/javascript" src="jquery-ui-1.8.16.custom.min.js"></script>
<script type="text/javascript" src="jsWindows.js"></script>

<style type="text/css">
div.appWindow {
	position:absolute;
	border: 2px solid;
	border-top-color: #eee;
	border-left-color: #eee;
	border-bottom-color: #333;
	border-right-color: #333;
	background:#fff;
	display: none;
	padding: 3px;
	overflow:hidden;
	}
	
div.appWindow .appHeader {
	height: 20px;
	background: #ccc;
	color: #fff;
	margin: 0;
	padding: .2em 0;
	overflow: hidden;
	cursor: pointer;
	white-space: nowrap;
}

	
div.appWindow.inFocus .appHeader {
	background: #00f;
}

div.appWindow .appHeader h2 {
	font-size: 1em;
	padding: 0 .5em;
	margin: 0;
	float:left;
	overflow: hidden;
}


div.appWindow .appHeader a {
	display:block;
	float: right;
	width:16px;
	height:14px;
	padding-bottom: 2px;
	margin: 1px 2px;
	background:#ccc;
	border: 1px solid;
	border-top-color: #eee;
	border-left-color: #eee;
	border-bottom-color: #333;
	border-right-color: #333;
	color:#000;
	text-decoration:none;
	text-align:center;
	font-size:1em;
	font-family: sans-serif;
	text-shadow: #fff 1px 1px 1px;
}

div.appWindow .appHeader a.appRestore {
	display:none;
}

appcode {display:none}
</style>

</head>

<body>


<script>

var launcher = new appLauncher;

var appClass1 = launcher.addAppClass('sample');
var appClass2 = launcher.addAppClass('dummy');
	
//jQuery = $ = null;

function newExemplar(class){
	app1 = class.addApp();
	app1.load();
}

$('body').css('background','#099');
</script>

<div>
<h2>App Sample</h2>
<a href="javascript:;" onclick="javascript: newExemplar(appClass1)">NEW EXEMPLAR!</a>
</div>
<hr />

<div>
<h2>App Dummy</h2>
<a href="javascript:;" onclick="javascript: newExemplar(appClass2)">NEW EXEMPLAR!</a>
</div>

<p>Bla-bla-bla-d'</p>
</body>
</html>