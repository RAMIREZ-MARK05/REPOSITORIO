// Elliptische Kurve (Addition)
// 15.11.2020 - 19.11.2020

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel ellipticcurve_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorCurve = "#ff00ff";                                // Farbe f�r Kurve
var colorGiven = "#0000ff";                                // Farbe f�r gegebene Punkte
var colorAux = "#c0c0c0";                                  // Farbe f�r Hilfslinien und Hilfspunkt
var colorResult = "#ff0000";                               // Farbe f�r Ergebnispunkt

// Weitere Konstanten:

var FONT1 = "normal normal bold 12px sans-serif";          // Kleinerer Zeichensatz
var FONT2 = "normal normal bold 16px sans-serif";          // Gr��erer Zeichensatz
var PIX = 50;                                              // Pixel pro L�ngeneinheit
var EPS = 1e-5;                                            // Toleranz

// Attribute:

var ra1, ra2;                                              // Schieberegler
var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var x0, y0;                                                // Ursprung (Pixel)
var a, b;                                                  // Koeffizienten von y^2 = x^3 + a x + b
var zeros;                                                 // Array der Nullstellen
var p1, p2, p3, p;                                         // Punkte (mit Attributen u und v)
var nr;                                                    // Nummer des aktuellen Punkts oder 0

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
  x0 = width/2; y0 = height/2;                             // Bildschirmkoordinaten Ursprung
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb1",text01);                                // Erkl�render Text (Koeffizient a)
  ra1 = getElement("ra1");                                 // Schieberegler (Koeffizient a)
  getElement("lb2",text02);                                // Erkl�render Text (Koeffizient b)
  ra2 = getElement("ra2");                                 // Schieberegler (Koeffizient b)   
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  a = -1.0; b = 0.5;                                       // Startwerte der Koeffizienten
  ra1.value = Math.round(100+a*50);                        // Schieberegler f�r a anpassen
  ra2.value = Math.round(100+b*50);                        // Schieberegler f�r b anpassen
  calculation();                                           // Berechnungen
  nr = 0;                                                  // Zun�chst kein Punkt ausgew�hlt
  paint();                                                 // Neu zeichnen
  
  ra1.onchange = reactionSlider;                           // Reaktion auf Schieberegler f�r a
  ra1.oninput = reactionSlider;                            // Reaktion auf Schieberegler f�r a
  ra2.onchange = reactionSlider;                           // Reaktion auf Schieberegler f�r b
  ra2.oninput = reactionSlider;                            // Reaktion auf Schieberegler f�r b
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers   
    
  } // Ende der Methode start
  
// Reaktion auf Schieberegler:
  
function reactionSlider () {
  a = (ra1.value-100)/50;                                  // Koeffizient a
  b = (ra2.value-100)/50;                                  // Koeffizient b
  p1 = p2 = undefined;                                     // Gegebene Punkte undefiniert
  calculation();                                           // Berechnungen
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
  nr = 0;                                                  // Kein Punkt ausgew�hlt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr = 0;                                                  // Kein Punkt ausgew�hlt, Zugmodus deaktiviert
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
// p ....... Gegebener Punkt (mit Attributen u und v)
  
function distance (u, v, p) {
  var dx = u-p.u, dy = v-p.v;                              // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel) 
  var n = 1;                                               // Startwert f�r Nummer des Punkts
  var d = distance(u,v,p1);                                // Abstand von Punkt p1
  var dMin = d;                                            // Startwert f�r minimalen Abstand
  d = distance(u,v,p2);                                    // Abstand von Punkt p2
  if (d < dMin) {dMin = d; n = 2;}                         // Falls n�her als bisher, aktualisieren
  nr = (dMin<20 ? n : 0);                                  // Nummer des Punkts oder 0
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (nr == 0) return;                                     // Falls kein Punkt ausgew�hlt, abbrechen
  var p = nearestPoint(u,v);                               // N�chstgelegener Kurvenpunkt
  if (distance(u,v,p) > 20) return;                        // Falls zu gro�er Abstand von der Kurve, abbrechen
  if (nr == 1) p1 = p; else p2 = p;                        // Punkt p1 oder Punkt p2 verschieben
  calculation();                                           // Berechnungen
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------
  
// Senkrechte Bildschirmkoordinate eines Kurvenpunkts:
// u ..... Waagrechte Bildschirmkoordinate
// sgn ... Vorzeichenfaktor (+1 f�r oben, -1 f�r unten, 0 f�r x-Achse)
  
function getV (u, sgn) {
  var x = (u-x0)/PIX;                                      // x-Koordinate mathematisch
  var y2 = (x*x+a)*x+b;                                    // Wert von x^3 + a x + b
  if (y2 < 0) return undefined;                            // R�ckgabewert, falls Wurzel undefiniert
  return y0-sgn*PIX*Math.sqrt(y2);                         // R�ckgabewert im Normalfall
  }
  
// N�chstgelegener Punkt einer Strecke:
// (u,v) ..... Gegebene Position (Bildschirmkoordinaten)
// (u0,v0) ... Anfangspunkt der Strecke (Bildschirmkoordinaten)
// (u1,v1) ... Endpunkt der Strecke (Bildschirmkoordinaten)
// R�ckgabewert: Verbund mit den Attributen u und v
  
function nearestPointSegment (u, v, u0, v0, u1, v1) {
  var ux = u1-u0, uy = v1-v0;                              // Richtungsvektor (Pixel)
  var vx = u-u0, vy = v-v0;                                // Verbindungsvektor (Pixel)
  var uu = ux*ux+uy*uy;                                    // Nenner f�r Quotient
  var p = (uu!=0 ? (vx*ux+vy*uy)/uu : 0);                  // Parameterwert f�r Punkt auf Teilstrecke
  if (p > 1) p = 1;                                        // Parameterwert nicht gr��er als 1
  if (p < 0) p = 0;                                        // Parameterwert nicht kleiner als 0 
  return {u: u0+p*ux, v: v0+p*uy};                         // R�ckgabewert
  }
  
// N�chstgelegener Punkt eines Teils der elliptischen Kurve:
// (u,v) ... Gegebene Position (Bildschirmkoordinaten)
// uMin .... Minimum der waagrechten Bildschirmkoordinate (Nullstelle)
// uMax .... Maximum der waagrechten Bildschirmkoordinate (Nullstelle oder width)
// d0 ...... Vorgabe f�r minimalen Abstand
// R�ckgabewert: Verbund mit den Attributen u und v
  
function nearestPointPart (u, v, uMin, uMax, d0) {
  var sgn = (v<=y0 ? 1 : -1);                              // Vorzeichenfaktor
  var dMin = d0;                                           // Startwert Abstandsminimum
  var u0 = uMin, v0 = y0;                                  // Startposition links
  var u1 = Math.ceil(u0), v1 = getV(u1,sgn);               // Position nach der ersten Teilstrecke
  var p = nearestPointSegment(u,v,u0,v0,u1,v1);            // N�chstgelegener Punkt auf Teilstrecke
  var d = distance(u,v,p);                                 // Abstand von diesem Punkt
  if (d < dMin) {pMin = p; dMin = d;}                      // Falls n�her als bisher, aktualisieren
  while (u1 < uMax) {                                      // Solange rechter Rand nicht erreicht ...
    u0 = u1; v0 = v1;                                      // Streckenendpunkt wird Anfangspunkt
    u1 = u0+1; v1 = getV(u1,sgn);                          // Neuer Streckenendpunkt
    p = nearestPointSegment(u,v,u0,v0,u1,v1);              // N�chstgelegener Punkt auf Teilstrecke
    d = distance(u,v,p);                                   // Abstand von diesem Punkt
    if (d < dMin) {pMin = p; dMin = d;}                    // Falls n�her als bisher, aktualisieren
    }
  u0 = u1; v0 = v1;                                        // Streckenendpunkt wird Anfangspunkt
  u1 = uMax; v1 = (uMax<width ? 0 : width);                // Neuer Streckenendpunkt
  p = nearestPointSegment(u,v,u0,v0,u1,v1);                // N�chstgelegener Punkt auf Teilstrecke
  d = distance(u,v,p);                                     // Abstand von diesem Punkt
  if (d < dMin) pMin = p;                                  // Falls n�her als bisher, aktualisieren
  return pMin;                                             // R�ckgabewert
  }
  
// N�chstgelegener Punkt der gesamten elliptischen Kurve:
// (u,v) ... Gegebene Position
// R�ckgabewert: Verbund mit den Attributen u und v
  
function nearestPoint (u, v) {
  var u0 = x0+PIX*zeros[0];                                // Bildschirmkoordinate f�r linke oder einzige Nullstelle
  if (zeros.length == 1)                                   // Falls nur eine Nullstelle ...
    return nearestPointPart(u,v,u0,width,1000);            // R�ckgabewert
  else {                                                   // Falls zwei oder drei Nullstellen ...
    var u1 = x0+PIX*zeros[1], u2 = x0+PIX*zeros[2];        // Bildschirmkoordinaten der weiteren Nullstellen
    var p1 = nearestPointPart(u,v,u0,u1,1000);             // N�chstgelegener Punkt im linken Teil der Kurve
    var d1 = distance(u,v,p1);                             // Abstand von diesem Punkt
    var p2 = nearestPointPart(u,v,u2,width,d1);            // N�chstgelegener Punkt im rechten Teil der Kurve
    var d2 = distance(u,v,p2);                             // Abstand von diesem Punkt
    return (d1<d2 ? p1 : p2);                              // R�ckgabewert  
    }
  }
  
// Berechnung einer Nullstelle durch Intervallschachtelung:
// xL ... Untere Intervallgrenze
// xR ... Obere Intervallgrenze

function getZero (xL, xR) {
  if (xR < xL) {var h = xL; xL = xR; xR = h;}              // Falls n�tig, Intervallgrenzen vertauschen            
  var yL = (xL*xL+a)*xL+b;                                 // y-Wert f�r untere Intervallgrenze
  var yR = (xR*xR+a)*xR+b;                                 // y-Wert f�r obere Intervallgrenze
  if (yL*yR > 0) return undefined;                         // Falls gleiches Vorzeichen, R�ckgabewert undefiniert
  while (xR-xL > 1e-10) {                                  // Solange Genauigkeit nicht ausreichend ...
    var xM = (xL+xR)/2;                                    // Mitte des Intervalls (x-Wert)
    var yM = (xM*xM+a)*xM+b;                               // Zugeh�riger y-Wert
    if (yL*yM < 0) {xR = xM; yR = yM;}                     // Entweder weiter mit linker Intervallh�lfte ...
    else {xL = xM; yL = yM;}                               // ... oder mit rechter Intervallh�lfte
    }
  return xM;                                               // R�ckgabewert
  }
  
// Berechnungen:
// Seiteneffekt zeros, p1, p2, p3, p

function calculation () {
  zeros = [];                                              // Leeres Array f�r Nullstellen
  var d = -4*a*a*a-27*b*b;                                 // Diskriminante
  var xE = Math.sqrt(-a/3);                                // x-Koordinate Tiefpunkt
  if (d < 0) {                                             // Falls nur eine Nullstelle ...
    if (b > 0) zeros[0] = getZero(-10,0);                  // Nullstelle, falls b > 0
    else if (b < 0) zeros[0] = getZero(0,10);              // Nullstelle, falls b > 0
    else zeros[0] = 0;                                     // Nullstelle, falls b = 0
    }
  else {                                                   // Falls zwei oder drei Nullstellen ...
    zeros[0] = getZero(-10,-xE);                           // Linke Nullstelle
    zeros[2] = getZero(xE,10);                             // Rechte Nullstelle
    if (b > 0) zeros[1] = getZero(0,xE);                   // Mittlere Nullstelle, falls b > 0
    else if (b < 0) zeros[1] = getZero(-xE,0);             // Mittlere Nullstelle, falls b < 0
    else zeros[1] = 0;                                     // Mittlere Nullstelle, falls b = 0
    }  
  if (p1 == undefined) p1 = nearestPoint(0,y0);            // Erster gegebener Punkt (Bildschirmkoordinaten)
  if (p2 == undefined) p2 = nearestPoint(x0,0);            // Zweiter gegebener Punkt (Bildschirmkoordinaten)
  if (p3 == undefined) p3 = {};                            // Hilfspunkt
  if (p == undefined) p = {};                              // Ergebnispunkt
  var x1 = (p1.u-x0)/PIX, y1 = (y0-p1.v)/PIX;              // Erster gegebener Punkt (mathematische Koordinaten)
  var x2 = (p2.u-x0)/PIX, y2 = (y0-p2.v)/PIX;              // Zweiter gegebener Punkt (mathematische Koordinaten)
  var m = (y2-y1)/(x2-x1);                                 // Sekantensteigung (eventuell Division durch 0)
  if (x1 == x2 && y1 == y2)                                // Falls gleiche Punkte (Tangente) ...
    m = (y1!=0 ? (3*x1*x1+a)/(2*y1) : Infinity);           // Tangentensteigung          
  var x = m*m-x1-x2, y = y1+m*(x-x1);                      // Hilfspunkt (mathematische Koordinaten)
  if (!isFinite(m)) {x = 0; y = Infinity;}                 // Korrektur, falls unendliche Steigung
  p3.u = x0+PIX*x; p3.v = y0-PIX*y;                        // Hilfspunkt (Bildschirmkoordinaten)
  p.u = p3.u; p.v = y0+PIX*y;                              // Ergebnispunkt
  }

//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath(c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Verbindungsstrecke:
// p1, p2 ... Endpunkte (mit Attributen u und v)
// c ........ Linienfarbe

function segment (p1, p2, c) {
  newPath(c);                                              // Neuer Grafikpfad                                   
  ctx.moveTo(p1.u,p1.v);                                   // Anfangspunkt
  ctx.lineTo(p2.u,p2.v);                                   // Linie zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Kurvensekante oder -tangente (jeweils Gerade):
// p1, p2 ... Gegebene Kurvenpunkte (mit Attributen u und v)
// c ........ Linienfarbe

function line (p1, p2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  var du = p2.u-p1.u, dv = p2.v-p1.v;                      // Richtungsvektor  
  if (du*du+dv*dv < EPS) {                                 // Falls gleiche Punkte (Kurventangente) ...
    var x = (p1.u-x0)/PIX, y = (y0-p1.v)/PIX;              // Mathematische Koordinaten des Ber�hrpunkts
    if (y == 0) {du = 0; dv = 1000;}                       // Entweder senkrechte Tangente ...
    else {                                                 // ... oder ...
      var m = (3*x*x+a)/(2*y);                             // Steigung
      du = 1000; dv = -m*du;                               // Richtungsvektor
      }
    }  
  var f = 1000/Math.sqrt(du*du+dv*dv);                     // Faktor
  ctx.moveTo(p1.u-f*du,p1.v-f*dv);                         // Anfangspunkt (au�erhalb des Bildes)
  ctx.lineTo(p2.u+f*du,p2.v+f*dv);                         // Linie zum Endpunkt (au�erhalb des Bildes)
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // L�nge
  if (length == 0) return;                                 // Abbruch, falls L�nge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // L�nge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt f�r Pfeilspitze         
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
  ctx.beginPath();                                         // Neuer Pfad f�r Pfeilspitze
  ctx.lineWidth = 1;                                       // Liniendicke zur�cksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Punktmarkierung:
// p ... Gegebener Punkt (mit Attributen u und v)
// c ... F�llfarbe
// n ... Name (optional)
  
function point (p, c, n) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.u,p.v,2.5,0,2*Math.PI,true);                   // Kreis vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit schwarzem Rand
  if (!n) return;                                          // Falls Name undefiniert, abbrechen
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillText(n,p.u+5,p.v+5);                             // Name
  }
  
// Tick auf der x-Achse:
// x ... x-Koordinate (mathematisch)
  
function tickX (x) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var u = x0+PIX*x;                                        // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.moveTo(u,y0-3);                                      // Anfangspunkt (oberhalb der x-Achse)
  ctx.lineTo(u,y0+3);                                      // Linie zum Endpunkt (unterhalb der x-Achse)
  ctx.stroke();                                            // Tick zeichnen
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText(""+x,u,y0+15);                              // Beschriftung 
  }
  
// Tick auf der y-Achse:
// y ... y-Koordinate (mathematisch)

function tickY (y) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var v = y0-PIX*y;                                        // Senkrechte Bildschirmkoordinate (Pixel)
  ctx.moveTo(x0-3,v);                                      // Anfangspunkt (links der y-Achse)
  ctx.lineTo(x0+3,v);                                      // Linie zum Endpunkt (rechts der y-Achse)
  ctx.stroke();                                            // Tick zeichnen
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillText(""+y,x0-6,v+4);                             // Beschriftung
  }
  
// Koordinatensystem:

function axes () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  arrow(0,y0,width,y0,1);                                  // Pfeil f�r x-Achse
  for (var x=-3; x<=3; x++)                                // F�r alle x-Werte ...
    if (x != 0) tickX(x);                                  // Falls x ungleich 0, Tick mit Beschriftung
  ctx.fillText(symbolX,width-8,y0+15);                     // Beschriftung der x-Achse
  arrow(x0,height,x0,0,1);                                 // Pfeil f�r y-Achse
  for (var y=-3; y<=3; y++)                                // F�r alle y-Werte ...
    if (y != 0) tickY(y);                                  // Falls y ungleich 0, Tick mit Beschriftung
  ctx.fillText(symbolY,x0-8,10);                           // Beschriftung der y-Achse
  }
  
// Zusammenh�ngender Abschnitt einer H�lfte der elliptischen Kurve:
// sgn .... Vorzeichenfaktor (1 f�r oben oder -1 f�r unten)
// uMin ... Bildschirmkoordinate f�r linke Grenze (Nullstelle)
// uMax ... Bildschirmkoordinate f�r rechte Grenze (Nullstelle oder Bildrand)

function partCurve (sgn, uMin, uMax) {
  var bounded = (uMax < width);                            // Flag f�r beschr�nkten Kurvenabschnitt
  newPath(colorCurve);                                     // Neuer Grafikpfad f�r Polygonzug
  ctx.moveTo(uMin,y0);                                     // Anfangspunkt (auf der x-Achse)
  for (var u=Math.ceil(uMin); u<=Math.floor(uMax); u++)    // F�r alle Werte der waagrechten Bildschirmkoordinate ... 
    ctx.lineTo(u,getV(u,sgn));                             // Linie zum Polygonzug hinzuf�gen
  ctx.lineTo(uMax,bounded?y0:getV(uMax,sgn));              // Line zum Endpunkt (auf der x-Achse oder am rechten Bildrand)
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// H�lfte der elliptischen Kurve:
// sgn ... Vorzeichenfaktor (1 f�r oben oder -1 f�r unten)

function curve (sgn) {
  var u0 = x0+PIX*zeros[0];                                // Bildschirmkoordinate f�r linke bzw. einzige Nullstelle
  if (zeros.length == 1) partCurve(sgn,u0,width);          // Falls nur eine Nullstelle, komplette Kurvenh�lfte zeichnen
  else {                                                   // Falls zwei oder drei Nullstellen ...
    var u1 = x0+PIX*zeros[1], u2 = x0+PIX*zeros[2];        // Bildschirmkoordinaten f�r weitere Nullstellen        
    partCurve(sgn,u0,u1);                                  // Linker Teil (beschr�nkt)
    partCurve(sgn,u2,width);                               // Rechter Teil (unbeschr�nkt)
    }
  }
  
// Zeichenkette f�r Absolutbetrag mit 2 Nachkommastellen:
// x ... Gegebene Zahl
  
function stringAbs (x) {
  var s = ""+Math.abs(x).toFixed(2);                       // Zeichenkette
  return s.replace(".",decimalSeparator);                  // R�ckgabewert (eventuell Komma statt Punkt)
  }
  
// Gleichung der elliptischen Kurve:
  
function equation () {
  var s = "y\u00B2 = x\u00B3";                             // Anfang der Zeichenkette
  if (a > 0) s += " + ";                                   // Pluszeichen vor linearem Summanden
  if (a < 0) s += " - ";                                   // Minuszeichen vor linearem Summanden
  if (a != 0) s += stringAbs(a)+" x";                      // Summand zur Zeichenkette hinzuf�gen
  if (b > 0) s += " + ";                                   // Pluszeichen vor konstantem Summanden
  if (b < 0) s += " - ";                                   // Minuszeichen vor konstantem Summanden
  if (b != 0) s += stringAbs(b);                           // Summand zur Zeichenkette hinzuf�gen
  ctx.font = FONT2;                                        // Zeichensatz (gro�)
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(s,20,30);                                   // Gleichung ausgeben
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT1;                                        // Kleinerer Zeichensatz
  axes();                                                  // Koordinatensystem
  curve(1);                                                // Elliptische Kurve, oberer Teil
  curve(-1);                                               // Elliptische Kurve, unterer Teil
  line(p1,p2,colorAux);                                    // Gerade durch gegebene Punkte und Hilfspunkt
  segment(p3,p,colorAux);                                  // Strecke f�r Achsenspiegelung
  point(p1,colorGiven,symbolSummand1);                     // Erster gegebener Punkt
  point(p2,colorGiven,symbolSummand2);                     // Zweiter gegebener Punkt
  point(p3,colorAux);                                      // Hilfspunkt
  point(p,colorResult,symbolSum);                          // Ergebnispunkt
  equation();                                              // Gleichung (gr��erer Zeichensatz)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

