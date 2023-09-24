// Dynamische Zeichnung: Kathetensatz und Satz des Pythagoras
// Java-Applet (25.10.1997), umgewandelt in Javascript
// 12.03.2014 - 30.07.2023

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#00ff00";                                    // Farbe für das Dreieck
var color1 = "#8080ff";                                    // Farbe für das 1. Kathetenquadrat
var color2 = "#ff4040";                                    // Farbe für das 2. Kathetenquadrat
var colorEmph = "#ff00ff";                                 // Farbe für den verschiebbaren Punkt (C)

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var R = 80;                                                // Radius (Pixel)

// Attribute:

var canvas;                                                // Zeichenfläche
var ctx;                                                   // Grafikkontext
var drag;                                                  // Flag für Zugmodus
var xM;                                                    // Mittelpunkt, waagrechte Bildschirmkoordinate (Pixel)
var yM;                                                    // Mittelpunkt, senkrechte Bildschirmkoordinate (Pixel)
var my;                                                    // Positionswinkel (Bogenmaß)
var pC;                                                    // Ecke C (verschiebbar)

// Start-Methode:
	
function start () {
  canvas = document.getElementById("cv");                  // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  xM = canvas.width/2; yM = 220;                           // Bildschirmkoordinaten Mittelpunkt (Pixel)
  my = 50*Math.PI/180;                                     // Positionswinkel (Bogenmaß)  
  drag = false;                                            // Zunächst kein Zugmodus
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung 
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste   
  canvas.ontouchend = reactionMouseUp;                     // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen eines Fingers    
      
  } // Ende der Methode start
  
// Abstand vom Punkt C:
// (x,y) ... Position (Pixel)

function distance (x, y) {
  x = x-canvas.offsetLeft+window.pageXOffset;              // x-Koordinate in Bezug auf den linken Rand der Zeichenfläche
  y = y-canvas.offsetTop+window.pageYOffset;               // y-Koordinate in Bezug auf den oberen Rand der Zeichenfläche
  var dx = x-pC.u, dy = y-pC.v;                            // Koordinatendifferenzen (Pixel)
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {
  drag = (distance(e.clientX,e.clientY) <= 20);            // Flag für Zugmodus (Seiteneffekt)
  }
  
// Reaktion auf Berührung:

function reactionTouchStart (e) {
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  drag = (distance(obj.clientX,obj.clientY) <= 20);        // Flag für Zugmodus (Seiteneffekt)
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Berührung:

function reactionMouseUp (e) {
  drag = false;                                            // Flag für Zugmodus (Seiteneffekt)
  }
  
// Position korrigieren und neu zeichnen:
// (x,y) ... Position (Pixel)
// Seiteneffekt my
  
function reactionMove (x, y) {
  x = x-canvas.offsetLeft+window.pageXOffset;    // x-Koordinate in Bezug auf den linken Rand der Zeichenfläche
  y = y-canvas.offsetTop+window.pageYOffset;     // y-Koordinate in Bezug auf den oberen Rand der Zeichenfläche
  if (y > yM) y = yM;                            // Position unterhalb der Grundlinie verhindern
  my = Math.atan2(yM-y,x-xM);                    // Mittelpunktswinkel aktualisieren
  paint();                                       // Neu zeichnen
  }
  
// Reaktion auf Bewegen der Maus:

function reactionMouseMove (e) {  
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  reactionMove(e.clientX,e.clientY);                       // Position korrigieren und neu zeichnen
  }
  
// Reaktion auf Bewegen eines Fingers:

function reactionTouchMove (e) {
    if (!drag) return;                                     // Falls kein Zugmodus, abbrechen
    var obj = e.changedTouches[0];                         // Liste der Berührpunkte
    reactionMove(obj.clientX,obj.clientY);                 // Position korrigieren und neu zeichnen
    e.preventDefault();                                    // Standardverhalten verhindern                          
    }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }

// Zentrierter Text:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

function centerText (s, x, y) {
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var i = s.indexOf("_");                                  // Index Unterstrich oder -1
  var s1 = (i >= 0 ? s.substring(0,i) : s);                // Normaler Text
  var s2 = (i >= 0 ? s.substring(i+1) : "");               // Index
  var w1 = ctx.measureText(s1).width;                      // Breite des normalen Textes (Pixel)
  var w2 = ctx.measureText(s2).width;                      // Breite des Index (Pixel)
  x -= (w1+w2)/2;                                          // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(s1,x,y+4);                                  // Normaler Text
  ctx.fillText(s2,x+w1,y+8);                               // Index, falls vorhanden
  }
  
// Rechtwinkliges Dreieck:
// p1, p2, p3 ... Ecken (jeweils Verbund mit Attributen u und v)
// c ............ Füllfarbe
  
function drawTriangle (p1, p2, p3, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(p1.u,p1.v);                                   // Anfangspunkt (p1)
  ctx.lineTo(p2.u,p2.v);                                   // Linie zum Punkt p2 vorbereiten
  ctx.lineTo(p3.u,p3.v);                                   // Linie zum Punkt p3 vorbereiten
  ctx.closePath();                                         // Linie zum Punkt p1 vorbereiten
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefülltes Dreieck mit schwarzem Rand
  }
  
// Achsenparalleles Rechteck, Höhe gleich Hypotenusenlänge:
// p1 ... 1. Punkt (Verbund mit Attributen u und v, rechts)
// p2 ... 2. Punkt (Verbund mit Attributen u und v, links)
// c .... Füllfarbe

function drawRectangle (p1, p2, c) {
  if (p1.v != p2.v) return;                                // Falls Gerade p1-p2 nicht waagrecht, abbrechen
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fillRect(p2.u,p2.v,p1.u-p2.u,2*R);                   // Ausgefülltes Rechteck
  ctx.strokeRect(p2.u,p2.v,p1.u-p2.u,2*R);                 // Rand des Rechtecks
  }
  
// Quadrat über einer Strecke:
// p1 ... 1. Punkt (Verbund mit Attributen u und v)
// p2 ... 2. Punkt (Verbund mit Attributen u und v)
// c .... Füllfarbe
// s .... Beschriftung (im Mittelpunkt, optional)
  
function drawSquare (p1, p2, c, s) {
  var du = p2.u-p1.u, dv = p2.v-p1.v;                      // Koordinatendifferenzen (Pixel)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)    
  ctx.moveTo(p1.u,p1.v);                                   // Startposition (1. Punkt)
  ctx.lineTo(p2.u,p2.v);                                   // Linie zum 2. Punkt vorbereiten
  ctx.lineTo(p2.u+dv,p2.v-du);                             // Linie zum 3. Punkt vorbereiten
  ctx.lineTo(p1.u+dv,p1.v-du);                             // Linie zum 4. Punkt vorbereiten
  ctx.closePath();                                         // Linie zum 1. Punkt vorbereiten 
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefülltes Quadrat mit schwarzem Rand
  var u = (p1.u+p2.u+dv)/2, v = (p1.v+p2.v-du)/2;          // Mittelpunkt (Pixel)
  if (s) centerText(s,u,v);                                // Falls gewünscht, Beschriftung im Mittelpunkt
  }
  
// Beschriftung einer Strecke:
// s .... Zeichenkette
// p1 ... 1. Punkt (Verbund mit Attributen u und v)
// p2 ... 2. Punkt (Verbund mit Attributen u und v)
  
function writeSymbol (s, p1, p2) {
  var u = (p1.u+p2.u)/2, v = (p1.v+p2.v)/2;                // Bildschirmkoordinaten Mittelpunkt (Pixel)
  var du = p2.u-p1.u, dv = p2.v-p1.v;                      // Koordinatendifferenzen
  var d = Math.sqrt(du*du+dv*dv);                          // Abstand von p1 und p2
  if (d < 5) return;                                       // Falls Abstand zu klein, abbrechen
  centerText(s,u-8*dv/d,v+8*du/d);                         // Beschriftung
  }
  
// Grafikausgabe:
    
function paint () { 
  var width = canvas.width, height = canvas.height;        // Abmessungen (Pixel)
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe  
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "left";                                  // Textausrichtung
  var pA = {u: xM-R, v: yM};                               // Ecke A (links)
  var pB = {u: xM+R, v: yM};                               // Ecke B (rechts)
  pC = {u: xM+R*Math.cos(my), v: yM-R*Math.sin(my)};       // Ecke C (oben)
  var pF = {u: pC.u, v: yM};                               // Fußpunkt F
  drawTriangle(pA,pB,pC,color0);                           // Rechtwinkliges Dreieck
  drawRectangle(pB,pF,color1);                             // 1. Rechteck (rechts)
  drawRectangle(pF,pA,color2);                             // 2. Rechteck (links)
  drawSquare(pC,pB,color1,symbolA2);                       // 1. Kathetenquadrat (rechts)
  drawSquare(pA,pC,color2,symbolB2);                       // 2. Kathetenquadrat (links)
  ctx.arc(xM,yM,R,0,Math.PI,true);                         // Thaleskreis vorbereiten
  ctx.stroke();                                            // Thaleskreis zeichnen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(pC.u,pC.v); ctx.lineTo(pF.u,pF.v);            // Höhe vorbereiten
  ctx.stroke();                                            // Höhe zeichnen
  newPath();                                               // Neuer Grafikpfad
  ctx.fillStyle = colorEmph;                               // Füllfarbe für beweglichen Punkt (C)
  ctx.arc(pC.u,pC.v,2,0,2*Math.PI,true);                   // Kreis für Punkt C vorbereiten
  ctx.fill();                                              // Kreis ausfüllen
  writeSymbol(symbolA,pB,pC);                              // Beschriftung 1. Kathete (a)
  writeSymbol(symbolB,pC,pA);                              // Beschriftung 2. Kathete (b)
  centerText(symbolC,(pA.u+pB.u)/2,yM+10);                 // Beschriftung Hypotenuse (c)
  centerText(symbolP,(pF.u+pB.u)/2,yM-9);                  // Beschriftung 1. Hypotenusenabschnitt (p)
  centerText(symbolQ,(pA.u+pF.u)/2,yM-9);                  // Beschriftung 2. Hypotenusenabschnitt (q)
  centerText(symbolCP,(pC.u+pB.u)/2,yM+R);                 // Beschriftung 1. Rechteck (cp)
  centerText(symbolCQ,(pA.u+pC.u)/2,yM+R);                 // Beschriftung 2. Rechteck (cq)
  if (pC.u > pA.u+3) centerText(symbolC,pA.u-10,yM+R);     // Beschriftung Rechteckshöhe links (c)
  if (pC.u < pB.u-3) centerText(symbolC,pB.u+10,yM+R);     // Beschriftung Rechteckshöhe rechts (c)
  ctx.fillStyle = "#000000";                               // Schriftfarbe (Copyright)
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillText("W. Fendt  1997",width-20,height-20);       // Copyright-Hinweis
  } // Ende der Methode paint
      
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen
