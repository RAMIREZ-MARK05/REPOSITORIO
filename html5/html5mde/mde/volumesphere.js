// Dynamische Zeichnung: Volumen einer Halbkugel, Prinzip von Cavalieri
// Java-Applet (04.09.2000) umgewandelt
// 02.04.2014 - 06.04.2014

var colorBG = "#ffff00";                         // Hintergrundfarbe
var color1 = "#00ff00";                          // Farbe für Schnittfläche der Halbkugel
var color2 = "#ffc000";                          // Farbe für Schnittfläche des Vergleichskörpers
var colorH = "#ff00ff";                          // Farbe für Abstand Grundfläche/Schnittfläche (h)
var colorR = "#0000ff";                          // Farbe für Kugelradius (r)
var colorS = "#000000";                          // Farbe für Schnittflächenradius (s)

var r = 80;                                      // Kugelradius
var x1 = 120;                                    // x-Koordinate des Mittelpunkts (links)
var x2 = 360;                                    // x-Koordinate des Mittelpunkts (rechts)             
var y1 = 120;                                    // y-Koordinate der Mittelpunkte (oben)
var y2 = 260;                                    // y-Koordinate der Mittelpunkte (unten)
var theta = 20*Math.PI/180;                      // Blickrichtung (Winkel gegenüber der Waagrechten)
var sin = Math.sin(theta);                       // Sinuswert
var cos = Math.cos(theta);                       // Kosinuswert
var rSin = r*sin, rCos = r*cos;                  // Abkürzungen

var canvas, ctx;                                 // Zeichenfläche, Grafikkontext
var h;                                           // Abstand Grundfläche/Schnittfläche
var s;                                           // Radius der Schnittfläche (Halbkugel)
var sSin;                                        // Abkürzung für s*sin(theta)
var hSin, hCos;                                  // Abkürzung für h*sin(theta) bzw. h*cos(theta)
var active;                                      // Flag für Verschiebung mit Maus oder Finger

// Start:

function start () {
  canvas = document.getElementById("cv");        // Zeichenfläche
  ctx = canvas.getContext("2d");                 // Grafikkontext
  h = r/2;                                       // Abstand Grundfläche/Schnittfläche 
  calculation();                                 // Berechnungen
  active = false;                                // Flag für Verschiebung mit Maus oder Finger
  paint();                                       // Zeichnen
  
  canvas.onmousedown = function (e) {            // Reaktion auf Drücken der Maustaste
    reactionDown(e.clientY);
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Berührung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientY);
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    active = false;
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Berührung
    active = false;
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Ziehen mit der Maus
    if (!active) return;
    reactionMove(e.clientY);
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (!active) return;                   
    var obj = e.changedTouches[0];
    reactionMove(obj.clientY);                   // Position ermitteln und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }
    
  }
  
function reactionDown (y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  y -= re.top;                                   // y-Koordinate bezüglich Zeichenfläche
  if (y >= y1-rCos && y <= y1) active = true;    // Flag setzen, falls y-Koordinate im richtigen Bereich
  }
  
function reactionMove (y) {
  var re = canvas.getBoundingClientRect();        // Lage der Zeichenfläche bezüglich Viewport
  y -= re.top;                                    // y-Koordinate bezüglich Zeichenfläche
  y = Math.max(y,y1-rCos);                        // Tiefstwert nicht unterschreiten
  y = Math.min(y,y1);                             // Höchstwert nicht überschreiten                             
  h = (y1-y)/cos;                                 // Abstand Grundfläche/Schnittfläche
  h = Math.min(h,r);                              // Höchstwert nicht überschreiten
  calculation();                                  // Berechnungen 
  paint();                                        // Neu zeichnen
  }
  
// Berechnungen:
// Seiteneffekt s, sSin, hSin, hCos

function calculation () {
  s = Math.sqrt(r*r-h*h);                        // Radius der Schnittfläche (Halbkugel)
  sSin = s*sin;                                  // Abkürzung
  hSin = h*sin; hCos = h*cos;                    // Abkürzungen
  }
  
// Punkt markieren:
// x, y ... Position
// c ...... Farbe (optional)
  
function drawPoint (x, y, c) {
  if (c) ctx.fillStyle = c;                      // Gegebenenfalls Füllfarbe ändern
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(x,y,2,0,2*Math.PI,false);              // Kleiner Kreis
  ctx.fill();                                    // Kreis füllen
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// c ........ Farbe (optional)
  
function line (x1, y1, x2, y2, w, c) {
  if (c) ctx.strokeStyle = c;                    // Linienfarbe ändern, falls definiert
  if (w) ctx.lineWidth = w;                      // Liniendicke ändern, falls definiert
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(x1,y1);                             // Anfangspunkt
  ctx.lineTo(x2,y2);                             // Weiter zum Endpunkt
  ctx.stroke();                                  // Linie zeichnen
  }
  
// Dicke Linie mit Beschriftung zeichnen:

function thickLine (x1, y1, x2, y2, t, c) {
  line(x1,y1,x2,y2,2,c);                         // Linie mit Dicke 2
  var dx = y1-y2; dy = x2-x1;
  var len = Math.sqrt(dx*dx+dy*dy);
  if (len == 0) return;
  dx *= 6/len; dy *= 6/len;
  ctx.textAlign = "center";                       // Rechtsbündiger Text
  ctx.font = "normal normal bold 12px sans-serif";  // Zeichensatz
  ctx.fillStyle = c;
  ctx.fillText(t,(x1+x2)/2+dx,(y1+y2)/2+dy+4);    
  }
  
// Kreis oder Kreisbogen zeichnen:
// x, y ... Koordinaten des Mittelpunkts
// r ...... Radius
// q ...... Bruchteil (optional)
  
function circle (x, y, r, q) {
  if (!q) q = 1;                                 // Kompletter Kreis, falls Bruchteil nicht definiert
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.lineWidth = 1;                             // Liniendicke
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(x,y,r,0,q*2*Math.PI,true);             // Kreis(-bogen) vorbereiten
  ctx.stroke();                                  // Kreis(-bogen) zeichnen
  }
  
// Ellipse zeichnen:
// x, y ... Koordinaten des Mittelpunkts
// a, b ... Halbachsen waagrecht/senkrecht
// c ...... Füllfarbe (optional)
  
function ellipse (x, y, a, b, c) {
  if (a <= 0 || b <= 0) return;                  // Halbachsen müssen positiv sein
  if (c) ctx.fillStyle = c;                      // Füllfarbe ändern, falls definiert
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.lineWidth = 1;                             // Liniendicke
  ctx.save();                                    // Grafikkontext speichern
  ctx.beginPath();                               // Neuer Pfad
  ctx.translate(x,y);                            // Ellipsenmittelpunkt als Ursprung des Koordinatensystems                       
  ctx.scale(a,b);                                // Skalierung in x- und y-Richtung
  ctx.arc(0,0,1,0,2*Math.PI,false);              // Einheitskreis (wird durch Skalierung zur Ellipse)
  ctx.restore();                                 // Früheren Grafikkontext wiederherstellen
  if (c) ctx.fill();                             // Ellipse füllen, falls Füllfarbe definiert
  ctx.stroke();                                  // Rand zeichnen
  }
  
// Halbkugel mit Schnittfläche (links oben):
  
function body1 () {
  ellipse(x1,y1-hCos,s,sSin,color1);             // Schnittfläche
  ellipse(x1,y1,r,rSin);                         // Grundfläche der Halbkugel
  thickLine(x1,y1,x1,y1-hCos,"h",colorH);        // Abstand Grundfläche/Schnittfläche (senkrecht)
  thickLine(x1,y1,x1+r,y1,"r",colorR);           // Kugelradius (waagrecht)
  thickLine(x1,y1,x1+s,y1-hCos,"r",colorR);      // Kugelradius (schräg nach oben)
  thickLine(x1,y1-hCos,x1+s,y1-hCos,"s",colorS); // Radius des Schnittkreises
  circle(x1,y1,r,0.5);                           // Rand der Halbkugel zeichnen
  drawPoint(x1,y1,"#000000");                    // Mittelpunkt der Grundfläche
  drawPoint(x1,y1-hCos,"#ff0000");               // Mittelpunkt des Schnittkreises
  }
  
// Schnittfläche der Halbkugel (links unten):
  
function area1 () {
  ellipse(x1,y2,s,s,color1);                     // Schnittfläche
  thickLine(x1,y2,x1+r,y2,"r",colorR);           // Kugelradius (waagrecht)
  thickLine(x1,y2,x1,y2-s,"s",colorS);           // Radius des Schnittkreises (senkrecht)
  ctx.lineWidth = 1;                             // Liniendicke wieder normal
  circle(x1,y2,r);                               // Rand der Kugel
  drawPoint(x1,y2,"#000000");                    // Mittelpunkt
  }
  
// Vergleichskörper (rechts oben):

function body2 () {
  ellipse(x2,y1-hCos,r,rSin,color2);             // Schnittfläche (Kreisring)
  ellipse(x2,y1-hCos,h,hSin,colorBG);            // Innerer Teil des Kreisrings
  ellipse(x2,y1,r,rSin);                         // Grundfläche
  ellipse(x2,y1-rCos,r,rSin);                    // Deckfläche
  line(x2-r,y1,x2-r,y1-rCos);                    // Linker Rand
  line(x2+r,y1,x2+r,y1-rCos);                    // Rechter Rand
  drawPoint(x2,y1,"#000000");                    // Mittelpunkt der Grundfläche
  drawPoint(x2,y1-rCos);                         // Mittelpunkt der Deckfläche
  thickLine(x2,y1,x2,y1-hCos,"h",colorH);        // Abstand Grundfläche/Schnittfläche (senkrecht)
  thickLine(x2,y1-hCos,x2+h,y1-hCos,"h",colorH); // Innenradius der Schnittfläche (waagrecht)
  thickLine(x2,y1,x2+r,y1,"r",colorR);           // Radius des Zylinders (waagrecht)
  thickLine(x2+r,y1,x2+r,y1-rCos,"r",colorR);    // Höhe des Zylinders (senkrecht)
  var xB = x2+r*Math.sqrt(rCos*rCos-rSin*rSin)/rCos;  // x-Koordinate des Berührpunkts
  var yB = y1-rCos+rSin*rSin/rCos;               // y-Koordinate des Berührpunkts
  line(x2,y1,xB,yB,1,"#000000");                 // Kegel-Mantellinie rechts
  line(x2,y1,2*x2-xB,yB);                        // Kegel-Mantellinie links
  drawPoint(x2,y1-hCos,"#ff0000");               // Mittelpunkt der Schnittfläche
  }
  
// Schnittfläche des Vergleichskörpers (rechts unten):

function area2 () {
  ellipse(x2,y2,r,r,color2);                     // Kreisring außen
  ellipse(x2,y2,h,h,colorBG);                    // Kreisring innen
  thickLine(x2,y2,x2+r,y2,"r",colorR);           // Außenradius (waagrecht)
  thickLine(x2,y2,x2,y2-h,"h",colorH);           // Innenradius (h, senkrecht)
  drawPoint(x2,y2,"#000000");                    // Mittelpunkt
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBG;                       // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);  // Hintergrund ausfüllen
  body1();                                       // Halbkugel mit Schnittfläche (links oben)
  area1();                                       // Schnittfläche der Halbkugel (links unten)
  body2();                                       // Vergleichskörper mit Schnittfläche (rechts oben) 
  area2();                                       // Schnittfläche des Vergleichskörpers (rechts unten)
  ctx.fillStyle = "#000000";                     // Füllfarbe scharz
  ctx.textAlign = "right";                       // Rechtsbündiger Text
  ctx.font = "normal normal bold 12px sans-serif";    // Zeichensatz
  ctx.fillText("W. Fendt  2000",canvas.width-20,canvas.height-20);   // Autorenangabe
  }
  
document.addEventListener("DOMContentLoaded",start,false);

