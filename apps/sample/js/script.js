// JavaScript Document
function miau(obj){
alert(obj.id+' sagt Mia-a-u!');
}

    var d=document;
    var NN=d.layers?true:(window.opera&&!d.createComment)?true:false;

function showTime(elem){
 tmN = Date.now() - eval(elem+'.startTime');
 tmN = new Date(tmN);
 var dM=''+tmN.getMinutes();dM=dM.length<2?'0'+dM:dM;
 var dS=''+tmN.getSeconds();dS=dS.length<2?'0'+dS:dS;
 var tmp='Gestartet vor '+dM+':'+dS;
 if(NN)d.F.chas.value=tmp;else d.getElementById('__'+elem).innerHTML=tmp;
 var t=setTimeout('showTime("'+elem+'")',1000)

}