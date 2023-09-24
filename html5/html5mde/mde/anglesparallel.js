// Winkel an parallelen Geraden
// Java-Applet (21.03.2006) umgewandelt
// 29.03.2018 - 01.04.2018

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel anglesparallel_de.js) abgespeichert.

// Konstanten:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPoint = "#ff00ff";                                // Farbe f�r Punkte
var colorAngle = ["#ff80c0", "#80ff80", "#ffc040", "#80c0ff"];  // Farben f�r Winkel
var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var PI2 = 2*Math.PI;                                       // Abk�rzung f�r 2 pi
var R = 25;                                                // Radius f�r Winkelmarkierungen
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var rb1, rb2, rb3;                                         // Radiobuttons
var ch1, ch2;                                              // Auswahlfelder
var op1, op2;                                              // Ausgabefelder

var nr;                                                    // Nummer des ausgew�hlten Objekts (0 bis 6)
var p1, p2;                                                // Kreuzungspunkte (Attribute x, y)
var q1, q2;                                                // Hilfspunkte (Attribute x, y)
var alpha0;                                                // Startwinkel (Bogenma�)
var alpha;                                                 // Winkelgr��e (Bogenma�)
var index;                                                 // Index des Winkelpaars (0 bis 3)

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
  rb1 = getElement("rb1");                                 // Radiobutton 1 (Stufenwinkel)
  rb1.checked = true;                                      // Stufenwinkel ausgew�hlt
  getElement("lb1",text01);                                // Erkl�render Text (Stufenwinkel)
  rb2 = getElement("rb2");                                 // Radiobutton 2 (Wechselwinkel)
  rb2.checked = false;                                     // Wechselwinkel nicht ausgew�hlt
  getElement("lb2",text02);                                // Erkl�render Text (Wechselwinkel)
  rb3 = getElement("rb3");                                 // Radiobutton 3 (Nachbarwinkel)
  rb3.checked = false;                                     // Nachbarwinkel nicht ausgew�hlt
  getElement("lb3",text03);                                // Erkl�render Text (Nachbarwinkel)
  ch1 = select1();                                         // Auswahlfeld 1 (Winkelpaar)
  ch2 = select2();                                         // Auswahlfeld 2 (Zahl der Nachkommastellen)
  getElement("lb4",text05);                                // Erkl�render Text (Nachkommastellen)
  getElement("lb5",text06);                                // Erkl�render Text (Gr��en der Winkel)
  op1 = getElement("op1");                                 // Ausgabefeld 1 (Winkel an erster Geradenkreuzung)
  op2 = getElement("op2");                                 // Ausgabefeld 2 (Winkel an der zweiten Geradenkreuzung) 
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  nr = 0;                                                  // Zun�chst kein Objekt ausgew�hlt
  p1 = {x: 200, y: 300};                                   // 1. Kreuzungspunkt
  p2 = {x: 250, y: 100};                                   // 2. Kreuzungspunkt
  q1 = {x: 300, y: 290};                                   // Hilfspunkt auf der 1. Parallelen
  q2 = {x: p2.x+q1.x-p1.x, y: p2.y+q1.y-p1.y};             // Hilfspunkt auf der 2. Parallelen
  index = 0;                                               // Zun�chst 1. Winkelpaar ausgew�hlt
                                     
  paint();                                                 // Zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  
  rb1.onclick = reactionRadio;                             // Reaktion auf Radiobutton 1 (Stufenwinkel)
  rb2.onclick = reactionRadio;                             // Reaktion auf Radiobutton 2 (Wechselwinkel)
  rb3.onclick = reactionRadio;                             // Reaktion auf Radiobutton 3 (Nachbarwinkel)
  ch1.onchange = reactionSelect;                           // Reaktion auf Auswahlfeld 1 (Art der Winkelpaare)
  ch2.onchange = reactionSelect;                           // Reaktion auf Auswahlfeld 2 (Zahl der Nachkommastellen)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
    
  } // Ende der Methode start
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl eines Objekts)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl eines Objekts)
  if (nr > 0) e.preventDefault();                          // Falls Objekt ausgew�hlt, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  nr = 0;                                                  // Kein Objekt ausgew�hlt
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  nr =0;                                                   // Kein Objekt ausgew�hlt
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls kein Objekt ausgew�hlt
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (nr == 0) return;                                     // Abbrechen, falls kein Objekt ausgew�hlt
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  } 

// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl eines Objekts):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt nr

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  var d = distanceLine(x,y,p1,q1);                         // Abstand von der ersten Parallele
  var dMin = d;                                            // Vorl�ufiges Abstandsminimum
  var n = (parameter(x,y,p1,q1)>0 ? 1 : 2);                // Nummer f�r Teil der ersten Parallele
  d = distanceLine(x,y,p2,q2);                             // Abstand von der zweiten Parallele
  if (d < dMin) {                                          // Falls Abstand kleiner als bisheriges Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    n = (parameter(x,y,p2,q2)>0 ? 3 : 4);                  // Nummer f�r Teil der zweiten Parallele
    }             
  d = distancePoint(x,y,p1);                               // Abstand vom ersten Kreuzungspunkt
  if (d < dMin || d < 20) {                                // Falls Abstand kleiner als das bisherige Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    n = 5;                                                 // Nummer f�r ersten Kreuzungspunkt
    } 
  d = distancePoint(x,y,p2);                               // Abstand vom zweiten Kreuzungspunkt
  if (d < dMin || d < 20) {                                // Falls Abstand kleiner als das bisherige Minimum ...
    dMin = d;                                              // Abstandsminimum aktualisieren
    n = 6;                                                 // Nummer f�r zweiten Kreuzungspunkt
    } 
  nr = (dMin<20 ? n : 0);                                  // Falls geringer Abstand, Nummer �bernehmen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt p1, p2, q1, q2, alpha0, alpha

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  if (nr == 1) {                                           // Falls erste Parallele auf der Seite von q1 ...
    if (counterClock(p2.x,p2.y,p1.x,p1.y,x,y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    q1.x = x; q1.y = y;                                    // Punkt q1 auf erster Parallele aktualisieren
    q2.x = p2.x+q1.x-p1.x; q2.y = p2.y+q1.y-p1.y;          // Punkt q2 auf zweiter Parallele aktualisieren
    }
  else if (nr == 2) {                                      // Falls erste Parallele entgegengesetzt zu q1 ...
    if (counterClock(x,y,p1.x,p1.y,p2.x,p2.y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    q1.x = 2*p1.x-x; q1.y = 2*p1.y-y;                      // Punkt q1 auf erster Parallele aktualisieren
    q2.x = p2.x+q1.x-p1.x; q2.y = p2.y+q1.y-p1.y;          // Punkt q2 auf zweiter Parallele aktualisieren
    }
  else if (nr == 3) {                                      // Falls zweite Parallele auf der Seite von q2 ...
    if (counterClock(x,y,p2.x,p2.y,p1.x,p1.y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    q2.x = x; q2.y = y;                                    // Punkt q2 auf zweiter Parallele aktualisieren
    q1.x = p1.x+q2.x-p2.x; q1.y = p1.y+q2.y-p2.y;          // Punkt q1 auf erster Parallele aktualisieren
    }
  else if (nr == 4) {                                      // Falls zweite Parallele entgegengesetzt zu q2 ...
    if (counterClock(p1.x,p1.y,p2.x,p2.y,x,y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    q2.x = 2*p2.x-x; q2.y = 2*p2.y-y;                      // Punkt q2 auf zweiter Parallele aktualisieren
    q1.x = p1.x+q2.x-p2.x; q1.y = p1.y+q2.y-p2.y;          // Punkt q1 auf erster Parallele aktualisieren
    }
  else if (nr == 5) {                                      // Falls erster Kreuzungspunkt ...
    if (distancePoint(x,y,p2) < 2*R) return;               // Falls zu nahe am zweiten Kreuzungspunkt, abbrechen
    if (counterClock(q2.x,q2.y,p2.x,p2.y,x,y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    p1.x = x; p1.y = y;                                    // Ersten Kreuzungspunkt p1 aktualisieren
    q1.x = p1.x+q2.x-p2.x; q1.y = p1.y+q2.y-p2.y;          // Weiteren Punkt q1 auf erster Parallele aktualisieren
    }
  else if (nr == 6) {                                      // Falls zweiter Kreuzungspunkt ...
    if (distancePoint(x,y,p1) < 2*R) return;               // Falls zu nahe am ersten Kreuzungspunkt, abbrechen
    if (counterClock(x,y,p1.x,p1.y,q1.x,q1.y)) return;     // Falls falsche Halbebene bez�glich Kreuzungsgerade, abbrechen
    p2.x = x; p2.y = y;                                    // Zweiten Kreuzungspunkt p2 aktualisieren
    q2.x = p2.x+q1.x-p1.x; q2.y = p2.y+q1.y-p1.y;          // Weiteren Punkt q2 auf zweiter Parallele aktualisieren
    }
  paint();                                                 // Neu zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  }
  
// Vorbereitung des ersten Auswahlfelds (Winkelpaar):
// R�ckgabewert: Auswahlfeld
  
function select1 () {
  ch1 = getElement("ch1");                                 // Auswahlfeld
  ch1.length = 0;                                          // Bisherige Optionen l�schen
  for (var i=0; i<(rb3.checked?2:4); i++) {                // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text04[i];                                    // Text des Elements �bernehmen 
    ch1.add(o);                                            // Element zur Liste hinzuf�gen
    }
  ch1.selectedIndex = 0;                                   // Erster Eintrag ausgew�hlt
  return ch1;                                              // R�ckgabewert
  }
  
// Vorbereitung des zweiten Auswahlfelds (Zahl der Nachkommastellen):
// R�ckgabewert: Auswahlfeld
  
function select2 () {
  ch2 = getElement("ch2");                                 // Auswahlfeld
  for (var i=0; i<=5; i++) {                               // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = ""+i;                                         // Text des Elements �bernehmen 
    ch2.add(o);                                            // Element zur Liste hinzuf�gen
    }
  ch2.selectedIndex = 0;                                   // Erster Eintrag ausgew�hlt
  return ch2;                                              // R�ckgabewert
  }
  
// Reaktion auf Radiobutton (Art der Winkelpaare):
  
function reactionRadio () {
  select1();                                               // Auswahlfeld vorbereiten                                      
  ch1.selectedIndex = (rb3.checked ? index%2 : index);     // Ausgew�hlte Option
  paint();                                                 // Neu zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt index, alpha0, alpha
  
function reactionSelect () {
  index = ch1.selectedIndex;                               // Art der Winkelpaare
  paint();                                                 // Neu zeichnen
  updateOutput();                                          // Ausgabe der Winkelgr��en
  }
  
//-------------------------------------------------------------------------------------------------

// Abstand von einem gegebenen Punkt:
// (x,y) ... Aktuelle Position (Pixel)
// p ....... Gegebener Punkt (Attribute x, y)

function distancePoint (x, y, p) {
  var dx = x-p.x, dy = y-p.y;                              // Verbindungsvektor
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }

// Abstand von einer gegebenen Verbindungsgeraden:
// (x,y) .... Aktuelle Position (Pixel)
// p1, p2 ... Bestimmungspunkte der Geraden (Attribute x, y)
 
function distanceLine (x, y, p1, p2) {
  var ux = p2.x-p1.x, uy = p2.y-p1.y;                     // Richtungsvektor
  var vx = x-p1.x, vy = y-p1.y;                           // Verbindungsvektor 
  var h1 = vx*vx+vy*vy;                                   // Hilfsgr��e (Quadrat Verbindungsvektor)
  var h2 = vx*ux+vy*uy;                                   // Hilfsgr��e (Skalarprodukt)
  return Math.sqrt(h1-h2*h2/(ux*ux+uy*uy));               // R�ckgabewert   
  } 
  
// Parameterwert f�r Gerade zu gegebener Position (Fu�punkt):
// (x,y) .... Aktuelle Position (Pixel)
// p1, p2 ... Bestimmungspunkte der Geraden (Attribute x, y)

function parameter (x, y, p1, p2) {
  var ux = p2.x-p1.x, uy = p2.y-p1.y;                      // Richtungsvektor
  var vx = x-p1.x, vy = y-p1.y;                            // Verbindungsvektor
  return (ux*vx+uy*vy)/(ux*ux+uy*uy);                      // R�ckgabewert
  }
  
// Startwinkel f�r Winkelmarkierung (Bogenma�):
// i ... Index (0 bis 3, alpha bis delta)
// Wichtig: Richtige Werte von alpha0 und alpha werden vorausgesetzt.

function startAngle (i) {
  switch (i) {                                             // Je nach Index ...
    case 0: return alpha0;                                 // R�ckgabewert f�r alpha
    case 1: return alpha0+alpha;                           // R�ckgabewert f�r beta (Nebenwinkel von alpha)
    case 2: return alpha0+Math.PI;                         // R�ckgabewert f�r gamma (Scheitelwinkel von alpha)
    case 3: return alpha0+Math.PI+alpha;                   // R�ckgabewert f�r delta (Nebenwinkel von alpha)
    }
  }
  
// Gr��e eines Winkels (Bogenma�):
// i ... Index (0 bis 3, alpha bis delta)
// Wichtig: Richtige Werte von alpha0 und alpha werden vorausgesetzt.
  
function sizeAngle (i) {
  switch (i) {                                             // Je nach Index ...
    case 0: case 2: return alpha;                          // R�ckgabewert f�r alpha oder gamma
    case 1: case 3: return Math.PI-alpha;                  // R�ckgabewert f�r beta oder delta
    }
  }
  
// �berpr�fung, ob Winkel im Gegenuhrzeigersinn:
// (ax,ay) ... Punkt auf dem ersten Schenkel
// (bx,by) ... Scheitel
// (cx,cy) ... Punkt auf dem zweiten Schenkel
  
function counterClock (ax, ay, bx, by, cx, cy) {
  var ux = ax-bx, uy = ay-by;                              // Richtungsvektor 1. Schenkel
  var vx = cx-bx, vy = cy-by;                              // Richtungsvektor 2. Schenkel
  return (ux*vy-uy*vx < 0);                                // R�ckgabewert
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ... Gegebene Zahl
// d ... Anzahl der Nachkommastellen
  
function ToString (n, d) {
  var s = n.toFixed(d);                                    // Zeichenkette (Punkt als Dezimaltrennzeichen)
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Ausgabe der Winkelgr��en:
// Wichtig: Der richtige Wert von alpha (berechnet in der paint-Methode) wird vorausgesetzt.
  
function updateOutput () {
  var i1 = ch1.selectedIndex;                              // Winkelpaar-Index f�r 1. Kreuzung (0 bis 3)
  var i2 = i1;                                             // Winkelpaar-Index f�r 2. Kreuzung �bernehmen (Stufenwinkel)
  if (rb2.checked) i2 = (i1+2)%4;                          // Winkelpaar-Index f�r 2. Kreuzung anpassen (Wechselwinkel) 
  else if (rb3.checked) i2 = 3-i1;                         // Winkelpaar-Index f�r 2. Kreuzung anpassen (Nachbarwinkel)
  var d = ch2.selectedIndex;                               // Zahl der Nachkommastellen (0 bis 5)
  var w1 = (i1%2==0 ? alpha : Math.PI-alpha);              // Winkel an der 1. Kreuzung
  var w2 = (rb3.checked ? Math.PI-w1 : w1);                // Winkel an der 2. Kreuzung
  op1.innerHTML = angle1[i1]+" = "+ToString(w1/DEG,d)+"\u00B0"; // Winkel an der 1. Kreuzung ausgeben
  op2.innerHTML = angle2[i2]+" = "+ToString(w2/DEG,d)+"\u00B0"; // Winkel an der 2. Kreuzung ausgeben
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt zeichnen:
// p ... Punkt (Attribute x, y)

function point (p) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,2,0,PI2,true);                           // Kreis vorbereiten
  ctx.fillStyle = colorPoint;                              // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit Rand
  }
  
// Verbindungsgerade zeichnen:
// p1, p2 ... Bestimmungspunkte (Attribute x, y)

function line (p1, p2) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var dx = p2.x-p1.x, dy = p2.y-p1.y;                      // Verbindungsvektor
  var d = Math.sqrt(dx*dx+dy*dy);                          // Betrag Verbindungsvektor
  if (d == 0) return;                                      // Falls Gerade nicht definiert, abbrechen
  var f = 1000/d;                                          // Faktor f�r Linie der L�nge 1000 (Pixel)
  dx *= f; dy *= f;                                        // Verbindungsvektor mit Betrag 1000
  ctx.moveTo(p1.x-dx,p1.y-dy);                             // Anfangspunkt 
  ctx.lineTo(p2.x+dx,p2.y+dy);                             // Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Kreis zeichnen (nur Rand):
  
function circle (p, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(p.x,p.y,r,0,PI2,true);                           // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
    
// Farbige Winkelmarkierung (ohne Rand, Gegenuhrzeigersinn):
// (x,y) ... Scheitel
// r ....... Radius
// a0 ...... Startwinkel (Bogenma�)
// a ....... Winkelbetrag (Bogenma�)
// c ....... F�llfarbe 

function angle (x, y, r, a0, a, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));           // Linie auf dem ersten Schenkel
  ctx.arc(x,y,r,PI2-a0,PI2-a0-a,true);                     // Kreisbogen
  ctx.closePath();                                         // Zur�ck zum Scheitel
  ctx.fill();                                              // Kreissektor ausf�llen
  }
  
// Winkelmarkierung zeichnen:
// i ...... Index des Winkels (0 f�r alpha bis 3 f�r delta)
// type ... Nummer der Geradenkreuzung (1 oder 2)
// Seiteneffekt alpha0, alpha

function anglePPP (i, type) {
  var ux = q1.x-p1.x, uy = p1.y-q1.y;                      // Richtungsvektor 1. Schenkel
  alpha0 = Math.atan2(uy,ux);                              // Startwinkel f�r alpha (Bogenma�, -pi bis +pi)
  var vx = p2.x-p1.x, vy = p1.y-p2.y;                      // Richtungsvektor 2. Schenkel
  var sp = ux*vx+uy*vy;                                    // Skalarprodukt der Richtungsvektoren
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag des 1. Richtungsvektors
  var v = Math.sqrt(vx*vx+vy*vy);                          // Betrag des 2. Richtungsvektors
  alpha = Math.acos(sp/(u*v));                             // Betrag von alpha
  if (alpha0 < 0) alpha0 += PI2;                           // 0 <= Startwinkel <= 2 pi erzwingen
  var a0 = startAngle(i);                                  // Startwinkel
  var a = sizeAngle(i);                                    // Winkelbetrag
  var sx = (type==1 ? p1.x : p2.x);                        // x-Koordinate Scheitel
  var sy = (type==1 ? p1.y : p2.y);                        // y-Koordinate Scheitel
  angle(sx,sy,R,a0,a,colorAngle[i]);                       // Winkelmarkierung
  }
  
// Winkel beschriften:
// (x,y) ... Scheitel
// r ....... Radius f�r Winkelmarkierung (Pixel)
// a0 ...... Startwinkel der Winkelmarkierung (Bogenma�)
// a ....... Winkelgr��e (Bogenma�)
// t ....... Beschriftung
  
function nameAngle (x, y, r, a0, a, t) {
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  var tr = 0.6*r;                                          // Abstand vom Scheitel
  var ta = a0+a/2;                                         // Positionswinkel (Bogenma�)
  var tx = x+tr*Math.cos(ta), ty = y-tr*Math.sin(ta)+4;    // Koordinaten 
  ctx.fillText(t,tx,ty);                                   // Beschriftung
  }
  
// Winkel beschriften:
// i ...... Index des Winkelpaars (0 bis 3)
// type ... Nummer der Geradenkreuzung (1 oder 2)
  
function nameAnglePPP (i, type) {
  var sx = (type==1 ? p1.x : p2.x);                        // x-Koordinate Scheitel
  var sy = (type==1 ? p1.y : p2.y);                        // y-Koordinate Scheitel
  var a0 = startAngle(i);                                  // Startwinkel Winkelmarkierung (Bogenma�)
  var a = sizeAngle(i);                                    // Winkelgr��e (Bogenma�)
  var t = (type==1 ? angle1[i] : angle2[i]);               // Bezeichnung
  nameAngle(sx,sy,R,a0,a,t);                               // Beschriftung
  }
     
// Grafikausgabe:
// Seiteneffekt alpha0, alpha
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);            // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  var i1 = ch1.selectedIndex;                              // Index f�r alpha/beta/gamma/delta
  var i2 = ch1.selectedIndex;                              // Index f�r zugeh�rigen Stufenwinkel
  if (rb2.checked) i2 = (i2+2)%4;                          // Index f�r zugeh�rigen Wechselwinkel
  else if (rb3.checked) i2 = 3-i2;                         // Index f�r zugeh�rigen Nachbarwinkel
  anglePPP(i1,1);                                          // Winkelmarkierung an 1. Kreuzung (ohne Rand, Seiteneffekt!)
  anglePPP(i2,2);                                          // Winkelmarkierung an 2. Kreuzung (ohne Rand, Seiteneffekt!)
  for (i=0; i<4; i++) nameAnglePPP(i,1);                   // Winkel an 1. Kreuzung beschriften
  for (i=0; i<4; i++) nameAnglePPP(i,2);                   // Winkel an 2. Kreuzung beschriften
  circle(p1,R); circle(p2,R);                              // Kreise f�r Winkelmarkierungen
  line(p1,q1); line(p2,q2);                                // Parallele Geraden
  line(p1,p2);                                             // Kreuzungsgerade
  point(p1); point(p2);                                    // Kreuzungspunkte
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

