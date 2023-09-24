// Primyphos, Spiel zur Primfaktorzerlegung
// Java-Applet (18.10.1998) umgewandelt
// 28.10.2015 - 09.11.2015

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe 
var colorStairs = "#0000ff";                               // Farbe der Treppe
var colorBall = ["#00ffff", "#ff0000", "#ffc040", "#00ff00", "#ff00ff"];  // Farben der Kugeln
var colorCongratulation1 = "#00ff00";                      // Hintergrundfarbe f�r Gratulation
var colorCongratulation2 = "#ff0000";                      // Schriftfarbe f�r Gratulation
var colorNewGame = "#ffffff";                              // Schriftfarbe f�r Hinweis zum Neustart

// Weitere Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var PIH = Math.PI/2;                                       // Rechter Winkel                                                             
var h0 = 320;                                              // y-Koordinate Beginn der Treppenstufen
var w0 = 200;                                              // x-Koordinate Beginn der Treppenstufen
var w1 = 30;                                               // Breite und H�he einer Treppenstufe
var primeFactors = [2,2,2,2,2,3,3,3,5,5,7,11,13,17,19];    // Einfache Primfaktoren 

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var opText, opNumber;                                      // Ausgabefelder (Zerlegungsanweisung, Zahl)
var ip1, ip2;                                              // Eingabefelder (erster und zweiter Faktor)
var ball;                                                  // Array f�r Eigenschaften der Kugeln
var input;                                                 // Zustand der Eingabe (0, 1 oder 2)

var number;                                                // Zu zerlegende Zahl
var factor1, factor2;                                      // Eingegebene Faktoren
var i0;                                                    // Aktueller Index im Array ball
var j0;                                                    // Aktueller Index in den Arrays factor und level

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
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen der Zeichenfl�che (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  opText = getElement("text");                             // Anweisung (Zerlegung in zwei Faktoren)
  opNumber = getElement("number");                         // Ausgabefeld (gegebene Zahl)
  ip1 = getElement("ip1");                                 // Eingabefeld (1. Faktor)
  getElement("mult",symbolMultiply);                       // Multiplikationszeichen
  ip2 = document.getElementById("ip2");                    // Eingabefeld (2. Faktor)
  getElement("author",author);                             // Autor
  
  ball = new Array(5);                                     // Array f�r Daten der Kugeln    
  newProblem();                                            // Neue Aufgabe  
  paint();                                                 // Neu zeichnen

  ip1.onkeydown = reactionEnter;                           // Reaktion auf Eingabefeld f�r ersten Faktor
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Eingabefeld f�r zweiten Faktor
  
  canvas.onmouseup = reactionUp;                           // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionUp;                          // Reaktion auf Ende der Ber�hrung
  
  canvas.onmousedown = function (e) {                      // Reaktion auf Dr�cken der Maustaste
    reactionDown(e.clientX,e.clientY);           
    }
    
  canvas.ontouchstart = function (e) {                     // Reaktion auf Ber�hrung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);     
    }

  } // Ende der Startmethode
  
// Vorbereitung der Schaltfl�che:
// Seiteneffekt input, Wirkung auf Ein- und Ausgabefelder

function preparePanel (ip) {
  input = ip;                                              // Zustand der Eingabe
  opText.innerHTML = (ip==0 ? "" : text01);                // Zerlegungsanweisung
  if (ip == 0) {                                           // Falls Eingabe deaktiviert ...
    opNumber.innerHTML = "";                               // Zahl l�schen
    ip1.value = ip2.value = "";                            // Eingabefelder l�schen
    }
  ip1.disabled = (ip != 1);                                // Erstes Eingabefeld aktivieren oder deaktivieren
  ip2.disabled = (ip != 2);                                // Zweites Eingabefeld aktivieren oder deaktivieren
  if (ip == 1) ip1.focus();                                // Gegebenenfalls Fokus f�r erstes Eingabefeld
  if (ip == 2) ip2.focus();                                // Gegebenenfalls Fokus f�r zweites Eingabefeld
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt factor1, factor2, input, ball, Wirkung auf Ein- und Ausgabefelder
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13) {                                    // Falls Entertaste (Chrome) ...
    if (input == 1) reaction1();                           // Reaktion auf Eingabe des ersten Faktors                   
    else if (input == 2) reaction2();                      // Reaktion auf Eingabe des zweiten Faktors
    }                      
  }
  
// Reaktion auf Eingabe des ersten Faktors (mit Enter-Taste):
// Seiteneffekt factor1, input, ball, Wirkung auf Ein- und Ausgabefelder
  
function reaction1 () {
  factor1 = Number(ip1.value);                             // Eingegebene Zahl
  if (!factor1 || factor1 <= 1 || factor1 == number || number%factor1 != 0)  // Falls Eingabe falsch ...
    reactionError();                                       // Reaktion: Kugeln einer Farbe oder alle Kugeln nach unten
  else preparePanel(2);                                    // Falls Eingabe richtig, Eingabe des zweiten Faktors aktivieren
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Eingabe des zweiten Faktors (mit Enter-Taste):
// Seiteneffekt factor2, input, ball, Wirkung auf Ein- und Ausgabefelder
  
function reaction2 () {
  factor2 = Number(ip2.value);                             // Eingegebene Zahl
  if (factor1*factor2 != number)                           // Falls Eingabe falsch ... 
    reactionError();                                       // Reaktion: Kugeln einer Farbe oder alle Kugeln nach unten 
  else {                                                   // Falls Eingabe richtig ...
    var f = ball[i0].factor;                               // Array der Faktoren
    var l = ball[i0].level;                                // Array der Levels
    for (var j=f.length; j>=j0+1; j--) {                   // F�r alle h�heren Indizes ... 
      f[j] = f[j-1];                                       // Faktor im Array verschieben
      l[j] = l[j-1];                                       // Level im Array verschieben
      }
    f[j0+1] = factor2;                                     // Neues Element im Array der Faktoren
    f[j0] = factor1;                                       // Bisheriges Element im Array der Faktoren aktualisieren
    l[j0] = nextStep(l[j0]);                               // Neues Level
    }
  preparePanel(0);                                         // Eingabe deaktivieren
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Mausklick oder Ber�hrung mit dem Finger:
// x, y ... Koordinaten bez�glich Viewport (Pixel)
// Seiteneffekt ball, input, i0, j0, number, Wirkung auf Ein- und Ausgabefelder
  
function reactionDown (x, y) {
  if (input != 0) return;                                  // Falls Eingabe eines Faktors, abbrechen
  if (maxLevel() == 26) {                                  // Falls Aufgabe beendet ...
    newProblem();                                          // Neue Aufgabe
    paint();                                               // Neu zeichnen
    return;                                                // Abbrechen
    }
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che
  var lev = calcLevel(x,y);                                // Level (H�he der Stufe), Berechnung von i0 und j0
  if (lev == undefined) return;                            // Falls sinnloses Ergebnis, abbrechen
  if (!isFree(lev+1)) return;                              // Falls n�chsth�here Stufe besetzt, abbrechen
  var ball0 = ball[i0];                                    // Objekt mit Eigenschaften der Kugeln der aktuellen Farbe        
  var f = ball0.factor[j0];                                // Aktuelle Zahl (Faktor der urspr�nglichen Zahl)
  if (numberPrimeFactors(f) >  6-lev) {                    // Falls Zerlegung n�tig ...
    number = f;                                            // Zu zerlegende Zahl
    opNumber.innerHTML = ""+f+" = ";                       // Ausgabe der zu zerlegenden Zahl
    preparePanel(1);                                       // Eingabe des ersten Faktors aktivieren    
    }
  else                                                     // Falls keine Zerlegung n�tig ...
    ball0.level[j0] = nextStep(ball0.level[j0]);           // Neues Level
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Ber�hrung:

function reactionUp () {
  if (input == 1) ip1.focus();                             // Fokus auf Eingabefeld f�r ersten Faktor
  if (input == 2) ip2.focus();                             // Fokus auf Eingabefeld f�r zweiten Faktor  
  } 
   
//-------------------------------------------------------------------------------------------------

// Zahl der Primfaktoren:
// n ... Gegebene Zahl

function numberPrimeFactors (n) {
  var zf = 0;                                              // Startwert f�r Zahl der Primfaktoren
  var t = 2;                                               // Startwert f�r Teiler 
  while (t <= n) {                                         // Solange Teiler kleiner oder gleich gegebener Zahl ...
    if (n%t == 0) {zf++; n /= t;}                          // Bei Teilbarkeit Variable aktualisieren
    else t++;                                              // Andernfalls Teiler erh�hen
    }
  return zf;                                               // R�ckgabewert
  }
    
// Zuf�llig ausgew�hlter Primfaktor:

function primeFactor () {
  var i = Math.floor(primeFactors.length*Math.random());   // Zufallszahl f�r Index
  return primeFactors[i];                                  // R�ckgabewert
  }
  
// Neue Aufgabe:
// Seiteneffekt ball, input, Wirkung auf Ein- und Ausgabefelder
// Die ausgew�hlten Zahlen enthalten zusammen genau 21 Primfaktoren; jede einzelne Zahl hat 3 bis 6 Primfaktoren.

function newProblem () {
  var n = new Array(5);                                    // Array f�r vorl�ufige Zahlen mit je drei Primfaktoren
  for (var i=0; i<5; i++) {                                // F�r alle Kugeln ...
    n[i] = primeFactor();                                  // Erster Primfaktor
    n[i] *= primeFactor();                                 // Multiplikation mit zweitem Primfaktor
    n[i] *= primeFactor();                                 // Multiplikation mit drittem Primfaktor
    if (n[i] > 100) {i--; continue;}                       // Falls Zahl zu gro�, Auswahl wiederholen
    }
  for (i=0; i<6; i++) {                                    // Wiederhole sechsmal ...
    var pf = primeFactor();                                // Neuer Primfaktor
    var nr = Math.floor(5*Math.random());                  // Zuf�llig ausgew�hlter Index
    var z0 = n[nr];                                        // Zugeh�rige vorl�ufige Zahl 
    if (numberPrimeFactors(z0) >= 6) {i--; continue;}      // Falls zu viele Primfaktoren, Auswahl wiederholen
      n[nr] *= pf;                                         // Vorl�ufige Zahl mit dem neuen Primfaktor multiplizieren
      if (z0*pf >= 1000 || z0*pf > 300 && i < 2) {         // Falls Zahl zu gro� ...
        n[nr] = z0; i--;                                   // Multiplikation r�ckg�ngig machen, Auswahl wiederholen
        }
      }
  var i0 = Math.floor(5*Math.random());                    // Index f�r zyklische Vertauschung der Farben    
  for (i=0; i<5; i++) {                                    // F�r alle Kugeln ...
    var c = colorBall[(i+i0)%5];                           // Farbe
    ball[i] = newBall(n[i],c);                             // Daten der neuen Kugel zum Array ball hinzuf�gen
    }
  preparePanel(0);                                         // Eingabe deaktivieren
  }
    
// Neue Kugel:
// n ... Zahl
// c ... Farbe
// R�ckgabewert: Element mit den Attributen number, color, level (Array der L�nge 1) und factor (Array der L�nge 1)

function newBall (n, c) {
  return b = {number: n, color: c, level: [0], factor: [n]}; 
  }
  
// Daten zu einem Mausklick:
// (x,y) ... Position (Pixel)
// R�ckgabewert: Level (0 f�r Ausgangsniveau oder 1 bis 5 f�r H�he der Stufe) oder undefined
// Seiteneffekt i0, j0

function calcLevel (x, y) {
  if (y > h0) return undefined;                            // Falls zu tief, R�ckgabewert undefined
  if (y > h0-w1) {                                         // Falls Ausgangsniveau ...
    var i = Math.floor((w0-x)/w1);                         // Index berechnen
    if (i < 0 || i > 4) return undefined;                  // Falls Index zu klein oder zu gro�, R�ckgabewert undefined
    i0 = i;                                                // Aktueller Index im Array ball
    j0 = indexLevel(i,0);                                  // Aktueller Index in den Arrays factor und level
    return 0;                                              // R�ckgabewert
    }
  else {                                                   // Falls �ber dem Ausgangsniveau ...
    var l = 1+Math.floor((x-w0)/w1);                       // Level (H�he der Stufe) berechnen
    if (l < 1 || l > 5) return undefined;                  // Falls Level zu klein oder zu gro�, R�ckgabewert undefined
    if (Math.floor((h0-l*w1-y)/w1) != 0) return undefined; // Falls Position zu tief oder zu hoch, R�ckgabewert undefined 
    if (isFree(l)) return undefined;                       // Falls Position unbesetzt, R�ckgabewert undefined
    i0 = indexBall(l);                                     // Aktueller Index im Array ball
    j0 = indexLevel(i0,l);                                 // Aktueller Index in den Arrays factor und level
    return l;                                              // R�ckgabewert
    }
  }
  
// Index der Kugel(n), abh�ngig vom Level:
// l ... Level (1 bis 5)
// R�ckgabewert: Index der Kugel(n) im Array ball, bei unbesetzter Stufe -1, bei ungeeignetem Wert von l undefined
  
function indexBall (l) {
  if (l < 1 || l > 5) return undefined;                    // Kein sinnvolles Ergebnis
  for (var i=0; i<5; i++)                                  // F�r alle Kugelfarben ... 
    if (indexLevel(i,l) >= 0) return i;                    // Bei �bereinstimmung R�ckgabewert
  return -1;                                               // R�ckgabewert f�r unbesetzte Stufe
  }
  
// �berpr�fung, ob Treppenstufe unbesetzt:
// l ... Level

function isFree (l) {
  return (indexBall(l) == -1 || l >= 6);
  }
  
// Index in den Arrays factor und level:
// i ... Index im Array ball
// l ... Level
// R�ckgabewert: Index in den Arrays factor und level, bei Misserfolg undefined 
  
function indexLevel (i, l) {
  if (i < 0 || i > 5 || l < 0) return undefined;           // R�ckgabewert nicht definiert
  var lev = ball[i].level;                                 // Array der Levels
  for (var j=0; j<lev.length; j++)                         // F�r alle Array-Elemente ...
    if (lev[j] == l) return j;                             // Falls �bereinstimmung, Index als R�ckgabewert
  return undefined;                                        // R�ckgabewert nicht definiert
  }
    
// Maximaler Wert von level:

function maxLevel () {
  var m = -1;                                              // Startwert f�r Maximum
  for (var i=0; i<5; i++) {                                // F�r alle Kugelfarben ...
    var l = ball[i].level;                                 // Array der Levels
    for (var j=0; j<l.length; j++)                         // F�r alle Elemente des Arrays ...
      m = Math.max(m,l[j]);                                // Maximum aktualisieren
    }
  return m;                                                // R�ckgabewert
  }
  
// Folge eines Fehlers unterhalb der vorletzten Stufe:
// i ... Index im Array ball
// Seiteneffekt input, ball[i], Wirkung auf Ein- und Ausgabefelder
  
function ballDown (i) {
  preparePanel(0);                                         // Eingabe deaktivieren
  var b = ball[i];                                         // Objekt f�r Kugeln der aktuellen Farbe
  b.factor = [b.number];                                   // Neue Faktorenliste mit nur einem Faktor
  b.level = [0];                                           // Kugel wieder auf Ausgangsniveau
  }
  
// Folge eines Fehlers auf der vorletzten Stufe:
// Seiteneffekt input, ball, Wirkung auf Ein- und Ausgabefelder

function allBallsDown () {
  for (var i=0; i<5; i++) ballDown(i);                     // Alle Kugeln wieder auf Ausgangsniveau
  }
  
// Reaktion auf fehlerhafte Zerlegung:
// Seiteneffekt input, ball, Wirkung auf Ein- und Ausgabefelder

function reactionError () {
  if (numberPrimeFactors(number) > 2) ballDown(i0);        // Falls tiefere Stufe, Kugeln der aktuellen Farbe nach unten
  else allBallsDown();                                     // Falls vorletzte Stufe, alle Kugeln nach unten
  }
  
// N�chste Stufe:
// i ... Bisheriges Level

function nextStep (i) {
  if (i < 5) return i+1;                                   // Entweder n�chsth�here Stufe ...
  else return maxLevel()+1;                                // ... oder Endposition
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }

// Treppe:

function stairs () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorStairs;                             // F�llfarbe
  ctx.moveTo(0,h0);                                        // Anfangspunkt (links)
  ctx.lineTo(w0,h0);                                       // Weiter nach rechts
  var x = w0, y = h0;                                      // Anfangspunkt der Treppenstufen (Pixel)
  for (var i=0; i<6; i++) {                                // F�r alle Treppenstufen ...
    ctx.lineTo(x,y-w1);                                    // Weiter nach oben
    ctx.lineTo(x+w1,y-w1);                                 // Weiter nach rechts
    x += w1; y -= w1;                                      // Koordinaten aktualisieren
    }
  ctx.lineTo(width,y);                                     // Weiter zum rechten Rand
  ctx.lineTo(width,height-1);                              // Weiter zum unteren Rand
  ctx.lineTo(0,height-1);                                  // Weiter zum linken Rand
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill(); ctx.stroke();                                // Fl�che ausf�llen, Rand zeichnen
  }
  
// Einzelne Kugel mit Zahl:
// n ....... Zahl
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... Farbe
  
function drawBall (n, x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Kreis mit schwarzem Rand
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillText(""+n,x,y+5);                                // Zahl in der Mitte
  }
  
// Kugel(n) einer Farbe zeichnen:
// i ... Index im Array ball

function drawBalls (i) {
  var bl = ball[i].level;                                  // Array der Levels
  if (!bl) return;                                         // Falls Array nicht definiert, abbrechen
  for (var j=0; j<bl.length; j++) {                        // F�r alle Kugeln der gegebenen Farbe ...
    var n = ball[i].factor[j];                             // Zahl
    var r = 9+numberPrimeFactors(n);                       // Radius (Pixel)
    var blj = bl[j];                                       // Level
    if (blj == 0) {                                        // Falls Kugel auf Ausgangsniveau ...
      var mx = w0-w1/2-i*w1;                               // x-Koordinate Mittelpunkt (Pixel)
      var my = h0-r;                                       // y-Koordinate Mittelpunkt (Pixel) 
      }
    else if (blj < 6) {                                    // Falls Kugel auf Treppe ...
      mx = w0-w1/2+blj*w1;                                 // x-Koordinate Mittelpunkt (Pixel)
      my = h0-r-blj*w1;                                    // y-Koordinate Mittelpunkt (Pixel)
      }
    else {                                                 // Falls Kugel oben angekommen ...
      var diff = blj-6;                                    // Differenz
      var x0 = (w0+5*w1+width)/2;                          // Mittlere x-Koordinate (Pixel)
      var y0 = h0-6*w1-r;                                  // Maximale y-Koordinate (Pixel)
      if (diff < 6) {                                      // Unterste Lage
        mx = x0+50-diff*20; my = y0;                       // Mittelpunkt (Pixel)
        } 
      else if (diff < 11) {                                // Zweite Lage
        mx = x0+160-diff*20; my = y0-18;                   // Mittelpunkt (Pixel)
        }
      else if (diff < 15) {                                // Dritte Lage
        mx = x0+250-diff*20; my = y0-36;                   // Mittelpunkt (Pixel)
        }
      else if (diff < 18) {                                // Vierte Lage
        mx = x0+320-diff*20; my = y0-54;                   // Mittelpunkt (Pixel)
        }
      else if (diff < 20) {                                // F�nfte Lage
        mx = x0+370-diff*20; my = y0-72;                   // Mittelpunkt (Pixel)
        }
      else if (diff < 21) {                                // Oberste Lage
        mx = x0+400-diff*20; my = y0-90;                   // Mittelpunkt (Pixel)
        }
      }
    drawBall(n,mx,my,r,ball[i].color);                     // Kugel zeichnen
    }
  }
  
// Tabelle mit den bisherigen Zerlegungen:
  
function table () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  for (var i=0; i<5; i++) {                                // F�r alle Farben ...
    var b = ball[i];                                       // Element des Arrays 
    ctx.fillStyle = b.color;                               // F�llfarbe
    ctx.fillRect(20,25+i*20,200,20);                       // Ausgef�lltes Rechteck
    ctx.strokeRect(20,25+i*20,200,20);                     // Rand des Rechtecks
    ctx.fillStyle = "#000000";                             // Schriftfarbe
    ctx.textAlign = "right";                               // Textausrichtung rechtsb�ndig
    ctx.fillText(""+b.number,50,40+i*20);                  // Zu zerlegende Zahl 
    var bf = b.factor;                                     // Array der Faktoren                           
    if (bf.length <= 1) continue;                          // Falls h�chstens ein Faktor, weiter zur n�chsten Farbe
    ctx.textAlign = "left";                                // Textausrichtung linksb�ndig
    var t = "= ";                                          // Zeichenkette f�r Faktorisierung (zun�chst nur Gleichheitszeichen)
    for (var j=0; j<bf.length; j++) {                      // F�r alle Faktoren ...
      t += bf[j];                                          // Neuen Faktor zur Zeichenkette hinzuf�gen
      if (j < bf.length-1)                                 // Falls nicht letzter Faktor ... 
        t += " "+symbolMultiplyUnicode+" ";                // Multiplikationszeichen zur Zeichenkette hinzuf�gen
      }
    ctx.fillText(t,55,40+i*20);                            // Zeichenkette f�r Faktorisierung ausgeben
    } // Ende i-Schleife
  }
  
// Abgerundetes Rechteck:
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... H�he (Pixel)
// r ... Radius (Pixel)
// c ... F�llfarbe

function roundRect (x, y, w, h, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)                                              
  ctx.moveTo(x+r,y+h);                                     // Anfangspunkt (Bogenendpunkt links unten)
  ctx.lineTo(x+w-r,y+h);                                   // Weiter nach rechts
  ctx.arc(x+w-r,y+h-r,r,PIH,0,true);                       // Kreisbogen rechts unten
  ctx.lineTo(x+w,y+r);                                     // Weiter nach oben
  ctx.arc(x+w-r,y+r,r,0,3*PIH,true);                       // Kreisbogen rechts oben
  ctx.lineTo(x+r,y);                                       // Weiter nach links
  ctx.arc(x+r,y+r,r,3*PIH,2*PIH,true);                     // Kreisbogen links oben
  ctx.lineTo(x,y+h-r);                                     // Weiter nach unten
  ctx.arc(x+r,y+h-r,r,2*PIH,PIH,true);                     // Kreisbogen links unten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�lltes abgerundetes Rechteck mit Rand
  }
  
// Gratulation, Hinweis Neuanfang:

function congratulation () {
  var i = Math.floor(text02.length*Math.random());         // Zuf�llig ausgew�hlter Index
  var s = text02[i];                                       // Zugeh�riger Text
  var w = ctx.measureText(s).width+40;                     // Rechtecksbreite (Pixel)
  roundRect(120-w/2,155,w,40,10,colorCongratulation1);     // Abgerundetes Rechteck  
  ctx.fillStyle = colorCongratulation2;                    // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillText(s,120,180);                                 // Text f�r Gratulation
  ctx.fillStyle = colorNewGame;                            // Neue Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung linksb�ndig
  ctx.fillText(text03[0],340,250);                         // Text f�r Neuanfang, erste Zeile                         
  ctx.fillText(text03[1],340,270);                         // Text f�r Neuanfang, zweite Zeile
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  ctx.strokeStyle = "#000000";                             // Farbe f�r Rand einer Zelle (schwarz)
  ctx.lineWidth = 1;                                       // Liniendicke
  ctx.textAlign = "center";                                // Zentrierung innerhalb einer Zelle
  stairs();                                                // Treppe
  for (var i=0; i<5; i++) drawBalls(i);                    // Kugeln 
  table();                                                 // Tabelle mit Zerlegungen
  if (maxLevel() == 26) congratulation();                  // Gratulation, Hinweis Neuanfang
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

