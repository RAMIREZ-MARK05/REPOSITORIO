// Dreiecks-Labor: Punkt der gleich langen Parallelen
// 27.11.2019 - 25.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel tl_equalparallelians_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe f�r bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe f�r Hilfslinien
var color2 = "#ff00ff";                                    // Farbe f�r Ergebnis (Hervorhebung)

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Neustart, N�chster Schritt)
var ta;                                                    // Textbereich

var A, B, C;                                               // Ecken
var nr;                                                    // Nummer des ausgew�hlten Punkts (1, 2, 3, 4 oder 0)
var a, b, c;                                               // Seitenl�ngen (Pixel)
var step;                                                  // Einzelschritt (0 bis 15)
var P;                                                     // Verschiebbarer Punkt
var EP;                                                    // Punkt der gleich langen Parallelen
var P12, P13, P21, P23, P31, P32;                          // Endpunkte der Parallelen
var p1, p2, p3;                                            // L�ngen der Parallelen (Pixel)
var D, E, F;                                               // Ecken des gro�en Dreiecks
var W1, W2, W3;                                            // Endpunkte der Winkelhalbierenden

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
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Neustart)
  bu2 = getElement("bu2",text02);                          // Schaltknopf (N�chster Schritt) 
  bu2.disabled = false;                                    // Schaltknopf zun�chst aktiviert
  ta = getElement("ta");                                   // Textbereich
  setText(0);                                              // Text festlegen
  ta.readOnly = true;                                      // Text unver�nderlich
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  begin(150,200,300,200,180,80);                           // Anfangszustand
  paint();                                                 // Zeichnen
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionNext;                              // Reaktion auf Schaltknopf (N�chster Schritt)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
// Textbereich aktualisieren:
// nr ... Index im Array text03 (Erl�uterungen)
  
function setText (nr) {
  var t = text03[nr];                                      // Array der Zeilen der passenden Erl�uterung 
  var s = "";                                              // Neue Zeichenkette (leer)
  for (var i=0; i<t.length; i++) s += t[i]+"\n";           // Zeilen und Zeilenumbr�che hinzuf�gen
  ta.value = s;                                            // Text in den Textbereich �bernehmen
  }
  
// Seitenl�ngen usw. aktualisieren:
// Seiteneffekt a, b, c, D, E, F, W1, W2, W3, EP, P, P12, P13, P21, P23, P31, P32, p1, p2, p3 
  
function update () {
  a = distancePP(B,C);                                     // Seitenl�nge a (Pixel)
  b = distancePP(C,A);                                     // Seitenl�nge b (Pixel)
  c = distancePP(A,B);                                     // Seitenl�nge c (Pixel)
  D = pointBarycentric(-1,1,1);                            // 1. Ecke Antimedialdreieck (gegen�ber A)
  E = pointBarycentric(1,-1,1);                            // 2. Ecke Antimedialdreieck (gegen�ber B)                           
  F = pointBarycentric(1,1,-1);                            // 3. Ecke Antimedialdreieck (gegen�ber C)
  W1 = pointBarycentric(0,b,c);                            // Endpunkt Winkelhalbierende w_alpha
  W2 = pointBarycentric(a,0,c);                            // Endpunkt Winkelhalbierende w_beta
  W3 = pointBarycentric(a,b,0);                            // Endpunkt Winkelhalbierende w_gamma
  var h1 = c*a+a*b-b*c;                                    // 1. baryzentrische Koordinate von EP
  var h2 = a*b+b*c-c*a;                                    // 2. baryzentrische Koordinate von EP
  var h3 = b*c+c*a-a*b;                                    // 3. baryzentrische Koordinate von EP
  EP = pointBarycentric(h1,h2,h3);                         // Punkt der gleich langen Parallelen
  if (step >= 3) P = EP;                                   // Punkt P an richtigen Punkt anpassen
  var bc = barycentric(P.x,P.y);                           // Baryzentrische Koordinaten von P (insgesamt)
  h1 = bc.u; h2 = bc.v; h3 = bc.w;                         // Baryzentrische Koordinaten von P (einzeln)
  P12 = pointBarycentric(h1,0,h2+h3);                      // Schnittpunkt der Parallele zu BC mit [CA] 
  P13 = pointBarycentric(h1,h2+h3,0);                      // Schnittpunkt der Parallele zu BC mit [AB]
  P21 = pointBarycentric(0,h2,h1+h3);                      // Schnittpunkt der Parallele zu CA mit [BC]
  P23 = pointBarycentric(h1+h3,h2,0);                      // Schnittpunkt der Parallele zu CA mit [AB]
  P31 = pointBarycentric(0,h1+h2,h3);                      // Schnittpunkt der Parallele zu AB mit [BC]
  P32 = pointBarycentric(h1+h2,0,h3);                      // Schnittpunkt der Parallele zu AB mit [CA]
  p1 = distancePP(P12,P13);                                // L�nge der Parallele zu BC
  p2 = distancePP(P21,P23);                                // L�nge der Parallele zu CA
  p3 = distancePP(P31,P32);                                // L�nge der Parallele zu AB
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, P, nr, a, b, c, D, E, F, W1, W2, W3, EP, P12, P13, P21, P23, P31, P32, p1, p2, p3

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  P = pointBarycentric(1,2,3);                             // Verschiebbarer Punkt P
  nr = 0;                                                  // Zun�chst kein Punkt ausgew�hlt
  update();                                                // Seitenl�ngen usw. aktualisieren
  }
  
// Reaktion auf Schaltknopf (Neustart):
// Seiteneffekt step, P, a, b, c, D, E, F, W1, W2, W3, EP, P12, P13, P21, P23, P31, P32, p1, p2, p3

function reactionReset () {
  step = 0;                                                // Einzelschritt
  bu2.disabled = false;                                    // Schaltknopf "N�chster Schritt" aktivieren
  setText(0);                                              // Text f�r Start
  P = pointBarycentric(1,2,3);                             // Anfangsposition Punkt P
  update();                                                // Seitenl�ngen usw. aktualisieren       
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (N�chster Schritt):
// Seiteneffekt step, a, b, c, D, E, F, W1, W2, W3, EP, P, P12, P13, P21, P23, P31, P32, p1, p2, p3

function reactionNext () {
  step++;                                                  // N�chster Einzelschritt
  if (step >= 15) bu2.disabled = true;                     // Falls n�tig, Schaltknopf "N�chster Schritt" deaktivieren
  setText(step);                                           // Text f�r den n�chsten Einzelschritt
  update();                                                // Seitenl�ngen usw. aktualisieren
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
  nr = 0;                                                  // Keine Ecke ausgew�hlt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Keine Ecke ausgew�hlt, Zugmodus deaktiviert
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
  
// Quadrat des Abstands von einem gegebenen Punkt:
// (u,v) ... Gegebene Position (Pixel)
// p ....... Gegebener Punkt
  
function distance2 (u, v, p) {
  var dx = u-p.x, dy = v-p.y;                              // Koordinatendifferenzen
  return dx*dx+dy*dy;                                      // R�ckgabewert
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)  
  var d2Min = distance2(u,v,A);                            // Vorl�ufig minimaler Abstand zur Ecke A
  var n = 1;                                               // Nummer von Ecke A
  var d2New = distance2(u,v,B);                            // Abstand zur Ecke B
  if (d2New < d2Min) {n = 2; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  d2New = distance2(u,v,C);                                // Abstand zur Ecke C
  if (d2New < d2Min) {n = 3; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  d2New = distance2(u,v,P);                                // Abstand zu Punkt P
  if (step < 3 && d2New < d2Min) {n = 4; d2Min = d2New;}   // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  nr = (d2Min < 400 ? n : 0);                              // Bei zu gro�em Abstand keine Ecke ausgew�hlt
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  var v1x = (nr==2?u:B.x)-(nr==1?u:A.x);                   // x-Koordinate des ver�nderten Vektors AB
  var v1y = (nr==2?v:B.y)-(nr==1?v:A.y);                   // y-Koordinate des ver�nderten Vektors AB
  var v2x = (nr==3?u:C.x)-(nr==1?u:A.x);                   // x-Koordinate des ver�nderten Vektors AB
  var v2y = (nr==3?v:C.y)-(nr==1?v:A.y);                   // y-Koordinate des ver�nderten Vektors AB
  var corr = (v1x*v2y-v1y*v2x < 0);                        // Flag f�r Gegenuhrzeigersinn     
  if (corr && nr == 1) {A.x = u; A.y = v;}                 // Falls A gezogen, Koordinaten von A aktualisieren
  if (corr && nr == 2) {B.x = u; B.y = v;}                 // Falls B gezogen, Koordinaten von B aktualisieren
  if (corr && nr == 3) {C.x = u; C.y = v;}                 // Falls C gezogen, Koordinaten von C aktualisieren
  if (corr && nr == 4) {                                   // Falls P gezogen ...
    var bc = barycentric(u,v);                             // Baryzentrische Koordinaten insgesamt
    var bc1 = bc.u, bc2 = bc.v, bc3 = bc.w;                // Baryzentrische Koordinaten einzeln
    if (bc1 < 0) bc1 = 0;                                  // Negative 1. baryzentrische Koordinate verhindern
    if (bc2 < 0) bc2 = 0;                                  // Negative 2. baryzentrische Koordinate verhindern
    if (bc3 < 0) bc3 = 0;                                  // Negative 3. baryzentrische Koordinate verhindern
    P = pointBarycentric(bc1,bc2,bc3);                     // Punkt P in neuer Position
    }     
  update();                                                // Seitenl�ngen usw. aktualisieren
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Abstand zweier Punkte:
// p1, p2 ... Gegebene Punkte

function distancePP (p1, p2) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
// Punkt, gegeben durch baryzentrische Koordinaten:
// (u,v,w) ... Baryzentrische Koordinaten

function pointBarycentric (u, v, w) {
  var px = (u*A.x+v*B.x+w*C.x)/(u+v+w);                    // x-Koordinate
  var py = (u*A.y+v*B.y+w*C.y)/(u+v+w);                    // y-Koordinate
  return {x: px, y: py};                                   // R�ckgabewert
  }
  
// Umrechnung kartesischer Koordinaten in baryzentrische Koordinaten:
// (x,y) ... Kartesische Koordinaten

function barycentric (x, y) {
  var u0 = x*(C.y-B.y)+y*(B.x-C.x)+(C.x*B.y-B.x*C.y);      // 1. baryzentrische Koordinate
  var v0 = x*(A.y-C.y)+y*(C.x-A.x)+(A.x*C.y-C.x*A.y);      // 2. baryzentrische Koordinate
  var w0 = x*(B.y-A.y)+y*(A.x-B.x)+(B.x*A.y-A.x*B.y);      // 3. baryzentrische Koordinate
  return {u: u0, v: v0, w: w0};                            // R�ckgabewert
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad (Standardwerte):
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
     
// Punkt zeichnen:
// p ... Gegebener Punkt
// c ... Farbe
// n ... Name

function drawPoint (p, c, n) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2.5,0,2*Math.PI,true);                   // Kreis vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill();                                              // Kreis ausf�llen
  ctx.stroke();                                            // Kreisrand zeichnen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (n) ctx.fillText(n,p.x+5,p.y+4);                      // Beschriftung, falls gew�nscht
  }  
  
// Ecke des gegebenen Dreiecks hervorheben:
// p ... Gegebener Punkt
// n ... Name (optional)

function drawVertex (p, n) {
  drawPoint(p,color0,n);                                   // Punkt zeichnen (ausgef�llter Kreis)
  }
  
// Verbindungsstrecke zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawSegmentPP (p1, p2, c) {
  newPath(c?c:"#000000");                                  // Neuer Grafikpfad
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt
  ctx.lineTo(p2.x,p2.y);                                   // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Verbindungsgerade zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawLinePP (p1, p2, c) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand der gegebenen Punkte
  if (d == 0) return;                                      // Abbrechen, falls Gerade nicht definiert
  dx *= 1000/d; dy *= 1000/d;                              // Verbindungsvektor ausreichender L�nge 
  newPath(c?c:"#000000");                                  // Neuer Grafikpfad
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Ausgef�lltes Dreieck:
// p1, p2, p3 ... Ecken
// c ............ F�llfarbe
  
function triangle (p1, p2, p3, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt (1. Ecke)
  ctx.lineTo(p2.x,p2.y);                                   // Weiter zur 2. Ecke
  ctx.lineTo(p3.x,p3.y);                                   // Weiter zur 3. Ecke
  ctx.closePath();                                         // Zur�ck zur 1. Ecke
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill();                                              // Dreieck ausf�llen
  }
  
// Zum Vergleich �bertragene Strecke:
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... L�nge (Pixel)
// c ... Linienfarbe (optional, Defaultwert schwarz)
  
function lineComparison (x, y, w, c) {
  newPath(c);                                              // Neuer Grafikpfad mit gegebener Linienfarbe
  ctx.moveTo(x,y-3);                                       // Anfangspunkt (links oben)
  ctx.lineTo(x,y+3);                                       // Linie zum n�chsten Punkt (links unten)
  ctx.moveTo(x,y);                                         // Neuer Anfangspunkt (links)
  ctx.lineTo(x+w,y);                                       // Linie zum n�chsten Punkt (rechts)
  ctx.moveTo(x+w,y-3);                                     // Neuer Anfangspunkt (rechts oben)
  ctx.lineTo(x+w,y+3);                                     // Linie zum n�chsten Punkt (rechts unten)
  ctx.stroke();                                            // Linien zeichnen
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  triangle(A,B,C,"#ffffff");                               // Ausgef�lltes Dreieck
  drawSegmentPP(B,C);                                      // Seite a
  drawSegmentPP(C,A);                                      // Seite b
  drawSegmentPP(A,B);                                      // Seite c
  if (step >= 1 && step <= 4 || step == 15)                // Falls sinnvoll ... 
    drawSegmentPP(P12,P13,color2);                         // Parallele zu BC
  if (step >= 1 && step <= 4 || step == 15)                // Falls sinnvoll ...
    drawSegmentPP(P21,P23,color2);                         // Parallele zu CA
  if (step >= 1 && step <= 4 || step == 15)                // Falls sinnvoll ...
    drawSegmentPP(P31,P32,color2);                         // Parallele zu AB
  if (step >= 2 && step <= 4 || step == 15) {              // Falls sinnvoll ...
    lineComparison(50,350,p1,color2);                      // L�nge der 1. Parallele �bertragen
    lineComparison(50,360,p2,color2);                      // L�nge der 2. Parallele �bertragen
    lineComparison(50,370,p3,color2);                      // L�nge der 3. Parallele �bertragen
    }
  if (step >= 5) drawSegmentPP(E,F,color1);                // 1. Seite Antimedialdreieck               
  if (step >= 6) drawSegmentPP(F,D,color1);                // 2. Seite Antimedialdreieck
  if (step >= 7) drawSegmentPP(D,E,color1);                // 3. Seite Antimedialdreieck
  if (step >= 8) drawSegmentPP(A,W1,color1);               // 1. Winkelhalbierende (alpha)
  if (step >= 9) drawSegmentPP(B,W2,color1);               // 2. Winkelhalbierende (beta)
  if (step >= 10) drawSegmentPP(C,W3,color1);              // 3. Winkelhalbierende (gamma)
  if (step >= 11) drawLinePP(D,W1,step<=14?color2:color1); // 1. Gerade f�r gesuchten Punkt
  if (step >= 12) drawLinePP(E,W2,step<=14?color2:color1); // 2. Gerade f�r gesuchten Punkt
  if (step >= 13) drawLinePP(F,W3,step<=14?color2:color1); // 3. Gerade f�r gesuchten Punkt
  drawVertex(A,vertex1);                                   // Ecke A 
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step <= 4 || step >= 14) drawPoint(P,color0,point);  // Punkt P
  if (step == 11) drawPoint(D,color1);                     // 1. Ecke Antimedialdreieck
  if (step == 11) drawPoint(W1,color1);                    // Endpunkt 1. Winkelhalbierende
  if (step == 12) drawPoint(E,color1);                     // 2. Ecke Antimedialdreieck
  if (step == 12) drawPoint(W2,color1);                    // Endpunkt 2. Winkelhalbierende
  if (step == 13) drawPoint(F,color1);                     // 3. Ecke Antimedialdreieck
  if (step == 13) drawPoint(W3,color1);                    // Endpunkt 3. Winkelhalbierende
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

