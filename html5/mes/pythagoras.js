// Dynamische Zeichnung: Kathetensatz und Satz des Pythagoras
// Java-Applet (25.10.1997), umgewandelt in HTML5/Javascript
// 12.03.2014 - 27.11.2017

const r = 80;                                    // Radius
const yM = 220;                                  // y-Koordinate der Grundlinie

var canvas, ctx, xM, xA, xB, xC, yC, my, active; // Globale Variable

// Start-Methode (wird beim Laden der Seite aufgerufen):
	
function start () {
canvas = document.getElementById("cv");        // Zeichenfläche
xM = canvas.width/2;                           // x-Koordinate des Mittelpunkts M (fest)
xA = xM-r; xB = xM+r;                          // x-Koordinaten von A und B (fest)
my = 50*Math.PI/180;                           // Mittelpunktswinkel (Bogenmaß)
ctx = canvas.getContext("2d");                 // Grafik-Kontext
active = false;                                // Maustaste nicht gedrückt
paint();                                       // Zeichnen
    
canvas.onmousedown = function (e) {            // Reaktion auf Drücken der Maustaste
    active = (distance(e.clientX,e.clientY) <= 20);
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Berührung
    var obj = e.changedTouches[0];
    active = (distance(obj.clientX,obj.clientY) <= 20);
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    active = false;
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Berührung
    active = false;
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Bewegen der Maus
    if (!active) return;                         // Keine Reaktion, wenn Maustaste nicht gedrückt
    var x = e.clientX, y = e.clientY;            // Relative Koordinaten
    reactionMove(x,y);                           // Position korrigieren und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (!active) return;                         // Keine Reaktion nötig?
    var obj = e.changedTouches[0];
    var x = obj.clientX, y = obj.clientY;        // Relative Koordinaten
    reactionMove(x,y);                           // Position korrigieren und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }
      
  } // Ende der Methode start
  
// Abstand vom Punkt C:

function distance (x,y) {
  x = x-canvas.offsetLeft+window.pageXOffset;    // x-Koordinate in Bezug auf den linken Rand der Zeichenfläche
  y = y-canvas.offsetTop+window.pageYOffset;     // y-Koordinate in Bezug auf den oberen Rand der Zeichenfläche
  var dx = x-xC, dy = y-yC;
  return Math.sqrt(dx*dx+dy*dy);
  }
  
// Position korrigieren und neu zeichnen:
  
function reactionMove (x, y) {
  x = x-canvas.offsetLeft+window.pageXOffset;    // x-Koordinate in Bezug auf den linken Rand der Zeichenfläche
  y = y-canvas.offsetTop+window.pageYOffset;     // y-Koordinate in Bezug auf den oberen Rand der Zeichenfläche
  if (y > yM) y = yM;                            // Position unterhalb der Grundlinie verhindern
  my = Math.atan2(yM-y,x-xM);                    // Mittelpunktswinkel aktualisieren
  paint();                                       // Neu zeichnen
  }
  
// Zeichnen:
    
function paint () { 
xC = xM+r*Math.cos(my);                        // x-Koordinate von C
  yC = yM-r*Math.sin(my);                        // y-Koordinate von C
  ctx.strokeStyle = "rgb(0,0,0)";                // Linienfarbe schwarz
  // Hintergrund:
  ctx.fillStyle = "rgb(255,255,0)";              // Füllfarbe gelb
  ctx.fillRect(0,0,600,500);                     // Fläche füllen
  // Rechtwinkliges Dreieck:
  ctx.fillStyle = "rgb(0,255,0)";                // Füllfarbe grün
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(xA,yM);                             // Anfangspunkt A (links)
  ctx.lineTo(xB,yM);                             // Linie zum Punkt B (rechts)
  ctx.lineTo(xC,yC);                             // Linie zum Punkt C (oben)
  ctx.closePath();                               // Pfad schließen
  ctx.fill();                                    // Dreieck ausfüllen (grün)
  ctx.stroke();                                  // Rand zeichnen
  // Linkes Kathetenquadrat:
  ctx.fillStyle = "rgb(255,0,0)";                // Füllfarbe rot
  var dx = xC-xA, dy = yM-yC;                    // Hilfsvariable (Koordinatenunterschiede)
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(xA,yM);                             // Anfangspunkt A (links)
  ctx.lineTo(xC,yC);                             // Linie zum Punkt C (oben)
  ctx.lineTo(xC-dy,yC-dx);                       // Linie zur Ecke gegenüber von A
  ctx.lineTo(xC-dy-dx,yM-dx);                    // Linie zur Ecke gegenüber von C
  ctx.closePath();                               // Pfad schließen
  ctx.fill();                                    // Quadrat ausfüllen (rot)
  ctx.stroke();                                  // Rand zeichnen
  // Linkes Rechteck:
  ctx.fillRect(xA,yM,dx,2*r);                    // Rechteck ausfüllen (rot)
  ctx.strokeRect(xA,yM,dx,2*r);                  // Rand zeichnen
  // Rechtes Kathetenquadrat:
  ctx.fillStyle = "rgb(0,0,255)";                // Füllfarbe blau
  dx = xB-xC; dy = yM-yC;                        // Hilfsvariable (Koordinatenunterschiede)
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(xC,yC);                             // Anfangspunkt C (oben)
  ctx.lineTo(xB,yM);                             // Linie zum Punkt B (rechts)
  ctx.lineTo(xB+dy,yM-dx);                       // Linie zur Ecke gegenüber von C
  ctx.lineTo(xC+dy,yC-dx);                       // Linie zur Ecke gegenüber von B
  ctx.closePath();                               // Pfad schließen
  ctx.fill();                                    // Quadrat ausfüllen (blau)
  ctx.stroke();                                  // Rand zeichnen
  // Rechtes Rechteck:
  ctx.fillRect(xC,yM,dx,2*r);                    // Rechteck ausfüllen (blau)          
  ctx.strokeRect(xC,yM,dx,2*r);                  // Rand zeichnen
  // Thaleskreis:
  ctx.arc(xM,yM,r,0,Math.PI,true);               // Oberer Halbkreis um M mit Radius r
  ctx.stroke();                                  // Halbkreis zeichnen
  // Dreieckshöhe:
  // Verzicht auf gestrichelte Linien, da nicht von allen Browsern akzeptiert
  ctx.beginPath();                               // Neuer Pfad
  ctx.moveTo(xC,yC);                             // Anfangspunkt C (oben)
  ctx.lineTo(xC,yM);                             // Linie nach unten (Dreieckshöhe)
  ctx.stroke();                                  // Linie zeichnen
  // Ecke C markieren:
  ctx.beginPath();                               // Neuer Pfad
  ctx.fillStyle = "rgb(255,0,255)";              // Füllfarbe magenta
  ctx.arc(xC,yC,2,0,2*Math.PI,true);             // Kreis um Punkt C
  ctx.fill();                                    // Kreis ausfüllen (magenta)
  // Copyright-Bemerkung:
  ctx.fillStyle = "rgb(0,0,0)";                  // Füllfarbe scharz
  ctx.textAlign = "right";                       // Rechtsbündiger Text
  ctx.font = "normal normal bold 12px sans-serif";  // Zeichensatz
  ctx.fillText("W. Fendt  1997",canvas.width-20,canvas.height-20); // Grafiktext
  } // Ende der Methode paint
      
document.addEventListener("DOMContentLoaded",start,false);
