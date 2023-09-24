// Rutherford-Streuung
// 07.05.2020 - 17.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel rutherfordscattering_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorNucleus = "#ff0000";                              // Farbe für Atomkerne
var colorAsymptote = "#808080";                            // Farbe für Asymptoten und Hilfslinien
var colorParameter = "#0000ff";                            // Farbe für Stoßparameter
var colorAngle = "#00ffff";                                // Farbe für Winkelmarkierung

// Sonstige Konstanten:

var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var E = 1.602176634e-19;                                   // Elementarladung (C)
var EPS0 = 8.8541878128e-12;                               // Elektrische Feldkonstante (C/(Vm))
var M = 6.6446573357e-27;                                  // Masse Alphateilchen (kg)
var PIX = 2.0e15;                                          // Umrechnungsfaktor (Pixel pro Meter)
var SLOW = 4.0e20;                                         // Faktor der Zeitlupe
var IT = 10;                                               // Zahl der Teilintervalle (für Romberg-Verfahren)
var N = 1000;                                              // Zahl der Teilintervalle für lineare Interpolation
var DX = 5;                                                // Abstand der Startposition vom linken Bildrand (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var cvBG, ctxBG;                                           // Hintergrundzeichnung, zugehöriger Grafikkontext
var bu1, bu2;                                              // Schaltknöpfe
var ip1, ip2, ip3;                                         // Eingabefelder
var op1, op2;                                              // Ausgabefelder
var cb1, cb2;                                              // Optionsfelder
var on;                                                    // Flag für Bewegung
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var timer;                                                 // Timer für Animation
var x0, y0;                                                // Bildschirmkoordinaten Ursprung (Pixel)
var z;                                                     // Kernladungszahl (streuender Atomkern)
var p;                                                     // Stoßparameter (m)
var v;                                                     // Geschwindigkeit (m/s)
var constE;                                                // Gesamtenergie (J)
var constL;                                                // Drehimpuls (kg m^2/s)
var k1;                                                    // Konstante für Coulomb-Gesetz (SI)
var k2;                                                    // Konstante für Zentrifugalpotential (SI)
var k3;                                                    // Konstante für Integralberechnung (SI)
var theta;                                                 // Streuwinkel (Bogenmaß)
var sin, cos;                                              // Trigonometrische Werte für halben Streuwinkel
var epsHyp;                                                // Numerische Exzentrizität der Hyperbel
var hpHyp;                                                 // Halbparameter der Hyperbel (m)
var tStart;                                                // Zeitpunkt linker Bildrand (s)
var outside;                                               // Flag für Verlassen des Bildbereichs
var ready;                                                 // Flag für abgeschlossenen Einzelversuch
var arrayT;                                                // Array für Werte der Zeit (s)
var arrayPhi;                                              // Array für Werte des Positionswinkels (Bogenmaß)
var arrayR;                                                // Array für Werte des Abstands (m)
var phi;                                                   // Positionswinkel Alphateilchen (Bogenmaß, bezüglich Hauptachse)
var radius;                                                // Abstand bei zentralem Stoß (m)             

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
  x0 = width/2; y0 = 300;                                  // Bildschirmkoordinaten Ursprung (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  initBackground();                                        // Hintergrundzeichnung vorbereiten
  bu1 = getElement("bu1",text01);                          // Resetknopf
  bu2 = getElement("bu2",text02);                          // Startknopf 
  getElement("lb1",text03);                                // Erklärender Text (streuender Atomkern)
  getElement("ip1a",text04);                               // Erklärender Text (Kernladungszahl)
  ip1 = getElement("ip1b");                                // Eingabefeld (Kernladungszahl)
  getElement("lb2",text05);                                // Erklärender Text (Alphateilchen)
  getElement("ip2a",text06);                               // Erklärender Text (Geschwindigkeit)
  ip2 = getElement("ip2b");                                // Eingabefeld (Geschwindigkeit)
  getElement("ip2c",kilometerPerSecond);                   // Einheit (Geschwindigkeit)
  getElement("ip3a",text07);                               // Erklärender Text (Stoßparameter)
  ip3 = getElement("ip3b");                                // Eingabefeld (Stoßparameter)
  getElement("ip3c",femtometer);                           // Einheit (Stoßparameter)
  getElement("op1a",text08);                               // Erklärender Text (Streuwinkel)
  op1 = getElement("op1b");                                // Ausgabefeld (Streuwinkel)
  getElement("op1c",degree);                               // Einheit (Streuwinkel)
  getElement("op2a",text09);                               // Erklärender Text (minimaler Abstand)
  op2 = getElement("op2b");                                // Ausgabefeld (minimaler Abstand)
  getElement("op2c",femtometer);                           // Einheit (minimaler Abstand)  
  cb1 = getElement("cb1");                                 // Optionsfeld (Asymptoten, Stoßparameter)
  cb1.checked = false;                                     // Optionsfeld zunächst ohne Häkchen
  getElement("lbPar",text10);                              // Erklärender Text (Asymptoten, Stoßparameter)
  cb2 = getElement("cb2");                                 // Optionsfeld (Asymptoten, Streuwinkel)
  cb2.checked = false;                                     // Optionsfeld zunächst ohne Häkchen
  getElement("lbAng",text11);                              // Erklärender Text (Asymptoten, Streuwinkel)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
    
  on = false;                                              // Animation zunächst abgeschaltet
  t = 0;                                                   // Zeitvariable (s) 
  z = 79;                                                  // Kernladungszahl (Gold)
  p = 1.0e-14;                                             // Stoßparameter (m)
  v = 3.0e7;                                               // Geschwindigkeit (m/s)
  updateInput();                                           // Eingabefelder aktualisieren 
  enableInput(true);                                       // Eingabe zunächst uneingeschränkt möglich  
  calculation();                                           // Berechnungen (Seiteneffekt!)
  focus(ip1);                                              // Fokus für erstes Eingabefeld
  paint();                                                 // Zeichnen    
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Zurück)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Kernladungszahl)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Geschwindigkeit)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Stoßparameter)
  ip1.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Kernladungszahl)
  ip2.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Geschwindigkeit)
  ip3.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Stoßparameter)
  cb1.onclick = paint;                                     // Reaktion auf oberes Optionsfeld (Asymptoten, Stoßparameter)
  cb2.onclick = paint;                                     // REaktion auf unteres Optionsfeld (Asymptoten, Streuwinkel)
  
  } // Ende der Methode start
    
// Reaktion auf den Resetknopf:
// Seiteneffekt cvBG, ctxBG, on, timer, t, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
// Neue Hintergrundzeichnung, Wirkung auf Ein- und Ausgabefelder
   
function reactionReset () {
  initBackground();                                        // Hintergrundzeichnung vorbereiten
  enableInput(true);                                       // Alle Eingabefelder aktivieren
  stopAnimation();                                         // Animation stoppen
  t = 0;                                                   // Zeitvariable zurücksetzen
  reaction();                                              // Eingegebene Werte übernehmen und rechnen
  paint();                                                 // Neu zeichnen
  focus(ip1);                                              // Fokus für das erste Eingabefeld
  }
  
// Reaktion auf den Startknopf:
// Seiteneffekt t, on, timer, t0, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
// Wirkung auf Ein- und Ausgabefelder

function reactionStart () {
  enableInput(false);                                      // Nur noch Eingabe des Stoßparameters möglich
  t = 0;                                                   // Zeitvariable zurücksetzen
  startAnimation();                                        // Animation starten
  reaction();                                              // Eingegebene Werte übernehmen und rechnen
  }
  
// Hilfsroutine: Eingabe übernehmen und rechnen
// Seiteneffekt z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
// Wirkung auf Ein- und Ausgabefelder

function reaction () {
  input();                                                 // Eingegebene Werte übernehmen (eventuell korrigiert)
  calculation();                                           // Berechnungen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt t, on, timer, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
  
function reactionEnter (e) {
  t = 0;                                                   // Zeitvariable zurücksetzen 
  stopAnimation();                                         // Animation stoppen
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (enter) reaction();                                   // Falls Enter-Taste, Daten übernehmen und rechnen
  outside = ready = false;                                 // Flags löschen                        
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Verlust des Fokus:
// Seiteneffekt t, on, timer, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready

function reactionBlur () {
  t = 0;                                                   // Zeitvariable zurücksetzen 
  stopAnimation();                                         // Animation stoppen
  reaction();                                              // Daten übernehmen und rechnen
  outside = ready = false;                                 // Flags löschen                        
  paint();                                                 // Neu zeichnen
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
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
  if (timer) clearInterval(timer);                         // Timer deaktivieren
  }

//-------------------------------------------------------------------------------------------------
  
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
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
  
// Aktivierung/Deaktivierung der Eingabefelder:
// a ... Flag für Aktivierung aller drei Eingabefelder

function enableInput (a) {
  ip1.readOnly = !a;                                       // Eingabefeld für Kernladungszahl
  ip2.readOnly = !a;                                       // Eingabefeld für Geschwindigkeit
  ip3.readOnly = false;                                    // Eingabefeld für Stoßparameter
  }
   
// Gesamte Eingabe:
// Seiteneffekt z, v, p

function input () {
  var ae = document.activeElement;                         // Aktives Element
  z = inputNumber(ip1,0,true,50,100);                      // Kernladungszahl
  v = 1000*inputNumber(ip2,0,true,10000,50000);            // Geschwindigkeit (m/s)
  p = inputNumber(ip3,1,true,0,50)*1.0e-15;                // Stoßparameter (m)
  if (ae == ip1) focus(ip2);                               // Fokus für nächstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus für nächstes Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(z,0,true);                          // Kernladungszahl
  ip2.value = ToString(v/1000,0,true);                     // Geschwindigkeit (km/s)
  ip3.value = ToString(p*1e15,1,true);                     // Stoßparameter (fm)
  }
  
// Berechnungen:
// Seiteneffekt k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, tStart, outside, ready
// Wirkung auf Ausgabefelder

function calculation () {
  k1 = 2*z*E*E/(4*Math.PI*EPS0);                           // Konstante für Coulomb-Gesetz (SI)
  constE = M*v*v/2;                                        // Gesamtenergie (J)
  constL = M*v*p;                                          // Drehimpuls (kg m^2/s)
  k2 = constL*constL/(2*M);                                // Konstante für Zentrifugalpotential (SI)
  var tan = k1/(M*v*v*p);                                  // Tangens des halben Streuwinkels (kann unendlich sein)
  theta = 2*Math.atan(tan);                                // Streuwinkel (Bogenmaß)
  sin = Math.sin(theta/2);                                 // Sinus des halben Streuwinkels
  cos = Math.cos(theta/2);                                 // Cosinus des halben Streuwinkels
  // Hinweis: aHyp = p*tan; bHyp = p; eHyp = p/cos;
  // Hinweis: rMin = eHyp+aHyp;
  epsHyp = 1/sin;                                          // Numerische Exzentrizität
  hpHyp = p/tan;                                           // Halbparameter
  k3 = M*hpHyp*hpHyp/constL;                               // Konstante für Integralberechnung
  op1.innerHTML = ToString(theta/DEG,1,true);              // Ausgabefeld für Streuwinkel aktualisieren
  var rMin = (p>0 ? p/cos+p*tan : k1/constE);              // Minimaler Abstand (m)
  op2.innerHTML = ToString(rMin*1e15,1,true);              // Ausgabefeld für minimalen Abstand aktualisieren
  arrayT = new Array(N+1);                                 // Array für Werte der Zeit
  arrayT[0] = 0;                                           // Array-Element für Punkt der größten Annäherung
  if (p > 0) {                                             // Falls Stoßparameter positiv ...
    arrayPhi = new Array(N+1);                             // Array für Werte des Positionswinkels
    arrayPhi[0] = 0;                                       // Array-Element für Punkt der größten Annäherung
    var dw = Math.PI/N;                                    // Schrittweite Winkel (Bogenmaß)
    for (var i=1; i<=N; i++) {                             // Für alle Indizes ...
      var w = i*dw;                                        // Winkel (Bogenmaß)
      arrayT[i] = romberg(value,0,w);                      // Array-Element für Zeit
      arrayPhi[i] = w;                                     // Array-Element für zugehörigen Winkel (Bogenmaß)
      }
    }
  else {                                                   // Falls Stoßparameter gleich 0 ...
    arrayR = new Array(N +1);                              // Array für Werte des Abstands
    arrayR[0] = rMin;                                      // Array-Element für Punkt der größten Annäherung
    for (i=1; i<=N; i++) {                                 // Für alle Indizes ...
      var t = i*1.0e-22;                                   // Reale Zeit (s)
      arrayT[i] = t;                                       // Array-Element für Zeit
      arrayR[i] = getDistance(t);                          // Array-Element für Abstand
      }
    }
  tStart = getTime1();                                     // Startzeitpunkt (real, in s)
  outside = ready = false;                                 // Flags löschen
  }
  
// Positionsberechnung für Alphateilchen:
// phiHor ... Winkel gegenüber der Waagrechten (Bogenmaß)
// Rückgabewert: Verbund mit Attributen x, y (Bildschirmkoordinaten)
  
function position (phiHor) {
  var phi = phiHor-(Math.PI-theta)/2;                      // Winkel gegenüber der Hauptachse (Bogenmaß)
  var rPix = hpHyp*PIX/Math.abs(1-epsHyp*Math.cos(phi));   // Abstand für Polarkoordinaten (Pixel)
  var xT = x0-rPix*Math.cos(phiHor);                       // Waagrechte Koordinate (Pixel)
  xT = Math.max(xT,-DX);                                   // Zu kleine Werte von xT verhindern
  var yT = y0-rPix*Math.sin(phiHor);                       // Senkrechte Koordinate (Pixel)
  return {x: xT, y: yT};                                   // Rückgabewert
  }
  
// Integrand zur Berechnung von phi:
  
function value (x) {
  var h = epsHyp*Math.cos(x)-1;                            // Hilfsgröße
  return k3/(h*h);                                         // Rückgabewert
  }
  
// Simpson-Näherung für bestimmtes Integral:
// f ... Funktion
// a ... Untere Grenze
// b ... Obere Grenze (mit b > a)
// n ... Zahl der Teilintervalle (gerade natürliche Zahl)
  
function simpson (f, a, b, n) {
  var h = (b-a)/n;                                         // Breite eines Teilintervalls
  var s = f(a)+f(b);                                       // Summe f(a) + f(b)
  for (var i=1; i<n; i+=2)                                 // Für alle ungeraden Indizes ...
    s += 4*f(a+i*h);                                       // Vierfachen Funktionswert addieren
  for (i=2; i<n; i+=2)                                     // Für alle geraden Indizes ...
    s += 2*f(a+i*h);                                       // Doppelten Funktionswert addieren
  return s*h/3;                                            // Rückgabewert
  }
    
// Romberg-Näherung für bestimmtes Integral:
// f ... Funktion
// a ... Untere Grenze
// b ... Obere Grenze (mit b > a)
  
function romberg (f, a, b) {
  var n = 2;                                               // Zahl der Teilintervalle, Startwert
  var t = new Array(IT+1);                                 // Array für Zwischenergebnisse
  for (var k=0; k<=IT; k++) {                              // Für alle Iterationen ...
    n *= 2;                                                // Zahl der Teilintervalle verdoppeln
    t[k] = simpson(f,a,b,n);                               // Simpson-Näherung speichern
    var q = 1;
    for (var i=k-1; i>=0; i--) {
      q *= 4;
      t[i] = t[i+1]+(t[i+1]-t[i])/(q-1);
      }
    } // Ende for (k)
  return t[0];                                             // Rückgabewert
  }
  
// Lineare Interpolation:
// a1 ... Array mit aufsteigend sortierten Werten der ersten Größe (unabhängige Variable)
// a2 ... Array mit Werten der zweiten Größe (abhängige Variable)
// v1 ... Gegebener Wert der ersten Größe

function linearInterpolation (a1, a2, v1) {
  var v1L = a1[0];                                         // Untere Intervallgrenze (unabhängige Variable)
  var v2L = a2[0];                                         // Zugehöriger Wert der abhängigen Variablen 
  var n = a1.length;                                       // Länge des ersten Arrays
  if (v1 < a1[0] || v1 > a1[n]) return undefined;          // Extrapolation verhindern
  for (var i=1; i<n; i++) {                                // Für alle Indizes ab 1 ...
    var v1R = a1[i];                                       // Obere Intervallgrenze (unabhängige Variable)
    var v2R = a2[i];                                       // Zugehöriger Wert der abhängigen Variablen
    if (v1 <= v1R) {                                       // Falls gegebener Wert im Intervall ...
      var q = (v1-v1L)/(v1R-v1L);                          // Quotient (0 bis 1)
      return v2L+q*(v2R-v2L);                              // Rückgabewert
      }
    v1L = v1R; v2L = v2R;                                  // Obere Intervallgrenze wird untere Intervallgrenze
    }
  }
  
// Positionswinkel als Funktion der Zeit (lineare Interpolation):
// t ... Zeit (s) seit Durchlaufen der Hyperbel-Hauptachse

function getPhi (t) {
  if (t < 0)                                               // Falls 1. Teil der Streuvorgangs ... 
    return -linearInterpolation(arrayT,arrayPhi,-t);       // Rückgabewert (Symmetrieeigenschaft phi(-t) = -phi(t))
  else return linearInterpolation(arrayT,arrayPhi,t);      // Rückgabewert für 2. Teil des Streuvorgangs
  }
  
// Für zentralen Stoß: Abstand als Funktion der Zeit
// Berechnung mithilfe des Kraftgesetzes und der Formeln für konstante Beschleunigung
// t ... Zeit seit der größten Annäherung (s)

function getDistance (t) {
  if (t < 0) return getRadius(-t);                         // Rückgabewert für negatives t
  var n = 100;                                             // Zahl der Zeitintervalle
  var dt = t/n;                                            // Länge eines Zeitintervalls (s)
  var r = k1/constE;                                       // Minimaler Abstand als Startwert
  var v0 = 0;                                              // Anfangsgeschwindigkeit (m/s)
  var h1 = k1/M, h2 = dt/2;                                // Hilfsgrößen
  for (var i=1; i<=n; i++) {                               // Für alle Zeitintervalle ...
    var a = h1/(r*r);                                      // Beschleunigung (m/s²)
    var v = v0+a*dt;                                       // Endgeschwindigkeit (m/s)
    r += (v0+v)*h2;                                        // Neuer Abstand (m)
    v0 = v;                                                // Endgeschwindigkeit wird Anfangsgeschwindigkeit
    }
  return r;                                                // Rückgabewert (m)
  }
  
// Für zentralen Stoß: Abstand als Funktion der Zeit
  
function getRadius (t) {
  return linearInterpolation(arrayT,arrayR,Math.abs(t));   // Rückgabewert (m)
  }
  
// Reale Zeit (s) für die Bewegung vom linken Bildrand bis zum Punkt mit minimalem Abstand:

function getTime1 () {
  if (p > 0) {                                             // Falls Stoßparameter positiv ...
    var xP = -DX, yP = y0-PIX*p;                           // Punkt am linken Rand (knapp außerhalb, Pixel)
    var phiHor = Math.atan((y0-yP)/(x0-xP));               // Winkel gegenüber der Waagrechten (Bogenmaß)
    var phi = phiHor-(Math.PI-theta)/2;                    // Positionswinkel (Bogenmaß, bezüglich Hauptachse)
    return romberg(value,0,phi);                           // Rückgabewert
    }
  else {                                                   // Falls Stoßparameter gleich 0 ...
    var rP = (width/2+DX)/PIX;                             // Abstand für Punkt am linken Rand (knapp außerhalb, m)
    return -linearInterpolation(arrayR,arrayT,rP);         // Rückgabewert
    }
  }
  
// Überprüfung, ob das Alphateilchen den Bildbereich verlassen hat:
// x ... Waagrechte Bildschirmkoordinate (Pixel)
// y ... Senkrechte Bildschirmkoordinate (Pixel)
  
function isOutside (x, y) {
  if (x > width) return true;                              // Rückgabewert, falls Teilchen zu weit rechts
  if (y < 0) return true;                                  // Rückgabewert, falls Teilchen zu weit oben
  var tReal = tStart+t/SLOW;                               // Reale Zeit (s)
  if (tReal > 0 && x < 0) return true;                     // Rückgabewert, falls Teilchen auf Rückweg zu weit links
  return false;                                            // Rückgabewert in allen anderen Fällen
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath (ctx) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen
  if (w) ctx.lineWidth = w;                                // Liniendicke festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }

// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... Füllfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (c) ctx.fill();                                       // Kreis ausfüllen, falls gewünscht
  ctx.stroke();                                            // Rand zeichnen
  }
      
// Vollständige Teilchenbahn für Normalfall (Hintergrundzeichnung, Näherung durch Polygonzug):

function orbit () {
  newPath(ctxBG);                                          // Neuer Grafikpfad (Hintergrundzeichnung, Standardwerte)
  var p = position(0);                                     // Position auf Hyperbel weit links
  ctxBG.moveTo(p.x,p.y);                                   // Anfangspunkt Polygonzug
  var dw = DEG/10;                                         // Schrittweite Winkel (Bogenmaß)
  for (var i=1; i<=1800; i++) {                            // Für alle Indizes ...
    var phi = i*dw;                                        // Positionswinkel (Bogenmaß)
    if (phi >= Math.PI-theta) break;                       // Falls Winkel zu groß (Asymptote), abbrechen
    p = position(phi);                                     // Neue Position auf Hyperbel
    ctxBG.lineTo(p.x,p.y);                                 // Linie zum Polygonzug hinzufügen
    }
  ctxBG.stroke();                                          // Polygonzug für Hyperbel zeichnen
  }
  
// Vollständige Teilchenbahn für zentralen Stoß (Hintergrundzeichnung, gerade Linie):

function orbit0 () {
  newPath(ctxBG);                                          // Neuer Grafikpfad (Hintergrundzeichnung, Standardwerte)
  ctxBG.moveTo(x0-PIX*k1/constE,y0);                       // Umkehrpunkt als Anfangspunkt
  ctxBG.lineTo(0,y0);                                      // Endpunkt am linken Bildrand
  ctxBG.stroke();                                          // Linie zeichnen
  }
  
// Unvollständige Teilchenbahn für Normalfall (Näherung durch Polygonzug):

function orbitPart () {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  var p = position(0);                                     // Position auf Hyperbel weit links
  ctx.moveTo(p.x,p.y);                                     // Anfangspunkt Polygonzug
  var wRot = (Math.PI-theta)/2;                            // Drehwinkel Hyperbel (Bogenmaß)
  var dw = DEG/10;                                         // Schrittweite Winkel (Bogenmaß)
  for (var i=1; i<=1800; i++) {                            // Für alle Indizes ...
    var w = i*dw;                                          // Positionswinkel (Bogenmaß)
    if (w >= Math.PI-theta) break;                         // Falls Asymptote überschritten, abbrechen
    w = Math.min(w,phi+wRot);                              // Korrektur, falls Teilchen erreicht
    if (w > phi+wRot) break;                               // Falls Winkel zu groß, abbrechen
    p = position(w);                                       // Neue Position auf Hyperbel
    ctx.lineTo(p.x,p.y);                                   // Linie zum Polygonzug hinzufügen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Unvollständige Teilchenbahn für zentralen Stoß:

function orbit0Part () {
  var tMin = Math.abs(tStart)*SLOW;                        // Wert der Zeitvariablen t für Umkehrpunkt
  var rPix = PIX*k1/constE;                                // Minimaler Abstand (Pixel)
  if (t <= tMin) line(0,y0,x0-radius*PIX,y0);              // Falls Hinweg, waagrechte Linie bis zum Teilchen
  else line(0,y0,x0-rPix,y0);                              // Falls Rückweg, komplette waagrechte Linie
  } 
      
// Winkelmarkierung:
// x, y ... Scheitel
// a ...... Winkel gegenüber der Waagrechten (Bogenmaß, kann auch negativ sein) 

function angle (x, y, a) {
  var r = 20;                                              // Radius (Pixel)
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  ctx.lineTo(x+r,y);                                       // Linie nach rechts
  ctx.arc(x,y,r,0,-a,a>0);                                 // Kreisbogen
  ctx.closePath();                                         // Zurück zum Scheitel
  ctx.fillStyle = colorAngle;                              // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Kreissektor ausfüllen, Rand zeichnen
  }
  
// Streuender Atomkern und Alphateilchen:
// Seiteneffekt outside

function nuclei () {
  circle(x0,y0,6,colorNucleus);                            // Streuender Atomkern
  if (p > 0) {                                             // Falls Stoßparameter größer als 0 ...
    var phiHor = phi+(Math.PI-theta)/2;                    // Winkel gegenüber der Waagrechten (Bogenmaß)
    var pos = position(phiHor);                            // Position Alphateilchen
    circle(pos.x,pos.y,4,colorNucleus);                    // Alphateilchen
    outside = isOutside(pos.x,pos.y);                      // Überprüfung, ob Bildbereich verlassen
    }
  else {                                                   // Falls Stoßparameter gleich 0 ...
    var x = x0-radius*PIX;                                 // Waagrechte Bildschirmkoordinate (Pixel)
    circle(x,y0,4,colorNucleus);                           // Alphateilchen
    var tt = tStart+t/SLOW;                                // Reale Zeit (s)
    outside = isOutside(x,y0);                             // Überprüfung, ob Bildbereich verlassen
    }
  }
  
// Hilfsroutine: Bildschirmkoordinaten des Hyperbelmittelpunkts (Pixel)

function centerHyperbola () {
  var rPix = PIX*p/cos;                                    // Abstand vom streuenden Atomkern (Pixel)
  return {x: x0-rPix*sin, y: y0-rPix*cos};                 // Rückgabewert (Verbund mit Attributen x und y)
  }
  
// Hilfsroutine: Gerade durch Punkt mit gegebenem Winkel 
// (x,y) ... Koordinaten des Punkts
// w ....... Winkel gegenüber der Waagrechten (Bogenmaß, Gegenuhrzeigersinn)
  
function linePointAngle (x, y, w) {
  var dx = 1000*Math.cos(w), dy = 1000*Math.sin(w);        // Richtungsvektor
  line(x-dx,y+dy,x+dx,y-dy,colorAsymptote);                // Gerade zeichnen
  }

// Asymptoten:

function asymptotes () {
  var c = centerHyperbola();                               // Mittelpunkt der Hyperbel (Attribute x und y, Pixel)                         
  var y = y0-p*PIX;                                        // Senkrechte Bildschirmkoordinate für 1. Asymptote (Pixel)
  line(0,y,width,y,colorAsymptote);                        // 1. Asymptote für Anfang der Bewegung (waagrecht)
  if (p == 0) return;                                      // Falls zentraler Stoß, abbrechen 
  linePointAngle(c.x,c.y,theta);                           // 2. Asymptote für Ende der Bewegung (schräg)                    
  }
  
// Darstellung Stoßparameter:

function parameterScattering () {
  line(0,y0,width,y0,colorAsymptote);                      // 1. Vergleichslinie (waagrecht durch streuenden Atomkern)
  line(50,y0,50,y0-PIX*p,colorParameter,2.5);              // Stoßparameter für Anfang der Bewegung
  linePointAngle(x0,y0,theta);                             // 2. Vergleichslinie (schräg durch streuenden Atomkern)
  var dPix = width/2-50;                                   // Abstand (Pixel)
  var sin = Math.sin(theta), cos = Math.cos(theta);        // Trigonometrische Werte
  var x1 = x0+dPix*cos, y1 = y0-dPix*sin;                  // Anfangspunkt Stoßparameter für Ende der Bewegung
  var pPix = PIX*p;                                        // Stoßparameter (Pixel)
  var x2 = x1-pPix*sin, y2 = y1-pPix*cos;                  // Endpunkt Stoßparameter für Ende der Bewegung 
  line(x1,y1,x2,y2,colorParameter,2.5);                    // Stoßparameter für Ende der Bewegung
  }
  
// Darstellung Streuwinkel:

function angleScattering () {
  var c = centerHyperbola();                               // Mittelpunkt der Hyperbel (Attribute x und y, Pixel)      
  angle(c.x,c.y,theta);                                    // Winkelmarkierung
  }
  
// Hintergrundzeichnung vorbereiten:
// Seiteneffekt cvBG, ctxBG

function initBackground () {
  cvBG = document.createElement("canvas");                 // Neues Canvas-Element
  cvBG.width = width; cvBG.height = height;                // Abmessungen übernehmen
  ctxBG = cvBG.getContext("2d");                           // Grafikkontext
  ctxBG.fillStyle = colorBackground;                       // Hintergrundfarbe
  ctxBG.fillRect(0,0,width,height);                        // Hintergrund ausfüllen
  }

// Grafikausgabe: 
// Seiteneffekt t, t0, phi, radius, outside, ready 
  
function paint () {
  ctx.drawImage(cvBG,0,0);                                 // Hintergrundzeichnung (bisherige Bahnen) übertragen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // Länge des Zeitintervalls (s)
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  var tReal = tStart+t/SLOW;                               // Reale Zeit (s)
  if (p > 0) phi = getPhi(tReal);                          // Entweder Positionswinkel Alphateilchen (Bogenmaß) ...
  else radius = getRadius(tReal);                          // ... oder Abstand vom streuenden Atomkern (m)
  if (cb1.checked || cb2.checked) asymptotes();            // Falls gewünscht, Asymptoten
  if (cb1.checked) parameterScattering();                  // Falls gewünscht, Stoßparameter
  if (cb2.checked) angleScattering();                      // Falls gewünscht, Streuwinkel
  if (p > 0) orbitPart(); else orbit0Part();               // Bahn des Alphateilchens (unvollständig)
  nuclei();                                                // Streuender Atomkern und Alphateilchen
  if (!ready & outside) {                                  // Falls Alphateilchen Bildrand überschritten hat ...
    if (p > 0) orbit(); else orbit0();                     // Vollständige Bahn (Hyperbel oder gerade Linie, im Hintergrund)
    ready = true;                                          // Flag setzen
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen





