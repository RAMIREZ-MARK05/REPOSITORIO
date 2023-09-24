// Tangenten von Funktionsgraphen
// 06.09.2017 - 06.09.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel tangent_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorFunction = "#000000";                             // Farbe f�r gegebene Funktion
var colorDerivative1 = "#ff0000";                          // Farbe f�r 1. Ableitung
var colorGrid = "#ff8040";                                 // Farbe f�r Gitternetz

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Mathematische Konstanten:

var KO = ["e", "pi"]; 

// Namen der bin�ren Operationen:

var OP2 = ["su", "di", "pr", "qu", "po"];
  	
// Namen der zul�ssigen Funktionen:

var FU = ["abs", "sgn0", "sqrt", "exp", "ln", 
  "sin", "cos", "tan", "arcsin", "arccos", "arctan",
  "sinh", "cosh", "tanh", "arsinh", "arcosh", "artanh"]; 

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che
var ip1, ip2, ip3, ip4;                                    // Eingabefelder
var bu;                                                    // Schaltknopf
var drag;                                                  // Flag f�r Zugmodus
var term;                                                  // Funktionsterm der gegebenen Funktion (Zeichenkette)
var upn;                                                   // UPN-Array f�r gegebene Funktion
var upn1;                                                  // UPN-Array f�r 1. Ableitungsfunktion
var upn2 = undefined;                                      // UPN-Array der 2. Ableitungsfunktion
var xMin, xMax, yMin, yMax;                                // Gezeichneter Bereich (x- bzw. y-Koordinaten)
var pix;                                                   // Pixel pro Einheit
var x0;                                                    // x-Koordinate des Ber�hrpunkts

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
  getElement("lb1",text01);                                // Erkl�render Text (Funktionsgleichung)
  getElement("ip1a",text02);                               // Erkl�render Text (f(x) = )
  ip1 = getElement("ip1b");                                // Eingabefeld (Funktionsterm)
  ip1.value = "x^2";                                       // Voreingestellter Funktionsterm
  ip1.focus();                                             // Fokus f�r Eingabefeld
  getElement("ip2a",text03);                               // Erkl�render Text (linker Rand)
  ip2 = getElement("ip2b");                                // Eingabefeld (linker Rand)
  getElement("ip3a",text04);                               // Erkl�render Text (rechter Rand)
  ip3 = getElement("ip3b");                                // Eingabefeld (rechter Rand)
  getElement("ip4a",text05);                               // Erkl�render Text (unterer Rand)
  ip4 = getElement("ip4b");                                // Eingabefeld (unterer Rand)
  getElement("op5a",text06);                               // Erkl�render Text (oberer Rand)
  op5 = getElement("op5b");                                // Ausgabefeld (oberer Rand)
  bu = getElement("bu",text07);                            // Schaltknopf
  getElement("author",author);                             // Autor (und �bersetzer)

  xMin = -10; xMax = 10; yMin = -10;                       // Grenzen des gezeichneten Bereichs
  yMax = yMin+(xMax-xMin);                                 // Obere Grenze des gezeichneten Bereichs
  x0 = 1;                                                  // x-Koordinate des Ber�hrpunkts
  updateInput();                                           // Eingabefelder aktualisieren
  reactionButton();                                        // Berechnungen, Zeichnung
  drag = false;                                            // Zugmodus zun�chst deaktiviert
    
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabefeld Funktionsterm)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabefeld linker Rand)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabefeld rechter Rand)
  ip4.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabefeld unterer Rand)
  bu.onclick = reactionButton;                             // Reaktion auf Schaltknopf
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
    
  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    reactionButton();                                      // ... Daten �bernehmen, rechnen, Ausgabe, neu zeichnen                          
  }
  
// �berpr�fung, ob Funktionsterm (gegeben durch UPN-Array upn) korrekt:
  
function isCorrect () {
  if (upn == undefined) return false;                      // Falls UPN-Array undefiniert, R�ckgabewert false
  else return true;                                        // Sonst R�ckgabewert true
  }
  
// Multiplikationszeichen einf�gen:

function insertMult (f, i) {
  return f.substring(0,i+1)+"*"+f.substring(i+1);
  }
  
// �berpr�fung, ob Variable:
// f ... Gegebene Zeichenkette (Funktionsterm)
// i ... Index eines Zeichens
// R�ckgabewert: F�r x ohne folgendes p true, sonst false

function isVariable (f, i) {
  return (f.charAt(i) == 'x' && f.charAt(i+1) != 'p');
  }
  
// �berpr�fung, ob Funktionsname folgt:
// f ... Gegebene Zeichenkette (Funktionsterm)
// i ... Index eines Zeichens
// R�ckgabewert: Wenn auf das Zeichen ein Funktionsname folgt, true, sonst -1

function followsFunction (f, i) {
  for (var k=0; k<FU.length; k++)                          // F�r alle zul�ssigen Funktionen ...
    if (f.indexOf(FU[k],i+1) == i+1) return true;          // Falls �bereinstimmung, R�ckgabewert true
  return false;                                            // Keine zul�ssige Funktion, daher R�ckgabewert false 
  }
  
// �berpr�fung, ob mathematische Konstante folgt:
// f ... Gegebene Zeichenkette (Funktionsterm)
// i ... Index eines Zeichens
// R�ckgabewert: Wenn auf das Zeichen der Name einer mathematischen Konstante folgt, true, sonst false

function followsMathConstant (f, i) {
  for (var k=0; k<KO.length; k++)                          // F�r alle zul�ssigen mathematischen Konstanten ...
    if (f.indexOf(KO[k],i+1) == i+1) return true;          // Falls �bereinstimmung, R�ckgabewert true
  return false;                                            // Keine zul�ssige Konstante, daher R�ckgabewert false
  }
  
// Funktionsterm korrigieren:
// f ... Gegebener Funktionsterm, eventuell mit fehlenden Multiplikationszeichen
// R�ckgabewert: Korrigierter Funktionsterm mit eingef�gten Multiplikationszeichen

function correctTerm (f) {
  var fn = f.replace(/ /g,"");                             // Alle Leerzeichen entfernen
  fn = fn.replace(",",".");                                // Eventuell Komma durch Punkt ersetzen
  var num = "0123456789.";                                 // Erlaubte Zeichen bei Zahlen
  for (var i=0; i<fn.length-1; i++) {                      // F�r alle Positionen der Zeichenkette bis zur vorletzten ...
    var ch0 = fn.charAt(i);                                // Aktuelles Zeichen
    var num0 = (num.indexOf(ch0) >= 0);                    // Flag f�r Bestandteil einer Zahl
    var var0 = isVariable(fn,i);                           // Flag f�r Variable x
    var br0 = (fn.charAt(i) == ')');                       // Flag f�r schlie�ende Klammer 
    var var1 = isVariable(fn,i+1);                         // Flag f�r folgende Variable x
    var br1 = (fn.charAt(i+1) == '(')                      // Flag f�r folgende �ffnende Klammer
    var fct1 = followsFunction(fn,i);                      // Flag f�r folgenden Funktionsnamen
    var cst1 = followsMathConstant(fn,i);                  // Flag f�r folgende Konstante
    if (num0 && (var1 || br1 || fct1 || cst1)              // Falls Multiplikationszeichen nach Zahl...
    || var0 && (br1 || fct1)                               // ... oder nach Variable x ...
    || br0 && (var1 || br1 || fct1))                       // ... oder nach schlie�ender Klammer fehlt ... 
      fn = insertMult(fn,i);                               // '*' einf�gen
    }
  return fn;                                               // R�ckgabewert
  }
  
// Reaktion auf OK-Button:
// Seiteneffekt xMin, xMax, yMin, yMax, pix, upn, upn1, Wirkung auf Ein- und Ausgabefelder 
  
function reactionButton () {
  input();                                                 // Eingabe der Grenzen (links, rechts, unten)
  pix = height/(xMax-xMin);                                // Umrechnungsfaktor (Pixel pro Einheit)
  yMax = yMin+(xMax-xMin);                                 // Obere Grenze
  op5.innerHTML = ToString(yMax,3,true);                   // Ausgabefeld f�r obere Grenze aktualisieren
  var f = ip1.value;                                       // Funktionsterm aus Eingabefeld
  f = correctTerm(f);                                      // Funktionsterm eventuell korrigieren
  upn = toUPN(f);                                          // UPN-Array der eingegebenen Funktion
  if (!isCorrect(upn)) {                                   // Falls Funktionsterm unverst�ndlich ...
    alert(text08);                                         // Warnmeldung                                        
    return;                                                // Abbrechen
    }                      
  term = f;                                                // Neuen Funktionsterm speichern
  ip1.value = f.replace(".",decimalSeparator);             // Eventuell Komma statt Punkt
  upn1 = derivative(upn);                                  // UPN-Array der 1. Ableitungsfunktion
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktiviert
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus deaktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus deaktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  } 
  
// �berpr�fung, ob ein Punkt in der N�he des Funktionsgraphen liegt:
// u, v ... Bildschirmkoordinaten (Pixel)

function isNear (u, v) {
  var x = xMin+u/pix;                                      // x-Koordinate
  var y = value(upn,x);                                    // Zugeh�riger Funktionswert
  var dv = Math.abs((yMax-y)*pix-v);                       // Senkrechter Abstand (Pixel)
  return (dv <= 50);                                       // R�ckgabewert
  }
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag, x0

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel) 
  if (!isNear(u,v)) return;                                // Falls Position nicht in der N�he des Graphen, abbrechen
  x0 = xMin+u/pix;                                         // x-Koordinate des Ber�hrpunkts
  drag = true;                                             // Zugmodus aktiviert
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag, x0

function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (!isNear(u,v)) {                                      // Falls Position nicht in der N�he des Graphen ...
    drag = false; return;                                  // Zugmodus deaktivieren und abbrechen
    }
  x0 = xMin+u/pix;                                         // x-Koordinate des neuen Ber�hrpunkts
  paint();                                                 // Neu zeichnen
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

// Gesamte Eingabe:
// Seiteneffekt xMin, xMax, yMin, Wirkung auf Eingabefelder

function input () {
  xMin = inputNumber(ip2,3,true,-1000,1000);               // Linke Grenze des gezeichneten Bereichs
  xMax = inputNumber(ip3,3,true,-1000,1000);               // Rechte Grenze des gezeichneten Bereichs
  yMin = inputNumber(ip4,3,true,-1000,1000);               // Untere Grenze des gezeichneten Bereichs
  if (xMin > xMax) {var h = xMin; xMin = xMax; xMax = h;}  // Falls n�tig, linke und rechte Grenze vertauschen
  var dxMin = 0.002;                                       // Mindestbreite des gezeichneten Bereichs
  if (xMax-xMin < dxMin) {                                 // Falls Mindestbreite unterschritten ...
    var xM = (xMin+xMax)/2;                                // Mittlerer x-Wert
    xMin = xM-dxMin/2; xMax = xM+dxMin/2;                  // Linke und rechte Grenze anpassen
    }
  updateInput();                                           // Eingabefelder aktualisieren
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip2.value = ToString(xMin,3,true);                       // Eingabefeld f�r linken Rand
  ip3.value = ToString(xMax,3,true);                       // Eingabefeld f�r rechten Rand
  ip4.value = ToString(yMin,3,true);                       // Eingabefeld f�r unteren Rand
  }

//-------------------------------------------------------------------------------------------------

//.................................................................................................
// Methoden zur Untersuchung einer Zeichenkette
//.................................................................................................

// Suche in einer gegebenen Zeichenkette nach einem m�glichst weit rechts stehenden Zeichen,
// das mit einem von zwei gegebenen Zeichen �bereinstimmt und sich nicht innerhalb einer Klammer befindet.
// s ..... Gegebene Zeichenkette
// ch1 ... Erstes der gesuchten Zeichen
// ch2 ... Zweites der gesuchten Zeichen (optional)
// R�ckgabewert: Index des ermittelten Zeichens, bei misslungener Suche -1
	
function indexCharRight (s, ch1, ch2) {
  var level = 0;                                           // Klammerebene zun�chst 0
  var iLeft = -2, iRight = -1;                             // Begrenzungen f�r Intervall
  for (var i=0; i<s.length; i++) {                         // F�r alle Positionen der Zeichenkette ...
    var c = s.charAt(i);                                   // Aktuelles Zeichen
    if (c == '(') level++;                                 // Falls �ffnende Klammer, Klammerebene erh�hen
    if (c == ')') level--;                                 // Falls schlie�ende Klammer, Klammerebene erniedrigen
    if (level == 0 && (c == ch1 || c == ch2)) {            // Falls gesuchtes Zeichen au�erhalb von Klammern ...
      iLeft = iRight; iRight = i;                          // Intervallgrenzen aktualisieren
      }
    }
  return iRight;                                           // R�ckgabewert
  }
    
// Suche in einer gegebenen Zeichenkette nach einem m�glichst weit links stehenden Zeichen,
// das mit einem gegebenen Zeichen �bereinstimmt und sich nicht innerhalb einer Klammer befindet.
// s .... Gegebene Zeichenkette
// ch ... Gesuchtes Zeichen
// R�ckgabewert: Index des ermittelten Zeichens, bei misslungener Suche -1
	
function indexCharLeft (s, ch) {
  var level = 0;                                           // Klammerebene zun�chst 0
  for (var i=0; i<s.length; i++) {                         // F�r alle Positionen der Zeichenkette ...
    var c = s.charAt(i);                                   // Aktuelles Zeichen
    if (c == '(') level++;                                 // Falls �ffnende Klammer, Klammerebene erh�hen
    if (c == ')') level--;                                 // Falls schlie�ende Klammer, Klammerebene erniedrigen
    if (level == 0 && c == ch) return i;                   // Falls gesuchtes Zeichen au�erhalb Klammer, Index als R�ckgabewert
    }
  return -1;                                               // R�ckgabewert bei misslungener Suche
  }
  
// �berpr�fung, ob Zahl:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Bei Zahl true, sonst false; Zehnerpotenzschreibweise wie "1e8" liefert false

function isNumber (s) {
  for (var i=0; i<s.length; i++)                           // F�r alle Positionen der Zeichenkette ...
    if (s.charAt(i) == 'e') return false;                  // Falls e gefunden (Zehnerpotenz), R�ckgabewert false
  var z = Number(s);                                       // Versuchte Umwandlung in Zahl
  return (z != undefined && !isNaN(z));                    // R�ckgabewert
  }
  
// �berpr�fung, ob bin�re Operation:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Bei bin�rer Operation true, sonst false

function isBinary (s) {
  for (var i=0; i<OP2.length; i++)                         // F�r alle Namen von bin�ren Operationen ...  
    if (s == OP2[i]) return true;                          // Falls �bereinstimmung, R�ckgabewert true
  return false;                                            // Keine �bereinstimmung, daher R�ckgabewert false
  }
  
// �berpr�fung, ob zul�ssige mathematische Konstante:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Bei zul�ssiger mathematischer Konstante true, sonst false

function isMathConstant (s) {
  for (var i=0; i<KO.length; i++)                          // F�r alle Namen von Konstanten ...  
    if (s == KO[i]) return true;                           // Falls �bereinstimmung, R�ckgabewert true
  return false;                                            // Keine �bereinstimmung, daher R�ckgabewert false
  }
  
// Index f�r mathematische Konstante:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Index im Array der zul�ssigen mathematischen Konstanten, bei erfolgloser Suche -1
  
function indexMathConstant (s) {
  for (var i=0; i<KO.length; i++)                          // F�r alle Namen von Konstanten ...
    if (s == KO[i]) return i;                              // Falls �bereinstimmung, Index als R�ckgabewert
  return -1;                                               // R�ckgabewert bei erfolgloser Suche
  }
  
// �berpr�fung, ob zul�ssige Funktion:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Bei zul�ssiger Funktion true, sonst false

function isFunction (s) {
  for (var i=0; i<FU.length; i++)                          // F�r alle zul�ssigen Funktionsnamen ...
    if (s == FU[i]) return true;                           // Falls �bereinstimmung, R�ckgabewert true
  return false;                                            // Keine �bereinstimmung, daher R�ckgabewert false
  }
  
// Index f�r Funktion:
// s ... Gegebene Zeichenkette
// R�ckgabewert: Index im Array der zul�ssigen Funktionsnamen, bei erfolgloser Suche -1

function indexFunction (s) {
  for (var i=0; i<FU.length; i++)                          // F�r alle zul�ssigen Funktionsnamen ...
    if (s.indexOf(FU[i]) == 0                              // Falls �bereinstimmung ...
    && s.charAt(FU[i].length) == '('                       // ... und anschlie�end �ffnende Klammer ...
    && s.charAt(s.length-1) == ')')                        // ... und am Ende schlie�ende Klammer ...
      return i;                                            // Index als R�ckgabewert
  return -1;                                               // R�ckgabewert bei erfolgloser Suche
  }
  
//.................................................................................................
// Methoden zur Untersuchung von UPN-Arrays
//.................................................................................................

// �berpr�fung, ob Rechenausdruck konstant:
// u ... UPN-Array des Rechenausdrucks oder undefined
// R�ckgabewert: Bei Abh�ngigkeit von x und bei undefiniertem Rechenausdruck false, sonst true

function isConstant (u) {
  if (u == undefined) return false;                        // R�ckgabewert bei undefiniertem Rechenausdruck
  for (var i=0; i<u.length; i++)                           // F�r alle Elemente des UPN-Arrays ...
    if (u[i] == "x") return false;                         // Falls x gefunden, R�ckgabewert false
  return true;                                             // R�ckgabewert f�r konstanten Rechenausdruck
  }
  
// �berpr�fung, ob konstante Zahl:
// u ... UPN-Array des Rechenausdrucks oder undefined
// R�ckgabewert: Bei Abh�ngigkeit von x, bei mathematischen Konstanten und bei undefiniertem Rechenausdruck false, sonst true
  
function isConstantN (u) {
  if (u == undefined) return false;                        // R�ckgabewert bei undefiniertem Rechenausdruck
  for (var i=0; i<u.length; i++) {                         // F�r alle Elemente des UPN-Arrays ...
    var e = u[i];                                          // Element
    if (e == "x" || isMathConstant(e)) return false;       // Falls x oder mathematische Konstante gefunden, R�ckgabewert false
    }
  return true;                                             // R�ckgabewert f�r konstante Zahl
  }
  
// �berpr�fung, ob Rechenausdruck gleich 0:
// u ... UPN-Array des Rechenausdrucks

function equals0 (u) {
  if (!isConstant(u)) return false;                        // R�ckgabewert bei nicht konstantem Rechenausdruck
  return (value(u,0) == 0);                                // R�ckgabewert bei konstantem Rechenausdruck
  }
  
// �berpr�fung, ob Rechenausdruck gleich 1:
// u ... UPN-Array des Rechenausdrucks

function equals1 (u) {
  if (!isConstant(u)) return false;                        // R�ckgabewert bei nicht konstantem Rechenausdruck
  return (value(u,0) == 1);                                // R�ckgabewert bei konstantem Rechenausdruck
  }
  
//.................................................................................................
// Methoden zum Aufbau von UPN-Arrays
//.................................................................................................
  
// Zahl:
// n ... Gegebene Zahl
// R�ckgabewert: UPN-Array der Zahl

function number (n) {
  if (n >= 0) return [String(n)];                          // Falls Zahl nicht negativ, UPN-Array mit einem Element
  else return [String(-n), "mi"];                          // Sonst UPN-Array mit 2 Elementen (Minus-Ausdruck)
  }
  
// Un�res Plus:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Arguments oder undefined

function plus (u) {
  return u;                                                // Argument als R�ckgabewert
  }
  
// Un�res Minus:
// u ... UPN-Array des (definierten) Arguments
// R�ckgabewert: UPN-Array des Minus-Ausdrucks (eventuell vereinfacht)

function minus (u) {
  var res = u.slice(0);                                    // Kopie des gegebenen UPN-Arrays
  if (equals0(res)) return ["0"];                          // Sonderfall: -0
  if (res.length > 1 && res[res.length-1] == "mi") {       // Sonderfall: -(-...)
    res.pop(); return res;                                 // Minus-Symbol im Argument weglassen
    }
  res.push("mi"); return res;                              // R�ckgabewert im Normalfall
  }
  
// Bin�re Operation allgemein:
// u ... UPN-Array des ersten Operanden oder undefined
// v ... UPN-Array des zweiten Operanden oder undefined
// R�ckgabewert: UPN-Array des Ergebnisses oder undefined

function binaryOperation (u, v, op) {
  if (u == undefined || v == undefined) return undefined;  // Falls undefinierter Operand, R�ckgabewert undefined
  var res = u.concat(v);                                   // UPN-Arrays verbinden
  res.push(op);                                            // Symbol der Operation hinzuf�gen
  return res;                                              // R�ckgabewert
  }
  
// Summe zweier Terme:
// u ... UPN-Array des ersten Summanden
// v ... UPN-Array des zweiten Summanden
// R�ckgabewert: UPN-Array der Summe (eventuell vereinfacht) oder undefined 

function sum (u, v) {
  if (isConstantN(u) && isConstantN(v))                    // Sonderfall: Summe zweier Zahlen
    return number(value(u,0)+value(v,0));                  // Summe berechnen, R�ckgabewert
  if (equals0(u)) return v;                                // Sonderfall: Erster Summand gleich 0
  if (equals0(v)) return u;                                // Sonderfall: Zweiter Summand gleich 0
  return binaryOperation(u,v,"su");                        // R�ckgabewert im Normalfall
  }
  
// Differenz zweier Terme:
// u ... UPN-Array des Minuenden
// v ... UPN-Array des Subtrahenden
// R�ckgabewert: UPN-Array der Differenz (eventuell vereinfacht) oder undefined

  
function difference (u, v) {
  if (isConstantN(u) && isConstantN(v))                    // Sonderfall: Differenz zweier Zahlen
    return number(value(u,0)-value(v,0));                  // Differenz berechnen, R�ckgabewert  
  if (equals0(u)) return minus(v);                         // Sonderfall: Minuend gleich 0
  if (equals0(v)) return u;                                // Sonderfall: Subtrahend gleich 0
  return binaryOperation(u,v,"di");                        // R�ckgabewert im Normalfall
  }
  
// Produkt zweier Terme:
// u ... UPN-Array des ersten Faktors
// v ... UPN-Array des zweiten Faktors
// R�ckgabewert: UPN-Array des Produkts (eventuell vereinfacht) oder undefined
    
function product (u, v) {
  if (isConstantN(u) && isConstantN(v))                    // Sonderfall: Produkt zweier Zahlen
    return number(value(u,0)*value(v,0));                  // Produkt berechnen, R�ckgabewert
  if (equals0(u) || equals0(v)) return ["0"];              // Sonderfall: Erster oder zweiter Faktor gleich 0
  if (equals1(u)) return v;                                // Sonderfall: Erster Faktor gleich 1
  if (equals1(v)) return u;                                // Sonderfall: Zweiter Faktor gleich 1
  return binaryOperation(u,v,"pr");                        // R�ckgabewert im Normalfall
  }
  
// Quotient zweier Terme:
// u ... UPN-Array des Dividenden
// v ... UPN-Array des Divisors
// R�ckgabewert: UPN-Array des Quotienten (eventuell vereinfacht) oder undefined
  
function quotient (u, v) {
  if (equals0(v)) return undefined;                        // Falls Division durch 0, R�ckgabewert undefined    
  if (isConstantN(u) && isConstantN(v)) {                  // Sonderfall: Quotient zweier Zahlen                    
    return number(value(u,0)/value(v,0));                  // Quotient berechnen, R�ckgabewert (Rundungsfehler!)
    }
  if (equals0(u)) return ["0"];                            // Sonderfall: Dividend gleich 0
  if (equals1(v)) return u;                                // Sonderfall: Divisor gleich 1
  return binaryOperation(u,v,"qu");                        // R�ckgabewert im Normalfall
  }
  
// Potenz zweier Terme:
// u ... UPN-Array der Basis
// v ... UPN-Array des Exponenten
// R�ckgabewert: UPN-Array der Potenz (eventuell vereinfacht) oder undefined
  
function power (u, v) {
  if (isConstantN(u) && isConstantN(v))                    // Sonderfall: Potenz zweier Zahlen
    return number(Math.pow(value(u,0),value(v,0)));        // Potenz berechnen, R�ckgabewert (Rundungsfehler!)
  if (equals0(v)) return ["1"];                            // Sonderfall: Exponent gleich 0
  if (equals0(u) && isConstantN(v) && value(v,0) > 0)      // Sonderfall: Basis gleich 0, Exponent positiv
    return ["0"];
  if (equals1(u)) return ["1"];                            // Sonderfall: Basis gleich 1
  if (equals1(v)) return u;                                // Sonderfall: Exponent gleich 1
  return binaryOperation(u,v,"po");                        // R�ckgabewert im Normalfall
  }
  
// Hilfsroutine f�r Funktionen: Hinzuf�gen eines Funktionsnamens zu einem UPN-Array
// u .... UPN-Array des Arguments
// fn ... Funktionsname
// R�ckgabewert: UPN-Array des Funktionswertes

function upnFunction (u, fn) {
  var res = u.slice(0);                                    // Kopie des gegebenen UPN-Arrays
  res.push(fn);                                            // Funktionsname hinzuf�gen
  return res;                                              // R�ckgabewert
  }
  
// Absoluter Betrag eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des absoluten Betrags (eventuell vereinfacht)

function modulus (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  if (equals1(u)) return ["1"];                            // Sonderfall: Argument gleich 1
  return upnFunction(u,"abs");                             // R�ckgabewert im Normalfall
  }
  
// Signumfunktion (mit Definitionsl�cke) eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des neuen Terms

function signum0 (u) {
  return upnFunction(u,"sgn0");                            // R�ckgabewert im Normalfall
  }
  
// Quadratwurzel aus einem Term:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array der Quadratwurzel (eventuell vereinfacht)

function squareroot (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Radikand gleich 0
  if (equals1(u)) return ["1"];                            // Sonderfall: Radikand gleich 1
  return upnFunction(u,"sqrt");                            // R�ckgabewert im Normalfall
  }
  
// e-Funktion eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function exponential (u) {
  if (equals0(u)) return ["1"];                            // Sonderfall: Argument gleich 0
  if (equals1(u)) return ["e"];                            // Sonderfall: Argument gleich e
  return upnFunction(u,"exp");                             // R�ckgabewert im Normalfall
  }
  
// ln eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function logarithm (u) {
  if (equals1(u)) return ["0"];                            // Sonderfall: Argument gleich 1
  return upnFunction(u,"ln");                              // R�ckgabewert im Normalfall
  }  
  
// Sinus eines Terms: 
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht) 
  
function sine (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"sin");                             // R�ckgabewert im Normalfall
  }
  
// Cosinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)  
  
function cosine (u) {
  if (equals0(u)) return ["1"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"cos");                             // R�ckgabewert im Normalfall
  }
  
// Tangens eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function tangent (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"tan");                             // R�ckgabewert im Normalfall
  }
  
// Arcussinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function arcsine (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"arcsin");                          // R�ckgabewert im Normalfall
  }
  
// Arcuscosinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses

function arccosine (u) {
  return upnFunction(u,"arccos");                          // R�ckgabewert im Normalfall
  }
  
// Arcustangens eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function arctangent (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"arctan");                          // R�ckgabewert im Normalfall
  }
  
// Hyperbelsinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function hypsine (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"sinh");                            // R�ckgabewert im Normalfall
  }
  
// Hyperbelcosinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function hypcosine (u) {
  if (equals0(u)) return ["1"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"cosh");                            // R�ckgabewert im Normalfall
  }
  
// Hyperbeltangens eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function hyptangent (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"tanh");                            // R�ckgabewert im Normalfall
  }
  
// Areasinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function invhypsine (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"arsinh");                          // R�ckgabewert im Normalfall
  }
  
// Areacosinus eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function invhypcosine (u) {
  if (equals1(u)) return ["0"];                            // Sonderfall: Argument gleich 1
  return upnFunction(u,"arcosh");                          // R�ckgabewert im Normalfall
  }
  
// Areatangens eines Terms:
// u ... UPN-Array des Arguments
// R�ckgabewert: UPN-Array des Ergebnisses (eventuell vereinfacht)

function invhyptangent (u) {
  if (equals0(u)) return ["0"];                            // Sonderfall: Argument gleich 0
  return upnFunction(u,"artanh");                          // R�ckgabewert im Normalfall
  }
  
//.................................................................................................
// Methoden zur Umwandlung von Zeichenketten in UPN-Arrays
//.................................................................................................
  
// Hilfsroutine f�r un�re Operationen:
// s .... Zeichenkette
// op ... Symbol f�r Art der Operation
// R�ckgabewert: UPN-Array oder undefined

function unaryToUPN (s, op) {
  var res = toUPN(s.substring(1));                         // UPN-Array des Arguments
  if (res == undefined) return undefined;                  // R�ckgabewert bei undefiniertem Argument
  if (op == "pl") return plus(res);                        // Un�res Plus
  if (op == "mi") return minus(res);                       // Un�res Minus
  }
  
// Hilfsroutine f�r bin�re Operationen:
// s .... Zeichenkette
// i .... Position des Operationszeichens
// op ... Symbol f�r Art der Operation
// R�ckgabewert: UPN-Array oder undefined

function binaryToUPN (s, i, op) {
  var u = toUPN(s.substring(0,i));                         // UPN-Array des ersten Operanden
  if (u == undefined) return undefined;                    // R�ckgabewert bei undefiniertem Operanden
  var v = toUPN(s.substring(i+1));                         // UPN-Array des zweiten Operanden
  if (v == undefined) return undefined;                    // R�ckgabewert bei undefiniertem Operanden
  if (op == "su") return sum(u,v);                         // Summe
  if (op == "di") return difference(u,v);                  // Differenz
  if (op == "pr") return product(u,v);                     // Produkt
  if (op == "qu") return quotient(u,v);                    // Quotient
  if (op == "po") return power(u,v);                       // Potenz
  }
  
// Hilfsroutine f�r Funktionen:
// s ... Zeichenkette
// i ... Index der Funktion im Array der zul�ssigen Funktionen
// R�ckgabewert: UPN-Array oder undefined

function functionToUPN (s, i) {
  var fn = FU[i];                                          // Name der Funktion
  var lf = fn.length;                                      // L�nge des Funktionsnamens
  var res = toUPN(s.substring(lf+1,s.length-1));           // UPN-Array des Arguments
  if (res == undefined) return undefined;                  // R�ckgabewert bei undefiniertem Argument
  if (fn == "abs") return modulus(res);                    // Absolutbetrag
  if (fn == "sqrt") return squareroot(res);                // Quadratwurzel
  if (fn == "exp") return exponential(res);                // e-Funktion
  if (fn == "ln") return logarithm(res);                   // ln-Funktion
  if (fn == "sin") return sine(res);                       // Sinus-Funktion
  if (fn == "cos") return cosine(res);                     // Cosinus-Funktion
  if (fn == "tan") return tangent(res);                    // Tangens-Funktion
  if (fn == "arcsin") return arcsine(res);                 // Arcussinus-Funktion
  if (fn == "arccos") return arccosine(res);               // Arcuscosinus-Funktion
  if (fn == "arctan") return arctangent(res);              // Arcustangens-Funktion
  if (fn == "sinh") return hypsine(res);                   // Hyperbelsinus-Funktion
  if (fn == "cosh") return hypcosine(res);                 // Hyperbelcosinus-Funktion
  if (fn == "tanh") return hyptangent(res);                // Hyperbeltangens-Funktion
  if (fn == "arsinh") return invhypsine(res);              // Areasinus-Funktion
  if (fn == "arcosh") return invhypcosine(res);            // Areacosinus-Funktion
  if (fn == "artanh") return invhyptangent(res);           // Areatangens-Funktion
  }
  
// Umwandlung einer Zeichenkette in ein Array f�r UPN-Darstellung der gegebenen Funktion (rekursive Methode!)
// s ... Gegebene Zeichenkette (definiert)
// R�ckgabewert: UPN-Array oder undefined

function toUPN (s) {
  if (s.length == 0) return undefined;                     // Leere Zeichenkette, Term undefiniert
  var i = indexCharRight(s,'+','-');                       // Suche nach '+' oder '-' au�erhalb Klammer, m�glichst weit rechts
  var op = s.charAt(i);                                    // Operationszeichen
  if (i > 0 && op == '+') return binaryToUPN(s,i,"su");    // Summe
  if (i > 0 && op == '-') return binaryToUPN(s,i,"di");    // Differenz
  if (i == 0 && op == '+') return unaryToUPN(s,"pl");      // Un�res Plus
  if (i == 0 && op == '-') return unaryToUPN(s,"mi");      // Un�res Minus
  i = indexCharRight(s,'*',':');                           // Suche nach '*' oder ':' au�erhalb Klammer, m�glichst weit rechts
  op = s.charAt(i);                                        // Operationszeichen
  if (i > 0 && op == '*') return binaryToUPN(s,i,"pr");    // Produkt
  if (i > 0 && op == ':') return binaryToUPN(s,i,"qu");    // Quotient (mit Divisionszeichen)
  i = indexCharRight(s,'/');                               // Suche nach '/' au�erhalb Klammer, m�glichst weit rechts
  if (i > 0) return binaryToUPN(s,i,"qu");                 // Bruchterm 
  i = indexCharLeft(s,'^');                                // Suche nach '^' au�erhalb Klammer, m�glichst weit links
  if (i > 0) return binaryToUPN(s,i,"po");                 // Potenz
  if (s.charAt(0) == '(' && s.charAt(s.length-1) == ')')   // Falls Klammer ...
    return toUPN(s.substring(1,s.length-1));               // UPN-Array des Arguments �bernehmen
  i = indexFunction(s);                                    // Suche nach Funktionsname und zugeh�rigen Klammern
  if (i >= 0) return functionToUPN(s,i);                   // Funktionswert
  i = indexMathConstant(s);                                // Suche nach mathematischer Konstante
  if (i >= 0) return [KO[i]];                              // Mathematische Konstante  
  if (s == "x") return ["x"];                              // Falls Variable x, Array mit dem Element "x"
  if (isNumber(s)) return [s];                             // Falls Zahl, Array mit dieser Zahl    
  return undefined;                                        // Umwandlung nicht m�glich
  }
  
// Operanden einer bin�ren Operation:
// u ... UPN-Array des gegebenen bin�ren Terms
// R�ckgabewert: Array der L�nge 2, das die UPN-Arrays der beiden Operanden als Elemente enth�lt

function operands (u) {
  var max1 = -1, max2 = -1;                                // Startwerte f�r Intervallgrenzen
  var level = 0;                                           // Stackgr��e zun�chst 0
  for (var i=0; i<u.length-1; i++) {                       // F�r alle Elemente des UPN-Arrays ...
    var e = u[i];                                          // Aktuelles Element
    if (isNumber(e)) level++;                              // Falls Zahl, Stackgr��e erh�hen
    else if (isMathConstant(e)) level++;                   // Falls mathematische Konstante, Stackgr��e erh�hen
    else if (e == "x") level++;                            // Falls Variable x, Stackgr��e erh�hen
    else if (isBinary(e)) level--;                         // Falls bin�re Operation, Stackgr��e vermindern
    if (level == 1) max1 = i;                              // Index f�r Ende des ersten Operanden
    else if (level == 2) max2 = i;                         // Index f�r Ende des zweiten Operanden (u.length-2)
    }
  var res = new Array(2);                                  // Neues Array, zun�chst leer
  res[0] = u.slice(0,max1+1);                              // UPN-Array des ersten Operanden
  res[1] = u.slice(max1+1,u.length-1);                     // UPN-Array des zweiten Operanden
  return res;                                              // R�ckgabewert
  }
  
//.................................................................................................
// Berechnung der Ableitungsfunktion
// u0 ... UPN-Array des Arguments bzw. des ersten Operanden
// u1 ... UPN-Array der Ableitung des Arguments bzw. des ersten Operanden
// v0 ... UPN-Array des zweiten Operanden
// v1 ... UPN-Array der Ableitung des zweiten Operanden
// R�ckgabewert: UPN-Array der Ableitungsfunktion
//.................................................................................................

// Ableitung eines Minus-Ausdrucks:

function derivMinus (u) {
  var arg = u.slice(0,u.length-1);                         // UPN-Array des Arguments
  return minus(derivative(arg));                           // R�ckgabewert
  }
 
// Ableitung eines Produkts:
  
function derivProd (u0, v0, u1, v1) {
  return sum(product(u1,v0),product(u0,v1));               // Produktregel: f' = u' v + u v'
  }
  
// Ableitung eines Quotienten:

function derivQuot (u0, v0, u1, v1) {
  var upnZ = difference(product(u1,v0),product(u0,v1));    // Z�hler: u' v - u v'
  var upnN = power(v0,["2"]);                              // Nenner: v^2
  return quotient(upnZ,upnN);                              // Quotientenregel: f' = (u' v - u v') / v^2
  }
  
// Ableitung einer Potenz:

function derivPow (u0, v0, u1, v1) {
  if (isConstant(v0)) {                                    // Falls konstanter Exponent ...
    var e = value(v0,0);                                   // Exponent
    var f1 = [e];                                          // Erster Faktor: Bisheriger Exponent
    var f2 = power(u0,[e-1]);                              // Zweiter Faktor: Basis hoch verminderter Exponent
    return product(product(f1,f2),u1);                     // R�ckgabewert: f' = n u^(n-1) u'
    }
  else {                                                   // Falls Exponent nicht konstant ... 
    var f1 = power(u0,difference(v0,["1"]));               // Faktor u^(v-1)
    var s1 = product(product(u0,v1),logarithm(u0));        // Erster Summand der Klammer
    var s2 = product(u1,v0);                               // Zweiter Summand der Klammer
    return product(f1,sum(s1,s2));                         // R�ckgabewert: f' = u^(v-1) (u v' ln(u) + u' v)
    }
  }
  
// Ableitung eines Absolutbetrags:

function derivAbs (u0, u1) {
  return product(signum0(u0),u1);                
  }
  
// Ableitung einer Signum-Funktion:

function derivSgn0 () {
  return ["0"];                                       
  }
  
// Ableitung einer Quadratwurzel:

function derivSqrt (u0, u1) {
  return quotient(u1,product(["2"],squareroot(u0)));
  }
 
// Ableitung einer e-Funktion: 

function derivExp (u0, u1) {
  return product(exponential(u0),u1);
  }
  
// Ableitung einer ln-Funktion:

function derivLn (u0, u1) {
  return quotient(u1,u0);
  }
  
// Ableitung einer Sinus-Funktion:

function derivSin (u0, u1) {
  return product(cosine(u0),u1);
  }
  
// Ableitung einer Cosinus-Funktion:

function derivCos (u0, u1) {
  return product(minus(sine(u0)),u1);
  }
  
// Ableitung einer Tangens-Funktion:

function derivTan (u0, u1) {
  return quotient(u1,power(cosine(u0),["2"]));
  }
  
// Ableitung einer Arcussinus-Funktion:

function derivArcsin (u0, u1) {
  var rad = difference(["1"],power(u0,["2"]));             // Radikand
  return quotient(u1,squareroot(rad));                 
  }
  
// Ableitung einer Arcuscosinus-Funktion:

function derivArccos (u0, u1) {
  var rad = difference(["1"],power(u0,["2"]));             // Radikand
  return minus(quotient(u1,squareroot(rad)));
  }
  
// Ableitung einer Arcustangens-Funktion:

function derivArctan (u0, u1) {
  return quotient(u1,sum(["1"],power(u0,["2"])));
  }
  
// Ableitung einer Hyperbelsinus-Funktion:

function derivSinh (u0, u1) {
  return product(hypcosine(u0),u1);
  }
  
// Ableitung einer Hyperbelcosinus-Funktion:

function derivCosh (u0, u1) {
  return product(hypsine(u0),u1);
  }
  
// Ableitung einer Hyperbeltangens-Funktion:

function derivTanh (u0, u1) {
  return quotient(u1,power(hypcosine(u0),["2"]));
  }
  
// Ableitung einer Areasinus-Funktion:

function derivArsinh (u0, u1) {
  var rad = sum(power(u0,["2"]),["1"]);                    // Radikand
  return quotient(u1,squareroot(rad));
  }
  
// Ableitung einer Areacosinus-Funktion:

function derivArcosh (u0, u1) {
  var rad = difference(power(u0,["2"]),["1"]);             // Radikand
  return quotient(u1,squareroot(rad));
  }
  
// Ableitung einer Areatangens-Funktion:

function derivArtanh (u0, u1) {
  return quotient(u1,difference(["1"],power(u0,["2"])));
  }
  
// Ableitungsfunktion:
// u ... UPN-Array der gegebenen Funktion oder undefined
// R�ckgabewert: UPN-Array der Ableitungsfunktion oder undefined
  
function derivative (u) {
  if (u == undefined || u.length == 0) {                   // Falls UPN-Array undefiniert oder leer ...
    alert(text09);                                         // Fehlermeldung
    return undefined;                                      // R�ckgabewert undefined
    }
  var last = u[u.length-1];                                // Letztes Symbol (Operation)
  if (u.length == 1) {                                     // Falls nur ein Symbol ...           
    if (isNumber(last)) return ["0"];                      // Ableitung einer Zahl
    if (last == "x") return ["1"];                         // Ableitung der Variablen x
    if (isMathConstant(last)) return ["0"];                // Ableitung einer Konstante
    }
  if (last == "mi") return derivMinus(u);                  // Ableitung eines Minus-Ausdrucks
  if (isBinary(last)) {                                    // Falls bin�re Operation ...
    ops = operands(u);                                     // Array mit UPN-Arrays der beiden Operanden
    var upnU = ops[0];                                     // UPN-Array des ersten Operanden
    var upnV = ops[1];                                     // UPN-Array des zweiten Operanden
    var upnU1 = derivative(upnU);                          // UPN-Array der Ableitung des ersten Operanden
    var upnV1 = derivative(upnV);                          // UPN-Array der Ableitung des zweiten Operanden
    if (last == "su") return sum(upnU1,upnV1);             // Ableitung einer Summe (Summenregel)
    if (last == "di") return difference(upnU1,upnV1);      // Ableitung einer Differenz (Summenregel)
    if (last == "pr") return derivProd(upnU,upnV,upnU1,upnV1); // Ableitung eines Produkts (Produktregel)    
    if (last == "qu") return derivQuot(upnU,upnV,upnU1,upnV1); // Ableitung eines Quotienten (Quotientenregel)
    if (last == "po") return derivPow(upnU,upnV,upnU1,upnV1);  // Ableitung einer Potenz
    }
  if (isFunction(last)) {                                  // Falls Funktionswert ...
    var upnU = u.slice(0,u.length-1);                      // UPN-Array des Arguments (Kopie)
    var upnU1 = derivative(upnU);                          // UPN-Array der Ableitung des Arguments
    if (last == "abs") return derivAbs(upnU,upnU1);        // Ableitung eines Absolutbetrags
    if (last == "sgn0") return derivSgn0();                // Ableitung einer Signum-Funktion
    if (last == "sqrt") return derivSqrt(upnU,upnU1);      // Ableitung einer Quadratwurzel
    if (last == "exp") return derivExp(upnU,upnU1);        // Ableitung einer e-Funktion
    if (last == "ln") return derivLn(upnU,upnU1);          // Ableitung einer ln-Funktion
    if (last == "sin") return derivSin(upnU,upnU1);        // Ableitung einer Sinus-Funktion
    if (last == "cos") return derivCos(upnU,upnU1);        // Ableitung einer Cosinus-Funktion
    if (last == "tan") return derivTan(upnU,upnU1);        // Ableitung einer Tangens-Funktion
    if (last == "arcsin") return derivArcsin(upnU,upnU1);  // Ableitung einer Arcussinus-Funktion
    if (last == "arccos") return derivArccos(upnU,upnU1);  // Ableitung einer Arcuscosinus-Funktion
    if (last == "arctan") return derivArctan(upnU,upnU1);  // Ableitung einer Arcustangens-Funktion
    if (last == "sinh") return derivSinh(upnU,upnU1);      // Ableitung einer Hyperbelsinus-Funktion
    if (last == "cosh") return derivCosh(upnU,upnU1);      // Ableitung einer Hyperbelcosinus-Funktion
    if (last == "tanh") return derivTanh(upnU,upnU1);      // Ableitung einer Hyperbeltangens-Funktion
    if (last == "arsinh") return derivArsinh(upnU,upnU1);  // Ableitung einer Areasinus-Funktion
    if (last == "arcosh") return derivArcosh(upnU,upnU1);  // Ableitung einer Areacosinus-Funktion
    if (last == "artanh") return derivArtanh(upnU,upnU1);  // Ableitung einer Areatangens-Funktion
    }
  return undefined;                                     
  }
  
//.................................................................................................
// Berechnung von Funktionswerten
//.................................................................................................
  
// Signumfunktion mit Definitionsl�cke bei x = 0:

function sgn0 (x) {
  if (x != 0) return (x>0 ? 1 : -1);
  return NaN;
  }  
  
// Hyperbelsinus:

function sinh (x) {
  var e = Math.exp(x); return (e-1/e)/2;
  }
    
// Hyperbelcosinus:

function cosh (x) {
  var e = Math.exp(x); return (e+1/e)/2;
  }
    
// Hyperbeltangens:

function tanh (x) {
  var e = Math.exp(2*x); return (e-1)/(e+1);
  }
    
// Areasinus:

function arsinh (x) {
  return Math.log(x+Math.sqrt(x*x+1));
  }
    
// Areacosinus:

function arcosh (x) {
  return Math.log(x+Math.sqrt(x*x-1));
  }
    
// Areatangens:

function artanh (x) {
  return Math.log((1+x)/(1-x))/2;
  }
  
// Funktionswert berechnen:

function value (u, x) {
  var a = new Array();                                     // Neuer Stack (zun�chst leer)
  for (var i=0; i<u.length; i++) {                         // F�r alle Elemente des UPN-Arrays ...
    var e = u[i];                                          // Aktuelles Element
    if (isNumber(e)) {a.push(Number(e)); continue;}        // Falls Zahl, zum Stack hinzuf�gen
    if (e == "x") {a.push(Number(x)); continue;}           // Falls Variable x, Wert von x zum Stack hinzuf�gen
    if (isMathConstant(e)) {                               // Falls mathematische Konstante ...
      if (e == "e") a.push(Math.E);                        // Wert der eulerschen Zahl zum Stack hinzuf�gen
      else if (e == "pi") a.push(Math.PI);                 // Wert der Kreiszahl zum Stack hinzuf�gen
      continue;
      }
    if (e == "mi") {                                       // Falls Minus-Ausdruck ...
      var arg = a.pop();                                   // Argument aus Stack entnehmen
      a.push(-arg); continue;                              // Ergebnis zum Stack hinzuf�gen                                                           
      }
    if (isBinary(e)) {                                     // Falls bin�re Operation ...
      var op2 = a.pop(), op1 = a.pop();                    // Operanden aus Stack entnehmen
      if (e == "su") a.push(op1+op2);                      // Wert der Summe zum Stack hinzuf�gen
      else if (e == "di") a.push(op1-op2);                 // Wert der Differenz zum Stack hinzuf�gen
      else if (e == "pr") a.push(op1*op2);                 // Wert des Produkts zum Stack hinzuf�gen
      else if (e == "qu") a.push(op1/op2);                 // Wert des Quotienten zum Stack hinzuf�gen
      else if (e == "po") a.push(Math.pow(op1,op2));       // Wert der Potenz zum Stack hinzuf�gen
      continue;
      }
    if (isFunction(e)) {                                   // Falls Funktionswert ...
      arg = a.pop();                                       // Argument aus Stack entnehmen
      if (e == "abs") a.push(Math.abs(arg));               // Absoluten Betrag zum Stack hinzuf�gen
      else if (e == "sgn0") a.push(sgn0(arg));             // Wert der Signumfunktion zum Stack hinzuf�gen
      else if (e == "sqrt") a.push(Math.sqrt(arg));        // Wert der Quadratwurzel zum Stack hinzuf�gen
      else if (e == "exp") a.push(Math.exp(arg));          // Wert der e-Funktion zum Stack hinzuf�gen
      else if (e == "ln") a.push(Math.log(arg));           // Wert der ln-Funktion zum Stack hinzuf�gen
      else if (e == "sin") a.push(Math.sin(arg));          // Sinuswert zum Stack hinzuf�gen
      else if (e == "cos") a.push(Math.cos(arg));          // Cosinuswert zum Stack hinzuf�gen
      else if (e == "tan") a.push(Math.tan(arg));          // Tangenswert zum Stack hinzuf�gen
      else if (e == "arcsin") a.push(Math.asin(arg));      // Arcussinuswert zum Stack hinzuf�gen
      else if (e == "arccos") a.push(Math.acos(arg));      // Arcuscosinuswert zum Stack hinzuf�gen
      else if (e == "arctan") a.push(Math.atan(arg));      // Arcustangenswert zum Stack hinzuf�gen
      else if (e == "sinh") a.push(sinh(arg));             // Hyperbelsinuswert zum Stack hinzuf�gen
      else if (e == "cosh") a.push(cosh(arg));             // Hyperbelcosinuswert zum Stack hinzuf�gen
      else if (e == "tanh") a.push(tanh(arg));             // Hyperbeltangenswert zum Stack hinzuf�gen
      else if (e == "arsinh") a.push(arsinh(arg));         // Areasinuswert zum Stack hinzuf�gen
      else if (e == "arcosh") a.push(arcosh(arg));         // Areacosinuswert zum Stack hinzuf�gen
      else if (e == "artanh") a.push(artanh(arg));         // Areatangenswert zum Stack hinzuf�gen
      continue;
      }
    }
  if (a.length != 1) return NaN;                           // Falls Fehler, R�ckgabewert NaN
  else return a[0];                                        // Sonst korrekter R�ckgabewert
  }

//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad (Standardwerte)
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
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
  ctx.lineWidth = 1;                                       // Liniendicke zur�cksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }

// Ausgabe eines UPN-Arrays:
// u ......... Gegebenes UPN-Array
// (x0,y0) ... Position (Pixel)

function writeUPN (u, x0, y0) {
  if (u == undefined) ctx.fillText(u,x0,y0);               // Entweder Ausgabe von undefined
  else {                                                   // ... oder ...
    var x = x0, y = y0;                                    // Startwerte f�r Position
    for (var i=0; i<u.length; i++) {                       // F�r alle Elemente des UPN-Arrays ...
      ctx.fillText(u[i],x,y);                              // Element ausgeben
      x += ctx.measureText(u[i]).width+10;                 // Waagrechte Koordinate erh�hen
      if (x > width-50) {x = x0; y += 20;}                 // Falls zu weit rechts, n�chste Zeile
      }
    }
  }
  
// Ausgabe eines Funktionswertes:
// fn ........... Name der Funktion
// u ............ UPN-Array der Funktion
// x ............ x-Wert
// posX, posY ... Bildschirmkoordinaten (Pixel)

function writeValue (fn, u, x, posX, posY) {
  var y = (u.length>0 ? value(u,x) : NaN);                 // y-Wert, falls definiert, sonst NaN
  var s = fn+"("+x+") = "+(isNaN(y)?"?":""+y);             // Zeichenkette
  ctx.fillText(s,posX,posY);                               // Ausgabe der Zeichenkette
  }
  
// Gitternetz:
// (u0,v0) ... Bildschirmkoordinaten des Ursprungs (Pixel)
// d ......... Abstand der Linien (mathematische Koordinaten)

function grid (u0, v0, d) {
  ctx.strokeStyle = colorGrid;                             // Linienfarbe
  var iMin = Math.floor(xMin/d);                           // Kleinster Index (f�r senkrechte Linien)
  var iMax = Math.ceil(xMax/d);                            // Gr��ter Index (f�r senkrechte Linien)
  for (var i=iMin; i<=iMax; i++) {                         // F�r alle Indizes ...
    var u = (i*d-xMin)*pix;                                // Waagrechte Bildschirmkoordinate (Pixel)
    if (u < 2 || u > width-2) continue;                    // Falls zu weit links oder rechts, weiter zur n�chsten Linie
    line(u,0,u,height,0.5);                                // Senkrechte Linie zeichnen
    }
  iMin = Math.floor(yMin/d);                               // Kleinster Index (f�r waagrechte Linien)
  iMax = Math.ceil(yMax/d);                                // Gr��ter Index (f�r waagrechte Linien)
  for (i=iMin; i<=iMax; i++) {                             // F�r alle Indizes ...
    var v = height-(i*d-yMin)*pix;                         // Senkrechte Bildschirmkoordinate (Pixel)
    if (v < 2 || v > height-2) continue;                   // Falls zu weit oben oder unten, weiter zur n�chsten Linie
    line(0,v,height,v,0.5);                                // Waagrechte Linie zeichnen
    }
  }
  
// Koordinatensystem mit Beschriftung:
// (u0,v0) ... Bildschirmkoordinaten des Ursprungs (Pixel)
// d ......... Abstand der Ticks (mathematische Koordinaten)
// step ...... Schrittweite f�r Beschriftung der Ticks
// n ......... Zahl der Nachkommastellen bei der Beschriftung der Ticks

function coordSystem (u0, v0, d, step, n) {
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  arrow(0,v0,width,v0);                                    // x-Achse
  ctx.fillText(symbolX,width-7,v0+14);                     // Beschriftung (x)
  var iMin = Math.floor(xMin/d);                           // Kleinster Index f�r Ticks der x-Achse
  var iMax = Math.ceil(xMax/d);                            // Gr��ter Index f�r Ticks der x-Achse
  for (var i=iMin; i<=iMax; i++) {                         // F�r alle Indizes ...
    var u = (i*d-xMin)*pix;                                // Waagrechte Bildschirmkoordinate (Pixel)
    if (u < 2 || u > width-2) continue;                    // Falls zu weit links oder rechts, weiter zum n�chsten Tick
    line(u,v0-3,u,v0+3);                                   // Tick zeichnen
    if (i == 0 || i%step != 0) continue;                   // Falls keine Beschriftung n�tig, weiter zum n�chsten Tick
    if (u < 20 || u > width-20) continue;                  // Falls zu nahe am linken oder rechten Rand, keine Beschriftung 
    var s = ToString(i*d,n,true);                          // Zahl f�r Tick in Zeichenkette umwandeln 
    var w = ctx.measureText(s).width;                      // Breite der Zahl (Pixel)
    var vN = v0+15;                                        // Senkrechte Bildschirmkoordinate f�r Beschriftung (Pixel)
    vN = Math.max(vN,10); vN = Math.min(vN,height-5);      // Falls zu nahe am oberen oder unteren Rand, korrigieren 
    if (v0 <= 0 || v0 >= height) vN = height-5;            // Falls x-Achse au�erhalb, Beschriftung am unteren Rand
    ctx.fillText(s,u,vN);                                  // Beschriftung Tick
    }
  ctx.textAlign = (u0>0 && u0<width ? "right" : "left");   // Textausrichtung je nach Sichtbarkeit der y-Achse
  arrow(u0,height,u0,0);                                   // y-Achse
  ctx.fillText(symbolY,u0-6,10);                           // Beschriftung (y)
  iMin = Math.floor(yMin/d);                               // Kleinster Index f�r Ticks der y-Achse
  iMax = Math.ceil(yMax/d);                                // Gr��ter Index f�r Ticks der y-Achse
  for (i=iMin; i<=iMax; i++) {                             // F�r alle Indizes ...
    var v = height-(i*d-yMin)*pix;                         // Senkrechte Bildschirmkoordinate (Pixel)
    if (v < 2 || v > height-2) continue;                   // Falls zu weit oben oder unten, weiter zum n�chsten Tick
    line(u0-2,v,u0+2,v);                                   // Tick zeichnen
    if (i == 0 || i%step != 0) continue;                   // Falls keine Beschriftung n�tig, weiter zum n�chsten Tick
    if (v < 20 || v > height-20) continue;                 // Falls zu nahe am Rand, keine Beschriftung
    s = ToString(i*d,n,true);                              // Zahl f�r Tick in Zeichenkette umwandeln 
    var uN = u0-5;                                         // Senkrechte Bildschirmkoordinate f�r Beschriftung (Pixel)
    uN = Math.max(uN,5); uN = Math.min(uN,width-5);        // Falls zu nahe am linken oder rechten Rand, korrigieren
    if (u0 <= 0 || u0 >= width) uN = 5; 
    ctx.fillText(s,uN,v+5);
    }
  }
  
// Berechnungen f�r Koordinatensystem und Gitternetz:
// R�ckgabewert: Objekt mit den Attributen dist (Abstand der Gitterlinien, mathematische Koordinaten),
// step (Schrittweite f�r die Beschriftung der Ticks) und nDig (Zahl der Nachkommastellen bei der Beschriftung der Ticks)

function dataCoordSystem () {
  var dx = xMax-xMin;                                      // Breite des gezeichneten Bereichs (mathematische Koordinaten)
  var exp10 = Math.floor(Math.log(dx)/Math.LN10);          // Zehnerexponent
  var pow10 = Math.pow(10,exp10);                          // Zehnerpotenz
  if (pow10 > 0.5) pow10 = Math.round(pow10);              // Falls 1 oder gr��er, runden
  var q = dx/pow10;
  if (q >= 5.001) d = 0.5*pow10;
  else if (q >= 2.001) d = 0.2*pow10;
  else d = 0.1*pow10;
  var n = Math.max(1-exp10,0);                             // Zahl der Nachkommastellen, vorl�ufiger Wert
  var st = 1;                                              // Schrittweite, vorl�ufiger Wert
  var w1 = ctx.measureText(ToString(xMin,n,true)).width;   // Breite Beschriftung links (Pixel)
  var w2 = ctx.measureText(ToString(xMax,n,true)).width;   // Breite Beschriftung rechts (Pixel)
  if (Math.max(w1,w2) > d*pix/2) {                         // Falls Breite zu gro� ...
    if (q >= 5.001) {st = 2; if (n > 0) n--;}
    else if (q >= 2.001) {st = 5; if (n > 0) n--;}
    else st = 2;
    }
  return {dist: d, step: st, nDig: n};                     // R�ckgabewert
  }
  
// �berpr�fung, ob y-Wert im gezeichneten Bereich:

function isInside (y) {
  if (y < yMin) return -1;                                 // Unterhalb des gezeichneten Bereichs
  else if (y > yMax) return 1;                             // Oberhalb des gezeichneten Bereichs
  else return 0;                                           // Im gezeichneten Bereich
  }
  
// Bildschirmkoordinate:
  
function vScreen (y, def, inside) {
  var v = -1;                                              // Senkrechte Bildschirmkoordinate oberhalb (Pixel)
  if (def && inside == 0) v = (yMax-y)*pix;                // Senkrechte Bildschirmkoordinate innerhalb (Pixel)
  else if (def && inside < 0) v = height+1;                // Senkrechte Bildschirmkoordinate unterhalb (Pixel)
  return v;                                                // R�ckgabewert
  }
      
// Zeichnen eines Funktionsgraphen:
// upnF ... UPN-Array des gegebenen Funktionsterms

function plotGraph (upnF) {
  var deriv = (upnF == upn1 || upnF == upn2);              // Flag f�r Ableitungsfunktion
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.lineWidth = 1;                                       // Liniendicke
  var u = 0;                                               // Startwert f�r waagrechte Bildschirmkoordinate (Pixel) 
  var x = xMin+u/pix;                                      // Zugeh�riger x-Wert
  var y = value(upnF,x);                                   // Zugeh�riger y-Wert
  var def1 = isFinite(y);                                  // �berpr�fung, ob y-Wert definiert
  if (deriv && !isFinite(value(upn,x))) def1 = false;      // Ableitungen nicht definiert, falls Ausgangsfunktion nicht definiert
  var inside1 = isInside(y);                               // �berpr�fung, ob Punkt oberhalb, innerhalb oder unterhalb
  var v = vScreen(y,def1,inside1);                         // Senkrechte Bildschirmkoordinate (Pixel)
  if (def1) ctx.moveTo(u,v);                               // Anfangspunkt                              
  while (u < width) {                                      // Solange rechter Rand noch nicht erreicht ...
    u+=1/8;                                                // Waagrechte Bildschirmkoordinate erh�hen
    var def0 = def1, inside0 = inside1;                    // Flags vom fr�heren Punkt �bernehmen
    x = xMin+u/pix;                                        // Neuer x-Wert
    y = value(upnF,x);                                     // Zugeh�riger y-Wert
    def1 = isFinite(y);                                    // �berpr�fung, ob y-Wert definiert
    if (deriv && !isFinite(value(upn,x))) def1 = false;    // Ableitungen nicht definiert, falls Ausgangsfunktion nicht definiert
    inside1 = isInside(y);                                 // �berpr�fung, ob Punkt oberhalb, innerhalb oder unterhalb
    v = vScreen(y,def1,inside1);                           // Senkrechte Bildschirmkoordinate (Pixel)
    if (def0 && def1 && inside0*inside1 >= 0) ctx.lineTo(u,v); // Entweder Linie zeichnen ...
    else ctx.moveTo(u,v);                                  // oder neuen Anfangspunkt festlegen
    }
  ctx.stroke();                                            // Polygonzug zeichnen
  }
  
// Zeichnen eines Punktes:
// x, y ... Koordinaten
// c ...... Farbe

function drawPoint (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var u = (x-xMin)*pix, v = (yMax-y)*pix;                  // Bildschirmkoordinaten (Pixel)
  ctx.arc(u,v,2.5,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.fillStyle = (c?c:"#000000");                         // F�llfarbe
  ctx.fill();                                              // Ausgef�llten Kreis zeichnen
  }
  
// Zeichnen der Tangente:
// (x0,y0) ... Ber�hrpunkt

function drawTangent (x0, y0) {
  var m = value(upn1,x0);                                  // Steigung
  var u0 = (x0-xMin)*pix, v0 = (yMax-y0)*pix;              // Bildschirmkoordinaten des Ber�hrpunkts
  var u1 = u0+width, v1 = v0-width*m;                      // Rechter Endpunkt (au�erhalb des sichtbaren Bereichs)
  var u2 = u0-width, v2 = v0+width*m;                      // Linker Endpunkt (au�erhalb des sichtbaren Bereichs)
  ctx.strokeStyle = colorDerivative1;                      // Linienfarbe
  line(u1,v1,u2,v2);                                       // Linie zeichnen
  }
    
// Testangaben:
// x ... Gegebener x-Wert

function valuesTest (x) {
  writeUPN(upn,20,20);                                     // UPN-Array der gegebenen Funktion
  writeUPN(upn1,20,120);                                   // UPN-Array der 1. Ableitungsfunktion
  writeUPN(upn2,20,220);                                   // UPN-Array der 2. Ableitungsfunktion
  writeValue("f",upn,x,20,300);                            // Funktionswert
  writeValue("f'",upn1,x,20,320);                          // Wert der 1. Ableitung
  writeValue("f''",upn2,x,20,340);                         // Wert der 2. Ableitung
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.font = FONT;                                         // Zeichensatz
  //valuesTest(3); return;                                   // Ausgabe wichtiger Daten zu Testzwecken
  var u0 = -xMin*pix, v0 = yMax*pix;                       // Bildschirmkoordinaten des Ursprungs (Pixel)
  var dCS = dataCoordSystem();                             // Daten f�r Koordinatensystem
  var dist = dCS.dist;                                     // Abstand der Gitterlinien
  var step = dCS.step;                                     // Schrittweite f�r Beschriftung der Ticks
  var nDig = dCS.nDig;                                     // Zahl der Nachkommastellen
  grid(u0,v0,dist);                                        // Gitternetz
  coordSystem(u0,v0,dist,step,nDig);                       // Koordinatensystem mit Ticks und Beschriftung
  ctx.strokeStyle = colorFunction;                         // Farbe f�r gegebene Funktion
  plotGraph(upn);                                          // Graph der gegebenen Funktion
  var y0 = value(upn,x0);                                  // y-Koordinate des Ber�hrpunkts
  drawTangent(x0,y0);                                      // Tangente
  drawPoint(x0,y0);                                        // Ber�hrpunkt
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen
