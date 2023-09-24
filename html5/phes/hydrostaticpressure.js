// Druckdose (hydrostatischer Druck)
// Java-Applet (03.02.1999) umgewandelt
// 02.02.1999 - 12.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind in einer eigenen Datei (zum Beispiel hydrostaticpressure_de.js) abgespeichert.

// Farben:

var colorBackground  = "#ffff00";                          // Hintergrundfarbe
var colorLiquid = "#0000ff";                               // Farbe für die Flüssigkeit
var colorPot = "#000000";                                  // Farbe für das Gefäß
var colorChamber = "#ff0000";                              // Farbe für die Druckdose
var colorAir = "#ffafaf";                                  // Farbe für die Luft in der Druckdose

// Sonstige Konstanten:

var YF = 230;                                              // y-Koordinate Flüssigkeitsoberfläche (Pixel)
var DENSITY  = [1.00, 1.00, 0.79, 0.88, 1.59, 13.55];      // Dichtewerte (g/cm³)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ch;                                                    // Auswahlfeld
var ip1, ip2;                                              // Eingabefelder
var op;                                                    // Ausgabefeld
var yD;                                                    // Oberer Rand der Druckdose (Pixel)
var rho;                                                   // Dichte (g/cm^3)
var h;                                                     // Tiefe (mm)
var p;                                                     // Druck (hPa)
var drag;                                                  // Flag für Zugmodus
var yM;                                                    // y-Koordinate Mauszeiger

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
  getElement("lb",text01);                                 // Erklärender Text (Flüssigkeit)
  ch = getElement("ch");                                   // Auswahlfeld (Flüssigkeit)
  prepareSelect();                                         // Auswahlfeld vorbereiten
  getElement("ip1a",text03);                               // Erklärender Text (Dichte)
  ip1 = getElement("ip1b");                                // Eingabefeld (Dichte)
  getElement("ip1c",gramPerCentimeter3);                   // Einheit (Dichte)
  getElement("ip2a",text04);                               // Erklärender Text (Tiefe)
  ip2 = getElement("ip2b");                                // Eingabefeld (Tiefe)
  getElement("ip2c",centimeter);                           // Einheit (Tiefe) 
  getElement("opa",text05);                                // Erklärender Text (Schweredruck)
  op = getElement("opb");                                  // Ausgabefeld (Schweredruck)
  getElement("opc",hectoPascal);                           // Einheit (Schweredruck)          
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer 
  yD = 190;                                                // Oberer Rand der Dose (Pixel) 
  rho = 1;                                                 // Dichte (g/cm³)
  h = yD-YF;                                               // Tiefe (mm) 
  p = rho*0.0981*h;                                        // Druck (hPa)
  updateInput();                                           // Eingabefelder aktualisieren
  updateOutput();                                          // Ausgabefeld aktualisieren
  focus(ip1);                                              // Fokus für erstes Eingabefeld
  paint();                                                 // Zeichnen
  ip1.onkeydown = reactionEnter1;                          // Reaktion auf Enter-Taste (Eingabe Dichte)
  ip2.onkeydown = reactionEnter2;                          // Reaktion auf Enter-Taste (Eingabe Tiefe)
  ip1.onblur = reaction1;                                  // Reaktion auf Verlust des Fokus (Eingabe Dichte)
  ip2.onblur = reaction2;                                  // Reaktion auf Verlust des Fokus (Eingabe Tiefe)
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (Flüssigkeit)
  ch.onclick = reactionSelect;                             // Reaktion auf Auswahlfeld (Flüssigkeit)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers    
  } // Ende start
  
// Auswahlfeld vorbereiten:
// Seiteneffekt ch

function prepareSelect () {
  for (var i=0; i<text02.length; i++) {
    var o = document.createElement("option");              // Neues option-Element
    o.text = text02[i];                                    // Text übernehmen
    ch.add(o);                                             // Element zum Auswahlfeld hinzufügen
    }
  ch.selectedIndex = 1;                                    // Voreinstellung (Wasser)
  }
  
// Reaktion auf Auswahlfeld für Flüssigkeit:
// Seiteneffekt rho, ip1, h, p, op

function reactionSelect () {
  rho = DENSITY[ch.selectedIndex];                         // Dichte (g/cm³)
  ip1.value = ToString(rho,3,false);                       // Eingabefeld Dichte
  h = yD-YF;                                               // Tiefe (mm)
  p = rho*0.0981*h;                                        // Druck (hPa)
  updateOutput();                                          // Ausgabe aktualisieren
  paint();                                                 // Neu zeichnen
  }
  
// Eingabe Dichte, Berechnungen, Ausgabe, neu zeichnen:
// Seiteneffekt ch, rho, h, p, op
   
function reaction1 () {
  ch.selectedIndex = 0;                                    // Flüssigkeit unbekannt
  rho = inputNumber(ip1,2,false,0.1,20);                   // Dichte (g/cm³)
  h = yD-YF;                                               // Tiefe (mm)
  p = rho*0.0981*h;                                        // Druck (hPa)
  updateOutput();                                          // Ausgabe aktualisieren
  paint();                                                 // Neu zeichnen
  focus(ip2);                                              // Fokus für nächstes Eingabefeld
  } 
      
// Reaktion auf Tastendruck (Eingabefeld Dichte, Enter-Taste):
// Seiteneffekt ch, rho, h, p, op 
  
function reactionEnter1 (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  reaction1();                                             // Dichte übernehmen, rechnen, Ausgabe, neu zeichnen                          
  }
  
// Eingabe Tiefe, Berechnungen, Ausgabe, neu zeichnen:
// Seiteneffekt h, yD, p, op  
   
function reaction2 () {
  h = 10*inputNumber(ip2,2,false,0,5);                     // Tiefe (mm)
  yD = YF+h;                                               // Oberer Rand der Druckdose (Pixel)
  p = rho*0.0981*h;                                        // Druck (hPa)
  updateOutput();                                          // Ausgabe aktualisieren
  paint();                                                 // Neu zeichnen
  ip2.blur();                                              // Fokus abgeben
  }   
  
// Reaktion auf Tastendruck (Eingabefeld Tiefe, Enter-Taste):
// Seiteneffekt h, yD, p, op  
  
function reactionEnter2 (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  reaction2();                                             // Tiefe übernehmen, rechnen, Ausgabe, neu zeichnen                          
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Zugmodus)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Zugmodus)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
// Seiteneffekt drag
  
function reactionMouseUp (e) {   
  drag = false;                                            // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Berührung:
// Seiteneffekt drag
  
function reactionTouchEnd (e) { 
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }    
  
// Reaktion auf Mausklick oder Berühren mit dem Finger:
// Seiteneffekt yM,drag

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  yM = y;                                                  // y-Koordinate Mauszeiger (Pixel)
  drag = true;                                             // Zugmodus einschalten
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// Seiteneffekt yD, yM, h, p, ip2, op

function reactionMove (x, y) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche
  yD += (y-yM);                                            // y-Koordinate Druckdose
  if (yD > 280) yD = 280;                                  // Falls zu tief, korrigieren
  if (yD < YF-40) yD = YF-40;                              // Falls zu hoch, korrigieren
  yM = y;                                                  // y-Koordinate Mauszeiger (Pixel)
  h = yD-YF;                                               // Tiefe (mm)
  p = rho*0.0981*h;                                        // Druck (hPa) 
  ip2.value = ToString(0.1*Math.max(h,0),2,false);         // Eingabefeld Tiefe
  updateOutput();                                          // Ausgabe aktualisieren     
  paint();                                                 // Neu zeichnen
  }

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  if (n == 1000) s = "1000";                               // Ausnahme, um "1,00e+3" zu verhindern
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
    
// Aktualisierung der Eingabefelder:

function updateInput () {
  ip1.value = ToString(rho,3,false);                       // Eingabefeld Dichte
  ip2.value = ToString(0.1*Math.max(h,0),2,false);         // Eingabefeld Tiefe
  }
    
// Aktualisierung des Ausgabefelds:

function updateOutput () {
  op.innerHTML = ToString(Math.max(p,0),2,false);          // Ausgabefeld Druck (hPa)
  }
  
//-------------------------------------------------------------------------------------------------
  
// Neuer Pfad mit Standardwerten:
// w ... Liniendicke (optional, Defaultwert 1)

function newPath(w) {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (w) ctx.lineWidth = w;                                // Liniendicke festlegen, falls angegeben
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Ausgefülltes Rechteck:
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... Höhe (Pixel)
// c ... Füllfarbe
// r ... Flag für Rand (optional, Defaultwert false)

function rectangle (x, y, w, h, c, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)                            
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausfüllen
  if (r) ctx.strokeRect(x,y,w,h);                          // Falls gewünscht, Rand zeichnen
  }
      
// Druckdose:
    
function manometer () {
  newPath();                                               // Neuer Grafikpfad (Druckdose)
  ctx.moveTo(80,yD);                                       // Anfangspunkt (links oben)
  ctx.lineTo(80,yD+30);                                    // Linie nach unten
  ctx.lineTo(140,yD+30);                                   // Linie nach rechts
  ctx.lineTo(140,yD);                                      // Linie nach oben
  var y = yD+0.5*Math.max(p,0);                            // Hilfsgröße für Durchbiegung der Membran
  ctx.quadraticCurveTo(110,y,80,yD);                       // Membran  
  ctx.fillStyle = colorChamber;                            // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Druckdose (mit Rand)
  rectangle(170,yD-165,55,110,"#ffffff",true);             // Hintergrund der Skala
  line(172,yD-110,223,yD-110);                             // Mittellinie
  for (var i=-1; i<=1; i++)                                // Für alle Indizes ...
    line(210,yD-110+25*i,218,yD-110+25*i);                 // Lange Linie
  for (i=-5; i<=5; i++)                                    // Für alle Indizes ...
    y0 = line(210,yD-110+5*i,215,yD-110+5*i);              // Kurze Linie 
  var dy = (yD<YF ? 0 : (yD-YF)/2);                        // Abweichung gegenüber Mittellinie (Pixel)
  newPath();                                               // Neuer Grafikpfad (1. Teil Glasröhrchen)
  ctx.moveTo(140,yD+18);                                   // Anfangspunkt (bei Druckdose, unten)
  ctx.lineTo(150,yD+18);                                   // Linie nach rechts
  ctx.arcTo(163,yD+18,163,yD+5,13);                        // Kreisbogen 90° im Gegenuhrzeigersinn
  ctx.lineTo(163,yD-140);                                  // Linie nach oben
  ctx.arcTo(163,yD-147,170,yD-147,7);                      // Kreisbogen 90° im Uhrzeigersinn
  ctx.arcTo(177,yD-147,177,yD-140,7);                      // Kreisbogen 90° im Uhrzeigersinn
  ctx.lineTo(177,yD-110+dy);                               // Linie nach unten
  ctx.lineTo(183,yD-110+dy);                               // Linie nach rechts
  ctx.lineTo(183,yD-140);                                  // Linie nach oben
  ctx.arcTo(183,yD-153,170,yD-153,13);                     // Kreisbogen 90° im Gegenuhrzeigersinn
  ctx.arcTo(157,yD-153,157,yD-140,13);                     // Kreisbogen 90° im Gegenuhrzeigersinn
  ctx.lineTo(157,yD+5);                                    // Linie nach unten
  ctx.arcTo(157,yD+12,150,yD+12,7);                        // Kreisbogen 90° im Uhrzeigersinn
  ctx.lineTo(140,yD+12);                                   // Linie nach links
  ctx.lineTo(140,yD+18);                                   // Zurück zum Anfangspunkt 
  ctx.fillStyle = colorAir;                                // Füllfarbe
  ctx.fill(); ctx.stroke();                                // 1. Teil Glasröhrchen  
  newPath();                                               // Neuer Grafikpfad (2. Teil Glasröhrchen)
  ctx.moveTo(177,yD-110+dy);                               // Anfangspunkt (links oben)
  ctx.lineTo(177,yD-80);                                   // Linie nach unten
  ctx.arcTo(177,yD-67,190,yD-67,13);                       // Kreisbogen 90° im Gegenuhrzeigersinn
  ctx.arcTo(203,yD-67,203,yD-80,13);                       // Kreisbogen 90° im Gegenuhrzeigersinn
  ctx.lineTo(203,yD-110-dy);                               // Linie nach oben
  ctx.lineTo(197,yD-110-dy);                               // Linie nach links
  ctx.lineTo(197,yD-80);                                   // Linie nach unten
  ctx.arcTo(197,yD-73,190,yD-73,7);                        // Kreisbogen 90° im Uhrzeigersinn
  ctx.arcTo(183,yD-73,183,yD-80,7);                        // Kreisbogen 90° im Uhrzeigersinn
  ctx.lineTo(183,yD-110+dy);                               // Linie nach oben  
  ctx.lineTo(177,yD-110+dy);                               // Zurück zum Anfangspunkt
  ctx.fillStyle = colorLiquid;                             // Füllfarbe
  ctx.fill(); ctx.stroke();                                // 2. Teil Glasröhrchen  
  line(203,yD-110-dy,203,yD-150);                          // 3. Teil Glasröhrchen (rechts)
  line(197,yD-110-dy,197,yD-150);                          // 3. Teil Glasröhrchen (links)
  }
    
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe Versuchsaufbau
  ctx.fillRect(0,0,width,300);                             // Hintergrund ausfüllen
  rectangle(50,YF,200,80,colorLiquid);                     // Flüssigkeit in der Wanne
  rectangle(40,YF+80,220,10,colorPot);                     // Gefäßboden
  rectangle(40,YF-30,10,110,colorPot);                     // Linke Gefäßwand
  rectangle(250,YF-30,10,110,colorPot);                    // Rechte Gefäßwand
  manometer();                                             // Druckdose  
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der HTML-Seite Methode start ausführen

