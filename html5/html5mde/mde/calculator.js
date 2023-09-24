// Rechnen mit beliebiger Genauigkeit
// 25.04.2020 - 01.07.2020

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel calculator_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var colorCursor = "#0000ff";                               // Farbe für Cursor

// Weitere Konstanten:

var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz
var FONT2 = "normal normal bold 12px monospace";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var buClear, buReset;                                      // Schaltknöpfe zum Löschen
var bu0, bu1, bu2, bu3, bu4, bu5, bu6, bu7, bu8, bu9;      // Schaltknöpfe für Ziffern
var buPerc;                                                // Schaltknopf für Prozent
var buPlus, buMinus, buMult, buDiv;                        // Schaltknöpfe für Grundrechenarten
var buOpen, buClose;                                       // Schaltknöpfe für Klammern
var stateFracNum;                                          // Zustandsvariable für Bruchzahlen
var selFracNum;                                            // Auswahlfeld für Bruchzahlen
var stateDecNum;                                           // Zustandsvariable für Dezimalbrüche
var selDecNum;                                             // Auswahlfeld für Dezimalbrüche
var stateFracTerm;                                         // Zustandsvariable für Bruchterme
var selFracTerm;                                           // Auswahlfeld für Bruchterme
var statePower;                                            // Zustandsvariable für Potenzen
var selPower;                                              // Auswahlfeld für Potenzen
var sel;                                                   // Auswahlfeld für Schreibweise des Ergebnisses
var input;                                                 // Eingegebene Zeichenkette
var te;                                                    // Term oder Gleichung
var offset;                                                // Verschiebung waagrecht (Pixel)
var drag;                                                  // Flag für Zugmodus
var xM;                                                    // Waagrechte Koordinate des Mauszeigers (Pixel)

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

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  buClear = getElement("clear",text01);                    // Schaltknopf (Löschen eines Zeichens)
  buReset = getElement("reset",text02);                    // Schaltknopf (Reset)
  bu0 = getElement("bu0");                                 // Schaltknopf (Ziffer 0) 
  bu1 = getElement("bu1");                                 // Schaltknopf (Ziffer 1) 
  bu2 = getElement("bu2");                                 // Schaltknopf (Ziffer 2) 
  bu3 = getElement("bu3");                                 // Schaltknopf (Ziffer 3) 
  bu4 = getElement("bu4");                                 // Schaltknopf (Ziffer 4) 
  bu5 = getElement("bu5");                                 // Schaltknopf (Ziffer 5) 
  bu6 = getElement("bu6");                                 // Schaltknopf (Ziffer 6) 
  bu7 = getElement("bu7");                                 // Schaltknopf (Ziffer 7) 
  bu8 = getElement("bu8");                                 // Schaltknopf (Ziffer 8) 
  bu9 = getElement("bu9");                                 // Schaltknopf (Ziffer 9) 
  buPerc = getElement("buPerc");                           // Schaltknopf (Prozent)
  buPlus = getElement("plus");                             // Schaltknopf (plus)
  buMinus = getElement("minus");                           // Schaltknopf (minus)
  buMult = getElement("mult");                             // Schaltknopf (mal)
  buDiv = getElement("div");                               // Schaltknopf (geteilt durch)
  buOpen = getElement("open");                             // Schaltknopf (öffnende Klammer)
  buClose = getElement("close");                           // Schaltknopf (schließende Klammer)
  getElement("frac",text03);                               // Erklärender Text (Bruch)
  selFracNum = newSelect("selFN",text04);                  // Auswahlfeld für Bruchzahlen
  getElement("dec",text05);                                // Erklärender Text (Dezimalbruch)
  selDecNum = newSelect("selDN",text06);                   // Auswahlfeld für Dezimalbrüche
  getElement("fracterm",text07);                           // Erklärender Text (Bruchterm)
  selFracTerm = newSelect("selFT",text08);                 // Auswahlfeld für Bruchterme 
  getElement("pow",text09);                                // Erklärender Text (Potenz)              
  selPower = newSelect("selPow",text10);                   // Auswahlfeld für Potenzen  
  sel = newSelect("sel",text11);                           // Auswahlfeld für Schreibweise des Ergebnisses
  getElement("author",author);                             // Autor (und Übersetzer)
  reactionReset();                                         // Anfangszustand
  drag = false;                                            // Zunächst kein Zugmodus
   
  buClear.onclick = reactionClear;                         // Reaktion auf Schaltknopf (Löschen eines Zeichens)
  buReset.onclick = reactionReset;                         // Reaktion auf Schaltknopf (Reset)
  bu0.onclick = function () {append("0")};                 // Reaktion auf Schaltknopf (Ziffer 0)
  bu1.onclick = function () {append("1")};                 // Reaktion auf Schaltknopf (Ziffer 1)
  bu2.onclick = function () {append("2")};                 // Reaktion auf Schaltknopf (Ziffer 2)
  bu3.onclick = function () {append("3")};                 // Reaktion auf Schaltknopf (Ziffer 3)
  bu4.onclick = function () {append("4")};                 // Reaktion auf Schaltknopf (Ziffer 4)
  bu5.onclick = function () {append("5")};                 // Reaktion auf Schaltknopf (Ziffer 5)
  bu6.onclick = function () {append("6")};                 // Reaktion auf Schaltknopf (Ziffer 6)
  bu7.onclick = function () {append("7")};                 // Reaktion auf Schaltknopf (Ziffer 7)
  bu8.onclick = function () {append("8")};                 // Reaktion auf Schaltknopf (Ziffer 8)
  bu9.onclick = function () {append("9")};                 // Reaktion auf Schaltknopf (Ziffer 9)
  buPerc.onclick = function () {append("%")};              // Reaktion auf Schaltknopf (Prozent)
  buPlus.onclick = function () {append("+")};              // Reaktion auf Schaltknopf (plus)
  buMinus.onclick = function () {append("-")};             // Reaktion auf Schaltknopf (minus)
  buMult.onclick = function () {append("*")};              // Reaktion auf Schaltknopf (mal)
  buDiv.onclick = function () {append(":")};               // Reaktion auf Schaltknopf (geteilt durch)
  selFN.onchange = reactionFracNum;                        // Reaktion auf Auswahlfeld (Bruch oder gemischte Zahl)
  selDN.onchange = reactionDecNum;                         // Reaktion auf Auswahlfeld (Dezimalbruch endlich/unendlich)
  buOpen.onclick = function () {append("(")};              // Reaktion auf Schaltknopf (Klammer auf)
  buClose.onclick = function () {append(")")};             // Reaktion auf Schaltknopf (Klammer zu)
  selFracTerm.onchange = reactionFracTerm;                 // Reaktion auf Auswahlfeld (Bruchterm)
  selPower.onchange = reactionPower;                       // Reaktion auf Auswahlfeld (Potenz)
  sel.onchange = paint;                                    // Reaktion auf Auswahlfeld (Schreibweise des Ergebnisses)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
  
  } // Ende der Methode start
  
// Hilfsroutine: Konstruktion eines Terms, Grafikausgabe
// Seiteneffekt te, input, offset, stateFracNum, stateDecNum, stateFracTerm, statePower
  
function reaction () {
  try {te = constrTerm(input,0,0);}                        // Versuch Termkonstruktion
  catch(err) {                                             // Ausnahmebehandlung
    alert(err);                                            // Fehlermeldung
    reactionClear();                                       // Letztes Zeichen löschen usw.
    }
  paint();                                                 // Grafikausgabe
  }
  
// Reaktion auf Schaltknopf (Löschen des letzten Zeichens):
// Seiteneffekt input, offset, stateFracNum, stateDecNum, stateFracTerm, statePower

function reactionClear () {
  var n = input.length;                                    // Länge der bisherigen Eingabe
  if (n == 0) return;                                      // Falls Länge 0, abbrechen
  if (input.endsWith("#\{")) n--;                          // "#{" wird als ein Zeichen gewertet
  else if (input.endsWith("\}/\{")) n -= 2;                // "}/{" wird als ein Zeichen gewertet
  else if (input.endsWith("^\{")) n--;                     // "^{" wird als ein Zeichen gewertet
  input = input.substring(0,n-1);                          // Letztes Zeichen weglassen
  offset = 0;                                              // Keine waagrechte Verschiebung
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Resetknopf (Alles löschen):
// Seiteneffekt stateFracNum, stateDecNum, stateFracTerm, statePower, input, offset, te
// Wirkung auf Auswahlfelder
  
function reactionReset () {
  stateFracNum = selFN.selectedIndex = 0;                  // Auswahlfeld Bruch zurücksetzen
  stateDecNum = selDN.selectedIndex = 0;                   // Auswahlfeld Dezimalbruch zurücksetzen
  stateFracTerm = selFracTerm.selectedIndex = 0;           // Auswahlfeld Bruchterm zurücksetzen
  statePower = selPower.selectedIndex = 0;                 // Auswahlfeld Potenz zurücksetzen
  input = "";                                              // Leere Eingabe
  offset = 0;                                              // Keine waagrechte Verschiebung
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hilfsroutine: Hinzufügung eines Zeichens zur Eingabe; Konstruktion des entsprechenden Terms; Grafikausgabe
// d ... Neues Zeichen
// Seiteneffekt input, stateFracNum, stateDecNum, stateFracTerm, statePower, te, offset 
// Wirkung auf Auswahlfelder
  
function append (d) {
  input += d;                                              // Neues Zeichen zur Eingabe hinzufügen
  if (stateFracNum == 2 && !d.match(/\d/))                 // Falls Nennereingabe und keine Ziffer ...
    stateFracNum = selFN.selectedIndex = 0;                // Auswahlfeld Bruch und Zustandsvariable zurücksetzen
  if (stateDecNum >= 1 && !d.match(/\d/))                  // Falls Dezimalbrucheingabe und keine Ziffer ...
    stateDecNum = selDN.selectedIndex = 0;                 // Auswahlfeld Dezimalbruch und Zustandsvariable zurücksetzen
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hilfsroutine: Zeichenkette für Teilterm eines bestimmten Typs am Ende der Eingabe
// isType ... Überprüfungsfunktion

function lastPart (s, isType) {
  var min = -1;                                            // Variable für Position
  for (var i=s.length-1; i>=0; i--) {                      // Für alle Positionen von rechts nach links ...
    var p = s.substring(i);                                // Teilzeichenkette (Ende von s)
    if (isType(p)) return s.substring(i);                  // Falls richtiger Typ, Rückgabewert
    }
  return undefined ;                                       // Rückgabewert, falls kein passender Teilterm gefunden
  }
  
// Hilfsroutine: Korrektheit eines Übergangs
// i1 ... Bisheriger Index
// i2 ... Neuer Index
// a .... Zweifach indiziertes Array mit den erlaubten Übergängen

function correctTransition (i1, i2, a) {
  for (var k=0; k<a.length; k++)                           // Für alle Indizes ...
    if (i1 == a[k][0] && i2 == a[k][1]) return true;       // Falls Übergang im Array, Rückgabewert true
  return false;                                            // Andernfalls Rückgabewert false
  }
  
// Hilfsroutine für reactionFracNum: Korrektheit eines Übergangs
// i1 ... Bisheriger Index (0 bis 2)
// i2 ... Neuer Index (0 bis 2)

function correctFracNum (i1, i2) {
  var a = [[0,1], [1,2]];                                  // Array der erlaubten Übergänge
  return correctTransition(i1,i2,a);                       // Rückgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Bruchzahlen:
// Seiteneffekt stateFracNum, input, te, offset, stateDecNum, stateFracTerm, statePower
  
function reactionFracNum () {
  var i = selFN.selectedIndex;                             // Ausgewählter Index (0 bis 2)
  if (!correctFracNum(stateFracNum,i)) {                   // Falls Übergang nicht zulässig ...
    selFN.selectedIndex = stateFracNum;                    // Auswahl rückgängig machen
    return;                                                // Abbrechen
    }
  stateFracNum = i;                                        // Neuen Zustand übernehmen
  if (i == 1) input += "#";                                // Falls Zustand 1 (Zähler), Eingabe durch '#' ergänzen
  else if (i == 2) input += "/";                           // Falls Zustand 2 (Nenner), Eingabe durch '/' ergänzen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Zustand der Eingabe von Bruchzahlen:
  
function getStateFracNum () {
  var e = lastPart(input,isFracNum);                       // Zeichenkette für Bruchzahl am Ende oder undefined
  if (e == undefined) return 0;                            // Entweder keine Bruchzahl am Ende ...
  if (e.indexOf("/") < 0) return 1;                        // ... oder Eingabe des Zählers ...
  return 2;                                                // ... oder Eingabe des Nenners
  }
  
// Hilfsroutine für reactionDecNum: Korrektheit eines Übergangs
// i1 ... Bisheriger Index (0 bis 2)
// i2 ... Neuer Index (0 bis 2)

function correctDecNum (i1, i2) {
  var a = [[0,1], [0,2], [1,2]];                             // Array der erlaubten Übergänge
  return correctTransition(i1,i2,a);                         // Rückgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Dezimalbrüchen:
// Seiteneffekt stateDecNum, input, te, offset, stateFracNum, stateFracTerm, statePower
  
function reactionDecNum () {
  var i = selDN.selectedIndex;                             // Ausgewählter Index (0 bis 2)
  if (!correctDecNum(stateDecNum,i)) {                     // Falls Übergang nicht zulässig ...
    selDN.selectedIndex = stateDecNum;                     // Auswahl rückgängig machen
    return;                                                // Abbrechen
    }
  if (stateDecNum == 0 && i == 2)                          // Falls Übergang 0 -> 2 ausgewählt ...
    input += ",";                                          // Eingabe durch Komma ergänzen
  stateDecNum = i;                                         // Neuen Zustand übernehmen
  if (i == 1) input += ",";                                // Falls Zustand 1, Eingabe durch Komma ergänzen
  else if (i == 2) input += ";";                           // Falls Zustand 2, Eingabe durch Strichpunkt ergänzen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Zustand der Eingabe von Dezimalbrüchen:
  
function getStateDecNum () {
  var e = lastPart(input,isDecNum);                        // Zeichenkette für Dezimalbruch am Ende oder undefined
  if (e == undefined) return 0;                            // Entweder kein Dezimalbruch am Ende ...
  if (e.indexOf(";") < 0) return 1;                        // ... oder Eingabe der normalen Nachkommastellen ...
  return 2;                                                // ... oder Eingabe der periodischen Nachkommastellen 
  }

// Hilfsroutine für reactionFracTerm: Korrektheit eines Übergangs
// i1 ... Bisheriger Index (0 bis 4)
// i2 ... Neuer Index (0 bis 4)

function correctFracTerm (i1, i2) {
  var a = [[0,1], [2,1], [2,3], [3,1], [3,4]];             // Array der erlaubten Übergänge
  return correctTransition(i1,i2,a);                       // Rückgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Bruchtermen:
// Seiteneffekt stateFracTerm, input, te, offset, stateFracNum, stateDecNum, statePower
// Wirkung auf Auswahlfelder

function reactionFracTerm () {
  var i = selFracTerm.selectedIndex;                       // Ausgewählter Index (0 bis 4)
  if (!correctFracTerm(stateFracTerm,i)) {                 // Falls Übergang nicht zulässig ...
    selFracTerm.selectedIndex = stateFracTerm;             // Auswahl rückgängig machen
    return;                                                // Abbrechen
    }
  if (i == 1) input += "#\{";                              // Entweder neuer Bruchterm (Beginn des Zählers) ...
  else if (i == 3) input += "\}/\{";                       // ... oder Beginn des Nenners ...
  else if (i == 4) input += "\}";                          // ... oder Abschluss des Bruchterms
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }

// Hilfsroutine für reactionPower: Korrektheit eines Übergangs
// i1 ... Bisheriger Index (0 bis 3)
// i2 ... Neuer Index (0 bis 3)

function correctPower (i1, i2) {
  var a = [[0,1], [2,1], [2,3]];                           // Array der erlaubten Übergänge
  return correctTransition(i1,i2,a);                       // Rückgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Potenzen:
// Seiteneffekt statePower, input, te, offset, stateFracNum, stateDecNum, stateFracTerm
// Wirkung auf Auswahlfelder

function reactionPower () {
  var i = selPower.selectedIndex;                          // Ausgewählter Index (0 bis 3)
  if (!correctPower(statePower,i)) {                       // Falls Übergang nicht zulässig ...
    selPower.selectedIndex = statePower;                   // Auswahl rückgängig machen
    return;                                                // Abbrechen
    }
  if (i == 1) input += "^\{";                              // Entweder neue Potenz (Beginn des Exponenten) ...
  else if (i == 3) input += "\}";                          // ... oder Abschluss der Potenz
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Zustand der Eingabe durch Auswahlfelder:
// Seiteneffekt stateFracNum, stateDecNum, stateFracTerm, statePower
// Wirkung auf Auswahlfelder

function setSelects () {
  stateFracNum = selFN.selectedIndex = getStateFracNum();  // Zustand der Eingabe Bruch
  stateDecNum = selDN.selectedIndex = getStateDecNum();    // Zustand der Eingabe Dezimalbruch
  var s = lastPart(input,isIncompleteFracTerm);            // Zeichenkette für unvollständigen Bruchterm am Ende oder undefined
  var i = (s ? typeFracTerm(s)+1 : 0);                     // Index für Auswahlfeld Bruchterm
  stateFracTerm = selFracTerm.selectedIndex = i;           // Auswahlfeld Bruchterm aktualisieren
  s = lastPart(input,isIncompletePower);                   // Zeichenkette für unvollständige Potenz am Ende oder undefined
  statePower = selPower.selectedIndex = (s ? 2 : 0);       // Auswahlfeld Potenz aktualisieren  
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
// Seiteneffekt drag, xM

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfläche bezüglich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bezüglich Zeichenfläche
  drag = true;                                             // Zugmodus einschalten
  xM = x;                                                  // x-Koordinate des Mauszeigers speichern
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// (x,y) ... Position bezüglich Zeichenfläche (Pixel)
// Seiteneffekt offset, xM

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfläche bezüglich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bezüglich Zeichenfläche
  offset -= (x-xM);                                        // Waagrechte Verschiebung        
  if (offset < 0) offset = 0;                              // Negativen Wert der Verschiebung verhindern
  xM = x;                                                  // x-Koordinate des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
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
  
// Zusätzliche Angaben für die Fehlersuche:

function paint2 () {
  ctx.font = FONT2;                                        // Zeichensatz (Monospace)
  var x1 = 50-offset, x2 = 250-offset, x3 = 450-offset;    // Waagrechte Bildschirmkoordinaten (Pixel)
  ctx.fillText(text21,x1,360);                             // Erklärender Text (Zeichenkette)
  ctx.fillText(input,x2,360);                              // Zeichenkette
  ctx.fillText("complete = "+te.complete,x1,380);          // Vollständigkeit
  ctx.fillText("x = "+te.x,x1,400);                        // x-Koordinate (Pixel)
  ctx.fillText("y = "+te.y,x2,400);                        // y-Koordinate (Pixel)
  ctx.fillText("width = "+te.width,x1,420);                // Breite (Pixel)
  ctx.fillText("asc = "+te.asc,x2,420);                    // Platzbedarf nach oben (Pixel)
  ctx.fillText("desc = "+te.desc,x3,420);                  // Platzbedarf nach unten (Pixel)
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  var x1 = 50-offset, x2 = 250-offset;                     // Waagrechte Bildschirmkoordinaten (Pixel)
  ctx.font = FONT1;                                        // Zeichensatz 1 (Sansserif)
  ctx.fillStyle = "#0000ff";                               // Schriftfarbe
  ctx.fillText(text22,x1,100);                             // Erklärender Text (Term)
  ctx.fillText(text24,x1,300);                             // Erklärender Text (Bemerkung)
  ctx.fillText(text25,x1,200);                             // Erklärender Text (Ergebnis)
  ctx.font = FONT2;                                        // Zeichensatz 2 (Monospace)
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  te.write(x2,100);                                        // Term ausgeben
  ctx.fillText(te.comment(),x2,300);                       // Bemerkung ausgeben
  switch(sel.selectedIndex) {                              // Abhängig vom Auswahlfeld ...
    case 0: writeFrac(te.value,x2,200); break;             // Wert als Bruch ausgeben
    case 1: writeMix(te.value,x2,200); break;              // Wert als gemischte Zahl ausgeben
    case 2: writeDec(te.value,x2,200); break;              // Wert als Dezimalbruch ausgeben
    }
  //paint2();                                                // Angaben für Fehlersuche
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

