// Tangentenviereck
// Java-Applet (01.10.2000), umgewandelt in Javascript
// 13.01.2016 - 18.10.2017

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorFill = "#ffffff";                                 // Farbe für das Innere des Vierecks
var colors = ["#ff0000", "#008000", "#e0a000", "#0000ff"]; // Farben der Seiten
var colorPoint = "#ff00ff";                                // Farbe der Punkte

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var PI2 = 2*Math.PI;                                       // Abkürzung für 2 pi
var R = 100;                                               // Inkreisradius (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var xM, yM;                                                // Inkreismittelpunkt (Pixel)
var x, y;                                                  // Arrays der Koordinaten der Ecken
var dist;                                                  // Array der Entfernungen vom Inkreismittelpunkt
var iw;                                                    // Array der Innenwinkel (Bogenmaß)
var w;                                                     // Array der Positionswinkel (Bogenmaß)
var xB, yB;                                                // Arrays der Berührpunkte
var nr;                                                    // Index der ausgewählten Ecke (0 bis 3 oder -1)

// Start:
	
function start () {
  canvas = document.getElementById("cv");                  // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  xM = width/2; yM = height/2;                             // Inkreismittelpunkt (Pixel)
  x = new Array(4); y = new Array(4);                      // Arrays für Koordinaten der Ecken
  x[0] = 100; y[0] = 140;                                  // Ecke A (Index 0) vorgeben
  x[2] = -150; y[2] = -120;                                // Ecke C (Index 2) vorgeben
  dist = new Array(4);                                     // Array der Entfernungen vom Inkreismittelpunkt
  iw = new Array(4);                                       // Array der Innenwinkel
  w = new Array(4);                                        // Array der Positionswinkel
  xB = new Array(4); yB = new Array(4);                    // Arrays der Berührpunkte
  calculation(1);                                          // Koordinatenberechnung für Ecken B und D
  nr = -1;                                                 // Zunächst keine Ecke ausgewählt (Zugmodus abgeschaltet)
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers     
      
  } // Ende der Methode start
  
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
// Seiteneffekt x, y, w, dist, iw 

function reactionMove (u, v) {
  if (nr < 0) return;                                      // Falls keine Ecke ausgewählt, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var xOld = x[nr], yOld = y[nr];                          // Bisherige Koordinaten der aktuellen Ecke speichern
  var x0 = u-xM, y0 = yM-v;                                // Koordinaten bezüglich Mittelpunkt 
  if (x0*x0+y0*y0 < R*R) return;                           // Falls Position innerhalb des Kreises, abbrechen
  x[nr] = x0; y[nr] = y0;                                  // Aktuelle Ecke an Mausposition anpassen
  calculation((nr+1)%2);                                   // Berechnungen
  var correct = true;                                      // Flag für Korrektheit der neuen Position
  for (var i=0; i<4; i++) {                                // Für alle Ecken ...
    if (iw[i] < 0 || iw[i] > Math.PI) correct = false;     // Falls Innenwinkel unpassend, unkorrekt
    if (dist[i] > 1000000) correct = false;                // Falls Ecke zu weit entfernt, unkorrekt
    }
  if (!correct) {                                          // Falls neue Position unkorrekt ...
    x[nr] = xOld; y[nr] = yOld;                            // Frühere Position wiederherstellen
    calculation((nr+1)%2);                                 // Berechnungen wiederholen
    }
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Winkel korrigieren (Wert zwischen 0 und 2 pi erzwingen):

function corrAngle (w) {
  return w-Math.floor(w/PI2)*PI2;
  }

// Berechnung zweier Ecken (andere Ecken gegeben)
// i ... Index einer neu zu ermittelnden Ecke (0 oder 1)
// i == 0: Berechnung von A (Index 0) und C (Index 2)
// i == 1: Berechnung von B (Index 1) und D (Index 3)
// Seiteneffekt w, dist, iw, x, y

function calculation (i) {
  var i1 = (i+1)%4, i2 = (i+2)%4, i3 = (i+3)%4;            // Indizes der weiteren Ecken (zyklisch weitergezählt)
  for (var j=0; j<4; j++)                                  // Für alle Ecken ...
    w[j] = corrAngle(Math.atan2(y[j],x[j]));               // Positionswinkel (Bogenmaß)
  dist[i1] = Math.sqrt(x[i1]*x[i1]+y[i1]*y[i1]);           // Entfernung der nächsten Ecke vom Mittelpunkt
  iw[i1] = 2*Math.asin(R/dist[i1]);                        // Innenwinkel bei der nächsten Ecke (Bogenmaß)
  dist[i3] = Math.sqrt(x[i3]*x[i3]+y[i3]*y[i3]);           // Entfernung der vorigen Ecke vom Mittelpunkt
  iw[i3] = 2*Math.asin(R/dist[i3]);                        // Innenwinkel bei der vorigen Ecke (Bogenmaß)
  var my = corrAngle(w[i1]-w[i3]);                         // Mittelpunktswinkel (Bogenmaß)
  iw[i2] = my-iw[i1]/2-iw[i3]/2;                           // Innenwinkel bei der gegenüberliegenden Ecke (Bogenmaß)
  iw[i] = PI2-my-iw[i1]/2-iw[i3]/2;                        // Innenwinkel der aktuellen Ecke (Bogenmaß)
  w[i2] = corrAngle(w[i3]-Math.PI+iw[i3]/2+iw[i2]/2);      // Positionswinkel der gegenüberliegenden Ecke (Bogenmaß)
  w[i] = corrAngle(w[i3]+Math.PI-iw[i3]/2-iw[i]/2);        // Positionswinkel der aktuellen Ecke (Bogenmaß)
  dist[i2] = R/Math.sin(iw[i2]/2);                         // Entfernung der gegenüberliegenden Ecke vom Mittelpunkt
  dist[i] = R/Math.sin(iw[i]/2);                           // Entfernung der aktuellen Ecke vom Mittelpunkt
  x[i2] = dist[i2]*Math.cos(w[i2]);                        // x-Koordinate der gegenüberliegenden Ecke 
  y[i2] = dist[i2]*Math.sin(w[i2]);                        // y-Koordinate der gegenüberliegenden Ecke
  x[i] = dist[i]*Math.cos(w[i]);                           // x-Koordinate der aktuellen Ecke
  y[i] = dist[i]*Math.sin(w[i]);                           // y-Koordinate der aktuellen Ecke
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
  
// Punkt:
// i ... Index (0 bis 3)

function point (i) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.fillStyle = colorPoint;                              // Füllfarbe
  ctx.arc(xM+x[i],yM-y[i],2,0,PI2,true);                   // Kreis vorbereiten
  ctx.fill();                                              // Ausgefüllter Kreis
  }
  
// Zeichnen:
    
function paint () { 
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(xM+x[0],yM-y[0]);                             // Anfangspunkt (Ecke mit Index 0)
  for (var i=1; i<4; i++)                                  // Für alle weiteren Ecken-Indizes ...
    ctx.lineTo(xM+x[i],yM-y[i]);                           // Weiter zur aktuellen Ecke   
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fillStyle = colorFill;                               // Füllfarbe
  ctx.fill();                                              // Ausgefülltes Tangentenviereck  
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(xM,yM,R,0,PI2,true);                             // Inkreis vorbereiten
  ctx.stroke();                                            // Inkreis zeichnen 
  for (i=0; i<4; i++) {                                    // Für alle Ecken-Indizes ...                     
    wi = corrAngle(w[i]+Math.PI/2-iw[i]/2);                // Positionswinkel des Berührpunkts (Bogenmaß)     
    xB[i] = R*Math.cos(wi); yB[i] = R*Math.sin(wi);        // Koordinaten des Berührpunkts
    line(0,0,xB[i],yB[i]);                                 // Verbindungsstrecke Mittelpunkt-Berührpunkt            
    }
  for (i=0; i<4; i++) {                                    // Für alle Ecken-Indizes ...
    var c = colors[i];                                     // Linienfarbe
    line(x[i],y[i],xB[i],yB[i],c,2);                       // Tangentenabschnitt in Richtung nächste Ecke
    var iPrev = (i+3)%4;                                   // Index der vorigen Ecke 
    line(x[i],y[i],xB[iPrev],yB[iPrev],c,2);               // Tangentenabschnitt in Richtung vorige Ecke
    point(i);                                              // Ecke
    }     
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText("W. Fendt 2000",width-20,height-20);        // Autor
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


