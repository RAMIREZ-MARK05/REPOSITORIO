// Thaleskreis
// Java-Applet (17.06.1998) umgewandelt
// 19.04.2014 - 20.04.2014

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Konstanten:

var colorBackground = "#ffff00";              // Hintergrundfarbe
var colorPoint = "#ff00ff";        // Farbe f�r beweglichen Punkt
var color1 = "#ff0000";            // Farbe f�r Basiswinkel links
var color2 = "#0000ff";           // Farbe f�r Basiswinkel rechts
var colorRight = "#00ff00";           // Farbe f�r rechten Winkel
var r = 200;                                     // Radius
var xM, yM;                                    // Mittelpunkt (M)
var canvas, ctx;                  // Zeichenfl�che, Grafikkontext
// Attribute:
var phi;               // Winkel BMC (B rechts, C oben, Bogenma�)
var xC, yC;   // Koordinaten von C (Scheitel des rechten Winkels)
var active;                                  // Flag f�r Zugmodus
// Start:

function start () {
canvas = document.getElementById("cv");        // Zeichenfl�che
ctx = canvas.getContext("2d");                 // Grafikkontext
xM = canvas.width/2; yM = 250;                 // Mittelpunkt
phi = 120*Math.PI/180;                 // alpha = 30�, beta = 60�
paint();                                       // Zeichnen
  
canvas.onmousedown=function(e){// ReaktionaufDr�ckenderMaustaste
reactionDown(e.clientX,e.clientY);//EventuellZugmodus aktivieren                     
}
canvas.ontouchstart = function (e) {    // Reaktion auf Ber�hrung
var obj = e.changedTouches[0];
reactionDown(obj.clientX,obj.clientY);//EventuellZugmodusaktivieren
if (active) e.preventDefault();//IndiesemFallStandardverhalten verhindern
    }
      
canvas.onmouseup=function(e){// Reaktion auf Loslassen der Maustaste
active = false;                          // Zugmodus deaktivieren                             
    }
    
canvas.ontouchend = function(e){// Reaktionauf Ende der Ber�hrung
active = false;                          // Zugmodus deaktivieren
    }
    
canvas.onmousemove = function (e) {//Reaktion auf Bewegen der Maus
if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
reactionMove(e.clientX,e.clientY);           // Position ermitteln und neu zeichnen
    }
    
canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
if (!active) return;                         // Abbrechen, falls Zugmodus nicht aktiviert
var obj = e.changedTouches[0];
reactionMove(obj.clientX,obj.clientY);       // Position ermitteln und neu zeichnen
e.preventDefault();                          // Standardverhalten verhindern                          
    }  } // Ende der Methode start
  
// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// Seiteneffekt active

function reactionDown (x, y) {
var re = canvas.getBoundingClientRect();       // Lage der Zeichenfl�che bez�glich Viewport
x -= re.left; y -= re.top;                     // Koordinaten bez�glich Zeichenfl�che
active = (distance(x,y) < 20);                 // Zugmodus, falls geringer Abstand zum Punkt C
}  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// Seiteneffekt phi, xC, yC

function reactionMove (x, y) {
var re = canvas.getBoundingClientRect();//Lage der Zeichenfl�che bez�glich Viewport
x -= re.left; y -= re.top; // Koordinaten bez�glich Zeichenfl�che
if (y > yM) phi = (x>=xM ? 0 : Math.PI);// Position unterhalb der Grundlinie?
else phi = Math.atan2(yM-y,x-xM);              // Normalfall     
paint();                                       // Neu zeichnen
  }
// Abstand zum Punkt C:
// x, y ... Aktuelle Position bez�glich Zeichenfl�che  
function distance (x, y) {
var dx = x-xC, dy = y-yC;               // Koordinatendifferenzen
return Math.sqrt(dx*dx+dy*dy);            // Abstand (Pythagoras)
  }
//-----------------------------------------------------------------------------  
// Neuer Pfad:

function newPath () {
ctx.beginPath();                               // Neuer Pfad
ctx.strokeStyle = "#000000";               // Linienfarbe schwarz
ctx.lineWidth = 1;                             // Liniendicke
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// x, y ... Scheitel
// r ...... Radius
// a0 ..... Startwinkel (Bogenma�)
// a ...... Winkelbetrag (Bogenma�)
// c ...... F�llfarbe 

function angle (x, y, r, a0, a, c) {
newPath();                                          // Neuer Pfad
ctx.fillStyle = c;                                  // F�llfarbe
ctx.moveTo(x,y);                                    // Scheitel als Anfangspunkt
ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));      // Linie auf dem ersten Schenkel
ctx.arc(x,y,r,2*Math.PI-a0,2*Math.PI-a0-a,true);    // Kreisbogen
ctx.closePath();                                    // Zur�ck zum Scheitel
ctx.fill(); ctx.stroke();                           // Kreissektor ausf�llen, Rand zeichnen
  }  
// Grafikausgabe:  
function paint () {
ctx.fillStyle = colorBackground;              // Hintergrundfarbe
ctx.fillRect(0,0,canvas.width,canvas.height);  // Hintergrund ausf�llen
newPath();                                     // Neuer Pfad
ctx.moveTo(xM-r,yM); ctx.lineTo(xM+r,yM);      // Hypotenuse [AB]
xC=xM+r*Math.cos(phi);//x-KoordinatevonC(ScheiteldesrechtenWinkels) 
yC=xM-r*Math.sin(phi);//y-KoordinatevonC(Scheiteldesrechten Winkels)
ctx.lineTo(xC,yC);                             // Kathete [BC]
ctx.closePath();        // Kathete [CA] (zur�ck zum Anfangspunkt)
ctx.stroke();                             // Dreieck ABC zeichnen
ctx.beginPath();                               // Neuer Pfad
ctx.arc(xM,yM,r,0,Math.PI,true);         // Halbkreis vorbereiten
ctx.stroke();                               // Halbkreis zeichnen
ctx.beginPath();                               // Neuer Pfad
ctx.fillStyle = colorPoint;// F�llfarbe f�r beweglichen Punkt (C)
ctx.arc(xC,yC,2,0,2*Math.PI,true);   // Kleinen Kreis vorbereiten
ctx.fill();                                    // Kreis zeichnen
var alpha = phi/2, beta = Math.PI/2-alpha;     // Innenwinkel
if (alpha <1e-3 || beta<1e-3) return;// Abbruch, falls Nullwinkel
angle(xM-r,yM,40,0,alpha,color1);         // Markierung f�r alpha
angle(xC,yC,40,Math.PI+alpha,alpha,color1);// Markierung f�r gleich gro�en Teilwinkel von gamma
angle(xM+r,yM,40,Math.PI-beta,beta,color2);// Markierung f�r beta
angle(xC,yC,40,Math.PI+phi,beta,color2);// Markierung f�r gleich gro�en Teilwinkel von gamma
angle(xC,yC,20,Math.PI+alpha,Math.PI/2,colorRight); // Markierung f�r rechten Winkel (gamma)
ctx.beginPath();                               // Neuer Pfad
ctx.moveTo(xM,yM); 
ctx.lineTo(xC,yC);//Linie[MC](Radius)vorbereiten
ctx.stroke();                              // Linie [MC] zeichnen
ctx.textAlign = "right";          // Textausrichtung rechtsb�ndig
ctx.font = "normal normal bold 12px sans-serif";  // Zeichensatz
ctx.fillStyle = "#000000";                   // F�llfarbe schwarz
ctx.fillText("W. Fendt 1998",canvas.width-20,canvas.height-20); // Autor
}  
document.addEventListener("DOMContentLoaded",start,false);
