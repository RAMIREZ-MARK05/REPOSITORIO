// Potentiometerschaltung
// Java-Applet (16.02.2006) umgewandelt
// 16.09.2016 - 15.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel potentiometer_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorVoltage = "#0000ff";                              // Farbe f�r Spannung
var colorAmperage = "#ff0000";                             // Farbe f�r Stromst�rke
var colorScale = "#ffc800";                                // Farbe f�r Skala

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Normaler Zeichensatz
var FONT2 = "normal normal bold 16px monospace";           // Zeichensatz f�r Amperemeter
var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var DY = 4;                                                // Verschiebung in y-Richtung (Pixel)
var X_POT = 100;                                           // Linker Rand des Schiebewiderstands (Pixel)
var W_POT = 200;                                           // L�nge des Schiebewiderstands

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ip1, ip2, ip3;                                         // Eingabefelder
var sl;                                                    // Schieberegler
var slL, slR;                                              // Schaltkn�pfe zur Feineinstellung des Schiebereglers
var cb1, cb2;                                              // Optionsfelder

var drag;                                                  // Flag f�r Zugmodus                           
  
var u0;                                                    // Spannung der Stromquelle (Volt)
var rv;                                                    // Verbraucherwiderstand (Ohm)
var rs;                                                    // Schiebewiderstand (Ohm)
var q;                                                     // Abgriffstelle (0 bis 1)
var uv;                                                    // Spannung am Verbraucher (Volt)

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
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("ip1a",text01);                               // Erkl�render Text (Spannung Stromquelle)
  ip1 = getElement("ip1b");                                // Eingabefeld (Spannung Stromquelle)
  getElement("ip1c",volt);                                 // Einheit (Spannung Stromquelle)
  getElement("ip2a",text02);                               // Erkl�render Text (Schiebewiderstand)
  ip2 = getElement("ip2b");                                // Eingabefeld (Schiebewiderstand)
  getElement("ip2c",ohm);                                  // Einheit (Schiebewiderstand)
  getElement("sla",text03);                                // Erkl�render Text (Position des Schleifkontakts)
  slL = getElement("slb");                                 // Feineinstellung Schieberegler links
  sl = getElement("slc");                                  // Schieberegler (Schleifkontakt)
  slR = getElement("sld");                                 // Feineinstellung Schieberegler rechts
  getElement("ip3a",text04);                               // Erkl�render Text (Verbraucherwiderstand)
  ip3 = getElement("ip3b");                                // Eingabefeld (Verbraucherwiderstand)
  getElement("ip3c",ohm);                                  // Einheit (Verbraucherwiderstand)   
  cb1 = getElement("cb1a");                                // Optionsfeld (Spannung angeben)
  cb1.checked = false;                                     // Optionsfeld zun�chst nicht ausgew�hlt
  getElement("cb1b",text05);                               // Erkl�render Text (Spannung angeben)
  cb2 = getElement("cb2a");                                // Optionsfeld (Stromst�rke angeben)
  cb2.checked = false;                                     // Optionsfeld zun�chst nicht ausgew�hlt
  getElement("cb2b",text06);                               // Erkl�render Text (Stromst�rke angeben)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  u0 = 5;                                                  // Spannung der Stromquelle (Volt)
  rs = 100;                                                // Schiebewiderstand (Ohm)
  q = 0.2;                                                 // Bruchteil (Schiebewiderstand links)
  rv = 500;                                                // Verbraucherwiderstand (Ohm)
  uv = voltageAppliance(q);                                // Spannung am Verbraucherwiderstand (V)      
  updateInput();                                           // Eingabefelder und Schieberegler aktualisieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  paint();                                                 // Neu zeichnen
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Spannung)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Schiebewiderstand)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Verbraucherwiderstand)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Spannung)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Schiebewiderstand)
  ip3.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Verbraucherwiderstand)
  cb1.onclick = paint;                                     // Reaktion auf Optionsfeld (Spannung angeben)
  cb2.onclick = paint;                                     // Reaktion auf Optionsfeld (Stromst�rke angeben)
  sl.oninput = reactionSlider;                             // Reaktion auf Schieberegler (Bewegung)
  sl.onchange = reactionSlider;                            // Reaktion auf Schieberegler (abgeschlossene Eingabe)
  slL.onclick = reactionSliderLeft;                        // Reaktion auf Feineinstellung Schieberegler (links)
  slR.onclick = reactionSliderRight;                       // Reaktion auf Feineinstellung Schieberegler (rechts)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers              
  } // Ende der Methode start
  
// Reaktion auf Schieberegler (Position Schleifkontakt):
// Seiteneffekt u0, rs, rv, q, uv 
  
function reactionSlider () {
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  }
  
// Reaktion auf Feineinstellung des Schiebereglers (links):
// Seiteneffekt u0, rs, rv, q, uv, Wirkung auf Schieberegler 
  
function reactionSliderLeft () {
  sl.value = Math.max(Number(sl.value)-1,0);               // Position um 1 nach links, falls m�glich
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  }
  
// Reaktion auf Feineinstellung des Schiebereglers (rechts):
// Seiteneffekt u0, rs, rv, q, uv, Wirkung auf Schieberegler
  
function reactionSliderRight () {
  sl.value = Math.min(Number(sl.value)+1,200);             // Position um 1 nach rechts, falls m�glich
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen                   
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                           
  reactionUp();                                            // Hilfsroutine aufrufen
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  reactionUp();                                            // Hilfsroutine aufrufen
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
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag 

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (Math.abs(u-(X_POT+q*W_POT)) < 50) drag = true;       // Gegebenenfalls Zugmodus aktivieren  
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt u0, rs, rv, q, uv, Wirkung auf Schieberegler  

function reactionMove (u, v) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (u < X_POT) u = X_POT;                                // Position links vom Schiebewiderstand korrigieren
  if (u > X_POT+W_POT) u = X_POT+W_POT;                    // Position rechts vom Schiebewiderstand korrigieren
  q = (u-X_POT)/W_POT;                                     // Position des Schleifkontakts (0 bis 1)
  sl.value = u-X_POT;                                      // Schieberegler aktualisieren
  reaction(true);                                          // Eingabe, Berechnungen, neu zeichnen
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Ber�hrung:
// Seiteneffekt drag
  
function reactionUp () {
  drag = false;                                            // Zugmodus beenden
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt u0, rs, rv, q, uv
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (enter) reaction(false);                              // Falls Enter-Taste, Daten �bernehmen, rechnen und neu zeichnen                        
  }
  
// Fokus f�r Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus f�r Eingabefeld
  var n = ip.value.length;                                 // L�nge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }

//-------------------------------------------------------------------------------------------------

// Hilfsroutine: Aufhellung eines Farbanteils
// c ... Zeichenkette f�r gegebene Farbe im Format "#rrggbb"
// i ... Index
// R�ckgabewert: Zweistellige Hexadezimalzahl als Zeichenkette 

function newPartRGB (c, i) {
  var p = c.substring(i,i+2);                              // Farbanteil (RGB, Zeichenkette) f�r gegebene Farbe
  var pp = Math.floor((2*parseInt(p,16)+255)/3);           // Farbanteil (RGB, Zahl) f�r aufgehellte Farbe
  return pp.toString(16);                                  // R�ckgabewert
  }
  
// Aufhellung einer Farbe:
// c ... Zeichenkette f�r gegebene Farbe im Format "#rrggbb"
// R�ckgabewert: Zeichenkette f�r aufgehellte Farbe im Format "#rrggbb" oder undefined

function lightColor (c) {
  if (!c.startsWith('#')) return undefined;                // Falls kein '#' am Anfang, R�ckgabewert undefiniert
  if (c.length != 7) return undefined;                     // Falls falsche L�nge, R�ckgabewert undefiniert
  var r = newPartRGB(c,1);                                 // Rotanteil der aufgehellten Farbe
  var g = newPartRGB(c,3);                                 // Gr�nanteil der aufgehellten Farbe
  var b = newPartRGB(c,5);                                 // Blauanteil der aufgehellten Farbe
  return "#"+r+g+b;                                        // R�ckgabewert
  }

// Berechnung der Verbraucherspannung:
// q ... Bruchteil (0 bis 1)
// R�ckgabewert: Verbraucherspannung (Volt)
  
function voltageAppliance (q) {
  var r1 = q*rs, r2 = rs-r1;                               // Teilspannungen Schiebewiderstand (Volt)
  var r1v = r1*rv/(r1+rv);                                 // Gesamtwiderstand Parallelschaltung (Ohm)
  return u0*r1v/(r1v+r2);                                  // R�ckgabewert
  }

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Wert einer physikalischen Gr��e als Zeichenkette:
// r ... Zahlenwert
// n ... Zahl der Nachkommastellen
// u ... Einheit
  
function value (r, n, u) {
  return ToString(r,n,true)+" "+u;                         // R�ckgabewert
  }
  
// Formatierte Ausgabe der Spannung f�r Digital-Voltmeter:
// u ... Spannung (Volt)
// R�ckgabewert: Zeichenkette im Format "00,00 V"
    
function stringVoltage (u) {
  var s = ToString(u,2,true);                              // Zeichenkette f�r Betrag in Volt 
  while (s.length < 5) s = "0"+s;                          // F�hrende Nullen 
  return s+" "+volt;                                       // R�ckgabewert
  }
    
// Aktualisierung von Eingabefeldern und Schieberegler:

function updateInput() {
  ip1.value = ToString(u0,1,true);                         // Spannung Stromquelle (Volt)
  ip2.value = ToString(rs,0,true);                         // Schiebewiderstand (Ohm)
  sl.value = Math.round(q*200);                            // Position Schleifkontakt (0 bis 200)
  ip3.value = ToString(rv,0,true);                         // Verbraucherwiderstand (Ohm)
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls m�glich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }

// Eingabe (durch Schieberegler oder Maus), Berechnungen, neu zeichnen:
// mouse ... Flag f�r Ziehen der Maus
// Seiteneffekt u0, rs, rv, q, uv
    
function reaction (mouse) {
  var ae = document.activeElement;                         // Aktives Element
  u0 = inputNumber(ip1,1,true,0,10);                       // Spannung Spannungsquelle (Volt) aus Eingabefeld
  rs = inputNumber(ip2,0,true,1,1000);                     // Schiebewiderstand (Ohm) aus Eingabefeld
  rv = inputNumber(ip3,0,true,1,1000);                     // Verbraucherwiderstand (Ohm) aus Eingabefeld
  if (!mouse) q = sl.value/200;                            // Position Schleifkontakt (0 bis 1)
  uv = voltageAppliance(q);                                // Verbraucherspannung (Volt)                             
  paint();                                                 // Neu zeichnen
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
       
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// w ... Liniendicke (optional, Default-Wert 1)

function newPath (w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Ausgef�lltes Rechteck mit schwarzem Rand:
// x .... x-Koordinate links oben (Pixel)
// y .... y-Koordinate links oben (Pixel)
// w .... Breite (Pixel)
// h .... H�he (Pixel)
// c .... F�llfarbe (optional, Defaultwert schwarz)
// lw ... Liniendicke (Pixel, optional, Defaultwert 1)

function rectangle (x, y, w, h, c, lw) {
  newPath(lw ? lw : 1);                                    // Neuer Grafikpfad
  ctx.fillStyle = (c ? c : "#000000");                     // F�llfarbe
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausf�llen
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen (schwarz)
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath(w);                                              // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Radiale Linie:
// xM, yM ... Mittelpunkt (Pixel)
// a ........ Winkel gegen�ber der positiven x-Achse (Bogenma�)
// r1, r2 ... Abst�nde zum Mittelpunkt (Pixel) 
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)
  	  
function radialLine (xM, yM, a, r1, r2, c, w) {
  var cos = Math.cos(a), sin = Math.sin(a);                // Trigonometrische Werte
  line(xM+r1*cos,yM-r1*sin,xM+r2*cos,yM-r2*sin,c,w);       // Linie zeichnen
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
  
// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// w ....... Liniendicke (Pixel)
// c ....... F�llfarbe (optional)

function circle (x, y, r, w, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (c) ctx.fill();                                       // Kreis ausf�llen, falls gew�nscht
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Horizontal und vertikal zentrierter Text:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
   
function centerText (s, x, y) {
  ctx.font = FONT;                                         // Normaler Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText(s,x,y+DY);                                  // Text ausgeben
  }
  
// Knoten:
// (x,y) ... Position (Pixel)

function node (x, y) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = "#000000";                               // F�llfarbe schwarz
  ctx.arc(x,y,2.5,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.fill();                                              // Ausgef�llten Kreis zeichnen
  }
  
// Dr�hte und Knoten:
    
function wires () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(185,350);                                     // Anfangspunkt (Pluspol der Spannungsquelle)
  ctx.lineTo(360,350);                                     // Weiter nach rechts
  ctx.lineTo(360,230);                                     // Weiter nach oben
  ctx.lineTo(300,230);                                     // Weiter nach links zum Schiebewiderstand
  ctx.moveTo(100,230);                                     // Neuer Anfangspunkt (linkes Ende Schiebewiderstand)
  ctx.lineTo(40,230);                                      // Weiter nach links zum Knoten
  ctx.lineTo(40,360);                                      // Weiter nach unten
  ctx.lineTo(185,360);                                     // Weiter nach rechts zum Minuspol der Spannungsquelle
  var x = 100+q*200;                                       // Waagrechte Koordinate f�r Schleifkontakt (Pixel)
  ctx.moveTo(x,170);                                       // Neuer Anfangspunkt (�ber Schleifkontakt) 
  ctx.lineTo(200,170);                                     // Weiter nach rechts
  ctx.lineTo(200,80);                                      // Weiter nach oben
  ctx.lineTo(130,80);                                      // Weiter nach links
  ctx.lineTo(130,50);                                      // Weiter nach oben zur rechten Buchse des Voltmeters
  ctx.moveTo(110,50);                                      // Neuer Anfangspunkt (linke Buchse des Voltmeters)
  ctx.lineTo(110,80);                                      // Weiter nach unten
  ctx.lineTo(40,80);                                       // Weiter nach links
  ctx.lineTo(40,230);                                      // Weiter nach unten zum Knoten unten links
  ctx.stroke();                                            // Dr�hte zeichnen
  line(40,120,60,120);                                     // Linke Zuleitung Verbraucher
  line(180,120,200,120);                                   // Rechte Zuleitung Verbraucher  
  arrow(x,170,x,210);                                      // Pfeil f�r Schleifkontakt
  for (var y=210; y<250; y+=2) line(x,y,x,y+1);            // Gepunktete Trennlinie       
  node(40,230);                                            // Knoten links unten
  node(40,120);                                            // Knoten links oben
  node(200,120);                                           // Knoten rechts
  }
  
// Spannungsquelle:
    
function power () {
  rectangle(170,310,60,60,lightColor(colorVoltage));       // Geh�use    
  node(185,350);                                           // Obere Buchse (Pluspol)
  node(185,360);                                           // Untere Buchse (Minuspol)
  circle(200,330,10,1,"#000000");                          // Drehknopf
  var w = (210-u0*24)*DEG;                                 // Winkel f�r Drehknopfstellung (Bogenma�)
  radialLine(200,330,w,0,10,"#ffffff",1.5);                // Linie f�r Drehknopf 
  for (var u=0; u<=10; u++) {                              // F�r alle Markierungen der Skala ...
    w = (210-u*24)*DEG;                                    // Winkel (Bogenma�)
    radialLine(200,330,w,10,14);                           // Markierung
    }
  rectangle(173,349.5,7,1,"#000000");                      // Pluszeichen, waagrechte Linie
  rectangle(176,346.5,1,7,"#000000");                      // Pluszeichen, senkrechte Linie
  rectangle(190,359.5,7,1,"#000000");                      // Minuszeichen
  }
  
// Widerst�nde mit Beschriftung:
      
function resistors () {
  rectangle(100,210,200,40,colorBackground,2);               // Schiebewiderstand
  rectangle(60,100,120,40,colorBackground,2);                // Verbraucherwiderstand
  ctx.font = FONT;                                           // Zeichensatz
  ctx.fillStyle = "#000000";                                 // Schriftfarbe
  centerText(value(rv,1,ohm),120,120);                       // Beschriftung Verbraucherwiderstand
  var s = value(rs,1,ohm);                                   // Beginn der Zeichenkette (gesamter Schiebewiderstand)
  s += " = "+value(q*rs,1,ohm);                              // Fortsetzung der Zeichenkette (Teilwiderstand links)                    
  s += " + "+value(rs-q*rs,1,ohm);                           // Fortsetzung der Zeichenkette (Teilwiderstand rechts)
  centerText(s,200,230);                                     // Beschriftung Schiebewiderstand
  }
  
// Digital-Voltmeter:
// (x|y) ... Mittelpunkt (Pixel)
      
function meter (x, y) {
  rectangle(x-70,y-20,140,40,lightColor(colorVoltage));    // Farbe f�r Geh�use
  rectangle(x-60,y-15,120,20,"#000000");                   // Anzeige
  node(x-10,y+12);                                         // Linke Buchse
  node(x+10,y+12);                                         // Rechte Buchse
  line(x-24,y+12,x-16,y+12);                               // Minuszeichen (links)
  line(x+16,y+12,x+24,y+12);                               // Pluszeichen (rechts), waagrechte Linie
  line(x+20,y+8,x+20,y+16);                                // Pluszeichen (rechts), senkrechte Linie
  ctx.font = FONT2;                                        // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = "#ff0000";                               // Schriftfarbe
  ctx.fillText(stringVoltage(uv),x,y-1);                   // Verbraucherspannung in Volt ausgeben  
  }
      
// Skala f�r Schleifkontakt:
      
function scale () {
  rectangle(88,253,224,22,colorScale);                     // Lineal 
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (var x=100; x<=300; x+=4) {                          // F�r alle Linien ...
    var long = (x%20 == 0);                                // Flag f�r lange Linie
    line(x,252,x,long?260:257);                            // Linie zeichnen
    if (!long) continue;                                   // Falls keine Beschriftung, weiter zur n�chsten Position
    var s = ToString((x-100)/200,true,1);                  // Zeichenkette f�r Beschriftung
    ctx.fillText(s,x,270);                                 // Beschriftung
    }   	
  }
  
// Text mit Index ausgeben:
// s ....... Normaler Text
// i ....... Index
// (x,y) ... Position (Pixel)
    
function writeTextIndex (s, i, x, y) {
  var ls = ctx.measureText(s).width;                       // L�nge des normalen Textes (Pixel)
  ctx.fillText(s,x,y);                                     // Normalen Text ausgeben
  ctx.fillText(i,x+ls+1,y+4);                              // Index ausgeben
  }
      
// Hilfsroutine: Einzelnen Spannungswert angeben
// u ....... Spannung (Volt)
// (x,y) ... Position (Pixel)

function writeV (u, x, y) {
  ctx.fillText(value(u,2,volt),x,y);                       // Wert der Spannung ausgeben
  }
      
// Ausgabe der Spannungswerte:
  
function writeVoltage () {
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe
  ctx.font = FONT;                                         // Zeichensatz
  writeV(uv,120,96);                                       // Spannung am Verbraucher
  var x = Math.round(100+q*200);                           // Hilfsgr��e f�r Positionen 
  var x1 = Math.min((100+x)/2,x-25);                       // Position f�r Teilspannung links 
  var x2 = Math.max((x+300)/2,x+25);                       // Position f�r Teilspannung rechts
  writeV(uv,x1,206);                                       // Teilspannung Schiebewiderstand links  
  writeV(u0-uv,x2,206);                                    // Teilspannung Schiebewiderstand rechts
  }
  
// Hilfsroutine: Einzelnen Stromst�rkewert ausgeben
// i ......... Stromst�rke (Ampere)
// (x,y) ..... Position (Pixel)
    
function writeA (i, x, y) {
  centerText(value(Math.abs(i),3,ampere),x,y);             // Wert der Stromst�rke ausgeben
  }
  
// Ausgabe der Stromst�rkewerte:
  
function writeAmperage () {
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe
  ctx.font = FONT;                                         // Zeichensatz
  var iv = uv/rv;                                          // Stromst�rke im Verbraucher (Ampere)
  var i1 = (q>0 ? uv/(q*rs) : u0/rs);                      // Stromst�rke links vom Schiebewiderstand (Ampere) 
  var i = i1+iv;                                           // Stromst�rke rechts vom Schiebewiderstand (Ampere)
  writeA(iv,120,148);                                      // Stromst�rke im Verbraucher
  writeA(i1,70,238);                                       // Stromst�rke links vom Schiebewiderstand
  writeA(i,330,238);                                       // Stromst�rke rechts vom Schiebewiderstand
  }
  
// Diagramm:
  
function diagram () {
  var U0 = 240, V0 = 120;                                  // Koordinaten des Ursprungs
  var PIX1 = 100, PIX2 = 8;                                // Pixel pro Einheit (waagrecht/senkrecht)
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  arrow(U0-10,V0,U0+120,V0);                               // Waagrechte Achse
  arrow(U0,V0+10,U0,V0-100);                               // Senkrechte Achse
  writeTextIndex(symbolVoltage1,symbolVoltage2,U0+10,V0-90);  // Beschriftung f�r senkrechte Achse
  ctx.textAlign = "center";                                // Textausrichtung
  for (var i=1; i<=5; i++) {                               // F�r alle Ticks der waagrechten Achse ...
  	var u = U0+i*PIX1/5;                                   // Waagrechte Koordinate
  	line(u,V0-3,u,V0+3);                                   // Tick zeichnen
  	ctx.fillText(ToString(i/5,true,1),u,V0+13);            // Beschriftung (Bruchteil als Dezimalbruch)
  	}
  ctx.textAlign = "right";                                 // Textausrichtung
  for (i=1; i<=5; i++) {                                   // F�r alle Ticks der senkrechten Achse ...
  	var v = V0-i*2*PIX2;                                   // Senkrechte Koordinate
  	line(U0-3,v,U0+3,v);                                   // Tick zeichnen
  	ctx.fillText(value(2*i,0,volt),U0-4,v+4);              // Beschriftung (Spannung in Volt)
  	}
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(U0,V0);                                       // Anfangspunkt f�r Polygonzug (Ursprung)
  for (u=U0; u<=U0+PIX1; u++) {                            // F�r alle Werte der waagrechten Koordinate ...
    var qq = (u-U0)/PIX1;                                  // Zugeh�riger Bruchteil
    v = V0-PIX2*voltageAppliance(qq);                      // Senkrechte Koordinate
    ctx.lineTo(u,v);                                       // Linie zum Polygonzug hinzuf�gen
    }
  ctx.stroke();                                            // Polygonzug als N�herung f�r Kurve zeichnen
  u = U0+q*PIX1;                                           // Waagrechte Koordinate f�r momentanen Wert
  v = V0-PIX2*voltageAppliance(q);                         // Senkrechte Koordinate f�r momentanen Wert
  circle(u,v,2.5,1,colorVoltage);                          // Markierung f�r momentanen Wert
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  resistors();                                             // Widerst�nde
  meter(120,40);                                           // Voltmeter         
  power();                                                 // Spannungsquelle
  wires();                                                 // Dr�hte und Knoten 
  scale();                                                 // Skala f�r Schiebewiderstand
  diagram();                                               // Diagramm
  if (cb1.checked) writeVoltage();                         // Falls gew�nscht, Spannungswerte ausgeben
  if (cb2.checked) writeAmperage();                        // Falls gew�nscht, Stromst�rkewerte ausgeben
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

