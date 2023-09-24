// Milchkannenr�tsel
// Anregung von Anna Schwendinger (Bregenz)
// Java-Applet (27.08.1998) umgewandelt
// 22.04.2014 - 08.07.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Konstanten:

var colorBackground = "#0000ff";                 // Hintergrundfarbe
var colorGround = "#ffc000";                     // Farbe der Unterlage
var colorLiquid = "#ffffff";                     // Farbe der Fl�ssigkeit
var colorCongratulation = ["#ff0000", "#ffc000", 
  "#000000", "#00ff00", "#ff00ff", "#ffffff"];   // Farben f�r Gl�ckwunsch
  
var font = "normal normal bold 12px sans-serif"; // Zeichensatz

var r = 20;                                      // Radius einer Kanne (Pixel)
var d = 5;                                       // Dicke (Pixel)
var pixUnit = 15;                                // Pixel pro Volumeneinheit
var max = [3, 5, 8];                             // Fassungsverm�gen (Volumeneinheiten)
var canvas, ctx;                                 // Zeichenfl�che, Grafikkontext
var width, height;                               // Abmessungen der Zeichenfl�che (Pixel)
var y0;                                          // y-Koordinate der Unterlage (Pixel)

// Attribute:

var on;                                          // Flag f�r Bewegung
var t0;                                          // Anfangszeitpunkt (s)
var t;                                           // Aktuelle Zeit (s)
var indexJug;                                    // Index der bewegten Kanne (0 bis 2 bzw. -1)
var indexTarget;                                 // Index der Zielkanne (0 bis 2 bzw. -1)
var fu;                                          // Momentane F�llung (Volumeneinheiten)
var direction;                                   // Nach links (-1) oder nach rechts (+1)
var ready;                                       // Flag f�r Spielende
var fu1;                                         // Urspr�ngliche F�llung der bewegten Kanne (Volumeneinheiten)
var fu2;                                         // Urspr�ngliche F�llung der Zielkanne (Volumeneinheiten)
var dt1;                                         // Zeit f�r Phase 1 (Bewegung zur Zielkanne) in Sekunden;
                                                 // gilt auch f�r Phase 3 (Zur�ckstellen)
var dt2;                                         // Zeit f�r Phase 2 (Ausgie�en) in Sekunden
var xBP, yBP;                                    // Koordinaten des Bezugspunkts
var xA, yA;                                      // Koordinaten des Anfangspunkts
var xB, yB;                                      // Koordinaten des Endpunkts
var omega1, omega3;                              // Winkelgeschwindigkeit f�r Phase 1 bzw. 3
var alpha;                                       // Aktueller Neigungswinkel (Bogenma�)
var jug, liquid;                                 // Polygone f�r Kanne und Fl�ssigkeit

// Start:

function start () {
  canvas = document.getElementById("cv");        // Zeichenfl�che
  width = canvas.width; height = canvas.height;  // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                 // Grafikkontext
  y0 = height-60;                                // y-Koordinate der Unterlage (Pixel)
  fu = new Array(3);                             // Array f�r aktuelle F�llmengen
  begin();                                       // Startwerte
  jug = newArray(8);                             // Array f�r Polygonecken (Kanne)
  liquid = newArray(4);                          // Array f�r Polygonecken (Fl�ssigkeit)
  setInterval(paint,40);                         // Timer-Intervall 0,040 s (neu zeichnen)
  
  canvas.onmousedown = function (e) {            // Reaktion auf Dr�cken der Maustaste
    reactionDown(e.clientX,e.clientY);           // Eventuell Zugmodus aktivieren                     
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Ber�hrung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       // Eventuell Zugmodus aktivieren
    if (indexJug >= 0) e.preventDefault();       // Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    reactionUp(e.clientX,e.clientY);                       
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Ber�hrung
    var obj = e.changedTouches[0];
    reactionUp(obj.clientX,obj.clientY);       
    }
    
  } // Ende der Methode start
  
// Startwerte f�r Spielbeginn:
// Seiteneffekt on, ready, t, fu[], indexJug, indexTarget, direction

function begin () {
  on = ready = false; t = 0;                     // Animation abgeschaltet 
  fu[0] = fu[1] = 0; fu[2] = 8;                  // Startwerte f�r F�llmengen
  indexJug = indexTarget = -1;                   // Keine Kanne ausgew�hlt
  direction = 0;                                 // Bewegungsrichtung nicht definiert   
  }
  
// Neues Array f�r Polygonecken:
// n ... Zahl der Ecken

function newArray (n) {
  var a = new Array(n);                          // Neues Array der Dimension n
  for (var i=0; i<n; i++) a[i] = {x: 0, y: 0};   // Mit Punkten (0,0) auff�llen
  return a;                                      // R�ckgabewert (Array)
  }
  
// Nummer der Kanne
// x ... x-Koordinate
// R�ckgabewert: Index der ausgew�hlten Kanne (0 bis 2), bei Misserfolg -1

function numberJug (x) {
  for (var i=0; i<3; i++)                        // F�r alle drei Indizes ... 
    if (Math.abs(x-100-i*150) < r) return i;     // Index zur�ckgeben, falls x im richtigen Bereich
  return -1;                                     // Keine Kanne ausgew�hlt
  }
  
// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt indexJug, indexTarget, on, ready, t, fu[], direction

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bez�glich Zeichenfl�che
  if (on && !ready) return;                      // Abbrechen, falls Bewegung l�uft
  indexJug = numberJug(x);                       // Index der bewegten Kanne
  if (indexJug == -1) indexTarget = -1;          // Keine Kanne ausgew�hlt              
  if (indexJug != -1 && fu[indexJug] == 0)       // Falls bewegte Kanne leer ...
    indexJug = indexTarget = -1;                 // Bewegte Kanne und Zielkanne nicht definiert
  if (ready) begin();                            // Falls Spiel beendet, Neustart vorbereiten
  }
   
// Reaktion auf Loslassen der Maustaste oder Ende der Ber�hrung
// Seiteneffekt indexTarget, indexJug, fu1, fu2, direction, on, xA, yA, xB, yB, dt1, dt2, omega1, omega3, t0
  
function reactionUp (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bez�glich Zeichenfl�che
  if (on || indexJug == -1) return;              // Abbrechen, falls keine Kanne bewegt
  indexTarget = numberJug(x);                    // Index der Zielkanne 
  if (indexTarget == -1) indexJug = -1;          // Keine Kanne ausgew�hlt
  if (indexTarget == indexJug)                   // Falls Zielkanne mit bewegter Kanne �bereinstimmt ... 
    indexJug = indexTarget = -1;                 // Auswahl aufheben
  if (indexTarget != -1 && fu[indexTarget] == max[indexTarget]) // Falls Zielkanne voll ...
    indexJug = indexTarget = -1;                 // Auswahl aufheben
  if (indexJug != -1 && indexTarget != -1) {     // Falls bewegte Kanne und Zielkanne definiert ...
    fu1 = fu[indexJug]; fu2 = fu[indexTarget];   // F�llmengen abspeichern
    calculationConst();                          // Konstante Werte f�r Bewegung ausrechnen
    on = true;                                   // Animation einschalten
    t0 = new Date();                             // Anfangszeitpunkt der Animation
    }
  }
  
// Punkt eines Polygons setzen:
// p ...... Polygon (Array der Ecken)
// i ...... Index der Ecke
// x, y ... Koordinaten (Pixel)
  
function setPoint (p, i, x, y) {
  p[i].x = x; p[i].y = y;
  }

// Punkt eines Polygons �bernehmen:  
// p1 ... Zielpolygon
// i1 ... Punktindex im Zielpolygon
// p0 ... urspr�ngliches Polygon
// i0 ... Punktindex im urspr�nglichen Polygon

function takePoint (p1, i1, p0, i0) {
  p1[i1].x = p0[i0].x; p1[i1].y = p0[i0].y;
  }
  
// Konstante Werte f�r Bewegung berechnen:
// Seiteneffekt direction, on, xA, yA, xB, yB, dt1, dt2, omega1, omega3

function calculationConst () {
  var h = max[indexJug];                         // Fassungsverm�gen der bewegten Kanne
  if (indexTarget < indexJug) direction = -1;    // Bewegung nach links 
  else if (indexTarget > indexJug) direction = 1;// Bewegung nach rechts
  else on = false;                               // Keine Bewegung
  // Anfangspunkt: Innenseite oben, der Zielkanne zugewandt
  xA = 100+indexJug*150+direction*r;             // x-Koordinate Anfangspunkt 
  yA = y0-d-h*pixUnit;                           // y-Koordinate Anfangspunkt
  // Endpunkt: Oberhalb der Zielkanne
  xB = 100+indexTarget*150-direction*10;         // x-Koordinate Endpunkt 
  yB = y0-d-(max[indexTarget]+h)*pixUnit-20;     // y-Koordinate Endpunkt
  if (Math.abs(indexJug-indexTarget) == 1)       // Falls Kannen benachbart ... 
    dt1 = 2;                                     // 2 Sekunden Zeit f�r Bewegung zur Zielkanne 
  else dt1 = 3;                                  // Sonst 3 Sekunden
  if (fu1 <= max[indexTarget]-fu2)               // Falls Kanne komplett geleert wird ... 
    dt2 = fu1;                                   // Zeit f�r Ausgie�en entsprechend F�llmenge
  else dt2 = max[indexTarget]-fu2;               // Sonst Zeit entsprechend der umgef�llten Menge
  //if (dt2 == 0) on = false; // Wirklich n�tig???
  var alpha1;                                    // Maximaler Neigungswinkel f�r Bewegung zur Zielkanne (Bogenma�)
  if (fu1 < h/2) alpha1 = Math.atan(h*h*pixUnit/(4*r*fu1));         
  else alpha1 = Math.atan((h*pixUnit-fu1*pixUnit)/r);
  omega1 = alpha1/dt1;                           // Winkelgeschwindigkeit f�r Bewegung zur Zielkanne
  var alpha3;                                    // Maximaler Neigungswinkel beim Zur�ckstellen                                   
  if (fu1-dt2 < h/2) alpha3 = Math.atan(h*h*pixUnit/(4*r*(fu1-dt2)));
  else alpha3 = Math.atan((h*pixUnit-(fu1-dt2)*pixUnit)/r);
  omega3 = alpha3/dt1;                           // Winkelgeschwindigkeit beim Zur�ckstellen
  }
  
// Zeitabh�ngige Werte f�r Bewegung berechnen:
// Seiteneffekt xBP, yBP, alpha, fu[indexJug], fu[indexTarget], on, indexJug, indexTarget, t

function calculationVar () {
  var dy = 160; if (Math.abs(indexJug-indexTarget) == 2) dy = 280;
  if (t < dt1) {                                 // Phase 1 (Bewegung zur Zielkanne)
    var q = t/dt1;                               // Bruchteil der Zeit
    // Bezugspunkt (xBP,yBP) bewegt sich auf Parabel
    xBP = xA+(xB-xA)*q;                          // x-Koordinate Bezugspunkt
    yBP = yA+(yB-yA)*q-q*(1-q)*dy;               // y-Koordinate Bezugspunkt
    alpha = omega1*t;                            // Aktueller Neigungswinkel (Bogenma�)
    }
  else if (t < dt1+dt2) {                        // Phase 2 (Ausgie�en)
    var h = max[indexJug];                       // Fassungverm�gen der bewegten Kanne 
    var f = fu[indexJug] = fu1-(t-dt1);          // Aktuelle F�llmenge der bewegten Kanne 
    fu[indexTarget] = fu2+(t-dt1);               // Aktuelle F�llmenge der Zielkanne
    if (f < h/2) alpha = Math.atan(h*h*pixUnit/(4*r*f));   // Aktueller Neigungswinkel (Bogenma�)
    else alpha = Math.atan((h*pixUnit-f*pixUnit)/r);
    }
  else if (t < 2*dt1+dt2) {                      // Phase 3 (Zur�ckstellen)
    fu[indexJug] = fu1-dt2;                      // F�llmenge der bewegten Kanne 
    fu[indexTarget] = fu2+dt2;                   // F�llmenge der Zielkanne
    var q = (t-dt1-dt2)/dt1;                     // Bruchteil der Zeit
    // Bezugspunkt (xBP,yBP) bewegt sich auf Parabel
    xBP = xB+(xA-xB)*q;                          // x-Koordinate Bezugspunkt
    yBP = yB+(yA-yB)*q-q*(1-q)*dy;               // y-Koordinate Bezugspunkt
    alpha = omega3*(2*dt1+dt2-t);                // Aktueller Neigungswinkel (Bogenma�)
    } 
  else {                                         // Bewegung beendet
    xBP = xA; yBP = yA; alpha = 0;               // Werte wie am Anfang 
    if (!ready) on = false;                      // Flag f�r Bewegung
    indexJug = indexTarget = -1;                 // Keine Kanne ausgew�hlt 
    t = 0;                                       // Aktuelle Zeit
    }
  }
  
//-----------------------------------------------------------------------------

// Volumenangabe (gerundet):
// a ...... Array der Dimension 3 mit Zahlenangaben
// i ...... Index (0 bis 2)
// x, y ... Position (zentrierter Text)
  	
function writeValue (a, i, x, y) {
  var v = Math.round(a[i]);                      // Zahlenwert (gerundet)
  var s;                                         // Variable f�r Zeichenkette
  switch (v) {                                   // Je nach Zahlenwert ... 
    case 0: s = unit0; break;                    // Anzahl 0
    case 1: s = unit1; break;                    // Anzahl 1
    case 2: s = unit2; break;                    // Anzahl 2
    default: s = unit3;                          // Anzahl mindestens gleich 3
    }
  ctx.fillText(v+" "+s,x,y);                     // Text schreiben 
  }
  
// Neuer Pfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = "#000000";                   // Linienfarbe
  ctx.lineWidth = 1;                             // Liniendicke
  }
  
// Polygon ausf�llen:
// p ... Array der Polygonecken (mit Attributen x, y)
// c ... F�llfarbe

function fillPolygon (p, c) {
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = c;                             // F�llfarbe
  ctx.moveTo(p[0].x,p[0].y);                     // Anfangspunkt
  for (var i=1; i<p.length; i++)                 // F�r alle weiteren Ecken ... 
    ctx.lineTo(p[i].x,p[i].y);                   // Verbindungslinie hinzuf�gen
  ctx.closePath();                               // Linie zum Anfangspunkt zur�ck hinzuf�gen
  ctx.fill();                                    // Polygon ausf�llen
  }
  
// Ganz oder teilweise gef�llte Kanne in senkrechter Lage zeichnen:
// i ... Index (0 bis 2)

function drawJugVertical (i) {
  var hPix = max[i]*pixUnit;                     // H�he der Kanne (Pixel)
  var fPix = fu[i]*pixUnit;                      // F�llh�he (Pixel)
  var x = 100+i*150;                             // x-Koordinate (Mitte)
  var y = y0-d-max[i]*pixUnit;                   // y-Koordinate (oben)  
  ctx.fillStyle = "#000000";                     // F�llfarbe schwarz f�r Kanne
  ctx.fillRect(x-r-d,y+hPix,2*r+2*d,d);          // Boden
  ctx.fillRect(x-r-d,y,d,hPix);                  // Linke Wand
  ctx.fillRect(x+r,y,d,hPix);                    // Rechte Wand
  ctx.fillStyle = colorLiquid;                   // F�llfarbe f�r Fl�ssigkeit
  ctx.fillRect(x-r,y+hPix-fPix,2*r,fPix);        // Fl�ssigkeit
  }
  
// Ganz oder teilweise gef�llte Kanne geneigt zeichnen:
// i ... Index (0 bis 2)
// alpha ... Neigungswinkel (Bogenma�, mit Vorzeichen)

function drawJug (i, alpha) {
  var hPix = max[i]*pixUnit;                     // H�he der Kanne (Pixel)
  var fPix = fu[i]*pixUnit;                      // F�llh�he (Pixel)
  var sin = Math.sin(alpha);                     // Sinus des Neigungswinkels 
  var cos = Math.cos(alpha);                     // Cosinus des Neigungswinkels
  var tan = Math.tan(alpha);                     // Tangens des Neigungswinkels
  var xM = xBP-direction*r*cos;                  // x-Koordinate oben Mitte
  var yM = yBP-direction*r*sin;                  // y-Koordinate oben Mitte
  var x = xM-r*cos, y = yM-r*sin;                // Ecke oben links innen
  setPoint(jug,0,x,y);
  x -= d*cos; y -= d*sin;                        // Ecke oben links au�en
  setPoint(jug,1,x,y);
  x -= (hPix+d)*sin; y += (hPix+d)*cos;          // Ecke unten links au�en
  setPoint(jug,2,x,y);
  x += 2*(r+d)*cos; y += 2*(r+d)*sin;            // Ecke unten rechts au�en
  setPoint(jug,3,x,y);
  x += (hPix+d)*sin; y -= (hPix+d)*cos;          // Ecke oben rechts au�en
  setPoint(jug,4,x,y);
  x -= d*cos; y -= d*sin;                        // Ecke oben rechts innen
  setPoint(jug,5,x,y);
  x -= hPix*sin; y += hPix*cos;                  // Ecke unten rechts innen
  setPoint(jug,6,x,y);
  x -= 2*r*cos; y -= 2*r*sin;                    // Ecke unten links innen
  setPoint(jug,7,x,y); 
  fillPolygon(jug,"#000000");                    // Polygon f�r Kanne ausf�llen
  var a = 2*Math.sqrt(fPix*r/Math.abs(tan));     // Benetzter Teil des Kannenbodens (Pixel) 
  if (a > 2*r) {                                 // Falls geringe Neigung (viereckiger Querschnitt) ...
    var mx = xM-(hPix-fPix)*sin;                 // Mittelpunkt Fl�ssigkeitsspiegel (x-Koordinate) 
    var my = yM+(hPix-fPix)*cos;                 // Mittelpunkt Fl�ssigkeitsspiegel (y-Koordinate)
    x = mx-r*cos-r*tan*sin; y = my;              // Ecke links oben
    setPoint(liquid,0,x,y);                      
    takePoint(liquid,1,jug,7);                   // Ecke links unten (von Kanne �bernommen)
    takePoint(liquid,2,jug,6);                   // Ecke rechts unten (von Kanne �bernommen)
    x = mx+r*cos+r*tan*sin; y = my;              // Ecke rechts oben
    setPoint(liquid,3,x,y);    
    }
  else {                                         // Falls starke Neigung (dreieckiger Querschnitt) ...
    var b = Math.abs(a*tan);                     // Benetzter Teil der unteren Wand der Kanne (Pixel)
    takePoint(liquid,0,jug,alpha>0?6:7);         // Untere Ecke (von Kanne �bernommen)
    takePoint(liquid,1,jug,alpha>0?6:7);         // Gleiche Ecke nochmal (wegen Arraydimension 4)
    x = liquid[0].x+b*sin;                       // Ecke an der unteren Kannenwand 
    y = liquid[0].y-b*cos;
    setPoint(liquid,2,x,y);
    x = liquid[0].x-(alpha>0 ? a : -a)*cos;      // Ecke am Kannenboden
    // Math.sign() funktioniert nicht bei allen Browsern. 
    y = liquid[0].y-a*Math.abs(sin);
    setPoint(liquid,3,x,y);
    } 
  fillPolygon(liquid,colorLiquid);               // Viereck oder Dreieck f�r Fl�ssigkeit ausf�llen 
  }
   
// Parabel f�r ausgegossene Fl�ssigkeit:

function outpour () {
  var xP0 = xBP, yP0 = yBP;                      // Anfangspunkt Kurvenst�ck (Bezugspunkt)
  newPath();                                     // Neuer Pfad 
  ctx.strokeStyle = colorLiquid;                 // Farbe
  var yMax = y0-d-1;                             // Maximaler y-Wert (wegen Kannenboden)
  for (var i=1; true; i++) {                     // Endlosschleife (Abbruch durch break)
    var xP1 = xBP+direction*i, yP1 = yBP+i*i;    // Endpunkt Kurvenst�ck
    if (yP1 > yMax) yP1 = yMax;                  // Nicht in den Kannenboden hineinzeichnen
    for (var k=0; k<3; k++) {                    // Um 0 bis 2 Pixel seitlich versetzt ...
      var dx = k*direction;                      // Betrag der seitlichen Versetzung (mit Vorzeichen)
      ctx.moveTo(xP0+dx,yP0);                    // Anfangspunkt Kurvenst�ck 
      ctx.lineTo(xP1+dx,yP1);                    // Endpunkt Kurvenst�ck
      }
    xP0 = xP1; yP0 = yP1;                        // Bisheriger Endpunkt als Anfangspunkt 
    if (yP0 >= yMax) break;                      // Abbruch, falls zu weit unten
    }
  ctx.stroke();                                  // Zeichnen
  }
  
// Gratulation (Spielende):

function gratulation () {
  var nr = Math.floor(t)%6;                      // Index der Hintergrundfarbe 
  ctx.fillStyle = colorCongratulation[nr];       // Hintergrundfarbe
  ctx.fillRect(160,97,180,40);                   // Hintergrund ausf�llen
  ctx.fillStyle = colorCongratulation[(nr+1)%6]; // Textfarbe
  ctx.textAlign = "center";                      // Text zentrieren 
  ctx.fillText(text1,250,120);                   // Gl�ckwunsch
  ctx.strokeStyle = "#000000";                   // Randfarbe schwarz 
  ctx.strokeRect(160,97,180,40);                 // Rand des Hintergrunds
  if (t > 12) {                                  // Falls mehr als 12 Sekunden vergangen ...
    ctx.fillStyle = colorLiquid;                 // Textfarbe
    ctx.textAlign = "left";                      // Text linksb�ndig
    ctx.fillText(text2,150,180);                 // Anweisung Neustart, 1. Zeile
    ctx.fillText(text3,150,200);                 // Anweisung Neustart, 2. Zeile
    }
  }
  
// Grafikausgabe:
  
function paint () {
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                // Hintergrund ausf�llen
  ctx.fillStyle = colorGround;                   // Farbe der Unterlage
  ctx.fillRect(50,y0,width-100,10);              // Unterlage
  ctx.strokeRect(50,y0,width-100,10);            // Rand f�r Unterlage
  if (on) t = (new Date()-t0)/1000;              // Aktuelle Zeit (s)
  if (on && !ready) calculationVar();            // Aktuelle Werte f�r Bewegung ausrechnen, falls n�tig
  for (var i=0; i<3; i++) {                      // F�r alle drei Kannen ...
    if (i != indexJug || indexTarget == -1)      // Falls Kanne nicht in Bewegung ...
      drawJugVertical(i);                        // Kanne in senkrechter Lage zeichnen
    else {                                       // Falls Kanne in Bewegung ...
      drawJug(i,direction*alpha);                // Kanne in geneigter Lage zeichnen
      if (t > dt1 && t < dt1+dt2)                // Falls Bewegungsphase 2 
        outpour();                               // Parabel f�r ausgegossene Fl�ssigkeit
      }
    } // Ende for-Schleife
  ctx.textAlign = "center";                      // Zentrierter Text
  ctx.font = font;                               // Zeichensatz
  ctx.fillStyle = colorLiquid;                   // Farbe der Fl�ssigkeit
  for (var i=0; i<3; i++)                        // F�r alle drei Kannen ...
    writeValue(max,i,100+i*150,40);              // Fassungsverm�gen angeben (oben)
  for (var i=0; i<3; i++) {                      // F�r alle drei Kannen ...
    writeValue(fu,i,100+i*150,height-30);        // Aktuelle F�llmenge angeben (unten)
    if (fu[i] == 4 && t == 0)                    // Falls Kanne genau 4 Volumeneinheiten enth�lt ... 
      on = ready = true;                         // Spiel zu Ende 
    }
  if (ready) gratulation();                      // Gl�ckwunsch
  }
  
document.addEventListener("DOMContentLoaded",start,false);


