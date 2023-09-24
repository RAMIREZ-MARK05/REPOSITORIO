// Dreiecks-Labor: Ankreise
// Java-Applet (28.10.2004) umgewandelt
// 16.01.2017 - 22.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel tl_excircles_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe für bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe für Hilfslinien
var color2 = "#ff00ff";                                    // Farbe für Ergebnis (Hervorhebung)
var color3 = "#80ffff";                                    // Farbe für Innenwinkel
var color4 = "#00ff00";                                    // Farbe für Außenwinkel

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var bu1, bu2;                                              // Schaltknöpfe (Neustart, Nächster Schritt)
var ta;                                                    // Textbereich

var A, B, C;                                               // Ecken
var nr;                                                    // Nummer der ausgewählten Ecke (1, 2, 3 oder 0)
var a, b, c;                                               // Seitenlängen (Pixel)
var alpha, beta, gamma;                                    // Winkelgrößen (Bogenmaß)
var step;                                                  // Einzelschritt (0 bis 10)
var A1, A2, A3;                                            // Ankreismittelpunkte
var D, E, F;                                               // Endpunkte der Winkelhalbierenden
var T1, T2, T3, T1B, T1C, T2A, T2C, T3A, T3B;              // Berührpunkte 
var r1, r2, r3;                                            // Ankreisradien

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
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Neustart)
  bu2 = getElement("bu2",text02);                          // Schaltknopf (Nächster Schritt) 
  bu2.disabled = false;                                    // Schaltknopf zunächst aktiviert
  ta = getElement("ta");                                   // Textbereich
  setText(0);                                              // Text festlegen
  ta.readOnly = true;                                      // Text unveränderlich
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  begin(150,250,300,250,160,150);                          // Anfangszustand
  paint();                                                 // Zeichnen
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionNext;                              // Reaktion auf Schaltknopf (Nächster Schritt)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
// Textbereich aktualisieren:
// nr ... Index im Array text03 (Erläuterungen)
  
function setText (nr) {
  var t = text03[nr];                                      // Array der Zeilen der passenden Erläuterung 
  var s = "";                                              // Neue Zeichenkette (leer)
  for (var i=0; i<t.length; i++) s += t[i]+"\n";           // Zeilen und Zeilenumbrüche hinzufügen
  ta.value = s;                                            // Text in den Textbereich übernehmen
  }
  
// Seitenlängen und Winkelgrößen aktualisieren:
// Seiteneffekt a, b, c, alpha, beta, gamma, r1, r2, r3, D, E, F, A1, A2, A3, T1, T2, T3, T1B, T1C, T2A, T2C, T3A, T3B
  
function update () {
  a = distancePP(B,C);                                     // Seitenlänge a (Pixel)
  b = distancePP(C,A);                                     // Seitenlänge b (Pixel)
  c = distancePP(A,B);                                     // Seitenlänge c (Pixel)
  alpha = Math.acos((b*b+c*c-a*a)/(2*b*c));                // Winkelgröße alpha (Bogenmaß)
  beta = Math.acos((c*c+a*a-b*b)/(2*c*a));                 // Winkelgröße beta (Bogenmaß)
  gamma = Math.acos((a*a+b*b-c*c)/(2*a*b));                // Winkelgröße gamma (Bogenmaß)
  var s = (a+b+c)/2;                                       // Halber Umfang
  r1 = Math.sqrt(s*(s-b)*(s-c)/(s-a));                     // 1. Ankreisradius
  r2 = Math.sqrt(s*(s-a)*(s-c)/(s-b));                     // 2. Ankreisradius
  r3 = Math.sqrt(s*(s-a)*(s-b)/(s-c));                     // 3. Ankreisradius
  D = pointBarycentric(0,b,c);                             // Endpunkt von der Winkelhalbierenden von alpha
  E = pointBarycentric(a,0,c);                             // Endpunkt der Winkelhalbierenden von beta
  F = pointBarycentric(a,b,0);                             // Endpunkt der Winkelhalbierenden von gamma
  A1 = pointBarycentric(-a,b,c);                           // 1. Ankreismittelpunkt
  A2 = pointBarycentric(a,-b,c);                           // 2. Ankreismittelpunkt
  A3 = pointBarycentric(a,b,-c);                           // 3. Ankreismittelpunkt
  var tan1 = Math.tan(alpha/2);                            // Tangenswert
  var tan2 = Math.tan(beta/2);                             // Tangenswert
  var tan3 = Math.tan(gamma/2);                            // Tangenswert
  T1 = pointBarycentric(0,1/tan2,1/tan3);                  // Berührpunkt Ankreis 1 - Seite a
  T2 = pointBarycentric(1/tan1,0,1/tan3);                  // Berührpunkt Ankreis 2 - Seite b
  T3 = pointBarycentric(1/tan1,1/tan2,0);                  // Berührpunkt Ankreis 3 - Seite c
  T1B = pointBarycentric(-tan1,1/tan2,0);                  // Berührpunkt Ankreis 1 - Verlängerung c (bei B)
  T1C = pointBarycentric(-tan1,0,1/tan3);                  // Berührpunkt Ankreis 1 - Verlängerung b (bei C)
  T2A = pointBarycentric(1/tan1,-tan2,0);                  // Berührpunkt Ankreis 2 - Verlängerung c (bei A)
  T2C = pointBarycentric(0,-tan2,1/tan3);                  // Berührpunkt Ankreis 2 - Verlängerung a (bei C)
  T3A = pointBarycentric(1/tan1,0,-tan3);                  // Berührpunkt Ankreis 3 - Verlängerung b (bei A)
  T3B = pointBarycentric(0,1/tan2,-tan3);                  // Berührpunkt Ankreis 3 - Verlängerung a (bei B)
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, nr, a, b, c, alpha, beta, gamma, D, E, F, r1, r2, r3, A1, A2, A3, 
// T1, T2, T3, T1B, T1C, T2A, T2C, T3A, T3B

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  nr = 0;                                                  // Zunächst keine Ecke ausgewählt
  update();                                                // Seitenlängen und Winkelgrößen aktualisieren
  }
  
// Reaktion auf Schaltknopf (Neustart):
// Seiteneffekt step

function reactionReset () {
  step = 0;                                                // Einzelschritt
  bu2.disabled = false;                                    // Schaltknopf "Nächster Schritt" aktivieren
  setText(0);                                              // Text für Start
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (Nächster Schritt):
// Seiteneffekt step

function reactionNext () {
  step++;                                                  // Nächster Einzelschritt
  if (step >= 19) bu2.disabled = true;                     // Falls nötig, Schaltknopf "Nächster Schritt" deaktivieren
  setText(step);                                           // Text für den nächsten Einzelschritt
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (nr > 0) e.preventDefault();                          // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Keine Ecke ausgewählt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Keine Ecke ausgewählt, Zugmodus deaktiviert
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
  return dx*dx+dy*dy;                                      // Rückgabewert
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)  
  var d2Min = distance2(u,v,A);                            // Vorläufig minimaler Abstand zur Ecke A
  var n = 1;                                               // Nummer von Ecke A
  var d2New = distance2(u,v,B);                            // Abstand zur Ecke B
  if (d2New < d2Min) {n = 2; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  d2New = distance2(u,v,C);                                // Abstand zur Ecke C
  if (d2New < d2Min) {n = 3; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  nr = (d2Min < 400 ? n : 0);                              // Bei zu großem Abstand keine Ecke ausgewählt
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// u, v ... Bildschirmkoordinaten bezüglich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var v1x = (nr==2?u:B.x)-(nr==1?u:A.x);                   // x-Koordinate des veränderten Vektors AB
  var v1y = (nr==2?v:B.y)-(nr==1?v:A.y);                   // y-Koordinate des veränderten Vektors AB
  var v2x = (nr==3?u:C.x)-(nr==1?u:A.x);                   // x-Koordinate des veränderten Vektors AB
  var v2y = (nr==3?v:C.y)-(nr==1?v:A.y);                   // y-Koordinate des veränderten Vektors AB
  var corr = (v1x*v2y-v1y*v2x < 0);                        // Flag für Gegenuhrzeigersinn     
  if (corr && nr == 1) {A.x = u; A.y = v;}                 // Falls A gezogen, Koordinaten von A aktualisieren
  if (corr && nr == 2) {B.x = u; B.y = v;}                 // Falls B gezogen, Koordinaten von B aktualisieren
  if (corr && nr == 3) {C.x = u; C.y = v;}                 // Falls C gezogen, Koordinaten von C aktualisieren
  update();                                                // Seitenlängen und Winkelgrößen aktualisieren
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Abstand zweier Punkte:
// p1, p2 ... Gegebene Punkte

function distancePP (p1, p2) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert
  }
  
// Punkt, gegeben durch baryzentrische Koordinaten:
// (u,v,w) ... Baryzentrische Koordinaten

function pointBarycentric (u, v, w) {
  var px = (u*A.x+v*B.x+w*C.x)/(u+v+w);                    // x-Koordinate
  var py = (u*A.y+v*B.y+w*C.y)/(u+v+w);                    // y-Koordinate
  return {x: px, y: py};                                   // Rückgabewert
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
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill();                                              // Kreis ausfüllen
  ctx.stroke();                                            // Kreisrand zeichnen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (n) ctx.fillText(n,p.x+5,p.y+4);                      // Beschriftung, falls gewünscht
  }  
  
// Ecke des gegebenen Dreiecks hervorheben:
// p ... Gegebener Punkt
// n ... Name (optional)

function drawVertex (p, n) {
  drawPoint(p,color0,n);                                   // Punkt zeichnen (ausgefüllter Kreis)
  }
  
// Verbindungshalbgerade zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawRayPP (p1, p2, c) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand der gegebenen Punkte
  if (d == 0) return;                                      // Abbrechen, falls Gerade nicht definiert
  dx *= 1000/d; dy *= 1000/d;                              // Verbindungsvektor ausreichender Länge 
  newPath(c?c:"#000000");                                  // Neuer Grafikpfad
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Verbindungsgerade zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawLinePP (p1, p2, c) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand der gegebenen Punkte
  if (d == 0) return;                                      // Abbrechen, falls Gerade nicht definiert
  dx *= 1000/d; dy *= 1000/d;                              // Verbindungsvektor ausreichender Länge 
  newPath(c?c:"#000000");                                  // Neuer Grafikpfad
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gestrichelte Verbindungsstrecke zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawDashedLine (p1, p2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var l = Math.sqrt(dx*dx+dy*dy);                          // Länge
  var n = Math.floor((l-4)/6);                             // Zahl der Lücken
  var p = (l/2+2-3*n)/l;                                   // Parameter am Ende der ersten Linie
  ctx.moveTo(p1.x,p1.y);                                   // Zum Anfangspunkt
  ctx.lineTo(p1.x+p*dx,p1.y+p*dy);                         // Weiter zum Ende der ersten Linie
  while (p < 1) {                                          // Solange Endpunkt noch nicht erreicht ...
    p += 2/l; if (p >= 1) break;                           // Parameter für Ende der nächsten Lücke
    ctx.moveTo(p1.x+p*dx,p1.y+p*dy);                       // Zum Anfangspunkt der nächsten Linie
    p += 4/l; if (p > 1) p = 1;                            // Parameter für Ende der Linie
    ctx.lineTo(p1.x+p*dx,p1.y+p*dy);                       // Linie hinzufügen
    }
  ctx.stroke();                                            // Gestrichelte Linie zeichnen
  }
  
// Kreis:
// m ... Mittelpunkt
// r ... Radius
// c ... Farbe

function drawCircleMR (m, r, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(m.x,m.y,r,0,2*Math.PI,true);                     // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// p1 ... Punkt auf dem ersten Schenkel
// p0 ... Scheitel
// p2 ... Punkt auf dem zweiten Schenkel
// c ...... Füllfarbe 

function drawAngle (p1, p0, p2, c) {
  newPath();                                               // Neuer Grafikpfad
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.moveTo(p0.x,p0.y);                                   // Scheitel als Anfangspunkt
  var v1x = p1.x-p0.x, v1y = p1.y-p0.y;                    // Verbindungsvektor p0-p1     
  var v2x = p2.x-p0.x, v2y = p2.y-p0.y;                    // Verbindungsvektor p0-p2
  var a1 = Math.atan2(v1y,v1x);                            // Startwinkel
  var a2 = Math.atan2(v2y,v2x);                            // Endwinkel
  var r = 20;                                              // Radius Kreisbogen
  ctx.lineTo(p0.x+r*Math.cos(a1),p0.y+r*Math.sin(a1));     // Linie auf dem ersten Schenkel
  ctx.arc(p0.x,p0.y,r,a1,a2,true);                         // Kreisbogen
  ctx.closePath();                                         // Zurück zum Scheitel
  ctx.fill(); ctx.stroke();                                // Kreissektor ausfüllen, Rand zeichnen
  }
  
// Ausgefülltes Dreieck:
// p1, p2, p3 ... Ecken
// c ............ Füllfarbe
  
function triangle (p1, p2, p3, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt (1. Ecke)
  ctx.lineTo(p2.x,p2.y);                                   // Weiter zur 2. Ecke
  ctx.lineTo(p3.x,p3.y);                                   // Weiter zur 3. Ecke
  ctx.closePath();                                         // Zurück zur 1. Ecke
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill();                                              // Dreieck ausfüllen
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  triangle(A,B,C,"#ffffff");                               // Ausgefülltes Dreieck
  if (step >= 2 && step <= 5)                              // Gegebenenfalls ... 
    drawAngle(B,A,C,color3);                               // Innenwinkel alpha
  if (step >= 6 && step <= 9)                              // Gegebenenfalls ...
    drawAngle(C,B,A,color3);                               // Innenwinkel beta
  if (step >= 10 && step <= 13)                            // Gegebenenfalls ... 
    drawAngle(A,C,B,color3);                               // Innenwinkel gamma
  if (step >= 3 && step <= 5)                              // Gegebenenfalls ... 
    drawAngle(T1B,B,C,color4);                             // Außenwinkel beta* für Ankreis 1
  if (step >= 4 && step <= 5)                              // Gegebenenfalls ...
    drawAngle(B,C,T1C,color4);                             // Außenwinkel gamma* für Ankreis 1
  if (step >= 7 && step <= 9)                              // Gegebenenfalls ...
    drawAngle(T2C,C,A,color4);                             // Außenwinkel gamma* für Ankreis 2
  if (step >= 8 && step <= 9)                              // Gegebenenfalls ...
    drawAngle(C,A,T2A,color4);                             // Außenwinkel alpha* für Ankreis 2
  if (step >= 11 && step <= 13)                            // Gegebenenfalls ...
    drawAngle(T3A,A,B,color4);                             // Außenwinkel alpha* für Ankreis 3
  if (step >= 12 && step <= 13)                            // Gegebenenfalls ...
    drawAngle(A,B,T3B,color4);                             // Außenwinkel beta* für Ankreis 3 
  drawLinePP(B,C);                                         // Seite a (verlängert)
  drawLinePP(C,A);                                         // Seite b (verlängert)
  drawLinePP(A,B);                                         // Seite c (verlängert)
  if (step >= 2 && step <= 5)                              // Gegebenenfalls ...
    drawRayPP(A,D,color1);                                 // Winkelhalbierende von alpha (Halbgerade)
  if (step >= 6 && step <= 9)                              // Gegebenenfalls ... 
    drawRayPP(B,E,color1);                                 // Winkelhalbierende von beta (Halbgerade)
  if (step >= 10 && step <= 13)                            // Gegebenenfalls ...
    drawRayPP(C,F,color1);                                 // Winkelhalbierende von gamma (Halbgerade)
  if (step >= 3 && step <= 5)                              // Gegebenenfalls ...
    drawRayPP(B,A1,color1);                                // Winkelhalbierende von beta* für Ankreis 1 (Halbgerade)
  if (step >= 4 && step <= 5)                              // Gegebenenfalls ...
    drawRayPP(C,A1,color1);                                // Winkelhalbierende von gamma* für Ankreis 1 (Halbgerade) 
  if (step >= 7 && step <= 9)                              // Gegebenenfalls ...
    drawRayPP(C,A2,color1);                                // Winkelhalbierende von gamma* für Ankreis 2 (Halbgerade)
  if (step >= 8 && step <= 9)                              // Gegebenenfalls ...
    drawRayPP(A,A2,color1);                                // Winkelhalbierende von alpha* für Ankreis 2 (Halbgerade)
  if (step >= 11 && step <= 13)                            // Gegebenenfalls ...
    drawRayPP(A,A3,color1);                                // Winkelhalbierende von alpha* für Ankreis 3 (Halbgerade)
  if (step >= 12 && step <= 13)                            // Gegebenenfalls ...
    drawRayPP(B,A3,color1);                                // Winkelhalbierende von beta* für Ankreis 3 (Halbgerade)
  if (step >= 14) drawDashedLine(A1,T1,color1);            // Abstand Mittelpunkt 1 - Seite a (gestrichelt)
  if (step >= 14) drawDashedLine(A1,T1B,color1);           // Abstand Mittelpunkt 1 - Verlängerung c (gestrichelt)
  if (step >= 14) drawDashedLine(A1,T1C,color1);           // Abstand Mittelpunkt 1 - Verlängerung b (gestrichelt)
  if (step >= 15) drawDashedLine(A2,T2,color1);            // Abstand Mittelpunkt 2 - Seite b (gestrichelt)
  if (step >= 15) drawDashedLine(A2,T2A,color1);           // Abstand Mittelpunkt 2 - Verlängerung c (gestrichelt)
  if (step >= 15) drawDashedLine(A2,T2C,color1);           // Abstand Mittelpunkt 2 - Verlängerung a (gestrichelt)
  if (step >= 16) drawDashedLine(A3,T3,color1);            // Abstand Mittelpunkt 3 - Seite c (gestrichelt)
  if (step >= 16) drawDashedLine(A3,T3A,color1);           // Abstand Mittelpunkt 3 - Verlängerung b (gestrichelt)
  if (step >= 16) drawDashedLine(A3,T3B,color1);           // Abstand Mittelpunkt 3 - Verlängerung a (gestrichelt)  
  if (step <= 1 || step >= 17) drawCircleMR(A1,r1,color2); // Ankreis 1
  if (step <= 1 || step >= 18) drawCircleMR(A2,r2,color2); // Ankreis 2
  if (step <= 1 || step >= 19) drawCircleMR(A3,r3,color2); // Ankreis 3
  drawVertex(A,vertex1);                                   // Ecke A
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step == 1 || step == 5 || step >= 14)                // Gegebenenfalls ... 
    drawPoint(A1,color2);                                  // Mittelpunkt von Ankreis 1
  if (step == 1 || step == 9 || step >= 15)                // Gegebenenfalls ...
    drawPoint(A2,color2);                                  // Mittelpunkt von Ankreis 2
  if (step == 1 || step == 13 || step >= 16)               // Gegebenenfalls ...
    drawPoint(A3,color2);                                  // Mittelpunkt von Ankreis 3
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

