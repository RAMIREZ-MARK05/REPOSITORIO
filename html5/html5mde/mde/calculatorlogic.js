// Online-Rechner Aussagenlogik
// 11.08.2021 - 19.08.2021

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel calculatorlogic_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var colorCursor = "#0000ff";                               // Farbe für Cursor

// Weitere Konstanten:

var X1 = 50;                                               // x-Koordinate für erklärenden Text (Pixel)
var X2 = 250;                                              // x-Koordinate für Ausgaben (Pixel)
var DX = 50;                                               // Breite einer Tabellenspalte (Pixel)
var DY = 20;                                               // Abstand der Tabellenzeilen (Pixel)
var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz
var FONT2 = "normal normal bold 12px monospace";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var buClear, buReset;                                      // Schaltknöpfe zum Löschen
var selNum;                                                // Auswahlfeld für Zahl der Variablen
var selVar;                                                // Auswahlfeld für Variable
var buNeg;                                                 // Schaltknopf für Negation
var buAnd, buOr;                                           // Schaltknöpfe für Konjunktion und Disjunktion                                 
var buImp, buEqu;                                          // Schaltknöpfe für Implikation und Äquivalenz
var buOpen, buClose;                                       // Schaltknöpfe für Klammern
var buFalse, buTrue;                                       // Schaltknöpfe für Konstanten

var nMax;                                                  // Maximale Anzahl der Variablen
var nVar;                                                  // Aktuelle Anzahl der Variablen
var nLines;                                                // Anzahl der Zeilen (2 hoch nVar)
var input;                                                 // Eingegebene Zeichenkette
var te;                                                    // Aktueller Term
var teDNF;                                                 // Disjunktive Normalform
var teCNF;                                                 // Konjunktive Normalform
var offsetX, offsetY;                                      // Verschiebung (Pixel)
var drag;                                                  // Flag für Zugmodus
var xM, yM;                                                // Koordinaten des Mauszeigers (Pixel)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }
  
// Neues Auswahlfeld:
// id ... ID im HTML-Befehl
// a .... Array der Texte

function newSelect (id, a) {
  var s = getElement(id);                                  // Auswahlfeld
  for (var i=0; i<a.length; i++) {                         // Für alle Indizes ...
    var o = document.createElement("option");              // Neuer Eintrag
    o.innerHTML = a[i];                                    // Text übernehmen
    s.add(o);                                              // Zum Auswahlfeld hinzufügen
    }
  return s;                                                // Rückgabewert
  }  
  
// Anzahl der Variablen und Anzahl der Zeilen:
// n ... Anzahl der Variablen
// Seiteneffekt nVar, nLines
  
function setNumber (n) {
  nVar = n;                                                // Zahl der Variablen übernehmen
  nLines = 1;                                              // Startwert für Zahl der Zeilen
  for (var i=0; i<n; i++) nLines *= 2;                     // Berechnung der Zweierpotenz
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  buClear = getElement("clear",text01);                    // Schaltknopf (Löschen eines Zeichens)
  buReset = getElement("reset",text02);                    // Schaltknopf (Reset)
  getElement("num",text03);                                // Erklärender Text (Zahl der Variablen)
  nMax = variables.length;                                 // Maximale Anzahl der Variablen
  var a = [];                                              // Leeres Array
  for (var i=0; i<nMax; i++) a[i] = String(i+1);           // Array aufbauen
  selNum = newSelect("selNum",a);                          // Auswahlfeld (Zahl der Variablen)
  getElement("var",text04);                                // Erklärender Text (Variable)
  selVar = newSelect("selVar",[]);                         // Auswahlfeld (Variable)
  input = "";                                              // Noch kein Term eingegeben
  setNumber(1);                                            // Startwerte für nVar und nLines
  reactionNum();                                           // Auswahlfeld aufbauen
  buNeg = getElement("buNeg",symbolNegation);              // Schaltknopf für Negation
  buAnd = getElement("buAnd",symbolConjunction);           // Schaltknopf für Konjunktion (Und-Veknüpfung)
  buOr = getElement("buOr",symbolDisjunction);             // Schaltknopf für Disjunktion (Oder-Verknüpfung)
  buImp = getElement("buImp",symbolImplication);           // Schaltknopf für Implikation
  buEqu = getElement("buEqu",symbolEquivalence);           // Schaltknopf für Äquivalenz  
  buOpen = getElement("buOpen","(");                       // Schaltknopf für öffnende Klammer
  buClose = getElement("buClose",")");                     // Schaltknopf für schließende Klammer
  buFalse = getElement("buFalse",symbolFalse);             // Schaltknopf für "falsch"
  buTrue = getElement("buTrue",symbolTrue);                // Schaltknopf für "wahr"
  getElement("author",author);                             // Autor (und Übersetzer)
  reactionReset();                                         // Anfangszustand
  drag = false;                                            // Zunächst kein Zugmodus
   
  buClear.onclick = reactionClear;                         // Reaktion auf Schaltknopf (Löschen eines Zeichens)
  buReset.onclick = reactionReset;                         // Reaktion auf Schaltknopf (Reset)
  selNum.onchange = reactionNum;                           // Reaktion auf Auswahlfeld (Zahl der Variablen)
  selVar.onchange = reactionVar;                           // Reaktion auf Auswahlfeld (Variable)
  buNeg.onclick = function () {append("N")};               // Reaktion auf Schaltknopf (Negation)
  buAnd.onclick = function () {append("U")};               // Reaktion auf Schaltknopf (Konjunktion)
  buOr.onclick = function () {append("O")};                // Reaktion auf Schaltknopf (Disjunktion)
  buImp.onclick = function () {append("I")};               // Reaktion auf Schaltknopf (Implikation)
  buEqu.onclick = function () {append("E")};               // Reaktion auf Schaltknopf (Äquivalenz)
  buOpen.onclick = function () {append("(")};              // Reaktion auf Schaltknopf (Klammer auf)
  buClose.onclick = function () {append(")")};             // Reaktion auf Schaltknopf (Klammer zu)
  buFalse.onclick = function () {append("F")};             // Reaktion auf Schaltknopf (Konstante Falsch)
  buTrue.onclick = function () {append("W")};              // Reaktion auf Schaltknopf (Konstante Wahr)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
  
  } // Ende der Methode start
  
// Hilfsroutine: Konstruktion eines Terms, Grafikausgabe
// Seiteneffekt te, input, offsetX, offsetY
// Wirkung auf Auswahlfeld für Zahl der Variablen
  
function reaction () {
  try {te = constrTerm(input,0,0);}                        // Versuch Termkonstruktion
  catch(err) {                                             // Ausnahmebehandlung
    alert(err);                                            // Fehlermeldung
    reactionClear(false);                                  // Letztes Zeichen löschen usw.
    }
  selNum.disabled = (input.length > 0);                    // Auswahlfeld deaktivieren bzw. aktivieren
  paint();                                                 // Grafikausgabe
  }
  
// Reaktion auf Schaltknopf (Löschen des letzten Zeichens):
// r ... Flag für Aufruf von reaction am Ende
// Seiteneffekt input, offsetX, offsetY, te

function reactionClear (r) {
  var n = input.length;                                    // Länge der bisherigen Eingabe
  if (n == 0) return;                                      // Falls Länge 0, abbrechen
  input = input.substring(0,n-1);                          // Letztes Zeichen weglassen
  offsetX = offsetY = 0;                                   // Keine Verschiebung
  if (r) reaction();                                       // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Resetknopf (Alles löschen):
// Seiteneffekt input, offsetX, offsetY, te
  
function reactionReset () {
  input = "";                                              // Leere Eingabe
  offsetX = offsetY = 0;                                   // Keine Verschiebung
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hinzufügen einer Option zu einem Auswahlfeld:
// sel ... Auswahlfeld
// t ..... Text
  
function addOption (sel, t) {
  var o = document.createElement("option");                // Neue Option
  o.text = t;                                              // Text übernehmen
  sel.add(o);                                              // Option zum Auswahlfeld hinzufügen
  }
  
// Reaktion auf 1. Auswahlfeld (Zahl der Variablen):
// Seiteneffekt nVar, nLines, te, input, offsetX, offsetY
// Wirkung auf 2. Auswahlfeld (Variable)

function reactionNum () {
  while (selVar.length > 0) selVar.remove(0);              // Auswahlfeld für Variable leeren
  setNumber(selNum.selectedIndex+1);                       // Seiteneffekt nVar, nLines                       
  addOption(selVar,"");                                    // Leere Option am Anfang
  for (var i=0; i<nVar; i++)                               // Für alle Variablen-Indizes ...
    addOption(selVar,variables[i]);                        // Option hinzufügen
  selVar.selectedIndex = 0;                                // Leere Option (Index 0) auswählen 
  reaction();
  }
  
// Hilfsroutine: Hinzufügung eines Zeichens zur Eingabe; Konstruktion des entsprechenden Terms; Grafikausgabe
// d ... Neues Zeichen
// Seiteneffekt input, te, offsetX, offsetY 
  
function append (d) {
  input += d;                                              // Neues Zeichen zur Eingabe hinzufügen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Auswahlfeld für Variable:
// Seiteneffekt input, te, offsetX, offsetY
  
function reactionVar () {
  append(selVar.value);                                    // Variable hinzufügen, Termkonstruktion, Grafikausgabe
  selVar.selectedIndex = 0;                                // Index zurücksetzen
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl eines Objekts)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl eines Objekts)
  if (drag) e.preventDefault();                            // Falls kein Zugmodus, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus ausschalten
  }
  
// Reaktion auf Ende der Berührung:
  
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

// Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl eines Objekts):
// (x,y) ... Position bezüglich Zeichenfläche (Pixel)
// Seiteneffekt drag, xM, yM

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfläche bezüglich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bezüglich Zeichenfläche
  drag = true;                                             // Zugmodus einschalten
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// (x,y) ... Position bezüglich Zeichenfläche (Pixel)
// Seiteneffekt offsetX, offsetY, xM, yM

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfläche bezüglich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bezüglich Zeichenfläche
  offsetX -= (x-xM);                                       // Waagrechte Verschiebung (Pixel)
  var h1 = 75+nVar*DX+te.width+DX;                         // Hilfsgröße für maximale Verschiebung (Tabelle)
  var h2 = X2+teDNF.width;                                 // Hilfsgröße für maximale Verschiebung (DNF)
  var h3 = X2+teCNF.width;                                 // Hilfsgröße für maximale Verschiebung (KNF)
  var maxX = Math.max(Math.max(h1,h2),h3)-width+40;        // Maximaler Wert der Verschiebung
  if (offsetX > maxX) offsetX = maxX;                      // Zu großen Wert verhindern
  if (offsetX < 0) offsetX = 0;                            // Negativen Wert verhindern
  offsetY -= (y-yM);                                       // Senkrechte Verschiebung (Pixel)
  var maxY = 300+nLines*DY-height+40;                      // Maximaler Wert der Verschiebung
  if (offsetY > maxY) offsetY = maxY;                      // Zu großen Wert verhindern
  if (offsetY < 0) offsetY = 0;                            // Negativen Wert verhindern
  xM = x; yM = y;                                          // Koordinaten des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Zeichenkette für Wahrheitswert:
// v ... Wahrheitswert (0, 1 oder undefined)
// Rückgabewert: symbolFalse, symbolTrue oder "?"
  
function symbolFT (v) {
  switch (v) {                                             // Je nach Wahrheitswert ...                   
    case 0: return symbolFalse;                            // Symbol für "falsch"
    case 1: return symbolTrue;                             // Symbol für "wahr"
    default: return "?";                                   // Symbol für "unbekannt"
    }
  }
  
// Array für eine Zeile der Wahrheitstabelle (Werte 0 oder 1)
// i ... Zeilenindex (0 bis nLines-1)
  
function arrayLine (i) {
  var a = new Array(nVar);                                 // Neues Array
  var d = nLines/2;                                        // Startwert für Divisor
  for (var k=0; k<nVar; k++) {                             // Für alle Variablen-Indizes ...
    a[k] = Math.floor(i/d);                                // Array-Element
    i -= a[k]*d;                                           // Divisionsrest
    d /= 2;                                                // Neuer Divisor
    }
  return a;                                                // Rückgabewert
  }
  
// Zeichenkette für Minterm der disjunktiven Normalform:
// a ... Einfach indiziertes Array für eine Zeile der Wahrheitstabelle (Elemente 0 oder 1)
  
function dnfTerm (a) {
  var s = "";                                              // Leere Zeichenkette als Startwert
  for (var i=0; i<nVar; i++) {                             // Für alle Variablen-Indizes ...
  if (s != "") s += "U";                                   // Falls nicht am Anfang, "und" hinzufügen
    if (a[i] == 0) s += "N";                               // Falls Variablenwert 0, "nicht" hinzufügen
    s += variables[i];                                     // Variablenname hinzufügen
    }
  if (s == "" || nVar == 1) return s;                      // Rückgabewert, falls keine Klammer nötig
  return "("+s+")";                                        // Rückgabewert, falls Klammer nötig
  }
  
// Zeichenkette für Minterm der konjunktiven Normalform:
// a ... Einfach indiziertes Array für eine Zeile der Wahrheitstabelle (Elemente 0 oder 1)
  
function cnfTerm (a) {
  var s = "";                                              // Leere Zeichenkette als Startwert
  for (var i=0; i<nVar; i++) {                             // Für alle Variablen-Indizes ...
  if (s != "") s += "O";                                   // Falls nicht am Anfang, "oder" hinzufügen
    if (a[i] == 1) s += "N";                               // Falls Variablenwert 0, "nicht" hinzufügen
    s += variables[i];                                     // Variablenname hinzufügen
    }
  if (s == "" || nVar == 1) return s;                      // Rückgabewert, falls keine Klammer nötig
  return "("+s+")";                                        // Rückgabewert, falls Klammer nötig
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
  
// Begrenzungs- und Trennlinien für Wahrheitstabelle:
// (x0,y0) ... Ecke links oben (Pixel)
// Die Verschiebung durch offsetX und offsetY wird berücksichtigt.
  
function lines (x0, y0) {
  x0 -= offsetX; y0 -= offsetY;
  var dy = nLines*DY+10;                                   // Höhe (Pixel, ohne Titelzeile) 
  var x1 = x0+nVar*DX;                                     // x-Koordinate für senkrechte Trennlinie
  var x2 = x1+te.width+DX;                                 // x-Koordinate für rechten Rand (Pixel)
  line(x0,y0,x2,y0);                                       // Obere Begrenzungslinie 
  var y1 = y0+25;                                          // y-Koordinate für waagrechte Trennlinie
  line(x0,y1,x2,y1);                                       // Waagrechte Trennlinie
  var y2 = y1+dy;                                          // y-Koordinate für untere Begrenzungslinie
  line(x0,y2,x2,y2);                                       // Untere Begrenzungslinie
  line(x0,y0,x0,y2);                                       // Linke Begrenzungslinie
  line(x1,y0,x1,y2);                                       // Senkrechte Trennlinie
  line(x2,y0,x2,y2);                                       // Rechte Begrenzungslinie
  }
  
// Ausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (x,y) ... Position
// Die Verschiebung durch offsetX und offsetY wird berücksichtigt.

function writeText (s, x, y) {
  ctx.fillText(s,x-offsetX,y-offsetY);                     // Zeichenkette ausgeben
  }
  
// Ausgabe der Wahrheitstabelle:
// (x0,y0) ... Ecke links oben (Pixel)
// Die Verschiebung durch offsetX und offsetY wird berücksichtigt.
// Seiteneffekt: teDNF, teCNF
  
function writeTable (x0, y0) {
  var dnf = "", cnf = "";                                  // Leere Zeichenketten für Normalformen
  var a = new Array(nLines);                               // Zweifach indiziertes Array für Wahrheitswerte
  for (var i=0; i<nLines; i++) a[i] = arrayLine(i);        // Zweifach indiziertes Array aufbauen
  ctx.textAlign = "center";                                // Textausrichtung
  for (var k=0; k<nVar; k++) {                             // Für alle Variablen-Indizes ...
    var x = x0+(k+0.5)*DX;                                 // x-Koordinate für Variablenwert (Pixel)
    writeText(variables[k],x,y0+15);                       // Variable als Spaltentitel  
    for (i=0; i<nLines; i++) {                             // Für alle Zeilen-Indizes ...
      var s = symbolFT(a[i][k]);                           // Symbol für Wahrheitswert der Variablen
      writeText(s,x,y0+45+i*DY);                           // Wahrheitswert ausgeben
      }
    } // Ende for (k)
  x = x0+(nVar+0.5)*DX+te.width/2;                         // x-Koordinate für Ergebnis (Pixel)
  for (i=0; i<nLines; i++) {                               // Für alle Zeilen-Indizes ...
    s = symbolFT(te.getValue(a[i]));                       // Symbol für Wahrheitswert des gesamten Terms
    writeText(s,x,y0+45+i*DY);                             // Wahrheitswert ausgeben
    if (s == symbolTrue) {                                 // Falls Zeilenergebnis "wahr" ...
      if (dnf != "") dnf += "O";                           // Falls nicht am Anfang, "oder" zu dnf hinzufügen
      dnf += dnfTerm(a[i]);                                // Minterm zu dnf hinzufügen
      }
    if (s == symbolFalse) {                                // Falls Zeilenergebnis "falsch" ...
      if (cnf != "") cnf += "U";                           // Falls nicht am Anfang, "und" zu cnf hinzufügen
      cnf += cnfTerm(a[i]);                                // Minterm zu cnf hinzufügen
      }
    }
  if (dnf == "" && s != "?") dnf = "F";                    // Sonderfall: Disjunktive Normalform leer
  if (cnf == "" && s != "?") cnf = "W";                    // Sonderfall: Konjunktive Normalform leer
  teDNF = constrTerm(dnf,0,0);                             // Disjunktive Normalform (Seiteneffekt!)
  teCNF = constrTerm(cnf,0,0);                             // Konjunktive Normalform (Seiteneffekt!)
  ctx.textAlign = "left";                                  // Textausrichtung
  x = x0+(nVar+0.5)*DX-offsetX;                            // x-Koordinate für Term
  te.write(x,y0+15-offsetY,false);                         // Term als Spaltentitel ausgeben
  lines(x0,y0);                                            // Begrenzungs- und Trennlinien
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.font = FONT1;                                        // Zeichensatz 1 (Sansserif)
  ctx.fillStyle = "#0000ff";                               // Schriftfarbe
  writeText(text05,X1,50);                                 // Erklärender Text (Term)
  writeText(text06,X1,100);                                // Erklärender Text (Bemerkung)
  writeText(text07,X1,150);                                // Erklärender Text (Wahrheitstabelle)
  writeText(text08,X1,260+nLines*DY);                      // Erklärender Text (Disjunktive Normalform)
  writeText(text09,X1,300+nLines*DY);                      // Erklärender Text (Konjunktive Normalform)
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

