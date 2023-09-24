// Komponenten eines Vektors
// Java-Applet (22.07.1998) umgewandelt und ergänzt
// 16.10.2015 - 10.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel vector3d_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorX = "#ff0000";                                    // Farbe für x-Achse
var colorY = "#008000";                                    // Farbe für y-Achse
var colorZ = "#0000ff";                                    // Farbe für z-Achse

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var unit = 25;                                             // Einheit (Pixel)
var omega = Math.PI/30;                                    // Winkelgeschwindigkeit für Animation (rad/s)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ip1, ip2, ip3;                                         // Eingabefelder
var u0, v0;                                                // Mittelpunkt der Zeichenfläche (Pixel)
var vX, vY, vZ;                                            // Koordinaten des Vektors
var theta;                                                 // Winkel bezüglich x-y-Ebene (Bogenmaß)
var phi;                                                   // Winkel bezüglich x-Achse (Bogenmaß)
var a1, a2, b1, b2, b3;                                    // Koeffizienten für Parallelprojektion
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
  getElement("text1",text01);                              // Erklärender Text (Koordinaten)
  getElement("ip1a",text02);                               // Erklärender Text (x-Koordinate)
  ip1 = getElement("ip1b");                                // Eingabefeld für x-Koordinate
  getElement("ip2a",text03);                               // Erklärender Text (y-Koordinate)
  ip2 = getElement("ip2b");                                // Eingabefeld für y-Koordinate
  getElement("ip3a",text04);                               // Erklärender Text (z-Koordinate)
  ip3 = getElement("ip3b");                                // Eingabefeld für z-Koordinate
  bu0 = getElement("stop");                                // Kleiner Schaltknopf (Stopp)
  bu1 = getElement("up");                                  // Kleiner Schaltknopf (nach oben)
  bu2 = getElement("right");                               // Kleiner Schaltknopf (nach rechts)
  bu3 = getElement("down");                                // Kleiner Schaltknopf (nach unten)
  bu4 = getElement("left");                                // Kleiner Schaltknopf (nach links)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  u0 = width/2; v0 = height/2;                             // Mittelpunkt der Zeichenfläche (Pixel)
  vX = 3; vY = -4; vZ = 2;                                 // Startwerte für Koordinaten des Vektors
  updateInput();                                           // Einagbefelder aktualisieren
  focus(ip1);                                              // Fokus im ersten Eingabefeld
  theta = 15*Math.PI/180; phi = 15*Math.PI/180;            // Blickrichtung
  calcCoeff();                                             // Koeffizienten für Parallelprojektion berechnen
  t0 = new Date();                                         // Bezugszeitpunkt
  state = 0;                                               // Animation zunächst abgeschaltet
  timer = setInterval(paint,40);                           // Timer-Intervall 0,040 s
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Eingabefeld 1
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Eingabefeld 2
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Eingabefeld 3
  ip1.onblur = input;                                      // Reaktion auf Verlust des Fokus (Eingabefeld 1)
  ip2.onblur = input;                                      // Reaktion auf Verlust des Fokus (Eingabefeld 1)
  ip3.onblur = input;                                      // Reaktion auf Verlust des Fokus (Eingabefeld 1)
  bu0.onclick = function (e) {stopAnimation();}            // Reaktion auf Schaltknopf (Stopp)
  bu1.onclick = function (e) {modifyAnimation(1);}         // Reaktion auf Schaltknopf (oben)
  bu2.onclick = function (e) {modifyAnimation(2);}         // Reaktion auf Schaltknopf (rechts)
  bu3.onclick = function (e) {modifyAnimation(3);}         // Reaktion auf Schaltknopf (unten)
  bu4.onclick = function (e) {modifyAnimation(4);}         // Reaktion auf Schaltknopf (links)
  
  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt vX, vY, vZ, Wirkung auf Eingabefelder und Zeichenfläche
  
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
// Seiteneffekt state, timer, t0

function modifyAnimation (st) {
  input();                                                 // Eingabe
  if (state != st) state = st;                             // Falls neuer Schaltknopf, neue Richtung 
  else {stopAnimation(); return;}                          // Falls gleicher Schaltknopf wie bisher, Animation abschalten
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt state, timer

function stopAnimation () {
  input(); paint();
  state = 0;                                               // Animation abgeschaltet
  if (timer) clearInterval(timer);                         // Timer deaktivieren
  }
  
//-----------------------------------------------------------------------------

// Koeffizienten für die Parallelprojektion berechnen:
// Seiteneffekt a1, a2, b1, b2, b3

function calcCoeff () { 
  var sin = Math.sin(theta), cos = Math.cos(theta);
  a1 = Math.sin(phi); a2 = -Math.cos(phi);                 // Nach "rechts" 
  b1 = sin*a2; b2 = -sin*a1; b3 = -cos;                    // Nach "oben"           
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
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
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
   
// Gesamte Eingabe:
// Seiteneffekt vX, vY, vZ, Wirkung auf Eingabefelder und Zeichenfläche

function input () {
  var ae = document.activeElement;                         // Aktives Element
  vX = inputNumber(ip1,0,true,-5,5);                       // x-Koordinate
  vY = inputNumber(ip2,0,true,-5,5);                       // y-Koordinate
  vZ = inputNumber(ip3,0,true,-5,5);                       // z-Koordinate
  if (state == 0) paint();                                 // Falls Animation abgeschaltet, neu zeichnen
  if (ae == ip1) focus(ip2);                               // Fokus für das nächste Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus für das nächste Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(vX,0,true);                         // Eingabefeld für x-Koordinate
  ip2.value = ToString(vY,0,true);                         // Eingabefeld für y-Koordinate
  ip3.value = ToString(vZ,0,true);                         // Eingabefeld für z-Koordinate
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie der Dicke 1:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional)
// w ......... Liniendicke (optional)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
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
  
// Text mit optionalem Index ausgeben:
// s ....... Zeichenkette (Text und Index durch '_' getrennt)
// (x,y) ... Position (Pixel)
// Wichtig: Es wird ctx.textalign = "left" vorausgesetzt.

function writeTextIndex (s, x, y) {
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
  
// Koordinatenachse mit Ticks und Beschriftung:
// i ... Nummer (1, 2 oder 3)
// s ... Beschriftung (zum Beispiel "x" oder "x_1")
// c ... Farbe

function axis (i, s, c) {
  var xUnit = (i==1 ? 1 : 0);                              // x-Koordinate für Einheit                         
  var yUnit = (i==2 ? 1 : 0);                              // y-Koordinate für Einheit
  var zUnit = (i==3 ? 1 : 0);                              // z-Koordinate für Einheit
  var duUnit = unit*(a1*xUnit+a2*yUnit);                   // Bildschirmkoordinate für Einheit (relativ zum Ursprung)
  var dvUnit = unit*(b1*xUnit+b2*yUnit+b3*zUnit);          // Bildschirmkoordinate für Einheit (relativ zum Ursprung)
  var len = 6.5;                                           // Länge der positiven Achse
  ctx.strokeStyle = c;                                     // Farbe übernehmen
  arrow(u0-len*duUnit,v0-len*dvUnit,u0+len*duUnit,v0+len*dvUnit);  // Pfeil zeichnen
  var duTick = -dvUnit, dvTick = duUnit;                   // Vektor senkrecht zur Achse
  var len2 = Math.sqrt(duTick*duTick+dvTick*dvTick);       // Betrag dieses Vektors
  if (len2 < 0.1) return;                                  // Falls Betrag zu klein, abbrechen
  duTick *= 3/len2; dvTick *= 3/len2;                      // Vektor auf Betrag 3 bringen
  for (var i=-5; i<=5; i++) {                              // Für alle ganzen Zahlen von -5 bis 5 ...
    if (i == 0) continue;                                  // Falls 0, weiterzählen
    var u = u0+i*unit*(a1*xUnit+a2*yUnit);                 // Waagrechte Bildschirmkoordinate (Pixel)
    var v = v0+i*unit*(b1*xUnit+b2*yUnit+b3*zUnit);        // Senkrechte Bildschirmkoordinate (Pixel)
    line(u-duTick,v-dvTick,u+duTick,v+dvTick);             // Tick zeichnen
    }
  u = u0+len*unit*(a1*xUnit+a2*yUnit)+3*duTick;            // Waagrechte Bildschirmkoordinate für Beschriftung (Pixel)
  v = v0+len*unit*(b1*xUnit+b2*yUnit+b3*zUnit)+3*dvTick;   // Senkrechte Bildschirmkoordinate für Beschriftung (Pixel)
  writeTextIndex(s,u,v);                                   // Beschriftung
  }

// Koordinatensystem:

function coordSystem () {
  axis(1,symbolX,colorX);                                  // x-Achse
  axis(2,symbolY,colorY);                                  // y-Achse
  axis(3,symbolZ,colorZ);                                  // z-Achse
  }
  
// Dicker Vektorpfeil (vom Ursprung aus):
// x, y, z ... Räumliche Koordinaten
// c ......... Farbe

function thickArrow (x, y, z, c) {
  var u = u0+unit*(a1*x+a2*y);                             // Waagrechte Bildschirmkoordinate der Spitze (Pixel)                     
  var v = v0+unit*(b1*x+b2*y+b3*z);                        // Senkrechte Bildschirmkoordinate der Spitze (Pixel)
  ctx.strokeStyle = c;                                     // Farbe übernehmen
  arrow(u0,v0,u,v,2);                                      // Dicken Pfeil zeichnen
  }
  
// Anfangspunkt für Grafikpfad festlegen:
// x, y, z ... Räumliche Koordinaten
  
function moveTo (x, y, z) {
  ctx.moveTo(u0+unit*(a1*x+a2*y),v0+unit*(b1*x+b2*y+b3*z));
  }
  
// Grafikpfad um Linie erweitern:
// x, y, z ... räumliche Koordinaten
  
function lineTo (x, y, z) {
  ctx.lineTo(u0+unit*(a1*x+a2*y),v0+unit*(b1*x+b2*y+b3*z));
  }
  
// Pfeile für Komponenten, Hilfslinien parallel zu den Achsen:

function components () {
  if (vX != 0) thickArrow(vX,0,0,colorX);                  // Pfeil für x-Komponente
  if (vY != 0) thickArrow(0,vY,0,colorY);                  // Pfeil für y-Komponente
  if (vZ != 0) thickArrow(0,0,vZ,colorZ);                  // Pfeil für z-Komponente
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  moveTo(vX,0,0);                                          // Anfangspunkt auf der x-Achse
  lineTo(vX,vY,0);                                         // Weiter in positiver y-Richtung
  lineTo(vX,vY,vZ);                                        // Weiter in positiver z-Richtung
  lineTo(vX,0,vZ);                                         // Weiter in negativer y-Richtung
  lineTo(vX,0,0);                                          // Weiter in negativer z-Richtung
  moveTo(0,vY,0);                                          // Neuer Anfangspunkt auf der y-Achse
  lineTo(vX,vY,0);                                         // Weiter in positiver x-Richtung
  moveTo(vX,vY,vZ);                                        // Neuer Anfangspunkt (Spitze des Vektorpfeils)
  lineTo(0,vY,vZ);                                         // Weiter in negativer x-Richtung
  lineTo(0,vY,0);                                          // Weiter in negativer z-Richtung
  moveTo(vX,0,vZ);                                         // Neuer Anfangspunkt in der x-z-Ebene
  lineTo(0,0,vZ);                                          // Weiter in negativer x-Richtung
  lineTo(0,vY,vZ);                                         // Weiter in positiver y-Richtung
  ctx.stroke();                                            // Hilfslinien zeichnen
  }

// Grafikausgabe:
  
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
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Ausrichtung linksbündig
  calcCoeff();                                             // Koeffizienten für Projektion berechnen
  coordSystem();                                           // Koordinatensystem zeichnen
  thickArrow(vX,vY,vZ,"#000000");                          // Vektorpfeil zeichnen
  components();                                            // Komponenten und Hilfslinien zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

