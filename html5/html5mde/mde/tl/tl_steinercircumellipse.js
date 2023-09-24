// Dreiecks-Labor: Steiner-Umellipse
// 26.03.2017 - 08.09.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel tl_steinercircumellipse_de.js) abgespeichert.

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
var alpha, beta, gamma;                                    // Winkelgr��en (Bogenma�)
var step;                                                  // Einzelschritt (0 bis 9)
var U;                                                     // Umkreismittelpunkt
var M;                                                     // Mittelpunkt der variablen Ellipse
var M1, M2, M3;                                            // Seitenmittelpunkte
var S;                                                     // Schwerpunkt

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
  begin(100,300,300,300,150,120);                          // Anfangszustand
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
// Seiteneffekt a, b, c, alpha, beta, gamma, U, M1, M2, M3, S
  
function update () {
  a = distancePP(B,C);                                     // Seitenl�nge a (Pixel)
  b = distancePP(C,A);                                     // Seitenl�nge b (Pixel)
  c = distancePP(A,B);                                     // Seitenl�nge c (Pixel)
  alpha = Math.acos((b*b+c*c-a*a)/(2*b*c));                // Winkelgr��e alpha (Bogenma�)
  beta = Math.acos((c*c+a*a-b*b)/(2*c*a));                 // Winkelgr��e beta (Bogenma�)
  gamma = Math.acos((a*a+b*b-c*c)/(2*a*b));                // Winkelgr��e gamma (Bogenma�)
  var bcc1 = a*a*(b*b+c*c-a*a);                            // 1. baryzentrische Koordinate
  var bcc2 = b*b*(c*c+a*a-b*b);                            // 2. baryzentrische Koordinate
  var bcc3 = c*c*(a*a+b*b-c*c);                            // 3. baryzentrische Koordinate
  U = pointBarycentric(bcc1,bcc2,bcc3);                    // Umkreismittelpunkt
  M1 = pointBarycentric(0,1,1);                            // Mittelpunkt von [BC]
  M2 = pointBarycentric(1,0,1);                            // Mittelpunkt von [CA]
  M3 = pointBarycentric(1,1,0);                            // Mittelpunkt von [AB]
  S = pointBarycentric(1,1,1);                             // Schwerpunkt
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, M, nr, a, b, c, alpha, beta, gamma, M1, M2, M3, S

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  M = pointBarycentric(1.2,1,0.8);                         // Mittelpunkt der variablen Ellipse
  nr = 0;                                                  // Zun�chst keine Ecke ausgew�hlt
  update();                                                // Seitenl�ngen und Winkelgr��en aktualisieren
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
  if (step >= 9) {                                         // Falls letzter Schritt ...
    bu2.disabled = true;                                   // Schaltknopf deaktivieren
    M = pointBarycentric(1,1,1);                           // Mittelpunkt der variablen Ellipse korrigieren
    }
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
  d2New = distance2(u,v,M);                                // Abstand zum Punkt M
  if (d2New < d2Min && step >= 4) {n = 4; d2Min = d2New;}  // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  nr = (d2Min < 400 ? n : 0);                              // Bei zu gro�em Abstand kein Punkt ausgew�hlt
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
  if (nr == 4) {M.x = u; M.y = v;}                         // Falls M gezogen, Koordinaten von M aktualisieren
  update();                                                // Daten aktualisieren
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
// n ... Name (optional)

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
  
// Kreis:
// m ... Mittelpunkt
// p ... Punkt auf dem Kreis
// c ... Farbe (optional, Defaultwert schwarz)

function drawCircleMP (m, p, c) {
  newPath(c);                                              // Neuer Grafikpfad
  var r = distancePP(m,p);                                 // Radius
  ctx.arc(m.x,m.y,r,0,2*Math.PI,true);                     // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Ellipse zeichnen (nur Rand):
// x, y ... Koordinaten des Mittelpunkts (Pixel)
// a, b ... Halbachsen waagrecht/senkrecht (Pixel)
// d ...... Drehwinkel (Bogenma�, Gegenuhrzeigersinn)
// col .... Linienfarbe (optional, Defaultwert schwarz)
  
function ellipse (x, y, a, b, d, c) {
  if (a <= 0 || b <= 0) return;                            // Falls negative Halbachse, abbrechen
  newPath(c);                                              // Neuer Grafikpfad
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(x,y);                                      // Ellipsenmittelpunkt als Ursprung des Koordinatensystems 
  ctx.rotate(-d);                                          // Drehung
  ctx.scale(a,b);                                          // Skalierung in x- und y-Richtung
  ctx.arc(0,0,1,0,2*Math.PI,false);                        // Einheitskreis (wird durch Skalierung zur Ellipse)
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Hilfsroutine: Erg�nzung eines Polygonzugs
// u, v, w ... Baryzentrische Koordinaten des neuen Punkts
  
function lineToBCC (u, v, w) {
  var p = pointBarycentric(u,v,w);                         // Neuer Punkt
  ctx.lineTo(p.x,p.y);                                     // Linie zum Grafikpfad hinzuf�gen
  }
  
// Umschriebene Ellipse mit baryzentrischer Gleichung c1*v*w + c2*w*u + c3*u*v = 0
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
  
function drawCircumEllipseBCC (c1, c2, c3, col) {
  var N = 100, D = 1/N;                                    // Zahl der Teilintervalle, Schrittweite
  newPath(col);                                            // Neuer Grafikpfad
  ctx.moveTo(A.x,A.y);                                     // Anfangspunkt A
  for (var i=1; i<=N; i++) {                               // Von A nach B ...
    var v = i*D, u = 1-v, w = -c3*u*v/(c1*v+c2*u);         // Baryzentrische Koordinaten
    lineToBCC(u,v,w);                                      // Kurze Linie vorbereiten
    }
  for (i=1; i<=N; i++) {                                   // Von B nach C ...
    w = i*D; v = 1-w; u = -c1*v*w/(c2*w+c3*v);             // Baryzentrische Koordinaten
    lineToBCC(u,v,w);                                      // Kurze Linie vorbereiten
    }
  for (i=1; i<=N; i++) {                                   // Von C nach A ...
    u = i*D; w = 1-u; v = -c2*w*u/(c3*u+c1*w);             // Baryzentrische Koordinaten
    lineToBCC(u,v,w);                                      // Kurze Linie vorbereiten
    }
  ctx.stroke();                                            // Polygonzug als N�herung f�r Ellipse
  }
  
// Hilfsroutine: Ellipsenhalbachse
// a, b, c ... Koeffizienten der Gleichung a*x^2 + 2*b*x*y + c*y^2 = 1
// m ......... Steigung (Mittelpunktsgerade durch Ellipsenscheitel)

function semiaxis (a, b, c, m) {
  return Math.sqrt((1+m*m)/(a+2*b*m+c*m*m));
  }
  
// Ellipse, gegeben durch den Mittelpunkt und drei Punkte auf der Ellipse:
// M ............ Mittelpunkt
// P1, P2, P3 ... Punkte auf der Ellipse
// col .......... Farbe (optional, Defaultwert schwarz)
  
function drawEllipseMPPP (M, P1, P2, P3, col) {
  var dx1 = P1.x-M.x, dy1 = P1.y-M.y;                           // Koordinaten von P1 (Ursprung M)
  var dx2 = P2.x-M.x, dy2 = P2.y-M.y;                           // Koordinaten von P2 (Ursprung M)
  var dx3 = P3.x-M.x, dy3 = P3.y-M.y;                           // Koordinaten von P3 (Ursprung M)
  var a11 = dx1*dx1, a12 = 2*dx1*dy1, a13 = dy1*dy1;            // Koeffizienten der 1. Gleichung
  var a21 = dx2*dx2, a22 = 2*dx2*dy2, a23 = dy2*dy2;            // Koeffizienten der 2. Gleichung
  var a31 = dx3*dx3, a32 = 2*dx3*dy3, a33 = dy3*dy3;            // Koeffizienten der 3. Gleichung
  var det = a11*a22*a33+a12*a23*a31+a13*a21*a32                 // Anfang Determinante (f�r Nenner)
    -a31*a22*a13-a32*a23*a11-a33*a21*a12;                       // Fortsetzung Determinante (f�r Nenner)
  var det1 = a22*a33+a12*a23+a13*a32-a22*a13-a32*a23-a33*a12;   // Z�hler f�r Koeffizient a
  var det2 = a11*a33+a23*a31+a13*a21-a31*a13-a23*a11-a33*a21;   // Z�hler f�r Koeffizient b
  var det3 = a11*a22+a12*a31+a21*a32-a31*a22-a32*a11-a21*a12;   // Z�hler f�r Koeffizient c
  var a = det1/det, b = det2/det, c = det3/det;                 // Koeffizienten Ellipsengleichung
                                                                // Ursprung M; a*x^2 + 2*b*x*y + c*y^2 = 1
  var delta = Math.atan(2*b/(c-a))/2;                           // Drehwinkel (Bogenma�, Uhrzeigersinn)
  var m = -Math.tan(delta);                                     // Steigung
  var aEll = semiaxis(a,b,c,m);                                 // 1. Halbachse (nicht unbedingt gr��er)
  if (isNaN(aEll)) return;                                      // Falls nicht definiert, abbrechen
  var bEll = semiaxis(a,b,c,-1/m);                              // 2. Halbachse (nicht unbedingt kleiner)
  if (isNaN(bEll)) return;                                      // Falls nicht definiert, abbrechen
  ellipse(M.x,M.y,aEll,bEll,delta,col);                         // Ellipse zeichnen
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
  triangle(A,B,C,"#ffffff");                               // Ausgef�lltes Dreieck
  drawLinePP(B,C);                                         // Gerade BC
  drawLinePP(C,A);                                         // Gerade CA
  drawLinePP(A,B);                                         // Gerade AB
  if (step == 2) drawCircleMP(U,A,color1);                 // Umkreis
  if (step >= 6) drawSegmentPP(A,M1,color1);               // Seitenhalbierende zu [BC]
  if (step >= 7) drawSegmentPP(B,M2,color1);               // Seitenhalbierende zu [CA]
  if (step >= 8) drawSegmentPP(C,M3,color1);               // Seitenhalbierende zu [AB]
  if (step >= 4) drawEllipseMPPP(M,A,B,C,color1);          // Variable Ellipse
  if (step == 0) drawCircumEllipseBCC(1,1,1,color1);       // Steiner-Umellipse
  if (step >= 3) drawCircumEllipseBCC(1,1,1,color2);       // Steiner-Umellipse
  if (step == 1) {                                         // Gegebenenfalls ...
    for (var i=1; i<=3; i++)                               // F�r mehrere Werte des ersten Parameters ...
    for (var j=1; j<=3; j++)                               // F�r mehrere Werte des zweiten Parameters ...
    for (var k=1; k<=3; k++)                               // F�r mehrere Werte des dritten Parameters ...
      drawCircumEllipseBCC(i,j,k,color1);                  // Umellipse
    }
  drawVertex(A,vertex1);                                   // Ecke A
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step == 2) drawPoint(U,color1,circumcenter);         // Umkreismittelpunkt
  if (step >= 4) drawPoint(M,color1);                      // Mittelpunkt der variablen Ellipse
  if (step >= 9) drawPoint(S,color2);                      // Schwerpunkt
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

