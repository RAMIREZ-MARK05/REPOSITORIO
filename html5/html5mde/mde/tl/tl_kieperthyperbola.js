// Dreiecks-Labor: Kiepert-Hyperbel
// 31.03.2017 - 25.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel tl_kieperthyperbola_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe für bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe für Hilfslinien
var color2 = "#ff00ff";                                    // Farbe für Ergebnis (Hervorhebung)

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var N = 100;                                               // Zahl der Teilintervalle (Hyperbel)
var D = 1/N;                                               // Intervallgröße (Hyperbel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var bu1, bu2;                                              // Schaltknöpfe (Neustart, Nächster Schritt)
var ta;                                                    // Textbereich

var A, B, C;                                               // Ecken
var phi;                                                   // Basiswinkel der aufgesetzten Dreiecke (Bogenmaß)
var S1, S2, S3;                                            // Spitzen der aufgesetzten Dreiecke
var u1, v1, w1, u2, v2, w2, u3, v3, w3;                    // Zugehörige baryzentrische Koordinaten
var P;                                                     // Schnittpunkt der Verbindungsgeraden
var nr;                                                    // Nummer des ausgewählten Punkts (1 bis 6 oder 0)
var a, b, c;                                               // Seitenlängen (Pixel)
var alpha, beta, gamma;                                    // Winkelgrößen (Bogenmaß)
var step;                                                  // Einzelschritt (0 bis 13)
var M1, M2, M3;                                            // Seitenmittelpunkte
var S;                                                     // Schwerpunkt
var H;                                                     // Höhenschnittpunkt
var Sp;                                                    // Spieker-Punkt

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
  phi = 20*Math.PI/180;                                    // Basiswinkel der aufgesetzten Dreiecke (Bogenmaß)
  begin(100,300,300,300,150,120);                          // Anfangszustand  
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
  
// Daten aktualisieren:
// Seiteneffekt a, b, c, alpha, beta, gamma, rIC, u1, v1, w1, u2, v2, w2, u3, v3, w3, S1, S2, S3,
// P, M1, M2, M3, S, H, Sp
  
function update () {
  a = distancePP(B,C);                                     // Seitenlänge a (Pixel)
  b = distancePP(C,A);                                     // Seitenlänge b (Pixel)
  c = distancePP(A,B);                                     // Seitenlänge c (Pixel)
  alpha = Math.acos((b*b+c*c-a*a)/(2*b*c));                // Winkelgröße alpha (Bogenmaß)
  beta = Math.acos((c*c+a*a-b*b)/(2*c*a));                 // Winkelgröße beta (Bogenmaß)
  gamma = Math.acos((a*a+b*b-c*c)/(2*a*b));                // Winkelgröße gamma (Bogenmaß)
  var s = (a+b+c)/2;                                       // Halber Umfang
  rIC = Math.sqrt((s-a)*(s-b)*(s-c)/s);                    // Inkreisradius
  u1 = -a*Math.sin(phi);                                   // 1. baryzentrische Koordinate von S1
  v1 = b*Math.sin(gamma+phi);                              // 2. baryzentrische Koordinate von S1
  w1 = c*Math.sin(beta+phi);                               // 3. baryzentrische Koordinate von S1
  S1 = pointBarycentric(u1,v1,w1);                         // S1 (Spitze des ersten aufgesetzten Dreiecks)
  u2 = a*Math.sin(gamma+phi);                              // 1. baryzentrische Koordinate von S2
  v2 = -b*Math.sin(phi);                                   // 2. baryzentrische Koordinate von S2
  w2 = c*Math.sin(alpha+phi);                              // 3. baryzentrische Koordinate von S2
  S2 = pointBarycentric(u2,v2,w2);                         // S2 (Spitze des zweiten aufgesetzten Dreiecks)
  u3 = a*Math.sin(beta+phi);                               // 1. baryzentrische Koordinate von S3
  v3 = b*Math.sin(alpha+phi);                              // 2. baryzentrische Koordinate von S3
  w3 = -c*Math.sin(phi);                                   // 3. baryzentrische Koordinate von S3
  S3 = pointBarycentric(u3,v3,w3);                         // S3 (Spitze des dritten aufgesetzten Dreiecks)
  P = pointBarycentric(u2*w1,v1*w2,w1*w2);                 // Schnittpunkt der Verbindungsgeraden
  M1 = pointBarycentric(0,1,1);                            // Mittelpunkt von [BC]
  M2 = pointBarycentric(1,0,1);                            // Mittelpunkt von [CA]
  M3 = pointBarycentric(1,1,0);                            // Mittelpunkt von [AB]
  S = pointBarycentric(1,1,1);                             // Schwerpunkt
  var h1 = Math.tan(alpha);                                // 1. baryzentrische Koordinate von H
  var h2 = Math.tan(beta);                                 // 2. baryzentrische Koordinate von H
  var h3 = Math.tan(gamma);                                // 3. baryzentrische Koordinate von H
  H = pointBarycentric(h1,h2,h3);                          // Höhenschnittpunkt
  Sp = pointBarycentric(b+c,c+a,a+b);                      // Spieker-Punkt
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, M, nr, a, b, c, alpha, beta, gamma, rIC, u1, v1, w1, u2, v2, w2, u3, v3, w3, S1, S2, S3,
// P, M1, M2, M3,S, H, Sp

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
  if (step >= 13) bu2.disabled = true;                     // Falls letzter Schritt, Schaltknopf deaktivieren
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
  nr = 0;                                                  // Kein Punkt ausgewählt, Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Kein Punkt ausgewählt, Zugmodus deaktiviert
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
// (x,y) ... Gegebene Position (Pixel)
// p ....... Gegebener Punkt
  
function distance2 (x, y, p) {
  var dx = x-p.x, dy = y-p.y;                              // Koordinatendifferenzen
  return dx*dx+dy*dy;                                      // Rückgabewert
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)  
  var d2Min = distance2(x,y,A);                            // Vorläufig minimaler Abstand zur Ecke A
  var n = 1;                                               // Nummer von Ecke A
  var d2New = distance2(x,y,B);                            // Abstand zur Ecke B
  if (d2New < d2Min) {n = 2; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  d2New = distance2(x,y,C);                                // Abstand zur Ecke C
  if (d2New < d2Min) {n = 3; d2Min = d2New;}               // Gegebenenfalls minimalen Abstand und Nummer aktualisieren
  d2New = distance2(x,y,S1);                               // Abstand zur Spitze S1
  if (d2New < d2Min && step >= 1 && step <= 8) {           // Gegebenenfalls ...
    n = 4; d2Min = d2New;                                  // Minimalen Abstand und Nummer aktualisieren
    }  
  d2New = distance2(x,y,S2);                               // Abstand zur Spitze S2
  if (d2New < d2Min && step >= 2 && step <= 8) {           // Gegebenenfalls ...
    n = 5; d2Min = d2New;                                  // Minimalen Abstand und Nummer aktualisieren
    }
  d2New = distance2(x,y,S3);                               // Abstand zur Spitze S3
  if (d2New < d2Min && step >= 3 && step <= 8) {           // Gegebenenfalls ...
    n = 6; d2Min = d2New;                                  // Minimalen Abstand und Nummer aktualisieren
    }
  nr = (d2Min < 400 ? n : 0);                              // Bei zu großem Abstand kein Punkt ausgewählt
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// x, y ... Bildschirmkoordinaten bezüglich Viewport

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var v1x = (nr==2?x:B.x)-(nr==1?x:A.x);                   // x-Koordinate des veränderten Vektors AB
  var v1y = (nr==2?y:B.y)-(nr==1?y:A.y);                   // y-Koordinate des veränderten Vektors AB
  var v2x = (nr==3?x:C.x)-(nr==1?x:A.x);                   // x-Koordinate des veränderten Vektors AB
  var v2y = (nr==3?y:C.y)-(nr==1?y:A.y);                   // y-Koordinate des veränderten Vektors AB
  var corr = (v1x*v2y-v1y*v2x < 0);                        // Flag für Gegenuhrzeigersinn     
  if (corr && nr == 1) {A.x = x; A.y = y;}                 // Falls A gezogen, Koordinaten von A aktualisieren
  if (corr && nr == 2) {B.x = x; B.y = y;}                 // Falls B gezogen, Koordinaten von B aktualisieren
  if (corr && nr == 3) {C.x = x; C.y = y;}                 // Falls C gezogen, Koordinaten von C aktualisieren
  if (nr == 4) phi = anglePPP(B,C,x,y);                    // Falls S1 gezogen, Winkel phi aktualisieren
  if (nr == 5) phi = anglePPP(C,A,x,y);                    // Falls S2 gezogen, Winkel phi aktualisieren
  if (nr == 6) phi = anglePPP(A,B,x,y);                    // Falls S3 gezogen, Winkel phi aktualisieren
  update();                                                // Daten aktualisieren
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
  
// Vorzeichenbehafteter Winkel, gegeben durch drei Punkte:
// p1 ......... Punkt auf dem ersten Schenkel
// p0 ......... Scheitel
// p2x, p2y ... Koordinaten eines Punkts auf dem zweiten Schenkel

function anglePPP (p1, p0, p2x, p2y) {
  var ux = p1.x-p0.x, uy = p1.y-p0.y;                      // Richtungsvektor 1. Schenkel
  var vx = p2x-p0.x, vy = p2y-p0.y;                        // Richtungsvektor 2. Schenkel
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag 1. Richtungsvektor
  var v = Math.sqrt(vx*vx+vy*vy);                          // Betrag 2. Richtungsvektor
  var w = Math.acos((ux*vx+uy*vy)/(u*v));                  // Betrag Winkelgröße (Bogenmaß)
  return (ux*vy-uy*vx>0 ? -w : w);                         // Rückgabewert (mit Vorzeichen)
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
  
// Verbindungsstrecke zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawSegmentPP (p1, p2, c) {
  newPath(c);                                              // Neuer Grafikpfad
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
  dx *= 1000/d; dy *= 1000/d;                              // Verbindungsvektor ausreichender Länge 
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gerade mit baryzentrischer Gleichung c1*u + c2*v + c3*w = 0
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
  
function drawLineBCC (c1, c2, c3, col) {
  var p1, p2;                                              // Bestimmungspunkte
  if (c3 != 0) {                                           // Falls 3. Koeffizient ungleich 0 ...
    p1 = pointBarycentric(1,0,-c1/c3);                     // 1. Bestimmungspunkt
    p2 = pointBarycentric(0,1,-c2/c3);                     // 2. Bestimmungspunkt
    }
  else if (c2 != 0) {                                      // Falls 2. Koeffizient ungleich 0 und 3. Koeffizient gleich 0 ...
    p1 = pointBarycentric(1,-c1/c2,0);                     // 1. Bestimmungspunkt
    p2 = pointBarycentric(0,0,1);                          // 2. Bestimmungspunkt
    }
  else if (c1 != 0) {                                      // Falls nur 1. Koeffizient ungleich 0 ...                                
    p1 = pointBarycentric(0,1,0);                          // 1. Bestimmungspunkt
    p2 = pointBarycentric(0,0,1);                          // 2. Bestimmungspunkt
    }
  else return;                                             // Falls alle Koeffizienten gleich 0, abbrechen
  drawLinePP(p1,p2,col);                                   // Gerade zeichnen
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
  
// Überprüfung, ob gegebener Punkt in der Nähe von A:
// (u,v,w) ... Baryzentrische Koordinaten
// Rückgabewert: true, falls Punkt diesseits der Mittelparallele; sonst false
  
function nearA (u, v, w) {return ((v+w-u)*(u+v+w) < 0);}

// Überprüfung, ob gegebener Punkt in der Nähe von B:
// (u,v,w) ... Baryzentrische Koordinaten
// Rückgabewert: true, falls Punkt diesseits der Mittelparallele; sonst false

function nearB (u, v, w) {return ((w+u-v)*(u+v+w) < 0);}

// Überprüfung, ob gegebener Punkt in der Nähe von C:
// (u,v,w) ... Baryzentrische Koordinaten
// Rückgabewert: true, falls Punkt diesseits der Mittelparallele; sonst false

function nearC (u, v, w) {return ((u+v-w)*(u+v+w) < 0);}

// Hilfsroutine für Hyperbel: Anfangspunkt eines Polygonzugs
// u, v, w ... Baryzentrische Koordinaten 
  
function moveToBCC (u, v, w) {
  var p = pointBarycentric(u,v,w);                         // Punkt
  ctx.moveTo(p.x,p.y);                                     // Aktueller Punkt für Grafikpfad
  }
  
// Hilfsroutine: Ergänzung eines Polygonzugs
// u, v, w ... Baryzentrische Koordinaten des neuen Punkts
  
function lineToBCC (u, v, w) {
  var p = pointBarycentric(u,v,w);                         // Neuer Punkt
  ctx.lineTo(p.x,p.y);                                     // Linie zum Grafikpfad hinzufügen
  }
  
// Hyperbelast durch B und C:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
  
function hyperbolaBC (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-N); i<=2*N; i++) {                 // Für alle Indizes ...
    var w = i*D, v = 1-w, u = -c1*v*w/(c2*w+c3*v);         // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (nearA(u,v,w)) continue;                          // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (!nearA(u,v,w)) lineToBCC(u,v,w);                 // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Hyperbelast durch A:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
 
function hyperbolaA (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-2*N); i<=2*N; i++) {               // Für alle Indizes ...
    var w = i*D, u = 1, v = -c2*w*u/(c3*u+c1*w);           // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (!nearA(u,v,w)) continue;                         // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (nearA(u,v,w)) lineToBCC(u,v,w);                  // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  } 
  
// Hyperbelast durch C und A:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
  
function hyperbolaCA (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-N); i<=2*N; i++) {                 // Für alle Indizes ...
    var u = i*D, w = 1-u, v = -c2*w*u/(c3*u+c1*w);         // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (nearB(u,v,w)) continue;                          // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (!nearB(u,v,w)) lineToBCC(u,v,w);                 // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Hyperbelast durch B:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
 
function hyperbolaB (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-2*N); i<=2*N; i++) {               // Für alle Indizes ...
    var u = i*D, v = 1, w = -c3*u*v/(c1*v+c2*u);           // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (!nearB(u,v,w)) continue;                         // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (nearB(u,v,w)) lineToBCC(u,v,w);                  // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  } 
  
// Hyperbelast durch A und B:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
  
function hyperbolaAB (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-N); i<=2*N; i++) {                 // Für alle Indizes ...
    var v = i*D, u = 1-v, w = -c3*u*v/(c1*v+c2*u);         // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (nearC(u,v,w)) continue;                          // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (!nearC(u,v,w)) lineToBCC(u,v,w);                 // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Hyperbelast durch C:
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
 
function hyperbolaC (c1, c2, c3, col) {
  newPath(col);                                            // Neuer Grafikpfad
  var draw = false;                                        // Noch keine Zeichenphase
  for (var i=Math.ceil(-2*N); i<=2*N; i++) {               // Für alle Indizes ...
    var v = i*D, w = 1, u = -c1*v*w/(c2*w+c3*v);           // Baryzentrische Koordinaten
    if (!draw) {                                           // Falls Zeichenphase noch nicht begonnen hat ...
      if (!nearC(u,v,w)) continue;                         // Falls falscher Hyperbelast, Index erhöhen
      draw = true;                                         // Andernfalls Anfang der Zeichenphase
      moveToBCC(u,v,w);                                    // Anfangspunkt
      }
    else {                                                 // Falls Zeichenphase ...
      if (nearC(u,v,w)) lineToBCC(u,v,w);                  // Falls richtiger Hyperbelast, Linie zum Grafikpfad hinzufügen
      else break;                                          // Andernfalls for-Schleife beenden
      }
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  } 
  
// Umschriebene Hyperbel mit baryzentrischer Gleichung c1*v*w + c2*w*u + c3*u*v = 0
// c1, c2, c3 ... Koeffizienten
// col .......... Farbe
// Sonderfälle: 
// Alle Koeffizienten gleich 0 ==> Gleichung immer erfüllt
// Genau zwei Koeffizienten gleich 0 ==> zwei verlängerte Dreiecksseiten
// Genau ein Koeffizient gleich 0 ==> eine verlängerte Dreiecksseite und eine weitere Gerade
  
function drawCircumHyperbolaBCC (c1, c2, c3, col) {
  if (c1 == 0 && c2 == 0 && c3 == 0) return;               // Falls alle Koeffizienten gleich 0, abbrechen
  if (c1 == 0) {                                           // Falls 1. Koeffizient gleich 0 ...
    drawLinePP(B,C,col);                                   // Gerade BC
    if (c2 != 0 && c3 != 0) drawLineBCC(0,c3,c2,col);      // Weitere Gerade
    }
  if (c2 == 0) {                                           // Falls 2. Koeffizient gleich 0 ...
    drawLinePP(C,A,col);                                   // Gerade CA
    if (c1 != 0 && c3 != 0) drawLineBCC(c3,0,c1,col);      // Weitere Gerade
    }
  if (c3 == 0) {                                           // Falls 3. Koeffizient gleich 0 ...
    drawLinePP(A,B,col);                                   // Gerade AB
    if (c1 != 0 && c2 != 0) drawLineBCC(c2,c1,0,col);      // Weitere Gerade
    }    
  if (c1<0 && c2>0 && c3>0 || c1>0 && c2<0 && c3<0) {      // 1. Fall (Vorzeichen von c1 abweichend)
    hyperbolaBC(c1,c2,c3,col);                             // Hyperbelast durch B und C
    hyperbolaA(c1,c2,c3,col);                              // Hyperbelast durch A
    }
  else if (c1>0 && c2<0 && c3>0 || c1<0 && c2>0 && c3<0) { // 2. Fall (Vorzeichen von c2 abweichend)
    hyperbolaCA(c1,c2,c3,col);                             // Hyperbelast durch C und A
    hyperbolaB(c1,c2,c3,col);                              // Hyperbelast durch B
    }
  else if (c1>0 && c2>0 && c3<0 || c1<0 && c2<0 && c3>0) { // 3. Fall (Vorzeichen von c3 abweichend)
    hyperbolaAB(c1,c2,c3,col);                             // Hyperbelast durch A und B
    hyperbolaC(c1,c2,c3,col);                              // Hyperbelast durch C
    }
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
  drawLinePP(B,C);                                         // Gerade BC
  drawLinePP(C,A);                                         // Gerade CA
  drawLinePP(A,B);                                         // Gerade AB
  if (step >= 1 && step <= 8) {                            // Gegebenenfalls ...
    drawSegmentPP(B,S1,color1);                            // Schenkel des ersten aufgesetzten Dreiecks
    drawSegmentPP(C,S1,color1);                            // Schenkel des ersten aufgesetzten Dreiecks
    }
  if (step >= 2 && step <= 8) {                            // Gegebenenfalls ...
    drawSegmentPP(C,S2,color1);                            // Schenkel des zweiten aufgesetzten Dreiecks
    drawSegmentPP(A,S2,color1);                            // Schenkel des zweiten aufgesetzten Dreiecks
    }
  if (step >= 3 && step <= 8) {                            // Gegebenenfalls ...
    drawSegmentPP(A,S3,color1);                            // Schenkel des dritten aufgesetzten Dreiecks
    drawSegmentPP(B,S3,color1);                            // Schenkel des dritten aufgesetzten Dreiecks
    }
  if (step >= 4 && step <= 8)                              // Gegebenenfalls ... 
    drawLinePP(A,S1,color1);                               // Erste Verbindungsgerade
  if (step >= 5 && step <= 8)                              // Gegebenenfalls ...
    drawLinePP(B,S2,color1);                               // Zweite Verbindungsgerade
  if (step >= 6 && step <= 8)                              // Gegebenenfalls ... 
    drawLinePP(C,S3,color1);                               // Dritte Verbindungsgerade
  if (step == 10) {                                        // Gegebenenfalls ...
    drawSegmentPP(A,M1,color1);                            // Erste Seitenhalbierende
    drawSegmentPP(B,M2,color1);                            // Zweite Seitenhalbierende
    drawSegmentPP(C,M3,color1);                            // Dritte Seitenhalbierende
    } 
  if (step == 11) {                                        // Gegebenenfalls ...
    drawLinePP(A,H,color1);                                // Erste Höhe (verlängert)
    drawLinePP(B,H,color1);                                // Zweite Höhe (verlängert)
    drawLinePP(C,H,color1);                                // Dritte Höhe (verlängert)
    } 
  if (step == 12) {                                        // Gegebenenfalls ...
    drawSegmentPP(M2,M3,color1);                           // Erste Mittelparallele
    drawSegmentPP(M3,M1,color1);                           // Zweite Mittelparallele
    drawSegmentPP(M1,M2,color1);                           // Dritte Mittelparallele
    drawCircleMR(Sp,rIC/2,color1);                         // Inkreis Mittendreieck                     
    }  
  if (step >= 8)                                           // Gegebenenfalls ...
    drawCircumHyperbolaBCC(b*b-c*c,c*c-a*a,a*a-b*b,color2);// Kiepert-Hyperbel
  drawVertex(A,vertex1);                                   // Ecke A
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step >= 1 && step <= 8) drawPoint(S1,color0);        // Spitze des ersten aufgesetzten Dreiecks
  if (step >= 2 && step <= 8) drawPoint(S2,color0);        // Spitze des zweiten aufgesetzten Dreiecks
  if (step >= 3 && step <= 8) drawPoint(S3,color0);        // Spitze des dritten aufgesetzten Dreiecks
  if (step >= 7 && step <= 8) drawPoint(P,color1);         // Schnittpunkt der Verbindungsgeraden
  if (step == 10) drawPoint(S,color1,centroid);            // Schwerpunkt (mit Beschriftung)
  if (step == 13) drawPoint(S,color1);                     // Schwerpunkt (ohne Beschriftung)
  if (step == 11) drawPoint(H,color1,orthocenter);         // Höhenschnittpunkt (mit Beschriftung)
  if (step == 13) drawPoint(H,color1);                     // Höhenschnittpunkt (ohne Beschriftung)
  if (step == 12) drawPoint(Sp,color1,spiekerpoint);       // Spieker-Punkt (mit Beschriftung)
  if (step == 13) drawPoint(Sp,color1);                    // Spieker-Punkt (ohne Beschriftung)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

