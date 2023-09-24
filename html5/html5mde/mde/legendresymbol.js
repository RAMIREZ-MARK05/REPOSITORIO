// Online-Rechner Legendre-Symbol
// 26.06.2023 - 26.07.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel legendresymbol_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe

// Weitere Konstanten:

var MAX = 1000000;                                        // Maximum f�r Eingabefelder
var FONT = "normal normal bold 12px sans-serif";          // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ip1, ip2;                                              // Eingabefelder
var bu;                                                    // Schaltknopf
var n1, n2;                                                // Gegebene Zahlen
var qr;                                                    // Ergebnis quadratischer Rest
var ls;                                                    // Ergebnis Legendre-Symbol
var js;                                                    // Ergebnis Jacobi-Symbol
var ks;                                                    // Ergebnis Kronecker-Symbol

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
  n1 = 1; n2 = 3;                                          // Gegebene Zahlen
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  getElement("lb1",text01);                                // Erkl�render Text (1. Zahl)
  ip1 = getElement("ip1");                                 // Eingabefeld (1. Zahl)
  getElement("lb2",text02);                                // Erkl�render Text (2. Zahl)
  ip2 = getElement("ip2");                                 // Eingabefeld (2. Zahl)
  bu = getElement("bu",text03);                            // Schaltknopf (OK)
  getElement("author",author);                             // Autor                                            
  getElement("translator",translator);                     // �bersetzer  
  ip1.value = String(n1);                                  // 1. Eingabefeld initialisieren
  ip2.value = String(n2);                                  // 2. Eingabefeld initialisieren
  reaction();                                              // Rechnung und Ausgabe                                           
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (1. Eingabefeld)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (2. Eingabefeld)
  bu.onclick = reaction;                                   // Reaktion auf Schaltknopf
  
  } // Ende der Methode start
  
//-------------------------------------------------------------------------------------------------

// Eingabe einer Zahl:
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma durch Punkt ersetzen
  var n = Math.round(Number(s));                           // Umwandlung in ganze Zahl, falls m�glich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = String(n);                                    // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }
  
// Reaktion auf Eingabe:
// Seiteneffekt n1, n2, qr, ls, js, ks

function reaction () {
  n1 = inputNumber(ip1,-MAX,MAX);                          // Obere Zahl aus Eingabefeld
  n2 = inputNumber(ip2,-MAX,MAX);                          // Untere Zahl aus Eingabefeld
  qr = quadraticResidue(n1,n2);                            // 0, -1, "Quadratwurzel" oder undefined
  ls = legendre(n1,n2);                                    // Legendre-Symbol oder undefined
  js = jacobi(n1,n2);                                      // Jacobi-Symbol oder undefined
  ks = kronecker(n1,n2);                                   // Kronecker-Symbol oder undefined
  paint();                                                 // Grafikausgabe neu
  if (ks == undefined) return;                             // Falls Kronecker-Symbol undefiniert, abbrechen
  var q = (qr > 0 ? 1 : qr);                               // Zahl (1 f�r Rest, -1 f�r Nichtrest, 0 f�r gemeinsamen Teiler)
  if (q != undefined && ls != undefined && q != ls)        // Falls Widerspruch zwischen q und Legendre-Symbol ...
    alert(error+" 1");                                     // Fehlermeldung
  if (ls != undefined && ls != ks)                         // Falls Widerspruch zwischen Legendre- und Kronecker-Symbol ...
    alert(error+" 2");                                     // Fehlermeldung
  if (js != undefined && js != ks)                         // Falls Widerspruch zwischen Jacobi- und Kronecker-Symbol ...
    alert(error+" 3");                                     // Fehlermeldung
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n1, n2, qr, ls, js, ks
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    reaction();                                            // ... Daten �bernehmen, rechnen, Ausgabe aktualisieren
  }
  
//-------------------------------------------------------------------------------------------------

// Umwandlung einer ganzen Zahl in eine Zeichenkette:

function ToString (k) {
  return (String(k)).replace("-",symbolNeg);               // R�ckgabewert
  }
  
// �berpr�fung der Ganzzahligkeit:
// x ... Argument

function isInteger (x) {
  if (x == undefined) return false;                        // R�ckgabe, falls Argument undefiniert
  x = Number(x);                                           // Umwandlung in Zahl
  if (isNaN(x)) return false;                              // R�ckgabewert, falls Umwandlung misslungen
  return (Math.floor(x) == x);                             // R�ckgabewert (Normalfall)
  }

// Kleinster Primfaktor:
// n ... Nat�rliche Zahl gr��er als 1 (keine Absicherung!)

function firstPrime (n) {
  if (n < 2) return undefined;                             // R�ckgabewert, falls Zahl kleiner als 2
  for (var t=2; t<=Math.sqrt(n); t++)                      // F�r alle potentiellen Teiler ...
    if (n%t == 0) return t;                                // R�ckgabewert, falls Primfaktor gefunden
  return n;                                                // R�ckgabewert, falls Primzahl
  }
  
// �berpr�fung der Primzahleigenschaft:
// n ... Ganze Zahl (keine Absicherung!)
	
function isPrime (n) {
  if (n <= 1) return false;                                // R�ckgabewert, falls n <= 1
  return (firstPrime(n) == n);                             // R�ckgabewert, falls n >= 2
  }
  
// Exponent eines Primfaktors:
// n ... Nat�rliche Zahl (keine Absicherung!)
// p ... Primfaktor (keine Absicherung!)
  
function exponent (n, p) {
  var e = 0;                                               // Startwert Exponent
  while (n > 1) {                                          // Solange Zahl gr��er als 1 ...
    if (n%p != 0) return e;                                // R�ckgabewert, falls Division nicht aufgeht
    n /= p;                                                // Division durch Primfaktor                                                 
    e++;                                                   // Exponent erh�hen
    }
  return e;                                                // R�ckgabewert
  }

// Zerlegung in Faktoren:
// n ... Ganze Zahl (keine Absicherung!)
// k ... Flag f�r Kronecker-Symbol
// R�ckgabewert: Zweifach indiziertes Array; die Elemente sind einfach indizierte Arrays, die jeweils aus einer Einheit oder einem Primfaktor
// und dem zugeh�rigen Exponenten bestehen.
  
function factors (n, k) {
  var a = [];                                             // Leeres Array
  if (k && n > 0) a.push([1,0]);                          // Gegebenenfalls Array f�r Einheit 1
  if (k && n < 0) a.push([-1,0]);                         // Gegebenenfalls Array f�r Einheit -1
  n = Math.abs(n);                                        // Betrag der gegebenen Zahl
  while (n > 1) {                                         // Solange Zahl gr��er als 1 ...
    var f = firstPrime(n);                                // Kleinster Primfaktor
    var e = exponent(n,f);                                // Zugeh�riger Exponent
    for (var i=0; i<e; i++) n /= f;                       // Division durch Potenz des Primfaktors
    a.push([f,e]);                                        // Zum Array hinzuf�gen
    }
  return a;                                               // R�ckgabewert
  }
    
// Gr��ter gemeinsamer Teiler (euklidischer Algorithmus):
// a, b ... Gegebene Zahlen (ganz, keine Absicherung!)
  
function gcd (a, b) {
  a = Math.abs(a); b = Math.abs(b);                        // Betr�ge
  var c = a%b;                                             // Divisionsrest
  while (c != 0) {                                         // Solange Rest ungleich 0 ...
    a = b; b = c;                                          // Rollentausch
    c = a%b;                                               // Neuer Divisionsrest
    }
  return b;                                                // R�ckgabewert
  }
  
// Gleichwertige Zahl:
// x ... Ganze Zahl (keine Absicherung!)
// y ... Nat�rliche Zahl (keine Absicherung!)
// R�ckgabewert: Zahl aus dem Bereich 0 bis y-1, die sich von x um ein ganzzahliges Vielfaches von y unterscheidet
    
function mod (x, y) {
  var r = x%y;                                             // Rest (eventuell negativ)
  return (r >= 0 ? r : r+y);                               // R�ckgabewert
  }
  
// Quadratischer Rest bzw. Nichtrest, primitive Methode:
// x ... Obere Zahl (ganz)
// y ... Untere Zahl (nat�rlich)
// R�ckgabewert:
// "Quadratwurzel", falls x quadratischer Rest modulo y
// -1, falls x quadratischer Nichtrest modulo y
// 0, falls x und y nicht teilerfremd
// Die for-Schleife geht nicht bis y, sondern nur bis y/2, weil die Quadrate von k und y-k kongruent modulo y sind.
  
function quadraticResidue (x, y) {
  if (!isInteger(x)) return undefined;                     // R�ckgabewert, falls oben keine ganze Zahl
  if (!isInteger(y)) return undefined;                     // R�ckgabewert, falls unten keine ganze Zahl
  if (y < 2) return undefined;                             // R�ckgabewert, falls unten Zahl kleiner 2
  x = mod(x,y);                                            // Gleichwertiges x (Periodizit�t)
  if (gcd(x,y) > 1) return 0;                              // R�ckgabewert, falls x und y nicht teilerfremd
  for (var k=1; k<=y/2; k++)                               // F�r 1 bis y/2 ...
    if (k*k%y == x) return k;                              // R�ckgabewert, falls x quadratischer Rest modulo y
  return -1;                                               // R�ckgabewert, falls x quadratischer Nichtrest modulo y                       
  }
  
// Legendre-Symbol, Berechnung mit Euler-Kriterium:
// a ... Obere Zahl (ganz)
// p ... Untere Zahl (ungerade Primzahl)
  
function legendre (a, p) {
  if (!isInteger(a)) return undefined;                     // R�ckgabewert, falls oben keine ganze Zahl
  if (!isInteger(p)) return undefined;                     // R�ckgabewert, falls unten keine ganze Zahl
  if (!isPrime(p)) return undefined;                       // R�ckgabewert, falls unten keine Primzahl
  if (p == 2) return undefined;                            // R�ckgabewert, falls unten Zahl 2  
  a = mod(a,p);                                            // Obere Zahl (0 <= a < p erzwingen)  
  if (a == 0) return 0;                                    // R�ckgabewert, falls a durch p teilbar                           
  var e = (p-1)/2;                                         // Exponent
  var r = 1;                                               // Startwert Produkt
  for (var i=0; i<e; i++) r = mod(r*a,p);                  // Produkt berechnen
  if (r == 1) return 1;                                    // R�ckgabewert, falls quadratischer Rest
  if (r == p-1) return -1;                                 // R�ckgabewert, falls quadratischer Nichtrest                        
  return undefined;                                        // Darf nicht vorkommen!
  }
  
// Jacobi-Symbol:
// n ... Obere Zahl (ganz)
// m ... Untere Zahl (nat�rlich, ungerade)
  
function jacobi (n, m) {
  if (!isInteger(n)) return undefined;                     // R�ckgabewert, falls oben keine ganze Zahl
  if (!isInteger(m)) return undefined;                     // R�ckgabewert, falls unten keine ganze Zahl
  if (m <= 0) return undefined;                            // R�ckgabewert, falls unten keine nat�rliche Zahl
  if (m%2 == 0) return undefined;                          // R�ckgabewert, falls untere Zahl gerade
  var p = 1;                                               // Startwert Produkt
  while (m > 1) {                                          // Solange untere Zahl gr��er als 1 ...
    var f = firstPrime(m);                                 // Kleinster Primfaktor (ungerade)
    m /= f;                                                // Division durch Primfaktor
    p *= legendre(n,f);                                    // Multiplikation mit Legendre-Symbol  	  
    }
  return p;                                                // R�ckgabewert
  }
  
// Kronecker-Symbol, Spezialfall: Untere Zahl gleich 2
// n ... Obere Zahl (ganz)

function kronecker2 (n) {
  if (n%2 == 0) return 0;                                  // R�ckgabewert, falls Argument gerade
  var n8 = mod(n,8);                                       // Rest modulo 8 (0 bis 7)
  if (n8 == 1 || n8 == 7) return 1;                        // Entweder R�ckgabewert 1 ...
  else return -1;                                          // ... oder R�ckgabewert -1
  }
  
// Kronecker-Symbol:
// n ... Obere Zahl (ganz)
// m ... Untere Zahl (ganz)
  
function kronecker (n, m) {
  if (!isInteger(n)) return undefined;                     // R�ckgabewert, falls oben keine ganze Zahl
  if (!isInteger(m)) return undefined;                     // R�ckgabewert, falls unten keine ganze Zahl
  if (m == 0) return (Math.abs(n) == 1 ? 1 : 0);           // R�ckgabewert, falls untere Zahl gleich 0
  var p = 1;                                               // Startwert Produkt
  if (n < 0 && m < 0) p = -1;                              // Vorzeichen von n und m ber�cksichtigen
  m = Math.abs(m);                                         // Betrag der unteren Zahl
  if (m%2 == 0) {                                          // Falls untere Zahl gerade ...
    var e = exponent(m,2);                                 // Exponent des Primfaktors 2
    var k = kronecker2(n);                                 // Kronecker-Symbol (n/2)
    if (k == 0) p = 0;                                     // Eventuell Multiplikation mit 0
    else if (e%2 != 0) p *= k;                             // Eventuell Multiplikation mit -1
    for (var i=0; i<e; i++) m /= 2;                        // Division durch Potenz von 2 ergibt ungeraden Teil von m
    } // Ende if
  return p*jacobi(n,m);                                    // R�ckgabewert (mit Jacobi-Symbol)
  }
    
// Text mit maximal 4 Zahlen:
// s ................ Gegebener Text (kann "#1", "#2", "#3", "#4" enthalten)
// n1, n2, n3, n4 ... Zahlen oder undefined
  
function textVar (s, n1, n2, n3, n4) {
  if (n1 != undefined) s = s.replace("#1",String(n1));     // Falls m�glich, 1. Zahl einsetzen
  if (n2 != undefined) s = s.replace("#2",String(n2));     // Falls m�glich, 2. Zahl einsetzen
  if (n3 != undefined) s = s.replace("#3",String(n3));     // Falls m�glich, 3. Zahl einsetzen
  if (n4 != undefined) s = s.replace("#4",String(n4));     // Falls m�glich, 4. Zahl einsetzen
  return s;                                                // R�ckgabewert
  }

//-------------------------------------------------------------------------------------------------

// Ausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// R�ckgabewert: Neue Position (am Ende, Pixel)

function write (s, x, y) {
  var w = ctx.measureText(s).width;                        // Breite (Pixel)
  ctx.fillText(s,x,y);                                     // Zeichenkette ausgeben
  return x+w;                                              // R�ckgabewert
  }

// Waagrechte Linie:
// (x,y) ... Position (Pixel)
// w ....... L�nge (Pixel)

function horLine (x, y, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.moveTo(x+8,y-4);                                     // Anfangspunkt links
  ctx.lineTo(x+12+w,y-4);                                  // Linie zum Grafikpfad hinzuf�gen
  ctx.stroke();                                            // Linie zeichnen
  }

// Kreisbogen f�r runde Klammer:
// (x,y) .... Kreismittelpunkt (Pixel)
// a1, a2 ... Winkel (Bogenma�)
  
function arc (x, y, a1, a2) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.arc(x,y,20,a1,a2,false);                             // Kreisbogen vorbereiten
  ctx.stroke();                                            // Kreisbogen zeichnen
  }
  
// Legendre-/Jacobi-/Kronecker-Symbol:
// n1 ...... Obere Zahl
// n2 ...... Untere Zahl
// (x,y) ... Position (Pixel)
  
function symbol (n1, n2, x, y) {
  var s1 = ToString(n1), s2 = ToString(n2);                // Zahlen als Zeichenketten
  var w1 = ctx.measureText(s1).width;                      // Breite der oberen Zahl (Pixel)
  var w2 = ctx.measureText(s2).width;                      // Breite der unteren Zahl (Pixel)
  var w = Math.max(w1,w2);                                 // Maximale Breite (Pixel)
  arc(x+20,y-4,0.75*Math.PI,1.25*Math.PI);                 // �ffnende Klammer
  arc(x+w,y-4,-0.25*Math.PI,0.25*Math.PI);                 // Schlie�ende Klammer
  ctx.fillText(s1,x+10+(w-w1)/2,y-10);                     // Obere Zahl
  ctx.fillText(s2,x+10+(w-w2)/2,y+10);                     // Untere Zahl
  horLine(x,y,w);                                          // Waagrechte Linie zwischen den Zahlen
  return x+w+30;                                           // R�ckgabewert (Position rechts, Pixel)
  }
  
// Ergebnisausgabe Legendre-Symbol:
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (ungerade Primzahl)
// (x,y) ... Position Gleichheitszeichen (Pixel)
  
function writeLegendre (n1, n2, x, y) {
  write(ToString(ls),x+20,y);                              // Ergebnis ausgeben
  }
  
// Ansatz Jacobi-Symbol (entsprechend Primfaktorzerlegung):
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (nat�rlich, ungerade)
// (x,y) ... Position (Pixel)
  
function writeJacobi1 (n1, n2, x, y) {
  if (n2 == 1) {ctx.fillText("1",x,y); return;}            // Sonderfall: Untere Zahl gleich 1
  var a = factors(n2,false);                               // Zweifach indiziertes Array (Primfaktoren und Exponenten)
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var p = a[i][0], e = a[i][1];                          // Primfaktor und zugeh�riger Exponent
    x = symbol(n1,p,x,y);                                  // Legendre-Symbol, neue Position
    if (e > 1) x = write(String(e),x-8,y-10)+4;            // Exponent, falls n�tig
    for (var k=0; k<e; k++) n2 /= p;                       // Untere Zahl reduzieren 
    }
  }
  
// Auswertung Jacobi-Symbol (Legendre-Symbole werden durch 1, (-1) oder 0 ersetzt):
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (nat�rlich, ungerade, ungleich 1)
// (x,y) ... Position (Pixel)
  
function writeJacobi2 (n1, n2, x, y) {
  var a = factors(n2,false);                               // Zweifach indiziertes Array (ungerade Primfaktoren und Exponenten)
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var p = a[i][0], e = a[i][1];                          // Primfaktor und zugeh�riger Exponent
    var leg = legendre(n1,p);                              // Wert des Legendre-Symbols
    var s = ToString(leg);                                 // Entsprechende Zeichenkette
    if (leg == -1) s = "("+s+")";                          // Falls Zahl -1, Klammern hinzuf�gen
    if (i > 0) s = " "+symbolMul+" "+s;                    // Falls nicht 1. Faktor, Multiplikationszeichen und Leerzeichen
    x = write(s,x,y);                                      // Wert ausgeben, neue Position
    if (e > 1) x = write(String(e),x,y-10);                // Falls n�tig, Exponent; neue Position
    }
  }
  
// Grafikausgabe: Rechnung und Ergebnis f�r Jacobi-Symbol
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (nat�rlich, ungerade)
// (x,y) ... Position Gleichheitszeichen (Pixel)
  
function writeJacobi (n1, n2, x, y) {
  writeJacobi1(n1,n2,x+20,y);                             // 1. Zeile: Ansatz entsprechend Primfaktorzerlegung
  if (n2 == 1) return;                                    // Falls untere Zahl gleich 1, abbrechen
  write("=",x,y+40);                                      // Gleichheitszeichen f�r 2. Zeile
  writeJacobi2(n1,n2,x+20,y+40);                          // 2. Zeile: Produkt von Zahlen (1, -1 oder 0)
  write("=",x,y+80);                                      // Gleichheitszeichen f�r 3. Zeile
  write(ToString(js),x+20,y+80);                          // 3. Zeile: Ergebnis
  }
  
// Ansatz Kronecker-Symbol (entsprechend Zerlegung):
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (ganz)
// (x,y) ... Position (Pixel)
  
function writeKronecker1 (n1, n2, x, y) {
  if (n2 == 0 || n2 == -1 || n2 == 2) {                    // Sonderf�lle: Untere Zahl gleich 0, -1 oder 2
    ctx.fillText(ToString(ks),x,y);                        // Ergebnis ausgeben
    return;                                                // Abbrechen
    }
  var a = factors(n2,true);                                // Zerlegung (Einheit, Primfaktoren, Exponenten)
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var p = a[i][0], e = a[i][1];                          // Einheit bzw. Primfaktor und zugeh�riger Exponent
    if (p != 1) x = symbol(n1,p,x,y);                      // Kronecker-Symbol bzw. Legendre-Symbol, neue Position
    if (e > 1) x = write(String(e),x-8,y-10)+4;            // Falls n�tig, Exponent; neue Position            
    }
  }
  
// Auswertung Kronecker-Symbol (Legendre- bzw. Kronecker-Symbole werden durch 1, (-1) oder 0 ersetzt):
// n1 ...... Obere Zahl (ganz)
// n2 ...... Untere Zahl (ganz, ungleich 0, -1, 2)
// (x,y) ... Position (Pixel)
  
function writeKronecker2 (n1, n2, x, y) {
  var a = factors(n2,true);                                // Zweifach indiziertes Array (Einheit, Primfaktoren und Exponenten)
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var p = a[i][0], e = a[i][1];                          // Einheit bzw. Primfaktor und zugeh�riger Exponent
    if (p == 1) continue;                                  // Falls Einheit 1, weiter zum n�chsten Index
    var sy = legendre(n1,p);                               // Wert des Legendre-Symbols oder undefined
    if (p == -1 || p == 2) sy = kronecker(n1,p);           // Falls Einheit -1 oder Primfaktor 2, Wert des Kronecker-Symbols
    var s = ToString(sy);                                  // Entsprechende Zeichenkette
    if (sy == -1) s = "("+s+")";                           // Falls Zahl -1, Klammern hinzuf�gen
    if (i > 0 && a[i-1][0] != 1) s = symbolMul+" "+s;      // Falls nicht 1. Faktor, Multiplikationszeichen und Leerzeichen
    x = write(s,x,y);                                      // Wert ausgeben, neue Position
    if (e > 1) x = write(String(e),x,y-10);                // Falls n�tig, Exponent; neue Position
    }
  }
  
// Grafikausgabe: Rechnung und Ergebnis f�r Kronecker-Symbol

function writeKronecker (n1, n2, x, y) {
  writeKronecker1(n1,n2,x+20,y);                           // 1. Zeile: Ansatz entsprechend der Zerlegung
  if (n2 == 0 || n2 == -1 || n2 == 2) return;              // Falls untere Zahl gleich 0, -1 oder 2, abbrechen
  write("=",x,y+40);                                       // Gleichheitszeichen f�r 2. Zeile
  writeKronecker2(n1,n2,x+20,y+40);                        // 2. Zeile: Produkt von Zahlen (1, -1 oder 0)
  write("=",x,y+80);                                       // Gleichheitszeichen f�r 3. Zeile
  write(ToString(ks),x+20,y+80);                           // 3. Zeile: Ergebnis
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 2;                                       // Liniendicke
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.font = FONT;                                         // Zeichensatz (Sansserif)
  var s1 = undefined, s2 = undefined;                      // Startwerte f�r Zeichenketten
  if (qr > 0) {                                            // Falls quadratischer Rest ...
    s1 = textVar(text11,n1,n2);                            // Zeichenkette Aussage
    s2 = textVar(text14,qr,qr*qr,n1,n2);                   // Zeichenkette Begr�ndung
    }
  if (qr < 0) {                                            // Falls quadratischer Nichtrest ...
    s1 = textVar(text12,n1,n2);                            // Zeichenkette Aussage
    s2 = textVar(text15,n1,n2);                            // Zeichenkette Begr�ndung
    }
  if (qr == 0) {                                           // Falls Zahlen nicht teilerfremd ...
    s1 = textVar(text13,n1,n2);                            // Zeichenkette Aussage
    s2 = symbolGCD+"("+n1+","+n2+") = "+gcd(n1,n2);        // Zeichenkette Begr�ndung
    }
  if (s1 != undefined) ctx.fillText(s1,50,50);             // Aussage (quadratischer Rest usw.)
  if (s2 != undefined) ctx.fillText(s2,50,80);             // Begr�ndung
  var s = text06;                                          // Zeichenkette f�r Kronecker-Symbol
  if (ls != undefined) s = text04;                         // Zeichenkette f�r Legendre-Symbol
  else if (js != undefined) s = text05;                    // Zeichenkette f�r Jacobi-Symbol
  ctx.fillText(s,50,150);                                  // Zeichenkette ausgeben 
  var y = 200;                                             // Senkrechte Bildschirmkoordinate (Pixel)
  var x = symbol(n1,n2,50,y);                              // Legendre-/Jacobi-/Kronecker-Symbol, Position
  write("=",x,y);                                          // Gleichheitszeichen, neue Position
  if (ls != undefined) writeLegendre(n1,n2,x,y);           // Entweder Legendre-Symbol (eine Zeile) ...
  else if (js != undefined) writeJacobi(n1,n2,x,y);        // ... oder Jacobi-Symbol (meist drei Zeilen)
  else if (ks != undefined) writeKronecker(n1,n2,x,y);     // ... oder Kronecker-Symbol (meist drei Zeilen)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen



