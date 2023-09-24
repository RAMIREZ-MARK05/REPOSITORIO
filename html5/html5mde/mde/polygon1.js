// Konvexe regelmäßige Vielecke
// 25.04.2018 - 02.12.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel polygon1_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe

// Sonstige Konstanten:

var R = 200;                                               // Umkreisradius (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var xM, yM;                                                // Koordinaten des Mittelpunkts (Pixel)
var ip;                                                    // Eingabefeld (Eckenzahl)
var cb1, cb2, cb3, cb4;                                    // Optionsfelder
var n;                                                     // Eckenzahl

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }
  
// Neues Optionsfeld:
// idCB ... ID des Optionsfelds im HTML-Befehl
// idLB ... ID des Labels im HTML-Befehl
// text ... Erklärender Text

function newCheckbox (idCB, idLB, text) {
  var cb = getElement(idCB);                               // Optionsfeld
  cb.checked = false;                                      // Optionsfeld zunächst nicht ausgewählt
  cb.onchange = paint;                                     // Reaktion: Neu zeichnen
  getElement(idLB,text);                                   // Erklärender Text
  return cb;                                               // Rückgabewert
  } 

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  xM = width/2; yM = height/2;                             // Koordinaten des Mittelpunkts
  getElement("lb",text11);                                 // Erklärender Text (Eckenzahl)
  n = 3;                                                   // Startwert für Eckenzahl
  ip = getElement("ip");                                   // Eingabefeld (Eckenzahl)
  ip.value = String(n);                                    // Eingabefeld anpassen
  cb1 = newCheckbox("cb1","cb1a",text12);                  // Optionsfeld (Umkreis)
  cb2 = newCheckbox("cb2","cb2a",text13);                  // Optionsfeld (Inkreis)
  cb3 = newCheckbox("cb3","cb3a",text14);                  // Optionsfeld (Bestimmungsdreiecke)
  cb4 = newCheckbox("cb4","cb4a",text15);                  // Optionsfeld (Diagonalen)   
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer  
  paint();                                                 // Zeichnen
  
  ip.onkeydown = reactionEnter;                            // Reaktion auf Enter-Taste

  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n
  
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
// Seiteneffekt n 

function input () {
  n = inputNumber(ip,3,100);                               // Eckenzahl                   
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
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)

function line (x1, y1, x2, y2, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Kreis zeichnen:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... Linienfarbe (optional)

function circle (x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Grafikausgabe:
  
function paint () {
  var v = coords(n);                                       // Array mit den Koordinaten der Ecken
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(xM,yM-R);                                     // Anfangspunkt (oben)
  for (var i=1; i<=n; i++)                                 // Für alle Indizes ...
    ctx.lineTo(v[i%n].x,v[i%n].y);                         // Linie zum Grafikpfad hinzufügen
  ctx.stroke();                                            // Vieleck zeichnen
  if (cb1.checked)                                         // Falls gewünscht ...
    circle(xM,yM,R);                                       // Umkreis zeichnen
  if (cb2.checked)                                         // Falls gewünscht ... 
    circle(xM,yM,R*Math.cos(Math.PI/n));                   // Inkreis zeichnen
  if (cb3.checked) {                                       // Falls gewünscht ...
    for (var i=0; i<n; i++)                                // Alle Ecken ... 
      line(xM,yM,v[i].x,v[i].y);                           // ... mit Mittelpunkt verbinden
    }
  if (cb4.checked) {                                       // Falls gewünscht ...
    for (i=0; i<n-2; i++)                                  // Für alle sinnvollen Anfangspunkte ...
    for (var k=i+2; k<n; k++)                              // Für alle sinnvollen Endpunkte ...
      line(v[i].x,v[i].y,v[k].x,v[k].y);                   // Diagonale zeichnen
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen

