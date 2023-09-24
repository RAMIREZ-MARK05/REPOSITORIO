// Wheatstonesche Br�ckenschaltung
// Java-Applet (11.02.2006) umgewandelt
// 24.08.2016 - 15.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel wheatstonebridge_de.js) abgespeichert.

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
var bu1, bu2;                                              // Schaltkn�pfe
var ip1, ip2, ip3, ip4;                                    // Eingabefelder
var sl;                                                    // Schieberegler
var slL, slR;                                              // Schaltkn�pfe zur Feineinstellung des Schiebereglers
var cb1, cb2;                                              // Optionsfelder

var state;                                                 // Zustand (0 oder 1)
var drag;                                                  // Flag f�r Zugmodus                           
  
var u0;                                                    // Spannung der Stromquelle (Volt)
var rx;                                                    // Unbekannter Widerstand (Ohm)
var rv;                                                    // Vergleichswiderstand (Ohm)
var rs;                                                    // Schiebewiderstand (Ohm)
var rm;                                                    // Widerstand Amperemeter (Ohm)
var q;                                                     // Abgriffstelle (0 bis 1)
var i1;                                                    // Stromst�rke links vom Schiebewiderstand (Ampere)
var i2;                                                    // Stromst�rke rechts vom Schiebewiderstand (Ampere)
var i3;                                                    // Stromst�rke im unbekannten Widerstand (Ampere)
var i4;                                                    // Stromst�rke im Vergleichswiderstand (Ampere)
var i5;                                                    // Stromst�rke im Amperemeter (Ampere)
var i0;                                                    // Stromst�rke in der Stromquelle (Ampere)

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
  bu1 = getElement("bu1",text01);                          // Oberer Schaltknopf (Neue Messung)
  bu1.disabled = true;                                     // Schaltknopf zun�chst deaktiviert
  getElement("ip1a",text02);                               // Erkl�render Text (Vergleichswiderstand)
  ip1 = getElement("ip1b");                                // Eingabefeld (Vergleichswiderstand)
  getElement("ip1c",ohm);                                  // Einheit (Vergleichswiderstand)
  getElement("ip2a",text03);                               // Erkl�render Text (Schiebewiderstand)
  ip2 = getElement("ip2b");                                // Eingabefeld (Schiebewiderstand)
  getElement("ip2c",ohm);                                  // Einheit (Schiebewiderstand)
  getElement("sla",text04);                                // Erkl�render Text (Position des Schleifkontakts)
  slL = getElement("slb");                                 // Feineinstellung Schieberegler links
  sl = getElement("slc");                                  // Schieberegler (Schleifkontakt)
  slR = getElement("sld");                                 // Feineinstellung Schieberegler rechts
  getElement("ip3a",text05);                               // Erkl�render Text (Spannung der Stromquelle)
  ip3 = getElement("ip3b");                                // Eingabefeld (Spannung der Stromquelle)
  getElement("ip3c",volt);                                 // Einheit (Spannung der Stromquelle)                
  getElement("ip4a",text06);                               // Erkl�render Text (Widerstand des Amperemeters)
  ip4 = getElement("ip4b");                                // Eingabefeld (Widerstand des Amperemeters)
  getElement("ip4c",ohm);                                  // Einheit (Widerstand des Amperemeters)
  bu2 = getElement("bu2",text07);                          // Unterer Schaltknopf (Widerstand berechnen)
  bu2.disabled = true;                                     // Schaltknopf zun�chst deaktiviert
  cb1 = getElement("cb1a");                                // Optionsfeld (Spannung angeben)
  cb1.checked = false;                                     // Optionsfeld zun�chst nicht ausgew�hlt
  getElement("cb1b",text08);                               // Erkl�render Text (Spannung angeben)
  cb2 = getElement("cb2a");                                // Optionsfeld (Stromst�rke angeben)
  cb2.checked = false;                                     // Optionsfeld zun�chst nicht ausgew�hlt
  getElement("cb2b",text09);                               // Erkl�render Text (Stromst�rke angeben)
  getElement("author",author);                             // Autor (und �bersetzer)
  enableInputFields(true);                                 // Eingabefelder zun�chst aktivieren
  enableSlider(true);                                      // Schieberegler und Feineinstellung zun�chst aktivieren
  
  q = 0.2;                                                 // Startwert Abgriffstelle Schleifkontakt
  u0 = 5;                                                  // Spannung Stromquelle (Volt) 
  rx = Math.floor(10+990*Math.random());                   // Unbekannter Widerstand (Ohm)
  rv = 500;                                                // Vergleichswiderstand (Ohm) 
  rs = 200;                                                // Schiebewiderstand (Ohm) 
  rm = 5;                                                  // Widerstand Amperemeter (Ohm)
  state = 0;                                               // Zustand vor Einstellung des Schiebereglers
  updateInput();                                           // Eingabefelder und Schieberegler aktualisieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  calculate();                                             // Berechnungen durchf�hren
  paint();                                                 // Neu zeichnen
  
  bu1.onclick = reactionButton1;                           // Reaktion auf oberen Schaltknopf (Neue Messung)
  bu2.onclick = reactionButton2;                           // Reaktion auf unteren Schaltknopf (Widerstand berechnen)
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Vergleichswiderstand)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Schiebewiderstand)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Spannung)
  ip4.onkeydown = reactionEnter;                           // Reaktion auf Eingabe (Messger�twiderstand)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Vergleichswiderstand)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Schiebewiderstand)
  ip3.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Spannung)
  ip4.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Messger�twiderstand)
  cb1.onclick = paint;                                     // Reaktion auf Optionsfeld (Spannung angeben)
  cb2.onclick = paint;                                     // Reaktion auf Optionsfeld (Stromst�rke angeben)
  sl.oninput = reactionSliderInput;                        // Reaktion auf Schieberegler (Bewegung)
  sl.onchange = reactionSliderChange;                      // Reaktion auf Schieberegler (abgeschlossene Eingabe)
  slL.onclick = reactionSliderLeft;                        // Reaktion auf Feineinstellung Schieberegler (links)
  slR.onclick = reactionSliderRight;                       // Reaktion auf Feineinstellung Schieberegler (rechts)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers              
  } // Ende der Methode start
   
// Reaktion auf oberen Schaltknopf (Neue Messung):
// Seiteneffekt state, rx, rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5, Wirkung auf Schaltfl�che 
   
function reactionButton1 () {
  state = 0;                                               // Zustand vor Messung
  rx = Math.floor(10+990*Math.random());                   // Unbekannter Widerstand (Ohm)
  cb1.checked = cb2.checked = false;                       // Optionsfelder nicht ausgew�hlt
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen                                           
  enableInputFields(true);                                 // Eingabefelder aktivieren
  enableSlider(true);                                      // Schieberegler und Feineinstellung aktivieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  }
  
// Reaktion auf unteren Schaltknopf (Widerstand berechnen):
// Seiteneffekt state, rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5

function reactionButton2 () {
  state = 1;                                               // Zustand Widerstandsberechnung
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  bu1.disabled = false;                                    // Oberen Schaltknopf aktivieren
  bu2.disabled = true;                                     // Unteren Schaltknopf deaktivieren
  }
  
// Reaktion auf Bewegung des Schiebereglers (Position Schleifkontakt):
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5
  
function reactionSliderInput () {
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  enableInputFields(false);                                // Eingabefelder deaktivieren
  }
  
// Reaktion auf abgeschlossene Schieberegler-Eingabe (Position Schleifkontakt):
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5
  
function reactionSliderChange () {
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  drag = false;                                            // Zugmodus deaktivieren
  prepareState1();                                         // Gegebenenfalls Zustand 1 (Berechnung) vorbereiten
  }
  
// Reaktion auf Feineinstellung des Schiebereglers (links):
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5
  
function reactionSliderLeft () {
  sl.value = Math.max(Number(sl.value)-1,0);               // Position um 1 nach links, falls m�glich
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  enableInputFields(false);                                // Eingabefelder deaktivieren
  prepareState1();                                         // Gegebenenfalls Zustand 1 (Berechnung) vorbereiten
  }
  
// Reaktion auf Feineinstellung des Schiebereglers (rechts):
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5
  
function reactionSliderRight () {
  sl.value = Math.min(Number(sl.value)+1,200);             // Position um 1 nach rechts, falls m�glich
  reaction(false);                                         // Eingabe, Berechnungen, neu zeichnen
  enableInputFields(false);                                // Eingabefelder deaktivieren
  prepareState1();                                         // Gegebenenfalls Zustand 1 (Berechnung) vorbereiten
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
// Seiteneffekt q, rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5, Wirkung auf Schieberegler 

function reactionMove (u, v) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  if (sl.disabled) return;                                 // Falls Schieberegler deaktiviert, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (u < X_POT) u = X_POT;                                // Position links vom Schiebewiderstand korrigieren
  if (u > X_POT+W_POT) u = X_POT+W_POT;                    // Position rechts vom Schiebewiderstand korrigieren
  q = (u-X_POT)/W_POT;                                     // Position des Schleifkontakts (0 bis 1)
  sl.value = u-X_POT;                                      // Schieberegler aktualisieren
  reaction(true);                                          // Eingabe, Berechnungen, neu zeichnen
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Ber�hrung:
// Seiteneffekt drag, Wirkung auf unteren Schaltknopf und Schieberegler
  
function reactionUp () {
  drag = false;                                            // Zugmodus beenden
  prepareState1();                                         // Gegebenenfalls Zustand 1 (Berechnung) vorbereiten
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5
  
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

// Berechnung der Stromst�rken (Kirchhoffsche Regeln, L�sung mit CAS):
// Seiteneffekt i0, i1, i2, i3, i4, i5
  
function calculate () {
  var r1 = q*rs;                                           // Linker Teil Schiebewiderstand (Ohm)
  var r2 = rs-r1;                                          // Rechter Teil Schiebewiderstand (Ohm)
  var r3 = rx;                                             // Unbekannter Widerstand (Ohm)
  var r4 = rv;                                             // Vergleichswiderstand (Ohm)
  var r5 = rm;                                             // Widerstand Amperemeter (Ohm)
  var denom = r1*(r2*r3+r2*r4+r3*r4+r3*r5+r4*r5)           // Hilfsgr��e (Nenner)
  	        + r2*(r3*r4+r3*r5+r4*r5);
  i1 = (r2*r3+r3*r4+r3*r5+r4*r5)*u0/denom;                 // Stromst�rke links vom Schiebewiderstand (Ampere)
  i2 = (r1*r4+r3*r4+r3*r5+r4*r5)*u0/denom;                 // Stromst�rke rechts vom Schiebewiderstand (Ampere)
  i3 = (r1*r2+r1*r4+r1*r5+r2*r5)*u0/denom;                 // Stromst�rke im unbekannten Widerstand (Ampere)
  i4 = (r1*r2+r1*r5+r2*r3+r2*r5)*u0/denom;                 // Stromst�rke im Vergleichswiderstand (Ampere)
  i5 = (r1*r4-r2*r3)*u0/denom;                             // Stromst�rke im Amperemeter (Ampere)
  i0 = i1+i3;                                              // Stromst�rke in der Stromquelle (Ampere)
  }
  
// �berpr�fung, ob Schiebregler richtig eingestellt ist:

function sliderCorrect () {  
  var pos = 200*rx/(rx+rv);                                // Richtige Position (0 bis 200)
  return (Math.abs(sl.value-pos) < 1);                     // R�ckgabewert
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
  
// Formatierte Ausgabe der Stromst�rke f�r Digital-Amperemeter:
// i ... Stromst�rke (Ampere)
// R�ckgabewert: Zeichenkette im Format "+0000,0 mA"
    
function stringAmperage (i) {
  var s = ToString(Math.abs(1000*i),1,true);               // Zeichenkette f�r Betrag in Milliampere 
  while (s.length < 6) s = "0"+s;                          // F�hrende Nullen 
  if (i5 > 0) s = "+"+s;                                   // Entweder Pluszeichen ...
  else if (i5 == 0) s = " "+s;                             // ... oder Leerzeichen ...
  else s = "\u2212"+s;                                     // ... oder Minuszeichen voranstellen
  return s+" "+milliampere;                                // R�ckgabewert
  }
    
// Aktualisierung von Eingabefeldern und Schieberegler:

function updateInput() {
  ip1.value = ToString(rv,0,true);                         // Vergleichswiderstand (Ohm)
  ip2.value = ToString(rs,0,true);                         // Schiebewiderstand (Ohm)
  sl.value = Math.round(q*200);                            // Position Schleifkontakt (0 bis 200)
  ip3.value = ToString(u0,1,true);                         // Spannung Stromquelle (Volt)
  ip4.value = ToString(rm,1,true);                         // Widerstand Amperemeter (Ohm)
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
// Seiteneffekt rv, rs, u0, rm, q, i0, i1, i2, i3, i4, i5, Wirkung auf Schaltfl�che
    
function reaction (mouse) {
  var ae = document.activeElement;                         // Aktives Element
  rv = inputNumber(ip1,0,true,1,1000);                     // Vergleichswiderstand (Ohm) aus Eingabefeld
  rs = inputNumber(ip2,0,true,1,1000);                     // Schiebewiderstand (Ohm) aus Eingabefeld
  u0 = inputNumber(ip3,1,true,0,10);                       // Spannung Stromquelle (Volt) aus Eingabefeld
  rm = inputNumber(ip4,1,1,10);                            // Widerstand Amperemeter (Ohm) aus Eingabefeld
  if (!mouse) q = sl.value/200;                            // Position Schleifkontakt (0 bis 1)                             
  calculate();                                             // Berechnungen durchf�hren 
  paint();                                                 // Neu zeichnen
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip3) focus(ip4);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip4) ip4.blur();                               // Fokus abgeben
  }
  
// Aktivierung/Deaktivierung der Eingabefelder:
// a ... Flag f�r Aktivierung
  
function enableInputFields (a) {
  ip1.readOnly = !a;                                       // Eingabefeld Vergleichswiderstand
  ip2.readOnly = !a;                                       // Eingabefeld Schiebewiderstand
  ip3.readOnly = !a;                                       // Eingabefeld Spannung
  ip4.readOnly = !a;                                       // Eingabefeld Messger�twiderstand
  }
  
// Aktivierung/Deaktivierung des Schiebereglers:
// a ... Flag f�r Aktivierung
  
function enableSlider (a) {
  sl.disabled = !a;                                        // Schieberegler
  slL.disabled = !a;                                       // Feineinstellung links
  slR.disabled = !a;                                       // Feineinstellung rechts
  }
  
// Vorbereitung von Zustand 1 (Berechnung): 

function prepareState1 () {
  if (!sliderCorrect()) return;                            // Falls Schieberegler nicht in korrekter Position, abbrechen
  bu2.disabled = false;                                    // Unteren Schaltknopf aktivieren
  enableSlider(false);                                     // Schieberegler deaktivieren
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
// i ....... Index (optional)
    
function centerText (s, x, y, i) {
  ctx.textAlign = "left";                                  // Textausrichtung
  var dx1 = ctx.measureText(s).width;                      // L�nge des normalen Textes
  x -= ctx.measureText(s+(i?i:"")).width/2;                // x-Koordinate f�r Textanfang
  ctx.fillText(s,x,y+DY);                                  // Normaler Text
  if (i) ctx.fillText(i,x+dx1,y+DY+4);                     // Gegebenenfalls Index
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
  ctx.moveTo(185,350);                                     // Anfangspunkt (Minuspol)
  ctx.lineTo(360,350);                                     // Weiter nach rechts
  ctx.lineTo(360,40);                                      // Weiter nach oben
  ctx.lineTo(340,40);                                      // Weiter nach links zum Vergleichswiderstand
  ctx.moveTo(185,340);                                     // Neuer Anfangspunkt (Pluspol)
  ctx.lineTo(40,340);                                      // Weiter nach links
  ctx.lineTo(40,40);                                       // Weiter nach oben
  ctx.lineTo(60,40);                                       // Weiter nach rechts zum unbekannten Widerstand
  ctx.stroke();                                            // Dr�hte zeichnen
  line(180,40,220,40);                                     // Draht zwischen den Widerst�nden (oben)
  line(40,230,100,230);                                    // Linke Zuleitung Schiebewiderstand
  line(360,230,300,230);                                   // Rechte Zuleitung Schiebewiderstand
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(210,130);                                     // Anfangspunkt (rechte Buchse Amperemeter)
  ctx.lineTo(210,160);                                     // Weiter nach unten
  ctx.lineTo(300,160);                                     // Weiter nach rechts
  ctx.lineTo(300,80);                                      // Weiter nach oben
  ctx.lineTo(200,80);                                      // Weiter nach links
  ctx.lineTo(200,40);                                      // Weiter nach oben zum Knoten
  ctx.moveTo(190,130);                                     // Neuer Anfangspunkt (linke Buchse Amperemeter)
  ctx.lineTo(190,180);                                     // Weiter nach unten
  var x = 100+q*200;                                       // Waagrechte Koordinate f�r Schleifkontakt
  ctx.lineTo(x,180);                                       // Weiter nach rechts oder links
  ctx.stroke();                                            // Dr�hte zeichnen
  arrow(x,180,x,210);                                      // Pfeil f�r Schleifkontakt
  for (var y=210; y<250; y+=2) line(x,y,x,y+1);            // Gepunktete Linie       
  node(200,40);                                            // Knoten oben
  node(40,230);                                            // Knoten links
  node(360,230);                                           // Knoten rechts
  }
  
// Stromquelle:
    
function power () {
  rectangle(170,300,60,60,colorVoltage);                   // Geh�use    
  node(185,340);                                           // Obere Buchse (Pluspol)
  node(185,350);                                           // Untere Buchse (Minuspol)
  circle(200,320,10,1,"#000000");                          // Drehknopf
  var w = (210-u0*24)*DEG;                                 // Winkel f�r Drehknopfstellung (Bogenma�)
  radialLine(200,320,w,0,10,"#ffffff",1.5);                // Linie f�r Drehknopf 
  for (var u=0; u<=10; u++) {                              // F�r alle Markierungen der Skala ...
    w = (210-u*24)*DEG;                                    // Winkel (Bogenma�)
    radialLine(200,320,w,10,14);                           // Markierung
    }
  rectangle(190,339.5,7,1,"#000000");                      // Pluszeichen, waagrechte Linie
  rectangle(193,336.5,1,7,"#000000");                      // Pluszeichen, senkrechte Linie
  rectangle(173,349.5,7,1,"#000000");                      // Minuszeichen
  }
  
// Widerst�nde mit Beschriftung:
      
function resistors () {
  rectangle(60,20,120,40,colorBackground,2);               // Unbekannter Widerstand (links oben)
  rectangle(220,20,120,40,colorBackground,2);              // Vergleichswiderstand (rechts oben)
  rectangle(100,210,200,40,colorBackground,2);             // Schiebewiderstand (unten)
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (state == 0) centerText(symbolUnknown,120,40);        // Beschriftung 1 f�r unbekannten Widerstand
  else centerText(symbolResistance1,120,40,symbolResistance2);  // Beschriftung 2 f�r unbekannten Widerstand
  centerText(value(rv,1,ohm),280,40);                      // Beschriftung f�r Vergleichswiderstand
  var s = value(rs,1,ohm);                                 // Beginn der Zeichenkette f�r den Schiebewiderstand
  s += " = "+value(q*rs,1,ohm);                            // Zeichenkette erweitern (Schiebewiderstand, linker Teil)
  s += " + "+value(rs-q*rs,1,ohm);                         // Zeichenkette erweitern (Schiebewiderstand, rechter Teil)
  centerText(s,200,230);                                   // Zeichenkette ausgeben     
  }
      
// Digital-Amperemeter:
// (x|y) ... Mittelpunkt (Pixel)
      
function meter (x, y) {
  rectangle(x-70,y-20,140,40,colorAmperage);               // Geh�use
  rectangle(x-60,y-15,120,20);                             // Anzeige
  node(x-10,y+12);                                         // Linke Buchse
  node(x+10,y+12);                                         // Rechte Buchse
  line(x-24,y+12,x-16,y+12);                               // Minuszeichen (links)
  line(x+16,y+12,x+24,y+12);                               // Pluszeichen (rechts), waagrechte Linie
  line(x+20,y+8,x+20,y+16);                                // Pluszeichen (rechts), senkrechte Linie
  ctx.font = FONT2;                                        // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = "#ff0000";                               // Schriftfarbe
  ctx.fillText(stringAmperage(i5),x,y-1);                  // Stromst�rke in Milliampere ausgeben
  }
      
// Skala f�r Schiebewiderstand:
      
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
      
// Hilfsroutine:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// R�ckgabewert: Neue x-Koordinate (Pixel)

function write (s, x, y) {
  ctx.fillText(s,x,y);                                     // Zeichenkette ausgeben
  return x+ctx.measureText(s).width;                       // R�ckgabewert
  }
      
// Ausgabefeld f�r Anweisung oder Berechnung:
  
function outputField () {
  rectangle(40,380,320,50,"#ffffff",true);                 // Wei�es Rechteck
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  if (state == 0) {                                        // Falls Zustand Schleifkontakt-Einstellung ...
    if (sliderCorrect())                                   // Falls Schleifkontakt in richtiger Position ... 
      ctx.fillText(text11,60,410);                         // Anweisung
    else {                                                 // Falls Schleifkontakt in falscher Position ...
      ctx.fillText(text10[0],60,400);                      // Anweisung, erste Zeile
      ctx.fillText(text10[1],60,420);                      // Anweisung, zweite Zeile
      }  
    }
  else {                                                   // Falls Zustand Widerstandsberechnung ...
    var x = 60;                                            // Positionsvariable (Pixel)
    x = write(symbolResistance1,x,410);                    // Symbol f�r Widerstand
    x = write(symbolResistance2,x,415);                    // Index (Symbol f�r unbekannt)
    x = write(" = ",x,410);                                // Gleichheitszeichen
    line (x,405.5,x+50,405.5,"#000000",1.5);               // Bruchstrich
    centerText(value(q*rs,1,ohm),x+25,395);                // Z�hler
    centerText(value(rs-q*rs,1,ohm),x+25,415);             // Nenner
    x = write(" "+symbolMult+" ",x+50,410);                // Multiplikationszeichen
    x = write(value(rv,0,ohm),x,410);                      // Vergleichswiderstand
    x = write(" = ",x,410);                                // Gleichheitszeichen
    write(value(q*rv/(1-q),0,ohm),x,410);                  // Unbekannter Widerstand (berechnet)
    }
  }
      
// Hilfsroutine: Einzelne Spannung angeben
// u ....... Spannung (Volt)
// (x,y) ... Position (Pixel)

function writeV (u, x, y) {
  ctx.fillText(value(u,2,volt),x,y);                       // Grafikausgabe
  }
      
// Ausgabe der einzelnen Spannungswerte:
  
function writeVoltage () {
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe
  ctx.font = FONT;                                         // Zeichensatz
  writeV(rx*i3,120,16);                                    // Spannung am unbekannten Widerstand
  writeV(rv*i4,280,16);                                    // Spannung am Vergleichswiderstand
  writeV(Math.abs(rm*i5),200,96);                          // Spannung am Amperemeter
  var x = Math.round(100+q*200);                           // Position f�r Unterteilung des Schiebewiderstands
  var x1 = Math.min((100+x)/2,x-25);                       // Position f�r Teilspannung links
  var x2 = Math.max((x+300)/2,x+25);                       // Position f�r Teilspannung rechts
  writeV(q*rs*i1,x1,206);                                  // Teilspannung Schiebewiderstand links
  writeV((1-q)*rs*i2,x2,206);                              // Teilspannung Schiebewiderstand rechts
  writeV(u0,200,296);                                      // Spannung der Stromquelle
  }
  
// Hilfsroutine: Pfeil mit Stromst�rkewert:
// i ......... Stromst�rke (Ampere)
// (x,y) ..... Position Zahlenwert
// (x0,y0) ... Anfangspunkt des Pfeils
// (x1,y1) ... Endpunkt des Pfeils
    
function writeA (i, x, y, x0, y0, x1, y1) {
  centerText(value(1000*Math.abs(i),1,milliampere),x,y);   // Wert der Stromst�rke
  arrow(x0,y0,x1,y1,2);                                    // Pfeil
  }
  
// Ausgabe der einzelnen Stromst�rkewerte, Pfeile f�r Stromrichtung:
  
function writeAmperage () {
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe
  ctx.strokeStyle = colorAmperage;                         // Farbe f�r Pfeil
  writeA(i3,110,68,140,68,160,68);                         // Strom im unbekannten Widerstand, Pfeil nach rechts
  writeA(i4,270,68,300,68,320,68);                         // Strom im Vergleichswiderstand, Pfeil nach rechts
  if (i5 > 0)                                              // Falls Strom im Amperemeter nach unten ...
    writeA(i5,150,157,180,150,180,170);                    // Stromst�rke im Amperemeter, Pfeil nach unten  
  else if (i5 < 0)                                         // Falls Strom im Amperemeter nach oben ...
    writeA(i5,150,157,180,170,180,150);                    // Stromst�rke im Amperemeter, Pfeil nach oben
  writeA(i1,70,238,60,248,80,248);                         // Stromst�rke links vom Schiebewiderstand, Pfeil nach rechts
  writeA(i2,330,238,320,248,340,248);                      // Stromst�rke rechts vom Schiebewiderstand, Pfeil nach rechts
  writeA(i0,100,348,150,348,130,348);                      // Stromst�rke links von der Stromquelle, Pfeil nach links
  writeA(i0,270,358,320,358,300,358);                      // Stromst�rke rechts von der Stromquelle, Pfeil nach links
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  power();                                                 // Stromquelle
  resistors();                                             // Widerst�nde mit Beschriftung
  meter(200,120);                                          // Amperemeter 
  wires();                                                 // Dr�hte und Knoten
  scale();                                                 // Skala f�r Schiebewiderstand
  outputField();                                           // Ausgabefeld 
  if (cb1.checked) writeVoltage();                         // Falls gew�nscht, Spannungswerte ausgeben
  if (cb2.checked) writeAmperage();                        // Falls gew�nscht, Stromst�rkewerte ausgeben
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


