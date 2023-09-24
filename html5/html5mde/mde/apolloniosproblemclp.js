// Apollonios-Problem CLP (ein Kreis, eine Gerade, ein Punkt)
// Java-Applet (27.12.2008) umgewandelt
// 28.02.2017 - 03.03.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel apolloniosproblemclp_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#000000";                                    // Farbe f�r gegebene Kreise
var color2 = "#ff0000";                                    // Farbe f�r L�sungskreise

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var cb;                                                    // Array von Optionsfeldern
var lb;                                                    // Array von Ausgabefeldern
var nr;                                                    // Nummer des ausgew�hlten Objekts (0 bis 5)
var k;                                                     // Gegebener Kreis
var g;                                                     // Gegebene Gerade
var p;                                                     // Gegebener Punkt (Kreis mit Radius 0)

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  } 
  
// Einzelnes passives Optionsfeld vorbereiten:
// id ..... ID aus HTML-Datei
// cond ... Bedingung f�r Setzen des H�kchens
  
function initCheckbox (id, cond) {
  var cb = getElement(id);                                 // Optionsfeld
  cb.disabled = true;                                      // Optionsfeld deaktiviert
  cb.checked = cond;                                       // Gegebenenfalls H�kchen setzen
  }
  
// Zeile der Schaltfl�che vorbereiten:
// i ... Index (0 bis 3)
  
function initLine (i) {
  getElement("lb"+(i+1),text03[i]);                        // Erkl�render Text (L�sungstyp ...)
  var n = "cb"+(i+1);                                      // ID Optionsfeld
  cb[i] = getElement(n);                                   // Aktives Optionsfeld (L�sungstyp)
  cb[i].disabled = false;                                  // Optionsfeld nicht deaktiviert
  cb[i].checked = false;                                   // Optionsfeld zun�chst nicht ausgew�hlt
  cb[i].onclick = paint;                                   // Bei Mausklick neu zeichnen
  initCheckbox(n+"1",i>=2);                                // Passives Optionsfeld (Kreis)
  initCheckbox(n+"2",i%2==1);                              // Passives Optionsfeld (Halbebene)
  lb[i] = getElement("lb"+(i+1)+"n");                      // Ausgabefeld (Anzahl L�sungskreise)
  }

// Start:

function start () {
  nr = 0;                                                  // Zun�chst nicht ausgew�hlt
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("text1",text01);                              // Erkl�render Text (Auswahl L�sungskreise)
  getElement("text2a",text02[0]);                          // Erkl�render Text (Bedeutung der H�kchen)
  getElement("text2b",text02[1]);                          // Erkl�render Text (Bedeutung der H�kchen)
  getElement("text2c",text02[2]);                          // Erkl�render Text (Bedeutung der H�kchen)
  getElement("text2d",text02[3]);                          // Erkl�render Text (Bedeutung der H�kchen)
  cb = new Array(4);                                       // Array von Optionsfeldern (L�sungstypen)
  lb = new Array(4);                                       // Array von Ausgabefeldern (Anzahl L�sungskreise)
  for (var i=0; i<4; i++) initLine(i);                     // Zeilen f�r L�sungstypen vorbereiten
  getElement("text4",text04);                              // Erkl�render Text (Zahl der L�sungen)
  k = {x: 200, y: 100, r: 50};                             // Gegebener Kreis
  g = {x1: 50, y1: 350, x2: 280, y2: 320};                 // Gegebene Gerade
  p = {x: 120, y: 240, r: 0};                              // Gegebener Punkt (Kreis mit Radius 0)  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
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
  nr = 0;                                                  // Keine Ecke ausgew�hlt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Keine Ecke ausgew�hlt, Zugmodus deaktiviert
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
  
// Abstand von einem gegebenen Punkt:
// (u,v) ..... Aktuelle Position (Pixel)
// (u0,v0) ... Gegebener Punkt
  
function distancePoint (u, v, u0, v0) {
  var dx = u-u0, dy = v-v0;                                // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
 // Abstand von einer gegebenen Geraden:
 // (u,v) ... Aktuelle Position (Pixel)
 // g ....... Gegebene Gerade
 
 function distanceLine (u, v, g) {
   var ux = g.x2-g.x1, uy = g.y2-g.y1;                     // Richtungsvektor
   var vx = u-g.x1, vy = v-g.y1;                           // Verbindungsvektor 
   var h1 = vx*vx+vy*vy;                                   // Hilfsgr��e (Quadrat Verbindungsvektor)
   var h2 = vx*ux+vy*uy;                                   // Hilfsgr��e (Skalarprodukt)
   return Math.sqrt(h1-h2*h2/(ux*ux+uy*uy));               // R�ckgabewert   
   } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)  
  var d = distancePoint(u,v,k.x,k.y);                      // Abstand vom Kreismittelpunkt
  var dMin = d;                                            // Vorl�ufiges Abstandsminimum
  var n = 1;                                               // Nummer f�r Kreismittelpunkt
  d = Math.abs(k.r-d);                                     // Abstand vom Kreisrand
  if (d < dMin) {n = 2; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  d = distancePoint(u,v,p.x,p.y);                          // Abstand vom gegebenen Punkt
  if (d < dMin) {n = 3; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  d = distanceLine(u,v,g);                                 // Abstand von der Geraden
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    var d1 = distancePoint(u,v,g.x1,g.y1);                 // Abstand zum ersten Bestimmungspunkt der Geraden
    var d2 = distancePoint(u,v,g.x2,g.y2);                 // Abstand zum zweiten Bestimmungspunkt der Geraden
    n = (d1<d2 ? 4 : 5);                                   // Nummer aktualisieren
    }
  nr = (dMin<20 ? n : 0);                                  // Falls geringer Abstand, Nummer �bernehmen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (nr == 0) return;                                     // Gegebenenfalls abbrechen
  if (nr == 1) {k.x = u; k.y = v;}                         // Kreismittelpunkt anpassen
  if (nr == 2) k.r = distancePoint(u,v,k.x,k.y);           // Kreisradius anpassen
  if (nr == 3) {p.x = u; p.y = v;}                         // Punkt anpassen
  if (nr == 4) {g.x1 = u; g.y1 = v;}                       // Punkt 1 der Gerade anpassen
  if (nr == 5) {g.x2 = u; g.y2 = v;}                       // Punkt 2 der Gerade anpassen
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------
   
// Koeffizienten einer linearen Gleichung f�r x, y, r aus zwei quadratischen Ber�hr-Bedingungen:
// k1 ... erster Kreis
// s1 ... +1 f�r einschlie�ende, -1 f�r ausschlie�ende Ber�hrung
// k2 ... zweiter Kreis
// s2 ... +1 f�r einschlie�ende, -1 f�r ausschlie�ende Ber�hrung
// R�ckgabewert r: Array mit den Koeffizienten der linearen Gleichung:
// r[1] * x + r[2] * y + r[3] *  r = r[0]  
    
function coeffLinEqu (k1, s1, k2, s2) {
  var r0 = k2.x*k2.x-k1.x*k1.x+k2.y*k2.y-k1.y*k1.y+k1.r*k1.r-k2.r*k2.r;   // Inhomogener Teil
  var r1 = 2*(k2.x-k1.x);                                  // Koeffizient von x
  var r2 = 2*(k2.y-k1.y);                                  // Koeffizient von y
  var r3 = 2*(s1*k1.r-s2*k2.r);                            // Koeffizient von r  
  return [r0,r1,r2,r3];                                    // R�ckgabewert
  }
  
// Koeffizienten einer linearen Gleichung f�r x, y, r aus Abstandsbedingung:
// g ... Gerade
// s ... Vorzeichenfaktor (entsprechend Halbebene)
// R�ckgabewert r: Array mit den Koeffizienten der linearen Gleichung:
// r[1] * x + r[2] * y + r[3] *  r = r[0]  
  
function coeffLinEquPar (g, s) {
  var dx = g.x2-g.x1, dy = g.y2-g.y1;                      // Richtungsvektor
  var r0 = dy*g.x1-dx*g.y1;                                // Inhomogener Teil
  var r1 = dy;                                             // Koeffizient von x
  var r2 = -dx;                                            // Koeffizient von y
  var r3 = -s*Math.sqrt(dx*dx+dy*dy);                      // Koeffizient von r
  return [r0,r1,r2,r3];                                    // R�ckgabewert
  }
  
// L�sung eines linearen Gleichungssystems mit 2 Gleichungen und 3 Unbekannten:
// e[0][1] * x + e[0][2] * y + e[0][3] * r = e[0][0]
// e[1][1] * x + e[1][2] * y + e[1][3] * r = e[1][0]
// R�ckgabewert s: Koeffizienten-Array, mit dessen Hilfe sich x und y durch r ausdr�cken lassen:
// x = s[0][0] * r + s[0][1] 
// y = s[1][0] * r + s[1][1]

function solution23 (e) {
  var det0 = e[0][1]*e[1][2]-e[1][1]*e[0][2];              // Nenner-Determinante (Cramersche Regel)
  var det1r = e[1][3]*e[0][2]-e[0][3]*e[1][2];             // Z�hler-Determinante f�r s[0][0]
  var det1 = e[0][0]*e[1][2]-e[1][0]*e[0][2];              // Z�hler-Determinante f�r s[0][1]
  var det2r = e[1][1]*e[0][3]-e[0][1]*e[1][3];             // Z�hler-Determinante f�r s[1][0]
  var det2 = e[0][1]*e[1][0]-e[1][1]*e[0][0];              // Z�hler-Determinante f�r s[1][1]
  return [[det1r/det0,det1/det0],[det2r/det0,det2/det0]];  // R�ckgabewert (doppelt indiziertes Array)
  }
  
// L�sungskreis(e) eines bestimmten L�sungstyps:
// s1 ... Vorzeichenfaktor (+1 f�r einschlie�ende, -1 f�r ausschlie�ende Ber�hrung des Kreises)
// s3 ... Vorzeichenfaktor f�r Halbebene 
// R�ckgabewert: Array mit 2 Elementen (L�sungskreis bzw. undefined)

function solution (s1, s3) {
  // Lineares Gleichungssystem zur Elimination von x und y
  // a11*x + a12*y + a13*r = b1
  // a21*x + a22*y + a23*r = b2
  var lin = new Array(2);                                  // Neues Array
  lin[0] = coeffLinEqu(k,s1,p,1);                          // Koeffizienten der ersten linearen Gleichung
  lin[1] = coeffLinEquPar(g,s3);                           // Koeffizienten der zweiten linearen Gleichung
  var cd = solution23(lin);                                // Koeffizienten-Array, um x und y durch r auszudr�cken
  // Ansatz: x = c1*r+d1; y = c2*r+d2;
  var c1 = cd[0][0], d1 = cd[0][1];                        // Koeffizienten f�r x
  var c2 = cd[1][0], d2 = cd[1][1];                        // Koeffizienten f�r y
  // Einsetzen in Ber�hr-Bedingung f�r Kreis 1
  var e1 = d1-k.x;                                         // Konstanter Summand
  var e2 = d2-k.y;                                         // Konstanter Summand
  // Quadratische Gleichung f�r r: (c1*r+e1)^2 + (c2*r+e2)^2 = (r-s1*r1)^2
  // Gel�st mit Maxima!
  var denom = 1-c1*c1-c2*c2;                               // Nenner
  var discr = (c1*c1+c2*c2)*k.r*k.r + 2*(c1*e1+c2*e2)*k.r*s1  // Diskriminante (Anfang)
    + (1-c1*c1)*e2*e2 + (1-c2*c2)*e1*e1 + 2*c1*c2*e1*e2;      // Diskriminante (Fortsetzung)
  if (discr < 0) return [undefined, undefined];            // R�ckgabewert f�r negative Diskriminante
  var root = Math.sqrt(discr);                             // Wurzel
  var h = k.r*s1+c1*e1+c2*e2;                              // Summand au�erhalb der Wurzel
  var rs1 = (h+root)/denom, rs2 = (h-root)/denom;          // L�sungen f�r Radius r
  var xs1 = c1*rs1+d1, xs2 = c1*rs2+d1;                    // L�sungen f�r Mittelpunktskoordinate x
  var ys1 = c2*rs1+d2, ys2 = c2*rs2+d2;                    // L�sungen f�r Mittelpunktskoordinate y
  var array = new Array(2);                                // Array vorbereiten
  array[0] = (rs1>0 ? {x: xs1, y: ys1, r: rs1} : undefined);    // 1. L�sung, falls sinnvoll
  array[1] = (rs2>0 && discr>0 ? {x: xs2, y: ys2, r: rs2} : undefined);    // 2. L�sung, falls sinnvoll
  return array;                                            // R�ckgabewert
  }
  
// Zahl der L�sungskreise eines gegebenen Typs:
// a ... Array mit 2 Elementen (L�sungskreis bzw. undefined)
  
function numberCircles (a) {
  var n = 0;                                               // Anzahl zun�chst 0
  if (a[0]) n++;                                           // Falls 1. L�sung definiert, Anzahl erh�hen
  if (a[1]) n++;                                           // Falls 2. L�sung definiert, Anzahl erh�hen
  return n;                                                // R�ckgabewert
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad (Standardwerte):
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Kreis zeichnen (kleiner Radius):
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// c ......... Farbe

function circle1 (xM, yM, r, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(xM,yM,r,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen 
  }
  
// Hilfsroutine: Linker oder rechter Teil eines Kreises mit gro�em Radius (x als Funktion von y)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 f�r links, +1 f�r rechts)
// c ......... Farbe

function circle2x (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgr��en (abh�ngig vom Radius)
  var y0 = Math.max(Math.floor(yM-r1),0);                  // Minimum y-Koordinate   
  var y1 = Math.min(Math.ceil(yM+r1),height);              // Maximum y-Koordinate
  newPath(c);                                              // Neuer Grafikpfad f�r linken Viertelkreis oder Teil davon
  yy = y0;                                                 // Aktuelle y-Koordinate
  var dy = yy-yM;                                          // Koordinatendifferenz senkrecht
  xx = xM+sgn*Math.sqrt(r2-dy*dy);                         // Aktuelle x-Koordinate
  ctx.moveTo(xx,yy);                                       // Anfangspunkt
  while (yy < y1) {                                        // Solange unterer Rand noch nicht erreicht ...
    yy++;                                                  // Aktuelle y-Koordinate
    dy = yy-yM;                                            // Koordinatendifferenz senkrecht
    xx = xM+sgn*Math.sqrt(r2-dy*dy);                       // Aktuelle x-Koordinate
    if (xx >= 0 && xx <= width) ctx.lineTo(xx,yy);         // Entweder Linie vorbereiten ...
    else ctx.moveTo(xx,yy);                                // ... oder neuer Anfangspunkt
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Hilfsroutine: Oberer oder unterer Teil eines Kreises mit gro�em Radius (y als Funktion von x)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 f�r oben, +1 f�r unten)
// c ......... Farbe

function circle2y (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgr��en (abh�ngig vom Radius)
  var x0 = Math.max(Math.floor(xM-r1),0);                  // Minimum x-Koordinate
  var x1 = Math.min(Math.ceil(xM+r1),width);               // Maximum x-Koordinate
  newPath(c);                                              // Neuer Grafikpfad f�r unteren Viertelkreis oder Teil davon
  var xx = x0;                                             // Aktuelle x-Koordinate
  var dx = xx-xM;                                          // Koordinatendifferenz waagrecht
  var yy = yM+sgn*Math.sqrt(r2-dx*dx);                     // Aktuelle y-Koordinate
  ctx.moveTo(xx,yy);                                       // Anfangspunkt                                   
  while (xx < x1) {                                        // Solange rechter Rand noch nicht erreicht ...
    xx++;                                                  // Aktuelle x-Koordinate
    dx = xx-xM;                                            // Koordinatendifferenz waagrecht
    yy = yM+sgn*Math.sqrt(r2-dx*dx);                       // Aktuelle y-Koordinate                           
    if (yy >= 0 && yy <= height) ctx.lineTo(xx,yy);        // Entweder Linie vorbereiten ...
    else ctx.moveTo(xx,yy);                                // ... oder neuer Anfangspunkt
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Kreis zeichnen (gro�er Radius):
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// c ......... Farbe

function circle2 (xM, yM, r, c) {
  circle2x(xM,yM,r,-1,c);                                  // Linker Teil des Kreises
  circle2x(xM,yM,r,1,c);                                   // Rechter Teil des Kreises
  circle2y(xM,yM,r,-1,c);                                  // Oberer Teil des Kreises
  circle2y(xM,yM,r,1,c);                                   // Unterer Teil des Kreises
  }
  
// Text mit Index (schwarz):
// t ....... Text ('_' als Trennzeichen zwischen normalem Text und Index)
// (x,y) ... Position
// left .... Flag f�r Linksverschiebung

function textIndex (t, x, y, left) {
  var i = t.indexOf("_");                                  // Index Unterstrich oder -1
  var t1 = (i>=0 ? t.substring(0,i) : t);                  // Text ohne Index
  var t2 = (i>=0 ? t.substring(i+1) : "");                 // Index
  var l1 = ctx.measureText(t1).width;                      // L�nge des normalen Textes (Pixel)
  if (left) x -= l1+ctx.measureText(t2).width;             // Falls gew�nscht, nach links verschieben
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(t1,x,y);                                    // Normaler Text
  ctx.fillText(t2,x+l1,y+4);                               // Index
  }
  
// Kreis beschriften:
// k ... Kreis
// n ... Bezeichnung

function nameCircle (k, n) {
  var x0 = width/2, y0 = height/2;                         // Bezugspunkt (Mittelpunkt der Zeichenfl�che)
  var w = Math.atan2(y0-k.y,k.x-x0);                       // Winkel
  var r = k.r+5;                                           // Abstand der Beschriftung vom Mittelpunkt
  var x = k.x+r*Math.cos(w), y = k.y-r*Math.sin(w);        // Position Beschriftung
  textIndex(n,x,y,x<k.x);                                  // Beschriftung
  }
  
// Kreis zeichnen:
// k ... Kreis
// m ... Flag f�r Mittelpunktsmarkierung
// c ... Farbe (Kreislinie, Mittelpunkt)
// n ... Bezeichnung (optional) 
  
function drawCircle (k, m, c, n) {
  if (!k) return;                                          // Falls Kreis nicht definiert, abbrechen
  if (k.r < 1000) circle1(k.x,k.y,k.r,c);                  // Entweder Kreis mit kleinem Radius
  else circle2(k.x,k.y,k.r,c);                             // ... oder Kreis mit gro�em Radius
  if (m) drawPoint(k,c);                                   // Falls gew�nscht, Mittelpunkt einzeichnen
  if (n) nameCircle(k,n);                                  // Falls gew�nscht, Kreis beschriften
  }
  
// Gerade beschriften:
// g ... Gerade
// n ... Bezeichnung

function nameLine (g, n) {
  var nx = g.y2-g.y1, ny = g.x1-g.x2;                      // Normalenvektor
  var n0 = nx*g.x1+ny*g.y1;                                // Konstanter Summand
  var flat = (Math.abs(ny) > Math.abs(nx));                // �berpr�fung, ob Gerade eher waagrecht
  var x = (flat ? 20 : (n0-ny*20)/nx+10);                  // x-Koordinate
  var y = (flat ? (n0-nx*20)/ny+10 : 20);                  // y-Koordinate
  textIndex(n,x,y,false);                                  // Beschriftung
  }
  
// Gerade zeichnen:
// g ... Gerade
// c ... Farbe
// n ... Bezeichnung (optional)
  
function drawLine (g, c, n) {
  if (!g || g.x1 == g.x2 && g.y1 == g.y2) return;          // Falls Gerade nicht definiert, abbrechen
  newPath(c);                                              // Neuer Grafikpfad
  var dx = g.x2-g.x1, dy = g.y2-g.y1;                      // Richtungsvektor
  var d = Math.sqrt(dx*dx+dy*dy);                          // Betrag des Richtungsvektors
  var f = 1000/d;                                          // Faktor
  ctx.moveTo(g.x1-f*dx,g.y1-f*dy);                         // Anfangspunkt (au�erhalb des sichtbaren Bereichs)
  ctx.lineTo(g.x2+f*dx,g.y2+f*dy);                         // Endpunkt (au�erhalb des sichtbaren Bereichs)
  ctx.stroke();                                            // Gerade zeichnen
  if (n) nameLine(g,n);                                    // Falls gew�nscht, Gerade beschriften
  }
  
// Punkt beschriften:
// p ... Punkt
// n ... Bezeichnung

function namePoint (p, n) {
  var x0 = width/2, y0 = height/2;                         // Bezugspunkt (Mittelpunkt der Zeichenfl�che)
  var w = Math.atan2(y0-p.y,p.x-x0);                       // Winkel
  var r = 6;                                               // Abstand der Beschriftung vom Punkt
  var x = p.x+r*Math.cos(w), y = p.y-r*Math.sin(w);        // Position Beschriftung
  textIndex(n,x,y,x<p.x);                                  // Beschriftung
  }
  
// Punkt zeichnen:
// p ... Punkt
// c ... Farbe
// n ... Bezeichnung (optional)

function drawPoint (p, c, n) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2,0,2*Math.PI,true);                     // Kreis vorbereiten
  ctx.fillStyle = c; ctx.fill();                           // Ausgef�llter Kreis
  if (n) namePoint(p,n);
  }
  
// L�sungskreise eines gegebenen Typs zeichnen:
// i ... Index L�sungstyp (0 bis 3)
// R�ckgabewert: Zahl der L�sungen des gegebenen Typs
// Die Zahl der L�sungen f�r die einzelnen Typen wird in der Schaltfl�che aktualisiert.
  
function drawSolutions (i) {
  var s1 = (i<2 ? +1 : -1);                                // Vorzeichenfaktor Kreis
  var s3 = (i%2==0 ? +1 : -1);                             // Vorzeichenfaktor Halbebene 
  var a = solution(s1,s3);                                 // Array der L�sungskreise
  var vis = cb[i].checked;                                 // Flag f�r Zeichnen
  if (vis && a[0]) drawCircle(a[0],false,color2);          // Gegebenenfalls 1. L�sungskreis zeichnen
  if (vis && a[1]) drawCircle(a[1],false,color2);          // Gegebenenfalls 2. L�sungskreis zeichnen
  var n = numberCircles(a);                                // Zahl der L�sungen
  lb[i].innerHTML = ""+n;                                  // L�sungszahl in der Schaltfl�che aktualisieren
  return n;                                                // R�ckgabewert
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  drawCircle(k,true,color1,nameCircle1);                   // Gegebener Kreis
  drawLine(g,color1,nameLine1);                            // Gegebene Gerade   
  drawPoint(p,color1,namePoint1);                          // Gegebener Punkt                        
  var sum = 0;                                             // Variable f�r Gesamtzahl der L�sungen
  for (var i=0; i<4; i++) sum += drawSolutions(i);         // L�sungskreise der einzelnen L�sungstypen
  getElement("lbn").innerHTML = ""+sum;                    // Ausgabe der Gesamtzahl der L�sungen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

