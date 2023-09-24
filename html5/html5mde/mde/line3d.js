// Vektorgleichung einer Geraden im dreidimensionalen Raum
// Java-Applet (16.09.1999) umgewandelt
// 25.10.2015 - 10.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel line3d_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorLine = "#000000";                                 // Farbe für Gerade AB
var colorVector = "#c000c0";                               // Farbe für Richtungsvektor
var colorX = "#ff0000";                                    // Farbe für x-Achse
var colorY = "#008000";                                    // Farbe für y-Achse
var colorZ = "#0000ff";                                    // Farbe für z-Achse
var colorYZ = "#ffd0d0";                                   // Farbe für y-z-Ebene
var colorXZ = "#d0ffd0";                                   // Farbe für x-z-Ebene
var colorXY = "#c0e0ff";                                   // Farbe für x-y-Ebene

// Weitere Konstanten:

var FONT1 = "normal normal bold 12px sans-serif";          // Kleinerer Zeichensatz (Fettdruck)
var FONT2 = "normal normal bold 16px sans-serif";          // Größerer Zeichensatz (Fettdruck)
var FONT3 = "normal normal normal 12px sans-serif";        // Kleinerer Zeichensatz (dünn)
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var omega = Math.PI/30;                                    // Winkelgeschwindigkeit für Animation (rad/s)
var unit = 20;                                             // Einheit (Pixel)
var INF = 20;                                              // "Unendlich"
var max = 5;                                               // Maximalbetrag für Koordinaten
var maxA = 8;                                              // Länge einer halben Koordinatenachse

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ipx1, ipy1, ipz1;                                      // Eingabefelder (Koordinaten von Punkt A)
var ipx2, ipy2, ipz2;                                      // Eingabefelder (Koordinaten von Punkt B)

var xA, yA, zA;                                            // Koordinaten von Punkt A
var xB, yB, zB;                                            // Koordinaten von Punkt B
var dx, dy, dz;                                            // Richtungsvektor
var u0, v0;                                                // Bildschirmkoordinaten Ursprung (Pixel)
var theta;                                                 // Winkel bezüglich x-y-Ebene (Bogenmaß)
var phi;                                                   // Winkel bezüglich x-Achse (Bogenmaß)
var a1, a2, b1, b2, b3, c1, c2, c3;                        // Koeffizienten für Parallelprojektion
var s1, s2, s3;                                            // Vorzeichen für Projektionsrichtung
var poly;                                                  // Array für Polygonecken
var visA, visB;                                            // Flags für Sichtbarkeit von A und B
var inside;                                                // Flag für Punkt innerhalb
var state;                                                 // Bewegungsrichtung
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

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel) 
  getElement("p1",text01);                                 // Erklärender Text (Punkt A)
  ipx1 = getElement("ipx1");                               // Eingabefeld (x-Koordinate von A)
  ipy1 = getElement("ipy1");                               // Eingabefeld (y-Koordinate von A)
  ipz1 = getElement("ipz1");                               // Eingabefeld (z-Koordinate von A)  
  getElement("p2",text02);                                 // Erklärender Text (Punkt B)
  ipx2 = getElement("ipx2");                               // Eingabefeld (x-Koordinate von B)
  ipy2 = getElement("ipy2");                               // Eingabefeld (y-Koordinate von B)
  ipz2 = getElement("ipz2");                               // Eingabefeld (z-Koordinate von B)
  bu0 = getElement("stop");                                // Kleiner Schaltknopf (Stopp)
  bu1 = getElement("up");                                  // Kleiner Schaltknopf (nach oben)
  bu2 = getElement("right");                               // Kleiner Schaltknopf (nach rechts)
  bu3 = getElement("down");                                // Kleiner Schaltknopf (nach unten)
  bu4 = getElement("left");                                // Kleiner Schaltknopf (nach links)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  
  u0 = v0 = width/2;                                       // Bildschirmkoordinaten Ursprung (Pixel)
  xA = 3; yA = 1; zA = 2;                                  // Startwerte für Koordinaten von Punkt A
  xB = 4; yB = 0; zB = 4;                                  // Startwerte für Koordinaten von Punkt B
  dx = xB-xA, dy = yB-yA, dz = zB-zA;                      // Richtungsvektor
  updateInput();                                           // Eingabefelder aktualisieren
  focus(ipx1);                                             // Fokus für erstes Eingabefeld
  theta = 15*Math.PI/180; phi = 40*Math.PI/180;            // Blickrichtung
  calcCoeff();                                             // Koeffizienten für Parallelprojektion berechnen
  poly = new Array(4);                                     // Array für Polygonecken
  t0 = new Date();                                         // Bezugszeitpunkt
  state = 0;                                               // Animation zunächst abgeschaltet
  t = 0;                                                   // Startwert für Zeitvariable
  paint();                                                 // Zeichnen
  
  ipx1.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von x_A
  ipy1.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von y_A
  ipz1.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von z_A
  ipx2.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von x_B
  ipy2.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von y_B
  ipz2.onkeydown = reactionEnter;                          // Reaktion auf Eingabe von z_B
  
  ipx1.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe x_A)
  ipy1.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe y_A)
  ipz1.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe z_A)
  ipx2.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe x_B)
  ipy2.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe y_B)
  ipz2.onblur = input;                                     // Reaktion auf Verlust des Fokus (Eingabe z_B)
  
  bu0.onclick = function (e) {stopAnimation();}            // Reaktion auf Schaltknopf (Stopp)
  bu1.onclick = function (e) {modifyAnimation(1);}         // Reaktion auf Schaltknopf (oben)
  bu2.onclick = function (e) {modifyAnimation(2);}         // Reaktion auf Schaltknopf (rechts)
  bu3.onclick = function (e) {modifyAnimation(3);}         // Reaktion auf Schaltknopf (unten)
  bu4.onclick = function (e) {modifyAnimation(4);}         // Reaktion auf Schaltknopf (links)
  
  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt xA, yA, zA, xB, yB, zB, dx, dy, dz, t0, theta, phi, state, a1, a2, b1, b2, b3, c1, c2, c3, s1, s2, s3, visA, visB
// Wirkung auf Eingabefelder und Zeichenfläche
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls keine Enter-Taste, abbrechen
  input();                                                 // Daten übernehmen                          
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
     
// Animation ändern:
// st ... Vorgegebener Wert für state (1, 2, 3 oder 4)
// Seiteneffekt xA, yA, zA, xB, yB, zB, dx, dy, dz, state, timer, t0

function modifyAnimation (st) {
  input();                                                 // Eingabe
  if (state != st) state = st;                             // Falls neuer Schaltknopf, neue Richtung 
  else {stopAnimation(); return;}                          // Falls gleicher Schaltknopf wie bisher, Animation abschalten
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt xA, yA, zA, xB, yB, zB, dx, dy, dz, t0, theta, phi, state, a1, a2, b1, b2, b3, c1, c2, c3, s1, s2, s3, visA, visB, timer

function stopAnimation () {
  input();                                                 // Eingabe                                                 
  paint();                                                 // Neu zeichnen
  state = 0;                                               // Animation abgeschaltet
  if (timer) clearInterval(timer);                         // Timer deaktivieren
  }
  
//-----------------------------------------------------------------------------

// Koeffizienten für die Parallelprojektion berechnen:
// Seiteneffekt a1, a2, b1, b2, b3, c1, c2, c3, s1, s2, s3

function calcCoeff () { 
  var sin = Math.sin(theta), cos = Math.cos(theta);
  a1 = -Math.sin(phi); a2 = Math.cos(phi);                 // Nach "rechts" 
  b1 = -sin*a2; b2 = sin*a1; b3 = cos;                     // Nach "oben" 
  c1 = cos*a2; c2 = -cos*a1; c3 = sin;                     // Projektionsrichtung
  s1 = (c1>=0 ? 1 : -1);                                   // Vorzeichen von c1
  s2 = (c2>=0 ? 1 : -1);                                   // Vorzeichen von c2
  s3 = (c3>=0 ? 1 : -1);                                   // Vorzeichen von c3        
  }
  
// Waagrechte Bildschirmkoordinate:

function screenU (x, y) {return u0+unit*(a1*x+a2*y);}

// Senkrechte Bildschirmkoordinate:

function screenV (x, y, z) {return v0-unit*(b1*x+b2*y+b3*z);}
  
// Umwandlung einer ganzen Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl

function ToString (n) {
  var s = n.toFixed(0);                                    // Zeichenkette ohne Nachkommastellen
  return s.replace("-","\u2212");                          // Eventuell kurzes durch langes Minuszeichen ersetzen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  s = s.replace("\u2212","-");                             // Eventuell langes durch kurzes Minuszeichen ersetzen 
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n);                                  // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
   
// Gesamte Eingabe:
// Seiteneffekt xA, yA, zA, xB, yB, zB, dx, dy, dz, Wirkung auf die Eingabefelder und die Zeichenfläche

function input () {
  var ae = document.activeElement;                         // Aktives Element
  xA = inputNumber(ipx1,0,true,-5,5);                      // x-Koordinate von A
  yA = inputNumber(ipy1,0,true,-5,5);                      // y-Koordinate von A
  zA = inputNumber(ipz1,0,true,-5,5);                      // z-Koordinate von A
  xB = inputNumber(ipx2,0,true,-5,5);                      // x-Koordinate von b
  yB = inputNumber(ipy2,0,true,-5,5);                      // y-Koordinate von B
  zB = inputNumber(ipz2,0,true,-5,5);                      // z-Koordinate von B
  dx = xB-xA; dy = yB-yA; dz = zB-zA;                      // Richtungsvektor
  if (state == 0) paint();                                 // Falls Animation abgeschaltet, neu zeichnen
  if (ae == ipx1) focus(ipy1);                             // Fokus für das nächste Eingabefeld
  if (ae == ipy1) focus(ipz1);                             // Fokus für das nächste Eingabefeld
  if (ae == ipz1) focus(ipx2);                             // Fokus für das nächste Eingabefeld
  if (ae == ipx2) focus(ipy2);                             // Fokus für das nächste Eingabefeld
  if (ae == ipy2) focus(ipz2);                             // Fokus für das nächste Eingabefeld
  if (ae == ipz2) ipz2.blur();                             // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ipx1.value = ToString(xA);                               // Eingabefeld für x-Koordinate von Punkt A
  ipy1.value = ToString(yA);                               // Eingabefeld für y-Koordinate von Punkt A
  ipz1.value = ToString(zA);                               // Eingabefeld für z-Koordinate von Punkt A
  ipx2.value = ToString(xB);                               // Eingabefeld für x-Koordinate von Punkt B
  ipy2.value = ToString(yB);                               // Eingabefeld für y-Koordinate von Punkt B
  ipz2.value = ToString(zB);                               // Eingabefeld für z-Koordinate von Punkt B
  }
  
// Ecke eines Polygons festlegen:
// i ......... Index der Ecke (0 bis 3)
// (x,y,z) ... Räumliche Koordinaten
// Seiteneffekt poly

function setPoint (i, x, y, z) {
  poly[i] = {u: screenU(x,y), v: screenV(x,y,z)};
  }
  
// Überprüfung, ob ein Punkt innerhalb eines Polygons liegt:
// (uP,vP) ... Gegebener Punkt (Bildschirmkoordinaten)
// p ......... Polygon (Array)

function isInside (uP, vP, p) {
  var vector1 = {u: p[0].u-uP, v: p[0].v-vP};              // Erster Verbindungsvektor
  var i = 1, angle = 0;                                    // Index, überstrichener Winkel
  do {                                                     // Wiederhole ...
    var vector2 = {u: p[i].u-uP, v: p[i].v-vP};            // Zweiter Verbindungsvektor
    var sp = vector1.u*vector2.u+vector1.v*vector2.v;      // Skalarprodukt
    var abs1 = Math.sqrt(vector1.u*vector1.u+vector1.v*vector1.v); // Betrag des ersten Verbindungsvektors
    if (abs1 == 0) return false;                           // Falls Punkt gleich Polygonecke, abbrechen
    var abs2 = Math.sqrt(vector2.u*vector2.u+vector2.v*vector2.v); // Betrag des zweiten Verbindungsvektors
    if (abs2 == 0) return false;                           // Falls Punkt gleich Polygonecke, abbrechen
    var w = Math.acos(sp/(abs1*abs2));                     // Betrag des neu überstrichenen Winkels
    var vp = vector1.u*vector2.v-vector1.v*vector2.u;      // Komponente des Vektorprodukts (für Drehsinn)
    if (vp > 0) angle += w;                                // Je nach Drehsinn neuen Winkel addieren ...
    if (vp < 0) angle -= w;                                // ... oder subtrahieren
    i = (i+1)%(p.length);                                  // Neuer Index (zyklisch weitergezählt)
    vector1 = vector2;                                     // Zweiter Verbindungsvektor wird erster Verbindungsvektor
    }
  while (i != 1);                                          // ... bis erste Polygonecke wieder erreicht
  return (Math.abs(angle) > Math.PI)                       // Rückgabewert
  }
  
// Parameter des Schnittpunkts zwischen der Geraden und einer Seite des Polygons poly:
// i0, i1 ... Indizes der beteiligten Polygonecken
// Rückgabewert: Parameter für Schnittpunkt
// Seiteneffekt inside (Schnitt auf der Seite, nicht auf der Verlängerung)

function parameter (i0, i1) {
  inside = false;                                          // Startwert
  var uA = screenU(xA,yA), vA = screenV(xA,yA,zA);         // Bildschirmkoordinaten von A
  var uB = screenU(xB,yB), vB = screenV(xB,yB,zB);         // Bildschirmkoordinaten von B
  var u0 = poly[i0].u, v0 = poly[i0].v;                    // Bildschirmkoordinaten der ersten Polygonecke
  var u1 = poly[i1].u, v1 = poly[i1].v;                    // Bildschirmkoordinaten der zweiten Polygonecke
  var aUU = uB-uA, aUV = u0-u1, bU = u0-uA;                // Erste Gleichung:  aUU * lambda + aUV * my = bU
  var aVU = vB-vA, aVV = v0-v1, bV = v0-vA;                // Zweite Gleichung: aVU * lambda + aVV * my = bV
  var det = aUU*aVV-aVU*aUV;                               // Determinante
  if (det == 0) return 0;                                  // Falls keine eindeutige Lösung, abbrechen
  var lambda = (bU*aVV-bV*aUV)/det;                        // Lösung für lambda 
  var my = (aUU*bV-aVU*bU)/det;                            // Lösung für my
  if (my < 0 || my > 1) return 0;                          // Falls Schnittpunkt auf Verlängerung der Seite, abbrechen
  inside = true;                                           // Seiteneffekt
  return lambda;                                           // Rückgabewert: Parameterwert für Schnittpunkt
  }
    
// Parameter für die Schnittpunkte der Geraden mit den Seiten des Polygons poly
// par ... Vorbereitetes Array der Länge 4
// Kleinerer Parameter in par[0], größerer in par[1]
// Rückgabewert: Zahl der Schnittpunkte

function parameter2 (par) {
  var n = 0;                                               // Zahl der Schnittpunkte, Startwert
  par[n] = parameter(0,1); if (inside) n++;                // Schnitt mit der ersten Polygonseite
  par[n] = parameter(1,2); if (inside) n++;                // Schnitt mit der zweiten Polygonseite
  par[n] = parameter(2,3); if (inside) n++;                // Schnitt mit der dritten Polygonseite
  par[n] = parameter(3,0); if (inside) n++;                // Schnitt mit der vierten Polygonseite
  if (n < 2) return n;                                     // Falls Polygon nicht geschnitten wird, abbrechen
  var minPar = par[0], maxPar = par[0];                    // Minimaler und maximaler Parameterwert (erster Schnittpunkt)
  for (var i=1; i<n; i++) {                                // Für alle weiteren Schnittpunkte ...
    var p = par[i];                                        // Neuer Parameterwert
    if (p < minPar) minPar = p;                            // Eventuell minimalen Parameterwert korrigieren 
    if (p > maxPar) maxPar = p;                            // Eventuell maximalen Parameterwert korrigieren
    }
  par[0] = minPar; par[1] = maxPar;                        // Endgültige Parameterwerte (aufsteigend geordnet)
  return 2;                                                // Rückgabewert
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:
// n ... Liniendicke (optional)

function newPath (n) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (n ? n : 1);                             // Liniendicke
  }
  
// Linie der Dicke 1:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional, Defaultwert ctc.strokeStyle)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Pfeil:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional, Defaultwert 1)
// Zu beschten: Die Farbe wird durch ctx.strokeStyle bestimmt.

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
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad für Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Text mit optionalem Index:
// s ....... Zeichenkette (Text und Index durch '_' getrennt)
// (x,y) ... Position (Pixel)
// bold .... Flag für Fettdruck (optional, Defaultwert true)

function writeTextIndex (s, x, y, bold) {
  ctx.textAlign = "left";                                  // Textausrichtung linksbündig
  ctx.font = FONT1;                                        // Kleinerer Zeichensatz, normalerweise fett
  if (bold == false) ctx.font = FONT3;                     // Eventuell dünne Schrift
  var i = s.indexOf('_');                                  // Position des Unterstrichs oder -1
  var index = (i>=0);                                      // Flag für vorhandenen Index
  var s1 = (index ? s.substring(0,i) : s);                 // Normaler Text
  var s2 = (index ? s.substring(i+1) : "");                // Index
  var w1 = ctx.measureText(s1).width;                      // Länge normaler Text (Pixel)
  var w2 = (index ? ctx.measureText(s2).width : 0);        // Länge Index (Pixel)
  x -= (w1+w2)/2;                                          // Für Zentrierung nach links verschieben
  ctx.fillText(s1,x,y+4);                                  // Normalen Text schreiben
  if (index) ctx.fillText(s2,x+w1,y+8);                    // Gegebenenfalls Index schreiben
  }
   
// Strecke im Raum:
// (x0,y0,z0) ... Räumliche Koordinaten Anfangspunkt
// (x1,y1,z1) ... Räumliche Koordinaten Endpunkt
// c ............ Farbe (optional, Defaultwert ctx.strokeStyle)
// w ............ Liniendicke (optional, Defaultwert 1) 

function line3D (x0, y0, z0, x1, y1, z1, c, w) {
  var uu0 = screenU(x0,y0), vv0 = screenV(x0,y0,z0);       // Bildschirmkoordinaten Anfangspunkt
  var uu1 = screenU(x1,y1), vv1 = screenV(x1,y1,z1);       // Bildschirmkoordinaten Endpunkt
  line(uu0,vv0,uu1,vv1,c,w);                               // Linie zeichnen
  }
  
// Teil der Geraden:
// min ... Minimalwert des Parameters
// max ... Maximalwert des Parameters
// w ..... Liniendicke (optional, Defaultwert 2)
// c ..... Farbe (optional, Defaultwert colorLine)

function partLine (min, max, w, c) {
  if (min >= max) return;                                  // Bei falscher Reihenfolge der Parameter abbrechen                     
  if (w == undefined) w = 2;                               // Defaultwert für Liniendicke
  if (c == undefined) c = colorLine;                       // Defaultwert für Farbe
  line3D(xA+min*dx,yA+min*dy,zA+min*dz,xA+max*dx,yA+max*dy,zA+max*dz,c,w); // Linie zeichnen
  }
  
// Vektorpfeil auf der Geraden:
// min ... Minimalwert des Parameters
// max ... Maximalwert des Parameters
// w ..... Liniendicke (optional, Defaultwert 2)

function arrow3D (min, max, w) {
  if (min >= max) return;                                  // Bei falscher Reihenfolge der Parameter abbrechen
  if (w == undefined) w = 2;                               // Defaultwert für Liniendicke
  var uu0 = screenU(xA+min*dx,yA+min*dy);                  // Waagrechte Bildschirmkoordinate Anfangspunkt
  var vv0 = screenV(xA+min*dx,yA+min*dy,zA+min*dz);        // Senkrechte Bildschirmkoordinate Anfangspunkt
  var uu1 = screenU(xA+max*dx,yA+max*dy);                  // Waagrechte Bildschirmkoordinate Endpunkt
  var vv1 = screenV(xA+max*dx,yA+max*dy,zA+max*dz);        // Senkrechte Bildschirmkoordinate Endpunkt
  ctx.strokeStyle = colorVector;                           // Farbe
  arrow(uu0,vv0,uu1,vv1,w);                                // Pfeil zeichnen
  }
  
// Ausgefülltes Polygon (ohne Rand):
// p ... Array mit Koordinaten der Ecken
// c ... Füllfarbe

function fillPolygon (p, c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.moveTo(p[0].u,p[0].v);                               // Zur ersten Ecke
  for (var i=1; i<p.length; i++)                           // Für alle weiteren Ecken ... 
    ctx.lineTo(p[i].u,p[i].v);                             // Linie zum Pfad hinzufügen
  ctx.closePath();                                         // Zurück zum Ausgangspunkt
  ctx.fill();                                              // Polygon ausfüllen   
  }
  
// Halbe x-Achse:
// signX ... Vorzeichen (-1 oder +1)

function axisX (signX) {
  var u1 = screenU(signX*maxA,0);                          // Waagrechte Bildschirmkoordinate Endpunkt
  var v1 = screenV(signX*maxA,0,0);                        // Senkrechte Bildschirmkoordinate Endpunkt
  if (signX > 0 && c1 > -0.95) {                           // Falls positive Halbachse ...
    ctx.strokeStyle = colorX;                              // Farbe für x-Achse
    arrow(u0,v0,u1,v1);                                    // Pfeil für positive Halbachse
    writeTextIndex(symbolX,u1,v1+6);                       // Beschriftung (eventuell mit Index)
    }
  else if (signX < 0) line(u0,v0,u1,v1,colorX);            // Falls negative Halbachse, Linie statt Pfeil 
  }

// Halbe y-Achse:
// signY ... Vorzeichen (-1 oder +1)

function axisY (signY) {
  var u1 = screenU(0,signY*maxA);                          // Waagrechte Bildschirmkoordinate Endpunkt
  var v1 = screenV(0,signY*maxA,0);                        // Senkrechte Bildschirmkoordinate Endpunkt
  if (signY > 0 && c2 > -0.95) {                           // Falls positive Halbachse ...
    ctx.strokeStyle = colorY;                              // Farbe für y-Achse
    arrow(u0,v0,u1,v1);                                    // Pfeil für positive Halbachse
    writeTextIndex(symbolY,u1,v1+6);                       // Beschriftung, eventuell mit Index
    }
  else if (signY < 0) line(u0,v0,u1,v1,colorY);            // Falls negative Halbachse, Linie statt Pfeil
  }

// Halbe z-Achse:
// signZ ... Vorzeichen (-1 oder +1)

function axisZ (signZ) {
  var u1 = screenU(0,0);                                   // Waagrechte Bildschirmkoordinate Endpunkt
  var v1 = screenV(0,0,signZ*maxA);                        // Senkrechte Bildschirmkoordinate Endpunkt
  if (signZ > 0 && c3 > -0.95) {                           // Falls positive Halbachse ...
    ctx.strokeStyle = colorZ;                              // Farbe für z-Achse
    arrow(u0,v0,u1,v1);                                    // Pfeil für positive Halbachse
    writeTextIndex(symbolZ,u1+12,v1+6);                    // Beschriftung, eventuell mit Index
    }
  else if (signZ < 0) line(u0,v0,u1,v1,colorZ);            // Falls negative Halbachse, Linie statt Pfeil
  }

// Halbachsen im Hintergrund:

function axesBackground () {
  axisX(-s1);                                              // Teil der x-Achse
  axisY(-s2);                                              // Teil der y-Achse
  axisZ(-s3);                                              // Teil der z-Achse
  }

// Halbachsen im Vordergrund:

function axesForeground () {
  axisX(s1);                                               // Teil der x-Achse
  axisY(s2);                                               // Teil der y-Achse
  axisZ(s3);                                               // Teil der z-Achse
  }
    
// Viertelebene in der y-z-Ebene:
// signY ... Vorzeichen der y-Koordinate (-1 oder +1)
// signZ ... Vorzeichen der z-Koordinate (-1 oder +1) 

function planeYZ (signY, signZ) {
  var yy = signY*max, zz = signZ*max;                      // Koordinaten der Ecke gegenüber dem Ursprung
  setPoint(0,0,0,0);                                       // 1. Polygonecke (Ursprung)
  setPoint(1,0,yy,0);                                      // 2. Polygonecke auf der y-Achse
  setPoint(2,0,yy,zz);                                     // 3. Polygonecke gegenüber dem Ursprung
  setPoint(3,0,0,zz);                                      // 4. Polygonecke auf der z-Achse
  fillPolygon(poly,colorYZ);                               // Ausgefülltes Polygon
  for (var i=0; i<=max; i++)                               // Für alle Gitterlinien parallel zur z-Achse ...
    line3D(0,i*signY,0,0,i*signY,zz,colorX);               // Gitterlinie zeichnen
  for (i=0; i<=max; i++)                                   // Für alle Gitterlinien parallel zur y-Achse ...
    line3D(0,0,i*signZ,0,yy,i*signZ,colorX);               // Gitterlinie zeichnen
  var uA = screenU(xA,yA), vA = screenV(xA,yA,zA);         // Bildschirmkoordinaten von A
  if (xA*c1 < 0 && isInside(uA,vA,poly)) visA = false;     // Falls A verdeckt, Flag für Sichtbarkeit ändern
  var uB = screenU(xB,yB), vB = screenV(xB,yB,zB);         // Bildschirmkoordinaten von B
  if (xB*c1 < 0 && isInside(uB,vB,poly)) visB = false;     // Falls B verdeckt, Flag für Sichtbarkeit ändern
  var par = new Array(4);                                  // Neues Array für 4 Parameterwerte
  var n = parameter2(par);                                 // Parameterwerte für Schnittpunkte mit Polygonseiten
  if (n < 2) return;                                       // Falls Polygon nicht geschnitten, abbrechen
  var minPar = par[0], maxPar = par[1];                    // Minimaler und maximaler Parameterwert
  if (c1*dx > 0) minPar = Math.max(-xA/dx,minPar);         // Eventuell minimalen Parameterwert korrigieren
  else if (c1*dx < 0) maxPar = Math.min(-xA/dx,maxPar);    // Eventuell maximalen Parameterwert korrigieren
  else if (c1*xA < 0) maxPar = minPar;                     // Eventuell nichts zu zeichnen
  if (minPar >= maxPar) return;                            // Falls kein Teil der Geraden sichtbar, abbrechen
  visiblePartsLine(minPar,maxPar);                         // Sichtbare Teile der Geraden wiederherstellen
  if (minPar == -xA/dx || maxPar == -xA/dx)                // Falls Endpunkt des sichtbaren Teils in y-z-Ebene ...
    pointPar(-xA/dx,false,"");                             // Schnittpunkt mit y-z-Ebene einzeichnen
  }
    
// Viertelebene in der x-z-Ebene:
// signX ... Vorzeichen der x-Koordinate (-1 oder +1)
// signZ ... Vorzeichen der z-Koordinate (-1 oder +1)

function planeXZ (signX, signZ) {
  var xx = signX*max, zz = signZ*max;                      // Koordinaten der Ecke gegenüber dem Ursprung
  setPoint(0,0,0,0);                                       // 1. Polygonecke (Ursprung)
  setPoint(1,xx,0,0);                                      // 2. Polygonecke auf der x-Achse
  setPoint(2,xx,0,zz);                                     // 3. Polygonecke gegenüber dem Ursprung
  setPoint(3,0,0,zz);                                      // 4. Polygonecke auf der z-Achse
  fillPolygon(poly,colorXZ);                               // Ausgefülltes Polygon
  for (var i=0; i<=max; i++)                               // Für alle Gitterlinien parallel zur z-Achse ...
    line3D(i*signX,0,0,i*signX,0,zz,colorY);               // Gitterlinie zeichnen 
  for (i=0; i<=max; i++)                                   // Für alle Gitterlinien parallel zur x-Achse ...
    line3D(0,0,i*signZ,xx,0,i*signZ,colorY);               // Gitterlinie zeichnen
  var uA = screenU(xA,yA), vA = screenV(xA,yA,zA);         // Bildschirmkoordinaten von A
  if (yA*c2 < 0 && isInside(uA,vA,poly)) visA = false;     // Falls A verdeckt, Flag für Sichtbarkeit ändern  
  var uB = screenU(xB,yB), vB = screenV(xB,yB,zB);         // Bildschirmkoordinaten von B
  if (yB*c2 < 0 && isInside(uB,vB,poly)) visB = false;     // Falls B verdeckt, Flag für Sichtbarkeit ändern
  var par = new Array(4);                                  // Neues Array für 4 Parameterwerte
  var n = parameter2(par);                                 // Parameterwerte für Schnittpunkte mit Polygonseiten
  if (n < 2) return;                                       // Falls Polygon nicht geschnitten, abbrechen
  var minPar = par[0], maxPar = par[1];                    // Minimaler und maximaler Parameterwert
  if (c2*dy > 0) minPar = Math.max(-yA/dy,minPar);         // Eventuell minimalen Parameterwert korrigieren
  else if (c2*dy < 0) maxPar = Math.min(-yA/dy,maxPar);    // Eventuell maximalen Parameterwert korrigieren
  else if (c2*yA < 0) maxPar = minPar;                     // Eventuell nichts zu zeichnen
  if (minPar >= maxPar) return;                            // Falls kein Teil der Geraden sichtbar, abbrechen
  visiblePartsLine(minPar,maxPar);                         // Sichtbare Teile der Geraden wiederherstellen
  if (minPar == -yA/dy || maxPar == -yA/dy)                // Falls Endpunkt des sichtbaren Teils in x-z-Ebene ...
    pointPar(-yA/dy,false,"");                             // Schnittpunkt mit x-z-Ebene einzeichnen
  }
    
// Viertelebene in der x-y-Ebene:
// signX ... Vorzeichen der x-Koordinate (-1 oder +1)
// signY ... Vorzeichen der y-Koordinate (-1 oder +1)

function  planeXY (signX, signY) {
  var xx = signX*max, yy = signY*max;                      // Koordinaten der Ecke gegenüber dem Ursprung
  setPoint(0,0,0,0);                                       // 1. Polygonecke (Ursprung)
  setPoint(1,xx,0,0);                                      // 2. Polygonecke auf der x-Achse
  setPoint(2,xx,yy,0);                                     // 3. Polygonecke gegenüber dem Ursprung
  setPoint(3,0,yy,0);                                      // 4. Polygonecke auf der y-Achse
  fillPolygon(poly,colorXY);                               // Ausgefülltes Polygon
  for (var i=0; i<=max; i++)                               // Für alle Gitterlinien parallel zur y-Achse ...
    line3D(i*signX,0,0,i*signX,yy,0,colorZ);               // Gitterlinie zeichnen
  for (i=0; i<=max; i++)                                   // Für alle Gitterlinien parallel zur x-Achse ...
    line3D(0,i*signY,0,xx,i*signY,0,colorZ);               // Gitterlinie zeichnen
  var uA = screenU(xA,yA), vA = screenV(xA,yA,zA);         // Bildschirmkoordinaten von A
  if (zA*c3 < 0 && isInside(uA,vA,poly)) visA = false;     // Falls A verdeckt, Flag für Sichtbarkeit ändern
  var uB = screenU(xB,yB), vB = screenV(xB,yB,zB);         // Bildschirmkoordinaten von B
  if (zB*c3 < 0 && isInside(uB,vB,poly)) visB = false;     // Falls B verdeckt, Flag für Sichtbarkeit ändern
  var par = new Array(4);                                  // Neues Array für 4 Parameterwerte
  var n = parameter2(par);                                 // Parameterwerte für Schnittpunkte mit Polygonseiten
  if (n < 2) return;                                       // Falls Polygon nicht geschnitten, abbrechen
  var minPar = par[0], maxPar = par[1];                    // Minimaler und maximaler Parameterwert
  if (c3*dz > 0) minPar = Math.max(-zA/dz,minPar);         // Eventuell minimalen Parameterwert korrigieren
  else if (c3*dz < 0) maxPar = Math.min(-zA/dz,maxPar);    // Eventuell maximalen Parameterwert korrigieren
  else if (c3*zA < 0) maxPar = minPar;                     // Eventuell nicht zu zeichnen
  if (minPar >= maxPar) return;                            // Falls kein Teil der Geraden sichtbar, abbrechen
  visiblePartsLine(minPar,maxPar);                         // Sichtbare Teile der Geraden wiederherstellen
  if (minPar == -zA/dz || maxPar == -zA/dz)                // Falls Endpunkt des sichtbaren Teils in x-y-Ebene ...
    pointPar(-zA/dz,false,"");                             // Schnittpunkt mit x-y-Ebene einzeichnen
  }
  
// Viertel-Koordinatenebenen im Hintergrund:

function planesBackground () {
  planeYZ(-s2,-s3);                                        // Teil der y-z-Ebene
  planeXZ(-s1,-s3);                                        // Teil der x-z-Ebene
  planeXY(-s1,-s2);                                        // Teil der x-y-Ebene
  }
  
// Viertel-Koordinatenebenen im Mittelgrund:

function planesMiddleground () {
  planeYZ(s2,-s3);                                         // Teil der y-z-Ebene 
  planeYZ(-s2,s3);                                         // Teil der y-z-Ebene
  planeXZ(s1,-s3);                                         // Teil der x-z-Ebene
  planeXZ(-s1,s3);                                         // Teil der x-z-Ebene
  planeXY(s1,-s2);                                         // Teil der x-y-Ebene
  planeXY(-s1,s2);                                         // Teil der x-y-Ebene
  }

// Viertel-Koordinatenebenen im Vordergrund:

function planesForeground () {
  planeYZ(s2,s3);                                          // Teil der y-z-Ebene
  planeXZ(s1,s3);                                          // Teil der x-z-Ebene
  planeXY(s1,s2);                                          // Teil der x-y-Ebene
  }
  
// Punkt mit Beschriftung:
// (x,y,z) ... Mathematische Koordinaten
// vis ....... Flag für Sichtbarkeit
// name ...... Name

function point (x, y, z, vis, name) {
  var u = screenU(x,y), v = screenV(x,y,z);                // Bildschirmkoordinaten (Pixel)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = "#000000";                               // Füllfarbe schwarz
  ctx.arc(u,v,2,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (vis) ctx.fill(); else ctx.stroke();                  // Je nach Sichtbarkeit ausgefüllter oder nicht ausgefüllter Kreis
  var du = a1*dx+a2*dy;                                    // Vektor in Richtung der Geraden, waagrechte Koordinate
  var dv = -(b1*dx+b2*dy+b3*dz);                           // Vektor in Richtung der geraden, senkrechte Koordinate
  var r = Math.sqrt(du*du+dv*dv);                          // Betrag des Vektors
  if (r > 0) {                                             // Falls Betrag größer als 0 ...
    var uT = Math.round(u-12*dv/r);                        // Waagrechte Bildschirmkoordinate Beschriftung
    var vT = Math.round(v+12*du/r);                        // Senkrechte Bildschirmkoordinate Beschriftung
    }
  else {uT = u+15; vT = v;}                                // Bildschirmkoordinaten Beschriftung, falls Betrag 0
  writeTextIndex(name,uT,vT,vis);                          // Beschriftung, eventuell mit Index
  }

// Punkt mit Beschriftung:
// par .... Parameterwert
// vis .... Flag für Sichtbarkeit
// name ... Name

function pointPar (par, vis, name) {
  var x = xA+par*dx, y = yA+par*dy, z = zA+par*dz;         // Räumliche Koordinaten
  point(x,y,z,vis,name);                                   // Punkt, Beschriftung
  }
  
// Sichtbare Teile der Geraden AB:
// min ... Minimaler Wert des Parameters
// max ... Maximaler Wert des Parameters
  
function visiblePartsLine (min, max) {
  partLine(min,Math.min(0,max));                           // Teil der Geraden mit lambda <= 0
  partLine(Math.max(1,min),max);                           // Teil der Geraden mit lambda >= 1
  var min2 = Math.max(min,0);                              // Minimaler Parameterwert 
  var max2 = Math.min(max,1);                              // Maximaler Parameterwert
  if (max2 < 1) partLine(min2,max2,2,colorVector);         // Teil des Richtungsvektors, nicht bis Spitze
  else arrow3D(min2,max2);                                 // Teil des Richtungsvektors, bis Spitze
  }
  
// Spaltenvektor (Klammerschreibweise):
// x, y, z ... Koordinaten
// (u,v) ..... Bezugspunkt (5 Pixel unter dem Mittelpunkt)

function vBrack (x, y, z, u, v) {
  newPath(1.5);                                            // Neuer Grafikpfad
  ctx.arc(u+65,v-5,80,200*DEG,160*DEG,true);               // Kreisbogen für öffnende Klammer vorbereiten
  ctx.stroke();                                            // Kreisbogen für öffnende Klammer zeichnen
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.arc(u-65,v-5,80,20*DEG,340*DEG,true);                // Kreisbogen für schließende Klammer vorbereiten
  ctx.stroke();                                            // Kreisbogen für schließende Klammer zeichnen
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillText(""+ToString(x),u,v-18);                     // 1. Koordinate (oben)
  ctx.fillText(""+ToString(y),u,v);                        // 2. Koordinate (Mitte)
  ctx.fillText(""+ToString(z),u,v+18);                     // 3. Koordinate (unten)
  } 
  
// Gleichung der Geraden:

function equation () {
  var v = 380;                                             // Senkrechte Bildschirmkoordinate
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.font = FONT2;                                        // Große Schrift
  if (dx != 0 || dy != 0 || dz != 0) {                     // Falls Richtungsvektor ungleich Nullvektor ...
    ctx.fillStyle = "#000000";                             // Schriftfarbe schwarz
    ctx.fillText(symbolPositionVector,100,v);              // Symbol für Ortsvektor
    line(95,v-16,105,v-16);                                // Vektorpfeil, waagrechte Linie
    line(101,v-18,105,v-16);                               // Vektorpfeil, obere Hälfte der Pfeilspitze
    line(101,v-14,105,v-16);                               // Vektorpfeil, untere Hälfte der Pfeilspitze
    ctx.fillText("=",120,v);                               // Gleichheitszeichen
    vBrack(xA,yA,zA,150,v);                                // Stützvektor (Spaltenvektor)
    ctx.fillText("+",180,v);                               // Pluszeichen
    ctx.fillText(symbolParameter,200,v);                   // Parameter
    vBrack(dx,dy,dz,230,v);                                // Richtungsvektor (Spaltenvektor)
    }
  else {                                                   // Falls Richtungsvektor gleich Nullvektor ...
    ctx.fillStyle = "#ff0000";                             // Schriftfarbe rot
    ctx.fillText(text03,u0,v);                             // Fehlermeldung (Gerade nicht definiert)
    }
  }
  
// Grafikausgabe:
// Seiteneffekt t0, theta, phi, state, a1, a2, b1, b2, b3, c1, c2, c3, s1, s2, s3, visA, visB
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (state != 0) {                                        // Falls Animation eingeschaltet ...
    var t = (new Date()-t0)/1000;                          // Verstrichene Zeit seit Bezugszeitpunkt (s)
    var angle = omega*t;                                   // Drehwinkel (Bogenmaß)
    t0 = new Date();                                       // Neuer Bezugszeitpunkt
    if (state == 1) theta += angle;                        // Entweder Drehung nach oben ...
    else if (state == 2) phi += angle;                     // ... oder Drehung nach rechts ...
    else if (state == 3) theta -= angle;                   // ... oder Drehung nach unten ...
    else if (state == 4) phi -= angle;                     // ... oder Drehung nach links
    if (theta > Math.PI/2) {                               // Falls "Nordpol" erreicht ...
      theta = Math.PI/2; state = 0;                        // ... Drehung beenden
      }
    if (theta < -Math.PI/2) {                              // Falls "Südpol" erreicht ...
      theta = -Math.PI/2; state = 0;                       // ... Drehung beenden
      }
    } 
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  calcCoeff();                                             // Koeffizienten für Projektion berechnen
  visA = visB = true;                                      // Flags für Sichtbarkeit von A und B
  if (dx != 0 || dy != 0 || dz != 0) {                     // Falls Richtungsvektor ungleich Nullvektor ...
    partLine(-INF,+INF);                                   // Komplette Gerade (später teilweise verdeckt) 
    arrow3D(0,1);                                          // Richtungsvektor (später ganz oder teilweise verdeckt)
    }
  planesBackground();                                      // Viertel-Koordinatenebenen im Hintergrund
  axesBackground();                                        // Halbe Koordinatenachsen im Hintergrund 
  planesMiddleground();                                    // Viertel-Koordinatenebenen im Mittelgrund
  planesForeground();                                      // Viertel-Koordinatenebenen im Vordergrund
  axesForeground();                                        // Halbe Koordinatenachsen im Vordergrund
  pointPar(0,visA,symbolPoint1);                           // Punkt A
  if (dx != 0 || dy != 0 || dz != 0) {                     // Falls Richtungsvektor ungleich Nullvektor ...
    partLine(-INF,0,0.5);                                  // Dünne Linie für verdeckten Teil der Geraden (lambda < 0)                                 
    partLine(1,INF,0.5);                                   // Dünne Linie für verdeckten Teil der Geraden (lambda > 1) 
    arrow3D(0,1,0.5);                                      // Dünner Pfeil für verdeckten Teil des Richtungsvektors
    pointPar(1,visB,symbolPoint2);                         // Punkt B
    }
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe für Clipping
  ctx.fillRect(0,0,width,10);                              // Clipping oben
  ctx.fillRect(0,0,10,height);                             // Clipping links
  ctx.fillRect(width-10,0,10,height);                      // Clipping rechts
  ctx.fillRect(0,height-80,width,80);                      // Clipping unten (für Geradengleichung)
  equation();                                              // Geradengleichung
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



