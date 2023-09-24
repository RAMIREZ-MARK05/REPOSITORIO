// Gerade Strophoide
// 25.10.2017 - 26.10.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel strophoid_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#0000ff";                                    // Farbe für gleiche Strecken
var color2 = "#ff0000";                                    // Farbe für Strophoide

// Sonstige Konstanten:

var A = 100;                                               // Kurvenparameter a

// Attribute:

var bu1, bu2;                                              // Schaltknöpfe (Reset, Start/Pause/Weiter)
var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var x0, y0;                                                // Mittelpunkt Zeichenfläche
var timer;                                                 // Timer für Bewegung
var on;                                                    // Flag für Bewegung
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var phi;                                                   // Winkel gegenüber x-Achse (Bogenmaß)
var p, q;                                                  // Punkte auf Strophoide
var m;                                                     // Kreismittelpunkt

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
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Resetknopf
  bu2 = getElement("bu2",text02[0]);                       // Startknopf
  bu2.state = 0;                                           // Anfangszustand (vor Start der Animation)
  getElement("author",author);                             // Autor   
  x0 = width/2; y0 = height/2;                             // Mittelpunkt Zeichenfläche
  reactionReset();                                         // Anfangszustand
  paint();                                                 // Neu zeichnen

  bu1.onclick = reactionReset;                             // Reaktion auf Resetknopf
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf Start/Pause/Weiter  
  } // Ende der Methode start
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text02[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt bu2
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
  
// Reaktion auf Resetknopf:
// Seiteneffekt bu2, t, p, q, m, phi, on, timer, t0
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  t = 0;                                                   // Zeitvariable zurücksetzen
  p = {x: -A, y: 0};
  q = {x: -A, y: 0};
  m = {x: -A, y: 0};
  phi = 0;                                                 // Parameterwert zurücksetzen
  stopAnimation();                                         // Animation abschalten
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2, on, timer, t0 

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  if (bu2.state == 1) startAnimation();                    // Animation entweder starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder unterbrechen
  }
  
// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, t0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
  }
   
//-------------------------------------------------------------------------------------------------

// Festlegung eines Strophoidenpunkts:
// p ..... Punkt (Attribute x, y)
// phi ... Positionswinkel (Bogenmaß)
  
function setPoint (p, phi) {
  var t = Math.tan(phi);                                   // Parameterwert
  var t2 = t*t;                                            // Quadrat des Parameterwertes
  p.x = A*(t2-1)/(t2+1);                                   // x-Koordinate 
  p.y = p.x*t;                                             // y-Koordinate
  }

//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt markieren:
// (x,y) ... Mittelpunkt (Bildschirmkoordinaten)
// c ....... Füllfarbe
  
function point (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kleinen Kreis vorbereiten
  ctx.fillStyle = (c ? c : "#000000");                     // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefüllter Kreis mit schwarzem Rand
  }
  
// Punkt markieren:
// p ... Punkt (Attribute x, y)
// c ... Füllfarbe

function drawPoint (p, c) {
  point(x0+p.x,y0-p.y,c); 
  }
  
// Strecke zeichnen:
// (x1,y1) ... 1. Endpunkt
// (x2,y2) ... 2. Endpunkt
// c ......... Linienfarbe (optional, Defaultwert schwarz)
  
function line (x1, y1, x2, y2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Strecke vorbereiten
  ctx.stroke();                                            // Strecke zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // Länge
  if (length == 0) return;                                 // Abbruch, falls Länge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt für Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad für Pfeilspitze
  ctx.lineWidth = 1;                                       // Liniendicke zurücksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Kreis zeichnen:
// (x,y) ... Mittelpunkt
// r ....... Radius
// c ....... Farbe
  
function circle (x, y, r, c) {
  newPath(c);                                              // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen          
  }
  
// Anfangspunkt Grafikpfad:
// phi ... Positionswinkel (Bogenmaß)
  
function moveTo (phi) {
  var t = Math.tan(phi), t2 = t*t;                         // Parameterwert und Quadrat
  var x = A*(t2-1)/(t2+1), y = x*t;                        // Koordinaten (mathematisch)
  ctx.moveTo(x0+x,y0-y);                                   // Anfangspunkt setzen
  }
  
// Polygonzug für Strophoide ergänzen:
// phi ... Positionswinkel (Bogenmaß)
  
function lineTo (phi) {
  var t = Math.tan(phi), t2 = t*t;                         // Parameterwert und Quadrat
  var x = A*(t2-1)/(t2+1), y = x*t;                        // Koordinaten (mathematisch)
  ctx.lineTo(x0+x,y0-y);                                   // Linie zum Grafikpfad hinzufügen
  }
  
// Halbgerade:
  
function ray () {
  var f = (p.x > q.x);                                     // Flag (Punkt p weiter rechts als Punkt q)
  var dx = A+(f?p.x:q.x), dy = (f?p.y:q.y);                // Koordinatendifferenzen (Richtungsvektor)
  var d = Math.sqrt(dx*dx+dy*dy);                          // Länge des Richtungsvektors
  if (d == 0) return;                                      // Falls Länge 0, abbrechen
  var f = 1000/d;                                          // Faktor
  line(x0-A,y0,x0-A+f*dx,y0-f*dy,color1);                  // Halbgerade zeichnen
  }
  
// Abschnitt der Strophoide:
// phiMin ... Minimaler Positionswinkel (Bogenmaß)
// phiMax ... Maximaler Positionswinkel (Bogenmaß)
  
function strophoid (phiMin, phiMax) {
  newPath(color2);                                         // Neuer Grafikpfad
  var dPhi = (phiMax-phiMin)/1000;                         // Schrittweite für Positionswinkel (Bogenmaß)
  var i = 0;                                               // Startwert Index
  moveTo(phiMin);                                          // Anfangspunkt Grafikpfad
  while (i < 1000) {                                       // Solange Ende noch nicht erreicht ...
    i++;                                                   // Index erhöhen
    lineTo(phiMin+i*dPhi);                                 // Linie zum Grafikpfad hinzufügen 
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Grafikausgabe:
// Seiteneffekt t, t0, phi, p, q, m  
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  arrow(0,y0,width,y0);                                    // Waagrechte Achse
  arrow(x0,height,x0,0);                                   // Senkrechte Achse
  line(x0+A,0,x0+A,height);                                // Asymptote
  phi = t*Math.PI/20;                                      // Positionswinkel
  setPoint(p,phi);                                         // 1. Punkt auf Strophoide, Rechnung
  if (t > 0) setPoint(q,phi+Math.PI/2);                    // 2. Punkt auf Strophoide, Rechnung
  ray();                                                   // Halbgerade    
  m.x = 0; m.y = (p.y+q.y)/2;                              // Kreismittelpunkt                                                 
  circle(x0+m.x,y0-m.y,Math.abs(m.y),color1);              // Kreis
  strophoid(-Math.PI/2+0.01,Math.PI/2-0.01);               // Strophoide
  point(x0-A,y0);                                          // Fester Anfangspunkt der Halbgerade
  point(x0,y0);                                            // Ursprung
  drawPoint(p,color1);                                     // 1. Punkt auf Strophoide
  drawPoint(q,color1);                                     // 2. Punkt auf Strophoide
  drawPoint(m,color1);                                     // Kreismittelpunkt
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

