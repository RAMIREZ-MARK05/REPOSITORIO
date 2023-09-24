// Sternpolygone
// 26.04.2018 - 02.12.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel polygon2_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe

// Sonstige Konstanten:

var R = 200;                                               // Umkreisradius (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var xM, yM;                                                // Koordinaten des Mittelpunkts (Pixel)
var ip1, ip2;                                              // Eingabefelder
var n1;                                                    // 1. Zahl Schl�fli-Symbol (Eckenzahl)
var n2;                                                    // 2. Zahl Schl�fli-Symbol

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  xM = width/2; yM = height/2;                             // Mittelpunkt (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb",text21);                                 // Erkl�render Text (Schl�fli-Symbol)
  n1 = 5; n2 = 2;                                          // Startwerte f�r Schl�fli-Symbol
  ip1 = getElement("ip1");                                 // Eingabefeld (1. Zahl Schl�fli-Symbol)
  ip1.value = String(n1);                                  // Eingabefeld anpassen
  ip2 = getElement("ip2");                                 // Eingabefeld (2. Zahl Schl�fli-Symbol)
  ip2.value = String(n2);                                  // Eingabefeld anpassen
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer  
  paint();                                                 // Zeichnen
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste

  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n1, n2
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    input();                                               // Daten �bernehmen                          
  paint();                                                 // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Eingabe einer ganzen Zahl
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls m�glich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = String(n);                                    // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }

// Eingabe:
// Seiteneffekt n1, n2

function input () {
  n1 = inputNumber(ip1,5,100);                             // 1. Zahl Schl�fli-Symbol
  n2 = inputNumber(ip2,1,n1-1);                            // 2. Zahl Schl�fli-Symbol                  
  }
  
// Gr��ter gemeinsamer Teiler (euklidischer Algorithmus):
// a, b ... Gegebene (nat�rliche) Zahlen

function gcd (a, b) {
  if (a != Math.floor(a) || b != Math.floor(b))            // Falls keine ganze Zahl ...
    return undefined;                                      // R�ckgabewert undefiniert
  if (a <= 0 || b <= 0) return undefined;                  // Falls Zahl(en) nicht nat�rlich, R�ckgabewert undefiniert
  while (true) {                                           // Endlosschleife ...
    var c = a%b;                                           // Divisionsrest
    if (c == 0) return b;                                  // R�ckgabewert, falls Rest 0
    a = b; b = c;                                          // Zahlen f�r den n�chsten Durchlauf
    }
  }
  
// Berechnungen (Koordinaten der Ecken):
// n ... Eckenzahl
// R�ckgabewert: Array mit den Koordinaten der Ecken

function coords (n) {
  var my = 2*Math.PI/n;                                    // Mittelpunktswinkel
  var v = new Array(n);                                    // Neues Array
  for (var i=0; i<n; i++) {                                // F�r alle Indizes ...
    var a = i*my;                                          // Positionswinkel (Bogenma�)
    v[i] = {x: xM+R*Math.sin(a), y: yM-R*Math.cos(a)};     // Verbund aus Koordinaten (x, y) der Ecke
    }
  return v;                                                // R�ckgabewert
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Linienfarbe schwarz):
// w ... Liniendicke (optional, Defaultwert 1)

function newPath (w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Grafikausgabe:
  
function paint () {
  var v = coords(n1);                                      // Array mit den Koordinaten der Ecken
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  for (var i=0; i<gcd(n1,n2); i++) {                       // F�r alle zusammenh�ngenden Polygone ...
    var k = i;                                             // Index Startpunkt                                       
    ctx.moveTo(v[k].x,v[k].y);                             // Startpunkt
    while (true) {                                         // Endlosschleife ...
      k = (k+n2)%n1;                                       // Index des n�chsten Punktes
      ctx.lineTo(v[k].x,v[k].y);                           // Linie zum Grafikpfad hinzuf�gen
      if (k == i) break;                                   // Falls Startpunkt wieder erreicht, abbrechen
      }
    }
  ctx.stroke();                                            // Sternpolygon zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen

