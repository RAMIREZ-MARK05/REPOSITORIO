// Winkelfunktionen am Einheitskreis
// Java-Applet (25.12.1997) umgewandelt
// 13.04.2014 - 19.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel sincostan_de.js) abgespeichert.

// Konstanten:

var colorBackground = "#ffff00";                 // Hintergrundfarbe
var colorArc = "#ff00ff";                        // Farbe f�r Kreisbogen
var colorSine = "#008020";                       // Farbe f�r Sinus
var colorCosine = "#ff0000";                     // Farbe f�r Cosinus
var colorTangent = "#0000ff";                    // Farbe f�r Tangens
var colorPoint = "#000000";                      // Farbe f�r beweglichen Punkt

var PI2 = 2*Math.PI;                             // Abk�rzung f�r 2 pi
var r = 50;                                      // Kreisradius (Pixel)
var uM = 100, vM;                                // Bildschirmkoordinaten des Kreismittelpunkts (Pixel)
var uCS = 220;                                   // x-Koordinate f�r Ursprung des Koordinatensystems
var delta = 0.4;                                 // Winkel im Bogenma� (delta*r sollte ganzzahlig sein!)
var uMin = uCS-delta*r;                          // Minimaler u-Wert (Pixel, entsprechend x = -delta)
var uMax = uCS+(PI2+delta)*r;                    // Maximaler u-Wert (Pixel, entsprechend x = 2 pi + delta)
var canvas, ctx;                                 // Zeichenfl�che, Grafikkontext
var rb1, rb2, rb3;                               // Radiobuttons

// Attribute:

var drag;                                        // Flag f�r Zugmodus
var alpha;                                       // Aktueller Winkel (Bogenma�)

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
  rb1 = getElement("rb1");                                 // Radiobutton 1 (Sinus)
  getElement("lb1",text01);                                // Erkl�render Text (Sinus)
  rb1.checked = true;                                      // Sinus ausgew�hlt
  rb2 = getElement("rb2");                                 // Radiobutton 2 (Cosinus)
  rb2.checked = false;                                     // Cosinus nicht ausgew�hlt
  getElement("lb2",text02);                                // Erkl�render Text (Cosinus)
  rb3 = getElement("rb3");                                 // Radiobutton 3 (Tangens)
  rb3.checked = false;                                     // Tangens nicht ausgew�hlt
  getElement("lb3",text03);                                // Erkl�render Text (Tangens)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  vM = canvas.height/2;                                    // Senkrechte Bildschirmkoordinate des Ursprung
  alpha = Math.PI/6;                                       // Aktueller Winkel (Bogenma�)
  paint();                                                 // Zeichnen
  
  rb1.onclick = paint;                           // Reaktion auf Radiobutton 1 (Sinus)
  rb2.onclick = paint;                           // Reaktion auf Radiobutton 2 (Cosinus)
  rb3.onclick = paint;                           // Reaktion auf Radiobutton 3 (Tangens)
  
  canvas.onmousedown = function (e) {            // Reaktion auf Dr�cken der Maustaste
    reactionDown(e.clientX,e.clientY);           
    }
    
  canvas.ontouchstart = function (e) {           // Reaktion auf Ber�hrung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);       
    }
      
  canvas.onmouseup = function (e) {              // Reaktion auf Loslassen der Maustaste
    drag = false;                             
    }
    
  canvas.ontouchend = function (e) {             // Reaktion auf Ende der Ber�hrung
    drag = false;
    }
    
  canvas.onmousemove = function (e) {            // Reaktion auf Bewegen der Maus
    if (!drag) return;                           // Abbrechen, falls Zugmodus nicht aktiviert
    reactionMove(e.clientX,e.clientY);           // Position ermitteln und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {            // Reaktion auf Bewegung mit Finger
    if (!drag) return;                           // Abbrechen, falls Zugmodus nicht aktiviert
    var obj = e.changedTouches[0];
    reactionMove(obj.clientX,obj.clientY);       // Position ermitteln und neu zeichnen
    e.preventDefault();                          // Standardverhalten verhindern                          
    }  
  
  } // Ende der Methode start
  
// Abstand zum Punkt auf dem Einheitskreis:
// u, v ... Position bez�glich Zeichenfl�che (Pixel)

function distance (u, v) {
  var du = u-uM-r*Math.cos(alpha);               // Koordinatendifferenz waagrecht (Pixel)
  var dv = v-vM+r*Math.sin(alpha);               // Koordinatendifferenz senkrecht (Pixel)
  return Math.sqrt(du*du+dv*dv);                 // Abstand (Pixel)
  }

// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt drag

function reactionDown (u, v) {
  var r = canvas.getBoundingClientRect();        // Lage der Zeichenfl�che bez�glich Viewport
  u -= r.left; v -= r.top;                       // Koordinaten bez�glich Zeichenfl�che
  drag = (distance(u,v) <= 20);                  // Zugmodus aktivieren, falls Abstand klein
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt ...

function reactionMove (u, v) {
  var r = canvas.getBoundingClientRect();        // Lage der Zeichenfl�che bez�glich Viewport
  u -= r.left; v -= r.top;                       // Koordinaten bez�glich Zeichenfl�che
  u = Math.round(u); v = Math.round(v);          // Koordinaten ganzzahlig machen
  var alphaOld = alpha;                          // Bisherigen Winkel speichern
  alpha = Math.atan2(vM-v,u-uM);                 // Neuer Winkel gegen�ber der x-Achse (vorl�ufig)
  if (alpha < 0) alpha += PI2;                   // 0 <= alpha <= 2 pi erzwingen
  var beta = alpha-alphaOld;                     // �nderung gegen�ber dem bisherigen Winkel
  if (beta > Math.PI) {                          // Falls positive x-Achse nach unten �berschritten ...
    var n = Math.floor((beta+Math.PI)/PI2);      // Korrektur von beta
    beta -= n*PI2;
    }
  else if (beta < -Math.PI) {                    // Falls positive x-Achse nach oben �berschritten ...
    var n = Math.floor((-beta+Math.PI)/PI2);     // Korrektur von beta
    beta += n*PI2;
    }
  alpha = alphaOld+beta;                         // Neuer Winkel gegen�ber der x-Achse (endg�ltig)        
  paint();                                       // Neu zeichnen
  }
  
// Neuer Pfad:

function newPath () {
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.lineWidth = 1;                             // Liniendicke
  }
  
// Linie zeichnen:
// u1, v1 ... Bildschirmkoordinaten des Anfangspunkts
// u2, v2 ... Bildschirmkoordinaten des Endpunkts
// w ........ Liniendicke
// c ........ Farbe (optional)

function line (u1, v1, u2, v2, w, c) {
  if (c) ctx.strokeStyle = c;                    // Farbe setzen, falls definiert
  ctx.beginPath();                               // Neuer Pfad
  ctx.lineWidth = w;                             // Liniendicke
  ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);          // Linie vorbereiten
  ctx.stroke();                                  // Linie zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                 // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                    // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);           // L�nge
  if (length == 0) return;                       // Abbruch, falls L�nge 0
  dx /= length; dy /= length;                    // Einheitsvektor
  var s = 2.5*w+7.5;                             // L�nge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;              // Hilfspunkt f�r Pfeilspitze         
  var h = 0.5*w+3.5;                             // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;          // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;          // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;          // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                               // Neuer Pfad
  ctx.lineWidth = w;                             // Liniendicke
  ctx.moveTo(x1,y1);                             // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);             // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                      // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                  // Linie zeichnen
  if (length < 5) return;                        // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                               // Neuer Pfad f�r Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;               // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                           // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                         // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                             // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                         // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                               // Zur�ck zum Anfangspunkt
  ctx.fill();                                    // Pfeilspitze zeichnen 
  }
  
// Einheitskreis, Hervorhebungen, Hilfslinien:

function circle () {
  arrow(uM-r-30,vM,uM+r+30,vM);                  // x-Achse
  arrow(uM,vM+r+40,uM,vM-r-70);                  // y-Achse  
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(uM,vM,r,0,PI2,true);                   // Einheitskreis vorbereiten
  ctx.stroke();                                  // Einheitskreis zeichnen
  ctx.fillStyle = "#000000";                     // F�llfarbe scharz
  ctx.textAlign = "center";                      // Zentrierter Text
  ctx.font = "normal normal bold 12px sans-serif";    // Zeichensatz
  ctx.fillText("x",uM+r+25,vM+12);               // Beschriftung der x-Achse
  ctx.fillText("y",uM-8,vM-r-60);                // Beschriftung der y-Achse
  ctx.fillText("1",uM+r+5,vM+12);                // Einheit auf der x-Achse
  ctx.fillText("1",uM-6,vM-r-3);                 // Einheit auf der y-Achse
  var u = uM+r*Math.cos(alpha);                  // Punkt auf dem Einheitskreis, waagrechte Koordinate
  var v = vM-r*Math.sin(alpha);                  // Punkt auf dem Einheitskreis, senkrechte Koordinate
  line(uM,vM,u,v,1);                             // Punkt auf Einheitskreis mit Mittelpunkt verbinden
  if (rb1.checked) line(u,vM,u,v,2,colorSine);   // Hervorhebung f�r Sinus (senkrechte Linie)
  if (rb2.checked) {                             // Falls Cosinus ausgew�hlt ...
    line(uM,vM,u,vM,2,colorCosine);              // Hervorhebung f�r Cosinus (waagrechte Linie)
    line(u,vM,u,v,1,"#000000");                  // Senkrechte Linie
    } 
  if (rb3.checked && Math.abs(u-uM) > 1e-5) {    // Falls Tangens ausgew�hlt und definiert ...
    var vTan = vM-r*Math.tan(alpha);             // Senkrechte Bildschirmkoordinate
    line(uM+r,vM,uM+r,vTan,2,colorTangent);      // Hervorhebung f�r Tangens (senkrechte Linie)
    line(u,v,uM+r,vTan,1,"#000000");             // Verbindungslinie verl�ngern
    }                      
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = colorArc;                    // Farbe f�r Kreisbogen
  ctx.lineWidth = 2;                             // Liniendicke
  if (alpha > 0) {                               // Falls positiver Winkel, ...
    var w = PI2-alpha;                           // Endwinkel f�r Kreisbogen (Normalfall)
    if (w < 0) w = PI2;                          // Ganzer Kreis, falls alpha > 2 pi 
    ctx.arc(uM,vM,r,0,w,true);                   // Kreisbogen vorbereiten
    }
  if (alpha < 0)                                 // Falls negativer Winkel, ...
    ctx.arc(uM,vM,r,0,-alpha,false);             // Kreisbogen vorbereiten
  ctx.stroke();                                  // Kreisbogen zeichnen 
  newPath();                                     // Neuer Pfad
  ctx.fillStyle = colorPoint;                    // Farbe f�r beweglichen Punkt
  ctx.arc(u,v,2,0,PI2,true);                     // Kleinen Kreis vorbereiten
  ctx.fill();                                    // Ausgef�llten Kreis zeichnen      
  }
  
// Dicke senkrechte Linie f�r aktuellen sin-/cos-/tan-Wert:
// sct ...... Sinus-, Cosinus- oder Tangenswert
// c ........ Farbe

function verticalLine (sct, c) {
  newPath();                                     // Neuer Pfad
  var u = uCS+alpha*r;                           // Waagrechte Bildschirmkoordinate
  if (u < uMin || u > uMax) return;              // Abbruch, falls zu weit links oder rechts
  line(u,vM,u,vM-r*sct,2,c);                     // Linie zeichnen
  }
  
// Graph der Sinusfunktion, farbige Linie f�r den aktuellen Sinuswert:

function drawSine () {
  newPath();                                     // Neuer Pfad
  ctx.moveTo(uMin,vM-r*Math.sin(-delta));        // Anfangspunkt
  for (var u = uMin+1; u < uMax; u++)            // F�r alle ganzzahligen u-Werte ... 
    ctx.lineTo(u,vM-r*Math.sin((u-uCS)/r));      // Kurve erg�nzen
  ctx.stroke();                                  // Kurve zeichnen
  verticalLine(Math.sin(alpha),colorSine);       // Aktuellen Sinuswert hervorheben
  }
  
// Graph der Cosinusfunktion, farbige Linie f�r den aktuellen Cosinuswert:

function drawCosine () {
  newPath();                                     // Neuer Pfad
  ctx.moveTo(uMin,vM-r*Math.cos(-delta));        // Anfangspunkt
  for (var u = uMin+1; u < uMax; u++)            // F�r alle ganzzahligen u-Werte ... 
    ctx.lineTo(u,vM-r*Math.cos((u-uCS)/r));      // Kurve erg�nzen
  ctx.stroke();                                  // Kurve zeichnen
  verticalLine(Math.cos(alpha),colorCosine);     // Aktuellen Cosinuswert hervorheben
  }
  
// Graph der Tangensfunktion, Asymptoten, farbige Linie f�r den aktuellen Tangenswert:

function drawTangent () {
  newPath();                                     // Neuer Pfad
  ctx.moveTo(uMin,vM-r*Math.tan(-delta));        // Anfangspunkt
  for (var u = uMin+1; u < uMax; u++) {          // F�r alle ganzzahligen u-Werte ...
    var v = vM-r*Math.tan((u-uCS)/r);            // v-Wert berechnen 
    ctx.lineTo(u,v);                             // Kurve erg�nzen
    if (v < 0) {                                 // Falls oberer Rand �berschritten ...
      while (v < 0) {                            // Solange Definitionsl�cke noch nicht erreicht ...
        u++; v = vM-r*Math.tan((u-uCS)/r);       // u-Wert vergr��ern, v-Wert berechnen
        }   
      ctx.moveTo(u,v);                           // Neuer Anfangspunkt nach Unterbrechung
      }
    }
  ctx.stroke();                                  // Kurvenst�cke zeichnen
  asymptote(Math.PI/2);                          // Senkrechte Asymptote f�r x = pi/2
  asymptote(3*Math.PI/2);                        // Senkrechte Asymptote f�r x = 3*pi/2
  verticalLine(Math.tan(alpha),colorTangent);    // Aktuellen Tangenswert hervorheben
  }
  
// Senkrechte Asymptote (gestrichelt):
// x ... x-Koordinate (mathematisch)

function asymptote (x) {
  var u = uCS+r*x;                               // Bildschirmkoordinate waagrecht
  newPath();                                     // Neuer Pfad
  for (var i=-30; i<=30; i++) {                  // F�r alle Einzelstriche ...
    ctx.moveTo(u,vM+i*6-2);                      // Zum Anfangspunkt 
    ctx.lineTo(u,vM+i*6+2);                      // Weiter zum Endpunkt
    }
  ctx.stroke();                                  // Gestrichelte Linie zeichnen 
  }
  
// x-Achse f�r Funktionsgraph:

function xAxis () {
  arrow(uCS-30,vM,uCS+350,vM);                   // Achse zeichnen  
  ctx.fillText("x",uCS+345,vM+12);               // Beschriftung (x)
  newPath();                                     // Neuer Pfad
  for (var i = 1; i <= 4; i++) {                 // F�r alle Markierungen ...
    var u = uCS+i*r*Math.PI/2;                   // Waagrechte Bildschirmkoordinate
    ctx.moveTo(u,vM-4); ctx.lineTo(u,vM+4);      // Kurze Linie vorbereiten
    var s = ""+i*90+"\u00b0";                    // Winkel in Grad (Zeichenkette)
    ctx.fillText(s,u+2,vM-5);                    // Beschriftung oberhalb der Achse
    }
  ctx.stroke();                                  // Achse und Markierungen zeichnen
  var u = uCS+r*Math.PI/2;                       // Bildschirmkoordinate f�r x = 1/2 pi
  ctx.fillText("1",u-6,vM+13);                   // Z�hler f�r 1/2 pi
  line(u-10,vM+15,u-2,vM+15,2);                  // Bruchstrich f�r 1/2 pi
  ctx.fillText("2",u-6,vM+26);                   // Nenner f�r 1/2 pi
  ctx.fillText("\u03c0",u+5,vM+18);              // Buchstabe pi f�r 1/2 pi
  ctx.fillText("\u03c0",uCS+r*Math.PI,vM+18);    // Buchstabe pi
  u = uCS+3*r*Math.PI/2;                         // Bildschirmkoordinate f�r x = 3/2 pi 
  ctx.fillText("3",u-6,vM+13);                   // Z�hler f�r 3/2 pi
  line(u-10,vM+15,u-2,vM+15,2);                  // Bruchstrich f�r 3/2 pi
  ctx.fillText("2",u-6,vM+26);                   // Nenner f�r 3/2 pi
  ctx.fillText("\u03c0",u+5,vM+18);              // Buchstabe pi f�r 3/2 pi
  u = uCS+r*PI2;                                 // Bildschirmkoordinate f�r x = 2 pi
  ctx.fillText("2",u-4,vM+18);                   // Koeffizient 2 f�r 2 pi
  ctx.fillText("\u03c0",u+5,vM+18);              // Buchstabe pi f�r 2 pi
  }
  
// y-Achse f�r Funktionsgraph:

function yAxis () {
  arrow(uCS,vM+r+70,uCS,vM-r-70);                // Achse zeichnen
  ctx.fillText("y",uCS-8,vM-r-60);               // Beschriftung (y)
  ctx.fillText("1",uCS-8,vM-r+4);                // Einheit
  line(uCS-4,vM-r,uCS+4,vM-r,1);                 // Kurze Linie f�r y = 1
  }
  
// Funktionsgraph:

function diagram () {
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.fillStyle = "#000000";                     // F�llfarbe schwarz
  ctx.textAlign = "center";                      // Zentrierter Text
  ctx.font = "normal normal bold 12px sans-serif";  // Zeichensatz  
  xAxis(); yAxis();                              // Koordinatensystem
  if (rb1.checked) drawSine();                   // Graph der Sinusfunktion
  if (rb2.checked) drawCosine();                 // Graph der Cosinusfunktion
  if (rb3.checked) drawTangent();                // Graph der Tangensfunktion
  var u = uCS+Math.max(r*alpha,-30);             // Waagrechte Bildschirmkoordinate
  line(uCS,vM,u,vM,2,colorArc);                  // Linie hervorheben (waagrecht)
  }
  
// Angabe des Funktionswertes:
// R�ckgabewert: Zeichenkette der Art sin 30,0� = 0,50000

function value () {
  var neg = (alpha < 0);                                   // Winkel negativ?
  var s1, s2;                                              // Funktionsterm, Gleichheitszeichen und Zahlenwert
  if (rb1.checked) s1 = symbolSine;                        // Symbol f�r Sinusfunktion ...
  else if (rb2.checked) s1 = symbolCosine;                 // ... oder Cosinusfunktion ...
  else s1 = symbolTangent;                                 // ... oder Tangensfunktion
  s1 += " ";                                               // Leerzeichen anh�ngen
  if (neg) s1 += "(";                                      // Falls Winkel negativ, �ffnende Klammer
  var w = alpha*180/Math.PI;                               // Winkel im Gradma�
  s1 += w.toFixed(1)+"\u00b0";                             // Winkel und Einheit � anh�ngen
  if (neg) s1 += ")";                                      // Falls Winkel negativ, schlie�ende Klammer
  if (rb3.checked && Math.abs(Math.cos(alpha)) < 1e-10)    // Falls Tangens nicht definiert, ...
    s2 = undef;                                            // Fehlermeldung
  else {                                                   // Normalfall
    s2 = "= ";                                             // Gleichheitszeichen                                      
    if (rb1.checked) w = Math.sin(alpha);                  // Sinuswert ...
    else if (rb2.checked) w = Math.cos(alpha);             // ... oder Cosinuswert ...
    else w = Math.tan(alpha);                              // ... oder Tangenswert
    s2 += w.toFixed(5);                                    // Zahlenwert mit 5 Nachkommastellen anh�ngen
    if (w > -1e-10) s2 = s2.replace("-","");               // -0 verhindern
    }
  var s = s1+" "+s2;                                       // Zeichenkette zusammensetzen
  s = s.replace(/-/g,"\u2212");                            // Breites Minuszeichen verwenden
  return s.replace(/\./g,decimalSeparator);                // Eventuell Punkt durch Komma ersetzen 
  }
  
// Zeichenbereich einschr�nken:

function clip () {
  newPath();                                     // Neuer Pfad
  var d = 10;                                    // Abstand zum Rand                         
  ctx.moveTo(d,d);                               // Anfangspunkt links oben
  ctx.lineTo(canvas.width-d,d);                  // Weiter nach rechts oben
  ctx.lineTo(canvas.width-d,canvas.height-d);    // Weiter nach rechts unten 
  ctx.lineTo(d,canvas.height-d);                 // Weiter nach links unten
  ctx.closePath();                               // Zur�ck zum Anfangspunkt
  ctx.clip();                                    // Zeichenbereich einschr�nken
  }
  
// Grafikausgabe:
// Seiteneffekt nr
  
function paint () {
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);  // Hintergrund ausf�llen
  clip();                                        // Zeichenbereich einschr�nken
  circle();                                      // Einheitskreis (links)
  diagram();                                     // Funktionsgraph (rechts)
  ctx.alignText = "center";                      // Textausrichtung
  ctx.fillText(value(),uM,vM + 150);             // Zahlenangabe
  }
  
document.addEventListener("DOMContentLoaded",start,false);

