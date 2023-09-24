// Kugeldreieck
// Java-Applet (06.02.1999) umgewandelt
// 21.02.2016 - 25.02.2016

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel sphericaltriangle_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff0000";                                // Farbe für Ecken

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var R = 160;                                               // Radius (Pixel)
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var NI = 180;                                              // Zahl der Teilintervalle (Großkreise)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var op1a, op1b, op1c, op1s, op2a, op2b, op2c, op2s;        // Ausgabefelder
var x0, y0;                                                // Mittelpunkt (Bildschirmkoordinaten)
var nr;                                                    // Index der ausgewählten Ecke (0 bis 2 oder -1)
var a, b, c;                                               // Arrays für räumliche Koordinaten der Ecken
var xA, yA, xB, yB, xC, yC;                                // Bildschirmkoordinaten der Ecken
var p, n;                                                  // Arrays für Hilfsvektoren
var lengthA, lengthB, lengthC;                             // Seitenlängen (Bogenmaß)
var alpha, beta, gamma;                                    // Winkelgrößen (Bogenmaß)

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
  getElement("lb1",text01);                                // Erklärender Text (Seiten)
  op1a = getElement("op1a");                               // Ausgabefeld (Seite a)
  op1b = getElement("op1b");                               // Ausgabefeld (Seite b)
  op1c = getElement("op1c");                               // Ausgabefeld (Seite c)
  op1s = getElement("op1s");                               // Ausgabefeld (Seitensumme)
  getElement("lb2",text06);                                // Erklärender Text (Seiten)
  op2a = getElement("op2a");                               // Ausgabefeld (Winkel alpha)
  op2b = getElement("op2b");                               // Ausgabefeld (Winkel beta)
  op2c = getElement("op2c");                               // Ausgabefeld (Winkel gamma)
  op2s = getElement("op2s");                               // Ausgabefeld (Winkelsumme)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  
  x0 = y0 = height/2;                                      // Kugelmittelpunkt (Bildschirmkoordinaten)
  a = arrayVertex(-0.7,-0.6);                              // Array für Ecke A (Einheitsvektor)
  b = arrayVertex(0.5,-0.6);                               // Array für Ecke B (Einheitsvektor)
  c = arrayVertex(0.2,0.4);                                // Array für Ecke C (Einheitsvektor)
  p = new Array(3); n = new Array(3);                      // Arrays für Hilfsvektoren
  calculation();                                           // Berechnungen
  updateOutput();                                          // Ausgabe aktualisieren
  nr = -1;                                                 // Zunächst keine Ecke ausgewählt
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
  if (nr != -1) e.preventDefault();                        // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = -1;                                                 // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  nr = -1;                                                 // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr == -1) return;                                    // Abbrechen, falls keine Ecke ausgewählt
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr == -1) return;                                    // Abbrechen, falls keine Ecke ausgewählt
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
    
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)  
  var d = distance(u,v,a);                                 // Abstand von Ecke A (Pixel)
  var min = d;                                             // Variable für minimalen Abstand (Pixel) 
  nr = 0;                                                  // Zunächst Ecke A ausgewählt
  d = distance(u,v,b);                                     // Abstand von Ecke B (Pixel) 
  if (d < min) {                                           // Falls bisheriges Minimum unterschritten ...
    nr = 1; min = d;                                       // Index und minimalen Abstand aktualisieren
    }
  d = distance(u,v,c);                                     // Abstand von Ecke C (Pixel) 
  if (d < min) {                                           // Falls bisheriges Minimum unterschritten ...
    min = d; nr = 2;                                       // Index und minimalen Abstand aktualisieren
    }
  if (min > 20) nr = -1;                                   // Falls Abstand zu groß, keine Ecke auswählen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// nr >= 0 vorausgesetzt!
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt 

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var du = u-x0, dv = y0-v;                                // Komponenten des Verbindungsvektors (Pixel) 
  var d = Math.sqrt(du*du+dv*dv);                          // Abstand vom Mittelpunkt (Pixel)
  if (d > R) {                                             // Falls Position außerhalb der Kugel ...
    du *= R/d; dv *= R/d;                                  // Komponenten des Verbindungsvektors verkleinern
    }     
  p[1] = du/R; p[2] = dv/R;                                // Räumliche Koordinaten waagrecht/senkrecht 
  d = Math.max(1-p[1]*p[1]-p[2]*p[2],0);                   // Quadrat der räumlichen Koordinate in Blickrichtung
  p[0] = Math.sqrt(d);                                     // Räumliche Koordinate in Blickrichtung              
  // Seitenlängen unter 1 Grad vermeiden:
  var cosmax = 0.99985;                                    // Maximaler erlaubter Cosinuswert
  if (nr != 0 && dotProduct(p,a) > cosmax) return;         // Falls Seite a zu kurz, abbrechen
  if (nr != 1 && dotProduct(p,b) > cosmax) return;         // Falls Seite b zu kurz, abbrechen
  if (nr != 2 && dotProduct(p,c) > cosmax) return;         // Falls Seite c zu kurz, abbrechen
  if (nr == 0) {                                           // Falls Ecke A ausgewählt ...
    if (tripleProduct(b,c,p) < 0) return;                  // Falls negativer Drehsinn, abbrechen
    a[0] = p[0]; a[1] = p[1]; a[2] = p[2];                 // Ortsvektor von A aktualisieren 
    }  
  if (nr == 1) {                                           // Falls Ecke B ausgewählt ...
    if (tripleProduct(c,a,p) < 0) return;                  // Falls negativer Drehsinn, abbrechen
    b[0] = p[0]; b[1] = p[1]; b[2] = p[2];                 // Ortsvektor von B aktualisieren 
    }      
  if (nr == 2) {                                           // Falls Ecke C ausgewählt ...
    if (tripleProduct(a,b,p) < 0) return;                  // Falls negativer Drehsinn, abbrechen
    c[0] = p[0]; c[1] = p[1]; c[2] = p[2];                 // Ortsvektor von C aktualisieren 
    }         
  calculation();                                           // Berechnungen                                           
  updateOutput();                                          // Ausgabefelder aktualisieren
  paint();                                                 // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Räumliche Koordinaten einer Ecke:
// x ... Waagrechte Koordinate
// y ... Senkrechte Koordinate
// Vorausgesetzt: x*x+y*y <= 1
// Rückgabewert: Array der Dimension 3 mit Ortsvektor der Ecke (Betrag 1)

function arrayVertex (x, y) {
  p = new Array(3);                                        // Neues Array
  p[1] = x; p[2] = y;                                      // Waagrechte und senkrechte Koordinate übernehmen
  p[0] = Math.sqrt(1-x*x-y*y);                             // Koordinate in Blickrichtung
  return p;                                                // Rückgabewert
  }

// Entfernung von einem Punkt:
// (u,v) ... Position (Bildschirmkoordinaten)
// p ....... Array für Ortsvektor eines Punktes (Betrag 1)
// Rückgabewert: Abstand (Pixel)

function distance (u, v, p) {
  var du = u-(x0+R*p[1]), dv = v-(y0-R*p[2]);              // Koordinatendifferenz waagrecht/senkrecht (Pixel)
  return Math.sqrt(du*du+dv*dv);                           // Rückgabewert
  }

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen

function ToString (n, d) {
  var s = n.toFixed(d);                                    // Zeichenkette mit Dezimalpunkt
  s = s.replace("-","\u2212");                             // Langes Minuszeichen verwenden
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Skalarprodukt:
// a, b ... Gegebene Vektoren (Dimension 3)
// Rückgabewert: Skalarprodukt

function dotProduct (a, b) {
  return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];                    // Rückgabewert
  }

// Vektorprodukt:
// a, b ... Gegebene Vektoren (Dimension 3)
// res .... Vorbereitetes Array für Ergebnisvektor (Dimension 3)

function crossProduct (a, b, res) {
  res[0] = a[1]*b[2]-a[2]*b[1];                            // 1. Koordinate
  res[1] = a[2]*b[0]-a[0]*b[2];                            // 2. Koordinate
  res[2] = a[0]*b[1]-a[1]*b[0];                            // 3. Koordinate
  }
  
// Spatprodukt:
// a, b, c ... Gegebene Vektoren (Dimension 3)
// Rückgabewert: Spatprodukt (Determinante)

function tripleProduct (a, b, c) {
  var s = a[0]*b[1]*c[2]+b[0]*c[1]*a[2]+c[0]*a[1]*b[2];    // Positiv gezählte Summanden
  s = s-a[2]*b[1]*c[0]-b[2]*c[1]*a[0]-c[2]*a[1]*b[0];      // Negativ gezählte Summanden
  return s;                                                // Rückgabewert
  }
  
// Normierung eines Vektors:
// a ... Array des gegebenen Vektors (Dimension 3)
// Bemerkung: Nullvektor bleibt unverändert

function normalize (a) {
  var n = Math.sqrt(dotProduct(a,a));                      // Betrag des gegebenen Vektors
  if (n > 0) {                                             // Falls Betrag nicht gleich 0 ...
    a[0] /= n; a[1] /= n; a[2] /= n;                       // Koordinaten durch Betrag dividieren
    }
  }
  
// Winkel zwischen zwei Einheitsvektoren (Bogenmaß):
// a, b ... Gegebene Einheitsvektoren

function angleVV (a, b) {
  var s = dotProduct(a,b);                                 // Skalarprodukt
  if (s > 1) s = 1; if (s < -1) s = -1;                    // Korrektur möglicher Rundungsfehler
  return Math.acos(s);                                     // Rückgabewert
  }
  
// Winkelgröße (Bogenmaß):
// a ... Punkt auf 1. Schenkel (Einheitsvektor)
// b ... Scheitel (Einheitsvektor)
// c ... Punkt auf 2. Schenkel (Einheitsvektor)

function angle (a, b, c) {
  var n1 = new Array(3), n2 = new Array(3);                // Arrays für Normalenvektoren
  crossProduct(b,a,n1); normalize(n1);                     // Normaleneinheitsvektor der Ebene von B und A
  crossProduct(b,c,n2); normalize(n2);                     // Normaleneinheitsvektor der Ebene von B und C
  return angleVV(n1,n2);                                   // Rückgabewert
  }
  
// Berechnungen:
// Seiteneffekt lengthA, lengthB, lengthC, alpha, beta, gamma, xA, yA, xB, yB, xC, yC

function calculation () {
  lengthA = angleVV(b,c);                                  // Seitenlänge a 
  lengthB = angleVV(c,a);                                  // Seitenlänge b
  lengthC = angleVV(a,b);                                  // Seitenlänge c
  alpha = angle(b,a,c);                                    // Winkelgröße alpha
  beta = angle(c,b,a);                                     // Winkelgröße beta
  gamma = angle(a,c,b);                                    // Winkelgröße gamma
  xA = x0+R*a[1]; yA = y0-R*a[2];                          // Bildschirmkoordinaten der Ecke A
  xB = x0+R*b[1]; yB = y0-R*b[2];                          // Bildschirmkoordinaten der Ecke B
  xC = x0+R*c[1]; yC = y0-R*c[2];                          // Bildschirmkoordinaten der Ecke C
  }

// Zeichenkette für Angabe einer Winkelgröße in Grad:
    
function toDeg (w) {
  return ToString(w/DEG,3)+"&deg;";                        // Rückgabewert
  }
  
// Aktualisierung der Ausgabefelder:

function updateOutput () {
  op1a.innerHTML = text02+toDeg(lengthA);                  // Seitenlänge a
  op1b.innerHTML = text03+toDeg(lengthB);                  // Seitenlänge b
  op1c.innerHTML = text04+toDeg(lengthC);                  // Seitenlänge c
  op1s.innerHTML = text05+toDeg(lengthA+lengthB+lengthC);  // Seitensumme
  op2a.innerHTML = text07+toDeg(alpha);                    // Winkelgröße alpha
  op2b.innerHTML = text08+toDeg(beta);                     // Winkelgröße beta
  op2c.innerHTML = text09+toDeg(gamma);                    // Winkelgröße gamma
  op2s.innerHTML = text10+toDeg(alpha+beta+gamma);         // Winkelsumme
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath() {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt markieren (ausgefüllter Kreis):
// (u,v) ... Bildschirmkoordinaten (Pixel)

function point (u, v) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(u,v,2,0,2*Math.PI,true);                         // Kreis mit Radius 2 vorbereiten
  ctx.fillStyle = colorPoint;                              // Füllfarbe
  ctx.fill();                                              // Ausgefüllter Kreis
  }
  
// Kreis zeichnen (schwarz, Liniendicke 1):
// (u,v) ... Mittelpunkt (Pixel)
// r ....... Radius

function circle (u, v, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(u,v,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Großkreis (Vorderseite durchgezogen, Rückseite gestrichelt)
// n ... Normaleneinheitsvektor

function greatCircle (n) {
  var a1 = -n[2], a2 = n[1];                               // Koeffizienten für Cosinuswert (vorläufig) 
  var norm = Math.sqrt(a1*a1+a2*a2);                       // Betrag
  if (norm == 0) return;                                   // Falls n in Blickrichtung, abbrechen
  a1 /= norm; a2 /= norm;                                  // Koeffizienten normieren
  var b1 = -a2*n[0], b2 = a1*n[0];                         // Koeffizienten für Sinuswert
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x0+R*a1,y0-R*a2);                             // Anfangspunkt
  var dPhi = 2*Math.PI/NI;                                 // Größe eines Teilintervalls (Bogenmaß)
  for (var i=0; i<=NI; i++) {                              // Für alle Teilintervalle ...    
    var phi = i*dPhi;                                      // Positionswinkel (Bogenmaß)
    var cos = Math.cos(phi), sin = Math.sin(phi);          // Trigonometrische Werte
    var u1 = x0+R*(a1*cos+b1*sin);                         // Waagrechte Bildschirmkoordinate (Pixel)
    var v1 = y0-R*(a2*cos+b2*sin);                         // Senkrechte Bildschirmkoordinate (Pixel)
    if (i < NI/2 || i%2 == 0) ctx.lineTo(u1,v1);           // Entweder kurze Linie zeichnen ...
    else ctx.moveTo(u1,v1);                                // ... oder neuer Anfangspunkt                              
    u0 = u1; v0 = v1;                                      // Neue Position wird alte Position
    }
  ctx.stroke();                                            // Polygonzug als Näherung für Kurve
  }
  
// Beschriftung einer Ecke:
// s ......... Symbol
// (x,y) ..... Position der Ecke (Pixel) 
// (sx,sy) ... Position des Schwerpunkts (Pixel)
  
function label (s, x, y, sx, sy) {
  var vx = x-sx, vy = y-sy;                                // Verbindungsvektor
  var len = Math.sqrt(vx*vx+vy*vy);                        // Betrag
  if (len > 0) {vx *= 10/len; vy *= 10/len;}               // Verbindungsvektor auf Betrag 10 normieren 
  ctx.fillText(s,x+vx,y+vy+5);                             // Symbol ausgeben
  }
  
// Beschriftung der drei Ecken:

function labels () {
  var xS = (xA+xB+xC)/3, yS = (yA+yB+yC)/3;                // Bildschirmkoordinaten Schwerpunkt (Pixel)
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  label(symbolA,xA,yA,xS,yS);                              // Beschriftung von Ecke A
  label(symbolB,xB,yB,xS,yS);                              // Beschriftung von Ecke B
  label(symbolC,xC,yC,xS,yS);                              // Beschriftung von Ecke C
  }
  
// Kugeldreieck:

function triangle () {
  crossProduct(b,c,n); normalize(n); greatCircle(n);       // Großkreis von Seite a
  crossProduct(c,a,n); normalize(n); greatCircle(n);       // Großkreis von Seite b
  crossProduct(a,b,n); normalize(n); greatCircle(n);       // Großkreis von Seite c
  point(xA,yA);                                            // Ecke A
  point(xB,yB);                                            // Ecke B
  point(xC,yC);                                            // Ecke C
  labels();                                                // Beschriftung der Ecken
  }
   
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  circle(x0,y0,R,"#000000");                               // Kugel
  triangle();                                              // Kugeldreieck
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen



