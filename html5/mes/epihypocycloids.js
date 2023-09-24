// Epizykloiden und Hypozykloiden
// 22.10.2017 - 24.10.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel epihypocycloids_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#0000ff";                                    // Farbe für bewegten Kreis
var color2 = "#ff0000";                                    // Farbe für Epi- oder Hypozykloide

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var T = 10;                                                // Dauer der Animation (s) 

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var rb1, rb2;                                              // Radiobuttons
var ch1, ch2;                                              // Auswahlfelder
var bu1, bu2;                                              // Schaltknöpfe (Reset, Start/Pause/Weiter)
var x0, y0;                                                // Mittelpunkt
var r1;                                                    // Radius des festen Kreises
var r2;                                                    // Radius des bewegten Kreises
var k1, k2;                                                // Ganze Zahlen (r1 : r2 = k1 : k2)
var n0;                                                    // Zahl der Umläufe des kleinen Kreises
var v0;                                                    // Winkelgeschwindigkeit (Grad pro Sekunde)
var timer;                                                 // Timer für Bewegung
var on;                                                    // Flag für Bewegung
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var par;                                                   // Aktueller Parameterwert (Bogenmaß)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 
  
// Neues Auswahlfeld mit den Zahlen 1 bis 10:
// id ... ID im HTML-Text
// i0 ... Voreingestellter Index
  
function newSelect (id, i0) {
  var ch = getElement(id);                                 // Auswahlfeld
  for (var i=1; i<=10; i++) {                              // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = (i<10 ? " "+i : ""+i);                        // Inhalt
    ch.add(o);                                             // Element hinzufügen
    }
  ch.selectedIndex = i0;                                   // Voreingestellter Index
  return ch;                                               // Rückgabewert
  }

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  rb1 = getElement("rb1");                                 // Radiobutton (Epizykloide)
  getElement("lb1",text01);                                // Erklärender Text (Epizykloide)
  rb1.checked = true;                                      // Radiobutton ausgewählt
  rb2 = getElement("rb2");                                 // Radiobutton (Hypozykloide)
  getElement("lb2",text02);                                // Erklärender Text (Hypozykloide)
  getElement("lb3",text03);                                // Erklärender Text (Verhältnis der Radien)
  ch1 = newSelect("ch1",2);                                // Auswahlfeld (k1)
  ch2 = newSelect("ch2",1);                                // Auswahlfeld
  bu1 = getElement("bu1",text04);                          // Resetknopf
  bu2 = getElement("bu2",text05[0]);                       // Startknopf
  bu2.state = 0;                                           // Anfangszustand (vor Start der Animation)
  getElement("author",author);                             // Autor (und Übersetzer)
   
  x0 = width/2; y0 = height/2;                             // Mittelpunkt Zeichenfläche
  reactionSelect();                                        // k1:k2 übernehmen, Berechnungen, Anfangszustand
  paint();                                                 // Neu zeichnen

  rb1.onclick = reactionRadio;                             // Reaktion auf Radiobutton Epizykloide
  rb2.onclick = reactionRadio;                             // Reaktion auf Radiobutton Hypozykloide
  ch1.onchange = reactionSelect;                           // Reaktion auf Auswahlfeld k1
  ch2.onchange = reactionSelect;                           // Reaktion auf Auswahlfeld k2
  bu1.onclick = reactionReset;                             // Reaktion auf Resetknopf
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf Start/Pause/Weiter  
  } // Ende der Methode start
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text05[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt bu2
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
  
// Reaktion auf Resetknopf:
// Seiteneffekt bu2, t, par, on, timer, t0 
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  t = 0;                                                   // Zeitvariable zurücksetzen
  par = 0;                                                 // Parameterwert zurücksetzen
  stopAnimation();                                         // Animation abschalten
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2, on, timer, t0

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  if (bu2.state == 1) startAnimation();                    // Animation entweder starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder unterbrechen
  }
  
// Reaktion: Berechnungen, Anfangszustand
// Seiteneffekt r1, r2, n0, v0, bu2, t, par, on, timer, t0

function reaction () {
  calculation();                                           // Berechnungen (r1, r2, n0, v0)
  reactionReset();                                         // Anfangszustand (bu2, t, par, on, timer)
  }
  
// Korrektur des Verhältnisses des Radien (k2 > k1 für Hypozykloide verhindern):
// Seiteneffekt k1, k2
  
function correctRatio () {
  if (k1 > 1) {k2 = k1-1; ch2.selectedIndex = k2-1;}       // Falls möglich, k2 verringern
  else {k1++; ch1.selectedIndex = k1-1;}                   // Sonst k1 erhöhen  
  }
  
// Reaktion auf Radiobutton:
// Seiteneffekt k1, k2, r1, r2, n0, v0, bu2, t, par, on, timer, t0

function reactionRadio () {
  if (rb2.checked && k2 > k1) correctRatio();              // Beim Umschalten auf Hypozykloide eventuell korrigieren
  reaction();                                              // Berechnungen, Anfangszustand
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt k1, k2, ch2, r1, r2, n0, v0, bu2, t, par, on, timer, t0 

function reactionSelect () {
  k1 = ch1.selectedIndex+1;                                // Ganze Zahl für festen Kreis
  k2 = ch2.selectedIndex+1;                                // Ganze Zahl für bewegten Kreis
  if (rb2.checked && k2 > k1) correctRatio();              // Falls bewegter Kreis für Hypozykloide zu groß, korrigieren
  reaction();                                              // Berechnungen, Anfangszustand
  }

// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, t0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
  }
   
//-------------------------------------------------------------------------------------------------

// Berechnungen:
// Seiteneffekt r1, r2, n0, v0

function calculation () {
  r1 = (rb1.checked ? k1*150/(k1+2*k2) : 150);             // Radius des festen Kreises
  r2 = r1*k2/k1;                                           // Radius des bewegten Kreises
  n0 = k2/gcd(k1,k2);                                      // Zahl der Umläufe des bewegten Kreises
  v0 = 360*n0/T;                                           // Winkelgeschwindigkeit (Grad pro Sekunde)
  }
  
// Größter gemeinsamer Teiler:
// a, b ... Natürliche Zahlen

function gcd (a, b) {
  var r = a%b;                                             // Divisionsrest
  while (r > 0) {var a = b; b = r; r = a%b;}               // Euklidischer Algorithmus
  return b;                                                // Rückgabewert
  }

//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Punkt markieren:
// (x,y) ... Koordinaten
// c ....... Füllfarbe
  
function point (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kleinen Kreis vorbereiten
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefüllter Kreis mit schwarzem Rand
  }
  
// Strecke zeichnen:
// (x1,y1) ... 1. Endpunkt
// (x2,y2) ... 2. Endpunkt
// c ......... Linienfarbe (optional, Defaultwert schwarz)
  
function line (x1, y1, x2, y2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Strecke vorbereiten
  ctx.stroke();                                            // Strecke zeichnen
  }
  
// Kreis zeichnen:
// (x,y) ... Mittelpunkt
// r ....... Radius
// c ....... Linienfarbe (optional, Defaultwert schwarz)
  
function circle (x, y, r, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  }
  
// Bewegter Kreis:

function rollingCircle () {
  var epi = rb1.checked;                                  // Flag für Epizykloide
  var h1 = (epi ? r1+r2 : r1-r2);                         // Hilfsgröße (Summe bzw. Differenz der Radien)
  var h2 = h1/r2;                                         // Hilfsgröße
  var x1 = x0+h1*Math.sin(par);                           // x-Koordinate Mittelpunkt
  var y1 = y0-h1*Math.cos(par);                           // y-Koordinate Mittelpunkt
  circle(x1,y1,r2,color1);                                // Kreis zeichnen
  var x2 = x1-r2*Math.sin(h2*par);                        // x-Koordinate Linienendpunkt
  var y2 = y1+(epi?r2:-r2)*Math.cos(h2*par);              // y-Koordinate Linienendpunkt
  line(x1,y1,x2,y2,color1);                               // Radius zeichnen
  point(x2,y2,color2);                                    // Endpunkt markieren
  }
  
// Epi- oder Hypozykloide:

function epihypoCycloid () {
  var epi = rb1.checked;                                   // Flag für Epizykloide
  newPath(color2);                                         // Neuer Grafikpfad
  var h1 = (epi ? r1+r2 : r1-r2);                          // Hilfsgröße (Summe bzw. Differenz der Radien)
  var h2 = h1/r2;                                          // Hilfsgröße                      
  ctx.moveTo(x0,y0-r1);                                    // Anfangspunkt (oben)
  var iMax = Math.ceil(par/DEG);                           // Maximaler Wert für i (siehe unten, vorläufig)
  if (iMax > n0*360) iMax = n0*360;                        // Maximaler Wert für i (siehe unten)
  var i = 0, p = 0;                                        // Zähler und Parameterwert
  while (i < iMax) {                                       // Solange maximaler Parameterwert noch nicht erreicht ...
    i++;                                                   // Zähler erhöhen
    p = Math.min(i*DEG,par);                               // Parameterwert aktualisieren
    var x = x0+h1*Math.sin(p)-r2*Math.sin(h2*p);           // x-Koordinate
    var y = y0-h1*Math.cos(p)+(epi?r2:-r2)*Math.cos(h2*p); // y-Koordinate
    ctx.lineTo(x,y);                                       // Linie zum Grafikpfad hinzufügen
    }
  ctx.stroke();                                            // Polygonzug als Näherung zeichnen
  }

// Grafikausgabe:
// Seiteneffekt t, par, t0 
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  circle(x0,y0,r1);                                        // Fester Kreis
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    par = v0*t*DEG;                                        // Parameterwert
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  epihypoCycloid();                                        // Epizykloide oder Hypozykloide
  rollingCircle();                                         // Beweglicher Kreis
  ctx.fillStyle = color2;                                  // Schriftfarbe
  ctx.font = FONT;                                         // Zeichensatz
  var epi = rb1.checked;                                   // Flag für Epizykloide
  if (epi && k1 == k2) ctx.fillText(text06,20,20);         // Spezialfall Kardioide
  else if (epi && k1 == 2*k2) ctx.fillText(text07,20,20);  // Spezialfall Nephroide
  else if (!epi && k1 == 2*k2) ctx.fillText(text08,20,20); // Spezialfall Kreisdurchmesser
  else if (!epi && k1 == 3*k2) ctx.fillText(text09,20,20); // Spezialfall Deltoide
  else if (!epi && k1 == 4*k2) ctx.fillText(text10,20,20); // Spezialfall Astroide
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

