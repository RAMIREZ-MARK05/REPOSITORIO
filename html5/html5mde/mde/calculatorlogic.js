// Online-Rechner Aussagenlogik
// 11.08.2021 - 19.08.2021

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel calculatorlogic_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var colorCursor = "#0000ff";                               // Farbe f�r Cursor

// Weitere Konstanten:

var X1 = 50;                                               // x-Koordinate f�r erkl�renden Text (Pixel)
var X2 = 250;                                              // x-Koordinate f�r Ausgaben (Pixel)
var DX = 50;                                               // Breite einer Tabellenspalte (Pixel)
var DY = 20;                                               // Abstand der Tabellenzeilen (Pixel)
var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz
var FONT2 = "normal normal bold 12px monospace";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var buClear, buReset;                                      // Schaltkn�pfe zum L�schen
var selNum;                                                // Auswahlfeld f�r Zahl der Variablen
var selVar;                                                // Auswahlfeld f�r Variable
var buNeg;                                                 // Schaltknopf f�r Negation
var buAnd, buOr;                                           // Schaltkn�pfe f�r Konjunktion und Disjunktion                                 
var buImp, buEqu;                                          // Schaltkn�pfe f�r Implikation und �quivalenz
var buOpen, buClose;                                       // Schaltkn�pfe f�r Klammern
var buFalse, buTrue;                                       // Schaltkn�pfe f�r Konstanten

var nMax;                                                  // Maximale Anzahl der Variablen
var nVar;                                                  // Aktuelle Anzahl der Variablen
var nLines;                                                // Anzahl der Zeilen (2 hoch nVar)
var input;                                                 // Eingegebene Zeichenkette
var te;                                                    // Aktueller Term
var teDNF;                                                 // Disjunktive Normalform
var teCNF;                                                 // Konjunktive Normalform
var offsetX, offsetY;                                      // Verschiebung (Pixel)
var drag;                                                  // Flag f�r Zugmodus
var xM, yM;                                                // Koordinaten des Mauszeigers (Pixel)

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }
  
// Neues Auswahlfeld:
// id ... ID im HTML-Befehl
// a .... Array der Texte

function newSelect (id, a) {
  var s = getElement(id);                                  // Auswahlfeld
  for (var i=0; i<a.length; i++) {                         // F�r alle Indizes ...
    var o = document.createElement("option");              // Neuer Eintrag
    o.innerHTML = a[i];                                    // Text �bernehmen
    s.add(o);                                              // Zum Auswahlfeld hinzuf�gen
    }
  return s;                                                // R�ckgabewert
  }  
  
// Anzahl der Variablen und Anzahl der Zeilen:
// n ... Anzahl der Variablen
// Seiteneffekt nVar, nLines
  
function setNumber (n) {
  nVar = n;                                                // Zahl der Variablen �bernehmen
  nLines = 1;                                              // Startwert f�r Zahl der Zeilen
  for (var i=0; i<n; i++) nLines *= 2;                     // Berechnung der Zweierpotenz
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  buClear = getElement("clear",text01);                    // Schaltknopf (L�schen eines Zeichens)
  buReset = getElement("reset",text02);                    // Schaltknopf (Reset)
  getElement("num",text03);                                // Erkl�render Text (Zahl der Variablen)
  nMax = variables.length;                                 // Maximale Anzahl der Variablen
  var a = [];                                              // Leeres Array
  for (var i=0; i<nMax; i++) a[i] = String(i+1);           // Array aufbauen
  selNum = newSelect("selNum",a);                          // Auswahlfeld (Zahl der Variablen)
  getElement("var",text04);                                // Erkl�render Text (Variable)
  selVar = newSelect("selVar",[]);                         // Auswahlfeld (Variable)
  input = "";                                              // Noch kein Term eingegeben
  setNumber(1);                                            // Startwerte f�r nVar und nLines
  reactionNum();                                           // Auswahlfeld aufbauen
  buNeg = getElement("buNeg",symbolNegation);              // Schaltknopf f�r Negation
  buAnd = getElement("buAnd",symbolConjunction);           // Schaltknopf f�r Konjunktion (Und-Vekn�pfung)
  buOr = getElement("buOr",symbolDisjunction);             // Schaltknopf f�r Disjunktion (Oder-Verkn�pfung)
  buImp = getElement("buImp",symbolImplication);           // Schaltknopf f�r Implikation
  buEqu = getElement("buEqu",symbolEquivalence);           // Schaltknopf f�r �quivalenz  
  buOpen = getElement("buOpen","(");                       // Schaltknopf f�r �ffnende Klammer
  buClose = getElement("buClose",")");                     // Schaltknopf f�r schlie�ende Klammer
  buFalse = getElement("buFalse",symbolFalse);             // Schaltknopf f�r "falsch"
  buTrue = getElement("buTrue",symbolTrue);                // Schaltknopf f�r "wahr"
  getElement("author",author);                             // Autor (und �bersetzer)
  reactionReset();                                         // Anfangszustand
  drag = false;                                            // Zun�chst kein Zugmodus
   
  buClear.onclick = reactionClear;                         // Reaktion auf Schaltknopf (L�schen eines Zeichens)
  buReset.onclick = reactionReset;                         // Reaktion auf Schaltknopf (Reset)
  selNum.onchange = reactionNum;                           // Reaktion auf Auswahlfeld (Zahl der Variablen)
  selVar.onchange = reactionVar;                           // Reaktion auf Auswahlfeld (Variable)
  buNeg.onclick = function () {append("N")};               // Reaktion auf Schaltknopf (Negation)
  buAnd.onclick = function () {append("U")};               // Reaktion auf Schaltknopf (Konjunktion)
  buOr.onclick = function () {append("O")};                // Reaktion auf Schaltknopf (Disjunktion)
  buImp.onclick = function () {append("I")};               // Reaktion auf Schaltknopf (Implikation)
  buEqu.onclick = function () {append("E")};               // Reaktion auf Schaltknopf (�quivalenz)
  buOpen.onclick = function () {append("(")};              // Reaktion auf Schaltknopf (Klammer auf)
  buClose.onclick = function () {append(")")};             // Reaktion auf Schaltknopf (Klammer zu)
  buFalse.onclick = function () {append("F")};             // Reaktion auf Schaltknopf (Konstante Falsch)
  buTrue.onclick = function () {append("W")};              // Reaktion auf Schaltknopf (Konstante Wahr)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
  
  } // Ende der Methode start
  
// Hilfsroutine: Konstruktion eines Terms, Grafikausgabe
// Seiteneffekt te, input, offsetX, offsetY
// Wirkung auf Auswahlfeld f�r Zahl der Variablen
  
function reaction () {
  try {te = constrTerm(input,0,0);}                        // Versuch Termkonstruktion
  catch(err) {                                             // Ausnahmebehandlung
    alert(err);                                            // Fehlermeldung
    reactionClear(false);                                  // Letztes Zeichen l�schen usw.
    }
  selNum.disabled = (input.length > 0);                    // Auswahlfeld deaktivieren bzw. aktivieren
  paint();                                                 // Grafikausgabe
  }
  
// Reaktion auf Schaltknopf (L�schen des letzten Zeichens):
// r ... Flag f�r Aufruf von reaction am Ende
// Seiteneffekt input, offsetX, offsetY, te

function reactionClear (r) {
  var n = input.length;                                    // L�nge der bisherigen Eingabe
  if (n == 0) return;                                      // Falls L�nge 0, abbrechen
  input = input.substring(0,n-1);                          // Letztes Zeichen weglassen
  offsetX = offsetY = 0;                                   // Keine Verschiebung
  if (r) reaction();                                       // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Resetknopf (Alles l�schen):
// Seiteneffekt input, offsetX, offsetY, te
  
function reactionReset () {
  input = "";                                              // Leere Eingabe
  offsetX = offsetY = 0;                                   // Keine Verschiebung
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hinzuf�gen einer Option zu einem Auswahlfeld:
// sel ... Auswahlfeld
// t ..... Text
  
function addOption (sel, t) {
  var o = document.createElement("option");                // Neue Option
  o.text = t;                                              // Text �bernehmen
  sel.add(o);                                              // Option zum Auswahlfeld hinzuf�gen
  }
  
// Reaktion auf 1. Auswahlfeld (Zahl der Variablen):
// Seiteneffekt nVar, nLines, te, input, offsetX, offsetY
// Wirkung auf 2. Auswahlfeld (Variable)

function reactionNum () {
  while (selVar.length > 0) selVar.remove(0);              // Auswahlfeld f�r Variable leeren
  setNumber(selNum.selectedIndex+1);                       // Seiteneffekt nVar, nLines                       
  addOption(selVar,"");                                    // Leere Option am Anfang
  for (var i=0; i<nVar; i++)                               // F�r alle Variablen-Indizes ...
    addOption(selVar,variables[i]);                        // Option hinzuf�gen
  selVar.selectedIndex = 0;                                // Leere Option (Index 0) ausw�hlen 
  reaction();
  }
  
// Hilfsroutine: Hinzuf�gung eines Zeichens zur Eingabe; Konstruktion des entsprechenden Terms; Grafikausgabe
// d ... Neues Zeichen
// Seiteneffekt input, te, offsetX, offsetY 
  
function append (d) {
  input += d;                                              // Neues Zeichen zur Eingabe hinzuf�gen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Auswahlfeld f�r Variable:
// Seiteneffekt input, te, offsetX, offsetY
  
function reactionVar () {
  append(selVar.value);                                    // Variable hinzuf�gen, Termkonstruktion, Grafikausgabe
  selVar.selectedIndex = 0;                                // Index zur�cksetzen
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl eines Objekts)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl eines Objekts)
  if (drag) e.preventDefault();                            // Falls kein Zugmodus, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus ausschalten
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  drag = false;                                           // Zugmodus ausschalten
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls kein Zugmodus
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
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
  offsetX -= (x-xM);                                       // Waagrechte Verschiebung (Pixel)
  var h1 = 75+nVar*DX+te.width+DX;                         // Hilfsgr��e f�r maximale Verschiebung (Tabelle)
  var h2 = X2+teDNF.width;                                 // Hilfsgr��e f�r maximale Verschiebung (DNF)
  var h3 = X2+teCNF.width;                                 // Hilfsgr��e f�r maximale Verschiebung (KNF)
  var maxX = Math.max(Math.max(h1,h2),h3)-width+40;        // Maximaler Wert der Verschiebung
  if (offsetX > maxX) offsetX = maxX;                      // Zu gro�en Wert verhindern
  if (offsetX < 0) offsetX = 0;                            // Negativen Wert verhindern
  offsetY -= (y-yM);                                       // Senkrechte Verschiebung (Pixel)
  var maxY = 300+nLines*DY-height+40;                      // Maximaler Wert der Verschiebung
  if (offsetY > maxY) offsetY = maxY;                      // Zu gro�en Wert verhindern
  if (offsetY < 0) offsetY = 0;                            // Negativen Wert verhindern
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Zeichenkette f�r Wahrheitswert:
// v ... Wahrheitswert (0, 1 oder undefined)
// R�ckgabewert: symbolFalse, symbolTrue oder "?"
  
function symbolFT (v) {
  switch (v) {                                             // Je nach Wahrheitswert ...                   
    case 0: return symbolFalse;                            // Symbol f�r "falsch"
    case 1: return symbolTrue;                             // Symbol f�r "wahr"
    default: return "?";                                   // Symbol f�r "unbekannt"
    }
  }
  
// Array f�r eine Zeile der Wahrheitstabelle (Werte 0 oder 1)
// i ... Zeilenindex (0 bis nLines-1)
  
function arrayLine (i) {
  var a = new Array(nVar);                                 // Neues Array
  var d = nLines/2;                                        // Startwert f�r Divisor
  for (var k=0; k<nVar; k++) {                             // F�r alle Variablen-Indizes ...
    a[k] = Math.floor(i/d);                                // Array-Element
    i -= a[k]*d;                                           // Divisionsrest
    d /= 2;                                                // Neuer Divisor
    }
  return a;                                                // R�ckgabewert
  }
  
// Zeichenkette f�r Minterm der disjunktiven Normalform:
// a ... Einfach indiziertes Array f�r eine Zeile der Wahrheitstabelle (Elemente 0 oder 1)
  
function dnfTerm (a) {
  var s = "";                                              // Leere Zeichenkette als Startwert
  for (var i=0; i<nVar; i++) {                             // F�r alle Variablen-Indizes ...
  if (s != "") s += "U";                                   // Falls nicht am Anfang, "und" hinzuf�gen
    if (a[i] == 0) s += "N";                               // Falls Variablenwert 0, "nicht" hinzuf�gen
    s += variables[i];                                     // Variablenname hinzuf�gen
    }
  if (s == "" || nVar == 1) return s;                      // R�ckgabewert, falls keine Klammer n�tig
  return "("+s+")";                                        // R�ckgabewert, falls Klammer n�tig
  }
  
// Zeichenkette f�r Minterm der konjunktiven Normalform:
// a ... Einfach indiziertes Array f�r eine Zeile der Wahrheitstabelle (Elemente 0 oder 1)
  
function cnfTerm (a) {
  var s = "";                                              // Leere Zeichenkette als Startwert
  for (var i=0; i<nVar; i++) {                             // F�r alle Variablen-Indizes ...
  if (s != "") s += "O";                                   // Falls nicht am Anfang, "oder" hinzuf�gen
    if (a[i] == 1) s += "N";                               // Falls Variablenwert 0, "nicht" hinzuf�gen
    s += variables[i];                                     // Variablenname hinzuf�gen
    }
  if (s == "" || nVar == 1) return s;                      // R�ckgabewert, falls keine Klammer n�tig
  return "("+s+")";                                        // R�ckgabewert, falls Klammer n�tig
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
  
// Cursor:
// (x,y) ... Position (Pixel)

function cursor (x, y) {
  line(x,y,x+widthPix(" "),y,colorCursor);                 // Cursor ausgeben
  }  
  
// Begrenzungs- und Trennlinien f�r Wahrheitstabelle:
// (x0,y0) ... Ecke links oben (Pixel)
// Die Verschiebung durch offsetX und offsetY wird ber�cksichtigt.
  
function lines (x0, y0) {
  x0 -= offsetX; y0 -= offsetY;
  var dy = nLines*DY+10;                                   // H�he (Pixel, ohne Titelzeile) 
  var x1 = x0+nVar*DX;                                     // x-Koordinate f�r senkrechte Trennlinie
  var x2 = x1+te.width+DX;                                 // x-Koordinate f�r rechten Rand (Pixel)
  line(x0,y0,x2,y0);                                       // Obere Begrenzungslinie 
  var y1 = y0+25;                                          // y-Koordinate f�r waagrechte Trennlinie
  line(x0,y1,x2,y1);                                       // Waagrechte Trennlinie
  var y2 = y1+dy;                                          // y-Koordinate f�r untere Begrenzungslinie
  line(x0,y2,x2,y2);                                       // Untere Begrenzungslinie
  line(x0,y0,x0,y2);                                       // Linke Begrenzungslinie
  line(x1,y0,x1,y2);                                       // Senkrechte Trennlinie
  line(x2,y0,x2,y2);                                       // Rechte Begrenzungslinie
  }
  
// Ausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (x,y) ... Position
// Die Verschiebung durch offsetX und offsetY wird ber�cksichtigt.

function writeText (s, x, y) {
  ctx.fillText(s,x-offsetX,y-offsetY);                     // Zeichenkette ausgeben
  }
  
// Ausgabe der Wahrheitstabelle:
// (x0,y0) ... Ecke links oben (Pixel)
// Die Verschiebung durch offsetX und offsetY wird ber�cksichtigt.
// Seiteneffekt: teDNF, teCNF
  
function writeTable (x0, y0) {
  var dnf = "", cnf = "";                                  // Leere Zeichenketten f�r Normalformen
  var a = new Array(nLines);                               // Zweifach indiziertes Array f�r Wahrheitswerte
  for (var i=0; i<nLines; i++) a[i] = arrayLine(i);        // Zweifach indiziertes Array aufbauen
  ctx.textAlign = "center";                                // Textausrichtung
  for (var k=0; k<nVar; k++) {                             // F�r alle Variablen-Indizes ...
    var x = x0+(k+0.5)*DX;                                 // x-Koordinate f�r Variablenwert (Pixel)
    writeText(variables[k],x,y0+15);                       // Variable als Spaltentitel  
    for (i=0; i<nLines; i++) {                             // F�r alle Zeilen-Indizes ...
      var s = symbolFT(a[i][k]);                           // Symbol f�r Wahrheitswert der Variablen
      writeText(s,x,y0+45+i*DY);                           // Wahrheitswert ausgeben
      }
    } // Ende for (k)
  x = x0+(nVar+0.5)*DX+te.width/2;                         // x-Koordinate f�r Ergebnis (Pixel)
  for (i=0; i<nLines; i++) {                               // F�r alle Zeilen-Indizes ...
    s = symbolFT(te.getValue(a[i]));                       // Symbol f�r Wahrheitswert des gesamten Terms
    writeText(s,x,y0+45+i*DY);                             // Wahrheitswert ausgeben
    if (s == symbolTrue) {                                 // Falls Zeilenergebnis "wahr" ...
      if (dnf != "") dnf += "O";                           // Falls nicht am Anfang, "oder" zu dnf hinzuf�gen
      dnf += dnfTerm(a[i]);                                // Minterm zu dnf hinzuf�gen
      }
    if (s == symbolFalse) {                                // Falls Zeilenergebnis "falsch" ...
      if (cnf != "") cnf += "U";                           // Falls nicht am Anfang, "und" zu cnf hinzuf�gen
      cnf += cnfTerm(a[i]);                                // Minterm zu cnf hinzuf�gen
      }
    }
  if (dnf == "" && s != "?") dnf = "F";                    // Sonderfall: Disjunktive Normalform leer
  if (cnf == "" && s != "?") cnf = "W";                    // Sonderfall: Konjunktive Normalform leer
  teDNF = constrTerm(dnf,0,0);                             // Disjunktive Normalform (Seiteneffekt!)
  teCNF = constrTerm(cnf,0,0);                             // Konjunktive Normalform (Seiteneffekt!)
  ctx.textAlign = "left";                                  // Textausrichtung
  x = x0+(nVar+0.5)*DX-offsetX;                            // x-Koordinate f�r Term
  te.write(x,y0+15-offsetY,false);                         // Term als Spaltentitel ausgeben
  lines(x0,y0);                                            // Begrenzungs- und Trennlinien
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.font = FONT1;                                        // Zeichensatz 1 (Sansserif)
  ctx.fillStyle = "#0000ff";                               // Schriftfarbe
  writeText(text05,X1,50);                                 // Erkl�render Text (Term)
  writeText(text06,X1,100);                                // Erkl�render Text (Bemerkung)
  writeText(text07,X1,150);                                // Erkl�render Text (Wahrheitstabelle)
  writeText(text08,X1,260+nLines*DY);                      // Erkl�render Text (Disjunktive Normalform)
  writeText(text09,X1,300+nLines*DY);                      // Erkl�render Text (Konjunktive Normalform)
  ctx.font = FONT2;                                        // Zeichensatz 2 (Monospace)
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  te.write(X2-offsetX,50-offsetY);                         // Term ausgeben
  writeText(""+te.comment(),X2,100);                       // Bemerkung ausgeben
  var n = selNum.selectedIndex+1;                          // Zahl der Variablen
  writeTable(75,180);                                      // Wahrheitstabelle (Seiteneffekt teDNF, teCNF)  
  teDNF.write(X2-offsetX,260+nLines*DY-offsetY,false);     // Disjunktive Normalform
  teCNF.write(X2-offsetX,300+nLines*DY-offsetY,false);     // Konjunktive Normalform
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

