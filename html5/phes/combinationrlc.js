// Kombinationen von Widerständen, Spulen und Kondensatoren
// Java-Applet (19.03.2004) umgewandelt
// 14.03.2020 - 16.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind in einer eigenen Datei (zum Beispiel combinationrlc_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorEmphasize = "#ffc800";                            // Farbe für Hervorhebung eines Schaltungsteils
var colorVoltage = "#0000ff";                              // Farbe für Spannung
var colorAmperage = "#ff0000";                             // Farbe für Stromstärke

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Normaler Zeichensatz
var FONT_BIG = "normal normal normal 18px sans-serif";     // Großer Zeichensatz
var W2 = 30, H2 = 10;                                      // Abmessungen für Symbole (Pixel)
var DIST = 10;                                             // Abstand für Drähte (Pixel)
var DIGITS = 3;                                            // Geltende Ziffern

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ip1, ip2, ip3;                                         // Eingabefelder
var ch;                                                    // Auswahlfeld
var lbType, lbUnit;                                        // Ausgabefelder
var bu1, bu2, bu3, bu4;                                    // Schaltknöpfe
var cb1, cb2;                                              // Optionsfelder
var u0;                                                    // Spannung der Spannungsquelle
var omega;                                                 // Kreisfrequenz (1/s)
var type;                                                  // Art des Bauteils (0 für R, 1 für L oder 2 für C)
var r0, l0, c0;                                            // Vorgaben für Bauteile (SI-Einheiten)
var y0, y1;                                                // y-Koordinaten unten/oben (Pixel)
var xMin, xMax, yMin, yMax;                                // Bereichsgrenzen (Pixel)
var root;                                                  // Wurzel Baumstruktur
var current;                                               // Aktueller Teil der Schaltung
var curr0;                                                 // Aktueller Teil der Schaltung, zwischengespeichert
var vm;                                                    // Voltmeter
var am;                                                    // Amperemeter
var drag;                                                  // Flag für Zugmodus

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }
  
// Auswahlfeld vorbereiten:
// ch ... Auswahlfeld
// t .... Array von Zeichenketten
  
function prepareSelect (ch, t) {
  for (var i=0; i<t.length; i++) {                         // Für alle Indizes ...
    var o = document.createElement("option");              // Neue Option
    o.text = t[i];                                         // Zugehöriger Text
    ch.add(o);                                             // Option zum Auswahlfeld hinzufügen
    }    
  }
  
// Start-Methode:

function start () {
  canvas = document.getElementById("cv");                  // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb1",text01);                                // Erklärender Text (Spannungsquelle)
  getElement("ip1a",text02);                               // Erklärender Text (Spannung)
  ip1 = getElement("ip1b");                                // Eingabefeld (Spannung)
  getElement("ip1c",volt);                                 // Einheit (Spannung)
  getElement("ip2a",text03);                               // Erklärender Text (Frequenz)
  ip2 = getElement("ip2b");                                // Eingabefeld (Frequenz)
  getElement("ip2c",hertz);                                // Einheit (Frequenz)
  getElement("lb2",text04);                                // Erklärender Text (Bauteil)
  ch = getElement("ch1b");                                 // Auswahlfeld (Art des Bauteils)
  prepareSelect(ch,text05);                                // Auswahlfeld vorbereiten
  lbType = getElement("ip3a",text06[0]);                   // Erklärender Text (Widerstand/Induktivität/Kapazität) 
  ip3 = getElement("ip3b");                                // Eingabefeld (Widerstand/Induktivität/Kapazität)
  lbUnit = getElement("ip3c","");                          // Einheit (Widerstand/Induktivität/Kapazität)
  bu1 = getElement("bu1",text07);                          // Schaltknopf (Ersetzen)
  bu2 = getElement("bu2",text08);                          // Schaltknopf (Hinzufügen in Serie)
  bu3 = getElement("bu3",text09);                          // Schaltknopf (Hinzufügen parallel)
  bu4 = getElement("bu4",text10);                          // Schaltknopf (Entfernen)
  bu4.disabled = true;                                     // Schaltknopf zunächst deaktiviert
  getElement("lb3",text11);                                // Erklärender Text (Messgeräte)
  cb1 = getElement("cb1a");                                // Optionsfeld (Messung der Spannung)
  cb1.checked = false;                                     // Zunächst kein Häkchen
  getElement("cb1b",text12);                               // Erklärender Text (Spannung)
  cb2 = getElement("cb2a");                                // Optionsfeld (Messung der Stromstärke)
  cb2.checked = false;                                     // Zunächst kein Häkchen
  getElement("cb2b",text13);                               // Erklärender Text (Stromstärke)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  
  u0 = 12;                                                 // Startwert Spannung (V)
  omega = 50*2*Math.PI;                                    // Startwert Kreisfrequenz (1/s)
  type = 0;                                                // Vorgabe Bauteil (Widerstand)
  r0 = 1000;                                               // Vorgabe Widerstand (Ohm) 
  l0 = 1;                                                  // Vorgabe Induktivität (Henry) 
  c0 = 1e-6;                                               // Vorgabe Kapazität (Farad)
  updateInput();                                           // Eingabefelder aktualisieren
  focus(ip1);                                              // Fokus für erstes Eingabefeld
  current = curr0 = root = newResistor(r0);                // Startsituation: Einzelner Widerstand
  arrangeAll();                                            // Geometrische Anordnung  
  paintAll();                                              // Neu zeichnen
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Spannung)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Frequenz)
  ip3.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Widerstand/Induktivität/Kapazität)
  ip1.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Spannung)
  ip2.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Frequenz)
  ip3.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Widerstand/Induktivität/Kapazität)
  ch.onclick = updateInput;                                // Reaktion auf Auswahlfeld (Art des Bauteils)
  ch.onchange = updateInput;                               // Reaktion auf Auswahlfeld (Art des Bauteils)
  bu1.onclick = reactionReplace;                           // Reaktion auf Schaltknopf (Ersetzen)
  bu2.onclick = reactionAddSeries;                         // Reaktion auf Schaltknopf (Hinzufügen in Serie)
  bu3.onclick = reactionAddParallel;                       // Reaktion auf Schaltknopf (Hinzufügen parallel)
  bu4.onclick = reactionRemove;                            // Reaktion auf Schaltknopf (Entfernen)
  cb1.onclick = reactionVoltmeter;                         // Reaktion auf Optionsfeld (Spannungsmessung)
  cb2.onclick = reactionAmperemeter;                       // Reaktion auf Optionsfeld (Stromstärkemessung)
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers 
  } // Ende start-Methode
  
// Eingabe, rechnen, Ausgabe, neu zeichnen:

function reaction () {
  input();                                                 // Hilfsroutine aufrufen (Eingabe)
  updateAll(false);                                        // Schaltfläche und Zeichenfläche aktualisieren
  }
  
// Reaktion auf Entertaste:
// Seiteneffekt type, u0, omega, r0, l0, c0, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  if (current.type == "R")                                 // Falls einzelner Widerstand ...
    current.res = r0 = inputNumber(ip3,1,1000000);         // Widerstand aus Eingabefeld
  else if (current.type == "L")                            // Falls einzelne Spule ...
    current.ind = l0 = inputNumber(ip3,0.001,1000);        // Induktivität aus Eingabefeld
  else if (current.type == "C")                            // Falls einzelner Kondensator ...
    current.cap = c0 = 1e-6*inputNumber(ip3,0.001,1000);   // Kapazität aus Eingabefeld
  reaction();                                              // Daten übernehmen, rechnen und neu zeichnen                       
  } 
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
  }
  
// Neues Schaltungselement:
  
function newRLC () {
  if (type == 0) return newResistor(r0);                   // Entweder Widerstand ...
  if (type == 1) return newCoil(l0);                       // ... oder Spule ...
  if (type == 2) return newCapacitor(c0);                  // ... oder Kondensator
  }
  
// Reaktion auf Schaltknopf "Ersetzen":
// Seiteneffekt type, u0, omega, r0, l0, c0, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionReplace () {
  input();                                                 // Daten aus den Eingabefeldern übernehmen
  var rlc = newRLC();                                      // Neues Bauteil gemäß Vorgabe 
  replace(current,rlc);                                    // Aktuellen Schaltungsteil durch neues Element ersetzen 
  current = rlc;                                           // Neues Element als aktueller Schaltungsteil                                         
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }

// Reaktion auf Schaltknopf "Hinzufügen in Serie":
// Seiteneffekt type, u0, omega, r0, l0, c0, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionAddSeries () {
  input();                                                 // Daten aus den Eingabefeldern übernehmen
  var rlc = newRLC();                                      // Neues Bauteil gemäß Vorgabe
  if (current != null) insertSer(current,rlc);             // Neues Bauteil in Serie hinzufügen
  else root = current = rlc;                               // Im Notfall neues Bauteil als neue Schaltung
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }

// Reaktion auf Schaltknopf "Hinzufügen parallel":
// Seiteneffekt type, u0, omega, r0, l0, c0, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionAddParallel () {
  input();                                                 // Daten aus den Eingabefeldern übernehmen
  var rlc = newRLC();                                      // Neues Bauteil gemäß Vorgabe
  if (current != null) insertPar(current,rlc);             // Neues Bauteil parallel hinzufügen           
  else root = current = rlc;                               // Im Notfall neues Bauteil als neue Schaltung
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }

// Reaktion auf Schaltknopf "Entfernen":
// Seiteneffekt type, u0, omega, r0, l0, c0, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionRemove () {
  input();                                                 // Daten aus den Eingabefeldern übernehmen
  if (current != null) remove(current);                    // Falls möglich, aktuellen Schaltungsteil entfernen  
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }
  
// Hilfsroutine: Messgeräte entfernen
// Seiteneffekt vm, am

function removeMeters () {
  if (vm != null) {remove(vm); vm = null;}                 // Voltmeter entfernen, falls vorhanden
  if (am != null) {remove(am); am = null;}                 // Amperemeter entfernen, falls vorhanden                
  }
  
// Hilfsroutine: Messgeräte suchen
// Seiteneffekt vm, am

function searchMeters () {
  if (root != null) {                                      // Falls Wurzel der Baumstruktur definiert ...
    vm = getVoltmeter(root);                               // Voltmeter suchen
    am = getAmperemeter(root);                             // Amperemeter suchen
    }
  else {vm = null; am = null;}                             // Falls Wurzel undefiniert, Messgeräte ebenfalls undefiniert
  }
  
// Reaktion auf Optionsfeld Voltmeter:
// Seiteneffekt vm, am, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionVoltmeter () {
  var u = cb1.checked, i = cb2.checked;                    // Zustand der Optionsfelder
  removeMeters();                                          // Messgeräte entfernen
  if (u) {                                                 // Falls Voltmeter gewünscht ...
    if (!i) curr0 = current;                               // Falls nur Voltmeter gewünscht, aktuellen Schaltungsteil speichern
    if (i && curr0 != null) insertAM(curr0);               // Eventuell Amperemeter einfügen
    if (curr0 != null) insertVM(curr0);                    // Voltmeter einfügen
    }
  else if (i && curr0 != null) insertAM(curr0);            // Falls nur Amperemeter gewünscht, einfügen
  current = curr0;                                         // Aktueller Schaltungsteil wie zuvor
  searchMeters();                                          // Messgeräte suchen (Seiteneffekt vm, am)
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }
  
// Reaktion auf Optionsfeld Amperemeter:
// Seiteneffekt vm, am, root, current, (x,y,w,h) für Schaltungsteile, y0, y1
  
function reactionAmperemeter () {
  var u = cb1.checked, i = cb2.checked;                    // Zustand der Optionsfelder
  removeMeters();                                          // Messgeräte entfernen
  if (i) {                                                 // Falls Amperemeter gewünscht ...
    if (!u) curr0 = current;                               // Falls nur Amperemeter gewünscht, aktuellen Schaltungsteil speichern
    if (u && curr0 != null) insertVM(curr0);               // Eventuell Voltmeter einfügen
    if (curr0 != null) insertAM(curr0);                    // Amperemeter einfügen
    }
  else if (u && curr0 != null) insertVM(curr0);            // Falls nur Voltmeter gewünscht, einfügen
  current = curr0;                                         // Aktueller Schaltungsteil wie zuvor
  searchMeters();                                          // Messgeräte suchen (Seiteneffekt vm, am)
  updateAll(true);                                         // Zeichenfläche und Schaltfläche aktualisieren
  }
  
// Reaktion auf Drücken der Maustaste (Seiteneffekt siehe reactionDown):
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen                   
  }
  
// Reaktion auf Berührung (Seiteneffekt siehe reactionDown):
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt drag, xMin, xMax, yMin, yMax, current, (x,y,w,h) für untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  drag = true;                                             // Zugmodus aktivieren
  xMin = xMax = u; yMin = yMax = v;                        // Extremwerte Mauszeiger 
  current = selectedPart(root,xMin,xMax,yMin,yMax);        // Aktueller Schaltungsteil entsprechend Mausposition
  updateAll(false); 
  }
  
// Reaktion auf Loslassen der Maustaste (Seiteneffekt drag):
  
function reactionMouseUp (e) {                                           
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Ende der Berührung (Seiteneffekt drag):
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus (Seiteneffekt siehe reactionMove):
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers (Seiteneffekt siehe reactionMove):
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }
  
// Hilfsroutine: Reaktion auf Bewegung von Maus oder Finger (Änderung):
// u, v ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt xMin, xMax, yMin, yMax, (x,y,w,h) für untergeordnete Elemente, y0, y1, ip1, ip2, bu2, bu3 

function reactionMove (u, v) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  if (u < xMin) xMin = u;                                  // Falls weiter links als bisher, xMin aktualisieren
  if (u > xMax) xMax = u;                                  // Falls weiter rechts als bisher, xMax aktualisieren
  if (v < yMin) yMin = v;                                  // Falls weiter oben als bisher, yMin aktualisieren
  if (v > yMax) yMax = v;                                  // Falls weiter unten als bisher, yMax aktualisieren
  current = selectedPart(root,xMin,xMax,yMin,yMax);        // Aktueller Schaltungsteil entsprechend extremen Mauspositionen
  updateAll(false);                                        // Zeichenfläche und Schaltfläche aktualisieren
  }
  
//-------------------------------------------------------------------------------------------------
  
// Runden einer reellen Zahl, Umwandlung in eine Zeichenkette:
// n ..... Gegebene Zahl

function toStringR (n) {
  var s = n.toPrecision(DIGITS);                           // Zeichenkette für gerundete Zahl (eventuell Zehnerpotenz)
  if (s.indexOf("e") >= 0) s = String(Math.round(n));      // Falls Zehnerpotenz, Zeichenkette umwandeln
  return s.replace(".",decimalSeparator);                  // Rückgabewert
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = toStringR(n);                                 // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
  
// Aktualisierung der Eingabefelder:
// Seiteneffekt type
  
function updateInput () {
  ip1.value = toStringR(u0);                               // Zahlenwert Spannung (Volt)
  ip2.value = toStringR(omega/(2*Math.PI));                // Zahlenwert Frequenz (Hertz)
  type = ch.selectedIndex;                                 // Vorgabe für Bauteil (Widerstand/Spule/Kondensator)
  lbType.innerHTML = text06[type];                         // Erklärender Text (Widerstand/Induktivität/Kapazität)
  if (type == 0) {                                         // Falls Widerstand ...
    ip3.value = toStringR(r0);                             // Zahlenwert Widerstand (Ohm)
    lbUnit.innerHTML = ohm;                                // Einheit
    }
  else if (type == 1) {                                    // Falls Spule ...
    ip3.value = toStringR(l0);                             // Zahlenwert Induktivität (Henry)                 
    lbUnit.innerHTML = henry;                              // Einheit
    }
  else {                                                   // Falls Kondensator ...
    ip3.value = toStringR(1e6*c0);                         // Zahlenwert Kapazität (Mikrofarad)
    lbUnit.innerHTML = microfarad;                         // Einheit
    }
  }
  
// Schaltfläche aktualisieren: 
  
function updatePanel () {
  updateInput();                                           // Eingabefelder aktualisieren
  var meter = (vm != null || am != null);                  // Überprüfung, ob Messgerät(e) vorhanden sind
  bu1.disabled = meter;                                    // Schaltknopf "Ersetzen" aktivieren oder deaktivieren
  bu2.disabled = (meter || getNHorFict(root,1) > 3);       // Schaltknopf "Hinzufügen in Serie" aktivieren oder deaktivieren    
  bu3.disabled = (meter || getNVertFict(root,1) > 3);      // Schaltknopf "Hinzufügen parallel" aktivieren oder deaktivieren
  bu4.disabled = (meter || current == root);               // Schaltknopf "Entfernen" aktivieren oder deaktivieren
  cb1.disabled = (current == null);                        // Optionsfeld "Spannungsmessung" aktivieren oder deaktivieren
  cb2.disabled = (current == null);                        // Optionsfeld "Stromstärkemessung" aktivieren oder deaktivieren
  }
  
// Zeichenfläche und Schaltfläche aktualisieren:
// geo ... Flag für Neuberechnung der geometrischen Anordnung
// Seiteneffekt (x,y,w,h) für Schaltungsteile, y0, y1
  
function updateAll (geo) {
  if (geo) arrangeAll();                                   // Falls gewünscht, geometrische Anordnung neu berechnen
  paintAll();                                              // Zeichenfläche aktualisieren
  updatePanel();                                           // Schaltfläche aktualisieren
  }
  
// Auswertung der Eingabefelder:
// Seiteneffekt type, u0, omega, r0, l0, c0
  
function input () {
  var ae = document.activeElement;                         // Aktives Element
  type = ch.selectedIndex;                                 // Art des Bauteils (0, 1 oder 2)
  u0 = inputNumber(ip1,1,1000);                            // Spannung (V)
  omega = 2*Math.PI*inputNumber(ip2,1,1000);               // Kreisfrequenz (1/s)
  switch (type) {
    case 0: r0 = inputNumber(ip3,1,1000000); break;        // Widerstand (Ohm)
    case 1: l0 = inputNumber(ip3,0.001,1000); break;       // Induktivität (Henry)
    case 2: c0 = 1e-6*inputNumber(ip3,0.001,1000); break;  // Kapazität (Farad)
    }
  if (ae == ip1) focus(ip2);                               // Fokus für nächstes Eingabefeld
  if (ae == ip2) focus(ip3);                               // Fokus für nächstes Eingabefeld
  if (ae == ch) focus(ip3);                                // Fokus für nächstes Eingabefeld
  if (ae == ip3) ip3.blur();                               // Fokus abgeben
  }
  
// Summe zweier komplexer Zahlen:
// z1, z2 ... Summanden (jeweils mit Attributen x und y)

function sum (z1, z2) {
  return {x: z1.x+z2.x, y: z1.y+z2.y};                     // Rückgabewert
  }
  
// Produkt zweier komplexer Zahlen:
// z1, z2 ... Faktoren (jeweils mit Attributen x und y)

function prod (z1, z2) {
  return {x: z1.x*z2.x-z1.y*z2.y, y: z1.x*z2.y+z1.y*z2.x}; // Rückgabewert
  }
  
// Produkt einer komplexen und einer rellen Zahl:
// z ... Komplexe Zahl (mit Attributen x und y)
// r ... Reelle Zahl

function prodR (z, r) {
  return {x: z.x*r, y: z.y*r};                             // Rückgabewert
  }
  
// Quotient zweier komplexer Zahlen:
// z1 ... Dividend (mit Attributen x und y)
// z2 ... Divisor (mit Attributen x und y)

function quot (z1, z2) {
  var n = z2.x*z2.x+z2.y*z2.y;                             // Nenner
  var re = (z1.x*z2.x+z1.y*z2.y)/n;                        // Realteil
  var im = (z1.y*z2.x-z1.x*z2.y)/n;                        // Imaginärteil
  return {x: re, y: im};                                   // Rückgabewert
  }
  
// Überprüfung, ob eine komplexe Zahl gleich 0 ist:
// z ... Gegebene Zahl (mit Attributen x und y)

function isZero (z) {
  return (z.x == 0 && z.y == 0);                           // Rückgabewert
  }
  
// Absolutbetrag einer komplexen Zahl:
// z ... Gegebene Zahl (mit Attributen x und y)

function abs (z) {
  return Math.sqrt(z.x*z.x+z.y*z.y);                       // Rückgabewert
  }
  
// Geometrische Anordnung der Schaltung (rekursive Methode):
// Seiteneffekt Attribute x, y, w, h der Schaltungsteile, y0, y1
  
function arrangeAll () {
  if (!root) return;                                       // Falls Wurzel der Baumstruktur undefiniert, abbrechen
  var n = getNVert(root)+1, yOR = (n<4 ? 20 : 0);          // Anzahl
  arrange(root,60,yOR,width-120,350*(n-1)/n);              // Rekursive Berechnung durchführen (x,y,w,h)
  y0 = yOR+20+340*(2*n-1)/(2*n);                           // y-Koordinate oben (Pixel)
  y1 = root.y+root.h/2;                                    // y-Koordinate unten (Pixel)
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
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen
  if (w) ctx.lineWidth = w;                                // Liniendicke festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
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

// Ausgefüllter Kreis mit schwarzem Rand:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... Füllfarbe
// w ....... Liniendicke (Pixel)
  
function circle (x, y, r, c, w) {
  newPath("#000000",w);                                    // Neuer Grafikpfad
  ctx.arc(x,y,r,0,2*Math.PI,false);                        // Kreis vorbereiten
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill();                                              // Kreisfläche ausfüllen 
  ctx.stroke();                                            // Kreisrand zeichnen
  }
  
// Ausgabe der Spannung (Spannungsquelle im Schaltbild, aktueller Schaltungsteil im Tabellenbereich):
  	
function writeVoltage () {  
  var s = stringVoltage(root);                             // Spannung der Spannungsquelle
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe
  ctx.fillText(s,width/2,y0+24);                           // Spannung der Spannungsquelle (Schaltbild)
  ctx.font = FONT_BIG;                                     // Großer Zeichensatz
  ctx.fillText("\u007E",width/2,y0-5);                     // Symbol für Wechselspannung
  ctx.font = FONT;                                         // Normaler Zeichensatz
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillText(text14,60,height-100);                      // Erklärender Text (Spannung)
  if (!current) return;                                    // Falls aktueller Schaltungsteil undefiniert, abbrechen
  s = stringVoltage(current);                              // Zeichenkette für Normalfall (Spannung)
  if (current.type == "A") s = text20;                     // Zeichenkette für Sonderfall Amperemeter
  ctx.fillText(s,300,height-100);                          // Zeichenkette ausgeben
  }
  
// Ausgabe der Stromstärke (aktueller Schaltungsteil, im Tabellenbereich):
  	
function writeAmperage () {
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe
  ctx.fillText(text15,60,height-80);                       // Erklärender Text (Stromstärke)
  if (!current) return;                                    // Falls aktueller Schaltungsteil undefiniert, abbrechen
  var s = stringAmperage(current);                         // Zeichenkette für Normalfall (Stromstärke)
  if (current.type == "V") s = text19;                     // Zeichenkette für Sonderfall Voltmeter
  ctx.fillText(s,300,height-80);                           // Zeichenkette ausgeben
  }
  
// Ausgabe der Impedanz (aktueller Schaltungsteil, im Tabellenbereich):
  	
function writeImpedance () {
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(text16,60,height-60);                       // Erklärender Text (Impedanz)
  ctx.fillText(text17,60,height-40);                       // Erklärender Text (Betrag Impedanz)
  if (!current) return;                                    // Falls aktueller Schaltungsteil undefiniert, abbrechen
  var s = stringImpedance(current);                        // Zeichenkette für Impedanz (komplexe Zahl, Einheit Ohm)
  if (current.type == "V") s = text22;                     // Sonderfall Voltmeter (sehr große Impedanz)
  if (current.type == "A") s = text21;                     // Sonderfall Amperemeter (sehr kleine Impedanz)
  ctx.fillText(s,300,height-60);                           // Impedanz ausgeben
  s = stringResistance(current);                           // Zeichenkette für Betrag der Impedanz (relle Zahl, Einheit Ohm)
  if (current.type == "V") s = text22;                     // Sonderfall Voltmeter (sehr große Impedanz)
  if (current.type == "A") s = text21;                     // Sonderfall Amperemeter (sehr kleine Impedanz)
  ctx.fillText(s,300,height-40);                           // Betrag der Impedanz ausgeben
  }
  
// Ausgabe der Phasenverschiebung:
  	  
function writePhaseDifference () {
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(text18,60,height-20);                       // Erklärender Text (Phasenunterschied)
  if (!current) return;                                    // Falls aktueller Schaltungsteil undefiniert, abbrechen
  var s = "";                                              // Leere Zeichenkette
  if (current.type != "V" && current.type != "A") {        // Falls ausgewählter Schaltungsteil kein Messgerät ...
    var r = getResistance(current);                        // Impedanz (komplexe Zahl)
    var phi = -Math.atan(r.y/r.x);                         // Phasenunterschied (Bogenmaß)
    phi /= Math.PI;                                        // Phasenunterschied als Vielfaches von pi
    s = toStringR(phi)+" \u03C0";                          // Zeichenkette für Phasenunterschied (Normalfall)
    if (Math.abs(phi) < 1e-10) s = "0";                    // Zeichenkette für Phasenunterschied 0
    }
  ctx.fillText(s,300,height-20);                           // Phasenunterschied ausgeben
  }
  
// Grafikausgabe:  
  
function paintAll () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  if (root) paint(root);                                   // Schaltung zeichnen (ohne Spannungsquelle und Anschlussdrähte)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  var x0 = width/2;                                        // x-Koordinate Bildmitte (Pixel)
  ctx.moveTo(x0-10,y0);                                    // Anfangspunkt (linker Pol der Spannungsquelle)
  ctx.lineTo(40,y0);                                       // Linie nach links
  ctx.lineTo(40,y1);                                       // Linie nach oben
  ctx.lineTo(60,y1);                                       // Linie nach rechts (zur Schaltung)
  ctx.moveTo(width-60,y1);                                 // Neuer Anfangspunkt (rechts von der Schaltung)
  ctx.lineTo(width-40,y1);                                 // Linie nach rechts
  ctx.lineTo(width-40,y0);                                 // Linie nach unten
  ctx.lineTo(x0+10,y0);                                    // Linie nach links (zur Spannungsquelle)
  ctx.stroke();                                            // Anschlussdrähte zeichnen
  circle(x0-10,y0,4,colorBackground,2);                    // Linker Pol der Spannungsquelle
  circle(x0+10,y0,4,colorBackground,2);                    // Rechter Pol der Spannungsquelle
  ctx.fillStyle = colorEmphasize;                          // Füllfarbe
  ctx.fillRect(40,360,width-80,110);                       // Rechteckiger Bereich für Zahlenwerte
  writeVoltage();                                          // Ausgabe der Spannung
  writeAmperage();                                         // Ausgabe der Stromstärke
  writeImpedance();                                        // Ausgabe der Impedanz
  writePhaseDifference();                                  // Ausgabe der Phasenverschiebung
  }

document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

//-------------------------------------------------------------------------------------------------

// Methoden für beliebige Schaltungsteile

// Die Methoden stammen aus der abstrakten Java-Klasse CombRLC (Kombination von Widerständen, Spulen, Kondensatoren)
// mit den Klassenattributen u0 (Batteriespannung), root (Wurzel der Baumstruktur) und current (aktueller Teil)
// sowie den Instanzattributen parent (übergeordneter Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), 
// x, y, w, h (Position und Abmessungen).
// In den folgenden Methoden wird ein zusätzliches Instanzattribut type (mögliche Werte "R", "V", "A", "S", "P") verwendet,
// um die Art eines Schaltungsteils auszudrücken.

var POS_INF = {x: Number.POSITIVE_INFINITY, y: 0};         // Abkürzung für plus unendlich (als komplexe Zahl)

var root;                                                  // Wurzel der Baumstruktur (für CombRLC.root)
var current;                                               // Aktueller Schaltungsteil (für CombRLC.current)

// Ersatz für CombRLC-Konstruktor:

function newCombRLC () {
  return {type: null, parent: null, next: null, x: 0, y: 0, w: 0, h: 0};
  }
  
// Überprüfung, ob einzelnes Element (Widerstand, Voltmeter oder Amperemeter):
// c0 ... Gegebener Schaltungsteil

function isSingle (c0) {
  var t = c0.type;                                         // Art des Schaltungsteils
  return (t == "R" || t == "L" || t == "C"                 // Rückgabewert
       || t == "V" || c0.type == "A");
  }

// Hinzufügen eines Schaltungsteils in Serie (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertSer (c0, c) {
  if (isSingle(c0)) insertSerSingle(c0,c);                 // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") insertSerS(c0,c);               // Variante für Serienschaltung
  else if (c0.type == "P") insertSerP(c0,c);               // Variante für Parallelschaltung
  }
  
// Hinzufügen eines Schaltungsteils parallel (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertPar (c0, c) {
  if (isSingle(c0)) insertParSingle(c0,c);                 // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") insertParS(c0,c);               // Variante für Serienschaltung
  else if (c0.type == "P") insertParP(c0,c);               // Variante für Parallelschaltung
  }
  
// Hinzufügen eines Amperemeters:
// c0 ... Gegebener Schaltungsteil
// Seiteneffekt root, current

function insertAM (c0) {
  insertSer(c0,newAmperemeter());                          // In Serienschaltung hinzufügen
  }
  
// Hinzufügen eines Voltmeters:
// c0 ... Gegebener Schaltungsteil
// Seiteneffekt root, current

function insertVM (c0) {
  insertPar(c0,newVoltmeter());                            // In Parallelschaltung hinzufügen
  }
  
// Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungteil
// nH ... Anzahl

function getNHorFict (c0, nH) {
  if (isSingle(c0)) return getNHorFictSingle(c0,nH);       // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNHorFictS(c0,nH);     // Variante für Serienschaltung
  else if (c0.type == "P") return getNHorFictP(c0,nH);     // Variante für Parallelschaltung
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungteil

function getNHor (c0) {
  if (isSingle(c0)) return 1;                              // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNHorS(c0);            // Variante für Serienschaltung
  else if (c0.type == "P") return getNHorP(c0);            // Variante für Parallelschaltung
  }
  
// Fiktive Zahl der maximal übereinander liegenden Einzelelemente (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungteil
// nH ... Anzahl

function getNVertFict (c0, nV) {
  if (isSingle(c0)) return getNVertFictSingle(c0,nV);      // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNVertFictS(c0,nV);    // Variante für Serienschaltung
  else if (c0.type == "P") return getNVertFictP(c0,nV);    // Variante für Parallelschaltung
  }

// Wirkliche Zahl der maximal übereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungteil
  
function getNVert (c0) {
  if (isSingle(c0)) return 1;                              // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") return getNVertS(c0);           // Variante für Serienschaltung
  else if (c0.type == "P") return getNVertP(c0);           // Variante für Parallelschaltung
  }
  
// Berechnung des Ersatzwiderstands (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function getResistance (c0) {
  var t = c0.type;                                         // Typ des Schaltungsteils
  if (t == "R") return getResistanceR(c0);                 // Variante für Widerstand
  if (t == "L") return getResistanceL(c0);                 // Variante für Spule
  if (t == "C") return getResistanceC(c0);                 // Variante für Kondensator
  else if (t == "V") return POS_INF;                       // Variante für Voltmeter
  else if (t == "A") return {x: 0, y: 0};                  // Variante für Amperemeter
  else if (t == "S") return getResistanceS(c0);            // Variante für Serienschaltung
  else if (t == "P") return getResistanceP(c0);            // Variante für Parallelschaltung
  }
  
// Überprüfung, ob eine reelle Zahl unendlich ist:

function isInfiniteR (x) {
  if (x == Number.POSITIVE_INFINITY) return true;          // Rückgabewert, falls Realteil plus unendlich         
  if (x == Number.NEGATIVE_INFINITY) return true;          // Rückgabewert für minus unendlich
  return false;                                            // Rückgabewert für alle anderen Fälle
  }
  
// Überprüfung, ob eine komplexe Zahl unendlich ist:
// z ... Gegebene Zahl
  
function isInfinite (z) {
  return isInfiniteR(z.x) || isInfiniteR(z.y);             // Rückgabewert
  }
  
// Berechnung der Teilspannung (top-down):
// c0 ... Gegebener Schaltungsteil
// Der Rückgabewert entspricht einer komplexen Zahl und hat die Attribute x und y.

function getVoltage (c0) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil oder null
  if (p == null) return {x: u0, y: 0};                     // Rückgabewert für die ganze Schaltung
  var u = getVoltage(p);                                   // Spannung des übergeordneten Schaltungsteils (komplexe Zahl)
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var r = getResistance(p);                              // Ersatzwiderstand der Serienschaltung (komplexe Zahl)
    var i = p.first;                                       // Anfang der Serienschaltung
    if (i == null) return {x: 0, y: 0};                    // Sicher ist sicher!
    var n = 0;                                             // Zahl der unendlichen Teilwiderstände
    do {                                                   // Wiederhole ...
      if (isInfinite(getResistance(i))) n++;               // Falls unendlicher Teilwiderstand, n erhöhen
      i = i.next;                                          // Nächster Teil der Serienschaltung 
      }
    while (i != null);                                     // ... bis Ende der Serienschaltung erreicht 
    if (n == 0) {                                          // Falls kein unendlicher Widerstand ...
      var h = prod(u,getResistance(c0));                   // Zwischenergebnis (komplexe Zahl)
      return quot(h,r);                                    // Rückgabewert (komplexe Zahl)
      }
    else if (isInfinite(getResistance(c0)))                // Falls aktueller Schaltungsteil mit unendlichem Widerstand ... 
      return quot(u,{x: n, y: 0});                         // Rückgabewert
    else return {x: 0, y: 0};                              // Rückgabewert, falls endlicher Widerstand, aber n > 0                               
    }
  else return u;                                           // Rückgabewert, falls c0 nicht Teil einer Serienschaltung
  }
  
// Zeichenkette für Betrag der Spannung:
// c0 ... Gegebener Schaltungsteil

function stringVoltage (c0) {
  var u = abs(getVoltage(c0));                             // Betrag der Spannung (Volt)
  return toStringR(u)+" "+volt;                            // Rückgabewert
  }
  
// Berechnung der Teilstromstärke (Spannung durch Widerstand):
// c0 ... Gegebener Schaltungsteil
// Der Rückgabewert entspricht einer komplexen Zahl und hat die Attribute x und y.

function getAmperage (c0) {
  var u = getVoltage(c0), r = getResistance(c0);           // Teilspannung, Ersatzwiderstand (komplexe Zahlen)
  if (isZero(r)) {                                         // Falls Widerstand 0 (Amperemeter) ...
    if (isZero(u)) return getAmperage(c0.parent);          // Rückgabewert für Spannung 0 und Widerstand 0
    else return POS_INF;                                   // Rückgabewert für Spannung größer 0 und Widerstand 0
    }
  if (isInfinite(r)) return {x: 0, y: 0};                  // Rückgabewert, falls unendlicher Widerstand (Voltmeter)
  return quot(u,r);                                        // Rückgabewert Normalfall
  }
  
// Zeichenkette für Betrag einer Stromstärke:
// c0 ... Gegebener Schaltungsteil

function stringAmperage (c0) {
  var i = abs(getAmperage(c0));                            // Betrag der Stromstärke
  return toStringR(i)+" "+ampere;                          // Rückgabewert
  }
  
// Zeichenkette für Impedanz (komplexe Zahl):

function stringImpedance (c0) {
  var r = getResistance(c0);                               // Widerstand (komplexe Zahl, Ohm)
  var unit = " "+ohm;                                      // Leerzeichen und Einheit Ohm
  if (isZero(r)) return "0"+unit;                          // Rückgabewert für Amperemeter
  var re = r.x, im = r.y;                                  // Real- und Imaginärteil 
  if (im == 0) return toStringR(re)+unit;                  // Rückgabewert für Widerstand (reelle Zahl) 
  if (re == 0) return toStringR(im)+" i"+unit;             // Rückgabewert für Spule/Kondensator (rein imaginäre Zahl)
  var s = "("+toStringR(re);                               // Anfang Zeichenkette Normalfall (Klammer auf, Realteil)
  if (im > 0) s += " + "; else s += " - ";                 // Rechenzeichen Plus oder Minus hinzufügen
  s += toStringR(Math.abs(im))+" i)"+unit;                 // Zeichenkette vervollständigen (Imaginärteil, Klammer zu)                
  return s;                                                // Rückgabewert
  }
  
// Zeichenkette für den Betrag eines Widerstands:
// c0 ... Gegebener Schaltungsteil

function stringResistance (c0) {
  var r = abs(getResistance(c0));                          // Zahlenwert (Ohm)
  return toStringR(r)+" "+ohm;                             // Rückgabewert
  }
  
// Vorhergehender Schaltungsteil auf der gleichen Hierarchiestufe:
// c0 ... Gegebener Schaltungsteil
// Falls c0 der Anfang einer Serien- oder Parallelschaltung ist, wird c0 zurückgegeben.

function getPrevious (c0) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil oder null
  if (p == null || isSingle(p)) return null;               // Rückgabewert, falls c0 kein Teil einer Serien- oder Parallelschaltung 
  var i = p.first;                                         // Anfang der Serien- oder Parallelschaltung
  if (i == null || i == c0) return i;                      // Rückgabewert, falls c0 am Anfang der Serien- oder Parallelschaltung
  while (i.next != null) {                                 // Solange Schaltungsteil definiert ...
    if (i.next == c0) break;                               // Falls Nachfolger gleich c0, while-Schleife verlassen
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return i;                                                // Rückgabewert
  }
  
// Geometrische Anordnung (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil
// x .... Abstand vom linken Rand (Pixel)
// y .... Abstand vom oberen Rand (Pixel)
// w .... Breite (Pixel)
// h ... Höhe (Pixel)
// Seiteneffekt (x,y,w,h) für untergeordnete Elemente

function arrange (c0, x, y, w, h) {
  if (isSingle(c0)) arrangeSingle(c0,x,y,w,h);             // Variante für Widerstand, Voltmeter oder Amperemeter
  else if (c0.type == "S") arrangeS(c0,x,y,w,h);           // Variante für Serienschaltung
  else if (c0.type == "P") arrangeP(c0,x,y,w,h);           // Variante für Parallelschaltung
  }
  
// Grafikausgabe (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function paint (c0) {
  var t = c0.type;                                         // Typ des Schaltungsteils
  if (t == "R") paintR(c0);                                // Variante für Widerstand
  else if (t == "L") paintL(c0);                           // Variante für Spule
  else if (t == "C") paintC(c0);                           // Variante für Kondensator
  else if (t == "V") paintV(c0);                           // Variante für Voltmeter
  else if (t == "A") paintA(c0);                           // Variante für Amperemeter
  else if (t == "S") paintS(c0);                           // Variante für Serienschaltung                    
  else if (t == "P") paintP(c0);                           // Variante für Parallelschaltung
  }
  
// Hervorhebung eines Schaltungsteils (abstrakte Methode von CombRLC):
// c0 ... Gegebener Schaltungsteil

function emphasize (c0) {
  var t = c0.type;                                         // Typ des Schaltungsteils
  if (t == "R" || t == "L" || t == "C") emphasizeRLC(c0);  // Variante für Widerstand, Spule oder Kondensator
  else if (t == "V" || t == "A") emphasizeVA(c0);          // Variante für Voltmeter oder Amperemeter
  else emphasizeSerPar(c0);                                // Variante für Serien- oder Parallelschaltung
  }
  
// Suche eines Schaltungsteils (rekursiv):
// c0 ........... Gegebener Schaltungsteil
// xMin, yMin ... Position der linken oberen Ecke
// xMax, yMax ... Position der rechten unteren Ecke
// Rückgabewert: Möglichst kleiner Teilbereich der Schaltung derart, dass das Rechteck mit den gegebenen Ecken darin liegt

function selectedPart (c0, xMin, xMax, yMin, yMax) {
  if (isSingle(c0)) return c0;                             // Rückgabewert, falls Widerstand, Voltmeter oder Amperemeter
  var i = c0.first;                                        // Anfang der Serien- oder Parallelschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (xMin >= i.x && xMin <= i.x+i.w                     // Bedingung 1. Teil
    && xMax >= i.x && xMax <= i.x+i.w                      // Bedingung 2. Teil
    && yMin >= i.y && yMin <= i.y+i.h                      // Bedingung 3. Teil
    && yMax >= i.y && yMax <= i.y+i.h)                     // Bedingung 4. Teil
      break;                                               // Falls Schaltungsteil gefunden, while-Schleife verlassen
    i = i.next;	                                           // Nächster Schaltungsteil
    }
  if (i != null)                                           // Falls Schaltungsteil gefunden ...
    return selectedPart(i,xMin,xMax,yMin,yMax);            // Rekursiv weitersuchen
  else return c0;                                          // Rückgabewert, falls kein kleinerer Schaltungsteil passt
  }
  
// Löschen eines Schaltungsteils:
// c0 ... Gegebener Schaltungsteil
// Seiteneffekt root, current

function remove (c0) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil oder null
  if (p == null || isSingle(p)) return;                    // Falls c0 kein Teil einer Serien- oder Parallelschaltung, abbrechen 
  if (c0 == p.first) current = p.first = c0.next;          // Falls c0 am Anfang, Referenzen auf Nachfolger
  else {                                                   // Falls c0 nicht am Anfang ... 
    current = getPrevious(c0);                             // Vorgänger als aktueller Schaltungsteil
    current.next = c0.next;                                // Referenz auf Nachfolger
    }
  simplify(p);                                             // Serien- oder Parallelschaltung mit einem Element verhindern
  }
  
// Ersetzung eines Schaltungsteils durch einen anderen:
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root

function replace (c0, c) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil
  if (p == null) root = c;                                 // Falls c0 kein Teil einer Serien- oder Parallelschaltung, neuer Schaltungsteil
  if (p == null || isSingle(p)) return;                    // Falls c0 kein Teil einer Serien- oder Parallelschaltung, abbrechen
  if (c0 == p.first) p.first = c;                          // Falls c0 am Anfang, Referenz auf neues Element
  else getPrevious(c0).next = c;                           // Falls c0 nicht am Anfang, Referenz auf neues Element
  c.parent = p;                                            // Referenz auf übergeordneten Schaltungsteil 
  c.next = c0.next;                                        // Referenz auf Nachfolger
  }
  
// Ermitteln eines enthaltenen Voltmeters (rekursiv):
// c0 ... Gegebener Schaltungsteil
// Falls c0 kein Voltmeter enthält, ist der Rückgabewert null.
  
function getVoltmeter (c0) {
  if (c0.type == "V") return c0;                           // Rückgabewert, falls Voltmeter gegeben
  else if (isSingle(c0)) return null;                      // Rückgabewert, falls RCL-Element oder Amperemeter gegeben
  else {                                                   // Falls Serien- oder Parallelschaltung ...
  	var i = c0.first;                                      // Anfang der Schaltung
    while (i != null) {                                    // Solange definierter Schaltungsteil ...
      var vm = getVoltmeter(i);                            // Voltmeter in diesem Schaltungsteil suchen
      if (vm != null) return vm;                           // Falls Voltmeter gefunden, Rückgabewert
      i = i.next;                                          // Nächster Schaltungsteil oder null
      }
    return null;                                           // Rückgabewert, falls kein Voltmeter vorhanden
    }
  } 
  
// Ermitteln eines enthaltenen Amperemeters (rekursiv):
// c0 ... Gegebener Schaltungsteil
// Falls c0 kein Amperemeter enthält, ist der Rückgabewert null.
  
function getAmperemeter (c0) {
  if (c0.type == "A") return c0;                           // Rückgabewert, falls Amperemeter gegeben
  else if (isSingle(c0)) return null;                      // Rückgabewert, falls RCL-Element oder Voltmeter gegeben
  else {                                                   // Falls Serien- oder Parallelschaltung ...
    var i = c0.first;                                      // Anfang der Schaltung
    while (i != null) {                                    // Solange definierter Schaltungsteil ...
      var am = getAmperemeter(i);                          // Amperemeter in diesem Schaltungsteil suchen
      if (am != null) return am;                           // Falls Amperemeter gefunden, Rückgabewert
      i = i.next;                                          // Nächster Schaltungsteil oder null
      }
    return null;                                           // Rückgabewert, falls kein Amperemeter vorhanden
    }
  }          

//-------------------------------------------------------------------------------------------------

// Methoden für einzelne Schaltungselemente

// Die Methoden stammen aus der abstrakten Java-Klasse SingleRLC mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Für das zusätzliche Instanzattribut type sind die Werte "R", "V" und "A" möglich.

// Hinzufügen eines Schaltungsteils in Serie:
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertSerSingle (c0, c) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil oder null
  if (p == null) {                                         // Falls c0 einziges Element ...
    root = newCombSer();                                   // Neue Serienschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Serienschaltung
    c0.parent = c.parent = root;                           // Referenzen auf Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    c.parent = p;                                          // Referenz auf Serienschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger
    c0.next = current = c;                                 // Referenz auf neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    var ser = newCombSer();                                // Neue Serienschaltung
    ser.parent = p;                                        // Referenz auf übergeordnete Parallelschaltung
    var prev = getPrevious(c0);                            // Vorgänger von c0 (oder Anfang c0)
    if (prev == c0) {                                      // Falls c0 am Anfang der Parallelschaltung ...
      p.first = ser;                                       // Referenz auf neue Serienschaltung
      ser.next = c0.next;                                  // Referenz auf Nachfolger in der Parallelschaltung
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil
      c.parent = ser;                                      // Referenz auf neue Serienschaltung
      }
    else {                                                 // Falls c0 nicht am Anfang der Parallelschaltung ...
      ser.next = c0.next;                                  // Referenz auf Nachfolger in der Parallelschaltung
      prev.next = ser;                                     // Referenz auf neue Serienschaltung
      }
    ser.first = c0;                                        // Referenz auf c0 (Anfang der Serienschaltung)
    c0.parent = c.parent = ser;                            // Referenzen auf neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    }
  }
  
// Hinzufügen eines Schaltungsteils in Parallelschaltung:
// c0 ... Gegebener Schaltungsteil
// c .... Neuer Schaltungsteil
// Seiteneffekt root, current

function insertParSingle (c0, c) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil oder null
  if (p == null) {                                         // Falls c0 einziges Element ...
    root = newCombPar();                                   // Neue Parallelschaltung als Wurzel
    root.first = c0;                                       // Aktueller Schaltungsteil als Anfang der Parallelschaltung
    c0.parent = c.parent = root;                           // Referenzen auf Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var par = newCombPar();                                // Neue Parallelschaltung
    par.parent = p;                                        // Referenz auf übergeordnete Serienschaltung
    var prev = getPrevious(c0);                            // Vorgänger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Serienschaltung ...
      p.first = par;                                       // Referenz auf neue Parallelschaltung
      par.next = c0.next;                                  // Referenz auf Nachfolger in der Serienschaltung
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil
      c.parent = par;                                      // Referenz auf neue Parallelschaltung
      }
    else {                                                 // Falls c0 nicht am Anfang der Serienschaltung ...
      par.next = c0.next;                                  // Referenz auf Nachfolger in der Serienschaltung
      prev.next = par;                                     // Referenz auf neue Parallelschaltung
      }
    par.first = c0;                                        // Referenz auf c0 (Anfang der Parallelschaltung)
    c0.parent = c.parent = par;                            // Referenzen auf die neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    c.parent = p;                                          // Referenz auf Parallelschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger
    c0.next = current = c;                                 // Referenz auf neuen Schaltungsteil
    }
  }

// Fiktive Zahl der nebeneinander liegenden Elemente:
    
function getNHorFictSingle (c0, nH) {
  return (c0 == root ? 1+nH : 1);                          // Rückgabewert
  }

// Fiktive Zahl der übereinander liegenden Elemente:
  
function getNVertFictSingle (c0, nV) {
  return (c0 == root ? 1+nV : 1);                          // Rückgabewert
  }
  
// Geometrische Anordnung:
// c0 ... Gegebener Schaltungsteil
// x .... Abstand vom linken Rand (Pixel)
// y .... Abstand vom oberen Rand (Pixel)
// w .... Breite (Pixel)
// h .... Höhe (Pixel)

function arrangeSingle (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben übernehmen
  }
  
// Hervorheben (Widerstand, Spule oder Kondensator):
// c0 ... Gegebener Schaltungsteil

function emphasizeRLC (c0) {
  if (c0 != current) return;                               // Hervorheben unnötig?
  ctx.fillStyle = colorEmphasize;                          // Füllfarbe
  ctx.fillRect(c0.x+DIST,c0.y+DIST,c0.w-2*DIST,c0.h-2*DIST);  // Ausgefülltes Rechteck
  }
  
// Hervorheben (Voltmeter oder Amperemeter):
// c0 ... Gegebener Schaltungsteil

function emphasizeVA (c0) {
  if (c0 != current) return;                               // Hervorhebung unnötig?
  ctx.fillStyle = colorEmphasize;                          // Füllfarbe
  ctx.fillRect(c0.x+c0.w/2-30,c0.y+c0.h/2-30,60,60);       // Farbiges Rechteck
  }

//-------------------------------------------------------------------------------------------------

// Methoden für Widerstände

// Die Methoden stammen aus der Java-Klasse Resistor mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "R". Ein neues Instanzattribut res steht für den Wert des Widerstands in Ohm.

// Ersatz für Resistor-Konstruktor:
// r ... Wert des Widerstands (Ohm)

function newResistor (r) {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "R";                                            // Typ Widerstand
  c.res = r;                                               // Wert des Widerstands (Ohm)
  return c;                                                // Rückgabewert
  }
  
// Komplexer Widerstand:

function getResistanceR (c0) {
  return {x: c0.res, y: 0};                                // Rückgabewert
  }
  
// Rechteck mit schwarzem Rand:
// (x,y) ... Koordinaten der Ecke links oben (Pixel)
// w ....... Breite (Pixel)
// h ....... Höhe (Pixel)
// c ....... Füllfarbe (optional)

function rectangle (x, y, w, h, c) {
  if (c) ctx.fillStyle = c;                                // Füllfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillRect(x,y,w,h);                                   // Rechteck ausfüllen
  ctx.lineWidth = 2;                                       // Liniendicke
  ctx.strokeRect(x,y,w,h);                                 // Rand zeichnen
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Widerstand)

function paintR (c0) {
  emphasizeRLC(c0);                                        // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt (Pixel)
  var c = (c0==current ? colorEmphasize : colorBackground);   // Füllfarbe
  rectangle(x0-W2,y0-H2,2*W2,2*H2,c);                      // Rechteck als Widerstandssymbol
  if (c0.parent == null || c0.parent.type != "P") {        // Falls c0 nicht Teil einer Parallelschaltung ...
    line(c0.x,y0,x0-W2,y0);                                // Zuleitung links
    line(x0+W2,y0,c0.x+c0.w,y0);                           // Zuleitung rechts
    }
  var s = toStringR(c0.res)+" "+ohm;                       // Zeichenkette für Widerstandsangabe
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var len = ctx.measureText(s).width;                      // Breite der Widerstandsangabe (Pixel)
  var y = (len>2*W2-4 ? y0+22 : y0+5);                     // y-Koordinate für Widerstandsangabe (Pixel)
  ctx.fillText(s,x0,y);                                    // Widerstandsangabe (im Rechteck bzw. darunter)
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Spulen

// Die Methoden stammen aus der Java-Klasse Coil mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "L". Ein neues Instanzattribut ind steht für den Wert der Induktivität in Henry.

// Ersatz für Coil-Konstruktor:

function newCoil (l) {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "L";                                            // Typ Spule
  c.ind = l;                                               // Wert der Induktivität (H)
  return c;                                                // Rückgabewert
  }
  
// Komplexer Widerstand:

function getResistanceL (c0) {
  return {x: 0, y: omega*c0.ind};                          // Rückgabewert
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Spule)

function paintL (c0) {
  emphasizeRLC(c0);                                        // Eventuell hervorheben
  newPath("#000000",2.5);                                  // Neuer Grafikpfad für Polygonzug
  var xM = c0.x+c0.w/2, yM = c0.y+c0.h/2;                  // Mittelpunkt der Spule (Pixel)
  ctx.moveTo(xM-W2,yM);                                    // Anfangspunkt (links)
  var i = 0, x, y, W0 = 11;                                // Variable
  while (i <= 2*W2) {                                      // Solange rechtes Spulenende noch nicht erreicht ...
    var wi = i*Math.PI*W0/(2*W2);                          // Winkel (Bogenmaß)
    if (i < 2*W2/W0) x = xM-W2+2*i;                        // x-Koordinate für linkes Ende
    else if (i <= 20*W2/W0)                                // x-Koordinate für Mittelteil
      x = xM-W2+i-2*W2*Math.cos(wi)/W0;
    else x = xM+2*i-3*W2;                                  // x-Koordinate für rechtes Ende
    y = yM-H2*Math.sin(wi);                                // y-Koordinate
    ctx.lineTo(x,y);                                       // Linie zum Polygonzug hinzufügen 
    i++;                                                   // Schleifenvariable erhöhen 
    }
  ctx.stroke();                                            // Spule zeichnen
  line(c0.x,yM,xM-W2,yM);                                  // Anschlussdraht links
  line(xM+W2,yM,c0.x+c0.w,yM);                             // Anschlussdraht rechts
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var s = toStringR(c0.ind);                               // Zeichenkette für Zahlenwert (H)
  ctx.fillText(s+" "+henry,xM,yM+H2+15);                   // Induktivität ausgeben
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Kondensatoren

// Die Methoden stammen aus der Java-Klasse Capacitor mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "C". Ein neues Instanzattribut cap steht für den Wert der Kapazität in Farad.

// Ersatz für Capacitor-Konstruktor:

function newCapacitor (c) {
  var k = newCombRLC();                                    // type, parent, next, x, y, w, h
  k.type = "C";                                            // Typ Kondensator
  k.cap = c;                                               // Wert der Kapazität (F)
  return k;                                                // Rückgabewert
  }
  
// Komplexer Widerstand:

function getResistanceC (c0) {
  return {x: 0, y: -1/(omega*c0.cap)};                     // Rückgabewert
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Kondensator)

function paintC (c0) {
  emphasizeRLC(c0);                                        // Eventuell hervorheben
  var xM = c0.x+c0.w/2, yM = c0.y+c0.h/2;                  // Mittelpunkt (Pixel)
  ctx.fillStyle = "#000000";                               // Füllfarbe
  ctx.fillRect(xM-H2,yM-3*H2/2,4,3*H2);                    // Linke Platte
  ctx.fillRect(xM+H2-4,yM-3*H2/2,4,3*H2);                  // Rechte Platte
  line(c0.x,yM,xM-H2,yM);                                  // Anschlussdraht links
  line(xM+H2,yM,c0.x+c0.w,yM);                             // Anschlussdraht rechts
  ctx.textAlign = "center";                                // Textausrichtung
  var s = toStringR(1e6*c0.cap);                           // Zeichenkette für Zahlenwert
  ctx.fillText(s+" "+microfarad,xM,yM+3*H2/2+15);          // Kapazität ausgeben
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Voltmeter

// Die Methoden stammen aus der Java-Klasse Voltmeter mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "V".

// Ersatz für Voltmeter-Konstruktor:

function newVoltmeter () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "V";                                            // Typ Voltmeter
  return c;                                                // Rückgabewert
  }
  
// Grafikausgabe: 
// c0 ... Gegebener Schaltungsteil (Voltmeter)
  
function paintV (c0) {
  emphasizeVA(c0);                                         // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt
  circle(x0,y0,20,colorBackground,colorVoltage,2);         // Kreis
  arrow(x0-10,y0+10,x0+10,y0-10,2);                        // Pfeil von links unten nach rechts oben
  line(c0.x,y0,x0-20,y0);                                  // Zuleitung links
  line(x0+20,y0,c0.x+c0.w,y0);                             // Zuleitung rechts
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = colorVoltage;                            // Schriftfarbe
  ctx.fillText(stringVoltage(c0),x0+16,y0-16);             // Angezeigte Spannung (Volt)
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Amperemeter

// Die Methoden stammen aus der Java-Klasse Amperemeter mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Das geerbte Instanzattribut type hat den Wert "A".

// Ersatz für Amperemeter-Konstruktor:

function newAmperemeter () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "A";                                            // Typ Amperemeter
  return c;                                                // Rückgabewert
  }
  
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Amperemeter)
  
function paintA (c0) {
  emphasizeVA(c0);                                         // Eventuell hervorheben
  var x0 = c0.x+c0.w/2, y0 = c0.y+c0.h/2;                  // Mittelpunkt
  circle(x0,y0,20,colorBackground,colorAmperage,2);        // Kreis
  arrow(x0-10,y0+10,x0+10,y0-10,2);                        // Pfeil von links unten nach rechts oben
  line(c0.x,y0,x0-20,y0);                                  // Zuleitung links
  line(x0+20,y0,c0.x+c0.w,y0);                             // Zuleitung rechts
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = colorAmperage;                           // Schriftfarbe
  ctx.fillText(stringAmperage(c0),x0+16,y0-16);            // Angezeigte Stromstärke (Ampere)
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Serien- und Parallelschaltungen

// Die Methoden stammen aus der abstrakten Java-Klasse CombSerPar mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen).
// Für das zusätzliche Instanzattribut type sind die Werte "S" und "P" möglich.
// Das neue Instanzattribut first steht für den Anfang der Serien- oder Parallelschaltung (eine Hierachiestufe tiefer).

// Ermittlung des letzten untergeordneten Schaltungsteils:
// c0 ... Gegebene Serien- oder Parallelschaltung
// Bei fehlgeschlagener Suche ist der Rückgabewert null. 

function getLast (c0) {
  var i = c0.first;                                        // Anfang der Schaltung oder null
  if (i == null) return null;                              // Rückgabewert bei fehlgeschlagener Suche
  while (i.next != null) i = i.next;                       // Übergang zu Nachfolgern
  return i;                                                // Rückgabewert
  }
  
// Zahl der Bestandteile (eine Hierarchiestufe tiefer):
// c0 ... Gegebene Serien- oder Parallelschaltung
  
function getNumber (c0) {
  var n = 0;                                               // Variable für die Anzahl, Startwert
  var i = c0.first;                                        // Anfang der Schaltung
  while (i != null) {n++; i = i.next;}                     // Bei gefundenen Bestandteilen Anzahl erhöhen
  return n;                                                // Rückgabewert
  } 
  
// Reduzierung einer Serien- oder Parallelschaltung mit nur einem Element:
// c0 ... Gegebene Serien- oder Parallelschaltung
// Seiteneffekt root, current
  
function simplify (c0) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil
  var f = c0.first;                                        // Anfang der Serien- oder Parallelschaltung c0   
  if (f.next != null) return;                              // Falls mehr als ein Element, abbrechen  
  var a = (c0 == current);                                 // Überprüfung, ob aktueller Schaltungsteil
  if (p == null) {                                         // Falls kein übergeordneter Schaltungsteil vorhanden ...
    root = current = f;                                    // Referenzen auf einziges Element
    f.parent = f.next = null;                              // Referenzen löschen, da nicht mehr nötig
    return;                                                // Abbrechen
    }
  if (isSingle(p)) return;                                 // Sicher ist sicher!
  f.parent = p;                                            // Referenz auf übergeordneten Schaltungsteil
  f.next = c0.next;                                        // Referenz auf Nachfolger von c0
  if (c0 == p.first) p.first = f;                          // Referenz auf einziges Element
  else getPrevious(c0).next = f;                           // Referenz auf einziges Element
  if (a) current = p;                                      // Aktueller Schaltungsteil
  }   

  
// Hervorhebung: 
// c0 ... Gegebene Serien- oder Parallelschaltung

function emphasizeSerPar (c0) {
  if (c0 != current) return;                               // Hervorheben unnötig?
  ctx.fillStyle = colorEmphasize;                          // Füllfarbe
  ctx.fillRect(c0.x+5,c0.y+5,c0.w-10,c0.h-10);             // Ausgefülltes Rechteck
  }
  
//-------------------------------------------------------------------------------------------------

// Methoden für Serienschaltungen

// Die Methoden stammen aus der Java-Klasse CombSer mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen),
// type (mit Wert "S") und first (Anfang der Serienschaltung, eine Hierachiestufe tiefer).

// Ersatz für CombSer-Konstruktor:

function newCombSer () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "S";                                            // Typ Serienschaltung
  c.first = null;                                          // Anfang der Serienschaltung
  return c;                                                // Rückgabewert
  }
  
// Hinzufügen eines Schaltungsteils (in Serie):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt current
  
function insertSerS (c0, c) {
  getLast(c0).next = current = c;                          // Referenzen auf neuen Schaltungsteil
  c.parent = c0;                                           // Referenz auf gegebene Serienschaltung 
  }
  
// Hinzufügen eines Schaltungsteils (parallel):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt root, current
  
function insertParS (c0, c) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil
  if (p == null) {                                         // Falls c0 einziger Schaltungsteil ...
    root = newCombPar();                                   // Neue Parallelschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Parallelschaltung
    c0.parent = c.parent = root;                           // Referenzen auf neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    var par = newCombPar();                                // Neue Parallelschaltung
    par.parent = p;                                        // Referenz auf übergeordnete Serienschaltung
    var prev = getPrevious(c0);                            // Vorgänger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Serienschaltung ...
      p.first = c.parent = par;                            // Referenzen auf neue Parallelschaltung 
      c0.next = c;                                         // Referenz auf neuen Schaltungsteil               
      }
    else                                                   // Falls c0 nicht am Anfang der Serienschaltung ...                                  
      prev.next = par;                                     // Referenz auf neue Parallelschaltung
    par.next = c0.next;                                    // Referenz auf Nachfolger in der Serienschaltung
    par.first = c0;                                        // Referenz auf gegebenen Schaltungsteil
    c0.parent = c.parent = par;                            // Referenzen auf neue Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    c.parent = p;                                          // Referenz auf übergeordnete Parallelschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger in der Parallelschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  }
  
 // Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente:
 // c0 ... Gegebener Schaltungsteil (Serienschaltung)
 // nH ... Zahl der maximal nebeneinander liegenden Einzelelemente des neuen Schaltungsteils
 // Dabei wird angenommen, dass rechts neben dem Schaltungsteil current ein neuer Schaltungsteil eingebaut wird.
    
function getNHorFictS (c0, nH) {
  if (c0 == root && c0 == current) return getNHor(c0)+nH;  // Rückgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  var n = 0;                                               // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (i == current) n += getNHor(i)+nH;                  // Anzahl aktualieren, 1. Fall
    else n += getNHorFict(i,nH);                           // Anzahl aktualisien, 2. Fall
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return n;                                                // Rückgabewert
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
   
function getNHorS (c0) {
  var i = c0.first;                                        // Anfang der Serienschaltung
  var n = 0;                                               // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    n += getNHor(i);                                       // Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return n;                                                // Rückgabewert
  }
  
// Fiktive Zahl der maximal übereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// nV ... Zahl der maximal übereinander liegenden Einzelelemente des neuen Schaltungsteils
// Dabei wird angenommen, dass unterhalb des Schaltungsteils current ein neuer Schaltungsteil eingebaut wird.
    
function getNVertFictS (c0, nV) {
  var nMax = 0;                                            // Variable für Anzahl, Startwert
  if (c0 == root && c0 == current) return getNVert(c0)+nV; // Rückgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n;                                                 // Hilfsvariable
    if (i == current) n = getNVert(i)+nV;                  // Hilfsvariable, 1. Fall
    else n = getNVertFict(i,nV);                           // Hilfsvariable, 2. Fall
    if (n > nMax) nMax = n;                                // Falls größer als bisher, Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return nMax;                                             // Rückgabewert	
  }
  
// Wirkliche Zahl der maximal übereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function getNVertS (c0) {
  var i = c0.first;                                        // Anfang der Serienschaltung
  var nMax = 0;                                            // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n = getNVert(i);                                   // Hilfsvariable
    if (n > nMax) nMax = n;                                // Falls größer als bisher, Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return nMax;                                             // Rückgabewert
  }
  
// Ersatzwiderstand:
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function getResistanceS (c0) {
  var res = {x: 0, y: 0};                                  // Variable für (komplexen) Ersatzwiderstand, Startwert
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var r = getResistance(i);                              // Teilwiderstand (komplexe Zahl)
    if (isInfinite(r)) return POS_INF;                     // Rückgabewert, falls Teilwiderstand unendlich
    else res = sum(res,r);                                 // Aktuellen Teilwiderstand zur Summe hinzufügen
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return res;                                              // Rückgabewert 
  }
  
// Geometrische Neuanordnung der Schaltung (rekursiv):
// c0 ... Gegebener Schaltungsteil (Serienschaltung)
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... Höhe (Pixel)
// Seiteneffekt: (x,y,w,h) für untergeordnete Schaltungsteile
  
function arrangeS (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben übernehmen
  var n = getNHor(c0);                                     // Anzahl der nebeneinander liegenden Schaltungsteile
  var xx = x;                                              // x-Koordinate eines Bestandteils der Serienschaltung
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var ww = getNHor(i)*w/n;                               // Breite eines Bestandteils der Serienschaltung
    arrange(i,xx,y,ww,h);                                  // Geometrische Anordnung für Bestandteil (Rekursion!)
    xx += ww;                                              // x-Koordinate für nächsten Bestandteil
    i = i.next;                                            // Nächster Schaltungsteil
    }
  }
    
 // Grafikausgabe:
 // c0 ... Gegebener Schaltungsteil (Serienschaltung)
  
function paintS (c0) {
  emphasizeSerPar(c0);                                     // Serienschaltung hervorheben
  var i = c0.first;                                        // Anfang der Serienschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    paint(i);                                              // Schaltungsteil zeichnen
    i = i.next;                                            // Nächster Schaltungsteil
    }
  }

//-------------------------------------------------------------------------------------------------

// Methoden für Parallelschaltungen

// Die Methoden stammen aus der Java-Klasse CombPar mit den geerbten Klassenattributen u0 (Batteriespannung), 
// root (Wurzel der Baumstruktur) und current (aktueller Teil) sowie den geerbten Instanzattributen parent (übergeordneter 
// Schaltungsteil), next (nächster gleichrangiger Schaltungsteil), x, y, w, h (Position und Abmessungen),
// type (mit Wert "P") und first (Anfang der Parallelschaltung, eine Hierachiestufe tiefer).

// Ersatz für CombPar-Konstruktor:

function newCombPar () {
  var c = newCombRLC();                                    // type, parent, next, x, y, w, h
  c.type = "P";                                            // Typ Parallelschaltung
  c.first = null;                                          // Anfang der Parallelschaltung
  return c;                                                // Rückgabewert
  }
  
// Hinzufügen eines Schaltungsteils (in Serie):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt root, current
  
function insertSerP (c0, c) {
  var p = c0.parent;                                       // Übergeordneter Schaltungsteil
  if (p == null) {                                         // Falls c0 einziger Schaltungsteil ...
    root = newCombSer();                                   // Neue Serienschaltung als Wurzel
    root.first = c0;                                       // Gegebener Schaltungsteil als Anfang der Serienschaltung
    c0.parent = c.parent = root;                           // Referenzen auf neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf neuen Schaltungsteil
    return;                                                // Abbrechen
    }
  if (p.type == "S") {                                     // Falls c0 Teil einer Serienschaltung ...
    c.parent = p;                                          // Referenz auf übergeordnete Serienschaltung 
    c.next = c0.next;                                      // Referenz auf Nachfolger in der Serienschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  else if (p.type == "P") {                                // Falls c0 Teil einer Parallelschaltung ...
    var ser = newCombSer();                                // Neue Serienschaltung
    ser.parent = p;                                        // Referenz auf übergeordnete Parallelschaltung
    var prev = getPrevious(c0);                            // Vorgänger von c0 (oder c0 am Anfang)
    if (prev == c0) {                                      // Falls c0 am Anfang der Parallelschaltung ...
      p.first = c.parent = ser;                            // Referenzen auf neue Serienschaltung
      c0.next = c;                                         // Referenz auf den neuen Schaltungsteil
      }
    else                                                   // Falls c0 nicht am Anfang der Parallelschaltung ...
      prev.next = ser;                                     // Referenz auf neue Serienschaltung
    ser.next = c0.next;                                    // Referenz auf Nachfolger in der Parallelschaltung
    ser.first = c0;                                        // Referenz auf gegebenen Schaltungsteil
    c0.parent = c.parent = ser;                            // Referenzen auf die neue Serienschaltung
    c0.next = current = c;                                 // Referenzen auf den neuen Schaltungsteil
    }
  }
  
// Hinzufügen eines Schaltungsteils (parallel):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// c .... neuer Schaltungsteil
// Seiteneffekt current
  
function insertParP (c0, c) {
  getLast(c0).next = current = c;                          // Referenzen auf den neuen Schaltungsteil
  c.parent = c0;                                           // Referenz auf den gegebenen Schaltungsteil
  }
  
// Fiktive Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// nH ... Zahl der maximal nebeneinander liegenden Einzelelemente des neuen Schaltungsteils
    
function getNHorFictP (c0, nH) {
  var nMax = 0;                                            // Variable für Anzahl
  if (c0 == root && c0 == current) return getNHor(c0)+nH;  // Rückgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Parallelschaltung
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n;                                                 // Hilfsvariable
    if (i == current) n = getNHor(i)+nH;                   // Hilfsvariable, 1. Fall
    else n = getNHorFict(i,nH);                            // Hilfsvariable, 2. Fall
    if (n > nMax) nMax = n;                                // Falls größer als bisher, Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungteil
    }
  return nMax;                                             // Rückgabewert  		
  }
  
// Wirkliche Zahl der maximal nebeneinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getNHorP (c0) {
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var nMax = 0;                                            // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var n = getNHor(i);                                    // Hilfsvariable
    if (n > nMax) nMax = n;                                // Falls größer als bisher, Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return nMax;                                             // Rückgabewert
  }
  
// Fiktive Zahl der maximal übereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// nV ... Zahl der maximal übereinander liegenden Einzelelemente des neuen Schaltungsteils
  
function getNVertFictP (c0, nV) {
  if (c0 == root && c0 == current) return getNVert(c0)+nV; // Rückgabewert, falls c0 komplette Schaltung
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var n = 0;                                               // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    if (i == current) n += getNVert(i)+nV;                 // Anzahl aktualisieren, 1. Fall
    else n += getNVertFict(i,nV);                          // Anzahl aktualisieren, 2. Fall
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return n;                                                // Rückgabewert 	
  }
  
// Wirkliche Zahl der maximal übereinander liegenden Einzelelemente:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getNVertP (c0) {
  var i = c0.first;                                        // Anfang der Parallelschaltung
  var n = 0;                                               // Variable für Anzahl, Startwert
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    n += getNVert(i);                                      // Anzahl aktualisieren
    i = i.next;                                            // Nächster Schaltungsteil
    }
  return n;                                                // Rückgabewert
  }
  
// Ersatzwiderstand:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function getResistanceP (c0) {
  if (c0.first == null) return Number.NaN;                 // Sicher ist sicher! ???
  var res = getResistance(c0.first);                       // Widerstand des ersten Bestandteils der Parallelschaltung
  if (isZero(res)) return {x: 0, y: 0};                    // Rückgabewert, da Ersatzwiderstand schon klar   
  var i = c0.first.next;                                   // Nächster Bestandteil der Parallelschaltung oder null
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    var r2 = getResistance(i);                             // Widerstand des Bestandteils
    i = i.next;                                            // Nächster Bestandteil der Parallelschaltung oder null
    if (r2 == 0) return 0;                                 // Rückgabewert, da Ersatzwiderstand schon klar
    if (isInfinite(r2)) continue;                          // Unendlichen Widerstand ignorieren
    if (isInfinite(res)) res = r2;                         // Ersatzwiderstand aktualisieren, falls bisher unendlich
    else res = quot(prod(res,r2),sum(res,r2));             // Ersatzwiderstand aktualisieren (Normalfall)      
    }
  return res;                                              // Rückgabewert 
  }
  
// Geometrische Neuanordnung der Schaltung (rekursiv):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
// x ... Abstand vom linken Rand (Pixel)
// y ... Abstand vom oberen Rand (Pixel)
// w ... Breite (Pixel)
// h ... Höhe (Pixel)
// Seiteneffekt: (x,y,w,h) für untergeordnete Schaltungsteile
  
function arrangeP (c0, x, y, w, h) {
  c0.x = x; c0.y = y; c0.w = w; c0.h = h;                  // Angaben übernehmen
  var n = getNVert(c0)-1;                                  // Anzahl
  var i = c0.first;                                        // Anfang der Parallelschaltung
  if (getNumber(c0) == 2 && c0.first.next.type == "V") {   // Sonderfall (Widerstand mit Voltmeter)
    var yy = y+h/2-n*h/(2*n+4);                            // y-Koordinate für Bestandteil der Parallelschaltung
    while (i != null) {                                    // Solange Schaltungsteil definiert ...
      var hh = getNVert(i)*h/(n+2);                        // Höhe für aktuellen Teil der Parallelschaltung
      arrange(i,x+2*DIST,yy,w-4*DIST,hh);                  // Geometrische Anordnung für aktuellen Teil (Rekursion!)
      yy += hh;                                            // y-Koordinate für nächsten Bestandteil
      i = i.next;                                          // Nächster Schaltungsteil
      }
    } // Ende Sonderfall
  else {                                                   // Normalfall
    yy = y;                                                // y-Koordinate für Anfang der Parallelschaltung
    n++;                                                   // Anzahl um 1 erhöhen
    while (i != null) {                                    // Solange Schaltungsteil definiert ... 
      hh = getNVert(i)*h/n;                                // Höhe für aktuellen Teil der Parallelschaltung
      arrange(i,x+2*DIST,yy,w-4*DIST,hh);                  // Geometrische Anordnung für aktuellen Teil (Rekursion!)
      yy += hh;                                            // y-Koordinate für nächsten Bestandteil
      i = i.next;                                          // Nächster Schaltungsteil
      }
    } // Ende Normalfall
  }
  
// Spezialfall (Widerstand mit parallelgeschaltetem Voltmeter):
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)

function paintSpecial (c0) {
  emphasize(c0);                                           // Eventuell hervorheben
  var e = c0.first;                                        // Normales Element (z. B. Widerstand)
  var v = e.next;                                          // Voltmeter
  paint(e);                                                // Normales Element zeichnen
  paint(v);                                                // Voltmeter zeichnen
  var xL = c0.x;                                           // x-Koordinate linker Rand von c0
  var xR = c0.x+c0.w;                                      // x-Koordinate rechter Rand von c0
  var xE = e.x+e.w/2;                                      // x-Koordinate des normalen Elements
  var yE = e.y+e.h/2;                                      // y-Koordinate des normalen Elements
  var yV = v.y+v.h/2;                                      // y-Koordinate des Voltmeters
  if (e.type == "R") {                                     // Falls Widerstand ...
    line(xL+DIST,yE,xE-W2,yE);                             // Anschlussdraht links
    line(xE+W2,yE,xR-DIST,yE);                             // Anschlussdraht rechts
    }
  else {                                                   // Falls kein Widerstand ...
    line(xL+DIST,yE,xL+2*DIST,yE);                         // Anschlussdraht links
    line(xR-2*DIST,yE,xR-DIST,yE);                         // Anschlussdraht rechts
    }
  line(xL+DIST,yV,xL+DIST,yE);                             // Senkrechtes Drahtstück links
  line(xR-DIST,yV,xR-DIST,yE);                             // Senkrechtes Drahtstück rechts
  circle(xL+DIST,yE,2.5,"#000000");                        // Knoten links
  circle(xR-DIST,yE,2.5,"#000000");                        // Knoten rechts
  line(xL,yE,xL+DIST,yE);                                  // Waagrechtes Drahtstück links oben
  line(xR-DIST,yE,xR,yE);                                  // Waagrechtes Drahtstück rechts oben
  line(xL+DIST,yV,xL+2*DIST,yV);                           // Waagrechtes Drahtstück links (zum Voltmeter)
  line(xR-2*DIST,yV,xR-DIST,yV);                           // Waagrechtes Drahtstück rechts (zum Voltmeter)
  }
    
// Grafikausgabe:
// c0 ... Gegebener Schaltungsteil (Parallelschaltung)
  
function paintP (c0) {
  if (getNumber(c0) == 2 && c0.first.next.type == "V")     // Falls einzelnes Element mit Voltmeter ...
    {paintSpecial(c0); return;}                            // Spezielle Methode aufrufen und abbrechen
  emphasize(c0);                                           // Eventuell hervorheben
  var i = c0.first;                                        // Anfang der Parallelschaltung (oben)
  var y1 = 0, y0 = i.y+i.h/2;                              // y-Koordinaten
  var xL = c0.x;                                           // x-Koordinate linker Rand von c0
  var xR = c0.x+c0.w;                                      // x-Koordinate rechter Rand von c0
  ctx.fillStyle = "#000000";                               // Füllfarbe
  while (i != null) {                                      // Solange Schaltungsteil definiert ...
    paint(i);                                              // Schaltungsteil zeichnen
    if (i.next == null) y1 = i.y+i.h/2;                    // Falls Schaltungsteil undefiniert, y1 ändern
    var yy = i.y+i.h/2;                                    // y-Koordinate für aktuellen Schaltungsteil
    var node = (i != c0.first && i.next != null);          // Bedingung für Knoten
    if (node) {                                            // Falls Knoten vorhanden ...
      circle(xL+DIST,yy,2.5,"#000000");                    // Knoten links
      circle(xR-DIST,yy,2.5,"#000000");                    // Knoten rechts
      }
    if (i.type == "R") {                                   // Falls Widerstand ...
      line(xL+DIST,yy,i.x+i.w/2-W2,yy);                    // Zuleitung links
      line(i.x+i.w/2+W2,yy,xR-DIST,yy);                    // Zuleitung rechts
      }
    else {                                                 // Falls kein Widerstand ...
      line(xL+DIST,yy,xL+2*DIST,yy);                       // Zuleitung links
      line(xR-2*DIST,yy,xR-DIST,yy);                       // Zuleitung rechts
      }
    i = i.next;                                            // Nächster Bestandteil der Parallelschaltung
    } // Ende while-Schleife
  line(xL+DIST,y0,xL+DIST,y1);                             // Senkrechter Draht links
  line(xR-DIST,y0,xR-DIST,y1);                             // Senkrechter Draht rechts
  y0 = c0.y+c0.h/2;                                        // y-Koordinate
  line(xL,y0,xL+DIST,y0);                                  // Kurzer Anschlussdraht links
  circle(xL+DIST,y0,2.5,"#000000");                        // Knoten links
  line(xR-DIST,y0,xR,y0);                                  // Kurzer Anschlussdraht rechts
  circle(xR-DIST,y0,2.5,"#000000");                        // Knoten rechts
  }

 

  




