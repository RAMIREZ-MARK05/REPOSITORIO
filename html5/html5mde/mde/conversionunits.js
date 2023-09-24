// Umrechnung von Einheiten
// Java-Applet (25.03.2001) umgewandelt
// 07.04.2017 - 07.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel conversionunits_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorFoundation = "#ffc0a0";                           // Farbe der Stütze
var colorWheel = "#00ffff";                                // Farbe des Rahmens
var colorCabin = [                                         // Farben der Gondeln
  "#ff0000", "#0000ff", "#00ff00", "#ffc040", "#ff00ff"];
  
// Weitere Konstanten:

var N = 5;                                                 // Zahl der Größen
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Aufbau der Array-Elemente für die verschiedenen Größen: 
// unit (Einheit, Zeichenkette), coeff (Koeffizient, ganzzahlig), expo (Zehnerexponent, ganzzahlig)
// Einschränkung: Die Einheiten müssen aufsteigend geordnet sein; für die kleinste Einheit muss coeff gleich 1 sein.
    
var LENGTH = [                                             // Länge
  {unit: "mm", coeff: 1, expo: -3},                        // Millimeter; 1 mm = 1 x 10^(-3) m
  {unit: "cm", coeff: 1, expo: -2},                        // Zentimeter; 1 cm = 1 x 10^(-2) m   
  {unit: "dm", coeff: 1, expo: -1},                        // Dezimeter; 1 dm = 1 x 10^(-1) m
  {unit: "m", coeff: 1, expo: 0},                          // Meter
  {unit: "km", coeff: 1, expo: 3}                          // Kilometer; 1 km = 1 x 10^3 m
  ];
  
var AREA = [                                               // Fläche
  {unit: "mm\u00B2", coeff: 1, expo: -6},                  // Quadratmillimeter; 1 mm^2 = 1 x 10^(-6) m^2
  {unit: "cm\u00B2", coeff: 1, expo: -4},                  // Quadratzentimeter; 1 cm^2 = 1 x 10^(-4) m^2
  {unit: "dm\u00B2", coeff: 1, expo: -2},                  // Quadratdezimeter; 1 dm^2 = 1 x 10^(-2) m^2
  {unit: "m\u00B2", coeff: 1, expo: 0},                    // Quadratmeter
  {unit: "a", coeff: 1, expo: 2},                          // Ar; 1 a = 10^2 m^2
  {unit: "ha", coeff: 1, expo: 4},                         // Hektar; 1 ha = 10^4 m^2
  {unit: "km\u00B2", coeff: 1, expo: 6}                    // Quadratkilometer; 1 km^2 = 1 x 10^6 m^2
  ];
  
var VOLUME = [                                             // Volumen
  {unit: "mm\u00B3", coeff: 1, expo: -9},                  // Kubikmillimeter; 1 mm^3 = 1 x 10^(-9) m^3
  {unit: "cm\u00B3", coeff: 1, expo: -6},                  // Kubikzentimeter; 1 cm^3 = 1 x 10^(-6) m^3
  {unit: "dm\u00B3", coeff: 1, expo: -3},                  // Kubikdezimeter; 1 dm^3 = 1 x 10^(-3) m^3
  {unit: "m\u00B3", coeff: 1, expo: 0},                    // Kubikmeter
  {unit: "km\u00B3", coeff: 1, expo: 9}                    // Kubikkilometer; 1 km^3 = 1 x 10^9 m^3
  ];
  
var MASS = [                                               // Masse
  {unit: "mg", coeff: 1, expo: -6},                        // Milligramm; 1 mg = 1 x 10^(-6) kg
  {unit: "g", coeff: 1, expo: -3},                         // Gramm; 1 g = 1 x 10^(-3) kg
  {unit: "kg", coeff: 1, expo: 0},                         // Kilogramm
  {unit: "t", coeff: 1, expo: 3}                           // Tonne; 1 t = 1 x 10^3 kg
  ];
  
var TIME = [                                               // Zeit
  {unit: "s", coeff: 1, expo: 0},                          // Sekunde
  {unit: "min", coeff: 6, expo: 1},                        // Minute; 1 min = 6 x 10^1 s
  {unit: "h", coeff: 36, expo: 2},                         // Stunde; 1 h = 36 x 10^2 s
  {unit: "d", coeff: 864, expo: 2}                         // Tag; 1 d = 864 x 10^2 s
  ];

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var bu1, bu2;                                              // Schaltknöpfe
var cb1, cb2, cb3, cb4, cb5;                               // Optionsfelder
var ch1, ch2;                                              // Auswahlfelder
var lbItem;                                                // Feld für Angabe
var lbUnit;                                                // Feld für gewünschte Einheit
var ip;                                                    // Eingabefeld
var quantities;                                            // Array von Flags (Größen)
var qu;                                                    // Aktuelle Größe
var i1, i2;                                                // Indizes der Einheiten
var coeff;                                                 // Koeffizient des Umrechnungsfaktors (ganzzahlig)
var expo;                                                  // Exponent des Umrechnungsfaktors (ganzzahlig)
var n1, n2;                                                // Zahlen
var digits1;                                               // Zahl der Nachkommastellen von n1
var items;                                                 // Zahl der gerechneten Aufgaben (0 bis 10)
var success;                                               // Zahl der richtig gelösten Aufgaben (0 bis 10)
var level;                                                 // Schwierigkeitsgrad (1 bis 4)
var xM, yM;                                                // Mittelpunkt Riesenrad
var type;                                                  // Aufgabentyp
                                                           // 1 ... große Einheit -> kleine Einheit
                                                           // 2 ... 2 verschiedene Einheiten -> kleine Einheit
                                                           // 3 ... 3 verschiedene Einheiten -> kleine Einheit
                                                           // 4 ... kleine Einheit -> große Einheit
var subtype;                                               // Untertyp   
                                                           // 1 ... beide Zahlen ohne Komma
                                                           // 2 ... eine Zahl mit Komma
                                                           // 3 ... beide Zahlen mit Komma
var state;                                                 // Zustand
                                                           // 1 ... Größen und Schwierigkeitsgrad auswählen
                                                           // 2 ... Aufgaben in Bearbeitung
                                                           // 3 ... Aufgabenserie beendet
var on;                                                    // Flag für Animation
var timer;                                                 // Timer für Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var tMax;                                                  // Maximale Dauer der Animation (s)

// Start:

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Neu anfangen)
  bu1.disabled = false;                                    // Schaltknopf zunächst aktiviert
  bu2 = getElement("bu2",text02);                          // Schaltknopf (Start)
  bu2.disabled = false;                                    // Schaltknopf zunächst aktiviert
  cb1 = newCheckbox("cb1","lb1",text03,true);              // Optionsfeld (Länge)
  cb1.checked = true;                                      // Optionsfeld zunächst ausgewählt
  cb2 = newCheckbox("cb2","lb2",text04);                   // Optionsfeld (Fläche)
  cb3 = newCheckbox("cb3","lb3",text05);                   // Optionsfeld (Volumen)
  cb4 = newCheckbox("cb4","lb4",text06);                   // Optionsfeld (Masse)
  cb5 = newCheckbox("cb5","lb5",text07);                   // Optionsfeld (Zeit)
  getElement("lb",text08);                                 // Erklärender Text (Schwierigkeitsgrad)
  ch1 = newSelect("ch1");                                  // Auswahlfeld (Schwierigkeitsgrad)
  enable(true);                                            // Wahl von Größen und Schwierigkeitsgrad ermöglichen
  getElement("author",author);                             // Autor (und Übersetzer)
  lbItem = getElement("item");                             // Feld für Angabe
  lbUnit = getElement("unit");                             // Feld für gewünschte Einheit
  ip = getElement("ip");                                   // Eingabefeld
  ip.value = "";                                           // Eingabefeld zunächst leer
  ip.disabled = false;                                     // Eingabefeld aktiviert
  ch2 = getElement("ch2");                                 // Auswahlfeld für Ergebnisliste
  quantities = new Array(N);                               // Array von Wahrheitswerten (ausgewählte Größen)
  newSeries();                                             // Neue Aufgabenserie  
  xM = width/2; yM = 150;                                  // Mittelpunkt Riesenrad (Pixel)
  paint();                                                 // Grafikausgabe
    
  bu1.onclick = reactionButton1;                           // Reaktion auf Schaltknopf (Neu anfangen)
  bu2.onclick = reactionButton2;                           // Reaktion auf Schaltknopf (Start)
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (Schwierigkeitsgrad)
  ip.onkeydown = reactionEnter;                            // Reaktion auf Entertaste (Eingabefeld)
  ip.onblur = reactionFocusLost;                           // Reaktion auf Verlust des Focus (Eingabefeld)                       
    
  } // Ende der Methode start
  
// Neues Optionsfeld (nicht ausgewählt):
// id1 ... ID des Optionsfeldes im HTML-Text
// id2 ... ID des Labels im HTML-Text
// t ..... Erklärender Text (Zeichenkette)

function newCheckbox (id1, id2, t) {
  var cb = getElement(id1);                                // Optionsfeld
  cb.checked = false;                                      // Kein Häkchen
  getElement(id2,t);                                       // Label für erklärenden Text
  return cb;                                               // Rückgabewert
  }
  
// Neues Auswahlfeld:
// id ... ID im HTML-Text

function newSelect (id) {
  ch = getElement(id);                                     // Auswahlfeld 
  ch.selectedIndex = 0;                                    // Zunächst Index 0
  return ch;                                               // Rückgabewert
  }
  
// Neue Aufgabenserie:
// Seiteneffekt state, quantities, items, success, t, tMax, ch2, lbItem, lbUnit, on, timer

function newSeries () {
  state = 1;                                               // Neuer Zustand: Wahl von Größen und Schwierigkeitsgrad
  items = success = 0;                                     // Noch keine Aufgabe gerechnet
  t = 0;                                                   // Zeitvariable zurücksetzen
  tMax = 1;                                                // Maximale Animationsdauer (s)
  lbItem.innerHTML = lbUnit.innerHTML = "";                // Angabe löschen
  ch2.length = 0;                                          // Ergebnisliste leeren
  stopAnimation();                                         // Animation beenden
  }
  
// Reaktion auf Schaltknopf (Neu anfangen):
// Seiteneffekt cb1, cb2, cb3, cb4, cb5, ch1, bu2, state, quantities, items, success, t, tMax, ch2, on, timer
    
function reactionButton1 () {
  enable(true);                                            // Wahl von Größen und Schwierigkeitsgrad aktivieren
  bu2.disabled = false;                                    // Startknopf deaktivieren
  newSeries();                                             // Neue Aufgabenserie
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (Start):
// Seiteneffekt state, quantities, level, lbItem, lbUnit, type, subtype, i1, i2, coeff, expo, n1, n2, digits1, 
// ip, cb1, cb2, cb3, cb4, cb5, ch1, bu2, on, timer
  
function reactionButton2 () {
  state = 2;                                               // Neuer Zustand: Aufgaben in Bearbeitung
  for (var i=0; i<N; i++)                                  // Für alle Indizes der Größen ...
    quantities[i] = getElement("cb"+(i+1)).checked;        // Zustand des Optionsfeldes übernehmen
  level = 1+ch.selectedIndex;                              // Schwierigkeitsgrad übernehmen
  newItem();                                               // Neue Aufgabe (zufallsbestimmt)
  enable(false);                                           // Wahl von Größen und Schwierigkeitsgrad deaktivieren
  bu2.disabled = true;                                     // Startknopf deaktivieren
  paint();                                                 // Neu zeichnen
  }
  
// Aktivierung/Deaktivierung von Optionsfeldern (Größen) und Auswahlfeld (Schwierigkeitsgrad):
// a ... Flag für Aktivierung
// Seiteneffekt cb1, cb2, cb3, cb4, cb5, ch1

function enable (a) {
  cb1.disabled = !a;                                       // Optionsfeld Länge
  cb2.disabled = !a;                                       // Optionsfeld Fläche
  cb3.disabled = !a;                                       // Optionsfeld Volumen
  cb4.disabled = !a;                                       // Optionsfeld Masse
  cb5.disabled = !a;                                       // Optionsfeld Zeit
  ch1.disabled = !a;                                       // Auswahlfeld Schwierigkeitsgrad
  }
  
// Reaktion auf Auswahlfeld (Schwierigkeitsgrad):
// Seiteneffekt level
  
function reactionSelect () {
  level = 1+ch.selectedIndex;                              // Schwierigkeitsgrad (1 bis 4)
  }
  
// Reaktion auf Eingabe (abgeschlossen durch Enter-Taste):
// Seiteneffekt items, ip, success, ch2, state, lbItem, lbUnit, tMax, cb1 (selten), quantities (selten), 
// type, subtype, i1, i2, coeff, expo, n1, n2, digits1, on, timer, t0
  
function reaction () {
  items++;                                                 // Zahl der Aufgaben erhöhen
  var eg = ip.value.replace(decimalSeparator,".");         // Eingegebene Zahl als Zeichenkette (Dezimalpunkt!)
  ip.value = "";                                           // Eingabe löschen
  var z1 = value3(lbItem.innerHTML);                       // Ganzzahliger Wert für Angabe (ohne Rundungsfehler)
  var z2 = value1(eg,i2);                                  // Ganzzahliger Wert für Eingabe (ohne Rundungsfehler)
  if (z1.compareTo(z2) == 0) success++;                    // Falls Eingabe richtig, Zahl der Treffer erhöhen
  var s = lbItem.innerHTML+" = ";                          // Zeichenkette für Ergebnisliste, Anfang
  s += decimalString(z1,i2)+" "+qu[i2].unit;               // Zeichenkette für Ergebnisliste, Fortsetzung
  var o = document.createElement("option");                // Neues option-Element
  o.text = s.replace(".",",");                             // Text (Angabe gleich richtiges Ergebnis)
  ch2.add(o);                                              // Element zur Liste hinzufügen
  ch2.selectedIndex = ch2.length-1;                        // Index für hinzugefügtes Element  
  if (success >= 10) {                                     // Falls 10 richtig gelöste Aufgaben ...
    state = 3;                                             // Neuer Zustand: Aufgabenserie beendet
    lbItem.innerHTML = lbUnit.innerHTML = "";              // Angabe löschen
    ip.readOnly = true;                                    // Eingabefeld deaktivieren
    tMax = 60;                                             // Maximale Animationsdauer 60 s
    }
  else {                                                   // Falls weniger als 10 richtig gelöste Aufgaben ...
    newItem();                                             // Neue Aufgabe (zufallsbestimmt)
    ip.readOnly = false;                                   // Eingabefeld aktivieren
    ip.focus();
    tMax = success;                                        // Maximale Animationsdauer (s)
    }
  startAnimation();                                        // Animation starten
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt items, ip, success, ch2, state, lbItem, lbUnit, tMax, cb1 (selten), quantities (selten), 
// type, subtype, i1, i2, coeff, expo, n1, n2, digits1, on, timer, t0
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    reaction();                                            // Daten übernehmen und rechnen                          
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Verlust des Focus (Eingabefeld):
  
function reactionFocusLost (e) {
  if (ip.value != "") reaction();                          // Falls Eingabefeld nicht leer, Daten übernehmen und rechnen
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

// Wahl der Größe:
// Seiteneffekt cb1, quantities (selten), qu

function selectQuantity () {
  var n = 0;                                               // Zahl der ausgewählten Größen (0 bis N)
  for (var i=0; i<N; i++) if (quantities[i]) n++;          // Ausgewählte Größen zählen
  if (n == 0) {                                            // Falls keine Größe ausgewählt ...
    cb1.checked = true;                                    // Häkchen für Optionsfeld Länge 
    quantities[0] = true;                                  // Länge ausgewählt
    }
  var i1 = Math.floor(n*Math.random());                    // Zufallsbestimmter Index für aktuelle Größe (0 bis n-1)
  var i2 = -1;                                             // Hilfsindex
  for (i=0; i<N; i++) {                                    // Für alle möglichen Größen ...
    if (quantities[i]) i2++;                               // Falls Größe ausgewählt, i2 erhöhen
    if (i2 == i1) break;                                   // Falls i1 erreicht, abbrechen
    }
  switch (i) {                                             // Je nach Index ...
    case 0: qu = LENGTH; break;                            // Länge ...
    case 1: qu = AREA; break;                              // ... oder Fläche ...
    case 2: qu = VOLUME; break;                            // ... oder Volumen ...
    case 3: qu = MASS; break;                              // ... oder Masse ...
    case 4: qu = TIME; break;                              // ... oder Zeit
    }  
  }
  
// Wahl von zwei Einheiten:
// max ... Maß für maximalen Unterschied zwischen den Einheiten
// Seiteneffekt i1, i2, coeff, expo

function select2Units (max) {
  if (qu == AREA) max--;                                   // Falls Fläche, maximalen Unterschied verkleinern
  else if (qu == VOLUME) max -= 2;                         // Falls Volumen, maximalen Unterschied verkleinern
  else if (qu == TIME) max -= 2;                           // Falls Zeit, maximalen Unterschied verkleinern
  if (max < 1) max = 1;                                    // Unterschied 0 verhindern
  var dim = qu.length;                                     // Zahl der verschiedenen Einheiten  
  i1 = Math.floor(dim*Math.random());                      // Zufallsbestimmter Index für 1. Einheit
  i2 = i1;                                                 // 2. Einheit zunächst gleich 1. Einheit
  while (i2 == i1 || Math.abs(i2-i1) > max)                // Solange Einheiten gleich oder Unterschied zu groß ... 
    i2 = Math.floor(dim*Math.random());                    // Zufallsbestimmter Index für 2. Einheit
  if (i1 < i2 && type <= 3 || i1 > i2 && type == 4) {      // Falls nötig, ...
    var h = i1; i1 = i2; i2 = h;                           // Indizes der Einheiten vertauschen
    }
  var qu1 = qu[i1], qu2 = qu[i2];                          // Abkürzungen für Einheiten
  if (i1 < i2) {                                           // Falls 1. Einheit kleiner ...
    coeff = qu2.coeff/qu1.coeff;                           // Koeffizient Umrechnungsfaktor (ganzzahlig)                
    expo = qu2.expo-qu1.expo;                              // Zehnerexponent Umrechnungsfaktor (ganzzahlig)
    }
  else {                                                   // Falls 1. Einheit größer ...
    coeff = qu1.coeff/qu2.coeff;                           // Koeffizient Umrechnungsfaktor (ganzzahlig)
    expo = qu1.expo-qu2.expo;                              // Zehnerexponent Umrechnungsfaktor (ganzzahlig)
    }
  }
  
// Zahl der Nachkommastellen:
// n ... Gegebene Zahl
// Eventuell Fehler möglich!

function digits (n) {
  n = Math.round(n*1e12);                                  // Multiplikation mit 10^12
  var i = 0;                                               // Zählervariable
  while (n%10 == 0) {i++; n = Math.floor(n/10);}           // Für jede Null am Ende Zähler erhöhen
  return 12-i;                                             // Rückgabewert
  }

// Zufallszahl (ganzzahlig):

function random () { 
  var max;                                                 // Maximale Zahl (Zehnerpotenz minus 1)
  if (qu == TIME) max = (level<3 ? 9 : 99);                // Maximale Zahl für Aufgaben zur Zeit
  else max = (level<3 ? 99 : 999);                         // Maximale Zahl für Aufgaben zu anderen Größen
  var n = Math.floor(1+max*Math.random());                 // Zufallsbestimmte ganze Zahl (1 bis max)
  if (Math.random() < 0.5) n += (10-n%10);                 // Eventuell nächste durch 10 teilbare Zahl
  return n;                                                // Rückgabewert
  }
  
// 1. Aufgabentyp, 1. Untertyp: Große Einheit -> kleine Einheit (Angabe und Ergebnis ohne Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item11 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  var nn1 = random();                                      // Zufallszahl (ganzzahlig)
  n1 = nn1; digits1 = 0;                                   // Gegebene Größe (ohne Nachkommastellen)
  n2 = n1*coeff*Math.pow(10,expo);                         // Umgewandelte Größe 
  }
  
// 1. Aufgabentyp, 2. Untertyp: Große Einheit -> kleine Einheit (Angabe mit Komma, Ergebnis ohne Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1 

function item12 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  var nn2 = random();                                      // Umgewandelte Größe (ganzzahlig)
  n2 = nn2*coeff;                                          // Umgewandelte Größe
  n1 = n2/(coeff*Math.pow(10,expo));                       // Gegebene Größe (Kommazahl)
  digits1 = digits(n1);                                    // Zahl der Nachkommastellen (Angabe)
  }
  
// 1. Aufgabentyp, 3. Untertyp: Große Einheit -> kleine Einheit (Angabe und Ergebnis mit Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item13 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  var nn2 = random();                                      // Umgewandelte Größe (ganzzahlig)
  n2 = nn2*coeff/10;                                       // Umgewandelte Größe 
  digits1 = Math.floor(digits(n2)+expo);                   // Zahl der Nachkommastellen (Angabe)
  if (Math.random() > 0.5 && level > 1) {                  // Eventuell ...
    n2 /= 10; digits1++;                                   // Mehr Nachkommastellen
    }
  if (Math.random() > 0.5 && level > 2) {                  // Eventuell ...
    n2 /= 10; digits1++;                                   // Mehr Nachkommastellen
    }
  n1 = n2/(coeff*Math.pow(10,expo));                       // Gegebene Größe (Kommazahl)
  var diff = qu[i2].expo-qu[0].expo;                       // Hilfsgröße für eventuelle Korrektur
  if (digits1-expo > diff) {                               // Falls Korrektur nötig ...                                       
    n1 *= Math.pow(10,digits1-expo-diff);                  // Gegebene Größe abändern
    n2 *= Math.pow(10,digits1-expo-diff);                  // Umgewandelte Größe abändern
    }
  digits1 = digits(n1);                                    // Zahl der Nachkommastellen (Angabe)
  }
  
// Hilfsroutine: Umwandlung des Aufgabentyps 1 in Aufgabentyp 2
// Seiteneffekt n1, n2

function toType2 () {
  var uf = coeff*Math.pow(10,expo);                        // Unzerlegter Umrechnungsfaktor
  if (n1 < 1) {                                            // Falls erste Zahl kleiner als 1 ...
    var r = Math.floor(1+9*Math.random());                 // Zufallsbestimmte ganze Zahl (1 bis 9)
    n1 += r; n2 += r*uf;                                   // Erste und zweite Zahl erhöhen 
    }
  var big = Math.floor(n1);                                // Zahl vor größerer Einheit
  var small = Math.round(n2-big*uf);                       // Zahl vor kleinerer Einheit
  if (small == 0) {                                        // Falls Zahl 0 vor kleinerer Einheit ...
    r = Math.floor(1+9*Math.random());                     // Zufallsbestimmte ganze Zahl (1 bis 9) 
    n1 += r/uf;                                            // Erste Zahl erhöhen
    }
  n2 = n1*uf;                                              // Zweite Zahl an erste Zahl anpassen
  }
  
// 2. Aufgabentyp, 2. Untertyp: Zwei verschiedene Einheiten -> kleinere Einheit (Angabe und Ergebnis ohne Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1
// Bemerkung: Die Bezeichnung item21 wäre eigentlich logischer.

function item22 () {
  item12();                                                // Aufgabentyp 1, Untertyp 2
  toType2();                                               // Umwandlung in Aufgabentyp 2
  }
  
// 2. Aufgabentyp, 3. Untertyp: Zwei verschiedene Einheiten -> kleinere Einheit (Angabe und Ergebnis mit Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item23 () {
  item13();                                                // Aufgabentyp 1, Untertyp 3
  toType2();                                               // Umwandlung in Aufgabentyp 2
  }
  
// Noch nicht realisiert: 3. Aufgabentyp: Drei benachbarte Einheiten -> kleinste Einheit

// 4. Aufgabentyp, 1. Untertyp: Kleine Einheit -> große Einheit (Angabe und Ergebnis ohne Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item41 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  n2 = random();                                           // Umgewandelte Größe (ganzzahlig) 
  n1 = n2*coeff*Math.pow(10,expo); digits1 = 0;            // Gegebene Größe (ohne Nachkommastellen) 
  }
  
// 4. Aufgabentyp, 2. Untertyp: Kleine Einheit -> große Einheit (Angabe ohne Komma, Ergebnis mit Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item42 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  n1 = random()*coeff; digits1 = 0;                        // Gegebene Größe (ohne Nachkommastellen)                              
  n2 = n1/(coeff*Math.pow(10,expo));                       // Umgewandelte Größe
  }
  
// 4. Aufgabentyp, 3. Untertyp: Kleine Einheit -> große Einheit (Angabe und Ergebnis mit Komma)
// Seiteneffekt i1, i2, coeff, expo, n1, n2, digits1

function item43 () {
  select2Units(level);                                     // Wahl zweier Einheiten
  var nn1 = random();                                      // Gegebene Größe (ganzzahlig, vorläufig)
  n1 = nn1*coeff/10;                                       // Gegebene Größe (vorläufig) 
  digits1 = digits(n1);                                    // Zahl der Nachkommastellen (gegebene Größe, vorläufig)
  if (Math.random() > 0.5 && level > 1) {                  // Eventuell ...
    n1 /= 10; digits1++;                                   // Mehr Nachkommastellen
    }
  if (Math.random() > 0.5 && level > 2) {                  // Eventuell ...
    n1 /= 10; digits1++;                                   // Mehr Nachkommastellen
    }
  n2 = n1/(coeff*Math.pow(10,expo));                       // Umgewandelte Größe (vorläufig)
  var diff = qu[i1].expo-qu[0].expo;                       // Hilfsgröße für eventuelle Korrektur                    
  if (digits1 > diff) {                                    // Falls Korrektur nötig ...
    n1 *= Math.pow(10,digits1-diff);                       // Gegebene Größe abändern
    n2 *= Math.pow(10,digits1-diff);                       // Umgewandelte Größe abändern
    digits1 = diff;                                        // Zahl der Nachkommastellen (Angabe)
    }
  }

// Angabe (gegebene Größe, Einheit nach Umwandlung):
// Seiteneffekt lbItem, lbUnit

function writeItem () {
  var u1 = qu[i1].unit, u2 = qu[i2].unit;                  // Einheiten
  var s = "";                                              // Leere Zeichenkette
  if (type == 1 || type == 4)                              // Falls Aufgabentyp 1 oder 4 ...
    s = n1.toFixed(digits1)+" "+u1;                        // Zeichenkette (Zahl und Einheit)
  else if (type == 2) {                                    // Falls Aufgabentyp 2 ...
    var big = Math.floor(n1);                              // Zahl vor größerer Einheit
    var small = n2-big*coeff*Math.pow(10,expo);            // Zahl vor kleinerer Einheit
    s = big+" "+u1+"  ";                                   // Erster Teil (Zahl und größere Einheit, danach Leerzeichen)
    s += small.toFixed(Math.max(digits1-expo,0))+" "+u2;   // Zweiter Teil (Zahl und kleinere Einheit)
    }
  lbItem.innerHTML = s.replace(".",decimalSeparator);      // Gegebene Größe
  lbUnit.innerHTML = u2;                                   // Einheit nach Umwandlung       
  }

// Neue Aufgabe:
// Seiteneffekt lbItem, lbUnit, cb1 (selten), quantities (selten), type, subtype, i1, i2, coeff, expo, n1, n2, digits1, ip

function newItem () {
  if (state == 1) {                                        // Falls Zustand vor Aufgabenserie ...
    lbItem.innerHTML = lbUnit.innerHTML = "";              // Angabe löschen
    return;                                                // Abbrechen
    }
  selectQuantity();                                        // Zufallsbestimmte Größe
  var rn = Math.random();                                  // Zufallszahl (0 bis 1)
  if (rn < 0.35) type = 1;                                 // Eventuell Aufgabentyp 1
  else if (rn < 0.6) type = 2;                             // Eventuell Aufgabentyp 2 ...
  else type = 4;                                           // Eventuell Aufgabentyp 4
  rn = Math.random();                                      // Neue Zufallszahl (0 bis 1)
  if (type == 1 || type == 4)                              // Falls Aufgabentyp 1 oder 4 ... 
    subtype = Math.floor(1+3*rn);                          // Untertyp 1, 2 oder 3
  else if (type == 2)                                      // Falls Aufgabentyp 2 ...
    subtype = Math.floor(2+2*rn);                          // Untertyp 2 oder 3
  if (level == 1 && type != 2) subtype = 1;                // Eventuell leichtere Variante
  if (level <= 2 && subtype == 3) subtype = 2;             // Eventuell leichtere Variante
  switch (10*type+subtype) {                               // Je nach Aufgabentyp und Untertyp ...
    case 11: item11(); break;                              // Aufgabentyp 1, Untertyp 1
    case 12: item12(); break;                              // Aufgabentyp 1, Untertyp 2
    case 13: item13(); break;                              // Aufgabentyp 1, Untertyp 3
    case 22: item22(); break;                              // Aufgabentyp 2, Untertyp 2
    case 23: item23(); break;                              // Aufgabentyp 2, Untertyp 3
    case 41: item41(); break;                              // Aufgabentyp 4, Untertyp 1
    case 42: item42(); break;                              // Aufgabentyp 4, Untertyp 2
    case 43: item43(); break;                              // Aufgabentyp 4, Untertyp 3
    }
  writeItem();                                             // Angabe (Zahl, Einheit nach Umwandlung)
  ip.readOnly = false;                                     // Eingabefeld aktivieren
  ip.focus();                                              // Fokus für Eingabefeld                          
  }
  
// Auswahl der richtigen Form eines Substantivs:
// a ... Array der Form ["0 ...", "1 ...", "2 ...", ... , "x ..."]
// n ... Anzahl

function form (a, n) {
  for (var i=0; i<a.length; i++) 
    if (Number(a[i].substring(0,1)) == n) return a[i];
  return ""+n+a[a.length-1].substring(1);  
  }
  
// Ganzzahliger Wert einer Größenangabe:
// s ... Zeichenkette der Zahl
// i ... Index der verwendeten Einheit
// Rückgabewert: 10^20 mal Quotient Größenangabe durch kleinste Einheit, Typ Integer
  
function value1 (s, i) {
  s = s.replace(decimalSeparator,".");                     // Eventuell Komma durch Punkt ersetzen
  var p = s.indexOf(".");                                  // Index Dezimalpunkt
  var s1 = (p>=0 ? s.substring(0,p) : s);                  // Teilzeichenkette vor dem Dezimalpunkt
  var s2 = (p>=0 ? s.substring(p+1) : "");                 // Teilzeichenkette nach dem Dezimalpunkt
  var t = undefined;                                       // Variable für Fehlermeldung
  if (s1.search(/\D/) >= 0) t = "Fehler vor dem Komma!";   // Eventuell Fehlermeldung
  if (s1.search(/\D/) >= 0) t = "Fehler nach dem Komma!";  // Eventuell Fehlermeldung
  var l2 = s2.length;                                      // Zahl der Nachkommastellen
  if (l2 > 20) t = "Zu viele Nachkommastellen!";           // Eventuell Fehlermeldung
  var e = qu[i].expo-qu[0].expo;                           // Zehnerexponent für Umrechnungszahl
  for (var j=0; j<e+20-l2; j++) s2 += "0";                 // Nullen ergänzen, um auf 20 Nachkommastellen zu kommen
  var n = new Integer(s1+s2);                              // Ganze Zahl (ohne Komma)
  n = n.multiply(new Integer(String(qu[i].coeff)));        // Multiplikation mit Koeffizient der Umrechnungszahl
  if (t) {alert(t); return undefined;}                     // Entweder Fehler ...
  else return n;                                           // ... oder sinnvoller Rückgabewert
  }
  
// Ganzzahliger Wert einer Größenangabe:
// s ... Zeichenkette der Größenangabe (Zahl und Einheit)
// Rückgabewert: 10^20 mal Quotient Größenangabe durch kleinste Einheit, Typ Integer

function value2 (s) {
  s = s.replace(decimalSeparator,".");                     // Eventuell Komma durch Punkt ersetzen
  s = s.replace(/\s/g,"");                                 // Alle Whitespace-Zeichen entfernen
  var i = s.search(/[^0123456789.]/);                      // Position der Benennung
  var u = s.substring(i);                                  // Zeichenkette für Einheit
  for (var k=0; k<qu.length; k++)                          // Für alle Indizes der Einheiten von qu ...
    if (qu[k].unit == u) break;                            // Falls Einheit gefunden, abbrechen
  return value1(s.substring(0,i),k);                       // Rückgabewert
  }
  
// Ganzzahliger Wert einer gemischten Größenangabe:
// s ... Zeichenkette
// Rückgabewert: 10^20 mal Quotient Größenangabe durch kleinste Einheit, Typ Integer

function value3 (s) {
  s = s.replace(decimalSeparator,".");                     // Eventuell Komma durch Punkt ersetzen
  var a = s.match(/([1-9][0-9]*|0)(.[0-9]+)?[^.\d]+/g);    // Array der einzelnen Größenangaben
  var v = new Integer("0");                                // Summenvariable (Integer) zunächst gleich 0
  for (var i=0; i<a.length; i++)                           // Für alle Indizes ...
    v = v.add(value2(a[i]));                               // Summenvariable aktualisieren
  return v;                                                // Rückgabewert
  }
  
// Dezimalbruch als Zeichenkette:
// n ... Ganzzahliger Wert (10^20 mal Quotient Größenangabe durch kleinste Einheit, Typ Integer)
// i ... Index der Einheit

function decimalString (n, i) {
  var a = divmod(n.modulus,array(""+qu[i].coeff));         // Ganzzahliger Quotient und Rest
  if (compare(a[1],NAT0) != 0) return undefined;           // Falls Rest ungleich 0, Rückgabewert undefiniert
  var s = string(a[0]);                                    // Quotient als Zeichenkette
  var z = 0;                                               // Variable für Zahl der Nullen am Ende
  while (s.charAt(s.length-1-z) == "0") z++;               // Zahl der Nullen am Ende bestimmen
  var e = qu[i].expo-qu[0].expo+20;                        // Hilfsgröße (Zehnerexponent)
  // Die folgenden Zeilen bewirken eine Division durch 10^e.
  if (z >= e) s = s.substring(0,s.length-e);               // 1. Fall: e Nullen am Ende streichen
  else {                                                   // 2. Fall: Weniger als e Nullen am Ende
    s = s.substring(0,s.length-z);                         // Vorhandene Nullen am Ende streichen
    var k = s.length-e+z;                                  // Position für Komma
    if (k < 0) {                                           // Falls zu wenige Stellen ...
      for (var j=0; j<-k; j++) s = "0"+s;                  // Nullen am Anfang hinzufügen
      k = 0;                                               // Position für Komma anpassen
      }
    s = s.substring(0,k)+decimalSeparator+s.substring(k);  // Zeichenkette (kann mit Komma beginnen)
    }
  if (compare(n.modulus,value1(s,i)) != 0)                 // Test, ob Zeichenkette korrekt 
    alert("Fehler?"); 
  if (k == 0) s = "0"+s;                                   // Komma am Anfang verhindern
  return s;                                                // Rückgabewert
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad (Standardwerte):
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Liniendicke (optional, Defaultwert 1)

function newPath (c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c?c:"#000000");                       // Linienfarbe
  ctx.lineWidth = (w?w:1);                                 // Liniendicke
  }
  
// Schwarz ausgefüllter Kreis:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)

function circle (x, y, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten          
  ctx.fillStyle = "#000000";                               // Füllfarbe
  ctx.fill();                                              // Ausgefüllter Kreis
  }
  
// Person:
// (x,y) ... Bezugspunkt (Mitte zwischen den Beinen, Pixel)
// pos ..... Arme nach unten (1) bzw. oben (-1)

function person (x, y, pos) {
  circle(x,y-14,2.5);                                        // Kopf
  newPath("#000000",1.5);                                    // Neuer Grafikpfad
  ctx.moveTo(x-2,y);                                         // Anfangspunkt (linkes Bein, unteres Ende)
  ctx.lineTo(x,y-11);                                        // Weiter zur Symmetrieachse
  ctx.lineTo(x+2,y);                                         // Weiter nach rechts unten (rechtes Bein, unteres Ende)
  ctx.moveTo(x-5,y-11+pos*6);                                // Neuer Anfangspunkt (linker Arm, Ende)
  ctx.lineTo(x,y-11);                                        // Weiter zur Symmetrieachse
  ctx.lineTo(x+5,y-11+pos*6);                                // Weiter zum Ende des rechten Arms
  ctx.stroke();                                              // Linien zeichnen
  }
  
// Riesenrad-Gondel:
// phi .... Winkel bezgl. tiefster Position (Bogenmaß)
// full ... Flag für besetzte Gondel
// c ...... Farbe

function cabin (phi, full, c) {
  var x = xM+100*Math.sin(phi);                            // x-Koordinate Aufhängung
  var y = yM+100*Math.cos(phi);                            // y-Koordinate Aufhängung
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x-10,y+15);                                   // Anfangspunkt (Aufhängung links)
  ctx.lineTo(x,y);                                         // Weiter nach rechts oben (Aufhängepunkt)
  ctx.lineTo(x+10,y+15);                                   // Weiter nach rechts unten (Aufhängung rechts)
  ctx.stroke();                                            // Linien (Aufhängung)
  circle(x,y,2);                                           // Aufhängepunkt
  if (full) person(x,y+23,-1);                             // Falls Gondel besetzt, Person
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.rect(x-10,y+15,20,12);                               // Rechteck vorbereiten
  ctx.fill(); ctx.stroke();                                // Rechteck, ausgefüllt mit Rand
  }
    
// Riesenrad:

function wheel () {
  var phi0 = t*Math.PI/5;                                  // Startwinkel (Bogenmaß)
  newPath("#000000",2);                                    // Neuer Grafikpfad
  for (var i=0; i<20; i++) {                               // Für alle Indizes (Speichen) ...
    var phi = phi0-i*Math.PI/10;                           // Positionswinkel (Bogenmaß)
    var r = (i%2==0 ? 100 : 90);                           // Radius (Pixel)
    var x = xM+r*Math.sin(phi);                            // x-Koordinate 
    var y = yM+r*Math.cos(phi);                            // y-Koordinate
    ctx.moveTo(xM,yM); ctx.lineTo(x,y);                    // Linie vorbereiten
    }
  ctx.stroke();                                            // Linien (Speichen)
  for (i=0; i<10; i++)                                     // Für alle Indizes (Gondeln) ...
    cabin(phi0-i*Math.PI/5,i<success,colorCabin[i%5]);     // Gondel
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorWheel;                              // Füllfarbe
  ctx.arc(xM,yM,95,0,2*Math.PI,true);                      // Äußeren Kreis vorbereiten
  ctx.moveTo(xM+90,yM);                                    // Neuer Anfangspunkt auf dem inneren Kreis
  ctx.arc(xM,yM,90,0,2*Math.PI,false);                     // Inneren Kreis vorbereiten
  ctx.fill(); ctx.stroke();                                // Rahmen, ausgefüllt mit Rand
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(xM,yM-20);                                    // Anfangspunkt (oben)
  ctx.lineTo(xM-50,yM+130);                                // Weiter nach links unten
  ctx.lineTo(xM-40,yM+130);                                // Weiter nach rechts
  ctx.lineTo(xM,yM+10);                                    // Weiter nach rechts oben
  ctx.lineTo(xM+40,yM+130);                                // Weiter nach rechts unten
  ctx.lineTo(xM+50,yM+130);                                // Weiter nach rechts
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fillStyle = colorFoundation;                         // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Stütze, ausgefüllt mit Rand
  circle(xM,yM,2);                                         // Drehachse
  }

// Grafikausgabe:
// Seiteneffekt on, timer
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    if (t > tMax) stopAnimation();                         // Falls maximale Dauer überschritten, Animation stoppen
    }
  wheel();                                                 // Riesenrad
  for (var i=0; i<10-success; i++)                         // Für alle Indizes ... 
    person(xM-20-14*i,320,1);                              // Anstehende Person
  ctx.font = FONT;                                         // Zeichensatz
  ctx.fillText(form(text09,items),20,20);                  // Zahl der Aufgaben
  ctx.fillText(form(text10,success),20,35);                // Zahl der richtig gelösten Aufgaben
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen

