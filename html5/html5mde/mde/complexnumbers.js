// Rechnen mit komplexen Zahlen
// Java-Applet (4.12.1999) umgewandelt
// 21.11.2015 - 23.11.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel complexnumbers_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorGrid = "#c0c0c0";                                 // Farbe f�r Gitternetz
var colorNumber1 = "#0000ff";                              // Farbe f�r 1. Zahl
var colorNumber2 = "#ff0000";                              // Farbe f�r 2. Zahl
var colorResult = "#000000";                               // Farbe f�r Ergebnis

// Sonstige Konstanten:

var DEG = Math.PI/180;                                     // Winkelgrad (Bogenma�)
var pix = 20;                                              // Pixel pro Einheit
var FONT1 = "normal normal bold 12px sans-serif";          // Kleinerer Zeichensatz (Koordinatensystem)
var FONT2 = "normal normal bold 16px sans-serif";          // Gr��erer Zeichensatz (Rechnung)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var rb1, rb2, rb3, rb4;                                    // Radiobuttons (Rechenarten)
var rb5, rb6;                                              // Radiobuttons (Koordinatensystem)

var cs;                                                    // Art des Koordinatensystems (1 oder 2)
var op;                                                    // Rechenart (1 bis 4)
var uM, vM;                                                // Koordinaten des Mittelpunkts (Pixel)
var x1, y1, x2, y2;                                        // Gegebene Zahlen (Real- und Imagin�rteil)
var u1, v1, u2, v2;                                        // Bildschirmkoordinaten der beiden Zahlen (Pixel)
var x, y;                                                  // Ergebnis
var u, v;                                                  // Bildschirmkoordinaten des Ergebnisses (Pixel)
var nr;                                                    // Nummer der Zahl, durch Mausklick ausgew�hlt (1, 2 oder 0)

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
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  getElement("lb1",text01);                                // Erkl�render Text (Rechenart)
  rb1 = getElement("rb1a");                                // Radiobutton (Addition)
  getElement("rb1b",text02);                               // Erkl�render Text (Addition)
  rb2 = getElement("rb2a");                                // Radiobutton (Subtraktion)
  getElement("rb2b",text03);                               // Erkl�render Text (Subtraktion)
  rb3 = getElement("rb3a");                                // Radiobutton (Multiplikation)
  getElement("lb3b",text04);                               // Erkl�render Text (Multiplikation)
  rb4 = getElement("rb4a");                                // Radiobutton (Division)
  getElement("lb4b",text05);                               // Erkl�render Text (Division)
  rb1.checked = true;                                      // Addition ausgew�hlt
  getElement("lb2",text06);                                // Erkl�render Text (Koordinatensystem)
  rb5 = getElement("rb5a");                                // Radiobutton (Kartesische Koordinaten)
  getElement("rb5b",text07);                               // Erkl�render Text (Kartesische Koordinaten)
  rb6 = getElement("rb6a");                                // Radiobutton (Polarkoordinaten)
  getElement("rb6b",text08);                               // Erkl�render Text (Polarkoordinaten)  
  rb5.checked = true;                                      // Kartesische Koordinaten ausgew�hlt
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  cs = 1;                                                  // Zun�chst kartesisches Koordinatensystem
  op = 1;                                                  // Zun�chst Addition
  uM = vM = width/2;                                       // Mittelpunkt der Zeichenfl�che (Pixel)
  x1 = 1; y1 = 3;                                          // Startwerte f�r erste Zahl (1+3i)
  u1 = uM+x1*pix; v1 = vM-y1*pix;                          // Zugeh�rige Bildschirmkoordinaten
  x2 = -2; y2 = 1;                                         // Startwerte f�r zweite Zahl (-2+i)
  u2 = uM+x2*pix; v2 = vM-y2*pix;                          // Zugeh�rige Bildschirmkoordinaten
  nr = 0;                                                  // Zun�chst keine Zahl ausgew�hlt
  paint();                                                 // Zeichnen
  
  rb1.onchange = reactionRadio;                            // Reaktion auf Radiobutton Addition
  rb2.onchange = reactionRadio;                            // Reaktion auf Radiobutton Subtraktion
  rb3.onchange = reactionRadio;                            // Reaktion auf Radiobutton Multipikation
  rb4.onchange = reactionRadio;                            // Reaktion auf Radiobutton Division
  rb5.onchange = reactionRadio;                            // Reaktion auf Radiobutton Kartesische Koordinaten
  rb6.onchange = reactionRadio;                            // Reaktion auf Radiobutton Polarkoordinaten
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
  
  } // Ende der Methode start
  
// Reaktion auf Radiobuttons:
// Seiteneffekt cs, op
  
function reactionRadio () {
  if (rb1.checked) op = 1;                                 // Addition
  else if (rb2.checked) op = 2;                            // Subtraktion
  else if (rb3.checked) op = 3;                            // Multiplikation
  else if (rb4.checked) op = 4;                            // Division
  if (rb5.checked) cs = 1;                                 // Kartesische Koordinaten
  else if (rb6.checked) cs = 2;                            // Polarkoordinaten
  paint();                                                 // Neu zeichnen
  }
 
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (nr != 0) e.preventDefault();                         // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr = 0;                                                  // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
    
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt nr

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)  
  var tol = 20;                                            // Toleranz
  var du = u-u1, dv = v-v1;                                // Koordinaten des 1. Verbindungsvektors (Pixel)
  var rMin = Math.sqrt(du*du+dv*dv);                       // Abstand zum 1. Punkt (Pixel)
  nr = 1;                                                  // Zun�chst 1. Punkt ausgew�hlt 
  du = u-u2; dv = v-v2;                                    // Koordinaten des 2. Verbindungsvektors (Pixel)
  var r = Math.sqrt(du*du+dv*dv);                          // Abstand zum 2. Punkt (Pixel)
  if (r < rMin) {nr = 2; rMin = r;}                        // Falls n�her, 2. Punkt ausgew�hlt
  if (rMin > tol) nr = 0;                                  // Falls zu weit weg, kein Punkt ausgew�hlt
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt u1, v1, u2, v2, x1, y1, x2, y2, x, y, u, v

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  u = 2*Math.round(u/2); v = 2*Math.round(v/2);            // Auf gerade Zahlen runden
  if (nr == 1) {                                           // Falls 1. Punkt ausgew�hlt ...
    u1 = u; v1 = v;                                        // Bildschirmkoordinaten �bernehmen
    x1 = (u1-uM)/pix; y1 = (vM-v1)/pix;                    // Mathematische Koordinaten berechnen
    }
  else if (nr == 2) {                                      // Falls 2. Punkt ausgew�hlt ...
    u2 = u; v2 = v;                                        // Bildschirmkoordinaten �bernehmen
    x2 = (u2-uM)/pix; y2 = (vM-v)/pix;                     // Mathematische Koordinaten berechnen
    }
  paint();                                                 // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen

function ToString (n, d) {
  var s = n.toFixed(d);                                    // Zeichenkette mit Dezimalpunkt
  s = s.replace("-","\u2212");                             // Langes Minuszeichen verwenden
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }

// Berechnung des Ergebnisses:
// Seiteneffekt x, y, u, v

function calculation () {
  switch (op) {                                            // Je nach gew�hlter Rechenart ...
    case 1:                                                // Fall 1: Addition
      x = x1+x2; y = y1+y2; break;                         // Summe
    case 2:                                                // Fall 2: Subtraktion
      x = x1-x2; y = y1-y2; break;                         // Differenz
    case 3:                                                // Fall 3: Multiplikation
      x = x1*x2-y1*y2; y = x1*y2+y1*x2; break;             // Produkt
    case 4:                                                // Fall 4: Division
      var d = x2*x2+y2*y2;                                 // Nenner
      x = (x1*x2+y1*y2)/d; y = (y1*x2-x1*y2)/d;            // Quotient
      break;
      }
  u = uM+pix*x; v = vM-pix*y;                              // Zugeh�rige Bildschirmkoordinaten
  } 

   
//-------------------------------------------------------------------------------------------------

// Neuer Pfad mit Standardwerten:
// w ... Liniendicke (optional, Defaultwert 1)

function newPath(w) {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)

function line (x1, y1, x2, y2, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Punkt markieren (ausgef�llter Kreis):
// (u,v) ... Mittelpunkt (Pixel)
// c ....... Farbe

function point (u, v, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(u,v,2,0,2*Math.PI,true);                         // Kreis mit Radius 2 vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill();                                              // Ausgef�llter Kreis
  }
  
// Kreis zeichnen:
// (u,v) ... Mittelpunkt (Pixel)

function circle (u, v, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = c;                                     // Linienfarbe
  ctx.arc(u,v,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // L�nge
  if (length == 0) return;                                 // Abbruch, falls L�nge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // L�nge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt f�r Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad f�r Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }

// Kartesisches Koordinatensystem:

function cosyCartesian () {
  var max = Math.round(width/(2*pix));                     // Maximaler Betrag von Real- und Imagin�rteil
  for (var i=-max+1; i<max; i++)                           // F�r alle ganzen Zahlen ...
    line(uM+i*pix,0,uM+i*pix,width,colorGrid);             // Senkrechte Linie zeichnen (Gitternetz)
  for (var k=-max+1; k<max; k++)                           // F�r alle ganzen Zahlen ...
    line(0,vM+k*pix,width,vM+k*pix,colorGrid);             // Waagrechte Linie zeichnen (Gitternetz)
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  arrow(0,vM,width,vM);                                    // x-Achse
  arrow(uM,width,uM,0);                                    // y-Achse
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  for (i=-max+1; i<max; i++) {                             // F�r alle Ticks der x-Achse ...
    if (i == 0) continue;                                  // x = 0 auslassen
    var x = uM+i*pix; line(x,vM-3,x,vM+3);                 // Tick zeichnen
    ctx.fillText(ToString(i,0),x,vM+14);                   // Tick beschriften
    }
  ctx.textAlign = "right";                                 // Textausrichtung rechtsb�ndig
  for (k=-max+1; k<max; k++) {                             // F�r alle Ticks der y-Achse ...
    if (k == 0) continue;                                  // y = 0 auslassen
    var y = uM-k*pix; line(uM-3,y,uM+3,y);                 // Tick zeichnen
    var s = ToString(k,0)+"i";                             // Zeichenkette f�r rein imagin�re Zahl, Normalfall
    if (k == 1) s = "i";                                   // Zeichenkette f�r i
    if (k == -1) s = "\u2212i";                            // Zeichenkette f�r -i
    ctx.fillText(s,uM-5,y+4);                              // Tick beschriften
    }
  }
    
// Polarkoordinatensystem:

function cosyPolar () {
  var max = Math.floor(width/(Math.sqrt(2)*pix));          // Maximaler Radius (mathematisch)
  for (var i=1; i<max; i++)                                // F�r alle ganzen Zahlen ...
    circle(uM,vM,i*pix,colorGrid);                         // Kreis zeichnen
  for (i=0; i<180; i+= 15) {                               // F�r alle Vielfachen von 15� ...
    var w = i*DEG;                                         // Winkel (Bogenma�)
    var du = 300*Math.cos(w);                              // 1. Koordinate Verbindungsvektor
    var dv = 300*Math.sin(w);                              // 2. Koordinate Verbindungsvektor
    var u1 = uM+du, v1 = vM-dv;                            // Anfangspunkt
    var u2 = uM-du, v2 = vM+dv;                            // Endpunkt
    line(u1,v1,u2,v2,colorGrid);                           // Linie zeichnen
    }
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  arrow(uM,vM,width,vM);                                   // Pfeil f�r Achse
  ctx.textAlign="center";                                  // Textausrichtung zentriert
  for (i=0; i<=width/(2*pix)-1; i++) {                     // F�r alle ganzen Zahlen ...
    var u = uM+i*pix; line(u,vM-3,u,vM+3);                 // Tick zeichnen
    ctx.fillText(""+i,u,vM+14);                            // Tick beschriften
    }
  }
    
// Konstruktion f�r Addition und Subtraktion (Vektoraddition):

function constructionAddSub () {
  ctx.strokeStyle = colorNumber1;                          // Farbe f�r 1. Zahl 
  arrow(uM,vM,u1,v1,1.5);                                  // Vektorpfeil f�r 1. Zahl
  ctx.strokeStyle = colorNumber2;                          // Farbe f�r 2. Zahl
  arrow(uM,vM,u2,v2,1.5);                                  // Vektorpfeil f�r 2. Zahl
  arrow(u1,v1,u,v,0.5);                                    // Verschobener Pfeil f�r Vektoraddition
  ctx.strokeStyle = colorResult;                           // Farbe f�r Ergebnis
  arrow(uM,vM,u,v,1.5);                                    // Vektorpfeil f�r Ergebnis
  }
  
// Konstruktion f�r Multiplikation (�hnliche Dreiecke):

function constructionMult () {
  line(uM,vM,uM+pix,vM,colorNumber1);                      // Waagrechte Linie vom Ursprung zur Eins
  line(uM+pix,vM,u1,v1,colorNumber1);                      // Weiter zur 1. Zahl
  line(u1,v1,uM,vM,colorNumber1);                          // Zur�ck zum Ursprung
  line(uM,vM,u2,v2,colorNumber2);                          // Linie vom Ursprung zur 2. Zahl
  line(u2,v2,u,v,colorNumber2);                            // Weiter zum Ergebnis
  line(u,v,uM,vM,colorNumber2);                            // Zur�ck zum Ursprung
  }
    
// Konstruktion f�r Division (�hnliche Dreiecke):

function constructionDiv () {
  if (x2 == 0 && y2 == 0) return;                          // Falls Division durch 0, abbrechen
  line(uM,vM,uM+pix,vM,colorNumber1);                      // Waagrechte Linie vom Ursprung zur Eins
  line(uM+pix,vM,u2,v2,colorNumber1);                      // Weiter zur 2. Zahl
  line(u2,v2,uM,vM,colorNumber1);                          // Zur�ck zum Ursprung
  line(uM,vM,u,v,colorNumber2);                            // Linie vom Ursprung zum Ergebnis
  line(u,v,u1,v1,colorNumber2);                            // Weiter zur 1. Zahl
  line(u1,v1,uM,vM,colorNumber2);                          // Zur�ck zum Ursprung
  }
      
// Zeichenkette f�r eine komplexe Zahl:
// x ... Realteil
// y ... Imagin�rteil
// n ... Zahl der Nachkommastellen

function stringComplex (x, y, n) {
  var s = "";                                              // Leere Zeichenkette
  if (x != 0) s += ToString(x,n);                          // Realteil hinzuf�gen, falls ungleich 0
  if (x != 0 && y > 0) s += "+";                           // Falls n�tig, Pluszeichen hinzuf�gen
  if (y != 0) {                                            // Falls Imagin�rteil ungleich 0 ...
    if (y == 1) s += "i";                                  // Falls Imagin�rteil 1, i (ohne Koeffizient) hinzuf�gen
    else if (y == -1) s += "-i";                           // Falls Imagin�rteil -1, -i (ohne Koeffizient) hinzuf�gen
    else s += ToString(y,n)+"i";                           // Vielfaches von i hinzuf�gen, eventuell mit Vorzeichen -
    }
  if (x == 0 && y == 0) s = "0";                           // Sonderfall: Zahl 0
  s = s.replace(/-/g,"\u2212");                            // Kurzes durch langes Minuszeichen ersetzen
  return s;                                                // R�ckgabewert
  }
  
// �berpr�fung, ob Klammer um komplexe Zahl n�tig:
// x ... Realteil
// y ... Imagin�rteil

function bracketNecessary (x, y) {
  return ((x != 0 && y != 0) || (x < 0 && y == 0) || (x == 0 && y < 0));  
  }
  
// Ausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (u,v) ... Position (Pixel)
// c ....... Schriftfarbe
// R�ckgabewert: Waagrechte Bildschirmkoordinate zum Weiterschreiben (Pixel)
  
function write (s, u, v, c) {
  ctx.fillStyle = c;                                       // Schriftfarbe
  ctx.fillText(s,u,v);                                     // Zeichenkette ausgeben
  return u+ctx.measureText(s).width;                       // R�ckgabewert
  }
    
// Rechnung ausgeben:

function writeCalculation () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.rect(0,width,width,height-width);                    // Rechteck vorbereiten
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�lltes Rechteck mit schwarzem Rand
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig
  symbol = symbolOperation[op-1];                          // Rechenzeichen
  var s1 = stringComplex(x1,y1,1);                         // Zeichenkette f�r 1. Zahl
  if (bracketNecessary(x1,y1)) s1 = "("+s1+")";            // Falls n�tig, Klammer
  var s2 = stringComplex(x2,y2,1);                         // Zeichenkette f�r 2. Zahl
  if (bracketNecessary(x2,y2)) s2 = "("+s2+")";            // Falls n�tig, Klammer
  var n = 1;                                               // Zahl der Nachkommastellen  f�r Addition/Subtraktion
  if (op == 3) n = 2;                                      // Zahl der Nachkommastellen f�r Multiplikation
  if (op == 4) n = 4;                                      // Zahl der Nachkommastellen f�r Division
  var s3 = stringComplex(x,y,n);                           // Zeichenkette f�r Ergebnis
  var s = s1+" "+symbol+" "+s2+" = "+s3;                   // Zeichenkette f�r gesamte Rechnung
  var u = uM-ctx.measureText(s).width/2;                   // Waagrechte Bildschirmkoordinate (Pixel)
  var v = height-14;                                       // Senkrechte Bildschirmkoordinate (Pixel)
  u = write(s1,u,v,colorNumber1);                          // Ausgabe der 1. Zahl
  u = write(" "+symbol+" ",u,v,colorResult);               // Ausgabe des Rechenzeichens
  u = write(s2,u,v,colorNumber2);                          // Ausgabe der 2. Zahl
  var correct = (op < 4 || x2 != 0 || y2 != 0);            // �berpr�fung, ob Division durch 0
  if (correct) write(" = "+s3,u,v,colorResult);            // Entweder Ausgabe des Ergebnisses ...
  else write(" "+text09,u,v,colorResult);                  // ... oder Fehlermeldung (nicht definiert) 
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  x1 = (u1-uM)/pix; y1 = (vM-v1)/pix;                      // 1. Zahl
  x2 = (u2-uM)/pix; y2 = (vM-v2)/pix;                      // 2. Zahl
  calculation();                                           // Berechnungen
  ctx.font = FONT1;                                        // Kleinerer Zeichensatz
  if (cs == 1) cosyCartesian();                            // Kartesische Koordinaten
  else cosyPolar();                                        // Polarkoordinaten
  if (op <= 2) constructionAddSub();                       // Konstruktion f�r Addition/Subtraktion (Vektoraddition)
  else if (op == 3) constructionMult();                    // Konstruktion f�r Multiplikation (�hnliche Dreiecke)
  else constructionDiv();                                  // Konstruktion f�r Division (�hnliche Dreiecke)
  point(u1,v1,colorNumber1);                               // Punkt f�r 1. Zahl
  point(u2,v2,colorNumber2);                               // Punkt f�r 2. Zahl
  if (op < 4 || x2 != 0 || y2 != 0)                        // Falls Ergebnis definiert ...
    point(u,v,colorResult);                                // Punkt f�r Ergebnis
  ctx.font = FONT2;                                        // Gr��erer Zeichensatz
  writeCalculation();                                      // Ausgabe der Rechnung
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen

