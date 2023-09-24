// Apollonios-Problem CCP (zwei Kreise, ein Punkt)
// Java-Applet (27.12.2008) umgewandelt
// 23.02.2017 - 03.03.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel apolloniosproblemccp_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#000000";                                    // Farbe für gegebene Kreise
var color2 = "#ff0000";                                    // Farbe für Lösungskreise

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var cb;                                                    // Array von Optionsfeldern
var lb;                                                    // Array von Ausgabefeldern
var nr;                                                    // Nummer des ausgewählten Objekts (0 bis 5)
var k1, k2;                                                // Gegebene Kreise
var p;                                                     // Gegebener Punkt (Kreis mit Radius 0)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 
  
// Einzelnes passives Optionsfeld vorbereiten:
// id ..... ID aus HTML-Datei
// cond ... Bedingung für Setzen des Häkchens
  
function initCheckbox (id, cond) {
  var cb = getElement(id);                                 // Optionsfeld
  cb.disabled = true;                                      // Optionsfeld deaktiviert
  cb.checked = cond;                                       // Gegebenenfalls Häkchen setzen
  }
  
// Zeile der Schaltfläche vorbereiten:
// i ... Index (0 bis 3)
  
function initLine (i) {
  getElement("lb"+(i+1),text03[i]);                        // Erklärender Text (Lösungstyp ...)
  var n = "cb"+(i+1);                                      // ID Optionsfeld
  cb[i] = getElement(n);                                   // Aktives Optionsfeld (Lösungstyp)
  cb[i].disabled = false;                                  // Optionsfeld zunächst nicht deaktiviert
  cb[i].checked = false;                                   // Optionsfeld zunächst nicht ausgewählt
  cb[i].onclick = paint;                                   // Bei Mausklick neu zeichnen
  initCheckbox(n+"1",i>=2);                                // Passives Optionsfeld (1. Kreis)
  initCheckbox(n+"2",i%2==1);                              // Passives Optionsfeld (2. Kreis)
  lb[i] = getElement("lb"+(i+1)+"n");                      // Ausgabefeld (Anzahl Lösungskreise)
  }

// Start:

function start () {
  nr = 0;                                                  // Zunächst nicht ausgewählt
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("text1",text01);                              // Erklärender Text (Auswahl Lösungskreise)
  getElement("text2a",text02[0]);                          // Erklärender Text (Bedeutung der Häkchen)
  getElement("text2b",text02[1]);                          // Erklärender Text (Bedeutung der Häkchen)
  getElement("text2c",text02[2]);                          // Erklärender Text (Bedeutung der Häkchen)
  cb = new Array(4);                                       // Array von Optionsfeldern (Lösungstypen)
  lb = new Array(4);                                       // Array von Ausgabefeldern (Anzahl Lösungskreise)
  for (var i=0; i<4; i++) initLine(i);                     // Zeilen für Lösungstypen vorbereiten
  getElement("text4",text04);                              // Erklärender Text (Zahl der Lösungen)  
  k1 = {x: 200, y: 100, r: 50};                            // 1. gegebener Kreis
  k2 = {x: 120, y: 240, r: 40};                            // 2. gegebener Kreis
  p = {x: 260, y: 300, r: 0};                              // Gegebener Punkt (Kreis mit Radius 0)
  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
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
  if (nr > 0) e.preventDefault();                          // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Keine Ecke ausgewählt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Keine Ecke ausgewählt, Zugmodus deaktiviert
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
// (u,v) ... Gegebene Position (Pixel)
// p ....... Gegebener Punkt
  
function distance (u, v, p) {
  var dx = u-p.x, dy = v-p.y;                              // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)  
  var d = distance(u,v,k1);                                // Abstand vom Mittelpunkt 1
  var dMin = d;                                            // Vorläufiges Abstandsminimum
  var n = 1;                                               // Nummer für Mittelpunkt 1
  d = Math.abs(k1.r-d);                                    // Abstand vom Kreisrand 1
  if (d < dMin) {n = 2; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  d = distance(u,v,k2);                                    // Abstand vom Mittelpunkt 2
  if (d < dMin) {n = 3; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  d = Math.abs(k2.r-d);                                    // Abstand vom Kreisrand 2
  if (d < dMin) {n = 4; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  d = distance(u,v,p);                                     // Abstand vom Punkt
  if (d < dMin) {n = 5; dMin = d;}                         // Eventuell Nummer und Abstandsminimum aktualisieren
  nr = (dMin<20 ? n : 0);                                  // Falls geringer Abstand, Nummer übernehmen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// u, v ... Bildschirmkoordinaten bezüglich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  if (nr == 0) return;                                     // Gegebenenfalls abbrechen
  if (nr == 1) {k1.x = u; k1.y = v;}                       // Mittelpunkt 1 anpassen
  if (nr == 2) k1.r = distance(u,v,k1);                    // Radius 1 anpassen
  if (nr == 3) {k2.x = u; k2.y = v;}                       // Mittelpunkt 2 anpassen
  if (nr == 4) k2.r = distance(u,v,k2);                    // Radius 2 anpassen
  if (nr == 5) {p.x = u; p.y = v;}                         // Punkt anpassen
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------
   
// Koeffizienten einer linearen Gleichung für x, y, r aus zwei quadratischen Berühr-Bedingungen:
// k1 ... erster Kreis
// s1 ... +1 für einschließende, -1 für ausschließende Berührung
// k2 ... zweiter Kreis
// s2 ... +1 für einschließende, -1 für ausschließende Berührung
// Rückgabewert r: Array mit den Koeffizienten der linearen Gleichung:
// r[1] * x + r[2] * y + r[3] *  r = r[0]  
    
function coeffLinEqu (k1, s1, k2, s2) {
  var r0 = k2.x*k2.x-k1.x*k1.x+k2.y*k2.y-k1.y*k1.y+k1.r*k1.r-k2.r*k2.r;   // Inhomogener Teil
  var r1 = 2*(k2.x-k1.x);                                  // Koeffizient von x
  var r2 = 2*(k2.y-k1.y);                                  // Koeffizient von y
  var r3 = 2*(s1*k1.r-s2*k2.r);                            // Koeffizient von r  
  return [r0,r1,r2,r3];                                    // Rückgabewert
  }
  
// Lösung eines linearen Gleichungssystems mit 2 Gleichungen und 3 Unbekannten:
// e[0][1] * x + e[0][2] * y + e[0][3] * r = e[0][0]
// e[1][1] * x + e[1][2] * y + e[1][3] * r = e[1][0]
// Rückgabewert s: Koeffizienten-Array, mit dessen Hilfe sich x und y durch r ausdrücken lassen:
// x = s[0][0] * r + s[0][1] 
// y = s[1][0] * r + s[1][1]

function solution23 (e) {
  var det0 = e[0][1]*e[1][2]-e[1][1]*e[0][2];              // Nenner-Determinante (Cramersche Regel)
  var det1r = e[1][3]*e[0][2]-e[0][3]*e[1][2];             // Zähler-Determinante für s[0][0]
  var det1 = e[0][0]*e[1][2]-e[1][0]*e[0][2];              // Zähler-Determinante für s[0][1]
  var det2r = e[1][1]*e[0][3]-e[0][1]*e[1][3];             // Zähler-Determinante für s[1][0]
  var det2 = e[0][1]*e[1][0]-e[1][1]*e[0][0];              // Zähler-Determinante für s[1][1]
  return [[det1r/det0,det1/det0],[det2r/det0,det2/det0]];  // Rückgabewert (doppelt indiziertes Array)
  }
  
// Lösungskreis(e) eines bestimmten Lösungstyps:
// s1, s2 ... Vorzeichenfaktoren (+1 für einschließende, -1 für ausschließende Berührung)
// Rückgabewert: Array mit 2 Elementen (Lösungskreis bzw. undefined)

function solution (s1, s2) {
  // Lineares Gleichungssystem zur Elimination von x und y
  // a11*x + a12*y + a13*r = b1
  // a21*x + a22*y + a23*r = b2
  var lin = new Array(2);                                  // Neues Array
  lin[0] = coeffLinEqu(k1,s1,k2,s2);                       // Koeffizienten der ersten linearen Gleichung
  lin[1] = coeffLinEqu(k2,s2,p,1);                         // Koeffizienten der zweiten linearen Gleichung
  var cd = solution23(lin);                                // Koeffizienten-Array, um x und y durch r auszudrücken
  // Ansatz: x = c1*r+d1; y = c2*r+d2;
  var c1 = cd[0][0], d1 = cd[0][1];                        // Koeffizienten für x
  var c2 = cd[1][0], d2 = cd[1][1];                        // Koeffizienten für y
  // Einsetzen in Berühr-Bedingung für Kreis 1
  var e1 = d1-k1.x;                                        // Konstanter Summand
  var e2 = d2-k1.y;                                        // Konstanter Summand
  // Quadratische Gleichung für r: (c1*r+e1)^2 + (c2*r+e2)^2 = (r-s1*r1)^2
  // Gelöst mit Maxima!
  var denom = 1-c1*c1-c2*c2;                               // Nenner
  var discr = (c1*c1+c2*c2)*k1.r*k1.r + 2*(c1*e1+c2*e2)*k1.r*s1 // Diskriminante (Anfang)
    + (1-c1*c1)*e2*e2 + (1-c2*c2)*e1*e1 + 2*c1*c2*e1*e2;        // Diskriminante (Fortsetzung)
  if (discr < 0) return [undefined, undefined];            // Rückgabewert für negative Diskriminante
  var root = Math.sqrt(discr);                             // Wurzel
  var h = k1.r*s1+c1*e1+c2*e2;                             // Summand außerhalb der Wurzel
  var rs1 = (h+root)/denom, rs2 = (h-root)/denom;          // Lösungen für Radius r
  var xs1 = c1*rs1+d1, xs2 = c1*rs2+d1;                    // Lösungen für Mittelpunktskoordinate x
  var ys1 = c2*rs1+d2, ys2 = c2*rs2+d2;                    // Lösungen für Mittelpunktskoordinate y
  var array = new Array(2);                                // Array vorbereiten
  array[0] = (rs1>0 ? {x: xs1, y: ys1, r: rs1} : undefined);    // 1. Lösung, falls sinnvoll
  array[1] = (rs2>0 && discr>0 ? {x: xs2, y: ys2, r: rs2} : undefined);    // 2. Lösung, falls sinnvoll
  return array;                                            // Rückgabewert
  }
  
// Zahl der Lösungskreise eines gegebenen Typs:
// a ... Array mit 2 Elementen (Lösungskreis bzw. undefined)
  
function numberCircles (a) {
  var n = 0;                                               // Anzahl zunächst 0
  if (a[0]) n++;                                           // Falls 1. Lösung definiert, Anzahl erhöhen
  if (a[1]) n++;                                           // Falls 2. Lösung definiert, Anzahl erhöhen
  return n;                                                // Rückgabewert
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
  
// Hilfsroutine: Linker oder rechter Teil eines Kreises mit großem Radius (x als Funktion von y)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 für links, +1 für rechts)
// c ......... Farbe

function circle2x (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgrößen (abhängig vom Radius)
  var y0 = Math.max(Math.floor(yM-r1),0);                  // Minimum y-Koordinate   
  var y1 = Math.min(Math.ceil(yM+r1),height);              // Maximum y-Koordinate
  newPath(c);                                              // Neuer Grafikpfad für linken Viertelkreis oder Teil davon
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
  
// Hilfsroutine: Oberer oder unterer Teil eines Kreises mit großem Radius (y als Funktion von x)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 für oben, +1 für unten)
// c ......... Farbe

function circle2y (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgrößen (abhängig vom Radius)
  var x0 = Math.max(Math.floor(xM-r1),0);                  // Minimum x-Koordinate
  var x1 = Math.min(Math.ceil(xM+r1),width);               // Maximum x-Koordinate
  newPath(c);                                              // Neuer Grafikpfad für unteren Viertelkreis oder Teil davon
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
  
// Kreis zeichnen (großer Radius):
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
// left .... Flag für Linksverschiebung

function textIndex (t, x, y, left) {
  var i = t.indexOf("_");                                  // Index Unterstrich oder -1
  var t1 = (i>=0 ? t.substring(0,i) : t);                  // Text ohne Index
  var t2 = (i>=0 ? t.substring(i+1) : "");                 // Index
  var l1 = ctx.measureText(t1).width;                      // Länge des normalen Textes (Pixel)
  if (left) x -= l1+ctx.measureText(t2).width;             // Falls gewünscht, nach links verschieben
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(t1,x,y);                                    // Normaler Text
  ctx.fillText(t2,x+l1,y+4);                               // Index
  }
  
// Kreis beschriften:
// k ... Kreis
// n ... Bezeichnung

function nameCircle (k, n) {
  var x0 = width/2, y0 = height/2;                         // Bezugspunkt (Mittelpunkt der Zeichenfläche)
  var w = Math.atan2(y0-k.y,k.x-x0);                       // Winkel
  var r = k.r+5;                                           // Abstand der Beschriftung vom Mittelpunkt
  var x = k.x+r*Math.cos(w), y = k.y-r*Math.sin(w);        // Position Beschriftung
  textIndex(n,x,y,x<k.x);                                  // Beschriftung
  }
  
// Kreis zeichnen:
// k ... Kreis
// m ... Flag für Mittelpunktsmarkierung
// c ... Farbe (Kreislinie, Mittelpunkt) 
// n ... Bezeichnung (optional)
  
function drawCircle (k, m, c, n) {
  if (!k) return;                                          // Falls Kreis nicht definiert, abbrechen
  if (k.r < 1000) circle1(k.x,k.y,k.r,c);                  // Entweder Kreis mit kleinem Radius
  else circle2(k.x,k.y,k.r,c);                             // ... oder Kreis mit großem Radius
  if (m) drawPoint(k,c);                                   // Falls gewünscht, Mittelpunkt einzeichnen
  if (n) nameCircle(k,n);                                  // Falls gewünscht, Kreis beschriften
  }
  
// Punkt beschriften:
// p ... Punkt
// n ... Bezeichnung

function namePoint (p, n) {
  var x0 = width/2, y0 = height/2;                         // Bezugspunkt (Mittelpunkt der Zeichenfläche)
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
  ctx.fillStyle = c; ctx.fill();                           // Ausgefüllter Kreis
  if (n) namePoint(p,n);                                   // Falls gewünscht, Punkt beschriften
  }
  
// Lösungskreise eines gegebenen Typs zeichnen:
// i ... Index Lösungstyp (0 bis 3)
// Rückgabewert: Zahl der Lösungen des gegebenen Typs
// Die Zahl der Lösungen für die einzelnen Typen wird in der Schaltfläche aktualisiert.
  
function drawSolutions (i) {
  var s1 = (i<2 ? +1 : -1);                                // Vorzeichenfaktor 1. Kreis
  var s2 = (i%2==0 ? +1 : -1);                             // Vorzeichenfaktor 2. Kreis 
  var a = solution(s1,s2);                                 // Array der Lösungskreise
  var vis = cb[i].checked;                                 // Flag für Zeichnen
  if (vis && a[0]) drawCircle(a[0],false,color2);          // Gegebenenfalls 1. Lösungskreis zeichnen
  if (vis && a[1]) drawCircle(a[1],false,color2);          // Gegebenenfalls 2. Lösungskreis zeichnen
  var n = numberCircles(a);                                // Zahl der Lösungen
  lb[i].innerHTML = ""+n;                                  // Lösungszahl in der Schaltfläche aktualisieren
  return n;                                                // Rückgabewert
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  drawCircle(k1,true,color1,nameCircle1);                  // Erster gegebener Kreis
  drawCircle(k2,true,color1,nameCircle2);                  // Zweiter gegebener Kreis
  drawPoint(p,color1,namePoint1);                          // Gegebener Punkt
  var sum = 0;                                             // Variable für Gesamtzahl der Lösungen
  for (var i=0; i<4; i++) sum += drawSolutions(i);         // Lösungskreise der einzelnen Lösungstypen
  getElement("lbn").innerHTML = ""+sum;                    // Ausgabe der Gesamtzahl der Lösungen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

