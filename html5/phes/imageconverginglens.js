// Bilderzeugung Sammellinse
// Java-Applet (23.12.2008) umgewandelt
// 07.10.2016 - 16.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel imageconverginglens_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorLens = "#00ffff";                                 // Farbe für Linse
var colorLight = "#ff0000";                                // Farbe für Lichtstrahlen
var colorObject = "#0000ff";                               // Farbe für Gegenstand
var colorImageReal = "#008000";                            // Farbe für reelles Bild
var colorImageVirtual = "#00ff00";                         // Farbe für virtuelles Bild
var colorEmphasize = "#ff00ff";                            // Farbe für Hervorhebungen
var colorScale1 = "#00ff00";                               // Farbe 1 für Lineal
var colorScale2 = "#ffc800";                               // Farbe 2 für Lineal

// Sonstige Konstanten:

var PIX = 500;                                             // Umrechnungsfaktor (Pixel pro m)
var MIN_F = 0.05, MAX_F = 0.25;                            // Minimale/Maximale Brennweite (m)
var MIN_G = 0.00, MAX_G = 1.00;                            // Minimale/Maximale Gegenstandsweite (m)
var MIN_GG = 0.00, MAX_GG = 0.25;                          // Minimale/Maximale Gegenstandsgröße (m)
var MAX_T = 6;                                             // Maximale Dauer der Animation (s)
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)

var ip1, ip2, ip3;                                         // Eingabefelder
var op1, op2, op3a, op3b, op3c;                            // Ausgabefelder
var rb1, rb2;                                              // Radiobuttons
var ch;                                                    // Auswahlfeld

var drag;                                                  // Flag für Zugmodus
var nL;                                                    // Brechungsindex der Linse
var f;                                                     // Brennweite (m)
var rL;                                                    // Linsenradius (m)
var hdL;                                                   // Halbe Linsendicke (m)
var g;                                                     // Gegenstandsweite (m)
var b;                                                     // Bildweite (m)
var gg;                                                    // Gegenstandsgröße (m)
var bb;                                                    // Bildgröße (m)
var uO;                                                    // Position Gegenstand (Pixel)
var uL;                                                    // Position Linse (Pixel)
var uI;                                                    // Position Bild (Pixel)
var uS;                                                    // Position Mattscheibe (Pixel) 
var vA;                                                    // Position der optischen Achse (Pixel)
var nr;                                                    // Nummer (Gegenstand/Größe/Linse/Mattscheibe)
var timer;                                                 // Timer für Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("ip1a",text01);                               // Erklärender Text (Brennweite)
  ip1 = getElement("ip1b");                                // Eingabefeld (Brennweite)
  getElement("ip1c",centimeter);                           // Einheit (Brennweite)
  getElement("ip2a",text02);                               // Erklärender Text (Gegenstandsweite)
  ip2 = getElement("ip2b");                                // Eingabefeld (Gegenstandsweite)
  getElement("ip2c",centimeter);                           // Einheit (Gegenstandsweite)
  getElement("ip3a",text03);                               // Erklärender Text (Gegenstandsgröße)
  ip3 = getElement("ip3b");                                // Eingabefeld (Gegenstandsgröße)
  getElement("ip3c",centimeter);                           // Einheit (Gegenstandsgröße)
  getElement("op1a",text04);                               // Erklärender Text (Bildweite)
  op1 = getElement("op1b");                                // Ausgabefeld (Bildweite)  
  getElement("op1c",centimeter);                           // Einheit (Bildweite)
  getElement("op2a",text05);                               // Erklärender Text (Bildgröße)
  op2 = getElement("op2b");                                // Ausgabefeld (Bildgröße)  
  getElement("op2c",centimeter);                           // Einheit (Bildgröße)
  getElement("op3x",text06);                               // Erklärender Text (Art des Bildes)
  op3a = getElement("op3a");                               // Ausgabefeld (reell/virtuell)
  op3b = getElement("op3b");                               // Ausgabefeld (umgekehrt/aufrecht)
  op3c = getElement("op3c");                               // Ausgabefeld (verkleinert/vergrößert)  
  rb1 = getElement("rb1");                                 // Radiobutton (spezielle Lichtstrahlen)
  rb1.checked = true;                                      // Radiobutton zunächst ausgewählt
  getElement("lb1",text10);                                // Erklärender Text (spezielle Lichtstrahlen)
  rb2 = getElement("rb2");                                 // Radiobutton (Lichtbündel)
  getElement("lb2",text11);                                // Erklärender Text (Lichtbündel)
  getElement("lb3",text12);                                // Erklärender Text (Hervorheben)
  ch = getElement("ch");                                   // Auswahlfeld (Hervorheben)
  initSelect();                                            // Auswahlfeld vorbereiten
  getElement("author",author);                             // Autor (und Übersetzer)
  
  nL = 1.8;                                                // Brechungsindex
  f = 0.1;                                                 // Brennweite (m) 
  g = 0.5;                                                 // Gegenstandsweite (m)
  gg = 0.1;                                                // Gegenstandsgröße (m)
  uO = 20;                                                 // Waagrechte Koordinate Gegenstand (Pixel)
  uS = 420;                                                // Waagrechte Koordinate Mattscheibe (Pixel)        
  nr = 0;                                                  // Zunächst kein Bestandteil der Anordnung ausgewählt
  vA = height/2-20;                                        // Senkrechte Koordinate der optischen Achse (Pixel)
  drag = false;                                            // Zugmodus zunächst deaktiviert
  t = 0;                                                   // Zeitvariable (s)  
  updateInput();                                           // Eingabefelder aktualisieren                                   
  reaction();                                              // Rechnung, Ausgabe, neu zeichnen
  focus(ip1);                                              // Fokus für erstes Eingabefeld

  ip1.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Eingabe Brennweite)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Eingabe Gegenstandsweite)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Eingabe Gegenstandsgröße)
  ip1.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Eingabe Brennweite)
  ip2.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Eingabe Gegenstandsweite)
  ip3.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Eingabe Gegenstandsgröße)
  rb1.onclick = reaction;                                  // Reaktion auf Radiobutton (spezielle Lichtstrahlen)
  rb2.onclick = reaction;                                  // Reaktion auf Radiobutton (Lichtbündel)
  ch.onchange = startAnimation;                            // Reaktion auf Auswahlfeld (Hervorheben)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers   
  } // Ende der Methode start
  
// Initialisierung der Auswahlliste:
  
function initSelect () {
  for (var i=0; i<text13.length; i++) {                    // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text13[i];                                    // Text übernehmen 
    ch.add(o);                                             // Element zur Liste hinzufügen
    }
  o = document.createElement("option");                    // Neues option-Element
  o.text = "";                                             // Leere Zeichenkette als Text
  ch.add(o);                                               // Element zur Liste hinzufügen
  ch.selectedIndex = text13.length;                        // Zunächst Element mit leerem Text ausgewählt
  }
  
// Reaktion auf Verlust des Fokus:
// Seiteneffekt uO, f, g, gg, rL, hdL, b, bb, uL, uI, t, t0, timer

function reactionBlur () {
  input();                                                 // Eingabe
  reaction();                                              // Berechnungen, Ausgabe, neu zeichnen
  }
    
// Reaktion auf Eingabe mit Enter-Taste:
// Seiteneffekt uO, f, g, gg, rL, hdL, b, bb, uL, uI, t, t0, timer
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (enter) reactionBlur();                               // Falls Enter-Taste, Daten übernehmen, rechnen und neu zeichnen                    
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Eventuell Zugmodus aktivieren                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {
  var obj = e.changedTouches[0];
  reactionDown(obj.clientX,obj.clientY);                   // Eventuell Zugmodus aktivieren      
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
  
// Reaktion auf Mausklick oder Berührung:
// Seiteneffekt nr, drag

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  var dx = x-uO, dy = y-vA;                                // Koordinatendifferenzen für Pfeilanfang Gegenstand (Pixel)
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand (Pixel)
  var dMin = d;                                            // Variable für minimalen Abstand                                 
  nr = 1;                                                  // Gegenstandsweite ausgewählt
  dy = y-(vA-gg*PIX);                                      // Koordinatendifferenz für Pfeilspitze Gegenstand (Pixel)
  d = Math.sqrt(dx*dx+dy*dy);                              // Abstand (Pixel)
  if (d < dMin) {dMin = d; nr = 2;}                        // Falls näher, Gegenstandsgröße ausgewählt
  d = Math.abs(x-uL);                                      // Abstand zur Linsenebene (Pixel)
  if (d < dMin) {dMin = d; nr = 3;}                        // Falls näher, Linse ausgewählt 
  d = Math.abs(x-uS);                                      // Abstand zur Ebene der Mattscheibe (Pixel)
  if (d < dMin) {dMin = d; nr = 4;}                        // Falls näher, Mattscheibe ausgewählt 	
  if (dMin > 20) nr = 0;                                   // Falls Abstand zu groß, nichts ausgewählt
  if (nr > 0) drag = true;                                 // Gegebenenfalls Zugmodus aktivieren
  }
    
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt uO, g, gg, uL, uS, rL, hdL, b, bb, uI, t, t0, timer, Wirkung auf Ein- und Ausgabefelder

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  if (u < 20) u = 20;                                      // Falls zu weit links, korrigieren
  if (u > width-40) u = width-40;                          // Falls zu weit rechts, korrigieren
  var hdlPix = hdL*PIX;                                    // Halbe Linsendicke (Pixel)
  if (nr == 1 || nr == 2) {                                // Falls Gegenstandsweite oder -größe ausgewählt ...
    u = uL-corrPix(uL-u,MIN_G,MAX_G);                      // Zu kleine und zu große Gegenstandsweite verhindern
    u = uL-Math.max(uL-u,hdlPix);                          // Überschneidung mit Linse vermeiden
    uO = u;                                                // Korrigierte Position des Gegenstands (Pixel) 
    g = (uL-uO)/PIX;                                       // Gegenstandsweite (m) aktualisieren
    ip2.value = ToString(g*100,1,true);                    // Eingabefeld Gegenstandsweite (cm) aktualisieren
    }
  if (nr == 2) {                                           // Falls Gegenstandsgröße ausgewählt ... 
    v = vA-corrPix(vA-v,MIN_GG,MAX_GG);                    // Zu kleine und zu große Gegenstandsgröße verhindern
    gg = (vA-v)/PIX;                                       // Gegenstandsgröße (m) aktualisieren
    ip3.value = ToString(gg*100,1,true);                   // Eingabefeld Gegenstandsgröße (cm) aktualisieren
    }
  if (nr == 3) {                                           // Falls Linsenposition ausgewählt ...
    u = uO+corrPix(u-uO,MIN_G,MAX_G);                      // Zu kleine und zu große Gegenstandsweite verhindern
    u = uO+Math.max(u-uO,hdlPix);                          // Überschneidung mit Gegenstand vermeiden
    u = uS-Math.max(uS-u,hdlPix);                          // Überschneidung mit Mattscheibe vermeiden
    uL = u;                                                // Korrigierte Position der Linse (Pixel)
    g = (uL-uO)/PIX;                                       // Gegenstandsweite (m) aktualisieren
    ip2.value = ToString(g*100,1,true);                    // Eingabefeld Gegenstandsweite (cm) aktualisieren
    }
  if (nr == 4) {                                           // Falls Position der Mattscheibe ausgewählt ... 
    u = uL+Math.max(u-uL,hdlPix);                          // Überschneidung mit Linse vermeiden
    uS = u;                                                // Korrigierte Position der Mattscheibe (Pixel)
    }
  reaction();                                              // Berechnungen, Ausgabe, neu zeichnen
  }
  
// Animation starten:
// Seiteneffekt t, timer, t0

function startAnimation () {
  if (timer) clearInterval(timer);                         // Timer deaktivieren, falls nötig
  t = 0;                                                   // Zeitvariable zurücksetzen
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Bezugszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt timer, t, Wirkung auf Auswahlfeld

function stopAnimation () {
  ch.selectedIndex = text13.length;                        // Leere Zeile in Auswahlfeld
  clearInterval(timer);                                    // Timer deaktivieren
  t = 0;                                                   // Zeitvariable zurücksetzen
  }

//-------------------------------------------------------------------------------------------------

// Berechnungen:
// Seiteneffekt rL, hdL, b, bb, uL, uI 

function calculation () {
  var krL = (nL-1)*2*f;                                    // Krümmungsradius der Linse (m)
  rL = krL/2;                                              // Linsenradius (m)
  hdL = krL-Math.sqrt(krL*krL-rL*rL);                      // Halbe Dicke der Linse (m)
  b = f*g/(g-f);                                           // Bildweite (m)
  bb = gg*b/g;                                             // Bildgröße (m)
  uL = uO+g*PIX;                                           // Position Linse (Pixel)
  uI = uO+(g+b)*PIX;                                       // Position Bild (Pixel)
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Nachkommastellen
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl
  
function inputNumber (ef, d, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(decimalSeparator,".");                     // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,true);                           // Eingabe verwenden (eventuell korrigiert)
  return n;                                                // Rückgabewert
  }
   
// Gesamte Eingabe:
// Seiteneffekt uO, f, g, gg  

function input () {
  var ae = document.activeElement;                         // Aktives Element
  uO = 20;  	                                           // Position Gegenstand (Pixel)
  f = inputNumber(ip1,1,100*MIN_F,100*MAX_F,1)/100;        // Brennweite (m)
  g = inputNumber(ip2,1,100*MIN_G,100*MAX_G,1)/100;        // Gegenstandsweite (m)
  gg = inputNumber(ip3,1,100*MIN_GG,100*MAX_GG,1)/100;     // Gegenstandsgröße (m)
  if (ae == ip1) focus(ip2);                               // Fokus für nächstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus für nächstes Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(100*f,1,true);                      // Brennweite
  ip2.value = ToString(100*g,1,true);                      // Gegenstandsweite
  ip3.value = ToString(100*gg,1,true);                     // Gegenstandsgröße
  }
  
// Hilfsroutine: Ausgabe einer Länge in cm, falls sinnvolle Gegenstandsweite

function update1 (op, val) {
  op.innerHTML = (g>0 && g!=f ? ToString(100*val,1,true) : ""); 
  }
  
// Hilfsroutine: Textausgabe, abhängig von Bedingungen
// op ............... Ausgabefeld
// text ............. Array von Texten
// c1, c2, c3, c4 ... Bedingungen, die sich gegenseitig ausschließen 
  
function update2 (op, text, c1, c2, c3, c4) {
  var s = "";                                              // Falls keine Bedingung erfüllt, leere Zeichenkette
  if (c1) s = text[0];                                     // Entweder Text für 1. Bedingung ...
  else if (c2) s = text[1];                                // ... oder Text für 2. Bedingung ...
  else if (c3) s = text[2];                                // ... oder Text für 3. Bedingung ...
  else if (c4) s = text[3];                                // ... oder Text für 4. Bedingung
  op.innerHTML = s;                                        // Ausgabefeld aktualisieren
  }

// Aktualisierung der Ausgabefelder:

function updateOutput () {
  update1(op1,b);                                          // Ausgabefeld Bildweite
  update1(op2,bb);                                         // Ausgabefeld Bildgröße
  update2(op3a,text07,g>f,g<f);                            // Ausgabefeld reell/virtuell
  update2(op3b,text08,g>f,g<f);                            // Ausgabefeld umgekehrt/aufrecht
  update2(op3c,text09,g>2*f,g==2*f,g!=f,g==f);             // Ausgabefeld Verkleinerung/Vergrößerung
  }
  
// Reaktion: Rechnung, Ausgabe, neu zeichnen
// Seiteneffekt rL, hdL, b, bb, uL, uI, t, t0, timer, Wirkung auf Ausgabefelder 

function reaction () {
  calculation();                                           // Berechnungen durchführen
  updateOutput();                                          // Ausgabefelder aktualisieren
  paint();                                                 // Neu zeichnen
  }
   
// Eingabe korrigieren (Bereich):
// z ..... Ursprünglicher Wert (Pixel)
// min ... kleinster erlaubter Wert (m)
// max ... größter erlaubter Wert (m)
// Rückgabewert korrigiert (Pixel)
    
function corrPix (z, min, max) {
  if (z < min*PIX) z = min*PIX;                            // Zu kleinen Wert verhindern
  if (z > max*PIX) z = max*PIX;                            // Zu großen Wert verhindern
  return z;                                                // Rückgabewert
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Durchgezogene Linie:
// (u1,v1) ... Anfangspunkt (Pixel)
// (u2,v2) ... Endpunkt (Pixel)
// c ......... Farbe (optional)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (u1, v1, u2, v2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gestrichelte Linie zum Grafikpfad hinzufügen (ohne Zeichnen):
// (u1,v1) ... Anfangspunkt (Pixel)
// (u2,v2) ... Endpunkt (Pixel)

function dashedLine (u1, v1, u2, v2) {
  var du = u2-u1, dv = v2-v1;                              // Koordinatendifferenzen (Pixel)
  var l = Math.sqrt(du*du+dv*dv);                          // Länge (Pixel)
  var n = Math.floor((l-4)/6);                             // Zahl der Lücken
  var p = (l/2+2-3*n)/l;                                   // Parameter am Ende der ersten Linie
  ctx.moveTo(u1,v1);                                       // Zum Anfangspunkt
  ctx.lineTo(u1+p*du,v1+p*dv);                             // Weiter zum Ende der ersten Linie
  while (p < 1) {                                          // Solange Endpunkt noch nicht erreicht ...
    p += 2/l; if (p >= 1) break;                           // Parameter für Ende der nächsten Lücke
    ctx.moveTo(u1+p*du,v1+p*dv);                           // Zum Anfangspunkt der nächsten Linie
    p += 4/l; if (p > 1) p = 1;                            // Parameter für Ende der Linie
    ctx.lineTo(u1+p*du,v1+p*dv);                           // Linie hinzufügen
    }
  }
  
// Linie (gestrichelt oder durchgezogen) zum Grafikpfad hinzufügen (ohne Zeichnen):
// (u1,v1) ... Anfangspunkt (Pixel)
// (u2,v2) ... Endpunkt (Pixel)
// dashed .... Flag für gestrichelte Linie
  
function addLine (u1, v1, u2, v2, dashed) {
  if (dashed) dashedLine(u1,v1,u2,v2);                     // Entweder gestrichelte ...                 
  else {ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);}             // ... oder durchgezogene Linie
  }

// Rechteck mit schwarzem Rand:
// (x,y) ... Koordinaten der Ecke links oben (Pixel)
// w ....... Breite (Pixel)
// h ....... Höhe (Pixel)
// c ....... Füllfarbe (optional)

function rectangle (x, y, w, h, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausfüllen
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen
  }
  
// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... Füllfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausfüllen
  ctx.stroke();                                            // Rand zeichnen
  }
    
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // Länge
  if (length == 0) return;                                 // Abbruch, falls Länge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt für Pfeilspitze         
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
  ctx.beginPath();                                         // Neuer Pfad für Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Text ausrichten:
// s ....... Zeichenkette
// t ....... Typ (0 für linksbündig, 1 für zentriert, 2 für rechtsbündig)
// (x,y) ... Position (Pixel)

function alignText (s, t, x, y) {
  if (t == 0) ctx.textAlign = "left";                      // Je nach Wert von t linksbündig ...
  else if (t == 1) ctx.textAlign = "center";               // ... oder zentriert ...
  else ctx.textAlign = "right";                            // ... oder rechtsbündig
  ctx.fillText(s,x,y);                                     // Text ausgeben
  }
  	  
// Längenskala mit Positionsmarkierungen:
    
function scale () {
  for (var i=0; i<20; i++) {                               // Für alle Indizes ...                
    var f = (i%2==0 ? colorScale1 : colorScale2);          // Farbe
    rectangle(20+i*25,height-45,25,8,f);                   // Ausgefülltes Rechteck
    }
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (i=0; i<=10; i++)                                    // Für alle Indizes ...
    alignText(""+10*i+" "+centimeter,2,40+i*50,height-20); // Beschriftung (0 cm bis 100 cm)
  var v1 = height-50, v2 = height-32;                      // Senkrechte Koordinaten oben/unten (Pixel)
  line(uO,v1,uO,v2);                                       // Positionsmarkierung Gegenstand
  line(uL,v1,uL,v2);                                       // Positionsmarkierung Linse
  line(uI,v1,uI,v2);                                       // Positionsmarkierung Bild
  line(uS,v1,uS,v2);                                       // Positionsmarkierung Mattscheibe
  }
  
// Linse:
// x ... x-Koordinate der Linsenebene (Pixel)
// a ... Halbe Dicke (Pixel)
// b ... Halber Durchmesser (Pixel)
// f ... Flag für ausgefüllte Fläche
  	
function lens (x, a, b, f) {
  var r = (a*a+b*b)/(2*a);                                 // Krümmungsradius (Pixel)
  var w = Math.asin(b/r);                                  // Maximaler Winkel (Bogenmaß)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x-r+a,vA,r,+w,-w,true);                          // Kreisbogen links vorbereiten
  ctx.arc(x+r-a,vA,r,Math.PI+w,Math.PI-w,true);            // Kreisbogen rechts vorbereiten
  if (f) {                                                 // Falls Linse ausgefüllt werden soll ...
    ctx.fillStyle = colorLens;                             // Farbe der Linse
    ctx.fill();                                            // Fläche ausfüllen
    }
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Lichtstrahl:
// alpha .... Winkel gegenüber der Waagrechten (Bogenmaß, Gegenuhrzeiger)
// dashed ... Flag für gestrichelte Linien
  
function ray (alpha, dashed) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = colorLight;                            // Linienfarbe
  var x0 = uO, y0 = vA-gg*PIX;                             // Pfeilspitze Gegenstand (Pixel)
  var x1 = uO+g*PIX, y1 = y0-g*PIX*Math.tan(alpha);        // Punkt in der Linsenebene (Pixel)
  addLine(x0,y0,x1,y1,dashed);                             // Linie vom Gegenstand bis zur Linsenebene                       
  var m = -(vA-y1+bb*PIX)/(b*PIX);                         // Steigung (Normalfall)
  if (g == f) m = -gg/g;                                   // Steigung (Sonderfall)
  var dx = width-20-x1;                                    // Koordinatendifferenz waagrecht (Pixel)
  var x2 = x1+dx, y2 = y1-m*dx;                            // Punkt rechts von der Linse (Pixel)
  addLine(x1,y1,x2,y2,dashed);                             // Linie von der Linsenebene nach rechts                             
  if (g < f) {                                             // Falls virtuelles Bild ...
    x2 = x1+b*PIX; y2 = vA+bb*PIX;                         // Pfeilspitze Bild (Pixel)
    dashedLine(x1,y1,x2,y2);                               // Gestrichelte Linie nach links oben
    } 
  ctx.stroke();                                            // Alle Teile des Lichtstrahls zeichnen 
  }
  	  
// Spezielle Lichtstrahlen (Parallel-, Mittelpunkts- und Brennpunktsstrahl)
    
function specialRays () {
  ray(0,gg>rL);                                            // Parallelstrahl
  ray(-Math.atan(gg/g),false);                             // Mittelpunktsstrahl
  if (g != f) ray(-Math.atan(gg/(g-f)),bb>rL);             // Brennpunktsstrahl (Normalfall) 
  else line(uO,vA-gg*PIX,uO,vA+500);                       // Brennpunktsstrahl (Sonderfall)  
  }
  
// Lichtbündel:
    
function manyRays () {
  var wiMin = -Math.atan((gg+rL)/g);                       // Kleinster Winkel (Bogenmaß)
  var wiMax = Math.atan((rL-gg)/g);                        // Größter Winkel (Bogenmaß)
  var dw = wiMax-wiMin;                                    // Unterschied (Bogenmaß)
  var n = Math.floor(dw/0.04);                             // Vorläufige Zahl der Lichtstrahlen plus 1
  if (g < f) n /= 2;                                       // Falls virtuelles Bild, weniger Lichtstrahlen
  dw /= n;                                                 // Winkelunterschied für benachbarte Strahlen (Bogenmaß)
  for (var i=0; i<=n; i++) ray(wiMin+i*dw,false);          // Strahlen zeichnen
  }
  
// Hilfsroutine zur Hervorhebung durch Blinken:
// iA ... Index im Auswahlfeld
// i .... Art des Blinkens
// i = 0: Normalerweise sichtbar, ggf. blinkend
// i = 1: Normalerweise unsichtbar, ggf. in geraden Sekunden blinkend
// i = 2: Normalerweise unsichtbar, ggf. in ungeraden Sekunden blinkend
// i = 3: Normalerweise unsichtbar, ggf. blinkend
// i = 4: Normalerweise unsichtbar, ggf. dauerhaft sichtbar
  
function visible (iA, i) {
  var iSelect = ch.selectedIndex;                          // Gewählter Index im Auswahlfeld
  var normal = (iSelect == text13.length || iSelect != iA);// Überprüfung auf Normalfall (kein Blinken)
  if (i > 0 && normal) return false;                       // Rückgabewert für Typ ungleich 0 im Normalfall
  if (i == 0 && normal) return true;                       // Rückgabewert für Typ 0 im Normalfall
  var tt = Math.floor(t);                                  // Beginn der vollen Sekunde
  var sb = (t-tt >= 0.3);                                  // Überprüfung, ob Zeit innerhalb von 0,3 s
  if (i == 0) return sb;                                   // Rückgabewert für Typ 0
  else if (i == 1) return (sb && tt%2==0);                 // Rückgabewert für Typ 1
  else if (i == 2) return (sb && tt%2==1);                 // Rückgabewert für Typ 2
  else if (i == 3) return sb;                              // Rückgabewert für Typ 3
  else return true;                                        // Rückgabewert für Typ 4
  }
    
// Waagrechte Linie ab Linsenebene mit Beschriftung:
// du ..... Vorzeichenbehaftete Länge (nach rechts +, nach links -, Pixel)
// text ... Beschriftungstext
    
function horLineText (du, text) {
  line(uL,vA+140,uL+du,vA+140);                            // Waagrechte Linie
  alignText(text,1,uL+du/2,vA+152);                        // Beschriftung
  }
  
// Senkrechte Linie ab optischer Achse mit Beschriftung:
// right ... Flag für Beschriftung rechts
// u ....... Waagrechte Koordinate
// dv ...... Vorzeichenbehaftete Länge (nach oben +, nach unten -, Pixel)
// text .... Beschriftungstext
  
function vertLineText (right, u, dv, text) {
  line(u,vA,u,vA-dv);                                      // Senkrechte Linie
  alignText(text,right?0:2,right?u+5:u-5,vA+5-dv/2);       // Beschriftung
  }
    
// Senkrechte gestrichelte Hilfslinie:
// u ... Waagrechte Koordinate (Pixel)
  
function auxiliaryLine (u) {
  var c = ctx.strokeStyle;                                 // Bisherige Linienfarbe speichern
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  dashedLine(u,vA,u,vA+150);                               // Gestrichelte Linie vorbereiten
  ctx.stroke();                                            // Gestrichelte Linie zeichnen
  ctx.strokeStyle = c;                                     // Frühere Linienfarbe wiederherstellen
  }
  
// Grafikausgabe:
// Seiteneffekt t, t0, timer
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (ch.selectedIndex < text13.length) {                  // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Neuer Bezugszeitpunkt
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    t0 = t1;                                               // Bezugszeitpunkt aktualisieren
    if (t > MAX_T) {                                       // Falls maximale Dauer der Animation überschritten ...
      stopAnimation();                                     // Animation abschalten 
      paint();                                             // Nochmal zeichnen
      } 
    }
  ctx.font = FONT;                                         // Zeichensatz
  lens(uL,hdL*PIX,rL*PIX,visible(3,0));                    // Linse        
  if (visible(5,0)) line(10,vA,width-10,vA);               // Optische Achse
  var u = uO+(g-f)*PIX;                                    // Position linker Brennpunkt (Pixel)
  line(u,vA-5,u,vA+5);                                     // Markierung linker Brennpunkt
  u = uO+(g+f)*PIX;                                        // Position rechter Brennpunkt (Pixel)
  line(u,vA-5,u,vA+5);                                     // Markierung rechter Brennpunkt
  if (visible(4,0)) line(uL,vA-150,uL,vA+150);             // Linsenebene
  if (visible(11,0)) line(uS,vA-150,uS,vA+150);            // Mattscheibe
  if (rb1.checked) specialRays();                          // Entweder spezielle Lichtstrahlen ...
  else manyRays();                                         // ... oder Lichtbündel     
  ctx.strokeStyle = colorObject;                           // Farbe für Gegenstand
  var ggPix = gg*PIX;                                      // Gegenstandsgröße (Pixel)
  if (visible(0,0)) arrow(uO,vA,uO,vA-ggPix,2);            // Pfeil für Gegenstand
  ctx.strokeStyle = (g>=f ? colorImageReal : colorImageVirtual); // Farbe für Bild
  var bbPix = bb*PIX;                                      // Bildgröße (Pixel)
  if (visible(8,0)) arrow(uI,vA,uI,vA+bbPix,2);            // Pfeil für Bild (reell oder virtuell)
  ctx.strokeStyle = ctx.fillStyle = colorEmphasize;        // Farbe für Hervorhebungen
  if (visible(1,3)) horLineText(uO-uL,symbolG);            // Gegenstandsweite
  if (visible(1,4)) auxiliaryLine(uO);                     // Hilfslinie für Gegenstandsweite
  if (visible(2,3)) vertLineText(true,uO,ggPix,symbolGG);  // Gegenstandsgröße
  var fPix = f*PIX;
  if (visible(6,1)) circle(uL-fPix,vA,2.5,colorEmphasize); // Linker Brennpunkt
  if (visible(6,2)) circle(uL+fPix,vA,2.5,colorEmphasize); // Rechter Brennpunkt
  ctx.strokeStyle = colorEmphasize;                        // Farbe für Hervorhebungen
  if (visible(7,1)) horLineText(-fPix,symbolF);            // Linke Brennweite
  if (visible(7,2)) horLineText(fPix,symbolF);             // Rechte Brennweite
  if (visible(7,4)) {                                      // Falls Brennebenen eingezeichnet werden sollen ...
    auxiliaryLine(uL-fPix);                                // Linke Brennebene
    auxiliaryLine(uL+fPix);                                // Rechte Brennebene
    }
  if (visible(9,3)) horLineText(uI-uL,symbolB);            // Bildweite
  if (visible(9,4)) auxiliaryLine(uI);                     // Hilfslinie für Bildweite
  if (visible(10,3)) vertLineText(true,uI,-bbPix,symbolBB);// Bildgröße
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,height-60,width,60);                      // Ausgefülltes Rechteck (Clipping)
  scale();                                                 // Längenskala mit Positionsmarkierungen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



