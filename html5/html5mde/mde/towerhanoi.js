// Türme von Hanoi
// 01.02.2022 - 07.02.2022

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel towerhanoi_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorDisk1 = "#a0e0ff";                                // Farbe der Grundflächen
var colorDisk2 = "#e06040";                                // Farbe der Mantelflächen

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz klein
var FONT2 = "normal normal bold 16px sans-serif";          // Zeichensatz groß
var N_MAX = 10;                                            // Maximale Zahl der Scheiben
var H = 15;                                                // Höhe einer Scheibe (Pixel)
var XA = 100, XB = 270, XC = 440;                          // Waagrechte Bildschirmkoordinaten der drei Türme (Pixel)
var Y_TOP = 150, Y_BOTTOM = 300;                           // Oberes und unteres Ende der drei Türme  (Pixel)
var DR = 8;                                                // Unterschied zwischen Scheibenradien (Pixel)
var EPS = 0.5;                                             // Verhältnis der Ellipsenhalbachsen

// Attribute:

var lb1;                                                   // Texte
var ch;                                                    // Auswahlfeld
var bu1, bu2;                                              // Schaltknöpfe
var rb1, rb2;                                              // Radiobuttons
var ta;                                                    // Textbereich
var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)

var n;                                                     // Zahl der Scheiben
var a, b, c;                                               // Arrays für Scheiben der drei Türme
var tr;                                                    // Variable für aktuellen Übergang (Zeichenkette)
var list;                                                  // Array der Übergänge bei automatischer Lösung
var r;                                                     // Radius der bewegten Scheibe (Pixel)
var x1, y1;                                                // Startposition der bewegten Scheibe (Pixel)
var x2, y2;                                                // Zielposition der bewegten Scheibe (Pixel)
var xM;                                                    // Waagrechte Bildschirmkoordinate für Scheitelpunkt der Bewegung (Pixel)
var dx;                                                    // Waagrechter Abstand zwischen Start und Mitte der Bewegung (Pixel)
var nMoves;                                                // Zahl der Züge bei manueller Lösung
var ready;                                                 // Flag für vollständige Lösung
var on;                                                    // Flag für angeschaltete Animation
var timer;                                                 // Timer für Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var iMove;                                                 // Index des aktuellen Zugs (bei automatischer Lösung, ab 0)
var drag;                                                  // Flag für Zugmodus

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  n = 3;                                                   // Startwert für Zahl der Scheiben
  getElement("lb1",text01);                                // Erklärender Text (Zahl der Scheiben)
  ch = getElement("ch");                                   // Auswahlfeld (Zahl der Scheiben)
  initSelect();                                            // Auswahlfeld vorbereiten
  bu1 = getElement("bu1",text02);                          // Schaltknopf (Reset)
  rb1 = getElement("rb1");                                 // Radiobutton (Eigene Lösung)
  getElement("rb1t",text03);                               // Erklärender Text (Eigene Lösung)
  rb1.checked = true;                                      // Radiobutton ausgewählt
  rb2 = getElement("rb2");                                 // Radiobutton (Automatische Lösung)
  getElement("rb2t",text04);                               // Erklärender Text (Automatische Lösung)
  bu2 = getElement("bu2");                                 // Schaltknopf (Start/Pause/Weiter)
  bu2.disabled = true;                                     // Schaltknopf zunächst deaktiviert
  ta = getElement("ta");                                   // Textbereich für Protokoll
  ta.readOnly = true;                                      // Textbereich nur zum Lesen
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  reactionReset();                                         // Anfangszustand (Seiteneffekt)
  
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld
  bu1.onclick = reactionReset;                             // Reaktion auf Reset-Knopf
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf Start/Pause/Weiter
  rb1.onclick = reactionRadio1;                            // Reaktion auf Radiobutton (Manuelle Lösung)
  rb2.onclick = reactionRadio2;                            // Reaktion auf Radiobutton (Automatische Lösung)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung        
      
  } // Ende der Methode start
  
// Vorbereitung des Auswahlfelds:

function initSelect () {
  for (var i=2; i<=N_MAX; i++) {                           // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = ""+i;                                         // Zahl der Scheiben als Inhalt 
    ch.add(o);                                             // Element zur Liste hinzufügen
    }
  ch.selectedIndex = n-2;                                  // Index entsprechend Zahl der Schweiben
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt n, bu2, on, timer, t0, t, ready, nMoves, iMove, a, b, c, tr, list, r, x1, y1, x2, y2, xM, dx, ta.value

function reactionSelect () {
  n = ch.selectedIndex+2;                                  // Zahl der Scheiben
  reactionReset();                                         // Anfangszustand
  }
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
// st ... Gewünschter Zustand (0, 1 oder 2)
// Seiteneffekt bu2.state, Schaltknopftext
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text05[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt bu2.state, Schaltknopftext
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Pause
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
  
// Reaktion auf Resetknopf:
// Seiteneffekt bu2, on, timer, t, t0, ready, nMoves, iMove, a, b, c, tr, list, r, x1, y1, x2, y2, xM, dx, drag, ta.value
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  stopAnimation();                                         // Animation stoppen
  t = 0;                                                   // Zeitvariable zurücksetzen
  ready = false;                                           // Lösung noch nicht geschafft
  nMoves = 0;                                              // Startwert für Zahl der Züge
  initArrays();                                            // Anfangszustand (Seiteneffekt)
  initTextArea();                                          // Textbereich aktualisieren
  iMove = -1;                                              // Nummer des bisher letzten Zuges (bei automatischer Lösung)
  drag = false;                                            // Zugmodus ausgeschaltet
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2, on, timer, t0

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  if (bu2.state == 1) startAnimation();                    // Entweder Animation starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder stoppen
  }
  
// Reaktion auf den oberen Radiobutton (Manuelle Lösung):
// Seiteneffekt list, bu2, on, timer, t0, t, ready, nMoves, iMove, a, b, c, tr, list, r, x1, y1, x2, y2, xM, dx, drag, ta.value

function reactionRadio1 () {
  list = [];                                               // Liste der Züge leer
  reactionReset();                                         // Variable zurücksetzen
  bu2.disabled = true;                                     // Schaltknopf Start/Pause/Weiter deaktivieren
  }
  
// Reaktion auf den unteren Radiobutton (Automatische Lösung):
// Seiteneffekt list, bu2, on, timer, t0, t, ready, nMoves, iMove, a, b, c, tr, list, r, x1, y1, x2, y2, xM, dx, drag, ta.value

function reactionRadio2 () {  
  list = hanoi(n,"A","B","C");                             // Liste der Züge (rekursiv berechnet)
  reactionReset();                                         // Variable zurücksetzen
  bu2.disabled = false;                                    // Schaltknopf Start/Pause/Weiter aktivieren
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl eines Turms)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl eines Turms)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {         
  reactionUp(e.clientX,e.clientY);                         // Hilfsroutine aufrufen                                 
  }
  
// Reaktion auf Ende der Berührung:
  
function reactionTouchEnd (e) {   
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte  
  reactionUp(obj.clientX,obj.clientY);                     // Hilfsroutine aufrufen      
  }
  
// Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// Seiteneffekt tr; am Ende hat tr einen der Werte "", "A", "B", "C".

function reactionDown (u, v) {
  if (rb2.checked) return;                                 // Falls automatische Lösung, abbrechen
  if (ready) return;                                       // Falls eigene Lösung fertig, abbrechen
  if (tr != "" && t <= 3) return;                          // Falls Zug noch nicht zu Ende, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  if (Math.abs(u-XA) < 50 && a.length > 0) tr = "A";       // Linker Turm ausgewählt
  else if (Math.abs(u-XB) < 50 && b.length > 0) tr = "B";  // Mittlerer Turm ausgewählt
  else if (Math.abs(u-XC) < 50 && c.length > 0) tr = "C";  // Rechter Turm ausgewählt
  else tr = "";                                            // Kein Turm ausgewählt
  drag = true;                                             // Zugmodus aktiviert
  }
  
// Hilfsroutine: Radius der obersten Scheibe eines Turms (Pixel)
// t ... Array des Turms (a, b oder c)

function radius (t) {
  return t[t.length-1];                                    // Rückgabewert
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Berührung:
// Seiteneffekt tr, ta.value, nMoves, r, x1, y1, x2, y2, xM, dx, on, timer, t0
// Am Ende hat tr einen der Werte "", "AB", "AC", "BA", "BC", "CA", "CB".
  
function reactionUp (u, v) {
  if (rb2.checked) return;                                 // Falls automatische Lösung, abbrechen
  if (a.length+b.length+c.length < n) return;              // Falls Scheibe in Bewegung, abbrechen
  drag = false;                                            // Zugmodus deaktiviert
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche  
  if (Math.abs(u-XA) < 50) {                               // Falls linker Turm ...
    if (tr == "" || tr == "A") tr = "";                    // Entweder kein sinnvoller Übergang ...
    else tr += "A";                                        // ... oder linker Turm als Ziel
    }
  else if (Math.abs(u-XB) < 50) {                          // Falls mittlerer Turm ...
    if (tr == "" || tr == "B") tr = "";                    // Entweder kein sinnvoller Übergang ...
    else tr += "B";                                        // ... oder mittlerer Trum als Ziel
    }
  else if (Math.abs(u-XC) < 50) {                          // Falls rechter Turm ...
    if (tr == "" || tr == "C") tr = "";                    // Entweder kein sinnvoller Übergang ...
    else tr += "C";                                        // ... oder rechter Turm als Ziel
    }
  else tr = "";                                            // Ziel nicht fesetgelegt
  if (tr == "AB" && radius(a) > radius(b)) tr = "";        // Regelwidrigen Zug von A nach B verhindern
  if (tr == "AC" && radius(a) > radius(c)) tr = "";        // Regelwidrigen Zug von A nach C verhindern
  if (tr == "BA" && radius(b) > radius(a)) tr = "";        // Regelwidrigen Zug von B nach A verhindern
  if (tr == "BC" && radius(b) > radius(c)) tr = "";        // Regelwidrigen Zug von B nach C verhindern
  if (tr == "CA" && radius(c) > radius(a)) tr = "";        // Regelwidrigen Zug von C nach A verhindern
  if (tr == "CB" && radius(c) > radius(b)) tr = "";        // Regelwidrigen Zug von C nach B verhindern
  if (tr != "") {                                          // Falls Zug regelgemäß ...
    ta.value += lineText(nMoves,tr);                       // Beschreibung des Zugs im Textbereich hinzufügen
    nMoves++;                                              // Zahl der Züge erhöhen                                    
    beginTransition();                                     // Bewegung einer Scheibe vorbereiten (Seiteneffekt)
    startAnimation();                                      // Animation starten (Seiteneffekt)
    }
  }
  
// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, t0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Bezugszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  if (timer) clearInterval(timer);                         // Timer deaktivieren
  }
   
//-------------------------------------------------------------------------------------------------

// Initialisierung der Arrays:
// Seiteneffekt a, b, c, tr, list

function initArrays () {
  a = []; b = []; c = [];                                  // Leere Arrays für Scheiben der drei Türme
  for (var i=1; i<=n; i++) a.push((n+1-i)*DR);             // Array für linken Turm
  tr = "";                                                 // Kein aktueller Übergang
  list = hanoi(n,"A","B","C");                             // Liste der Übergänge für automatische Lösung
  }
  
// Hilfsroutine: Wegnahme der obersten Scheibe von einem Turm
// ch ... Buchstabe des Turms 
// Seiteneffekt a, b, c

function take (ch) {
  if (ch == "A") return a.pop();                           // Scheibe vom linken Turm wegnehmen
  if (ch == "B") return b.pop();                           // Scheibe vom mittleren Turm wegnehmen
  if (ch == "C") return c.pop();                           // Scheibe vom rechten Turm wegnehmen
  }
  
// Hilfsroutine: Waagrechte Bildschirmkoordinate eines Turms (Pixel)
// ch ... Buchstabe des Turms

function positionX (ch) {
  if (ch == "A") return XA;                                // Linker Turm
  if (ch == "B") return XB;                                // Mittlerer Turm
  if (ch == "C") return XC;                                // Rechter Turm
  }
  
// Hilfsroutine: Senkrechte Bildschirmkoordinate für einen Turm (Oberseite der obersten Scheibe, Pixel)
// ch ... Buchstabe des Turms
  
function positionY (ch) {
  if (ch == "A") return Y_BOTTOM-a.length*H;               // Linker Turm
  if (ch == "B") return Y_BOTTOM-b.length*H;               // Mittlerer Turm
  if (ch == "C") return Y_BOTTOM-c.length*H;               // Rechter Turm
  }
  
// Anfang der Bewegung:
// Seiteneffekt a, b, c, r, x1, y1, x2, y2, xM, dx
  
function beginTransition () {
  var ch1 = tr.substring(0,1);                             // Buchstabe für Start
  r = take(ch1);                                           // Scheibe wegnehmen, Radius (Pixel)
  x1 = positionX(ch1);                                     // Waagrechte Bildschirmkoordinate für Start (Pixel)
  y1 = positionY(ch1);                                     // Senkrechte Bildschirmkoordinate für Start (Pixel)
  var ch2 = tr.substring(1,2);                             // Buchstabe für Ziel
  x2 = positionX(ch2);                                     // Waagrechte Bildschirmkoordinate für Ziel (Pixel)
  y2 = positionY(ch2);                                     // Senkrechte Bildschirmkoordinate für Ziel (Pixel)
  xM = (x1+x2)/2;                                          // Waagrechte Bildschirmkoordinate für Scheitelpunkt (Pixel)
  dx = Math.abs(x1-xM);                                    // Abstand zwischen Start und Mitte (Pixel)
  if (x1 > x2) dx = -dx;                                   // Falls Bewegung nach links, Vorzeichenumkehr
  }
  
// Ende der Bewegung einer Scheibe:
// Seiteneffekt on, timer, t, a, b, c, tr, ready

function endTransition () {
  if (rb1.checked) {                                       // Falls manuelle Lösung ...
    stopAnimation();                                       // Animation beenden
    t = 0;                                                 // Zeitvariable zurücksetzen
    }
  if (tr.endsWith("A")) a.push(r);                         // Bewegte Scheibe entweder auf dem linken Turm ...
  else if (tr.endsWith("B")) b.push(r);                    // ... oder auf dem mittleren Turm ...
  else if (tr.endsWith("C")) c.push(r);                    // ... oder auf dem rechten Turm ablegen
  tr = "";                                                 // Variable für Übergang zurücksetzen
  if (b.length == n) ready = true;                         // Falls Aufgabe gelöst, Flag setzen
  }
  
// Rekursive Methode zur automatischen Lösung:
// n .... Zahl der beteiligten Scheiben
// t1 ... Buchstabe für Start-Turm
// t2 ... Buchstabe für Ziel-Turm
// h .... Buchstabe für Zwischenablage
// Rückgabewert: Array von Zeichenketten, die jeweils aus zwei Buchstaben bestehen und einen Übergang beschreiben

function hanoi (n, t1, t2, h) {
  var d = [];                                              // Leeres Array
  if (n == 1) d.push(t1+t2);                               // Falls nur eine Scheibe, Übergang zum Array hinzufügen
  else {                                                   // Falls mehr als eine Scheibe ...
    d = d.concat(hanoi(n-1,t1,h,t2));                      // Obere Scheiben von t1 nach h (t2 als Zwischenablage)
    d.push(t1+t2);                                         // Unterste Scheibe von t1 nach t2
    d = d.concat(hanoi(n-1,h,t2,t1));                      // Obere Scheiben von h nach t2 (t1 als Zwischenablage)
    }
  return d;                                                // Rückgabewert
  }
  
// Hilfsroutine: Zeile für Textbereich
// i ... Index des Zugs (ab 0 gezählt)
// t ... Zeichenkette aus 2 Buchstaben zur Beschreibung des Übergangs

function lineText (i, t) {
  var s = text06+" "+(i+1)+":   ";                         // Zug Nummer ...
  s += t.substring(0,1)+" \u2192 "+t.substring(1)+"\n";    // Beschreibung des Übergangs (Pfeilschreibweise), neue Zeile
  return s;                                                // Rückgabewert
  }
  
// Initialisierung des Textbereichs:
// Seiteneffekt ta.value
  
function initTextArea () {
  if (rb1.checked) {ta.value = ""; return;}                // Falls manuelle Lösung, Textbereich leer
  var s = "";                                              // Zeichenkette, zunächst leer
  for (var i=0; i<list.length; i++)                        // Für alle Indizes ...
    s += lineText(i,list[i]);                              // Zeile hinzufügen
  ta.value = s;                                            // Textbereich aktualisieren
  }

//-------------------------------------------------------------------------------------------------
 
// Neuer Grafikpfad (Standardwerte):

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)

function line (x1, y1, x2, y2, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Einzelne Scheibe:
// (x,y) ... Mittelpunkt der unteren Grundfläche (Pixel)
// r ....... Radius (Pixel)
// Füllfarbe und Randfarbe müssen zuvor festgelegt werden.

function disk (x, y, r) {
  if (r <= 0) return;                                      // Radius muss positiv sein
  var ha = r*EPS;                                          // Kleine Halbachse der Ellipsen (Pixel)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(x,y);                                      // Mittelpunkt der unteren Grundfläche als Ursprung
  ctx.scale(r,ha);                                         // Skalierung entsprechend den Halbachsen
  ctx.arc(0,0,1,0,Math.PI,false);                          // Unterer Halbkreis (wird zu unterer Halbellipse)
  ctx.restore();                                           // Ursprünglichen Grafikkontext wiederherstellen
  ctx.moveTo(x-r,y);                                       // Punkt links unten
  ctx.lineTo(x-r,y-H);                                     // Linie nach links oben
  ctx.lineTo(x+r,y-H);                                     // Linie nach rechts oben
  ctx.lineTo(x+r,y);                                       // Linie nach rechts unten
  ctx.fillStyle = colorDisk2;                              // Farbe für Mantelfläche
  ctx.fill(); ctx.stroke();                                // Ausgefüllte Fläche mit schwarzem Rand
  ctx.save();                                              // Grafikkontext speichern
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(x,y-H);                                    // Mittelpunkt der oberen Grundfläche als Ursprung
  ctx.scale(r,ha);                                         // Skalierung entsprechend den Halbachsen
  ctx.arc(0,0,1,0,2*Math.PI,false);                        // Vollständiger Kreis (wird zu Ellipse)
  ctx.restore();                                           // Ursprünglichen Grafikkontext wiederherstellen
  ctx.fillStyle = colorDisk1;                              // Farbe für Grundflächen
  ctx.fill(); ctx.stroke();                                // Ausgefüllte Fläche mit schwarzem Rand

  }
  
// Einzelner Turm:
// x .... Waagrechte Bildschirmkoordinate (Pixel)
// d .... Array der Scheiben
// ch ... Buchstabe
  
function tower (x, d, ch) {
  line(x,Y_TOP,x,Y_BOTTOM);                                // Achse
  for (var i=0; i<d.length; i++)                           // Für alle Indizes ...                        
    disk(x,Y_BOTTOM-i*H,d[i]);                             // Scheibe zeichnen
  line(x,Y_BOTTOM-d.length*H,x,Y_TOP);                     // Oberer Teil des Dorns
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText(ch,x,height-30);                            // Buchstabe
  }
  
// Bewegte Scheibe:
// t ... Zeit (s, Maximum 3)
  
function singleDisk (t) {
  if (t > 3) t = 3;                                        // Zu großen Wert der Zeit verhindern
  var x = x1, y = y1;                                      // Startposition übernehmen (Pixel)
  if (t < 1) y = y1+t*(Y_TOP-y1);                          // Position für die erste Sekunde (Aufwärtsbewegung Startturm)
  else if (t < 2) {                                        // Falls zweite Sekunde ...
    var w = (t-1)*Math.PI;                                 // Winkel (Bogenmaß) für Position auf Halbellipse
    x = xM-dx*Math.cos(w);                                 // Waagrechte Bildschirmkoordinate für Punkt auf Halbellipse
    y = Y_TOP-50*Math.sin(w);                              // Senkrechte Bildschirmkoordinate für Punkt auf Halbellipse
    }
  else if (t < 3) {                                        // Falls dritte Sekunde (Abwärtsbewegung Zielturm) ...
    x = x2;                                                // Waagrechte Bildschirmkoordinate (Pixel)
    y = Y_TOP+(t-2)*(y2-Y_TOP);                            // Senkrechte Bildschirmkoordinate (Pixel)
    }
  ctx.fillStyle = "#ff0000";                               // Füllfarbe
  disk(x,y,r);                                             // Scheibe zeichnen
  if ((t < 1 || t > 2) && y-H > Y_TOP)                     // Falls nötig ...
    line(x,y-H,x,Y_TOP);                                   // Obersten Teil des Dorns nachzeichnen
  }
  
// Grafikausgabe:
// Seiteneffekt t, t0, on, timer, a, b, c, tr, ready, r, x1, y1, x2, y2, xM, dx, iMove
  
function paint () {
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  tower(XA,a,"A");                                         // Linker Turm
  tower(XB,b,"B");                                         // Mittlerer Turm
  tower(XC,c,"C");                                         // Rechter Turm  
  if (rb1.checked) {                                       // Falls manuelle Lösung ...
    if (t > 3) {                                           // Falls 3 Sekunden überschritten ...
      endTransition();                                     // Ende des Übergangs
      paint();                                             // Neu zeichnen
      }
    if (on) singleDisk(t);                                 // Bewegte Scheibe
    }    
  else {                                                   // Falls automatische Lösung ...    
    var i = Math.floor(t/3);                               // Index für Array list (gleich iMove oder um 1 größer)
    if (i > iMove) {                                       // Falls Index größer als bisher ...
      if (i > 0) endTransition();                          // Vorherigen Zug abschließen
      if (i >= list.length) {                              // Falls Index zu groß ...
        tr = "";                                           // Zeichenkette für Übergang leer 
        endTransition();                                   // Letzten Zug abschließen
        stopAnimation();                                   // Animation beenden 
        ready = true;                                      // Flag für vollständige Lösung setzen
        tower(XB,b,"B");                                   // Mittleren Turm mit neuer Scheibe zeichnen
        }
      else tr = list[i];                                   // Falls Index sinnvoll, Beschreibung des Übergangs übernehmen
      beginTransition();                                   // Neuen Zug vorbereiten
      iMove = i;                                           // Index speichern
      }
    if (on) singleDisk(t-i*3);                             // Falls Animation läuft, bewegte Scheibe zeichnen
    }
  if (rb1.checked && b.length == n) {                      // Falls eigene Lösung gelungen ...
    ctx.font = FONT2;                                      // Zeichensatz
    ctx.textAlign = "center";                              // Textausrichtung
    ctx.fillText(text07,width/2,50);                       // Gratulation, obere Zeile
    ctx.fillText(text08,width/2,70);                       // Gratulation, untere Zeile
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


