// Sternpolygone
// 26.04.2018 - 02.12.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel polygon2_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe

// Sonstige Konstanten:

var R = 200;                                               // Umkreisradius (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var xM, yM;                                                // Koordinaten des Mittelpunkts (Pixel)
var ip1, ip2;                                              // Eingabefelder
var n1;                                                    // 1. Zahl Schläfli-Symbol (Eckenzahl)
var n2;                                                    // 2. Zahl Schläfli-Symbol

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  xM = width/2; yM = height/2;                             // Mittelpunkt (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb",text21);                                 // Erklärender Text (Schläfli-Symbol)
  n1 = 5; n2 = 2;                                          // Startwerte für Schläfli-Symbol
  ip1 = getElement("ip1");                                 // Eingabefeld (1. Zahl Schläfli-Symbol)
  ip1.value = String(n1);                                  // Eingabefeld anpassen
  ip2 = getElement("ip2");                                 // Eingabefeld (2. Zahl Schläfli-Symbol)
  ip2.value = String(n2);                                  // Eingabefeld anpassen
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer  
  paint();                                                 // Zeichnen
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste

  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n1, n2
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    input();                                               // Daten übernehmen                          
  paint();                                                 // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Eingabe einer ganzen Zahl
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = String(n);                                    // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }

// Eingabe:
// Seiteneffekt n1, n2

function input () {
  n1 = inputNumber(ip1,5,100);                             // 1. Zahl Schläfli-Symbol
  n2 = inputNumber(ip2,1,n1-1);                            // 2. Zahl Schläfli-Symbol                  
  }
  
// Größter gemeinsamer Teiler (euklidischer Algorithmus):
// a, b ... Gegebene (natürliche) Zahlen

function gcd (a, b) {
  if (a != Math.floor(a) || b != Math.floor(b))            // Falls keine ganze Zahl ...
    return undefined;                                      // Rückgabewert undefiniert
  if (a <= 0 || b <= 0) return undefined;                  // Falls Zahl(en) nicht natürlich, Rückgabewert undefiniert
  while (true) {                                           // Endlosschleife ...
    var c = a%b;                                           // Divisionsrest
    if (c == 0) return b;                                  // Rückgabewert, falls Rest 0
    a = b; b = c;                                          // Zahlen für den nächsten Durchlauf
    }
  }
  
// Berechnungen (Koordinaten der Ecken):
// n ... Eckenzahl
// Rückgabewert: Array mit den Koordinaten der Ecken

function coords (n) {
  var my = 2*Math.PI/n;                                    // Mittelpunktswinkel
  var v = new Array(n);                                    // Neues Array
  for (var i=0; i<n; i++) {                                // Für alle Indizes ...
    var a = i*my;                                          // Positionswinkel (Bogenmaß)
    v[i] = {x: xM+R*Math.sin(a), y: yM-R*Math.cos(a)};     // Verbund aus Koordinaten (x, y) der Ecke
    }
  return v;                                                // Rückgabewert
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
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  for (var i=0; i<gcd(n1,n2); i++) {                       // Für alle zusammenhängenden Polygone ...
    var k = i;                                             // Index Startpunkt                                       
    ctx.moveTo(v[k].x,v[k].y);                             // Startpunkt
    while (true) {                                         // Endlosschleife ...
      k = (k+n2)%n1;                                       // Index des nächsten Punktes
      ctx.lineTo(v[k].x,v[k].y);                           // Linie zum Grafikpfad hinzufügen
      if (k == i) break;                                   // Falls Startpunkt wieder erreicht, abbrechen
      }
    }
  ctx.stroke();                                            // Sternpolygon zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen

