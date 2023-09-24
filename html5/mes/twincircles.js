// Zwillingskreise des Archimedes
// Java-Applet (11.04.2000) umgewandelt
// 15.10.2015 - 16.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorTotal = "#00ff00";                                // Farbe f�r den gro�en Halbkreis
var colorLeft = "#ff0000";                                 // Farbe f�r den kleinen Halbkreis links
var colorRight = "#0000ff";                                // Farbe f�r den kleinen Halbkreis rechts
var colorTwins = "#ff00ff";                                // Farbe f�r die Zwillingskreise

// Weitere Konstanten:

var R = 240;                                               // Radius des gro�en Halbkreises (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen (Pixel)
var cb1, cb2;                                              // Optionsfelder
var drag;                                                  // Flag f�r Zugmodus
var xM, yM;                                                // Kreismittelpunkt (Pixel)
var x0, y0;                                                // Bezugspunkt (oberes Ende der Trennlinie, Pixel)
var p, q;                                                  // Hypotenusenabschnitte (Pixel)
var rTwins;                                                // Radius der Zwillingskreise (Pixel)
var x1, y1;                                                // Mittelpunkt des linken Zwillingskreises (Pixel)
var x2, y2;                                                // Mittelpunkt des rechten Zwillingskreises (Pixel)

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
  canvas = document.getElementById("cv");                  // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("text1",text01);                              // Erkl�render Text (Hilfslinien)
  cb1 = getElement("cb1");                                 // Linkes Optionsfeld
  cb1.checked = false;                                     // H�kchen zun�chst nicht gesetzt
  getElement("text2",text02);                              // Erkl�render Text (links)
  cb2 = getElement("cb2");                                 // Rechtes Optionsfeld
  cb2.checked = false;                                     // H�kchen zun�chst nicht gesetzt
  getElement("text3",text03);                              // Erkl�render Text (rechts)
  getElement("author",author);                             // Autor (und �bersetzer)
  drag = false;                                            // Zugmodus abgeschaltet
  xM = width/2; yM = 280;                                  // Mittelpunkt (Pixel)
  x0 = Math.floor(xM-0.6*R);                               // x-Koordinate des Bezugspunktes
  calculation();                                           // Berechnungen  
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers 
  cb1.onclick = paint;                                     // Reaktion auf linkes Optionsfeld
  cb2.onclick = paint;                                     // Reaktion auf rechts Optionsfeld
   
  } // Ende der Methode start
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Zugmodus)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Zugmodus)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {   
  drag = false;                                            // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) { 
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
  
// Reaktion auf Mausklick oder Ber�hren mit dem Finger:
// Seiteneffekt drag

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che
  if (x < xM-R || x > xM+R) return;                        // Falls Position zu weit links oder rechts, abbrechen
  if (y < yM-R || y > yM) return;                          // Falls Position zu weit oben oder unten, abbrechen
  drag = true;                                             // Zugmodus einschalten
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// Seiteneffekt x0, p, q, y0, rTwins, x1, y1, x2, y2

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che
  if (x < xM-R) x = xM-R;                                  // Falls Position zu weit links, korrigieren
  if (x > xM+R) x = xM+R;                                  // Falls Position zu weit rechts, korrigieren
  x0 = x;                                                  // x-Koordinate 
  calculation();                                           // Berechnungen durchf�hren     
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Berechnungen:
// Seiteneffekt p, q, y0, rTwins, x1, y1, x2, y2

function calculation () {
  var dx = x0-xM;                                          // x-Koordinate relativ zum Mittelpunkt (Pixel)                           
  p = R+xM-x0;                                             // Hypotenusenabschnitt rechts (Pixel) 
  q = R+x0-xM;                                             // Hypotenusenabschnitt rechts  (Pixel)
  y0 = yM-Math.sqrt(R*R-dx*dx);                            // y-Koordinate Bezugspunkt (Pixel)
  rTwins = p*q/(4*R);                                      // Radius der Zwillingskreise (Pixel)
  x1 = x0-rTwins;                                          // x-Koordinate linker Zwillingskreis-Mittelpunkt (Pixel)
  var a = x1-(xM-R+q/2);                                   // Waagrechte Kathete f�r linken Zwillingskreis (Pixel)
  var b = q/2+rTwins;                                      // Hypotenuse f�r linken Zwillingskreis (Pixel)
  y1 = yM-Math.sqrt(b*b-a*a);                              // y-Koordinate linker Zwillingskreis-Mittelpunkt (Pixel)
  x2 = x0+rTwins;                                          // x-Koordinate rechter Zwillingskreis-Mittelpunkt (Pixel)
  a = x2-(xM+R-p/2);                                       // Waagrechte Kathete f�r rechten Zwillingskreis (Pixel)
  b = p/2+rTwins;                                          // Hypotenuse f�r rechten Zwillingskreis (Pixel)
  y2 = yM-Math.sqrt(b*b-a*a);                              // y-Koordinate rechter Zwillingskreis-Mittelpunkt (Pixel)
  }

//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
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
  
// Punkt markieren:
// (x,y) ... Koordinaten (Pixel)
  
function point (x, y) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = "#000000";                               // F�llfarbe schwarz
  ctx.arc(x,y,1.5,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausf�llen
  }
   
// Vollst�ndiger Kreis:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe

function circle (x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fill(); ctx.stroke();                                // Kreis ausf�llen und Rand zeichnen
  point(x,y);                                              // Mittelpunkt markieren
  }
  
// Oberer Halbkreis:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe

function halfCircle (x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.moveTo(x-r,y);                                       // Anfangspunkt links
  ctx.lineTo(x+r,y);                                       // Weiter nach rechts
  ctx.arc(x,y,r,0,Math.PI,true);                           // Oberer Halbkreis
  ctx.fill(); ctx.stroke();                                // Halbkreis ausf�llen und Rand zeichnen
  point(x,y);                                              // Mittelpunkt markieren
  }
  
// Hilfslinien zu einem der Zwillingskreise:
// (x,y) ... Mittelpunkt des Zwillingskreises (Pixel)

function auxiliaryLines (x, y) {
  var phi = Math.atan2(yM-y,x-xM);                         // Winkel (Bogenma�)
  var xB = xM+R*Math.cos(phi);                             // x-Koordinate Ber�hrpunkt (Pixel)
  var yB = yM-R*Math.sin(phi);                             // y-Koordinate Ber�hrpunkt (Pixel)
  line(xM,yM,xB,yB);                                       // Verbindungslinie Kreismittelpunkt-Ber�hrpunkt
  line(x,y,x,yM);                                          // Senkrechte Linie
  var xx = (x>x0 ? xM+q/2 : xM-p/2);                       // x-Koordinate Halbkreismittelpunkt
  line(xx,yM,x,y);                                         // Verbindungslinie Kreismittelpunkt-Halbkreismittelpunkt
  line(x,y,x0,y);                                          // Waagrechte Linie
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  halfCircle(xM,yM,R,colorTotal);                          // Gro�er Halbkreis
  halfCircle(xM-R+q/2,yM,q/2,colorLeft);                   // Kleiner Halbkreis links
  halfCircle(xM+R-p/2,yM,p/2,colorRight);                  // Kleiner Halbkreis rechts
  circle(x1,y1,rTwins,colorTwins);                         // Linker Zwillingskreis
  circle(x2,y2,rTwins,colorTwins);                         // Rechter Zwillingskreis
  line(x0,y0,x0,yM);                                       // Senkrechte Trennlinie
  if (cb1.checked) auxiliaryLines(x1,y1);                  // Hilfslinien links, falls gew�nscht
  if (cb2.checked) auxiliaryLines(x2,y2);                  // Hilfslinien rechts, falls gew�nscht
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


