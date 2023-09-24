// Rechnen mit beliebiger Genauigkeit
// 25.04.2020 - 01.07.2020

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel calculator_de.js) abgespeichert.

// Farben:

var colorBackground = "#f8f8ff";                           // Hintergrundfarbe
var colorCursor = "#0000ff";                               // Farbe f�r Cursor

// Weitere Konstanten:

var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz
var FONT2 = "normal normal bold 12px monospace";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var buClear, buReset;                                      // Schaltkn�pfe zum L�schen
var bu0, bu1, bu2, bu3, bu4, bu5, bu6, bu7, bu8, bu9;      // Schaltkn�pfe f�r Ziffern
var buPerc;                                                // Schaltknopf f�r Prozent
var buPlus, buMinus, buMult, buDiv;                        // Schaltkn�pfe f�r Grundrechenarten
var buOpen, buClose;                                       // Schaltkn�pfe f�r Klammern
var stateFracNum;                                          // Zustandsvariable f�r Bruchzahlen
var selFracNum;                                            // Auswahlfeld f�r Bruchzahlen
var stateDecNum;                                           // Zustandsvariable f�r Dezimalbr�che
var selDecNum;                                             // Auswahlfeld f�r Dezimalbr�che
var stateFracTerm;                                         // Zustandsvariable f�r Bruchterme
var selFracTerm;                                           // Auswahlfeld f�r Bruchterme
var statePower;                                            // Zustandsvariable f�r Potenzen
var selPower;                                              // Auswahlfeld f�r Potenzen
var sel;                                                   // Auswahlfeld f�r Schreibweise des Ergebnisses
var input;                                                 // Eingegebene Zeichenkette
var te;                                                    // Term oder Gleichung
var offset;                                                // Verschiebung waagrecht (Pixel)
var drag;                                                  // Flag f�r Zugmodus
var xM;                                                    // Waagrechte Koordinate des Mauszeigers (Pixel)

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

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  ctx = canvas.getContext("2d");                           // Grafikkontext
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  buClear = getElement("clear",text01);                    // Schaltknopf (L�schen eines Zeichens)
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
  buOpen = getElement("open");                             // Schaltknopf (�ffnende Klammer)
  buClose = getElement("close");                           // Schaltknopf (schlie�ende Klammer)
  getElement("frac",text03);                               // Erkl�render Text (Bruch)
  selFracNum = newSelect("selFN",text04);                  // Auswahlfeld f�r Bruchzahlen
  getElement("dec",text05);                                // Erkl�render Text (Dezimalbruch)
  selDecNum = newSelect("selDN",text06);                   // Auswahlfeld f�r Dezimalbr�che
  getElement("fracterm",text07);                           // Erkl�render Text (Bruchterm)
  selFracTerm = newSelect("selFT",text08);                 // Auswahlfeld f�r Bruchterme 
  getElement("pow",text09);                                // Erkl�render Text (Potenz)              
  selPower = newSelect("selPow",text10);                   // Auswahlfeld f�r Potenzen  
  sel = newSelect("sel",text11);                           // Auswahlfeld f�r Schreibweise des Ergebnisses
  getElement("author",author);                             // Autor (und �bersetzer)
  reactionReset();                                         // Anfangszustand
  drag = false;                                            // Zun�chst kein Zugmodus
   
  buClear.onclick = reactionClear;                         // Reaktion auf Schaltknopf (L�schen eines Zeichens)
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
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
  
  } // Ende der Methode start
  
// Hilfsroutine: Konstruktion eines Terms, Grafikausgabe
// Seiteneffekt te, input, offset, stateFracNum, stateDecNum, stateFracTerm, statePower
  
function reaction () {
  try {te = constrTerm(input,0,0);}                        // Versuch Termkonstruktion
  catch(err) {                                             // Ausnahmebehandlung
    alert(err);                                            // Fehlermeldung
    reactionClear();                                       // Letztes Zeichen l�schen usw.
    }
  paint();                                                 // Grafikausgabe
  }
  
// Reaktion auf Schaltknopf (L�schen des letzten Zeichens):
// Seiteneffekt input, offset, stateFracNum, stateDecNum, stateFracTerm, statePower

function reactionClear () {
  var n = input.length;                                    // L�nge der bisherigen Eingabe
  if (n == 0) return;                                      // Falls L�nge 0, abbrechen
  if (input.endsWith("#\{")) n--;                          // "#{" wird als ein Zeichen gewertet
  else if (input.endsWith("\}/\{")) n -= 2;                // "}/{" wird als ein Zeichen gewertet
  else if (input.endsWith("^\{")) n--;                     // "^{" wird als ein Zeichen gewertet
  input = input.substring(0,n-1);                          // Letztes Zeichen weglassen
  offset = 0;                                              // Keine waagrechte Verschiebung
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Reaktion auf Resetknopf (Alles l�schen):
// Seiteneffekt stateFracNum, stateDecNum, stateFracTerm, statePower, input, offset, te
// Wirkung auf Auswahlfelder
  
function reactionReset () {
  stateFracNum = selFN.selectedIndex = 0;                  // Auswahlfeld Bruch zur�cksetzen
  stateDecNum = selDN.selectedIndex = 0;                   // Auswahlfeld Dezimalbruch zur�cksetzen
  stateFracTerm = selFracTerm.selectedIndex = 0;           // Auswahlfeld Bruchterm zur�cksetzen
  statePower = selPower.selectedIndex = 0;                 // Auswahlfeld Potenz zur�cksetzen
  input = "";                                              // Leere Eingabe
  offset = 0;                                              // Keine waagrechte Verschiebung
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hilfsroutine: Hinzuf�gung eines Zeichens zur Eingabe; Konstruktion des entsprechenden Terms; Grafikausgabe
// d ... Neues Zeichen
// Seiteneffekt input, stateFracNum, stateDecNum, stateFracTerm, statePower, te, offset 
// Wirkung auf Auswahlfelder
  
function append (d) {
  input += d;                                              // Neues Zeichen zur Eingabe hinzuf�gen
  if (stateFracNum == 2 && !d.match(/\d/))                 // Falls Nennereingabe und keine Ziffer ...
    stateFracNum = selFN.selectedIndex = 0;                // Auswahlfeld Bruch und Zustandsvariable zur�cksetzen
  if (stateDecNum >= 1 && !d.match(/\d/))                  // Falls Dezimalbrucheingabe und keine Ziffer ...
    stateDecNum = selDN.selectedIndex = 0;                 // Auswahlfeld Dezimalbruch und Zustandsvariable zur�cksetzen
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Hilfsroutine: Zeichenkette f�r Teilterm eines bestimmten Typs am Ende der Eingabe
// isType ... �berpr�fungsfunktion

function lastPart (s, isType) {
  var min = -1;                                            // Variable f�r Position
  for (var i=s.length-1; i>=0; i--) {                      // F�r alle Positionen von rechts nach links ...
    var p = s.substring(i);                                // Teilzeichenkette (Ende von s)
    if (isType(p)) return s.substring(i);                  // Falls richtiger Typ, R�ckgabewert
    }
  return undefined ;                                       // R�ckgabewert, falls kein passender Teilterm gefunden
  }
  
// Hilfsroutine: Korrektheit eines �bergangs
// i1 ... Bisheriger Index
// i2 ... Neuer Index
// a .... Zweifach indiziertes Array mit den erlaubten �berg�ngen

function correctTransition (i1, i2, a) {
  for (var k=0; k<a.length; k++)                           // F�r alle Indizes ...
    if (i1 == a[k][0] && i2 == a[k][1]) return true;       // Falls �bergang im Array, R�ckgabewert true
  return false;                                            // Andernfalls R�ckgabewert false
  }
  
// Hilfsroutine f�r reactionFracNum: Korrektheit eines �bergangs
// i1 ... Bisheriger Index (0 bis 2)
// i2 ... Neuer Index (0 bis 2)

function correctFracNum (i1, i2) {
  var a = [[0,1], [1,2]];                                  // Array der erlaubten �berg�nge
  return correctTransition(i1,i2,a);                       // R�ckgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Bruchzahlen:
// Seiteneffekt stateFracNum, input, te, offset, stateDecNum, stateFracTerm, statePower
  
function reactionFracNum () {
  var i = selFN.selectedIndex;                             // Ausgew�hlter Index (0 bis 2)
  if (!correctFracNum(stateFracNum,i)) {                   // Falls �bergang nicht zul�ssig ...
    selFN.selectedIndex = stateFracNum;                    // Auswahl r�ckg�ngig machen
    return;                                                // Abbrechen
    }
  stateFracNum = i;                                        // Neuen Zustand �bernehmen
  if (i == 1) input += "#";                                // Falls Zustand 1 (Z�hler), Eingabe durch '#' erg�nzen
  else if (i == 2) input += "/";                           // Falls Zustand 2 (Nenner), Eingabe durch '/' erg�nzen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Zustand der Eingabe von Bruchzahlen:
  
function getStateFracNum () {
  var e = lastPart(input,isFracNum);                       // Zeichenkette f�r Bruchzahl am Ende oder undefined
  if (e == undefined) return 0;                            // Entweder keine Bruchzahl am Ende ...
  if (e.indexOf("/") < 0) return 1;                        // ... oder Eingabe des Z�hlers ...
  return 2;                                                // ... oder Eingabe des Nenners
  }
  
// Hilfsroutine f�r reactionDecNum: Korrektheit eines �bergangs
// i1 ... Bisheriger Index (0 bis 2)
// i2 ... Neuer Index (0 bis 2)

function correctDecNum (i1, i2) {
  var a = [[0,1], [0,2], [1,2]];                             // Array der erlaubten �berg�nge
  return correctTransition(i1,i2,a);                         // R�ckgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Dezimalbr�chen:
// Seiteneffekt stateDecNum, input, te, offset, stateFracNum, stateFracTerm, statePower
  
function reactionDecNum () {
  var i = selDN.selectedIndex;                             // Ausgew�hlter Index (0 bis 2)
  if (!correctDecNum(stateDecNum,i)) {                     // Falls �bergang nicht zul�ssig ...
    selDN.selectedIndex = stateDecNum;                     // Auswahl r�ckg�ngig machen
    return;                                                // Abbrechen
    }
  if (stateDecNum == 0 && i == 2)                          // Falls �bergang 0 -> 2 ausgew�hlt ...
    input += ",";                                          // Eingabe durch Komma erg�nzen
  stateDecNum = i;                                         // Neuen Zustand �bernehmen
  if (i == 1) input += ",";                                // Falls Zustand 1, Eingabe durch Komma erg�nzen
  else if (i == 2) input += ";";                           // Falls Zustand 2, Eingabe durch Strichpunkt erg�nzen
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }
  
// Zustand der Eingabe von Dezimalbr�chen:
  
function getStateDecNum () {
  var e = lastPart(input,isDecNum);                        // Zeichenkette f�r Dezimalbruch am Ende oder undefined
  if (e == undefined) return 0;                            // Entweder kein Dezimalbruch am Ende ...
  if (e.indexOf(";") < 0) return 1;                        // ... oder Eingabe der normalen Nachkommastellen ...
  return 2;                                                // ... oder Eingabe der periodischen Nachkommastellen 
  }

// Hilfsroutine f�r reactionFracTerm: Korrektheit eines �bergangs
// i1 ... Bisheriger Index (0 bis 4)
// i2 ... Neuer Index (0 bis 4)

function correctFracTerm (i1, i2) {
  var a = [[0,1], [2,1], [2,3], [3,1], [3,4]];             // Array der erlaubten �berg�nge
  return correctTransition(i1,i2,a);                       // R�ckgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Bruchtermen:
// Seiteneffekt stateFracTerm, input, te, offset, stateFracNum, stateDecNum, statePower
// Wirkung auf Auswahlfelder

function reactionFracTerm () {
  var i = selFracTerm.selectedIndex;                       // Ausgew�hlter Index (0 bis 4)
  if (!correctFracTerm(stateFracTerm,i)) {                 // Falls �bergang nicht zul�ssig ...
    selFracTerm.selectedIndex = stateFracTerm;             // Auswahl r�ckg�ngig machen
    return;                                                // Abbrechen
    }
  if (i == 1) input += "#\{";                              // Entweder neuer Bruchterm (Beginn des Z�hlers) ...
  else if (i == 3) input += "\}/\{";                       // ... oder Beginn des Nenners ...
  else if (i == 4) input += "\}";                          // ... oder Abschluss des Bruchterms
  setSelects();                                            // Auswahlfelder aktualisieren
  reaction();                                              // Termkonstruktion, Grafikausgabe
  }

// Hilfsroutine f�r reactionPower: Korrektheit eines �bergangs
// i1 ... Bisheriger Index (0 bis 3)
// i2 ... Neuer Index (0 bis 3)

function correctPower (i1, i2) {
  var a = [[0,1], [2,1], [2,3]];                           // Array der erlaubten �berg�nge
  return correctTransition(i1,i2,a);                       // R�ckgabewert (Aufruf der allgemeinen Methode)
  }
  
// Reaktion auf Auswahlfeld zur Eingabe von Potenzen:
// Seiteneffekt statePower, input, te, offset, stateFracNum, stateDecNum, stateFracTerm
// Wirkung auf Auswahlfelder

function reactionPower () {
  var i = selPower.selectedIndex;                          // Ausgew�hlter Index (0 bis 3)
  if (!correctPower(statePower,i)) {                       // Falls �bergang nicht zul�ssig ...
    selPower.selectedIndex = statePower;                   // Auswahl r�ckg�ngig machen
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
  var s = lastPart(input,isIncompleteFracTerm);            // Zeichenkette f�r unvollst�ndigen Bruchterm am Ende oder undefined
  var i = (s ? typeFracTerm(s)+1 : 0);                     // Index f�r Auswahlfeld Bruchterm
  stateFracTerm = selFracTerm.selectedIndex = i;           // Auswahlfeld Bruchterm aktualisieren
  s = lastPart(input,isIncompletePower);                   // Zeichenkette f�r unvollst�ndige Potenz am Ende oder undefined
  statePower = selPower.selectedIndex = (s ? 2 : 0);       // Auswahlfeld Potenz aktualisieren  
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
// Seiteneffekt drag, xM

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  drag = true;                                             // Zugmodus einschalten
  xM = x;                                                  // x-Koordinate des Mauszeigers speichern
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt offset, xM

function reactionMove (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
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
  
// Zus�tzliche Angaben f�r die Fehlersuche:

function paint2 () {
  ctx.font = FONT2;                                        // Zeichensatz (Monospace)
  var x1 = 50-offset, x2 = 250-offset, x3 = 450-offset;    // Waagrechte Bildschirmkoordinaten (Pixel)
  ctx.fillText(text21,x1,360);                             // Erkl�render Text (Zeichenkette)
  ctx.fillText(input,x2,360);                              // Zeichenkette
  ctx.fillText("complete = "+te.complete,x1,380);          // Vollst�ndigkeit
  ctx.fillText("x = "+te.x,x1,400);                        // x-Koordinate (Pixel)
  ctx.fillText("y = "+te.y,x2,400);                        // y-Koordinate (Pixel)
  ctx.fillText("width = "+te.width,x1,420);                // Breite (Pixel)
  ctx.fillText("asc = "+te.asc,x2,420);                    // Platzbedarf nach oben (Pixel)
  ctx.fillText("desc = "+te.desc,x3,420);                  // Platzbedarf nach unten (Pixel)
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  var x1 = 50-offset, x2 = 250-offset;                     // Waagrechte Bildschirmkoordinaten (Pixel)
  ctx.font = FONT1;                                        // Zeichensatz 1 (Sansserif)
  ctx.fillStyle = "#0000ff";                               // Schriftfarbe
  ctx.fillText(text22,x1,100);                             // Erkl�render Text (Term)
  ctx.fillText(text24,x1,300);                             // Erkl�render Text (Bemerkung)
  ctx.fillText(text25,x1,200);                             // Erkl�render Text (Ergebnis)
  ctx.font = FONT2;                                        // Zeichensatz 2 (Monospace)
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  te.write(x2,100);                                        // Term ausgeben
  ctx.fillText(te.comment(),x2,300);                       // Bemerkung ausgeben
  switch(sel.selectedIndex) {                              // Abh�ngig vom Auswahlfeld ...
    case 0: writeFrac(te.value,x2,200); break;             // Wert als Bruch ausgeben
    case 1: writeMix(te.value,x2,200); break;              // Wert als gemischte Zahl ausgeben
    case 2: writeDec(te.value,x2,200); break;              // Wert als Dezimalbruch ausgeben
    }
  //paint2();                                                // Angaben f�r Fehlersuche
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

