// Abstand zweier Punkte auf einer Kugeloberfläche
// 04.01.2021 - 09.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel distancesphere_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff0000";                                // Farbe für Punkte
var colorPole = "#0000ff";                                 // Farbe für Nord- und Südpol

// Sonstige Konstanten:

var FONT = "normal normal bold 14px sans-serif";           // Zeichensatz
var R = 180;                                               // Radius (Pixel)
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var DIGITS = 1;                                            // Zahl der Nachkommastellen bei Gradangaben
var OMEGA = Math.PI/30;                                    // Winkelgeschwindigkeit (1 Umdrehung pro Minute)
var SOLID = [];                                            // Leeres Array für durchgezogene Linien
var DASH = [4,2];                                          // Array für gestrichelte Linien

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var x0, y0;                                                // Mittelpunkt (Bildschirmkoordinaten)
var ipR, ipAx, ipAy, ipBx, ipBy;                           // Eingabefelder
var chAx, chAy, chBx, chBy;                                // Auswahlfelder
var op1, op2;                                              // Ausgabefelder
var bu0, bu1, bu2, bu3, bu4;                               // Schaltknöpfe

var r;                                                     // Radius (km)
var x1, y1;                                                // Geogr. Länge und Breite von Punkt A (Bogenmaß)
var x2, y2;                                                // Geogr. Länge und Breite von Punkt B (Bogenmaß)
var d;                                                     // Abstand (Bogenmaß)
var theta;                                                 // Winkel bezüglich x-y-Ebene (Bogenmaß)
var phi;                                                   // Winkel bezüglich x-Achse (Bogenmaß)
var a1, a2, b1, b2, b3, c1, c2, c3;                        // Koeffizienten für Parallelprojektion
var state;                                                 // Bewegungszustand (0 bis 4)
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 
  
// Auswahlfeld:
// id ..... ID im HTML-Befehl
// text ... Array von Zeichenketten

function getSelect (id, text) {
  var ch = getElement(id);                                 // Auswahlfeld
  for (var i=0; i<text.length; i++) {                      // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.setAttribute("style","background-color: #ffffff");   // Hintergrundfarbe
    o.innerHTML = text[i];                                 // Text festlegen
    ch.add(o);                                             // Zum Auswahlfeld hinzufügen
    }
  ch.selectedIndex = 0;                                    // 1. Eintrag ausgewählt
  return ch;                                               // Rückgabewert
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  getElement("lbR",text01);                                // Erklärender Text (Radius)
  ipR = getElement("ipR");                                 // Eingabefeld (Radius)
  getElement("uR",kilometer);                              // Einheit (Radius)
  getElement("lbA",text02);                                // Erklärender Text (Punkt A)
  ipAx = getElement("ipAx");                               // Eingabefeld (Länge von Punkt A)
  getElement("uAx",degree);                                // Einheit (Grad)
  chAx = getSelect("chAx",text11);                         // Auswahlfeld (östlich/westlich)
  ipAy = getElement("ipAy");                               // Eingabefeld (Breite von Punkt A)
  getElement("uAy",degree);                                // Einheit (Grad)
  chAy = getSelect("chAy",text12);                         // Auswahlfeld (nördlich/südlich)
  getElement("lbB",text03);                                // Erklärender Text (Punkt B)
  ipBx = getElement("ipBx");                               // Eingabefeld (Länge von Punkt B)
  getElement("uBx",degree);                                // Einheit (Grad)
  chBx = getSelect("chBx",text11);                         // Auswahlfeld (östlich/westlich)
  ipBy = getElement("ipBy");                               // Eingabefeld (Breite von Punkt B)
  getElement("uBy",degree);                                // Einheit (Grad)
  chBy = getSelect("chBy",text12);                         // Auswahlfeld (nördlich/südlich)
  getElement("lbD",text04);                                // Erklärender Text (Abstand)
  op1 = getElement("op1");                                 // Ausgabefeld (Abstand in Grad)
  op2 = getElement("op2");                                 // Ausgabefeld (Abstand in km)
  bu0 = getElement("stop");                                // Schaltknopf (Stopp)
  bu1 = getElement("up");                                  // Schaltknopf (nach oben)
  bu2 = getElement("right");                               // Schaltknopf (nach rechts)
  bu3 = getElement("down");                                // Schaltknopf (nach unten)
  bu4 = getElement("left");                                // Schaltknopf (nach links)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  
  r = 6371;                                                // Kugelradius (km)
  x0 = width/2; y0 = height/2;                             // Kugelmittelpunkt (Bildschirmkoordinaten)
  x1 = 10*DEG; y1 = 50*DEG;                                // Startposition Punkt A  
  x2 = 80*DEG; y2 = 30*DEG;                                // Startposition Punkt B
  calculation();                                           // Berechnungen
  updateInputOutput();                                     // Ein- und Ausgabefelder aktualisieren 
  focus(ipR);                                              // Fokus für erstes Eingabefeld
  theta = 20*DEG; phi = 20*DEG;                            // Startwerte der Winkel für die Parallelprojektion
  state = 0;                                               // Zunächst keine Bewegung  
  t0 = new Date();                                         // Bezugszeitpunkt
  t = 0;                                                   // Startwert für Zeitvariable (s)
  setInterval(paint,40);                                   // Timer aktivieren (Intervall 40 ms)  

  ipR.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Radius)
  ipR.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabefeld Radius)
  ipAx.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische Länge von Punkt A)
  ipAx.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld Länge A)
  chAx.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische Länge von Punkt A)
  ipAy.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische Breite von Punkt A)
  ipAy.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld Breite A)
  chAy.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische Breite von Punkt A)
  ipBx.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (geografische Länge von Punkt B)
  ipBx.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Eingabefeld Länge B)
  chBx.onchange = reaction;                                // Reaktion auf Auswahlfeld (geografische Länge von Punkt B)
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
  if (ae == ipR) focus(ipAx);                              // Fokus für das nächste Eingabefeld
  if (ae == ipAx || ae == chAx) focus(ipAy);               // Fokus für das nächste Eingabefeld
  if (ae == ipAy || ae == chAy) focus(ipBx);               // Fokus für das nächste Eingabefeld
  if (ae == ipBx || ae == chBx) focus(ipBy);               // Fokus für das nächste Eingabefeld
  if (ae == ipBy || ae == chBy) ipBy.blur();               // Fokus abgeben
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt r, x1, y1, x2, y2, d, a1, a2, b1, b2, b3, c1, c2, c3
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls keine Enter-Taste, abbrechen
  reaction();                                              // Hilfsroutine aufrufen
  }  

// Änderung des Bewegungszustands:
// s ... Neuer Wert von state (0 bis 4)
// Seiteneffekt state, t0 
  
function changeState (s) {
  if (state != s) state = s;                               // Gewünschte Bewegungsrichtung
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
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
  
// Gesamte Eingabe (Eingabe- und Auswahlfelder):
// Seiteneffekt r, x1, y1, x2, y2
  
function input () {
  r = inputNumber(ipR,0,true,1000,1000000);                // Radius
  x1 = inputNumber(ipAx,DIGITS,true,0,180)*DEG;            // Betrag der geografischen Länge von Punkt A (Bogenmaß)
  if (chAx.selectedIndex == 1) x1 = -x1;                   // Minuszeichen, falls westliche Länge
  y1 = inputNumber(ipAy,DIGITS,true,0,90)*DEG;             // Betrag der geografischen Breite von Punkt A (Bogenmaß)
  if (chAy.selectedIndex == 1) y1 = -y1;                   // Minuszeichen, falls südliche Breite
  x2 = inputNumber(ipBx,DIGITS,true,0,180)*DEG;            // Betrag der geografischen Länge von Punkt B (Bogenmaß)
  if (chBx.selectedIndex == 1) x2 = -x2;                   // Minuszeichen, falls westliche Länge
  y2 = inputNumber(ipBy,DIGITS,true,0,90)*DEG;             // Betrag der geografischen Breite von Punkt B (Bogenmaß)
  if (chBy.selectedIndex == 1) y2 = -y2;                   // Minuszeichen, falls südliche Breite
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
  return v;                                                // Rückgabewert
  }
  
// Skalarprodukt zweier Vektoren:
// v1 ... 1. Vektor (Attribute x, y, z)
// v2 ... 2. Vektor (Attribute x, y, z)

function dot (v1, v2) {
  return v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;                    // Rückgabewert
  }

// Kreuzprodukt zweier Vektoren:
// v1 ... 1. Vektor (Attribute x, y, z)
// v2 ... 2. Vektor (Attribute x, y, z)
  
function cross (v1, v2) {
  var v = {x: 0, y: 0, z: 0};                              // Startwert (Nullvektor)
  v.x = v1.y*v2.z-v1.z*v2.y;                               // x-Koordinate
  v.y = v1.z*v2.x-v1.x*v2.z;                               // y-Koordinate
  v.z = v1.x*v2.y-v1.y*v2.x;                               // z-Koordinate
  return v;                                                // Rückgabewert
  }
  
// Normierung eines Vektors (gleiche Richtung, Betrag 1):
// v ... Gegebener Vektor (Attribute x, y, z)
// Bemerkung: Nullvektor bleibt unverändert
  
function normalize (v) {
  var n = Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);              // Betrag
  if (n == 0) return;                                      // Falls Nullvektor, abbrechen
  v.x /= n; v.y /= n; v.z /= n;                            // Koordinaten durch Betrag dividieren
  }
  
// Parallelprojektion:
// p ... Gegebener Punkt (Attribute x, y, z)
// Rückgabewert: Verbund mit den Attributen u und v (Bildschirmkoordinaten, Pixel)

function projection (p) {
  var prU = x0+R*(a1*p.x+a2*p.y);                          // Waagrechte Bildschirmkoordinate (Pixel)
  var prV = y0-R*(b1*p.x+b2*p.y+b3*p.z);                   // Senkrechte ildschirmkoordinate (Pixel)
  return {u: prU, v: prV};                                 // Rückgabewert
  }
  
// Berechnungen:
// Seiteneffekt d, a1, a2, b1, b2, b3, c1, c2, c3

function calculation () {
  var s1 = Math.PI/2-y1;                                   // Seite Nordpol - Punkt A
  var cos1 = Math.cos(s1), sin1 = Math.sin(s1);            // Trigonometrische Werte
  var s2 = Math.PI/2-y2;                                   // Seite Nordpol - Punkt B
  var cos2 = Math.cos(s2), sin2 = Math.sin(s2);            // Trigonometrische Werte
  var w = Math.abs(x2-x1);                                 // Winkel beim Nordpol
  d = Math.acos(cos1*cos2+sin1*sin2*Math.cos(w));          // Abstand (Bogenmaß)
  // Ab hier zeitabhängig!
  var sin = Math.sin(theta), cos = Math.cos(theta);        // Trigonometrische Werte
  a1 = -Math.sin(phi); a2 = Math.cos(phi);                 // Koeffizienten für Rechtswert  
  b1 = -sin*a2; b2 = sin*a1; b3 = cos;                     // Koeffizienten für Hochwert         
  c1 = cos*a2; c2 = -cos*a1; c3 = sin;                     // Koeffizienten für Projektionsrichtung 
  }
  
// Ortsvektor eines Punkts der Einheitskugel:
// long ... Geografische Länge (Bogenmaß)
// lat .... Geografische Breite (Bogenmaß) 
// Rückgabewert: Verbund mit den Attributen x, y und z
  
function xyz (long, lat) {
  var cosLat = Math.cos(lat), sinLat = Math.sin(lat);      // Trigonometrische Werte
  var v = {};                                              // Neuer Verbund
  v.x = Math.cos(long)*cosLat;                             // x-Koordinate
  v.y = Math.sin(long)*cosLat;                             // y-Koordinate
  v.z = sinLat;                                            // z-Koordinate
  return v;                                                // Rückgabewert
  }
  
// Orthonormalbasis für Großkreis (Ortsvektoren der beiden Bezugspunkte):
// n ... Normalenvektor (Attribute x, y und z)
// Rückgabewert: Array mit zwei Basisvektoren bzw. Bezugspunkten; 
// Der erste Bezugspunkt (mit Index 0) entspricht einem Berührpunkt Großkreis/Kugel (links oder rechts).
// Der andere Bezugspunkt (mit Index 1) liegt auf der Vorderseite des Großkreises (90° zum ersten Bezugspunkt).
  
function getBase (n) {
  var pr = {x: c1, y: c2, z: c3};                          // Einheitsvektor für Projektionsrichtung
  var a = cross(pr,n);                                     // Kreuzprodukt
  normalize(a);                                            // 1. Bezugspunkt (Berührpunkt Großkreis/Kugel)
  var b = cross(a,n);                                      // Kreuzprodukt
  normalize(b);                                            // Punkt des Großkreises
  if (dot(pr,b) < 0) negate(b);                            // Falls Rückseite, Vektor b umkehren
  return [a, b];                                           // Rückgabewert: Array mit den Basisvektoren a und b  
  }
  
// Hilfsroutine für Großkreis: Projektion eines Punkts in Abhängigkeit vom Winkel
// a ... 1. Bezugspunkt (Berührpunkt mit Kugel)
// b ... 2. Bezugspunkt (auf Großkreis, 90° zum 1. Bezugspunkt, näher beim Betrachter)
// w ... Winkel (Bogenmaß, 0 für 1. Bezugspunkt, pi/2 für 2. Bezugspunkt)
// Rückgabewert: Verbund mit Attributen u und v (Bildschirmkoordinaten, Pixel)
  
function projectionPoint (a, b, w) {
  var cos = Math.cos(w), sin = Math.sin(w);                // Trigonometrische Werte
  var lc = linComb(cos,a,sin,b);                           // Punkt ermitteln (Attribute x, y, z)
  return projection(lc);                                   // Rückgabewert
  }
  
// Positionswinkel eines Punkts auf dem Großkreis:
// p ... Punkt auf Großkreis
// a ... 1. Bezugspunkt
// b ... 2. Bezugspunkt
// Rückgabewert: Positionswinkel (Bogenmaß, 0 bis 2 pi); 0 entspricht dem 1. Bezugspunkt, pi/2 dem 2. Bezugspunkt
  
function anglePosition (p, a, b) {
  var cA = dot(p,a), cB = dot(p,b);                        // Koeffizienten
  var phi = Math.atan2(cB,cA);                             // Positionswinkel (Bogenmaß -pi bis +pi)
  return (phi >= 0 ? phi : phi+2*Math.PI);                 // Rückgabewert (Bogenmaß)
  }
  
// Aktualisierung der Ein- und Ausgabefelder:

function updateInputOutput () {
  ipR.value = ToString(r,0);                               // Radius 
  ipAx.value = ToString(Math.abs(x1)/DEG,1);               // Geografische Länge von Punkt A
  chAx.selectedIndex = (x1>=0 ? 0 : 1);                    // Auswahlfeld östlich/westlich für Punkt A
  ipAy.value = ToString(Math.abs(y1)/DEG,1);               // Geografische Breite von Punkt A
  chAy.selectedIndex = (y1>=0 ? 0 : 1);                    // Auswahlfeld nördlich/südlich für Punkt A
  ipBx.value = ToString(Math.abs(x2)/DEG,1);               // Geografische Länge von Punkt B
  chBx.selectedIndex = (x2>=0 ? 0 : 1);                    // Auswahlfeld östlich/westlich für Punkt B
  ipBy.value = ToString(Math.abs(y2)/DEG,1);               // Geografische Breite von Punkt B
  chBy.selectedIndex = (y2>=0 ? 0 : 1);                    // Auswahlfeld nördlich/südlich für Punkt B
  op1.innerHTML = ToString(d/DEG,DIGITS)+degree;           // Ausgabefeld für Abstand im Gradmaß
  op2.innerHTML = ToString(r*d,0)+" "+kilometer;           // Ausgabefeld für Abstand in km
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)
// d ... Array für Linienart (optional, SOLID oder DASH, Defaultwert SOLID)

function newPath(c, w, d) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = (w?w:1);                                 // Liniendicke
  ctx.setLineDash(d?d:SOLID);                              // Linienart
  }
  
// Punkt markieren (auf der Vorderseite ausgefüllter Kreis, auf der Rückseite Kreisrand):
// (u,v) ... Bildschirmkoordinaten (Pixel)
// c ....... Farbe
// f ....... Flag für Vorderseite

function point (u, v, c, f) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(u,v,2.5,0,2*Math.PI,true);                       // Kreis mit Radius 2.5 vorbereiten
  ctx.fillStyle = (f ? c : colorBackground);               // Füllfarbe
  if (f) ctx.fill();                                       // Falls Vorderseite, ausgefüllter Kreis
  ctx.stroke();                                            // Kreisrand
  }

// Punkt mit gegebenen geogrfischen Koordinaten markieren:
// long ... Geografische Länge (Bogenmaß, -pi bis +pi)
// lat .... Geografische Breite (Bogenmaß, -pi/2 bis +pi/2)
  
function pointLongLat (long, lat, c) {
  var p = xyz(long,lat);                                   // Punkt auf der Einheitskugel (Attribute x, y, z)
  var f = (c1*p.x+c2*p.y+c3*p.z > 0);                      // Flag für Vorderseite
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
  ctx.moveTo(x0,y0+R*b3);                                  // Südpol als Anfangspunkt
  ctx.lineTo(x0,y0-R*b3);                                  // Linie zum Nordpol
  ctx.stroke();                                            // Achse zeichnen
  }
  
// Vorder- oder Rückseite eines Großkreises:
// a ... 1. Bezugspunkt (Berührpunkt mit Kugel)
// b ... 2. Bezugspunkt (auf Großkreis, 90° zum 1. Bezugspunkt, näher beim Betrachter)
// c ... Linienfarbe
// f ... Flag für Vorderseite (näher beim Betrachter)
  
function partGreatCircle (a, b, c, f) {
  var iMin = (f?0:180), iMax = (f?180:360);                // Minimaler und maximaler Index
  newPath(c,1,f?SOLID:DASH);                               // Neuer Grafikpfad für Polygonzug
  var p = projectionPoint(a,b,iMin*DEG);                   // Anfangspunkt ermitteln (Attribute u und v)
  ctx.moveTo(p.u,p.v);                                     // Anfangspunkt für Grafikpfad
  for (var i=iMin+1; i<=iMax; i++) {                       // Für alle Indizes ...
    p = projectionPoint(a,b,i*DEG);                        // Punkt auf Großkreis (Attribute u und v)
    ctx.lineTo(p.u,p.v);                                   // Linie zum Polygonzug hinzufügen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Großkreis:
// n .... Normaleneinheitsvektor (Attribute x, y, z)
// c .... Linienfarbe Vorderseite
// bs ... Flag für Sichtbarkeit der Rückseite (optional, Defaultwert false)
  
function greatCircle (n, c, bs) {
  var onb = getBase(n);                                    // Orthonormalbasis (Bezugspunkte)
  partGreatCircle(onb[0],onb[1],c,true);                   // Vorderseite durchgezogen
  if (bs) partGreatCircle(onb[0],onb[1],c,false);          // Falls gewünscht, Rückseite gestrichelt
  }
    
// Einheitlicher Abschnitt eines Großkreisbogens (nur Vorderseite oder nur Rückseite):
// a .... 1. Bezugspunkt (Berührpunkt Großkreis/Kugel)
// b .... 2. Bezugspunkt (90° zum 1. Bezugspunkt)
// w0 ... Startwinkel (Bogenmaß, 0 bis 2 pi)
// w .... Winkelgröße (Bogenmaß, 0 bis pi)
// c .... Farbe
// f .... Flag für Vorderseite
  
function partSegment (a, b, w0, w, c, f) {
  newPath(c,1,f?SOLID:DASH);                               // Neuer Grafikpfad für Polygonzug
  var p = projectionPoint(a,b,w0);                         // Projektion Anfangspunkt
  ctx.moveTo(p.u,p.v);                                     // Anfangspunkt Polygonzug 
  var dw = w/100;                                          // Schrittweite (Bogenmaß)
  for (var i=1; i<=100; i++) {                             // Für alle Indizes ...
    var wp = w0+i*dw;                                      // Aktueller Positionswinkel (Bogenmaß)
    p = projectionPoint(a,b,wp);                           // Projektion des aktuellen Punkts
    ctx.lineTo(p.u,p.v);                                   // Linie zum Polygonzug hinzufügen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Großkreisbogen:
// p1, p2 ... Endpunkte (Attribute x, y, z)
// c ........ Linienfarbe

function segment (p1, p2, c) {
  if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z)        // Falls Punkte gleich ...
    return;                                                // Abbrechen
  var n = cross(p1,p2);                                    // Normalenvektor der Großkreisebene
  if (dot(n,n) < 1e-8) {                                   // Falls Normalenvektor gleich Nullvektor ...
    n = {x: p1.y, y: -p1.x, z: 0};                         // Normalenvektor für Großkreis durch Pole
    if (dot(n,n) < 1e-8) n = {x: 0, y: 1, z: 0};           // Falls Nord- und Südpol gegeben, Normalenvektor für Nullmeridian
    }
  var onb = getBase(n);                                    // Orthonormalbasis
  var a = onb[0], b = onb[1];                              // Bezugspunkte
  var w1 = anglePosition(p1,a,b);                          // Positionswinkel 1. Endpunkt (Bogenmaß, 0 bis 2 pi)
  var w2 = anglePosition(p2,a,b);                          // Positionswinkel 2. Endpunkt (Bogenmaß, 0 bis 2 pi)
  var min = Math.min(w1,w2), max = Math.max(w1,w2);        // Kleinerer und größerer der beiden Positionswinkel
  var w = max-min;                                         // Differenz der beiden Positionswinkel (0 bis 2 pi)
  var w0 = (w <= Math.PI ? min : max);                     // Startwinkel (Bogenmaß, 0 bis 2 pi)
  if (w > Math.PI) w = 2*Math.PI-w;                        // Endgültige Winkelgröße (Bogenmaß, 0 bis pi)
  if (w0 < Math.PI) {                                      // Falls Anfang des Kreisbogens auf der Vorderseite ...
    partSegment(a,b,w0,Math.min(w,Math.PI-w0),c,true);     // Abschnitt auf der Vorderseite (durchgezogen)
    if (w0+w > Math.PI)                                    // Falls Kreisbogen auch auf der Rückseite ... 
      partSegment(a,b,Math.PI,w0+w-Math.PI,c,false);       // Abschnitt auf der Rückseite (gestrichelt)
    }
  else {                                                   // Falls Anfang des Kreisbogens auf der Rückseite ...
    partSegment(a,b,w0,Math.min(w,2*Math.PI-w0),c,false);  // Abschnitt auf der Rückseite (gestrichelt)
    if (w0+w > 2*Math.PI)                                  // Falls Ende des Kreisbogens auf der Vorderseite ... 
      partSegment(a,b,0,w0+w-2*Math.PI,c,true);            // Abschnitt auf der Vorderseite (durchgezogen)  
    }
  }
  
// Meridian (kompletter Großkreis, Rückseite unsichtbar):
// long ... Geografische Länge (Bogenmaß)

function meridian (long) {
  var n = {x: -Math.sin(long), y: Math.cos(long), z: 0};   // Normalenvektor
  greatCircle(n,"#000000",false);                          // Großkreis (Rückseite unsichtbar)
  }
   
// Ellipsenbogen zeichnen (für Breitenkreise):
// (x,y) ... Mittelpunkt (Pixel)
// a ....... Waagrechte Halbachse (Pixel)
// b ....... Senkrechte Halbachse (Pixel)
// t0 ...... Kleinster Parameterwert
// t1 ...... Größter Parameterwert
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
  ctx.restore();                                           // Früheren Grafikkontext wiederherstellen
  ctx.stroke();                                            // Ellipsenbogen zeichnen
  } 
  
// Breitenkreis (Rückseite unsichtbar):
// lat ... Geografische Breite (Bogenmaß, -pi/2 bis +pi/2)

function circleLatitude (lat) {
  var vM = y0-R*Math.cos(theta)*Math.sin(lat);             // Senkrechte Bildschirmkoordinate des Mittelpunkts
  var a = R*Math.cos(lat);                                 // Waagrechte Halbachse
  var b = a*Math.sin(Math.abs(theta));                     // Senkrechte Halbachse
  var sinW = Math.tan(lat)*Math.tan(theta);                // Zwischenergebnis (Sinuswert)
  if (sinW >= 1)                                           // Falls Breitenkreis vollständig sichtbar ...
    ellipticalArc(x0,vM,a,b,0,2*Math.PI);                  // Ellipse
  else if (sinW >= -1) {                                   // Falls Breitenkreis teilweise sichtbar ..
    var w = Math.asin(sinW);                               // Winkel für Berührpunkt Breitenkreis/Kugel (Bogenmaß)
    if (theta >= 0)                                        // Falls Betrachtung von "oben" ...
      ellipticalArc(x0,vM,a,b,-w,Math.PI+w);               // Ellipsenbogen
    else ellipticalArc(x0,vM,a,b,Math.PI-w,2*Math.PI+w);   // Ellipsenbogen bei Betrachtung von "unten"
    }
  }
   
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (state != 0) {                                        // Falls Animation eingeschaltet ...
    var dt = (new Date()-t0)/1000;                         // Zeit seit Bezugspunkt (s) 
    t0 = new Date();                                       // Neuer Bezugszeitpunkt                       
    t += dt;                                               // Zeitvariable (s) aktualisieren
    var angle = OMEGA*dt;                                  // Drehwinkel (Bogenmaß)    
    if (state == 1) theta += angle;                        // Drehung nach oben
    else if (state == 2) phi += angle;                     // Drehung nach rechts
    else if (state == 3) theta -= angle;                   // Drehung nach unten
    else if (state == 4) phi -= angle;                     // Drehung nach links
    if (theta > Math.PI/2) {                               // Falls Nordpol erreicht ...
      theta = Math.PI/2; state = 0;                        // Drehung beenden
      }
    if (theta < -Math.PI/2) {                              // Falls Südpol erreicht ...
      theta = -Math.PI/2; state = 0;                       // Drehung beenden
      }
    } 
  calculation();                                           // Berechnungen
  circle(x0,y0,R,"#000000");                               // Kugel
  var n = {x: 0, y: 0, z: 1};                              // Normaleneinheitsvektor für Äquator
  greatCircle(n,"#000000",true);                           // Äquator
  axis();                                                  // Kugelachse
  for (var i=0; i<180; i+=30) meridian(i*DEG);             // Meridiane (Abstand 30°)
  for (i=-60; i<=60; i+=30) {                              // Für alle Indizes (Abstand 30°) ...
    if (i == 0) continue;                                  // Äquator auslassen
    circleLatitude(i*DEG);                                 // Breitenkreis
    }
  var p1 = xyz(x1,y1), p2 = xyz(x2,y2);                    // Ortsvektoren der gegebenen Punkte
  segment(p1,p2,"#ff0000",true);                           // Großkreisbogen (Abstand)
  point(x0,y0,"#000000",false);                            // Kugelmittelpunkt
  pointLongLat(0,90*DEG,colorPole);                        // Nordpol
  pointLongLat(0,-90*DEG,colorPole);                       // Südpol
  pointLongLat(x1,y1,colorPoint);                          // Punkt A
  pointLongLat(x2,y2,colorPoint);                          // Punkt B
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = colorPole;                               // Schriftfarbe
  if (theta >= 0) ctx.fillText(symbolN,x0+8,y0+5-R*b3);    // Beschriftung Nordpol
  if (theta <= 0) ctx.fillText(symbolS,x0+8,y0+5+R*b3);    // Beschriftung Südpol
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen



