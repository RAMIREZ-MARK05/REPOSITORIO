// 15-Puzzle
// 18.07.2023 - 24.07.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel puzzle15_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorBorder = "#000000";                               // Farbe f�r den Rand
var color0 = "#000000";                                    // Farbe f�r leeres Feld
var color1 = "#ff8080";                                    // Farbe f�r Kacheln 1, 3, 6, 8, 9, 11, 14
var color2 = "#ffffff";                                    // Farbe f�r Kacheln 2, 4, 5, 7, 10, 12, 13, 15
var colorArrow = "#0000ff";

// Konstanten:

var R = 5;                                                 // Breite des Rands (Pixel)
var S = 80;                                                // Seitenl�nge eines Feldes (Pixel)
var FONT1 = "normal normal bold 12px sans-serif";          // Zeichensatz normal
var FONT2 = "normal normal bold 36px sans-serif";          // Zeichensatz gro�

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var bu1, bu2;                                              // Schaltkn�pfe
var lb1, lb2, lb3;                                         // Ausgabefelder
var button;                                                // Nummer des Schaltknopfs (1 oder 2)
var nr;                                                    // Nummer f�r aktives Feld (1 bis 15 oder 0)
var drag;                                                  // Flag f�r Zugmodus
var uLeft;                                                 // Abstand vom linken Rand (Pixel)
var vTop;                                                  // Abstand vom oberen Rand (Pixel)
var q;                                                     // Zweifach indiziertes Array (Stellung) 
var u0, v0;                                                // Position des Mauszeigers (Pixel)
var i0, j0;                                                // Zeilen- und Spaltenindex der bewegten Kachel
var du, dv;                                                // Verschiebung (Pixel)
var dir;                                                   // Richtung (0 bis 3 oder undefined)
var steps;                                                 // Zahl der Z�ge

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  } 
  
// Ausgabe (Schaltfl�che):
// n ... Vorgegebener Wert f�r die Anzahl der Z�ge
  
function output (n) {
  if (n != undefined) steps = n;                           // Falls definiert, Anzahl der Z�ge �bernehmen
  lb1.innerHTML = text03+" &nbsp; &nbsp; "+steps;          // Ausgabe der Anzahl der Z�ge
  var c = (button == 2 && steps > 0 && isReady());         // Bedingung f�r Erfolgsmeldung
  lb2.innerHTML = (c ? text04[0] : "");                    // Erfolgsmeldung, erste Zeile
  lb3.innerHTML = (c ? text04[1] : "");                    // Erfolgsmeldung, zweite Zeile
  }
  
// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Anfangsstellung)
  bu2 = getElement("bu2",text02);                          // Schaltknopf (Zuf�llige Stellung)  
  lb1 = getElement("lb1");                                 // Ausgabefeld (1. Zeile)
  lb2 = getElement("lb2");                                 // Ausgabefeld (2. Zeile)
  lb3 = getElement("lb3");                                 // Ausgabefeld (3. Zeile)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  button = 1;                                              // Nummer des oberen Schaltknopfs
  drag = false;                                            // Zugmodus deaktiviert
  reset();                                                 // Zur�cksetzen
  output();                                                // Ausgabe
  paint();                                                 // Zeichnen
  
  bu1.onclick = reactionButton1;                           // Reaktion auf den ersten Schaltknopf (Anfangsstellung)
  bu2.onclick = reactionButton2;                           // Reaktion auf den zweiten Schaltknopf (Zuf�llige Stellung)

  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
    
  } // Ende der Methode start
  
// Zur�cksetzen:
// Seiteneffekt q, nr, du, dv, dir, steps
  
function reset () {
  q = [[1, 2, 3, 4], [5, 6, 7, 8],                         // Ausgangsstellung
       [9, 10, 11, 12], [13, 14, 15, 0]];
  nr = 0;                                                  // Keine Kachel in Bewegung
  du = dv = 0;                                             // Keine Verschiebung
  dir = undefined;                                         // Bewegungsrichtung undefiniert
  steps = 0;                                               // Noch kein Zug erfolgt
  }
  
// Reaktion auf den ersten Schaltknopf (Ausgangsstellung):
// Seiteneffekt button, q, nr, du, dv, dir, steps
  
function reactionButton1 () {
  button = 1;                                              // Nummer des Schaltknopfs
  reset();                                                 // Ausgangsstellung
  output();                                                // Ausgabe
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf den zweiten Schaltknopf (Zuf�llige Stellung):
// Seiteneffekt button, q, nr, du, dv, dir, steps
  
function reactionButton2 () {
  button = 2;                                              // Nummer des Schaltknopfs
  reset();                                                 // Ausgangsstellung
  var d0 = undefined;                                      // Bisherige Richtung undefiniert
  var n = 70+Math.floor(30*Math.random());                 // Anzahl der zuf�lligen Z�ge
  for (var i=0; i<n; i++)                                  // F�r alle Indizes ...
    d0 = randomMove(d0);                                   // Zuf�lliger Zug, neue Richtung
  output(0);                                               // Zahl der Z�ge gleich 0, Ausgabe 
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
  reactionUp(e.clientX,e.clientY);                         // Hilfsroutine aufrufen
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  reactionUp(e.clientX,e.clientY);                         // Hilfsroutine aufrufen
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
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag, i0, j0, nr, dir, u0, v0

function reactionDown (x, y) {
  if (button == 2 && isReady()) return;                    // Falls Spiel beendet, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  var a = indices(x,y);                                    // Array aus Zeilen- und Spaltenindex oder undefined
  if (a == undefined) return;                              // Falls Indizes undefiniert, abbrechen
  if (du*du+dv*dv > 0 && (a[0] != i0 || a[1] != j0))       // Falls ver�nderter Index w�hrend Bewegung ...
    return;                                                // Abbrechen
  drag = true;                                             // Zugmodus aktiviert
  i0 = a[0]; j0 = a[1];                                    // Zeilen- und Spaltenindex �bernehmen  
  nr = q[i0][j0];                                          // Zahl auf der angeklickten Kachel
  dir = undefined;                                         // Bewegungsrichtung noch undefiniert
  if (j0 < 3 && q[i0][j0+1] == 0) dir = 0;                 // Falls rechts leeres Feld, Bewegung nach rechts
  else if (i0 > 0 && q[i0-1][j0] == 0) dir = 1;            // Falls oben leeres Feld, Bewegung nach oben
  else if (j0 > 0 && q[i0][j0-1] == 0) dir = 2;            // Falls links leeres Feld, Bewegung nach links
  else if (i0 < 3 && q[i0+1][j0] == 0) dir = 3;            // Falls unten leeres Feld, Bewegung nach unten 
  u0 = x; v0 = y;                                          // Position des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  } 

// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt du, dv, u0, v0 

function reactionMove (x, y) {
  if (nr == undefined) return;                             // Falls kein Objekt ausgew�hlt, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (dir == 0) {                                          // Falls Bewegung nach rechts ...
    du += (x-u0);                                          // Verschiebung du aktualisieren
    if (du < 0) du = 0;                                    // Verschiebung nach links ignorieren
    if (du > S) du = S;                                    // Zu gro�e Verschiebung nach rechts ignorieren
    }
  if (dir == 1) {                                          // Falls Bewegung nach oben ...
    dv += (y-v0);                                          // Verschiebung dv aktualisieren
    if (dv > 0) dv = 0;                                    // Verschiebung nach unten ignorieren
    if (dv < -S) dv = -S;                                  // Zu gro�e Verschiebung nach oben ignorieren
    }
  if (dir == 2) {                                          // Falls Bewegung nach links ...
    du += (x-u0);                                          // Verschiebung du aktualisieren
    if (du > 0) du = 0;                                    // Verschiebung nach rechts ignorieren
    if (du < -S) du = -S;                                  // Zu gro�e Verschiebung nach links ignorieren
    }
  if (dir == 3) {                                          // Falls Bewegung nach unten ...
    dv += (y-v0);                                          // Verschiebung dv aktualisieren
    if (dv < 0) dv = 0;                                    // Verschiebung nach oben ignorieren
    if (dv > S) dv = S;                                    // Zu gro�e Verschiebung nach unten ignorieren
    }
  u0 = x; v0 = y;                                          // Position des Mauszeigers speichern
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Loslassen der Maustaste bzw. Ende der Ber�hrung:
// Seiteneffekt u0, v0, q, dir, nr, du, dv, steps, drag
    
function reactionUp (x, y) {
  var re = canvas.getBoundingClientRect();
  x -= re.left; y -= re.top;
  u0 = x; v0 = y;                                          // Position des Mauszeigers speichern
  move(i0,j0,i0,j0+1,dir == 0 && du == S);                 // Eventuell Bewegung nach rechts abschlie�en
  move(i0,j0,i0-1,j0,dir == 1 && dv == -S);                // Eventuell Bewegung nach oben abschlie�en
  move(i0,j0,i0,j0-1,dir == 2 && du == -S);                // Eventuell Bewegung nach links abschlie�en
  move(i0,j0,i0+1,j0,dir == 3 && dv == S);                 // Eventuell Bewegung nach unten abschlie�en
  drag = false;                                            // Flag f�r Zugmodus l�schen
  output();                                                // Ausgabe
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Hilfsroutine: Zeilen- und Spaltenindex einer Kachel
// (x,y) ... Position (Pixel)
// R�ckgabewert: Array der L�nge 2 oder undefined
// Falls die Kachel gerade bewegt wird, beziehen sich die Indizes auf die Position vor der Bewegung.
// Falls sich an der Position (x,y) keine Kachel befindet, ist der R�ckgabewert undefiniert.

function indices (x, y) {
  if (dir != undefined) {                                  // Falls eine Kachel bewegt wird ...                       
    var uM = uLeft+(j0+0.5)*S+du;                          // Waagrechte Bildschirmkoordinate der bewegten Kachel (Mittelpunkt)
    var vM = vTop+(i0+0.5)*S+dv;                           // Senkrechte Bildschirmkoordinate der bewegten Kachel (Mittelpunkt)
    if (Math.abs(x-uM) < S/2 && Math.abs(y-vM) < S/2)      // Falls Position innerhalb der bewegten Kachel ...
      return [i0,j0];                                      // R�ckgabewert
    }
  var j = Math.floor((x-uLeft)/S);                         // Berechneter Spaltenindex
  var i = Math.floor((y-vTop)/S);                          // Berechneter Zeilenindex
  if (i < 0 || i >= 4 || j < 0 || j >= 4)                  // Falls Index au�erhalb des zul�ssigen Bereichs ...
    return undefined;                                      // R�ckgabewert undefiniert
  if (i == i0 && j == j0) return undefined;                // Falls Startposition der bewegten Kachel, R�ckgabewert undefiniert
  if (q[i][j] == 0) return undefined;                      // Falls Position im leeren Feld, R�ckgabewert undefiniert
  return [i,j];                                            // R�ckgabewert (Normalfall)
  }
  
// Hilfsroutine: Bewegung auf ein Nachbarfeld
// i .... Zeilenindex Startposition
// j .... Spaltenindex Startposition
// i1 ... Zeilenindex Zielposition
// j1 ... Spaltenindex Zielposition
// c .... Einschr�nkende Bedingung
// Seiteneffekt q, dir, du, dv, steps
  
function move (i, j, i1, j1, c) {
  if (!c) return;                                          // Falls Bedingung nicht erf�llt, abbrechen
  q[i1][j1] = q[i][j];                                     // �nderung Zielposition (Nummer �bernehmen)
  q[i][j] = 0;                                             // �nderung Startposition (leeres Feld statt Kachel)
  dir = undefined;                                         // Bewegungsrichtung undefiniert
  du = dv = 0;                                             // Keine Verschiebung mehr
  steps++;                                                 // Zahl der Z�ge erh�hen
  } 
  
// Position des leeren Feldes:
// Voraussetzung: Im 4x4-Array q muss genau ein Element den Wert 0 haben.
// R�ckgabewert: Array der L�nge 2, bestehend aus Zeilen- und Spaltenindex
  
function emptyPosition () {
  var i = 0, j = 0;                                        // Startwerte f�r Zeilen- und Spaltenindex
  while (q[i][j] != 0 && i < 4) {                          // Solange Kachel vorhanden und Zeilenindex sinnvoll ...
    j++;                                                   // Spaltenindex erh�hen
    if (j == 4) {i++; j = 0;}                              // Falls Spaltenindex zu gro�, Zeilenindex erh�hen und Spaltenindex zur�cksetzen
    }
  return [i,j];                                            // R�ckgabewert
  }
  
// Liste der m�glichen Richtungen:
// i ... Zeilenindex des leeren Feldes
// j ... Spaltenindex des leeren Feldes
// R�ckgabewert: Liste mit Richtungsnummern (0 bis 3)

function listDirections (i, j) {
  var a = [];                                              // Leere Liste
  if (j > 0) a.push(0);                                    // Falls links Kachel, Bewegung nach rechts m�glich
  if (i < 3) a.push(1);                                    // Falls unten Kachel, Bewegung nach oben m�glich
  if (j < 3) a.push(2);                                    // Falls rechts Kachel, Bewegung nach links m�glich
  if (i > 0) a.push(3);                                    // Falls oben Kachel, Bewegung nach unten m�glich
  return a;                                                // R�ckgabewert
  }
  
// Zuf�lliger Zug:
// Dabei wird vermieden, dass der letzte Zug den letzten r�ckg�ngig macht.
// d0 ... Bisherige Richtung (0 bis 3 oder undefined)
// R�ckgabewert: Neue Richtung (0 bis 3)
// Seiteneffekt q, dir, du, dv, steps
  
function randomMove (d0) {
  var e = emptyPosition();                                 // Position des leeren Feldes
  var i = e[0], j = e[1];                                  // Zeilen- und Spaltenindex �bernehmen
  var a = listDirections(i,j);                             // Liste der m�glichen Richtungen 
  do {                                                     // Wiederhole mindestens einmal ...                      
    var z = Math.floor(a.length*Math.random());            // Zuf�lliger Index f�r Array a
    var d = a[z];                                          // Zuf�llige Richtung (0 bis 3)
    if (d0 != undefined && Math.abs(d-d0) == 2) continue;  // Falls Hin- und Herbewegung, nochmal versuchen
    move(i,j-1,i,j,d == 0);                                // Linke Kachel r�ckt nach
    move(i+1,j,i,j,d == 1);                                // Untere Kachel r�ckt nach 
    move(i,j+1,i,j,d == 2);                                // Rechte Kachel r�ckt nach
    move(i-1,j,i,j,d == 3);                                // Obere Kachel r�ckt nach
    }
  while (false);                                           // Wiederholung beenden
  return d;                                                // R�ckgabewert 
  }
  
// �berpr�fung, ob Ausgangsstellung erreicht:

function isReady () {
  if (du != 0 || dv != 0) return false;                    // R�ckgabewert, falls Bewegung noch nicht abgeschlossen
  for (var i=0; i<4; i++)                                  // F�r alle Zeilenindizes ...
    for (var j=0; j<4; j++) {                              // F�r alle Spaltenindizes ...
      if (i == 3 && j == 3) return true;                   // R�ckgabewert, wenn alle Kacheln �berpr�ft
      if (q[i][j] != 4*i+j+1) return false;                // R�ckgabewert, falls Abweichung gefunden
      } 
  }

//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)

function newPath(c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Farbe einer Kachel oder eines leeren Feldes:
// n ... Zahl (1 bis 15, 0 f�r leeres Feld)
  
function color (n) {
  if (n == 0) return color0;                               // R�ckgabewert, falls leeres Feld
  var i = Math.floor((n-1)/4);                             // Zeilenindex (Ausgangsstellung)
  var j = (n-1)%4;                                         // Spaltenindex (Ausgangsstellung)
  var c = (i%2 == 0 && j%2 == 0 || i%2 == 1 && j%2 == 1);  // Flag f�r Farbe 1
  return (c ? color1 : color2);                            // R�ckgabewert, falls Kachel
  }
  
// Kachel oder leeres Feld zeichnen:
// i ... Zeilenindex (0 bis 3)
// j ... Spaltenindex (0 bis 3)
// n ... Zahl (f�r leeres Feld 0)

function drawTile (i, j, n) {
  var u = uLeft+j*S, v = vTop+i*S;                         // Bildschirmkoordinate (Pixel)
  if (n == nr && dir != undefined) {u += du; v += dv;}     // Eventuell Verschiebung ber�cksichtigen                                   
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = color(n);                                // F�llfarbe
  ctx.fillRect(u,v,S,S);                                   // Quadrat ausf�llen
  ctx.strokeRect(u,v,S,S);                                 // Rand zeichnen
  ctx.font = FONT2;                                        // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  if (n > 0) ctx.fillText(String(n),u+S/2,v+S/2+12);       // Beschriftung (Zahl)  
  }
   
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  uLeft = (width-4*S)/2;                                   // Abstand vom linken Rand
  vTop = (height-4*S)/2;                                   // Abstand vom oberen Rand
  for (var i=0; i<4; i++)                                  // F�r alle Zeilenindizes ...
    for (var j=0; j<4; j++) {                              // F�r alle Spaltenindizes ...
      if (dir != undefined && i == i0 && j == j0)          // Falls Kachel in Bewegung ... 
        drawTile(i,j,0);                                   // Leeres Feld zeichnen (Startposition)
      else drawTile(i,j,q[i][j]);                          // Unbewegte Kachel oder leeres Feld zeichnen
      }
  if (dir != undefined) drawTile(i0,j0,q[i0][j0]);         // Falls n�tig, bewegte Kachel zeichnen
  var a = 4*S+2*R;                                         // Seitenl�nge Spielfeld (mit Rand)
  ctx.fillStyle = colorBorder;                             // F�llfarbe (Rand)
  ctx.fillRect(uLeft-R,vTop-R,R,a);                        // Linker Rand
  ctx.fillRect(uLeft+4*S,vTop-R,R,a);                      // Rechter Rand
  ctx.fillRect(uLeft-R,vTop-R,a,R);                        // Oberer Rand
  ctx.fillRect(uLeft-R,vTop+4*S,a,R);                      // Unterer Rand 
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen




