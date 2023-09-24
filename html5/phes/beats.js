// Schwebungen
// Java-Applet (21.10.2001) umgewandelt
// 29.12.2015 - 14.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel beats_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#ff0000";                                    // Farbe f�r 1. Welle
var color2 = "#0000ff";                                    // Farbe f�r 2. Welle
var color3 = "#000000";                                    // Farbe f�r Gesamtwelle
var color4 = "#808080";                                    // Farbe f�r Einh�llende

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var U0 = 40;                                               // Waagrechte Bildschirmkoordinate Ursprung
var V01 = 60, V02 =160, V03 = 300;                         // Senkrechte Bildschirmkoordinaten Ursprung   
var AMPL = 30;                                             // Amplitude (Pixel)
var PI2 = 2*Math.PI;                                       // Abk�rzung f�r 2 pi
var PIX_MS = 10;                                           // Umrechnungsfaktor (Pixel pro Millisekunde)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Reset, Start/Pause/Weiter)
var cbSlow;                                                // Optionsfeld (Zeitlupe)
var ip1, ip2;                                              // Eingabefelder (Frequenzen)

var omega1;                                                // Kreisfrequenz der 1. Welle (1/s)
var omega2;                                                // Kreisfrequenz der 2. Welle (1/s)
var omegaMod;                                              // Modulations-Kreisfrequenz (1/s)
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (ms -> s)
var on;                                                    // Flag f�r Bewegung
var slow;                                                  // Flag f�r Zeitlupe

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
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Reset)
  bu2 = getElement("bu2");                                 // Schaltknopf (Start/Pause/Weiter)
  setButton2State(0);                                      // Anfangszustand (vor dem Start)
  cbSlow = getElement("cbSlow");                           // Optionsfeld (Zeitlupe)
  cbSlow.checked = false;                                  // Zeitlupe zun�chst abgeschaltet
  getElement("lbSlow",text03);                             // Erkl�render Text (Zeitlupe)
  getElement("lb1",text04);                                // Erkl�render Text (Frequenzen)
  getElement("ip1a",text05);                               // Erkl�render Text (1. Welle)
  ip1 = getElement("ip1b");                                // Eingabefeld (Frequenz der 1. Welle)
  getElement("ip1c",hertz);                                // Einheit (Frequenz der 1. Welle)
  getElement("ip2a",text06);                               // Erkl�renderText (2. Welle)
  ip2 = getElement("ip2b");                                // Eingabefeld (Frequenz der 2. Welle)
  getElement("ip2c",hertz);                                // Einheit (Frequenz der 2. Welle)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer

  t0 = new Date();                                         // Bezugszeitpunkt
  t = 0;                                                   // Zeitvariable (s) 
  on = slow = false;                                       // Animation zun�chst abgeschaltet
  omega1 = PI2*500;                                        // Startwert Kreisfrequenz 1
  omega2 = PI2*550;                                        // Startwert Kreisfrequenz 2
  omegaMod = Math.abs((omega1-omega2)/2);                  // Modulations-Kreisfrequenz
  updateInput();                                           // Eingabefelder aktualisieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld  
  paint();                                                 // Zeichnen
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  cbSlow.onclick = reactionSlow;                           // Reaktion auf Optionsfeld (Zeitlupe)
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Frequenz der 1. Welle)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Frequenz der 2. Welle)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Frequenz der 1. Welle)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Frequenz der 2. Welle)
  
  } // Ende der Methode start
  
// Zustandsfestlegung f�r Schaltknopf Start/Pause/Weiter:
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text02[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt t, bu2.state
  
function switchButton2 () {
  var st = bu2.state;                                      // Bisheriger Zustand (0, 1 oder 2)
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Sonst Wechsel zwischen Animation und Pause
  setButton2State(st);                                     // Neuen Zustand speichern, Text �ndern
  ip1.readOnly = ip2.readOnly = (st>0);                    // Eingabefelder aktivieren oder deaktivieren
  }
  
// Hilfsroutine: Eingabe, Berechnung von omegaMod, neu zeichnen
  
function reaction () {
  input();                                                 // Eingabe, Berechnung von omegaMod
  paint();                                                 // Neu zeichnen
  }
    
// Reaktion auf Resetknopf:
// Seiteneffekt bu2.state, t, on, slow
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  t = 0;                                                   // Zeitvariable zur�cksetzen
  on = false;                                              // Animation abgeschaltet
  slow = cbSlow.checked;                                   // Flag f�r Zeitlupe
  reaction();                                              // Eingabe, rechnen, neu zeichnen
  ip1.readOnly = ip2.readOnly = false;                     // Eingabefelder aktivieren
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2.state, on, slow, timer, t0

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs �ndern
  input();                                                 // Eingabe, rechnen
  slow = cbSlow.checked;                                   // Flag f�r Zeitlupe
  if (bu2.state == 1) startAnimation();                    // Animation entweder starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder unterbrechen
  }
  
// Reaktion auf Optionsfeld Zeitlupe:
// Seiteneffekt slow

function reactionSlow () {
  slow = cbSlow.checked;                                   // Flag setzen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt omega1, omega2, omegaMod
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (enter) reaction();                                   // Falls Enter-Taste, Daten �bernehmen, rechnen und neu zeichnen
  }
  
// Fokus f�r Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus f�r Eingabefeld
  var n = ip.value.length;                                 // L�nge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
      
// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, t0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
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
  
// Gesamte Eingabe:
// Seiteneffekt omega1, omega2, omegaMod

function input () {
  var ae = document.activeElement;                         // Aktives Element
  omega1 = PI2*inputNumber(ip1,0,true,100,1000);           // Kreisfrequenz der 1. Welle (1/s)
  omega2 = PI2*inputNumber(ip2,0,true,100,1000);           // Kreisfrequenz der 2. Welle (1/s)
  omegaMod = Math.abs((omega1-omega2)/2);                  // Modulations-Kreisfrequenz (1/s)
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) ip2.blur();                               // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(omega1/PI2,0,true);                 // Eingabefeld f�r 1. Frequenz (Hz)
  ip2.value = ToString(omega2/PI2,0,true);                 // Eingabefeld f�r 2. Frequenz (Hz)
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausf�llen
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
  ctx.lineWidth = 1;                                       // Liniendicke zur�cksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Koordinatensystem (Achsen und Beschriftung der Zeitachse):
// (x,y) ... Bildschirmkoordinaten des Ursprungs (Pixel)
// dy....... Halbe L�nge der senkrechten Achse (Pixel)  

function cosy (x, y, dy) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  arrow(x-10,y,x+420,y);                                   // Waagrechte Achse
  arrow(x,y+dy,x,y-dy);                                    // Senkrechte Achse
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText(symbolTime,x+415,y+15);                     // Beschriftung der waagrechten Achse (Zeit t)
  }
  
// Hilfsroutine: Text mit Index (rechtsb�ndig)
// s ....... Zeichenkette ('_' zwischen normalem Text und Index)
// (x,y) ... Position (Pixel)

function writeTextIndex (s, x, y) {
  ctx.textAlign = "right";                                 // Textausrichtung
  var i = s.indexOf("_");                                  // Position des Unterstrichs oder -1
  var s1 = (i>=0 ? s.substring(0,i) : s);                  // Zeichenkette f�r normalen Text
  var s2 = (i>=0 ? s.substring(i+1) : "");                 // Zeichenkette f�r Index
  var w2 = ctx.measureText(s2).width;                      // Breite des Index (Pixel)
  ctx.fillText(s1,x-w2,y);                                 // Normaler Text
  ctx.fillText(s2,x,y+5);                                  // Index
  }

// Alle drei Koordinatensysteme zeichnen:
  
function coordSystems () {
  cosy(U0,V01,40);                                         // Oberes Koordinatensystem
  cosy(U0,V02,40);                                         // Mittleres Koordinatensystem
  cosy(U0,V03,80);                                         // Unteres Koordinatensystem
  writeTextIndex(symbolElongation1,U0-5,V01-30);           // Beschriftung der senkrechten Achse (y_1)
  writeTextIndex(symbolElongation2,U0-5,V02-30);           // Beschriftung der senkrechten Achse (y_2)
  writeTextIndex(symbolElongation,U0-5,V03-70);            // Beschriftung der senkrechten Achse (y)
  }

// Funktion zur Berechnung der Elongation (Pixel) f�r 1. Welle:
// t0 ... Zeitpunkt entsprechend senkrechter Achse (ms)

function elongation1 (tS) {
  return AMPL*Math.sin(omega1*tS);                         // R�ckgabewert
  }
  
// Funktion zur Berechnung der Elongation (Pixel) f�r 2. Welle:
// t0 ... Zeitpunkt entsprechend senkrechter Achse (ms)

function elongation2 (tS) {
  return AMPL*Math.sin(omega2*tS);                         // R�ckgabewert
  }
  
// Funktion zur Berechnung der Elongation (Pixel) f�r �berlagerung:
// t0 ... Zeitpunkt entsprechend senkrechter Achse (ms)

function elongationSum (tS) {
  return AMPL*(Math.sin(omega1*tS)+Math.sin(omega2*tS));   // R�ckgabewert
  }
  
// Funktionen zur Berechnung der Elongation (Pixel) f�r Einh�llende:
// t0 ... Zeitpunkt entsprechend senkrechter Achse (ms)

function elongationEnv1 (tS) {
  return 2*AMPL*(Math.cos(omegaMod*tS));                   // R�ckgabewert
  }
  
function elongationEnv2 (tS) {
  return -2*AMPL*(Math.cos(omegaMod*tS));                  // R�ckgabewert
  }
  
// Einzelner Graph:
// v0 ... Senkrechte Bildschirmkoordinate der t-Achse (Pixel)
// t0 ... Zeitpunkt entsprechend senkrechter Achse (ms)
// e .... Funktion zur Berechnung der Elongation (Pixel)
// c .... Linienfarbe
  
function graph (v0, t0, e, c) {
  newPath(c);                                              // Neuer Grafikpfad
  var tS = t0/1000;                                        // Zeitpunkt entsprechend senkrechter Achse (s)
  var u = U0, v = v0-e(tS);                                // Bildschirmkoordinaten Anfangspunkt
  ctx.moveTo(u,v);                                         // Anfangspunkt Polygonzug                       
  for (u=U0+1; u<=U0+400; u++) {                           // F�r alle Werte der waagrechten Bildschirmkoordinate ...
    tS = (t0+(u-U0)/PIX_MS)/1000;                          // Zeitpunkt entsprechend senkrechter Achse (s)
    v = v0-e(tS);                                          // Senkrechte Bildschirmkoordinate
    ctx.lineTo(u,v);                                       // Linie zum Polygonzug hinzuf�gen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Alle drei Graphen zeichnen:
  
function curves () {
  var t0 = (t < 200/PIX_MS ? 0 : t-200/PIX_MS);            // Zeitpunkt entsprechend senkrechter Achse (ms)     
  graph(V01,t0,elongation1,color1);                        // Graph f�r 1. Welle
  graph(V02,t0,elongation2,color2);                        // Graph f�r 2. Welle
  graph(V03,t0,elongationSum,color3);                      // Graph f�r Gesamtwelle
  graph(V03,t0,elongationEnv1,color4);                     // 1. Einh�llende
  graph(V03,t0,elongationEnv2,color4);                     // 2. Einh�llende
  }
  
// Markierungen f�r aktuelle Werte:
  
function marks () {
  var t0 = (t < 200/PIX_MS ? 0 : t-200/PIX_MS);            // Zeitpunkt entsprechend senkrechter Achse (ms)
  var u = U0+(t-t0)*PIX_MS;                                // Waagrechte Bildschirmkoordinate (Pixel)
  var tS = t/1000;                                         // Zeitvariable in Sekunden umrechnen
  var e1 = elongation1(tS);                                // Elongation f�r 1. Welle (Pixel)
  var e2 = elongation2(tS);                                // Elongation f�r 2. Welle (Pixel)
  circle(u,V01-e1,2.5,color1);                             // Markierung f�r 1. Welle
  circle(u,V02-e2,2.5,color2);                             // Markierung f�r 2. Welle
  circle(u,V03-e1-e2,2.5,color3);                          // Markierung f�r Gesamtwelle
  }

// Grafikausgabe:
// Seiteneffekt t, t0
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // L�nge des Zeitintervalls (s)
    if (slow) dt /= 10;                                    // Falls Zeitlupe, Zeitintervall durch 10 dividieren
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  ctx.font = FONT;                                         // Zeichensatz
  coordSystems();                                          // Koordinatensysteme
  curves();                                                // Kurven
  marks();                                                 // Markierungen f�r aktuelle Werte
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

