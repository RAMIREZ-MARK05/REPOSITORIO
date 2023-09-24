// Winkel am Kreis
// Java-Applet (01.11.1997) umgewandelt
// 21.04.2014 - 19.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel circleangles_de.js) abgespeichert.

// Konstanten:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff00ff";                                // Farbe für beweglichen Punkt
var colorCentralAngle = "#0000ff";                         // Farbe für Mittelpunktswinkel
var colorPeriphAngle = "#ff0000";                          // Farbe für Umfangswinkel
var colorSTAngle = "#000000";                              // Farbe für Sehnen-Tangenten-Winkel

var r = 150;                                               // Kreisradius (Pixel)
var x0, y0;                                                // Koordinaten des Kreismittelpunkts (Pixel)
var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var sl;                                                    // Schieberegler
var lb1, lb2, lb3;                                         // Ausgabefelder

// Attribute:

var active;                                                // Flag für Zugmodus
var my;                                                    // Mittelpunktswinkel (Bogenmaß)
var alpha;                                                 // Positionswinkel (Bogenmaß)
var xA, yA;                                                // Koordinaten des Punktes A (links unten)
var xC, yC;                                                // Koordinaten des beweglichen Punktes C

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
  x0 = width/2; y0 = height/2;                             // Position des Kreismittelpunkts
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb0",text01);                                // Erklärender Text (Winkelgröße)
  sl = getElement("sl");                                   // Schieberegler
  sl.value = 50;                                           // Mittelpunktswinkel 100°
  getElement("lb1a",text02);                               // Erklärender Text (Mittelpunktswinkel)
  lb1 = getElement("lb1b");                                // Ausgabefeld für Mittelpunktswinkel
  getElement("lb2a",text03);                               // Erklärender Text (Umfangswinkel)
  lb2 = getElement("lb2b");                                // Ausgabefeld für Umfangswinkel
  getElement("lb3a",text04);                               // Erklärender Text (Sehnen-Tangenten-Winkel)
  lb3 = getElement("lb3b");                                // Ausgabefeld für Sehnen-Tangenten-Winkel
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  active = false;                                          // Zugmodus ausgeschaltet
  alpha = 20*Math.PI/180;                                  // Positionswinkel (Bogenmaß)
  reactionSlider();                                        // Berechnungen, Ausgabe
  
  sl.onchange = reactionSlider;                  // Reaktion auf Schieberegler (Internet Explorer)
  sl.oninput = reactionSlider;                   // Reaktion auf Schieberegler (Firefox, Chrome)
  
  canvas.onmousedown = function (e) {            // Reaktion auf Drücken der Maustaste
    reactionDown(e.clientX,e.clientY);           // Eventuell Zugmodus aktivieren                     
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Berührung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       // Eventuell Zugmodus aktivieren
    if (active) e.preventDefault();              // In diesem Fall Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    active = false;                              // Zugmodus deaktivieren                             
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Berührung
    active = false;                              // Zugmodus deaktivieren
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Bewegen der Maus
    if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
    reactionMove(e.clientX,e.clientY);           // Position ermitteln und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
    var obj = e.changedTouches[0];
    reactionMove(obj.clientX,obj.clientY);       // Position ermitteln und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }  
    
  } // Ende der Methode start
  
// Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt active

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  active = (distance(x,y) < 20);                 // Zugmodus, falls geringer Abstand zum Punkt C
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt phi, xC, yC

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  alpha = Math.atan2(x-x0,y0-y);                 // Positionswinkel
  calculation();                                 // Berechnungen
  paint();                                       // Neu zeichnen
  }
  
// Abstand zum Punkt C:
// x, y ... Aktuelle Position bezüglich Zeichenfläche
  
function distance (x, y) {
  var dx = x-xC, dy = y-yC;                      // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                 // Abstand (Pythagoras)
  }
  
// Reaktion auf Schieberegler:
  
function reactionSlider () {
  var myDeg = 2*sl.value;                        // Mittelpunktswinkel (Gradmaß)
  my = myDeg*Math.PI/180;                        // Mittelpunktswinkel (Bogenmaß)
  calculation();                                 // Berechnungen
  lb1.textContent = ""+myDeg+"\u00b0";           // Ausgabe des Mittelpunktswinkels
  lb2.textContent = ""+myDeg/2+"\u00b0";         // Ausgabe des Umfangswinkels
  lb3.textContent = ""+myDeg/2+"\u00b0";         // Ausgabe des Sehnen-Tangenten-Winkels
  paint();                                       // Neu zeichnen
  }
  
// Berechnungen:
// Seiteneffekt alpha, xA, yA, xC, yC

function calculation () {
  if (Math.abs(alpha) > Math.PI-my/2)            // Falls C unterhalb von [AB] ...
    alpha = 0;                                   // C zum höchsten Punkt des Kreises verschieben
  xA = x0-r*Math.sin(my/2);                      // x-Koordinate von A (linker Endpunkt der Sehne)
  yA = y0+r*Math.cos(my/2);                      // y-Koordinate von A (linker Endpunkt der Sehne)
  xC = x0+r*Math.sin(alpha);                     // x-Koordinate von C (beweglicher Punkt)
  yC = y0-r*Math.cos(alpha);                     // y-Koordinate des beweglichen Punktes (C)
  }

//-----------------------------------------------------------------------------

// Clipping (Beschränkung auf einen Teil der Zeichenfläche):

function clipping (border) {
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(border,border);                     // Anfangspunkt links oben
  ctx.lineTo(width-border,border);               // Linie nach rechts oben
  ctx.lineTo(width-border,height-border);        // Linie nach rechts unten
  ctx.lineTo(border,height-border);              // Linie nach links unten
  ctx.closePath();                               // Linie nach links oben (Anfangspunkt)
  ctx.clip();                                    // Clipping durchführen
  }
  
// Neuer Pfad mit Standardwerten:

function newPath() {
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.lineWidth = 1;                             // Liniendicke
  }
  
// Punkt markieren:
// x, y ... Koordinaten

function drawPoint (x, y) {
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = colorPoint;                    // Füllfarbe
  ctx.arc(x,y,2,0,2*Math.PI,true);               // Kleinen Kreis vorbereiten
  ctx.fill();                                    // Kreis ausfüllen
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// x, y ... Scheitel
// r ...... Radius
// a0 ..... Startwinkel (Bogenmaß)
// a ...... Winkelbetrag (Bogenmaß)
// c ...... Füllfarbe 

function angle (x, y, r, a0, a, c) {
  newPath();                                          // Neuer Pfad
  ctx.fillStyle = c;                                  // Füllfarbe
  ctx.moveTo(x,y);                                    // Scheitel als Anfangspunkt
  ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));      // Linie auf dem ersten Schenkel
  ctx.arc(x,y,r,2*Math.PI-a0,2*Math.PI-a0-a,true);    // Kreisbogen
  ctx.closePath();                                    // Zurück zum Scheitel
  ctx.fill(); ctx.stroke();                           // Kreissektor ausfüllen, Rand zeichnen
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                // Hintergrund ausfüllen
  clipping(10);                                  // Beschränkung auf einen Teil der Zeichenfläche
  newPath();                                     // Neuer Pfad
  ctx.arc(x0,y0,r,0,2*Math.PI,true);             // Kreis vorbereiten
  ctx.stroke();                                  // Kreis zeichnen
  var xB = width-xA;                             // x-Koordinate des rechten Sehnenendpunkts (B)
  angle(x0,y0,20,(3*Math.PI-my)/2,my,colorCentralAngle);           // Mittelpunktswinkel markieren
  angle(xC,yC,20,3*Math.PI/2-alpha/2-my/4,my/2,colorPeriphAngle);  // Umfangswinkel markieren
  angle(xA,yA,20,2*Math.PI-my/2,my/2,colorSTAngle);                // Linken Sehnen-Tangenten-Winkel markieren
  angle(xB,yA,20,Math.PI,my/2,colorSTAngle);                       // Rechten Sehnen-Tangenten-Winkel markieren
  newPath();                                     // Neuer Pfad
  ctx.moveTo(x0,y0);                             // Kreismittelpunkt als Anfangspunkt (M)
  ctx.lineTo(xA,yA);                             // Weiter zum linken Endpunkt der Sehne (A)
  ctx.lineTo(xB,yA);                             // Weiter zum rechten Endpunkt der Sehne (B)
  ctx.lineTo(x0,y0);                             // Zurück zum Kreismittelpunkt (M)
  ctx.moveTo(xA,yA);                             // Neuer Anfangspunkt (A)
  ctx.lineTo(xC,yC);                             // Weiter zum Scheitel des Umfangswinkels (C)
  ctx.lineTo(width-xA,yA);                       // Weiter zum Punkt B
  var dx = x0-xA, dy = yA-y0;                    // Koordinatendifferenzen
  ctx.moveTo(xA-dy,yA-dx);                       // Neuer Anfangspunkt für linke Tangente
  ctx.lineTo(xA+dy,yA+dx);                       // Weiter zum Endpunkt der linken Tangente
  ctx.moveTo(xB-dy,yA+dx);                       // Neuer Anfangspunkt für rechte Tangente
  ctx.lineTo(xB+dy,yA-dx);                       // Weiter zum Endpunkt der rechten Tangente
  ctx.stroke();                                  // Linien zeichnen
  drawPoint(xC,yC);                              // Beweglichen Punkt (C) markieren
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

