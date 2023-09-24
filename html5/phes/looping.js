// Modell einer Loopingbahn
// 28.02.2019 - 12.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel looping_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorClock1 = "#808080";                               // Farbe der Digitaluhr (au�en)
var colorClock2 = "#000000";                               // Hintergrundfarbe der Anzeige
var colorClock3 = "#ff0000";                               // Farbe der Ziffern
var colorVelocity = "#ff00ff";                             // Farbe f�r Geschwindigkeit
var colorForce = "#008000";                                // Farbe f�r Einzelkr�fte
var colorTotalForce = "#000000";                           // Farbe f�r Gesamtkraft
var colorBall = "#ffffff";                                 // Farbe der rollenden Kugel
var colorGround = "#c0c0ff";                               // Farbe der Schiene

// Sonstige Konstanten:

var N = 100;                                               // Zahl der Teilintervalle (Zeit)
var IT = 10;                                               // Zahl der Iterationen (f�r Romberg-Verfahren)
var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz
var MX = 280, MY = 160;                                    // Kreismittelpunkt (Pixel)
var R = 5;                                                 // Radius der Kugel (Pixel)
var RR = 15;                                               // Kugelradius plus Schienendicke (Pixel)
var PIX = 100;                                             // Umrechnungsfaktor (Pixel pro m)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe (Reset, Start/Pause/Weiter)
var rb1, rb2;                                              // Radiobuttons (Zeitlupe)
var ip1, ip2, ip3, ip4;                                    // Eingabefelder
var cbV;                                                   // Optionsfeld (Geschwindigkeitsvektor)
var rb3, rb4;                                              // Radiobuttons (Einzelkr�fte)
var cbF;                                                   // Optionsfeld (Gesamtkraft)

var on;                                                    // Flag f�r Bewegung
var t0;                                                    // Anfangszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var r;                                                     // Radius (m)
var g;                                                     // Fallbeschleunigung (m/s�)
var h0;                                                    // Ausgangsh�he (m), bezogen auf tiefsten Punkt der Kreisbahn
var d;                                                     // Abstand des Anfangspunkt vom Lot durch den Kugelmittelpunkt (m)
var type;                                                  // Bewegungstyp (1, 2 oder 3)
var ax1, ay1;                                              // Beschleunigungskomponenten f�r Anlauf (m/s�)
var bx, by;                                                // Koordinaten Ber�hrpunkt (m)
var psi;                                                   // Neigungswinkel Anlauf (Bogenma�)
var sinPsi, cosPsi;                                        // Trigonometrische Werte f�r Neigungswinkel (Anlauf)
var arrayT;                                                // Array f�r Zeit (s)
var arrayPhi;                                              // Array f�r Positionswinkel (Bogenma�)
var tMax;                                                  // Maximum Zeitvariable (s)
var phiMax;                                                // Maximum Positionswinkel (Bogenma�)
var phi;                                                   // Positionswinkel Kreisbahn (Bogenma�)
var sinPhi, cosPhi;                                        // Trigonometrische Werte f�r Positionswinkel (Kreisbahn)
var x3, y3;                                                // Koordinaten beim Abheben (m)
var vx3, vy3;                                              // Geschwindigkeitskomponenten beim Abheben (m/s)
var x, y;                                                  // Koordinaten bez�glich Kreismittelpunkt (m)
var xPix, yPix;                                            // Bildschirmkoordinaten (Pixel)
var v;                                                     // Geschwindigkeit (m/s)
var aRad;                                                  // Betrag der Radialbeschleunigung (m/s�)
var aTang;                                                 // Betrag der Tangentialbeschleunigung (m/s�)
var aN;                                                    // Betrag der Normalbeschleunigung (m/s�)
var axPix, ayPix;                                          // Komponenten der Gesamtbeschleunigung (Pixel)
var per;                                                   // Periode (s) f�r Bewegungstyp 1
var t01;                                                   // Zeitpunkt f�r Beginn der Kreisbewegung (s)
var t02;                                                   // Zeitpunkt f�r Durchlaufen des tiefsten Punkts (s)
var t03;                                                   // Zeitpunkt f�r Abheben (s) oder Beginn Auslauf (s)
var pixV;                                                  // Umrechnungsfaktor (Pixel pro m/s)
var pixA;                                                  // Umrechnungsfaktor (Pixel pro m/s�)

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
  bu1 = getElement("bu1",text01);                          // Resetknopf
  bu2 = getElement("bu2",text02[0]);                       // Startknopf
  bu2.state = 0;                                           // Anfangszustand (vor Start der Animation)
  rb1 = getElement("rb1");                                 // Radiobutton (schwache Zeitlupe)
  rb1.checked = true;                                      // Radiobutton zun�chst eingeschaltet
  getElement("lb1",text03);                                // Erk�render Text (schwache Zeitlupe)
  rb2 = getElement("rb2");                                 // Radiobutton (starke Zeitlupe)
  rb2.checked = false;                                     // Radiobutton zun�chst ausgeschaltet
  getElement("lb2",text04);                                // Erkl�render Text (starke Zeitlupe)
  getElement("ip1a",text05);                               // Erkl�render Text (Radius)
  ip1 = getElement("ip1b");                                // Eingabefeld (Radius)
  getElement("ip1c",meter);                                // Einheit (Radius)
  getElement("ip2a",text06);                               // Erkl�render Text (Ausgangsh�he)
  ip2 = getElement("ip2b");                                // Eingabefeld (Ausgangsh�he)
  getElement("ip2c",meter);                                // Einheit (Ausgangsh�he)
  var ip3x = getElement("ip3x");                           // Zus�tzliche Zeile (Fallbeschleunigung)
  if (ip3x) ip3x.innerHTML = text06x;                      // Erkl�render Test (Fallbeschleunigung, zus�tzliche Zeile)
  getElement("ip3a",text07);                               // Erkl�render Text (Fallbeschleunigung)
  ip3 = getElement("ip3b");                                // Eingabefeld (Fallbeschleunigung)
  getElement("ip3c",meterPerSecond2);                      // Einheit (Fallbeschleunigung)
  getElement("ip4a",text08);                               // Erkl�render Text (Masse)
  ip4 = getElement("ip4b");                                // Eingabefeld (Masse)
  getElement("ip4c",kilogram);                             // Einheit (Masse)
  cbV = getElement("cbV");                                 // Optionsfeld (Geschwindigkeitsvektor)
  cbV.checked = false;                                     // Optionsfeld zun�chst ausgeschaltet
  getElement("lbV",text09);                                // Erkl�render Text (Geschwindigkeitsvektor)
  rb3 = getElement("rb3");                                 // Radiobutton (Gewichtskraft, Kontaktkraft)
  rb3.checked = true;                                      // Radiobutton zun�chst eingeschaltet
  getElement("lb3",text10);                                // Erkl�render Text (Gewichtskraft, Kontaktkraft)
  rb4 = getElement("rb4");                                 // Radiobutton (Tangentialkraft, Radialkraft)
  rb4.checked = false;                                     // Radiobutton zun�chst ausgeschaltet
  getElement("lb4",text11);                                // Erkl�render Text (Tangentialkraft, Radialkraft)
  cbF = getElement("cbF");                                 // Optionsfeld (Gesamtkraft)
  cbF.checked = false;                                     // Optionsfeld zun�chst ausgeschaltet
  getElement("lbF",text12);                                // Erkl�render Text (Gesamtkraft)  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer

  r = 0.5;                                                 // Startwert Radius (m)
  g = 9.81;                                                // Startwert Fallbeschleunigung (m/s�)
  m = 1;                                                   // Startwert Masse (kg)
  h0 = 0.8;                                                // Starth�he (m)
  d = 2;                                                   // Abstand (m)
  arrayT = Array(N+1);                                     // Array f�r Zeitpunkte
  arrayPhi = Array(N+1);                                   // Array f�r Positionswinkel
  updateInput();                                           // Eingabefelder aktualisieren 
  calculation();                                           // Berechnungen (Seiteneffekt!)
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
    
  on = false;                                              // Animation zun�chst abgeschaltet
  t = 0;                                                   // Aktuelle Zeit (s)
  t0 = new Date();                                         // Anfangszeitpunkt
  setInterval(paint,40);                                   // Timer-Intervall 0,040 s
  
  bu1.onclick = reactionReset;                             // Reaktion auf Resetknopf
  bu2.onclick = reactionStart;                             // Reaktion auf Startknopf
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Radius)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Ausgangsh�he)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Fallbeschleunigung) 
  ip4.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Masse)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabe Radius)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabe Ausgangsh�he)
  ip3.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabe Fallbeschleunigung)
  ip4.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Eingabe Masse)
   
  } // Ende der Methode start
  
// Zustandsfestlegung f�r Schaltknopf Start/Pause/Weiter:
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text02[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text �ndern
  }
  
// Aktivierung bzw. Deaktivierung der Eingabefelder:
// p ... Flag f�r m�gliche Eingabe

function enableInput (p) {
  ip1.readOnly = !p;                                       // Eingabefeld Radius
  ip2.readOnly = !p;                                       // Eingabefeld Ausgangsh�he
  ip3.readOnly = !p;                                       // Eingabefeld Fallbeschleunigung
  ip4.readOnly = !p;                                       // Eingabefeld Masse
  }
  
// Hilfsroutine: Eingabe �bernehmen, rechnen, neu zeichnen
// Seiteneffekt r, h0, g, m, type, per, phiMax, tMax, arrayT, arrayPhi, bx, by, psi, sinPsi, cosPsi, ax1, ay1, 
// t01, t02, t03, x3, y3, vx3, vy3, pixV, pixA, t, t0, phi, sinPhi, cosPhi, x, y, xPix, yPix, v, aRad, aN, aTang

function reaction () {
  input();                                                 // Eingegebene Werte �bernehmen (eventuell korrigiert)
  calculation();                                           // Berechnungen
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Resetknopf:
// Wirkung auf anderen Schaltknopf und Eingabefelder, Seiteneffekt t, on, r, h0, g, m, type, per, phiMax, tMax, 
// arrayT, arrayPhi, bx, by, psi, sinPsi, cosPsi, ax1, ay1, t01, t02, t03, x3, y3, vx3, vy3, pixV, pixA, t0, 
// phi, sinPhi, cosPhi, x, y, xPix, yPix, v, aRad, aN, aTang
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  enableInput(true);                                       // Eingabefelder aktivieren
  t = 0;                                                   // Zeitvariable zur�cksetzen
  on = false;                                              // Animation abgeschaltet
  reaction();                                              // Eingegebene Werte �bernehmen, rechnen, neu zeichnen
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Wirkung auf Schaltknopf und Eingabefelder, Seiteneffekt r, h0, g, m

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs �ndern
  reaction();                                              // Eingabe, Rechnung, neu zeichnen
  enableInput(false);                                      // Eingabefelder deaktivieren
  if (bu2.state == 1) startAnimation();                    // Animation entweder starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder unterbrechen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt r, h0, g, m, type, per, phiMax, tMax, arrayT, arrayPhi, bx, by, psi, sinPsi, cosPsi, ax1, ay1, 
// t01, t02, t03, x3, y3, vx3, vy3, pixV, pixA, t, t0, phi, sinPhi, cosPhi, x, y, xPix, yPix, v, aRad, aN, aTang
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  reaction();                                              // Daten �bernehmen, rechnen, neu zeichnen
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

// Integrand des Integrals, mit dem die Zeit zu einem Positionswinkel berechnet wird:

function wert (x) {
  return r/Math.sqrt(2*g*(h0-r+r*Math.cos(x)));            // R�ckgabewert
  }

// Simpson-N�herung f�r ein bestimmtes Integral
// a ... Untere Grenze
// b ... Obere Grenze
// n ... Zahl der Teilintervalle (gerade nat�rliche Zahl)
  
function simpson (a, b, n) {
  var h = (b-a)/n;                                         // Breite eines Teilintervalls
  var s = wert(a)+wert(b);                                 // Summe f(a) + f(b)
  for (var i=1; i<n; i+=2)                                 // F�r alle ungeraden Indizes ...
    s += 4*wert(a+i*h);                                    // Vervierfachte Funktionswerte addieren
  for (i=2; i<n; i+=2)                                     // F�r alle geraden Indizes ...
    s += 2*wert(a+i*h);                                    // Verdoppelte Funktionswerte addieren
  return s*h/3;                                            // R�ckgabewert 	
  }
    
// Romberg-N�herung f�r ein bestimmtes Integral
// Simpsonmethode, Konvergenzbeschleunigung mit Romberg-Verfahren
// a ... Untere Grenze
// b ... Obere Grenze
    
function integral (a, b) {
  var n = 2;                                               // Variable f�r Zahl der Teilintervalle
  var t = new Array(12);                                   // Array f�r Zwischenergebnisse              
  for (var k=0; k<=IT; k++) {                              // F�r alle Iterationen ...
    n *= 2;                                                // Zahl der Teilintervalle verdoppeln
    t[k] = simpson(a,b,n);                                 // Simpson-N�herung speichern
    var q = 1;
    for (var i=k-1; i>=0; i--) {
      q *= 4;
      t[i] = t[i+1]+(t[i+1]-t[i])/(q-1);
      }
    } // Ende for k
  return t[0];                                             // R�ckgabewert
  }

// Berechnungen (zeitunabh�ngige Gr��en):
// Seiteneffekt type, per, phiMax, tMax, arrayT, arrayPhi, bx, by, psi, sinPsi, cosPsi, ax1, ay1, t01, t02, t03, 
// x3, y3, vx3, vy3, pixV, pixA

function calculation () {
  if (h0 <= r) type = 1;                                   // Periodische Schwingung in der unteren H�lfte
  else if (h0 < 5*r/2) type = 2;                           // Bewegung mit Abheben
  else type = 3;                                           // Bewegung mit �berschlag und Auslauf
  if (type == 1) {                                         // Falls Bewegungstyp 1 ...
    phiMax = Math.acos((r-h0)/r);                          // Positionswinkel Umkehrpunkt (Bogenma�)
    per = period(phiMax);                                  // Periode der Schwingung (s)
    if (phiMax == 0) per = 0;                              // Sonderfall Nullschwingung
    tMax = per/4;                                          // Zeit zwischen tiefstem Punkt und Umkehrpunkt (s)
    }
  else if (type == 2) {                                    // Falls Bewegungstyp 2 ...
    phiMax = Math.acos(2*(r-h0)/(3*r));                    // Positionswinkel beim Abheben (Bogenma�)
    tMax = integral(0,phiMax);                             // Zeit zwischen tiefstem Punkt und Abheben (s)
    }
  else if (type == 3) {                                    // Falls Bewegungstyp 3 ...
    phiMax = Math.PI;                                      // Positionswinkel f�r h�chsten Punkt (Bogenma�)
    tMax = integral(0,phiMax);                             // Zeit zwischen tiefstem und h�chstem Punkt (s)
    }
  arrayT[0] = 0; arrayPhi[0] = 0;                          // Arrayelemente f�r tiefsten Punkt
  for (var i=1; i<=N; i++) {                               // F�r alle Indizes ...
    var w = i*phiMax/N;                                    // Positionswinkel (Bogenma�)
    arrayPhi[i] = w;                                       // Arrayelement f�r Positionswinkel (Bogenma�) 
    arrayT[i] = integral(0,w);                             // Arrayelement f�r Zeit (s)
    }
  arrayT[N] = tMax; arrayPhi[N] = phiMax;                  // Korrektur f�r letzte Arrayelemente
  var ux = -d, uy = h0-r;                                  // Verbindungsvektor Mittelpunkt - Startpunkt (m)
  var c = Math.sqrt(ux*ux+uy*uy);                          // Abstand Mittelpunkt - Startpunkt (m)
  var r2 = Math.sqrt(c*c-r*r);                             // Abstand Startpunkt - Ber�hrpunkt (m)
  var p = (c*c+r2*r2-r*r)/(2*c);                           // Hilfsgr��e (m)
  var h = Math.sqrt(r2*r2-p*p);                            // Hilfsgr��e (m)
  var sx = ux-(p/c)*ux, sy = uy-(p/c)*uy;                  // Mittelpunkt der Ber�hrpunkte (m)
  bx = sx+(h/c)*(-uy); by = sy+(h/c)*ux;                   // Koordinaten Ber�hrpunkt (m)
  sinPsi = -bx/r;                                          // Sinus des Neigungswinkels
  psi = Math.asin(sinPsi);                                 // Neigungswinkel Anlauf (Bogenma�)
  cosPsi = Math.cos(psi);                                  // Cosinus des Neigungswinkels
  ax1 = g*sinPsi*cosPsi; ay1 = -g*sinPsi*sinPsi            // Beschleunigungskomponenten (m/s�)
  var dx = bx+d, dy = by-h0+r;                             // Verbindungsvektor Startpunkt - Ber�hrpunkt (m)
  var d2 = Math.sqrt(dx*dx+dy*dy);                         // Abstand Startpunkt - Ber�hrpunkt (m)
  if (type == 1) {                                         // Falls Bewegungstyp 1 (periodische Schwingung) ...
    t01 = 0;                                               // Zeit f�r Anlauf entf�llt
    t02 = per/4;                                           // Zeitpunkt f�r Durchlaufen des tiefsten Punkts (s)
    t03 = Number.POSITIVE_INFINITY;                        // Kein Ende der Schwingung
    }
  else {                                                   // Falls Bewegungstyp 2 oder 3 ...
    t01 = Math.sqrt(2*d2/(g*sinPsi));                      // Beginn der Kreisbewegung (s)
    t02 = t01+integral(0,psi);                             // Zeitpunkt f�r Durchlaufen des tiefsten Punkts (s)
    t03 = (type==2 ? t02+tMax : t02+2*tMax);               // Zeitpunkt f�r Abheben oder Anfang des Auslaufs (s)
    }
  if (type == 2) {                                         // Falls Bewegungstyp 2 (mit Abheben) ...
    var sin = Math.sin(phiMax), cos = Math.cos(phiMax);    // Trigonometrische Werte
    x3 = r*sin; y3 = -r*cos;                               // Koordinaten beim Abheben (m) 
    var v3 = Math.sqrt(2*g*(h0-r+r*cos));                  // Geschwindigkeitsbetrag beim Abheben (m/s)
    vx3 = v3*cos; vy3 = v3*sin;                            // Geschwindigkeitskomponenten beim Abheben (m/s)                          
    }
  var vMax = Math.sqrt(2*g*h0);                            // Maximale Geschwindigkeit (m/s)
  pixV = 100/vMax;                                         // Umrechnungsfaktor (100 Pixel f�r Maximalgeschwindigkeit)
  if (phiMax == 0) pixV = 100;                             // Sonderfall Nullschwingung
  var aMax = vMax*vMax/r;                                  // Maximale Radialbeschleunigung (m/s�)
  aMax = Math.max(aMax,g);                                 // Maximum f�r Radial- und Fallbeschleunigung (m/s�)
  pixA = 100/aMax;                                         // Umrechnungsfaktor (100 Pixel f�r Maximalbeschleunigung)
  if (phiMax == 0) pixA = 10;                              // Sonderfall Nullschwingung
  }
  
// Ermittlung des Zustands:
// R�ckgabewert: 0 (vor dem Start), 1 (Anlauf), 2 (Kreisbahn), 3 (Wurfparabel) oder 4 (Auslauf)

function getState () {
  if (t <= 0) return 0;                                    // Vor dem Start
  if (type > 1 && t < t01) return 1;                       // Anlauf (schiefe Ebene)
  if (type == 1 || t <= t03) return 2;                     // Kreisbahn
  if (type == 2 && t > t03) return 3;                      // Wurfparabel
  if (type == 3 && t > t02+2*tMax) return 4;               // Auslauf
  }
  
// Berechnungen f�r Startposition:
// Seiteneffekt phi, sinPhi, cosPhi, x, y, v, aRad, aN, aTang

function calcT0 () {
  if (type == 1) calcT2();                                 // Entweder Position auf Kreis ...
  else calcT1();                                           // ... oder Position auf schiefer Ebene
  v = 0;                                                   // Geschwindigkeit
  aN = g;                                                  // Normalbeschleunigung
  aRad = 0;                                                // Radialbeschleunigung
  aTang = 0;                                               // Tangentialbeschleunigung
  }
  
// Berechnungen f�r Anlauf (schiefe Ebene):
// Seiteneffekt x, y, v, aN, aTang, aRad
  
function calcT1 () {
  var tt = t*t/2;                                          // Hilfsgr��e
  x = -d+ax1*tt; y = h0-r+ay1*tt;                          // Koordinaten bez�glich Kreismittelpunkt (m)
  var vx = ax1*t, vy = ay1*t;                              // Geschwindigkeitskomponenten (m/s)
  v = Math.sqrt(vx*vx+vy*vy);                              // Geschwindigkeit (m/s)
  aN = g*cosPsi;                                           // Normalbeschleunigung (m/s�)
  aTang = g*sinPsi;                                        // Tangentialbeschleunigung (m/s�)
  aRad = 0;                                                // Radialbeschleunigung
  }
  
// Berechnungen f�r Kreisbahn:
// Seiteneffekt phi, sinPhi, cosPhi, x, y, v, aRad, aN, aTang
  
function calcT2 () {
  phi = angle(t-t02);                                      // Positionswinkel (Bogenma�)
  if (phiMax == 0) phi = 0;                                // Sonderfall Nullschwingung
  sinPhi = Math.sin(phi); cosPhi = Math.cos(phi);          // Trigonometrische Werte
  x = r*sinPhi; y = -r*cosPhi;                             // Koordinaten bez�glich Kreismittelpunkt (m)
  v = Math.sqrt(2*g*(h0-r+r*cosPhi));                      // Geschwindigkeit (m/s)
  aRad = v*v/r;                                            // Radialbeschleunigung (m/s�)
  aN = aRad+g*cosPhi;                                      // Normalbeschleunigung (m/s�)
  if (aN < 0) aN = 0;                                      // Negativen Betrag verhindern
  aTang = Math.abs(g*sinPhi);                              // Tangentialbeschleunigung (m/s�)
  }
  
// Berechnungen f�r Wurfparabel:
// Seiteneffekt x, y, v, aN, aRad, aTang

function calcT3 () {
  var dt = t-t03;                                          // Zeit seit dem Abheben (s)
  x = x3+vx3*dt; y = y3+vy3*dt-g*dt*dt/2;                  // Koordinaten bez�glich Kreismittelpunkt (m)
  v = Math.sqrt(2*g*(h0-r-y));                             // Geschwindigkeit (m/s)
  aN = 0;                                                  // Normalbeschleunigung (m/s�)
  var alpha = Math.atan((vy3-g*dt)/(-vx3));                // Winkel gegen�ber der Waagrechten (Bogenma�, -pi/2 bis +pi/2)
  aRad = g*Math.cos(alpha);                                // Radialbeschleunigung (m/s�)
  aTang = Math.abs(g*Math.sin(alpha));                     // Tangentialbeschleunigung (m/s�)
  }
  
// Berechnungen f�r Auslauf:
// Seiteneffekt v, x, y, aN, aRad, aTang

function calcT4 () {
  v = Math.sqrt(2*g*h0);                                   // Geschwindigkeit (m/s)
  x = v*(t-t03); y = -r;                                   // Koordinaten bez�glich Kreismittelpunkt (m)
  aN = g;                                                  // Normalbeschleunigung (m/s�)
  aRad = 0;                                                // Radialbeschleunigung
  aTang = 0;                                               // Tangentialbeschleunigung
  }
  
// Berechnungen (zeitabh�ngige Gr��en):
// Seiteneffekt phi, sinPhi, cosPhi, x, y, xPix, yPix, v, aRad, aN, aTang

function calculationT () {
  var state = getState();                                  // Momentaner Zustand
  phi = sinPhi = cosPhi = undefined;                       // Positionswinkel, falls Kugel nicht auf Kreisbahn ...
  if (state == 0) calcT0();                                // Berechnungen f�r Startposition
  else if (state == 1) calcT1();                           // Berechnungen f�r Anlauf
  else if (state == 2) calcT2();                           // Berechnungen f�r Kreisbahn
  else if (state == 3) calcT3();                           // Berechnungen f�r Wurfparabel
  else if (state == 4) calcT4();                           // Berechnungen f�r Auslauf
  xPix = MX+x*PIX; yPix = MY-y*PIX;                        // Bildschirmkoordinaten (Pixel)
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
   
// Gesamte Eingabe:
// Seiteneffekt r, h0, g, m

function input () {
  var ae = document.activeElement;                         // Aktives Element
  r = inputNumber(ip1,3,true,0.2,1);                       // Radius (m)
  h0 = inputNumber(ip2,3,true,0,2);                        // Ausgangsh�he (m)
  g = inputNumber(ip3,2,true,1,100);                       // Fallbeschleunigung (m/s�)
  m = inputNumber(ip4,3,true,0.1,1);                       // Masse (kg)
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip3) focus(ip4);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip4) ip4.blur();                               // Fokus abgegeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(r,3,true);                          // Eingabefeld Radius
  ip2.value = ToString(h0,3,true);                         // Eingabefeld Ausgangsh�he
  ip3.value = ToString(g,2,true);                          // Eingabefeld Fallbeschleunigung
  ip4.value = ToString(m,3,true);                          // Eingabefeld Masse
  }
  
// Schwingungsdauer (s):
// phi ... Maximaler Positionswinkel (Bogenma�, gr��er als 0)

function period (phi) {
  var p = 2*Math.PI*Math.sqrt(r/g);                        // N�herung f�r kleine Winkel
  var q = phi*phi;                                         // Quadrat
  var pot = q;                                             // Potenz f�r Reihenentwicklung
  var f = 1+q/16;                                          // Korrekturfaktor bis Exponent 2
  pot *= q; f += 11*pot/3072;                              // Korrekturfaktor bis Exponent 4
  pot *= q; f += 173*pot/737280;                           // Korrekturfaktor bis Exponent 6
  pot *= q; f += 22931*pot/1321205760;                     // Korrekturfaktor bis Exponent 8
  pot *= q; f += 1319183*pot/951268147200;                 // Korrekturfaktor bis Exponent 10
  pot *= q; f += 233526463*pot/2009078326886400;           // Korrekturfaktor bis Exponent 12
  return f*p;                                              // R�ckgabewert
  }
  
// Positionswinkel (Bogenma�) als Funktion der Zeit (lineare Interpolation):
// t ... Zeit (s), 0 <= t <= tMax vorausgesetzt

function getPhi (t) {
  var t1 = 0, phi1 = 0;                                    // Anfang Zeitintervall (s), zugeh�riger Positionswinkel (Bogenma�)
  for (var i=0; i<N; i++) {                                // F�r alle Indizes ...
    var t2 = arrayT[i+1];                                  // Ende Zeitintervall (s)
    var phi2 = arrayPhi[i+1];                              // Zugeh�riger Positionswinkel (Bogenma�)
    if (t <= t2) {                                         // Falls t innerhalb des Zeitintervalls ...
      var q = (t-t1)/(t2-t1);                              // Quotient (0 bis 1)
      return phi1+q*(phi2-phi1);                           // R�ckgabewert (linear interpoliert)
      }
    t1 = t2; phi1 = phi2;                                  // Ende des Zeitintervalls wird Anfang
    }
  }
  
// Positionswinkel (Bogenma�) f�r Bewegungstyp 1 (periodische Schwingung):
// t ... Zeit seit dem ersten Durchlaufen des tiefsten Punkts (s)
// Voraussetzung: t02+t > 0

function phi1 (t) {
  if (t < 0) return -getPhi(-t);                           // R�ckgabewert vor dem ersten Durchlaufen des tiefsten Punkts
  var n = Math.floor(t/per);                               // Zahl der vollst�ndigen Perioden
  t -= n*per;                                              // Vollst�ndige Perioden ignorieren 
  if (t <= per/4) return getPhi(t);                        // R�ckgabewert f�r gebremste Bewegung nach rechts oben
  else if (t <= per/2) return getPhi(per/2-t);             // R�ckgabewert f�r beschleunigte Bewegung nach links unten
  else if (t <= 3*per/4) return -getPhi(t-per/2);          // R�ckgabewert f�r gebremste Bewegung nach links oben
  else return -getPhi(per-t);                              // R�ckgabewert f�r beschleunigte Bewegung nach rechts unten
  }
  
// Positionswinkel (Bogenma�) f�r Bewegungstyp 2 (mit Abheben):
// t ... Zeit seit dem ersten Durchlaufen des tiefsten Punkts (s)
// Voraussetzung: t01-t02 < t < tMax

function phi2 (t) {
  return getPhi(t);                                        // R�ckgabewert
  }
  
// Positionswinkel (Bogenma�) f�r Bewegungstyp 3 (mit �berschlag und Auslauf):
// t ... Zeit seit dem ersten Durchlaufen des tiefsten Punkts (s)
// Voraussetzung: t01-t02 < t < 2*tMax

function phi3 (t) {
  var p = 2*tMax;                                           // Zeit f�r Durchlaufen des Kreises (s)
  if (t < 0) t += p;                                        // Negative Zeit (vor dem tiefsten Punkt) verhindern
  if (t <= tMax) return getPhi(t);                          // R�ckgabewert f�r aufw�rts rollende Kugel
  else return -getPhi(p-t);                                 // R�ckgabewert f�r abw�rts rollende Kugel
  }
  
// Positionswinkel (Bogenma�):
// t ... Zeit seit dem ersten Durchlaufen des tiefsten Punkts (s)
  
function angle (t) {
  if (type == 1) return phi1(t);                       // R�ckgabewert, falls periodische Schwingung
  if (type == 2) return phi2(t);                       // R�ckgabewert, falls Bewegung mit Abheben
  if (type == 3) return phi3(t);                       // R�ckgabewert, falls Bewegung mit �berschlag und Auslauf
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Verbindungslinie zweier Punkte:
// (u1,v1), (u2,v2) ... Bildschirmkoordinaten der Endpunkte

function line (u1, v1, u2, v2) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
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
  
// Digitaluhr:
// (x,y) ... Position Mittelpunkt (Pixel)
// t ....... Angezeigte Zeit (s)

function clock (x, y, t) {
  rectangle(x-60,y-16,120,32,colorClock1);                 // Geh�use
  rectangle(x-50,y-10,100,20,colorClock2);                 // Hintergrund der Anzeige
  ctx.fillStyle = colorClock3;                             // Farbe f�r Ziffern
  ctx.font = "normal normal bold 16px monospace";          // Zeichensatz
  ctx.textAlign = "center";                                // Zentrierte Ausgabe
  var n = Math.floor(t/1000);                              // Zahl der Zeitabschnitte zu je 1000 s
  var s = (t-n*1000).toFixed(3)+" "+second;                // Zeitangabe (Einheit s, alle 1000 s Neuanfang)
  s = s.replace(".",decimalSeparator);                     // Eventuell Punkt durch Komma ersetzen
  while (s.length < 9) s = " "+s;                          // Eventuell Leerzeichen am Anfang erg�nzen
  ctx.fillText(s,x,y+5);                                   // Ausgabe der Zeit
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
  
// Pfeil vom Kugelmittelpunkt aus:
// dx ... Waagrechte Komponente (Pixel)
// dy ... Senkrechte Komponente (Pixel)
// c .... Farbe (optional, Defaultwert schwarz)
  
function arrowBall (dx, dy, c) {
  ctx.strokeStyle = (c ? c : "#000000");                   // Farbe
  arrow(xPix,yPix,xPix+dx,yPix+dy,2.5);                    // Pfeil zeichnen
  }
  
// Vektorpfeil f�r Geschwindigkeit (Anlauf):

function arrowVelocity1 () {
  var r = pixV*v;                                          // L�nge des Pfeils (Pixel)
  var dx = r*cosPsi, dy = r*sinPsi;                        // Komponenten (Pixel) 
  arrowBall(dx,dy,colorVelocity);                          // Pfeil zeichnen
  }
  
// Vektorpfeil f�r Geschwindigkeit (Kreisbewegung):

function arrowVelocity2 () {
  var r = pixV*v;                                          // L�nge des Pfeils (Pixel)
  var dt = t-t02;                                          // Zeit seit erstem Durchlaufen des tiefsten Punkts (s)
  var p = period(phiMax);                                  // Periode (s)
  var n = Math.floor(dt/p);                                // Anzahl der vollst�ndigen Perioden (kann auch -1 sein)
  dt -= n*p;                                               // Vollst�ndige Perioden ignorieren
  if (type == 1 && dt > tMax && dt < 3*tMax) r = -r;       // Falls R�ckschwingung, negativer Radius
  var dx = r*cosPhi, dy = -r*sinPhi;                       // Komponenten (Pixel)
  arrowBall(dx,dy,colorVelocity);                          // Pfeil zeichnen
  }
  
// Vektor f�r Geschwindigkeit (Wurfparabel):

function arrowVelocity3 () {
  var dx = pixV*vx3;                                       // x-Komponente (Pixel)
  var dy = -pixV*(vy3-g*(t-t03));                          // y-Komponente (Pixel)
  arrowBall(dx,dy,colorVelocity);                          // Pfeil zeichnen
  }
  
// Vektorpfeil f�r Geschwindigkeit (Auslauf):

function arrowVelocity4 () {
  arrowBall(pixV*v,0,colorVelocity);                       // Pfeil zeichnen
  }
  
// Ausgabe eines Zahlenwerts:
// s ... Erkl�render Text
// z ... Zahlenwert
// u ... Zeichenkette f�r Einheit
// y ... Senkrechte Koordinate (Pixel)
// c ... Schriftfarbe
  
function writeValue (s, z, u, y, c) {
  ctx.fillStyle = c;                                       // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillText(s,50,y);                                    // Erkl�render Text (links)
  ctx.fillText(ToString(z,3,true)+" "+u,250,y);            // Zahl und Einheit (rechts)
  }
  
// Zahlenangabe und Pfeil f�r Geschwindigkeit:
  
function velocity () {
  writeValue(text13,v,meterPerSecond,310,colorVelocity);   // Zahlenwert Geschwindigkeit
  if (!cbV.checked) return;                                // Falls Optionsfeld abgeschaltet, abbrechen
  var state = getState();                                  // Momentaner Zustand (0 bis 4)
  if (state == 1) arrowVelocity1();                        // Pfeil f�r Kugel im Anlauf ...
  else if (state == 2) arrowVelocity2();                   // Pfeil f�r Kugel auf Kreisbahn
  else if (state == 3) arrowVelocity3();                   // Pfeil f�r Kugel auf Wurfparabel
  else if (state == 4) arrowVelocity4();                   // Pfeil f�r Kugel im Auslauf          
  }
  
// Kr�fteparallelogramm, Gesamtkraft:
// dx1, dy1 ... Komponenten der 1. Kraft (Pixel)
// dx2, dy2 ... Komponenten der 2. Kraft (Pixel)
// p .......... Flag f�r vollst�ndiges Parallelogramm

function parallelogram (dx1, dy1, dx2, dy2, p) {
  arrowBall(dx1,dy1,colorForce);                           // 1. Kraftpfeil, ausgehend von der Kugel
  arrowBall(dx2,dy2,colorForce);                           // 2. Kraftpfeil, ausgehend von der Kugel
  if (!p) return;                                          // Abbrechen, falls kein Pfeil f�r Gesamtkraft gew�nscht
  axPix = dx1+dx2; ayPix = dy1+dy2;                        // Komponenten Gesamtkraft (Pixel)
  var x = xPix+axPix, y = yPix+ayPix;                      // Koordinaten Pfeilspitze (Pixel)
  var z = (Math.abs(axPix)+Math.abs(ayPix) < 1e-5);        // �berpr�fung, ob Gesamtkraft 0
  if (!z) {                                                // Falls Gesamtkraft gr��er als 0 ...
    line(xPix+dx1,yPix+dy1,x,y);                           // Seite gegen�ber dem 2. Kraftpfeil
    line(xPix+dx2,yPix+dy2,x,y);                           // Seite gegen�ber dem 1. Kraftpfeil
    }
  if (!z) arrowBall(axPix,ayPix,colorTotalForce);          // Entweder Pfeil f�r Gesamtkraft ...
  else circle(xPix,yPix,1.5,colorTotalForce);              // ... oder Punkt f�r Gesamtkraft 0
  }
  
// Zahlenangaben und Pfeile f�r Gewichtskraft und Kontaktkraft:
// Bei der L�nge der Pfeile wird nur die Beschleunigung ber�cksichtigt, nicht die Masse.
  
function forceGravNormal () {
  writeValue(text14,m*g,newton,330,colorForce);            // Zahlenwert Gewichtskraft
  writeValue(text15,m*aN,newton,350,colorForce);           // Zahlenwert Kontaktkraft
  if (!rb3.checked) return;                                // Abbrechen, falls Radiobutton nicht ausgew�hlt
  arrowBall(0,pixA*g,colorForce);                          // Pfeil f�r Gewichtskraft
  var state = getState();                                  // Momentaner Zustand (0 bis 4)
  var dx = 0, dy = 0;                                      // Komponenten Kontaktkraft (Pixel)
  if (state == 0) dy = -pixA*g;                            // Falls Kugel in Startposition, Gegenkraft zur Gewichtskraft
  else if (state == 1) {                                   // Falls Kugel auf der schiefen Ebene ...
    dx = pixA*g*cosPsi*sinPsi; dy = -pixA*g*cosPsi*cosPsi; // Komponenten Kontaktkraft (Pixel)
    } 
  else if (state == 2) {                                   // Falls Kugel auf Kreisbahn ...
    dx = -pixA*aN*sinPhi; dy = -pixA*aN*cosPhi;            // Komponenten Kontaktkraft (Pixel)
    }
  else if (state == 4) dy = -pixA*g;                       // Falls Kugel im Auslauf, Gegenkraft zur Gewichtskraft
  parallelogram(0,pixA*g,dx,dy,cbF.checked);               // Kraftpfeile, eventuell Kr�fteparallelogramm und Gesamtkraft
  }
  
// Zahlenangaben und Pfeile f�r Radialkraft und Tangentialkraft:
// Bei der L�nge der Pfeile wird nur die Beschleunigung ber�cksichtigt, nicht die Masse.

function forceRadTang () {
  writeValue(text16,m*aTang,newton,370,colorForce);        // Zahlenwert Tangentialkraft
  writeValue(text17,m*aRad,newton,390,colorForce);         // Zahlenwert Radialkraft
  var a = Math.sqrt(aRad*aRad+aTang*aTang);                // Betrag der Gesamtbeschleunigung (m/s�)
  writeValue(text18,m*a,newton,410,colorTotalForce);       // Zahlenwert Gesamtkraft
  if (!rb4.checked) return;                                // Abbrechen, falls Radiobutton nicht ausgew�hlt
  var state = getState();                                  // Momentaner Zustand (0 bis 4)
  var dx1 = 0, dy1 = 0;                                    // Kraftkomponenten Radialkraft (Pixel)
  var dx2 = 0, dy2 = 0;                                    // Kraftkomponenten Tangentialkraft (Pixel)
  if (state == 1) {                                        // Falls Kugel auf der schiefen Ebene ...
    dx2 = pixA*aTang*cosPsi; dy2 = pixA*aTang*sinPsi;      // Komponenten Tangentialkraft (Pixel)
    }
  else if (state == 2) {                                   // Falls Kugel auf Kreisbahn ...
    dx1 = -pixA*aRad*sinPhi; dy1 = -pixA*aRad*cosPhi;      // Komponenten Radialkraft (Pixel)              
    dx2 = -pixA*aTang*cosPhi; dy2 = pixA*aTang*sinPhi;     // Komponenten Tangentialkraft (Pixel)
    if (sinPhi < 0) {dx2 = -dx2; dy2 = -dy2;}              // Falls Abw�rtsbewegung, Tangentialkraft umgekehrt
    }
  else if (state == 3) {                                   // Falls Kugel auf Wurfparabel ...
    var alpha = Math.atan((vy3-g*(t-t03))/(-vx3));         // Winkel gegen�ber der Waagrechten (Bogenma�)
    var sinAlpha = Math.sin(alpha);                        // Sinuswert
    var cosAlpha = Math.cos(alpha);                        // Cosinuswert
    dx1 = -pixA*aRad*sinAlpha; dy1 = pixA*aRad*cosAlpha;   // Komponenten Radialkraft (Pixel)
    dx2 = pixA*aTang*cosAlpha; dy2 = pixA*aTang*sinAlpha;  // Komponenten Tangentialkraft (Pixel)
    if (alpha < 0) {dx2 = -dx2; dy2 = -dy2;}               // Falls Abw�rtsbewegung, Tangentialkraft umgekehrt
    }
  parallelogram(dx1,dy1,dx2,dy2,cbF.checked);              // Kraftpfeile, eventuell Kr�fteparallelogramm
  }
    
// Hilfsroutine: Zu einem geschlossenen Grafikpfad wird die entsprechende Figur ausgef�llt (Farbe colorGround)
// und mit einem schwarzen Rand versehen.
  
function paintArea () {
  ctx.fillStyle = colorGround;                             // F�llfarbe
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llte Fl�che mit schwarzem Rand
  }
  
// Schiene (Kreisring ohne An- und Auslauf):
  
function ground1 () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(MX,MY,r*PIX+R,0,2*Math.PI,true);                 // Inneren Kreis vorbereiten
  ctx.moveTo(MX+r*PIX+RR,MY);                              // Zum �u�eren Kreis
  ctx.arc(MX,MY,r*PIX+RR,0,2*Math.PI,false);               // �u�eren Kreis vorbereiten
  paintArea();                                             // Ausgef�ller Kreisring mit schwarzem Rand
  circle(xPix,yPix,R,colorBall);                           // Rollende Kugel
  }
  
// Schiene mit Kugel (Loopingbahn mit An- und Auslauf):
// Erster Grafikpfad f�r Anlauf und rechten Teil der Kreisbahn
// Zweiter Grafikpfad f�r linken Teil der Kreisbahn und Auslauf

function ground23 () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var dp = d*PIX, rp = r*PIX;                              // Hilfsgr��en
  var p1s = R*sinPsi, p1c = R*cosPsi;                      // Hilfsgr��en
  var p2s = RR*sinPsi, p2c = RR*cosPsi;                    // Hilfsgr��en
  var p3s = 20*sinPsi, p3c = 20*cosPsi;                    // Hilfsgr��en (Verl�ngerung des Anlaufs am Anfang)
  var hrp = (h0-r)*PIX;                                    // Hilfsgr��e
  var top = 3*Math.PI/2, low = Math.PI/2;                  // Hilfsgr��en
  var x0 = MX-dp-p1s-p3c, y0 = MY-hrp+p1c-p3s;             // Anfangspunkt berechnen
  ctx.moveTo(x0,y0);                                       // Anfangspunkt f�r Grafikpfad
  var x1 = MX+bx*PIX-p1s, y1 = MY-by*PIX+p1c;              // �bergangspunkt zu Kreisbahn berechnen
  ctx.lineTo(x1,y1);                                       // Gerade Linie zum �bergangspunkt
  ctx.arc(MX,MY,rp+R,low+psi,top,true);                    // Innerer Kreisbogen zum h�chsten Punkt
  ctx.lineTo(MX,MY-r*PIX-RR);                              // Gerade Linie zum �u�eren Kreis
  ctx.arc(MX,MY,rp+RR,top,low+psi,false);                  // �u�erer Kreisbogen zum Anlauf
  var x2 = MX-dp-p2s-p3c, y2 = MY-hrp+p2c-p3s;             // N�chsten Punkt berechnen
  ctx.lineTo(x2,y2);                                       // Gerade Linie zu diesem Punkt
  ctx.lineTo(x0,y0);                                       // Gerade Linie zum Anfangspunkt
  paintArea();                                             // Ausgef�llte Fl�che mit schwarzem Rand
  var state = getState();                                  // Momentaner Zustand (0 bis 4)
  if (t <= t02+tMax || state == 3)                         // Falls Kugel verdeckt sein k�nnte ... 
    circle(xPix,yPix,R,colorBall);                         // Kugel zeichnen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(MX,MY-rp-RR);                                 // Anfangspunkt f�r Grafikpfad (oben, au�en)
  ctx.arc(MX,MY,rp+RR,top,Math.PI/2,true);                 // �u�erer Kreisbogen zum tiefsten Punkt
  ctx.lineTo(1000,MY+rp+RR);                               // Waagrechte Linie nach rechts
  ctx.lineTo(1000,MY+rp+R);                                // Senkrechte Linie nach oben
  ctx.lineTo(MX,MY+rp+R);                                  // Waagrechte Linie nach links
  ctx.arc(MX,MY,rp+R,Math.PI/2,top,false);                 // Innerer Kreisbogen zum h�chsten Punkt (innen)
  ctx.lineTo(MX,MY-r*PIX-RR);                              // Gerade Linie zum Anfangspunkt (au�en)
  paintArea();                                             // Ausgef�llte Fl�che mit schwarzem Rand
  ctx.fillRect(MX-1,MY-r*PIX-RR+1,2,RR-R-2);               // Unerw�nschte Trennlinie l�schen
  if (t > t02+tMax && state != 3)                          // Falls Kugel nicht verdeckt sein kann ... 
    circle(xPix,yPix,R,colorBall);                         // Kugel zeichnen
  }
  
// Vergleichspfeil:
// z ..... Zahlenwert
// pix ... Umrechnungsfaktor (Pixel pro Einheit)
// u ..... Zeichenkette f�r Einheit
// y ..... Senkrechte Koordinate (Pixel)
// c ..... Farbe

function arrowComparison (z, pix, u, y, c) {
  ctx.strokeStyle = c;                                     // Farbe
  arrow(360,y,360+z*pix,y,2.5);                            // Pfeil
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillText(""+z+" "+u,360+z*pix/2,y+15);               // Beschriftung (Zahl und Einheit)
  }
      
// Grafikausgabe:
// Seiteneffekt t, t0, phi, sinPhi, cosPhi, x, y, xPix, yPix, v, aRad, aN, aTang
  
function paint () {
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // ... Aktuelle Zeit
    var dt = (t1-t0)/5000;                                 // ... L�nge des Zeitintervalls (s)
    if (rb2.checked) dt /= 10;                             // ... Falls starke Zeitlupe, k�rzeres Zeitintervall
    t += dt;                                               // ... Zeitvariable aktualisieren
    t0 = t1;                                               // ... Neuer Anfangszeitpunkt
    }
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  clock(470,40,t);                                         // Obere Uhr (Zeit ab Start)
  clock(470,80,t<t02?0:t-t02);                             // Untere Uhr (Zeit nach Durchlaufen des tiefsten Punkts)
  ctx.font = FONT1;                                        // Zeichensatz
  calculationT();                                          // Zeitabh�ngige Gr��en berechnen
  if (type == 1) ground1();                                // Entweder Kreisring und Kugel ...
  else ground23();                                         // ... oder Loopingbahn mit An- und Auslauf und Kugel
  velocity();                                              // Zahlenangabe und Pfeil f�r Geschwindigkeit
  forceGravNormal();                                       // Zahlenangaben und Pfeile f�r Gewichtskraft und Kontaktkraft
  forceRadTang();                                          // Zahlenangaben und Pfeile f�r Radialkraft und Tangentialkraft
  var z = 1;                                               // Zahl 1 f�r Vergleichspfeil Geschwindigkeit
  if (pixV < 15) z = 10;                                   // Falls Pfeil zu kurz, Zahl 10 statt 1                          
  arrowComparison(z,pixV,meterPerSecond,305,colorVelocity);// Vergleichspfeil Geschwindigkeit
  z = 1;                                                   // Zahl 1 f�r Vergleichspfeil Kraft
  if (pixA/m < 1.5) z = 100;                               // Falls Pfeil extrem kurz, Zahl 100 statt 1
  else if (pixA/m < 15) z = 10;                            // Falls Pfeil etwas zu kurz, Zahl 10 statt 1                              
  arrowComparison(z,pixA/m,newton,350,colorForce);         // Vergleichspfeil Kraft
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

