// Kombinationen von Widerst�nden
// Java-Applet (11.09.2002) umgewandelt
// 24.10.2016 - 18.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel combinationresistors_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorEmphasize = "#ffc800";                            // Farbe f�r Hervorhebung eines Schaltungsteils
var colorVoltage = "#0000ff";                              // Farbe f�r Spannung
var colorAmperage = "#ff0000";                             // Farbe f�r Stromst�rke

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";          // Zeichensatz
var W2 = 30, H2 = 10;                                     // Abmessungen f�r Symbole (Pixel)
var DIST = 10;                                            // Abstand f�r Dr�hte (Pixel)
var DIGITS = 3;                                           // Geltende Ziffern

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2, bu3;                                         // Schaltkn�pfe (Reset, Serie, parallel)
var ip1, ip2;                                              // Eingabefelder (Spannung, Widerstand)
var cb1, cb2;                                              // Optionsfelder (Messger�t f�r Spannung bzw. Stromst�rke)

var u0;                                                    // Vorgabe Batteriespannung (Volt)
var r0;                                                    // Vorgabe Widerstand (Ohm)
var y0;                                                    // y-Koordinate unten (Pixel)
var y1;                                                    // y-Koordinate oben (Pixel)
var drag;                                                  // Flag f�r Zugmodus
var xMin, xMax, yMin, yMax;                                // Extrempositionen Mauszeiger (Pixel)
var am;                                                    // Stromst�rkemessger�t
var vm;                                                    // Spannungsmessger�t
var curr0;                                                 // Aktueller Schaltungsteil, zwischengespeichert

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
  canvas = document.getElementById("cv");                  // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Reset)
  getElement("ip1a",text02);                               // Erkl�render Text (Batteriespannung)
  ip1 = getElement("ip1b");                                // Eingabefeld (Batteriespannung)
  getElement("ip1c",volt);                                 // Einheit (Batteriespannung)
  getElement("ip2a",text03);                               // Erkl�render Text (Widerstand)
  ip2 = getElement("ip2b");                                // Eingabefeld (Widerstand)
  getElement("ip2c",ohm);                                  // Einheit (Widerstand)
  bu2 = getElement("bu2",text04);                          // Schaltknopf (Hinzuf�gen, in Serie)
  bu3 = getElement("bu3",text05);                          // Schaltknopf (Hinzuf�gen, parallel)
  getElement("lb0",text06);                                // Erkl�render Text (Messger�te)
  cb1 = getElement("cb1");                                 // Optionsfeld (Spannungsmessger�t)
  cb1.checked = false;                                     // Zun�chst kein H�kchen
  getElement("lb1",text07);                                // Erkl�render Text (Spannungsmessger�t)
  cb2 = getElement("cb2");                                 // Optionsfeld (Stromst�rkemessger�t)
  cb2.checked = false;                                     // Zun�chst kein H�kchen
  getElement("lb2",text08);                                // Erkl�render Text (Stromst�rkemessger�t)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  u0 = 12;                                                 // Vorgabe Batteriespannung (12 Volt)
  r0 = 100;                                                // Vorgabe Widerstand (100 Ohm)
  root = current = newResistor(r0);                        // Start mit einzelnem Widerstand
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  ip1.onkeydown = reactionEnter1;                          // Reaktion auf Eingabefeld (Batteriespannung)
  ip2.onkeydown = reactionEnter2;                          // Reaktion auf Eingabefeld (Widerstand)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Batteriespannung)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Widerstand)
  bu2.onclick = reactionSerial;                            // Reaktion auf Schaltknopf (Hinzuf�gen in Serie)
  bu3.onclick = reactionParallel;                          // Reaktion auf Schaltknopf (Hinzuf�gen parallel)
  cb1.onclick = reactionVoltmeter;                         // Reaktion auf Optionsfeld (Spannungsmessger�t)
  cb2.onclick = reactionAmperemeter;                       // Reaktion auf Optionsfeld (Stromst�rkemessger�t)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers 
  } // Ende der Methode start
  
// Hilfsroutine (Eingabe):
// Seiteneffekt u0, r0

function input () {
  var ae = document.activeElement;                         // Aktives Element
  u0 = inputNumber(ip1,DIGITS,false,0.001,1000);           // Batteriespannung (Volt)
  r0 = inputNumber(ip2,DIGITS,false,1,1000000);            // Vorgabe Widerstand (Ohm)
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) ip2.blur();                               // Fokus abgeben
  }
  
// Reaktion auf Schaltknopf (Reset):
// Seiteneffekt u0, r0, root, current, bu2, bu3, cb1, cb2, vm, am, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2

function reactionReset () {
  u0 = 12;                                                 // Batteriespannung (12 Volt)
  r0 = 100;                                                // Vorgabe Widerstand (100 Ohm)
  root = current = newResistor(r0);                        // Start mit einzelnem Widerstand
  bu2.disabled = false; bu3.disabled = false;              // Schaltkn�pfe f�r Hinzuf�gung aktivieren
  cb1.checked = false; cb2.checked = false;                // Optionsfelder Spannung/Stromst�rke ohne H�kchen 
  vm = null; am = null;                                    // Keine Messger�te 
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld    
  }
  
// Reaktion auf Schaltknopf (Hinzuf�gen eines Widerstands, in Serie):
// Seiteneffekt u0, r0, root, current, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3 

function reactionSerial () {
  input();                                                 // Hilfsroutine aufrufen (Eingabe)
  var r = newResistor(r0);                                 // Neuer Widerstand
  insertSer(current,r);                                    // In Serie zum aktuellen Schaltungsteil hinzuf�gen  
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  focus(ip2);                                              // Fokus f�r zweites Eingabefeld
  }
  
// Reaktion auf Schaltknopf (Hinzuf�gen eines Widerstands, parallel):
// Seiteneffekt u0, r0, root, current, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3

function reactionParallel () {
  input();                                                 // Hilfsroutine aufrufen (Eingabe)
  var r = newResistor(r0);                                 // Neuer Widerstand
  insertPar(current,r);                                    // Parallel zum aktuellen Schaltungsteil hinzuf�gen
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  focus(ip2);                                              // Fokus f�r zweites Eingabefeld
  }
  
// Eingabe, Berechnungen, neu zeichnen
// Seiteneffekt u0, r0, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3

function reaction () {
  input();                                                 // Hilfsroutine aufrufen (Eingabe)
  updateAll(false);                                        // Schaltfl�che und Zeichenfl�che aktualisieren
  }
  
// Reaktion auf Eingabefeld Batteriespannung (nur auf Enter-Taste):
// Seiteneffekt u0, r0, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3
  
function reactionEnter1 (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (enter) reaction();                                   // Falls Enter-Taste, Daten �bernehmen, rechnen und neu zeichnen                       
  }
    
// Reaktion auf Eingabefeld Widerstand (nur auf Enter-Taste):
// Seiteneffekt u0, r0, current.res, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3 
  
function reactionEnter2 (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  if (current.type == "R")                                 // Falls Einzelwiderstand aktuell ... 
    current.res = inputNumber(ip2,DIGITS,false,1,1000000); // Wert �bernehmen
  reaction();                                              // Daten �bernehmen, rechnen und neu zeichnen                        
  }
  
// Fokus f�r Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus f�r Eingabefeld
  var n = ip.value.length;                                 // L�nge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Optionsfeld Spannungsmessung:
// Seiteneffekt vm, am, root, current, curr0, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3

function reactionVoltmeter () {
  var u = cb1.checked, i = cb2.checked;                    // Zust�nde der beiden Optionsfelder
  if (vm != null) {remove(vm); vm = null;}                 // Falls vorhanden, Voltmeter entfernen
  if (am != null) {remove(am); am = null;}                 // Falls vorhanden, Amperemeter entfernen
  if (u) {                                                 // Falls Beginn der Spannungsmessung ... 
    if (!i) curr0 = current;                               // Falls keine Stromst�rkemessung, aktuellen Schaltungsteil speichern             	
    else insertAM(curr0);                                  // Falls Stromst�rkemessung, Amperemeter einf�gen
    insertVM(curr0);                                       // Voltmeter einf�gen 
    }
  else if (i) insertAM(curr0);                             // Falls Ende der Spannungsmessung, eventuell Amperemeter wieder einf�gen         
  current = curr0;                                         // Aktueller Schaltungsteil wie fr�her
  vm = getVoltmeter(root);                                 // Voltmeter oder null
  am = getAmperemeter(root);                               // Amperemeter oder null
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  }

// Reaktion auf Optionsfeld Stromst�rkemessung:
// Seiteneffekt vm, am, root, current, curr0, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3
  
function reactionAmperemeter () {
  var u = cb1.checked, i = cb2.checked;                    // Zust�nde der beiden Optionsfelder
  if (vm != null) {remove(vm); vm = null;}                 // Falls vorhanden, Voltmeter entfernen
  if (am != null) {remove(am); am = null;}                 // Falls vorhanden, Amperemeter entfernen
  if (i) {                                                 // Falls Beginn der Stromst�rkemessung ...
    if (u) insertVM(curr0);                                // Falls Spannungsmessung, Voltmeter einf�gen
    else curr0 = current;                                  // Falls keine Spannungsmessung, aktuellen Schaltungsteil speichern                 
    insertAM(curr0);                                       // Amperemeter einf�gen 
    }
  else if (u) insertVM(curr0);                             // Falls Ende der Stromst�rkemessung, eventuell Voltmeter wieder einf�gen
  current = curr0;                                         // Aktueller Schaltungsteil wie fr�her
  vm = getVoltmeter(root);                                 // Voltmeter oder null
  am = getAmperemeter(root);                               // Amperemeter oder null
  updateAll(true);                                         // Schaltfl�che und Zeichenfl�che aktualisieren
  }
  
// Reaktion auf Dr�cken der Maustaste (Seiteneffekt siehe reactionDown):
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen                   
  }
  
// Reaktion auf Ber�hrung (Seiteneffekt siehe reactionDown):
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag, xMin, xMax, yMin, yMax, current, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  drag = true;                                             // Zugmodus aktivieren
  xMin = xMax = u; yMin = yMax = v;                        // Extremwerte Mauszeiger 
  current = selectedPart(root,xMin,xMax,yMin,yMax);        // Aktueller Schaltungsteil entsprechend Mausposition
  updateAll(false); 
  }
  
// Reaktion auf Loslassen der Maustaste (Seiteneffekt drag):
  
function reactionMouseUp (e) {                                           
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Ende der Ber�hrung (Seiteneffekt drag):
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus (Seiteneffekt siehe reactionMove):
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers (Seiteneffekt siehe reactionMove):
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }
  
// Hilfsroutine: Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt xMin, xMax, yMin, yMax, (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3 

function reactionMove (u, v) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (u < xMin) xMin = u;                                  // Falls weiter links als bisher, xMin aktualisieren
  if (u > xMax) xMax = u;                                  // Falls weiter rechts als bisher, xMax aktualisieren
  if (v < yMin) yMin = v;                                  // Falls weiter oben als bisher, yMin aktualisieren
  if (v > yMax) yMax = v;                                  // Falls weiter unten als bisher, yMax aktualisieren
  current = selectedPart(root,xMin,xMax,yMin,yMax);        // Aktueller Schaltungsteil entsprechend extremen Mauspositionen
  updateAll(false);
  }
  
// Schaltfl�che aktualisieren:
// Seiteneffekt ip1, ip2, bu2, bu3
  
function updatePanel () {
  ip1.value = ToString(u0,DIGITS,false);                   // Eingabefeld f�r Batteriespannung
  ip2.value = ToString(r0,DIGITS,false);                   // Eingabefeld f�r Vorgabe Widerstand
  bu2.disabled = (vm != null || am != null                 // Schaltknopf aktivieren bzw. deaktivieren 
                             || getNHorFict(root,1) > 3);
  bu3.disabled = (vm != null || am != null                 // Schaltknopf aktivieren bzw. deaktivieren                 
                             || getNVertFict(root,1) > 3);
  }
    
// Zeichenfl�che und Schaltfl�che aktualisieren:
// geo ... Flag f�r Neuberechnung der geometrischen Anordnung
// Seiteneffekt (x,y,w,h) f�r untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3
  
function updateAll (geo) {
  if (geo) arrangeAll();                                   // Falls gew�nscht, geometrische Anordnung neu berechnen
  paintAll();                                              // Zeichenfl�che aktualisieren 
  updatePanel();                                           // Schaltfl�che aktualisieren
  }
  
//-------------------------------------------------------------------------------------------------

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
  
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

// Geometrische Anordnung der Schaltung:
// Seiteneffekt (x,y,w,h) f�r untergeordnete Elemente, y0, y1
  
function arrangeAll () {
  var r = root;                                            // Wurzel der Baumstruktur
  var n = getNVert(r)+1;                                   // Anzahl
  var yOR = (n<4 ? 20 : 0);                                // y-Koordinate
  arrange(r,60,yOR,width-120,350*(n-1)/n);                 // Geometrische Anordnung
  y0 = yOR+20+350*(2*n-1)/(2*n);                           // y-Koordinate unten
  y1 = r.y+r.h/2;                                          // y-Koordinate oben
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)

function newPath (c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }

// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen
  if (w) ctx.lineWidth = w;                                // Liniendicke festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
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
  
// Ausgef�llter Kreis mit Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c1 ...... F�llfarbe (optional, Defaultwert colorBackground)
// c2 ...... Randfarbe (optional, Defaultwert schwarz)
// w ....... Randdicke (optional, Defaultwert 1)

function circle (x, y, r, c1, c2, w) {
  ctx.fillStyle = (c1 ? c1 : colorBackground);             // F�llfarbe
  newPath(c2,w);                                           // Neuer Grafikpfad
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausf�llen
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Hilfsroutine: Breite einer Zeichenkette (Pixel)
// s ... Gegebene Zeichenkette

function widthString (s) {return ctx.measureText(s).width;}
  
// Breite einer Zahl (auch Zehnerpotenzschreibweise):
// s ... Gegebene Zahl (Zeichenkette, die auch eine Zehnerpotenz in e-Schreibweise enthalten kann)

function widthNumber (s) {
  var i = s.indexOf("e");                                  // Position von 'e' oder -1
  if (i < 0) return widthString(s);                        // R�ckgabewert, falls kein 'e' vorhanden
  var n = widthString(s.substring(0,i));                   // Breite der Mantisse 
  n += widthString(" "+symbolMult+" 10");                  // Breite von "mal 10 hoch" addieren
  s = s.substring(i+1);                                    // Zeichenkette f�r Exponent
  if (s.startsWith("+")) s = s.substring(1);               // Pluszeichen weglassen
  if (!(s == "1")) n += widthString(s);                    // Breite des Exponenten addieren
  return n;                                                // R�ckgabewert
  }
  
// Ausgabe einer Zahl (auch Zehnerpotenzschreibweise):
// s ... Gegebene Zahl (Zeichenkette, die auch eine Zehnerpotenz in e-Schreibweise enthalten kann)
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)

function writeNumber (s, x, y) {
  var i = s.indexOf("e");                                  // Position von 'e' oder -1
  if (i < 0) {ctx.fillText(s,x,y); return;}                // Falls kein 'e' vorhanden, Ausgabe ohne Zehnerpotenz
  var s1 = s.substring(0,i);                               // Zeichenkette f�r Mantisse
  var w1 = ctx.measureText(s1).width;                      // Breite (Pixel) 
  var s2 = " "+symbolMult+" 10";                           // Zeichenkette f�r "mal 10 hoch"
  var w2 = ctx.measureText(s2).width;                      // Breite (Pixel)
  var s3 = s.substring(i+1);                               // Zeichenkette f�r Exponent
  if (s3.startsWith("+")) s3 = s3.substring(1);            // Pluszeichen weglassen
  if (s3 == "1") s3 = "";                                  // Exponent 1 weglassen
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig
  ctx.fillText(s1,x,y);                                    // Mantisse ausgeben
  ctx.fillText(s2,x+w1,y);                                 // "mal 10 hoch" ausgeben
  ctx.fillText(s3,x+w1+w2,y-4);                            // Exponent ausgeben
  }
  
// Ausgabe einer Zahl mit Benennung (auch Zehnerpotenzschreibweise):
// s ... Gegebene Zahl (Zeichenkette, die auch eine Zehnerpotenz in e-Schreibweise enthalten kann)
// u ... Einheit
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// c ... Flag f�r Zentrierung

function writeNumberUnit (s, u, x, y, c) {
  var w1 = widthNumber(s);                                 // Breite der Zahl (Pixel)
  var w2 = widthString(" "+u);                             // Breite von Leerzeichen und Einheit
  if (c) x -= (w1+w2)/2;                                   // Falls Zentrierung, x-Koordinate anpassen
  writeNumber(s,x,y);                                      // Zahl (auch mit Zehnerpotenz) ausgeben
  if (u != null && u != "") ctx.fillText(" "+u,x+w1,y);    // Einheit ausgeben
  }
  
// Batterie mit Anschlussdr�hten:
  	
function power () {
  var x = width/2+10;                                      // x-Koordinate Pluspol (Pixel)
  line(x,y0-2*H2,x,y0+2*H2);                               // Pluspol (rechts)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x,y0);                                        // Anfangspunkt (beim Pluspol)
  ctx.lineTo(width-40,y0);                                 // Draht nach rechts
  ctx.lineTo(width-40,y1);                                 // Draht nach oben
  ctx.lineTo(width-60,y1);                                 // Draht nach links
  ctx.stroke();                                            // Dr�hte zeichnen
  x = width/2-10;                                          // x-Koordinate Minuspol (Pixel)
  ctx.fillStyle = "#000000";                               // F�llfarbe
  ctx.fillRect(x,y0-H2,5,2*H2);                            // Minuspol (links)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)                      
  ctx.moveTo(x,y0);                                        // Anfangspunkt (beim Minuspol)
  ctx.lineTo(40,y0);                                       // Draht nach links
  ctx.lineTo(40,y1);                                       // Draht nach oben
  ctx.lineTo(60,y1);                                       // Draht nach rechts
  ctx.stroke();                                            // Dr�hte zeichnen
  }
  
// Ausgabe von Zahlenwerten:

function writeValues () {
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe f�r Spannung
  var s = ToString(u0,DIGITS,false);                       // Zeichenkette f�r Batteriespannung (ohne Einheit)
  writeNumberUnit(s,volt,width/2,y0+36,true);              // Batteriespannung im Schaltbild ausgeben
  var c = current;                                         // Abk�rzung f�r aktuellen Teil der Schaltung
  ctx.fillText(text09,20,height-50);                       // Erkl�render Text (Spannung)
  s = ToString(getVoltage(c),DIGITS,false);                // Zeichenkette f�r Spannung des aktuellen Schaltungsteils (ohne Einheit)
  writeNumberUnit(s,volt,220,height-50,false);             // Teilspannung f�r aktuellen Teil der Schaltung ausgeben
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe f�r Stromst�rke
  ctx.fillText(text10,20,height-30);                       // Erkl�render Text (Stromst�rke)
  s = ToString(getAmperage(c),DIGITS,false);               // Zeichenkette f�r Stromst�rke des aktuellen Schaltungsteils (ohne Einheit)
  writeNumberUnit(s,ampere,220,height-30,false);           // Teilstromst�rke f�r aktuellen Teil der Schaltung ausgeben
  ctx.fillStyle = "#000000";                               // Schriftfarbe f�r Widerstand
  s = (isSingle(c) ? text11 : text12);                     // Erkl�render Text (Widerstand bzw. Ersatzwiderstand)
  ctx.fillText(s,20,height-10);                            // Erk�render Text (Widerstand bzw. Ersatzwiderstand)
  var r = getResistance(c);                                // Widerstandsbetrag (Ohm)
  if (r == 0) ctx.fillText(text13,220,height-10);          // Falls Widerstand 0 (Amperemeter), Text ausgeben (sehr klein)
  else if (isInfinite(r))                                  // Falls Widerstand unendlich (Voltmeter) ...
    ctx.fillText(text14,220,height-10);                    // Text ausgeben (sehr gro�) 
  else {                                                   // Sonst (Normalfall)
    s = ToString(r,DIGITS,false);                          // Zeichenkette f�r Widerstand (ohne Einheit)
    writeNumberUnit(s,ohm,220,height-10,false);            // Widerstand f�r aktuellen Teil der Schaltung ausgeben
    }  
  } 
  
// Grafikausgabe:

function paintAll () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  paint(root);                                             // Schaltung zeichnen
  power();                                                 // Batterie mit Anschlussdr�hten zeichnen
  writeValues();                                           // Zahlenwerte 
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

//-------------------------------------------------------------------------------------------------

// Methoden f�r beliebige Schaltungsteile

// Die Methoden stammen aus der abstrakten Java-Klasse CombRLC (Kombination von Widerst�nden, Spulen, Kondensatoren)
// mit den Klassenattributen u0 (Batteriespannung), root (Wurzel der Baumstruktur) und current (aktueller Teil)
// sowie den Instanzattributen parent (�bergeordneter Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), 
// x, y, w, h (Position und Abmessungen).
// In den folgenden Methoden wird ein zus�tzliches Instanzattribut type (m�gliche Werte "R", "V", "A", "S", "P") verwendet,
// um die Art eines Schaltungsteils auszudr�cken.

var POS_INF = Number.POSITIVE_INFINITY;                    // Abk�rzung f�r plus unendlich

var root;                                                  // Wurzel der Baumstruktur (f�r CombRLC.root)
var current;                                               // Aktueller Schaltungsteil (f�r CombRLC.current)

// Ersatz f�r CombRLC-Konstruktor:

function newCombRLC () {
  return {type: null, parent: null, next: null, x: 0, y: 0, w: 0, h: 0};
  }
  
// �berpr�fung, ob einzelnes Element (Widerstand, Voltmeter oder Amperemeter):
// c0 ... Gegebener Schaltungsteil

function isSingle (c0) {
  return (c0.type == "R" || c0.type == "V" || c0.type == "A");  // R�ckgabewert
  }

// Hinzuf�gen eines Schaltungsteils in Serie (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertSer (c0, c) {
  if (isSingle(c0)) insertSerSingle(c0,c);                 // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") insertSerS(c0,c);               // Variante f�r Serienschaltung
  else if (c0.type == "P") insertSerP(c0,c);               // Variante f�r Parallelschaltung
  }
  
// Hinzuf�gen eines Schaltungsteils parallel (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertPar (c0, c) {
  if (isSingle(c0)) insertParSingle(c0,c);                 // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") insertParS(c0,c);               // Variante f�r Serienschaltung
  else if (c0.type == "P") insertParP(c0,c);               // Variante f�r Parallelschaltung
  }
  
// Hinzuf�gen eines Amperemeters:
// c0 ... Gegebener Schaltungsteil
// Seiteneffekt root, current

function insertAM (c0) {
  insertSer(c0,newAmperemeter());                          // In Serienschaltung hinzuf�gen
  }
  
// Hinzuf�gen eines Voltmeters:
// c0 ... Gegebener Schaltungsteil
// Seiteneffekt root, current

function insertVM (c0) {
  insertPar(c0,newVoltmeter());                            // In Parallelschaltung hinzuf�gen
  }
  
// Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungteil
// nH ... Anzahl

function getNHorFict (c0, nH) {
  if (isSingle(c0)) return getNHorFictSingle(c0,nH);       // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNHorFictS(c0,nH);     // Variante f�r Serienschaltung
  else if (c0.type == "P") return getNHorFictP(c0,nH);     // Variante f�r Parallelschaltung
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungteil

function getNHor (c0) {
  if (isSingle(c0)) return 1;                              // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNHorS(c0);            // Variante f�r Serienschaltung
  else if (c0.type == "P") return getNHorP(c0);            // Variante f�r Parallelschaltung
  }
  
// Fiktive Zahl der maximal �bereinander liegenden Einzelelemente (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungteil
// nH ... Anzahl

function getNVertFict (c0, nV) {
  if (isSingle(c0)) return getNVertFictSingle(c0,nV);      // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNVertFictS(c0,nV);    // Variante f�r Serienschaltung
  else if (c0.type == "P") return getNVertFictP(c0,nV);    // Variante f�r Parallelschaltung
  }

// Wirkliche Zahl der maximal �bereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungteil
  
function getNVert (c0) {
  if (isSingle(c0)) return 1;                              // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNVertS(c0);           // Variante f�r Serienschaltung
  else if (c0.type == "P") return getNVertP(c0);           // Variante f�r Parallelschaltung
  }
  
// Berechnung des Ersatzwiderstands (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function getResistance (c0) {
  if (c0.type == "R") return c0.res;                       // Variante f�r Widerstand
  else if (c0.type == "V") return POS_INF;                 // Variante f�r Voltmeter
  else if (c0.type == "A") return 0;                       // Variante f�r Amperemeter
  else if (c0.type == "S") return getResistanceS(c0);      // Variante f�r Serienschaltung
  else if (c0.type == "P") return getResistanceP(c0);      // Variante f�r Parallelschaltung
  }
  
// �berpr�fung, ob eine Zahl unendlich ist:
// x ... Gegebene Zahl
  
function isInfinite (x) {
  if (x == Number.POSITIVE_INFINITY) return true;          // R�ckgabewert f�r plus unendlich         
  if (x == Number.NEGATIVE_INFINITY) return true;          // R�ckgabewert f�r minus unendlich
  return false;                                            // R�ckgabewert f�r alle anderen F�lle
  }
  
// Berechnung der Teilspannung (top-down):
// c0 ... Gegebener Schaltungsteil

function getVoltage (c0) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil oder null
  if (p == null) return u0;                                // R�ckgabewert f�r die ganze Schaltung
  var u = getVoltage(p);                                   // Spannung des �bergeordneten Schaltungsteils
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var r = getResistance(p);                              // Ersatzwiderstand der Serienschaltung
    var i = p.first;                                       // Anfang der Serienschaltung
    if (i == null) return 0;                               // Sicher ist sicher!
    var n = 0;                                             // Zahl der unendlichen Teilwiderst�nde
    do {                                                   // Wiederhole ...
      if (isInfinite(getResistance(i))) n++;               // Falls unendlicher Teilwiderstand, n erh�hen
      i = i.next;                                          // N�chster Teil der Serienschaltung 
      }
    while (i != null);                                     // ... bis Ende der Serienschaltung erreicht 
    if (n == 0) return u*getResistance(c0)/r;              // R�ckgabewert, falls kein unendlicher Widerstand
    else if (isInfinite(getResistance(c0))) return u/n;    // R�ckgabewert, falls unendlicher Widerstand
    else return 0;                                         // R�ckgabewert, falls endlicher Widerstand, aber n > 0                               
    }
  else return u;                                           // R�ckgabewert, falls c0 nicht Teil einer Serienschaltung
  }
  
// Berechnung der Teilstromst�rke (Spannung durch Widerstand):
// c0 ... Gegebener Schaltungsteil

function getAmperage (c0) {
  var u = getVoltage(c0), r = getResistance(c0);           // Teilspannung, Ersatzwiderstand
  if (r == 0) {                                            // Falls Widerstand 0 (Amperemeter) ...
    if (u == 0) return getAmperage(c0.parent);             // R�ckgabewert f�r Spannung 0 und Widerstand 0
    else return POS_INF;                                   // R�ckgabewert f�r Spannung gr��er 0 und Widerstand 0
    }
  else if (isInfinite(r)) return 0;                        // R�ckgabewert, falls unendlicher Widerstand (Voltmeter)
  else return u/r;                                         // R�ckgabewert Normalfall
  }
  
// Vorhergehender Schaltungsteil auf der gleichen Hierarchiestufe:
// c0 ... Gegebener Schaltungsteil
// Falls c0 der Anfang einer Serien- oder Parallelschaltung ist, wird c0 zur�ckgegeben.

function getPrevious (c0) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil oder null
  if (p == null || isSingle(p)) return null;               // R�ckgabewert, falls c0 kein Teil einer Serien- oder Parallelschaltung 
  var i = p.first;                                         // Anfang der Serien- oder Parallelschaltung
  if (i == null || i == c0) return i;                      // R�ckgabewert, falls c0 am Anfang der Serien- oder Parallelschaltung
  while (i.next != null) {                                 // Solange Schaltungsteil definiert ...
    if (i.next == c0) break;                               // Falls Nachfolger gleich c0, while-Schleife verlassen
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return i;                                                // R�ckgabewert
  }
  
// Geometrische Anordnung (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// x .... Abstand vom linken Rand (Pixel)
// y .... Abstand vom oberen Rand (Pixel)
// w .... Breite (Pixel)
// h ... H�he (Pixel)
// Seiteneffekt (x,y,w,h) f�r untergeordnete Elemente

function arrange (c0, x, y, w, h) {
  if (isSingle(c0)) arrangeSingle(c0,x,y,w,h);             // Variante f�r Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") arrangeS(c0,x,y,w,h);           // Variante f�r Serienschaltung
  else if (c0.type == "P") arrangeP(c0,x,y,w,h);           // Variante f�r Parallelschaltung
  }
  
// Grafikausgabe (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function paint (c0) {
  if (c0.type == "R") paintR(c0);                          // Variante f�r Widerstand
  else if (c0.type == "V") paintV(c0);                     // Variante f�r Voltmeter
  else if (c0.type == "A") paintA(c0);                     // Variante f�r Amperemeter
  else if (c0.type == "S") paintS(c0);                     // Variante f�r Serienschaltung                    
  else if (c0.type == "P") paintP(c0);                     // Variante f�r Parallelschaltung
  }
  
// Hervorhebung eines Schaltungsteils (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function emphasize (c0) {
  if (c0.type == "R") emphasizeR(c0);                      // Variante f�r Widerstand
  else if (c0.type == "V") emphasizeV(c0);                 // Variante f�r Voltmeter
  else if (c0.type == "A") emphasizeA(c0);                 // Variante f�r Amperemeter
  else if (!isSingle(c0)) emphasizeSerPar(c0);             // Variante f�r Serien- oder Parallelschaltung
  }
  
// Suche eines Schaltungsteils (rekursiv):
// c0 ........... Gegebener Schaltungsteil
// xMin, yMin ... Position der linken oberen Ecke
// xMax, yMax ... Position der rechten unteren Ecke
// R�ckgabewert: M�glichst kleiner Teilbereich der Schaltung derart, dass das Rechteck mit den gegebenen Ecken darin liegt

function selectedPart (c0, xMin, xMax, yMin, yMax) {
  if (isSingle(c0)) return c0;                             // R�ckgabewert, falls Widerstand, Voltmeter oder Amperemeter
  var i = c0.first;                                        // Anfang der Serien- oder Parallelschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (xMin >= i.x && xMin <= i.x+i.w                     // Bedingung 1. Teil
    && xMax >= i.x && xMax <= i.x+i.w                      // Bedingung 2. Teil
    && yMin >= i.y && yMin <= i.y+i.h                      // Bedingung 3. Teil
    && yMax >= i.y && yMax <= i.y+i.h)                     // Bedingung 4. Teil
      break;                                               // Falls Schaltungsteil gefunden, while-Schleife verlassen
    i = i.next;	                                           // N�chster Schaltungsteil
    }
  if (i != null)                                           // Falls Schaltungsteil gefunden ...
    return selectedPart(i,xMin,xMax,yMin,yMax);            // Rekursiv weitersuchen
  else return c0;                                          // R�ckgabewert, falls kein kleinerer Schaltungsteil passt
  }
  
// L�schen eines Schaltungsteils:
// c0 ........... Gegebener Schaltungsteil
// Seiteneffekt root, current

function remove (c0) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil oder null
  if (p == null || isSingle(p)) return;                    // Falls c0 kein Teil einer Serien- oder Parallelschaltung, abbrechen 
  if (c0 == p.first) current = p.first = c0.next;          // Falls c0 am Anfang, Referenzen auf Nachfolger
  else {                                                   // Falls c0 nicht am Anfang ... 
    current = getPrevious(c0);                             // Vorg�nger als aktueller Schaltungsteil
    current.next = c0.next;                                // Referenz auf Nachfolger
    }
  simplify(p);                                             // Serien- oder Parallelschaltung mit einem Element verhindern
  }
  
// Ermitteln eines enthaltenen Voltmeters (rekursiv):
// c0 ... Gegebener Schaltungsteil
// Falls c0 kein Voltmeter enth�lt, ist der R�ckgabewert null.
  
function getVoltmeter (c0) {
  if (c0.type == "V") return c0;                           // R�ckgabewert, falls Voltmeter gegeben
  else if (isSingle(c0)) return null;                      // R�ckgabewert, falls Widerstand oder Amperemeter gegeben
  else {                                                   // Falls Serien- oder Parallelschaltung ...
  	var i = c0.first;                                      // Anfang der Schaltung
    while (i != null) {                                    // Solange definierter Schaltungsteil ...
      var vm = getVoltmeter(i);                            // Voltmeter in diesem Schaltungsteil suchen
      if (vm != null) return vm;                           // Falls Voltmeter gefunden, R�ckgabewert
      i = i.next;                                          // N�chster Schaltungsteil oder null
      }
    return null;                                           // R�ckgabewert, falls kein Voltmeter vorhanden
    }
  } 
  
// Ermitteln eines enthaltenen Amperemeters (rekursiv):
// c0 ... Gegebener Schaltungsteil
// Falls c0 kein Amperemeter enth�lt, ist der R�ckgabewert null.
  
function getAmperemeter (c0) {
  if (c0.type == "A") return c0;                           // R�ckgabewert, falls Amperemeter gegeben
  else if (isSingle(c0)) return null;                      // R�ckgabewert, falls Widerstand oder Voltmeter gegeben
  else {                                                   // Falls Serien- oder Parallelschaltung ...
    var i = c0.first;                                      // Anfang der Schaltung
    while (i != null) {                                    // Solange definierter Schaltungsteil ...
      var am = getAmperemeter(i);                          // Amperemeter in diesem Schaltungsteil suchen
      if (am != null) return am;                           // Falls Amperemeter gefunden, R�ckgabewert
      i = i.next;                                          // N�chster Schaltungsteil oder null
      }
    return null;                                           // R�ckgabewert, falls kein Amperemeter vorhanden
    }
  } 
  
//-------------------------------------------------------------------------------------------------

// Methoden f�r einzelne Schaltungselemente

// Die Methoden stammen aus der abstrakten Java-Klasse SingleRLC mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// F�r das zus�tzliche Instanzattribut type sind die Werte "R", "V" und "A" m�glich.

// Hinzuf�gen eines Schaltungsteils in Serie:
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertSerSingle (c0, c) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil oder null
  if (p == null) {                                         // Falls c0 einziges Element ...
    root = newCombSer();                                   // Neue Serienschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Serienschaltung
    c0.parent = c.parent = root;                           // Referenzen auf Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    c.parent = p;                                          // Referenz auf Serienschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger
    c0.next = current = c;                                 // Referenz auf neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    var ser = newCombSer();                                // Neue Serienschaltung
    ser.parent = p;                                        // Referenz auf �bergeordnete Parallelschaltung
    var prev = getPrevious(c0);                            // Vorg�nger von c0 (oder Anfang c0)
    if (prev == c0) {                                      // Falls c0 am Anfang der Parallelschaltung ...
      p.first = ser;                                       // Referenz auf neue Serienschaltung
      ser.next = c0.next;                                  // Referenz auf Nachfolger in der Parallelschaltung
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil
      c.parent = ser;                                      // Referenz auf neue Serienschaltung
      }
    else {                                                 // Falls c0 nicht am Anfang der Parallelschaltung ...
      ser.next = c0.next;                                  // Referenz auf Nachfolger in der Parallelschaltung
      prev.next = ser;                                     // Referenz auf neue Serienschaltung
      }
    ser.first = c0;                                        // Referenz auf c0 (Anfang der Serienschaltung)
    c0.parent = c.parent = ser;                            // Referenzen auf neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    }
  }
  
// Hinzuf�gen eines Schaltungsteils in Parallelschaltung:
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertParSingle (c0, c) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil oder null
  if (p == null) {                                         // Falls c0 einziges Element ...
    root = newCombPar();                                   // Neue Parallelschaltung als Wurzel
    root.first = c0;                                       // Aktueller Schaltungsteil als Anfang der Parallelschaltung
    c0.parent = c.parent = root;                           // Referenzen auf Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var par = newCombPar();                                // Neue Parallelschaltung
    par.parent = p;                                        // Referenz auf �bergeordnete Serienschaltung
    var prev = getPrevious(c0);                            // Vorg�nger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Serienschaltung ...
      p.first = par;                                       // Referenz auf neue Parallelschaltung
      par.next = c0.next;                                  // Referenz auf Nachfolger in der Serienschaltung
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil
      c.parent = par;                                      // Referenz auf neue Parallelschaltung
      }
    else {                                                 // Falls c0 nicht am Anfang der Serienschaltung ...
      par.next = c0.next;                                  // Referenz auf Nachfolger in der Serienschaltung
      prev.next = par;                                     // Referenz auf neue Parallelschaltung
      }
    par.first = c0;                                        // Referenz auf c0 (Anfang der Parallelschaltung)
    c0.parent = c.parent = par;                            // Referenzen auf die neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    c.parent = p;                                          // Referenz auf Parallelschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger
    c0.next = current = c;                                 // Referenz auf neuen Schaltungsteil
    }
  }

// Fiktive Zahl der nebeneinander liegenden Elemente:
    
function getNHorFictSingle (c0, nH) {
  return (c0 == root ? 1+nH : 1);                          // R�ckgabewert
  }

// Fiktive Zahl der �bereinander liegenden Elemente:
  
function getNVertFictSingle (c0, nV) {
  return (c0 == root ? 1+nV : 1);                          // R�ckgabewert
  }
  
// Geometrische Anordnung:
// c0 ... Gegebener Schaltungsteil
// x .... Abstand vom linken Rand (Pixel)
// y .... Abstand vom oberen Rand (Pixel)
// w .... Breite (Pixel)
// h .... H�he (Pixel)

function arrangeSingle (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben �bernehmen
  }

//-------------------------------------------------------------------------------------------------

// Methoden f�r Widerst�nde

// Die Methoden stammen aus der Java-Klasse Resistor mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "R". Ein neues Instanzattribut res steht f�r den Wert des Widerstands in Ohm.

// Ersatz f�r Resistor-Konstruktor:
// r ... Wert des Widerstands (Ohm)

function newResistor (r) {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "R";                                            // Typ Widerstand
  c.res = r;                                               // Wert des Widerstands (Ohm)
  return c;                                                // R�ckgabewert
  }
  
// Rechteck mit schwarzem Rand:
// (x,y) ... Koordinaten der Ecke links oben (Pixel)
// w ....... Breite (Pixel)
// h ....... H�he (Pixel)
// c ....... F�llfarbe (optional)

function rectangle (x, y, w, h, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausf�llen
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen
  }
  
// Hervorheben:
// c0 ... Gegebener Schaltungsteil (Widerstand)

function emphasizeR (c0) {
  if (c0 != current) return;                               // Hervorheben unn�tig?
  ctx.fillStyle = colorEmphasize;                          // F�llfarbe
  ctx.fillRect(c0.x+c0.w/2-W2-5,c0.y+c0.h/2-H2-5,2*W2+10,2*H2+10); // Ausgef�lltes Rechteck
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Widerstand)

function paintR (c0) {
  emphasizeR(c0);                                          // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt (Pixel)
  var c = (c0==current ? colorEmphasize : colorBackground);   // F�llfarbe
  rectangle(x0-W2,y0-H2,2*W2,2*H2,c);                      // Rechteck als Widerstandssymbol
  if (c0.parent == null || c0.parent.type != "P") {        // Falls c0 nicht Teil einer Parallelschaltung ...
    line(c0.x,y0,x0-W2,y0);                                // Zuleitung links
    line(x0+W2,y0,c0.x+c0.w,y0);                           // Zuleitung rechts
    }
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var s = ToString(c0.res,DIGITS,false);                   // Zeichenkette f�r Widerstand (ohne Einheit)
  var w = widthNumber(s)+widthString(" "+ohm);             // Breite (Pixel)
  var y = (w>2*W2-4 ? y0+25 : y0+5);                       // y-Koordinate f�r Widerstandsangabe (im Rechteck bzw. darunter)
  writeNumberUnit(s,ohm,x0,y,true);                        // Widerstandswert ausgeben
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden f�r Voltmeter

// Die Methoden stammen aus der Java-Klasse Voltmeter mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "V".

// Ersatz f�r Voltmeter-Konstruktor:

function newVoltmeter () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "V";                                            // Typ Voltmeter
  return c;                                                // R�ckgabewert
  }
  
// Hervorheben:
// c0 ... Gegebener Schaltungsteil (Voltmeter)

function emphasizeV (c0) {
  if (c0 != current) return;                               // Hervorhebung unn�tig?
  ctx.fillStyle = colorEmphasize;                          // F�llfarbe
  ctx.fillRect(c0.x+c0.w/2-30,c0.y+c0.h/2-30,60,60);       // Farbiges Rechteck
  }
  
// Grafikausgabe: 
// c0 ... Gegebener Schaltungsteil (Voltmeter)
  
function paintV (c0) {
  emphasize(c0);                                           // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt
  circle(x0,y0,20,colorBackground,colorVoltage,2);         // Kreis
  arrow(x0-10,y0+10,x0+10,y0-10,2);                        // Pfeil von links unten nach rechts oben
  line(c0.x,y0,x0-20,y0);                                  // Zuleitung links
  line(x0+20,y0,c0.x+c0.w,y0);                             // Zuleitung rechts
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe
  var s = ToString(getVoltage(c0),DIGITS,false);           // Angezeigte Spannung (ohne Einheit)
  writeNumberUnit(s,volt,x0+16,y0-16,false);               // Angezeigte Spannung ausgeben
  }

//-------------------------------------------------------------------------------------------------

// Methoden f�r Amperemeter

// Die Methoden stammen aus der Java-Klasse Amperemeter mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "A".

// Ersatz f�r Amperemeter-Konstruktor:

function newAmperemeter () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "A";                                            // Typ Amperemeter
  return c;                                                // R�ckgabewert
  }
  
// Hervorheben:
// c0 ... Gegebener Schaltungsteil (Amperemeter)

function emphasizeA (c0) {
  if (c0 != current) return;                               // Hervorhebung unn�tig?
  ctx.fillStyle = colorEmphasize;                          // F�llfarbe
  ctx.fillRect(c0.x+c0.w/2-30,c0.y+c0.h/2-30,60,60);       // Farbiges Rechteck
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Amperemeter)
  
function paintA (c0) {
  emphasize(c0);                                           // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt
  circle(x0,y0,20,colorBackground,colorAmperage,2);        // Kreis
  arrow(x0-10,y0+10,x0+10,y0-10,2);                        // Pfeil von links unten nach rechts oben
  line(c0.x,y0,x0-20,y0);                                  // Zuleitung links
  line(x0+20,y0,c0.x+c0.w,y0);                             // Zuleitung rechts
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe
  var s = ToString(getAmperage(c0),DIGITS,false);          // Angezeigte Stromst�rke (ohne Einheit)
  writeNumberUnit(s,ampere,x0+16,y0-16,false);
  }

//-------------------------------------------------------------------------------------------------

// Methoden f�r Serien- und Parallelschaltungen

// Die Methoden stammen aus der abstrakten Java-Klasse CombSerPar mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// F�r das zus�tzliche Instanzattribut type sind die Werte "S" und "P" m�glich.
// Das neue Instanzattribut first steht f�r den Anfang der Serien- oder Parallelschaltung (eine Hierachiestufe tiefer).

// Ermittlung des letzten untergeordneten Schaltungsteils:
// c0 ... Gegebene Serien- oder Parallelschaltung
// Bei fehlgeschlagener Suche ist der R�ckgabewert null. 

function getLast (c0) {
  var i = c0.first;                                        // Anfang der Schaltung oder null
  if (i == null) return null;                              // R�ckgabewert bei fehlgeschlagener Suche
  while (i.next != null) i = i.next;                       // �bergang zu Nachfolgern
  return i;                                                // R�ckgabewert
  }
  
// Zahl der Bestandteile (eine Hierarchiestufe tiefer):
// c0 ... Gegebene Serien- oder Parallelschaltung
  
function getNumber (c0) {
  var n = 0;                                               // Variable f�r die Anzahl, Startwert
  var i = c0.first;                                        // Anfang der Schaltung
  while (i != null) {n++; i = i.next;}                     // Bei gefundenen Bestandteilen Anzahl erh�hen
  return n;                                                // R�ckgabewert
  } 
  
// Reduzierung einer Serien- oder Parallelschaltung mit nur einem Element:
// c0 ... Gegebene Serien- oder Parallelschaltung
// Seiteneffekt root, current
  
function simplify (c0) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil
  var f = c0.first;                                        // Anfang der Serien- oder Parallelschaltung c0   
  if (f.next != null) return;                              // Falls mehr als ein Element, abbrechen  
  var a = (c0 == current);                                 // �berpr�fung, ob aktueller Schaltungsteil
  if (p == null) {                                         // Falls kein �bergeordneter Schaltungsteil vorhanden ...
    root = current = f;                                    // Referenzen auf einziges Element
    f.parent = f.next = null;                              // Referenzen l�schen, da nicht mehr n�tig
    return;                                                // Abbrechen
    }
  if (isSingle(p)) return;                                 // Sicher ist sicher!
  f.parent = p;                                            // Referenz auf �bergeordneten Schaltungsteil
  f.next = c0.next;                                        // Referenz auf Nachfolger von c0
  if (c0 == p.first) p.first = f;                          // Referenz auf einziges Element
  else getPrevious(c0).next = f;                           // Referenz auf einziges Element
  if (a) current = p;                                      // Aktueller Schaltungsteil
  }   

  
// Hervorhebung: 
// c0 ... Gegebene Serien- oder Parallelschaltung

function emphasizeSerPar (c0) {
  if (c0 != current) return;                               // Hervorheben unn�tig?
  ctx.fillStyle = colorEmphasize;                          // F�llfarbe
  ctx.fillRect(c0.x+5,c0.y+5,c0.w-10,c0.h-10);             // Ausgef�lltes Rechteck
  var r = getResistance(c0);                               // Ersatzwiderstand (Ohm)
  var s = ToString(r,DIGITS,false);                        // Zugeh�rige Zeichenkette (ohne Einheit)
  var w = widthNumber(s)+widthString(" "+ohm);             // Breite (Pixel)
  ctx.fillStyle = "#ffffff";                               // F�llfarbe
  ctx.fillRect(c0.x+15,c0.y+10,w+10,20);                   // Ausgef�lltes Rechteck
  ctx.fillStyle = "#000000";                               // Schriftfarbe                    
  writeNumberUnit(s,ohm,c0.x+20,c0.y+25,false);            // Ausgabe des Ersatzwiderstands (Ohm)
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden f�r Serienschaltungen

// Die Methoden stammen aus der Java-Klasse CombSer mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen),
// type (mit Wert "S") und first (Anfang der Serienschaltung, eine Hierachiestufe tiefer).

// Ersatz f�r CombSer-Konstruktor:

function newCombSer () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "S";                                            // Typ Serienschaltung
  c.first = null;                                          // Anfang der Serienschaltung
  return c;                                                // R�ckgabewert
  }
  
// Hinzuf�gen eines Schaltungsteils (in Serie):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt current
  
function insertSerS (c0, c) {
  getLast(c0).next = current = c;                          // Referenzen auf neuen Schaltungsteil
  c.parent = c0;                                           // Referenz auf gegebene Serienschaltung 
  }
  
// Hinzuf�gen eines Schaltungsteils (parallel):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt root, current
  
function insertParS (c0, c) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil
  if (p == null) {                                         // Falls c0 einziger Schaltungsteil ...
    root = newCombPar();                                   // Neue Parallelschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Parallelschaltung
    c0.parent = c.parent = root;                           // Referenzen auf neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var par = newCombPar();                                // Neue Parallelschaltung
    par.parent = p;                                        // Referenz auf �bergeordnete Serienschaltung
    var prev = getPrevious(c0);                            // Vorg�nger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Serienschaltung ...
      p.first = c.parent = par;                            // Referenzen auf neue Parallelschaltung 
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil               
      }
    else                                                   // Falls c0 nicht am Anfang der Serienschaltung ...                                  
      prev.next = par;                                     // Referenz auf neue Parallelschaltung
    par.next = c0.next;                                    // Referenz auf Nachfolger in der Serienschaltung
    par.first = c0;                                        // Referenz auf gegebenen Schaltungsteil
    c0.parent = c.parent = par;                            // Referenzen auf neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    c.parent = p;                                          // Referenz auf �bergeordnete Parallelschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger in der Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  }
  
 // Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente:
 // c0 ... Gegebener Schaltungsteil (Serienschaltung)
 // nH ... Zahl der maximal nebeneinander liegenden Einzelelemente des neuen Schaltungsteils
 // Dabei wird angenommen, dass rechts neben dem Schaltungsteil current ein neuer Schaltungsteil eingebaut wird.
    
function getNHorFictS (c0, nH) {
  if (c0 == root && c0 == current) return getNHor(c0)+nH;  // R�ckgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  var n = 0;                                               // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (i == current) n += getNHor(i)+nH;                  // Anzahl aktualieren, 1. Fall
    else n += getNHorFict(i,nH);                           // Anzahl aktualisien, 2. Fall
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return n;                                                // R�ckgabewert
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
   
function getNHorS (c0) {
  var i = c0.first;                                        // Anfang der Serienschaltung
  var n = 0;                                               // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    n += getNHor(i);                                       // Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return n;                                                // R�ckgabewert
  }
  
// Fiktive Zahl der maximal �bereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// nV ... Zahl der maximal �bereinander liegenden Einzelelemente des neuen Schaltungsteils
// Dabei wird angenommen, dass unterhalb des Schaltungsteils current ein neuer Schaltungsteil eingebaut wird.
    
function getNVertFictS (c0, nV) {
  var nMax = 0;                                            // Variable f�r Anzahl, Startwert
  if (c0 == root && c0 == current) return getNVert(c0)+nV; // R�ckgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n;                                                 // Hilfsvariable
    if (i == current) n = getNVert(i)+nV;                  // Hilfsvariable, 1. Fall
    else n = getNVertFict(i,nV);                           // Hilfsvariable, 2. Fall
    if (n > nMax) nMax = n;                                // Falls gr��er als bisher, Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return nMax;                                             // R�ckgabewert	
  }
  
// Wirkliche Zahl der maximal �bereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function getNVertS (c0) {
  var i = c0.first;                                        // Anfang der Serienschaltung
  var nMax = 0;                                            // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n = getNVert(i);                                   // Hilfsvariable
    if (n > nMax) nMax = n;                                // Falls gr��er als bisher, Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return nMax;                                             // R�ckgabewert
  }
  
// Ersatzwiderstand:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function getResistanceS (c0) {
  var res = 0;                                             // Variable f�r Ersatzwiderstand, Startwert
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var r = getResistance(i);                              // Teilwiderstand
    if (isInfinite(r)) return POS_INF;                     // R�ckgabewert, falls Teilwiderstand unendlich
    else res += r;                                         // Aktuellen Teilwiderstand zur Summe hinzuf�gen
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return res;                                              // R�ckgabewert 
  }
  
// Geometrische Neuanordnung der Schaltung (rekursiv):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... H�he (Pixel)
// Seiteneffekt: (x,y,w,h) f�r untergeordnete Schaltungsteile
  
function arrangeS (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben �bernehmen
  var n = getNHor(c0);                                     // Anzahl der nebeneinander liegenden Schaltungsteile
  var xx = x;                                              // x-Koordinate eines Bestandteils der Serienschaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var ww = getNHor(i)*w/n;                               // Breite eines Bestandteils der Serienschaltung
    arrange(i,xx,y,ww,h);                                  // Geometrische Anordnung f�r Bestandteil (Rekursion!)
    xx += ww;                                              // x-Koordinate f�r n�chsten Bestandteil
    i = i.next;                                            // N�chster Schaltungsteil
    }
  }
    
 // Grafikausgabe:
 // c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function paintS (c0) {
  emphasizeSerPar(c0);                                     // Serienschaltung hervorheben
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    paint(i);                                              // Schaltungsteil zeichnen
    i = i.next;                                            // N�chster Schaltungsteil
    }
  }

//-------------------------------------------------------------------------------------------------

// Methoden f�r Parallelschaltungen

// Die Methoden stammen aus der Java-Klasse CombPar mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (�bergeordneter 
// Schaltungsteil), next (n�chster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen),
// type (mit Wert "P") und first (Anfang der Parallelschaltung, eine Hierachiestufe tiefer).

// Ersatz f�r CombPar-Konstruktor:

function newCombPar () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "P";                                            // Typ Parallelschaltung
  c.first = null;                                          // Anfang der Parallelschaltung
  return c;                                                // R�ckgabewert
  }
  
// Hinzuf�gen eines Schaltungsteils (in Serie):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt root, current
  
function insertSerP (c0, c) {
  var p = c0.parent;                                       // �bergeordneter Schaltungsteil
  if (p == null) {                                         // Falls c0 einziger Schaltungsteil ...
    root = newCombSer();                                   // Neue Serienschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Serienschaltung
    c0.parent = c.parent = root;                           // Referenzen auf neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    c.parent = p;                                          // Referenz auf �bergeordnete Serienschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger in der Serienschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    var ser = newCombSer();                                // Neue Serienschaltung
    ser.parent = p;                                        // Referenz auf �bergeordnete Parallelschaltung
    var prev = getPrevious(c0);                            // Vorg�nger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Parallelschaltung ...
      p.first = c.parent = ser;                            // Referenzen auf neue Serienschaltung
      c0.next = c;                                         // Referenz auf den neuen Schaltungsteil
      }
    else                                                   // Falls c0 nicht am Anfang der Parallelschaltung ...
      prev.next = ser;                                     // Referenz auf neue Serienschaltung
    ser.next = c0.next;                                    // Referenz auf Nachfolger in der Parallelschaltung
    ser.first = c0;                                        // Referenz auf gegebenen Schaltungsteil
    c0.parent = c.parent = ser;                            // Referenzen auf die neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  }
  
// Hinzuf�gen eines Schaltungsteils (parallel):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt current
  
function insertParP (c0, c) {
  getLast(c0).next = current = c;                          // Referenzen auf den neuen Schaltungsteil
  c.parent = c0;                                           // Referenz auf den gegebenen Schaltungsteil
  }
  
// Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// nH ... Zahl der maximal nebeneinander liegenden Einzelelemente des neuen Schaltungsteils
    
function getNHorFictP (c0, nH) {
  var nMax = 0;                                            // Variable f�r Anzahl
  if (c0 == root && c0 == current) return getNHor(c0)+nH;  // R�ckgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Parallelschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n;                                                 // Hilfsvariable
    if (i == current) n = getNHor(i)+nH;                   // Hilfsvariable, 1. Fall
    else n = getNHorFict(i,nH);                            // Hilfsvariable, 2. Fall
    if (n > nMax) nMax = n;                                // Falls gr��er als bisher, Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungteil
    }
  return nMax;                                             // R�ckgabewert  		
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getNHorP (c0) {
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var nMax = 0;                                            // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n = getNHor(i);                                    // Hilfsvariable
    if (n > nMax) nMax = n;                                // Falls gr��er als bisher, Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return nMax;                                             // R�ckgabewert
  }
  
// Fiktive Zahl der maximal �bereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// nV ... Zahl der maximal �bereinander liegenden Einzelelemente des neuen Schaltungsteils
  
function getNVertFictP (c0, nV) {
  if (c0 == root && c0 == current) return getNVert(c0)+nV; // R�ckgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var n = 0;                                               // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (i == current) n += getNVert(i)+nV;                 // Anzahl aktualisieren, 1. Fall
    else n += getNVertFict(i,nV);                          // Anzahl aktualisieren, 2. Fall
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return n;                                                // R�ckgabewert 	
  }
  
// Wirkliche Zahl der maximal �bereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getNVertP (c0) {
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var n = 0;                                               // Variable f�r Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    n += getNVert(i);                                      // Anzahl aktualisieren
    i = i.next;                                            // N�chster Schaltungsteil
    }
  return n;                                                // R�ckgabewert
  }
  
// Ersatzwiderstand:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getResistanceP (c0) {
  if (c0.first == null) return Number.NaN;                 // Sicher ist sicher!
  var res = getResistance(c0.first);                       // Widerstand des ersten Bestandteils der Parallelschaltung
  if (res == 0) return 0;                                  // R�ckgabewert, da Ersatzwiderstand schon klar   
  var i = c0.first.next;                                   // N�chster Bestandteil der Parallelschaltung oder null
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var r2 = getResistance(i);                             // Widerstand des Bestandteils
    i = i.next;                                            // N�chster Bestandteil der Parallelschaltung oder null
    if (r2 == 0) return 0;                                 // R�ckgabewert, da Ersatzwiderstand schon klar
    if (isInfinite(r2)) continue;                          // Unendlichen Widerstand ignorieren
    if (isInfinite(res)) res = r2;                         // Ersatzwiderstand aktualisieren, falls bisher unendlich
    else res = res*r2/(res+r2);                            // Ersatzwiderstand aktualisieren (Normalfall)
    }
  return res;                                              // R�ckgabewert 
  }
  
// Geometrische Neuanordnung der Schaltung (rekursiv):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... H�he (Pixel)
// Seiteneffekt: (x,y,w,h) f�r untergeordnete Schaltungsteile
  
function arrangeP (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben �bernehmen
  var n = getNVert(c0)-1;                                  // Anzahl
  var i = c0.first;                                        // Anfang der Parallelschaltung
  if (getNumber(c0) == 2 && c0.first.next.type == "V") {   // Sonderfall (Widerstand mit Voltmeter)
    var yy = y+h/2-n*h/(2*n+4);                            // y-Koordinate f�r Bestandteil der Parallelschaltung
    while (i != null) {                                    // Solange Schaltungsteil definiert ...
      var hh = getNVert(i)*h/(n+2);                        // H�he f�r aktuellen Teil der Parallelschaltung
      arrange(i,x+2*DIST,yy,w-4*DIST,hh);                  // Geometrische Anordnung f�r aktuellen Teil (Rekursion!)
      yy += hh;                                            // y-Koordinate f�r n�chsten Bestandteil
      i = i.next;                                          // N�chster Schaltungsteil
      }
    } // Ende Sonderfall
  else {                                                   // Normalfall
    yy = y;                                                // y-Koordinate f�r Anfang der Parallelschaltung
    n++;                                                   // Anzahl um 1 erh�hen
    while (i != null) {                                    // Solange Schaltungsteil definiert ... 
      hh = getNVert(i)*h/n;                                // H�he f�r aktuellen Teil der Parallelschaltung
      arrange(i,x+2*DIST,yy,w-4*DIST,hh);                  // Geometrische Anordnung f�r aktuellen Teil (Rekursion!)
      yy += hh;                                            // y-Koordinate f�r n�chsten Bestandteil
      i = i.next;                                          // N�chster Schaltungsteil
      }
    } // Ende Normalfall
  }
  
// Spezialfall (Widerstand mit parallelgeschaltetem Voltmeter):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)

function paintSpecial (c0) {
  emphasize(c0);                                           // Eventuell hervorheben
  var e = c0.first;                                        // Normales Element (z. B. Widerstand)
  var v = e.next;                                          // Voltmeter
  paint(e);                                                // Normales Element zeichnen
  paint(v);                                                // Voltmeter zeichnen
  var xL = c0.x;                                           // x-Koordinate linker Rand von c0
  var xR = c0.x+c0.w;                                      // x-Koordinate rechter Rand von c0
  var xE = e.x+e.w/2;                                      // x-Koordinate des normalen Elements
  var yE = e.y+e.h/2;                                      // y-Koordinate des normalen Elements
  var yV = v.y+v.h/2;                                      // y-Koordinate des Voltmeters
  if (e.type == "R") {                                     // Falls Widerstand ...
    line(xL+DIST,yE,xE-W2,yE);                             // Anschlussdraht links
    line(xE+W2,yE,xR-DIST,yE);                             // Anschlussdraht rechts
    }
  else {                                                   // Falls kein Widerstand ...
    line(xL+DIST,yE,xL+2*DIST,yE);                         // Anschlussdraht links
    line(xR-2*DIST,yE,xR-DIST,yE);                         // Anschlussdraht rechts
    }
  line(xL+DIST,yV,xL+DIST,yE);                             // Senkrechtes Drahtst�ck links
  line(xR-DIST,yV,xR-DIST,yE);                             // Senkrechtes Drahtst�ck rechts
  circle(xL+DIST,yE,2.5,"#000000");                        // Knoten links
  circle(xR-DIST,yE,2.5,"#000000");                        // Knoten rechts
  line(xL,yE,xL+DIST,yE);                                  // Waagrechtes Drahtst�ck links oben
  line(xR-DIST,yE,xR,yE);                                  // Waagrechtes Drahtst�ck rechts oben
  line(xL+DIST,yV,xL+2*DIST,yV);                           // Waagrechtes Drahtst�ck links (zum Voltmeter)
  line(xR-2*DIST,yV,xR-DIST,yV);                           // Waagrechtes Drahtst�ck rechts (zum Voltmeter)
  }
    
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function paintP (c0) {
  if (getNumber(c0) == 2 && c0.first.next.type == "V")     // Falls einzelnes Element mit Voltmeter ...
    {paintSpecial(c0); return;}                            // Spezielle Methode aufrufen und abbrechen
  emphasize(c0);                                           // Eventuell hervorheben
  var i = c0.first;                                        // Anfang der Parallelschaltung (oben)
  var y1 = 0, y0 = i.y+i.h/2;                              // y-Koordinaten
  var xL = c0.x;                                           // x-Koordinate linker Rand von c0
  var xR = c0.x+c0.w;                                      // x-Koordinate rechter Rand von c0
  ctx.fillStyle = "#000000";                               // F�llfarbe
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    paint(i);                                              // Schaltungsteil zeichnen
    if (i.next == null) y1 = i.y+i.h/2;                    // Falls Schaltungsteil undefiniert, y1 �ndern
    var yy = i.y+i.h/2;                                    // y-Koordinate f�r aktuellen Schaltungsteil
    var node = (i != c0.first && i.next != null);          // Bedingung f�r Knoten
    if (node) {                                            // Falls Knoten vorhanden ...
      circle(xL+DIST,yy,2.5,"#000000");                    // Knoten links
      circle(xR-DIST,yy,2.5,"#000000");                    // Knoten rechts
      }
    if (i.type == "R") {                                   // Falls Widerstand ...
      line(xL+DIST,yy,i.x+i.w/2-W2,yy);                    // Zuleitung links
      line(i.x+i.w/2+W2,yy,xR-DIST,yy);                    // Zuleitung rechts
      }
    else {                                                 // Falls kein Widerstand ...
      line(xL+DIST,yy,xL+2*DIST,yy);                       // Zuleitung links
      line(xR-2*DIST,yy,xR-DIST,yy);                       // Zuleitung rechts
      }
    i = i.next;                                            // N�chster Bestandteil der Parallelschaltung
    } // Ende while-Schleife
  line(xL+DIST,y0,xL+DIST,y1);                             // Senkrechter Draht links
  line(xR-DIST,y0,xR-DIST,y1);                             // Senkrechter Draht rechts
  y0 = c0.y+c0.h/2;                                        // y-Koordinate
  line(xL,y0,xL+DIST,y0);                                  // Kurzer Anschlussdraht links
  circle(xL+DIST,y0,2.5,"#000000");                        // Knoten links
  line(xR-DIST,y0,xR,y0);                                  // Kurzer Anschlussdraht rechts
  circle(xR-DIST,y0,2.5,"#000000");                        // Knoten rechts
  }

 


         

