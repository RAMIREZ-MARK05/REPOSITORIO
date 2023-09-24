// Rechnen mit Restklassen
// 15.07.2022 - 21.07.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel calculatorzn_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var color1 = "#ffff00";                                    // Farbe f�r Zeile oder Spalte
var color2 = "#ff0000";                                    // Farbe f�r Rahmen um Ergebnis

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";          // Zeichensatz
var DX = 30;                                              // Spaltenabstand (Pixel)
var DY = 30;                                              // Zeilenabstand (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ch1, ch8, ch9;                                         // Auswahlfelder
var rb2, rb3, rb4, rb5, rb6, rb7;                          // Radiobuttons
var op10;                                                  // Ausgabefeld
var nr;                                                    // Nummer der Rechenoperation (1 bis 6)
var n;                                                     // Restklassen modulo n
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

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }
  
// L�schung der Optionen eines Auswahlfelds:

function clearSelect (ch) {
  while (ch.length > 0) ch.remove(0);                      // Solange Optionen vorhanden, erste Option l�schen
  }
  
// Anpassung eines Auswahlfelds (1. oder 2. Operand):
  
function updateSelect (ch, min, max) {
  clearSelect(ch);                                         // Bisherige Optionen l�schen
  for (var i=min; i<=max; i++) {                           // F�r alle Zahlen von min bis max ...
    var o = document.createElement("option");              // Neue Option
    o.text = String(i);                                    // Zugeh�riger Text
    ch.add(o);                                             // Option hinzuf�gen
    }
  if (ch == ch8) ch.selectedIndex = (z1<n ? z1 : 0);       // 1. Operand
  if (ch == ch9) ch.selectedIndex = (z2<n ? z2 : 0);       // 2. Operand
  }
  
// Neues Auswahlfeld mit erl�uterndem Text:
  
function newSelect (idS, idL, text, min, max) {
  getElement(idL,text);                                    // Erl�uternder Text                              
  var ch = getElement(idS);                                // Auswahlfeld
  updateSelect(ch,min,max);                                // Auswahlfeld anpassen
  return ch;                                               // R�ckgabewert
  }
  
// Neuer Radiobutton mit erl�uterndem Text:
  
function newRadio (idR, idL, text) {
  getElement(idL,text);                                    // Erl�uternder Text
  return getElement(idR);                                  // R�ckgabewert
  }
  
// Neues Ausgabefeld mit erl�uterndem Text:
  
function newOutput (idO, idL, text) {
  getElement(idL,text);                                    // Erl�uternder Text
  var op = getElement(idO);                                // Ausgabefeld
  op.readOnly = true;                                      // Nur Lesen erlaubt
  return op;                                               // R�ckgabewert
  }

// Start:

function start () {
  nr = 1;                                                  // Zun�chst Addition
  n = 5;                                                   // Zun�chst Restklassen modulo 5
  calcInv();                                               // Berechnung und Speicherung der inversen Elemente (Multiplikation)
  z1 = 0; z2 = 0;                                          // Startwerte der Operanden
  offsetX = offsetY = 0;                                   // Verschiebungsvektor
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ch1 = newSelect("ch1","lb1",text01,1,100);               // Auswahlfeld (Zahl n)
  ch1.selectedIndex = n-1;                                 // Index Option
  rb2 = newRadio("rb2","lb2",text02);                      // Radiobutton (Addition)
  rb3 = newRadio("rb3","lb3",text03);                      // Radiobutton (Subtraktion)
  rb4 = newRadio("rb4","lb4",text04);                      // Radiobutton (Multiplikation)
  rb5 = newRadio("rb5","lb5",text05);                      // Radiobutton (Division)
  rb6 = newRadio("rb6","lb6",text06);                      // Radiobutton (Inverses bez�glich Addition)
  rb7 = newRadio("rb7","lb7",text07);                      // Radiobutton (Inverses bez�glich Multiplikation)
  rb2.checked = true;                                      // Zun�chst Addition ausgew�hlt
  ch8 = newSelect("ch8","lb8",text11,0,n-1);               // Auswahlfeld (1. Operand)
  ch9 = newSelect("ch9","lb9",text12,0,n-1);               // Auswahlfeld (2. Operand)
  op10 = newOutput("op10","lb10",text13);                  // Ausgabefeld (Ergebnis)
  getElement("author",author);                             // Autor (und �bersetzer)
  drag = false;                                            // Zun�chst kein Zugmodus                                                
  reaction();                                              // Berechnung, Ausgabe
  
  ch1.onchange = reactionMod;                              // Reaktion auf oberes Auswahlfeld 
  rb2.onclick = reaction;                                  // Reaktion auf Radiobutton (Addition)
  rb3.onclick = reaction;                                  // Reaktion auf Radiobutton (Subtraktion)
  rb4.onclick = reaction;                                  // Reaktion auf Radiobutton (Multiplikation)
  rb5.onclick = reaction;                                  // Reaktion auf Radiobutton (Division)
  rb6.onclick = reaction;                                  // Reaktion auf Radiobutton (Inverses Element bez�glich Addition)
  rb7.onclick = reaction;                                  // Reaktion auf Radiobutton (Inverses Element bez�glich Multiplikation)
  ch8.onchange = reaction;                                 // Reaktion auf Auswahlfeld (1. Operand)
  ch9.onchange = reaction;                                 // Reaktion auf Auswahlfeld (2. Operand)
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers  
  canvas.onmouseout = reactionExit;                        // Reaktion auf Verlassen der Zeichenfl�che  
  
  } // Ende der Methode start
  
// Anpassung der erl�uternden Texte f�r Operanden und Ergebnis:
  
function modifyText (t1, t2, t3) {
  getElement("lb8").innerHTML = t1;                        // Text f�r 1. Eingabe
  getElement("lb9").innerHTML = t2;                        // Text f�r 2. Eingabe (eventuell leer)
  getElement("lb10").innerHTML = t3;                       // Text f�r Ergebnis
  if (nr > 4) {                                            // Falls nur ein Operand ...
    clearSelect(ch9);                                      // Leeres Auswahlfeld f�r 2. Operanden
    ch9.disabled = true;                                   // Auswahlfeld deaktivieren
    }
  else ch9.disabled = false;                               // Falls 2 Operanden, Auswahlfeld aktivieren
  }
  
// Erneuerung des Auswahlfelds f�r den 2. Operanden:
  
function renewCh9 () {
  updateSelect(ch9,0,n-1);                                 // Auswahlfeld f�r den 2. Operanden wiederherstellen
  ch9.selectedIndex = z2;                                  // Index Auswahlfeld
  }
  
// Reaktion auf Radiobuttons und Auswahlfelder:
// Seiteneffekt offsetX, offsetY, nr, z1, z2, z
  
function reaction () {
  offsetX = offsetY = 0;                                   // Verschiebungsvektor
  var nr0 = nr;                                            // Nummer der bisherigen Rechenoperation
  if (rb2.checked) nr = 1;                                 // Neue Nummer f�r Addition
  else if (rb3.checked) nr = 2;                            // Neue Nummer f�r Subtraktion
  else if (rb4.checked) nr = 3;                            // Neue Nummer f�r Multiplikation
  else if (rb5.checked) nr = 4;                            // Neue Nummer f�r Division
  else if (rb6.checked) nr = 5;                            // Neue Nummer f�r Inverses bez�glich Addition
  else if (rb7.checked) nr = 6;                            // Neue Nummer f�r Inverses bez�glich Multiplikation
  z1 = ch8.selectedIndex;                                  // 1. Operand (Auswahlfeld)
  if (nr0 < 5) z2 = ch9.selectedIndex;                     // 2. Operand (Auswahlfeld), falls vorhanden
  else renewCh9();                                         // Sonst Auswahlfeld erneuern
  if (nr == 1) modifyText(text11,text12,text13);           // Erl�uternde Texte f�r Addition ...
  else if (nr == 2) modifyText(text21,text22,text23);      // ... oder Subtraktion ...
  else if (nr == 3) modifyText(text31,text32,text33);      // ... oder Multiplikation ...
  else if (nr == 4) modifyText(text41,text42,text43);      // ... oder Division ...
  else if (nr == 5) modifyText(text51,"",text52);          // ... oder f�r Inverses (Addition) ...
  else if (nr == 6) modifyText(text61,"",text62);          // ... oder f�r Inverses (Multiplikation)
  z = (nr<5 ? result2(z1,z2,nr) : result1(z1,nr));         // Ergebnis (eventuell undefiniert)
  op10.value = (z!==undefined ? " "+z : undef);            // Ausgabefeld anpassen
  paint();                                                 // Neu zeichnen (Tabelle)
  }
  
// Reaktion auf oberes Auswahlfeld:
// Seiteneffekt n, inv, offsetX, offsetY, nr, z1, z2, z
  
function reactionMod () {
  n = ch1.selectedIndex+1;                                 // Restklassen modulo n
  calcInv();                                               // Inverse Elemente bez�glich Multiplikation
  updateSelect(ch8,0,n-1);                                 // Auswahlfeld f�r den 1. Operanden anpassen
  updateSelect(ch9,0,n-1);                                 // Auswahlfeld f�r den 2. Operanden anpassen
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
// Seiteneffekt offsetX, offsetY, xM, yM

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  offsetX -= (x-xM);                                       // Waagrechte Verschiebung        
  if (offsetX < 0) offsetX = 0;                            // Verschiebung nach rechts verhindern
  if (x1+(n+1)*DX <= width) offsetX = 0;                   // Falls kleine Verkn�pfungstafel, keine Verschiebung
  if (offsetX > (n+1)*DX) offsetX = (n+1)*DX;              // Zu weite Verschiebung nach links verhindern
  offsetY -= (y-yM);                                       // Senkrechte Verschiebung
  if (offsetY < 0) offsetY = 0;                            // Verschiebung nach unten verhindern
  if (nr > 4) offsetY = 0;                                 // Falls Tabelle von Inversen, keine Verschiebung in y-Richtung
  else if (y1+(n+1)*DY <= height) offsetY = 0;             // Falls kleine Verkn�pfungstafel, keine Verschiebung in y-Richtung
  if (offsetY > (n+1)*DY) offsetY = (n+1)*DY;              // Zu weite Verschiebung nach oben verhindern
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Verlassen der Zeichenfl�che:
  
function reactionExit (e) {
  drag = false;                                            // Zugmodus ausschalten
  }
  
//-------------------------------------------------------------------------------------------------

// Normalisierung: Erlaubt sind nur die Zahlen 0 bis n-1.
// Die Methoden f�r die Rechenoperationen setzen diese Normalisierung voraus und liefern normalisierte Ergebnisse.

function normalize (z) {
  var r = z%n;                                             // Divisionsrest (eventuell negativ)
  return (r>=0 ? r : r+n);                                 // R�ckgabewert
  }
  
// Summe:

function add (z1, z2) {
  return normalize((z1+z2)%n);                             // R�ckgabewert (normalisiert)
  }
  
// Differenz:
  
function sub (z1, z2) {
  return normalize((z1-z2)%n);                             // R�ckgabewert (normalisiert)
  }
  
// Produkt:
  
function mul (z1, z2) {
  return normalize((z1*z2)%n);                             // R�ckgabewert (normalisiert)
  }
  
// Inverses Element bez�glich Addition:
  
function inverseAdd (z) {
  return (z>0 ? n-z : 0);                                  // R�ckgabewert (normalisiert)
  }
  
// Inverses Element bez�glich Multiplikation (eventuell undefiniert):

function inverseMul (z) {
  if (z == 0) return undefined;                            // Falls Argument 0, R�ckgabewert undefiniert
  for (var i=1; i<n; i++)                                  // F�r alle Zahlen von 1 bis n-1 ...  
    if (mul(z,i) == 1) return i;                           // Falls Produkt gleich 1, R�ckgabewert
  return undefined;                                        // Falls Misserfolg, R�ckgabewert undefiniert
  }

// Berechnung und Speicherung der inversen Elemente bez�glich Multiplikation:
// Seiteneffekt inv
  
function calcInv () {
  inv = new Array(n);                                      // Neues Array der L�nge n
  for (var i=0; i<n; i++) inv[i] = inverseMul(i);          // Inverse berechnen und speichern
  }
  
// Quotient (eventuell undefiniert):
  
function div (z1, z2) {
  var i = inv[z2];                                         // Inverses Element des Divisors oder undefiniert
  return (i!=undefined ? mul(z1,i) : undefined);           // R�ckgabewert
  }
  
// Rechenzeichen einer zweistelligen Verkn�pfung:
  
function symbol (nr) {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 1: return symbolAdd;                              // Pluszeichen
    case 2: return symbolSub;                              // Minuszeichen
    case 3: return symbolMul;                              // Multiplikationszeichen
    case 4: return symbolDiv;                              // Divisionszeichen
    }
  }
  
// Ergebnis einer zweistelligen Verkn�pfung:
  
function result2 (z1, z2, nr) {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 1: return add(z1,z2);                             // Summe
    case 2: return sub(z1,z2);                             // Differenz
    case 3: return mul(z1,z2);                             // Produkt
    case 4: return div(z1,z2);                             // Quotient
    }
  }
  
// Ergebnis einer einstelligen Verkn�pfung:
  
function result1 (z, nr) {
  switch (nr) {                                            // Je nach Nummer der Verkn�pfung ...
    case 5: return inverseAdd(z);                          // Inverses (Addition)
    case 6: return inv[z];                                 // Inverses (Multiplikation)
    }
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
// two ... Flag f�r 2 Operanden
  
function calcXY (two) {
  var w = (n+3)*DX, h = (two ? (n+3)*DY : 4*DY);           // Abmessungen (Pixel)
  x0 = Math.max((width-w)/2,0);                            // Linker Rand (Pixel)
  y0 = Math.max((height-h)/2,0);                           // Oberer Rand (Pixel)
  x1 = x0+2*DX; y1 = y0+2*DY;                              // Koordinaten Trennlinien-Schnittpunkt (Pixel)
  x2 = x0+w; y2 = y0+h;                                    // Rechter bzw. unterer Rand (Pixel)
  }

// x-Koordinate (Tabelle):
// i ... Zeilenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfzeile)
// j ... Spaltenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfspalte)

function getX (i, j) {
  var x = x1+(j+1)*DX-offsetX;                             // x-Koordinate f�r Ergebnisbereich (Pixel)
  return (j>=0 ? x : x1-DX);                               // R�ckgabewert (Ergebnisbereich bzw. Kopfspalte)
  }

// y-Koordinate (Tabelle):
// i ... Zeilenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfzeile)
// j ... Spaltenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfspalte)

function getY (i, j) {
  var y = y1+(i+1)*DY-offsetY;                             // y-Koordinate f�r Ergebnisbereich (Pixel)
  return (i>=0 ? y : y1-DX);                               // R�ckgabewert (Ergebnisbereich bzw. Kopfzeile)
  }
  
// �berpr�fung x-Koordinate:
  
function insideX (x) {return (x >= x1+5);}

// �berpr�fung y-Koordinate

function insideY (y) {return (y >= y1+8);}
  
// Grafikausgabe einer Zahl (Tabelle):
// z ..... Zahl (eventuell undefiniert)
// i ..... Zeilenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfzeile)
// j ..... Spaltenindex (0 bis n-1 f�r Ergebnis oder -2 f�r Kopfspalte)
  
function write (z, i, j) {
  var x = getX(i,j), y = getY(i,j);                        // Koordinaten (Pixel)
  if (j >= 0 && !insideX(x)) return;                       // Falls zu weit links, abbrechen
  if (i >= 0 && !insideY(y)) return;                       // Falls zu weit oben, abbrechen
  ctx.fillText(z!=undefined ? String(z) : "-",x,y+2);      // Grafikausgabe (Zahl oder "-")
  }
  
// Rahmen um Ergebnis (Tabelle):
// i ..... Zeilenindex (0 bis n-1)
// j ..... Spaltenindex (0 bis n-1)
  
function box (i, j) {
  ctx.strokeStyle = color2;                                // Linienfarbe
  var x = getX(i,j), y = getY(i,j);                        // Koordinaten (Pixel)
  if (j >= 0 && !insideX(x)) return;                       // Falls zu weit links, abbrechen
  if (i >= 0 && !insideY(y)) return;                       // Falls zu weit oben, abbrechen
  ctx.strokeRect(x-18,y-16,36,26);                         // Rahmen zeichnen
  ctx.strokeStyle = "#000000";                             // Linienfarbe zur�cksetzen
  }
  
// Hervorhebung in Verkn�pfungstafel (2 Operanden):
// Seiteneffekt x0, y0, x1, y1, x2, y2
  
function emphasize2 () {
  var w = (n+3)*DX, h = (n+3)*DY;                          // Abmessungen (Pixel)
  calcXY(true);                                            // Berechnung von x0, y0, x1, y1, x2, y2 (Seiteneffekt)
  ctx.fillStyle = color1;                                  // F�llfarbe
  var x = getX(z1,z2), y = getY(z1,z2);                    // Koordinaten (Pixel)
  if (insideY(y)) ctx.fillRect(x0,y-18,w-offsetX,30);      // Falls sinnvoll, Zeile hervorheben
  if (insideX(x)) ctx.fillRect(x-20,y0,40,h-offsetY);      // Falls sinnvoll, Spalte hervorheben
  }
  
// Verkn�pfungstafel (2 Operanden):
  
function table2 () {
  var w = (n+3)*DX, h = (n+3)*DY;                          // Abmessungen (Pixel)
  var sy = symbol(nr);                                     // Rechenzeichen (links oben)
  emphasize2();                                            // Hervorhebung Zeile/Spalte
  ctx.strokeRect(x0,y0,w-offsetX,h-offsetY);               // Rahmen um Tabelle
  line(x0,y1,x2-offsetX,y1);                               // Waagrechte Trennlinie
  line(x1,y0,x1,y2-offsetY);                               // Senkrechte Trennlinie
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(sy,x1-DX,y1-DY+2);                          // Rechenzeichen (links oben)
  for (var i=0; i<n; i++) write(i,i,-2);                   // Kopfspalte    
  for (var j=0; j<n; j++) write(j,-2,j);                   // Kopfzeile 
  for (i=0; i<n; i++)                                      // F�r alle Zeilenindizes ...
    for (j=0; j<n; j++) {                                  // F�r alle Spaltenindizes ...
      var x = getX(i,j), y = getY(i,j);                    // Koordinaten (Pixel)
      if (!insideX(x)) continue;                           // Falls zu weit links, weiter zum n�chsten Index
      if (!insideY(y)) continue;                           // Falls zu weit oben, weiter zum n�chsten Index
      var z = result2(i,j,nr);                             // Ergebnis (eventuell undefiniert)
      write(z,i,j);                                        // Grafikausgabe Ergebnis
      if (i == z1 && j == z2) box(i,j);                    // Gegebenenfalls Rahmen um Ergebnis
      }      
  }
  
// Hervorhebung in Tabelle f�r inverse Elemente (1 Operand):
// Seiteneffekt x0, y0, x1, y1, x2, y2
  
function emphasize1 () {
  var w = (n+3)*DX, h = 4*DY;                              // Abmessungen (Pixel)
  calcXY(false);                                           // Berechnung von x0, y0, x1, y1, x2, y2 (Seiteneffekt)
  ctx.fillStyle = color1;                                  // F�llfarbe
  var x = getX(0,z1);                                      // x-Koordinate der aktuellen Spalte (Pixel)
  if (insideX(x)) ctx.fillRect(x-20,y0,40,h);              // Falls sinnvoll, Spalte hervorheben
  }
  
// Tabelle f�r inverse Elemente (1 Operand):
  
function table1 () {
  var w = (n+3)*DX, h = 4*DY;                              // Abmessungen (Pixel)
  emphasize1();                                            // Hervorhebung Spalte
  ctx.strokeRect(x0,y0,w,h);                               // Rahmen um Tabelle
  line(x0,y1,x2,y1);                                       // Waagrechte Trennlinie
  line(x1,y0,x1,y2);                                       // Senkrechte Trennlinie
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText("x",x1-DX,y1-DY+2);                         // Symbol f�r gegebenes Element
  if (nr == 5) ctx.fillText(symbolNeg,x1-DX,y1+DY+2);      // Symbol f�r inverses Element bez�glich Addition
  else if (nr == 6) {                                      // Symbol f�r inverses Element bez�glich Multiplikation
    ctx.fillText("x",x1-DX,y1+DY+2);                       // Symbol x
    ctx.fillText("\u22121",x1-DX+10,y1+DY-5);              // Exponent -1
    }
  for (var j=0; j<n; j++) {                                // F�r alle Spaltenindizes ...
    write(j,-2,j);                                         // Grafikausgabe gegebenes Element
    var z = result1(j,nr);                                 // Ergebnis (eventuell undefiniert)
    write(z,0,j);                                          // Grafikausgabe Ergebnis
    if (j == z1) box(0,j);                                 // Gegebenenfalls Rahmen um Ergebnis
    }
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.font = FONT;                                         // Zeichensatz (Sansserif)
  if (nr < 5) table2();                                    // Entweder Verkn�pfungstafel (2 Operanden) ...
  else table1();                                           // ... oder Tabelle von Inversen (1 Operand)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

