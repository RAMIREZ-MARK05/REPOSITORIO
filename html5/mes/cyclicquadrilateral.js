// Sehnenviereck
// Java-Applet (26.10.1997), umgewandelt in HTML5/Javascript
// 16.01.2016 - 27.11.2017

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorFill = "#ffffff";                                 // Farbe für das Innere des Vierecks
var colors = ["#ff0000", "#008000", "#e0a000", "#0000ff"]; // Farben der Winkelmarkierungen
var colorPoint = "#ff00ff";                                // Farbe der Punkte

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var PI2 = 2*Math.PI;                                       // Abkürzung für 2 pi
var R = 200;                                               // Umkreisradius (Pixel)
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var nr;                                                    // Index der ausgewählten Ecke (0 bis 3 oder -1)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var xM, yM;                                                // Umkreismittelpunkt (Pixel)
var x, y;                                                  // Arrays der Koordinaten der Ecken (relativ zum Mittelpunkt)
var my;                                                    // Array der Positionswinkel (Bogenmaß)

// Start:
	
function start () {
  canvas = document.getElementById("cv");                  // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  xM = width/2; yM = height/2;                             // Umkreismittelpunkt (Pixel)
  my = new Array(30*DEG,70*DEG,220*DEG,310*DEG);           // Array für Positionswinkel der Ecken (Bogenmaß)
  x = new Array(4); y = new Array(4);                      // Arrays für Koordinaten der Ecken
  calculation();                                           // Koordinaten der Ecken berechnen
  nr = -1;                                                 // Zunächst keine Ecke ausgewählt (Zugmodus abgeschaltet)
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers   
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (nr >= 0) e.preventDefault();                         // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = -1;                                                 // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  nr = -1;                                                 // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) { 
  if (nr < 0) return;                                      // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen   
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {   
  if (nr < 0) return;                                      // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern    
  }
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl einer Ecke):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel) 
  var x0 = u-xM, y0 = yM-v;                                // Koordinaten bezüglich Mittelpunkt
  nr = -1;                                                 // Zunächst keine Ecke ausgewählt
  var min2 = 1000000;                                      // Sehr großer Startwert für Abstandsquadrat
  for (var i=0; i<4; i++) {                                // Für alle Ecken ...
    var dx = x0-x[i], dy = y0-y[i];                        // Verbindungsvektor
    var d2 = dx*dx+dy*dy;                                  // Abstandsquadrat
    if (d2 < min2) {min2 = d2; nr = i;}                    // Falls Abstand kleiner als bisher, Werte aktualisieren
    }
  if (min2 > 400) nr = -1;                                 // Falls Abstand zu groß, keine Ecke auswählen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung der aktuellen Ecke):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt x, y, my 

function reactionMove (u, v) {
  if (nr < 0) return;                                      // Falls keine Ecke ausgewählt, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var iPrev = (nr+3)%4;                                    // Index der vorhergehenden Ecke
  var min = my[iPrev]; if (min > my[nr]) min -= PI2;       // Minimum für neuen Positionswinkel
  var iNext = (nr+1)%4;                                    // Index der nächsten Ecke
  var max = my[iNext]; if (max < my[nr]) max += PI2;       // Maximum für neuen Positionswinkel
  var w = corrAngle(Math.atan2(yM-v,u-xM));                // Neuer Positionswinkel (Intervall 0 bis 2 pi)
  if (w > my[nr]+Math.PI) w -= PI2;                        // Korrektur bei Übergang vom 1. zum 4. Quadranten                      
  if (w < my[nr]-Math.PI) w += PI2;                        // Korrektur bei Übergang vom 4. zum 1. Quadranten
  if (w < min) w = min;                                    // Zu kleinen Positionswinkel verhindern
  if (w > max) w = max;                                    // Zu großen Positionswinkel verhindern
  my[nr] = w;                                              // Positionswinkel speichern
  calculation();                                           // Koordinaten der Ecken neu berechnen
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Winkel korrigieren (Wert zwischen 0 und 2 pi erzwingen):

function corrAngle (w) {
  return w-Math.floor(w/PI2)*PI2;
  }
  
// Berechnung der Koordinaten der Ecken:
// Seiteneffekt x, y
  
function calculation () {
  for (var i=0; i<4; i++) {                                // Für alle Ecken-Indizes ...
    x[i] = R*Math.cos(my[i]);                              // Waagrechte Koordinate (bezüglich Mittelpunkt)
    y[i] = R*Math.sin(my[i]);                              // Senkrechte Koordinate (bezüglich Mittelpunkt)
    }
  }
  
// Index der Seite mit überstumpfem Mittelpunktswinkel:
// Falls keine solche Seite existiert (Umkreismittelpunkt innerhalb des Vierecks), Rückgabewert -1
  
function specialIndex () {
  for (var i=0; i<4; i++) {                                // Für alle Ecken-Indizes ...
    var iNext = (i+1)%4;                                   // Index der nächsten Ecke
    var w = corrAngle(my[iNext]-my[i]);                    // Mittelpunktswinkel
    if (w > Math.PI) return i;                             // Falls Winkel überstumpf, Index als Rückgabewert
    }
  return -1;                                               // Rückgabewert -1, da kein überstumpfer Mittelpunktswinkel
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie:
// (x1,y1) ... Anfangspunkt (Koordinaten bezüglich Mittelpunkt)
// (x2,y2) ... Endpunkt (Koordinaten bezüglich Mittelpunkt)
// c ......... Farbe (optional)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(xM+x1,yM-y1); ctx.lineTo(xM+x2,yM-y2);        // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Sehnenviereck:

function quadrilateral () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorFill;                               // Füllfarbe
  ctx.moveTo(xM+x[0],yM-y[0]);                             // Anfangspunkt (Ecke mit Index 0)
  for (var i=1; i<4; i++)                                  // Für alle weiteren Indizes ... 
    ctx.lineTo(xM+x[i],yM-y[i]);                           // Weiter zur nächsten Ecke
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill(); ctx.stroke();                                // Ausgefülltes Viereck mit Rand
  }
  
// Punkt:
// i ... Index (0 bis 3)

function point (i) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.fillStyle = colorPoint;                              // Füllfarbe
  ctx.arc(xM+x[i],yM-y[i],2,0,PI2,true);                   // Kreis vorbereiten
  ctx.fill();                                              // Ausgefüllter Kreis
  }
  
// Einzelne Winkelmarkierung:
// (x,y) ... Bildschirmkoordinaten des Scheitels
// a0 ...... Startwinkel (Bogenmaß)
// a ....... Winkelgröße (Bogenmaß, positiv für Gegenuhrzeigersinn)
// c ....... Füllfarbe
// r ....... Radius (optional, Defaultwert 20)
  
function angle (x, y, a0, a, c, r) {
  if (a < 0) {a = Math.abs(a); a0 -= a;}                   // Bei negativem Winkel Parameterwerte verändern
  newPath();                                               // Neuer Grafikpfad (Standardwerte) 
  ctx.fillStyle = c;                                       // Füllfarbe                 
  ctx.arc(x,y,r?r:20,PI2-a0,PI2-a0-a,true);                // Kreisbogen vorbereiten
  ctx.lineTo(x,y);                                         // Weiter zum Scheitel
  ctx.closePath();                                         // Zurück zum Anfangspunkt des Kreisbogens
  ctx.fill();                                              // Kreissektor ausfüllen
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Paar von Basiswinkeln markieren:
// i ... Index des aktuellen Scheitels
// r ... Radius (Pixel)
  
function baseAngles (i, r) {
  var c = colors[i];                                       // Füllfarbe
  var iNext = (i+1)%4;                                     // Index der nächsten Ecke
  var x0 = xM+x[i], y0 = yM-y[i];                          // Bildschirmkoordinaten des aktuellen Scheitels
  var xNext = xM+x[iNext], yNext = yM-y[iNext];            // Bildschirmkoordinaten des nächsten Scheitels
  var ca = corrAngle(my[iNext]-my[i]);                     // Mittelpunktswinkel (Bogenmaß)
  var bw = (Math.PI-ca)/2;                                 // Basiswinkel
  var def = (Math.abs(x0-xNext)+Math.abs(y0-yNext) > 0.1); // Überprüfung, ob Winkel definiert
  var a0 = Math.atan2(y0-yNext,xNext-x0);                  // Startwinkel für Markierung bei aktueller Ecke 
  if (def) angle(x0,y0,a0,bw,c,r);                         // Winkelmarkierung bei aktueller Ecke
  a0 = Math.atan2(yNext-yM,xM-xNext);                      // Startwinkel für Markierung bei nächster Ecke
  if (def) angle(xNext,yNext,a0,bw,c,r);                   // Winkelmarkierung bei nächster Ecke
  }
  
// Zeichnen:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(xM,yM,R,0,PI2,true);                             // Umkreis vorbereiten
  ctx.stroke();                                            // Umkreis zeichnen
  quadrilateral();                                         // Viereck (ausgefüllt)
  var i0 = specialIndex();                                 // Index der Seite mit überstumpfem Mittelpunktswinkel oder -1
  if (i0 >= 0) baseAngles(i0,40);                          // Gegebenenfalls Paar von Basiswinkeln mit größerem Radius markieren
  for (var i=0; i<4; i++) {                                // Für alle Indizes ...
    if (i != i0) baseAngles(i,20);                         // Falls sinnvoll, Paar von Basiswinkeln markieren
    }
  for (i=0; i<4; i++) line(0,0,x[i],y[i]);                 // Verbindungslinien zwischen Mittelpunkt und Ecken
  for (i=0; i<4; i++) point(i);                            // Ecken
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText("W. Fendt 1997",width-20,height-20);        // Autor
  }

document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen
