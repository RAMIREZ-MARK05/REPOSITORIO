// Abstand zweier Punkte auf einer Kugeloberfl�che
// 04.01.2021 - 09.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel distancesphere_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff0000";                                // Farbe f�r Punkte
var colorPole = "#0000ff";                                 // Farbe f�r Nord- und S�dpol

// Sonstige Konstanten:

var FONT = "normal normal bold 14px sans-serif";           // Zeichensatz
var R = 180;                                               // Radius (Pixel)
var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var DIGITS = 1;                                            // Zahl der Nachkommastellen bei Gradangaben
var OMEGA = Math.PI/30;                                    // Winkelgeschwindigkeit (1 Umdrehung pro Minute)
var SOLID = [];                                            // Leeres Array f�r durchgezogene Linien
var DASH = [4,2];                                          // Array f�r gestrichelte Linien

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var x0, y0;                                                // Mittelpunkt (Bildschirmkoordinaten)
var ipR, ipAx, ipAy, ipBx, ipBy;                           // Eingabefelder
var chAx, chAy, chBx, chBy;                                // Auswahlfelder
var op1, op2;                                              // Ausgabefelder
var bu0, bu1, bu2, bu3, bu4;                               // Schaltkn�pfe

var r;                                                     // Radius (km)
var x1, y1;                                                // Geogr. L�nge und Breite von Punkt A (Bogenma�)
var x2, y2;                                                // Geogr. L�nge und Breite von Punkt B (Bogenma�)
var d;                                                     // Abstand (Bogenma�)
var theta;                                                 // Winkel bez�glich x-y-Ebene (Bogenma�)
var phi;                                                   // Winkel bez�glich x-Achse (Bogenma�)
var a1, a2, b1, b2, b3, c1, c2, c3;                        // Koeffizienten f�r Parallelprojektion
var state;                                                 // Bewegungszustand (0 bis 4)
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  } 
  
// Auswahlfeld:
// id ..... ID im HTML-Befehl
// text ... Array von Zeichenketten

function getSelect (id, text) {
  var ch = getElement(id);                                 // Auswahlfeld
  for (var i=0; i<text.length; i++) {                      // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.setAttribute("style","background-color: #ffffff");   // Hintergrundfarbe
    o.innerHTML = text[i];                                 // Text festlegen
    ch.add(o);                                             // Zum Auswahlfeld hinzuf�gen
    }
  ch.selectedIndex = 0;                                    // 1. Eintrag ausgew�hlt
  return ch;                                               // R�ckgabewert
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  getElement("lbR",text01);                                // Erkl�render Text (Radius)
  ipR = getElement("ipR");                                 // Eingabefeld (Radius)
  getElement("uR",kilometer);                              // Einheit (Radius)
  getElement("lbA",text02);                                // Erkl�render Text (Punkt A)
  ipAx = getElement("ipAx");                               // Eingabefeld (L�nge von Punkt A)
  getElement("uAx",degree);                                // Einheit (Grad)
  chAx = getSelect("chAx",text11);                         // Auswahlfeld (�stlich/westlich)
  ipAy = getElement("ipAy");                               // Eingabefeld (Breite von Punkt A)
  getElement("uAy",degree);                                // Einheit (Grad)
  chAy = getSelect("chAy",text12);                         // Auswahlfeld (n�rdlich/s�dlich)
  getElement("lbB",text03);                                // Erkl�render Text (Punkt B)
  ipBx = getElement("ipBx");                               // Eingabefeld (L�nge von Punkt B)
  getElement("uBx",degree);                                // Einheit (Grad)
  chBx = getSelect("chBx",text11);                         // Auswahlfeld (�stlich/westlich)
  ipBy = getElement("ipBy");                               // Eingabefeld (Breite von Punkt B)
  getElement("uBy",degree);                                // Einheit (Grad)
  chBy = getSelect("chBy",text12);                         // Auswahlfeld (n�rdlich/s�dlich)
  getElement("lbD",text04);                                // Erkl�render Text (Abstand)
  op1 = getElement("op1");                                 // Ausgabefeld (Abstand in Grad)
  op2 = getElement("op2");                                 // Ausgabefeld (Abstand in km)
  bu0 = getElement("stop");                                // Schaltknopf (Stopp)
  bu1 = getElement("up");                                  // Schaltknopf (nach oben)
  bu2 = getElement("right");                               // Schaltknopf (nach rechts)
  bu3 = getElement("down");                                // Schaltknopf (nach unten)
  bu4 = getElement("left");                                // Schaltknopf (nach links)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  r = 6371;                                                // Kugelradius (km)
  x0 = width/2; y0 = height/2;                             // Kugelmittelpunkt (Bildschirmkoordinaten)
  x1 = 10*DEG; y1 = 50*DEG;                                // Startposition Punkt A  
  x2 = 80*DEG; y2 = 30*DEG;                                // Startposition Punkt B
  calculation();                                           // Berechnungen
  updateInputOutput();                                     // Ein- und Ausgabefelder aktualisieren 
  focus(ipR);                                              // Fokus f�r erstes Eingabefeld
  theta = 20*DEG; phi = 20*DEG;                            // Startwerte der Winkel f�r die Parallelprojektion
  state = 0;                                               // Zun�chst keine Bewegung  
  t0 = new Date();                                         // Bezugszeitpunkt
  t = 0;                                                   // Startwert f�r Zeitvariable (s)
  setInterval(paint,40);                                   // Timer aktivieren (Intervall 40 ms)  

  ipR.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Radius)
  ipR.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabefeld Radius)
  ipAx.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische L�nge von Punkt A)
  ipAx.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld L�nge A)
  chAx.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische L�nge von Punkt A)
  ipAy.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische Breite von Punkt A)
  ipAy.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld Breite A)
  chAy.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische Breite von Punkt A)
  ipBx.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische L�nge von Punkt B)
  ipBx.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld L�nge B)
  chBx.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische L�nge von Punkt B)
  ipBy.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische Breite von Punkt B)
  ipBy.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld Breite B)
  chBy.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische Breite von Punkt B)
  bu0.onclick = function (e) {state = 0;}                  // Reaktion auf Schaltknopf (Stopp)
  bu1.onclick = function (e) {changeState(1);}             // Reaktion auf Schaltknopf (nach oben)
  bu2.onclick = function (e) {changeState(2);}             // Reaktion auf Schaltknopf (nach rechts)
  bu3.onclick = function (e) {changeState(3);}             // Reaktion auf Schaltknopf (nach unten)
  bu4.onclick = function (e) {changeState(4);}             // Reaktion auf Schaltknopf (nach links)
    
  } // Ende der Methode start
  
// Hilfsroutine: Eingabe, Berechnungen, Ausgabe
// Seiteneffekt r, x1, y1, x2, y2, d, a1, a2, b1, b2, b3, c1, c2, c3, Wirkung auf Ausgabefelder
  
function reaction () {
  var ae = document.activeElement;                         // Aktives Element
  input();                                                 // Eingabe
  calculation();                                           // Berechnungen
  op1.innerHTML = ToString(d/DEG,1)+degree;                // Ausgabe: Abstand in Grad
  op2.innerHTML = ToString(r*d,0)+" "+kilometer;           // Ausgabe: Abstand in km
  if (ae == ipR) focus(ipAx);                              // Fokus f�r das n�chste Eingabefeld
  if (ae == ipAx || ae == chAx) focus(ipAy);               // Fokus f�r das n�chste Eingabefeld
  if (ae == ipAy || ae == chAy) focus(ipBx);               // Fokus f�r das n�chste Eingabefeld
  if (ae == ipBx || ae == chBx) focus(ipBy);               // Fokus f�r das n�chste Eingabefeld
  if (ae == ipBy || ae == chBy) ipBy.blur();               // Fokus abgeben
  }
  
// Fokus f�r Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus f�r Eingabefeld
  var n = ip.value.length;                                 // L�nge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt r, x1, y1, x2, y2, d, a1, a2, b1, b2, b3, c1, c2, c3
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (!enter) return;                                      // Falls keine Enter-Taste, abbrechen
  reaction();                                              // Hilfsroutine aufrufen
  }  

// �nderung des Bewegungszustands:
// s ... Neuer Wert von state (0 bis 4)
// Seiteneffekt state, t0 
  
function changeState (s) {
  if (state != s) state = s;                               // Gew�nschte Bewegungsrichtung
  else state = 0;                                          // Bewegung stoppen (gleicher Schaltknopf wie zuletzt)
  t0 = new Date();                                         // Anfangszeitpunkt aktualisieren
  }
    
//-------------------------------------------------------------------------------------------------

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen

function ToString (n, d) {
  var s = n.toFixed(d);                                    // Zeichenkette mit Dezimalpunkt
  s = s.replace("-","\u2212");                             // Langes Minuszeichen verwenden
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls m�glich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }
  
// Gesamte Eingabe (Eingabe- und Auswahlfelder):
// Seiteneffekt r, x1, y1, x2, y2
  
function input () {
  r = inputNumber(ipR,0,true,1000,1000000);                // Radius
  x1 = inputNumber(ipAx,DIGITS,true,0,180)*DEG;            // Betrag der geografischen L�nge von Punkt A (Bogenma�)
  if (chAx.selectedIndex == 1) x1 = -x1;                   // Minuszeichen, falls westliche L�nge
  y1 = inputNumber(ipAy,DIGITS,true,0,90)*DEG;             // Betrag der geografischen Breite von Punkt A (Bogenma�)
  if (chAy.selectedIndex == 1) y1 = -y1;                   // Minuszeichen, falls s�dliche Breite
  x2 = inputNumber(ipBx,DIGITS,true,0,180)*DEG;            // Betrag der geografischen L�nge von Punkt B (Bogenma�)
  if (chBx.selectedIndex == 1) x2 = -x2;                   // Minuszeichen, falls westliche L�nge
  y2 = inputNumber(ipBy,DIGITS,true,0,90)*DEG;             // Betrag der geografischen Breite von Punkt B (Bogenma�)
  if (chBy.selectedIndex == 1) y2 = -y2;                   // Minuszeichen, falls s�dliche Breite
  }
  
// Umkehrung eines Vektors:
// v ... Gegebener Vektor (Attribute x, y, z)

function negate (v) {
  v.x = -v.x; v.y = -v.y; v.z = -v.z;                      // Koordinaten umkehren
  }
  
// Linearkombination zweier Vektoren:
// c1 ... 1. Koeffizient
// v1 ... 1. Vektor
// c2 ... 2. Koeffizient
// v2 ... 2. Vektor

function linComb (c1, v1, c2, v2) {
  var v = {x: 0, y: 0, z: 0};                              // Neuer Vektor
  v.x = c1*v1.x+c2*v2.x;                                   // x-Koordinate
  v.y = c1*v1.y+c2*v2.y;                                   // y-Koordinate
  v.z = c1*v1.z+c2*v2.z;                                   // z-Koordinate
  return v;                                                // R�ckgabewert
  }
  
// Skalarprodukt zweier Vektoren:
// v1 ... 1. Vektor (Attribute x, y, z)
// v2 ... 2. Vektor (Attribute x, y, z)

function dot (v1, v2) {
  return v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;                    // R�ckgabewert
  }

// Kreuzprodukt zweier Vektoren:
// v1 ... 1. Vektor (Attribute x, y, z)
// v2 ... 2. Vektor (Attribute x, y, z)
  
function cross (v1, v2) {
  var v = {x: 0, y: 0, z: 0};                              // Startwert (Nullvektor)
  v.x = v1.y*v2.z-v1.z*v2.y;                               // x-Koordinate
  v.y = v1.z*v2.x-v1.x*v2.z;                               // y-Koordinate
  v.z = v1.x*v2.y-v1.y*v2.x;                               // z-Koordinate
  return v;                                                // R�ckgabewert
  }
  
// Normierung eines Vektors (gleiche Richtung, Betrag 1):
// v ... Gegebener Vektor (Attribute x, y, z)
// Bemerkung: Nullvektor bleibt unver�ndert
  
function normalize (v) {
  var n = Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);              // Betrag
  if (n == 0) return;                                      // Falls Nullvektor, abbrechen
  v.x /= n; v.y /= n; v.z /= n;                            // Koordinaten durch Betrag dividieren
  }
  
// Parallelprojektion:
// p ... Gegebener Punkt (Attribute x, y, z)
// R�ckgabewert: Verbund mit den Attributen u und v (Bildschirmkoordinaten, Pixel)

function projection (p) {
  var prU = x0+R*(a1*p.x+a2*p.y);                          // Waagrechte Bildschirmkoordinate (Pixel)
  var prV = y0-R*(b1*p.x+b2*p.y+b3*p.z);                   // Senkrechte ildschirmkoordinate (Pixel)
  return {u: prU, v: prV};                                 // R�ckgabewert
  }
  
// Berechnungen:
// Seiteneffekt d, a1, a2, b1, b2, b3, c1, c2, c3

function calculation () {
  var s1 = Math.PI/2-y1;                                   // Seite Nordpol - Punkt A
  var cos1 = Math.cos(s1), sin1 = Math.sin(s1);            // Trigonometrische Werte
  var s2 = Math.PI/2-y2;                                   // Seite Nordpol - Punkt B
  var cos2 = Math.cos(s2), sin2 = Math.sin(s2);            // Trigonometrische Werte
  var w = Math.abs(x2-x1);                                 // Winkel beim Nordpol
  d = Math.acos(cos1*cos2+sin1*sin2*Math.cos(w));          // Abstand (Bogenma�)
  // Ab hier zeitabh�ngig!
  var sin = Math.sin(theta), cos = Math.cos(theta);        // Trigonometrische Werte
  a1 = -Math.sin(phi); a2 = Math.cos(phi);                 // Koeffizienten f�r Rechtswert  
  b1 = -sin*a2; b2 = sin*a1; b3 = cos;                     // Koeffizienten f�r Hochwert         
  c1 = cos*a2; c2 = -cos*a1; c3 = sin;                     // Koeffizienten f�r Projektionsrichtung 
  }
  
// Ortsvektor eines Punkts der Einheitskugel:
// long ... Geografische L�nge (Bogenma�)
// lat .... Geografische Breite (Bogenma�) 
// R�ckgabewert: Verbund mit den Attributen x, y und z
  
function xyz (long, lat) {
  var cosLat = Math.cos(lat), sinLat = Math.sin(lat);      // Trigonometrische Werte
  var v = {};                                              // Neuer Verbund
  v.x = Math.cos(long)*cosLat;                             // x-Koordinate
  v.y = Math.sin(long)*cosLat;                             // y-Koordinate
  v.z = sinLat;                                            // z-Koordinate
  return v;                                                // R�ckgabewert
  }
  
// Orthonormalbasis f�r Gro�kreis (Ortsvektoren der beiden Bezugspunkte):
// n ... Normalenvektor (Attribute x, y und z)
// R�ckgabewert: Array mit zwei Basisvektoren bzw. Bezugspunkten; 
// Der erste Bezugspunkt (mit Index 0) entspricht einem Ber�hrpunkt Gro�kreis/Kugel (links oder rechts).
// Der andere Bezugspunkt (mit Index 1) liegt auf der Vorderseite des Gro�kreises (90� zum ersten Bezugspunkt).
  
function getBase (n) {
  var pr = {x: c1, y: c2, z: c3};                          // Einheitsvektor f�r Projektionsrichtung
  var a = cross(pr,n);                                     // Kreuzprodukt
  normalize(a);                                            // 1. Bezugspunkt (Ber�hrpunkt Gro�kreis/Kugel)
  var b = cross(a,n);                                      // Kreuzprodukt
  normalize(b);                                            // Punkt des Gro�kreises
  if (dot(pr,b) < 0) negate(b);                            // Falls R�ckseite, Vektor b umkehren
  return [a, b];                                           // R�ckgabewert: Array mit den Basisvektoren a und b  
  }
  
// Hilfsroutine f�r Gro�kreis: Projektion eines Punkts in Abh�ngigkeit vom Winkel
// a ... 1. Bezugspunkt (Ber�hrpunkt mit Kugel)
// b ... 2. Bezugspunkt (auf Gro�kreis, 90� zum 1. Bezugspunkt, n�her beim Betrachter)
// w ... Winkel (Bogenma�, 0 f�r 1. Bezugspunkt, pi/2 f�r 2. Bezugspunkt)
// R�ckgabewert: Verbund mit Attributen u und v (Bildschirmkoordinaten, Pixel)
  
function projectionPoint (a, b, w) {
  var cos = Math.cos(w), sin = Math.sin(w);                // Trigonometrische Werte
  var lc = linComb(cos,a,sin,b);                           // Punkt ermitteln (Attribute x, y, z)
  return projection(lc);                                   // R�ckgabewert
  }
  
// Positionswinkel eines Punkts auf dem Gro�kreis:
// p ... Punkt auf Gro�kreis
// a ... 1. Bezugspunkt
// b ... 2. Bezugspunkt
// R�ckgabewert: Positionswinkel (Bogenma�, 0 bis 2 pi); 0 entspricht dem 1. Bezugspunkt, pi/2 dem 2. Bezugspunkt
  
function anglePosition (p, a, b) {
  var cA = dot(p,a), cB = dot(p,b);                        // Koeffizienten
  var phi = Math.atan2(cB,cA);                             // Positionswinkel (Bogenma� -pi bis +pi)
  return (phi >= 0 ? phi : phi+2*Math.PI);                 // R�ckgabewert (Bogenma�)
  }
  
// Aktualisierung der Ein- und Ausgabefelder:

function updateInputOutput () {
  ipR.value = ToString(r,0);                               // Radius 
  ipAx.value = ToString(Math.abs(x1)/DEG,1);               // Geografische L�nge von Punkt A
  chAx.selectedIndex = (x1>=0 ? 0 : 1);                    // Auswahlfeld �stlich/westlich f�r Punkt A
  ipAy.value = ToString(Math.abs(y1)/DEG,1);               // Geografische Breite von Punkt A
  chAy.selectedIndex = (y1>=0 ? 0 : 1);                    // Auswahlfeld n�rdlich/s�dlich f�r Punkt A
  ipBx.value = ToString(Math.abs(x2)/DEG,1);               // Geografische L�nge von Punkt B
  chBx.selectedIndex = (x2>=0 ? 0 : 1);                    // Auswahlfeld �stlich/westlich f�r Punkt B
  ipBy.value = ToString(Math.abs(y2)/DEG,1);               // Geografische Breite von Punkt B
  chBy.selectedIndex = (y2>=0 ? 0 : 1);                    // Auswahlfeld n�rdlich/s�dlich f�r Punkt B
  op1.innerHTML = ToString(d/DEG,DIGITS)+degree;           // Ausgabefeld f�r Abstand im Gradma�
  op2.innerHTML = ToString(r*d,0)+" "+kilometer;           // Ausgabefeld f�r Abstand in km
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)
// d ... Array f�r Linienart (optional, SOLID oder DASH, Defaultwert SOLID)

function newPath(c, w, d) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = (w?w:1);                                 // Liniendicke
  ctx.setLineDash(d?d:SOLID);                              // Linienart
  }
  
// Punkt markieren (auf der Vorderseite ausgef�llter Kreis, auf der R�ckseite Kreisrand):
// (u,v) ... Bildschirmkoordinaten (Pixel)
// c ....... Farbe
// f ....... Flag f�r Vorderseite

function point (u, v, c, f) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(u,v,2.5,0,2*Math.PI,true);                       // Kreis mit Radius 2.5 vorbereiten
  ctx.fillStyle = (f ? c : colorBackground);               // F�llfarbe
  if (f) ctx.fill();                                       // Falls Vorderseite, ausgef�llter Kreis
  ctx.stroke();                                            // Kreisrand
  }

// Punkt mit gegebenen geogrfischen Koordinaten markieren:
// long ... Geografische L�nge (Bogenma�, -pi bis +pi)
// lat .... Geografische Breite (Bogenma�, -pi/2 bis +pi/2)
  
function pointLongLat (long, lat, c) {
  var p = xyz(long,lat);                                   // Punkt auf der Einheitskugel (Attribute x, y, z)
  var f = (c1*p.x+c2*p.y+c3*p.z > 0);                      // Flag f�r Vorderseite
  var u = x0+R*(a1*p.x+a2*p.y);                            // Waagrechte Bildschirmkoordinate (Pixel)
  var v = y0-R*(b1*p.x+b2*p.y+b3*p.z);                     // Senkrechte Bildschirmkoordinate (Pixel)
  point(u,v,c,f);                                          // Punkt markieren
  }
  
// Kreisrand (schwarz, Liniendicke 1):
// (u,v) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)

function circle (u, v, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(u,v,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreisrand zeichnen
  }
  
// Kugelachse (gestrichelt):
  
function axis () {
  newPath("#000000",1,DASH);                               // Neuer Grafikpfad
  ctx.moveTo(x0,y0+R*b3);                                  // S�dpol als Anfangspunkt
  ctx.lineTo(x0,y0-R*b3);                                  // Linie zum Nordpol
  ctx.stroke();                                            // Achse zeichnen
  }
  
// Vorder- oder R�ckseite eines Gro�kreises:
// a ... 1. Bezugspunkt (Ber�hrpunkt mit Kugel)
// b ... 2. Bezugspunkt (auf Gro�kreis, 90� zum 1. Bezugspunkt, n�her beim Betrachter)
// c ... Linienfarbe
// f ... Flag f�r Vorderseite (n�her beim Betrachter)
  
function partGreatCircle (a, b, c, f) {
  var iMin = (f?0:180), iMax = (f?180:360);                // Minimaler und maximaler Index
  newPath(c,1,f?SOLID:DASH);                               // Neuer Grafikpfad f�r Polygonzug
  var p = projectionPoint(a,b,iMin*DEG);                   // Anfangspunkt ermitteln (Attribute u und v)
  ctx.moveTo(p.u,p.v);                                     // Anfangspunkt f�r Grafikpfad
  for (var i=iMin+1; i<=iMax; i++) {                       // F�r alle Indizes ...
    p = projectionPoint(a,b,i*DEG);                        // Punkt auf Gro�kreis (Attribute u und v)
    ctx.lineTo(p.u,p.v);                                   // Linie zum Polygonzug hinzuf�gen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Gro�kreis:
// n .... Normaleneinheitsvektor (Attribute x, y, z)
// c .... Linienfarbe Vorderseite
// bs ... Flag f�r Sichtbarkeit der R�ckseite (optional, Defaultwert false)
  
function greatCircle (n, c, bs) {
  var onb = getBase(n);                                    // Orthonormalbasis (Bezugspunkte)
  partGreatCircle(onb[0],onb[1],c,true);                   // Vorderseite durchgezogen
  if (bs) partGreatCircle(onb[0],onb[1],c,false);          // Falls gew�nscht, R�ckseite gestrichelt
  }
    
// Einheitlicher Abschnitt eines Gro�kreisbogens (nur Vorderseite oder nur R�ckseite):
// a .... 1. Bezugspunkt (Ber�hrpunkt Gro�kreis/Kugel)
// b .... 2. Bezugspunkt (90� zum 1. Bezugspunkt)
// w0 ... Startwinkel (Bogenma�, 0 bis 2 pi)
// w .... Winkelgr��e (Bogenma�, 0 bis pi)
// c .... Farbe
// f .... Flag f�r Vorderseite
  
function partSegment (a, b, w0, w, c, f) {
  newPath(c,1,f?SOLID:DASH);                               // Neuer Grafikpfad f�r Polygonzug
  var p = projectionPoint(a,b,w0);                         // Projektion Anfangspunkt
  ctx.moveTo(p.u,p.v);                                     // Anfangspunkt Polygonzug 
  var dw = w/100;                                          // Schrittweite (Bogenma�)
  for (var i=1; i<=100; i++) {                             // F�r alle Indizes ...
    var wp = w0+i*dw;                                      // Aktueller Positionswinkel (Bogenma�)
    p = projectionPoint(a,b,wp);                           // Projektion des aktuellen Punkts
    ctx.lineTo(p.u,p.v);                                   // Linie zum Polygonzug hinzuf�gen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Gro�kreisbogen:
// p1, p2 ... Endpunkte (Attribute x, y, z)
// c ........ Linienfarbe

function segment (p1, p2, c) {
  if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z)        // Falls Punkte gleich ...
    return;                                                // Abbrechen
  var n = cross(p1,p2);                                    // Normalenvektor der Gro�kreisebene
  if (dot(n,n) < 1e-8) {                                   // Falls Normalenvektor gleich Nullvektor ...
    n = {x: p1.y, y: -p1.x, z: 0};                         // Normalenvektor f�r Gro�kreis durch Pole
    if (dot(n,n) < 1e-8) n = {x: 0, y: 1, z: 0};           // Falls Nord- und S�dpol gegeben, Normalenvektor f�r Nullmeridian
    }
  var onb = getBase(n);                                    // Orthonormalbasis
  var a = onb[0], b = onb[1];                              // Bezugspunkte
  var w1 = anglePosition(p1,a,b);                          // Positionswinkel 1. Endpunkt (Bogenma�, 0 bis 2 pi)
  var w2 = anglePosition(p2,a,b);                          // Positionswinkel 2. Endpunkt (Bogenma�, 0 bis 2 pi)
  var min = Math.min(w1,w2), max = Math.max(w1,w2);        // Kleinerer und gr��erer der beiden Positionswinkel
  var w = max-min;                                         // Differenz der beiden Positionswinkel (0 bis 2 pi)
  var w0 = (w <= Math.PI ? min : max);                     // Startwinkel (Bogenma�, 0 bis 2 pi)
  if (w > Math.PI) w = 2*Math.PI-w;                        // Endg�ltige Winkelgr��e (Bogenma�, 0 bis pi)
  if (w0 < Math.PI) {                                      // Falls Anfang des Kreisbogens auf der Vorderseite ...
    partSegment(a,b,w0,Math.min(w,Math.PI-w0),c,true);     // Abschnitt auf der Vorderseite (durchgezogen)
    if (w0+w > Math.PI)                                    // Falls Kreisbogen auch auf der R�ckseite ... 
      partSegment(a,b,Math.PI,w0+w-Math.PI,c,false);       // Abschnitt auf der R�ckseite (gestrichelt)
    }
  else {                                                   // Falls Anfang des Kreisbogens auf der R�ckseite ...
    partSegment(a,b,w0,Math.min(w,2*Math.PI-w0),c,false);  // Abschnitt auf der R�ckseite (gestrichelt)
    if (w0+w > 2*Math.PI)                                  // Falls Ende des Kreisbogens auf der Vorderseite ... 
      partSegment(a,b,0,w0+w-2*Math.PI,c,true);            // Abschnitt auf der Vorderseite (durchgezogen)  
    }
  }
  
// Meridian (kompletter Gro�kreis, R�ckseite unsichtbar):
// long ... Geografische L�nge (Bogenma�)

function meridian (long) {
  var n = {x: -Math.sin(long), y: Math.cos(long), z: 0};   // Normalenvektor
  greatCircle(n,"#000000",false);                          // Gro�kreis (R�ckseite unsichtbar)
  }
   
// Ellipsenbogen zeichnen (f�r Breitenkreise):
// (x,y) ... Mittelpunkt (Pixel)
// a ....... Waagrechte Halbachse (Pixel)
// b ....... Senkrechte Halbachse (Pixel)
// t0 ...... Kleinster Parameterwert
// t1 ...... Gr��ter Parameterwert
// Die Parameterwerte beziehen sich auf x = xM + a cos(t) und y = yM + b sin(t).
   
function ellipticalArc (x, y, a, b, t0, t1, c) {
  if (a <= 0 || b <= 0) return;                            // Falls Halbachse(n) nicht positiv, abbrechen  
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(x,y);                                      // Ellipsenmittelpunkt als Ursprung des Koordinatensystems 
  ctx.scale(a,b);                                          // Skalierung in x- und y-Richtung
  ctx.arc(0,0,1,t0,t1,false);                              // Kreisbogen (wird durch Skalierung zu Ellipsenbogen)
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen
  ctx.stroke();                                            // Ellipsenbogen zeichnen
  } 
  
// Breitenkreis (R�ckseite unsichtbar):
// lat ... Geografische Breite (Bogenma�, -pi/2 bis +pi/2)

function circleLatitude (lat) {
  var vM = y0-R*Math.cos(theta)*Math.sin(lat);             // Senkrechte Bildschirmkoordinate des Mittelpunkts
  var a = R*Math.cos(lat);                                 // Waagrechte Halbachse
  var b = a*Math.sin(Math.abs(theta));                     // Senkrechte Halbachse
  var sinW = Math.tan(lat)*Math.tan(theta);                // Zwischenergebnis (Sinuswert)
  if (sinW >= 1)                                           // Falls Breitenkreis vollst�ndig sichtbar ...
    ellipticalArc(x0,vM,a,b,0,2*Math.PI);                  // Ellipse
  else if (sinW >= -1) {                                   // Falls Breitenkreis teilweise sichtbar ..
    var w = Math.asin(sinW);                               // Winkel f�r Ber�hrpunkt Breitenkreis/Kugel (Bogenma�)
    if (theta >= 0)                                        // Falls Betrachtung von "oben" ...
      ellipticalArc(x0,vM,a,b,-w,Math.PI+w);               // Ellipsenbogen
    else ellipticalArc(x0,vM,a,b,Math.PI-w,2*Math.PI+w);   // Ellipsenbogen bei Betrachtung von "unten"
    }
  }
   
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  if (state != 0) {                                        // Falls Animation eingeschaltet ...
    var dt = (new Date()-t0)/1000;                         // Zeit seit Bezugspunkt (s) 
    t0 = new Date();                                       // Neuer Bezugszeitpunkt                       
    t += dt;                                               // Zeitvariable (s) aktualisieren
    var angle = OMEGA*dt;                                  // Drehwinkel (Bogenma�)    
    if (state == 1) theta += angle;                        // Drehung nach oben
    else if (state == 2) phi += angle;                     // Drehung nach rechts
    else if (state == 3) theta -= angle;                   // Drehung nach unten
    else if (state == 4) phi -= angle;                     // Drehung nach links
    if (theta > Math.PI/2) {                               // Falls Nordpol erreicht ...
      theta = Math.PI/2; state = 0;                        // Drehung beenden
      }
    if (theta < -Math.PI/2) {                              // Falls S�dpol erreicht ...
      theta = -Math.PI/2; state = 0;                       // Drehung beenden
      }
    } 
  calculation();                                           // Berechnungen
  circle(x0,y0,R,"#000000");                               // Kugel
  var n = {x: 0, y: 0, z: 1};                              // Normaleneinheitsvektor f�r �quator
  greatCircle(n,"#000000",true);                           // �quator
  axis();                                                  // Kugelachse
  for (var i=0; i<180; i+=30) meridian(i*DEG);             // Meridiane (Abstand 30�)
  for (i=-60; i<=60; i+=30) {                              // F�r alle Indizes (Abstand 30�) ...
    if (i == 0) continue;                                  // �quator auslassen
    circleLatitude(i*DEG);                                 // Breitenkreis
    }
  var p1 = xyz(x1,y1), p2 = xyz(x2,y2);                    // Ortsvektoren der gegebenen Punkte
  segment(p1,p2,"#ff0000",true);                           // Gro�kreisbogen (Abstand)
  point(x0,y0,"#000000",false);                            // Kugelmittelpunkt
  pointLongLat(0,90*DEG,colorPole);                        // Nordpol
  pointLongLat(0,-90*DEG,colorPole);                       // S�dpol
  pointLongLat(x1,y1,colorPoint);                          // Punkt A
  pointLongLat(x2,y2,colorPoint);                          // Punkt B
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = colorPole;                               // Schriftfarbe
  if (theta >= 0) ctx.fillText(symbolN,x0+8,y0+5-R*b3);    // Beschriftung Nordpol
  if (theta <= 0) ctx.fillText(symbolS,x0+8,y0+5+R*b3);    // Beschriftung S�dpol
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen



