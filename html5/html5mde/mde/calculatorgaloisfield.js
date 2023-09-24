// Rechnen in Galois-Feldern
// 26.07.2022 - 05.08.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel calculatorgaloisfield_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var color1 = "#ffff00";                                    // Farbe f�r hervorgehobene Zeile oder Spalte
var color2 = "#ff0000";                                    // Farbe f�r Rahmen um Ergebnis

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";          // Zeichensatz
var DX = 50;                                              // Spaltenabstand (Pixel, wird sp�ter angepasst)
var DY = 30;                                              // Zeilenabstand (Pixel)
var LEFT1 = 100, LEFT2 = 40;                              // Zus�tzliche Breite Kopfspalte (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ch1, ch9, ch10;                                        // Auswahlfelder
var rb3, rb4, rb5, rb6, rb7, rb8;                          // Radiobuttons
var op2, op11;                                             // Ausgabefelder
var nr;                                                    // Nummer der Rechenoperation (1 bis 6)
var q;                                                     // Ordnung (Primzahlpotenz p^n)
var p;                                                     // Charakteristik
var n;                                                     // Exponent
var minPoly;                                               // Minimalpolynom
var coeffPower;                                            // Zweifach indiziertes Array f�r Potenzen der Wurzel
var gf;                                                    // Array der K�rperelemente
var inv;                                                   // Array der inversen Elemente bez�glich Multiplikation
var z1, z2;                                                // Gegebene Operanden   
var z;                                                     // Ergebnis
var xM, yM;                                                // Position des Mauszeigers (Pixel)
var offsetX;                                               // Verschiebung nach links (Pixel)
var offsetY;                                               // Verschiebung nach oben (Pixel)
var x0;                                                    // Linker Tabellenrand (Pixel)
var y0;                                                    // Oberer Tabellenrand                                                   
var x1;                                                    // x-Koordinate Trennlinie (Pixel)
var y1;                                                    // y-Koordinate Trennlinie (Pixel)
var x2;                                                    // Rechter Tabellenrand (Pixel)
var y2;                                                    // Unterer Tabellenrand (Pixel)
var drag;                                                  // Flag f�r Zugmodus

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }
  
// L�schung der Optionen eines Auswahlfelds:
// ch ... Auswahlfeld

function clearSelect (ch) {
  while (ch.length > 0) ch.remove(0);                      // Solange Optionen vorhanden, erste Option l�schen
  }
  
// Index des oberen Auswahlfelds (Eingabe der Ordnung q):

function indexQ () {
  for (var i=0; i<ch1.length; i++)                         // F�r alle Indizes ...
    if (Number(ch1.options[i].value) == q) return i;       // R�ckgabewert, falls �bereinstimmung mit Option
  return 0;                                                // R�ckgabewert, falls keine �bereinstimmung
  }
  
// Initialisierung des oberen Auswahlfelds (Eingabe der Ordnung q):

function initSelectQ () {
  clearSelect(ch1);                                        // Bisherige Optionen l�schen
  for (var q=2; q<=100; q++) {                             // F�r alle Zahlen von 2 bis 100 ...
    var a = arrayPN(q);                                    // Array [p, n] mit p^n = q oder undefined
    if (a == undefined) continue;                          // Falls keine Primzahlpotenz, weiter zur n�chsten Zahl q
    var o = document.createElement("option");              // Neue Option
    o.text = String(q);                                    // Zugeh�riger Text
    ch1.add(o);                                            // Option zum Auswahlfeld hinzuf�gen
    }
  }
  
// Anpassung eines Auswahlfelds (1. oder 2. Operand):
// ch ... Auswahlfeld (ch9 oder ch10)
  
function updateSelect (ch) {
  clearSelect(ch);                                         // Bisherige Optionen l�schen
  for (var i=0; i<q; i++) {                                // F�r alle Zahlen von 0 bis q-1 ...
    var o = document.createElement("option");              // Neue Option
    o.text = String(gf[i]);                                // Zugeh�riger Text
    ch.add(o);                                             // Option hinzuf�gen
    }
  ch.selectedIndex = 0;                                    // Zun�chst Option mit Index 0 ausgew�hlt
  }
  
// Neues Auswahlfeld mit erl�uterndem Text:
// idS .... ID f�r Auswahlfeld im HTML-Text
// idL .... ID f�r Erl�uterung im HTML-Text
// text ... Erl�uternder Text
  
function newSelect (idS, idL, text) {
  getElement(idL,text);                                    // Erl�uternder Text                              
  var ch = getElement(idS);                                // Auswahlfeld
  updateSelect(ch);                                        // Auswahlfeld anpassen
  return ch;                                               // R�ckgabewert
  }
  
// Neuer Radiobutton mit erl�uterndem Text:
// idR .... ID f�r Radiobutton im HTML-Text
// idL .... ID f�r Erl�uterung im HTML-Text
// text ... Erl�uternder Text
  
function newRadio (idR, idL, text) {
  getElement(idL,text);                                    // Erl�uternder Text
  return getElement(idR);                                  // R�ckgabewert
  }
  
// Neues Ausgabefeld mit erl�uterndem Text:
// idO .... ID f�r Ausgabefeld im HTML-Text
// idL .... ID f�r Erl�uterung im HTML-Text
// text ... Erl�uternder Text
  
function newOutput (idO, idL, text) {
  getElement(idL,text);                                    // Erl�uternder Text
  var op = getElement(idO);                                // Ausgabefeld (eigentlich Eingabefeld)
  op.readOnly = true;                                      // Nur Lesen erlaubt
  return op;                                               // R�ckgabewert
  }

// Start:

function start () {
  nr = 1;                                                  // Zun�chst Addition
  q = 5;                                                   // Zun�chst Galois-Feld GF(5)
  initGF(5,1);                                             // Berechnung von coeffPower, gf und inv (Seiteneffekt)
  offsetX = offsetY = 0;                                   // Verschiebungsvektor
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ch1 = newSelect("ch1","lb1",text01);                     // Auswahlfeld (Ordnung)
  initSelectQ();                                           // Optionen hinzuf�gen
  ch1.selectedIndex = indexQ();                            // Index des Auswahlfelds (abh�ngig von q)
  op2 = newOutput("op2","lb2",text02);                     // Ausgabefeld (Charakteristik)
  rb3 = newRadio("rb3","lb3",text03);                      // Radiobutton (Addition)
  rb4 = newRadio("rb4","lb4",text04);                      // Radiobutton (Subtraktion)
  rb5 = newRadio("rb5","lb5",text05);                      // Radiobutton (Multiplikation)
  rb6 = newRadio("rb6","lb6",text06);                      // Radiobutton (Division)
  rb7 = newRadio("rb7","lb7",text07);                      // Radiobutton (Inverses bez�glich Addition)
  rb8 = newRadio("rb8","lb8",text08);                      // Radiobutton (Inverses bez�glich Multiplikation)
  rb3.checked = true;                                      // Zun�chst Addition ausgew�hlt
  ch9 = newSelect("ch9","lb9",text11);                     // Auswahlfeld (1. Operand)
  ch10 = newSelect("ch10","lb10",text12);                  // Auswahlfeld (2. Operand)
  op11 = newOutput("op11","lb11",text13);                  // Ausgabefeld (Ergebnis)
  getElement("author",author);                             // Autor (und �bersetzer)
  drag = false;                                            // Zun�chst kein Zugmodus                                                
  reactionQ();                                             // Berechnungen f�r neues Galois-Feld, Ausgabe
  
  ch1.onchange = reactionQ;                                // Reaktion auf Auswahlfeld (Ordnung)
  rb3.onclick = reaction;                                  // Reaktion auf Radiobutton (Addition)
  rb4.onclick = reaction;                                  // Reaktion auf Radiobutton (Subtraktion)
  rb5.onclick = reaction;                                  // Reaktion auf Radiobutton (Multiplikation)
  rb6.onclick = reaction;                                  // Reaktion auf Radiobutton (Division)
  rb7.onclick = reaction;                                  // Reaktion auf Radiobutton (Inverses Element bez�glich Addition)
  rb8.onclick = reaction;                                  // Reaktion auf Radiobutton (Inverses Element bez�glich Multiplikation)
  ch9.onchange = reaction;                                 // Reaktion auf Auswahlfeld (1. Operand)
  ch10.onchange = reaction;                                // Reaktion auf Auswahlfeld (2. Operand)
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers  
  canvas.onmouseout = reactionExit;                        // Reaktion auf Verlassen der Zeichenfl�che  
  
  } // Ende der Methode start
  
// Anpassung der erl�uternden Texte f�r Operanden und Ergebnis:
// t1 ... Text f�r 1. Operand
// t2 ... Text f�r 2. Operand (eventuell leer)
// t3 ... Text f�r Ergebnis
  
function modifyText (t1, t2, t3) {
  getElement("lb9").innerHTML = t1;                        // Text f�r 1. Eingabe
  getElement("lb10").innerHTML = t2;                       // Text f�r 2. Eingabe (eventuell leer)
  getElement("lb11").innerHTML = t3;                       // Text f�r Ergebnis
  if (nr > 4) {                                            // Falls nur ein Operand ...
    clearSelect(ch10);                                     // Leeres Auswahlfeld f�r 2. Operanden
    ch10.disabled = true;                                  // Auswahlfeld deaktivieren
    }
  else ch10.disabled = false;                              // Falls 2 Operanden, Auswahlfeld aktivieren
  }
  
// Erneuerung des Auswahlfelds f�r den 2. Operanden:
// Diese Methode muss beim Wechsel von einer einstelligen zu einer zweistelligen Verkn�pfung aufgerufen werden.
  
function renewCh10 () {
  updateSelect(ch10);                                      // Auswahlfeld f�r den 2. Operanden wiederherstellen
  ch10.selectedIndex = z2.index();                         // Index Auswahlfeld
  }
  
// Reaktion auf Radiobuttons und Auswahlfelder:
// Seiteneffekt nr, z1, z2, z, x0, y0, x1, y1, x2, y2, offsetX, offsetY, DX
// Wirkung auf erl�uternde Texte und Ausgabefelder
  
function reaction () {
  op2.value = " "+p;                                       // Ausgabefeld f�r Charakteristik anpassen
  var nr0 = nr;                                            // Nummer der bisherigen Rechenoperation
  if (rb3.checked) nr = 1;                                 // Neue Nummer f�r Addition
  else if (rb4.checked) nr = 2;                            // Neue Nummer f�r Subtraktion
  else if (rb5.checked) nr = 3;                            // Neue Nummer f�r Multiplikation
  else if (rb6.checked) nr = 4;                            // Neue Nummer f�r Division
  else if (rb7.checked) nr = 5;                            // Neue Nummer f�r Inverses bez�glich Addition
  else if (rb8.checked) nr = 6;                            // Neue Nummer f�r Inverses bez�glich Multiplikation
  var two = (nr < 5);                                      // Flag f�r zweistellige Verkn�pfung
  if (nr0 > 4 && two) renewCh10();                         // Falls n�tig, Auswahlfeld f�r 2. Operanden erneuern 
  var i1 = ch9.selectedIndex;                              // Index 1. Operand 
  z1 = gf[i1];                                             // 1. Operand
  var i2 = (two ? ch10.selectedIndex : undefined);         // Index 2. Operand (eventuell undefiniert)
  if (two) z2 = gf[i2];                                    // Falls definiert, 2. Operand 
  if (nr == 1) modifyText(text11,text12,text13);           // Erl�uternde Texte f�r Addition ...
  else if (nr == 2) modifyText(text21,text22,text23);      // ... oder Subtraktion ...
  else if (nr == 3) modifyText(text31,text32,text33);      // ... oder Multiplikation ...
  else if (nr == 4) modifyText(text41,text42,text43);      // ... oder Division ...
  else if (nr == 5) modifyText(text51,"",text52);          // ... oder f�r Inverses (Addition) ...
  else if (nr == 6) modifyText(text61,"",text62);          // ... oder f�r Inverses (Multiplikation)
  z = (two ? result2(i1,i2) : result1(i1));                // Ergebnis (eventuell undefiniert)
  op11.value = (z!==undefined ? String(z) : undef);        // Ausgabefeld f�r Ergebnis anpassen
  calcXY(two);                                             // Berechnung von x0, y0, x1, y1, x2, y2
  var j = (two ? i2 : i1);                                 // Spaltenindex
  offsetX = (j+1)*DX+(x1-width)/2;                         // Verschiebung in x-Richtung, vorl�ufig  
  if (offsetX < 0) offsetX = 0;                            // Verschiebung nach rechts verhindern
  offsetY = (two ? (i1+1)*DY+(y1-height)/2 : 0);           // Verschiebung in y-Richtung, vorl�ufig
  if (offsetY < 0) offsetY = 0;                            // Verschiebung nach unten verhindern
  paint();                                                 // Neu zeichnen (Tabelle)
  }
  
// Reaktion auf oberes Auswahlfeld (neues Galois-Feld):
// Seiteneffekt q, p, n, minPoly, coeffPower, gf, inv, z1, z2, nr, z, x0, y0, x1, y1, x2, y2, offsetX, offsetY, DX
  
function reactionQ () {
  var i = ch1.selectedIndex;                               // Aktueller Index im oberen Auswahlfeld
  q = Number(ch1.options[i].value);                        // Ordnung des Galois-Felds
  var a = arrayPN(q);                                      // Array, bestehend aus Charakteristik p und Exponent n                   
  p = a[0]; n = a[1];                                      // Werte �bernehmen
  minPoly = minimalPolynomial(p,n);                        // Minimalpolynom, f�r n = 1 undefined
  initGF(p,n);                                             // Berechnung von coeffPower, gf und inv
  z1 = gf[0]; z2 = gf[0];                                  // Beide Operanden gleich 0
  updateSelect(ch9);                                       // Auswahlfeld f�r den 1. Operanden anpassen
  updateSelect(ch10);                                      // Auswahlfeld f�r den 2. Operanden anpassen
  reaction();                                              // Normale Reaktion (Rechnung!)
  }
  
// Reaktion auf Dr�cken der Maustaste:
// Seiteneffekt drag, xM, yM 
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen                  
  }
  
// Reaktion auf Ber�hrung:
// Seiteneffekt drag, xM, yM
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen
  if (drag) e.preventDefault();                            // Falls Zugmodus, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
// Seiteneffekt drag
  
function reactionMouseUp (e) {                                            
  drag = false;                                            // Zugmodus ausschalten
  }
  
// Reaktion auf Ende der Ber�hrung:
// Seiteneffekt drag
  
function reactionTouchEnd (e) {             
  drag = false;                                           // Zugmodus ausschalten
  }
  
// Reaktion auf Bewegen der Maus:
// Seiteneffekt offsetX, offsetY, xM, yM
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls kein Zugmodus
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
// Seiteneffekt offsetX, offsetY, xM, yM
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls kein Zugmodus
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  } 

// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl eines Objekts):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt drag, xM, yM

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  drag = true;                                             // Zugmodus einschalten
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt offsetX, offsetY, xM, yM, DX

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  offsetX -= (x-xM);                                       // Waagrechte Verschiebung        
  if (offsetX < 0) offsetX = 0;                            // Verschiebung nach rechts verhindern
  if (x1+(q+1)*DX <= width) offsetX = 0;                   // Falls kleine Verkn�pfungstafel, keine Verschiebung
  if (offsetX > (q+1)*DX) offsetX = (q+1)*DX;              // Zu weite Verschiebung nach links verhindern
  offsetY -= (y-yM);                                       // Senkrechte Verschiebung
  if (offsetY < 0) offsetY = 0;                            // Verschiebung nach unten verhindern
  if (nr > 4) offsetY = 0;                                 // Falls Tabelle von Inversen, keine Verschiebung in y-Richtung
  else if (y1+(q+1)*DY <= height) offsetY = 0;             // Falls kleine Verkn�pfungstafel, keine Verschiebung in y-Richtung
  if (offsetY > (q+1)*DY) offsetY = (q+1)*DY;              // Zu weite Verschiebung nach oben verhindern
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Verlassen der Zeichenfl�che:
// Seiteneffekt drag
  
function reactionExit (e) {
  drag = false;                                            // Zugmodus ausschalten
  }
  
//-------------------------------------------------------------------------------------------------

// Kleinster Primfaktor einer nat�rlichen Zahl:

function firstPrime (n) {
  if (n <= 1) return undefined;                          // Fehlanzeige
  for (var t=2; t*t<=n; t++)                             // F�r alle potentiellen Teiler ...
    if (n%t == 0) return t;                              // R�ckgabewert, falls Primfaktor gefunden
  return n;                                              // R�ckgabewert, falls Primzahl
  }
  
// Nat�rliche Zahl q als Primzahlpotenz p^n:
// R�ckgabewert: Array, bestehend aus Primfaktor p und Exponent n; bei Misserfolg undefined

function arrayPN (q) {  
  var p = firstPrime(q);                                   // Kleinster Primfaktor oder undefiniert
  if (p == undefined) return undefined;                    // Falls kein Primfaktor, R�ckgabewert undefiniert
  var a = new Array(2);                                    // Neues Array der L�nge 2
  a[0] = p;                                                // Primfaktor �bernehmen
  var e = 0;                                               // Startwert Exponent
  do {                                                     // Wiederholen ...
    q /= p;                                                // Durch Primfaktor dividieren 
    if (Math.floor(q) != q) return undefined;              // Falls Zahl nicht ganz, R�ckgabewert undefiniert 
    e++;                                                   // Exponent erh�hen
    }
  while (q > 1);                                           // ... bis q <= 1
  a[1] = e;                                                // Exponent �bernehmen
  return a;                                                // R�ckgabewert (Normalfall)
  }
  
// Rechenzeichen einer zweistelligen Verkn�pfung:
  
function symbol () {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 1: return symbolAdd;                              // Pluszeichen
    case 2: return symbolSub;                              // Minuszeichen
    case 3: return symbolMul;                              // Multiplikationszeichen
    case 4: return symbolDiv;                              // Divisionszeichen
    default: return undefined;                             // R�ckgabewert, falls keine zweistellige Verkn�pfung
    }
  }
  
// Ergebnis einer zweistelligen Verkn�pfung:
// i1 ... Index 1. Operand (0 bis q-1)
// i2 ... Index 2. Operand (0 bis q-1)
  
function result2 (i1, i2) {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 1: return gf[i1].add(gf[i2]);                     // Summe als R�ckgabewert
    case 2: return gf[i1].sub(gf[i2]);                     // Differenz als R�ckgabewert
    case 3: return gf[i1].mul(gf[i2]);                     // Produkt als R�ckgabewert
    case 4: return gf[i1].mul(inv[i2]);                    // Quotient als R�ckgabewert (eventuell undefiniert)
    default: return undefined;                             // R�ckgabewert, falls keine zweistellige Verkn�pfung
    }
  }
  
// Ergebnis einer einstelligen Verkn�pfung:
// i ... Index Argument (0 bis q-1)
  
function result1 (i) {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 5: return gf[i].neg();                            // Inverses bez�glich Addition
    case 6: return inv[i];                                 // Inverses bez�glich Multiplikation (eventuell undefiniert)
    default: return undefined;                             // R�ckgabewert, falls keine einstellige Verkn�pfung
    }
  }
  
// Konstruktor-Ersatz:

function gfIndex (i) {
  if (i == undefined) return undefined;                    // Sonderfall: Index undefiniert
  if (i < 0 || i >= q) return undefined;                   // Sonderfall: Index au�erhalb des erlaubten Bereichs
  var c = new Array(n);                                    // Neues Koeffizienten-Array
  for (var k=0; k<n; k++) {                                // F�r alle Indizes ...
    var r = i%p;                                           // Aktueller Koeffizient
    i = Math.floor(i/p);                                   // Zwischenergebnis
    c[k] = new ZP(r);                                      // Aktueller Koeffizient
    }
  return new GF(c);                                        // R�ckgabewert (Normalfall)
  }

// Initialisierung Galois-Feld:
// Seiteneffekt coeffPower (zweifach indiziertes Array, Koeffizienten f�r Potenzen der Wurzeln)
// Seiteneffekt gf (Array der K�rperelemente)
// Seiteneffekt inv (Array der inversen Elemente bez�glich Multiplikation)

function initGF (p, n) {
  coeffPower = new Array(2*n-1);                           // Neues Array (zweifach indiziert)
  for (var i=0; i<coeffPower.length; i++)                  // F�r alle Indizes ...
    coeffPower[i] = new Array(n);                          // Untergeordnetes Array (einfach indiziert)
  var zero = new ZP(0);                                    // Nullelement von GF(p)
  var one = new ZP(1);                                     // Einselement von GF(p)
  for (i=0; i<n; i++) {                                    // F�r die Exponenten 0 bis n-1 ...
    for (var j=0; j<n; j++)                                // F�r die Koeffizienten-Indizes 0 bis n-1 ...
      coeffPower[i][j] = (i==j ? one : zero);              // Koeffizient (Seiteneffekt)
    }
  if (n == 1) coeffPower[0][0] = one;                      // Sonderfall GF(p)
  else {                                                   // Andernfalls ...
    for (j=0; j<n; j++)                                    // F�r die Koeffizienten-Indizes 0 bis n-1 ...
      coeffPower[n][j] = minPoly.coeff[j].neg();           // Koeffizient f�r Exponent n (Seiteneffekt)
    for (i=n+1; i<2*n-1; i++) {                            // F�r die Exponenten n+1 bis 2n-2 ...
      var f1 = coeffPower[i-1][n-1];                       // 1. Faktor f�r konstanten Koeffizienten
      var f2 = coeffPower[n][0];                           // 2. Faktor f�r konstanten Koeffizienten
      coeffPower[i][0] = f1.mul(f2);                       // Konstanter Koeffizient 
      for (j=1; j<n; j++) {                                // F�r die Koeffizienten-Indizes 1 bis n-1 ...
        f1 = coeffPower[i-1][n-1];                         // 1. Faktor
        f2 = coeffPower[n][j];                             // 2. Faktor
        var r = f1.mul(f2).add(coeffPower[i-1][j-1]);      // Ergebnis der Berechnung
        coeffPower[i][j] = r;                              // Koeffizient (Seiteneffekt)
        } // Ende for (j)
      } // Ende for (i)
    } // Ende else
  gf = new Array(q);                                       // Neues Array f�r K�rperelemente
  inv = new Array(q);                                      // Neues Array f�r inverse Elemente
  for (i=0; i<q; i++) {                                    // F�r alle Indizes ...
    var e = gfIndex(i);                                    // K�rperelement
    gf[i] = e;                                             // Element speichern                                      
    inv[i] = e.inverse();                                  // Inverses Element speichern
    }
  }
  
// Konstruktor-Ersatz:
// i ... Index (nat�rliche Zahl oder 0)
// Diese Methode wird nur zu Testzwecken gebraucht.

function polynomialIndex (i) {
  var n = 0, power = p;                                    // Startwerte f�r Berechnung des Grads
  while (i >= power) {n++; power *= p;}                    // Berechnung des Grads
  var c = new Array(n+1);                                  // Neues Koeffizienten-Array
  for (var k=0; k<=n; k++) {                               // F�r alle Indizes bzw. Exponenten ...
    var r = i%p;                                           // Aktueller Koeffizient (Zahl)
    c[k] = new ZP(r);                                      // Aktueller Koeffizient (Typ ZP)
    i = Math.floor(i/p);                                   // Zwischenergebnis
    }
  return new Polynomial(c);                                // R�ckgabewert  	
  }
  
// Minimalpolynom der adjungierten Wurzel:
// p ... Charakteristik
// n ... Exponent in q = p^n, Grad des Minimalpolynoms

function minimalPolynomial (p, n) {
  if (n < 2) return undefined;                             // R�ckgabewert, falls Exponent n zu klein
  var e0 = new ZP(0);                                      // Element 0 von GF(p)
  var e1 = new ZP(1);                                      // Element 1 von GF(p)
  var e2 = new ZP(2);                                      // Element 2 von GF(p) f�r p > 2
  var c = new Array(n+1);                                  // Neues Array f�r Koeffizienten (aus GF(p))
  c[n] = e1;                                               // Leitkoeffizient 1
  if (n == 2) {                                            // Falls Exponent 2 ...
    if (p == 2) {                                          // Falls GF(4) mit Charakteristik 2 ...
      c[0] = c[1] = e1;                                    // Koeffizienten von x^2 + x + 1
      }                 
    else if (p%4 == 3) {                                   // Falls GF(p^2) mit Charakteristik p kongruent 3 modulo 4 ...
      c[0] = e1; c[1] = e0;                                // Koeffizienten von x^2 + 1 
      }                     
    else if (p == 5) {                                     // Falls GF(25) mit Charakteristik 5 ...
      c[0] = e2; c[1] = e0;                                // Koeffizienten von x^2 + 2
      }
    } // Ende n == 2
  else if (n == 3) {                                       // Falls Exponent 3 ...
    if (p == 2) {                                          // GF(8) mit Charakteristik 2 ...
      c[0] = c[1] = e1; c[2] = e0;                         // Koeffizienten von x^3 + x + 1
      }
    else if (p == 3) {                                     // Falls GF(27) mit Charakteristik 3 ...
      c[0] = c[1] = e2; c[2] = e0;                         // Koeffizienten von x^3 - x - 1
      }
    } // Ende n == 3
  else if (n == 4) {                                       // Falls Exponent 4 ...
    if (p == 2) {                                          // Falls GF(16) mit Charakteristik 2 ...
      c[0] = c[1] = e1; c[2] = c[3] = e0;                  // Koeffizienten von x^4 + x + 1
      }
    else if (p == 3) {                                     // Falls GF(81) mit Charakteristik 3 ...
      c[0] = e2; c[1] = c[2] = e0; c[3] = e1;              // Koeffizienten von x^4 + x^3 + 2
      }
    } // Ende n == 4
  else if (n == 5) {                                       // Falls Exponent 5 ...
    if (p == 2) {                                          // Falls GF(32) mit Charakteristik 2 ...
      c[0] = e1; c[1] = e0; c[2] = e1; c[3] = c[4] = e0;   // Koeffizienten von x^5 + x^2 + 1 
      }
    } // Ende n == 5
  else if (n == 6) {                                       // Falls Exponent 6 ...
    if (p == 2) {                                          // Falls GF(64) mit Charakteristik 2 ...
      c[0] = c[1] = e1; c[2] = c[3] = c[4] = c[5] = e0;    // Koeffizienten von x^6 + x + 1
      }
    } // Ende n == 6
  else c = undefined;                                      // Falls noch nicht erfasst, Array undefiniert
  return (c != undefined ? new Polynomial(c) : undefined); // R�ckgabewert // !!!
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
  
// Linie:
// (x1,y1) ... Anfangspunkt (Pixel)
// (x2,y2) ... Endpunkt (Pixel)
// c ......... Linienfarbe (optional, Defaultwert schwarz)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath(c,w);                                            // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Berechnung von x0, y0, x1, y1, x2, y2 (Seiteneffekt):
// two ... Flag f�r zweistellige Verkn�pfung
  
function calcXY (two) {
  var w1 = (two ? DX+LEFT2 : LEFT1);                       // Breite der Kopfspalte (Pixel)
  var h1 = 2*DY;                                           // H�he der Kopfzeile (Pixel)
  var w = w1+(q+1)*DX;                                     // Gesamtbreite (Pixel)
  var h = (two ? h1+(q+1)*DY : 2*h1);                      // Gesamth�he
  x0 = Math.max((width-w)/2,0);                            // Linker Rand (Pixel)
  y0 = Math.max((height-h)/2,0);                           // Oberer Rand (Pixel)
  if (n > 1 && y0 < h1) y0 = h1;                           // Eventuell Platz f�r Bemerkung (Wurzel)
  x1 = x0+w1; y1 = y0+h1;                                  // Koordinaten Trennlinien-Schnittpunkt (Pixel)
  x2 = x0+w; y2 = y0+h;                                    // Rechter bzw. unterer Rand (Pixel)
  }

// x-Koordinate (Tabelle):
// j ... Spaltenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfspalte)

function getX (j) {
  var x = x1+(j+1)*DX-offsetX;                             // x-Koordinate f�r Ergebnisbereich (Pixel)
  return (j>=0 ? x : x1-DX);                               // R�ckgabewert (Ergebnisbereich bzw. Kopfspalte)
  }

// y-Koordinate (Tabelle):
// i ... Zeilenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfzeile)

function getY (i) {
  var y = y1+(i+1)*DY-offsetY;                             // y-Koordinate f�r Ergebnisbereich (Pixel)
  return (i>=0 ? y : y1-DY);                               // R�ckgabewert (Ergebnisbereich bzw. Kopfzeile)
  }
  
// Kleinster Zeilenindex (zweistellige Verkn�pfung):

function iMin () {
  var i = Math.floor((offsetY-DY)/DY);                     // Zwischenergebnis (abgerundet)
  return Math.max(i,0);                                    // R�ckgabewert (nicht negativ)
  }
  
// Gr��ter Zeilenindex (zweistellige Verkn�pfung):

function iMax () {
  var i = Math.ceil((offsetY+height-y1-DY)/DY);            // Zwischenergebnis (aufgerundet)
  return Math.min(i,q-1);                                  // R�ckgabewert (kleiner als q)
  }
  
// Kleinster Spaltenindex (ein- oder zweistellige Verkn�pfung):

function jMin () {
  var j = Math.floor((offsetX-DX)/DX);                     // Zwischenergebnis (abgerundet)
  return Math.max(j,0);                                    // R�ckgabewert (nicht negativ)
  }
  
// Gr��ter Spaltenindex (ein- oder zweistellige Verkn�pfung):

function jMax () {
  var j = Math.ceil((offsetX+width-x1-DX)/DX);
  return Math.min(j,q-1);
  }
  
// �berpr�fung x-Koordinate:
  
function insideX (x) {return (x >= x1-DX/2);}

// �berpr�fung y-Koordinate:

function insideY (y) {return (y >= y1-DY/2);}
  
// Grafikausgabe eines K�rperelements (Tabelle):
// z ... K�rperelement (eventuell undefiniert)
// i ... Zeilenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfzeile)
// j ... Spaltenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfspalte)
  
function writeGF (z, i, j) {
  var x = getX(j), y = getY(i);                            // Koordinaten (Pixel)
  if (j >= 0 && !insideX(x)) return;                       // Falls zu weit links, abbrechen
  if (i >= 0 && !insideY(y)) return;                       // Falls zu weit oben, abbrechen
  if (j < 0) x = (x0+x1)/2;                                // x-Koordinate f�r Kopfspalte (Pixel)
  if (z != undefined) z.center(x,y);                       // Falls Element definiert, Grafikausgabe
  else centerText("-",x,y);                                // Sonst Strich
  }
  
// Breite einer Zeichenkette (Pixel):

function widthString (s) {
  return ctx.measureText(s).width;                         // R�ckgabewert
  }
  
// Linksb�ndige Grafikausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// R�ckgabewert: Neue x-Koordinate (Pixel)

function writeString (s, x, y) {
  ctx.fillText(s,x,y);                                     // Zeichenkette ausgeben
  return x+widthString(s);                                 // Neue x-Koordinate als R�ckgabewert
  }
  
// Zentrierte Grafikausgabe einer Zeichenkette:

function centerText (s, x, y) {
  var w = widthString(s);                                  // Breite (Pixel)
  ctx.fillText(s,x-w/2,y);                                 // Zeichenkette ausgeben
  return x+w/2;                                            // Neue x-Koordinate als R�ckgabewert
  }
  
// Rahmen um Ergebnis (Tabelle):
// i ..... Zeilenindex (0 bis q-1)
// j ..... Spaltenindex (0 bis q-1)
  
function box (i, j) {
  ctx.strokeStyle = color2;                                // Linienfarbe
  ctx.lineWidth = 3;                                       // Liniendicke
  var x = getX(j), y = getY(i);                            // Koordinaten (Pixel)
  if (j >= 0 && !insideX(x)) return;                       // Falls zu weit links, abbrechen
  if (i >= 0 && !insideY(y)) return;                       // Falls zu weit oben, abbrechen
  ctx.strokeRect(x-DX/2,y-20,DX,30);                       // Rahmen zeichnen
  }
  
// Hervorhebung in Verkn�pfungstafel (2 Operanden):
// Seiteneffekt x0, y0, x1, y1, x2, y2
  
function emphasize2 () {
  var w = (q+2)*DX+LEFT2, h = (q+3)*DY;                    // Abmessungen (Pixel)
  calcXY(true);                                            // Berechnung von x0, y0, x1, y1, x2, y2 (Seiteneffekt)
  ctx.fillStyle = color1;                                  // F�llfarbe
  var i = z1.index(), j = z2.index();                      // Zeilen- und Spaltenindex
  var x = getX(j), y = getY(i);                            // Koordinaten (Pixel)
  if (insideY(y)) ctx.fillRect(x0,y-20,w-offsetX,30);      // Falls sinnvoll, Zeile hervorheben
  if (insideX(x)) ctx.fillRect(x-DX/2,y0,DX,h-offsetY);    // Falls sinnvoll, Spalte hervorheben
  }
  
// Zelle oben links (Rechenzeichen) f�r eine zweistellige Verkn�pfung:

function topLeft2 () {
  var w = DX+LEFT2, h = 2*DY;                              // Abmessungen der Zelle (Pixel)
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(x0,y0,w,h);                                 // Hintergrund ausf�llen
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x0,y0,w,h);                               // Rand der Zelle
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  centerText(symbol(),(x0+x1)/2,y1-DY+2);                  // Rechenzeichen ausgeben  
  }
  
// Bereich oben rechts (2. Operand) f�r eine zweistellige Verkn�pfung:

function topRight2 () {
  var w = (q+1)*DX, h = 2*DY;                              // Abmessungen des Bereichs (Pixel)
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(x1,y0,w-offsetX,h);                         // Hintergrund ausf�llen
  ctx.fillStyle = color1;                                  // F�llfarbe f�r hervorgehobene Spalte
  var x = getX(z2.index());                                // x-Koordinate f�r hervorgehobene Spalte (Pixel)
  if (insideX(x)) ctx.fillRect(x-DX/2,y0,DX,2*DY);         // Falls sinnvoll, Spalte hervorheben
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x1,y0,w-offsetX,h);                       // Rand des Bereichs
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (var j=0; j<q; j++) writeGF(gf[j],-2,j);             // Kopfzeile
  }
  
// Bereich unten links (1. Operand) f�r eine zweistellige Verkn�pfung:

function bottomLeft2 () {
  var w = DX+LEFT2, h = (q+1)*DY;                          // Abmessungen des Bereichs (Pixel)
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(x0,y1,w,h-offsetY);                         // Hintergrund ausf�llen
  ctx.fillStyle = color1;                                  // F�llfarbe f�r hervorgehobene Zeile
  var y = getY(z1.index());                                // y-Koordinate f�r hervorgehobene Zeile (Pixel)
  if (insideY(y)) ctx.fillRect(x0,y-20,w,30);              // Falls sinnvoll, Zeile hervorheben
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x0,y1,w,h-offsetY);                       // Rand des Bereichs
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (var i=0; i<q; i++) writeGF(gf[i],i,-2);             // Kopfspalte    
  }
  
// Verkn�pfungstafel (2 Operanden):
// Breite der Kopfspalte DX+LEFT2, Breite Tabellenrumpf (q+1)*DX
// H�he der Kopfzeile 2*DY, H�he Tabellenrumpf (q+1)*DY 
  
function table2 () {
  var w = (q+2)*DX+LEFT2, h = (q+3)*DY;                    // Abmessungen (Pixel)
  emphasize2();                                            // Hervorhebung Zeile/Spalte
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x0,y0,w-offsetX,h-offsetY);               // Rahmen um Tabelle
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var i0 = iMin(), i1 = iMax();                            // Kleinster und gr��ter Zeilenindex
  var j0 = jMin(), j1 = jMax();                            // Kleinster und gr��ter Spaltenindex
  var index1 = z1.index(), index2 = z2.index();            // Indizes der aktuellen Operanden
  for (i=i0; i<=i1; i++) {                                 // F�r alle Zeilenindizes ...
    for (j=j0; j<=j1; j++) {                               // F�r alle Spaltenindizes ...
      var x = getX(j), y = getY(i);                        // Koordinaten (Pixel)
      if (!insideX(x)) continue;                           // Falls zu weit links, weiter zum n�chsten Index
      if (!insideY(y)) continue;                           // Falls zu weit oben, weiter zum n�chsten Index
      var z = result2(i,j);                                // Ergebnis (eventuell undefiniert)
      writeGF(z,i,j);                                      // Grafikausgabe Ergebnis (zentriert)
      if (i == index1 && j == index2) box(i,j);            // Gegebenenfalls Rahmen um Ergebnis
      } // Ende for (j)
    } // Ende for (i)
  bottomLeft2();                                           // Bereich links unten (1. Operand)
  topRight2();                                             // Bereich rechts oben (2. Operand) 
  topLeft2();                                              // Zelle links oben (Rechenzeichen)    
  }
  
// Hervorhebung in Tabelle f�r inverse Elemente (1 Operand):
// Seiteneffekt x0, y0, x1, y1, x2, y2
  
function emphasize1 () {
  var w = (q+1)*DX+LEFT1, h = 4*DY;                        // Abmessungen (Pixel)
  calcXY(false);                                           // Berechnung von x0, y0, x1, y1, x2, y2 (Seiteneffekt)
  ctx.fillStyle = color1;                                  // F�llfarbe f�r hervorgehobene Spalte
  var x = getX(z1.index());                                // x-Koordinate der aktuellen Spalte (Pixel)
  if (insideX(x)) ctx.fillRect(x-DX/2,y0,DX,h);            // Falls sinnvoll, Spalte hervorheben
  }
  
// Kopfspalte f�r eine einstellige Verkn�pfung (links):

function left1 () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(x0,y0,LEFT1,4*DY);                          // Hintergrund ausf�llen
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x0,y0,LEFT1,2*DY);                        // Rand der oberen Zelle
  ctx.strokeRect(x0,y1,LEFT1,2*DY);                        // Rand der unteren Zelle
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(symbolArg,(x0+x1)/2,y1-DY+2);               // Symbol f�r das Argument
  var x = (x0+x1)/2;                                       // x-Koordinate (Pixel)
  if (nr == 5) ctx.fillText(symbolNeg,x-8,y1+DY+2);        // Entweder Symbol f�r Inverses bez�glich Addition ...
  else if (nr == 6) {                                      // ... oder (f�r Inverses bez�glich Multiplikation) ...
    ctx.fillText(symbolArg,x,y1+DY+2);                     // Symbol x
    ctx.fillText("\u22121",x+8,y1+DY-5);                   // Exponent -1
    }
  }
  
// Tabelle f�r inverse Elemente (1 Operand):
// Breite der Kopfspalte LEFT1, Breite Tabellenrumpf (q+1)*DX
// H�he der Kopfzeile 2*DY, H�he Tabellenrumpf 2*DY
  
function table1 () {
  var w = (q+1)*DX+LEFT1, h = 4*DY;                        // Abmessungen (Pixel)
  emphasize1();                                            // Hervorhebung Spalte
  newPath();                                               // Standardwerte f�r Linienfarbe und -dicke
  ctx.strokeRect(x0,y0,w-offsetX,h);                       // Rahmen um die Tabelle
  line(x0,y1,x2-offsetX,y1);                               // Waagrechte Trennlinie
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var j0 = jMin(), j1 = jMax();                            // Kleinster und gr��ter Spaltenindex
  var index = z1.index();                                  // Index des Arguments
  for (var j=j0; j<=j1; j++) {                             // F�r alle Spaltenindizes ...
    var z = gf[j];                                         // Gegebenes Element
    writeGF(z,-2,j);                                       // Grafikausgabe gegebenes Element
    var x = result1(j);                                    // Ergebnis (eventuell undefiniert)
    writeGF(x,0,j);                                        // Grafikausgabe Ergebnis
    if (j == index) box(0,j);                              // Gegebenenfalls Rahmen um Ergebnis
    }
  left1();                                                 // Kopfspalte (links)
  }
  
// Bemerkung zur verwendeten Wurzel des Minimalpolynoms:
// Wichtig: Die Zeichenkette text09 muss (in dieser Reihenfolge) "#1" und "#2" enthalten.
// "#1" symbolisiert die Wurzel, "#2" das Minimalpolynom. 

function commentRoot () {
  if (minPoly == undefined) return;                        // Falls Minimalpolynom undefiniert, abbrechen
  var s = text09.replace("#1",root);                       // Anfang des Satzes (mit Wurzelsymbol)
  var i = s.indexOf("#2");                                 // Position von "#2"
  var s1 = s.substring(0,i), s2 = s.substring(i+2);        // Bestandteile vor und nach "#2"
  var x = writeString(s1,20,DY+2);                         // Anfang des Satzes ausgeben, neue x-Koordinate
  x = minPoly.write(x,DY+2);                               // Minimalpolynom ausgeben, neue x-Koordinate
  writeString(s2,x,DY+2);                                  // Ende des Satzes ausgeben
  }
  
// Maximale Breite (Pixel) eines Elements von GF(p^n):
  
function maxWidth () {
  var max = 0;                                             // Startwert                                
  for (var i=0; i<q; i++) {                                // F�r alle Indizes ...
    var w = gf[i].width();                                 // Breite des Elements (Pixel)
    if (w > max) max = w;                                  // Anpassung, falls bisheriges Maximum �berschritten
    }
  return max;                                              // R�ckgabewert
  }

// Grafikausgabe:
// Seiteneffekt DX
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.font = FONT;                                         // Zeichensatz (Sansserif)
  DX = maxWidth()+20;                                      // Anpassung Spaltenabstand (Pixel)
  if (n > 1) commentRoot();                                // Bemerkung zur Wurzel
  if (nr < 5) table2();                                    // Entweder Verkn�pfungstafel (2 Operanden) ...
  else table1();                                           // ... oder Tabelle von Inversen (1 Operand)  
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

