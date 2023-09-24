// Umkreis eines Dreiecks
// Java-Applet (25.11.1997) umgewandelt
// 23.03.2020 - 26.03.2020

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel circumcircle_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#ff0000";                                    // Farbe f�r bewegliche Punkte (Ziehen mit der Maus)
var color1 = "#0000ff";                                    // Farbe f�r Hilfslinien
var color2 = "#ff0000";                                    // Farbe f�r Ergebnis (Hervorhebung)

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var D = 10;                                                // Randbreite (Pixel) f�r Clipping

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Neustart, N�chster Schritt)
var ta, ctxTA;                                             // Textbereich (Canvas-Element)
var widthTA, heightTA;

var A, B, C;                                               // Ecken
var nr;                                                    // Nummer der ausgew�hlten Ecke (1, 2, 3 oder 0)
var U;                                                     // Umkreismittelpunkt
var step;                                                  // Einzelschritt (0 oder 1)
var on;                                                    // Flag f�r Animation
var timer;                                                 // Timer
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)

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
  widthTA = ta.width; heightTA = ta.height;                // Abmessungen Textbereich
  ctxTA = ta.getContext("2d");                             // Grafikkontext Textbereich
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  step = 0;                                                // Schritt
  t = 0;                                                   // Zeitvariable (s)
  U = {x: 0, y: 0};                                        // Dummy-Wert f�r Umkreismittelpunkt
  begin(100,300,300,300,180,100);                          // Anfangszustand
  stopAnimation();                                         // Eventuell fr�here Animation stoppen
  paint();                                                 // Zeichenbereich
  paintTA();                                               // Textbereich
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionNext;                              // Reaktion auf Schaltknopf (N�chster Schritt)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start 

// Anfangszustand:
// (ax,ay) ... Koordinaten der Ecke A
// (bx,by) ... Koordinaten der Ecke B
// (cx,cy) ... Koordinaten der Ecke C
// Seiteneffekt step, A, B, C, nr

function begin (ax, ay, bx, by, cx, cy) {
  step = 0;                                                // Einzelschritt
  A = {x: ax, y: ay};                                      // Ecke A
  B = {x: bx, y: by};                                      // Ecke B
  C = {x: cx, y: cy};                                      // Ecke C
  calcCircumcenter();                                      // Umkreismittelpunkt U
  nr = 0;                                                  // Zun�chst keine Ecke ausgew�hlt
  } 
  
// Reaktion auf Schaltknopf (Neustart):
// Seiteneffekt step, t, on, timer, t0 

function reactionReset () {
  step = 0;                                                // Einzelschritt
  bu2.disabled = false;                                    // Schaltknopf "N�chster Schritt" aktivieren
  t = 0;                                                   // Zeitvariable zur�cksetzen
  stopAnimation();                                         // Eventuell fr�here Animation stoppen
  paint();                                                 // Zeichenbereich
  paintTA();                                               // Textbereich
  }
  
// Reaktion auf Schaltknopf (N�chster Schritt):
// Seiteneffekt step, t, on, timer, t0 ... paintTA

function reactionNext () {
  step++;                                                  // N�chster Einzelschritt
  if (step > text03.length-2) bu2.disabled = true;         // Falls n�tig, Schaltknopf "N�chster Schritt" deaktivieren
  t = 0;                                                   // Zeitvariable zur�cksetzen
  if (step >= 1) startAnimation();                         // Falls Schritt 1, Animation starten
  paintTA();                                               // Textbereich
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
  calcCircumcenter();                                      // Umkreismittelpunkt neu berechnen
  if (!on) paint();                                        // Falls Animation gestoppt, neu zeichnen
  }
  
// Animation starten:
// Seiteneffekt on, timer, t0

function startAnimation () {
  if (timer) clearInterval(timer);                         // Falls n�tig, fr�here Animation stoppen
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Bezugszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer, t0
  
function stopAnimation () {
  on = false;
  if (timer) clearInterval(timer);
  t0 = new Date();
  }
  
//-------------------------------------------------------------------------------------------------

// Abstand zweier Punkte:
// p1, p2 ... Gegebene Punkte (mit Attributen x und y)

function distancePP (p1, p2) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
// Berechnung des Umkreismittelpunkts (Schnittpunkt der Mittelsenkrechten m_a und m_b):
// Seiteneffekt U
  
function calcCircumcenter () {
  var D = midpoint(B,C);                                   // Mittelpunkt von BC
  var E = midpoint(C,A);                                   // Mittelpunkt von CA
  var F = midpoint(A,B);                                   // Mittelpunkt von AB
  var vx = C.y-B.y, vy = B.x-C.x;                          // Koeffizienten f�r lineares Gleichungssystem
  var wx = A.y-C.y, wy = C.x-A.x;                          // Koeffizienten f�r lineares Gleichungssystem
  var det = vx*wy-vy*wx;                                   // Determinante f�r Nenner 
  if (det==0) return;                                      // Falls Determinante 0, abbrechen
  var lambda = ((E.x-D.x)*wy-(E.y-D.y)*wx)/det;            // Parameterwert Umkreismittelpunkt
  U.x = D.x+lambda*vx; U.y = D.y+lambda*vy;                // Koordinaten Umkreismittelpunkt
  }
  
// Mittelpunkt zweier Punkte:
// p1, p2 ... Gegebene Punkte
  
function midpoint (p1, p2) {
  return {x: (p1.x+p2.x)/2, y: (p1.y+p2.y)/2};             // R�ckgabewert
  }
  
// Punkt auf Gerade:
// p1 .... 1. Bestimmungspunkt
// p2 .... 2. Bestimmungspunkt
// par ... Parameterwert
  
function pointLine (p1, p2, par) {
  var ux = p2.x-p1.x, uy = p2.y-p1.y;                      // Richtungsvektor
  return {x: p1.x+par*ux, y: p1.y+par*uy};                 // R�ckgabewert
  }
  
// Hilfsroutine f�r Methode maxParameter:
// max ... Bisheriger Wert von max (siehe Methode maxParameter)
// par ... Neuer Parameterwert
  
function newMax (max, par) {
  if (par > 0) {                                           // Falls Parameterwert positiv ...
    if (max == undefined) return par;                      // R�ckgabewert, falls max bisher undefiniert
    else return Math.min(max,par);                         // R�ckgabewert, falls max schon definiert
    }
  return max;                                              // R�ckgabewert, falls Parameterwert nicht positiv
  }
  
// Gro�er Parameterwert f�r Punkt am Bildschirmrand:
// (x0,y0) ... 1. Bestimmungspunkt
// (x1,y1) ... 2. Bestimmungspunkt

function maxParameter (x0, y0, x1, y1) {
  var dx = x1-x0, dy = y1-y0;                              // Richtungsvektor
  var max = undefined;                                     // Startwert f�r Maximum
  if (dx != 0) {                                           // Falls Gerade nicht senkrecht ...
    var lambda = (D-x0)/dx;                                // Parameterwert f�r linken Bildrand 
    max = newMax(max,lambda);                              // Maximum aktualisieren                          
    lambda = (width-D-x0)/dx;                              // Parameterwert f�r rechten Bildrand
    max = newMax(max,lambda);                              // Maximum aktualisieren
    }
  if (dy != 0) {                                           // Falls Gerade nicht waagrecht ...
    lambda = (D-y0)/dy;                                    // Parameterwert f�r oberen Bildrand
    max = newMax(max,lambda);                              // Maximum aktualisieren
    lambda = (height-D-y0)/dy;                             // Parameterwert f�r unteren Bildrand
    max = newMax(max,lambda);                              // Maximum aktualisieren
    }
  return max;                                              // R�ckgabewert
  }
  
// Hilfsroutine f�r Methode minParameter:
// min ... Bisheriger Wert von min (siehe Methode minParameter)
// par ... Neuer Parameterwert
  
function newMin (min, par) {
  if (par < 0) {                                           // Falls Parameterwert negativ ...
    if (min == undefined) return par;                      // R�ckgabewert, falls min bisher undefiniert
    else return Math.max(min,par);                         // R�ckgabewert, falls min schon definiert
    }
  return min;                                              // R�ckgabewert, falls Parameterwert nicht negativ
  }
  
// Kleiner Parameterwert f�r Punkt am Bildschirmrand:
// (x0,y0) ... 1. Bestimmungspunkt
// (x1,y1) ... 2. Bestimmungspunkt

function minParameter (x0, y0, x1, y1) {
  var dx = x1-x0, dy = y1-y0;                              // Richtungsvektor
  var min = undefined;                                     // Startwert f�r Minimum
  if (dx != 0) {                                           // Falls Gerade nicht senkrecht ...
    var lambda = (D-x0)/dx;                                // Parameterwert f�r linken Bildrand 
    min = newMin(min,lambda);                              // Minimum aktualisieren
    lambda = (width-D-x0)/dx;                              // Parameterwert f�r rechten Bildrand
    min = newMin(min,lambda);                              // Minimum aktualisieren
    }
  if (dy != 0) {                                           // Falls Gerade nicht waagrecht ...
    lambda = (D-y0)/dy;                                    // Parameterwert f�r oberen Bildrand
    min = newMin(min,lambda);                              // Minimum aktualisieren
    lambda = (height-D-y0)/dy;                             // Parameterwert f�r unteren Bildrand
    min = newMin(min,lambda);                              // Minimum aktualisieren
    }
  return min;                                              // R�ckgabewert
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Clipping-Bereich:
  
function clipping () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.moveTo(D,D);                                         // Anfangspunkt (links oben)
  ctx.lineTo(D,height-D);                                  // Linie nach unten
  ctx.lineTo(width-D,height-D);                            // Linie nach rechts
  ctx.lineTo(width-D,D);                                   // Linie nach oben
  ctx.lineTo(D,D);                                         // Linie zum Anfangspunkt
  ctx.clip();                                              // Clipping aktivieren
  }

// Beschriftung einer Ecke des Dreiecks ABC (auf der verl�ngerten Seitenhalbierenden):
// p ... Gegebene Ecke (mit Attributen x und y)
// n ... Name (optional)
  
function labelVertex (p, n) {
  if (!n) return;                                          // Falls Name undefiniert, abbrechen
  var sx = (A.x+B.x+C.x)/3, sy = (A.y+B.y+C.y)/3;          // Schwerpunkt des Dreiecks ABC
  var vx = sx-p.x, vy = sy-p.y;                            // Verbindungsvektor
  var v = Math.sqrt(vx*vx+vy*vy);                          // Betrag Verbindungsvektor
  var f = 10/v;                                            // Faktor
  var nx = p.x-f*vx, ny = p.y-f*vy+4;                      // Position Beschriftung
  ctx.fillText(n,nx,ny);                                   // Beschriftung ausgeben
  }
  
// Punkt zeichnen (mit Beschriftung):
// p ... Gegebener Punkt (mit Attributen x und y)
// c ... Farbe
// n ... Name (optional)
// e ... Flag f�r Ecke (optional, Defaultwert false)

function drawPoint (p, c, n, e) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2.5,0,2*Math.PI,true);                   // Kreis vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill();                                              // Kreis ausf�llen
  ctx.stroke();                                            // Kreisrand zeichnen
  if (!n) return;                                          // Falls Name undefiniert, abbrechen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (e) labelVertex(p,n);                                 // Beschriftung einer Ecke 
  else ctx.fillText(n,p.x+10,p.y+4);                       // Beschriftung eines anderen Punkts
  }  
  
// Ecke des gegebenen Dreiecks:
// p ... Gegebener Punkt (mit Attributen x und y)
// n ... Name

function drawVertex (p, n) {
  drawPoint(p,color0,n,true);                              // Punkt zeichnen (ausgef�llter Kreis)
  }
  
// Verbindungsgerade zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte (mit Attributen x und y)
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawLinePP (p1, p2, c) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Koordinatendifferenzen
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand der gegebenen Punkte
  if (d == 0) return;                                      // Abbrechen, falls Gerade nicht definiert
  dx *= 1000/d; dy *= 1000/d;                              // Verbindungsvektor ausreichender L�nge 
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Verbindungsstrecke zweier Punkte zeichnen:
// p1, p2 ... Gegebene Punkte (mit Attributen x und y)
// c ........ Farbe (optional, Defaultwert schwarz)
  
function drawSegmentPP (p1, p2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(p1.x,p1.y);                                   // Anfangspunkt
  ctx.lineTo(p2.x,p2.y);                                   // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Ausgef�lltes Dreieck:
// p1, p2, p3 ... Ecken (mit Attributen x und y)
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
    
// Mittelsenkrechten:

function perpendicularBisectors () {
  if (step >= 2 && step <= 4) {                            // Falls Schritt 2, 3 oder 4 ... 
    var M = midpoint(B,C);                                 // Mittelpunkt von B und C
    drawLinePP(M,U,color2);                                // Mittelsenkrechte m_a zeichnen
    }
  if (step == 1 || step == 3 || step == 4) {               // Falls Schritt 1, 3 oder 4 ...  
    M = midpoint(A,B);                                     // Mittelpunkt von A und B
    drawLinePP(M,U,color2);                                // Mittelsenkrechte m_c zeichnen
    }
  if (step == 4) {                                         // Falls Schritt 4 ...
    M = midpoint(C,A);                                     // Mittelpunkt von C und A
    var lMin = minParameter(M.x,M.y,U.x,U.y);              // Kleiner Parameterwert (Rand)
    var lMax = maxParameter(M.x,M.y,U.x,U.y);              // Gro�er Parameterwert (Rand)
    var P = pointLine(M,U,lMin);                           // Anfangspunkt f�r Aufbau der Linie
    var lambda = lMin+t/5*(lMax-lMin);                     // Parameterwert
    var Q = pointLine(M,U,lambda);                         // Aktueller Endpunkt f�r Aufbau der Linie
    if (t < 5) drawSegmentPP(P,Q,color2);                  // Mittelsenkrechte m_b entweder teilweise ...
    else drawLinePP(M,U,color2);                           // ... oder komplett zeichnen
    }
  }

// Sichtbarkeit eines blinkenden Objekts:
  
function blink () {return (t-Math.floor(t) < 0.8);}
  
// Sichtbarkeit des Umkreises:

function visibleCircumcircle () {
  if (step <= 4) return false;                             // Bis Schritt 4 unsichtbar
  if (step == 5)                                           // Falls Schritt 5 ... 
    return (t > 5 && blink() || t > 10);                   // R�ckgabewert
  if (step == 6)                                           // Falls Schritt 6 ... 
    return (blink() || t > 5);                             // R�ckgabewert
  }
  
// Umkreis und Umkreismittelpunkt:
  
function circumcircle () {
  if (step >= 3) drawPoint(U,color2,circumcenter);         // Ab Schritt 3 Umkreismittelpunkt zeichnen
  if (visibleCircumcircle()) {                             // Falls Schritt 5 oder 6 ...
    newPath(color2);                                       // Neuer Grafikpfad
    ctx.arc(U.x,U.y,distancePP(U,A),0,2*Math.PI,false);    // Kreis vorbereiten
    ctx.stroke();                                          // Kreis zeichnen
    }
  }

// Hilfsroutine f�r Markierung gleicher Entfernungen: 
// p1, p2 ... Gegebene Punkte (mit Attributen x und y)
// In Abh�ngigkeit von der Zeitvariablen t wird ein Punkt P auf der Mittelsenkrechten zu p1 und p2 festgelegt;
// dieser Punkt und die gleichen Entfernungen dieses Punkts von den gegebenen Punkten werden gezeichnet.

function distancesPP (p1, p2) {
  var M = midpoint(p1,p2);                                 // Mittelpunkt von p1 und p2
  var lMin = minParameter(M.x,M.y,U.x,U.y);                // Kleiner Parameterwert f�r Punkt am Bildrand
  var lMax = maxParameter(M.x,M.y,U.x,U.y);                // Gro�er Parameterwert f�r Punkt am Bildrand
  var tt = t-10*Math.floor(t/10);                          // Zeit seit vollen 10 Sekunden                   
  var h = 1-0.2*Math.abs(tt-5);                            // Hilfsgr��e (0 bis 1)
  var lambda = lMin+(lMax-lMin)*h;                         // Parameterwert
  var P = pointLine(M,U,lambda);                           // Punkt P auf der Mittelsenkrechten
  drawSegmentPP(P,p1,color1);                              // Entfernung zwischen P und p1
  drawSegmentPP(P,p2,color1);                              // Entfernung zwischen P und p2
  drawPoint(P,color1);                                     // Punkt P
  }
  
// Gleiche Entfernungen von einer Mittelsenkrechten:

function distances () {
  var vis = (blink() || t > 10);                           // Sichtbarkeit blinkender Linien
  switch (step) {
    case 1: distancesPP(A,B); break;                       // Schritt 1: Hin- und Herbewegung auf m_c
    case 2: distancesPP(B,C); break;                       // Schritt 2: Hin- und Herbewegung auf m_a
    case 5:                                                // Schritt 5
      if (vis) drawSegmentPP(U,B,color1);                  // Strecke UB (blinkend)
    case 3: case 4:                                        // Schritt 3 bis 5
      if (vis) {                                           // Falls Linien sichtbar sein sollen ...
        drawSegmentPP(U,A,color1);                         // Strecke UA (blinkend)          
        drawSegmentPP(U,C,color1);                         // Strecke UC (blinkend)  
        }
      break;
      } // Ende switch
    }
  
// Grafikausgabe Zeichenbereich:
// Seiteneffekt on, timer, t0, t
  
function paint () {
  if (t > 15) stopAnimation();                             // Zu lange laufende Animation stoppen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // ... Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // ... L�nge des Zeitintervalls (s)
    t += dt;                                               // ... Zeitvariable aktualisieren
    t0 = t1;                                               // ... Neuer Anfangszeitpunkt
    }
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  clipping();                                              // Clipping-Bereich
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  triangle(A,B,C,"#ffffff");                               // Ausgef�lltes Dreieck
  drawSegmentPP(B,C);                                      // Seite a 
  drawSegmentPP(C,A);                                      // Seite b
  drawSegmentPP(A,B);                                      // Seite c
  perpendicularBisectors();                                // Mittelsenkrechten
  circumcircle();                                          // Umkreis
  distances();                                             // Gleiche Entfernungen
  drawVertex(A,vertex1);                                   // Ecke A 
  drawVertex(B,vertex2);                                   // Ecke B
  drawVertex(C,vertex3);                                   // Ecke C
  }

// Hilfsroutine f�r Methode writeLine: Inhalt einer Klammer nach einem Sonderzeichen wie '_'
// s ... Gegebene Zeichenkette (entsprechend einer Zeile)
// i ... Position des Sonderzeichens
// Wichtig: Die Klammer nach dem Sonderzeichen darf keine weitere Klammer enthalten.
  
function content (s, i) {
  if (s.charAt(i+1) != "(") return "";                     // R�ckgabewert, falls keine �ffnende Klammer
  var j = s.indexOf(")",i+1);                              // Position der schlie�enden Klammer
  if (j < 0) return "";                                    // R�ckgabewert, falls keine schlie�ende Klammer
  return s.substring(i+2,j);                               // R�ckgabewert (Normalfall)
  }
  
// Ausgabe einer Zeile (rekursive Methode):
// s ... Gegebene Zeichenkette, eventuell mit Sonderzeichen '_' und darauf folgenden Klammern
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
  
function writeLine (s, x, y) {
  var end = s;                                             // Variable f�r Rest der Zeile
  var iT = s.indexOf("_");                                 // Position des ersten '_' oder -1
  if (iT >= 0) {                                           // Falls '_' vorkommt ...
    var beg = s.substring(0,iT);                           // Teilzeichenkette vor dem '_'
    var w1 = ctxTA.measureText(beg).width;                 // Breite dieser Teilzeichenkette (Pixel)
    ctxTA.fillText(beg,x,y);                               // Teilzeichenkette ausgeben
    var c = content(s,iT);                                 // Inhalt der auf '_' folgenden Klammer oder leere Zeichenkette
    var w2 = ctxTA.measureText(c).width;                   // Breite des Klammerinhalts (Pixel)
    x += w1;                                               // x-Koordinate f�r tiefgestellten Text (Pixel)
  	ctxTA.fillText(c,x,y+4);                               // Tiefgestellten Text ausgeben
  	end = s.substring(iT+c.length+3);                      // Rest der Zeile (nach dem tiefgestellten Text)
  	x += w2;                                               // x-Koordinate f�r Ende der Zeile (Pixel)  
  	writeLine(end,x,y);                                    // Methode f�r Rest der Zeile aufrufen (Rekursion!) 
  	return;                                                // Abbrechen                                
    }
  ctxTA.fillText(end,x,y);                                 // Rest der Zeile ausgeben   
  }
  
// Grafikausgabe Textbereich:
  
function paintTA () {
  ctxTA.font = FONT;                                       // Zeichensatz
  ctxTA.textAlign = "left";                                // Textausrichtung
  ctxTA.fillStyle = "#ffffff";                             // Hintergrundfarbe
  ctxTA.fillRect(0,0,widthTA,heightTA);                    // Hintergrund ausf�llen
  ctxTA.fillStyle = "#000000";                             // Schriftfarbe
  var t = text03[step];                                    // Aktueller Text (Array von Zeichenketten)
  for (var i=0; i<t.length; i++)                           // F�r alle Zeilen-Indizes ... 
    writeLine(t[i],10,20+i*20);                            // Zeile ausgeben
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



