// Funktion ratio kann abgewandelt werden!

// Strahlensatz
// Java-Applet (27.04.2000) umgewandelt
// 25.04.2017 - 26.04.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel intercepttheorem_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#ff0000";                                    // Farbe f�r A und B
var color2 = "#0000ff";                                    // Farbe f�r A' und B'
var color3 = "#00ffff";                                    // Farbe f�r ausgef�llte Dreiecke
var color4 = "#ff00ff";                                    // Farbe f�r ausgef�llte Dreiecke

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";          // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var rb1, rb2;                                              // Radiobuttons (V-Figur, X-Figur)
var ch1, ch2;                                              // Auswahlfelder (Streckenverh�ltnis)
var m1, m2;                                                // Ganze Zahlen f�r Streckfaktor m1/m2 (m1 != 0, m2 > 0)
var z;                                                     // Zentrum (Kreuzungspunkt)
var a1, b1;                                                // Gegebene Punkte A, B
var a2, b2;                                                // Bildpunkte A', B' bez�glich zentrischer Streckung
var dxA, dyA, dxB, dyB;                                    // Vektoren f�r Teildreiecke
var nr;                                                    // Nummer des aktiven Punkts (0 bis 4 oder -1)
var iMin, iMax;                                            // Kleinster und gr��ter Index f�r Dreiecke

var ratio = ratio1;                                        // Funktion f�r Streckenverh�ltnis, Schreibweise mit �berstrich
//var ratio = ratio2;                                        // Alternative: Schreibweise mit Betrag 

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
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  rb1 = getElement("rb1a");                                // Radiobutton (V-Figur)
  rb1.checked = true;                                      // Radiobutton zun�chst ausgew�hlt
  getElement("rb1b",text01);                               // Erkl�render Text (V-Figur)
  rb2 = getElement("rb2a");                                // Radiobutton (X-Figur)
  rb2.checked = false;                                     // Radiobutton zun�chst nicht ausgew�hlt
  getElement("rb2b",text02);                               // Erkl�render Text (X-Figur)
  getElement("lb1",text03);                                // Erkl�render Text (Streckenverh�ltnis)
  ch1 = newSelect("ch1",3);                                // Auswahlfeld f�r |m1|
  ch2 = newSelect("ch2",6);                                // Auswahlfeld f�r m2
  getElement("lb2",symbolDivision);                        // Symbol f�r Verh�ltnis
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  z = {x: 200, y: 250};                                    // Kreuzungspunkt Z
  a1 = {x: 50, y: 100};                                    // Gegebener Punkt A
  b1 = {x: 300, y: 50};                                    // Gegebener Punkt B
  a2 = {x: 0, y: 0}; b2 = {x: 0, y: 0};                    // Dummywerte f�r Bildpunkte
  reaction();                                              // Eingabe und Berechnungen
  nr = -1;                                                 // Zun�chst kein Punkt aktiv  
  paint();                                                 // Zeichnen
  
  rb1.onchange = reaction;                                 // Reaktion auf Radiobutton (V-Figur)
  rb2.onchange = reaction;                                 // Reaktion auf Radiobutton (X-Figur)
  ch1.onchange = reaction;                                 // Reaktion auf erstes Auswahlfeld (f�r |m1|)
  ch2.onchange = reaction;                                 // Reaktion auf zweites Auswahlfeld (f�r m2)                               

  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
// Neues Auswahlfeld mit Zahlen 1 bis 10:
// id ... ID im HTML-Text
// i0 ... Voreingestellter Index
  
function newSelect (id, i0) {
  var ch = getElement(id);                                 // Auswahlfeld
  for (var i=1; i<=10; i++) {                              // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = (i<10 ? " "+i : ""+i);                        // Inhalt
    ch.add(o);                                             // Element hinzuf�gen
    }
  ch.selectedIndex = i0;                                   // Voreingestellter Index
  return ch;                                               // R�ckgabewert
  }
  
// Reaktion auf Radiobuttons und Auswahlfelder: Eingabe, Berechnungen
// Seiteneffekt m1, m2, dxA, dyA, dxB, dyB, iMin, iMax, a2, b2
  
function reaction () {
  m1 = ch1.selectedIndex+1;                                // Dividend des Streckfaktors (|m1|)
  m2 = ch2.selectedIndex+1;                                // Divisor des Streckfaktors (m2)
  if (rb2.checked) m1 = -m1;                               // Gegebenenfalls negativer Streckfaktor  
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
  if (nr >= 0) e.preventDefault();                         // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = -1;                                                 // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr = -1;                                                 // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr < 0) return;                                      // Falls Zugmodus nicht aktiviert, abbrechen
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr < 0) return;                                      // Falls Zugmodus nicht aktiviert, abbrechen
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
    
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)  
  var dMin = distance(x,y,z);                              // Minimaler Abstand (zun�chst von Z)
  var n = 0;                                               // Nummer des n�chstgelegenen Punkts (zun�chst Z)
  var d = distance(x,y,a1);                                // Abstand von A
  if (d < dMin) {n = 1; dMin = d;}                         // Falls n�her, Variable aktualisieren
  d = distance(x,y,b1);                                    // Abstand von B
  if (d < dMin) {n = 2; dMin = d;}                         // Falls n�her, Variable aktualisieren
  d = distance(x,y,a2);                                    // Abstand von A'
  if (d < dMin) {n = 3; dMin = d;}                         // Falls n�her, Variable aktualisieren
  d = distance(x,y,b2);                                    // Abstand von B'
  if (d < dMin) {n = 4; dMin = d;}                         // Falls n�her, Variable aktualisieren
  nr = (dMin<20 ? n : -1);                                 // Nummer des aktiven Punkts
  }
  
// Hilfsroutine: Anpassen eines Punkts
// p ....... Punkt (mit Attributen x und y)
// (x,y) ... Neue Position
// im ...... Flag f�r Verschiebung des Bildpunkts und Berechnung des Originalpunkts

function updatePoint (p, x, y, im) {
  if (im) {                                                // Falls neue Position des Bildpunkts gegeben ...
    var m = m1/m2;                                         // Streckfaktor
    x = z.x+(x-z.x)/m; y = z.y+(y-z.y)/m;                  // Neue Position des Originalpunkts
    }
  p.x = x; p.y = y;                                        // Punkt anpassen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt z, a1, b1, a2, b2, dxA, dyA, dxB, dyB, iMin, iMax

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (nr == 0) updatePoint(z,x,y,false);                   // Entweder Verschiebung von Z ...
  else if (nr == 1) updatePoint(a1,x,y,false);             // ... oder Verschiebung von A ...
  else if (nr == 2) updatePoint(b1,x,y,false);             // ... oder Verschiebung von B ...
  else if (nr == 3) updatePoint(a1,x,y,true);              // ... oder Verschiebung von A' ...
  else if (nr == 4) updatePoint(b1,x,y,true);              // ... oder Verschiebung von B'
  paint();                                                 // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Abstand von einem Punkt:
// (x,y) ... Position
// p ....... Punkt
  
function distance (x, y, p) {
  var dx = x-p.x, dy = y-p.y;                              // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }

// Berechnungen:
// Seiteneffekt dxA, dyA, dxB, dyB, iMin, iMax, a2, b2

function calculation () {
  dxA = (a1.x-z.x)/m2; dyA = (a1.y-z.y)/m2;                // Basisvektor (1/m2) ZA
  dxB = (b1.x-z.x)/m2; dyB = (b1.y-z.y)/m2;                // Basisvektor (1/m2) ZB
  iMin = (m1>0 ? 0 : m1);                                  // Kleinster Index f�r Dreiecke            
  iMax = (m2>m1 ? m2 : m1);                                // Gr��ter Index f�r Dreiecke
  a2.x = z.x+m1*dxA; a2.y = z.y+m1*dyA;                    // Bildpunkt A'
  b2.x = z.x+m1*dxB; b2.y = z.y+m1*dyB;                    // Bildpunkt B'
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Pfad mit Standardwerten:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)

function newPath(c, w) {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)

function segment (x1, y1, x2, y2, c, w) {
  newPath(c,w);                                            // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Punkt (ausgef�llter Kreis):
// (x,y) ... Mittelpunkt (Pixel)
// c ....... Farbe

function point (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kreis mit Radius 2 vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill();                                              // Ausgef�llter Kreis
  }
  
// Gerade:
// (x1,y1) ... Erster Punkt
// (x2,y2) ... Zweiter Punkt
// c ......... Farbe

function lineXY (x1, y1, x2, y2, c) {
  var vx = x2-x1, vy = y2-y1;                              // Richtungsvektor
  var len = Math.sqrt(vx*vx+vy*vy)/1000;                   // L�nge Richtungsvektor durch 1000 
  if (len == 0) return;                                    // Falls Gerade nicht definiert, abbrechen
  vx /= len; vy /= len;                                    // Richtungsvektor auf Betrag 1000 bringen
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1-vx,y1-vy); ctx.lineTo(x2+vx,y2+vy);        // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gerade:
// p1 ... Erster Punkt
// p2 ... Zweiter Punkt
// c .... Farbe
  
function linePP (p1, p2, c) {
  lineXY(p1.x,p1.y,p2.x,p2.y,c);                           // Linie zeichnen
  }

// Kreuzungs- und Parallelgeraden:

function lines () {
  linePP(z,a1);                                            // Kreuzungsgerade ZA
  linePP(z,b1);                                            // Kreuzungsgerade ZB
  linePP(a1,b1,color1);                                    // Parallelgerade AB
  linePP(a2,b2,color2);                                    // Parallelgerade A'B'
  }
  
// Ausgef�lltes Dreieck mit schwarzem Rand:
// i1, j1 ... Indizes f�r die erste Ecke
// i2, j2 ... Indizes f�r die zweite Ecke
// i3, j3 ... Indizes f�r die dritte Ecke
// c ........ F�llfarbe

function triangle (i1, j1, i2, j2, i3, j3, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(z.x+i1*dxA+j1*dxB,z.y+i1*dyA+j1*dyB);         // Erster Punkt als Anfangspunkt
  ctx.lineTo(z.x+i2*dxA+j2*dxB,z.y+i2*dyA+j2*dyB);         // Weiter zum zweiten Punkt
  ctx.lineTo(z.x+i3*dxA+j3*dxB,z.y+i3*dyA+j3*dyB);         // Weiter zum dritten Punkt
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fillStyle = c; ctx.fill();                           // Dreieck ausf�llen
  ctx.stroke();                                            // Dreiecksrand zeichnen
  }
  
// Gitternetz (ausgef�llte Dreiecke mit schwarzem Rand):

function grid () {
  triangle(0,0,iMax,0,0,iMax,color3);                      // Gro�es Dreieck in der ersten Farbe (positive Seite)
  if (m1 < 0) triangle(0,0,m1,0,0,m1,color3);              // Falls X-Figur, gro�es Dreieck in der ersten Farbe (negative Seite)
  for (var i=0; i<iMax; i++)                               // F�r alle Werte von Index i ...
    for (var j=0; j<=i; j++)                               // F�r alle Werte von Index j ...
      triangle(i-j,j,i+1-j,j,i-j,j+1,color4);              // Kleines Dreieck in der zweiten Farbe (positive Seite) 
  for (i=-2; i>=iMin; i--)                                 // F�r alle Werte von Index i ...
    for (j=-1; j>i; j--)                                   // F�r alle Werte von Index j ...
      triangle(i-j,j,i-j,j+1,i-j+1,j,color4);              // Kleines Dreieck in der zweiten Farbe (negative Seite) 
    }
  
// Zentrierter Text, eventuell mit �berstrich:
// s ....... Zeichenkette
// (x,y) ... Position (Mitte)
// ol ...... Flag f�r �berstrich

function center (s, x, y, ol) {
  var w = ctx.measureText(s).width;                        // L�nge (Pixel)
  x -= w/2; y += 8;                                        // Anfangsposition
  ctx.fillText(s,x,y);                                     // Text ausgeben
  if (ol) segment(x,y-12,x+w,y-12,"#000000",2);            // Gegebenenfalls �berstrich (schwarz)
  }

// Einzelner Punkt mit Beschriftung:
// p ......... Punkt (mit Attributen x und y)
// n ......... Name des Punkts
// (vx,vy) ... Richtungsvektor f�r Beschriftung
// c ......... Farbe (optional, Defaultwert schwarz)

function point (p, n, vx, vy, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2.5,0,2*Math.PI,true);                   // Kreis vorbereiten
  ctx.fillStyle = (c ? c : "#000000");                     // F�llfarbe
  ctx.fill();                                              // Kreis ausf�llen
  var len = Math.sqrt(vx*vx+vy*vy);                        // Betrag Richtungsvektor (Pixel)
  if (len > 0) {                                           // Falls Betrag gr��er als 0 ...
    var f = 15/len;                                        // Faktor
    vx *= f; vy *= f;                                      // Richtungsvektor auf Betrag 15 bringen
    }
  else vx = 15;                                            // Notma�nahme f�r Betrag 0 (Beschriftung rechts)
  center(n,p.x+vx,p.y+vy,false);                           // Beschriftung
  }

// Punkte Z, A, B, A', B' (mit Beschriftung):

function points () {
  point(z,symbolZ,z.y-(a1.y+b1.y)/2,(a1.x+b1.x)/2-z.x);    // Kreuzungspunkt Z
  point(a1,symbolA1,a1.x-b1.x,a1.y-b1.y,color1);           // Gegebener Punkt A          
  point(b1,symbolB1,b1.x-a1.x,b1.y-a1.y,color1);           // Gegebener Punkt B
  if (m1 == m2) return;                                    // Falls Streckfaktor 1, abbrechen
  point(a2,symbolA2,a2.x-b2.x,a2.y-b2.y,color2);           // Bildpunkt A'
  point(b2,symbolB2,b2.x-a2.x,b2.y-a2.y,color2);           // Bildpunkt B'
  }
  
// L�ngenverh�ltnis, Schreibweise mit �berstrich:
// s1 ...... erste Streckenl�nge (Dividend)
// s2 ...... zweite Streckenl�nge (Divisor)
// (x,y) ... Position (Divisionszeichen) 
// eq ...... Flag f�r folgendes Gleichheitszeichen

function ratio1 (s1, s2, x, y, eq) {
  center(s1,x-20,y,eq);                                    // Erste Streckenl�nge (Dividend)
  center(symbolDivision,x,y,false);                        // Divisionszeichen
  center(s2,x+20,y,eq);                                    // Zweite Streckenl�nge (Divisor)
  if (eq) center("=",x+50,y,false);                        // Gegebenenfalls Gleichheitszeichen
  }
  
// L�ngenverh�ltnis, Schreibweise mit Betrag:
// s1 ...... erste Streckenl�nge (Dividend)
// s2 ...... zweite Streckenl�nge (Divisor)
// (x,y) ... Position (Divisionszeichen) 
// eq ...... Flag f�r folgendes Gleichheitszeichen

function ratio2 (s1, s2, x, y, eq) {
  if (eq) {s1 = "|"+s1+"|"; s2 = "|"+s2+"|"}               // Gegebenenfalls Betragsstriche hinzuf�gen
  center(s1,x-20,y,false);                                 // Erste Streckenl�nge (Dividend)
  center(symbolDivision,x,y,false);                        // Divisionszeichen
  center(s2,x+20,y,false);                                 // Zweite Streckenl�nge (Divisor)
  if (eq) center("=",x+50,y,false);                        // Gegebenenfalls Gleichheitszeichen
  }

// Verh�ltnisgleichungen:

function equations () {
  if (m1 == m2) return;                                    // Falls Streckfaktor gleich 1, abbrechen
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,height-80,width,80);                      // Bereich f�r Verh�ltnisgleichungen l�schen
  var za1 = symbolZ+symbolA1;                              // Zeichenkette f�r ZA
  var za2 = symbolZ+symbolA2;                              // Zeichenkette f�r ZA'
  var zb1 = symbolZ+symbolB1;                              // Zeichenkette f�r ZB
  var zb2 = symbolZ+symbolB2;                              // Zeichenkette f�r ZB'
  var a1b1 = symbolA1+symbolB1;                            // Zeichenkette f�r AB
  var a2b2 = symbolA2+symbolB2;                            // Zeichenkette f�r A'B'
  var a2a1 = symbolA2+symbolA1;                            // Zeichenektte f�r A'A
  var b2b1 = symbolB2+symbolB1;                            // Zeichenkette f�r B'B
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var y = height-60;                                       // y-Koordinate f�r erste Zeile
  ratio(za2,za1,80,y,true);                                // ZA' : ZA
  ratio(zb2,zb1,180,y,true);                               // ZB' : ZB
  ratio(a2b2,a1b1,280,y,true);                             // A'B' : AB
  ratio(""+Math.abs(m1),""+m2,380,y,false);                // Zahlenverh�ltnis |m1| : m2
  y += 20;                                                 // y-Koordinate f�r zweite Zeile
  ratio(za2,a2a1,80,y,true);                               // ZA' : A'A
  ratio(zb2,b2b1,180,y,true);                              // ZB' : B'B
  ratio(""+Math.abs(m1),""+Math.abs(m2-m1),280,y,false);   // Zahlenverh�ltnis |m1| : |m2-m1|
  y += 20;                                                 // y-Koordinate f�r dritte Zeile
  ratio(za1,a2a1,80,y,true);                               // ZA : A'A
  ratio(zb1,b2b1,180,y,true);                              // ZB : B'B
  ratio(""+m2,""+Math.abs(m2-m1),280,y,false);             // Zahlenverh�ltnis m2 : |m2-m1|
  }
  
// Grafikausgabe:
// Seiteneffekt dxA, dyA, dxB, dyB, iMin, iMax, a2, b2
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  calculation();                                           // Berechnungen                  
  grid();                                                  // Gitternetz (ausgef�llte Dreiecke)
  lines();                                                 // Kreuzungs- und Parallelgeraden 
  ctx.font = FONT;                                         // Zeichensatz 
  ctx.textAlign = "left";                                  // Textausrichtung
  points();                                                // Punkte mit Beschriftung
  equations();                                             // Verh�ltnisgleichungen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen



