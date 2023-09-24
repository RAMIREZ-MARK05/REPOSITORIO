// Rutherford-Streuung
// 07.05.2020 - 17.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel rutherfordscattering_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorNucleus = "#ff0000";                              // Farbe f�r Atomkerne
var colorAsymptote = "#808080";                            // Farbe f�r Asymptoten und Hilfslinien
var colorParameter = "#0000ff";                            // Farbe f�r Sto�parameter
var colorAngle = "#00ffff";                                // Farbe f�r Winkelmarkierung

// Sonstige Konstanten:

var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var E = 1.602176634e-19;                                   // Elementarladung (C)
var EPS0 = 8.8541878128e-12;                               // Elektrische Feldkonstante (C/(Vm))
var M = 6.6446573357e-27;                                  // Masse Alphateilchen (kg)
var PIX = 2.0e15;                                          // Umrechnungsfaktor (Pixel pro Meter)
var SLOW = 4.0e20;                                         // Faktor der Zeitlupe
var IT = 10;                                               // Zahl der Teilintervalle (f�r Romberg-Verfahren)
var N = 1000;                                              // Zahl der Teilintervalle f�r lineare Interpolation
var DX = 5;                                                // Abstand der Startposition vom linken Bildrand (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var cvBG, ctxBG;                                           // Hintergrundzeichnung, zugeh�riger Grafikkontext
var bu1, bu2;                                              // Schaltkn�pfe
var ip1, ip2, ip3;                                         // Eingabefelder
var op1, op2;                                              // Ausgabefelder
var cb1, cb2;                                              // Optionsfelder
var on;                                                    // Flag f�r Bewegung
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var timer;                                                 // Timer f�r Animation
var x0, y0;                                                // Bildschirmkoordinaten Ursprung (Pixel)
var z;                                                     // Kernladungszahl (streuender Atomkern)
var p;                                                     // Sto�parameter (m)
var v;                                                     // Geschwindigkeit (m/s)
var constE;                                                // Gesamtenergie (J)
var constL;                                                // Drehimpuls (kg m^2/s)
var k1;                                                    // Konstante f�r Coulomb-Gesetz (SI)
var k2;                                                    // Konstante f�r Zentrifugalpotential (SI)
var k3;                                                    // Konstante f�r Integralberechnung (SI)
var theta;                                                 // Streuwinkel (Bogenma�)
var sin, cos;                                              // Trigonometrische Werte f�r halben Streuwinkel
var epsHyp;                                                // Numerische Exzentrizit�t der Hyperbel
var hpHyp;                                                 // Halbparameter der Hyperbel (m)
var tStart;                                                // Zeitpunkt linker Bildrand (s)
var outside;                                               // Flag f�r Verlassen des Bildbereichs
var ready;                                                 // Flag f�r abgeschlossenen Einzelversuch
var arrayT;                                                // Array f�r Werte der Zeit (s)
var arrayPhi;                                              // Array f�r Werte des Positionswinkels (Bogenma�)
var arrayR;                                                // Array f�r Werte des Abstands (m)
var phi;                                                   // Positionswinkel Alphateilchen (Bogenma�, bez�glich Hauptachse)
var radius;                                                // Abstand bei zentralem Sto� (m)             

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
  x0 = width/2; y0 = 300;                                  // Bildschirmkoordinaten Ursprung (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  initBackground();                                        // Hintergrundzeichnung vorbereiten
  bu1 = getElement("bu1",text01);                          // Resetknopf
  bu2 = getElement("bu2",text02);                          // Startknopf 
  getElement("lb1",text03);                                // Erkl�render Text (streuender Atomkern)
  getElement("ip1a",text04);                               // Erkl�render Text (Kernladungszahl)
  ip1 = getElement("ip1b");                                // Eingabefeld (Kernladungszahl)
  getElement("lb2",text05);                                // Erkl�render Text (Alphateilchen)
  getElement("ip2a",text06);                               // Erkl�render Text (Geschwindigkeit)
  ip2 = getElement("ip2b");                                // Eingabefeld (Geschwindigkeit)
  getElement("ip2c",kilometerPerSecond);                   // Einheit (Geschwindigkeit)
  getElement("ip3a",text07);                               // Erkl�render Text (Sto�parameter)
  ip3 = getElement("ip3b");                                // Eingabefeld (Sto�parameter)
  getElement("ip3c",femtometer);                           // Einheit (Sto�parameter)
  getElement("op1a",text08);                               // Erkl�render Text (Streuwinkel)
  op1 = getElement("op1b");                                // Ausgabefeld (Streuwinkel)
  getElement("op1c",degree);                               // Einheit (Streuwinkel)
  getElement("op2a",text09);                               // Erkl�render Text (minimaler Abstand)
  op2 = getElement("op2b");                                // Ausgabefeld (minimaler Abstand)
  getElement("op2c",femtometer);                           // Einheit (minimaler Abstand)  
  cb1 = getElement("cb1");                                 // Optionsfeld (Asymptoten, Sto�parameter)
  cb1.checked = false;                                     // Optionsfeld zun�chst ohne H�kchen
  getElement("lbPar",text10);                              // Erkl�render Text (Asymptoten, Sto�parameter)
  cb2 = getElement("cb2");                                 // Optionsfeld (Asymptoten, Streuwinkel)
  cb2.checked = false;                                     // Optionsfeld zun�chst ohne H�kchen
  getElement("lbAng",text11);                              // Erkl�render Text (Asymptoten, Streuwinkel)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
    
  on = false;                                              // Animation zun�chst abgeschaltet
  t = 0;                                                   // Zeitvariable (s) 
  z = 79;                                                  // Kernladungszahl (Gold)
  p = 1.0e-14;                                             // Sto�parameter (m)
  v = 3.0e7;                                               // Geschwindigkeit (m/s)
  updateInput();                                           // Eingabefelder aktualisieren 
  enableInput(true);                                       // Eingabe zun�chst uneingeschr�nkt m�glich  
  calculation();                                           // Berechnungen (Seiteneffekt!)
  focus(ip1);                                              // Fokus f�r erstes Eingabefeld
  paint();                                                 // Zeichnen    
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Zur�ck)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Kernladungszahl)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Geschwindigkeit)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Sto�parameter)
  ip1.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Kernladungszahl)
  ip2.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Geschwindigkeit)
  ip3.onblur = reactionBlur;                               // Reaktion auf Verlust des Fokus (Sto�parameter)
  cb1.onclick = paint;                                     // Reaktion auf oberes Optionsfeld (Asymptoten, Sto�parameter)
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
  t = 0;                                                   // Zeitvariable zur�cksetzen
  reaction();                                              // Eingegebene Werte �bernehmen und rechnen
  paint();                                                 // Neu zeichnen
  focus(ip1);                                              // Fokus f�r das erste Eingabefeld
  }
  
// Reaktion auf den Startknopf:
// Seiteneffekt t, on, timer, t0, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
// Wirkung auf Ein- und Ausgabefelder

function reactionStart () {
  enableInput(false);                                      // Nur noch Eingabe des Sto�parameters m�glich
  t = 0;                                                   // Zeitvariable zur�cksetzen
  startAnimation();                                        // Animation starten
  reaction();                                              // Eingegebene Werte �bernehmen und rechnen
  }
  
// Hilfsroutine: Eingabe �bernehmen und rechnen
// Seiteneffekt z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
// Wirkung auf Ein- und Ausgabefelder

function reaction () {
  input();                                                 // Eingegebene Werte �bernehmen (eventuell korrigiert)
  calculation();                                           // Berechnungen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt t, on, timer, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready
  
function reactionEnter (e) {
  t = 0;                                                   // Zeitvariable zur�cksetzen 
  stopAnimation();                                         // Animation stoppen
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag f�r Enter-Taste
  if (enter) reaction();                                   // Falls Enter-Taste, Daten �bernehmen und rechnen
  outside = ready = false;                                 // Flags l�schen                        
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Verlust des Fokus:
// Seiteneffekt t, on, timer, z, v, p, k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, 
// tStart, outside, ready

function reactionBlur () {
  t = 0;                                                   // Zeitvariable zur�cksetzen 
  stopAnimation();                                         // Animation stoppen
  reaction();                                              // Daten �bernehmen und rechnen
  outside = ready = false;                                 // Flags l�schen                        
  paint();                                                 // Neu zeichnen
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
  if (timer) clearInterval(timer);                         // Timer deaktivieren
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
  
// Aktivierung/Deaktivierung der Eingabefelder:
// a ... Flag f�r Aktivierung aller drei Eingabefelder

function enableInput (a) {
  ip1.readOnly = !a;                                       // Eingabefeld f�r Kernladungszahl
  ip2.readOnly = !a;                                       // Eingabefeld f�r Geschwindigkeit
  ip3.readOnly = false;                                    // Eingabefeld f�r Sto�parameter
  }
   
// Gesamte Eingabe:
// Seiteneffekt z, v, p

function input () {
  var ae = document.activeElement;                         // Aktives Element
  z = inputNumber(ip1,0,true,50,100);                      // Kernladungszahl
  v = 1000*inputNumber(ip2,0,true,10000,50000);            // Geschwindigkeit (m/s)
  p = inputNumber(ip3,1,true,0,50)*1.0e-15;                // Sto�parameter (m)
  if (ae == ip1) focus(ip2);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus f�r n�chstes Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(z,0,true);                          // Kernladungszahl
  ip2.value = ToString(v/1000,0,true);                     // Geschwindigkeit (km/s)
  ip3.value = ToString(p*1e15,1,true);                     // Sto�parameter (fm)
  }
  
// Berechnungen:
// Seiteneffekt k1, constE, constL, k2, theta, sin, cos, epsHyp, hpHyp, k3, arrayT, arrayPhi, arrayR, tStart, outside, ready
// Wirkung auf Ausgabefelder

function calculation () {
  k1 = 2*z*E*E/(4*Math.PI*EPS0);                           // Konstante f�r Coulomb-Gesetz (SI)
  constE = M*v*v/2;                                        // Gesamtenergie (J)
  constL = M*v*p;                                          // Drehimpuls (kg m^2/s)
  k2 = constL*constL/(2*M);                                // Konstante f�r Zentrifugalpotential (SI)
  var tan = k1/(M*v*v*p);                                  // Tangens des halben Streuwinkels (kann unendlich sein)
  theta = 2*Math.atan(tan);                                // Streuwinkel (Bogenma�)
  sin = Math.sin(theta/2);                                 // Sinus des halben Streuwinkels
  cos = Math.cos(theta/2);                                 // Cosinus des halben Streuwinkels
  // Hinweis: aHyp = p*tan; bHyp = p; eHyp = p/cos;
  // Hinweis: rMin = eHyp+aHyp;
  epsHyp = 1/sin;                                          // Numerische Exzentrizit�t
  hpHyp = p/tan;                                           // Halbparameter
  k3 = M*hpHyp*hpHyp/constL;                               // Konstante f�r Integralberechnung
  op1.innerHTML = ToString(theta/DEG,1,true);              // Ausgabefeld f�r Streuwinkel aktualisieren
  var rMin = (p>0 ? p/cos+p*tan : k1/constE);              // Minimaler Abstand (m)
  op2.innerHTML = ToString(rMin*1e15,1,true);              // Ausgabefeld f�r minimalen Abstand aktualisieren
  arrayT = new Array(N+1);                                 // Array f�r Werte der Zeit
  arrayT[0] = 0;                                           // Array-Element f�r Punkt der gr��ten Ann�herung
  if (p > 0) {                                             // Falls Sto�parameter positiv ...
    arrayPhi = new Array(N+1);                             // Array f�r Werte des Positionswinkels
    arrayPhi[0] = 0;                                       // Array-Element f�r Punkt der gr��ten Ann�herung
    var dw = Math.PI/N;                                    // Schrittweite Winkel (Bogenma�)
    for (var i=1; i<=N; i++) {                             // F�r alle Indizes ...
      var w = i*dw;                                        // Winkel (Bogenma�)
      arrayT[i] = romberg(value,0,w);                      // Array-Element f�r Zeit
      arrayPhi[i] = w;                                     // Array-Element f�r zugeh�rigen Winkel (Bogenma�)
      }
    }
  else {                                                   // Falls Sto�parameter gleich 0 ...
    arrayR = new Array(N +1);                              // Array f�r Werte des Abstands
    arrayR[0] = rMin;                                      // Array-Element f�r Punkt der gr��ten Ann�herung
    for (i=1; i<=N; i++) {                                 // F�r alle Indizes ...
      var t = i*1.0e-22;                                   // Reale Zeit (s)
      arrayT[i] = t;                                       // Array-Element f�r Zeit
      arrayR[i] = getDistance(t);                          // Array-Element f�r Abstand
      }
    }
  tStart = getTime1();                                     // Startzeitpunkt (real, in s)
  outside = ready = false;                                 // Flags l�schen
  }
  
// Positionsberechnung f�r Alphateilchen:
// phiHor ... Winkel gegen�ber der Waagrechten (Bogenma�)
// R�ckgabewert: Verbund mit Attributen x, y (Bildschirmkoordinaten)
  
function position (phiHor) {
  var phi = phiHor-(Math.PI-theta)/2;                      // Winkel gegen�ber der Hauptachse (Bogenma�)
  var rPix = hpHyp*PIX/Math.abs(1-epsHyp*Math.cos(phi));   // Abstand f�r Polarkoordinaten (Pixel)
  var xT = x0-rPix*Math.cos(phiHor);                       // Waagrechte Koordinate (Pixel)
  xT = Math.max(xT,-DX);                                   // Zu kleine Werte von xT verhindern
  var yT = y0-rPix*Math.sin(phiHor);                       // Senkrechte Koordinate (Pixel)
  return {x: xT, y: yT};                                   // R�ckgabewert
  }
  
// Integrand zur Berechnung von phi:
  
function value (x) {
  var h = epsHyp*Math.cos(x)-1;                            // Hilfsgr��e
  return k3/(h*h);                                         // R�ckgabewert
  }
  
// Simpson-N�herung f�r bestimmtes Integral:
// f ... Funktion
// a ... Untere Grenze
// b ... Obere Grenze (mit b > a)
// n ... Zahl der Teilintervalle (gerade nat�rliche Zahl)
  
function simpson (f, a, b, n) {
  var h = (b-a)/n;                                         // Breite eines Teilintervalls
  var s = f(a)+f(b);                                       // Summe f(a) + f(b)
  for (var i=1; i<n; i+=2)                                 // F�r alle ungeraden Indizes ...
    s += 4*f(a+i*h);                                       // Vierfachen Funktionswert addieren
  for (i=2; i<n; i+=2)                                     // F�r alle geraden Indizes ...
    s += 2*f(a+i*h);                                       // Doppelten Funktionswert addieren
  return s*h/3;                                            // R�ckgabewert
  }
    
// Romberg-N�herung f�r bestimmtes Integral:
// f ... Funktion
// a ... Untere Grenze
// b ... Obere Grenze (mit b > a)
  
function romberg (f, a, b) {
  var n = 2;                                               // Zahl der Teilintervalle, Startwert
  var t = new Array(IT+1);                                 // Array f�r Zwischenergebnisse
  for (var k=0; k<=IT; k++) {                              // F�r alle Iterationen ...
    n *= 2;                                                // Zahl der Teilintervalle verdoppeln
    t[k] = simpson(f,a,b,n);                               // Simpson-N�herung speichern
    var q = 1;
    for (var i=k-1; i>=0; i--) {
      q *= 4;
      t[i] = t[i+1]+(t[i+1]-t[i])/(q-1);
      }
    } // Ende for (k)
  return t[0];                                             // R�ckgabewert
  }
  
// Lineare Interpolation:
// a1 ... Array mit aufsteigend sortierten Werten der ersten Gr��e (unabh�ngige Variable)
// a2 ... Array mit Werten der zweiten Gr��e (abh�ngige Variable)
// v1 ... Gegebener Wert der ersten Gr��e

function linearInterpolation (a1, a2, v1) {
  var v1L = a1[0];                                         // Untere Intervallgrenze (unabh�ngige Variable)
  var v2L = a2[0];                                         // Zugeh�riger Wert der abh�ngigen Variablen 
  var n = a1.length;                                       // L�nge des ersten Arrays
  if (v1 < a1[0] || v1 > a1[n]) return undefined;          // Extrapolation verhindern
  for (var i=1; i<n; i++) {                                // F�r alle Indizes ab 1 ...
    var v1R = a1[i];                                       // Obere Intervallgrenze (unabh�ngige Variable)
    var v2R = a2[i];                                       // Zugeh�riger Wert der abh�ngigen Variablen
    if (v1 <= v1R) {                                       // Falls gegebener Wert im Intervall ...
      var q = (v1-v1L)/(v1R-v1L);                          // Quotient (0 bis 1)
      return v2L+q*(v2R-v2L);                              // R�ckgabewert
      }
    v1L = v1R; v2L = v2R;                                  // Obere Intervallgrenze wird untere Intervallgrenze
    }
  }
  
// Positionswinkel als Funktion der Zeit (lineare Interpolation):
// t ... Zeit (s) seit Durchlaufen der Hyperbel-Hauptachse

function getPhi (t) {
  if (t < 0)                                               // Falls 1. Teil der Streuvorgangs ... 
    return -linearInterpolation(arrayT,arrayPhi,-t);       // R�ckgabewert (Symmetrieeigenschaft phi(-t) = -phi(t))
  else return linearInterpolation(arrayT,arrayPhi,t);      // R�ckgabewert f�r 2. Teil des Streuvorgangs
  }
  
// F�r zentralen Sto�: Abstand als Funktion der Zeit
// Berechnung mithilfe des Kraftgesetzes und der Formeln f�r konstante Beschleunigung
// t ... Zeit seit der gr��ten Ann�herung (s)

function getDistance (t) {
  if (t < 0) return getRadius(-t);                         // R�ckgabewert f�r negatives t
  var n = 100;                                             // Zahl der Zeitintervalle
  var dt = t/n;                                            // L�nge eines Zeitintervalls (s)
  var r = k1/constE;                                       // Minimaler Abstand als Startwert
  var v0 = 0;                                              // Anfangsgeschwindigkeit (m/s)
  var h1 = k1/M, h2 = dt/2;                                // Hilfsgr��en
  for (var i=1; i<=n; i++) {                               // F�r alle Zeitintervalle ...
    var a = h1/(r*r);                                      // Beschleunigung (m/s�)
    var v = v0+a*dt;                                       // Endgeschwindigkeit (m/s)
    r += (v0+v)*h2;                                        // Neuer Abstand (m)
    v0 = v;                                                // Endgeschwindigkeit wird Anfangsgeschwindigkeit
    }
  return r;                                                // R�ckgabewert (m)
  }
  
// F�r zentralen Sto�: Abstand als Funktion der Zeit
  
function getRadius (t) {
  return linearInterpolation(arrayT,arrayR,Math.abs(t));   // R�ckgabewert (m)
  }
  
// Reale Zeit (s) f�r die Bewegung vom linken Bildrand bis zum Punkt mit minimalem Abstand:

function getTime1 () {
  if (p > 0) {                                             // Falls Sto�parameter positiv ...
    var xP = -DX, yP = y0-PIX*p;                           // Punkt am linken Rand (knapp au�erhalb, Pixel)
    var phiHor = Math.atan((y0-yP)/(x0-xP));               // Winkel gegen�ber der Waagrechten (Bogenma�)
    var phi = phiHor-(Math.PI-theta)/2;                    // Positionswinkel (Bogenma�, bez�glich Hauptachse)
    return romberg(value,0,phi);                           // R�ckgabewert
    }
  else {                                                   // Falls Sto�parameter gleich 0 ...
    var rP = (width/2+DX)/PIX;                             // Abstand f�r Punkt am linken Rand (knapp au�erhalb, m)
    return -linearInterpolation(arrayR,arrayT,rP);         // R�ckgabewert
    }
  }
  
// �berpr�fung, ob das Alphateilchen den Bildbereich verlassen hat:
// x ... Waagrechte Bildschirmkoordinate (Pixel)
// y ... Senkrechte Bildschirmkoordinate (Pixel)
  
function isOutside (x, y) {
  if (x > width) return true;                              // R�ckgabewert, falls Teilchen zu weit rechts
  if (y < 0) return true;                                  // R�ckgabewert, falls Teilchen zu weit oben
  var tReal = tStart+t/SLOW;                               // Reale Zeit (s)
  if (tReal > 0 && x < 0) return true;                     // R�ckgabewert, falls Teilchen auf R�ckweg zu weit links
  return false;                                            // R�ckgabewert in allen anderen F�llen
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
// c ....... F�llfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // F�llfarbe
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (c) ctx.fill();                                       // Kreis ausf�llen, falls gew�nscht
  ctx.stroke();                                            // Rand zeichnen
  }
      
// Vollst�ndige Teilchenbahn f�r Normalfall (Hintergrundzeichnung, N�herung durch Polygonzug):

function orbit () {
  newPath(ctxBG);                                          // Neuer Grafikpfad (Hintergrundzeichnung, Standardwerte)
  var p = position(0);                                     // Position auf Hyperbel weit links
  ctxBG.moveTo(p.x,p.y);                                   // Anfangspunkt Polygonzug
  var dw = DEG/10;                                         // Schrittweite Winkel (Bogenma�)
  for (var i=1; i<=1800; i++) {                            // F�r alle Indizes ...
    var phi = i*dw;                                        // Positionswinkel (Bogenma�)
    if (phi >= Math.PI-theta) break;                       // Falls Winkel zu gro� (Asymptote), abbrechen
    p = position(phi);                                     // Neue Position auf Hyperbel
    ctxBG.lineTo(p.x,p.y);                                 // Linie zum Polygonzug hinzuf�gen
    }
  ctxBG.stroke();                                          // Polygonzug f�r Hyperbel zeichnen
  }
  
// Vollst�ndige Teilchenbahn f�r zentralen Sto� (Hintergrundzeichnung, gerade Linie):

function orbit0 () {
  newPath(ctxBG);                                          // Neuer Grafikpfad (Hintergrundzeichnung, Standardwerte)
  ctxBG.moveTo(x0-PIX*k1/constE,y0);                       // Umkehrpunkt als Anfangspunkt
  ctxBG.lineTo(0,y0);                                      // Endpunkt am linken Bildrand
  ctxBG.stroke();                                          // Linie zeichnen
  }
  
// Unvollst�ndige Teilchenbahn f�r Normalfall (N�herung durch Polygonzug):

function orbitPart () {
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  var p = position(0);                                     // Position auf Hyperbel weit links
  ctx.moveTo(p.x,p.y);                                     // Anfangspunkt Polygonzug
  var wRot = (Math.PI-theta)/2;                            // Drehwinkel Hyperbel (Bogenma�)
  var dw = DEG/10;                                         // Schrittweite Winkel (Bogenma�)
  for (var i=1; i<=1800; i++) {                            // F�r alle Indizes ...
    var w = i*dw;                                          // Positionswinkel (Bogenma�)
    if (w >= Math.PI-theta) break;                         // Falls Asymptote �berschritten, abbrechen
    w = Math.min(w,phi+wRot);                              // Korrektur, falls Teilchen erreicht
    if (w > phi+wRot) break;                               // Falls Winkel zu gro�, abbrechen
    p = position(w);                                       // Neue Position auf Hyperbel
    ctx.lineTo(p.x,p.y);                                   // Linie zum Polygonzug hinzuf�gen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Unvollst�ndige Teilchenbahn f�r zentralen Sto�:

function orbit0Part () {
  var tMin = Math.abs(tStart)*SLOW;                        // Wert der Zeitvariablen t f�r Umkehrpunkt
  var rPix = PIX*k1/constE;                                // Minimaler Abstand (Pixel)
  if (t <= tMin) line(0,y0,x0-radius*PIX,y0);              // Falls Hinweg, waagrechte Linie bis zum Teilchen
  else line(0,y0,x0-rPix,y0);                              // Falls R�ckweg, komplette waagrechte Linie
  } 
      
// Winkelmarkierung:
// x, y ... Scheitel
// a ...... Winkel gegen�ber der Waagrechten (Bogenma�, kann auch negativ sein) 

function angle (x, y, a) {
  var r = 20;                                              // Radius (Pixel)
  newPath(ctx);                                            // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  ctx.lineTo(x+r,y);                                       // Linie nach rechts
  ctx.arc(x,y,r,0,-a,a>0);                                 // Kreisbogen
  ctx.closePath();                                         // Zur�ck zum Scheitel
  ctx.fillStyle = colorAngle;                              // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Kreissektor ausf�llen, Rand zeichnen
  }
  
// Streuender Atomkern und Alphateilchen:
// Seiteneffekt outside

function nuclei () {
  circle(x0,y0,6,colorNucleus);                            // Streuender Atomkern
  if (p > 0) {                                             // Falls Sto�parameter gr��er als 0 ...
    var phiHor = phi+(Math.PI-theta)/2;                    // Winkel gegen�ber der Waagrechten (Bogenma�)
    var pos = position(phiHor);                            // Position Alphateilchen
    circle(pos.x,pos.y,4,colorNucleus);                    // Alphateilchen
    outside = isOutside(pos.x,pos.y);                      // �berpr�fung, ob Bildbereich verlassen
    }
  else {                                                   // Falls Sto�parameter gleich 0 ...
    var x = x0-radius*PIX;                                 // Waagrechte Bildschirmkoordinate (Pixel)
    circle(x,y0,4,colorNucleus);                           // Alphateilchen
    var tt = tStart+t/SLOW;                                // Reale Zeit (s)
    outside = isOutside(x,y0);                             // �berpr�fung, ob Bildbereich verlassen
    }
  }
  
// Hilfsroutine: Bildschirmkoordinaten des Hyperbelmittelpunkts (Pixel)

function centerHyperbola () {
  var rPix = PIX*p/cos;                                    // Abstand vom streuenden Atomkern (Pixel)
  return {x: x0-rPix*sin, y: y0-rPix*cos};                 // R�ckgabewert (Verbund mit Attributen x und y)
  }
  
// Hilfsroutine: Gerade durch Punkt mit gegebenem Winkel 
// (x,y) ... Koordinaten des Punkts
// w ....... Winkel gegen�ber der Waagrechten (Bogenma�, Gegenuhrzeigersinn)
  
function linePointAngle (x, y, w) {
  var dx = 1000*Math.cos(w), dy = 1000*Math.sin(w);        // Richtungsvektor
  line(x-dx,y+dy,x+dx,y-dy,colorAsymptote);                // Gerade zeichnen
  }

// Asymptoten:

function asymptotes () {
  var c = centerHyperbola();                               // Mittelpunkt der Hyperbel (Attribute x und y, Pixel)                         
  var y = y0-p*PIX;                                        // Senkrechte Bildschirmkoordinate f�r 1. Asymptote (Pixel)
  line(0,y,width,y,colorAsymptote);                        // 1. Asymptote f�r Anfang der Bewegung (waagrecht)
  if (p == 0) return;                                      // Falls zentraler Sto�, abbrechen 
  linePointAngle(c.x,c.y,theta);                           // 2. Asymptote f�r Ende der Bewegung (schr�g)                    
  }
  
// Darstellung Sto�parameter:

function parameterScattering () {
  line(0,y0,width,y0,colorAsymptote);                      // 1. Vergleichslinie (waagrecht durch streuenden Atomkern)
  line(50,y0,50,y0-PIX*p,colorParameter,2.5);              // Sto�parameter f�r Anfang der Bewegung
  linePointAngle(x0,y0,theta);                             // 2. Vergleichslinie (schr�g durch streuenden Atomkern)
  var dPix = width/2-50;                                   // Abstand (Pixel)
  var sin = Math.sin(theta), cos = Math.cos(theta);        // Trigonometrische Werte
  var x1 = x0+dPix*cos, y1 = y0-dPix*sin;                  // Anfangspunkt Sto�parameter f�r Ende der Bewegung
  var pPix = PIX*p;                                        // Sto�parameter (Pixel)
  var x2 = x1-pPix*sin, y2 = y1-pPix*cos;                  // Endpunkt Sto�parameter f�r Ende der Bewegung 
  line(x1,y1,x2,y2,colorParameter,2.5);                    // Sto�parameter f�r Ende der Bewegung
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
  cvBG.width = width; cvBG.height = height;                // Abmessungen �bernehmen
  ctxBG = cvBG.getContext("2d");                           // Grafikkontext
  ctxBG.fillStyle = colorBackground;                       // Hintergrundfarbe
  ctxBG.fillRect(0,0,width,height);                        // Hintergrund ausf�llen
  }

// Grafikausgabe: 
// Seiteneffekt t, t0, phi, radius, outside, ready 
  
function paint () {
  ctx.drawImage(cvBG,0,0);                                 // Hintergrundzeichnung (bisherige Bahnen) �bertragen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // L�nge des Zeitintervalls (s)
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  var tReal = tStart+t/SLOW;                               // Reale Zeit (s)
  if (p > 0) phi = getPhi(tReal);                          // Entweder Positionswinkel Alphateilchen (Bogenma�) ...
  else radius = getRadius(tReal);                          // ... oder Abstand vom streuenden Atomkern (m)
  if (cb1.checked || cb2.checked) asymptotes();            // Falls gew�nscht, Asymptoten
  if (cb1.checked) parameterScattering();                  // Falls gew�nscht, Sto�parameter
  if (cb2.checked) angleScattering();                      // Falls gew�nscht, Streuwinkel
  if (p > 0) orbitPart(); else orbit0Part();               // Bahn des Alphateilchens (unvollst�ndig)
  nuclei();                                                // Streuender Atomkern und Alphateilchen
  if (!ready & outside) {                                  // Falls Alphateilchen Bildrand �berschritten hat ...
    if (p > 0) orbit(); else orbit0();                     // Vollst�ndige Bahn (Hyperbel oder gerade Linie, im Hintergrund)
    ready = true;                                          // Flag setzen
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen





