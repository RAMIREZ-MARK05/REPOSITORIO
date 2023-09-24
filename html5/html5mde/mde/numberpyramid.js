// Zahlenpyramide
// 15.04.2023 - 08.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel numberpyramid_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorCell = "#ffffff";                                 // Farbe einer normalen Zelle
var colorEmph = "#ffc0c0";                                 // Farbe einer hervorgehobenen Zelle

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var Y0 = 180;                                              // Pyramidenspitze, senkrechte Bildschirmkoordinate (Pixel)
var DX = 32;                                               // Breite einer Zelle (Pixel)
var DY = 20;                                               // H�he einer Zelle (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che
var ch1, ch2, ch3;                                         // Auswahlfelder
var ip;                                                    // Eingabefeld
var bu1, bu2, bu3;                                         // Schaltkn�pfe
var n;                                                     // Gr��e der Pyramide (Zahl der Stockwerke)
var p0;                                                    // Unvollst�ndige Zahlenpyramide (zweifach indiziertes Array)
var p1;                                                    // Erg�nzte Zahlenpyramide (einfache Erg�nzungen) oder undefined
var p2;                                                    // Vollst�ndige Zahlenpyramide (zweifach indiziertes Array) oder undefined
var i0, j0;                                                // Indizes der hervorgehobenen Zelle oder -1
var given;                                                 // Array mit Angaben zu den gegebenen Zahlen
var step;                                                  // Anzahl der besetzten Zellen
var show;                                                  // Flag f�r Einblenden der L�sung
var numberSet;                                             // Zahlenmenge ("N", "Z" oder "Q")
var fixed;                                                 // Flag f�r fixierte Aufgabe

// Start:

function start () {
  n = 5;                                                   // Startwert Gr��e
  reset();                                                 // Einstellungen zur�cksetzen                          
  canvas = document.getElementById("cv");                  // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (L�schen)
  getElement("lb1",text02);                                // Erkl�render Text (Gr��e)
  var a = new Array(9);                                    // Array f�r Auswahlfeld (Gr��e)
  for (var i=0; i<=8; i++) a[i] = String(i+2);             // Arrayelemente
  ch1 = newSelect("ch1",a);                                // Auswahlfeld (Gr��e)
  ch1.selectedIndex = n-2;                                 // Startwert Index
  ch2 = newSelect("ch2",select2);                          // Auswahlfeld (Eigene/zuf�llige Aufgabe)
  ch2.selectedIndex = 0;                                   // Startwert Index
  ch3 = newSelect("ch3",select3);                          // Auswahlfeld (Nat�rliche/ganze Zahlen)
  ch3.selectedIndex = 0;                                   // Startwert Index
  getElement("lb2",text03);                                // Erkl�render Text (Zahl)
  ip = getElement("ip");                                   // Eingabefeld (Zahl)
  ip.value = "";                                           // Eingabefeld zun�chst leer
  ip.readOnly = true;                                      // Eingabefeld zun�chst deaktiviert
  bu2 = getElement("bu2",text04);                          // Schaltknopf (�bernehmen)
  bu3 = getElement("bu3",text05[0]);                       // Schaltknopf (L�sung zeigen/verbergen)  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  paint();                                                 // Neu zeichnen
  
  bu1.onclick = reactionButton1;                           // Reaktion auf Schaltknopf (L�schen)
  ch1.onchange = reactionSelect1;                          // Reaktion auf Auswahlfeld (Gr��e)
  ch2.onchange = reactionSelect2;                          // Reaktion auf Auswahlfeld (Eigene/zuf�llige Aufgabe)
  ip.onkeydown = reactionEnter;                            // Reaktion auf Enter-Taste (Zahl �bernehmen)
  bu2.onclick = reactionButton2;                           // Reaktion auf Schaltknopf (�bernehmen)
  bu3.onclick = reactionButton3;                           // Reaktion auf Schaltknopf (L�sung zeigen)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionUp;                           // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionUp;                          // Reaktion auf Ende der Ber�hrung
     
  } // Ende der Methode start
  
// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }
  
// Neues Auswahlfeld:
// id ... ID im HTML-Text
// t .... Array von Zeichenketten
  
function newSelect (id, t) {
  var ch = getElement(id);                                 // Neues Auswahlfeld (gem�� ID)
  for (var i=0; i<t.length; i++) {                         // F�r alle Indizes ...
    var o = document.createElement("option");              // Neue Option
    o.text = t[i];                                         // Zeichenkette der Option
    ch.add(o);                                             // Option zum Auswahlfeld hinzuf�gen
    }
  return ch;                                               // R�ckgabewert
  }
  
// Reset:
// Seiteneffekt i0, j0, p0, step, given, p1, p2, show, numberSet, fixed
// Wirkung auf das Eingabefeld ip und auf den Schaltknopf bu3
  
function reset () {
  i0 = j0 = -1;                                            // Keine Zelle hervorgehoben
  p0 = newPyramid(n);                                      // Neue Zahlenpyramide (leer)
  step = 0;                                                // Startwert f�r Anzahl der besetzten Zellen
  given = newGiven(n);                                     // Array f�r Angaben zu den gegebenen Zahlen
  p1 = newPyramid(n);                                      // Neue Zahlenpyramide f�r Erg�nzungen (leer)
  p2 = undefined;                                          // L�sung undefiniert
  if (ip != undefined) ip.value = "";                      // Eingabefeld leer
  show = false;                                            // L�sung nicht einblenden
  if (bu3 != undefined) bu3.innerHTML = text05[0];         // Text f�r Schaltknopf (L�sung zeigen)
  numberSet = undefined;                                   // Zahlenmenge undefiniert
  fixed = false;                                           // Aufgabe nicht fixiert
  } 
  
// Reaktion auf Schaltknopf (L�schen):
// Seiteneffekt i0, j0, p0, step, given, p1, p2, show, numberSet, fixed

function reactionButton1 () {
  reset();                                                 // Einstellungen zur�cksetzen
  ch2.selectedIndex = 0;                                   // Einstellung "Eigene Aufgabe"
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Auswahlfeld (Gr��e):
// Seiteneffekt n, i0, j0, p0, step, given, p1, p2, show, numberSet, fixed

function reactionSelect1 () {
  n = ch1.selectedIndex+2;                                 // Gr��e aus dem Auswahlfeld
  reset();                                                 // Einstellungen zur�cksetzen
  ch2.selectedIndex = 0;                                   // Einstellung "Eigene Aufgabe"
  ch3.selectedIndex = 0;                                   // Einstellung "Nat�rliche Zahlen"
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Auswahlfeld (eigene/zuf�llige Aufgabe):
// Seiteneffekt i0, j0, p0, step, given, p1, p2, show, numberSet, fixed

  
function reactionSelect2 () {
  reset();                                                 // Einstellungen zur�cksetzen
  if (ch2.selectedIndex == 1) {                            // Falls zuf�llige Aufgabe ...
    do {                                                   // Wiederhole ...
      p0 = randomPyramid(n);                               // Zuf�llige Zahlenpyramide
      step = number(p0,0,n-1);                             // Anzahl der besetzten Zellen (Ergebnis n)
      var lgs = getSystem(p0);                             // Lineares Gleichungssystem (eventuell leer)
      var cr = cramer(lgs);                                // Verbund mit L�sungsvektor x oder undefined
      }
    while (cr.x == undefined || cr.set == "Q");            // ... solange L�sungsvektor undefiniert oder mit Br�chen
    var v = solution(p0);                                  // Verbund aus vollst�ndiger L�sung, Status und L�sungsmenge
    fixed = true;                                          // Aufgabe fixieren
    numberSet = v.set;                                     // Zahlenmenge
    p1 = undefined;                                        // Zahlenpyramide mit direkten Erg�nzungen
    p2 = v.pyr;                                            // Vollst�ndige L�sung                    
    } // Ende if
  paint();                                                 // Neu zeichnen
  }
  
// Hilfsroutine: Eingabe vorl�ufig beendet, keine Zelle hervorgehoben
// Seiteneffekt i0, j0

function endInput () {
  ip.value = "";                                           // Eingabefeld leer
  ip.blur();                                               // Kein Cursor im Eingabefeld
  i0 = j0 = -1;                                            // Keine Zelle hervorgehoben
  }
  
// Hilfsroutine: Reaktion auf Fehler
// status ... "OK" (in Ordnung), "W" (Widerspruch) oder "R" (Redundanz)
// Seiteneffekt p0, given, step, i0, j0
  
function reactionError (status) {
  if (status == "OK") return;                              // Falls Status "OK", abbrechen                     
  p0[i0][j0] = undefined;                                  // Zahl in der hervorgehobenen Zelle l�schen
  given[i0][j0] = false;                                   // Array given aktualisieren
  step = number(p0,0,n-1);                                 // Anzahl der besetzten Zellen
  if (status == "W") alert(fixed ? text13 : text11);       // Fehlermeldung Widerspruch
  else if (status == "R") alert(text12);                   // Fehlermeldung Redundanz
  endInput();                                              // Eingabe vorl�ufig beenden
  }
  
// Reaktion auf Schaltknopf (�bernehmen):
// Seiteneffekt p0, given, step, p1, p2, numberSet, fixed, i0, j0
  
function reactionButton2 () {
  if (!indicesOK(i0,j0)) return;                           // Falls keine Zelle hervorgehoben, abbrechen
  var max = 9999;                                          // Gr��te m�gliche Zahl
  var min = (ch3.selectedIndex == 0 ? 0 : -max);           // Kleinste m�gliche Zahl  
  var z = inputNumber(ip,min,max);                         // Eingegebene Zahl oder undefined
  ip.value = "";                                           // Eingabefeld l�schen
  ip.focus();                                              // Cursor im Eingabefeld
  p0[i0][j0] = z;                                          // Eingabe in die Zahlenpyramide �bernehmen
  var t = test(p0);                                        // Ergebnis einer Kontrolle (0, 1 oder 2)
  if (t == 0) {                                            // Falls alles richtig ...
    if (!fixed) given[i0][j0] = true;                      // Array given aktualisieren
    step = number(p0,0,n-1);                               // Variable step aktualisieren
    if (step < n) {                                        // Falls erste bis vorletzte gegebene Zahl ...
      p1 = direct(p0);                                     // Erg�nzte Zahlenpyramide (einfache Erg�nzungen)
      p2 = undefined;                                      // Vollst�ndige L�sung noch undefiniert
      }
    else if (step == n) {                                  // Falls letzte der gegebenen Zahlen ...
      p1 = undefined;                                      // Erg�nzte Zahlenpyramide (einfache Erg�nzungen) undefiniert
      var v = solution(p0);                                // Verbund mit L�sung, Status und Zahlenmenge
      var ok = (v.status == "OK");                         // Flag f�r erfolgreiche L�sung
      p2 = (ok ? v.pyr : undefined);                       // Vollst�ndige L�sung (zweifach indiziertes Array)
      numberSet = v.set;                                   // Zahlenmenge ("N", "Z" oder "Q")
      if (ok && numberSet == "Z") {                        // Falls Status "OK" und Zahlenmenge "Z" ...
        if (ch3.selectedIndex == 0) alert(text15);         // Fehlermeldung
        ch3.selectedIndex = 1;                             // Option "Z" im Auswahlfeld
        }
      if (ok && numberSet != "Q") fixed = true;            // Falls Status "OK" und Zahlenmenge "N" oder "Z", Aufgabe fixieren
      if (numberSet == "Q") alert(text14);                 // Fehlermeldung f�r "Q"
      if (!ok) reactionError(v.status);                    // Falls n�tig, Reaktion auf Fehler
      }
    } // Ende des Falls t == 0
  else if (t == 1) reactionError("W");                     // Fall t == 1 (Widerspruch)
  else if (t == 2) reactionError("R");                     // Fall t == 2 (Redundanz)
  if (fixed && t == 0) endInput();                         // Falls Aufgabe fixiert und Eingabe fehlerfrei, Eingabe beenden
  if (step >= (n+1)*n/2) endInput();                       // Falls Aufgabe abgeschlossen, Eingabe beenden
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (L�sung zeigen/verbergen):
// Seiteneffekt show, i0, j0
  
function reactionButton3 () {
  bu3.innerHTML = text05[show?0:1];                        // Text �ndern
  show = !show;                                            // Flag �ndern
  if (!show) endInput();                                   // Falls L�sung verborgen, Eingabe beenden
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt p0, given, step, p1, p2, numberSet, fixed, i0, j0
  
function reactionEnter (e) {
  var enter = (e.key && e.key == "Enter");                 // Flag f�r Enter-Taste
  if (enter) reactionButton2();                            // Falls Enter-Taste, Zahl �bernehmen, rechnen, neu zeichnen                          
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl eines Objekts)                   
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl eines Objekts)
  if (indicesOK(i0,j0)) e.preventDefault();                // Falls Zelle ausgew�hlt, Standardverhalten verhindern
  }
    
// Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl eines Objekts):
// (x,y) ... Position bez�glich Zeichenfl�che (Pixel)
// Seiteneffekt i0, j0, Wirkung auf das Eingabefeld ip

function reactionDown (x, y) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfl�che bez�glich Viewport
  x -= r.left; y -= r.top;                                 // Koordinaten bez�glich Zeichenfl�che
  var dy = y-(Y0-(n-1)*DY/2);                              // Senkrechter Abstand zum obersten Stockwerk (Pixel)
  i0 = Math.round(dy/DY);                                  // Stockwerk-Index, eventuell unzul�ssig
  var dx = x-(width/2-(i0+1)*DX/2);                        // Waagrechter Abstand zur linken Zelle des Stockwerks (Pixel)
  j0 = Math.round(dx/DX);                                  // Zellen-Index, eventuell unzul�ssig        
  if (!indicesOK(i0,j0)) endInput();                       // Falls Indizes unzul�ssig, Eingabe beenden
  paint();                                                 // Neu zeichnen
  if (i0 < 0 || j0 < 0) return;                            // Falls keine Zelle hervorgehoben, abbrechen
  var z = p0[i0][j0];                                      // Zahl oder undefined
  ip.value = (z != undefined ? String(z) : "");            // Default-Zeichenkette
  ip.readOnly = false;                                     // Eingabefeld zun�chst aktiviert
  if (fixed && given[i0][j0]) ip.readOnly = true;          // Falls Aufgabe fixiert und gegebene Zahl, Eingabefeld deaktivieren
  if (show) ip.readOnly = true;                            // Falls L�sung sichtbar, Eingabefeld deaktivieren
  if (step >= (n+1)*n/2) ip.readOnly = true;               // Falls Aufgabe fertig, Eingabefeld deaktivieren
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Ber�hrung:

function reactionUp () {
  if (indicesOK(i0,j0)) ip.focus();                        // Falls Zelle hervorgehoben, Cursor im Eingabefeld
  }
  
//-------------------------------------------------------------------------------------------------

// Eingabe einer ganzen Zahl:
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder undefined
// Wirkung auf das Eingabefeld
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  if (s == "") return undefined;                           // R�ckgabewert, falls leere Zeichenkette
  var n = Number(s);                                       // Eingegebene Zahl oder NaN
  if (isNaN(n)) return undefined;                          // R�ckgabewert, falls sinnlose Eingabe 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = String(n);                                    // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }

// Neue Zahlenpyramide (leer):
// n ... Gr��e (Zahl der Stockwerke bzw. Zahl der Basiszellen)
// R�ckgabewert: Zweifach indiziertes Array
// Seiteneffekt i0, j0

function newPyramid (n) {
  i0 = j0 = -1;                                            // Keine Hervorhebung
  p = new Array(n);                                        // Neues Array f�r die Stockwerke
  for (var i=0; i<n; i++) {                                // F�r alle Stockwerk-Indizes ...
    p[i] = new Array(i+1);                                 // Neues Array
    for (var j=0; j<=i; j++) p[i][j] = undefined;          // Arrayelemente undefiniert
    }
  return p;                                                // R�ckgabewert
  }
  
// Neues Array f�r Angaben zu den gegebenen Zahlen:

function newGiven (n) {
  var g = new Array(n);                                    // Neues Array
  for (var i=0; i<n; i++) {                                // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    g[i] = new Array(i+1);                                 // Neue Array-Zeile
    for (var j=0; j<=i; j++)                               // F�r alle Zellen- bzw. Spalten-Indizes ...
      g[i][j] = false;                                     // Arrayelement
    }
  return g;                                                // R�ckgabewert
  }
  
// �berpr�fung auf zul�ssige Indizes:
// i ... Stockwerk- bzw. Zeilen-Index
// j ... Zellen- bzw. Spalten-Index
  
function indicesOK (i, j) {
  if (i < 0 || i > n) return false;                        // R�ckgabewert, falls Zeilenindex unzul�ssig
  if (j < 0 || j > i) return false;                        // R�ckgabewert, falls Spaltenindex unzul�ssig
  return true;                                             // R�ckgabewert, falls beide Indizes zul�ssig
  }
  
// �berpr�fung, ob die Erg�nzung einer zuf�lligen Zahlenpyramide m�glich ist:
// i ... Stockwerk- bzw. Zeilen-Index (ab 0, von oben nach unten)
// j ... Zellen- bzw. Spalten-Index (0 bis i, von links nach rechts) 
  
function allowed (i, j) {
  if (!indicesOK(i,j)) return true;                        // R�ckgabewert, falls Indizes nicht zul�ssig
  var tL = (i > 0 && j > 0 && given[i-1][j-1]);            // Flag f�r Nachbarzelle links oben
  var tR = (i > 0 && given[i-1][j]);                       // Flag f�r Nachbarzelle rechts oben
  var le = (j > 0 && given[i][j-1]);                       // Flag f�r Nachbarzelle links
  var ri = (j < i && given[i][j+1]);                       // Flag f�r Nachbarzelle rechts
  var bL = (i < n-1 && given[i+1][j]);                     // Flag f�r Nachbarzelle links unten
  var bR = (i < n-1 && given[i+1][j+1]);                   // Flag f�r Nachbarzelle rechts unten
  if (le && tL) return false;                              // R�ckgabewert, falls Konflikt links oben
  if (ri && tR) return false;                              // R�ckgabewert, falls Konflikt rechts oben                               
  if (bL && bR) return false;                              // R�ckgabewert, falls Konflikt unten
  return true;                                             // R�ckgabewert, falls kein Konflikt
  }
  
// Zuf�llige Erg�nzung des Arrays given:
// Seiteneffekt given
  
function addGiven () {
  var g = false;                                           // Flag f�r Erfolg, Startwert
  while (!g) {                                             // Solange kein Erfolg ...
    var r = Math.random();                                 // Zufallszahl (0 bis 1)
    if (n > 3) r *= Math.random();                         // Falls gr��eres n, kleinere Zufallszahl
    var h = Math.floor(r*(n>3?n-1:n)*0.8);                 // H�he bez�glich Basis
    var i = n-1-h;                                         // Stockwerk- bzw. Zeilen-Index 
    var j = Math.floor((i+1)*Math.random());               // Zellen- bzw. Spalten-Index 
    if (given[i][j]) continue;                             // Falls Zelle schon besetzt, weiter mit anderen Indizes
    if (allowed(i,j)) g = true;                            // Falls kein Konflikt, Flag f�r Erfolg setzen
    }
  given[i][j] = true;                                      // Zahl als gegeben registrieren
  }
  
// H�here Stockwerke einer Zahlenpyramide auff�llen:
// p ... Unvollst�ndige Zahlenpyramide (unterstes Stockwerk vollst�ndig):
  
function supplement (p) {
  for (var i=n-2; i>=0; i--) {                             // F�r alle Stockwerk- bzw. Zeilen-Indizes (abw�rts) ...
    for (var j=0; j<=i; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
      if (p[i][j] == undefined)                            // Falls Zelle bisher leer ...
        p[i][j] = p[i+1][j]+p[i+1][j+1];                   // Summe von zwei Zahlen eintragen
      }
    }  
  }
  
// Zuf�llige Zahlenpyramide:
// n ... Gr��e (Zahl der Stockwerke bzw. Zahl der Basiszellen)
// Seiteneffekt given
  
function randomPyramid (n) {
  var nz = (ch3.selectedIndex == 0);                       // Flag f�r nat�rliche Zahlen
  var p = newPyramid(n);                                   // Neue Zahlenpyramide (leer)
  var i = n-1;                                             // Index f�r unterstes Stockwerk
  for (var j=0; j<=n-1; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
    if (nz) p[i][j] = 1+Math.round(9*Math.random());       // Entweder nat�rliche Zahl von 1 bis 10 ...
    else p[i][j] = Math.round(20*Math.random())-10;        // ... oder ganze Zahl von -10 bis 10
    } // Ende for (j)
  supplement(p);                                           // Zahlenpyramide vervollst�ndigen
  given = newGiven(n);                                     // Neues Array f�r Angaben zu den gegebenen Zahlen
  for (i=0; i<n; i++) addGiven();                          // Zuf�llige Erg�nzungen des Arrays given
  for (i=0; i<n; i++)                                      // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    for (j=0; j<=i; j++)                                   // F�r alle Zellen- bzw. Spalten-Indizes ...
      if (!given[i][j]) p[i][j] = undefined;               // Nicht gegebene Zahl l�schen
  return p;                                                // R�ckgabewert (Pyramide mit n besetzten Zellen)
  }
  
// Anzahl der besetzten Zellen in einem Teil einer Zahlenpyramide:
// iT ... Index des obersten Stockwerks (ab 0, von oben nach unten)
// iB ... Index des untersten Stockwerks (ab 0, von oben nach unten)
  
function number (p, iT, iB) {
  var n = 0;                                               // Startwert                      
  for (var i=iT; i<=iB; i++) {                             // F�r alle Stockwerk-Indizes ...
    for (var j=0; j<=i; j++)                               // F�r alle Zellen-Indizes ...
      if (p[i][j] != undefined) n++;                       // Falls Zelle besetzt, Anzahl erh�hen
    } // Ende for (i)
  return n;                                                // R�ckgabewert
  }
  
// Binimialkoeffizient (n �ber k):
  
function binCoeff (n, k) {
  var bc = 1;                                              // Startwert
  if (2*k < n) k = n-k;                                    // Symmetrie ausn�tzen
  for (var i=1; i<=k; i++) bc = bc*(n+1-i)/i;              // Neue Faktoren in Z�hler und Nenner ber�cksichtigen
  return bc;                                               // R�ckgabewert
  }
  
// Koeffizienten-Array f�r eine Gleichung des linearen Gleichungssystems:
// i ... Stockwerk- bzw. Zeilen-Index (ab 0, von oben nach unten)
// j ... Zellen- bzw. Spalten-Index (0 bis i, von links nach rechts)
  
function getCoefficients (i, j) {
  var a = new Array(n);                                    // Neues Array
  for (var k=0; k<j; k++) a[k] = 0;                        // Nullen links
  for (k=j; k<j+n-i; k++)                                  // F�r alle Indizes mit Koeffizienten ungleich 0 ...
    a[k] = binCoeff(n-1-i,k-j);                            // Binomialkoeffizient
  for (k=j+n-i; k<n; k++) a[k] = 0;                        // Nullen rechts
  return a;                                                // R�ckgabewert
  }
  
// Gleichung zu einer Zelle:
// p ... Zahlenpyramide (zweifach indiziertes Array)
// i ... Stockwerk- bzw. Zeilen-Index (0 bis n-2, von oben nach unten)
// j ... Zellen- bzw. Spalten-Index (0 bis i, von links nach rechts)
// R�ckgabewert: Verbund mit Koeffizienten-Array a und Zahl b; bei Misserfolg undefined
  
function getEquation (p, i, j) {
  if (p == undefined) return undefined;                    // R�ckgabewert, falls Zahlenpyramide undefiniert
  if (p[i] == undefined) return undefined;                 // R�ckgabewert, falls Matrixzeile undefiniert
  var z = p[i][j];                                         // Zahl oder undefined
  if (z == undefined) return undefined;                    // R�ckgabewert, falls Zahl undefiniert
  if (i < 0 || i >= n-1) return undefined;                 // R�ckgabewert, falls Stockwerk-Index unzul�ssig
  var dim = n-number(p,n-1,n-1);                           // Dimension des Koeffizienten-Arrays  
  var ls = new Array(dim);                                 // Neues Array f�r Koeffizienten (linke Seite)
  var rs = z;                                              // Rechte Seite der Gleichung
  var kRed = 0;                                            // Startwert reduzierter Index
  for (var k=0; k<n; k++) {                                // F�r alle Indizes ...
    var c = getCoefficients(i,j)[k];                       // Koeffizient
    if (p[n-1][k] == undefined) {                          // Falls Zelle im untersten Stockwerk leer ...
      ls[kRed] = c;                                        // Koeffizient �bernehmen
      kRed++;                                              // Reduzierten Index erh�hen
      }
    else rs -= c*p[n-1][k];                                // Sonst rechte Seite aktualisieren
    }
  return {a: ls, b: rs};                                   // R�ckgabewert
  }
  
// Gleichungssystem f�r die untersten Zellen einer Zahlenpyramide:
// p ... Zahlenpyramide (zweifach indiziertes Array)
// R�ckgabewert: Array von Gleichungen; eine Gleichung entspricht einem Verbund mit den Attributen a (Koeffizientenvektor)
// und b (inhomogener Teil).
// Zu jeder nicht leeren Zelle der Zahlenpyramide oberhalb der Basis wird eine Gleichung aufgestellt und zum System hinzugef�gt.
  
function getSystem (p) {
  var lgs = [];                                            // Leeres Array
  for (var i=0; i<n-1; i++)                                // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    for (var j=0; j<=i; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
      var e = getEquation(p,i,j);                          // Gleichung (Verbund aus Array a und Zahl b) oder undefined
      if (e != undefined) lgs.push(e);                     // Falls sinnvoll, Gleichung zum System hinzuf�gen
      }
  return lgs;                                              // R�ckgabewert (Array)
  }
  
// Unterstes Stockwerk auff�llen:
// p ... Zahlenpyramide
// x ... L�sung (Array von Zahlen)
  
function basis (p, x) {
  var k = 0;                                               // Zus�tzlicher Index
  for (var j=0; j<=n-1; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
    if (p[n-1][j] == undefined) {                          // Falls Zelle bisher leer ...
      p[n-1][j] = x[k];                                    // Zahl eintragen
      k++;                                                 // Zus�tzlichen Index erh�hen
      }
    }
  }
  
// Kopie einer Zahlenpyramide:
// p0 ... Gegebene Zahlenpyramide (zweifach indiziertes Array)
// a .... Flag (true f�r Kopie aller Elemente, false f�r Kopie der gegebenen Elemente)

function copy (p0, a) {
  var p = new Array(n);                                    // Neues Array
  for (var i=0; i<n; i++) {                                // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    p[i] = new Array(i+1);                                 // Neues Array f�r aktuelles Stockwerk
    for (var j=0; j<=n; j++)                               // F�r alle Zellen- bzw. Spalten-Indizes ...
      if (a || given[i][j]) p[i][j] = p0[i][j];            // Falls Flag gesetzt und Zahl gegeben, in die neue Pyramide �bertragen
    }
  return p;                                                // R�ckgabewert
  }
  
// Einfache Erg�nzung:
// Es wird versucht, in der Zahlenpyramide p eine Zahl mithilfe einer Summe oder Differenz benachbarter Zahlen zu erg�nzen.
// R�ckgabewert: Flag f�r Erfolg
  
function add (p) {
  var n0 = number(p,0,n-1);                                // Anzahl der besetzten Zellen
  for (var i=n-2; i>=0; i--)                               // F�r alle Stockwerk- bzw. Zeilen-Indizes (Basis ausgenommen) ...
    for (var j=0; j<=i; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
      var z = p[i][j];                                     // Obere Zahl oder undefined                  
      var z1 = p[i+1][j];                                  // Zahl links unten oder undefined
      var z2 = p[i+1][j+1];                                // Zahl rechts unten oder undefined
      var def = (z != undefined);                          // Flag f�r obere Zahl
      var def1 = (z1 != undefined);                        // Flag f�r Zahl links unten
      var def2 = (z2 != undefined);                        // Flag f�r Zahl rechts unten
      if (!def && def1 && def2) p[i][j] = z1+z2;           // Falls sinnvoll, obere Zahl erg�nzen
      if (!def1 && def && def2) p[i+1][j] = z-z2;          // Falls sinnvoll, Zahl links unten erg�nzen         
      if (!def2 && def && def1) p[i+1][j+1] = z-z1;        // Falls sinnvoll, Zahl rechts unten erg�nzen
      }
  return (number(p,0,n-1) > n0);                           // R�ckgabewert
  }
  
// Erg�nzte Zahlenpyramide (einfache Erg�nzungen):
  
function direct (p0) {
  var p = copy(p0,false);                                  // Kopie der gegebenen Elemente
  for (var i=0; i<100; i++) {                              // F�r alle Indizes ...
    var more = add(p);                                     // Einzelne Erg�nzung, Flag f�r Erfolg
    if (!more) break;                                      // Falls Misserfolg, for-Schleife abbrechen
    }
  return p;                                                // R�ckgabewert
  }
  
// Zahlenmenge:
// x ... L�sungsvektor (muss definiert sein)
// R�ckgabewert: "N", "Z" oder "Q"
  
function getNumberSet (x) {
  var n = x.length;                                        // Zahl der Unbekannten
  var s = "N";                                             // Startwert "N"
  for (var i=0; i<n; i++) {                                // F�r alle Indizes ...
    if (x[i] != Math.round(x[i])) s = "Q";                 // Falls keine ganze Zahl, neuer Wert "Q"
    if (s == "N" && x[i] < 0) s = "Z";                     // Falls negative ganze Zahl, neuer Wert "Z"
    } // Ende for (i)
  return s;                                                // R�ckgabewert
  }
  
// Determinante einer quadratischen Matrix von ganzen Zahlen:
// m ... Matrix (zweifach indiziertes Array)
// R�ckgabewert undefined, falls Matrix m nicht quadratisch
  
function determinant (m) {
  var n = m.length;                                        // Anzahl der Zeilen
  // �berpr�fung, ob die gegebene Matrix quadratisch ist:
  for (var i=0; i<n; i++) {                                // F�r alle Zeilenindizes ...
    if (m[i].length != n) {                                // Falls abweichende Zeilenl�nge ...
      alert(text21);                                       // Fehlermeldung
      return undefined;                                    // R�ckgabewert undefiniert
      }
    } // Ende for (i)  	  
  // Kopie der gegebenen Matrix:
  var a = new Array(n);                                    // Neues Array	
  for (i=0; i<n; i++) {                                    // F�r alle Zeilenindizes ...
    var ze = new Array(n);                                 // Neues Array
    for (var j=0; j<n; j++) ze[j] = m[i][j];               // F�r alle Spaltenindizes Matrixelement �bernehmen
    a[i] = ze;
    } // Ende for (i)  	
  // Berechnung:  	  		
  var d = 1;                                               // Startwert Determinante
  for (j=0; j<n; j++) {                                    // F�r alle Spaltenindizes ...
    var p = j;                                             // Variable f�r Zeilenindex
    while (p < n && a[p][j] == 0) p++;                     // Index erh�hen, bis Spaltenelement ungleich 0
    if (p == n) return 0;                                  // R�ckgabewert, falls Suche erfolglos
    if (p != j) {                                          // Falls Zeilentausch n�tig ...
      var temp = a[j];                                     // Zeile mit Index j
      a[j] = a[p];                                         // Zeile mit Index j neu
      a[p] = temp;                                         // Zeile mit Index p neu
      d = -d;                                              // Vorzeichen�nderung wegen Zeilentausch
      }
    d = d*a[j][j];                                         // Multiplikation mit Element der Hauptdiagonale
    for (i=j+1; i<n; i++) {                                // F�r alle Zeilenindizes ab j+1 ...
      var f = a[i][j]/a[j][j];                             // Faktor
      for (var k=0; k<n; k++)                              // F�r alle Spaltenindizes ...
        a[i][k] -= a[j][k]*f;                              // Subtraktion eines Vielfachen von Zeile j 
        } // Ende for (i)
      } // Ende for (j) 
    if (Math.abs(d-Math.round(d)) > 1e-10) alert(text22);  // Falls keine ganze Zahl, Fehlermeldung 	  
  	return Math.round(d);                                  // R�ckgabewert (gerundet, da Rundungsfehler m�glich)  	
    }
    
// Koeffizientenmatrix eines linearen Gleichungssystems:
// lgs ... Lineares Gleichungssystem (Array von Gleichungen); jede Gleichung entspricht einem Verbund
//         mit den Attributen a (Koeffizientenvektor) und b (inhomogener Teil).
    
function matrix (lgs) {
  if (lgs == undefined) return undefined;                  // R�ckgabewert, falls lgs undefiniert
  var n = lgs.length;                                      // Zahl der Gleichungen bzw. Zeilen
  var m = new Array(n);                                    // Neues Array
  for (var i=0; i<n; i++) {                                // F�r alle Zeilenindizes ...
    var a = lgs[i].a;                                      // Koeffizientenvektor (Array)
    var nn = a.length;                                     // Zahl der Arrayelemente
    if (nn != n) return undefined;                         // Falls falsche L�nge, R�ckgabewert undefined
    m[i] = a;                                              // Array f�r Zeile �bernehmen
    }
  return m;                                                // R�ckgabewert
  }
  
// Abge�nderte Koeffizientenmatrix f�r Cramer-Regel:
// lgs ... Lineares Gleichungssystem (Array von Gleichungen); jede Gleichung entspricht einem Verbund
//         mit den Attributen a (Koeffizientenvektor) und b (inhomogener Teil).
// j ..... Spaltenindex; die Spalte mit Index j wird durch die rechte Seite ersetzt.
  
function cramerNum (lgs, j) {
  var m = matrix(lgs);                                     // Koeffizientenmatrix
  if (m == undefined) return undefined;                    // R�ckgabewert, falls Matrix undefiniert
  var n = m.length;                                        // Anzahl der Gleichungen bzw. Zeilen
  var mm = new Array(n);                                   // Neues Array
  for (var i=0; i<n; i++) {                                // F�r alle Zeilenindizes ...
    if (m[i].length != n) return undefined;                // R�ckgabewert, falls Zeilenl�nge falsch
    var ze = new Array(n);                                 // Neues Array
    for (var k=0; k<n; k++)                                // F�r alle Spaltenindizes ...
      ze[k] = (k != j ? m[i][k] : lgs[i].b);               // Arrayelement aus Matrix oder rechter Seite
    mm[i] = ze;                                            // Array f�r Zeile als Arrayelement
    } // Ende for (i)
  return mm;                                               // R�ckgabewert
  }
  
// L�sung eines linearen Gleichungssystems mit der Cramer-Regel:
// lgs ... Lineares Gleichungssystem (Array von Gleichungen); jede Gleichung entspricht einem Verbund
//         mit den Attributen a (Koeffizientenvektor) und b (inhomogener Teil).
// R�ckgabewert: Verbund aus x (L�sungsvektor), status ("OK", "W" oder "R") und set ("N", "Z" oder "Q"), bei Misserfolg undefined
  
function cramer (lgs) {
  var m = matrix(lgs);                                     // Koeffizientenmatrix
  if (m == undefined) return undefined;                    // R�ckgabewert, falls Matrix undefiniert
  var n = m.length;                                        // Anzahl der Gleichungen bzw. Zeilen
  var denom = determinant(m);                              // Nenner (Determinante der Matrix) oder undefined
  if (denom == undefined) return undefined;                // R�ckgabewert, falls Nenner undefiniert
  var type = "OK";                                         // Startwert Status
  if (denom == 0) type = "R";                              // Falls Nenner 0, vorl�ufig Status "R"
  var x = new Array(n);                                    // Neues Array f�r L�sung
  for (var j=0; j<n; j++) {                                // F�r alle Spaltenindizes ...
    var num = determinant(cramerNum(lgs,j));               // Abge�nderte Koeffizientenmatrix oder undefined
    if (type == "R" && num != 0) type = "W";               // Falls Nenner 0 und Z�hler ungleich 0, Status "W"
    x[j] = num/denom;                                      // Wert f�r Unbekannte mit Index j oder NaN
    }
  var xx = (type == "OK" ? x : undefined);                 // L�sungsvektor oder undefined
  var nn = (type == "OK" ? getNumberSet(x) : undefined);   // Zeichenkette f�r Zahlenmenge oder undefined
  return {x: xx, status: type, set: nn};                   // R�ckgabewert
  }
  
// Vollst�ndige L�sung (Aufruf f�r step == n):
// p0 ... Gegebene Zahlenpyramide
// R�ckgabewert: Verbund mit den Attributen pyr, status und set

function solution (p0) {
  var p = copy(p0,true);                                   // Kopie der gegebenen Zahlenpyramide
  var lgs = getSystem(p);                                  // Lineares Gleichungssystem
  var cr = cramer(lgs);                                    // L�sungs-Verbund nach Cramer-Regel oder undefined
  if (cr == undefined) return undefined;                   // R�ckgabewert, falls L�sungs-Verbund undefiniert 
  if (cr.x == undefined)                                   // Falls L�sungsvektor undefiniert ...
    return {pyr: p, status: cr.status, set: cr.set};       // Unvollst�ndige Pyramide als R�ckgabewert      
  basis(p,cr.x);                                           // Unterstes Stockwerk auff�llen
  supplement(p);                                           // H�here Stockwerke auff�llen
  return {pyr: p, status: cr.status, set: cr.set};         // R�ckgabewert (Verbund)
  }
  
// Test 1 (f�r step < n, also bis zur vorletzten gegebenen Zahl):
// Es wird �berpr�ft, ob irgendwo eine Zahl von der Summe der beiden Zahlen darunter abweicht.
// p ... �berpr�fte Zahlenpyramide
// R�ckgabewert: 0 f�r fehlerlos, 1 f�r Widerspruch, 2 f�r �berfl�ssige Zahl

function test1 (p) {
  for (var i=0; i<n-1; i++)                                // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    for (var j=0; j<=i; j++) {                             // F�r alle Zellen- bzw. Spalten-Indizes ...
      var z = p[i][j];                                     // Aktuelle Zahl
      if (z == undefined) continue;                        // Falls undefiniert, weiter zum n�chsten Index
      var z1 = p[i+1][j], z2 = p[i+1][j+1];                // Zahlen links und rechts unterhalb
      if (z1 == undefined || z2 == undefined) continue;    // Falls nicht beide definiert, weiter zum n�chsten Index
      if (z1+z2 != z) return 1;                            // Falls Fehler gefunden, R�ckgabewert 1
      if (step <= n && z1+z2 == z) return 2;               // Falls in der Eingabephase Redundanz gefunden, R�ckgabewert 2
      }
  return 0;                                                // R�ckgabewert, falls kein Fehler gefunden
  } 
  
// Test 2 (f�r step == n, also f�r die letzte der gegebenen Zahlen):

function test2 (p) {
  var v = solution(p);                                     // Verbund aus L�sungsvektor, Status und Zahlenmenge oder undefined
  if (v == undefined) return undefined;                    // R�ckgabewert, falls undefiniert
  if (v.sta == "W") return 1;                              // R�ckgabewert, falls Widerspruch
  else if (v.sta == "R") return 2;                         // R�ckgabewert, falls Redundanz
  else return 0;                                           // R�ckgabewert, falls kein Fehler
  }
  
// Test 3 (f�r eine fixierte Aufgabe):
  
function test3 (p) {
  if (!indicesOK(i0,j0)) return 0;                         // Falls keine Zelle hervorgehoben, R�ckgabewert 0
  var z = p[i0][j0];                                       // Zahl in der hervorgehobenen Zelle
  if (z == undefined) return 0;                            // R�ckgabewert f�r leere Zelle
  return (z == p2[i0][j0] ? 0 : 1);                        // R�ckgabewert f�r nicht-leere Zelle 
  }
  
// Test insgesamt:
  
function test (p) {
  if (step < n) return test1(p);                           // Test f�r erste bis vorletzte gegebene Zahl                           
  else if (step == n && !fixed) return test2(p);           // Test f�r letzte gegebene Zahl
  else return test3(p);                                    // Test f�r fixierte Aufgabe
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:

function newPath (c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Grafikausgabe Zelle:
// p .... Zahlenpyramide (zweifach indiziertes Array)
// u0 ... Waagrechte Bildschirmkoordinate (Mittelpunkt der obersten Zelle, Pixel)
// v0 ... Senkrechte Bildschirmkoordinate (Mittelpunkt der obersten Zelle, Pixel)
// i .... Stockwerk- bzw. Zeilen-Index (ab 0, von oben nach unten)
// j .... Zellen- bzw. Spaltenindex (0 bis i, von links nach rechts)

function cell (p, u0, v0, i, j) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)    
  var c = (i == i0 && j == j0 ? colorEmph : colorCell);    // F�llfarbe            
  ctx.fillStyle = c;                                       // F�llfarbe festlegen
  var u = u0-(i+1)*DX/2+j*DX;                              // Waagrechte Bildschirmkoordinate (Mittelpunkt der Zelle)
  var v = v0+(i+0.5)*DY;                                   // Senkrechte Bildschirmkoordinate (Mittelpunkt der Zelle)
  ctx.rect(u-DX/2,v-DY/2,DX,DY);                           // Rechteck vorbereiten
  ctx.fill(); ctx.stroke();                                // Ausgef�lltes Rechteck mit Rand
  var z = p[i][j];                                         // Zahl oder undefined
  ctx.fillStyle = (given[i][j] ? "#ff0000" : "#000000");   // Schriftfarbe
  if (z != undefined) ctx.fillText(String(z),u,v+5);       // Falls definiert, Zahl eintragen
  }
  
// Grafikausgabe Pyramide:
// p .... Zahlenpyramide (zweifach indiziertes Array)
// u0 ... Waagrechte Bildschirmkoordinate (Mittelpunkt der obersten Zelle, Pixel)
// v0 ... Senkrechte Bildschirmkoordinate (Mittelpunkt der obersten Zelle, Pixel)
  
function pyramid (p, u0, v0) {
  ctx.textAlign = "center";                                // Textausrichtung
  for (var i=0; i<n; i++)                                  // F�r alle Stockwerk- bzw. Zeilen-Indizes ...
    for (var j=0; j<=i; j++)                               // F�r alle Zellen bzw. Spalten-Indizes ...
      cell(p,u0,v0,i,j);                                   // Zelle darstellen
  }
  
// Variablenwerte zur Fehlersuche:

function values () {
  ctx.textAlign = "left";
  ctx.fillText("step = "+step,50,340);
  ctx.fillText("fixed = "+fixed,50,360);
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  var pyr = p0;                                            // Variable f�r dargestellte Zahlenpyramide                                              
  if (show) pyr = (fixed ? p2 : p1);                       // Gegebenenfalls (Teil-)L�sungspyramide
  if (pyr != undefined) pyramid(pyr,width/2,Y0-n*DY/2);    // Zahlenpyramide (im Allgemeinen unvollst�ndig)
  //values();
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen
