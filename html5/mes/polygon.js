// Regelmäßige Vielecke (0), gemeinsame Programmteile
// 25.04.2018 - 24.02.2020

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe

// Sonstige Konstanten:

var R = 200;                                               // Umkreisradius (Pixel)

// Attribute:

var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var xM, yM;                                                // Koordinaten des Mittelpunkts

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }

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
  
// Berechnungen (Koordinaten der Ecken):
// n ... Eckenzahl
// Rückgabewert: Array mit den Koordinaten der Ecken

function coords (n) {
  var my = 2*Math.PI/n;                                    // Mittelpunktswinkel
  v = new Array(n);                                        // Neues Array
  for (var i=0; i<n; i++) {                                // Für alle Indizes ...
    var a = i*my;                                          // Positionswinkel (Bogenmaß)
    v[i] = {x: xM+R*Math.sin(a), y: yM-R*Math.cos(a)};     // Verbund aus Koordinaten (x, y) der Ecke
    }
  return v;                                                // Rückgabewert
  }

// Neuer Grafikpfad mit Standardwerten:
// w ... Liniendicke (optional, Defaultwert 1)

function newPath(ctx, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// ctx ...... Grafikkontext
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)

function line (ctx, x1, y1, x2, y2, c) {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Kreis zeichnen:
// ctx ..... Grafikkontext
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... Linienfarbe (optional)

function circle (ctx, x, y, r, c) {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  