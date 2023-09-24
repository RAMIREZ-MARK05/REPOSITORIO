// Abakus
// 01.08.2023 - 08.08.2023

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind in einer eigenen Datei (zum Beispiel abacus_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var color0 = "#808080";                                    // Farbe für den Rahmen
var color1 = "#0000ff";                                    // Farbe für untere Kugeln
var color2 = "#ff0000";                                    // Farbe für obere Kugeln

// Sonstige Konstanten:

var FONT = "normal normal bold 20px sans-serif";           // Zeichensatz
var W = 8;                                                 // Halbe Rahmenbreite (Pixel)
var DX = 40;                                               // Abstand der Drähte (Pixel)
var R = 10;                                                // Radius einer Kugel (Pixel)
var Y_TOP = 40;                                            // Senkrechte Bildschirmkoordinate (Rahmen oben innen)
var Y_SEP = 150;                                           // Senkrechte Bildschirmkoordinate (Trennstab, Mitte)
var Y_BOT = 320;                                           // Senkrechte Bildschirmkoordinate (Rahmen unten innen)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche
var ch;                                                    // Auswahlfeld
var ip1, ip2;                                              // Eingabefelder
var n;                                                     // Zahl der Stellen
var z;                                                     // Aktuelle Zahl
var y;                                                     // Array für senkrechte Bildschirmkoordinaten der Kugeln
var nr;                                                    // Nummer der aktuellen Kugel oder 0
var vM;                                                    // Senkrechte Bildschirmkoordinate des Mauszeigers

// Start:

function start () {
  n = 4;                                                   // Zunächst 4 Stellen
  z = Math.floor(5000*Math.random());                      // Zufälliger Startwert für Zahl
  y = getArray(z);                                         // Bildschirmkoordinaten der Kugel
  nr = 0;                                                  // Zunächst keine Kugel ausgewählt
  getElement("lb1",text01);                                // Erklärender Text (Stellenzahl)
  ch = newSelect("ch",4,10);                               // Auswahlfeld (Stellenzahl)
  getElement("lb2",text02);                                // Erklärender Text (Dezimalschreibweise)
  ip1 = getElement("ip1");                                 // Eingabefeld (Dezimalschreibweise)
  ip1.value = String(z);                                   // Startwert im Eingabefeld eintragen
  getElement("lb3",text03);                                // Erklärender Text (römische Zahlenschreibweise)
  ip2 = getElement("ip2");                                 // Eingabefeld (römische Zahlenschreibweise)
  ip2.value = toRoman(z);                                  // Startwert im Eingabefeld eintragen
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  paint();                                                 // Neu zeichnen
  
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (Stellenzahl)
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Dezimalschreibweise)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (römische Zahlenschreibweise)
  ip1.onfocus = reaction2;                                 // Reaktion auf Übergang des Fokus auf das obere Eingabefeld
  ip2.onfocus = reaction1;                                 // Reaktion auf Übergang des Fokus auf das untere Eingabefeld
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegung der Maus
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegung eines Fingers
  canvas.onmouseup = reactionUp;                           // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionUp;                          // Reaktion auf Ende der Berührung
     
  } // Ende der Methode start
  
// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  }
  
// Neues Auswahlfeld für die Eingabe einer ganzen Zahl:
// id .... ID im HTML-Text
// min ... Minimum
// max ... Maximum
  
function newSelect (id, min, max) {
  var ch = getElement(id);                                 // Neues Auswahlfeld (gemäß ID)
  for (var i=min; i<=max; i++) {                           // Für alle möglichen Zahlen ...
    var o = document.createElement("option");              // Neue Option
    o.text = String(i);                                    // Zeichenkette der Option
    ch.add(o);                                             // Option zum Auswahlfeld hinzufügen
    }
  return ch;                                               // Rückgabewert
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt n, y
  
function reactionSelect (e) {
  n = ch.selectedIndex+4;                                  // Zahl der Dezimalstellen
  y = getArray(z);                                         // Array neu berechnen
  paint();                                                 // Neu zeichnen
  }
  
// Hilfsroutine: Zahl aus dem oberen Eingabefeld (Dezimalschreibweise), Überprüfung, ggf. Korrektur,
// Aktualisierung der beiden Eingabefelder, Grafikausgabe
// Seiteneffekt z, y
  
function reaction1 () {
  var p = 1;                                               // Variable für Zehnerpotenz
  for (var i=0; i<n; i++) p *= 10;                         // 10^n berechnen
  z = inputNumber(ip1,0,p-1);                              // Eingegebene Zahl (eventuell korrigiert)
  y = getArray(z);                                         // Array neu berechnen
  ip1.value = String(z);                                   // Eingabefeld für Dezimalschreibweise anpassen
  ip2.value = toRoman(z);                                  // Eingabefeld für römische Zahlenschreibweise anpassen 
  paint();                                                 // Neu zeichnen   
  ip1.blur();                                              // Fokus abgeben                  
  }
  
// Hilfsroutine: Zahl aus dem unteren Eingabefeld (römische Zahlenschreibweise), Überprüfung, ggf. Korrektur,
// Aktualisierung der beiden Eingabefelder, Grafikausgabe
// Seiteneffekt z, y 
// Unverständliche Zeichenketten werden als 0 interpretiert, Zeichenketten mit viermal vorkommenden Zeichen
// werden durch die übliche Schreibweise ersetzt.
  
function reaction2 () {
  var s = ip2.value;                                       // Zeichenkette mit römischen Zahlzeichen
  s = s.toUpperCase();                                     // Großbuchstaben erzwingen
  s = s.replace("VIIII","IX");                             // "VIIII" durch "IX" ersetzen
  s = s.replace("IIII","IV");                              // "IIII" durch "IV" ersetzen    
  s = s.replace("LXXXX","XC");                             // "LXXXX" durch "XC" ersetzen
  s = s.replace("XXXX","XL");                              // "XXXX" durch "XL" ersetzen
  s = s.replace("DCCCC","CM");                             // "DCCCC" durch "CM" ersetzen
  s = s.replace("CCCC","CD");                              // "CCCC" durch "CD" ersetzen  
  var a = toArabic(s);                                     // Zeichenkette mit arabischen Ziffern (eventuell korrigiert)
  z = Number(a);                                           // Umwandlung in Zahl
  if (z > 5000) z = 5000;                                  // Zahl über 5000 verhindern 
  y = getArray(z);                                         // Array neu berechnen     
  ip1.value = String(z);                                   // Eingabefeld für Dezimalschreibweise anpassen
  ip2.value = toRoman(z);                                  // Eingabefeld für römische Zahlenschreibweise anpassen
  paint();                                                 // Neu zeichnen
  ip2.blur();                                              // Fokus abgeben                          
  }
  
// Reaktion auf Enter-Taste:
// Seiteneffekt z, y
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (!enter) return;                                      // Falls andere Taste, abbrechen
  var a = document.activeElement;                          // Aktives Element
  if (a == ip1) reaction1();                               // Reaktion für 1. Eingabefeld
  if (a == ip2) reaction2();                               // Reaktion für 2. Eingabefeld
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl einer Kugel)                   
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl einer Kugel)
  if (nr != 0) e.preventDefault();                         // Falls Kugel ausgewählt, Standardverhalten verhindern
  }
  
// Reaktion auf Bewegung der Maus:
  
function reactionMouseMove (e) {
  if (nr == 0) return;                                     // Abbrechen, falls keine Kugel ausgewählt
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung eines Fingers:
  
function reactionTouchMove (e) {
  if (nr == 0) return;                                     // Abbrechen, falls keine Kugel ausgewählt
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern       
  }
  
// Reaktion auf Mausklick oder Berühren mit dem Finger:
// (u,v) ... Position bezüglich Zeichenfläche (Pixel)
// Seiteneffekt vM, nr

function reactionDown (u, v) {
  var r = canvas.getBoundingClientRect();                  // Lage der Zeichenfläche bezüglich Viewport
  u -= r.left; v -= r.top;                                 // Koordinaten bezüglich Zeichenfläche
  vM = v;                                                  // Senkrechte Bildschirmkoordinate speichern
  nr = 0;                                                  // Zunächst keine Kugel ausgewählt
  for (var i=0; i<5*n; i++) {                              // Für alle Kugel-Indizes ...
    var uu = (width+(n-1)*DX)/2-Math.floor(i/5)*DX;        // Waagrechte Bildschirmkoordinate 
    var du = u-uu, dv = v-y[i];                            // Koordinatendifferenzen
    var d = Math.sqrt(du*du+dv*dv);                        // Abstand
    if (d <= R) {nr = i+1; break;}                         // Falls Klick auf Kugel, Nummer speichern und for-Schleife abbrechen
    } // Ende for (i)
  paint();                                                 // Neu zeichnen
  }
  
// Hilfsroutine: Kugel(n) von unten zur Trennschiene schieben
// dv ... Verschiebung (negativ)
// Seiteneffekt y
// Voraussetzungen: nr != 0, nr%5 != 0
  
function bottomToSeparator (dv) {
  var vMin = Y_SEP+W+(9-2*(nr%5))*R;                       // Minimum für senkrechte Bildschirmkoordinate
  var vv = y[nr-1]+dv;                                     // Neuer Wert der senkrechten Bildschirmkoordinate
  if (vv < vMin) y[nr-1] = vMin;                           // Falls Wert zu klein, Position an der Trennschiene
  else y[nr-1] += dv;                                      // Sonst Verschiebung durchführen
  var x = 4-nr%5;                                          // Maximale Zahl der mitbewegten Kugeln
  for (var i=1; i<=x; i++) {                               // Für alle mitbewegten Kugeln ...
    if (y[nr-1+i] > y[nr-2+i]-2*R)                         // Falls Verschiebung nötig ...  
      y[nr-1+i] = y[nr-2+i]-2*R;                           // Verschiebung durchführen
    }
  }
  
// Hilfsroutine: Kugel(n) von der Trennschiene nach unten schieben
// dv ... Verschiebung (positiv)
// Seiteneffekt y
// Voraussetzungen: nr != 0, nr%5 != 0
  
function separatorToBottom (dv) {
  var vMax = Y_BOT-(2*(nr%5)-1)*R;                         // Maximum für senkrechte Bildschirmkoordinate
  var vv = y[nr-1]+dv;                                     // Neuer Wert der senkrechten Bildschirmkoordinate
  if (vv > vMax) y[nr-1] = vMax;                           // Falls Wert zu groß, Position am unteren Rand
  else y[nr-1] += dv;                                      // Sonst Verschiebung durchführen
  var x = nr%5-1;                                          // Maximale Zahl der mitbewegten Kugeln
  for (var i=1; i<=x; i++) {                               // Für alle mitbewegten Kugeln ...
    if (y[nr-1-i] < y[nr-i]+2*R)                           // Falls Verschiebung nötig ...
      y[nr-1-i] = y[nr-i]+2*R;                             // Verschiebung durchführen
    }
  }
  
// Hilfsroutine: Kugel von der Trennschiene nach oben schieben
// dv ... Verschiebung (negativ)
// Seiteneffekt y
// Voraussetzungen: nr != 0, nr%5 != 0
  
function separatorToTop (dv) {
  var vMin = Y_TOP+R;                                      // Minimum für senkrechte Bildschirmkoordinate
  var vv = y[nr-1]+dv;                                     // Neuer Wert der senkrechten Bildschirmkoordinate
  if (vv < vMin) y[nr-1] = vMin;                           // Falls Wert zu klein, Position am oberen Rand
  else y[nr-1] += dv;                                      // Sonst Verschiebung durchführen
  }
  
// Hilfsroutine: Kugel von oben zur Trennschiene schieben
// dv ... Verschiebung (positiv)
// Seiteneffekt y
// Voraussetzungen: nr != 0, nr%5 != 0
  
function topToSeparator (dv) {
  var vMax = Y_SEP-W-R;                                    // Maximum für senkrechte Bildschirmkoordinate
  var vv = y[nr-1]+dv;                                     // Neuer Wert der senkrechten Bildschirmkoordinate
  if (vv > vMax) y[nr-1] = vMax;                           // Falls Wert zu groß, Position an der Trennschiene
  else y[nr-1] += dv;                                      // Sonst Verschiebung durchführen
  }

// Reaktion auf Bewegung von Maus oder Finger:
// (u,v) ... Position bezüglich Zeichenfläche (Pixel)
// Seiteneffekt vM, y
  
function reactionMove (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var dv = v-vM;                                           // Senkrechte Verschiebung
  vM = v;                                                  // Senkrechte Bildschirmkoordinate des Mauszeigers speichern
  if (nr%5 != 0 && dv < 0) bottomToSeparator(dv);          // Entweder Kugel(n) von unten zur Trennschiene schieben ...
  if (nr%5 != 0 && dv > 0) separatorToBottom(dv);          // ... oder von der Trennschiene nach unten ...
  if (nr%5 == 0 && dv < 0) separatorToTop(dv);             // ... oder von der Trennschiene nach oben ...
  if (nr%5 == 0 && dv > 0) topToSeparator(dv);             // ... oder von oben zur Trennschiene
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Loslassen der Maustaste oder Ende der Berührung:
// Seiteneffekt z, y, nr; Anpassung der Eingabefelder

function reactionUp () {
  z = getNumber(y);                                        // Zahl entsprechend Kugelpositionen
  ip1.value = String(z);                                   // Eingabefeld Dezimalschreibweise
  y = getArray(z);                                         // Array neu berechnen (wegen ungenauer Kugelpositionen)
  ip2.value = toRoman(z);                                  // Eingabefeld römische Zahlenschreibweise
  nr = 0;                                                  // Keine Kugel ausgewählt
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Eingabe einer ganzen Zahl:
// ef .... Eingabefeld
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Im Normalfall eingegebene Zahl, bei sinnloser Eingabe 0
// Wirkung auf das Eingabefeld
  
function inputNumber (ef, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Komma durch Punkt ersetzen
  var n = Number(s);                                       // Eingegebene Zahl oder NaN
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingabe als 0 interpretieren
  n = Math.round(n);                                       // Auf ganze Zahl runden 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = String(n);                                    // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  } 
  
// Array der waagrechten Bildschirmkoordinaten der Kugeln:
// z ... Natürliche Zahl oder 0

function getArray (z) {
  var a = new Array(5*n);                                  // Neues Array
  for (var i=0; i<n; i++) {                                // Für alle Stellen-Indizes ...
    var d = z%10;                                          // Aktuelle Ziffer
    z = Math.floor(z/10);                                  // Aktuelle Ziffer weglassen
    var d2 = d%5;                                          // Zahl der verschobenen unteren Kugeln
    for (var j=0; j<4; j++) {                              // Für alle Indizes der unteren Kugeln ...
      var k = 5*i+3-j;                                     // Index für Array
      if (j < d2) a[k] = Y_SEP+W+(2*j+1)*R;                // Koordinate für untere Kugel bei Trennschiene
      else a[k] = Y_BOT-(2*(3-j)+1)*R;                     // Koordinate für untere Kugel am unteren Rand
      } // Ende for (j)
    a[5*i+4] = (d >= 5 ? Y_SEP-W-R : Y_TOP+R);             // Koordinate für obere Kugel
    } // Ende for (i)
  return a;                                                // Rückgabewert
  }
  
// Einzelne Ziffer, entsprechend dem Array der senkrechten Bildschirmkoordinaten:
// Das Ergebnis richtet sich nach der Position der oberen Kugel und nach der größten Lücke zwischen benachbarten unteren Kugeln.
// y ... Array mit senkrechten Bildschirmkoordinaten der Kugelmittelpunkte
// i ... Stellen-Index (0 für Einerstelle, 1 für Zehnerstelle, ...)
  
function getDigit (y, i) {
  var z = 4;                                               // Startwert
  var d0 = Y_BOT-y[5*i]-R;                                 // Lücke zwischen unterster Kugel und unterem Rand
  var dMax = d0;                                           // Maximaler Abstand, Startwert
  for (var j=0; j<3; j++) {                                // Für alle Indizes ...
    var d = y[5*i+j]-y[5*i+j+1]-2*R;                       // Lücke zwischen benachbarten Kugeln     
    if (d > dMax) {dMax = d; z = 3-j;}                     // Falls Lücke größer, Variable aktualisieren
    }
  var d4 = y[5*i+3]-Y_SEP-W-R;                             // Lücke zwischen vierter Kugel (von unten) und Trennschiene
  if (d4 > dMax) {dMax = d4; z = 0;}                       // Falls Lücke größer, Variable aktualisieren
  if (y[5*i+4] > (Y_TOP+Y_SEP-W)/2) z += 5;                // Falls oberste Kugel näher an Trennschiene, Zahl 5 addieren
  return z;                                                // Rückgabewert
  } 
  
// Zahl, entsprechend Array
// y ... Array mit senkrechten Bildschirmkoordinaten der Kugelmittelpunkte

function getNumber (y) {
  var z = getDigit(y,n-1);                                 // Startwert: Ziffer ganz links
  for (var i=n-2; i>=0; i--) z = 10*z+getDigit(y,i);       // Weitere Ziffern berücksichtigen
  return z;                                                // Rückgabewert
  }
  
// Hilfsroutine: Zeichenkette aus römischen Zahlzeichen für eine Dezimalstelle
// d ..... Ziffer (0 bis 9)
// s1 .... Zeichen ("I", "X" bzw. "C")
// s5 .... Zeichen ("V", "L" bzw. "D")
// s10 ... Zeichen ("X", "C" bzw. "M")
  
function partRoman (d, s1, s5, s10) {
  var s = "";                                              // Leere Zeichenkette
  if (d == 9) s += s1+s10;                                 // Römische Zahlzeichen für Dezimalziffer 9
  else if (d == 4) s += s1+s5;                             // Römische Zahlzeichen für Dezimalziffer 4
  else {                                                   // Falls Dezimalziffer nicht 4 oder 9 ...
    if (d >= 5) s += s5;                                   // Zeichenkette ergänzen
    var i0 = 5*Math.floor(d/5)+1;                          // Kleinster Index
    for (var i=i0; i<=d; i++) s += s1;                     // Zeichenkette ergänzen
    }
  return s;                                                // Rückgabewert
  }

// Zeichenkette für römische Zahlenschreibweise:
// z ... Gegebene Zahl
  
function toRoman (z) {
  if (z < 0 || z > 5000) return "";                        // Rückgabewert, falls Zahl nicht im erlaubten Bereich
  var s = "";                                              // Zunächst leere Zeichenkette
  var d = Math.floor(z/1000);                              // Tausenderziffer
  for (var i=1; i<=d; i++) s += "M";                       // Symbole entsprechend Tausenderziffer hinzufügen
  z = z%1000;                                              // Tausenderziffer weglassen
  d = Math.floor(z/100);                                   // Hunderterziffer
  s += partRoman(d,"C","D","M");                           // Symbole entsprechend Hunderterziffer hinzufügen
  z = z%100;                                               // Hunderterziffer weglassen
  d = Math.floor(z/10);                                    // Zehnerziffer
  s += partRoman(d,"X","L","C");                           // Symbole entsprechend Zehnerziffer hinzufügen 
  d = z = z%10;                                            // Einerziffer
  s += partRoman(d,"I","V","X");                           // Symbole entsprechend Einerziffer hinzufügen
  return s;                                                // Rückgabewert
  }
  
// Hilfsroutine: Auswertung der römischen Zahlzeichen zu einer Ziffer (0 bis 9)
// s ..... Gegebene Zeichenkette (römische Zahl)
// s1 .... Zeichen "C", "X" bzw. "I"
// s5 .... Zeichen "D", "L" bzw. "V"
// s10 ... Zeichen "M", "C" bzw. "X"
// Rückgabewert: Verbund mit den Attributen string (restliche Zeichenkette) und digit (aktuelle Ziffer)
  
function partArabic (s, s1, s5, s10) {
  var d = 0;                                               // Startwert Ziffer
  if (s.startsWith(s1+s10)) {                              // Falls "CM", "XC" bzw. "IX" am Anfang ...
    d = 9;                                                 // Ziffer 9 
    s = s.substring(2);                                    // Restliche Zeichenkette
    }
  else if (s.startsWith(s1+s5)) {                          // Falls "CD", "XL" bzw. "IV" am Anfang ...
    d = 4;                                                 // Ziffer 4
    s = s.substring(2);                                    // Restliche Zeichenkette
    }
  else if (s.startsWith(s5)) {                             // Falls "D", "L" bzw. "V" am Anfang ...
    d = 5;                                                 // Ziffer 5 (vorläufig) 
    s = s.substring(1);                                    // Restliche Zeichenkette
    for (var i=1; i<=3; i++) {                             // Wiederhole dreimal ...
      if (s.startsWith(s1)) {d++; s = s.substring(1);}     // Symbole s1 berücksichtigen
      }
    }
  else {                                                   // Sonst ...
    for (var i=1; i<=3; i++) {                             // Wiederhole dreimal ...
      if (s.startsWith(s1)) {d++; s = s.substring(1);}     // Symbole s1 berücksichtigen
      }
    }
  return {string: s, digit: d};                            // Rückgabewert
  }
  
// Umwandlung von römischer in arabische Zahlenschreibweise:
// r ... Zeichenkette der römischen Zahlzeichen
// Rückgabewert: Zeichenkette der arabischen Zahlzeichen
  
function toArabic (r) {
  var z = 0;                                               // Startwert Zahl
  while (r.startsWith("M")) {                              // Solange "M" am Anfang ...
    r = r.substring(1);                                    // "M" weglassen
    z += 1000;                                             // Zahl um 1000 erhöhen
    }
  var c = partArabic(r,"C","D","M");                       // Hilfsroutine aufrufen: Verbund für Hunderterziffer
  r = c.string; z += 100*c.digit;                          // Rest der Zeichenkette, Zahl um Vielfaches von 100 erhöhen
  c = partArabic(r,"X","L","C");                           // Hilfsroutine aufrufen: Verbund für Zehnerziffer
  r = c.string; z += 10*c.digit;                           // Rest der Zeichenkette, Zahl um Vielfaches von 10 erhöhen
  c = partArabic(r,"I","V","X");                           // Hilfsroutine aufrufen: Verbund für Einerziffer
  if (c.string != "") return "0";                          // Falls Zeichenkette noch nicht zu Ende, Rückgabewert "0"  
  z += c.digit;                                            // Zahl um Einerziffer erhöhen
  return String(z);                                        // Rückgabewert
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)
// w ... Linienbreite (optional, Defaultwert 1)

function newPath (c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie:
// (x1,y1) ... 1. Punkt
// (x2,y2) ... 2. Punkt
  
function line (x1, y1, x2, y2) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x1,y1);                                       // Start beim 1. Punkt
  ctx.lineTo(x2,y2);                                       // Linie zum 2. Punkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Ausgefüllter Kreis mit schwarzem Rand:
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... Füllfarbe
  
function circle (x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefüllter Kreis mit schwarzem Rand
  }
  
// Abakus:
// z ... Aktuelle Zahl (natürlich oder 0)
  
function abacus (z) {    
  newPath();                                               // Neuer Grafikpfad (Standardwerte)  
  var uL = (width-n*DX)/2-W;                               // Waagrechte Bildschirmkoordinate für Rahmen links innen
  var uLL = uL-2*W;                                        // Waagrechte Bildschirmkoordinate für Rahmen links außen
  var uR = (width+n*DX)/2+W;                               // Waagrechte Bildschirmkoordinate für Rahmen rechts innen
  var uRR = uR+2*W;                                        // Waagrechte Bildschirmkoordinate für Rahmen rechts außen
  var vBB = Y_BOT+2*W;                                     // Senkrechte Bildschirmkoordinate für Rahmen unten außen
  var vTT = Y_TOP-2*W;                                     // Senkrechte Bildschirmkoordinate für Rahmen oben außen
  ctx.moveTo(uLL,vBB);                                     // Startpunkt für äußeres Rechteck (links unten)
  ctx.lineTo(uRR,vBB);                                     // Linie für äußeres Rechteck (nach rechts)
  ctx.lineTo(uRR,vTT);                                     // Linie für äußeres Rechteck (nach oben)
  ctx.lineTo(uLL,vTT);                                     // Linie für äußeres Rechteck (nach links)
  ctx.lineTo(uLL,vBB);                                     // Linie für äußeres Rechteck (nach unten)
  ctx.moveTo(uR,Y_BOT);                                    // Neuer Startpunkt für unteres inneres Rechteck (rechts unten)
  ctx.lineTo(uL,Y_BOT);                                    // Linie für unteres inneres Rechteck (nach links)
  ctx.lineTo(uL,Y_SEP+W);                                  // Linie für unteres inners Rechteck (nach oben)
  ctx.lineTo(uR,Y_SEP+W);                                  // Linie für unteres inneres Rechteck (nach rechts)
  ctx.lineTo(uR,Y_BOT);                                    // Linie für unteres inneres Rechteck (nach unten)
  ctx.moveTo(uR,Y_SEP-W);                                  // Neuer Startpunkt für oberes inneres Rechteck (rechts unten)
  ctx.lineTo(uL,Y_SEP-W);                                  // Linie für oberes inneres Rechteck (nach links)
  ctx.lineTo(uL,Y_TOP);                                    // Linie für oberes inneres Rechteck (nach oben)
  ctx.lineTo(uR,Y_TOP);                                    // Linie für oberes inneres Rechteck (nach rechts)
  ctx.lineTo(uR,Y_SEP-W);                                  // Linie für oberes inneres Rechteck (nach unten)
  ctx.fillStyle = color0;                                  // Farbe für Rahmen
  ctx.fill(); ctx.stroke();                                // Rahmen mit Rand                
  var xR = (width+(n-1)*DX)/2;                             // Waagrechte Bildschirmkoordinate für Einerstelle
  for (var i=0; i<n; i++) {                                // Für alle Stellen-Indizes ...
    var x = xR-i*DX;                                       // Waagrechte Bildschirmkoordinate
    line(x,Y_BOT,x,Y_SEP+W);                               // Unterer Draht    
    line(x,Y_TOP,x,Y_SEP-W);                               // Oberer Draht
    for (var j=0; j<4; j++) circle(x,y[5*i+j],R,color1);   // Untere Kugeln
    circle(x,y[5*i+4],R,color2);                           // Obere Kugel
    } 
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (i=0; i<n; i++) {                                    // Für alle Stellen-Indizes ...
    var d = z%10;                                          // Aktuelle Ziffer
    z = Math.floor(z/10);                                  // Aktuelle Ziffer weglassen
    ctx.fillText(String(d),xR-i*DX,370);                   // Aktuelle Ziffer ausgeben
    }
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  abacus(z);                                               // Abakus
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen
