// Dreiecks-Labor: Schiffler-Punkt
// Java-Applet (25.12.2007) umgewandelt
// 13.02.2017 - 29.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel tl_schifflerpoint_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe f�r bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe f�r Hilfslinien
var color2 = "#ff00ff";                                    // Farbe f�r Ergebnis (Hervorhebung)
var color3 = "#40ff40";                                    // Farbe f�r Teildreiecke

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Neustart, N�chster Schritt)
var ta;                                                    // Textbereich

var A, B, C;                                               // Ecken
var nr;                                                    // Nummer der ausgew�hlten Ecke (1, 2, 3 oder 0)
var a, b, c;                                               // Seitenl�ngen (Pixel)
var alpha, beta, gamma;                                    // Winkelgr��en (Bogenma�)
var step;                                                  // Einzelschritt (0 bis 9)
var S;                                                     // Schwerpunkt (ganzes Dreieck)
var U, U1, U2, U3;                                         // Umkreismittelpunkte (ganzes Dreieck und Teildreiecke)
var M1, M2, M3;                                            // Mittelpunkte der Seiten a, b und c
var H, H1, H2, H3;                                         // H�henschnittpunkte (ganzes Dreieck und Teildreiecke)
var F1, F2, F3;                                            // H�henfu�punkte
var I;                                                     // Inkreismittelpunkt
var rCC;                                                   // Umkreisradius
var rIC;                                                   // Inkreisradius
var Sch;                                                   // Schiffler-Punkt

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
  begin(100,300,300,300,120,140);                          // Anfangszustand
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
  
// Daten aktualisieren:
// Seiteneffekt a, b, c, alpha, beta, gamma, M1, M2, M3, S, U, H, F1, F2, F3, I, rCC, rIC, U1, U2, U3, H1, H2, H3, Sch
  
function update () {
  a = distancePP(B,C);                                     // Seitenl�nge a (Pixel)
  b = distancePP(C,A);                                     // Seitenl�nge b (Pixel)
  c = distancePP(A,B);                                     // Seitenl�nge c (Pixel)
  alpha = Math.acos((b*b+c*c-a*a)/(2*b*c));                // Winkelgr��e alpha (Bogenma�)
  beta = Math.acos((c*c+a*a-b*b)/(2*c*a));                 // Winkelgr��e beta (Bogenma�)
  gamma = Math.acos((a*a+b*b-c*c)/(2*a*b));                // Winkelgr��e gamma (Bogenma�)
  S = pointBarycentric(1,1,1);                             // Schwerpunkt von Dreieck ABC
  M1 = pointBarycentric(0,1,1);                            // Mittelpunkt der Seite [BC]
  M2 = pointBarycentric(1,0,1);                            // Mittelpunkt der Seite [CA]
  M3 = pointBarycentric(1,1,0);                            // Mittelpunkt der Seite [AB]
  U = circumCenter(A,B,C);                                 // Umkreismittelpunkt von Dreieck ABC
  H = orthoCenter(A,B,C);                                  // H�henschnittpunkt von Dreieck ABC
  var tan1 = Math.tan(alpha);                              // Tangenswert
  var tan2 = Math.tan(beta);                               // Tangenswert
  var tan3 = Math.tan(gamma);                              // Tangenswert
  F1 = pointBarycentric(0,tan2,tan3);                      // Fu�punkt der H�he h_a
  F2 = pointBarycentric(tan1,0,tan3);                      // Fu�punkt der H�he h_b
  F3 = pointBarycentric(tan1,tan2,0);                      // Fu�punkt der H�he h_c
  I = pointBarycentric(a,b,c);                             // Inkreismittelpunkt
  var s = (a+b+c)/2;                                       // Halber Umfang
  var area = Math.sqrt(s*(s-a)*(s-b)*(s-c));               // Fl�cheninhalt
  rCC = a*b*c/(4*area);                                    // Umkreisradius
  rIC = area/s;                                            // Inkreisradius
  U1 = circumCenter(A,B,I);                                // Umkreismittelpunkt von Teildreieck ABI
  U2 = circumCenter(B,C,I);                                // Umkreismittelpunkt von Teildreieck BCI
  U3 = circumCenter(C,A,I);                                // Umkreismittelpunkt von Teildreieck CAI
  H1 = orthoCenter(A,B,I);                                 // H�henschnittpunkt von Teildreieck ABI                    
  H2 = orthoCenter(B,C,I);                                 // H�henschnittpunkt von Teildreieck BCI    
  H3 = orthoCenter(C,A,I);                                 // H�henschnittpunkt von Teildreieck CAI    
  var cos1 = Math.cos(alpha);                              // Cosinuswert
  var cos2 = Math.cos(beta);                               // Cosinuswert
  var cos3 = Math.cos(gamma);                              // Cosinuswert
  Sch = pointBarycentric(a/(cos2+cos3),b/(cos3+cos1),c/(cos1+cos2)); // Schiffler-Punkt
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, nr, a, b, c, alpha, beta, gamma, M1, M2, M3, S, U, H, F1, F2, F3, I, rCC, rIC, 
// U1, U2, U3, H1, H2, H3, Sch

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  nr = 0;                                                  // Zun�chst keine Ecke ausgew�hlt
  update();                                                // Daten aktualisieren
  }
  
// Reaktion auf Schaltknopf (Neustart):
// Seiteneffekt step

function reactionReset () {
  step = 0;                                                // Einzelschritt
  bu2.disabled = false;                                    // Schaltknopf "N�chster Schritt" aktivieren
  setText(0);                                              // Text f�r Start
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (N�chster Schritt):
// Seiteneffekt step

function reactionNext () {
  step++;                                                  // N�chster Einzelschritt
  if (step >= 9) bu2.disabled = true;                      // Falls n�tig, Schaltknopf "N�chster Schritt" deaktivieren
  setText(step);                                           // Text f�r den n�chsten Einzelschritt
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
  update();                                                // Seitenl�ngen und Winkelgr��en aktualisieren
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
  
// Umkreismittelpunkt eines Dreiecks:
// p1, p2, p3 ... Ecken des Dreiecks
// Namenskonflikt mit circumcenter (Bezeichnung)

function circumCenter (p1, p2, p3) {
  var s1 = distancePP(p2,p3);                              // 1. Seitenl�nge
  var s2 = distancePP(p3,p1);                              // 2. Seitenl�nge
  var s3 = distancePP(p1,p2);                              // 3. Seitenl�nge
  var u = s1*s1*(s2*s2+s3*s3-s1*s1);                       // 1. baryzentrische Koordinate
  var v = s2*s2*(s3*s3+s1*s1-s2*s2);                       // 2. baryzentrische Koordinate
  var w = s3*s3*(s1*s1+s2*s2-s3*s3);                       // 3. baryzentrische Koordinate
  var mx = (u*p1.x+v*p2.x+w*p3.x)/(u+v+w);                 // x-Koordinate Mittelpunkt
  var my = (u*p1.y+v*p2.y+w*p3.y)/(u+v+w);                 // y-Koordinate Mittelpunkt
  return {x: mx, y: my};                                   // R�ckgabewert
  }
  
// H�henschnittpunkt eines Dreiecks:
// p1, p2, p3 ... Ecken des Dreiecks
// Namenskonflikt mit orthocenter (Bezeichnung)

function orthoCenter (p1, p2, p3) {
  var s1 = distancePP(p2,p3);                              // 1. Seitenl�nge
  var s2 = distancePP(p3,p1);                              // 2. Seitenl�nge
  var s3 = distancePP(p1,p2);                              // 3. Seitenl�nge
  var w1 = Math.acos((s2*s2+s3*s3-s1*s1)/(2*s2*s3));       // 1. Winkelgr��e
  var w2 = Math.acos((s3*s3+s1*s1-s2*s2)/(2*s3*s1));       // 2. Winkelgr��e
  var w3 = Math.acos((s1*s1+s2*s2-s3*s3)/(2*s1*s2));       // 3. Winkelgr��e
  var tan1 = Math.tan(w1);                                 // Tangenswert
  var tan2 = Math.tan(w2);                                 // Tangenswert
  var tan3 = Math.tan(w3);                                 // Tangenswert
  var sum = tan1+tan2+tan3;                                // Summe der Tangenswerte
  var ox = (tan1*p1.x+tan2*p2.x+tan3*p3.x)/sum;            // x-Koordinate
  var oy = (tan1*p1.y+tan2*p2.y+tan3*p3.y)/sum;            // y-Koordinate
  return {x: ox, y: oy};                                   // R�ckgabewert
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
  
// Lotgerade:
// p1, p2 ... Punkte der gegebenen Gerade
// p3 ....... Gegebener Punkt der Lotgerade
// c ........ Farbe (optional, Defaultwert schwarz)

function drawPerpendicularLine (p1, p2, p3, c) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var p = {x: p3.x+dy, y: p3.y-dx};                        // Weiterer Punkt der Lotgeraden
  drawLinePP(p3,p,c);                                      // Gerade zeichnen
  }
  
// Kreis:
// m ... Mittelpunkt
// r ... Radius
// c ... Farbe (optional, Defaultwert schwarz)

function drawCircleMR (m, r, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(m.x,m.y,r,0,2*Math.PI,true);                     // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
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
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  triangle(A,B,C,"#ffffff");                               // Ausgef�lltes Dreieck (ABC)
  if (step == 5) triangle(A,B,I,color3);                   // Ausgef�lltes Teildreieck (ABI)
  if (step == 6) triangle(B,C,I,color3);                   // Ausgef�lltes Teildreieck (BCI)
  if (step == 7) triangle(C,A,I,color3);                   // Ausgef�lltes Teildreieck (CAI)
  drawLinePP(B,C);                                         // Seite a (verl�ngert)
  drawLinePP(C,A);                                         // Seite b (verl�ngert)
  drawLinePP(A,B);                                         // Seite c (verl�ngert)
  if (step == 1) {                                         // Gegebenenfalls ...
    drawSegmentPP(A,M1,color1);                            // Seitenhalbierende s_a
    drawSegmentPP(B,M2,color1);                            // Seitenhalbierende s_b
    drawSegmentPP(C,M3,color1);                            // Seitenhalbierende s_c
    }
  if (step == 2) {                                         // Gegebenenfalls ... 
    drawPerpendicularLine(B,C,M1,color1);                  // Mittelsenkrechte zu [BC]
    drawPerpendicularLine(C,A,M2,color1);                  // Mittelsenkrechte zu [CA]
    drawPerpendicularLine(A,B,M3,color1);                  // Mittelsenkrechte zu [AB]
    }
  if (step == 3) {                                         // Gegebenenfalls ...
    drawLinePP(A,F1,color1);                               // H�he h_a
    drawLinePP(B,F2,color1);                               // H�he h_b
    drawLinePP(C,F3,color1);                               // H�he h_c
    }
  if (step >= 4) {                                         // Gegebenenfalls ...
    drawSegmentPP(A,I,color1);                             // 1. Teildreieck-Begrenzung
    drawSegmentPP(B,I,color1);                             // 2. Teildreieck-Begrenzung
    drawSegmentPP(C,I,color1);                             // 3. Teildreieck-Begrenzung
    }
  if (step >= 0 && step <= 3 || step >= 8)                 // Gegebenenfalls ... 
    drawLinePP(U,H,color1);                                // Euler-Gerade von Dreieck ABC
  if (step == 5 || step >= 8) drawLinePP(U1,H1,color1);    // Euler-Gerade von Teildreieck ABI
  if (step == 6 || step >= 8) drawLinePP(U2,H2,color1);    // Euler-Gerade von Teildreieck BCI
  if (step == 7 || step >= 8) drawLinePP(U3,H3,color1);    // Euler-Gerade von Teildreieck CAI
  if (step == 2) drawCircleMR(U,rCC,color1);               // Umkreis von Dreieck ABC
  if (step == 4) drawCircleMR(I,rIC,color1);               // Inkreis von Dreieck ABC
  drawVertex(A,vertex1);                                   // Ecke A
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step >= 1 && step <= 3) drawPoint(S,color1,centroid);// Schwerpunkt von Dreieck ABC
  if (step >= 2 && step <= 3) drawPoint(U,color1,circumcenter); // Umkreismittelpunkt von Dreieck ABC
  if (step == 3) drawPoint(H,color1,orthocenter);          // H�henschnittpunkt von Dreieck ABC
  if (step >= 4 && step <= 7) drawPoint(I,color1,incenter);// Inkreismittelpunkt von Dreieck ABC
  if (step >= 8) drawPoint(Sch,color2);                    // Schiffler-Punkt
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

