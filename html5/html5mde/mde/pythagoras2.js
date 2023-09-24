// Satz des Pythagoras
// Java-Applet (19.02.2001) umgewandelt
// 03.03.2017 - 29.07.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel pythagoras2_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#00ff00";                                    // Farbe f�r Dreiecke
var color1 = "#8080ff";                                    // Farbe f�r Kathete a bzw. Kathetenquadrat a�
var color2 = "#ff4040";                                    // Farbe f�r Kathete b bzw. Kathetenquadrat b�
var color3 = "#e040a0";                                    // Farbe f�r Hypotenuse c bzw. Hypotenusenquadrat c�

// Sonstige Konstanten:

var PIX = 0.75;                                            // Umrechnungsfaktor (Pixel pro L�ngeneinheit)
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var sl1, sl2;                                              // Schieberegler
var lb1a, lb2a, lb3a;                                      // Ausgabefelder (Seitenl�ngen)
var lb1b, lb2b, lb3b;                                      // Ausgabefelder (Seitenquadrate)

var a, b;                                                  // Katheten
var c;                                                     // Hypotenuse
var p, q;                                                  // Hypotenusenabschnitte (rechts bzw. links)
var h;                                                     // H�he (bez�glich Hypotenuse)
var poly3;                                                 // Array f�r Dreieck
var poly4;                                                 // Array f�r nicht achsenparalleles Quadrat

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
  ctx = canvas.getContext("2d");                           // Grafikkontext
  sl1 = getElement("sl1");                                 // 1. Schieberegler (Kathete a)
  sl1.value = 60;                                          // Anfangsstellung
  sl2 = getElement("sl2");                                 // 2. Schieberegler (Kathete b)
  sl2.value = 80;                                          // Anfangsstellung
  lb1a = getElement("lb1a");                               // Ausgabefeld a
  lb1b = getElement("lb1b");                               // Ausgabefeld a�
  lb2a = getElement("lb2a");                               // Ausgabefeld b
  lb2b = getElement("lb2b");                               // Ausgabefeld b�
  lb3a = getElement("lb3a");                               // Ausgabefeld c
  lb3b = getElement("lb3b");                               // Ausgabefeld c�  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  a = sl1.value; b = sl2.value;                            // Katheten
  calculation();                                           // Berechnungen (c, p, q, h)
  updateOutput();                                          // Ausgabefelder aktualisieren
  poly3 = new Array(3);                                    // Array f�r Dreieck
  poly4 = new Array(4);                                    // Array f�r nicht achsenparalleles Quadrat
  paint();                                                 // Zeichnen
  
  sl1.onchange = reactionSlider1;                          // Reaktion auf Schieberegler 1 (Internet Explorer)
  sl1.oninput = reactionSlider1;                           // Reaktion auf Schieberegler 1 (Firefox, Chrome)
  sl2.onchange = reactionSlider2;                          // Reaktion auf Schieberegler 2 (Internet Explorer)
  sl2.oninput = reactionSlider2;                           // Reaktion auf Schieberegler 2 (Firefox, Chrome)
    
  } // Ende der Methode start
   
// Reaktion auf oberen Schieberegler (Kathete a):
  
function reactionSlider1 () {
  a = sl1.value;                                           // Kathete a
  calculation();                                           // Berechnungen (c, p, q, h)
  updateOutput();                                          // Ausgabefelder aktualisieren
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf unteren Schieberegler (Kathete b):
  
function reactionSlider2 () {
  b = sl2.value;                                           // Kathete b
  calculation();                                           // Berechnungen (c, p, q, h)
  updateOutput();                                          // Ausgabefelder aktualisieren
  paint();                                                 // Neu zeichnen
  }
  
// Ausgabefelder aktualisieren:
  
function updateOutput () {
  lb1a.innerHTML = "a = "+a;                               // Kathete a (ganzzahlig)
  lb1b.innerHTML = a2+" = "+a*a;                           // Kathetenquadrat a� (ganzzahlig)
  lb2a.innerHTML = "b = "+b;                               // Kathete b (ganzzahlig)
  lb2b.innerHTML = b2+" = "+b*b;                           // Kathetenquadrat b� (ganzzahlig)
  lb3a.innerHTML = "c = "+ToString(c,5);                   // Hypotenuse c (5 Nachkommastellen)
  lb3b.innerHTML = c2+" = "+(a*a+b*b);                     // Hypotenusenquadrat c� (ganzzahlig)
  }
  
//-------------------------------------------------------------------------------------------------

// Umwandlung einer Zahl in eine Zeichenkette (gerundet):
// n ... Gegebene Zahl
// d ... Zahl der Nachkommastellen

function ToString (n, d) {
  var s = n.toFixed(d);                                    // Runden, umwandeln in eine Zeichenkette
  return s.replace(".",decimalSeparator);                  // R�ckgabewert (Komma oder Punkt)
  }
  
// Berechnungen:
// Seiteneffekt c, p, q, h 

function calculation () {
  c = Math.sqrt(a*a+b*b);                                  // Hypotenuse 
  p = (c>0 ? a*a/c : 0);                                   // Rechter Hypotenusenabschnitt
  q = (c>0 ? b*b/c : 0);                                   // Linker Hypotenusenabschnitt
  h = (c>0 ? a*b/c : 0);                                   // H�he bez�glich Hypotenuse
  }
  
// Polygonecke festlegen:
// p ...... Array f�r Koordinaten der Polygonecken
// i ...... Index der Ecke
// x, y ... Koordinaten
  
function setPoint (p, i, x, y) {
  p[i]= {u: x, v: y};
  }

//-------------------------------------------------------------------------------------------------

// Neuer Pfad mit Standardwerten:

function newPath() {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Achsenparalleles Quadrat zeichnen (ausgef�llt):
// x, y ... Koordinaten der Ecke links oben
// a ...... Seitenl�nge
// c ...... F�llfarbe

function drawSquare (x, y, a, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.rect(x,y,a,a);                                       // Quadrat vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Quadrat zeichnen
  }
  
// Polygon zeichnen (ausgef�llt):
// p ... Array mit Koordinaten der Ecken
// c ... F�llfarbe

function drawPolygon (p, c) {
  newPath();                                               // Neuer Pfad
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.moveTo(p[0].u,p[0].v);                               // Zur ersten Ecke
  for (var i=1; i<p.length; i++)                           // F�r alle weiteren Ecken ... 
    ctx.lineTo(p[i].u,p[i].v);                             // Linie zum Pfad hinzuf�gen
  ctx.closePath();                                         // Zur�ck zum Ausgangspunkt
  ctx.fill(); ctx.stroke();                                // Polygon ausf�llen und Rand zeichnen   
  }
  
// Zentrierter Text:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

function centerText (s, x, y) {
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(s,x,y+4);                                   // Text ausgeben
  }
  
// Skizze links:

function sketchLeft () {
  var cPix = PIX*c;                                        // Hypotenusenl�nge (Pixel)
  var pPix = PIX*p, qPix = PIX*q;                          // Hypotenusenabschnitte rechts bzw. links (Pixel)
  var hPix = PIX*h;                                        // H�he bez�glich Hypotenuse (Pixel)
  var x0 = width/4;                                        // x-Koordinate Mittelpunkt
  var xL = x0-cPix/2;                                      // x-Koordinate Ecke A
  var xR = x0+cPix/2;                                      // x-Koordinate Ecke B
  var y0 = height/2;                                       // y-Koordinate Hypotenuse
  drawSquare(xL,y0,cPix,color3);                           // Unteres Quadrat (c�)
  setPoint(poly3,0,xL,y0);                                 // Dreieck, Ecke links unten
  setPoint(poly3,1,xR,y0);                                 // Dreieck, Ecke rechts unten
  setPoint(poly3,2,xL+qPix,y0-hPix);                       // Dreieck, Ecke oben
  drawPolygon(poly3,color0);                               // Dreieck ausgef�llt
  setPoint(poly4,0,xR,y0);                                 // Rechtes Quadrat (a�), Ecke unten
  setPoint(poly4,1,xR+hPix,y0-pPix);                       // Rechtes Quadrat (a�), Ecke rechts
  setPoint(poly4,2,xL+qPix+hPix,y0-hPix-pPix);             // Rechtes Quadrat (a�), Ecke oben
  setPoint(poly4,3,xL+qPix,y0-hPix);                       // Rechtes Quadrat (a�), Ecke links
  drawPolygon(poly4,color1);                               // Rechtes Quadrat (a�) ausgef�llt
  setPoint(poly4,0,xL,y0);                                 // Linkes Quadrat (b�), Ecke unten
  setPoint(poly4,1,xL+qPix,y0-hPix);                       // Linkes Quadrat (b�), Ecke rechts
  setPoint(poly4,2,xL+qPix-hPix,y0-hPix-qPix);             // Linkes Quadrat (b�), Ecke oben
  setPoint(poly4,3,xL-hPix,y0-qPix);                       // Linkes Quadrat (b�), Ecke links
  drawPolygon(poly4,color2);                               // Linkes Quadrat (b�) ausgef�llt
  centerText(a2,x0+(qPix+hPix)/2,y0-(hPix+pPix)/2);        // Beschriftung a�
  centerText(b2,x0-(pPix+hPix)/2,y0-(hPix+qPix)/2);        // Beschriftung b�
  centerText(c2,x0,y0+cPix/2);                             // Beschriftung c�
  }
  
// Skizze rechts oben:

function sketchRight1 () {
  var aPix = PIX*a, bPix = PIX*b;                          // Kathetenl�ngen (Pixel) 
  var ab = aPix+bPix, abH = ab/2;                          // Hilfsgr��en (a+b bzw. (a+b)/2 in Pixel)
  var x0 = 3*width/4;                                      // x-Koordinate Mittelpunkt
  var x1 = x0-abH;                                         // x-Koordinate linker Rand
  var x2 = x1+aPix;                                        // x-Koordinate senkrechte Trennlinie
  var x3 = x0+abH;                                         // x-Koordinate rechter Rand
  var y0 = height/4;                                       // y-Koordinate Mittelpunkt
  var y1 = y0-abH;                                         // y-Koordinate oberer Rand
  var y2 = y1+bPix;                                        // y-Koordinate waagrechte Trennlinie
  var y3 = y0+abH;                                         // y-Koordinate unterer Rand
  drawSquare(x1,y1,ab,color0);                             // Gesamtes Quadrat ((a+b)�, ausgef�llt)
  drawSquare(x1,y2,aPix,color1);                           // Quadrat links unten (a�, ausgef�llt)
  drawSquare(x2,y1,bPix,color2);                           // Quadrat rechts oben (b�, ausgef�llt)  
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x1,y2); ctx.lineTo(x2,y1);                    // Diagonale links oben vorbereiten
  ctx.moveTo(x2,y2); ctx.lineTo(x3,y3);                    // Diagonale rechts unten vorbereiten
  ctx.stroke();                                            // Diagonalen zeichnen
  centerText(a2,(x1+x2)/2,(y2+y3)/2);                      // Beschriftung a�
  centerText(b2,(x2+x3)/2,(y1+y2)/2);                      // Beschriftung b�
  }
    
// Skizze rechts unten:

function sketchRight2 () {
  var aPix = PIX*a, bPix = PIX*b;                          // Kathetenl�ngen (Pixel) 
  var ab = aPix+bPix, abH = ab/2;                          // Hilfsgr��en (a+b bzw. (a+b)/2 in Pixel)
  var x0 = 3*width/4;                                      // x-Koordinate Mittelpunkt
  var x1 = x0-abH;                                         // x-Koordinate linker Rand
  var x2 = x0+abH;                                         // x-Koordinate rechter Rand
  var y0 = 3*height/4;                                     // y-Koordinate Mittelpunkt
  var y1 = y0-abH;                                         // y-Koordinate oberer Rand
  var y2 = y0+abH;                                         // y-Koordinate unterer Rand  
  drawSquare(x1,y1,ab,color0);                             // Gesamtes Quadrat ((a+b)�, ausgef�llt)
  setPoint(poly4,0,x1+bPix,y2);                            // Ecke unten
  setPoint(poly4,1,x2,y1+aPix);                            // Ecke rechts
  setPoint(poly4,2,x2-bPix,y1);                            // Ecke oben
  setPoint(poly4,3,x1,y1+bPix);                            // Ecke links
  drawPolygon(poly4,color3);                               // Quadrat (c�, ausgef�llt)
  centerText(c2,(x1+x2)/2,(y1+y2)/2);                      // Beschriftung c�
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  sketchLeft();                                            // Skizze links
  sketchRight1();                                          // Skizze rechts oben
  sketchRight2();                                          // Skizze rechts unten
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



