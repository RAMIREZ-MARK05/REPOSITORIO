// Stehende Welle, Erklärung durch Reflexion
// Java-Applet (09.07.2003) umgewandelt
// 26.12.2015 - 28.12.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel standingwavereflection_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color1 = "#ff0000";                                    // Farbe für einfallende Welle
var color2 = "#0000ff";                                    // Farbe für reflektierte Welle
var color3 = "#000000";                                    // Farbe für resultierende stehende Welle

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var LEN = 432;                                             // Länge (Pixel)
var PER = 10;                                              // Schwingungsdauer (s)
var WL = 144;                                              // Wellenlänge (Pixel), durch 24 teilbar!
var AMPL = 80;                                             // Amplitude (Pixel)
var NWL = LEN/WL;                                          // Zahl der Wellenlängen
var DIST = WL/24;                                          // Abstand (Pixel)
var OMEGA = 2*Math.PI/PER;                                 // Kreisfrequenz (1/s)
var K = 2*Math.PI/WL;                                      // Wellenzahl (1/Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var rb1, rb2;                                              // Radiobuttons oben
var bu1, bu2;                                              // Schaltknöpfe
var cbSlow;                                                // Optionsfeld (Zeitlupe)
var rb3, rb4;                                              // Radiobuttons unten
var ch;                                                    // Auswahlfeld
var cb1, cb2, cb3;                                         // Optionsfelder unten

var vM;                                                    // Senkrechte Bildschirmkoordinate der Mittellinie
var dPhi;                                                  // Phasensprung bei Reflexion (Bogenmaß)
var timer;                                                 // Timer für Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var on;                                                    // Flag für Bewegung
var slow;                                                  // Flag für Zeitlupe
var w1;                                                    // Flag für Darstellung der einfallenden Welle
var w2;                                                    // Flag für Darstellung der reflektierten Welle
var w3;                                                    // Flag für Darstellung der Gesamtwelle
var singleStep;                                            // Flag für Einzelschritt-Modus
var dt;                                                    // Zeitintervall für Einzelschritt-Modus (s)

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
  getElement("lb1",text01);                                // Erklärender Text (Reflexion)
  rb1 = getElement("rb1a");                                // Radiobutton (festes Ende)
  rb1.checked = true;                                      // Radiobutton ausgewählt
  getElement("rb1b",text02);                               // Erklärender Text (festes Ende)
  rb2 = getElement("rb2a");                                // Radiobutton (loses Ende)
  getElement("rb2b",text03);                               // Erklärender Text (loses Ende)
  bu1 = getElement("bu1",text04);                          // Schaltknopf (Reset)
  bu2 = getElement("bu2");                                 // Schaltknopf (Start/Pause/Weiter)
  setButton2State(0);                                      // Anfangszustand (vor dem Start)
  cbSlow = getElement("cbSlow");                           // Optionsfeld (Zeitlupe)
  cbSlow.checked = false;                                  // Zeitlupe zunächst abgeschaltet
  getElement("lbSlow",text06);                             // Erklärender Text (Zeitlupe)
  rb3 = getElement("rb3a");                                // Radiobutton (Animation)
  rb3.checked = true;                                      // Radiobutton ausgewählt
  getElement("rb3b",text07);                               // Erklärender Text (Animation)
  rb4 = getElement("rb4a");                                // Radiobutton (Einzelschritte)
  getElement("rb4b",text08);                               // Erklärender Text (Einzelschritte)
  ch = getElement("ch");                                   // Auswahlfeld (Zeitintervall für Einzelschritt-Modus)
  initSelect();                                            // Auswahlfeld vorbereiten
  cb1 = getElement("cb1a");                                // Optionsfeld (einfallende Welle)
  cb1.checked = true;                                      // Optionsfeld ausgewählt
  getElement("cb1b",text09);                               // Erklärender Text (einfallende Welle)
  cb2 = getElement("cb2a");                                // Optionsfeld (reflektierte Welle)
  cb2.checked = true;                                      // Optionsfeld ausgewählt
  getElement("cb2b",text10);                               // Erklärender Text (reflektierte Welle)
  cb3 = getElement("cb3a");                                // Optionsfeld (Gesamtwelle)
  cb3.checked = true;                                      // Optionsfeld ausgewählt
  getElement("cb3b",text11);                               // Erklärender Text (Gesamtwelle)  
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer

  dPhi = Math.PI;                                          // Phasensprung bei Reflexion (Bogenmaß)
  t0 = new Date();                                         // Bezugszeitpunkt
  t = 0;                                                   // Zeitvariable (s) 
  on = slow = false;                                       // Animation zunächst abgeschaltet
  w1 = w2 = w3 = true;                                     // Darstellung aller Wellen zunächst eingeschaltet
  singleStep = false;                                      // Einzelschritt-Modus zunächst abgeschaltet
  dt = PER/8;                                              // Zeitintervall für Einzelschritt-Modus (s)
  vM = height/2;                                           // Senkrechte Bildschirmkoordinate der Mittellinie
  
  paint();                                                 // Zeichnen
  
  rb1.onclick = reactionReset;                             // Reaktion auf Radiobutton (Reflexion am festen Ende)
  rb2.onclick = reactionReset;                             // Reaktion auf Radiobutton (Reflexion am losen Ende)
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  cbSlow.onclick = reactionSlow;                           // Reaktion auf Optionsfeld (Zeitlupe)
  rb3.onclick = reactionRadioButton34;                     // Reaktion auf Radiobutton (Animation)
  rb4.onclick = reactionRadioButton34;                     // Reaktion auf Radiobutton (Einzelschritte)
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (Zeitintervall)
  cb1.onclick = reactionCheckBox;                          // Reaktion auf Optionsfeld (einfallende Welle)
  cb2.onclick = reactionCheckBox;                          // Reaktion auf Optionsfeld (reflektierte Welle)
  cb3.onclick = reactionCheckBox;                          // Reaktion auf Optionsfeld (Gesamtwelle)
  
  } // Ende der Methode start
  
// Initialisierung der Auswahlliste:
  
function initSelect () {
  for (var i=0; i<text12.length; i++) {                    // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text12[i];                                    // Text des Elements übernehmen 
    ch.add(o);                                             // Element zur Liste hinzufügen
    }
  ch.selectedIndex = 1;                                    // Zunächst Zeitintervall T/4 ausgewählt
  }
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text05[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt t, bu2.state
  
function switchButton2 () {
  var st = bu2.state;                                      // Bisheriger Zustand (0, 1 oder 2)
  if (singleStep) {                                        // Falls Einzelschritt-Modus ...
    t = dt*(1+Math.floor(t/dt));                           // Zeitvariable erhöhen                                               
    st = 2;                                                // Neuer Zustand
    }
  else {                                                   // Falls Animation ...
    if (st == 0) st = 1;                                   // Falls Ausgangszustand, starten
    else st = 3-st;                                        // Sonst Wechsel zwischen Animation und Pause
    }
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
    
// Reaktion auf Resetknopf und obere Radiobuttons:
// Seiteneffekt dPhi, bu2.state, t, on, slow
   
function reactionReset () {
  dPhi = (rb1.checked ? Math.PI : 0);                      // Phasensprung (Bogenmaß)
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  t = 0;                                                   // Zeitvariable zurücksetzen
  on = false;                                              // Animation abgeschaltet
  slow = cbSlow.checked;                                   // Flag für Zeitlupe
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2.state, on, slow, timer, t0

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  on = (bu2.state == 1);                                   // Flag für Animation
  slow = cbSlow.checked;                                   // Flag für Zeitlupe
  if (on) startAnimation();                                // Animation entweder starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder unterbrechen
  if (!on) paint();                                        // Falls nötig, neu zeichnen
  }
  
// Reaktion auf Optionsfeld Zeitlupe:
// Seiteneffekt slow

function reactionSlow () {
  slow = cbSlow.checked;                                   // Flag setzen
  }
  
// Reaktion auf untere Radiobuttons:
// Seiteneffekt singleStep, bu2.state, t

function reactionRadioButton34 () {
  singleStep = rb4.checked;                                // Flag für Einzelschritt-Modus
  if (singleStep) t = dt*Math.ceil(t/dt);                  // Falls Einzelschritt-Modus, Zeitvariable aktualisieren
  setButton2State(t>0?2:0);                                // Zustand des Schaltknopfs Start/Pause/Weiter
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt dt

function reactionSelect () {
  switch (ch.selectedIndex) {                              // Je nach ausgewähltem Item ...
    case 0: dt = PER/4; break;                             // Zeitintervall T/4
    case 1: dt = PER/8; break;                             // Zeitintervall T/8
    case 2: dt = PER/12; break;                            // Zeitintervall T/12
    case 3: dt = PER/24; break;                            // Zeitintervall T/24
    }
  }
  
// Reaktion auf Optionsfeld:
// Seiteneffekt w1, w2, w3

function reactionCheckBox () {
  w1 = cb1.checked;                                        // Flag für Darstellung der einfallenden Welle
  w2 = cb2.checked;                                        // Flag für Darstellung der reflektierten Welle
  w3 = cb3.checked;                                        // Flag für Darstellung der Gesamtwelle
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

// Elongation für einfallende Welle zur Zeit t:
// x ... Entfernung von Reflexionsstelle (Pixel)
  
function elong1 (x) {
  if (t < NWL*PER-x*K/OMEGA) return 0;                     // Falls Welle noch nicht angekommen, Rückgabewert 0
  var phi = OMEGA*(t-NWL*PER)-K*(LEN-x);                   // Phasenwinkel (Bogenmaß)
  return AMPL*Math.sin(phi);                               // Rückgabewert (Elongation, Pixel)
  }
    
// Elongation für reflektierte Welle zur Zeit t:
// x ... Entfernung von Reflexionsstelle (Pixel)
  
function elong2 (x) {
  if (t < NWL*PER+x*K/OMEGA) return 0;                     // Falls Welle noch nicht angekommen, Rückgabewert 0
  var phi = OMEGA*(t-NWL*PER)-K*(LEN+x)+dPhi;              // Phasenwinkel (Bogenmaß)
  return AMPL*Math.sin(phi);                               // Rückgabewert (Elongation, Pixel)
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Pfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Kreisscheibe mit schwarzem Rand:
// (x,y) ... Mittelpunktskoordinaten (Pixel)
// r ....... Radius (Pixel)
// c ....... Füllfarbe (optional)

function circle (x, y, r, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath();                                               // Neuer Pfad
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausfüllen
  ctx.stroke();                                            // Rand zeichnen
  }
  
// Wellen zeichnen:
  	
function waves () {
  var u1 = 0;                                              // Startwert für waagrechte Bildschirmkoordinate
  var e1 = elong1(LEN-u1);                                 // Elongation für einfallende Welle
  var e2 = elong2(LEN-u1);                                 // Elongation für reflektierte Welle
  var e3 = e1+e2;                                          // Elongation für Gesamtwelle
  var v11 = vM-e1;                                         // Senkrechte Bildschirmkoordinate für einfallende Welle
  var v12 = vM-e2;                                         // Senkrechte Bildschirmkoordinate für reflektierte Welle
  var v13 = vM-e3;                                         // Senkrechte Bildschirmkoordinate für Gesamtwelle
  while (u1 < LEN) {                                       // Solange rechtes Ende noch nicht erreicht ...
  	var u0 = u1;                                           // Ende der letzten Linien als Anfang der nächsten Linien
  	var v01 = v11, v02 = v12, v03 = v13;                   // Ende der letzten Linien als Anfang der nächsten Linien 
  	u1++;                                                  // Waagrechte Bildschirmkoordinate erhöhen 
  	e1 = elong1(LEN-u1);                                   // Elongation für einfallende Welle
  	e2 = elong2(LEN-u1);                                   // Elongation für reflektierte Welle
  	e3 = e1+e2;                                            // Elongation der Gesamtwelle
    v11 = vM-e1; v12 = vM-e2; v13 = vM-e3;                 // Senkrechte Bildschirmkoordinaten 
    var vLine = (u0%DIST == 0);                            // Bedingung für senkrechte Linie
    var d = 0;                                             // Im Normalfall keine Abweichung (Pixel)
    if (w1 && w2 && (e1 > 0 && e2 > 0 || e1 < 0 && e2 < 0))// Falls Linien übereinander ... 
      d = 0.5;	  	                                       // Abweichung (Pixel)
    if (w1) {                                              // Falls einfallende Welle gezeichnet werden soll ...
  	  line(u0,v01,u1,v11,color1);                          // Teil des Polygonzugs
  	  if (vLine) line(u0-d,vM,u0-d,v01);                   // Gegebenenfalls senkrechte Linie (knapp links)
  	  }
    if (w2) {                                              // Falls reflektierte Welle gezeichnet werden soll ...
  	  line(u0,v02,u1,v12,color2);                          // Teil des Polygonzugs
  	  if (vLine) line(u0+d,vM,u0+d,v02);                   // Gegebenenfalls senkrechte Linie (knapp rechts)
  	  }
    if (w3) {                                              // Falls Gesamtwelle gezeichnet werden soll ...
  	  line(u0,v03,u1,v13,color3);                          // Teil des Polygonzugs
  	  if (vLine) circle(u0,v03,2,color3);                  // Eventuell ausgefüllter Kreis
  	  }
    } // Ende while
  if (w1) line(u1-0.5,vM,u1-0.5,v11,color1);               // Senkrechte Linie am rechten Ende (knapp links)
  if (w2) line(u1+0.5,vM,u1+0.5,v12,color2);               // Senkrechte Linie am rechten Ende (knapp rechts)
  if (w3) circle(u1,v13,2,color3);                         // Ausgefüllter Kreis am rechten Ende
  }

// Grafikausgabe:
// Seiteneffekt t, t0
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (on && !singleStep) {                                 // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // Länge des Zeitintervalls (s)
    if (slow) dt /= 10;                                    // Falls Zeitlupe, Zeitintervall durch 10 dividieren
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  if (dPhi > 0)                                            // Falls Reflexion am festen Ende ...                              
    line(LEN,vM-180,LEN,vM+180);                           // Durchgezogene Linie 
  else {                                                   // Falls Reflexion am losen Ende ...
    for (var v=vM-180; v<=vM+180; v+=10)                   // Gestrichelte Linie
    line(LEN,v-3,LEN,v+3);
    }     
  waves();                                                 // Wellen
  line(0,vM,LEN,vM,"#000000");                             // Mittellinie
  if (!w3) return;                                         // Abbrechen, falls Gesamtwelle nicht gezeichnet wird
  for (var i=0; i<=12; i++) {                              // Für alle Knoten und Bäuche ...
    var node                                               // Bedingung für Knoten
      = (i%2 == 0 && dPhi == Math.PI                       // 1. Fall (festes Ende)          
        || i%2 == 1 && dPhi == 0);                         // 2. Fall (loses Ende)
    var s = (node ? symbolNode : symbolAntiNode);          // Symbol für Knoten bzw. Bauch
    var u = LEN-i*WL/4;                                    // Waagrechte Bildschirmkoordinate
    if (LEN-u > OMEGA/K*(t-NWL*PER)) break;                // Falls reflektierte Welle noch nicht angekommen, abbrechen
    ctx.fillText(s,u,vM+13);                               // Symbol für Knoten bzw. Bauch schreiben
    line(u,vM-3,u,vM+3);                                   // Zugehörige Linie
    }
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


