// Milchkannenrätsel
// Anregung von Anna Schwendinger (Bregenz)
// Java-Applet (27.08.1998) umgewandelt
// 22.04.2014 - 08.07.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Konstanten:

var colorBackground = "#0000ff";                 // Hintergrundfarbe
var colorGround = "#ffc000";                     // Farbe der Unterlage
var colorLiquid = "#ffffff";                     // Farbe der Flüssigkeit
var colorCongratulation = ["#ff0000", "#ffc000", 
  "#000000", "#00ff00", "#ff00ff", "#ffffff"];   // Farben für Glückwunsch
  
var font = "normal normal bold 12px sans-serif"; // Zeichensatz

var r = 20;                                      // Radius einer Kanne (Pixel)
var d = 5;                                       // Dicke (Pixel)
var pixUnit = 15;                                // Pixel pro Volumeneinheit
var max = [3, 5, 8];                             // Fassungsvermögen (Volumeneinheiten)
var canvas, ctx;                                 // Zeichenfläche, Grafikkontext
var width, height;                               // Abmessungen der Zeichenfläche (Pixel)
var y0;                                          // y-Koordinate der Unterlage (Pixel)

// Attribute:

var on;                                          // Flag für Bewegung
var t0;                                          // Anfangszeitpunkt (s)
var t;                                           // Aktuelle Zeit (s)
var indexJug;                                    // Index der bewegten Kanne (0 bis 2 bzw. -1)
var indexTarget;                                 // Index der Zielkanne (0 bis 2 bzw. -1)
var fu;                                          // Momentane Füllung (Volumeneinheiten)
var direction;                                   // Nach links (-1) oder nach rechts (+1)
var ready;                                       // Flag für Spielende
var fu1;                                         // Ursprüngliche Füllung der bewegten Kanne (Volumeneinheiten)
var fu2;                                         // Ursprüngliche Füllung der Zielkanne (Volumeneinheiten)
var dt1;                                         // Zeit für Phase 1 (Bewegung zur Zielkanne) in Sekunden;
                                                 // gilt auch für Phase 3 (Zurückstellen)
var dt2;                                         // Zeit für Phase 2 (Ausgießen) in Sekunden
var xBP, yBP;                                    // Koordinaten des Bezugspunkts
var xA, yA;                                      // Koordinaten des Anfangspunkts
var xB, yB;                                      // Koordinaten des Endpunkts
var omega1, omega3;                              // Winkelgeschwindigkeit für Phase 1 bzw. 3
var alpha;                                       // Aktueller Neigungswinkel (Bogenmaß)
var jug, liquid;                                 // Polygone für Kanne und Flüssigkeit

// Start:

function start () {
  canvas = document.getElementById("cv");        // Zeichenfläche
  width = canvas.width; height = canvas.height;  // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                 // Grafikkontext
  y0 = height-60;                                // y-Koordinate der Unterlage (Pixel)
  fu = new Array(3);                             // Array für aktuelle Füllmengen
  begin();                                       // Startwerte
  jug = newArray(8);                             // Array für Polygonecken (Kanne)
  liquid = newArray(4);                          // Array für Polygonecken (Flüssigkeit)
  setInterval(paint,40);                         // Timer-Intervall 0,040 s (neu zeichnen)
  
  canvas.onmousedown = function (e) {            // Reaktion auf Drücken der Maustaste
    reactionDown(e.clientX,e.clientY);           // Eventuell Zugmodus aktivieren                     
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Berührung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       // Eventuell Zugmodus aktivieren
    if (indexJug >= 0) e.preventDefault();       // Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    reactionUp(e.clientX,e.clientY);                       
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Berührung
    var obj = e.changedTouches[0];
    reactionUp(obj.clientX,obj.clientY);       
    }
    
  } // Ende der Methode start
  
// Startwerte für Spielbeginn:
// Seiteneffekt on, ready, t, fu[], indexJug, indexTarget, direction

function begin () {
  on = ready = false; t = 0;                     // Animation abgeschaltet 
  fu[0] = fu[1] = 0; fu[2] = 8;                  // Startwerte für Füllmengen
  indexJug = indexTarget = -1;                   // Keine Kanne ausgewählt
  direction = 0;                                 // Bewegungsrichtung nicht definiert   
  }
  
// Neues Array für Polygonecken:
// n ... Zahl der Ecken

function newArray (n) {
  var a = new Array(n);                          // Neues Array der Dimension n
  for (var i=0; i<n; i++) a[i] = {x: 0, y: 0};   // Mit Punkten (0,0) auffüllen
  return a;                                      // Rückgabewert (Array)
  }
  
// Nummer der Kanne
// x ... x-Koordinate
// Rückgabewert: Index der ausgewählten Kanne (0 bis 2), bei Misserfolg -1

function numberJug (x) {
  for (var i=0; i<3; i++)                        // Für alle drei Indizes ... 
    if (Math.abs(x-100-i*150) < r) return i;     // Index zurückgeben, falls x im richtigen Bereich
  return -1;                                     // Keine Kanne ausgewählt
  }
  
// Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt indexJug, indexTarget, on, ready, t, fu[], direction

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  if (on && !ready) return;                      // Abbrechen, falls Bewegung läuft
  indexJug = numberJug(x);                       // Index der bewegten Kanne
  if (indexJug == -1) indexTarget = -1;          // Keine Kanne ausgewählt              
  if (indexJug != -1 && fu[indexJug] == 0)       // Falls bewegte Kanne leer ...
    indexJug = indexTarget = -1;                 // Bewegte Kanne und Zielkanne nicht definiert
  if (ready) begin();                            // Falls Spiel beendet, Neustart vorbereiten
  }
   
// Reaktion auf Loslassen der Maustaste oder Ende der Berührung
// Seiteneffekt indexTarget, indexJug, fu1, fu2, direction, on, xA, yA, xB, yB, dt1, dt2, omega1, omega3, t0
  
function reactionUp (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  if (on || indexJug == -1) return;              // Abbrechen, falls keine Kanne bewegt
  indexTarget = numberJug(x);                    // Index der Zielkanne 
  if (indexTarget == -1) indexJug = -1;          // Keine Kanne ausgewählt
  if (indexTarget == indexJug)                   // Falls Zielkanne mit bewegter Kanne übereinstimmt ... 
    indexJug = indexTarget = -1;                 // Auswahl aufheben
  if (indexTarget != -1 && fu[indexTarget] == max[indexTarget]) // Falls Zielkanne voll ...
    indexJug = indexTarget = -1;                 // Auswahl aufheben
  if (indexJug != -1 && indexTarget != -1) {     // Falls bewegte Kanne und Zielkanne definiert ...
    fu1 = fu[indexJug]; fu2 = fu[indexTarget];   // Füllmengen abspeichern
    calculationConst();                          // Konstante Werte für Bewegung ausrechnen
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

// Punkt eines Polygons übernehmen:  
// p1 ... Zielpolygon
// i1 ... Punktindex im Zielpolygon
// p0 ... ursprüngliches Polygon
// i0 ... Punktindex im ursprünglichen Polygon

function takePoint (p1, i1, p0, i0) {
  p1[i1].x = p0[i0].x; p1[i1].y = p0[i0].y;
  }
  
// Konstante Werte für Bewegung berechnen:
// Seiteneffekt direction, on, xA, yA, xB, yB, dt1, dt2, omega1, omega3

function calculationConst () {
  var h = max[indexJug];                         // Fassungsvermögen der bewegten Kanne
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
    dt1 = 2;                                     // 2 Sekunden Zeit für Bewegung zur Zielkanne 
  else dt1 = 3;                                  // Sonst 3 Sekunden
  if (fu1 <= max[indexTarget]-fu2)               // Falls Kanne komplett geleert wird ... 
    dt2 = fu1;                                   // Zeit für Ausgießen entsprechend Füllmenge
  else dt2 = max[indexTarget]-fu2;               // Sonst Zeit entsprechend der umgefüllten Menge
  //if (dt2 == 0) on = false; // Wirklich nötig???
  var alpha1;                                    // Maximaler Neigungswinkel für Bewegung zur Zielkanne (Bogenmaß)
  if (fu1 < h/2) alpha1 = Math.atan(h*h*pixUnit/(4*r*fu1));         
  else alpha1 = Math.atan((h*pixUnit-fu1*pixUnit)/r);
  omega1 = alpha1/dt1;                           // Winkelgeschwindigkeit für Bewegung zur Zielkanne
  var alpha3;                                    // Maximaler Neigungswinkel beim Zurückstellen                                   
  if (fu1-dt2 < h/2) alpha3 = Math.atan(h*h*pixUnit/(4*r*(fu1-dt2)));
  else alpha3 = Math.atan((h*pixUnit-(fu1-dt2)*pixUnit)/r);
  omega3 = alpha3/dt1;                           // Winkelgeschwindigkeit beim Zurückstellen
  }
  
// Zeitabhängige Werte für Bewegung berechnen:
// Seiteneffekt xBP, yBP, alpha, fu[indexJug], fu[indexTarget], on, indexJug, indexTarget, t

function calculationVar () {
  var dy = 160; if (Math.abs(indexJug-indexTarget) == 2) dy = 280;
  if (t < dt1) {                                 // Phase 1 (Bewegung zur Zielkanne)
    var q = t/dt1;                               // Bruchteil der Zeit
    // Bezugspunkt (xBP,yBP) bewegt sich auf Parabel
    xBP = xA+(xB-xA)*q;                          // x-Koordinate Bezugspunkt
    yBP = yA+(yB-yA)*q-q*(1-q)*dy;               // y-Koordinate Bezugspunkt
    alpha = omega1*t;                            // Aktueller Neigungswinkel (Bogenmaß)
    }
  else if (t < dt1+dt2) {                        // Phase 2 (Ausgießen)
    var h = max[indexJug];                       // Fassungvermögen der bewegten Kanne 
    var f = fu[indexJug] = fu1-(t-dt1);          // Aktuelle Füllmenge der bewegten Kanne 
    fu[indexTarget] = fu2+(t-dt1);               // Aktuelle Füllmenge der Zielkanne
    if (f < h/2) alpha = Math.atan(h*h*pixUnit/(4*r*f));   // Aktueller Neigungswinkel (Bogenmaß)
    else alpha = Math.atan((h*pixUnit-f*pixUnit)/r);
    }
  else if (t < 2*dt1+dt2) {                      // Phase 3 (Zurückstellen)
    fu[indexJug] = fu1-dt2;                      // Füllmenge der bewegten Kanne 
    fu[indexTarget] = fu2+dt2;                   // Füllmenge der Zielkanne
    var q = (t-dt1-dt2)/dt1;                     // Bruchteil der Zeit
    // Bezugspunkt (xBP,yBP) bewegt sich auf Parabel
    xBP = xB+(xA-xB)*q;                          // x-Koordinate Bezugspunkt
    yBP = yB+(yA-yB)*q-q*(1-q)*dy;               // y-Koordinate Bezugspunkt
    alpha = omega3*(2*dt1+dt2-t);                // Aktueller Neigungswinkel (Bogenmaß)
    } 
  else {                                         // Bewegung beendet
    xBP = xA; yBP = yA; alpha = 0;               // Werte wie am Anfang 
    if (!ready) on = false;                      // Flag für Bewegung
    indexJug = indexTarget = -1;                 // Keine Kanne ausgewählt 
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
  var s;                                         // Variable für Zeichenkette
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
  
// Polygon ausfüllen:
// p ... Array der Polygonecken (mit Attributen x, y)
// c ... Füllfarbe

function fillPolygon (p, c) {
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = c;                             // Füllfarbe
  ctx.moveTo(p[0].x,p[0].y);                     // Anfangspunkt
  for (var i=1; i<p.length; i++)                 // Für alle weiteren Ecken ... 
    ctx.lineTo(p[i].x,p[i].y);                   // Verbindungslinie hinzufügen
  ctx.closePath();                               // Linie zum Anfangspunkt zurück hinzufügen
  ctx.fill();                                    // Polygon ausfüllen
  }
  
// Ganz oder teilweise gefüllte Kanne in senkrechter Lage zeichnen:
// i ... Index (0 bis 2)

function drawJugVertical (i) {
  var hPix = max[i]*pixUnit;                     // Höhe der Kanne (Pixel)
  var fPix = fu[i]*pixUnit;                      // Füllhöhe (Pixel)
  var x = 100+i*150;                             // x-Koordinate (Mitte)
  var y = y0-d-max[i]*pixUnit;                   // y-Koordinate (oben)  
  ctx.fillStyle = "#000000";                     // Füllfarbe schwarz für Kanne
  ctx.fillRect(x-r-d,y+hPix,2*r+2*d,d);          // Boden
  ctx.fillRect(x-r-d,y,d,hPix);                  // Linke Wand
  ctx.fillRect(x+r,y,d,hPix);                    // Rechte Wand
  ctx.fillStyle = colorLiquid;                   // Füllfarbe für Flüssigkeit
  ctx.fillRect(x-r,y+hPix-fPix,2*r,fPix);        // Flüssigkeit
  }
  
// Ganz oder teilweise gefüllte Kanne geneigt zeichnen:
// i ... Index (0 bis 2)
// alpha ... Neigungswinkel (Bogenmaß, mit Vorzeichen)

function drawJug (i, alpha) {
  var hPix = max[i]*pixUnit;                     // Höhe der Kanne (Pixel)
  var fPix = fu[i]*pixUnit;                      // Füllhöhe (Pixel)
  var sin = Math.sin(alpha);                     // Sinus des Neigungswinkels 
  var cos = Math.cos(alpha);                     // Cosinus des Neigungswinkels
  var tan = Math.tan(alpha);                     // Tangens des Neigungswinkels
  var xM = xBP-direction*r*cos;                  // x-Koordinate oben Mitte
  var yM = yBP-direction*r*sin;                  // y-Koordinate oben Mitte
  var x = xM-r*cos, y = yM-r*sin;                // Ecke oben links innen
  setPoint(jug,0,x,y);
  x -= d*cos; y -= d*sin;                        // Ecke oben links außen
  setPoint(jug,1,x,y);
  x -= (hPix+d)*sin; y += (hPix+d)*cos;          // Ecke unten links außen
  setPoint(jug,2,x,y);
  x += 2*(r+d)*cos; y += 2*(r+d)*sin;            // Ecke unten rechts außen
  setPoint(jug,3,x,y);
  x += (hPix+d)*sin; y -= (hPix+d)*cos;          // Ecke oben rechts außen
  setPoint(jug,4,x,y);
  x -= d*cos; y -= d*sin;                        // Ecke oben rechts innen
  setPoint(jug,5,x,y);
  x -= hPix*sin; y += hPix*cos;                  // Ecke unten rechts innen
  setPoint(jug,6,x,y);
  x -= 2*r*cos; y -= 2*r*sin;                    // Ecke unten links innen
  setPoint(jug,7,x,y); 
  fillPolygon(jug,"#000000");                    // Polygon für Kanne ausfüllen
  var a = 2*Math.sqrt(fPix*r/Math.abs(tan));     // Benetzter Teil des Kannenbodens (Pixel) 
  if (a > 2*r) {                                 // Falls geringe Neigung (viereckiger Querschnitt) ...
    var mx = xM-(hPix-fPix)*sin;                 // Mittelpunkt Flüssigkeitsspiegel (x-Koordinate) 
    var my = yM+(hPix-fPix)*cos;                 // Mittelpunkt Flüssigkeitsspiegel (y-Koordinate)
    x = mx-r*cos-r*tan*sin; y = my;              // Ecke links oben
    setPoint(liquid,0,x,y);                      
    takePoint(liquid,1,jug,7);                   // Ecke links unten (von Kanne übernommen)
    takePoint(liquid,2,jug,6);                   // Ecke rechts unten (von Kanne übernommen)
    x = mx+r*cos+r*tan*sin; y = my;              // Ecke rechts oben
    setPoint(liquid,3,x,y);    
    }
  else {                                         // Falls starke Neigung (dreieckiger Querschnitt) ...
    var b = Math.abs(a*tan);                     // Benetzter Teil der unteren Wand der Kanne (Pixel)
    takePoint(liquid,0,jug,alpha>0?6:7);         // Untere Ecke (von Kanne übernommen)
    takePoint(liquid,1,jug,alpha>0?6:7);         // Gleiche Ecke nochmal (wegen Arraydimension 4)
    x = liquid[0].x+b*sin;                       // Ecke an der unteren Kannenwand 
    y = liquid[0].y-b*cos;
    setPoint(liquid,2,x,y);
    x = liquid[0].x-(alpha>0 ? a : -a)*cos;      // Ecke am Kannenboden
    // Math.sign() funktioniert nicht bei allen Browsern. 
    y = liquid[0].y-a*Math.abs(sin);
    setPoint(liquid,3,x,y);
    } 
  fillPolygon(liquid,colorLiquid);               // Viereck oder Dreieck für Flüssigkeit ausfüllen 
  }
   
// Parabel für ausgegossene Flüssigkeit:

function outpour () {
  var xP0 = xBP, yP0 = yBP;                      // Anfangspunkt Kurvenstück (Bezugspunkt)
  newPath();                                     // Neuer Pfad 
  ctx.strokeStyle = colorLiquid;                 // Farbe
  var yMax = y0-d-1;                             // Maximaler y-Wert (wegen Kannenboden)
  for (var i=1; true; i++) {                     // Endlosschleife (Abbruch durch break)
    var xP1 = xBP+direction*i, yP1 = yBP+i*i;    // Endpunkt Kurvenstück
    if (yP1 > yMax) yP1 = yMax;                  // Nicht in den Kannenboden hineinzeichnen
    for (var k=0; k<3; k++) {                    // Um 0 bis 2 Pixel seitlich versetzt ...
      var dx = k*direction;                      // Betrag der seitlichen Versetzung (mit Vorzeichen)
      ctx.moveTo(xP0+dx,yP0);                    // Anfangspunkt Kurvenstück 
      ctx.lineTo(xP1+dx,yP1);                    // Endpunkt Kurvenstück
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
  ctx.fillRect(160,97,180,40);                   // Hintergrund ausfüllen
  ctx.fillStyle = colorCongratulation[(nr+1)%6]; // Textfarbe
  ctx.textAlign = "center";                      // Text zentrieren 
  ctx.fillText(text1,250,120);                   // Glückwunsch
  ctx.strokeStyle = "#000000";                   // Randfarbe schwarz 
  ctx.strokeRect(160,97,180,40);                 // Rand des Hintergrunds
  if (t > 12) {                                  // Falls mehr als 12 Sekunden vergangen ...
    ctx.fillStyle = colorLiquid;                 // Textfarbe
    ctx.textAlign = "left";                      // Text linksbündig
    ctx.fillText(text2,150,180);                 // Anweisung Neustart, 1. Zeile
    ctx.fillText(text3,150,200);                 // Anweisung Neustart, 2. Zeile
    }
  }
  
// Grafikausgabe:
  
function paint () {
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                // Hintergrund ausfüllen
  ctx.fillStyle = colorGround;                   // Farbe der Unterlage
  ctx.fillRect(50,y0,width-100,10);              // Unterlage
  ctx.strokeRect(50,y0,width-100,10);            // Rand für Unterlage
  if (on) t = (new Date()-t0)/1000;              // Aktuelle Zeit (s)
  if (on && !ready) calculationVar();            // Aktuelle Werte für Bewegung ausrechnen, falls nötig
  for (var i=0; i<3; i++) {                      // Für alle drei Kannen ...
    if (i != indexJug || indexTarget == -1)      // Falls Kanne nicht in Bewegung ...
      drawJugVertical(i);                        // Kanne in senkrechter Lage zeichnen
    else {                                       // Falls Kanne in Bewegung ...
      drawJug(i,direction*alpha);                // Kanne in geneigter Lage zeichnen
      if (t > dt1 && t < dt1+dt2)                // Falls Bewegungsphase 2 
        outpour();                               // Parabel für ausgegossene Flüssigkeit
      }
    } // Ende for-Schleife
  ctx.textAlign = "center";                      // Zentrierter Text
  ctx.font = font;                               // Zeichensatz
  ctx.fillStyle = colorLiquid;                   // Farbe der Flüssigkeit
  for (var i=0; i<3; i++)                        // Für alle drei Kannen ...
    writeValue(max,i,100+i*150,40);              // Fassungsvermögen angeben (oben)
  for (var i=0; i<3; i++) {                      // Für alle drei Kannen ...
    writeValue(fu,i,100+i*150,height-30);        // Aktuelle Füllmenge angeben (unten)
    if (fu[i] == 4 && t == 0)                    // Falls Kanne genau 4 Volumeneinheiten enthält ... 
      on = ready = true;                         // Spiel zu Ende 
    }
  if (ready) gratulation();                      // Glückwunsch
  }
  
document.addEventListener("DOMContentLoaded",start,false);


