// Ber�hrkreise
// 14.09.2017 - 04.10.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel tangentcircles_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#000000";                                    // Farbe f�r gegebene St�cke
var color2 = "#0000ff";                                    // Farbe f�r geometrischen Ort
var color3 = "#ff0000";                                    // Farbe f�r Ber�hrkreise

// Konstanten:

var DEG = Math.PI/180;                                     // Winkelgrad (Bogenma�)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var rb1, rb2, rb3, rb4, rb5, rb6;                          // Radiobuttons
var type;                                                  // Aufgabentyp
var subtype;                                               // Untertyp (Lage der gegebenen Objekte)
var nr;                                                    // Nummer f�r aktives Objekt
var p1, p2;                                                // Gegebene Punkte (Attribute x, y)
var l1, l2;                                                // Gegebene Geraden (Attribute x1, y1, x2, y2)
var c1, c2;                                                // Gegebene Kreise (Attribute x, y, r)
var line0, line1, line2;                                   // Geraden (Attribute x1, y1, x2, y2, ...)
var parabola1, parabola2;                                  // Parabeln (Attribute sx, sy, fx, fy, ...)
var ellipse1, ellipse2;                                    // Ellipsen (Attribute mx, my, fx, fy, a, b, ...)
var hyperbola1, hyperbola2;                                // Hyperbeln (Attribute mx, my, fx, fy, a, b, ...)
var k1, k2, k3, k4;                                        // Ber�hrkreise (Attribute x, y, r)

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
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb0",text01);                                // Erkl�render Text (Gegeben)
  rb1 = getElement("rb1");                                 // Radiobutton (Zwei Punkte)
  getElement("lb1",text02);                                // Erkl�render Text (Zwei Punkte)  
  rb2 = getElement("rb2");                                 // Radiobutton (Punkt und Gerade)
  getElement("lb2",text03);                                // Erkl�render Text (Punkt und Gerade)  
  rb3 = getElement("rb3");                                 // Radiobutton (Punkt und Kreis)
  getElement("lb3",text04);                                // Erkl�render Text (Punkt und Kreis)   
  rb4 = getElement("rb4");                                 // Radiobutton (Zwei Geraden)
  getElement("lb4",text05);                                // Erkl�render Text (Zwei Geraden)    
  rb5 = getElement("rb5");                                 // Radiobutton (Gerade und Kreis)
  getElement("lb5",text06);                                // Erkl�render Text (Gerade und Kreis)     
  rb6 = getElement("rb6");                                 // Radiobutton (Zwei Kreise)
  getElement("lb6",text07);                                // Erkl�render Text (Zwei Kreise)          
  rb1.checked = true;                                      // Erster Radiobutton ausgew�hlt
  getElement("author",author);                             // Autor
  reaction1();                                             // Vorbereitungen f�r Aufgabentyp 1
  nr = 0;                                                  // Zugmodus zun�chst deaktiviert
  paint();                                                 // Zeichnen
  
  rb1.onclick = reaction1;                                 // Reaktion auf 1. Radiobutton
  rb2.onclick = reaction2;                                 // Reaktion auf 2. Radiobutton
  rb3.onclick = reaction3;                                 // Reaktion auf 3. Radiobutton
  rb4.onclick = reaction4;                                 // Reaktion auf 4. Radiobutton
  rb5.onclick = reaction5;                                 // Reaktion auf 5. Radiobutton
  rb6.onclick = reaction6;                                 // Reaktion auf 6. Radiobutton
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
    
  } // Ende der Methode start
  
// Hilfsroutine f�r Methoden reaction1 bis reaction6: Verbund f�r Gerade oder Kegelschnitt
// t ... Typ (1 f�r Gerade, 2 f�r Parabel oder Ellipse, 3 f�r Hyperbel)

function newRecord (t) {
  if (t == 1) return {par: 0.5, min: 0.5, max: 0.5};       // R�ckgabewert f�r Gerade
  if (t == 2) return {par: 0, min: 0, max: 0};             // R�ckgabewert f�r Parabel oder Ellipse
  if (t == 3)                                              // R�ckgabewert f�r Hyperbel
    return {par1: 0, min1: 0, max1: 0, par2: 0, min2: 0, max2: 0};
  }
  
// Reaktion auf 1. Radiobutton:
// Seiteneffekt type, p1, p2, line1, k1, subtype

function reaction1 () {
  type = 1;                                                // Aufgabentyp 1 (zwei Punkte gegeben)
  p1 = {x: 150, y: 220};                                   // Erster gegebener Punkt
  p2 = {x: 250, y: 180};                                   // Zweiter gegebener Punkt
  line1 = newRecord(1);                                    // Verbund f�r Mittelsenkrechte
  k1 = {};                                                 // Verbund f�r Ber�hrkreis
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf 2. Radiobutton:
// Seiteneffekt type, p1, l1, parabola1, line0, k1, subtype

function reaction2 () {
  type = 2;                                                // Aufgabentyp 2 (Punkt und Gerade gegeben)
  p1 = {x: 180, y: 180};                                   // Gegebener Punkt
  l1 = {x1: 20, y1: 240, x2: 380, y2: 200};                // Gegebene Gerade
  parabola1 = newRecord(2);                                // Verbund f�r Parabel
  line0 = newRecord(1);                                    // Verbund f�r Lot (Grenzfall)
  k1 = {};                                                 // Verbund f�r Ber�hrkreis
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf 3. Radiobutton:
// Seiteneffekt type, p1, c1, hyperbola1, ellipse1, line0, k1, k2, subtype

function reaction3 () {
  type = 3;                                                // Aufgabentyp 3 (Punkt und Kreis gegeben)
  p1 = {x: 220, y: 220};                                   // Gegebener Punkt
  c1 = {x: 200, y: 150, r: 50};                            // Gegebener Kreis
  hyperbola1 = newRecord(3);                               // Verbund f�r Hyperbel
  ellipse1 = newRecord(2);                                 // Verbund f�r Ellipse
  line0 = newRecord(1);                                    // Verbund f�r Gerade (Grenzfall)
  k1 = {}; k2 = {};                                        // Verbunde f�r Ber�hrkreise
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf 4. Radiobutton:
// Seiteneffekt type, l1, l2, line1, line2, k1, k2, subtype

function reaction4 () {
  type = 4;                                                // Aufgabentyp 4 (zwei Geraden gegeben)
  l1 = {x1: 20, y1: 240, x2: 380, y2: 200};                // Erste gegebene Gerade
  l2 = {x1: 120, y1: 380, x2: 280, y2: 20};                // Zweite gegebene Gerade
  line1 = newRecord(1);                                    // Verbund f�r erste Winkelhalbierende bzw. Mittelparallele 
  line2 = newRecord(1);                                    // Verbund f�r zweite Winkelhalbierende
  k1 = {}; k2 = {};                                        // Verbunde f�r Ber�hrkreise
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf 5. Radiobutton:
// Seiteneffekt type, l1, c1, parabola1, parabola2, line0, k1, k2, subtype

function reaction5 () {
  type = 5;                                                // Aufgabentyp 5 (Gerade und Kreis gegeben)
  l1 = {x1: 20, y1: 280, x2: 380, y2: 300};                // Gegebene Gerade
  c1 = {x: 200, y: 150, r: 80};                            // Gegebener Kreis
  parabola1 = newRecord(2);                                // Verbund f�r erste Parabel
  parabola2 = newRecord(2);                                // Verbund f�r zweite Parabel
  line0 = newRecord(1);                                    // Verbund f�r Lot (Grenzfall)
  k1 = {}; k2 = {};                                        // Verbunde f�r Ber�hrkreise
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf 6. Radiobutton:
// Seiteneffekt type, c1, c2, hyperbola1, hyperbola2, ellipse1, ellipse2, line0, k1, k2, k3, k4, subtype
  
function reaction6 () {
  type = 6;                                                // Aufgabentyp 6 (zwei Kreise gegeben)
  c1 = {x: 180, y: 150, r: 40};                            // Erster gegebener Kreis
  c2 = {x: 220, y: 250, r: 55};                            // Zweiter gegebener Kreis
  hyperbola1 = newRecord(3);                               // Verbund f�r 1. Hyperbel
  hyperbola2 = newRecord(3);                               // Verbund f�r 2. Hyperbel
  ellipse1 = newRecord(2);                                 // Verbund f�r 1. Ellipse
  ellipse2 = newRecord(2);                                 // Verbund f�r 2. Ellipse
  line0 = newRecord(1);                                    // Verbund f�r Gerade (Grenzfall)
  k1 = {}; k2 = {}; k3 = {}; k4 = {};                      // Verbunde f�r Ber�hrkreise                                
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (nr > 0) e.preventDefault();                          // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr = 0;                                                  // Zugmodus deaktiviert
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls Zugmodus deaktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls Zugmodus deaktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }
  
// Hilfsroutine: Auswahl eines Punkts
// (x,y) ... Position des Mauszeigers
// p ....... Punkt (Attribute x, y)
// data .... Verbund f�r Daten (Attribute iMin, dMin)
// i ....... Index f�r Punkt

function selectPoint (x, y, p, data, i) {
  if (p == undefined) return;                              // Falls Punkt nicht definiert, abbrechen
  if (p.x == undefined || p.y == undefined) return;        // Falls Koordinaten nicht definiert, abbrechen
  var d = distancePoint(x,y,p);                            // Abstand vom Punkt
  if (d >= data.dMin) return;                              // Falls Abstand zu gro�, abbrechen
  data.iMin = i;                                           // Index aktualisieren
  data.dMin = d;                                           // Minimum aktualisieren
  } 
  
// Hilfsroutine: Auswahl einer Geraden
// (x,y) ... Position des Mauszeigers
// l ....... Gerade (Attribute x1, y1, x2, y2)
// data .... Verbund f�r Daten (Attribute iMin, dMin)
// i ....... Index

function selectLine (x, y, l, data, i) {
  if (l == undefined) return;                              // Falls Gerade nicht definiert, abbrechen
  if (l.x1 == undefined || l.y1 == undefined) return;      // Falls Koordinaten nicht definiert, abbrechen
  if (l.x2 == undefined || l.y2 == undefined) return;      // Falls Koordinaten nicht definiert, abbrechen
  if (l.x1 == l.x2 && l.y1 == l.y2) return;                // Falls Bestimmungspunkte gleich, abbrechen
  var d = distanceLine(x,y,l);                             // Abstand von der Geraden
  if (d >= data.dMin) return;                              // Falls Abstand zu gro�, abbrechen
  var p = parameterLine(x,y,l);                            // Parameterwert f�r Fu�punkt des Lotes
  data.iMin = (p<=0.5 ? i : i+1);                          // Index aktualisieren
  data.dMin = d;                                           // Minimum aktualisieren
  }
  
// Hilfsroutine: Auswahl eines Kreises
// (x,y) ... Position des Mauszeigers
// c ....... Kreis
// data .... Verbund f�r Daten (Attribute iMin, dMin)
// i ....... Index 

function selectCircle (x, y, c, data, i) {
  if (c == undefined) return;                              // Falls Kreis nicht definiert, abbrechen
  if (c.x == undefined || c.y == undefined) return;        // Falls Koordinaten nicht definiert, abbrechen
  if (c.r == undefined || c.r < 0) return;                 // Falls Radius nicht definiert oder negativ, abbrechen
  var d = distancePoint(x,y,c);                            // Abstand vom Kreismittelpunkt
  if (d < data.dMin) {                                     // Falls Abstand kleiner als bisheriges Minimum ...
    data.iMin = i;                                         // Index aktualisieren
    data.dMin = d;                                         // Minimum aktualisieren
    }
  d = Math.abs(d-c.r);                                     // Abstand vom Kreisrand
  if (d < data.dMin) {                                     // Falls Abstand kleiner als bisheriges Minimum ...
    data.iMin = i+1;                                       // Index aktualisieren
    data.dMin = d;                                         // Minimum aktualisieren
    }
  }
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr, subtype, line0, line1, line2, parabola1, parabola2, ellipse1, ellipse2, hyperbola1, hyperbola2, k1, k2, k3, k4

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  var data = {iMin: 0, dMin: 10000};                       // Verbund f�r Index und minimalen Abstand
  selectPoint(x,y,p1,data,1);                              // Eventuell Punkt p1 ausw�hlen (Aufgabentypen 1, 2, 3)
  selectPoint(x,y,p2,data,2);                              // Eventuell Punkt p2 ausw�hlen (Aufgabentyp 1) 
  selectLine(x,y,l1,data,3);                               // Eventuell Gerade l1 ausw�hlen (Aufgabentypen 2, 4, 5)
  selectLine(x,y,l2,data,5);                               // Eventuell Gerade l2 ausw�hlen (Aufgabentyp 4)
  selectCircle(x,y,c1,data,7);                             // Eventuell Kreis c1 ausw�hlen (Aufgabentypen 3, 5, 6)
  selectCircle(x,y,c2,data,9);                             // Eventuell Kreis c2 ausw�hlen (Aufgabentyp 6)
  selectPoint(x,y,k1,data,11);                             // Eventuell Mittelpunkt von k1 ausw�hlen
  selectPoint(x,y,k2,data,12);                             // Eventuell Mittelpunkt von k2 ausw�hlen
  selectPoint(x,y,k3,data,13);                             // Eventuell Mittelpunkt von k3 ausw�hlen
  selectPoint(x,y,k4,data,14);                             // Eventuell Mittelpunkt von k4 ausw�hlen
  if (data.dMin < 20) nr = data.iMin;                      // Falls Abstand klein, Index �bernehmen (Zugmodus) 
  else nr = 0;                                             // Andernfalls Zugmodus deaktivieren
  paint();                                                 // Neu zeichnen
  }
  
// Aktualisierung der Parameterwerte einer Geraden:
// (x,y) ... Position
// l ....... Gerade (Attribute par, min, max werden angepasst)
  
function updateParameterLine (x, y, l) {
  var par = parameterLine(x,y,l);                          // Parameterwert berechnen
  l.par = par;                                             // Parameterwert �bernehmen
  if (par < l.min) l.min = par;                            // Minimum f�r Parameterwert
  if (par > l.max) l.max = par;                            // Maximum f�r Parameterwert
  }
  
// Aktualisierung der Parameterwerte einer Parabel:
// (x,y) ... Position
// p ....... Parabel (Attribute par, min, max werden angepasst)
  
function updateParameterParabola (x, y, p) {
  var par = parameterParabola(x,y,p);                      // Parameterwert berechnen
  p.par = par;                                             // Parameterwert �bernehmen
  if (par < p.min) p.min = par;                            // Minimum f�r Parameterwert
  if (par > p.max) p.max = par;                            // Maximum f�r Parameterwert
  }
  
// Aktualisierung der Parameterwerte einer Ellipse:
// (x,y) ... Position
// e ....... Ellipse (Attribute par, min, max werden angepasst)
  
function updateParameterEllipse (x, y, e) {
  var par = parameterEllipse(x,y,e);                       // Parameterwert berechnen
  if (par > e.par+Math.PI) par -= 2*Math.PI;               // Zu gro�en Wert verhindern
  if (par < e.par-Math.PI) par += 2*Math.PI;               // Zu kleinen Wert verhindern
  e.par = par;                                             // Parameterwert �bernehmen
  if (par < e.min) e.min = par;                            // Minimum f�r Parameterwert
  if (par > e.max) e.max = par;                            // Maximum f�r Parameterwert
  }
  
// Aktualisierung der Parameterwerte f�r den 1. Ast einer Hyperbel:
// (x,y) ... Position
// h ....... Hyperbel (Attribute par1, min1, max1 werden angepasst)
  
function updateParameterHyperbola1 (x, y, h) {
  var par = parameterHyperbola(x,y,h);                     // Parameterwert berechnen
  h.par1 = par;                                            // Parameterwert �bernehmen
  if (par < h.min1) h.min1 = par;                          // Minimum f�r Parameterwert
  if (par > h.max1) h.max1 = par;                          // Maximum f�r Parameterwert
  }
  
// Aktualisierung der Parameterwerte f�r den 2. Ast einer Hyperbel:
// (x,y) ... Position
// h ....... Hyperbel (Attribute par2, min2, max2 werden angepasst)
 
function updateParameterHyperbola2 (x, y, h) {
  var par = parameterHyperbola(x,y,h);                     // Parameterwert berechnen
  h.par2 = par;                                            // Parameterwert �bernehmen
  if (par < h.min2) h.min2 = par;                          // Minimum f�r Parameterwert
  if (par > h.max2) h.max2 = par;                          // Maximum f�r Parameterwert
  } 
  
// Hilfsroutine: Radius eines Kreises �ndern
// (x,y) ... Position
// c ....... Kreis (Attribute x, y, r)

function changeRadius (x, y, c) {
  var dx = x-c.x, dy = y-c.y;                              // Koordinatendifferenzen
  c.r = Math.sqrt(dx*dx+dy*dy);                            // Kreisradius �ndern
  }
  
// Hilfsroutine f�r reactionMove: Ber�hrkreis k1 �ndern
// (x,y) ... Position
// Seiteneffekt line0, line1, parabola1, ellipse1, hyperbola1

function modifyTangentCircle1 (x, y) {
  if (type == 1 && subtype > 0)                            // Falls sinnvoll ...
    updateParameterLine(x,y,line1);                        // Parameterwerte von line1 anpassen (Mittelsenkrechte)
  if (type == 2 && subtype == 0)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line0);                        // Parameterwerte von line0 anpassen (Grenzfall Lot)
  if (type == 2 && subtype > 0)                            // Falls sinnvoll ...
    updateParameterParabola(x,y,parabola1);                // Parameterwerte von parabola1 anpassen (Parabel)
  if (type == 3 && subtype > 0)                            // Falls sinnvoll ...
    updateParameterHyperbola1(x,y,hyperbola1);             // Parameterwerte von hyperbola1 anpassen (1. Hyperbelast)
  if (type == 3 && subtype < 0)                            // Falls sinnvoll ... 
    updateParameterEllipse(x,y,ellipse1);                  // Parameterwerte von ellipse1 anpassen (Ellipse)
  if (type == 3 && subtype == 0)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line0);                        // Parameterwerte von line0 anpassen (Grenzfall Verbindungsgerade)
  if (type == 4 && subtype > 0)                            // Falls sinnvoll ...
    updateParameterLine(x,y,line1);                        // Parameterwerte von line1 anpassen (1. Winkelhalbierende)
  if (type == 5 && subtype == 0)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line0);                        // Parameterwerte von line0 anpassen (Grenzfall Lot)
  if (type == 5 && subtype != 0)                           // Falls sinnvoll ...
    updateParameterParabola(x,y,parabola1);                // Parameterwerte von parabola1 anpassen (Parabel)
  if (type == 6 && subtype == 2)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line0);                        // Parameterwerte von line0 anpassen (Grenzfall Lot)
  if (type == 6 && subtype >= 3)                           // Falls sinnvoll ...
    updateParameterHyperbola1(x,y,hyperbola1);             // Parameterwerte von hyperbola1 (1. Ast) anpassen
  }
  
// Hilfsroutine f�r reactionMove: Ber�hrkreis k2 �ndern
// (x,y) ... Position
// Seiteneffekt line2, parabola2, hyperbola1

function modifyTangentCircle2 (x, y) {
  if (type == 3 && subtype > 0)                            // Falls sinnvoll ... 
    updateParameterHyperbola2(x,y,hyperbola1);             // Parameterwerte von hyperbola1 (2. Ast) anpassen
  if (type == 4 && subtype == 2)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line2);                        // Parameterwerte von line2 anpassen (2. Winkelhalbierende)
  if (type == 5)                                           // Falls sinnvoll ...
    updateParameterParabola(x,y,parabola2);                // Parameterwerte von parabola2 anpassen (Parabel)
  if (type == 6 && subtype >= 3)                           // Falls sinnvoll ...
    updateParameterHyperbola2(x,y,hyperbola1);             // Parameterwerte von hyperbola1 (2. Ast) anpassen
  }
  
// Hilfsroutine f�r reactionMove: k3 �ndern
// (x,y) ... Position
// Seiteneffekt line0, ellipse1, hyperbola2

function modifyTangentCircle3 (x, y) {
  if (type == 6 && subtype == 1)                           // Falls sinnvoll ...
    updateParameterEllipse(x,y,ellipse1);                  // Parameterwerte von ellipse1 anpassen (Ellipse)
  if (type == 6 && subtype == 4)                           // Falls sinnvoll ...
    updateParameterLine(x,y,line0);                        // Parameterwerte von line0 anpassen (Grenzfall Lot)
  if (type == 6 && subtype == 5)                           // Falls sinnvoll ...
    updateParameterHyperbola1(x,y,hyperbola2);             // Parameterwerte von hyperbola2 (1. Ast) anpassen
  }
  
// Hilfsroutine f�r reactionMove: k4 �ndern
// (x,y) ... Position
// Seiteneffekt ellipse2, hyperbola2

function modifyTangentCircle4 (x, y) {
  if (type == 6 && subtype <= 3)                           // Falls sinnvoll ...
    updateParameterEllipse(x,y,ellipse2);                  // Parameterwerte von ellipse2 anpassen (Ellipse)
  if (type == 6 && subtype == 5)                           // Falls sinnvoll ...
    updateParameterHyperbola2(x,y,hyperbola2);             // Parameterwerte von hyperbola2 (2. Ast) anpassen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt subtype, line0, line1, line2, parabola1, parabola2, ellipse1, ellipse2, hyperbola1, hyperbola2, k1, k2, k3, k4 

function reactionMove (x, y) {
  if (nr == 0) return;                                     // Falls Zugmodus deaktiviert, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (nr == 1) {p1.x = x; p1.y = y;}                       // p1 verschieben
  else if (nr == 2) {p2.x = x; p2.y = y;}                  // p2 verschieben
  else if (nr == 3) {l1.x1 = x; l1.y1 = y;}                // 1. Bestimmungspunkt von l1 verschieben
  else if (nr == 4) {l1.x2 = x; l1.y2 = y;}                // 2. Bestimmungspunkt von l1 verschieben
  else if (nr == 5) {l2.x1 = x; l2.y1 = y;}                // 1. Bestimmungspunkt von l2 verschieben
  else if (nr == 6) {l2.x2 = x; l2.y2 = y;}                // 2. Bestimmungspunkt von l2 verschieben
  else if (nr == 7) {c1.x = x; c1.y = y;}                  // Mittelpunkt von c1 verschieben
  else if (nr == 8) changeRadius(x,y,c1);                  // Radius von c1 �ndern
  else if (nr == 9) {c2.x = x; c2.y = y;}                  // Mittelpunkt von c2 verschieben
  else if (nr == 10) changeRadius(x,y,c2);                 // Radius von c2 �ndern
  else if (nr == 11) modifyTangentCircle1(x,y);            // Ber�hrkreis k1 �ndern
  else if (nr == 12) modifyTangentCircle2(x,y);            // Ber�hrkreis k2 �ndern
  else if (nr == 13) modifyTangentCircle3(x,y);            // Ber�hrkreis k3 �ndern
  else if (nr == 14) modifyTangentCircle4(x,y);            // Ber�hrkreis k4 �ndern
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// �berpr�fung auf ungef�hre Gleichheit:
// a, b ... Gegebene Zahlen

function approx (a, b) {
  return (Math.abs(a-b) < 1e-6);                           // R�ckgabewert
  }

// Mittelpunkt zweier Punkte:
// p1, p2 ... Gegebene Punkte (Attribute x, y)

function midpoint (p1, p2) {
  return {x: (p1.x+p2.x)/2, y: (p1.y+p2.y)/2};             // R�ckgabewert
  }
  
// Punkt auf Verbindungsgerade:
// p1, p2 ... Gegebene Punkte (Attribute x, y)
// par ... Parameterwert (0 f�r p1, 1 f�r p2 ...)

function pointPP (p1, p2, par) {
  var px = p1.x+par*(p2.x-p1.x);                           // x-Koordinate
  var py = p1.y+par*(p2.y-p1.y);                           // y-Koordinate
  return {x: px, y: py};                                   // R�ckgabewert
  }
  
// Fu�punkt eines Lotes:
// l ... Gegebene Gerade (Attribute x1, y1, x2, y2)
// p ... Gegebener Punkt (Attribute x, y)

function foot (l, p) {
  var par = parameterLine(p.x,p.y,l);                      // Parameterwert
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor
  return {x: l.x1+par*ux, y: l.y1+par*uy};                 // R�ckgabewert
  }

// �berpr�fung, ob Punkt auf Gerade liegt:
// p ... Punkt (Attribute x, y)
// l ... Gerade (Attribute x1, y1, x2, y2)

function pointOnLine (p, l) {
  var det = (p.x-l.x1)*(p.y-l.y2)-(p.y-l.y1)*(p.x-l.x2);   // Determinante
  return approx(det,0);                                    // R�ckgabewert
  }
  
// Fallunterscheidung f�r die Lage zweier Punkte:
// p1, p2 ... Punkte (Attribute x, y)
// R�ckgabewert 0 (identisch) oder 1 (verschieden)

function subtypePP (p1, p2) {
  if (approx(p1.x,p2.x) && approx(p1.y,p2.y)) return 0;    // R�ckgabewert f�r identische Punkte
  return 1;                                                // R�ckgabewert f�r verschiedene Punkte
  }
  
// Fallunterscheidung f�r die Lage eines Punktes und einer Geraden:
// p ... Punkt (Attribute x, y)
// l ... Gerade (Attribute x1, y1, x2, y2)
// R�ckgabewert 0 (auf Gerade) oder 1 (au�erhalb)

function subtypePL (p, l) {
  if (pointOnLine(p,l)) return 0;                          // R�ckgabewert f�r Punkt auf der Geraden
  return 1;                                                // R�ckgabewert f�r Punkt au�erhalb der Geraden
  }
  
// Fallunterscheidung f�r die Lage eines Punktes und eines Kreises:
// p ... Punkt (Attribute x, y)
// c ... Kreis (Attribute x, y, r)
// R�ckgabewert -1 (innerhalb), 0 (auf Kreis) oder +1 (au�erhalb)

function subtypePC (p, c) {
  var dx = p.x-c.x, dy = p.y-c.y;                          // Koordinatendifferenzen
  var d2 = dx*dx+dy*dy-c.r*c.r;                            // Differenz
  if (approx(d2,0)) return 0;                              // R�ckgabewert f�r Punkt auf dem Kreis
  if (d2 < 0) return -1;                                   // R�ckgabewert f�r Punkt innerhalb des Kreises         
  return 1;                                                // R�ckgabewert f�r Punkt au�erhalb des Kreises
  }
  
// Fallunterscheidung f�r die Lage zweier Geraden:
// l1, l2 ... Geraden (Attribute x1, y1, x2, y2)
// R�ckgabewert 0 (identisch), 1 (echt parallel) oder 2 (nicht parallel)

function subtypeLL (l1, l2) {
  var ux = l1.x2-l1.x1, uy = l1.y2-l1.y1;                  // Richtungsvektor von l1
  var vx = l2.x2-l2.x1, vy = l2.y2-l2.y1;                  // Richtungsvektor von l2
  if (!approx(ux*vy-uy*vx,0)) return 2;                    // R�ckgabewert f�r sich schneidende Geraden
  var wx = l2.x1-l1.x1, wy = l2.y1-l1.y1;                  // Verbindungsvektor der Aufpunkte
  if (!approx(ux*wy-uy*wx,0)) return 1;                    // R�ckgabewert f�r echt parallele Geraden
  return 0;                                                // R�ckgabewert f�r identische Geraden
  }
  
// Fallunterscheidung f�r die Lage einer Geraden und eines Kreises:
// l ... Gerade (Attribute x1, y1, x2, y2)
// c ... Kreis (Attribute x, y, r)
// R�ckgabewert -1 (Schnitt), 0 (Ber�hrung) oder +1 (kein gemeinsamer Punkt)

function subtypeLC (l, c) {
  var d = distanceLine(c.x,c.y,l);                         // Abstand des Kreismittelpunkts von der Geraden
  if (approx(d,c.r)) return 0;                             // R�ckgabewert f�r Ber�hrung
  if (d < 0) return -1;                                    // R�ckgabewert f�r Schnitt
  return 1;                                                // R�ckgabewert, falls kein gemeinsamer Punkt
  }

// Fallunterscheidung f�r die Lage zweier Kreise:
// c1, c2 ... Kreise (Attribute x, y, r)
// R�ckgabewert 1 (Kreis in Kreis), 2 (einschlie�ende Ber�hrung), 3 (zwei Schnittpunkte), 
// 4 (ausschlie�ende Ber�hrung) oder 5 (getrennte Kreise)

function subtypeCC (c1, c2) {
  var dx = c2.x-c1.x, dy = c2.y-c1.y;                      // Koordinatendifferenzen
  var d2 = dx*dx+dy*dy;                                    // Abstandsquadrat (Mittelpunkte)
  var sum = c1.r+c2.r, diff = Math.abs(c1.r-c2.r);         // Summe und Differenz der Radien
  var sum2 = sum*sum, diff2 = diff*diff;                   // Quadrate von Summe und Differenz
  if (approx(d2,diff2)) return 2;                          // R�ckgabewert f�r einschlie�ende Ber�hrung
  if (approx(d2,sum2)) return 4;                           // R�ckgabewert f�r ausschlie�ende Ber�hrung
  if (d2 < diff2) return 1;                                // R�ckgabewert f�r Kreis im anderen Kreis
  if (d2 < sum2) return 3;                                 // R�ckgabewert f�r sich schneidende Kreise
  return 5;                                                // R�ckgabewert f�r getrennte Kreise
  }

// Abstand von einem Punkt:
// (x,y) ... Position
// p ....... Punkt (Attribute x, y)

function distancePoint (x, y, p) {
  var dx = x-p.x, dy = y-p.y;                              // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
// Abstand von einer Geraden:
// (x,y) ... Position
// l ....... Gerade (Attribute x1, y1, x2, y2)

function distanceLine (x, y, l) {
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor
  var nx = -uy, ny = ux;                                   // Normalenvektor
  var n = Math.sqrt(nx*nx+ny*ny);                          // Betrag des Normalenvektors
  var dx = x-l.x1, dy = y-l.y1;                            // Verbindungsvektor
  return Math.abs(nx*dx+ny*dy)/n;                          // R�ckgabewert
  }
  
// Lot zu einer Geraden durch einen Punkt:
// line ... Gerade (Attribute x1, y1, x2, y2 werden angepasst)
// l ...... Gegebene Gerade (Attribute x1, y1, x2, y2)
// p ...... Gegebener Punkt (Attribute x, y)

function setPerpendicular (line, l, p) {
  var fp = foot(l,p);                                      // Fu�punkt des Lotes zu l durch p
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor von l
  var nx = uy, ny = -ux;                                   // Normalenvektor
  var n = Math.sqrt(nx*nx+ny*ny);                          // Betrag Normalenvektor
  var f = 100/n;                                           // Faktor
  nx *= f; ny *= f;                                        // Normalenvektor mit Betrag 100
  setLine(line,p.x,p.y,p.x+nx,p.y+ny);                     // Gerade festlegen (Lot)
  }

// Mittelsenkrechte vorbereiten (p1 ungleich p2 vorausgesetzt!):
// Seiteneffekt line1

function perpendicularBisector () {
  var m = midpoint(p1,p2);                                 // Mittelpunkt von p1 und p2
  var l = {x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y};        // Verbindungsgerade von p1 und p2
  setPerpendicular(line1,l,m);                             // Gerade festlegen (Mittelsenkrechte)
  }

// Winkelhalbierende oder Mittelparallele vorbereiten (l1 ungleich l2 vorausgesetzt!):
// Seiteneffekt line1, line2

function angularBisectors () {
  var ux = l1.x2-l1.x1, uy = l1.y2-l1.y1;                  // Richtungsvektor von l1
  var vx = l2.x2-l2.x1, vy = l2.y2-l2.y1;                  // Richtungsvektor von l2
  if (subtype == 1) {                                      // Falls l1 und l2 echt parallel ...
    line1.x1 = (l1.x1+l2.x1)/2;                            // Erster Bestimmungspunkt f�r Mittelparallele, x-Koordinate 
    line1.y1 = (l1.y1+l2.y1)/2;                            // Erster Bestimmungspunkt f�r Mittelparallele, y-Koordinate
    line1.x2 = line1.x1+ux;                                // Zweiter Bestimmungspunkt f�r Mittelparallele, x-Koordinate
    line1.y2 = line1.y1+uy;                                // Zweiter Bestimmungspunkt f�r Mittelparallele, y-Koordinate 
    }
  else if (subtype == 2) {                                 // Falls l1 und l2 sich schneiden ...
    var a11 = ux, a12 = -vx, b1 = l2.x1-l1.x1;             // Koeffizienten der ersten Gleichung
    var a21 = uy, a22 = -vy, b2 = l2.y1-l1.y1;             // Koeffizienten der zweiten Gleichung
    var det = a11*a22-a12*a21;                             // Determinante Nenner
    var p1 = (b1*a22-a12*b2)/det;                          // L�sung f�r erste Unbekannte
    var x1 = l1.x1+p1*a11, y1 = l1.y1+p1*a21;              // Erster Bestimungspunkt (Schnittpunkt)
    var u = Math.sqrt(ux*ux+uy*uy)/100;                    // Betrag des Richtungsvektors von l1, dividiert durch 100
    var v = Math.sqrt(vx*vx+vy*vy)/100;                    // Betrag des Richtungsvektors von l2, dividiert durch 100
    var w1x = ux/u+vx/v, w1y = uy/u+vy/v;                  // Richtungsvektor von line1 (1. Winkelhalbierende)    
    line1.x1 = x1; line1.y1 = y1;                          // Erster Bestimmungspunkt von line1 (1. Winkelhalbierende)
    line1.x2 = x1+w1x; line1.y2 = y1+w1y;                  // Zweiter Bestimmungspunkt von line1 (1. Winkelhalbierende)
    var w2x = -w1y, w2y = w1x;                             // Richtungsvektor von line2 (2. Winkelhalbierende)
    line2.x1 = x1; line2.y1 = y1;                          // Erster Bestimmungspunkt von line2 (2. Winkelhalbierende)
    line2.x2 = x1+w2x; line2.y2 = y1+w2y;                  // Zweiter Bestimmungspunkt von line2 (2. Winkelhalbierende)
    }
  } 
 
// Hilfsroutine: Parameterwert f�r Lotfu�punkt
// (x,y) ... Position, Ausgangspunkt f�r Lot
// l ....... Gerade (Attribute x1, y1, x2, y2)

function parameterLine (x, y, l) {
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor
  var vx = x-l.x1, vy = y-l.y1;                            // Verbindungsvektor Aufpunkt-(x,y)
  return (ux*vx+uy*vy)/(ux*ux+uy*uy);                      // R�ckgabewert
  }
  
// Hilfsroutine: Parameter f�r Parabelpunkt
// (x,y) ... Position
// p ....... Parabel (Attribute sx, sy, fx, fy, factor, angle, cos, sin, ...)

function parameterParabola (x, y, p) {                     
  return p.sin*(x-p.sx)+p.cos*(y-p.sy);                    // R�ckgabewert
  }
  
// Hilfsroutine: Parameterwert f�r Ellipsenpunkt
// (x,y) ... Position
// e ....... Ellipse (Attribute mx, my, fx, fy, a, b, angle, ...)
// R�ckgabewert zwischen 0 und 2 pi

function parameterEllipse (x, y, e) {
  var w = e.angle-Math.atan2(e.my-y,x-e.mx);               // Winkel (Bogenma�, eventuell zu klein oder zu gro�)
  var n = Math.floor(w/(2*Math.PI));                       // Zahl der Vielfachen von 2 pi
  return w-n*2*Math.PI;                                    // R�ckgabewert
  }
  
// Hilfsroutine: Parameterwert f�r Hyperbelpunkt
// (x,y) ... Position
// h ... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin, ...)

function parameterHyperbola (x, y, h) {
  return h.sin*(x-h.mx)+h.cos*(y-h.my);                    // R�ckgabewert
  }
  
// Gerade festlegen:
// l ......... Gerade (Attribute x1, y1, x2, y2 werden angepasst)
// (x1,y1) ... Erster Bestimmungspunkt
// (x2,y2) ... Zweiter Bestimmungspunkt

function setLine (l, x1, y1, x2, y2) {
  l.x1 = x1; l.y1 = y1;                                    // Erster Bestimmungspunkt
  l.x2 = x2; l.y2 = y2;                                    // Zweiter Bestimmungspunkt
  }
  
// Punkt auf Gerade festlegen:
// p ... Punkt (Attribute x, y werden angepasst)
// l ... Gerade (Atttribute x1, y1, x2, y2, par, ...)

function setPointLine (p, l) {
  p.x = l.x1+l.par*(l.x2-l.x1);                            // x-Koordinate
  p.y = l.y1+l.par*(l.y2-l.y1);                            // y-Koordinate
  }
  
// Parabel festlegen:
// p ......... Parabel (Attribute sx, sy, fx, fy, factor, angle, cos, sin werden angepasst)
// (sx,sy) ... Scheitel
// (fx,fy) ... Brennpunkt

function setParabola (p, sx, sy, fx, fy) {
  var dx = fx-sx, dy = fy-sy;                              // Verbindungsvektor Scheitel - Brennpunkt
  var parameter = 2*Math.sqrt(dx*dx+dy*dy);                // Parameter
  if (parameter == 0) return;                              // Falls Parameter gleich 0, abbrechen
  p.sx = sx; p.sy = sy;                                    // Scheitel �benehmen
  p.fx = fx; p.fy = fy;                                    // Brennpunkt �bernehmen
  p.factor = 1/(2*parameter);                              // Faktor f�r Gleichung (x = factor*y*y)
  p.angle = Math.atan2(-dy,dx);                            // Drehwinkel (Bogenma�, Gegenuhrzeigersinn)
  p.cos = Math.cos(p.angle);                               // Kosinus des Drehwinkels
  p.sin = Math.sin(p.angle);                               // Sinus des Drehwinkels
  }
  
// Parabelpunkt festlegen:
// pt ... Punkt (Attribute x, y werden angepasst)
// p .... Parabel (Attribute sx, sy, fx, fy, factor, angle, cos, sin, ...)

function setPointParabola (pt, p) {
  var dx = p.fx-p.sx, dy = p.fy-p.sy;                      // Koordinatendifferenzen (Scheitel - Brennpunkt)
  var t = p.par;                                           // Parameterwert
  var x = p.factor*t*t;                                    // x-Koordinate vor der Drehung
  pt.x = p.sx+p.cos*x+p.sin*t;                             // x-Koordinate nach der Drehung
  pt.y = p.sy-p.sin*x+p.cos*t;                             // y-Koordinate nach der Drehung
  }
  
// Ellipse festlegen:
// e ......... Ellipse (Attribute mx, my, fx, fy, a, b, angle, cos, sin werden angepasst)
// (mx,my) ... Mittelpunkt
// (fx,fy) ... Brennpunkt
// a ......... Gro�e Halbachse

function setEllipse (e, mx, my, fx, fy, a) {
  var dx = fx-mx, dy = fy-my;                              // Verbindungsvektor Mittelpunkt - Brennpunkt
  var e2 = dx*dx+dy*dy;                                    // Quadrat der linearen Exzentrizit�t
  if (e2 >= a*a) {e = undefined; return;}                  // Falls Exzentrizit�t zu gro�, abbrechen
  e.mx = mx; e.my = my;                                    // Mittelpunkt �bernehmen
  e.fx = fx; e.fy = fy;                                    // Brennpunkt �bernehmen
  e.a = a;                                                 // Gro�e Halbachse �bernehmen
  e.b = Math.sqrt(a*a-e2);                                 // Kleine Halbachse
  e.angle = Math.atan2(-dy,dx);                            // Drehwinkel (Bogenma�, Gegenuhrzeigersinn)
  e.cos = Math.cos(e.angle);                               // Kosinus des Drehwinkels
  e.sin = Math.sin(e.angle);                               // Sinus des Drehwinkels
  }
  
// Ellipsenpunkt festlegen:
// p ... Punkt (Attribute x, y werden angepasst)
// e ... Ellipse (Attribute mx, my, fx, fy, a, b, angle, cos, sin, ...)
  
function setPointEllipse (p, e) {
  var x = e.a*Math.cos(e.par);                             // x-Koordinate vor der Drehung
  var y = e.b*Math.sin(e.par)                              // y-Koordinate vor der Drehung
  p.x = e.mx+e.cos*x+e.sin*y;                              // x-Koordinate nach der Drehung
  p.y = e.my-e.sin*x+e.cos*y;                              // y-Koordinate nach der Drehung
  }
  
// Hyperbel festlegen:
// h ......... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin werden angepasst)
// (mx,my) ... Mittelpunkt
// (fx,fy) ... Brennpunkt
// a ......... Reelle Halbachse

function setHyperbola (h, mx, my, fx, fy, a) {
  var dx = fx-mx, dy = fy-my;                              // Verbindungsvektor Mittelpunkt - Brennpunkt
  var e2 = dx*dx+dy*dy;                                    // Quadrat der linearen Exzentrizit�t
  if (e2 <= a*a) {h = undefined; return;}                  // Falls Exzentrizit�t zu klein, abbrechen
  h.mx = mx; h.my = my;                                    // Mittelpunkt �bernehmen
  h.fx = fx; h.fy = fy;                                    // Brennpunkt �bernehmen
  h.a = a;                                                 // Reelle Halbachse �bernehmen
  h.b = Math.sqrt(e2-a*a);                                 // Imagin�re Halbachse
  h.angle = Math.atan2(-dy,dx);                            // Drehwinkel (Bogenma�, Gegenuhrzeigersinn) 
  h.cos = Math.cos(h.angle);                               // Kosinus des Drehwinkels
  h.sin = Math.sin(h.angle);                               // Sinus des Drehwinkels
  }
  
// Hyperbelpunkt festlegen:
// p ... Punkt (Attribute x, y werden angepasst)
// h ... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin, ...)
// s ... Vorzeichenfaktor (je nach Hyperbelast -1 oder +1) 

function setPointHyperbola (p, h, s) {
  var y = (s==1 ? h.par1 : h.par2);                        // y-Koordinate vor der Drehung
  var x = s*h.a*Math.sqrt(1+y*y/(h.b*h.b));                // x-Koordinate vor der Drehung
  p.x = h.mx+h.cos*x+h.sin*y;                              // x-Koordinate nach der Drehung
  p.y = h.my-h.sin*x+h.cos*y;                              // y-Koordinate nach der Drehung
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath(c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt zeichnen:
// p ... Punkt (Attribute x, y)
// c ... Farbe (optional, Defaultwert schwarz)

function point (p, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2,0,2*Math.PI,true);                     // Kreis vorbereiten
  ctx.fillStyle = (c ? c : "#000000");                     // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit schwarzem Rand
  }
  
// Strecke zeichnen:
// (x1,y1) ... 1. Endpunkt
// (x2,y2) ... 2. Endpunkt
// c ......... Linienfarbe

function segment (x1, y1, x2, y2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Komplette Gerade zeichnen:
// l ... Gerade (Attribute x1, y1, x2, y2)
// c ... Linienfarbe

function line (l, c) {
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag Richtungsvektor
  if (u == 0) return;                                      // Falls Betrag 0, abbrechen
  var f = 1000/u;                                          // Faktor
  ux *= f; uy *= f;                                        // Richtungsvektor mit Betrag 1000
  segment(l.x1-ux,l.y1-uy,l.x2+ux,l.y2+uy,c);              // Linie zeichnen
  }
  
// Teil einer Geraden zeichnen:
// l ... Gerade (Attribute x1, y1, x2, y2, par, min, max)
// c ... Linienfarbe

function drawLine (l, c) {
  var ux = l.x2-l.x1, uy = l.y2-l.y1;                      // Richtungsvektor
  var min = l.min, max = l.max;                            // Minimaler und maximaler Parameterwert
  var ax = l.x1+min*ux, ay = l.y1+min*uy;                  // Erster Endpunkt
  var bx = l.x1+max*ux, by = l.y1+max*uy;                  // Zweiter Endpunkt
  segment(ax,ay,bx,by,c);                                  // Linie zeichnen
  }
  
// Kreis zeichnen (nicht ausgef�llt):
// k ... Kreis (Attribute x, y, r)
// c ... Linienfarbe (optional, Defaultwert schwarz)
// m ... Flag f�r Mittelpunktsmarkierung (optional, Defaultwert false)

function circle (k, c, m) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(k.x,k.y,k.r,0,2*Math.PI,true);                   // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  if (m) point(k,c);                                       // Falls gew�nscht, Mittelpunkt markieren
  }
  
// Teil einer Parabel zeichnen:
// p ... Parabel (Attribute sx, sy, fx, fy, factor, angle, cos, sin, par, min, max)
// c ... Linienfarbe
  
function drawParabola (p, c) {
  if (p.factor == undefined) return;                       // Falls Faktor nicht definiert, abbrechen
  newPath(c);                                              // Neuer Grafikpfad
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(p.sx,p.sy);                                // Scheitel als Ursprung des Koordinatensystems                                      
  ctx.rotate(-p.angle);                                    // Drehung des Koordinatensystems
  var t = p.min;                                           // Startwert f�r Parameter
  ctx.moveTo(p.factor*t*t,t);                              // Anfangspunkt des Polygonzugs  
  while (t < p.max) {                                      // Solange Ende noch nicht erreicht ...
    t++;                                                   // Parameterwert erh�hen
    ctx.lineTo(p.factor*t*t,t);                            // Teilstrecke zum Polygonzug hinzuf�gen
    }
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen
  ctx.stroke();                                            // Polygonzug (Teil der Parabel) zeichnen
  }
  
// Teil einer Ellipse zeichnen:
// e ... Ellipse (Attribute mx, my, fx, fy, a, b, angle, cos, sin, par, min, max)
// c ... Linienfarbe
  
function drawEllipse (e, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(e.mx,e.my);                                // Mittelpunkt als Ursprung des Koordinatensystems                                      
  ctx.rotate(-e.angle);                                    // Drehung des Koordinatensystems
  var t = e.min;                                           // Startwert f�r Parameter
  ctx.moveTo(e.a*Math.cos(t),e.b*Math.sin(t));             // Anfangspunkt des Polygonzugs
  while (t < e.max) {                                      // Solange Ende noch nicht erreicht ...
    t += DEG;                                              // Parameterwert erh�hen
    ctx.lineTo(e.a*Math.cos(t),e.b*Math.sin(t));           // Teilstrecke zum Polygonzug hinzuf�gen
    }
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen  
  ctx.stroke();                                            // Polygonzug (Teil der Ellipse) zeichnen
  }
  
// Teil des ersten Hyperbelastes zeichnen:
// h ... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin, par1, min1, max1, par2, min2, max2)
// c ... Linienfarbe
  
function drawHyperbola1 (h, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(h.mx,h.my);                                // Mittelpunkt als Ursprung des Koordinatensystems                                      
  ctx.rotate(-h.angle);                                    // Drehung des Koordinatensystems
  var b2 = h.b*h.b;                                        // Quadrat der imagin�ren Halbachse
  var t = h.min1;                                          // Startwert f�r Parameter
  ctx.moveTo(h.a*Math.sqrt(1+t*t/b2),t);                   // Anfangspunkt des Polygonzugs
  while (t < h.max1) {                                     // Solange Ende noch nicht erreicht ...
    t++;                                                   // Parameterwert erh�hen
    ctx.lineTo(h.a*Math.sqrt(1+t*t/b2),t);                 // Teilstrecke zum Polygonzug hinzuf�gen
    }
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen  
  ctx.stroke();                                            // Polygonzug (Teil des Hyperbelasts) zeichnen
  }
  
// Teil des zweiten Hyperbelastes zeichnen:
// h ... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin, par1, min1, max1, par2, min2, max2)
// c ... Linienfarbe
  
function drawHyperbola2 (h, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(h.mx,h.my);                                // Mittelpunkt als Ursprung des Koordinatensystems                                      
  ctx.rotate(-h.angle);                                    // Drehung des Koordinatensystems
  var b2 = h.b*h.b;                                        // Quadrat der imagin�ren Halbachse
  var t = h.min2;                                          // Startwert f�r Parameter
  ctx.moveTo(-h.a*Math.sqrt(1+t*t/b2),t);                  // Anfangspunkt des Polygonzugs
  while (t < h.max2) {                                     // Solange Ende noch nicht erreicht ...
    t++;                                                   // Parameterwert erh�hen
    ctx.lineTo(-h.a*Math.sqrt(1+t*t/b2),t);                // Teilstrecke zum Polygonzug hinzuf�gen
    }
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen  
  ctx.stroke();                                            // Polygonzug (Teil des Hyperbelasts) zeichnen
  }
  
// Gerade mit einem Ber�hrkreis zeichnen:
// l ..... Gerade (Attribute x1, y1, x2, y2, par, min, max)
// k ..... Ber�hrkreis (Attribute x, y, r werden angepasst)
// rad ... Nummer f�r Term zur Radiusberechnung (1, 2, 3 oder 4)

function lineCircle (l, k, rad) {
  drawLine(l,color2);                                      // Teil der Gerade zeichnen
  setPointLine(k,l);                                       // Mittelpunkt Ber�hrkreis
  if (rad == 1) k.r = distancePoint(k.x,k.y,p1);           // Radius Ber�hrkreis, 1. Fall
  else if (rad == 2) k.r = distanceLine(k.x,k.y,l1);       // Radius Ber�hrkreis, 2. Fall
  else if (rad == 3) {                                     // Radius Ber�hrkreis, 3. Fall
    var s = pointPP(c1,c2,c1.r/(c1.r-c2.r));               // Gemeinsamer Punkt von c1 und c2
    k.r = distancePoint(k.x,k.y,s);                        // Abstand vom gemeinsamen Punkt als Radius
    }
  else if (rad == 4) {                                     // Radius Ber�hrkreis, 4. Fall
    s = pointPP(c1,c2,c1.r/(c1.r+c2.r));                   // Gemeinsamer Punkt von c1 und c2
    k.r = distancePoint(k.x,k.y,s);                        // Abstand vom gemeinsamen Punkt als Radius
    }
  circle(k,color3,true);                                   // Ber�hrkreis zeichnen (mit Mittelpunkt)
  }
  
// Parabel mit einem Ber�hrkreis zeichnen:
// p ..... Parabel (Attribute sx, sy, fx, fy, factor, angle, cos, sin, par, min, max) 
// s ..... Scheitel (Attribute x, y)
// f ..... Brennpunkt (Attribute x, y)
// k ..... Ber�hrkreis (Attribute x, y, r werden angepasst)
// rad ... Nummer f�r Term zur Radiusberechnung

function parabolaCircle (p, s, f, k, rad) {
  setParabola(p,s.x,s.y,f.x,f.y);                          // Parabel festlegen
  drawParabola(p,color2);                                  // Teil der Parabel zeichnen
  setPointParabola(k,p);                                   // Mittelpunkt Ber�hrkreis
  if (rad == 1) k.r = distancePoint(k.x,k.y,p1);           // Radius Ber�hrkreis, 1. Fall
  else if (rad == 2) k.r = distanceLine(k.x,k.y,l1);       // Radius Ber�hrkreis, 2. Fall
  circle(k,color3,true);                                   // Ber�hrkreis zeichnen (mit Mittelpunkt)
  }
  
// Ellipse mit einem Ber�hrkreis zeichnen:
// e ..... Ellipse (Attribute mx, my, fx, fy, a, b, angle, cos, sin, par, min, max) 
// m ..... Mittelpunkt (Attribute x, y)
// f ..... Brennpunkt (Attribute x, y)
// a ..... Gro�e Halbachse
// k ..... Ber�hrkreis (Attribute x, y, r werden angepasst)
// rad ... Nummer f�r Term zur Radiusberechnung

function ellipseCircle (e, m, f, a, k, rad) {
  setEllipse(e,m.x,m.y,f.x,f.y,a);                         // Ellipse festlegen
  drawEllipse(e,color2);                                   // Teil der Ellipse zeichnen
  setPointEllipse(k,e);                                    // Mittelpunkt Ber�hrkreis
  var d = distancePoint(k.x,k.y,c1);                       // Abstand zum Mittelpunkt von c1
  if (rad == 1) k.r = c1.r+d;                              // Radius Ber�hrkreis, 1. Fall
  else if (rad == 2) k.r = Math.abs(c1.r-d);               // Radius Ber�hrkreis, 2. Fall
  circle(k,color3,true);                                   // Ber�hrkreis zeichnen (mit Mittelpunkt)
  }
  
// Hyperbel mit zwei Ber�hrkreisen zeichnen:
// h ..... Hyperbel (Attribute mx, my, fx, fy, a, b, angle, cos, sin, par1, min1, max1, par2, min2, max2) 
// m ..... Mittelpunkt (Attribute x, y)
// f ..... Brennpunkt (Attribute x, y)
// a ..... Reelle Halbachse
// k1 .... Ber�hrkreis auf dem 1. Ast (Attribute x, y, r werden angepasst)
// k2 .... Ber�hrkreis auf dem 2. Ast (Attribute x, y, r werden angepasst)
// rad ... Nummer f�r Term zur Radiusberechnung

function hyperbolaCircles (h, m, f, a, k1, k2, rad) {
  setHyperbola(h,m.x,m.y,f.x,f.y,a);                       // Hyperbel festlegen
  drawHyperbola1(h,color2);                                // 1. Hyperbelast zeichnen
  setPointHyperbola(k1,h,1);                               // Mittelpunkt 1. Ber�hrkreis
  if (rad == 1) k1.r = distancePoint(k1.x,k1.y,p1);        // Radius 1. Ber�hrkreis, 1. Fall
  else {
    var d1 = distancePoint(k1.x,k1.y,c1);                  // Abstand zum Mittelpunkt von c1
    if (rad == 2) k1.r = c1.r+d1;                          // Radius 1. Ber�hrkreis, 2. Fall
    else if (rad == 3) k1.r = Math.abs(c1.r-d1);           // Radius 1. Ber�hrkreis, 3. Fall
    }
  circle(k1,color3,true);                                  // 1. Ber�hrkreis zeichnen (mit Mittelpunkt)
  drawHyperbola2(h,color2);                                // 2. Hyperbelast zeichnen
  setPointHyperbola(k2,h,-1);                              // Mittelpunkt 2. Ber�hrkreis
  if (rad == 1) k2.r = distancePoint(k2.x,k2.y,p1);        // Radius 2. Ber�hrkreis, 1. Fall
  else {
    var d2 = distancePoint(k2.x,k2.y,c1);                  // Abstand zum Mittelpunkt von c1
    if (rad == 2) k2.r = Math.abs(c1.r-d2);                // Radius 2. Ber�hrkreis, 2. Fall
    else if (rad == 3) k2.r = c1.r+d2;                     // Radius 2. Ber�hrkreis, 3. Fall
    }
  circle(k2,color3,true);                                  // 2. Ber�hrkreis zeichnen (mit Mittelpunkt)
  }
  
// Grafikausgabe f�r Aufgabentyp 1 (zwei Punkte):
// Seiteneffekt subtype, line1, k1

function paint1 () {
  point(p1,color1); point(p2,color1);                      // Gegebene Punkte zeichnen
  subtype = subtypePP(p1,p2);                              // Fallunterscheidung (Seiteneffekt subtype)
  if (subtype == 0) return;                                // Falls p1 gleich p2, abbrechen
  perpendicularBisector();                                 // Mittelsenkrechte vorbereiten (Seiteneffekt line1)
  lineCircle(line1,k1,1);                                  // Mittelsenkrechte mit einem Ber�hrkreis zeichnen (Seiteneffekt k1)
  }
  
// Grafikausgabe f�r Aufgabentyp 2 (Punkt und Gerade):
// Seiteneffekt subtype, parabola1, line0, k1

function paint2 () {
  point(p1,color1);                                        // Gegebenen Punkt zeichnen
  line(l1,color1);                                         // Gegebene Gerade zeichnen
  subtype = subtypePL(p1,l1);                              // Fallunterscheidung (Seiteneffekt subtype)
  if (subtype == 0) {                                      // Grenzfall: p1 auf l1
    setPerpendicular(line0,l1,p1);                         // Lot zu l1 in p1 (Seiteneffekt line0)
    lineCircle(line0,k1,1);                                // Lot mit einem Ber�hrkreis zeichnen (Seiteneffekt k1)
    }
  else {                                                   // Normalfall: p1 au�erhalb von l1
    var fp = foot(l1,p1);                                  // Fu�punkt des Lotes von p1 auf l1
    var s = midpoint(p1,fp);                               // Scheitel der Parabel
    parabolaCircle(parabola1,s,p1,k1,1);                   // Parabel mit einem Ber�hrkreis zeichnen (Seiteneffekt parabola1, k1)
    }
  }
  
// Grafikausgabe f�r Aufgabentyp 3 (Punkt und Kreis):
// Seiteneffekt subtype, line0, hyperbola1, ellipse1, k1, k2

function paint3 () {
  point(p1,color1);                                        // Gegebenen Punkt zeichnen
  circle(c1,color1,true);                                  // Gegebenen Kreis und Mittelpunkt zeichnen
  subtype = subtypePC(p1,c1);                              // Fallunterscheidung (Seiteneffekt subtype)
  var m = midpoint(p1,c1);                                 // Mittelpunkt der Hyperbel oder Ellipse
  if (subtype == 0) {                                      // Grenzfall: p1 auf c1
    setLine(line0,c1.x,c1.y,p1.x,p1.y);                    // Verbindungsgerade von p1 und Mittelpunkt von c1 (Seiteneffekt line0)
    lineCircle(line0,k1,1);                                // Gerade mit einem Ber�hrkreis zeichnen (Seiteneffekt k1)
    }
  else if (subtype > 0)                                    // 1. Normalfall: p1 au�erhalb von c1
    hyperbolaCircles(hyperbola1,m,p1,c1.r/2,k1,k2,1);      // Hyperbel mit zwei Ber�hrkreisen zeichnen (Seiteneffekt hyperbola1, k1, k2)
  else if (subtype < 0)                                    // 2. Normalfall: p1 innerhalb von c1
    ellipseCircle(ellipse1,m,p1,c1.r/2,k1,2);              // Ellipse mit einem Ber�hrkreis zeichnen (Seiteneffekt ellipse1, k1)
  }
  
// Grafikausgabe f�r Aufgabentyp 4 (zwei Geraden):
// Seiteneffekt subtype, line1, line2, k1, k2

function paint4 () {
  line(l1,color1); line(l2,color1);                        // Gegebene Geraden zeichnen
  subtype = subtypeLL(l1,l2);                              // Fallunterscheidung (Seiteneffekt subtype)
  if (subtype == 0) return;                                // Falls Geraden identisch, abbrechen
  angularBisectors();                                      // 1. Winkelhalb. oder Mittelpar. vorbereiten (Seiteneffekt line1, line2)
  lineCircle(line1,k1,2);                                  // 1. Winkelhalbierende oder Mittelparallele mit Ber�hrkreis zeichnen
  if (subtype == 1) return;                                // Falls Geraden parallel, abbrechen
  lineCircle(line2,k2,2);                                  // 2. Winkelhalbierende mit Ber�hrkreis zeichnen
  }
  
// Grafikausgabe f�r Aufgabentyp 5 (Gerade und Kreis):
// Seiteneffekt subtype, line0, parabola1, parabola2, k1, k2

function paint5 () {
  line(l1,color1);                                         // Gegebene Gerade zeichnen
  circle(c1,color1,true);                                  // Gegebenen Kreis zeichnen
  subtype = subtypeLC(l1,c1);                              // Fallunterscheidung (Seiteneffekt suptype)
  if (subtype == 0) {                                      // Falls Ber�hrung von Gerade und Kreis ...
    setPerpendicular(line0,l1,c1);                         // Lot zu l1 durch Mittelpunkt von c1 (Seiteneffekt line0)
    lineCircle(line0,k1,2);                                // Lot mit einem Ber�hrkreis zeichnen (Seiteneffekt k1)
    }
  else {                                                   // Falls keine Ber�hrung von Gerade und Kreis ...
    var d = distanceLine(c1.x,c1.y,l1);                    // Abstand zwischen Kreismittelpunkt und Gerade
    var fp = foot(l1,c1);                                  // Fu�punkt des Lotes von p1 auf l1
    var s1 = pointPP(fp,c1,(d-c1.r)/(2*d));                // Scheitel der 1. Parabel
    parabolaCircle(parabola1,s1,c1,k1,2);                  // 1. Parabel mit Ber�hrkreis zeichnen (Seiteneffekt parabola1, k1)
    var s2 = pointPP(fp,c1,(d+c1.r)/(2*d));                // Scheitel der 2. Parabel
    parabolaCircle(parabola2,s2,c1,k2,2);                  // 2. Parabel mit Ber�hrkreis zeichnen (Seiteneffekt parabola2, k2)
    }
  }
  
// Grafikausgabe f�r Aufgabentyp 6 (zwei Kreise):
// Seiteneffekt subtype, hyperbola1, hyperbola2, ellipse1, ellipse2, line0, k1, k2, k3, k4

function paint6 () {
  circle(c1,color1,true); circle(c2,color1,true);          // Gegebene Kreise zeichnen
  var m = midpoint(c1,c2);                                 // Mittelpunkt der Hyperbel oder Ellipse
  subtype = subtypeCC(c1,c2);                              // Fallunterscheidung (Seiteneffekt subtype)
  var big1 = (c1.r > c2.r);                                // Flag f�r r1 > r2
  var a1 = Math.abs(c1.r-c2.r)/2;                          // Halbe Differenz der Kreisradien
  var a2 = (c1.r+c2.r)/2;                                  // Halbe Summe der Kreisradien
  if (subtype == 1)                                        // Falls ein Kreis ganz innerhalb des anderen ... 
    ellipseCircle(ellipse1,m,c1,a1,k3,big1?2:1);           // Ellipse mit einem Ber�hrkreis zeichnen (Seiteneffekt ellipse1, k3)
  if (subtype <= 3)                                        // Falls Kreise ganz oder teilweise einschlie�end ...
    ellipseCircle(ellipse2,m,c1,a2,k4,2);                  // Ellipse mit einem Ber�hrkreis zeichnen (Seiteneffekt ellipse2, k4)
  if (subtype >= 3)                                        // Falls Kreise ganz oder teilweise ausschlie�end ...  
    hyperbolaCircles(hyperbola1,m,c1,a1,k1,k2,big1?2:3);   // Hyperbel mit zwei Ber�hrkreisen zeichnen (Seiteneffekt hyperbola1, k1, k2)                 
  if (subtype == 5)                                        // Falls Kreise ganz ausschlie�end ...
    hyperbolaCircles(hyperbola2,m,c1,a2,k3,k4,2);          // Hyperbel mit zwei Ber�hrkreisen zeichnen (Seiteneffekt hyperbola2, k3, k4)
  if (subtype == 2 || subtype == 4)                        // Falls Grenzfall (c1 und c2 ber�hren einander) ...
    setLine(line0,c1.x,c1.y,c2.x,c2.y);                    // Verbindungsgerade der Kreismittelpunkte (Seiteneffekt line0)
  if (subtype == 2)                                        // Falls einschlie�ende Ber�hrung ... 
    lineCircle(line0,k1,3);                                // Gerade mit einem Ber�hrkreis zeichnen (Seiteneffekt k1)
  if (subtype == 4)                                        // Falls ausschlie�ende Ber�hrung ...
    lineCircle(line0,k3,4);                                // Gerade mit einem Ber�hrkreis zeichnen (Seiteneffekt k3)
  }
         
// Grafikausgabe:
// Seiteneffekt subtype, line0, line1, line2, parabola1, parabola2, ellipse1, ellipse2, hyperbola1, hyperbola2, k1, k2, k3, k4
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  switch (type) {                                          // Je nach Aufgabentyp ...
    case 1: paint1(); break;                               // Grafikausgabe f�r zwei Punkte
    case 2: paint2(); break;                               // Grafikausgabe f�r Punkt und Gerade
    case 3: paint3(); break;                               // Grafikausgabe f�r Punkt und Kreis
    case 4: paint4(); break;                               // Grafikausgabe f�r zwei Geraden
    case 5: paint5(); break;                               // Grafikausgabe f�r Gerade und Kreis
    case 6: paint6(); break;                               // Grafikausgabe f�r zwei Kreise
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen




