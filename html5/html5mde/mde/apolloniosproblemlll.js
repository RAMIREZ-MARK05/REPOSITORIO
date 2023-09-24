// Apollonios-Problem LLL (drei Geraden)
// Java-Applet (27.12.2008) umgewandelt
// 01.03.2017 - 03.03.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel apolloniosproblemlll_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#000000";                                    // Farbe für gegebene Geraden
var color2 = "#ff0000";                                    // Farbe für Lösungskreise

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var cb;                                                    // Array von Optionsfeldern
var lb;                                                    // Array von Ausgabefeldern
var nr;                                                    // Nummer des ausgewählten Objekts (0 bis 6)
var g1, g2, g3;                                            // Gegebene Geraden

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 
  
// Einzelnes passives Optionsfeld vorbereiten:
// id ..... ID aus HTML-Datei
// cond ... Bedingung für Setzen des Häkchens
  
function initCheckbox (id, cond) {
  var cb = getElement(id);                                 // Optionsfeld
  cb.disabled = true;                                      // Optionsfeld deaktiviert
  cb.checked = cond;                                       // Gegebenenfalls Häkchen setzen
  }
  
// Zeile der Schaltfläche vorbereiten:
// i ... Index (0 bis 7)
  
function initLine (i) {
  getElement("lb"+(i+1),text03[i]);                        // Erklärender Text (Lösungstyp ...)
  var n = "cb"+(i+1);                                      // ID Optionsfeld
  cb[i] = getElement(n);                                   // Aktives Optionsfeld (Lösungstyp)
  cb[i].checked = false;                                   // Optionsfeld zunächst nicht ausgewählt
  cb[i].onclick = paint;                                   // Bei Mausklick neu zeichnen
  initCheckbox(n+"1",i>=4);                                // Passives Optionsfeld (1. Kreis)
  initCheckbox(n+"2",i%4>=2);                              // Passives Optionsfeld (2. Kreis)
  initCheckbox(n+"3",i%2==1);                              // Passives Optionsfeld (Halbebene)
  lb[i] = getElement("lb"+(i+1)+"n");                      // Ausgabefeld (Anzahl Lösungskreise)
  }

// Start:

function start () {
  nr = 0;                                                  // Zunächst nicht ausgewählt
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("text1",text01);                              // Erklärender Text (Auswahl Lösungskreise)
  getElement("text2a",text02[0]);                          // Erklärender Text (Bedeutung der Häkchen)
  getElement("text2b",text02[1]);                          // Erklärender Text (Bedeutung der Häkchen)
  getElement("text2c",text02[2]);                          // Erklärender Text (Bedeutung der Häkchen)
  getElement("text2d",text02[3]);                          // Erklärender Text (Bedeutung der Häkchen)
  cb = new Array(8);                                       // Array von Optionsfeldern (Lösungstypen)
  lb = new Array(8);                                       // Array von Ausgabefeldern (Anzahl Lösungskreise)
  for (var i=0; i<8; i++) initLine(i);                     // Zeilen für Lösungstypen vorbereiten
  getElement("text4",text04);                              // Erklärender Text (Zahl der Lösungen)
  g1 = {x1: 20, y1: 300, x2: 400, y2: 140};                // 1. gegebene Gerade 
  g2 = {x1: 20, y1: 120, x2: 400, y2: 250};                // 2. gegebene Gerade 
  g3 = {x1: 100, y1: 500, x2: 150, y2: 0};                 // 3. gegebene Gerade
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
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
  
// Abstand von einem gegebenen Punkt:
// (u,v) ..... Aktuelle Position (Pixel)
// (u0,v0) ... Gegebener Punkt
  
function distancePoint (u, v, u0, v0) {
  var dx = u-u0, dy = v-v0;                                // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert
  }
  
 // Abstand von einer gegebenen Geraden:
 // (u,v) ... Aktuelle Position (Pixel)
 // g ....... Gegebene Gerade
 
 function distanceLine (u, v, g) {
   var ux = g.x2-g.x1, uy = g.y2-g.y1;                     // Richtungsvektor
   var vx = u-g.x1, vy = v-g.y1;                           // Verbindungsvektor 
   var h1 = vx*vx+vy*vy;                                   // Hilfsgröße (Quadrat Verbindungsvektor)
   var h2 = vx*ux+vy*uy;                                   // Hilfsgröße (Skalarprodukt)
   return Math.sqrt(h1-h2*h2/(ux*ux+uy*uy));               // Rückgabewert   
   } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)  
  var d = distanceLine(u,v,g1);                            // Abstand von Gerade 1
  var dMin = d;                                            // Vorläufiges Abstandsminimum
  var d1 = distancePoint(u,v,g1.x1,g1.y1);                 // Abstand zum ersten Bestimmungspunkt der Geraden
  var d2 = distancePoint(u,v,g1.x2,g1.y2);                 // Abstand zum zweiten Bestimmungspunkt der Geraden
  var n = (d1<d2 ? 1 : 2);                                 // Nummer aktualisieren
  d = distanceLine(u,v,g2);                                // Abstand von Gerade 2
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    d1 = distancePoint(u,v,g2.x1,g2.y1);                   // Abstand zum ersten Bestimmungspunkt der Geraden
    d2 = distancePoint(u,v,g2.x2,g2.y2);                   // Abstand zum zweiten Bestimmungspunkt der Geraden
    n = (d1<d2 ? 3 : 4);                                   // Nummer aktualisieren
    }
  d = distanceLine(u,v,g3);                                // Abstand von Gerade 3
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    d1 = distancePoint(u,v,g3.x1,g3.y1);                   // Abstand zum ersten Bestimmungspunkt der Geraden
    d2 = distancePoint(u,v,g3.x2,g3.y2);                   // Abstand zum zweiten Bestimmungspunkt der Geraden
    n = (d1<d2 ? 5 : 6);                                   // Nummer aktualisieren
    }
  nr = (dMin<20 ? n : 0);                                  // Falls geringer Abstand, Nummer übernehmen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// u, v ... Bildschirmkoordinaten bezüglich Viewport

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  if (nr == 0) return;                                     // Gegebenenfalls abbrechen
  if (nr == 1) {g1.x1 = u; g1.y1 = v;}                     // Ersten Punkt von Gerade 1 anpassen
  if (nr == 2) {g1.x2 = u; g1.y2 = v;}                     // Zweiten Punkt von Gerade 1 anpassen
  if (nr == 3) {g2.x1 = u; g2.y1 = v;}                     // Ersten Punkt von Gerade 2 anpassen
  if (nr == 4) {g2.x2 = u; g2.y2 = v;}                     // Zweiten Punkt von Gerade 2 anpassen
  if (nr == 5) {g3.x1 = u; g3.y1 = v;}                     // Ersten Punkt von Gerade 3 anpassen
  if (nr == 6) {g3.x2 = u; g3.y2 = v;}                     // Zweiten Punkt von Gerade 3 anpassen
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------
  
// Koeffizienten einer linearen Gleichung für x, y, r aus Abstandsbedingung:
// g ... Gerade
// s ... Vorzeichenfaktor (entsprechend Halbebene)
// Rückgabewert r: Array mit den Koeffizienten der linearen Gleichung:
// r[1] * x + r[2] * y + r[3] *  r = r[0]  
  
function coeffLinEquPar (g, s) {
  var dx = g.x2-g.x1, dy = g.y2-g.y1;                      // Richtungsvektor
  var r0 = dy*g.x1-dx*g.y1;                                // Inhomogener Teil
  var r1 = dy;                                             // Koeffizient von x
  var r2 = -dx;                                            // Koeffizient von y
  var r3 = -s*Math.sqrt(dx*dx+dy*dy);                      // Koeffizient von r
  return [r0,r1,r2,r3];                                    // Rückgabewert
  }
  
// Lösungskreis eines bestimmten Lösungstyps:
// s1, s2, s3 ... Vorzeichenfaktoren bezüglich Geraden (Halbebenen)
// Rückgabewert: Lösungskreis bzw. undefined

function solution (s1, s2, s3) {
  // Lineares Gleichungssystem für x, y, r:
  // a11*x + a12*y + a13*r = b1
  // a21*x + a22*y + a23*r = b2
  // a31*x + a32*y + a33*r = b3
  var lin = new Array(3);                                  // Neues Array
  lin[0] = coeffLinEquPar(g1,s1);                          // Koeffizienten der ersten linearen Gleichung
  lin[1] = coeffLinEquPar(g2,s2);                          // Koeffizienten der zweiten linearen Gleichung
  lin[2] = coeffLinEquPar(g3,s3);                          // Koeffizienten der dritten linearen Gleichung
  // Determinante Nenner (Cramersche Regel):
  var det0 = lin[0][1]*lin[1][2]*lin[2][3] + lin[0][2]*lin[1][3]*lin[2][1] + lin[0][3]*lin[1][1]*lin[2][2]
           - lin[2][1]*lin[1][2]*lin[0][3] - lin[2][2]*lin[1][3]*lin[0][1] - lin[2][3]*lin[1][1]*lin[0][2]; 
  if (det0 == 0) return undefined;                         // Rückgabewert für Nenner 0
  // Determinante Zähler für x:
  var detX = lin[0][0]*lin[1][2]*lin[2][3] + lin[0][2]*lin[1][3]*lin[2][0] + lin[0][3]*lin[1][0]*lin[2][2]
           - lin[2][0]*lin[1][2]*lin[0][3] - lin[2][2]*lin[1][3]*lin[0][0] - lin[2][3]*lin[1][0]*lin[0][2]; 
  // Determinante Zähler für y:
  var detY = lin[0][1]*lin[1][0]*lin[2][3] + lin[0][0]*lin[1][3]*lin[2][1] + lin[0][3]*lin[1][1]*lin[2][0]
           - lin[2][1]*lin[1][0]*lin[0][3] - lin[2][0]*lin[1][3]*lin[0][1] - lin[2][3]*lin[1][1]*lin[0][0]; 
  // Determinante Zähler für r:
  var detR = lin[0][1]*lin[1][2]*lin[2][0] + lin[0][2]*lin[1][0]*lin[2][1] + lin[0][0]*lin[1][1]*lin[2][2]
           - lin[2][1]*lin[1][2]*lin[0][0] - lin[2][2]*lin[1][0]*lin[0][1] - lin[2][0]*lin[1][1]*lin[0][2];
  var xs = detX/det0, ys = detY/det0, rs = detR/det0;      // Löungstripel (Cramersche Regel)
  if (rs > 0) return {x: xs, y: ys, r: rs};                // Rückgabewert im Normalfall
  else return undefined;                                   // Rückgabewert, falls Radius negativ oder 0
  }
  
// Zahl der Lösungskreise eines gegebenen Typs:
// cs ... Lösungskreis oder undefined)
  
function numberCircles (cs) {
  return (cs ? 1 : 0);                                      // Rückgabewert (0 oder 1)
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad (Standardwerte):
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Kreis zeichnen (kleiner Radius):
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// c ......... Farbe

function circle1 (xM, yM, r, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(xM,yM,r,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen 
  }
  
// Hilfsroutine: Linker oder rechter Teil eines Kreises mit großem Radius (x als Funktion von y)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 für links, +1 für rechts)
// c ......... Farbe

function circle2x (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgrößen (abhängig vom Radius)
  var y0 = Math.max(Math.floor(yM-r1),0);                  // Minimum y-Koordinate   
  var y1 = Math.min(Math.ceil(yM+r1),height);              // Maximum y-Koordinate
  newPath(c);                                              // Neuer Grafikpfad für linken Viertelkreis oder Teil davon
  yy = y0;                                                 // Aktuelle y-Koordinate
  var dy = yy-yM;                                          // Koordinatendifferenz senkrecht
  xx = xM+sgn*Math.sqrt(r2-dy*dy);                         // Aktuelle x-Koordinate
  ctx.moveTo(xx,yy);                                       // Anfangspunkt
  while (yy < y1) {                                        // Solange unterer Rand noch nicht erreicht ...
    yy++;                                                  // Aktuelle y-Koordinate
    dy = yy-yM;                                            // Koordinatendifferenz senkrecht
    xx = xM+sgn*Math.sqrt(r2-dy*dy);                       // Aktuelle x-Koordinate
    if (xx >= 0 && xx <= width) ctx.lineTo(xx,yy);         // Entweder Linie vorbereiten ...
    else ctx.moveTo(xx,yy);                                // ... oder neuer Anfangspunkt
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Hilfsroutine: Oberer oder unterer Teil eines Kreises mit großem Radius (y als Funktion von x)
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// sgn ....... Vorzeichenfaktor (-1 für oben, +1 für unten)
// c ......... Farbe

function circle2y (xM, yM, r, sgn, c) {
  var r1 = r/Math.sqrt(2), r2 = r*r;                       // Hilfsgrößen (abhängig vom Radius)
  var x0 = Math.max(Math.floor(xM-r1),0);                  // Minimum x-Koordinate
  var x1 = Math.min(Math.ceil(xM+r1),width);               // Maximum x-Koordinate
  newPath(c);                                              // Neuer Grafikpfad für unteren Viertelkreis oder Teil davon
  var xx = x0;                                             // Aktuelle x-Koordinate
  var dx = xx-xM;                                          // Koordinatendifferenz waagrecht
  var yy = yM+sgn*Math.sqrt(r2-dx*dx);                     // Aktuelle y-Koordinate
  ctx.moveTo(xx,yy);                                       // Anfangspunkt                                   
  while (xx < x1) {                                        // Solange rechter Rand noch nicht erreicht ...
    xx++;                                                  // Aktuelle x-Koordinate
    dx = xx-xM;                                            // Koordinatendifferenz waagrecht
    yy = yM+sgn*Math.sqrt(r2-dx*dx);                       // Aktuelle y-Koordinate                           
    if (yy >= 0 && yy <= height) ctx.lineTo(xx,yy);        // Entweder Linie vorbereiten ...
    else ctx.moveTo(xx,yy);                                // ... oder neuer Anfangspunkt
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Kreis zeichnen (großer Radius):
// (xM,yM) ... Mittelpunkt
// r ......... Radius
// c ......... Farbe

function circle2 (xM, yM, r, c) {
  circle2x(xM,yM,r,-1,c);                                  // Linker Teil des Kreises
  circle2x(xM,yM,r,1,c);                                   // Rechter Teil des Kreises
  circle2y(xM,yM,r,-1,c);                                  // Oberer Teil des Kreises
  circle2y(xM,yM,r,1,c);                                   // Unterer Teil des Kreises
  }
  
// Kreis zeichnen:
// k ... Kreis
// m ... Flag für Mittelpunktsmarkierung
// c ... Farbe (Kreislinie, Mittelpunkt) 
  
function drawCircle (k, m, c) {
  if (!k) return;                                          // Falls Kreis nicht definiert, abbrechen
  if (k.r < 1000) circle1(k.x,k.y,k.r,c);                  // Entweder Kreis mit kleinem Radius
  else circle2(k.x,k.y,k.r,c);                             // ... oder Kreis mit großem Radius
  if (m) drawPoint(k.x,k.y,c);                             // Falls gewünscht, Mittelpunkt einzeichnen
  }
  
// Text mit Index (schwarz):
// t ....... Text ('_' als Trennzeichen zwischen normalem Text und Index)
// (x,y) ... Position
// left .... Flag für Linksverschiebung

function textIndex (t, x, y, left) {
  var i = t.indexOf("_");                                  // Index Unterstrich oder -1
  var t1 = (i>=0 ? t.substring(0,i) : t);                  // Text ohne Index
  var t2 = (i>=0 ? t.substring(i+1) : "");                 // Index
  var l1 = ctx.measureText(t1).width;                      // Länge des normalen Textes (Pixel)
  if (left) x -= l1+ctx.measureText(t2).width;             // Falls gewünscht, nach links verschieben
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(t1,x,y);                                    // Normaler Text
  ctx.fillText(t2,x+l1,y+4);                               // Index
  }
  
// Gerade beschriften:
// g ... Gerade
// n ... Bezeichnung

function nameLine (g, n) {
  var nx = g.y2-g.y1, ny = g.x1-g.x2;                      // Normalenvektor
  var n0 = nx*g.x1+ny*g.y1;                                // Konstanter Summand
  var flat = (Math.abs(ny) > Math.abs(nx));                // Überprüfung, ob Gerade eher waagrecht
  var x = (flat ? 20 : (n0-ny*20)/nx+10);                  // x-Koordinate
  var y = (flat ? (n0-nx*20)/ny+10 : 20);                  // y-Koordinate
  textIndex(n,x,y,false);                                  // Beschriftung
  }
  
// Gerade zeichnen:
// g ... Gerade
// c ... Farbe
// n ... Bezeichnung (optional)
  
function drawLine (g, c, n) {
  if (!g || g.x1 == g.x2 && g.y1 == g.y2) return;          // Falls Gerade nicht definiert, abbrechen
  newPath(c);                                              // Neuer Grafikpfad
  var dx = g.x2-g.x1, dy = g.y2-g.y1;                      // Richtungsvektor
  var d = Math.sqrt(dx*dx+dy*dy);                          // Betrag des Richtungsvektors
  var f = 1000/d;                                          // Faktor
  ctx.moveTo(g.x1-f*dx,g.y1-f*dy);                         // Anfangspunkt (außerhalb des sichtbaren Bereichs)
  ctx.lineTo(g.x2+f*dx,g.y2+f*dy);                         // Endpunkt (außerhalb des sichtbaren Bereichs)
  ctx.stroke();                                            // Gerade zeichnen
  if (n) nameLine(g,n);                                    // Falls gewünscht, Gerade beschriften
  }
  
// Punkt zeichnen:
// (x,y) ... Koordinaten
// c ....... Farbe

function drawPoint (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fillStyle = c; ctx.fill();                           // Ausgefüllter Kreis
  }
  
// Lösungskreise eines gegebenen Typs zeichnen:
// i ... Index Lösungstyp (0 bis 7)
// Rückgabewert: Zahl der Lösungen des gegebenen Typs
// Die Zahl der Lösungen für die einzelnen Typen wird in der Schaltfläche aktualisiert.
  
function drawSolutions (i) {
  var s1 = (i<4 ? +1 : -1);                                // Vorzeichenfaktor 1. Gerade
  var s2 = (i%4<2 ? +1 : -1);                              // Vorzeichenfaktor 2. Gerade
  var s3 = (i%2==0 ? +1 : -1);                             // Vorzeichenfaktor 3. Gerade 
  var cs = solution(s1,s2,s3);                             // Lösungskreis
  var vis = cb[i].checked;                                 // Flag für Zeichnen
  if (vis && cs) drawCircle(cs,false,color2);              // Gegebenenfalls Lösungskreis zeichnen
  var n = numberCircles(cs);                               // Zahl der Lösungen
  lb[i].innerHTML = ""+n;                                  // Lösungszahl in der Schaltfläche aktualisieren
  return n;                                                // Rückgabewert
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  drawLine(g1,color1,nameLine1);                           // Erste gegebene Gerade
  drawLine(g2,color1,nameLine2);                           // Zweite gegebene Gerade 
  drawLine(g3,color1,nameLine3);                           // Dritte gegebene Gerade                          
  var sum = 0;                                             // Variable für Gesamtzahl der Lösungen
  for (var i=0; i<8; i++) sum += drawSolutions(i);         // Lösungskreise der einzelnen Lösungstypen
  getElement("lbn").innerHTML = ""+sum;                    // Ausgabe der Gesamtzahl der Lösungen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

