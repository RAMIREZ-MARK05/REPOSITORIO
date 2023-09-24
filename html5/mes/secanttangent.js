// Sekanten- und Tangentensteigung (Beispiel Quadratfunktion)
// Java-Applet (22.02.1998) umgewandelt
// 21.04.2014 - 19.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel secanttangent_de.js) abgespeichert.

// Konstanten:

var colorBackground = "#ffff00";                 // Hintergrundfarbe
var colorSecant = "#0000ff";                     // Farbe für Sekante
var colorTangent = "#ff0000";                    // Farbe für Tangente

var lb1, lb2, lb3, lb4;                          // Ausgabefelder
var sl;                                          // Schieberegler

var unit = 40;                                   // Längeneinheit (Pixel)
var canvas, ctx;                                 // Zeichenfläche, Grafikkontext
var width, height;                               // Abmessungen der Zeichenfläche (Pixel)
var u0, v0;                                      // Position des Ursprungs (Pixel)

// Attribute:

var active;                                      // Flag für Zugmodus
var P;                                           // Fester Punkt P (Koordinaten x, y als Attribute)
var Q;                                           // Beweglicher Punkt Q (Koordinaten x, y als Attribute)

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
  u0 = width/2; v0 = 300;                                  // Bildschirmkoordinaten des Ursprungs
  P = {x: 1, y: 1};                                        // Fester Punkt 
  Q = {x: 2, y: 4};                                        // Variabler Punkt
  getElement("lb1a",text01);                               // Erklärender Text (fester Punkt)
  lb1 = getElement("lb1b");                                // Ausgabefeld für Punkt P
  lb1.innerHTML = "P ("+toString3(P.x)+"|"+toString3(P.y)+")"; // Ausgabe der Koordinaten 
  sl = getElement("sl");                                   // Schieberegler für Punkt P 
  sl.value = 6;                                            // Anfangswert (zu x = 1)
  getElement("lb2a",text02);                               // Erklärender Text (variabler Punkt)
  lb2 = getElement("lb2b");                                // Ausgabefeld für Punkt Q
  lb2.innerHTML = "Q ("+toString3(Q.x)+"|"+toString3(Q.y)+")"; // Ausgabe der Koordinaten 
  getElement("lb3a",text03);                               // Erklärender Text (Sekantensteigung)
  lb3 = getElement("lb3b");                                // Ausgabefeld für Sekantensteigung
  updateSecantSlope();                                     // Ausgabe der Sekantensteigung
  getElement("lb4a",text04);                               // Erklärender Text (Tangentensteigung)
  lb4 = getElement("lb4b");                                // Ausgabefeld für Tangentensteigung
  lb4.innerHTML = toString3(2*P.x);                        // Ausgabe der Tangentensteigung
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  paint();                                                 // Zeichnen
  
  sl.onchange = reactionSlider;                  // Reaktion auf Schieberegler
   
  canvas.onmousedown = function (e) {            // Reaktion auf Drücken der Maustaste
    reactionDown(e.clientX,e.clientY);           // Eventuell Zugmodus aktivieren                     
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Berührung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       // Eventuell Zugmodus aktivieren
    if (active) e.preventDefault();              // In diesem Fall Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    active = false;                              // Zugmodus deaktivieren                             
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Berührung
    active = false;                              // Zugmodus deaktivieren
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Bewegen der Maus
    if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
    reactionMove(e.clientX,e.clientY);           // Position ermitteln und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
    var obj = e.changedTouches[0];
    reactionMove(obj.clientX,obj.clientY);       // Position ermitteln und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }  
    
  } // Ende der Methode start
  
// Reaktion auf Schieberegler:
// Seiteneffekt P, Aktualisierungen in der Schaltfläche

function reactionSlider (e) {
  P.x = -2+sl.value/2; P.y = P.x*P.x;            // Neue Koordinaten von P
  var x3 = toString3(P.x), y3 = toString3(P.y);  // Umwandlung der Koordinaten in Zeichenketten
  lb1.innerHTML = "P ("+x3+"|"+y3+")";           // Aktualisierung von P in der Schaltfläche
  updateSecantSlope();                           // Aktualisierung der Sekantensteigung (Ausgabefeld lb3)
  lb4.innerHTML = toString3(2*P.x);              // Aktualisierung der Tangentensteigung in der Schaltfläche
  paint();                                       // Neu zeichnen
  }
  
// Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// Seiteneffekt active

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  active = (distance(u,v) < 20);                 // Zugmodus, falls geringer Abstand zum Punkt C
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// Seiteneffekt Q, Aktualisierungen in der Schaltfläche

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  u = Math.round(u); v = Math.round(v);          // Bildschirmkoordinaten ganzzahlig machen
  if (Math.abs(u-u0) > unit) {                   // Falls Kurve steiler als 45° ...
    Q.y = (v0-v)/unit; Q.x = Math.sqrt(Q.y);     // Koordinaten von Q abhängig von senkrechter Koordinate
    Q.x = Math.round(Q.x*unit)/unit;             // x-Koordinate sollte Vielfaches von 1/unit sein 
    Q.y = Q.x*Q.x;                               // y-Koordinate anpassen
    if (u < u0) Q.x = -Q.x;                      // Korrektur für x < 0
    }
  else {                                         // Falls Kurve flacher als 45° ...
    Q.x = (u-u0)/unit; Q.y = Q.x*Q.x;            // Koordinaten von Q abhängig von waagrechter Koordinate
    }
  var x3 = toString3(Q.x), y3 = toString3(Q.y);  // Umwandlung der Koordinaten in Zeichenketten
  lb2.innerHTML = "Q ("+x3+"|"+y3+")";           // Aktualisierung von Q in der Schaltfläche
  updateSecantSlope();                           // Aktualisierung der Sekantensteigung (Ausgabefeld lb3)
  paint();                                       // Neu zeichnen
  }
  
// Abstand zum Punkt Q (Pixel):
// u, v ... Aktuelle Position bezüglich Zeichenfläche
  
function distance (u, v) {
  var uQ = u0+Q.x*unit, vQ = v0-Q.y*unit;        // Bildschirmkoordinaten von Q
  var du = u-uQ, dv = v-vQ;                      // Koordinatendifferenzen
  return Math.sqrt(du*du+dv*dv);                 // Abstand (Pythagoras)
  }
  
// Umwandlung einer Zahl in eine Zeichenkette (3 Nachkommastellen):
// z ... Gegebene Zahl

function toString3 (z) {
  return z.toFixed(3).replace(".",decimalSeparator);
  }
  
// Aktualisierung der Sekantensteigung:

function updateSecantSlope () {
  var mS = (Q.y-P.y)/(Q.x-P.x);                  // Sekantensteigung
  var mS3 = toString3(mS);                       // Umwandlung in Zeichenkette
  if (Q.x == P.x) mS3 = textUndefValue;          // Ausnahmefall (Sekantensteigung nicht definiert)
  lb3.innerHTML = mS3;                           // Aktualisierung der Sekantensteigung in der Schaltfläche
  }
  
//-----------------------------------------------------------------------------

// Clipping (Beschränkung auf einen Teil der Zeichenfläche):

function clipping (border) {
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(border,border);                     // Anfangspunkt links oben
  ctx.lineTo(width-border,border);               // Linie nach rechts oben
  ctx.lineTo(width-border,height-border);        // Linie nach rechts unten
  ctx.lineTo(border,height-border);              // Linie nach links unten
  ctx.closePath();                               // Linie nach links oben (Anfangspunkt)
  ctx.clip();                                    // Clipping durchführen
  }

// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                 // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                    // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);           // Länge
  if (length == 0) return;                       // Abbruch, falls Länge 0
  dx /= length; dy /= length;                    // Einheitsvektor
  var s = 2.5*w+7.5;                             // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;              // Hilfspunkt für Pfeilspitze         
  var h = 0.5*w+3.5;                             // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;          // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;          // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;          // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                               // Neuer Pfad
  ctx.lineWidth = w;                             // Liniendicke
  ctx.moveTo(x1,y1);                             // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);             // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                      // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                  // Linie zeichnen
  if (length < 5) return;                        // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                               // Neuer Pfad für Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;               // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                           // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                         // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                             // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                         // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                               // Zurück zum Anfangspunkt
  ctx.fill();                                    // Pfeilspitze zeichnen 
  }
  
// Neuer Pfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.lineWidth = 1;                             // Liniendicke
  }

// Koordinatensystem zeichnen:

function drawCoordSystem () {
  newPath();                                     // Neuer Pfad                 
  arrow(u0-6*unit,v0,u0+6*unit,v0);              // x-Achse
  arrow(u0,v0+2*unit,u0,v0-7*unit);              // y-Achse
  ctx.textAlign = "center";                      // Text waagrecht zentrieren
  ctx.fillText("x",u0+6*unit-5,v0+15);           // Beschriftung x-Achse
  newPath();                                     // Neuer Pfad
  for (var x = -5; x <= 5; x++) {                // Für alle ganzzahligen x-Werte ...
    var u = u0+x*unit;                           // Waagrechte Bildschirmkoordinate
    ctx.moveTo(u,v0-3); ctx.lineTo(u,v0+3);      // Kurze Linie zum Pfad hinzufügen
    if (x != 0) ctx.fillText(x,u,v0+15);         // Beschriftung
    }
  ctx.textAlign = "right";                       // Text rechtsbündig ausrichten
  ctx.fillText("y",u0-5,v0-7*unit+8);            // Beschriftung y-Achse
  for (var y = -1; y <= 6; y++) {                // Für alle ganzzahligen y-Werte ...
    var v = v0-y*unit;                           // Senkrechte Bildschirmkoordinate
    ctx.moveTo(u0-3,v); ctx.lineTo(u0+3,v);      // Kurze Linie zum Pfad hinzufügen
    if (y != 0) ctx.fillText(y,u0-5,v+5);        // Beschriftung
    }
  ctx.stroke();                                  // Linien zeichnen
  }
  
// Normalparabel zeichnen (für -3 <= x <= 3):

function drawParabola () {
  newPath();                                     // Neuer Pfad
  var x = -3, u = u0+x*unit;                     // x-Wert (mathematisch/Bildschirmkoordinaten)
  var y = x*x, v = v0-y*unit;                    // y-Wert (mathematisch/Bildschirmkoordinaten)
  ctx.moveTo(u,v);                               // Anfangspunkt (-3|9), außerhalb der Zeichenfläche
  while (x < 3) {                                // Solange x im Intervall [-3;3] ...
    u++; x = (u-u0)/unit;                        // x-Wert (mathematisch/Bildschirmkoordinaten)
    y = x*x; v = v0-y*unit;                      // y-Wert (mathematisch/Bildschirmkoordinaten)
    ctx.lineTo(u,v);                             // Kurze Linie zum Pfad hinzufügen
    }
  ctx.stroke();                                  // Kurve zeichnen
  }
  
// Punkt markieren, Hilfslinien zum Ablesen der Koordinaten zeichnen:
// p ... Punkt (mathematische Koordinaten x, y als Attribute)
// c ... Füllfarbe

function drawPoint (p, c) {
  var u = u0+p.x*unit, v = v0-p.y*unit;          // Bildschirmkoordinaten
  newPath();                                     // Neuer Pfad
  ctx.strokeStyle = ctx.fillStyle = c;           // Linien- und Füllfarbe
  ctx.moveTo(u,v0);                              // Anfangspunkt auf der x-Achse 
  ctx.lineTo(u,v);                               // Senkrechte Linie zum Punkt
  ctx.lineTo(u0,v);                              // Waagrechte Linie zur y-Achse
  ctx.stroke();                                  // Linien zeichnen
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(u,v,2,0,2*Math.PI,true);               // Kleinen Kreis vorbereiten
  ctx.fill();                                    // Kreis ausfüllen
  if (c == colorSecant) {                        // Falls Punkt Q, Beschriftung rechts oben
    ctx.textAlign = "left";                      // Text linksbündig ausrichten
    ctx.fillText("Q",u+4,v-2);                   // Beschriftung 
    }
  else {                                         // Falls Punkt P, Beschriftung links oben
    ctx.textAlign = "right";                     // Text rechtsbündig ausrichten
    ctx.fillText("P",u,v-2);                     // Beschriftung
    }
  }
  
// Gerade durch P zeichnen (Sekante oder Tangente):
// m ... Steigung
// c ... Linienfarbe

function drawLine (m, c) {
  newPath();                                     // Neuer Pfad 
  ctx.strokeStyle = c;                           // Linienfarbe
  if (m != 0) {                                  // Falls Gerade nicht waagrecht ...
    var yBottom = (v0-height)/unit;              // y-Koordinate für Punkt am unteren Rand 
    var yTop = v0/unit;                          // y-Koordinate für Punkt am oberen Rand
    var xBottom = P.x+(yBottom-P.y)/m;           // x-Koordinate für Punkt am unteren Rand
    var xTop = P.x+(yTop-P.y)/m;                 // y-Koordinate für Punkt am oberen Rand
    var uBottom = u0+xBottom*unit;               // Waagrechte Bildschirmkoordinate für Punkt am unteren Rand
    var uTop = u0+xTop*unit;                     // Waagrechte Bildschirmkoordinate für Punkt am oberen Rand
    ctx.moveTo(uBottom,height);                  // Anfangspunkt (unten)
    ctx.lineTo(uTop,0);                          // Linie zum Endpunkt (oben) vorbereiten
    }
  else {                                         // Falls Gerade waagrecht ...
    var v = v0-P.y*unit;                         // Senkrechte Bildschirmkoordinate    
    ctx.moveTo(0,v); ctx.lineTo(width,v);        // Linie vorbereiten 
    }
  ctx.stroke();                                  // Gerade zeichnen
  } 
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                // Hintergrund ausfüllen
  clipping(10);                                  // 10 Pixel Rand lassen
  ctx.font = "normal normal bold 12px sans-serif";  // Zeichensatz
  drawCoordSystem();                             // Koordinatensystem zeichnen
  drawParabola();                                // Funktionsgraphen (Normalparabel) zeichnen
  drawLine(2*P.x,colorTangent);                  // Tangente in P zeichnen
  if (Q.x != P.x)                                // Falls definiert ...
    drawLine((Q.y-P.y)/(Q.x-P.x),colorSecant);   // Sekante durch P und Q zeichnen
  drawPoint(P,colorTangent);                     // Festen Punkt P markieren
  drawPoint(Q,colorSecant);                      // Festen Punkt Q markieren
  ctx.textAlign = "left";                        // Text linksbündig
  ctx.fillStyle = "#000000";                     // Füllfarbe schwarz
  ctx.fillText("y = f(x) = x\u00b2",20,20);      // Funktionsgleichung
  }
  
document.addEventListener("DOMContentLoaded",start,false);


