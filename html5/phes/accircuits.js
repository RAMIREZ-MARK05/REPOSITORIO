// Einfache Wechselstromkreise
// Java-Applet (11.06.1998) umgewandelt
// 21.09.2014 - 15.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel accircuits_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorVoltage = "#0000ff";                              // Farbe für Spannung
var colorAmperage = "#ff0000";                             // Farbe für Stromstärke

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var T0 = 5;                                                // Fiktive Schwingungsdauer (s)
var OMEGA0 = 2*Math.PI/T0;                                 // Fiktive Kreisfrequenz (1/s)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var rbR, rbC, rbL;                                         // Radiobuttons
var bu1, bu2;                                              // Schaltknöpfe (Reset, Start/Pause/Weiter)
var cbSlow;                                                // Optionsfeld Zeitlupe
var lbRCL, lbUnitRCL;                                      // Labels (Widerstand/Kapazität/Induktivität, zugehörige Einheit)
var ipNy, ipRCL, ipU0;                                     // Eingabefelder
var opI0;                                                  // Ausgabefeld (Scheitelstromstärke)
var lbUnitI;                                               // Label für Stromstärkeeinheit
var on;                                                    // Flag für Bewegung
var slow;                                                  // Flag für Zeitlupe
var t0;                                                    // Anfangszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var ny;                                                    // Frequenz (Hz)
var omega;                                                 // Kreisfrequenz (1/s)
var u0;                                                    // Maximale Spannung (V)
var i0;                                                    // Maximale Stromstärke (A)
var r;                                                     // Widerstand (Ohm)
var c;                                                     // Kapazität (F)
var l;                                                     // Induktivität (H)
var phi;                                                   // Phasenwinkel für Spannung (Bogenmaß)
var psi;                                                   // Phasenwinkel für Stromstärke (Bogenmaß)
var dPhi;                                                  // Phasenverschiebung (Bogenmaß)

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
  rbR = getElement("rbR");                                 // Radiobutton (Widerstand)
  getElement("lbR",text01);                                // Erklärender Text (Widerstand)
  rbR.checked = true;                                      // Radiobutton ausgewählt
  rbC = getElement("rbC");                                 // Radiobutton (Kondensator)
  getElement("lbC",text02);                                // Erklärender Text (Kondensator)
  rbL = getElement("rbL");                                 // Radiobutton (Spule)
  getElement("lbL",text03);                                // Erklärender Text (Spule)
  bu1 = getElement("bu1",text04);                          // Resetknopf
  bu2 = getElement("bu2",text05[0]);                       // Startknopf
  bu2.state = 0;                                           // Anfangszustand (vor Start der Animation)
  cbSlow = getElement("cbSlow");                           // Optionsfeld (Zeitlupe)
  getElement("lbSlow",text06);                             // Erklärender Text (Zeitlupe)
  cbSlow.checked = false;                                  // Zeitlupe abgeschaltet
  getElement("ipNya",text07);                              // Erklärender Text (Frequenz)
  ipNy = getElement("ipNyb");                              // Eingabefeld (Frequenz)
  getElement("ipNyc",hertz);                               // Einheit (Frequenz)
  getElement("ipU0a",text08);                              // Erklärender Text (Scheitelspannung)
  ipU0 = getElement("ipU0b");                              // Eingabefeld (Scheitelspannung)
  getElement("ipU0c",volt);                                // Einheit (Scheitelspannung)
  lbRCL = getElement("ipRCLa");                            // Erklärender Text (Widerstand/Kapazität/Induktivität)
  ipRCL = getElement("ipRCLb");                            // Eingabefeld (Widerstand/Kapazität/Induktivität)
  lbUnitRCL = getElement("ipRCLc");                        // Einheit (Widerstand/Kapazität/Induktivität)
  getElement("opI0a",text12);                              // Erklärender Text (Scheitelstromstärke)             
  opI0 = getElement("opI0b");                              // Ausgabefeld (Scheitelstromstärke)
  lbUnitI = getElement("opI0c");                           // Einheit (Scheitelstromstärke)
  getElement("author",author);                             // Autor (und Übersetzer)

  ny = 50;                                                 // Anfangswert für Frequenz (Hz) 
  u0 = 10;                                                 // Anfangswert für maximale Spannung
  r = 500;                                                 // Anfangswert für Widerstand (Ohm) 
  c = 0.0001;                                              // Anfangswert für Kapazität (Farad)
  l = 200;                                                 // Anfangswert für Indiktivität (Henry)
  dPhi = 0;                                                // Anfangswert für Phasenverschiebung
  reaction(false);                                         // Eingabefelder aktualisieren, rechnen, Ausgabe aktualisieren
  focus(ipNy);                                             // Fokus für erstes Eingabefeld    
  on = false;                                              // Animation abgeschaltet
  slow = false;                                            // Zeitlupe abgeschaltet
  t = 0;                                                   // Aktuelle Zeit (s)
  t0 = new Date();                                         // Anfangszeitpunkt
  setInterval(paint,40);                                   // Timer-Intervall 0,040 s

  rbR.onclick = reactionRadioButton;                       // Reaktion auf Radiobutton Widerstand
  rbC.onclick = reactionRadioButton;                       // Reaktion auf Radiobutton Kondensator
  rbL.onclick = reactionRadioButton;                       // Reaktion auf Radiobutton Spule
  bu1.onclick = reactionReset;                             // Reaktion auf Resetknopf
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf Start/Pause/Weiter
  cbSlow.onclick = reactionSlow;                           // Reaktion auf Optionsfeld Zeitlupe
  ipNy.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Frequenz)
  ipU0.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Scheitelspannung)
  ipRCL.onkeydown = reactionEnter;                         // Reaktion auf Enter-Taste (Eingabe Widerstand/Kapazität/Induktivität)  
  ipNy.onblur = reactionBlur;                              // Reaktion auf Verlust des Fokus (Eingabe Frequenz)
  ipU0.onblur = reactionBlur;                              // Reaktion auf Verlust des Fokus (Eingabe Scheitelspannung)
  ipRCL.onblur = reactionBlur;                             // Reaktion auf Verlust des Fokus (Eingabe Widerstand/Kapazität/Induktivität)  
  } // Ende der Methode start
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text05[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
  
// Aktivierung beziehungsweise Deaktivierung der Eingabefelder:
// p ... Flag für mögliche Eingabe

function enableInput (p) {
  rbR.disabled = !p;                                       // Radiobutton für Widerstand 
  rbC.disabled = !p;                                       // Radiobutton für Kondensator
  rbL.disabled = !p;                                       // Radiobutton für Spule
  ipNy.readOnly = !p;                                      // Eingabefeld für Frequenz
  ipU0.readOnly = !p;                                      // Eingabefeld für maximale Spannung
  ipRCL.readOnly = !p;                                     // Eingabefeld für Widerstand/Kapazität/Induktivität
  }
  
// Reaktion auf Resetknopf:
// Seiteneffekt bu2.state, t, on, slow, ny, u0, r, c, l, omega, i0
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  enableInput(true);                                       // Eingabefelder aktivieren
  t = 0;                                                   // Zeitvariable zurücksetzen
  on = false;                                              // Animation abgeschaltet
  slow = cbSlow.checked;                                   // Flag für Zeitlupe
  reaction(true);                                          // Eingegebene Werte übernehmen, rechnen, Ausgabe aktualisieren
  focus(ipNy);                                             // Fokus für erstes Eingabefeld
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt t0, bu2.state, on, slow, ny, u0, r, c, l, omega, i0

function reactionStart () {
  if (bu2.state != 1) t0 = new Date();                     // Falls Animation angeschaltet, neuer Anfangszeitpunkt
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  enableInput(false);                                      // Eingabefelder deaktivieren
  on = (bu2.state == 1);                                   // Flag für Animation
  slow = cbSlow.checked;                                   // Flag für Zeitlupe
  reaction(true);                                          // Eingegebene Werte übernehmen, rechnen, Ausgabe aktualisieren
  }
  
// Reaktion auf Optionsfeld Zeitlupe:
// Seiteneffekt slow

function reactionSlow () {
  slow = cbSlow.checked;                                   // Flag setzen
  }
  
// Hilfsroutine: Eingabe übernehmen oder Eingabefelder anpassen, Berechnungen durchführen und Ausgabe aktualisieren
// ip ... Flag für Übernahme der Daten aus den Eingabefeldern
// Seiteneffekt ny, u0, r, c, l, omega, i0

function reaction (ip) {
  if (ip) input();                                         // Eingegebene Werte übernehmen (eventuell korrigiert) ...
  else updateInput();                                      // ... oder Eingabefelder anpassen
  calculation();                                           // Berechnungen
  updateOutput();                                          // Ausgabe aktualisieren
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt ny, u0, r, c, l, omega, i0
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (enter) reaction(true);                               // Falls Enter-Taste, Daten übernehmen, rechnen und neu zeichnen                        
  }
  
// Reaktion auf Verlust des Fokus:
  
function reactionBlur () {
  reaction(true);                                          // Allgemeinere Methode aufrufen
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }

// Reaktion auf Radiobutton:
// Seiteneffekt dPhi, r, c, l, ny, u0, omega, i0

function reactionRadioButton () {
  if (rbR.checked) {dPhi = 0; r = 500;}                    // Für Widerstand: Phasenverschiebung, Widerstand
  else if (rbC.checked) {dPhi = Math.PI/2; c = 0.0001;}    // Für Kondensator: Phasenverschiebung, Kapazität
  else {dPhi = -Math.PI/2; l = 200;}                       // Für Spule: Phasenverschiebung, Induktivität
  reaction(false);                                         // Eingabefelder aktualisieren, rechnen, Ausgabe aktualisieren
  focus(ipRCL);                                            // Fokus für letztes (!) Eingabefeld
  }

//-------------------------------------------------------------------------------------------------

// Berechnungen:
// Seiteneffekt omega, i0 

function calculation () {
  omega = 2*Math.PI*ny;                                    // Kreisfrequenz (1/s)
  if (dPhi == 0) i0 = u0/r;                                // Maximale Stromstärke (A, für Widerstand)
  else if (dPhi > 0) i0 = u0*omega*c;                      // Maximale Stromstärke (A, für Kondensator)
  else i0 = u0/(omega*l);                                  // Maximale Stromstärke (A, für Spule)
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
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
   
// Gesamte Eingabe:
// Seiteneffekt ny, u0, r, c, l

function input () {
  var ae = document.activeElement;                         // Aktives Element
  ny = inputNumber(ipNy,3,false,0.1,100);                  // Frequenz (Hz)
  u0 = inputNumber(ipU0,3,false,0.1,100);                  // Maximale Spannung (V)
  if (dPhi == 0) r = inputNumber(ipRCL,3,false,10,1000);   // Falls Widerstand, Eingabe in Ohm
  else if (dPhi > 0)                                       // Falls Kondensator ...
    c = 1e-6*inputNumber(ipRCL,3,false,1,100);             // ... Eingabe der Kapazität in Mikrofarad, Umrechnung in Farad
  else l = inputNumber(ipRCL,3,false,10,1000);             // Falls Spule, Eingabe der Induktivität in Henry 
  if (ae == ipNy) focus(ipU0);                             // Fokus für nächstes Eingabefeld
  if (ae == ipU0) focus(ipRCL);                            // Fokus für nächstes Eingabefeld
  if (ae == ipRCL) ipRCL.blur();                           // Fokus abgeben                
  } 
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ipNy.value = ToString(ny,3,false);                       // Eingabefeld für Frequenz (Hz)
  ipU0.value = ToString(u0,3,false);                       // Eingabefeld für maximale Spannung (V)
  if (dPhi == 0) {                                         // Falls ohmscher Widerstand ...
    lbRCL.innerHTML = text09;                              // ... Bezeichnung Widerstand
    ipRCL.value = ToString(r,3,false);                     // ... Zeichenkette für Widerstandswert
    lbUnitRCL.innerHTML = ohm;                             // ... Einheit Ohm
    }
  else if (dPhi > 0) {                                     // Falls Kondensator ...
    lbRCL.innerHTML = text10;                              // ... Bezeichnung Kapazität
    ipRCL.value = ToString(1e6*c,3,false);                 // ... Zeichenkette für Wert der Kapazität
    lbUnitRCL.innerHTML = microfarad;                      // ... Einheit Mikrofarad
    }
  else {                                                   // Falls Spule ...
    lbRCL.innerHTML = text11;                              // ... Bezeichnung Induktivität
    ipRCL.value = ToString(l,3,false);                     // ... Zeichenkette für Wert der Induktivität
    lbUnitRCL.innerHTML = henry;                           // ... Einheit Henry
    }
  }

// Aktualisierung der Ausgabefelder:

function updateOutput () {
  var number, unit;                              
  if (i0 >= 1) {                                           // Falls mindestens 1 A, Einheit A
    number = ToString(i0,3,false);                         // Zahlenwert
    unit = ampere;                                         // Einheit A
    } 
  else if (i0 >= 0.001) {                                  // Falls zwischen 0,001 A und 1 A, Einheit mA
    number = ToString(i0*1000,3,false);                    // Zahlenwert
    unit = milliampere;                                    // Einheit mA
    }
  else {                                                   // Falls weniger als 0,001 A, Einheit µA
    number = ToString(i0*1e6,3,false);                     // Zahlenwert
    unit = microampere;                                    // Einheit µA
    }
  opI0.innerHTML = number;                                 // Ausgabe des Zahlenwertes
  lbUnitI.innerHTML = unit;                                // Ausgabe der Stromstärkeeinheit  
  }
   
//-------------------------------------------------------------------------------------------------

// Neuer Pfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie der Dicke 1:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional)
// w ......... Liniendicke (optional)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Pfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }

// Rechteck mit schwarzem Rand:
// (x,y) ... Koordinaten der Ecke links oben (Pixel)
// w ....... Breite (Pixel)
// h ....... Höhe (Pixel)
// c ....... Füllfarbe (optional)

function rectangle (x, y, w, h, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath();                                               // Neuer Pfad
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausfüllen
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen
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
    
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // Länge
  if (length == 0) return;                                 // Abbruch, falls Länge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt für Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad für Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Text ausrichten (Zeichensatz FONT):
// s ....... Zeichenkette
// t ....... Typ (0 für linksbündig, 1 für zentriert, 2 für rechtsbündig)
// (x,y) ... Position (Pixel)

function alignText (s, t, x, y) {
  ctx.font = FONT;                                         // Zeichensatz
  if (t == 0) ctx.textAlign = "left";                      // Je nach Wert von t linksbündig ...
  else if (t == 1) ctx.textAlign = "center";               // ... oder zentriert ...
  else ctx.textAlign = "right";                            // ... oder rechtsbündig
  ctx.fillText(s,x,y);                                     // Text ausgeben
  }
  
// Widerstand zeichnen:

function resistor () {
  ctx.fillStyle = "#000000";                               // Füllfarbe schwarz
  ctx.fillRect(55,65,85,30);                               // Äußeres Rechteck
  ctx.fillStyle = colorBackground;                         // Füllfarbe wie Hintergrund
  ctx.fillRect(58,68,79,24);                               // Inneres Rechteck
  }
  
// Kondensator zeichnen:

function condensator () {
  ctx.fillStyle = "#000000";                               // Füllfarbe schwarz
  ctx.fillRect(88,60,5,40);                                // Linke Platte
  ctx.fillRect(102,60,5,40);                               // Rechte Platte
  newPath();                                               // Neuer Pfad (Standardwerte)
  ctx.moveTo(55,80); ctx.lineTo(90,80);                    // Anschlussdraht links vorbereiten
  ctx.moveTo(140,80); ctx.lineTo(105,80);                  // Anschlussdraht rechts vorbereiten
  ctx.stroke();                                            // Anschlussdrähte zeichnen
  }
  
// Spule zeichnen (Näherung durch Polygonzug):

function coil () {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 2;                                       // Liniendicke
  ctx.moveTo(55,80);                                       // Anfangspunkt
  for (i=0; i <= 150; i++) {                               // Für alle Zwischenpunkte ... 
    var w = i*Math.PI/10;                                  // Winkel (Bogenmaß) 
    var x, y;                                              // Koordinaten des nächsten Punktes
    if (i < 10) x = 55+1.5*i;                              // x-Koordinate für Punkt im linken Teil                            
    else if (i >= 10 && i <= 140)                          // x-Koordinate für Punkt im mittleren Teil 
      x = 60+0.5*i-5*Math.cos(w);
    else x = 1.5*i-85;                                     // x-Koordinate für Punkt im rechten Teil
    y = 80-15*Math.sin(w);                                 // y-Koordinate
    ctx.lineTo(x,y);                                       // Linie vorbereiten
    i++;                                                   // Zähler erhöhen
    }
  ctx.stroke();                                            // Spule zeichnen
  }
  
// Zeiger-Messgerät zeichnen:
// (x,y) .... Position der Zeiger-Drehachse (Pixel)
// type ..... Art des Messgeräts (0 für Spannung, 1 für Stromstärke)
// part ..... Bruchteil des Vollausschlags

function meter (x, y, type, part) {
  var w = part*0.2*Math.PI;                                // Winkel für Zeiger (Bogenmaß)
  var x1 = x+35*Math.sin(w);                               // x-Koordinate des Zeigerendpunkts (Pixel)
  var y1 = y-35*Math.cos(w);                               // y-Koordinate des Zeigerendpunkts (Pixel)
  rectangle(x-30,y-50,60,40,"#ffffff");                    // Oberer Teil (mit Skala)
  line(x,y,x1,y1,"#000000",2);                             // Zeiger (wird später teilweise verdeckt)
  for (i=-2; i<=2; i++) {                                  // Für alle Markierungen der Skala ...
    if (i == 0) continue;                                  // In der Mitte kein Strich
    var ww = i*0.1*Math.PI;                                // Winkel (Bogenmaß)
    var sin = Math.sin(ww), cos = Math.cos(ww);            // Trigonometrische Werte
    var r1 = 38, r2 = (i%2==0 ? 45 : 43);                  // Radius für das untere bzw. obere Ende des Skalenstrichs
    x1 = x+r1*sin; y1 = y-r1*cos;                          // Koordinaten für das untere Ende des Skalenstrichs
    var x2 = x+r2*sin, y2 = y-r2*cos;                      // Koordinaten für das obere Ende des Skalenstrichs
    line(x1,y1,x2,y2,"#000000",2.5);                       // Skalenstrich zeichnen
    }
  ctx.fillStyle = "#000000";                               // Füllfarbe schwarz
  alignText("0",1,x,y-38);                                 // Nullmarkierung der Skala
  var c = (type==0 ? colorVoltage : colorAmperage);        // Farbe für Messgerät
  rectangle(x-30,y-10,60,20,c);                            // Unterer Teil
  circle(x-15,y,2.5,"#000000");                            // Linke Buchse
  circle(x+15,y,2.5,"#000000");                            // Rechte Buchse  
  var u = (type==0 ? volt : ampere);                       // Einheit
  alignText(u,1,x,y+5);                                    // Einheit schreiben
  }
  
// Stromkreis zeichnen:

function circuit () {
  var sinPhi = Math.sin(phi), sinPsi = Math.sin(psi);      // Trigonometrische Werte
  meter(210,150,0,sinPhi);                                 // Voltmeter
  meter(300,80,1,sinPsi);                                  // Amperemeter
  if (dPhi == 0) resistor();                               // Widerstand zeichnen
  else if (dPhi > 0) condensator();                        // Kondensator zeichnen
  else coil();                                             // Spule zeichnen
  circle(193,200,4.5,"#000000");                           // Stromquelle, linke Buchse
  circle(193,200,3.5,colorBackground);
  circle(227,200,4.5,"#000000");                           // Stromquelle, rechte Buchse
  circle(227,200,3.5,colorBackground);
  newPath();                                               // Neuer Pfad (Standardwerte)
  ctx.moveTo(190,200);                                     // Anfangspunkt (linke Buchse der Spannungsquelle)
  ctx.lineTo(30,200);                                      // Weiter nach links
  ctx.lineTo(30,80);                                       // Weiter nach oben
  ctx.lineTo(55,80);                                       // Weiter zum linken Anschluss RCL
  ctx.moveTo(140,80);                                      // Neuer Anfangspunkt (rechter Anschluss RCL)
  ctx.lineTo(285,80);                                      // Zum linken Anschluss des Amperemeters
  ctx.moveTo(315,80);                                      // Neuer Anfangspunkt (rechter Anschluss des Amperemeters)
  ctx.lineTo(390,80);                                      // Weiter nach rechts
  ctx.lineTo(390,200);                                     // Weiter nach unten
  ctx.lineTo(230,200);                                     // Zum Endpunkt (rechte Buchse der Spannungsquelle)
  ctx.moveTo(30,150);                                      // Neuer Anfangspunkt (Knoten links)
  ctx.lineTo(195,150);                                     // Weiter zum linken Anschluss des Voltmeters
  ctx.moveTo(390,150);                                     // Neuer Anfangspunkt (Knoten rechts)
  ctx.lineTo(225,150);                                     // Weiter zum rechten Anschluss des Voltmeters
  ctx.stroke();                                            // Drähte zeichnen
  circle(30,150,3,"#000000");                              // Knoten links
  circle(390,150,3,"#000000");                             // Knoten rechts
  ctx.font = "normal normal bold 24px monospace";          // Zeichensatz für Wechselspannungssymbol
  ctx.textAlign = "center";                                // Ausrichtung zentriert
  ctx.fillText("\u007e",210,215);                          // Symbol ~ für Wechselspannung
  if (Math.abs(sinPhi) > 0.05) {                           // Falls Spannung nicht sehr klein ...
    var x = (sinPhi>0 ? 227 : 193);                        // ... x-Koordinate für Pluszeichen
    ctx.fillText("+",x,190);                               // ... Pluszeichen
    ctx.fillText("-",420-x,190);                           // ... Minuszeichen
    }
  ctx.strokeStyle = colorAmperage;                         // Farbe für Stromstärke
  if (sinPsi > 0.05) arrow(220,70,200,70,2);               // Strompfeil nach links
  else if (sinPsi < -0.05) arrow(200,70,220,70,2);         // Strompfeil nach rechts
  }
  
// Zeiger-Diagramm zeichnen:
// (x,y) ... Ursprung (Pixel)

function pointerDiagram (x, y) {
  newPath();
  arrow(x-60,y,x+70,y);                                    // Waagrechte Achse
  arrow(x,y+60,x,y-70);                                    // Senkrechte Achse
  ctx.strokeStyle = colorVoltage;                          // Farbe für Spannung
  var x1 = x+50*Math.cos(phi);                             // x-Koordinate Pfeilende
  var y1 = y-50*Math.sin(phi);                             // y-Koordinate Pfeilende
  arrow(x,y,x1,y1,2);                                      // Pfeil für Spannung
  if (y1 != y) line(x-60,y1,390,y1);                       // Hilfslinie für Spannung         
  ctx.strokeStyle = colorAmperage;                         // Farbe für Stromstärke
  x1 = x+35*Math.cos(psi);                                 // x-Koordinate Pfeilende
  y1 = y-35*Math.sin(psi);                                 // y-Koordinate Pfeilende
  arrow(x,y,x1,y1,2);                                      // Pfeil für Stromstärke
  if (y1 != y) line(x-60,y1,390,y1);                       // Hilfslinie für Stromstärke
  }
  
// Sinuskurve (Näherung durch Polygonzug), Markierung der aktuellen Werte
// (x,y) ... Nullpunkt (Pixel)
// per ..... Periode (Pixel)
// ampl .... Amplitude (Pixel)
// xMin .... Minimaler x-Wert (Pixel)
// xMax .... Maximaler x-Wert (Pixel)
// xP ...... Aktueller x-Wert (Pixel)

function sinus (x, y, per, ampl, xMin, xMax, xP) {
  var k = 2*Math.PI/per;                                   // Hilfsgröße
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = 1;                                       // Liniendicke
  var xx = xMin;                                           // x-Koordinate für linken Rand
  ctx.moveTo(xx,y-ampl*Math.sin(k*(xx-x)));                // Anfangspunkt 
  while (xx < xMax) {                                      // Solange rechter Rand noch nicht erreicht ...
    xx++;                                                  // x-Koordinate erhöhen
    ctx.lineTo(xx,y-ampl*Math.sin(k*(xx-x)));              // Neue Teilstrecke vorbereiten
    }
  ctx.stroke();                                            // Polygonzug für Kurve zeichnen
  if (xP < xMin || xP > xMax) return;                      // Falls Markierung außerhalb der Grenzen, abbrechen
  var yP = y-ampl*Math.sin(k*(xP-x));                      // y-Koordinate für Markierung (Pixel)
  if (xP >= 0) circle(xP,yP,2);                            // Markierung zeichnen
  }
  
// t-U- und t-I-Diagramm zeichnen:
// (x,y) ... Ursprung (Pixel)
// Sobald t einen der Werte 3T, 6T, 9T usw. erreicht, springen die Markierungen zurück zu t = 0

function tUIDiagram (x, y) {      
  newPath();
  arrow(x-10,y,x+200,y);                                   // Waagrechte Achse             
  arrow(x,y+60,x,y-70);                                    // Senkrechte Achse 
  alignText(symbolTime,0,x+195,y+14);                      // Beschriftung (Variable für Zeit) 
  var n = Math.floor(t/(3*T0));                            // Angabe, wie oft drei Perioden vollständig durchlaufen wurden
  var tD = t-n*3*T0;                                       // Reduzierte Zeit (s) für Markierungen der aktuellen Werte    	
  var xx = x+60*tD/T0;                                     // x-Koordinate der Markierungen (Pixel)
  ctx.strokeStyle = ctx.fillStyle = colorVoltage;          // Farbe für Spannung
  sinus(x,y,60,50,x,x+180,xx);                             // Sinuskurve für Spannung
  alignText(symbolVoltage,2,x-5,y-65);                     // Beschriftung (Variable für Spannung)
  ctx.strokeStyle = ctx.fillStyle = colorAmperage;         // Farbe für Stromstärke
  var xSin = x;                                            // Position Nulldurchgang (Widerstand)
  if (dPhi > 0) xSin = x-15;                               // Position Nulldurchgang (Kondensator)
  else if (dPhi < 0) xSin = x+15;                          // Position Nulldurchgang (Spule) 
  sinus(xSin,y,60,35,x,x+180,xx);                          // Sinuskurve für Stromstärke
  alignText(symbolAmperage,0,x+6,y-65);                    // Beschriftung (Variable für Stromstärke)
  newPath();                                               // Neuer Pfad (Standardwerte)
  ctx.fillStyle = "#000000";                               // Füllfarbe schwarz
  for (i=1; i<=3; i++) {                                   // Für alle Ticks auf der Zeitachse ...
    var xT = x+i*60;                                       // x-Koordinate des Ticks
    line(xT,y-3,xT,y+3);                                   // Tick zeichnen
    var s = (i>1 ? ""+i : "")+symbolPeriod;                // Zeichenkette für Zeit (T, 2T oder 3T)
    alignText(s,1,xT,y+14);                                // Tick beschriften
    }
  }

// Grafikausgabe:
// Seiteneffekt t, phi, psi
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // ... Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // ... Länge des Zeitintervalls (s)
    if (slow) dt /= 10;                                    // ... Falls Zeitlupe, Zeitintervall durch 10 dividieren
    t += dt;                                               // ... Zeitvariablen aktualisieren
    t0 = t1;                                               // ... Neuer Anfangszeitpunkt
    }
  phi = OMEGA0*t;                                          // Phasenwinkel für Spannung (Bogenmaß) 
  psi = phi+dPhi;                                          // Phasenwinkel für Stromstärke (Bogenmaß)
  circuit();                                               // Stromkreis zeichnen
  pointerDiagram(90,height-90);                            // Zeigerdiagramm zeichnen
  tUIDiagram(190,height-90);                               // t-U und t-I-Diagramm zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

