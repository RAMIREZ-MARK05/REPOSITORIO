// Dynamische Zeichnung: Besondere Linien und Kreise im Dreieck
// Java-Applet (25.10.1998), umgewandelt in HTML5/Javascript
// 25.03.2014 - 18.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

var colorEmphasize = "#ff00ff";                  // Farbe f�r verschiebbare Punkte
var color1 = "#0000ff";                          // Farbe f�r Mittelsenkrechte und Umkreis
var color2 = "#ff0000";                          // Farbe f�r Winkelhalbierende, Inkreis und Ankreise                
var color3 = "#ff00ff";                          // Farbe f�r Mittelparallelen und Seitenhalbierende
var color4 = "#008000";                          // Farbe f�r H�hen

var canvas, ctx;                                 // Zeichenfl�che, Grafikkontext
var cb1, cb2, cb3, cb4, cb5, cb6, cb7, cb8, cb9, cb10;     // Optionsfelder
var pointA, pointB, pointC;                      // Ecken
var indexPoint;                                  // Index der gew�hlten Ecke (0 bis 3)
var sideA, sideB, sideC;                         // Seitenl�ngen
var angleA, angleB, angleC;                      // Winkelgr��en (Bogenma�)
var area;                                        // Fl�cheninhalt
var cc = {x: 0, y: 0};                           // Umkreismittelpunkt
var ic = {x: 0, y: 0};                           // Inkreismittelpunkt
var cm = {x: 0, y: 0};                           // Schwerpunkt
var oc = {x: 0, y: 0};                           // H�henschnittpunkt
var mpA = {x: 0, y: 0};                          // Mittelpunkt der Seite [BC]
var mpB = {x: 0, y: 0};                          // Mittelpunkt der Seite [CA]
var mpC = {x: 0, y: 0};                          // Mittelpunkt der Seite [AB]

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
  cb1 = newCheckbox("cb1","lb1",text01);                   // Optionsfeld (Mittelsenkrechte)
  cb2 = newCheckbox("cb2","lb2",text02);                   // Optionsfeld (Umkreis)
  cb3 = newCheckbox("cb3","lb3",text03);                   // Optionsfeld (Winkelhalbierende)
  cb4 = newCheckbox("cb4","lb4",text04);                   // Optionsfeld (Inkreis)
  cb5 = newCheckbox("cb5","lb5",text05);                   // Optionsfeld (Ankreise)
  cb6 = newCheckbox("cb6","lb6",text06);                   // Optionsfeld (Mittelparallelen)
  cb7 = newCheckbox("cb7","lb7",text07);                   // Optionsfeld (Seitenhalbierende)
  cb8 = newCheckbox("cb8","lb8",text08);                   // Optionsfeld (H�hen)
  cb9 = newCheckbox("cb9","lb9",text09);                   // Optionsfeld (Euler-Gerade)
  cb10 = newCheckbox("cb10","lb10",text10);                // Optionsfeld (Feuerbach-Kreis)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  pointA = {x: 50, y: 300};                                // Ecke A
  pointB = {x: 450, y: 300};                               // Ecke B
  pointC = {x: 100, y: 60};                                // Ecke C
  indexPoint = 0;                                          // Kein Punkt ausgew�hlt
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = function (e) {            // Reaktion auf Dr�cken der Maustaste
    reactionDown(e.clientX,e.clientY);           // Auswahl einer Ecke (indexPoint)
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Ber�hrung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       // Auswahl einer Ecke (indexPoint)
    if (indexPoint != 0) e.preventDefault();     // Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    indexPoint = 0;                              // Kein Punkt ausgew�hlt
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Ber�hrung
    indexPoint = 0;                              // Kein Punkt ausgew�hlt
    //e.preventDefault();                          // Standardverhalten verhindern (?) 
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Bewegen der Maus
    if (indexPoint == 0) return;                 // Keine Reaktion, wenn keine Ecke ausgew�hlt
    reactionMove(e.clientX,e.clientY);           // Position ermitteln und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (indexPoint == 0) return;                 // Keine Reaktion, wenn keine Ecke ausgew�hlt
    var obj = e.changedTouches[0];
    reactionMove(obj.clientX,obj.clientY);       // Position ermitteln und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }
    
  } // Ende der Methode start
  
// Neues Optionsfeld mit Text:
// id1 .... Attribut "id" im input-Tag
// id2 .... Attribut "id" im label-Tag
// text ... Zugeh�riger Text
  
function newCheckbox (id1, id2, text) {
  var cb = getElement(id1);                                // Optionsfeld
  cb.checked = false;                                      // Zun�chst nicht ausgew�hlt
  cb.addEventListener("click",paint,false);                // Reaktion auf Anklicken (neu zeichnen)
  getElement(id2,text);                                    // Zugeh�riger Text
  return cb;                                               // R�ckgabewert
  }
  
// Reaktion auf Mausklick oder Ber�hrung:
// x, y ... Position bez�glich Viewport
// Seiteneffekt indexPoint

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();        // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                       // Koordinaten bez�glich Zeichenfl�che
  var min = 10000;                               // Minimaler Abstand (gro�e Zahl)
  var dist = distance(x,y,pointA);               // Abstand zur Ecke A
  if (dist < min) {indexPoint = 1; min = dist;}  // min und indexPoint aktualisieren
  dist = distance(x,y,pointB);                   // Abstand zur Ecke B
  if (dist < min) {indexPoint = 2; min = dist;}  // min und indexPoint aktualisieren
  dist = distance(x,y,pointC);                   // Abstand zur Ecke C
  if (dist < min) {indexPoint = 3; min = dist;}  // min und indexPoint aktualisieren
  if (min > 20) indexPoint = 0;                  // Falls gro�er Abstand, kein Punkt ausgew�hlt
  }
  
// Reaktion auf Bewegung von Maus oder Finger:
// x, y ... Position bez�glich Viewport
// Seiteneffekt pointA, pointB, pointC

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();        // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                       // Koordinaten bez�glich Zeichenfl�che
  switch (indexPoint) {                          // Je nach gew�hlter Ecke ...
    case 1: pointA.x = x; pointA.y = y; break;   // Ecke A verschieben
    case 2: pointB.x = x; pointB.y = y; break;   // Ecke B verschieben
    case 3: pointC.x = x; pointC.y = y; break;   // Ecke C verschieben
    }
  paint();                                       // Neu zeichnen
  }
  
// Abstand von einem Punkt:
// x, y ... Position bez�glich Zeichenfl�che
// p ...... Gegebener Punkt

function distance (x,y,p) {      
  var dx = x-p.x, dy = y-p.y;	
  return Math.sqrt(dx*dx+dy*dy);
  }
  
//-----------------------------------------------------------------------------

// Abstand zweier Punkte (Berechnung mit Satz des Pythagoras):
// p1, p2 ... Gegebene Punkte

function distancePP (p1, p2) {
  var dx = p2.x-p1.x, dy = p2.y-p1.y;
  return Math.sqrt(dx*dx+dy*dy);
  }

// Berechnung von Seitenl�ngen, Winkelgr��en und Fl�cheninhalt:

function calcSidesAngles () {
  // Berechnung der Seitenl�ngen mit Satz des Pythagoras:
  sideA = distancePP(pointB,pointC);             // Seitenl�nge a
  sideB = distancePP(pointC,pointA);             // Seitenl�nge b
  sideC = distancePP(pointA,pointB);             // Seitenl�nge c
  // Berechnung der Winkelgr��en (Bogenma�) mit Kosinussatz:
  angleA = Math.acos((sideB*sideB+sideC*sideC-sideA*sideA)/(2*sideB*sideC));   // Winkel alpha
  angleB = Math.acos((sideC*sideC+sideA*sideA-sideB*sideB)/(2*sideC*sideA));   // Winkel beta
  angleC = Math.acos((sideA*sideA+sideB*sideB-sideC*sideC)/(2*sideA*sideB));   // Winkel gamma
  // Berechnung des Fl�cheninhalts mit Heron-Formel:
  var s = (sideA+sideB+sideC)/2;                      // Halber Umfang
  area = Math.sqrt(s*(s-sideA)*(s-sideB)*(s-sideC));  // Fl�cheninhalt
  }
  
// Setzen eines Punktes mit baryzentrischen Koordinaten:
// p ......... Punkt
// a, b, c ... baryzentrische Koordinaten

function setPointBarycentric (p, a, b, c) {
  p.x = (a*pointA.x+b*pointB.x+c*pointC.x)/(a+b+c);
  p.y = (a*pointA.y+b*pointB.y+c*pointC.y)/(a+b+c);
  }
  
// Umkreismittelpunkt berechnen:

function calcCircumcenter () {
  setPointBarycentric(cc,Math.sin(2*angleA),Math.sin(2*angleB),Math.sin(2*angleC));
  }
  
// Inkreismittelpunkt berechnen:

function calcIncenter () {
  setPointBarycentric(ic,sideA,sideB,sideC);
  }
  
// Seitenmittelpunkte berechnen:

function calcMidpoints () {
  setPointBarycentric(mpA,0,1,1);
  setPointBarycentric(mpB,1,0,1);
  setPointBarycentric(mpC,1,1,0);
  }
  
// Schwerpunkt berechnen:
  
function calcCentroid () {
  setPointBarycentric(cm,1,1,1);
  }
  
// H�henschnittpunkt berechnen:

function calcOrthocenter () {
  setPointBarycentric(oc,Math.tan(angleA),Math.tan(angleB),Math.tan(angleC));
  }
  
//-----------------------------------------------------------------------------
  
// Punkt zeichnen:
// p ... Gegebener Punkt
// c ... Farbe (optional)

function drawPoint (p, c) {
  if (c) ctx.fillStyle = c;                      // F�llfarbe, falls definiert
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(p.x,p.y,2.5,0,2*Math.PI,true);         // Kreis mit Radius 2
  ctx.fill();                                    // Kreis f�llen
  }
  
// Strecke zeichnen:
// p1, p2 ... Endpunkte
// c ........ Farbe (optional)

function drawSegment (p1, p2, c) {
  if (c) ctx.strokeStyle = c;                    // Zeichenfarbe, falls definiert
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(p1.x,p1.y);                         // Anfangspunkt
  ctx.lineTo(p2.x,p2.y);                         // Weiter zum Endpunkt
  ctx.stroke();                                  // Linie zeichnen
  }
  
// Halbgerade zeichnen:
// p1, p2 ... Endpunkte
// c ........ Farbe (optional)

function drawRay (p1, p2, c) {
  if (c) ctx.strokeStyle = c;                    // Zeichenfarbe, falls definiert
  var dx = p2.x-p1.x, dy = p2.y-p1.y;            // Koordinatendifferenzen
  var length = Math.sqrt(dx*dx+dy*dy);           // Abstand von p1 und p2
  if (length == 0) return;                       // Abbruch, falls Halbgerade nicht definiert 
  dx *= 1000/length; dy *= 1000/length;          // Neuer Abstand 1000
  var x2 = p2.x+dx, y2 = p2.y+dy;                // Endpunkt (au�erhalb der Zeichenfl�che)
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(p1.x,p1.y);                         // Anfangspunkt
  ctx.lineTo(x2,y2);                             // Weiter zum Endpunkt
  ctx.stroke();                                  // Linie zeichnen
  }
  
// Gerade zeichnen:
// p1, p2 ... Endpunkte
// c ........ Farbe (optional)

function drawLine (p1, p2, c) {
  if (c) ctx.strokeStyle = c;                    // Zeichenfarbe, falls definiert
  var dx = p2.x-p1.x, dy = p2.y-p1.y;            // Koordinatendifferenzen
  var length = Math.sqrt(dx*dx+dy*dy);           // Abstand von p1 und p2
  if (length == 0) return;                       // Abbruch, falls Gerade nicht definiert
  dx *= 1000/length; dy *= 1000/length;          // Neuer Abstand 1000
  var x1 = p1.x-dx, y1 = p1.y-dy;                // Anfangspunkt (au�erhalb der Zeichenfl�che)
  var x2 = p2.x+dx, y2 = p2.y+dy;                // Endpunkt (au�erhalb der Zeichenfl�che)
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(x1,y1);                             // Anfangspunkt
  ctx.lineTo(x2,y2);                             // Weiter zum Endpunkt
  ctx.stroke();                                  // Linie zeichnen
  } 
  
// Kreis zeichnen:
// mp ... Mittelpunkt
// r .... Radius
// c .... Farbe (optional)

function drawCircle (mp, r, c) {
  if (c) ctx.strokeStyle = c;                    // Zeichenfarbe, falls definiert
  ctx.beginPath();                               // neuer Pfad
  ctx.arc(mp.x,mp.y,r,0,2*Math.PI,true);         // Kreis
  ctx.stroke();                                  // Kreis zeichnen
  } 
  
// Dreieck zeichnen:

function drawTriangle () {
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(pointA.x,pointA.y);                 // Anfangspunkt A
  ctx.lineTo(pointB.x,pointB.y);                 // Weiter zum Punkt B
  ctx.lineTo(pointC.x,pointC.y);                 // Weiter zum Punkt C
  ctx.closePath();                               // Zur�ck zum Punkt A
  ctx.fillStyle = "#ffffff";                     // F�llfarbe wei�
  ctx.fill();                                    // Dreieck f�llen
  drawLine(pointB,pointC);                       // Gerade BC
  drawLine(pointC,pointA);                       // Gerade CA
  drawLine(pointA,pointB);                       // Gerade AB
  }
  
// Ecken des Dreiecks hervorheben:

function emphasizeVertices () {
  drawPoint(pointA,colorEmphasize);              // Ecke A hervorheben
  drawPoint(pointB,colorEmphasize);              // Ecke B hervorheben
  drawPoint(pointC,colorEmphasize);              // Ecke C hervorheben
  }
  
// Mittelsenkrechte zeichnen:

function drawPerpendicularBisectors () {
  ctx.strokeStyle = color1;                      // Zeichenfarbe
  calcMidpoints();                               // Seitenmittelpunkte berechnen
  calcCircumcenter();                            // Umkreismittelpunkt berechnen
  drawLine(mpA,cc);                              // Mittelsenkrechte m_a
  drawLine(mpB,cc);                              // Mittelsenkrechte m_b
  drawLine(mpC,cc);                              // Mittelsenkrechte m_c
  drawPoint(cc,color1);                          // Umkreismittelpunkt markieren
  }

// Umkreis zeichnen:

function drawCircumcircle () {
  calcCircumcenter();                            // Mittelpunkt berechnen
  drawPoint(cc,color1);                          // Mittelpunkt markieren
  var r = sideA*sideB*sideC/(4*area);            // Radius berechnen
  drawCircle(cc,r,color1);                       // Kreis zeichnen
  }
  
// Winkelhalbierende zeichnen:

function drawAngleBisectors () {
  var p = {x: 0, y: 0};                          // Variable f�r Mittelpunkt
  ctx.strokeStyle = color2;                      // Zeichenfarbe
  setPointBarycentric(p,0,sideB,sideC);          // Schnittpunkt von w_alpha mit [BC]
  drawRay(pointA,p);                             // Winkelhalbierende w_alpha zeichnen
  setPointBarycentric(p,sideA,0,sideC);          // Schnittpunkt von w_beta mit [CA]
  drawRay(pointB,p);                             // Winkelhalbierende w_beta zeichnen
  setPointBarycentric(p,sideA,sideB,0);          // Schnittpunkt von w_gamma mit [AB]
  drawRay(pointC,p);                             // Winkelhalbierende w_gamma zeichnen
  calcIncenter();                                // Inkreismittelpunkt berechnen
  drawPoint(ic,color2);                          // Inkreismittelpunkt markieren
  }
  
// Inkreis zeichnen:

function drawIncircle () {
  calcIncenter();                                // Mittelpunkt berechnen
  drawPoint(ic,color2);                          // Mittelpunkt markieren
  var r = 2*area/(sideA+sideB+sideC);            // Radius berechnen
  drawCircle(ic,r,color2);                       // Kreis zeichnen 
  }
  
// Ankreise zeichnen (mit Winkelhalbierenden):

function drawExcircles () {
  var mp = {x: 0, y: 0};                         // Variable f�r Mittelpunkt
  ctx.strokeStyle = color2;                      // Zeichenfarbe
  ctx.fillStyle = color2;                        // F�llfarbe
  setPointBarycentric(mp,-sideA,sideB,sideC);    // Ankreismittelpunkt gegen�ber von A    
  drawPoint(mp);                                 // Ankreismittelpunkt markieren  
  var r = 2*area/(sideB+sideC-sideA);            // Ankreisradius r_a
  drawCircle(mp,r);                              // Ankreis gegen�ber von A zeichnen
  drawRay(pointA,mp);                            // Winkelhalbierende von alpha
  drawRay(pointB,mp);                            // Au�enwinkelhalbierende
  drawRay(pointC,mp);                            // Au�enwinkelhalbierende
  setPointBarycentric(mp,sideA,-sideB,sideC);    // Ankreismittelpunkt gegen�ber von B
  drawPoint(mp);                                 // Ankreismittelpunkt markieren  
  r = 2*area/(sideC+sideA-sideB);                // Ankreisradius r_b
  drawCircle(mp,r);                              // Ankreis gegen�ber von B zeichnen
  drawRay(pointB,mp);                            // Winkelhalbierende von beta
  drawRay(pointC,mp);                            // Au�enwinkelhalbierende
  drawRay(pointA,mp);                            // Au�enwinkelhalbierende
  setPointBarycentric(mp,sideA,sideB,-sideC);    // Ankreismittelpunkt gegen�ber von C
  drawPoint(mp);                                 // Ankreismittelpunkt markieren
  r = 2*area/(sideA+sideB-sideC);                // Ankreisradius r_c
  drawCircle(mp,r);                              // Ankreis gegen�ber von C zeichnen
  drawRay(pointC,mp);                            // Winkelhalbierende von gamma
  drawRay(pointA,mp);                            // Au�enwinkelhalbierende
  drawRay(pointB,mp);                            // Au�enwinkelhalbierende
  }
  
// Mittelparallelen zeichnen:

function drawMidparallels () {
  ctx.strokeStyle = color3;                      // Zeichenfarbe
  calcMidpoints();                               // Seitenmittelpunkte berechnen
  drawSegment(mpB,mpC);                          // Parallele zu [BC] zeichnen
  drawSegment(mpC,mpA);                          // Parallele zu [CA] zeichnen
  drawSegment(mpA,mpB);                          // Parallele zu [AB] zeichnen
  }
  
// Seitenhalbierende und Schwerpunkt zeichnen:

function drawMedians () {
  ctx.strokeStyle = color3;                      // Zeichenfarbe
  calcMidpoints();                               // Seitenmittelpunkte berechnen
  drawSegment(pointA,mpA);                       // Seitenhalbierende s_a zeichnen
  drawSegment(pointB,mpB);                       // Seitenhalbierende s_b zeichnen
  drawSegment(pointC,mpC);                       // Seitenhalbierende s_c zeichnen
  calcCentroid();                                // Schwerpunkt berechnen
  drawPoint(cm,color3);                          // Schwerpunkt markieren
  }
  
// H�hen und H�henschnittpunkt zeichnen:

function drawAltitudes () {
  ctx.strokeStyle = color4;                      // Zeichenfarbe
  var p = {x: 0, y: 0};                          // Variable f�r Fu�punkt
  var tanA = Math.tan(angleA);                   // Tangens von alpha
  var tanB = Math.tan(angleB);                   // Tangens von beta
  var tanC = Math.tan(angleC);                   // Tangens von gamma
  setPointBarycentric(p,0,tanB,tanC);            // Fu�punkt von h_a
  drawSegment(pointA,p);                         // H�he h_a zeichnen                        
  setPointBarycentric(p,tanA,0,tanC);            // Fu�punkt von h_b
  drawSegment(pointB,p);                         // H�he h_b zeichnen
  setPointBarycentric(p,tanA,tanB,0);            // Fu�punkt von h_c
  drawSegment(pointC,p);                         // H�he h_c zeichnen
  calcOrthocenter();                             // H�henschnittpunkt berechnen
  drawPoint(oc,color4);                          // H�henschnittpunkt markieren
  }
  
// Euler-Gerade zeichnen:

function drawEulerLine () {
  calcOrthocenter();                             // H�henschnittpunkt berechnen
  calcCircumcenter();                            // Umkreismittelpunkt berechnen
  drawLine(oc,cc,"#000000");                     // Verbindungsgerade zeichnen
  }
  
// Feuerbach-Kreis zeichnen:

function drawFeuerbachCircle () {
  var fb = {x: 0, y: 0};                         // Variable f�r Mittelpunkt
  var bc1 = sideA*Math.cos(angleB-angleC);       // Erste baryzentrische Koordinate
  var bc2 = sideB*Math.cos(angleC-angleA);       // Zweite baryzentrische Koordinate
  var bc3 = sideC*Math.cos(angleA-angleB);       // Dritte baryzentrische Koordinate
  setPointBarycentric(fb,bc1,bc2,bc3);           // Mittelpunkt berechnen
  drawPoint(fb,"#000000");                       // Mittelpunkt markieren
  var r = sideA*sideB*sideC/(8*area);            // Radius berechnen
  drawCircle(fb,r,"#000000");                    // Kreis zeichnen
  }
  
// Zeichnen:

function paint () {
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.fillStyle = "#ffff00";                     // Hintergrundfarbe gelb
  ctx.fillRect(0,0,canvas.width,canvas.height);  // Hintergrund
  ctx.beginPath();                               // Neuer Pfad f�r Clipping
  ctx.moveTo(10,10);                             // Anfangspunkt (links oben)
  ctx.lineTo(canvas.width-10,10);                // Weiter nach rechts
  ctx.lineTo(canvas.width-10,canvas.height-10);  // Weiter nach unten
  ctx.lineTo(10,canvas.height-10);               // Weiter nach links
  ctx.closePath();                               // Zur�ck nach links oben
  ctx.clip();                                    // Clipping durchf�hren
  drawTriangle();                                // Dreieck ABC
  calcSidesAngles();                             // Seitenl�ngen, Winkelgr��en und Fl�cheninhalt berechnen
  if (cb1.checked) drawPerpendicularBisectors(); // Mittelsenkrechten
  if (cb2.checked) drawCircumcircle();           // Umkreis
  if (cb3.checked) drawAngleBisectors();         // Winkelhalbierende
  if (cb4.checked) drawIncircle();               // Inkreis
  if (cb5.checked) drawExcircles();              // Ankreise
  if (cb6.checked) drawMidparallels();           // Mittelparallelen
  if (cb7.checked) drawMedians();                // Seitenhalbierende und Schwerpunkt
  if (cb8.checked) drawAltitudes();              // H�hen und H�henschnittpunkt
  if (cb9.checked) drawEulerLine();              // Eulersche Gerade
  if (cb10.checked) drawFeuerbachCircle();       // Feuerbachscher Kreis
  emphasizeVertices();                           // Ecken hervorheben
  }
  
/*
   
  // Reaktion auf Ziehen der Maus:

  public void mouseDragged (MouseEvent e) {
    int x = e.getX(), y = e.getY();
    double ax0 = xA, ay0 = yA, bx0 = xB, by0 = yB, cx0 = xC, cy0 = yC;
    double dx1, dy1, dx2, dy2, dx3, dy3;
    if (pointIndex == 0) return;
    if (x < 20 || x > width0-20 || y < 20 || y > height-20) 
      return;
    switch (pointIndex) {
      case 1: ax0 = x; ay0 = height-y; break;
      case 2: bx0 = x; by0 = height-y; break;
      case 3: cx0 = x; cy0 = height-y; break;
      }
    // Mindestabstand 20 Pixel
    dx1 = bx0-ax0; dy1 = by0-ay0; 
    if (dx1*dx1+dy1*dy1 < 400) return;
    dx2 = cx0-ax0; dy2 = cy0-ay0; 
    if (dx2*dx2+dy2*dy2 < 400) return;
    dx3 = cx0-bx0; dy3 = cy0-by0; 
    if (dx3*dx3+dy3*dy3 < 400) return;
    if (dx1*dy3-dx3*dy1 <= 0) return;       // Falscher Drehsinn
    switch (pointIndex) {
      case 1: xA = ax0; yA = ay0; break;
      case 2: xB = bx0; yB = by0; break;
      case 3: xC = cx0; yC = cy0; break;
      }
    cv.repaint();
    }    

  } // Ende Dreieck
  
*/
  
document.addEventListener("DOMContentLoaded",start,false);
