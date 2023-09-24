// Dreiecks-Labor: Lamoen-Kreis
// Java-Applet (28.10.2004) umgewandelt
// 04.02.2017 - 28.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel tl_lamoencircle_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe für bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe für Hilfslinien
var color2 = "#ff00ff";                                    // Farbe für Ergebnis (Hervorhebung)
var color3 = "#40ff40";                                    // Farbe für Teildreiecke

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
var step;                                                  // Einzelschritt (0 bis 7)
var S;                                                     // Schwerpunkt
var D, E, F;                                               // Mittelpunkte der Seiten a, b und c
var cc1, cc2, cc3, cc4, cc5, cc6;                          // Umkreise der Teildreiecke
var cL;                                                    // Lamoen-Kreis

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
  begin(50,300,350,300,90,80);                             // Anfangszustand
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
// Seiteneffekt a, b, c, alpha, beta, gamma, S, D, E, F, cc1, cc2, cc3, cc4, cc5, cc6, cL
  
function update () {
  a = distancePP(B,C);                                     // Seitenlänge a (Pixel)
  b = distancePP(C,A);                                     // Seitenlänge b (Pixel)
  c = distancePP(A,B);                                     // Seitenlänge c (Pixel)
  var a2 = a*a, b2 = b*b, c2 = c*c;                        // Quadrate der Seitenlängen
  alpha = Math.acos((b2+c2-a2)/(2*b*c));                   // Winkelgröße alpha (Bogenmaß)
  beta = Math.acos((c2+a2-b2)/(2*c*a));                    // Winkelgröße beta (Bogenmaß)
  gamma = Math.acos((a2+b2-c2)/(2*a*b));                   // Winkelgröße gamma (Bogenmaß)
  S = pointBarycentric(1,1,1);                             // Schwerpunkt
  D = pointBarycentric(0,1,1);                             // Mittelpunkt der Seite [BC]
  E = pointBarycentric(1,0,1);                             // Mittelpunkt der Seite [CA]
  F = pointBarycentric(1,1,0);                             // Mittelpunkt der Seite [AB]
  cc1 = circumcircle(A,F,S);                               // Umkreis 1. Teildreieck
  cc2 = circumcircle(F,B,S);                               // Umkreis 2. Teildreieck
  cc3 = circumcircle(B,D,S);                               // Umkreis 3. Teildreieck
  cc4 = circumcircle(D,C,S);                               // Umkreis 4. Teildreieck
  cc5 = circumcircle(C,E,S);                               // Umkreis 5. Teildreieck
  cc6 = circumcircle(E,A,S);                               // Umkreis 6. Teildreieck  
  var a4 = a2*a2, b4 = b2*b2, c4 = c2*c2;                  // Vierte Potenzen der Seitenlängen
  var u = 10*a4+4*(b4+c4)-10*b2*c2-13*a2*(b2+c2);          // 1. baryzentrische Koordinate
  var v = 10*b4+4*(c4+a4)-10*c2*a2-13*b2*(c2+a2);          // 2. baryzentrische Koordinate
  var w = 10*c4+4*(a4+b4)-10*a2*b2-13*c2*(a2+b2);          // 3. baryzentrische Koordinate
  cL = pointBarycentric(u,v,w);                            // Lamoen-Kreis, Mittelpunkt
  cL.r = distancePP(cL,cc1);                               // Radius Lamoen-Kreis ergänzen
  }
  
// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, nr, a, b, c, alpha, beta, gamma, S, D, E, F, cc1, cc2, cc3, cc4, cc5, cc6, cL

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
  if (step >= 7) bu2.disabled = true;                      // Falls nötig, Schaltknopf "Nächster Schritt" deaktivieren
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
  var px = (u*A.x+v*B.x+w*C.x)/(u+v+w);
  var py = (u*A.y+v*B.y+w*C.y)/(u+v+w);
  return {x: px, y: py};
  }
  
// Umkreis eines Dreiecks:
// p1, p2, p3 ... Ecken des Dreiecks

function circumcircle (p1, p2, p3) {
  var s1 = distancePP(p2,p3);                              // 1. Seitenlänge
  var s2 = distancePP(p3,p1);                              // 2. Seitenlänge
  var s3 = distancePP(p1,p2);                              // 3. Seitenlänge
  var u = s1*s1*(s2*s2+s3*s3-s1*s1);                       // 1. baryzentrische Koordinate
  var v = s2*s2*(s3*s3+s1*s1-s2*s2);                       // 2. baryzentrische Koordinate
  var w = s3*s3*(s1*s1+s2*s2-s3*s3);                       // 3. baryzentrische Koordinate
  var mx = (u*p1.x+v*p2.x+w*p3.x)/(u+v+w);                 // x-Koordinate Mittelpunkt
  var my = (u*p1.y+v*p2.y+w*p3.y)/(u+v+w);                 // y-Koordinate Mittelpunkt
  var dx = mx-p3.x, dy = my-p3.y;                          // Koordinatendifferenzen
  var kr = Math.sqrt(dx*dx+dy*dy);                         // Radius
  return {x: mx, y: my, r: kr};                            // Rückgabewert
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
  
// Verbindungsstrecke zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawSegmentPP (p1, p2, c) {
  newPath(c?c:"#000000");                                  // Neuer Grafikpfad
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt
  ctx.lineTo(p2.x,p2.y);                                   // Weiter zum Endpunkt
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
  if (step == 1) triangle(A,F,S,color3);                   // 1. Teildreieck
  if (step == 2) triangle(F,B,S,color3);                   // 2. Teildreieck
  if (step == 3) triangle(B,D,S,color3);                   // 3. Teildreieck
  if (step == 4) triangle(D,C,S,color3);                   // 4. Teildreieck
  if (step == 5) triangle(C,E,S,color3);                   // 5. Teildreieck
  if (step == 6) triangle(E,A,S,color3);                   // 6. Teildreieck
  drawSegmentPP(B,C);                                      // Seite a 
  drawSegmentPP(C,A);                                      // Seite b
  drawSegmentPP(A,B);                                      // Seite c
  drawSegmentPP(A,D,color1);                               // Seitenhalbierende s_a
  drawSegmentPP(B,E,color1);                               // Seitenhalbierende s_b
  drawSegmentPP(C,F,color1);                               // Seitenhalbierende s_c
  if (step == 1 || step == 7) drawCircle(cc1,color1);      // Umkreis 1. Teildreieck
  if (step == 2 || step == 7) drawCircle(cc2,color1);      // Umkreis 2. Teildreieck
  if (step == 3 || step == 7) drawCircle(cc3,color1);      // Umkreis 3. Teildreieck
  if (step == 4 || step == 7) drawCircle(cc4,color1);      // Umkreis 4. Teildreieck
  if (step == 5 || step == 7) drawCircle(cc5,color1);      // Umkreis 5. Teildreieck
  if (step == 6 || step == 7) drawCircle(cc6,color1);      // Umkreis 6. Teildreieck
  if (step == 7) drawCircle(cL,color2);                    // Lamoen-Kreis
  drawVertex(A,vertex1);                                   // Ecke A 
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  if (step == 1 || step == 7) drawPoint(cc1,color1);       // Umkreismittelpunkt 1. Teildreieck
  if (step == 2 || step == 7) drawPoint(cc2,color1);       // Umkreismittelpunkt 2. Teildreieck
  if (step == 3 || step == 7) drawPoint(cc3,color1);       // Umkreismittelpunkt 3. Teildreieck
  if (step == 4 || step == 7) drawPoint(cc4,color1);       // Umkreismittelpunkt 4. Teildreieck
  if (step == 5 || step == 7) drawPoint(cc5,color1);       // Umkreismittelpunkt 5. Teildreieck
  if (step == 6 || step == 7) drawPoint(cc6,color1);       // Umkreismittelpunkt 6. Teildreieck
  if (step == 7) drawPoint(cL,color2);                     // Mittelpunkt Lamoen-Kreis
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

