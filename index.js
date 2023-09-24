// Homepage Walter Fendt, Javascript
// Letzte �nderung 28.06.2015

// Foto f�r Startseite ausw�hlen

function auswahl () {

var file, text;
var n = 32;
var z = Math.floor(n*Math.random());
switch(z) {
  case 0:
    file = 'Aggenstein.jpg';
    text = 'Aggenstein und Brentenjoch (Allg&auml;uer Alpen)'; break;
  case 1:
    file = 'Gaishorn.jpg';
    text = 'Gaishorn, davor Schnurschrofen (Allg&auml;uer Alpen)'; break;
  case 2:
    file = 'Ronenspitze.jpg';
    text = 'Gaishorn und Ronenspitze (Allg&auml;uer Alpen)'; break;
  case 3:
    file = 'Blumen01.jpg';
    text = 'Aurikel'; break;
  case 4:
    file = 'Blumen02.jpg';
    text = ''; break;
  case 5:
    file = 'Geierkoepfe.jpg';
    text = 'Geierk&ouml;pfe (Ammergauer Alpen)'; break;
  case 6:
    file = 'Ochsenhorn.jpg';
    text = 'Gr. Ochsenhorn (Loferer Steinberge)'; break;
  case 7:
    file = 'Stadelhorn.jpg';
    text = 'Stadelhorn (Berchtesgadener Alpen)'; break;
  case 8:
    file = 'Ruitelspitzen.jpg';
    text = 'Ruitelspitzen, dahinter Wetterspitzgruppe (Lechtaler Alpen)'; break;
  case 9:
    file = 'Rheinwaldhorn.jpg';
    text = 'Rheinwaldhorn (Adulagruppe)'; break;
  case 10:
    file = 'Hochfeiler.jpg';
    text = 'Hochfeiler (Zillertaler Alpen)'; break;
  case 11:
    file = 'Kreuzotter.jpg';
    text = 'Kreuzotter'; break;
  case 12:
    file = 'Blumen03.jpg';
    text = 'Enzian'; break;
  case 13:
    file = 'Blumen04.jpg';
    text = ''; break;
  case 14:
    file = 'Blumen05.jpg';
    text = ''; break;
  case 15:
    file = 'Bergell.jpg';
    text = 'Bergell'; break;
  case 16:
    file = 'Biberkopf.jpg';
    text = 'Biberkopf (Allg&auml;uer Alpen)'; break;
  case 17:
    file = 'Dachstein.jpg';
    text = 'Dachstein-Massiv'; break;
  case 18:
    file = 'Daumen.jpg';
    text = 'Rotspitze und Gr. Daumen (Allg&auml;uer Alpen)'; break;
  case 19:
    file = 'Geierkoepfe2.jpg';
    text = 'Geierk&ouml;pfe (Ammergauer Alpen)'; break;
  case 20:
    file = 'Loferer.jpg';
    text = 'Loferer Steinberge'; break;
  case 21:
    file = 'Widderstein.jpg';
    text = 'Widderstein (Allg&auml;uer Alpen)'; break;
  case 22:
    file = 'Poellat.jpg';
    text = 'P&ouml;llat (Ammergauer Alpen)'; break;
  case 23:
    file = 'Steinboecke.jpg';
    text = 'Steinb&ouml;cke'; break;
  case 24:
    file = 'Totenkirchl.jpg';
    text = 'Totenkirchl (Kaisergebirge)'; break;
  case 25:
    file = 'Triglav.jpg';
    text = 'Am Triglav (Julische Alpen)'; break;
  case 26:
    file = 'Edelweiss.jpg';
    text = 'Edelwei&szlig;'; break;
  case 27:
    file = 'BohJezero.jpg';
    text = 'Bohinjsko Jezero (Slowenien)'; break;
  case 28:
    file = 'Muttekopf.jpg';
    text = 'Muttekopf (Lechtaler Alpen)'; break;
  case 29:
    file = 'Gufelsee.jpg';
    text = 'Gufelsee (Lechtaler Alpen)'; break;
  case 30:
    file = 'Parzinn.jpg';
    text = 'Schlenkerspitze und Dremelspitze (Lechtaler Alpen)'; break;
  case 31:
    file = 'Heiterwand.jpg';
    text = 'Tschachaun und Heiterwand (Lechtaler Alpen)'; break;
  }
return '<img src="./fotos/' + file + '" alt = "' + text + '">';
}

// Alter in Gigasekunden

function ags () {
  var datum = new Date();
  var gs = (datum - new Date(1953,2,14))/1e12;
  gs = Math.round(100*gs)/100;
  var gss = new String(gs);
  var i = gss.indexOf(".");
  return gss.substring(0,i)+","+gss.substring(2);
  }
  
// E-Mail-Adresse zusammensetzen

function em () {
  return "mail"+"@"+"walter"+"-"+"fendt"+"."+"de";
  }
  
// Link auf E-Mail-Adresse setzen
  
function linkem () {
  var e = document.getElementById("email");
  var a = em();
  if (e) e.innerHTML = '<a href="'+'mailto:'+a+'">'+a+'</a>';
  }
  
// Startseite: Auswahl eines Fotos

function start () {
  var bild = document.getElementById("foto");
  if (bild) bild.innerHTML = auswahl();
  }
  
// Array mit Lottotipp:

function lottotipp () {
  var flags = new Array(49);                               // Array f�r Wahrheitswerte
  for (i=0; i<6; i++) {
    var begin = true;
    var number = 0;
    while (flags[number] || begin) {
      number = Math.floor(49*Math.random());
      begin = false;
      }
    flags[number] = true;
    }
  var tipp = new Array(6);                                 // Array f�r Tipp                                
  i = 0;                                                  
  for (var k=0; k<49; k++)                              
    if (flags[k]) {tipp[i] = k+1; i++;}                    
  return tipp;  
  }
  
function schreibenLottotipp () {
  var tr = document.getElementById("lotto");
  var tipp = lottotipp();
  for (var i=0; i<6; i++) {
    var td = document.createElement("td");
    td.innerHTML = ""+tipp[i];
    tr.appendChild(td);
    }
  }

document.addEventListener("DOMContentLoaded",start,false);
