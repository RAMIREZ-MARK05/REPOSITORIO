// Gravitation, Zweik�rperproblem
// 25.11.2020 - 12.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel gravity_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorMass1 = "#ffffff";                                // Farbe f�r 1. Masse
var colorMass2 = "#000000";                                // Farbe f�r 2. Masse
var colorVelocity = "#ff00ff";                             // Farbe f�r Geschwindigkeit
var colorAcceleration = "#0000ff";                         // Farbe f�r Beschleunigung
var colorForce = "#008000";                                // Farbe f�r Kraft

// Sonstige Konstanten:

var G = 6.67430e-11;                                       // Gravitationskonstante (SI-Einheiten)
var PI2 = 2*Math.PI;                                       // Abk�rzung f�r 2 pi
var DEG = Math.PI/180;                                     // Grad (Bogenma�)
var DIGITS = 3;                                            // Nachkommastellen bei Zehnerpotenz-Schreibweise
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var X_DATA = 340;                                          // Waagrechte Bildschirmkoordinate f�r Datenausgabe

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var canvasFix, ctxFix;                                     // Gespeicherte Zeichnung, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Reset, Start)
var cbSlow;                                                // Optionsfeld Zeitlupe
var ipDm, ipDe;                                            // Eingabefelder Abstand (Mantisse/Zehnerexponent)
var ipM1m, ipM1e;                                          // Eingabefelder Masse 1 (Mantisse/Zehnerexponent)
var ipV1m, ipV1e;                                          // Eingabefelder Geschwindigkeit 1 (Mantisse/Zehnerexponent)
var ipM2m, ipM2e;                                          // Eingabefelder Masse 2 (Mantisse/Zehnerexponent)
var ipV2m, ipV2e;                                          // Eingabefelder Geschwindigkeit 2 (Mantisse/Zehnerexponent)
var bu3, bu4;                                              // Schaltkn�pfe (Kreisbahn, Parabelbahn)
var ch;                                                    // Auswahlfeld
var on;                                                    // Flag f�r Bewegung
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var timer;                                                 // Timer f�r Animation  
var m1, m2;                                                // Massen (kg) 
var mSum;                                                  // Gesamtmasse (kg)
var m1Rel, m2Rel;                                          // Anteile an der Gesamtmasse
var r0;                                                    // Anfangsabstand (m)    
var v20;                                                   // Anfangsgeschwindigkeit von K�rper 2 (m/s)
var type;                                                  // Bahntyp (0 bis 5)
var type0;                                                 // Vorgegebener Bahntyp (0 bis 5)
var angMom;                                                // Drehimpuls (kg*m^2/s)
var energy;                                                // Gesamtenergie (J)
var eps;                                                   // Numerische Exzentrizit�t
var a;                                                     // Gro�e bzw. reelle Halbachse (m, Ellipse bzw. Hyperbel) mit Vorzeichen
var period;                                                // Umlaufdauer (s, Ellipse)
var c1;                                                    // Hilfskonstante (Gravitationskonstante mal Gesamtmasse)
var c2;                                                    // Hilfskonstante f�r Positionswinkelberechnung (Ellipse/Hyperbel)
var c3;                                                    // Hilfskonstante zur Bestimmung der Bewegungsrichtung
var c4;                                                    // Hilfskonstante f�r Positionswinkelberechnung (Parabel)
var c5;                                                    // Hilfskonstante f�r Positionswinkelberechnung (Hyperbel)
var c6;                                                    // Hilfskonstante f�r freien Fall

var factorTime;                                            // Umrechnungsfaktor f�r die Zeit
var pix;                                                   // Umrechnungsfaktor (Pixel pro m)
var pixV;                                                  // Umrechnungsfaktor (Pixel pro m/s)
var pixA;                                                  // Umrechnungsfaktor (Pixel pro m/s�)
var pixF;                                                  // Umrechnungsfaktor (Pixel pro N)
var hp;                                                    // Halbparameter (m)
var tReal;                                                 // Reale Zeit (s)
var phi;                                                   // Positionswinkel f�r Eink�rperproblem (Bogenma�)
var cos, sin;                                              // Zugeh�rige trigonometrische Werte
var r;                                                     // Radius f�r Eink�rperproblem (m)
var rMin, rMax;                                            // Minimaler und maximaler Abstand (m)
var v;                                                     // Geschwindigkeit f�r Eink�rperproblem (m/s)
var phiV;                                                  // Bewegungsrichtung f�r Eink�rperproblem (Bogenma�)
var cosV, sinV;                                            // Zugeh�rige trigonometrische Werte  
var f;                                                     // Gravitationskraft (N)
var cosT, cosR;                                            // Koeffizienten f�r Zerlegung tangential/radial
var phiMax;                                                // Maximaler Positionswinkel (Hyperbel) 
var hMax;                                                  // Maximale exzentrische Anomalie (Hyperbel)                                         

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... Attribut ID im HTML-Befehl
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
  canvasFix = document.createElement("canvas");            // Zeichenfl�che f�r gespeicherte Zeichnung
  canvasFix.width = width; canvasFix.height = height;      // Abmessungen �bernehmen
  x0 = width/2-100; y0 = height/2;                         // Bildschirmkoordinaten Ursprung (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext f�r komplette Zeichnung
  ctxFix = canvasFix.getContext("2d");                     // Grafikkontext f�r gespeicherte Zeichnung
  bu1 = getElement("bu1",text01);                          // Resetknopf
  bu2 = getElement("bu2",text02[0]);                       // Startknopf 
  setButton2State(0);                                      // Anfangszustand Startknopf
  cbSlow = getElement("cbSlow");                           // Optionsfeld (Zeitlupe)
  cbSlow.checked = false;                                  // Zun�chst nicht angeklickt
  getElement("lbSlow",text03);                             // Erkl�render Text (Zeitlupe)
  getElement("ipDa",text04);                               // Erkl�render Text (Abstand)
  ipDm = getElement("ipDb");                               // Eingabefeld (Abstand, Mantisse)
  getElement("ipDc",power10);                              // Mal 10 hoch
  ipDe = getElement("ipDd");                               // Eingabefeld (Abstand, Zehnerexponent)
  getElement("ipDe",meter);                                // Einheit (Abstand)                              
  getElement("ipM1a",text05);                              // Erkl�render Text (Masse 1)
  ipM1m = getElement("ipM1b");                             // Eingabefeld (Masse 1, Mantisse)
  getElement("ipM1c",power10);                             // Mal 10 hoch  
  ipM1e = getElement("ipM1d");                             // Eingabefeld (Masse 1, Zehnerexponent)
  getElement("ipM1e",kilogram);                            // Einheit (Masse 1)
  getElement("ipV1a",text06);                              // Erkl�render Text (Geschwindigkeit 1)
  ipV1m = getElement("ipV1b");                             // Eingabefeld (Geschwindigkeit 1, Mantisse)
  getElement("ipV1c",power10);                             // Mal 10 hoch
  ipV1e = getElement("ipV1d");                             // Eingabefeld (Geschwindigkeit 1, Zehnerexponent)
  getElement("ipV1e",meterPerSecond);                      // Einheit (Geschwindigkeit 1)
  getElement("ipM2a",text07);                              // Erkl�render Text (Masse 2)
  ipM2m = getElement("ipM2b");                             // Eingabefeld (Masse 2, Mantisse)
  getElement("ipM2c",power10);                             // Mal 10 hoch
  ipM2e = getElement("ipM2d");                             // Eingabefeld (Masse 2, Zehnerexponent)
  getElement("ipM2e",kilogram);                            // Einheit (Masse 2)
  getElement("ipV2a",text08);                              // Erkl�render Text (Geschwindigkeit 2)
  ipV2m = getElement("ipV2b");                             // Eingabefeld (Geschwindigkeit 2, Mantisse)
  getElement("ipV2c",power10);                             // Mal 10 hoch
  ipV2e = getElement("ipV2d");                             // Eingabefeld (Geschwindigkeit 2, Zehnerexponent)
  getElement("ipV2e",meterPerSecond);                      // Einheit (Geschwindigkeit 2)
  bu3 = getElement("bu3",text09);                          // Schaltknopf Kreisbahn
  bu4 = getElement("bu4",text10);                          // Schaltknopf Parabelbahn
  ch = newSelect("ch",textSelect);                         // Auswahlfeld
  getElement("author",author);                             // Autor (und �bersetzer)
    
  on = false;                                              // Animation zun�chst abgeschaltet
  t = 0;                                                   // Zeitvariable (s)
  type0 = undefined;                                       // Vorgegebener Bahntyp
  r0 = 1e8;                                                // Startwert Abstand (m)
  m1 = 5.97e24;                                            // Startwert Masse 1 (kg, f�r Erde)
  m2 = 1;                                                  // Startwert Masse 2 (kg)  
  v20 = 1e3;                                               // Startwert Anfangsgeschwindigkeit 2 (m/s)  
  updateInput();                                           // Eingabefelder aktualisieren 
  enableInput(true);                                       // Eingabe zun�chst uneingeschr�nkt m�glich  
  calculation();                                           // Zeitunabh�ngige Berechnungen (Seiteneffekt!)
  paintFix();                                              // Gleichbleibende Teile der Zeichnung speichern
  paint();                                                 // Zeichnen
  focus(ipDm);                                             // Fokus f�r das erste Eingabefeld
      
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Zur�ck)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  ipDm.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Abstand, Mantisse)
  ipDe.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Abstand, Zehnerexponent)
  ipM1m.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Masse 1, Mantisse)
  ipM1e.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Masse 1, Zehnerexponent)
  ipM2m.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Masse 2, Mantisse)
  ipM2e.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Masse 2, Zehnerexponent)  
  ipV2m.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Geschwindigkeit 2, Mantisse)
  ipV2e.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Geschwindigkeit 2, Zehnerexponent)
  ipDm.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Abstand, Mantisse)
  ipDe.onblur = reaction;                                  // Reaktion auf Verlust des Fokus (Abstand, Zehnerexponent)
  ipM1m.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Masse 1, Mantisse)
  ipM1e.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Masse 1, Zehnerexponent)
  ipM2m.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Masse 2, Mantisse)
  ipM2e.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Masse 2, Zehnerexponent)
  ipV2m.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Geschwindigkeit 2, Mantisse)
  ipV2e.onblur = reaction;                                 // Reaktion auf Verlust des Fokus (Geschwindigkeit 2, Zehnerexponent)  
  bu3.onclick = reactionCircle;                            // Reaktion auf Schaltknopf (Kreisbahn)
  bu4.onclick = reactionParabola;                          // Reaktion auf Schaltknopf (Parabelbahn)
  ch.onclick = reactionSelect;                             // Reaktion auf Auswahlfeld
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld

  } // Ende der Methode start
  
// Neues Auswahlfeld:
// id ... Attributwert ID im HTML-Text
// a .... Array von Zeichenketten
  
function newSelect (id, a) {
  var ch = getElement(id);                                 // Neues Auswahlfeld
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = a[i];                                         // Text zuweisen
    ch.add(o);                                             // option-Element hinzuf�gen
    }
  return ch;                                               // R�ckgabewert
  }
  
// Zustandsfestlegung f�r Schaltknopf Start/Pause/Weiter:
// st ... Gew�nschter Zustand (0, 1 oder 2)
// Seiteneffekt bu2.state, Schaltknopftext
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text02[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt bu2.state, Schaltknopftext
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text �ndern
  }
    
// Reaktion auf den Resetknopf:
// Seiteneffekt bu2, on, timer, t, type0, r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, 
// c2, c3, c4, c5, c6, phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF,
// t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
// Wirkung auf Ein- und Ausgabefelder 
   
function reactionReset () {
  setButton2State(0);                                      // Startknopf in Anfangszustand
  enableInput(true);                                       // Eingabefelder aktivieren
  stopAnimation();                                         // Animation stoppen
  t = 0;                                                   // Zeitvariable zur�cksetzen
  if (type0 != 2 && type0 != 4) type0 = undefined;         // Vorgabe Bahntyp
  reaction();                                              // Eingabe, zeitunabh�ngige Berechnungen, gespeicherte Zeichnung
  paint();                                                 // Neu zeichnen
  focus(ipDm);                                             // Fokus f�r erstes Eingabefeld
  }
  
// Reaktion auf den Startknopf:
// Seiteneffekt bu2, on, timer, t0, r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, 
// c2, c3, c4, c5, c6, phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF
// Wirkung auf Ein- und Ausgabefelder

function reactionStart () {
  switchButton2();                                         // Startknopf umschalten 
  enableInput(false);                                      // Eingabefelder deaktivieren
  if (bu2.state == 1) startAnimation();                    // Je nach Zustand Animation starten ...
  else stopAnimation();                                    // ... oder Animation stoppen
  reaction();                                              // Eingabe, zeitunabh�ngige Berechnungen, gespeicherte Zeichnung
  }
  
// Hilfsroutine: Eingabe, zeitunabh�ngige Berechnungen, gespeicherte Zeichnung
// Seiteneffekt r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, c2, c3, c4, c5, c6
// phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF
// Wirkung auf Ein- und Ausgabefelder

function reaction () {
  input();                                                 // Eingegebene Werte �bernehmen (eventuell korrigiert)
  calculation();                                           // Zeitunabh�ngige Berechnungen
  paintFix();                                              // Gleichbleibende Teile der Zeichnung speichern
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt t, on, timer, type0, r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, c2, c3, c4, c5, c6
// phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF
// t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
  
function reactionEnter (e) {
  t = 0;                                                   // Zeitvariable zur�cksetzen 
  stopAnimation();                                         // Animation stoppen
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (enter) {                                             // Falls Enter-Taste ...
    type0 = undefined;                                     // Kein Bahntyp vorgegeben
    reaction();                                            // Eingabe, zeitunabh�ngige Berechnungen, gespeicherte Zeichnung 
    }                    
  paint();                                                 // Neu zeichnen
  }
  
// Fokus f�r Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus f�r Eingabefeld
  var n = ip.value.length;                                 // L�nge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Schaltknopf Kreisbahn:
// Seiteneffekt type0, bu2, on, timer, t, type0, r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, 
// c2, c3, c4, c5, c6, phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF,
// t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
// Wirkung auf Ein- und Ausgabefelder

function reactionCircle () {
  type0 = 2;                                               // Vorgegebener Bahntyp
  reactionReset();                                         // Zeitunabh�ngige Berechnungen, Zustand vor dem Start
  }
  
// Reaktion auf Schaltknopf Parabelbahn:
// Seiteneffekt type0, bu2, on, timer, t, type0, r0, m1, m2, v20, mSum, c1, m1Rel, m2Rel, eps, type, a, hp, energy, angMom, period, 
// c2, c3, c4, c5, c6, phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF,
// t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
// Wirkung auf Ein- und Ausgabefelder

function reactionParabola () {
  type0 = 4;                                               // Vorgegebener Bahntyp
  reactionReset();                                         // Zeitunabh�ngige Berechnungen, Zustand vor dem Start
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt t, t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR

function reactionSelect () {
  paintFix();                                              // Gleichbleibenden Teil der Zeichnung speichern
  paint();                                                 // Neu zeichnen
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
  if (timer) clearInterval(timer);                         // Timer deaktivieren
  }

//-------------------------------------------------------------------------------------------------
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag f�r feste Anzahl von Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Zerlegung einer Zahl in Mantisse und Zehnerexponent:
// n ... Gegebene Zahl
// d ... Anzahl der Nachkommastellen (Mantisse)
// R�ckgabewert: Array, bestehend aus zwei Zeichenketten f�r Mantisse und Zehnerexponent
  
function toStringExp (n, d) {
  var neg = (n<0);                                         // Flag f�r negative Zahl
  n = Math.abs(n);                                         // Zahl durch Betrag ersetzen
  if (n == 0) return [ToString(0,d,true), "0"];            // R�ckgabewert, falls Zahl 0
  var a = new Array(2);                                    // Neues Array
  var e = Math.floor(Math.log(n)/Math.LN10);               // Zehnerexponent
  var p = Math.pow(10,e);                                  // Zehnerpotenz
  var m = n/p;                                             // Mantisse
  if (m > 10-Math.pow(10,-d)/2) {m /= 10; e++;}            // Mantisse 10 verhindern  
  var a0 = ToString(m,d,true);                             // Zeichenkette f�r Betrag der Mantisse
  a[0] = (neg ? "-"+a0 : a0);                              // Array-Element f�r Mantisse
  a[1] = ToString(e,0,true);                               // Array-Element f�r Zehnerexponent
  return a;                                                // R�ckgabewert
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
  
// Aktivierung/Deaktivierung der Eingabefelder:
// a ... Flag f�r Aktivierung

function enableInput (a) {
  ipDm.readOnly = !a;                                      // Eingabefeld Abstand, Mantisse
  ipDe.readOnly = !a;                                      // Eingabefeld Abstand, Zehnerexponent
  ipM1m.readOnly = !a;                                     // Eingabefeld Masse 1, Mantisse
  ipM1e.readOnly = !a;                                     // Eingabefeld Masse 1, Zehnerexponent
  ipV1m.readOnly = true;                                   // Ausgabefeld Geschwindigkeit 1, Mantisse
  ipV1e.readOnly = true;                                   // Ausgabefeld Geschwindigkeit 1, Zehnerexponent
  ipM2m.readOnly = !a;                                     // Eingabefeld Masse 2, Mantisse
  ipM2e.readOnly = !a;                                     // Eingabefeld Masse 2, Zehnerexponent
  ipV2m.readOnly = !a;                                     // Ausgabefeld Geschwindigkeit 2, Mantisse
  ipV2e.readOnly = !a;                                     // Ausgabefeld Geschwindigkeit 2, Zehnerexponent
  }
  
// Aktualisierung einer Zahl in Zehnerpotenz-Schreibweise:
// n ..... Zahl
// ipM ... Eingabefeld f�r Mantisse
// ipE ... Eingabefeld f�r Zehnerexponent
  
function updateNumber (n, ipM, ipE) {
  var a = toStringExp(n,DIGITS);                           // Array zweier Zeichenketten (Mantisse/Zehnerexponent)
  ipM.value = a[0];                                        // Eingabefeld f�r Mantisse anpassen
  ipE.value = a[1];                                        // Eingabefeld f�r Zehnerexponent anpassen
  }

// Eingabe einer Zahl in Zehnerpotenz-Schreibweise:
// ipM ... Eingabefeld f�r Mantisse
// ipE ... Eingabefeld f�r Zehnerexponent
// min ... Kleinster erlaubter Wert
// max ... Gr��ter erlaubter Wert
// R�ckgabewert: Eingegebene Zahl, eventuell korrigiert
  
function inputNumberME (ipM, ipE, min, max) {
  var s = ipM.value;                                       // Zeichenkette f�r Mantisse                          
  s = s.replace(decimalSeparator,".");                     // Punkt als Dezimaltrennzeichen
  var m = Number(s);                                       // Mantisse als Zahl
  s = ipE.value;                                           // Zeichenkette f�r Zehnerexponent
  var e = Math.floor(Number(s));                           // Exponent als Zahl (Ganzzahligkeit erzwungen)
  var n = m*Math.pow(10,e);                                // Mantisse mal Zehnerpotenz (NaN m�glich)
  if (isNaN(n)) n = 0;                                     // Undefinierte Zahl durch 0 ersetzen
  if (n < min) n = min;                                    // Zu kleinen Wert verhindern
  if (n > max) n = max;                                    // Zu gro�en Wert verhindern
  updateNumber(n,ipM,ipE);                                 // Eingabefeld anpassen
  return n;                                                // R�ckgabewert
  }
   
// Gesamte Eingabe:
// Seiteneffekt r0, m1, m2, v20; Wirkung auf Ein- und Ausgabefelder

function input () {
  var ae = document.activeElement;                         // Aktives Element
  r0 = inputNumberME(ipDm,ipDe,1,1e12);                    // Abstand
  m1 = inputNumberME(ipM1m,ipM1e,1,1e32);                  // Masse 1
  m2 = inputNumberME(ipM2m,ipM2e,1,1e32);                  // Masse 2
  if (type0 == 2)                                          // Falls Vorgabe Kreis ...
    v20 = m1*Math.sqrt(G/(r0*(m1+m2)));                    // Anfangsgeschwindigkeit von K�rper 2 berechnen
  else if (type0 == 4)                                     // Falls Vorgabe Parabel ...
    v20 = m1*Math.sqrt(2*G/(r0*(m1+m2)));                  // Anfangsgeschwindigkeit von K�rper 2 berechnen
  else v20 = inputNumberME(ipV2m,ipV2e,0,1e5);             // Anfangsgeschwindigkeit 2 (eingegeben)
  if (type0 == 2 || type0 == 4)                            // Falls Vorgabe Kreis oder Parabel ...
    updateNumber(v20,ipV2m,ipV2e);                         // Eingabefeld f�r Anfangsgeschwindigkeit 2 aktualisieren
  var v10 = v20*m2/m1;                                     // Anfangsgeschwindigkeit 1 (berechnet)
  updateNumber(v10,ipV1m,ipV1e);                           // Ausgabefeld f�r Anfangsgeschwindigkeit 1 aktualisieren
  if (ae == ipDm) focus(ipDe);                             // Fokus f�r n�chstes Eingabefeld
  if (ae == ipDe) focus(ipM1m);                            // Fokus f�r n�chstes Eingabefeld
  if (ae == ipM1m) focus(ipM1e);                           // Fokus f�r n�chstes Eingabefeld
  if (ae == ipM1e) focus(ipM2m);                           // Fokus f�r n�chstes Eingabefeld
  if (ae == ipM2m) focus(ipM2e);                           // Fokus f�r n�chstes Eingabefeld
  if (ae == ipM2e) focus(ipV2m);                           // Fokus f�r n�chstes Eingabefeld
  if (ae == ipV2m) focus(ipV2e);                           // Fokus f�r n�chstes Eingabefeld
  if (ae == ipV2e) ipV2e.blur();                           // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  updateNumber(r0,ipDm,ipDe);                              // Abstand
  updateNumber(m1,ipM1m,ipM1e);                            // Masse 1
  updateNumber(v20*m2/m1,ipV1m,ipV1e);                     // Anfangsgeschwindigkeit 1 (berechnet)
  updateNumber(m2,ipM2m,ipM2e);                            // Masse 2  
  updateNumber(v20,ipV2m,ipV2e);                           // Anfangsgeschwindigkeit 2
  }
  
// Bewegungstyp (0 bis 5):
// Wichtig: eps mit Vorzeichen!

function getType () { 
  if (type0 != undefined) return type0;                    // Vorgegebenen Typ beibehalten 
  if (v20 == 0) return 0;                                  // Fallbewegung (gerade Linie)
  if (eps < 0) return 1;                                   // Ellipse, Start in Apoapsis
  if (eps == 0) return 2;                                  // Kreis
  if (eps < 1) return 3;                                   // Ellipse, Start in Periapsis
  if (eps == 1) return 4;                                  // Parabel
  return 5;                                                // Hyperbel
  }
  
// Minimaler Abstand (m):
  
function minimalDistance () {
  if (type == 0) return 0;                                 // R�ckgabewert f�r freien Fall
  if (type == 1) return hp/(1+eps);                        // R�ckgabewert f�r Ellipse mit Start in Apoapsis
  return r0;                                               // R�ckgabewert f�r alle anderen F�lle
  }
  
// Maximaler Abstand (m):
  
function maximalDistance () {
  if (type == 0) return r0;                                // R�ckgabewert f�r freien Fall
  if (type <= 3) return hp/(1-eps);                        // R�ckgabewert f�r Ellipse
  return Number.POSITIVE_INFINITY;                         // R�ckgabewert f�r Parabel oder Hyperbel
  }
  
// Minimale Geschwindigkeit f�r Eink�rperproblem (m/s):
  
function minimalVelocity () {
  if (type == 0) return 0;                                 // R�ckgabewert f�r freien Fall
  if (type <= 3) return Math.sqrt(c1*(2/rMax-1/a));        // R�ckgabewert f�r Ellipse
  if (type == 4) return 0;                                 // R�ckgabewert f�r Parabel
  return Math.sqrt(c1*(-1/a));                             // R�ckgabewert f�r Hyperbel
  }
  
// Maximale Geschwindigkeit f�r Eink�rperproblem (m/s):
  
function maximalVelocity () {
  if (type == 0) return Number.POSITIVE_INFINITY;          // R�ckgabewert f�r freien Fall (Singularit�t!)
  if (type == 4) return Math.sqrt(c1*2/rMin);              // R�ckgabewert f�r Parabel
  return Math.sqrt(c1*(2/rMin-1/a));                       // R�ckgabewert f�r Ellipse oder Hyperbel
  }
  
// Minimale Kraft (N):

function minimalForce () {
  return G*m1*m2/(rMax*rMax);                              // R�ckgabewert
  }
  
// Maximale Kraft (N):
  
function maximalForce () {
  if (rMin == 0) return Number.POSITIVE_INFINITY;          // R�ckgabewert f�r freien Fall (Singularit�t!)
  return G*m1*m2/(rMin*rMin);                              // R�ckgabewert f�r alle anderen F�lle
  }
  
// Gesamtenergie (J, Schwerpunktsystem):

function getEnergy () {
  var v10 = v20*m2/m1;                                     // Anfangsgeschwindigkeit von  K�rper 1 (m/s)
  var e = -G*m1*m2/r0+m1*v10*v10/2+m2*v20*v20/2;           // Gesamtenergie (J, am Anfang) 
  return (type != 4 ? e : 0);                              // R�ckgabewert (Parabel als Spezialfall)
  }
  
// Umlaufdauer (s, nur f�r Ellipsen definiert):

function getPeriod () {
  if (type < 1 || type > 3) return undefined;              // Falls keine Ellipse, R�ckgabewert undefiniert 
  return PI2*a*Math.sqrt(a/(c1));                          // R�ckgabewert f�r Ellipse
  }
  
// Hilfskonstante zur Berechnung des Positionswinkels (Ellipse/Hyperbel):

function getC2 () {
  if (type < 1 || type == 4 || type > 5) return undefined; // Falls weder Ellipse noch Hyperbel, R�ckgabewert undefiniert
  return Math.sqrt((1+eps)/Math.abs(1-eps));               // R�ckgabewert, falls Ellipse oder Hyperbel
  } 
  
// Hilfskonstante zur Berechnung des Positionswinkels (Parabel):

function getC4 () {
  if (type != 4) return undefined;                         // R�ckgabewert, falls keine Parabel
  if (type == 4) return Math.sqrt(4*c1/(hp*hp*hp));        // R�ckgabewert f�r Parabel
  } 
  
// Hilfskonstante zur Berechnung des Positionswinkels (Hyperbel):

function getC5 () {
  if (type != 5) return undefined;                         // R�ckgabewert, falls keine Hyperbel
  var aa = Math.abs(a);                                    // Betrag der reellen Halbachse
  return Math.sqrt(c1/(aa*aa*aa));                         // R�ckgabewert f�r Hyperbel
  }             
  
// Umrechnungsfaktor Zeit (Animation/Realit�t):

function getFactorTime () {
  if (type == 0)                                           // Falls freier Fall ...
    return Math.sqrt(r0*r0*r0/(2*c1))*Math.PI/20;          // Fallzeit 10 s in Animation
  if (type >= 1 && type <= 3)                              // Falls Ellipse ...
    return period/20;                                      // Umlaufdauer 20 s in Animation 
  return height*m1Rel/(pix*v20*10);                        // Umrechnungsfaktor f�r Parabel oder Hyperbel
  }
  
// Umrechnungsfaktor L�nge (Pixel pro Meter):

function getPix () {
  if (type == 0) return width/(2*r0);                      // Freier Fall: Anfangsabstand wie halbe Bildbreite
  if (type >= 1 && type <= 3) return width/(4*a);          // Ellipse: Gro�e Halbachse wie viertel Bildbreite
  return width/(4*hp);                                     // Parabel/Hyperbel: Halbparameter wie viertel Bildbreite 
  } 
  
// Waagrechte Bildschirmkoordinate des Ursprungs (Pixel):

function getX0 () {
  var dx = 50;                                             // Verschiebung nach links (Pixel)
  if (type == 0) return width/4-dx;                        // R�ckgabewert f�r freien Fall
  if (type >= 4) return width/2-dx;                        // R�ckgabewert f�r Parabel oder Hyperbel
  var x1R = m2Rel*r0, x1L = x1R-2*a*m2Rel;                 // Extreme x-Koordinaten von K�rper 1 (m)
  var x2L = -m1Rel*r0, x2R = x2L+2*a*m1Rel;                // Extreme x-Koordinaten von K�rper 2 (m)                             
  var xMax = Math.max(x1R,x2R);                            // Maximale x-Koordinate (m)
  var xMin = Math.min(x1L,x2L);                            // Minimale x-Koordinate (m)
  var xM = (xMax+xMin)/2;                                  // x-Koordinate des Ellipsenmittelpunkts (m)
  return width/2+pix*xM-dx;                                // R�ckgabewert
  }
  
// Umrechnungsfaktor Geschwindigkeit (Pixel pro m/s):

function getPixV () {
  var vc;                                                  // Variable f�r Vergleichsgeschwindigkeit (m/s)
  if (type == 0) vc = Math.sqrt(2*c1*9/r0);                // Vergleichsgeschwindigkeit bei freiem Fall (f�r Abstand r0/10)
  else {                                                   // Falls kein freier Fall ...
    var vMax = maximalVelocity();                          // Maximale Geschwindigkeit Eink�rperproblem (m/s)
    vc = vMax*Math.max(m2Rel,m1Rel);                       // Vergleichsgeschwindigkeit (m/s)
    }
  return 100/vc;                                           // R�ckgabewert (100 Pixel f�r Vergleichsgeschwindigkeit)
  }
  
// Umrechnungsfaktor Beschleunigung (Pixel pro m/s�):

function getPixA () {
  var ac;                                                  // Variable f�r Vergleichsbeschleunigung (m/s�)
  var mMin = Math.min(m1,m2);                              // Kleinere der beiden Massen (kg)
  if (type == 0) ac = Math.sqrt(100*c1/(r0*r0*mMin));      // Vergleichsbeschleunigung bei freiem Fall (f�r Abstand r0/10)
  else ac = 2*maximalForce()/mMin;                         // Vergleichsbeschleunigung in allen anderen F�llen (m/s�)
  return 100/ac;                                           // R�ckgabewert (100 Pixel f�r Vergleichsbeschleunigung)
  }
  
// Umrechnungsfaktor Kraft (Pixel pro N):

function getPixF () {
  var fc;                                                  // Variable f�r Vergleichskraft (N)
  if (type == 0) fc = 100*c1/(r0*r0);                      // Vergleichskraft bei freiem Fall (f�r Abstand r0/10)
  else fc = 2*maximalForce();                              // Vergleichskraft in allen anderen F�llen (N)
  return 100/fc;                                           // R�ckgabewert (100 Pixel f�r Vergleichskraft)
  }
  
// Zeitunabh�ngige Berechnungen:
// Seiteneffekt mSum, c1, m1Rel, m2Rel, eps, v20, type, a, hp, energy, angMom, period, c2, c3, c4, c5, c6
// phiMax, hMax, rMin, rMax, factorTime, pix, x0, pixV, pixA, pixF

function calculation () {
  mSum = m1+m2;                                            // Gesamtmasse (kg)
  c1 = G*mSum;                                             // 1. Hilfskonstante
  m1Rel = m1/mSum; m2Rel = m2/mSum;                        // Anteile an der Gesamtmasse  
  if (type0 == 2) {                                        // Falls Vorgabe Kreis ...
    eps = 0;                                               // Numerische Exzentrizit�t
    v20 = Math.sqrt(c1/r0)*m1Rel;                          // Anfangsgeschwindigkeit von K�rper 2
    }
  else if (type0 == 4) {                                   // Falls Vorgabe Parabel ...
    eps = 1;                                               // Numerische Exzentrizit�t
    v20 = Math.sqrt(2*c1/r0)*m1Rel;                        // Anfangsgeschwindigkeit von K�rper 2
    }
  if (type0 != 2 && type0 != 4)                            // Falls kein Bewegungstyp vorgegeben ...
    eps = r0*mSum*v20*v20/(G*m1*m1)-1;                     // Numerische Exzentrizit�t (kann negativ sein)
  type = getType();                                        // Bewegungstyp (0 bis 5)
  a = r0/(1-eps);                                          // Gro�e bzw. reelle Halbachse (m, eventuell undefiniert)
  eps = Math.abs(eps);                                     // Numerische Exzentrizit�t ohne Vorzeichen
  hp = (type != 4 ? a*(1-eps*eps) : 2*r0);                 // Halbparameter (m, bei freiem Fall undefiniert)
  energy = getEnergy();                                    // Gesamtenergie (J)
  angMom = m2*r0*v20;                                      // Gesamtdrehimpuls (kg*m^2/s)
  period = getPeriod();                                    // Umlaufdauer (s, eventuell undefiniert)
  c2 = getC2();                                            // 1. Hilfskonstante (eventuell undefiniert)
  c3 = 1-eps*eps;                                          // 2. Hilfskonstante (eventuell undefiniert)
  c4 = getC4();                                            // 4. Hilfskonstante (nur f�r Parabel definiert)
  c5 = getC5();                                            // 5. Hilfskonstante (nur f�r Hyperbel definiert)
  if (type == 0) c6 = Math.sqrt(2*c1/(r0*r0*r0));          // 6. Hilfskonstante f�r freien Fall
  else c6 = undefined;                                     // Sonst undefiniert
  if (type == 5) {                                         // Falls Hyperbel ...
    phiMax = Math.acos(-1/eps)-1e-6;                       // Maximaler Positionswinkel (Rundungsfehler!)
    hMax = 2*Math.atanh(Math.tan(phiMax/2)/c2);            // Maximale exzentrische Anomalie
    }
  else {phiMax = hMax = undefined;}                        // F�r andere Bahnformen undefiniert  
  rMin = minimalDistance();                                // Minimaler Abstand (m)
  rMax = maximalDistance();                                // Maximaler Abstand (m)
  factorTime = getFactorTime();                            // Umrechnungsfaktor Zeit
  pix = getPix();                                          // Umrechnungsfaktor L�nge (Pixel pro m)
  x0 = getX0();                                            // Waagrechte Bildschirmkoordinate des Ursprungs (Pixel)
  pixV = getPixV();                                        // Umrechnungsfaktor Geschwindigkeit (Pixel pro m/s)
  pixA = getPixA();                                        // Umrechnungsfaktor Beschleunigung (Pixel pro m/s�)
  pixF = getPixF();                                        // Umrechnungsfaktor Kraft (Pixel pro N)                                    
  }
  
// L�sung einer Gleichung mit einer Unbekannten durch Intervallschachtelung:
// f .... Funktion
// y .... y-Wert
// xL ... Untere Grenze des Startintervalls
// xR ... Obere Grenze des Startintervalls
// R�ckgabewert: Eine (!) L�sung der Gleichung f(x) = y im Intervall [xL; xR]
// L�sung nur unter speziellen Vorausssetzungen (etwa strenge Monotonie) eindeutig!

function solution (f, y, xL, xR) {  
  var yL = f(xL)-y, yR = f(xR)-y;                          // Zugeh�rige Funktionswerte
  var e = 0;                                               // Fehlernummer
  if (xL > xR) e = 1;                                      // Fehlernummer f�r vertauschte Intervallgrenzen
  else if (xL == xR && f(xL) != y) e = 2;                  // Fehlernummer f�r Intervallbreite 0 und falschen Funktionswert
  else if (yR*yL > 0) e = 3;                               // Fehlernummer f�r gleiche Vorzeichen am Rand
  if (e > 0) {                                             // Falls Fehler ...
    alert("Fehler "+e);                                    // Fehlermeldung
    stopAnimation();                                       // Animation beenden
    return undefined;                                      // R�ckgabewert undefiniert
    }
  if (xL == xR) return xL;                                 // R�ckgabewert f�r Intervallbreite 0 und richtigen Funktionswert                   
  while (xR-xL > 1e-12) {                                  // Solange Intervallbreite gr��er als Genauigkeit ...
    var xM = (xL+xR)/2;                                    // Mitte des Intervalls
    var yM = f(xM)-y;                                      // Zugeh�riger Funktionswert
    if (yM*yL > 0) {xL = xM; yL = yM;}                     // L�sung entweder in der rechten H�lfte ...
    else {xR = xM; yR = yM;}                               // ... oder in der linken H�lfte des bisherigen Intervalls
    }
  return xM;                                               // R�ckgabewert
  }
  
// Funktion f�r freien Fall:
// Zeit (s) f�r die Bewegung vom Abstand r0 bis zum Abstand x*r0 

function fFall (x) {return Math.sqrt(x*(1-x))+Math.acos(Math.sqrt(x));}
  
// Funktion f�r Kepler-Gleichung einer Ellipse:
  
function fEllipse (x) {return x-eps*Math.sin(x);}

// Funktion f�r Barker-Gleichung einer Parabel:

function fParabola (x) {return x*x*x/3+x;}

// Funktion f�r Kepler-Gleichung einer Hyperbel:

function fHyperbola (x) {return eps*Math.sinh(x)-x;}

// Positionswinkel (wahre Anomalie) f�r Ellipsenbahn:
// Berechnung durch L�sen der Kepler-Gleichung
// t ... Zeit seit Abstandsminimum
// R�ckgabewert: Positionswinkel bez�glich Abstandsminimum (Bogenma� 0 bis 2 pi)

function getPhiE (t) {
  var n = Math.floor(t/period);                            // Zahl der vollen Uml�ufe
  t -= n*period;                                           // Volle Uml�ufe werden nicht ber�cksichtigt
  var m = t*PI2/period;                                    // Mittlere Anomalie (Bogenma� 0 bis 2 pi)
  if (type == 2) return m;                                 // R�ckgabewert f�r Kreis (0 bis 2 pi)
  var e = solution(fEllipse,m,0,PI2);                      // Exzentrische Anomalie (Bogenma� 0 bis 2 pi)
  var phi = 2*Math.atan(c2*Math.tan(e/2));                 // Positionswinkel (Bogenma� -pi bis +pi)
  return (phi >= 0 ? phi : phi+PI2);                       // R�ckgabewert (Bogenma� 0 bis 2 pi)
  }
  
// Positionswinkel f�r Parabelbahn:
// t ... Zeit seit Abstandsminimum
// R�ckgabewert: Positionswinkel bez�glich Abstandsminimum (Bogenma� 0 bis pi)

function getPhiP (t) {
  var m = c4*t;                                            // Mittlere Anomalie
  var x = solution(fParabola,m,0,Math.pow(3*m,1/3));       // L�sung der kubischen Gleichung
  return 2*Math.atan(x);                                   // R�ckgabewert (Bogenma� 0 bis pi)
  }
  
// Positionswinkel f�r Hyperbelbahn:
// t ... Zeit seit Abstandsminimum
// R�ckgabewert: Positionswinkel bez�glich Abstandsminimum (Bogenma� 0 bis phiMax)

function getPhiH (t) {
  var m = c5*t;                                            // Mittlere Anomalie
  var h = solution(fHyperbola,m,0,hMax);                   // Exzentrische Anomalie (L�sung der Kepler-Gleichung)
  return Math.min(2*Math.atan(c2*Math.tanh(h/2)),phiMax);  // R�ckgabewert
  }
  
// Zeitabh�ngige Berechnungen f�r freien Fall:
// Seiteneffekt phi, cos, sin, r, v, phiV, cosV, sinV, tReal
  
function calculationFall () {
  phi = 0;                                                 // Positionswinkel
  cos = 1; sin = 0;                                        // Trigonometrische Werte
  var f = (tReal < Math.PI/(2*c6));                        // Flag f�r Bewegung
  r = (f ? solution(fFall,tReal*c6,0,1)*r0 : 0);           // Radius f�r Eink�rperproblem (m)
  v = (f && t > 0 ? Math.sqrt(2*c1*(1/r-1/r0)) : 0);       // Geschwindigkeit f�r Eink�rperproblem (m/s)
  phiV = Math.PI;                                          // Bewegungsrichtung f�r Eink�rperproblem
  cosV = -1; sinV = 0;                                     // Trigonometrische Werte
  if (!f) tReal = Math.PI/(2*c6);                          // Falls Fall beendet, Zeit zur�cksetzen
  }
  
// Zeitabh�ngige Berechnungen f�r Kegelschnittbahn (type >= 1):
// Seiteneffekt phi, cos, sin, r, v, phiV, cosV, sinV
  
function calculationConic () {
  if (type >= 1 && type <= 3) phi = getPhiE(tReal);        // Positionswinkel f�r Ellipsenbahn
  else if (type == 4) phi = getPhiP(tReal);                // Positionswinkel f�r Parabelbahn
  else if (type == 5) phi = getPhiH(tReal);                // Positionswinkel f�r Hyperbelbahn
  if (type == 1) phi += Math.PI;                           // Korrektur, falls Start in Apoapsis
  if (phi > PI2) phi -= PI2;                               // Winkel �ber 2 pi verhindern
  cos = Math.cos(phi); sin = Math.sin(phi);                // Trigonometrische Werte
  if (type == 1) r = hp/(1-eps*cos);                       // Radius f�r Eink�rperproblem mit Start in Apapsis (m) 
  else r = hp/(1+eps*cos);                                 // Radius f�r Eink�rperproblem mit Start in Periapsis (m) 
  if (type == 4) v = Math.sqrt(2*c1/r);                    // Geschwindigkeit f�r Eink�rperproblem Parabel (m/s)
  else v = Math.sqrt(c1*(2/r-1/a));                        // Geschwindigkeit f�r Eink�rperproblem Ellipse/Hyperbel (m/s)   
  var x = r*cos, y = r*sin;                                // Koordinaten f�r Eink�rperproblem (m)
  if (type == 1) phiV = Math.atan2(c3*(x-eps*a),-y);       // Bewegungsrichtung f�r Ellipsenbahn mit Start in Apoapsis
  else if (type == 2) phiV = phi+Math.PI/2;                // Bewegungsrichtung f�r Kreisbahn
  else if (type == 3) phiV = Math.atan2(c3*(x+eps*a),-y);  // Bewegungsrichtung f�r Ellipsenbahn mit Start in Periapsis
  else if (type == 4) phiV = Math.PI-Math.atan2(hp,y);     // Bewegungsrichtung f�r Parabelbahn
  else phiV = Math.atan2(c3*(x+eps*a),-y);                 // Bewegungsrichtung f�r Hyperbelbahn
  if (phiV < 0) phiV += PI2;                               // Negativen Winkel verhindern
  if (phiV > PI2) phiV -= PI2;                             // Winkel �ber 2 pi verhindern
  cosV = Math.cos(phiV); sinV = Math.sin(phiV);            // Trigonometrische Werte
  }
  
// Zeitabh�ngige Berechnungen:
// Seiteneffekt tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
  
function calculationT () {
  tReal = t*factorTime;                                    // Reale Zeit (s)
  if (type == 1) tReal += period/2;                        // Falls Start in Apoapsis, halbe Umlaufdauer addieren
  if (type == 0) calculationFall();                        // Berechnungen f�r freien Fall
  else calculationConic();                                 // Berechnungen f�r Kegelschnittbahn
  f = G*m1*m2/(r*r);                                       // Gravitationskraft (N)
  if (type == 0 && tReal >= Math.PI/(2*c6)) f = 0;         // Falls freier Fall beendet, Kraft 0
  cosT = Math.abs(Math.cos(phiV-phi));                     // Koeffizient f�r tangentiale Komponenten
  cosR = Math.sqrt(1-cosT*cosT);                           // Koeffizient f�r radiale Komponenten
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:
// ctx ... Grafikkontext

function newPath (ctx) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie:
// ctx ...... Grafikkontext
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (ctx, x1, y1, x2, y2, c, w) {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe festlegen
  ctx.lineWidth = (w?w:1);                                 // Liniendicke festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Pfeil:
// ctx ...... Grafikkontext
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional, Defaultwert 1)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (ctx, x1, y1, x2, y2, w) {
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
// c ....... F�llfarbe

function circle (x, y, r, c) {
  ctx.fillStyle = c;                                       // F�llfarbe
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,PI2,true);                               // Kreis vorbereiten
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit schwarzem Rand
  }
  
// K�rper 1 und K�rper 2:

function bodies () {  
  var rPix = r*pix;                                        // Abstand vom Ursprung f�r Eink�rperproblem (Pixel)
  var r1 = rPix*m2Rel, r2 = rPix*m1Rel;                    // Abst�nde vom Ursprung (Pixel)
  var x1 = x0-r1*cos, y1 = y0+r1*sin;                      // Position von K�rper 1 (Pixel)
  var x2 = x0+r2*cos, y2 = y0-r2*sin;                      // Position von K�rper 2 (Pixel)
  var rad1, rad2;                                          // Radien der K�rper (Pixel)
  var q = m1/m2;                                           // Verh�ltnis der Massen
  if (q >= 100) {rad1 = 4.5; rad2 = 2.5;}                  // Radien, falls Verh�ltnis q sehr gro�
  else if (q >= 10) {rad1 = 4; rad2 = 3;}                  // Radien, falls Verh�ltnis q gro�
  else if (q >= 0.1) {rad1 = 3.5; rad2 = 3.5;}             // Radien, falls Verh�ltnis q in Gr��enordnung 1
  else if (q >= 0.01) {rad1 = 3; rad2 = 4;}                // Radien, falls Verh�ltnis q klein 
  else {rad1 = 2.5; rad2 = 4.5;}                           // Radien, falls Verh�ltnis q sehr klein
  if (colorMass1 == "#000000" && rad1 >= 3) rad1 -= 0.5;   // Radius korrigieren, falls F�llfarbe schwarz
  if (colorMass2 == "#000000" && rad2 >= 3) rad2 -= 0.5;   // Radius korrigieren, falls F�llfarbe schwarz
  if (m1 > m2) {                                           // Falls Masse 1 gr��er ...
    circle(x1,y1,rad1,colorMass1);                         // Zuerst Masse 1 zeichnen
    circle(x2,y2,rad2,colorMass2);                         // Danach Masse 2 zeichnen
    }
  else {                                                   // Falls Masse 2 gr��er (oder gleiche Massen) ...
    circle(x2,y2,rad2,colorMass2);                         // Zuerst Masse 2 zeichnen
    circle(x1,y1,rad1,colorMass1);                         // Danach Masse 1 zeichnen
    } 
  }
  
// Koordinatensystem (gespeicherte Zeichnung):

function axes () {
  ctxFix.strokeStyle = "#000000";                          // Linienfarbe
  arrow(ctxFix,5,y0,width-5,y0);                           // x-Achse
  arrow(ctxFix,x0,height-5,x0,5);                          // y-Achse
  ctxFix.font = FONT;                                      // Schriftart
  ctxFix.fillStyle = "#000000";                            // Schriftfarbe
  ctxFix.textAlign = "right";                              // Textausrichtung
  ctxFix.fillText("x",width-8,y0+14);                      // Beschriftung x-Achse
  ctxFix.textAlign = "left";                               // Textausrichtung
  ctxFix.fillText("y",x0+6,15);                            // Beschriftung y-Achse
  }
  
// Hilfsroutine: Position eines Bahnpunkts
// hpq ... Produkt aus Halbparameter hp, Umrechnungsfaktor pix und Faktor q
// e ..... Numerische Exzentrizit�t mit Vorzeichen
// phi ... Positionswinkel (Bogenma�)
// R�ckgabewert: Verbund mit Attributen u und v (Bildschirmkoordinaten, Pixel)

function pos (hpq, e, phi) {
  var cos = Math.cos(phi), sin = Math.sin(phi);            // Trigonometrische Werte
  var r = hpq/(1+e*cos);                                   // Pixel-Abstand vom Ursprung (Brennpunkt)
  return {u: x0-r*cos, v: y0+r*sin};                       // R�ckgabewert (Bildschirmkoordinaten u, v)
  }
  
// Bahn eines K�rpers (gespeicherte Zeichnung):
// n ... Nummer des K�rpers (1 oder 2)

function orbit (n) {
  var q = (n == 1 ? m2Rel : -m1Rel);                       // Faktor
  if (type == 0) {                                         // Falls freier Fall ...
    line(ctxFix,x0-q*pix*r0,y0,x0,y0);                     // Gerade Linie zum Ursprung 
    return;                                                // Abbrechen
    } 
  var hpq = pix*hp*q;                                      // Hilfsgr��e f�r Aufrufe der Methode pos
  var iMin = 0, iMax = 360;                                // Minimaler und maximaler Index (Ellipse)
  if (type == 4) {                                         // Falls Parabel ...
    iMin = -179;                                           // Minimaler Index
    iMax = 179;                                            // Maximaler Index
    }               
  else if (type == 5) {                                    // Falls Hyperbel ...
    iMax = Math.floor(phiMax/DEG);                         // Maximaler Index
    iMin = -iMax;                                          // Minimaler Index
    }
  var e = (type == 1 ? -eps : eps);                        // Numerische Exzentrizit�t mit Vorzeichen  
  newPath(ctxFix);                                         // Neuer Grafikpfad (Standardwerte) f�r Polygonzug
  var p = pos(hpq,e,iMin*DEG);                             // Position Anfangspunkt (Pixel)
  ctxFix.moveTo(p.u,p.v);                                  // Anfang Grafikpfad
  for (var i=iMin+1; i<=iMax; i++) {                       // F�r alle Indizes ...
    p = pos(hpq,e,i*DEG);                                  // Position
    ctxFix.lineTo(p.u,p.v);                                // Linie zum Polygonzug hinzuf�gen
    }
  ctxFix.stroke();                                         // Polygonzug zeichnen
  }
  
// Pfeil vom Mittelpunkt eines K�rpers weg:
// n ..... Nummer des K�rpers (1 oder 2)
// len ... L�nge des Pfeils (Pixel)
// a ..... Richtungswinkel bez�glich x-Achse (Bogenma�)
// c ..... Farbe
// w ..... Liniendicke (optional, Defaultwert 2)

function arrowBody (n, len, a, c, w) {
  var q = (n == 1 ? m2Rel : -m1Rel);                        // Faktor
  var x = x0-q*pix*r*cos, y = y0+q*pix*r*sin;               // Anfangspunkt (Pixel)
  var dx = len*Math.cos(a), dy = len*Math.sin(a);           // Koordinatendifferenzen (Pixel)
  ctx.strokeStyle = c;                                      // Farbe
  arrow(ctx,x,y,x+dx,y-dy,w?w:2);                           // Pfeil zeichnen
  }
  
// Pfeil f�r Beschleunigung oder Kraft mit Zerlegung in eine tangentiale und eine radiale Komponente:
// n ..... Nummer des K�rpers (1 oder 2)
// len ... L�nge des Pfeils (Pixel)
// a ..... Richtungswinkel bez�glich x-Achse (Bogenma�)
// c ..... Farbe
  
function parallelogram (n, len, a, c) {
  var q = (n == 1 ? m2Rel : -m1Rel);                        // Faktor
  var x = x0-q*pix*r*cos, y = y0+q*pix*r*sin;               // Anfangspunkt (Pixel)
  var dx = len*Math.cos(a), dy = len*Math.sin(a);           // Vektor (Pixel)
  var cT = dx*cosV+dy*sinV, cR = -dx*sinV+dy*cosV;          // Koeffizienten f�r Komponentenzerlegung
  var dxT = cT*cosV, dyT = cT*sinV;                         // Tangentiale Komponente (Pixel)
  line(ctx,x+dxT,y-dyT,x+dx,y-dy);                          // Linie f�r Parallelogramm
  var dxR = -cR*sinV, dyR = cR*cosV;                        // Radiale Komponente (Pixel)
  line(ctx,x+dxR,y-dyR,x+dx,y-dy);                          // Linie f�r Parallelogramm
  ctx.strokeStyle = c;                                      // Farbe
  arrow(ctx,x,y,x+dx,y-dy,2);                               // Pfeil f�r Vektor
  arrow(ctx,x,y,x+dxT,y-dyT,1);                             // Pfeil f�r tangentiale Komponente
  arrow(ctx,x,y,x+dxR,y-dyR,1);                             // Pfeil f�r radiale Komponente
  }
  
// Vergleichspfeil oder Vergleichslinie (gespeicherte Zeichnung):
// f ....... Umrechnungsfaktor (Pixel pro Einheit)
// u ....... Einheit
// (x,y) ... Position (Pixel), bezogen auf den Anfangspunkt der Linie bzw. des Pfeils
// c ....... Farbe
// a ....... Flag f�r Pfeilspitze

function comparison (f, u, x, y, c, a) {
  var k = Math.floor(Math.log(100/f)/Math.LN10);           // Zehnerexponent
  var len = f*Math.pow(10,k);                              // L�nge (Pixel)
  if (a) {                                                 // Falls Pfeil ...
    ctxFix.strokeStyle = c;                                // Farbe
    arrow(ctxFix,x,y,x+len,y,2);                           // Vergleichspfeil
    }
  else {                                                   // Falls kein Pfeil ...
    line(ctxFix,x,y,x+len,y,c);                            // Vergleichslinie
    line(ctxFix,x,y-3,x,y+3,c);                            // Linke Begrenzung
    line(ctxFix,x+len,y-3,x+len,y+3,c);                    // Rechte Begrenzung
    }
  ctxFix.textAlign = "left";                               // Textausrichtung
  var s1 = "10", s2 = ""+k, s3 = " "+u;                    // Zeichenketten der Bestandteile
  if (k == 0) {s1 = "1"; s2 = "";}                         // Korrektur, falls Exponent 0
  else if (k == 1) s2 = "";                                // Korrektur, falls Exponent 1
  var w1 = ctxFix.measureText(s1).width;                   // Breite des 1. Teils (Pixel)
  var w2 = ctxFix.measureText(s2).width;                   // Breite des 2. Teils (Pixel)
  var w3 = ctxFix.measureText(s3).width;                   // Breite des 3. Teils (Pixel)
  x += (len-w1-w2-w3)/2;                                   // Position f�r Beschriftung (Pixel)                                  
  ctxFix.fillText(s1,x,y-8);                               // Basis 10 oder Zahl 1
  if (s2 != "") ctxFix.fillText(s2,x+w1,y-12);             // Exponent
  ctxFix.fillText(s3,x+w1+w2,y-8);                         // Einheit
  }
  
// Pfeile f�r vektorielle Gr��en:

function arrows () {
  var n = ch.selectedIndex;                                // Ausgew�hlter Index
  if (n == 4) {                                            // Falls Index f�r Geschwindigkeit ...
    var c = colorVelocity;                                 // Abk�rzung f�r Farbe
    arrowBody(1,pixV*m2Rel*v,phiV+Math.PI,c);              // Geschwindigkeitspfeil f�r K�rper 1
    arrowBody(2,pixV*m1Rel*v,phiV,c);                      // Geschwindigkeitspfeil f�r K�rper 2
    }
  else if (n == 5) {                                       // Falls Index f�r Beschleunigung ...
    c = colorAcceleration;                                 // Abk�rzung f�r Farbe
    parallelogram(1,pixA*f/m1,phi,c);                      // Beschleunigungspfeil f�r K�rper 1 mit Zerlegung
    parallelogram(2,pixA*f/m2,phi+Math.PI,c);              // Beschleunigungspfeil f�r K�rper 2 mit Zerlegung
    }
  else if (n == 6) {                                       // Falls Index f�r Kraft ...
    c = colorForce;                                        // Abk�rzung f�r Farbe
    parallelogram(1,pixF*f,phi,c);                         // Kraftpfeil f�r K�rper 1 mit Zerlegung
    parallelogram(2,pixF*f,phi+Math.PI,c);                 // Kraftpfeil f�r K�rper 2 mit Zerlegung
    } 
  }
  
// Ausgabe eines Textes:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// R�ckgabewert: Waagrechte Bildschirmkoordinate (Pixel) nach dem Text
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.

function writeText (s, x, y) {
  ctx.fillText(s,x,y);                                     // Text ausgeben
  return x+ctx.measureText(s).width;                       // R�ckgabewert
  }
  
// Ausgabe eines Symbols (auch mit Index):
// Wichtig: ctx.textAlign sollte den Wert "left" haben.
// s ....... Zeichenkette; wenn '_' vorkommt, wird der Rest der Zeichenkette als Index interpretiert.
// (x,y) ... Position (Pixel)
// R�ckgabewert: Waagrechte Bildschirmkoordinate (Pixel) nach dem Symbol
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.


function writeSymbol (s, x, y) {
  var i = s.indexOf("_");                                  // Index Unterstrich oder -1
  var s1 = (i<0 ? s : s.substring(0,i));                   // Symbol ohne Index
  var s2 = (i<0 ? "" : s.substring(i+1));                  // Index oder leere Zeichenkette
  ctx.fillText(s1,x,y);                                    // Symbol ohne Index ausgeben
  x += ctx.measureText(s1).width;                          // Neue Position
  if (s2 == "") return x;                                  // Falls kein Index, abbrechen (R�ckgabewert)
  ctx.fillText(s2,x,y+4);                                  // Index ausgeben
  return x+ctx.measureText(s2).width;                      // R�ckgabewert
  }
  
// Ausgabe einer Zahl in Zehnerpotenz-Schreibweise:
// n ....... Zahl
// (x,y) ... Position (Pixel)
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.

function writeNumber (n, x, y) {
  var a = toStringExp(n,DIGITS);                           // Array (Zeichenketten f�r Mantisse und Zehnerexponent)
  x = writeText(a[0],x,y);                                 // Mantisse ausgeben
  x = writeText(" "+power10,x,y);                          // Mal 10 hoch
  x = writeText(a[1],x,y-5);                               // Zehnerexponent ausgeben
  return x;                                                // R�ckgabewert
  }

// Ausgabe einer Zahl in einfacher Schreibweise:
// n ....... Zahl
// (x,y) ... Position (Pixel) 
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.
  
function writeN (n, x, y) {
  return writeText(ToString(n,DIGITS,true),x,y);           // Zahl ausgeben, R�ckgabewert
  }
  
// Ausgabe einer Datenzeile (Zehnerpotenz-Schreibweise):
// s ....... Symbol (auch mit Index)
// n ....... Zahlenwert (kann auch positiv unendlich oder undefiniert sein)
// u ....... Einheit oder leere Zeichenkette
// (x,y) ... Position (Pixel)
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.

function writeData (s, n, u, x, y) {
  x = writeSymbol(s,x,y);                                  // Symbol, neue Position
  if (n == Number.POSITIVE_INFINITY)                       // Falls Zahl positiv unendlich ...
    writeText(" "+inf,x,y);                                // Bemerkung
  else if (n == undefined)                                 // Falls Zahl undefiniert ...
    writeText(" "+undef,x,y);                              // Bemerkung
  else {                                                   // Falls Zahl definiert und endlich ...
    x = writeText(" = ",x,y);                              // Gleichheitszeichen, neue Position
    x = writeNumber(n,x,y);                                // Zahlenwert, neue Position
    if (u != "") writeText(" "+u,x,y);                     // Einheit
    }
  }
  
// Ausgabe einer Datenzeile (einfache Schreibweise):
// s ....... Symbol (auch mit Index)
// n ....... Zahlenwert (kann auch positiv unendlich oder undefiniert sein)
// u ....... Einheit oder leere Zeichenkette
// (x,y) ... Position (Pixel)
// Wichtig: Das Attribut ctx.textAlign (Textausrichtung) sollte den Wert "left" haben.
  
function writeD (s, n, u, x, y) {
  x = writeSymbol(s,x,y);                                  // Symbol, neue Position
  if (n == Number.POSITIVE_INFINITY)                       // Falls Zahl positiv unendlich ...
    writeText(" "+inf,x,y);                                // Bemerkung
  else if (n == undefined)                                 // Falls Zahl undefiniert ...
    writeText(" "+undef,x,y);                              // Bemerkung
  else {                                                   // Falls Zahl definiert und endlich ...
    x = writeText(" = ",x,y);                              // Gleichheitszeichen, neue Position
    x = writeN(n,x,y);                                     // Zahlenwert, neue Position
    if (u == "") return;                                   // Falls keine Einheit, abbrechen
    var sp = (u == degree ? "" : " ");                     // Leerzeichen, au�er bei Grad
    writeText(sp+u,x,y);                                   // Einheit
    }                                       
  } 
  
// Ausgabe der Bahndaten:
  
function dataOrbit () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(text11,x1,20);                              // Erkl�render Text (Bahntyp)
  ctx.fillStyle = "#ff0000";                               // Schriftfarbe
  ctx.fillText(text12[type],x2,40);                        // Bahntyp
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (type == 0) return;                                   // Falls freier Fall, abbrechen
  ctx.fillText(text13[type-1],x1,60);                      // Erkl�render Text (z.B. gro�e Halbachsen)
  if (type >= 1 && type <= 3) {                            // Falls Ellipse ...
    var sy1 = (type != 2 ? symbolAE1 : symbolR1);          // Symbol f�r K�rper 1
    writeData(sy1,a*m2Rel,meter,x2,80);                    // Gro�e Halbachse bzw. Radius f�r K�rper 1
    var sy2 = (type != 2 ? symbolAE2 : symbolR2);          // Symbol f�r K�rper 2
    writeData(sy2,a*m1Rel,meter,x2,100);                   // Gro�e Halbachse bzw. Radius f�r K�rper 2
    }
  else if (type == 4) {                                    // Falls Parabel ...
    writeData(symbolHP1,hp*m2Rel,meter,x2,80);             // Halbparameter f�r K�rper 1
    writeData(symbolHP2,hp*m1Rel,meter,x2,100);            // Halbparameter f�r K�rper 2
    }
  else if (type == 5) {                                    // Falls Hyperbel ...
    writeData(symbolAH1,Math.abs(a*m2Rel),meter,x2,80);    // Reelle Halbachse f�r K�rper 1
    writeData(symbolAH2,Math.abs(a*m1Rel),meter,x2,100);   // Reelle Halbachse f�r K�rper 2
    }
  ctx.fillText(text14,x1,120);                             // Erkl�render Text (numerische Exzentrizit�t)
  writeD(symbolEpsilon,eps,"",x2,140);                     // Numerische Exzentrizit�t
  }
  
// Hilfsroutine: Zerlegung eines Radiusvektors in x- und y-Komponente (zwei Zeilen)
// sX ... Symbol f�r x-Komponente
// sY ... Symbol f�r y-Komponente
// v .... Betrag des Radiusvektors mit Vorzeichen
// y .... Senkrechte Bildschirmkoordinate der oberen Zeile (Pixel)

function dataPositionXY (sX, sY, v, y) {
  var compX = v*cos, compY = v*sin;                        // Komponenten in x- und y-Richtung
  if (Math.abs(compY) < Math.abs(v)*1e-8) compY = 0;       // Eventuell Korrektur von Rundungsfehlern
  writeData(sX,compX,meter,X_DATA+20,y);                   // Komponente in x-Richtung ausgeben
  writeData(sY,compY,meter,X_DATA+20,y+20);                // Komponente in y-Richtung ausgeben
  }
  
// Ausgabe der Positionsdaten:

function dataPosition () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text21,x1,20);                              // Erkl�render Text (Positionswinkel)
  var d2 = phi/DEG;                                        // Positionswinkel f�r K�rper 2 (Grad)
  if (d2 > 359.99999) d2 = 0;                              // Korrektur eines m�glichen Rundungsfehlers
  var d1 = d2+180;                                         // Positionswinkel f�r K�rper 1 (Grad)
  if (d1 >= 360) d1 -= 360;                                // Winkel unter 360� erzwingen
  writeD(symbolPhi1,d1,degree,x2,40);                      // Positionswinkel f�r K�rper 1
  writeD(symbolPhi2,d2,degree,x2,60);                      // Positionswinkel f�r K�rper 2
  ctx.fillText(text22,x1,80);                              // Erkl�render Text (Koordinaten)
  var r1 = r*m2Rel, r2 = r*m1Rel;                          // Radien f�r beide K�rper (m)
  dataPositionXY(symbolX1,symbolY1,-r1,100);               // Koordinaten von K�rper 1 ausgeben
  dataPositionXY(symbolX2,symbolY2,r2,140);                // Koordinaten von K�rper 2 ausgeben
  }
  
// Ausgabe der Abstandsdaten:

function dataDistance () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text31,x1,20);                              // Erkl�render Text (Abstand)
  writeData(symbolD,r,meter,x2,40);                        // Abstand ausgeben
  ctx.fillText(text102,x1,60);                             // Erkl�render Text (minimaler Wert)
  writeData(symbolDMin,minimalDistance(),meter,x2,80);     // Minimalen Abstand ausgeben
  ctx.fillText(text103,x1,100);                            // Erkl�render Text (maximaler Wert)
  writeData(symbolDMax,maximalDistance(),meter,x2,120);    // Maximalen Abstand ausgeben
  }
  
// Hilfsroutine: Zerlegung eines Geschwindigkeitsvektors in x- und y-Komponente (zwei Zeilen)
// sX ... Symbol f�r x-Komponente
// sY ... Symbol f�r y-Komponente
// v .... Betrag des Geschwindigkeitsvektors mit Vorzeichen
// y .... Senkrechte Bildschirmkoordinate der oberen Zeile (Pixel)

function dataVelocityXY (sX, sY, v, y) {
  var compX = v*cosV, compY = v*sinV;                      // Komponenten in x- und y-Richtung (m/s)
  if (Math.abs(compX) < Math.abs(v)*1e-8) compX = 0;       // Eventuell Korrektur eines Rundungsfehlers
  writeData(sX,compX,meterPerSecond,X_DATA+20,y);          // Komponente in x-Richtung ausgeben
  writeData(sY,compY,meterPerSecond,X_DATA+20,y+20);       // Komponente in y-Richtung ausgeben
  }
  
// Ausgabe der Geschwindigkeitsdaten:

function dataVelocity () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text41,x1,20);                              // Erkl�render Text (Geschwindigkeitsbetr�ge)
  var v1 = v*m2Rel, v2 = v*m1Rel;                          // Geschwindigkeitsbetr�ge der beiden K�rper (m/s)
  var u = meterPerSecond;                                  // Abk�rzung f�r m/s
  writeData(symbolV1,v1,u,x2,40);                          // Geschwindigkeit von K�rper 1 ausgeben
  writeData(symbolV2,v2,u,x2,60);                          // Geschwindigkeit von K�rper 2 ausgeben
  if (type == 0) return;                                   // Falls freier Fall, abbrechen
  ctx.fillText(text104,x1,80);                             // Erkl�render Text (minimale Werte)
  var vMin = minimalVelocity();                            // Minimale Geschwindigkeit (Eink�rperproblem, m/s)
  writeData(symbolV1Min,vMin*m2Rel,u,x2,100);              // Minimale Geschwindigkeit von K�rper 1 ausgeben
  writeData(symbolV2Min,vMin*m1Rel,u,x2,120);              // Minimale Geschwindigkeit von K�rper 2 ausgeben
  ctx.fillText(text105,x1,140);                            // Erkl�render Text (maximale Werte)
  var vMax = maximalVelocity();                            // Maximale Geschwindigkeit (Eink�rperproblem, m/s)
  writeData(symbolV1Max,vMax*m2Rel,u,x2,160);              // Maximale Geschwindigkeit von K�rper 1 ausgeben
  writeData(symbolV2Max,vMax*m1Rel,u,x2,180);              // Maximale Geschwindigkeit von K�rper 2 ausgeben  
  ctx.fillText(text42,x1,y0+80);                           // Erkl�render Text (Geschwindigkeitskomponenten)
  dataVelocityXY(symbolV1x,symbolV1y,-v1,y0+100);          // Geschwindigkeitskomponenten von K�rper 1 ausgeben
  dataVelocityXY(symbolV2x,symbolV2y,v2,y0+140);           // Geschwindigkeitskomponenten von K�rper 2 ausgeben
  }
  
// Hilfsroutine f�r Zerlegung in tangentiale und radiale Komponente (zwei Zeilen):
// sT ... Symbol f�r tangentiale Komponente
// sR ... Symbol f�r radiale Komponente
// v .... Betrag des Vektors
// u .... Einheit
// y .... Senkrechte Bildschirmkoordinate der oberen Zeile (Pixel)

function dataTangRad (sT, sR, v, u, y) {
  var compT = v*cosT, compR = v*cosR;                      // Tangentiale und radiale Komponente
  if (compT < v*1e-8) compT = 0;                           // Eventuell Korrektur von Rundungsfehlern
  writeData(sT,compT,u,X_DATA+20,y);                       // Tangentiale Komponente ausgeben 
  writeData(sR,compR,u,X_DATA+20,y+20);                    // Radiale Komponente ausgeben
  }
  
// Ausgabe der Beschleunigungsdaten:

function dataAcceleration () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate
  ctx.fillText(text51,x1,20);                              // Erkl�render Text (Beschleunigungsbetr�ge)
  var a1 = f/m1, a2 = f/m2;                                // Beschleunigungsbetr�ge der beiden K�rper (m/s�)
  var u = meterPerSecond2;                                 // Abk�rzung f�r m/s�
  writeData(symbolA1,a1,u,x2,40);                          // Beschleunigung von K�rper 1 ausgeben
  writeData(symbolA2,a2,u,x2,60);                          // Beschleunigung von K�rper 2 ausgeben
  if (type == 0) return;                                   // Falls freier Fall, abbrechen
  ctx.fillText(text104,x1,80);                             // Erkl�render Text (minimale Werte)
  var fMin = minimalForce();                               // Minimale Kraft
  writeData(symbolA1Min,fMin/m1,u,x2,100);                 // Minimale Beschleunigung von K�rper 1 ausgeben
  writeData(symbolA2Min,fMin/m2,u,x2,120);                 // Minimale Beschleunigung von K�rper 2 ausgeben
  ctx.fillText(text105,x1,140);                            // Erkl�render Text (maximale Werte)
  var fMax = maximalForce();                               // Maximale Kraft
  writeData(symbolA1Max,fMax/m1,u,x2,160);                 // Maximale Beschleunigung von K�rper 1 ausgeben
  writeData(symbolA2Max,fMax/m2,u,x2,180);                 // Maximale Beschleunigung von K�rper 2 ausgeben
  ctx.fillText(text52,x1,y0+80);                           // Erkl�render Text (Beschleunigungskomponenten)  
  dataTangRad(symbolA1Tang,symbolA1Rad,a1,u,y0+100);       // Tangentiale und radiale Komponente f�r K�rper 1 ausgeben
  dataTangRad(symbolA2Tang,symbolA2Rad,a2,u,y0+140);       // Tangentiale und radiale Komponente f�r K�rper 2 ausgeben
  }

// Ausgabe der Kraftdaten:

function dataForce () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text61,x1,20);                              // Erkl�render Text (Kraftbetr�ge)
  writeData(symbolF1,f,newton,x2,40);                      // Kraft auf K�rper 1 ausgeben
  writeData(symbolF2,f,newton,x2,60);                      // Kraft auf K�rper 2 ausgeben
  if (type == 0) return;                                   // Falls freier Fall, abbrechen
  ctx.fillText(text102,x1,80);                             // Erkl�render Text (minimaler Wert)
  writeData(symbolFMin,minimalForce(),newton,x2,100);      // Minimale Kraft ausgeben
  ctx.fillText(text103,x1,120);                            // Erkl�render Text (maximaler Wert)
  writeData(symbolFMax,maximalForce(),newton,x2,140);      // Maximale Kraft ausgeben
  ctx.fillText(text62,x1,y0+80);                           // Erkl�render Text (Kraftkomponenten)
  dataTangRad(symbolF1Tang,symbolF1Rad,f,newton,y0+100);   // Tangentiale und radiale Komponente f�r K�rper 1 ausgeben
  dataTangRad(symbolF2Tang,symbolF2Rad,f,newton,y0+140);   // Tangentiale und radiale Komponente f�r K�rper 2 ausgeben
  }
  
// Ausgabe der Energiedaten:

function dataEnergy () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text71,x1,20);                              // Erkl�render Text (Gesamtenergie)
  writeData(symbolEnergy,energy,joule,x2,40);              // Gesamtenergie (J) ausgeben
  if (type == 0 && t > 0 && v == 0) return;                // Falls freier Fall beendet, abbrechen
  ctx.fillText(text72,x1,60);                              // Erkl�render Text (potentielle Energie)
  var eP = -G*m1*m2/r;                                     // Potentielle Energie (J)
  writeData(symbolEnergyPot,eP,joule,x2,80);               // Potentielle Energie ausgeben
  ctx.fillText(text73,x1,100);                             // Erkl�render Text (kinetische Energie)
  var v1 = m2Rel*v, v2 = m1Rel*v;                          // Geschwindigkeitsbetr�ge (m/s)
  var e1K = m1*v1*v1/2, e2K = m2*v2*v2/2;                  // Kinetische Energie f�r beide K�rper (J)
  writeData(symbolEnergy1Kin,e1K,joule,x2,120);            // Kinetische Energie von K�rper 1 ausgeben
  writeData(symbolEnergy2Kin,e2K,joule,x2,140);            // Kinetische Energie von K�rper 2 ausgeben
  
  //writeData("E'",eP+e1K+e2K,joule,x1-100,40); // !!! Kontrolle
  //control(eP+e1K+e2K,energy);
  }
  
// Ausgabe der Drehimpulsdaten:

function dataAngularMomentum () {
  var x1 = X_DATA, x2 = x1+20;                             // Waagrechte Bildschirmkoordinate (Pixel)
  ctx.fillText(text81,x1,20);                              // Erkl�render Text (Gesamtdrehimpuls)
  var u = kilogramMeter2PerSecond;                         // Abk�rzung f�r Einheit
  writeData(symbolAngMom,angMom,u,x2,40);                  // Gesamtdrehimpuls ausgeben
  ctx.fillText(text82,x1,60);                              // Erkl�render Text (einzelne Drehimpulse)
  var am1 = m2Rel*m2Rel*r*v*m1*cosR;                       // Drehimpuls von K�rper 1 (SI-Einheit)
  writeData(symbolAngMom1,am1,u,x2,80);                    // Drehimpuls von K�rper 1 ausgeben
  var am2 = m1Rel*m1Rel*r*v*m2*cosR;                       // Drehimpuls von K�rper 2 (SI-Einheit)
  writeData(symbolAngMom2,am2,u,x2,100);                   // Drehimpuls von K�rper 2 ausgeben
  
  //writeData("L'",am1+am2,u,x1-150,40); // !!! Kontrolle
  //control(am1+am2,angMom);
  }
  
// Zeitangabe in zwei Zeilen:
// 1. Zeile: Symbol, Gleichheitszeichen, Zeit in Sekunden (Zehnerpotenz-Schreibweise)
// 2. Zeile: Gleichheitszeichen, Zeit in sinnvoller Einheit
// s ....... Symbol
// t ....... Zeit (s)
// (x,y) ... Position (Pixel)
  
function writeTime (s, t, x, y) {
  writeData(s,t,second,x,y);                               // Zeit in s (Zehnerpotenz-Schreibweise)
  if (t == undefined) return;                              // Falls Zeit undefiniert, abbrechen
  var xx = x+ctx.measureText(s).width;                     // Position des Gleichheitszeichens (Pixel)
  if (t < 60) {writeD("",t,second,xx,y+20); return;}       // Gegebenenfalls Angabe in s (einfache Schreibweise)
  t /= 60;                                                 // Zeit in min
  if (t < 60) {writeD("",t,minute,xx,y+20); return;}       // Gegebenenfalls Angabe in min (einfache Schreibweise)
  t /= 60;                                                 // Zeit in h
  if (t < 24) {writeD("",t,hour,xx,y+20); return;}         // Gegebenenfalls Angabe in h (einfache Schreibweise)
  t /= 24;                                                 // Zeit in d
  if (t < 365.25) {writeD("",t,day,xx,y+20); return;}      // Gegebenenfalls Angabe in d (einfache Schreibweise)
  t /= 365.25;                                             // Zeit in a
  writeD("",t,year,xx,y+20);                               // Gegebenenfalls Angabe in a (einfache Schreibweise)
  }
  
// Ausgabe der Umlaufdauer:

function dataPeriod () {
  ctx.fillText(text91,X_DATA,20);                         // Erkl�render Text (Umlaufdauer)
  writeTime(symbolPeriod,period,X_DATA+20,40);            // Umlaufdauer ausgeben (zwei Zeilen)
  }
  
// Ausgabe von Daten:

function outputData () {
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  switch (ch.selectedIndex) {                              // Je nach ausgew�hltem Eintrag ...
    case 1: dataOrbit(); break;                            // Bahndaten
    case 2: dataPosition(); break;                         // Position
    case 3: dataDistance(); break;                         // Abstand
    case 4: dataVelocity(); break;                         // Geschwindigkeit
    case 5: dataAcceleration(); break;                     // Beschleunigung
    case 6: dataForce(); break;                            // Kraft
    case 7: dataEnergy(); break;                           // Energie
    case 8: dataAngularMomentum(); break;                  // Drehimpuls
    case 9: dataPeriod(); break;                           // Umlaufdauer
    }
  }
  
// Zu Testzwecken:
/*  
function control (n1, n2) {
  var max = Math.max(Math.abs(n1),Math.abs(n2));
  var diff = Math.abs(n1-n2);
  if (diff/max > 1e-5) alert("Abweichung!\n"+n1+"\n"+n2);
  }*/
  
// Gleichbleibender Teil der Zeichnung (wird zun�chst nur gespeichert):

function paintFix () {
  ctxFix.fillStyle = colorBackground;                        // Hintergrundfarbe
  ctxFix.fillRect(0,0,width,height);                         // Hintergrund ausf�llen
  axes();                                                    // Koordinatensystem
  orbit(1);                                                  // Bahn von K�rper 1
  orbit(2);                                                  // Bahn von K�rper 2
  comparison(pix,meter,20,460,"#000000",false);              // Vergleichslinie L�nge
  var p, u, c;                                               // Umrechnungsfaktor, Einheit, Farbe
  var n = ch.selectedIndex;                                  // Ausgew�hlter Index (Auswahlfeld)
  if (n == 4)                                                // Falls Index f�r Geschwindigkeit ...
    {p = pixV; u = meterPerSecond; c = colorVelocity;}       // Parameterwerte f�r Vergleichspfeil
  else if (n == 5)                                           // Falls Index f�r Beschleunigung ...
    {p = pixA; u = meterPerSecond2; c = colorAcceleration;}  // Parameterwerte f�r Vergleichspfeil
  else if (n == 6)                                           // Falls Index f�r Kraft ...
    {p = pixF; u = newton; c = colorForce;}                  // Parameterwerte f�r Vergleichspfeil
  else return;                                               // Falls anderer Index, abbrechen
  comparison(p,u,340,460,c,true);                            // Vergleichspfeil
  }
          
// Grafikausgabe: 
// Seiteneffekt t, t0, tReal, phi, cos, sin, r, v, phiV, cosV, sinV, f, cosT, cosR
  
function paint () {
  ctx.drawImage(canvasFix,0,0);                            // Gespeicherte Zeichnung �bertragen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // L�nge des Zeitintervalls (s)
    if (cbSlow.checked) dt /= 10;                          // Falls Zeitlupe, Zeitintervall durch 10 dividieren
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  calculationT();                                          // Zeitabh�ngige Berechnungen
  bodies();                                                // K�rper
  arrows();                                                // Pfeile f�r Vektoren
  outputData();                                            // Ausgabe von Daten
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillText(text101,20,20);                             // Erkl�render Text (Zeit)
  var tMov = (type != 1 ? tReal : tReal-period/2);         // Zeit seit Start (s)
  writeTime(symbolTime,tMov,20,40);                        // Zeitangabe (zwei Zeilen)
  if (t == 0) {                                            // Falls Zustand vor dem Start ...
    ctx.textAlign = "right";                               // Textausrichtung
    ctx.fillText(body1,x0-pix*m2Rel*r0-6,y0-6);            // Beschriftung K�rper 1
    ctx.textAlign = "left";                                // Textausrichtung
    ctx.fillText(body2,x0+pix*m1Rel*r0+5,y0+15);           // Beschriftung K�rper 2
    if (ch.selectedIndex == 4) return;                     // Falls Geschwindigkeit ausgew�hlt, abbrechen
    arrowBody(1,pixV*m2*v20/m1,3*Math.PI/2,colorVelocity); // Pfeil f�r Anfangsgeschwindigkeit von K�rper 1
    arrowBody(2,pixV*v20,Math.PI/2,colorVelocity);         // Pfeil f�r Anfangsgeschwindigkeit von K�rper 2
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen





