// Innenwinkelsumme eines Dreiecks
// Java-Applet (11.06.1998) umgewandelt
// 01.04.2018 - 02.04.2018

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel anglestriangle_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff00ff";                                // Farbe f�r Punkte
var colorAngle = ["#ff80c0", "#80ff80", "#80c0ff"];        // Farben f�r Winkelmarkierungen

// Weitere Konstanten:

var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var PI2 = 2*Math.PI;                                       // Abk�rzung f�r 2 pi
var R = 30;                                                // Radius f�r Winkelmarkierungen
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var ch;                                                    // Auswahlfeld (Zahl der Nachkommastellen)
var op1, op2, op3;                                         // Ausgabefelder

var nr;                                                    // Nummer der ausgew�hlten Ecke (0 bis 3)
var a, b, c;                                               // Ecken des Dreiecks (Attribute x, y)
var p, q;                                                  // Hilfspunkte auf der Parallele (Attribute x, y)
                     
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
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb1",text01);                                // Erkl�render Text (Gr��en der Innenwinkel)
  op1 = getElement("op1");                                 // Ausgabefeld 1 (Alpha)
  op2 = getElement("op2");                                 // Ausgabefeld 2 (Beta) 
  op3 = getElement("op3");                                 // Ausgabefeld 3 (Gamma)
  getElement("lb2",text02);                                // Erkl�render Text (Nachkommastellen)
  ch = select();                                           // Auswahlfeld (Nachkommastellen)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  nr = 0;                                                  // Zun�chst keine Ecke ausgew�hlt
  a = {x: 100, y: 280};                                    // Ecke A (links unten)
  b = {x: 400, y: 280};                                    // Ecke B (rechts unten)
  c = {x: 130, y: 100};                                    // Ecke C (oben)
  p = {x: 430, y: 100};                                    // Hilfspunkt auf der Parallele (rechts)
  q = {x: -170, y: 100};                                   // Hilfspunkt auf der Parallele (links)
                                     
  paint();                                                 // Zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  
  ch.onchange = updateOutput;                              // Reaktion auf Auswahlfeld (Nachkommastellen)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
    
  } // Ende der Methode start
  
// Vorbereitung des Auswahlfelds (Zahl der Nachkommastellen):
// R�ckgabewert: Auswahlfeld
  
function select () {
  ch = getElement("ch");                                   // Auswahlfeld
  for (var i=0; i<=5; i++) {                               // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = ""+i;                                         // Text des Elements �bernehmen 
    ch.add(o);                                             // Element zur Liste hinzuf�gen
    }
  ch.selectedIndex = 0;                                    // Erster Eintrag ausgew�hlt
  return ch;                                               // R�ckgabewert
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl einer Ecke)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl einer Ecke)
  if (nr > 0) e.preventDefault();                          // Falls keine Ecke ausgew�hlt, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Keine Ecke ausgew�hlt
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Keine Ecke ausgew�hlt
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls keine Ecke ausgew�hlt
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls keine Ecke ausgew�hlt
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  } 

// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl einer Ecke):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt nr

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  var d = distancePoint(x,y,a);                            // Abstand von Ecke A
  var dMin = d;                                            // Vorl�ufiges Abstandsminimum
  var n = 1;                                               // Nummer f�r Ecke A
  d = distancePoint(x,y,b);                                // Abstand von Ecke B
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    n = 2;                                                 // Nummer f�r Ecke B
    }             
  d = distancePoint(x,y,c);                                // Abstand von Ecke C
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    n = 3;                                                 // Nummer f�r Ecke C
    } 
  nr = (dMin<20 ? n : 0);                                  // Falls geringer Abstand, Nummer �bernehmen
  }
  
// Hilfsroutine: �berpr�fung, ob neue Koordinaten ungeeignet
// (x,y) ... Vorgeschlagene Koordinaten
// p1 ...... Nachbarecke im Gegenuhrzeigersinn
// p2 ...... Nachbarecke im Uhrzeigersinn
  
function wrong (x, y, p1, p2) {
  if (distancePoint(x,y,p1) < 2*R) return true;            // R�ckgabewert, falls zu nahe an p1
  if (distancePoint(x,y,p2) < 2*R) return true;            // R�ckgabewert, falls zu nahe an p2
  if (counterClock(p2.x,p2.y,x,y,p1.x,p1.y)) return true;  // R�ckgabewert, falls falscher Drehsinn des Dreiecks
  return false;                                            // Normaler R�ckgabewert (Koordinaten geeignet)
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt a, b, c, p, q

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  if (nr == 1) {                                           // Falls Ecke A ...
    if (wrong(x,y,b,c)) return;                            // Bei ungeeigneten Koordinaten abbrechen
    a.x = x; a.y = y;                                      // Koordinaten �bernehmen
    }
  else if (nr == 2) {                                      // Falls Ecke B ...
    if (wrong(x,y,c,a)) return;                            // Bei ungeeigneten Koordinaten abbrechen
    b.x = x; b.y = y;                                      // Koordinaten �bernehmen      
    }
  else if (nr == 3) {                                      // Falls Ecke C ...
    if (wrong(x,y,a,b)) return;                            // Bei ungeeigneten Koordinaten abbrechen
    c.x = x; c.y = y;                                      // Koordinaten �bernehmen     
    }
  var abx = b.x-a.x, aby = b.y-a.y;                        // Vektor AB
  p.x = c.x+abx; p.y = c.y+aby;                            // 1. Hilfspunkt auf der Parallele
  q.x = c.x-abx; q.y = c.y-aby;                            // 2. Hilfspunkt auf der Parallele
  paint();                                                 // Neu zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  }
  
//-------------------------------------------------------------------------------------------------

// Abstand von einem gegebenen Punkt:
// (x,y) ... Aktuelle Position (Pixel)
// p ....... Gegebener Punkt (Attribute x, y)

function distancePoint (x, y, p) {
  var dx = x-p.x, dy = y-p.y;                              // Verbindungsvektor
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
// Winkelgr��e (Bogenma�):
// p1 ... Punkt auf dem 1. Schenkel
// s .... Scheitel
// p2 ... Punkt auf dem 2. Schenkel

function sizeAngle (p1, s, p2) {
  var ux = p1.x-s.x, uy = s.y-p1.y;                        // Richtungsvektor 1. Schenkel
  var vx = p2.x-s.x, vy = s.y-p2.y;                        // Richtungsvektor 2. Schenkel
  var sp = ux*vx+uy*vy;                                    // Skalarprodukt der Richtungsvektoren
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag des 1. Richtungsvektors
  var v = Math.sqrt(vx*vx+vy*vy);                          // Betrag des 2. Richtungsvektors
  return Math.acos(sp/(u*v));                              // R�ckgabewert
  }
  
// Startwinkel einer Winkelmarkierung (Bogenma�):
// p1 ... Punkt auf dem 1. Schenkel
// s .... Scheitel

function startAngle (p1, s) {
  var ux = p1.x-s.x, uy = s.y-p1.y;                        // Richtungsvektor 1. Schenkel
  var a = Math.atan2(uy,ux);                               // Winkel (-pi bis +pi)
  return (a>=0 ? a : a+PI2);                               // R�ckgabewert (0 bis 2 pi)
  }
  
// �berpr�fung, ob Winkel im Gegenuhrzeigersinn:
// (ax,ay) ... Punkt auf dem ersten Schenkel
// (bx,by) ... Scheitel
// (cx,cy) ... Punkt auf dem zweiten Schenkel
  
function counterClock (ax, ay, bx, by, cx, cy) {
  var ux = ax-bx, uy = ay-by;                              // Richtungsvektor 1. Schenkel
  var vx = cx-bx, vy = cy-by;                              // Richtungsvektor 2. Schenkel
  return (ux*vy-uy*vx < 0);                                // R�ckgabewert
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ... Gegebene Zahl
// d ... Anzahl der Nachkommastellen
  
function ToString (n, d) {
  var s = n.toFixed(d);                                    // Zeichenkette (Punkt als Dezimaltrennzeichen)
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Ausgabe der Winkelgr��en:
// Der Winkel Gamma wird, falls n�tig, so abge�ndert, dass die angezeigte Winkelsumme exakt gleich 180� ist. 
  
function updateOutput () {
  var d = ch.selectedIndex;                                // Zahl der Nachkommastellen (0 bis 5)
  var p10 = Math.round(Math.pow(10,d));                    // Entsprechende Zehnerpotenz
  var a1 = Math.round(p10*sizeAngle(b,a,c)/DEG);           // Ganze Zahl f�r Alpha
  var a2 = Math.round(p10*sizeAngle(c,b,a)/DEG);           // Ganze Zahl f�r Beta
  var a3 = 180*p10-a1-a2;                                  // Ganze Zahl f�r Gamma  
  op1.innerHTML = angle1[0]+" = "+ToString(a1/p10,d)+degree;    // Ausgabe von Alpha
  op2.innerHTML = angle1[1]+" = "+ToString(a2/p10,d)+degree;    // Ausgabe von Beta
  op3.innerHTML = angle1[2]+" = "+ToString(a3/p10,d)+degree;    // Ausgabe von Gamma
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt zeichnen:
// p ... Punkt (Attribute x, y)

function point (p) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2,0,PI2,true);                           // Kreis vorbereiten
  ctx.fillStyle = colorPoint;                              // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit Rand
  }
  
// Verbindungsgerade zeichnen:
// p1, p2 ... Bestimmungspunkte (Attribute x, y)

function line (p1, p2) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Verbindungsvektor
  var d = Math.sqrt(dx*dx+dy*dy);                          // Betrag Verbindungsvektor
  if (d == 0) return;                                      // Falls Gerade nicht definiert, abbrechen
  var f = 1000/d;                                          // Faktor f�r Linie der L�nge 1000 (Pixel)
  dx *= f; dy *= f;                                        // Verbindungsvektor mit Betrag 1000
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt 
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
    
// Farbige Winkelmarkierung (ohne Rand, Gegenuhrzeigersinn):
// (x,y) ... Scheitel
// r ....... Radius
// a0 ...... Startwinkel (Bogenma�)
// a ....... Winkelbetrag (Bogenma�)
// c ....... F�llfarbe 

function angle (x, y, r, a0, a, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));           // Linie auf dem ersten Schenkel
  ctx.arc(x,y,r,PI2-a0,PI2-a0-a,true);                     // Kreisbogen
  ctx.closePath();                                         // Zur�ck zum Scheitel
  ctx.fill(); ctx.stroke();                                // Kreissektor ausf�llen, Rand zeichnen
  }
  
// Winkelmarkierung zeichnen (Gegenuhrzeigersinn):
// p1 ... Punkt auf dem 1. Schenkel
// s .... Scheitel
// p2 ... Punkt auf dem 2. Schenkel
// i .... Index der Farbe (0 bis 2)
 
function anglePPP (p1, s, p2, i) {
  var a0 = startAngle(p1,s);                               // Startwinkel (Bogenma�)
  var a = sizeAngle(p1,s,p2);                              // Winkelgr��e (Bogenma�)
  angle(s.x,s.y,R,a0,a,colorAngle[i]);                     // Winkelmarkierung
  }
  
// Winkel oder Ecke beschriften:
// (x,y) ... Scheitel
// r ....... Radius f�r Winkelmarkierung (Pixel)
// a0 ...... Startwinkel der Winkelmarkierung (Bogenma�)
// a ....... Winkelgr��e (Bogenma�)
// t ....... Beschriftung
  
function name (x, y, r, a0, a, t) {
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  var tr = 0.6*r;                                          // Abstand vom Scheitel
  var ta = a0+a/2;                                         // Positionswinkel (Bogenma�)
  var tx = x+tr*Math.cos(ta), ty = y-tr*Math.sin(ta)+4;    // Koordinaten 
  ctx.fillText(t,tx,ty);                                   // Beschriftung
  }
  
// Winkel (und Ecke) beschriften:
// p1 ... Punkt auf dem 1. Schenkel
// s .... Scheitel
// p2 ... Punkt auf dem 2. Schenkel
// t1 ... Bezeichnung des Winkels
// t2 ... Bezeichnung der Ecke (optional)
  
function namePPP (p1, s, p2, t1, t2) {
  var a0 = startAngle(p1,s);                               // Startwinkel (Bogenma�)
  var a = sizeAngle(p1,s,p2);                              // Winkelgr��e (Bogenma�)
  name(s.x,s.y,R,a0,a,t1);                                 // Winkel beschriften
  if (t2) name(s.x,s.y,R,a0+Math.PI,a,t2);                 // Falls gew�nscht, Ecke beschriften (entgegengesetzt)
  }
     
// Grafikausgabe: 
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);            // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  anglePPP(b,a,c,0);                                       // Winkelmarkierung Alpha
  anglePPP(c,b,a,1);                                       // Winkelmarkierung Beta
  anglePPP(a,c,b,2);                                       // Winkelmarkierung Gamma
  anglePPP(q,c,a,0);                                       // Winkelmarkierung Alpha Strich (Wechselwinkel)
  anglePPP(b,c,p,1);                                       // Winkelmarkierung Beta Strich (Wechselwinkel)
  line(a,b); line(b,c); line(c,a);                         // Dreiecksseiten (verl�ngert)
  line(p,q);                                               // Parallele zu AB durch C
  point(a); point(b); point(c);                            // Ecken A, B, C
  namePPP(b,a,c,angle1[0],vertex[0]);                      // Beschriftung Alpha, A
  namePPP(c,b,a,angle1[1],vertex[1]);                      // Beschriftung Beta, B
  namePPP(a,c,b,angle1[2],vertex[2]);                      // Beschriftung Gamma, C
  namePPP(q,c,a,angle2[0]);                                // Beschriftung Alpha Strich (Wechselwinkel)
  namePPP(b,c,p,angle2[1]);                                // Beschriftung Beta Strich (Wechselwinkel)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



