// Zustands�nderungen eines idealen Gases
// Java-Applet (25.12.1999) umgewandelt
// 05.10.2019 - 18.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel gasprocesses_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorPiston = "#0000ff";                               // Farbe f�r Kolben
var colorGas = "#00ff00";                                  // Farbe f�r Gas
var colorCylinder = "#ffc800";                             // Farbe f�r Zylinderwand
var colorWork1 = "#0000ff";                                // Dunkle Farbe f�r Arbeit
var colorWork2 = "#8080ff";                                // Helle Farbe f�r Arbeit
var colorHeat1 = "#ff0000";                                // Dunkle Farbe f�r W�rme
var colorHeat2 = "#ff8080";                                // Helle Farbe f�r W�rme

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var CV = 2.5;                                              // Spezifische W�rmekapazit�t bei konstantem Volumen
var CP = 3.5;                                              // Spezifische W�rmekapazit�t bei konstantem Druck
var MIN_P = 50;                                            // Minimum f�r Druck (kPa)
var MAX_P = 500;                                           // Maximum f�r Druck (kPa)
var MIN_V = 0.5;                                           // Minimum f�r Volumen (dm�)
var MAX_V = 5;                                             // Maximum f�r Volumen (dm�)
var MIN_T = 100;                                           // Minimum f�r Temperatur (K)
var MAX_T = 1000;                                          // Maximum f�r Temperatur (K)
var FACTOR_ENERGY = 0.02;                                  // Faktor f�r Energie-Pfeile
var MAX_TIME = 5;                                          // Maximale Zeit (s)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var rbP, rbV, rbT;                                         // Radiobuttons (Art der Zustands�nderung)
var rb0P, rb0V, rb0T;                                      // Radiobuttons (Anfangszustand)
var ip0P, ip0V, ip0T;                                      // Eingabefelder (Anfangszustand)
var rb1P, rb1V, rb1T;                                      // Radiobuttons (Endzustand)
var ip1P, ip1V, ip1T;                                      // Eingabefelder (Endzustand)
var bu1, bu2;                                              // Schaltkn�pfe

var process;                                               // Nummer f�r Art der Zustands�nderung (1 bis 3)
var size;                                                  // Nummer f�r berechnete Gr��e (1 bis 6)
var p0;                                                    // Druck im Anfangszustand (Pa)
var p1;                                                    // Druck im Endzustand (Pa)
var v0;                                                    // Volumen im Anfangszustand (m�)
var v1;                                                    // Volumen im Endzustand (m�)
var t0;                                                    // Temperatur im Anfangszustand (K)
var t1;                                                    // Temperatur im Endzustand (K)
var pp;                                                    // Momentaner Druck (Pa)
var vv;                                                    // Momentanes Volumen (m�)
var tt;                                                    // Momentane Temperatur (K)                                        
var tickP;                                                 // Abstand der Ticks f�r p-Achse (Pixel, 100000 Pa)
var tickV;                                                 // Abstand der Ticks f�r V-Achse (Pixel, 1 dm�)
var tickT;                                                 // Abstand der Ticks f�r T-Achse (Pixel, 100 K)
var range;                                                 // Abweichungen vom erlaubten Bereich
var p0Changed;                                             // Flag f�r �nderung des Anfangsdrucks
var v0Changed;                                             // Flag f�r �nderung des Anfangsvolumens
var t0Changed;                                             // Flag f�r �nderung der Anfangstemperatur
var p1Changed;                                             // Flag f�r �nderung des Enddrucks
var v1Changed;                                             // Flag f�r �nderung des Endvolumens
var t1Changed;                                             // Flag f�r �nderung der Endtemperatur

var on;                                                    // Flag f�r Bewegung
var time0;                                                 // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var timer;                                                 // Timer f�r Animation

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
  process = 1;                                             // Zun�chst isobare Zustands�nderung 
  size = 6;                                                // Endtemperatur wird berechnet
  p0 = 100000; p1 = 100000;                                // Anfangs- bzw. Enddruck (Pa)
  v0 = 0.001; v1 = 0.002;                                  // Anfangs- bzw. Endvolumen (m�)
  t0 = 300; t1 = 600;                                      // Anfangs- bzw. Endtemperatur (K)
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  rbP = getElement("rbP");                                 // Radiobutton (isobare Zustands�nderung)
  rbP.checked = true;                                      // Radiobutton zun�chst ausgew�hlt
  getElement("lbP",text01);                                // Erkl�render Text (isobare Zustands�nderung)
  rbV = getElement("rbV");                                 // Radiobutton (isochore Zustands�nderung)
  getElement("lbV",text02);                                // Erkl�render Text (isochore Zustands�nderung)
  rbT = getElement("rbT");                                 // Radiobutton (isotherme Zustands�nderung)
  getElement("lbT",text03);                                // Erkl�render Text (isotherme Zustands�nderung)
  getElement("lb0",text04);                                // Erkl�render Text (Anfangszustand)   
  rb0P = getElement("rb0P");                               // Radiobutton (Anfangsdruck)
  getElement("lb0P",text05);                               // Erkl�render Text (Anfangsdruck)
  ip0P = getElement("ip0P");                               // Eingabefeld (Anfangsdruck)
  getElement("lb0PU",kiloPascal);                          // Einheit (Anfangsdruck)
  rb0V = getElement("rb0V");                               // Radiobutton (Anfangsvolumen)
  getElement("lb0V",text06);                               // Erkl�render Text (Anfangsvolumen)
  ip0V = getElement("ip0V");                               // Eingabefeld (Anfangsvolumen)
  getElement("lb0VU",decimeter3);                          // Einheit (Anfangsvolumen)                             
  rb0T = getElement("rb0T");                               // Radiobutton (Anfangstemperatur)
  getElement("lb0T",text07);                               // Erkl�render Text (Anfangstemperatur)
  ip0T = getElement("ip0T");                               // Eingabefeld (Anfangstemperatur)
  getElement("lb0TU",kelvin);                              // Einheit (Anfangstemperatur) 
  getElement("lb1",text08);                                // Erkl�render Text (Endzustand)
  rb1P = getElement("rb1P");                               // Radiobutton (Enddruck)
  getElement("lb1P",text05);                               // Erkl�render Text (Enddruck)
  ip1P = getElement("ip1P");                               // Eingabefeld (Enddruck)
  getElement("lb1PU",kiloPascal);                          // Einheit (Enddruck)
  rb1V = getElement("rb1V");                               // Radiobutton (Endvolumen)
  getElement("lb1V",text06);                               // Erkl�render Text (Endvolumen)
  ip1V = getElement("ip1V");                               // Eingabefeld (Endvolumen)
  getElement("lb1VU",decimeter3);                          // Einheit (Endvolumen)                             
  rb1T = getElement("rb1T");                               // Radiobutton (Endtemperatur)
  rb1T.checked = true;                                     // Radiobutton zun�chst ausgew�hlt
  getElement("lb1T",text07);                               // Erkl�render Text (Endtemperatur)
  ip1T = getElement("ip1T");                               // Eingabefeld (Endtemperatur)
  getElement("lb1TU",kelvin);                              // Einheit (Endtemperatur) 
  bu1 = getElement("bu1",text09);                          // Schaltknopf (Anfangszustand)
  bu2 = getElement("bu2",text10);                          // Schaltknopf (Start)   
  getElement("author",author);                             // Autor (und �bersetzer)
  updateInput();                                           // Eingabefelder aktualisieren (Defaultwerte) 
  setTicks();                                              // Abst�nde der Ticks festlegen
  enableRB01(process);                                     // Radiobuttons f�r Anfangs- und Endzustand (de-)aktivieren
  ip1T.readOnly = true;                                    // Eingabefeld Endtemperatur deaktivieren
  bu2.disabled = true;                                     // Schaltknopf Start deaktivieren
  on = false;                                              // Animation zun�chst abgeschaltet
  t = 0;                                                   // Startwert Zeitvariable (s)
  actionEnd();                                             // Rechnen, kontrollieren und zeichnen

  rbP.onclick = reactionRadioP;                            // Reaktion auf Radiobutton (isobare Zustands�nderung)  
  rbV.onclick = reactionRadioV;                            // Reaktion auf Radiobutton (isochore Zustands�nderung)
  rbT.onclick = reactionRadioT;                            // Reaktion auf Radiobutton (isotherme Zustands�nderung)
  rb0P.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Anfangsdruck)
  rb0V.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Anfangsvolumen)
  rb0T.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Anfangstemperatur)
  rb1P.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Enddruck)
  rb1V.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Endvolumen)
  rb1T.onclick = reactionRadio01;                          // Reaktion auf Radiobutton (Endtemperatur)
  ip0P.onkeydown = reactionKey0P;                          // Reaktion auf Taste (Anfangsdruck)
  ip0V.onkeydown = reactionKey0V;                          // Reaktion auf Taste (Anfangsvolumen)                          
  ip0T.onkeydown = reactionKey0T;                          // Reaktion auf Taste (Anfangstemperatur)
  ip1P.onkeydown = reactionKey1P;                          // Reaktion auf Taste (Enddruck)
  ip1V.onkeydown = reactionKey1V;                          // Reaktion auf Taste (Endvolumen)
  ip1T.onkeydown = reactionKey1T;                          // Reaktion auf Taste (Endtemperatur)
  ip0P.onblur = reaction0P;                                // Reaktion auf Verlust des Fokus (Anfangsdruck)
  ip0V.onblur = reaction0V;                                // Reaktion auf Verlust des Fokus (Anfangsvolumen)
  ip0T.onblur = reaction0T;                                // Reaktion auf Verlust des Fokus (Anfangstemperatur)
  ip1P.onblur = reaction1P;                                // Reaktion auf Verlust des Fokus (Enddruck)
  ip1V.onblur = reaction1V;                                // Reaktion auf Verlust des Fokus (Endvolumen)
  ip1T.onblur = reaction1T;                                // Reaktion auf Verlust des Fokus (Endtemperatur)
  bu1.onclick = reactionButton1;                           // Reaktion auf Schaltknopf (Anfangszustand)
  bu2.onclick = reactionButton2;                           // Reaktion auf Schaltknopf (Start)
  
  } // Ende der Methode start   
   
// Hilfsroutine f�r Aktionen:
// Seiteneffekt p0, v0, t0, p1, v1, t1, range, tickP, tickV, tickT, t, on, timer, tt, pp, vv

function actionEnd () {
  calcUnknown();                                           // Nicht gegebene Gr��e berechnen
  controlRange();                                          // Kontrolle, ob Werte im erlaubten Bereich
  if (range == 0) setTicks();                              // Abst�nde der Ticks (Diagramm-Achsen)
  paint();                                                 // Neu zeichnen
  }
  
// Radiobuttons f�r Anfangs- und Endzustand aktivieren bzw. deaktivieren:
// p ... Nummer f�r Zustands�nderung (1 bis 3) oder 0 (alle deaktivieren)
  
function enableRB01 (p) {
  rb0P.disabled = rb1P.disabled = (p == 1 || p == 0);      // Radiobuttons f�r Druck
  rb0V.disabled = rb1V.disabled = (p == 2 || p == 0);      // Radiobuttons f�r Volumen
  rb0T.disabled = rb1T.disabled = (p == 3 || p == 0);      // Radiobuttons
  }
  
// Einzelnes Eingabefeld aktivieren/deaktivieren:
// nr ..... Nummer des Eingabefelds (1 bis 6)
// flag ... Wahrheitswert f�r Aktivierung

function enableTF (nr, flag) {
  switch (nr) {                                            // Je nach Nummer ...
    case 1: ip0P.readOnly = !flag; break;                  // Eingabefeld Anfangsdruck
    case 2: ip0V.readOnly = !flag; break;                  // Eingabefeld Anfangsvolumen
    case 3: ip0T.readOnly = !flag; break;                  // Eingabefeld Anfangstemperatur
    case 4: ip1P.readOnly = !flag; break;                  // Eingabefeld Enddruck
    case 5: ip1V.readOnly = !flag; break;                  // Eingabefeld Endvolumen
    case 6: ip1T.readOnly = !flag; break;                  // Eingabefeld Endtemperatur
    }
  }
  
// Eingabefelder und Radiobuttons wieder aktivieren/deaktivieren:

function reEnable () {
  ip0P.readOnly = (size == 1);                             // Eingabefeld Anfangsdruck
  ip0V.readOnly = (size == 2);                             // Eingabefeld Anfangsvolumen
  ip0T.readOnly = (size == 3);                             // Eingabefeld Anfangstemperatur
  ip1P.readOnly = (size == 4);                             // Eingabefeld Enddruck
  ip1V.readOnly = (size == 5);                             // Eingabefeld Endvolumen
  ip1T.readOnly = (size == 6);                             // Eingabefeld Endtemperatur
  rbP.disabled = false;                                    // Radiobutton isobare Zustands�nderung
  rbV.disabled = false;                                    // Radiobutton isochore Zustands�nderung
  rbT.disabled = false;                                    // Radiobutton isotherme Zustands�nderung
  enableRB01(process);                                     // Radiobuttons f�r Zustandsgr��en
  bu1.disabled = false;                                    // Schaltknopf Anfangszustand
  bu2.disabled = true;                                     // Schaltknopf Start
  }
  
// Reaktion auf Radiobutton (isobare Zustands�nderung):
// Seiteneffekt process, po, v0, t0, p1, v1, t1, size, range, tickP, tickV, tickT, t, on, timer, tt, pp, vv

function reactionRadioP () {
  process = 1;                                             // Isobare Zustands�nderung
  setDefaultValues(1);                                     // Defaultwerte f�r Zustandsgr��en
  enableRB01(1);                                           // Radiobuttons f�r Anfangs- und Endzustand (de-)aktivieren
  rb1T.checked = true;                                     // Radiobutton f�r Endtemperatur ausw�hlen
  size = 6;                                                // Endtemperatur als gesuchte Gr��e
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// Reaktion auf Radiobutton (isochore Zustands�nderung):
// Seiteneffekt process, po, v0, t0, p1, v1, t1, size, range, tickP, tickV, tickT, t, on, timer, tt, pp, vv

function reactionRadioV () {
  process = 2;                                             // Isochore Zustands�nderung
  setDefaultValues(2);                                     // Defaultwerte f�r Zustandsgr��en
  enableRB01(2);                                           // Radiobuttons f�r Anfangs- und Endzustand (de-)aktivieren
  rb1T.checked = true;                                     // Radiobutton f�r Endtemperatur ausw�hlen
  size = 6;                                                // Endtemperatur als gesuchte Gr��e
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// Reaktion auf Radiobutton (isotherme Zustands�nderung):
// Seiteneffekt process, po, v0, t0, p1, v1, t1, size, range, tickP, tickV, tickT, t, on, timer, tt, pp, vv

function reactionRadioT () {
  process = 3;                                             // Isotherme Zustands�nderung
  setDefaultValues(3);                                     // Defaultwerte f�r Zustandsgr��en
  enableRB01(3);                                           // Radiobuttons f�r Anfangs- und Endzustand (de-)aktivieren 
  rb1V.checked = true;                                     // Radiobutton f�r Endvolumen ausw�hlen
  size = 5;                                                // Endvolumen als gesuchte Gr��e
  actionEnd();                                             // Hilfsroutine aufrufen
  }

// Hilfsroutine:
// n ... Nummer der Gr��e (1 bis 6)
// Seiteneffekt size
  
function updateSize (n) {
  enableTF(size,true);                                     // Eingabefeld f�r bisher gesuchte Gr��e aktivieren
  size = n;                                                // Nummer f�r k�nftig gesuchte Gr��e
  enableTF(size,false);                                    // Eingabefeld f�r k�nftig gesuchte Gr��e deaktivieren
  }
  
// Reaktion auf Radiobutton (Gr��e im Anfangs- oder Endzustand):
// Seiteneffekt p0, v0, t0, p1, v1, t1, range, tickP, tickV, tickT, t, on, timer, tt, pp, vv

function reactionRadio01 () {
  if (rb0P.checked) updateSize(1);                         // Radiobutton Anfangsdruck
  if (rb0V.checked) updateSize(2);                         // Radiobutton Anfangsvolumen
  if (rb0T.checked) updateSize(3);                         // Radiobutton Anfangstemperatur
  if (rb1P.checked) updateSize(4);                         // Radiobutton Enddruck
  if (rb1V.checked) updateSize(5);                         // Radiobutton Endvolumen
  if (rb1T.checked) updateSize(6);                         // Radiobutton Endtemperatur
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// Reaktion auf oberen Schaltknopf (Anfangszustand):
// Seiteneffekt p0, v0, t0, p1, v1, t1, t, on, p0Changed, v0Changed, t0Changed, p1Changed, v1Changed, t1Changed,
// range, tickP, tickV, tickT, timer, tt, pp, vv
   
function reactionButton1 () {
  inputAll();                                              // Ge�nderte Zustandsgr��en aus Eingabefeldern                               
  if (p1 != p0 || v1 != v0 || t1 != t0) {                  // Falls mindestens eine Zustandsgr��e ver�ndert ...
    t = 0;                                                 // Zeitvariable (s) 
    on = false;                                            // Animation abgeschaltet
    bu1.disabled = true;                                   // Schaltknopf Anfangszustand deaktivieren 
    bu2.disabled = false;                                  // Schaltknopf Start aktivieren
    for (var i=1; i<=6; i++) enableTF(i,false);            // Eingabefelder f�r Zustandsgr��en deaktivieren
    rbP.disabled = true;                                   // Radiobutton f�r isobare Zustands�nderung deaktivieren
    rbV.disabled = true;                                   // Radiobutton f�r isochore Zustands�nderung deaktivieren
    rbT.disabled = true;                                   // Radiobutton f�r isotherme Zustands�nderung deaktivieren
    enableRB01(0);                                         // Alle Radiobuttons f�r Zustandsgr��en deaktivieren
    p0Changed = v0Changed = t0Changed = false;             // Flags f�r ge�nderten Anfangszustand l�schen
    p1Changed = v1Changed = t1Changed = false;             // Flags f�r ge�nderten Endzustand l�schen
    }
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// Reaktion auf unteren Schaltknopf (Start):
// Seiteneffekt on, timer, time0, p0, v0, t0, p1, v1, t1, range, tickP, tickV, tickT, t, tt, pp, vv
  
function reactionButton2 () {
  bu1.disabled = false;                                    // Schaltknopf Anfangszustand aktivieren 
  bu2.disabled = true;                                     // Schaltknopf Start deaktivieren
  startAnimation();                                        // Animation starten
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// �berpr�fung Enter-Taste:

function isEnter (e) {
  return (e.key == "Enter" || e.code == "Enter");          // R�ckgabewert
  }
  
// Reaktion Anfangsdruck:
// Seiteneffekt p0, p1, on, t, v0, t0, v1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv

function reaction0P () {
  inputP0();                                               // Anfangsdruck auslesen, eventuell Enddruck anpassen
  on = false;                                              // Animation abgeschaltet
  t = 0;                                                   // Zeitvariable (s)
  actionEnd();                                             // Hilfsroutine aufrufen
  }
  
// Reaktion auf Taste (Anfangsdruck):
// Seiteneffekt p0, p1, on, t, v0, t0, v1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv, p0Changed
  
function reactionKey0P (e) {
  if (isEnter(e)) reaction0P();                            // Reaktion auf Enter-Taste
  else p0Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Reaktion Anfangsvolumen:
// Seiteneffekt v0, v1, on, t, p0, t0, p1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv

function reaction0V () {
  inputV0();                                               // Anfangsvolumen auslesen, eventuell Endvolumen anpassen
  on = false;                                              // Animation abgeschaltet
  t = 0;                                                   // Zeitvariable (s)    
  actionEnd();                                             // Hilfsroutine aufrufen
  }

// Reaktion auf Taste (Anfangsvolumen):
// Seiteneffekt v0, v1, on, t, p0, t0, p1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv, v0Changed
  
function reactionKey0V (e) {
  if (isEnter(e)) reaction0V();                            // Reaktion auf Enter-Taste
  else v0Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Reaktion Anfangstemperatur:
// Seiteneffekt t0, t1, on, t, p0, v0, p1, v1, range, tickP, tickV, tickT, timer, tt, pp, vv

function reaction0T () {
  inputT0();                                               // Anfangstemperatur auslesen, eventuell Endtemperatur anpassen
  on = false;                                              // Animation abgeschaltet
  t = 0;                                                   // Zeitvariable (s)    
  actionEnd();                                             // Hilfsroutine aufrufen
  }

// Reaktion auf Taste (Anfangstemperatur):
// Seiteneffekt t0, t1, on, t, p0, v0, p1, v1, range, tickP, tickV, tickT, timer, tt, pp, vv, t0Changed
  
function reactionKey0T (e) {
  if (isEnter(e)) reaction0T();                            // Reaktion auf Enter-Taste
  else t0Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Reaktion Enddruck:
// Seiteneffekt p1, p0, on, t, v0, t0, v1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv

function reaction1P () {
  inputP1();                                             // Enddruck auslesen, eventuell Anfangsdruck anpassen
  on = false;                                            // Animation abgeschaltet
  t = 0;                                                 // Zeitvariable (s)    
  actionEnd();                                           // Hilfsroutine aufrufen
  }

// Reaktion auf Taste (Enddruck):
// Seiteneffekt p1, p0, on, t, v0, t0, v1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv, p1Changed
  
function reactionKey1P (e) {
  if (isEnter(e)) reaction1P();                            // Reaktion auf Enter-Taste
  else p1Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Reaktion Endvolumen:
// Seiteneffekt v1, v0, on, t, p0, t0, p1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv

function reaction1V () {
  inputV1();                                               // Endvolumen auslesen, eventuell Anfangsvolumen anpassen
  on = false;                                              // Animation abgeschaltet
  t = 0;                                                   // Zeitvariable (s)    
  actionEnd();                                             // Hilfsroutine aufrufen
  }

// Reaktion auf Taste (Endvolumen):
// Seiteneffekt v1, v0, on, t, p0, t0, p1, t1, range, tickP, tickV, tickT, timer, tt, pp, vv, v1Changed  
  
function reactionKey1V (e) {
  if (isEnter(e)) reaction1V();                            // Reaktion auf Enter-Taste
  else v1Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Reaktion Endtemperatur:
// Seiteneffekt t1, t0, on, t, p0, v0, p1, v1, range, tickP, tickV, tickT, t, timer, tt, pp, vv

function reaction1T () {
  inputT1();                                               // Endtemperatur auslesen, eventuell Anfangstemperatur anpassen
  on = false;                                              // Animation abgeschaltet
  t = 0;                                                   // Zeitvariable (s)    
  actionEnd();                                             // Hilfsroutine aufrufen
  }

// Reaktion auf Taste (Endtemperatur):
// Seiteneffekt t1, t0, on, t, p0, v0, p1, v1, range, tickP, tickV, tickT, t, timer, tt, pp, vv, t1Changed
  
function reactionKey1T (e) {
  if (isEnter(e)) reaction1T();                            // Reaktion auf Enter-Taste
  else t1Changed = true;                                   // Reaktion auf andere Taste
  }
  
// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, time0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  time0 = new Date();                                      // Neuer Bezugszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
  }

//-------------------------------------------------------------------------------------------------

// Defaultwerte setzen:
// p ... Nummer f�r Zustands�nderung (1 bis 3)
// Seiteneffekt p0, v0, t0, p1, v1, t1
  
function setDefaultValues (p) {
  switch (p) {                                             // Je nach Art der Zustands�nderung ...
    case 1:                                                // Fall 1 (isobare Zustands�nderung)
      p0 = p1 = 100000;                                    // Konstanter Druck (Pa)
      v0 = 0.001; v1 = 0.002;                              // Anfangs- und Endvolumen (m�)
      t0 = 300; t1 = 600;                                  // Anfangs- und Endtemperatur (K)
      break;
  case 2:                                                  // Fall 2 (isochore Zustands�nderung) 
    v0 = v1 = 0.001;                                       // Konstantes Volumen (m�)
    p0 = 100000; p1 = 200000;                              // Anfangs- und Enddruck (Pa)
    t0 = 300; t1 = 600;                                    // Anfangs- und Endtemperatur (K)
    break;
  case 3:                                                  // Fall 3 (isotherme Zustands�nderung)
    t0 = t1 = 300;                                         // Konstante Temperatur (K)
    p0 = 100000; p1 = 200000;                              // Anfangs- und Enddruck (Pa)
    v0 = 0.002; v1 = 0.001; break;                         // Anfangs- und Endvolumen (m�)
    }
  updateInput();                                           // Eingabefelder aktualisieren
  }
  
// Eingabe des Drucks im Anfangszustand:
// Seiteneffekt p0, p1
  
function inputP0 () {
  p0 = inputNumber(ip0P,3,false,MIN_P,MAX_P)*1000;         // Anfangsdruck (Pa) aus Eingabefeld
  if (process == 1) {                                      // Falls isobare Zustands�nderung ...
    p1 = p0;                                               // Enddruck anpassen 
    ip1P.value = ToString(p1/1000,3,false);                // Eingabefeld aktualisieren
    }
  }
  
// Eingabe des Volumens im Anfangszustand:
// Seiteneffekt v0, v1

function inputV0 () {
  v0 = inputNumber(ip0V,3,false,MIN_V,MAX_V)/1000;         // Anfangsvolumen (m�) aus Eingabefeld
  if (process == 2) {                                      // Falls isochore Zustands�nderung ...
    v1 = v0;                                               // Endvolumen anpassen
    ip1V.value = ToString(v1*1000,3,false);                // Eingabefeld aktualisieren
    }
  }
  
// Eingabe der Temperatur im Anfangszustand:
// Seiteneffekt t0, t1

function inputT0 () {
  t0 = inputNumber(ip0T,3,false,MIN_T,MAX_T);              // Anfangstemperatur (K) aus Eingabefeld
  if (process == 3) {                                      // Falls isotherme Zustands�nderung ...
    t1 = t0;                                               // Endtemperatur anpassen
    ip1T.value = ToString(t1,3,false);                     // Eingabefeld aktualisieren
    }
  }
  
// Eingabe des Drucks im Endzustand:
// Seiteneffekt p1, p0
  
function inputP1 () {
  p1 = inputNumber(ip1P,3,false,MIN_P,MAX_P)*1000;         // Enddruck (Pa) aus Eingabefeld
  if (process == 1) {                                      // Falls isobare Zustands�nderung ...
    p0 = p1;                                               // Anfangsdruck anpassen 
    ip0P.value = ToString(p0/1000,3,false);                // Eingabefeld aktualisieren
    }
  }
  
// Eingabe des Volumens im Endzustand:
// Seiteneffekt v1, v0

function inputV1 () {
  v1 = inputNumber(ip1V,3,false,MIN_V,MAX_V)/1000;         // Endvolumen (m�) aus Eingabefeld
  if (process == 2) {                                      // Falls isochore Zustands�nderung ...
    v0 = v1;                                               // Anfangsvolumen anpassen
    ip0V.value = ToString(v0*1000,3,false);                // Eingabefeld aktualisieren
    }
  }
  
// Eingabe der Temperatur im Endzustand:
// Seiteneffekt t1, t0

function inputT1 () {
  t1 = inputNumber(ip1T,3,false,MIN_T,MAX_T);              // Endtemperatur (K) aus Eingabefeld
  if (process == 3) {                                      // Falls isotherme Zustands�nderung ...
    t0 = t1;                                               // Anfangstemperatur anpassen
    ip0T.value = ToString(t0,3,false);                     // Eingabefeld aktualisieren
    }
  }

// Berechnung der nicht gegebenen Gr��e:
// Seiteneffekt p0, v0, t0, p1, v1, t1
  
function calcUnknown () {
  switch (size) {                                          // Je nach Nummer der Gr��e ...                                        
    case 1: p0 = p1*v1*t0/(v0*t1); break;                  // Fall 1 (Anfangsdruck)
    case 2: v0 = p1*v1*t0/(p0*t1); break;                  // Fall 2 (Anfangsvolumen)
    case 3: t0 = p0*v0*t1/(p1*v1); break;                  // Fall 3 (Anfangstemperatur)
    case 4: p1 = p0*v0*t1/(v1*t0); break;                  // Fall 4 (Enddruck)
    case 5: v1 = p0*v0*t1/(p1*t0); break;                  // Fall 5 (Endvolumen)
    case 6: t1 = p1*v1*t0/(p0*v0); break;                  // Fall 6 (Endtemperatur)
    } // Ende switch
  updateInput();                                           // Eingabefelder aktualisieren
  }
  
// �berpr�fung, ob die berechnete Gr��e im erlaubten Bereich liegt:
// Seiteneffekt range

function controlRange () {
  range = 0;                                               // Zun�chst alles in Ordnung
  if (size == 1) {                                         // Falls Anfangsdruck zu berechnen ...
    if (p0 < MIN_P*1000) range = 1;                        // Unterschreitung des erlaubten Bereichs
    else if (p0 > MAX_P*1000) range = 2;                   // �berschreitung des erlaubten Bereichs
    }
  else if (size == 2) {                                    // Falls Anfangsvolumen zu berechnen ...
    if (v0 < MIN_V/1000) range = 3;                        // Unterschreitung des erlaubten Bereichs
    else if (v0 > MAX_V/1000) range = 4;                   // �berschreitung des erlaubten Bereichs
    }
  else if (size == 3) {                                    // Falls Anfangstemperatur zu berechnen ...
    if (t0 < MIN_T) range = 5;                             // Unterschreitung des erlaubten Bereichs
    else if (t0 > MAX_T) range = 6;                        // �berschreitung des erlaubten Bereichs
    }
  else if (size == 4) {                                    // Falls Enddruck zu berechnen ...
    if (p1 < MIN_P*1000) range = 7;                        // Unterschreitung des erlaubten Bereichs
    else if (p1 > MAX_P*1000) range = 8;                   // �berschreitung des erlaubten Bereichs
    }
  else if (size == 5) {                                    // Falls Endvolumen zu berechnen ...
    if (v1 < MIN_V/1000) range = 9;                        // Unterschreitung des erlaubten Bereichs
    else if (v1 > MAX_V/1000) range = 10;                  // �berschreitung des erlaubten Bereichs
    }
  else if (size == 6) {                                    // Falls Endtemperatur zu berechnen ...
    if (t1 < MIN_T) range = 11;                            // Unterschreitung des erlaubten Bereichs
    else if (t1 > MAX_T) range = 12;                       // �berschreitung des erlaubten Bereichs
    }
  }
  
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
  
// Auslesen der Textfelder (falls Enter-Taste nicht gedr�ckt)
// Seiteneffekt p0, v0, t0, p1, v1, t1

function inputAll () {
  if (p0Changed) inputP0();                                // Anfangsdruck auslesen, falls ver�ndert
  if (v0Changed) inputV0();                                // Anfangsvolumen auslesen, falls ver�ndert
  if (t0Changed) inputT0();                                // Anfangstemperatur auslesen, falls ver�ndert
  if (p1Changed) inputP1();                                // Enddruck auslesen, falls ver�ndert
  if (v1Changed) inputV1();                                // Endvolumen auslesen, falls ver�ndert
  if (t1Changed) inputT1();                                // Endtemperatur auslesen, falls ver�ndert
  calcUnknown();                                           // Nicht gegebene Gr��e berechnen
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip0P.value = ToString(p0/1000,3,false);                  // Eingabefeld Anfangsdruck
  ip0V.value = ToString(v0*1000,3,false);                  // Eingabefeld Anfangsvolumen
  ip0T.value = ToString(t0,3,false);                       // Eingabefeld Anfangstemperatur
  ip1P.value = ToString(p1/1000,3,false);                  // Eingabefeld Enddruck
  ip1V.value = ToString(v1*1000,3,false);                  // Eingabefeld Endvolumen
  ip1T.value = ToString(t1,3,false);                       // Eingabefeld Endtemperatur
  }
  
// Abst�nde der Ticks auf den Achsen der Diagramme:
// Seiteneffekt tickP, tickV, tickT

function setTicks () {
  var max = (p1>p0 ? p1 : p0);                             // Maximum von Anfangs- und Enddruck
  tickP = Math.floor(50*100000/max);                       // Abstand der Ticks f�r p-Achse
  max = (v1>v0 ? v1 : v0);                                 // Maximum von Anfangs- und Endvolumen
  tickV = Math.floor(50*0.001/max);                        // Abstand der Ticks f�r V-Achse
  max = (t1>t0 ? t1 : t0);                                 // Maximum von Anfangs- und Endtemperatur
  tickT = Math.floor(50*100/max);                          // Abstand der Ticks f�r T-Achse
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:
// w ... Liniendicke (optional, Defaultwert 1)

function newPath (w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional, Defaultwert 1)
// c ........ Farbe (optional, Defaultwert schwarz)

function line (x1, y1, x2, y2, w, c) {
  newPath(w);                                              // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Rechteck mit schwarzem Rand:
// (x,y) ... Koordinaten der Ecke links oben (Pixel)
// w ....... Breite (Pixel)
// h ....... H�he (Pixel)
// c ....... F�llfarbe (optional)

function rectangle (x, y, w, h, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  newPath();                                               // Neuer Pfad
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausf�llen
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen
  }

// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  newPath();                                               // Neuer Pfad
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (c) ctx.fill();                                       // Kreis ausf�llen, falls gew�nscht
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
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Zylinder mit Kolben und Gasf�llung:
  
function cylinder () {
  var x0 = 170, y0 = 120;                                  // Bezugspunkt oben Mitte (Pixel)
  newPath();                                               // Neuer Grafikpfad f�r Zylinder
  ctx.moveTo(x0-50,y0);                                    // Anfangspunkt links oben
  ctx.lineTo(x0-50,y0+100);                                // Weiter nach unten
  ctx.lineTo(x0-40,y0+100);                                // Weiter nach rechts
  ctx.lineTo(x0-40,y0+10);                                 // Weiter nach oben
  ctx.lineTo(x0+40,y0+10);                                 // Weiter nach rechts
  ctx.lineTo(x0+40,y0+100);                                // Weiter nach unten
  ctx.lineTo(x0+50,y0+100);                                // Weiter nach rechts
  ctx.lineTo(x0+50,y0);                                    // Weiter nach oben
  ctx.lineTo(x0-50,y0);                                    // Zur�ck nach links zum Anfangspunkt
  ctx.fillStyle = colorCylinder;                           // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Gef�llte Fl�che und Rand f�r Zylinder
  var dy = vv*16000;                                       // H�he Gasf�llung (Pixel)
  rectangle(x0-40,y0+10,80,dy,colorGas);                   // Gef�lltes Rechteck und Rand f�r Gas
  var y1 = y0+dy+10;                                       // Hilfsgr��e f�r H�he des Kolbens (Pixel) 
  newPath();                                               // Neuer Grafikpfad f�r Kolben
  ctx.moveTo(x0-40,y1);                                    // Anfangspunkt links oben
  ctx.lineTo(x0-40,y1+10);                                 // Weiter nach unten
  ctx.lineTo(x0-5,y1+10);                                  // Weiter nach rechts
  ctx.lineTo(x0-5,y1+30);                                  // Weiter nach unten
  ctx.lineTo(x0+5,y1+30);                                  // Weiter nach rechts
  ctx.lineTo(x0+5,y1+10);                                  // Weiter nach oben
  ctx.lineTo(x0+40,y1+10);                                 // Weiter nach rechts
  ctx.lineTo(x0+40,y1);                                    // Weiter nach oben
  ctx.lineTo(x0-40,y1);                                    // Zur�ck nach links zum Anfangspunkt
  ctx.fillStyle = colorPiston;                             // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Gef�llte Fl�che und Rand f�r Kolben
  }
  
// Druckmessger�t:

function manometer () {
  var x0 = 145, y0 = 95;                                   // Koordinaten Mittelpunkt (Pixel)
  circle(x0,y0,25,"#000000");                              // Au�enrand Skala
  circle(x0,y0,20,"#ffffff");                              // Innenrand Skala
  rectangle(x0-2,y0+25,4,10,"#000000");                    // Gaszuleitung
  for (var i=0; i<=5; i++) {                               // F�r alle Indizes ...
    var phi = (1.25-i*0.3)*Math.PI;                        // Positionswinkel (Bogenma�)
    var cos = Math.cos(phi), sin = Math.sin(phi);          // Trigonometrische Werte
    var x1 = x0+15*cos, y1 = y0-15*sin;                    // Anfangspunkt Markierung (innen)
    var x2 = x0+20*cos, y2 = y0-20*sin;                    // Endpunkt Markierung (au�en)
    line(x1,y1,x2,y2,2);                                   // Dicke Linie f�r Markierung
    }
  phi = (1.25-pp*0.3/100000)*Math.PI;                      // Winkel f�r Zeiger (Bogenma�)
  x1 = x0+13*Math.cos(phi); y1 = y0-13*Math.sin(phi);      // Koordinaten Zeigerendpunkt
  line(x0,y0,x1,y1,2);                                     // Dicke Linie f�r Zeiger
  }

// Hilfsroutine: Schmales, senkrecht stehendes Rechteck mit abgerundeten Ecken
// x .... Waagrechte Koordinate (Pixel)
// y0 ... Senkrechte Koordinate des h�chsten Punkts (Pixel)
// y1 ... Senkrechte Koordinate des tiefsten Punkts (Pixel)
// c .... F�llfarbe

function roundRect (x, y0, y1, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x+2,y1-2);                                    // Anfangspunkt (rechts unten)
  ctx.lineTo(x+2,y0+2);                                    // Weiter nach oben
  ctx.arc(x,y0+2,2,0,Math.PI,true);                        // Oberer Halbkreisbogen
  ctx.lineTo(x-2,y1-2);                                    // Weiter nach unten
  ctx.arc(x,y1-2,2,Math.PI,2*Math.PI,true);                // Unterer Halbkreisbogen
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Gef�llte Fl�che und Rand
  }
  
// Thermometer:

function thermometer () {
  var x0 = 200, y0 = 95;                                   // Bezugspunkt (Pixel)
  rectangle(x0-20,y0-65,40,90,"#ffffff");                  // Rechteck f�r Skala
  roundRect(x0,y0-52,y0+42,"#ffffff");                     // Glasr�hrchen
  var h1 = 20+tt*0.06;                                     // Hilfsgr��e f�r Thermometerfl�ssigkeit (Pixel)
  roundRect(x0,y0+40-h1,y0+42,"#808080");                  // Thermometerfl�ssigkeit
  for (var i=1; i<=10; i++) {                              // F�r alle Indizes ...
    var y = y0+20-i*6;                                     // Senkrechte Koordinate (Pixel)
    var h = (i%5==0 ? 15 : 10);                            // Strichl�nge (Pixel)
    line(x0-h,y,x0-3,y);                                   // Strich links
    line(x0+3,y,x0+h,y);                                   // Strich rechts
    }
  }
  
// Pfeil f�r Arbeit:
// c ... F�llfarbe

function polygonWork (c) {
  var x0 = 170, y0 = 280;                                  // Bezugspunkt (Pixel)
  var dw;                                                  // Variable f�r �bertragene Arbeit (Betrag)
  switch (process) {                                       // Je nach Art der Zustands�nderung ...
    case 1: dw = t0-t1; break;                             // Fall 1 (isobare Zustands�nderung)
    case 2: dw = 0; break;                                 // Fall 2 (isochore Zustands�nderung)
    case 3: dw = t0*Math.log(p1/p0); break;                // Fall 3 (isotherme Zustands�nderung)
    }
  var sign = 1;                                            // Vorzeichenfaktor (+1 f�r zugef�hrte Arbeit) 
  if (dw < 0) {sign = -1; dw = -dw;}                       // Korrektur, falls Arbeit abgegeben
  var w = dw*FACTOR_ENERGY;                                // Halbe Breite des Pfeils (Pixel) 
  if (w == 0) return;                                      // Falls Arbeit gleich 0, abbrechen
  if (w > 50) w = 50;                                      // Zu breiten Pfeil verhindern
  newPath();                                               // Neuer Grafikpfad
  ctx.moveTo(x0,y0-sign*30);                               // Pfeilspitze als Anfangspunkt
  ctx.lineTo(x0-w-20,y0-sign*10);                          // Weiter nach links unten/oben
  ctx.lineTo(x0-w,y0-sign*10);                             // Weiter nach rechts
  ctx.lineTo(x0-w,y0+sign*30);                             // Weiter nach unten/oben
  ctx.lineTo(x0+w,y0+sign*30);                             // Weiter nach rechts
  ctx.lineTo(x0+w,y0-sign*10);                             // Weiter nach oben/unten
  ctx.lineTo(x0+w+20,y0-sign*10);                          // Weiter nach rechts
  ctx.lineTo(x0,y0-sign*30);                               // Zur�ck nach links oben/unten zum Anfangspunkt
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Gef�llte Fl�che und Rand
  ctx.fillStyle = colorWork1;                              // Schriftfarbe
  ctx.fillText(text11,x0+40,y0);                           // Erkl�render Text (Arbeit)
  }

// Pfeil f�r W�rme
// c ... F�llfarbe
  
function polygonHeat (c) {
  var x0 = 70, y0 = 140;                                   // Bezugspunkt (Pixel)
  var dq;                                                  // Variable f�r �bertragene W�rme (Betrag)
  switch (process) {                                       // Je nach Art der Zustands�nderung ...
    case 1: dq = CP*(t1-t0); break;                        // Fall 1 (isobare Zustands�nderung)
    case 2: dq = CV*(t1-t0); break;                        // Fall 2 (isochore Zustands�nderung)
    case 3: dq = t0*Math.log(p0/p1); break;                // Fall 3 (isotherme Zustands�nderung)
    }
  var sign = 1;                                            // Vorzeichenfaktor (+1 f�r zugef�hrte W�rme)
  if (dq < 0) {sign = -1; dq = -dq;}                       // Korrektur, falls W�rme abgegeben
  var q = dq*FACTOR_ENERGY;                                // Halbe Breite des Pfeils (Pixel)
  if (q == 0) return;                                      // Falls W�rme gleich 0, abbrechen
  if (q > 50) q = 50;                                      // Zu breiten Pfeil verhindern
  newPath();                                               // Neuer Grafikpfad
  ctx.moveTo(x0+sign*30,y0);                               // Pfeilspitze als Anfangspunkt
  ctx.lineTo(x0+sign*10,y0-q-20);                          // Weiter nach links/rechts oben
  ctx.lineTo(x0+sign*10,y0-q);                             // Weiter nach unten
  ctx.lineTo(x0-sign*30,y0-q);                             // Weiter nach links/rechts
  ctx.lineTo(x0-sign*30,y0+q);                             // Weiter nach unten
  ctx.lineTo(x0+sign*10,y0+q);                             // Weiter nach rechts/links
  ctx.lineTo(x0+sign*10,y0+q+20);                          // Weiter nach unten
  ctx.lineTo(x0+sign*30,y0);                               // Zur�ck nach rechts/links oben zum Anfangspunkt
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Gef�llte Fl�che und Rand
  ctx.fillStyle = colorHeat1;                              // Schriftfarbe
  ctx.fillText(text12,x0-20,y0+q+40);                      // Erkl�render Text (W�rme)
  }
  
// Pfeile f�r Energietransport:

function transportEnergy () {
  var a = (t > 0 && t < MAX_TIME);                         // Flag f�r aktiven Energietransport
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig  
  polygonWork(a ? colorWork1 : colorWork2);                // Pfeil f�r Arbeit  
  polygonHeat(a ? colorHeat1 : colorHeat2);                // Pfeil f�r W�rme  
  var line1, line2;                                        // Variablen f�r Textzeilen
  if (t1 > t0) {line1 = text13; line2 = text14;}           // Textzeilen f�r vergr��erte innere Energie
  else if (t1 == t0) {line1 = text15; line2 = text16;}     // Textzeilen f�r unver�nderte innere Energie
  else {line1 = text17; line2 = text18;}                   // Textzeilen f�r verkleinerte innere Energie
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(line1,60,370);                              // Aussage zur inneren Energie, 1. Zeile
  ctx.fillText(line2,60,385);                              // Aussage zur inneren Energie, 2. Zeile
  }
  
// Koordinatensystem:
// u, v ..... Bildschirmkoordinaten Ursprung (Pixel)
// s1, s2 ... Beschriftung der Achsen
// tick1 .... Abstand der Ticks zur waagrechten Achse (Pixel)
// tick2 .... Abstand der Ticks zur senkrechten Achse (Pixel)

function coordSystem (u, v, s1, s2, tick1, tick2) {
  if (tick1 <= 0 || tick2 <= 0) return;                    // Abbruch, falls Abstand der Ticks nicht positiv
  arrow(u-10,v,u+100,v);                                   // Waagrechte Achse   
  for (var i=u+tick1; i<=u+80; i+=tick1)                   // F�r alle Indizes ...
    line(i,v-3,i,v+3);                                     // Tick zeichnen
  arrow(u,v+10,u,v-100);                                   // Senkrechte Achse    
  for (i=v-tick2; i>=v-80; i-=tick2)                       // F�r alle Indizes ... 
    line(u-3,i,u+3,i);                                     // Tick zeichnen
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig
  ctx.fillText(s1,u+92,v+15);                              // Beschriftung der waagrechten Achse
  ctx.textAlign = "right";                                 // Textausrichtung rechtsb�ndig
  ctx.fillText(s2,u-5,v-90);                               // Beschriftung der senkrechten Achse
  }
  
// T-V-Diagramm:
// u, v ... Bildschirmkoordinaten Ursprung (Pixel)

function diagramTV (u, v) {
  var pixT = 100, pixV = 1000;                             // Umrechnungsfaktoren
  coordSystem(u,v,symbolTemperature,symbolVolume,tickT,tickV); // Koordinatensystem
  var fT = tickT/pixT, fV = tickV*pixV;                    // Faktoren
  var x0 = u+t0*fT, y0 = v-v0*fV;                          // Koordinaten Anfangszustand (Pixel)
  var x1 = u+t1*fT, y1 = v-v1*fV;                          // Koordinaten Endzustand (Pixel)
  line(x0,y0,x1,y1);                                       // Linie zwischen Anfangs- und Endzustand
  circle(x0,y0,2.5,"#000000");                             // Markierung Anfangszustand
  circle(x1,y1,2.5,"#000000");                             // Markierung Endzustand
  var xx = u+tt*fT, yy = v-vv*fV;                          // Koordinaten aktueller Zustand (Pixel)
  circle(xx,yy,2.5,"#ff00ff");                             // Markierung aktueller Zustand
  }
      
// T-p-Diagramm:
// u, v ... Bildschirmkoordinaten Ursprung (Pixel)

function diagramTP (u, v) {
  var pixT = 100, pixP = 100000;                           // Umrechnungsfaktoren
  coordSystem(u,v,symbolTemperature,symbolPressure,tickT,tickP); // Koordinatensystem
  var fT = tickT/pixT, fP = tickP/pixP;                    // Faktoren
  var x0 = u+t0*fT, y0 = v-p0*fP;                          // Koordinaten Anfangszustand (Pixel)
  var x1 = u+t1*fT, y1 = v-p1*fP;                          // Koordinaten Endzustand (Pixel)
  line(x0,y0,x1,y1);                                       // Linie zwischen Anfangs- und Endzustand
  circle(x0,y0,2.5,"#000000");                             // Markierung Anfangszustand
  circle(x1,y1,2.5,"#000000");                             // Markierung Endzustand
  var xx = u+tt*fT, yy = v-pp*fP;                          // Koordinaten aktueller Zustand (Pixel) 
  circle(xx,yy,2.5,"#ff00ff");                             // Markierung aktueller Zustand
  }
        
// V-p-Diagramm:
// u, v ... Bildschirmkoordinaten Ursprung (Pixel)

function diagramVP (u, v) {
  var pixV = 1000, pixP = 100000;                          // Umrechnungsfaktoren
  coordSystem(u,v,symbolVolume,symbolPressure,tickV,tickP);  // Koordinatensystem
  var fV = tickV*pixV, fP = tickP/pixP;                    // Faktoren
  var x0 = u+v0*fV, y0 = v-p0*fP;                          // Koordinaten Anfangszustand (Pixel)
  var x1 = u+v1*fV, y1 = v-p1*fP;                          // Koordinaten Endzustand (Pixel)
  if (process <= 2) line(x0,y0,x1,y1);                     // Entweder Linie zwischen Anfangs- und Endzustand ...
  else {                                                   // ... oder Hyperbel
    var dir = (v1>v0 ? 1 : -1);                            // Schrittweite 1 oder - 1
    newPath();                                             // Neuer Grafikpfad
    var x = x0, y = y0;                                    // Koordinaten Anfangspunkt (Pixel)
    ctx.moveTo(x,y);                                       // Anfangspunkt
    while (dir > 0 && x < x1 || dir < 0 && x > x1) {       // Solange Ende des Hyperbelbogens noch nicht erreicht ...
      x += dir;                                            // Waagrechte Koordinate um 1 vergr��ern oder verkleinern
      var vDiagr = (x-u)/fV;                               // Zugeh�riges Volumen
      y = v-(p0*v0/vDiagr)*fP;                             // Senkrechte Koordinate berechnen
      ctx.lineTo(x,y);                                     // Linie als Teil eines Polygonzugs     
      }
    ctx.stroke();                                          // Polygonzug zeichnen
    }
  circle(x0,y0,2.5,"#000000");                             // Markierung Anfangszustand    
  circle(x1,y1,2.5,"#000000");                             // Markierung Endzustand    
  var xx = u+vv*fV, yy = v-pp*fP;                          // Koordinaten aktueller Zustand (Pixel)
  circle(xx,yy,2.5,"#ff00ff");                             // Markierung aktueller Zustand
  }
  
// Meldung einer Bereichs�berschreitung:

function messageRange () {
  var s = "";                                              // Leere Zeichenkette (alles in Ordnung)
  switch (range) {                                         // Je nach Wert von range ...
    case 1: case 7: s = text19; break;                     // Druck zu klein
    case 2: case 8: s = text20; break;                     // Druck zu gro�
    case 3: case 9: s = text21; break;                     // Volumen zu klein
    case 4: case 10: s = text22; break;                    // Volumen zu gro�
    case 5: case 11: s = text23; break;                    // Temperatur zu klein
    case 6: case 12: s = text24; break;                    // Temperatur zu gro�
    }
  if (range == 0) return;                                  // Falls alles in Ordnung, abbrechen
  ctx.fillStyle = "#ff0000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung links
  ctx.fillText(s,150,200);                                 // Meldung ausgeben
  reEnable();                                              // Radiobuttons und Eingabefelder (de-)aktivieren
  }
              
// Grafikausgabe:
// Seiteneffekt t, on, timer, tt, pp, vv, tickP, tickV, tickT 
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  if (on) {                                                // Falls Animation l�uft ...
    var time1 = new Date();                                // Aktuelle Zeit
    t += (time1-time0)/1000;                               // Zeitvariable aktualisieren
    time0 = time1;                                         // Bezugszeitpunkt aktualisieren
    }    
  ctx.font = FONT;                                         // Zeichensatz
  if (t >= MAX_TIME && rbP.disabled && range == 0)         // Falls Ende der Animation erreicht ... 
    reEnable();                                            // Radiobuttons und Eingabefelder aktivieren nzw. deaktivieren
  if (t > MAX_TIME) {                                      // Falls Animation beendet ...
    t = MAX_TIME;                                          // Zeitvariable zur�cksetzen 
    stopAnimation();                                       // Animation stoppen (Seiteneffekt on, timer)
    }
  if (range != 0) {                                        // Falls mindestens eine Zustandsgr��e nicht im erlaubten Bereich ...
    messageRange();                                        // Warnmeldung 
    return;                                                // Grafikausgabe abbrechen
    }
  var part = t/MAX_TIME;                                   // Bruchteil der Animationsdauer (0 bis 1)
  if (process <= 2) {                                      // Falls isobarer oder isochorer Vorgang ...
    tt = t0+part*(t1-t0);                                  // Aktuelle Temperatur (K)
    pp = p0+part*(p1-p0);                                  // Aktueller Druck (Pa)
    vv = v0+part*(v1-v0);                                  // Aktuelles Volumen (m�)
    }
  else {                                                   // Falls isothermer Vorgang ...
    vv = v0*Math.exp(part*Math.log(v1/v0));                // Aktuelles Volumen (m�)
    pp = p0*v0/vv;                                         // Aktueller Druck (Pa)
    tt = t0;                                               // Aktuelle Temperatur (K)
    }
  cylinder();                                              // Gasgef�llter Zylinder mit Kolben
  manometer();                                             // Druckmessger�t
  thermometer();                                           // Thermometer
  transportEnergy();                                       // Pfeile f�r Energietransport
  setTicks();                                              // Abstand der Ticks auf den Diagramm-Achsen (Seiteneffekt)
  diagramTV(310,120);                                      // Temperatur-Volumen-Diagramm
  diagramTP(310,260);                                      // Temperatur-Druck-Diagramm
  diagramVP(310,400);                                      // Volumen-Druck-Diagramm
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen




