// Dreiecks-Labor: Brocard-Punkte
// Java-Applet (15.11.2004) umgewandelt
// 11.02.2017 - 25.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel tl_brocardpoints_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe f�r bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe f�r Hilfslinien
var color2 = "#ff00ff";                                    // Farbe f�r Ergebnis (Hervorhebung)
var color3 = "#40ff40";                                    // Farbe f�r Brocard-Winkel

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ch;                                                    // Auswahlfeld (1./2. fermat-Punkt)
var bu1, bu2;                                              // Schaltkn�pfe (Neustart, N�chster Schritt)
var ta;                                                    // Textbereich

var A, B, C;                                               // Ecken
var nr;                                                    // Nummer der ausgew�hlten Ecke (1, 2, 3 oder 0)
var a, b, c;                                               // Seitenl�ngen (Pixel)
var alpha, beta, gamma;                                    // Winkelgr��en (Bogenma�)
var step;                                                  // Einzelschritt (0 bis 12)
var bp1;
var c11, c12, c13;                                         // Kreise zur Konstruktion des 1. Brocard-Punkts
var c21, c22, c23;                                         // Kreise zur Konstruktion des 1. Brocard-Punkts
var B1, B2;                                                // Brocard-Punkt (1. oder 2.)

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
  ch = getElement("ch");                                   // Auswahlfeld (1./2. Brocard-Punkt)
  initSelect(ch);                                          // Auswahlfeld vorbereiten                                       
  bu1 = getElement("bu1",text02);                          // Schaltknopf (Neustart)
  bu2 = getElement("bu2",text03);                          // Schaltknopf (N�chster Schritt) 
  bu2.disabled = false;                                    // Schaltknopf zun�chst aktiviert
  ta = getElement("ta");                                   // Textbereich
  ta.readOnly = true;                                      // Text unver�nderlich
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  begin(100,300,300,300,150,120);                          // Anfangszustand
  bp1 = true;                                              // Zun�chst 1. Brocard-Punkt ausgew�hlt
  paint();                                                 // Zeichnen
  
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (1./2. Brocard-Punkt)
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionNext;                              // Reaktion auf Schaltknopf (N�chster Schritt)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
// Auswahlfeld vorbereiten:
// ch ... Auswahlfeld

function initSelect (ch) {
  for (var i=0; i<2; i++) {                                // F�r beide Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text01[i];                                    // Text festlegen
    ch.add(o);                                             // Element zum Auswahlfeld hinzuf�gen
    }
  }
  
// Textbereich aktualisieren:
// nr ... Index im Array text04 oder text05 (Erl�uterungen)
// Der Text h�ngt vom Flag bp1 ab.
  
function setText (nr) {
  var t = (bp1 ? text04[nr] : text05[nr]);                 // Array der Zeilen der passenden Erl�uterung 
  var s = "";                                              // Neue Zeichenkette (leer)
  for (var i=0; i<t.length; i++) s += t[i]+"\n";           // Zeilen und Zeilenumbr�che hinzuf�gen
  ta.value = s;                                            // Text in den Textbereich �bernehmen
  }
  
// Daten aktualisieren:
// Seiteneffekt a, b, c, alpha, beta, gamma, B1, B2, c11, c12, c13, c21, c22, c23
  
function update () {
  a = distancePP(B,C);                                     // Seitenl�nge a (Pixel)
  b = distancePP(C,A);                                     // Seitenl�nge b (Pixel)
  c = distancePP(A,B);                                     // Seitenl�nge c (Pixel)
  alpha = Math.acos((b*b+c*c-a*a)/(2*b*c));                // Winkelgr��e alpha (Bogenma�)
  beta = Math.acos((c*c+a*a-b*b)/(2*c*a));                 // Winkelgr��e beta (Bogenma�)
  gamma = Math.acos((a*a+b*b-c*c)/(2*a*b));                // Winkelgr��e gamma (Bogenma�)
  B1 = pointBarycentric(a*c/b,b*a/c,c*b/a);                // 1. Brocard-Punkt
  B2 = pointBarycentric(a*b/c,b*c/a,c*a/b);                // 2. Brocard-Punkt
  c11 = circumcircle(A,B,B1);                              // 1. Kreis (f�r 1. Brocard-Punkt)
  c12 = circumcircle(B,C,B1);                              // 2. Kreis (f�r 1. Brocard-Punkt)
  c13 = circumcircle(C,A,B1);                              // 3. Kreis (f�r 1. Brocard-Punkt)
  c21 = circumcircle(A,C,B2);                              // 1. Kreis (f�r 2. Brocard-Punkt)
  c22 = circumcircle(C,B,B2);                              // 2. Kreis (f�r 2. Brocard-Punkt)
  c23 = circumcircle(B,A,B2);                              // 3. Kreis (f�r 2. Brocard-Punkt)
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, nr, a, b, c, alpha, beta, gamma, B1, B2, c11, c12, c13, c21, c22, c23

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  setText(0);                                              // Textbereich aktualisieren
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  nr = 0;                                                  // Zun�chst keine Ecke ausgew�hlt
  update();                                                // Daten aktualisieren
  }
  
// Reaktion auf Auswahlfeld (1./2. Brocard-Punkt):

function reactionSelect () {
  bp1 = (ch.selectedIndex == 0);                           // Flag f�r 1. Brocard-Punkt
  bu2.disabled = false;                                    // Schaltknopf "N�chster Schritt" aktivieren
  begin(100,300,300,300,150,120);                          // Anfangszustand
  paint();                                                 // Neu zeichnen
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
  if (step >= 12) bu2.disabled = true;                     // Falls n�tig, Schaltknopf "N�chster Schritt" deaktivieren
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
  
// Umkreis eines Dreiecks:
// p1, p2, p3 ... Ecken des Dreiecks

function circumcircle (p1, p2, p3) {
  var s1 = distancePP(p2,p3);                              // 1. Seitenl�nge
  var s2 = distancePP(p3,p1);                              // 2. Seitenl�nge
  var s3 = distancePP(p1,p2);                              // 3. Seitenl�nge
  var u = s1*s1*(s2*s2+s3*s3-s1*s1);                       // 1. baryzentrische Koordinate
  var v = s2*s2*(s3*s3+s1*s1-s2*s2);                       // 2. baryzentrische Koordinate
  var w = s3*s3*(s1*s1+s2*s2-s3*s3);                       // 3. baryzentrische Koordinate
  var mx = (u*p1.x+v*p2.x+w*p3.x)/(u+v+w);                 // x-Koordinate Mittelpunkt
  var my = (u*p1.y+v*p2.y+w*p3.y)/(u+v+w);                 // y-Koordinate Mittelpunkt
  var dx = mx-p3.x, dy = my-p3.y;                          // Koordinatendifferenzen
  var kr = Math.sqrt(dx*dx+dy*dy);                         // Radius
  return {x: mx, y: my, r: kr};                            // R�ckgabewert
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
  
// Kreis zeichnen:
// k ... Kreis
// c ... Farbe
  
function drawCircle (k, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(k.x,k.y,k.r,0,2*Math.PI,true);                   // Kreisbogen vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// p1 ... Punkt auf dem ersten Schenkel
// p0 ... Scheitel
// p2 ... Punkt auf dem zweiten Schenkel 

function drawAngle (p1, p0, p2) {
  newPath();                                               // Neuer Grafikpfad
  ctx.fillStyle = color3;                                  // F�llfarbe
  ctx.moveTo(p0.x,p0.y);                                   // Scheitel als Anfangspunkt
  var v1x = p1.x-p0.x, v1y = p1.y-p0.y;                    // Verbindungsvektor p0-p1     
  var v2x = p2.x-p0.x, v2y = p2.y-p0.y;                    // Verbindungsvektor p0-p2
  var a1 = Math.atan2(v1y,v1x);                            // Startwinkel
  var a2 = Math.atan2(v2y,v2x);                            // Endwinkel
  var r = 20;                                              // Radius Kreisbogen
  ctx.lineTo(p0.x+r*Math.cos(a1),p0.y+r*Math.sin(a1));     // Linie auf dem ersten Schenkel
  ctx.arc(p0.x,p0.y,r,a1,a2,true);                         // Kreisbogen
  ctx.closePath();                                         // Zur�ck zum Scheitel
  ctx.fill(); ctx.stroke();                                // Kreissektor ausf�llen, Rand zeichnen
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
  var BP = (bp1 ? B1 : B2);                                // Aktueller Brocard-Punkt (1. oder 2.)
  var c1 = (bp1 ? c11 : c21);                              // 1. Kreis der Konstruktion
  var c2 = (bp1 ? c12 : c22);                              // 2. Kreis der Konstruktion
  var c3 = (bp1 ? c13 : c23);                              // 3. Kreis der Konstruktion
  triangle(A,B,C,"#ffffff");                               // Ausgef�lltes Dreieck
  if (step >= 9) {                                         // Gegebenenfalls ...
    if (bp1) drawAngle(B,A,BP);                            // Brocard-Winkel mit Scheitel A (f�r 1. Punkt) 
    else drawAngle(BP,A,C);                                // Brocard-Winkel mit Scheitel A (f�r 2. Punkt)
    }
  if (step >= 10) {                                        // Gegebenenfalls ...
    if (bp1) drawAngle(C,B,BP);                            // Brocard-Winkel mit Scheitel B (f�r 1. Punkt) 
    else drawAngle(BP,B,A);                                // Brocard-Winkel mit Scheitel B (f�r 2. Punkt)
    }
  if (step >= 11) {                                        // Gegebenenfalls ...
    if (bp1) drawAngle(A,C,BP);                            // Brocard-Winkel mit Scheitel C (f�r 1. Punkt) 
    else drawAngle(BP,C,B);                                // Brocard-Winkel mit Scheitel C (f�r 2. Punkt)
    }  
  drawLinePP(B,C);                                         // Seite a (verl�ngert)
  drawLinePP(C,A);                                         // Seite b (verl�ngert)
  drawLinePP(A,B);                                         // Seite c (verl�ngert)
  if (step == 1 || step >= 4) drawCircle(c1,color1);       // 1. Kreis der Konstruktion
  if (step == 2 || step >= 4) drawCircle(c2,color1);       // 2. Kreis der Konstruktion
  if (step == 3 || step >= 4) drawCircle(c3,color1);       // 3. Kreis der Konstruktion
  if (step >= 6) drawSegmentPP(A,BP,color1);               // 1. Verbindungslinie
  if (step >= 7) drawSegmentPP(B,BP,color1);               // 2. Verbindungslinie
  if (step >= 8) drawSegmentPP(C,BP,color1);               // 3. Verbindungslinie
  drawVertex(A,vertex1);                                   // Ecke A 
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step >= 5) drawPoint(BP,color2);                     // Aktueller Brocard-Punkt (1. oder 2.)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

