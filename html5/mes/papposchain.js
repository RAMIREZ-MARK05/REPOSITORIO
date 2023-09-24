// Pappos-Kette
// Java-Applet (04.03.2005) umgewandelt
// 18.10.2015 - 27.11.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorCircle1 = "#000000";                              // Farbe für den äußeren Kreis
var colorCircle2 = "#ff0000";                              // Farbe für den inneren Kreis
var colorCircle3 = "#0000ff";                              // Farbe für Berührkreise
var colorEllipse = "#ff00ff";                              // Farbe für die Ellipse der Berührkreis-Mittelpunkte

// Weitere Konstanten:

var R = 180;                                               // Radius des äußeren Kreises (Pixel) 
var nCircles = 100;                                        // Zahl der gezeichneten Kreise
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var drag;                                                  // Flag für Zugmodus
var xM, yM;                                                // Mittelpunkt des äußeren Kreises (Pixel)
var a;                                                     // Radius des inneren Kreises (Pixel)

// Start:

function start () {
  canvas = document.getElementById("cv");                  // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  xM = width/2; yM = height/2;                             // Mittelpunkt des äußeren Kreises (Pixel)
  a = 0.6*R;                                               // Radius des inneren Kreises (Pixel)
  drag = false;                                            // Zugmodus zunächst ausgeschaltet  
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
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Zugmodus)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Zugmodus)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {   
  drag = false;                                            // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Berührung:
  
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
  
// Reaktion auf Mausklick oder Berühren mit dem Finger:
// Seiteneffekt drag

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  var dx = x-xM; dy = yM-y;                                // Koordinaten relativ zum Mittelpunkt des äußeren Kreises
  if (dx*dx+dy*dy > R*R) return;                           // Falls Position außerhalb des gegebenen Kreises, abbrechen
  drag = true;                                             // Zugmodus einschalten
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// Seiteneffekt a 

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  var dx = x-xM; dy = yM-y;                                // Koordinaten relativ zum Mittelpunkt des äußeren Kreises
  var w = Math.atan2(dy,dx);                               // Winkel (Bogenmaß)
  if (dx*dx+dy*dy > R*R) {                                 // Falls Position außerhalb des gegebenen Kreises ...
    dx = R*Math.cos(w);                                    // x-Koordinate relativ zum Mittelpunkt (korrigiert)
    dy = R*Math.sin(w);                                    // y-Koordinate relativ zum Mittelpunkt (korrigiert)
    }
  var dx2 = dx+R;                                          // Hilfsgröße                               
  a = (dx2*dx2+dy*dy)/(2*dx2);                             // Radius des inneren Kreises (Pixel) aktualisieren
  paint();                                                 // Neu zeichnen
  }
     
//-----------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }

// Kreislinie mit Mittelpunkt:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... Farbe (optional)

function circle (x, y, r, c) {
  if (r < 0.1) return;                                     // Falls Radius extrem klein oder negativ, abbrechen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Farbe für Kreislinie
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreislinie zeichnen
  if (r < 1) return;                                       // Falls Radius zu klein, abbrechen
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.fillStyle = ctx.strokeStyle;                         // Farbe für Mittelpunktsmarkierung
  ctx.arc(x,y,1.5,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.fill();                                              // Ausgefüllten Kreis (Mittelpunktsmarkierung) zeichnen
  }
  
// Ellipse zeichnen (nicht ausgefüllt):
// x, y ... Koordinaten des Mittelpunkts
// a, b ... Halbachsen waagrecht/senkrecht
// c ...... Farbe (optional)
  
function ellipse (x, y, a, b, c) {
  if (a <= 0 || b <= 0) return;                            // Halbachsen müssen positiv sein
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Farbe ändern, falls definiert
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Pfad
  ctx.translate(x,y);                                      // Ellipsenmittelpunkt als Ursprung des Koordinatensystems                       
  ctx.scale(a,b);                                          // Skalierung in x- und y-Richtung
  ctx.arc(0,0,1,0,2*Math.PI,false);                        // Einheitskreis (wird durch Skalierung zur Ellipse)
  ctx.restore();                                           // Früheren Grafikkontext wiederherstellen
  ctx.stroke();                                            // Ellipse zeichnen
  }
  
// Ellipse der Berührkreis-Mittelpunkte:
  
function ellipseMidpoints () {
  var aE = (R+a)/2, bE = Math.sqrt(R*a);                   // Halbachsen (Pixel)
  var xE = xM-(R-a)/2;                                     // x-Koordinate Mittelpunkt (Pixel)
  ellipse(xE,yM,aE,bE,colorEllipse);                       // Ellipse zeichnen
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);            // Hintergrund ausfüllen
  circle(xM,yM,R,colorCircle1);                            // Äußerer Kreis (gegeben)
  circle(xM-R+a,yM,a,colorCircle2);                        // Innerer Kreis (variabel)
  var xK = a, yK = 0, rK = R-a;                            // Berührkreis Nr. 0
  for (var i=0; i<nCircles; i++) {                         // Für alle Berührkreis-Indizes ...
    circle(xM+xK,yM-yK,rK,colorCircle3);                   // Berührkreis oben
    circle(xM+xK,yM+yK,rK,colorCircle3);                   // Berührkreis unten
    // Im Folgenden werden die beiden nächsten Berührkreise oben und unten vorbereitet.
    // Der Hilfskreis mit Mittelpunkt (xK,yK+2*rK) und Radius rK berührt den bisherigen Kreis;
    // es existieren gemeinsame senkrechte Tangenten mit den Gleichungen x = xK-rK und x = xK+rK.
    // Eine Kreissspiegelung bezüglich des Kreises um (-r,0) mit Radius Wurzel(rho2) führt die beiden gemeinsamen
    // Tangenten in die gegebenen Kreise über und den Hilfskreis in den neuen Berührkreis.
    var rho2 = 2*R*(R+xK-rK);                              // Radiusquadrat für Kreisspiegelung
    var dx = R+xK, dy = yK+2*rK;                           // Hilfsgrößen
    var d2 = dx*dx+dy*dy, d = Math.sqrt(d2);               // Hilfsgrößen
    var f = rho2/(d2-rK*rK);                               // Hilfsgröße
    xK = f*dx-R; yK = f*dy;                                // Mittelpunkt des neuen Berührkreises
    rK = f*rK;                                             // Radius des neuen Berührkreises
    }
  ellipseMidpoints();                                      // Ellipse der Berührkreis-Mittelpunkte
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "left";                                  // Ausrichtung linksbündig
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText("W. Fendt 2005",width-120,height-20);
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

